'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Download, Loader2, ArrowLeft } from 'lucide-react';
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
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type RecorderState = 'idle' | 'recording' | 'recorded' | 'creating';

export function AudioRecorder() {
  const [recorderState, setRecorderState] = useState<RecorderState>('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  const handleCreateArticle = async () => {
    if (!audioUrl || !user) return;
    setRecorderState('creating');

    try {
      const audioBlob = await fetch(audioUrl).then(res => res.blob());
      const audioDataUri = await blobToBase64(audioBlob);

      // 1. Create a placeholder document in Firestore
      const articlesCollection = collection(firestore, `users/${user.uid}/blogPosts`);
      const newArticleRef = await addDocumentNonBlocking(articlesCollection, {
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

      // 2. Start the AI generation process (non-blocking)
      (async () => {
        try {
          const transcriptionResult = await transcribeAudioToText({ audioDataUri });
          const transcribedText = transcriptionResult.transcription;

          if (!transcribedText) {
            throw new Error("Transcription failed.");
          }

          const blogPostResult = await generateStructuredBlogPost({ transcribedText });
          const structuredBlogPost = blogPostResult.structuredBlogPost;

          // Extract title (first line) and content
          const lines = structuredBlogPost.split('\n');
          const title = lines[0].replace(/^#\s*/, '');
          const content = lines.slice(1).join('\n').trim();

          // Update the document in Firestore
          await updateDoc(newArticleRef, {
            title: title,
            content: content,
            status: "completed",
            updatedAt: serverTimestamp(),
          });

        } catch (aiError) {
          console.error("AI generation failed:", aiError);
          // Update doc to show failure
          await updateDoc(newArticleRef, {
            status: "failed",
            title: "Article Generation Failed",
            updatedAt: serverTimestamp(),
          });
        }
      })();

      // 3. Redirect to dashboard immediately
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);

    } catch (err: any) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: err.message || 'Could not start article creation.',
      });
      setRecorderState('recorded');
    }
  };
  
  const handleReset = () => {
    setRecorderState('idle');
    setElapsedTime(0);
    setAudioUrl(null);
    audioChunksRef.current = [];
    if(mediaRecorderRef.current && mediaRecorderRef.current.stream){
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  if (recorderState === 'idle' || recorderState === 'recording') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Record Your Thoughts</span>
            {recorderState === 'recording' && (
              <span className="text-lg font-mono text-red-500 animate-pulse">{formatTime(elapsedTime)}</span>
            )}
          </CardTitle>
          <CardDescription>
            {recorderState === 'recording' ? "Click the square to stop recording" : "Click the mic to start recording"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-6 p-10">
          <Button onClick={recorderState === 'recording' ? handleStopRecording : handleStartRecording} size="icon" className="w-20 h-20 rounded-full">
            {recorderState === 'recording' ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
          </Button>
          <div className="w-full h-16 bg-secondary rounded-lg flex items-center justify-center">
            {/* We can add a cool visualizer here later */}
            <p className="text-muted-foreground text-sm">Recording time: max 5 minutes</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recorderState === 'recorded' || recorderState === 'creating') {
    return (
      <Card>
        <CardHeader>
            <Button variant="ghost" size="sm" className="w-fit p-0 h-auto mb-2" onClick={handleReset}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Recording
            </Button>
            <CardTitle>Your Recording</CardTitle>
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
            <div className="space-y-2">
                 <Button onClick={handleCreateArticle} className="w-full" disabled={recorderState === 'creating'}>
                    {recorderState === 'creating' ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Scheduling Creation...
                        </>
                    ) : (
                        'Create article'
                    )}
                </Button>
                <Button variant="outline" className="w-full" asChild>
                    <a href={audioUrl || '#'} download={`recording-${new Date().toISOString()}.wav`}>
                        <Download className="mr-2 h-4 w-4" />
                        Download audio
                    </a>
                </Button>
            </div>
        </CardContent>
      </Card>
    )
  }

  return null;
}
