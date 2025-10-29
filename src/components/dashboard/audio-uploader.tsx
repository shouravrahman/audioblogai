'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
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
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { addDoc, collection, serverTimestamp, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { blobToBase64 } from '@/lib/utils';
import type { AiModel } from '@/lib/types';
import { createArticle } from '@/app/actions';
import { languages } from '@/lib/data';

type UploaderState = 'idle' | 'uploaded' | 'creating';

export function AudioUploader() {
  const [uploaderState, setUploaderState] = useState<UploaderState>('idle');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('default');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [blogType, setBlogType] = useState('standard');
  const [wordCount, setWordCount] = useState('500');
  const audioRef = useRef<HTMLAudioElement>(null);

  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const preferencesRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'userPreferences', user.uid);
  }, [firestore, user]);

  const { data: savedPreferences } = useDoc(preferencesRef);

  useEffect(() => {
    if (savedPreferences?.language) {
      setSelectedLanguage(savedPreferences.language);
    } else {
      setSelectedLanguage('en-US'); // Default if no preferences are set
    }
  }, [savedPreferences]);

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
        language: selectedLanguage,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      const audioDataUri = await blobToBase64(audioFile);

      await createArticle({
        articleId: newArticleRef.id,
        userId: user.uid,
        audioDataUri,
        selectedModel,
        language: selectedLanguage,
        blogType,
        wordCount,
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
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
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
          <CardDescription>Review your audio and choose a language and AI model to generate your article.</CardDescription>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage} disabled={uploaderState === 'creating'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">AI Model</label>
              <Select defaultValue="default" onValueChange={setSelectedModel} disabled={uploaderState === 'creating'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an AI model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">AudioScribe default</SelectItem>
                  {aiModels && aiModels.map(model => (
                      <SelectItem key={model.id} value={model.id}>
                          {model.name}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Blog Post Type</label>
              <Select value={blogType} onValueChange={setBlogType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select post type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Article</SelectItem>
                  <SelectItem value="listicle">Listicle</SelectItem>
                  <SelectItem value="how-to">How-To Guide</SelectItem>
                  <SelectItem value="thought-leadership">Thought Leadership</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Word Count</label>
              <Select value={wordCount} onValueChange={setWordCount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select word count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="300">Short (~300 words)</SelectItem>
                  <SelectItem value="500">Medium (~500 words)</SelectItem>
                  <SelectItem value="1000">Long (~1000 words)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleCreateArticle} className="w-full" disabled={uploaderState === 'creating' || !selectedLanguage}>
              {uploaderState === 'creating' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending to background...
                </>
              ) : (
                'Create article'
              )}
            </Button>
             <Button variant="outline" className="w-full" onClick={handleReset} disabled={uploaderState === 'creating'}>
                <Trash2 className="mr-2 h-4 w-4" />
                Choose a different file
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
