'use client';

import { useDoc, useMemoFirebase, useUser } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import type { BlogPost } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info, Save, Copy, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRef, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import TurndownService from 'turndown';


export default function ArticlePage() {
  const { articleId } = useParams();
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const contentRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [turndownService, setTurndownService] = useState<TurndownService | null>(null);

  useEffect(() => {
    // TurndownService needs to be initialized on the client
    const loadTurndown = async () => {
      const Turndown = (await import('turndown')).default;
      setTurndownService(new Turndown());
    };
    loadTurndown();
  }, []);


  const articleRef = useMemoFirebase(() => {
    if (!user || !articleId) return null;
    return doc(firestore, `users/${user.uid}/blogPosts`, articleId as string);
  }, [firestore, user, articleId]);

  const {
    data: article,
    isLoading,
    error,
  } = useDoc<BlogPost>(articleRef);
  
  const handleSave = async () => {
    if (!articleRef || !contentRef.current) return;
    setIsSaving(true);
    try {
      const newContent = contentRef.current.innerHTML;
      await updateDoc(articleRef, {
        content: newContent,
        updatedAt: serverTimestamp(),
      });
      toast({
        title: 'Article Saved!',
        description: 'Your changes have been successfully saved.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not save your changes.',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleExport = (format: 'html' | 'text' | 'markdown') => {
    if (!contentRef.current) return;

    let contentToCopy = '';
    const htmlContent = contentRef.current.innerHTML;

    switch (format) {
      case 'html':
        contentToCopy = htmlContent;
        break;
      case 'text':
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        contentToCopy = tempDiv.textContent || tempDiv.innerText || '';
        break;
      case 'markdown':
        if (turndownService) {
          contentToCopy = turndownService.turndown(htmlContent);
        } else {
            toast({ variant: 'destructive', title: 'Error', description: 'Markdown converter is not ready yet.'});
            return;
        }
        break;
    }

    navigator.clipboard.writeText(contentToCopy).then(() => {
      toast({ title: 'Copied to Clipboard!', description: `Article content copied as ${format.toUpperCase()}.` });
    }).catch(err => {
      toast({ variant: 'destructive', title: 'Copy Failed', description: 'Could not copy content to clipboard.' });
    });
  };


  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-12 w-3/4" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive">Error: {error.message}</p>;
  }

  if (!article) {
    return <p>Article not found.</p>;
  }
  
  if (article.status === 'failed') {
      return (
          <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight text-destructive">Generation Failed</h1>
                <p className="text-muted-foreground mt-2">
                    There was an error while generating this article.
                </p>
              </div>
              <Card>
                <CardContent className='p-6'>
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error Details</AlertTitle>
                        <AlertDescription>
                            <p className="mb-4">The AI generation process failed. This can happen for a variety of reasons, including issues with the uploaded audio or a problem with the AI service.</p>
                             <p className="text-xs bg-black/20 p-2 rounded-md overflow-x-auto">
                                The AI generation process failed. This can happen due to an invalid API key, network issues, or problems with the underlying AI service. Please verify your setup and try again.
                            </p>
                        </AlertDescription>
                    </Alert>
                    <div className="mt-6 flex gap-2">
                        <Button onClick={() => router.push('/dashboard/new-article')}>Try Again</Button>
                        <Button variant="outline" onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
                    </div>
                </CardContent>
              </Card>

          </div>
      )
  }
  
  if (article.status === 'processing') {
      return (
          <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight">Generating Article...</h1>
                <p className="text-muted-foreground mt-2">
                    Your article is currently being generated. This page will update automatically.
                </p>
              </div>
               <Card>
                <CardContent className='p-6'>
                    <div className="flex items-center justify-center space-x-2">
                        <Info className="h-5 w-5 text-primary" />
                        <p>Please wait a few moments. You can safely leave this page and come back later.</p>
                    </div>
                </CardContent>
              </Card>
          </div>
      )
  }

  return (
    <div className="max-w-4xl mx-auto">
       <div className="mb-8 flex justify-between items-center">
         <div>
            <h1 className="text-4xl font-bold tracking-tight">{article.title}</h1>
            {article.createdAt && (
                <p className="text-muted-foreground mt-2">
                    Published on {new Date(article.createdAt).toLocaleDateString()}
                </p>
            )}
         </div>
         <div className="flex gap-2">
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <FileDown className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('text')}>Copy as Plain Text</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('html')}>Copy as HTML</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('markdown')}>Copy as Markdown</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </div>

      <article className="prose prose-invert max-w-none">
        <div
            ref={contentRef}
            contentEditable={true}
            suppressContentEditableWarning={true}
            className="p-4 rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }} 
        />
      </article>
    </div>
  );
}
