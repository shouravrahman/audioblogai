'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Trash2, BrainCircuit, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { transcribeAudioToText } from '@/ai/flows/transcribe-audio-to-text';
import { generateStructuredBlogPost } from '@/ai/flows/generate-structured-blog-post';
import { Skeleton } from '../ui/skeleton';

export function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [blogPost, setBlogPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
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
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setElapsedTime(0);
    setTranscription('');
    setBlogPost('');
    setError(null);
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    setIsLoading(true);
    setError(null);

    try {
      // Fake audio data URI for demonstration
      const fakeAudioDataUri = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
      
      const transcriptionResult = await transcribeAudioToText({
        audioDataUri: fakeAudioDataUri,
      });

      setTranscription(transcriptionResult.transcription || 'Could not transcribe audio.');
      
      if(transcriptionResult.transcription) {
        const blogPostResult = await generateStructuredBlogPost({
          transcribedText: transcriptionResult.transcription,
        });
        setBlogPost(blogPostResult.structuredBlogPost);
      }

    } catch (err: any) {
      setError(err.message || 'An error occurred during processing.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setIsRecording(false);
    setElapsedTime(0);
    setTranscription('');
    setBlogPost('');
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Record Your Thoughts</span>
            <div className="flex items-center gap-4">
              {isRecording && (
                <span className="text-lg font-mono text-red-500 animate-pulse">{formatTime(elapsedTime)}</span>
              )}
              {!isRecording && elapsedTime > 0 && (
                <Button variant="outline" size="icon" onClick={handleReset} aria-label="Clear recording">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button onClick={isRecording ? handleStopRecording : handleStartRecording} size="icon" disabled={isLoading}>
                {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-24 bg-secondary rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">
              {isRecording ? "Click the square to stop recording" : "Click the mic to start recording"}
            </p>
          </div>
        </CardContent>
      </Card>

      {(isLoading || transcription || blogPost || error) && (
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5" />
                <span>Raw Transcription</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && !transcription ? (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                <Textarea
                  value={transcription}
                  readOnly
                  placeholder="Your transcribed text will appear here..."
                  className="h-48 resize-none"
                />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span>AI-Generated Blog Post</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && !blogPost ? (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
              ) : (
                <Textarea
                  value={blogPost}
                  readOnly
                  placeholder="Your structured blog post will appear here..."
                  className="h-48 resize-none"
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}
       {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
}
