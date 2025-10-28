'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Download, Loader2, ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { transcribeAudioToText } from '@/ai/flows/transcribe-audio-to-text';
import { generateStructuredBlogPost } from '@/ai/flows/generate-structured-blog-post';
import { useUser, useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { blobToBase64 } from '@/lib/utils';
import { AudioVisualizer } from './audio-visualizer';

type RecorderState = 'idle' | 'recording' | 'recorded' | 'creating';

export function AudioRecorder() {
  const [recorderState, setRecorderState] = useState<RecorderState>('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  // Timer effect
  useEffect(() => {
    if (recorderState === 'recording') {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [recorderState]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  const handleStartRecording = async () => {
    setRecorderState('recording');
    setElapsedTime(0);
    audioChunksRef.current = [];

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);
            setRecorderState('recorded');
            stream.getTracks().forEach(track => track.stop()); // Stop the mic access
        };
        mediaRecorderRef.current.start();
    } catch (err) {
        console.error("Error accessing microphone:", err);
        toast({
            variant: 'destructive',
            title: 'Microphone Error',
            description: 'Could not access the microphone. Please check permissions.',
        });
        setRecorderState('idle');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleCreateArticle = async () => {
    if (!audioUrl || !user || !firestore) return;
    setRecorderState('creating');

    let newArticleRef;
    try {
      // 1. Create a placeholder document in Firestore
      const articlesCollection = collection(firestore, `users/${user.uid}/blogPosts`);
      newArticleRef = await addDoc(articlesCollection, {
        userId: user.uid,
        title: "Generating your new article...",
        content: "",
        status: "processing",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      toast({
        title: "Article Creation Started",
        description: "Your article is being generated. You will be redirected shortly.",
      });

      // Redirect to dashboard immediately
      router.push('/dashboard');

      // 2. Start the AI generation process (non-blocking)
      const audioBlob = await fetch(audioUrl).then(res => res.blob());
      const audioDataUri = await blobToBase64(audioBlob);
      
      const transcriptionResult = await transcribeAudioToText({ audioDataUri });
      const transcribedText = transcriptionResult.transcription;

      if (!transcribedText) {
        throw new Error("Transcription failed. The audio might be silent or unclear.");
      }

      const blogPostResult = await generateStructuredBlogPost({ transcribedText });
      const structuredBlogPost = blogPostResult.structuredBlogPost;

      const lines = structuredBlogPost.split('\n');
      const title = lines[0].replace(/^#\s*/, '').trim() || "Untitled Article";
      const content = lines.slice(1).join('\n').trim();

      await updateDoc(newArticleRef, {
        title: title,
        content: content,
        status: "completed",
        updatedAt: serverTimestamp(),
      });

    } catch (err: any) {
      console.error("Error during article creation:", err);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: err.message || 'Could not create the article.',
      });
      setRecorderState('recorded');

      // Update doc to show failure if it was created
      if (newArticleRef) {
        await updateDoc(newArticleRef, {
          status: "failed",
          title: "Article Generation Failed",
          content: err.message || 'An unknown error occurred during generation.',
          updatedAt: serverTimestamp(),
        });
      }
    }
  };
  
  const handleReset = () => {
    setRecorderState('idle');
    setElapsedTime(0);
    setAudioUrl(null);
    audioChunksRef.current = [];
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
  };

  if (recorderState === 'idle' || recorderState === 'recording') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Record Your Thoughts</span>
            {recorderState === 'recording' && (
              <span className="text-lg font-mono text-red-500 animate-pulse">{formatTime(elapsedTime)}</span>
            )}
          </CardTitle>
          <CardDescription>
            {recorderState === 'recording' ? "Click the square to stop recording" : "Click the mic to start recording. Your subscription determines the maximum recording time."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-6 p-10">
          <Button onClick={recorderState === 'recording' ? handleStopRecording : handleStartRecording} size="icon" className="w-20 h-20 rounded-full">
            {recorderState === 'recording' ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
          </Button>
          <AudioVisualizer stream={streamRef.current} isRecording={recorderState === 'recording'} />
        </CardContent>
      </Card>
    );
  }

  if (recorderState === 'recorded' || recorderState === 'creating') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Review and Create</CardTitle>
            <CardDescription>Review your audio and choose an AI model to generate your article.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {audioUrl && (
                <audio ref={audioRef} src={audioUrl} controls className="w-full" />
            )}
             <div>
                <label className="text-sm font-medium mb-2 block">Choose an AI model</label>
                <Select defaultValue="default">
                    <SelectTrigger>
                        <SelectValue placeholder="Select an AI model" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">AudioScribe AI default</SelectItem>
                        <SelectItem value="personal" disabled>Your Personal AI Model (Coming Soon)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
                 <Button onClick={handleCreateArticle} className="w-full" disabled={recorderState === 'creating'}>
                    {recorderState === 'creating' ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Article...
                        </>
                    ) : (
                        'Create article'
                    )}
                </Button>
                <Button variant="outline" className="w-full" onClick={handleReset}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Record Again
                </Button>
                <Button variant="outline" className="w-full" asChild>
                    <a href={audioUrl || '#'} download={`recording-${new Date().toISOString()}.wav`}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </a>
                </Button>
            </div>
        </CardContent>
      </Card>
    )
  }

  return null;
}
