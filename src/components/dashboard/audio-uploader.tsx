'use client';

import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileAudio, Loader2, Download, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { blobToBase64 } from '@/lib/utils';
import type { AiModel } from '@/lib/types';
import { createArticle } from '@/app/actions';

type UploaderState = 'idle' | 'uploaded' | 'creating';

export function AudioUploader() {
  const [uploaderState, setUploaderState] = useState<UploaderState>('idle');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('default');
  const audioRef = useRef<HTMLAudioElement>(null);

  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const modelsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/aiModels`);
  }, [firestore, user]);

  const { data: aiModels } = useCollection<AiModel>(modelsQuery);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setUploaderState('uploaded');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.flac', '.ogg']
    },
    maxFiles: 1,
  });

  const handleCreateArticle = async () => {
    if (!audioFile || !user || !firestore) return;
    setUploaderState('creating');

    try {
      const articlesCollection = collection(firestore, `users/${user.uid}/blogPosts`);
      const newArticleRef = await addDoc(articlesCollection, {
        userId: user.uid,
        title: "Preparing your article...",
        content: "",
        status: "processing",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      const audioDataUri = await blobToBase64(audioFile);

      await createArticle({
        articleId: newArticleRef.id,
        userId: user.uid,
        audioDataUri,
        selectedModel,
      });

      toast({
        title: "Article generation started!",
        description: "Your article is being created in the background. You'll see it on your dashboard.",
      });

      router.push('/dashboard');

    } catch (err: any) {
      console.error("Error triggering article creation:", err);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: err.message || 'Could not start the article creation process.',
      });
      setUploaderState('uploaded');
    }
  };

  const handleReset = () => {
    setUploaderState('idle');
    setAudioFile(null);
    setAudioUrl(null);
  };

  if (uploaderState === 'idle') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Upload an Audio File</CardTitle>
          <CardDescription>Upload an existing audio file to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              {isDragActive ? 'Drop the file here...' : 'Drag & drop an audio file here, or click to select a file'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">MP3, WAV, M4A, FLAC, OGG</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (uploaderState === 'uploaded' || uploaderState === 'creating') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Review and Create</CardTitle>
          <CardDescription>Review your audio and choose an AI model to generate your article.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {audioFile && (
            <div className="flex items-center justify-between p-3 bg-secondary rounded-md">
              <div className="flex items-center gap-3 truncate">
                <FileAudio className="h-6 w-6 shrink-0" />
                <div className='truncate'>
                  <p className="font-medium truncate">{audioFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleReset} disabled={uploaderState === 'creating'}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}
          {audioUrl && (
            <audio ref={audioRef} src={audioUrl} controls className="w-full" />
          )}
          <div>
            <label className="text-sm font-medium mb-2 block">Choose an AI model</label>
            <Select defaultValue="default" onValueChange={setSelectedModel} disabled={uploaderState === 'creating'}>
              <SelectTrigger>
                <SelectValue placeholder="Select an AI model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">AudioScribe AI default</SelectItem>
                {aiModels && aiModels.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                        {model.name}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleCreateArticle} className="w-full" disabled={uploaderState === 'creating'}>
              {uploaderState === 'creating' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending to background...
                </>
              ) : (
                'Create article'
              )}
            </Button>
            <Button variant="outline" className="w-full" asChild disabled={uploaderState === 'creating'}>
              <a href={audioUrl || '#'} download={audioFile?.name}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
             <Button variant="outline" className="w-full" onClick={handleReset} disabled={uploaderState === 'creating'}>
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
