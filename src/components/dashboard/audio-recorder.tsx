'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Pause, Square, Download, Loader2, RotateCcw, Play, AlertTriangle } from 'lucide-react';
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
import { AudioVisualizer } from './audio-visualizer';
import type { AiModel } from '@/lib/types';
import { createArticle } from '@/app/actions';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { languages } from '@/lib/data';

type RecorderState = 'idle' | 'recording' | 'paused' | 'recorded' | 'creating';

export function AudioRecorder() {
  const [recorderState, setRecorderState] = useState<RecorderState>('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [selectedModel, setSelectedModel] = useState('default');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  // Check for microphone permission on mount
  useEffect(() => {
    async function checkMicPermission() {
      try {
        // A more robust check for microphone existence
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasAudioInput = devices.some(device => device.kind === 'audioinput');
        
        if (!hasAudioInput) {
            setHasMicPermission(false);
            return;
        }

        // Then check for permission
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (permissionStatus.state === 'granted') {
          setHasMicPermission(true);
        } else if (permissionStatus.state === 'prompt') {
          setHasMicPermission(true); // Will ask when needed
        } else {
          setHasMicPermission(false);
        }

        permissionStatus.onchange = () => {
            setHasMicPermission(permissionStatus.state === 'granted' || permissionStatus.state === 'prompt');
        };
      } catch (error) {
        // This might fail if the browser doesn't support the permissions API
        setHasMicPermission(false);
        console.error("Error checking microphone permissions:", error);
      }
    }
    checkMicPermission();
  }, []);

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
    audioChunksRef.current = [];

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        setHasMicPermission(true); // Permission granted
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
    } catch (err: any) {
        console.error("Error accessing microphone:", err);
        setHasMicPermission(false);
        toast({
            variant: 'destructive',
            title: 'Microphone Error',
            description: `Could not access the microphone. Please check permissions. Error: ${err.message}`,
        });
        setRecorderState('idle');
    }
  };

  const handlePauseRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.pause();
        setRecorderState('paused');
    }
  }

  const handleResumeRecording = () => {
    if (mediaRecorderRef.current?.state === 'paused') {
        mediaRecorderRef.current.resume();
        setRecorderState('recording');
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecorderState('recorded');
    }
  };

  const handleCreateArticle = async () => {
    if (!audioUrl || !user || !firestore) return;
    setRecorderState('creating');

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

      const audioBlob = await fetch(audioUrl).then(res => res.blob());
      const audioDataUri = await blobToBase64(audioBlob);

      await createArticle({
        articleId: newArticleRef.id,
        userId: user.uid,
        audioDataUri,
        selectedModel,
        language: selectedLanguage,
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
      setRecorderState('recorded'); // Revert state on failure
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

  const NoMicAccessView = () => (
    <>
      <CardHeader>
        <CardTitle>Microphone Access Required</CardTitle>
        <CardDescription>We can't seem to find a microphone.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-6 p-10">
        <Button disabled size="icon" className="w-20 h-20 rounded-full">
            <Mic className="h-8 w-8" />
        </Button>
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No Microphone Detected</AlertTitle>
            <AlertDescription>
                Please connect a microphone and ensure you've granted permission in your browser and operating system settings, then refresh the page.
            </AlertDescription>
        </Alert>
      </CardContent>
    </>
  );

  return (
    <Card className="max-w-2xl mx-auto">
      {hasMicPermission === false && <NoMicAccessView />}
      
      {hasMicPermission && recorderState === 'idle' && (
         <>
          <CardHeader>
            <CardTitle>Record Your Thoughts</CardTitle>
            <CardDescription>Select your language, then click the mic to start recording.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-6 p-10">
             <div className="w-full max-w-xs">
              <label className="text-sm font-medium mb-2 block text-center">Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
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
            <Button onClick={handleStartRecording} size="icon" className="w-20 h-20 rounded-full" disabled={hasMicPermission === false || !selectedLanguage}>
              <Mic className="h-8 w-8" />
            </Button>
            <div className="h-16 w-full bg-secondary rounded-lg" />
          </CardContent>
        </>
      )}

      {hasMicPermission && (recorderState === 'recording' || recorderState === 'paused') && (
        <>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {recorderState === 'recording' ? 'Recording...' : 'Paused'}
                </span>
                <span className="text-lg font-mono text-red-500">{formatTime(elapsedTime)}</span>
              </CardTitle>
              <CardDescription>
                {recorderState === 'recording' ? 'Click pause or stop when you are done.' : 'Resume recording or finish.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-6 p-10">
                <div className="flex items-center gap-4">
                    {recorderState === 'recording' ? (
                        <Button onClick={handlePauseRecording} size="icon" variant="outline" className="w-16 h-16 rounded-full">
                            <Pause className="h-7 w-7" />
                        </Button>
                    ) : (
                        <Button onClick={handleResumeRecording} size="icon" variant="outline" className="w-16 h-16 rounded-full">
                            <Play className="h-7 w-7" />
                        </Button>
                    )}
                    <Button onClick={handleStopRecording} size="icon" className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600">
                        <Square className="h-8 w-8" />
                    </Button>
                </div>
                <AudioVisualizer stream={streamRef.current} isRecording={recorderState === 'recording'} />
            </CardContent>
        </>
      )}

      {hasMicPermission && (recorderState === 'recorded' || recorderState === 'creating') && (
        <>
            <CardHeader>
                <CardTitle>Review and Create</CardTitle>
                <CardDescription>Review your audio and choose an AI model to generate your article.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {audioUrl && (
                    <audio ref={audioRef} src={audioUrl} controls className="w-full" />
                )}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Language</label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
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
                      <Select defaultValue="default" onValueChange={setSelectedModel}>
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
        </>
      )}
    </Card>
  );
}
