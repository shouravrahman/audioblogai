'use client';

export const runtime = 'edge';

import { useDoc, useMemoFirebase, useUser } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { doc, updateDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import type { BlogPost } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info, Save, Copy, FileDown, Trash2, Search, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRef, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import TurndownService from 'turndown';
import { researchAndExpandArticleAction, analyzeSeoAction } from '@/app/actions';
import type { AnalyzeSeoOutput } from '@/ai/flows/analyze-seo';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function ArticlePage() {
  const { articleId } = useParams();
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const contentRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [isAnalyzingSeo, setIsAnalyzingSeo] = useState(false);
  const [seoResults, setSeoResults] = useState<AnalyzeSeoOutput | null>(null);
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
    setData: setArticle, // from useDoc
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

  const handleDelete = async () => {
    if (!articleRef) return;
    setIsDeleting(true);
    try {
      await deleteDoc(articleRef);
      toast({
        title: 'Article Deleted',
        description: 'The article has been successfully deleted.',
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description: error.message || 'Could not delete the article.',
      });
       setIsDeleting(false);
    }
  }
  
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

  const handleResearch = async () => {
    if (!article || !contentRef.current) return;
    setIsResearching(true);
    toast({ title: 'Starting Research...', description: 'The AI is searching for data to enrich your article.' });
    try {
        const currentContent = contentRef.current.innerText;
        const result = await researchAndExpandArticleAction({ articleContent: currentContent });
        
        if (contentRef.current) {
            contentRef.current.innerHTML = result.enrichedArticle.replace(/\n/g, '<br />');
        }

        // We update the local state to reflect the change immediately
        setArticle(prev => prev ? { ...prev, content: result.enrichedArticle } : null);

        toast({ title: 'Research Complete!', description: 'Your article has been updated with new information.' });
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Research Failed', description: e.message || 'Could not perform research.' });
    } finally {
        setIsResearching(false);
    }
  }

  const handleSeoAnalysis = async () => {
      if (!article || !contentRef.current) return;
      setIsAnalyzingSeo(true);
      toast({ title: 'Analyzing SEO...', description: 'The AI is reviewing your article for SEO improvements.' });
      try {
          const currentContent = contentRef.current.innerText;
          const result = await analyzeSeoAction({ title: article.title, content: currentContent });
          setSeoResults(result);
      } catch (e: any) {
          toast({ variant: 'destructive', title: 'SEO Analysis Failed', description: e.message || 'Could not perform SEO analysis.' });
      } finally {
          setIsAnalyzingSeo(false);
      }
  }


  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-12 w-3/4" />
         <Skeleton className="h-64 w-full rounded-xl" />
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
                                {article.content}
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
                        <Loader2 className="h-5 w-5 text-primary animate-spin" />
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
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
             <AlertDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <FileDown className="mr-2 h-4 w-4" />
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleResearch} disabled={isResearching}>
                        {isResearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Search className="mr-2 h-4 w-4"/>}
                        Enrich with Research
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSeoAnalysis} disabled={isAnalyzingSeo}>
                        {isAnalyzingSeo ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Zap className="mr-2 h-4 w-4"/>}
                        Analyze SEO
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleExport('text')}>Copy as Plain Text</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('html')}>Copy as HTML</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('markdown')}>Copy as Markdown</DropdownMenuItem>
                    <DropdownMenuSeparator />
                     <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4"/>
                            Delete Article
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
                 <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        article and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Yes, delete article"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
            </AlertDialog>
         </div>
      </div>
      
      {article.coverImageUrl && (
        <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-8 shadow-lg">
            <Image 
                src={article.coverImageUrl}
                alt={article.title}
                fill
                className="object-cover"
                data-ai-hint="blog post cover"
            />
        </div>
      )}

      <article className="prose dark:prose-invert max-w-none">
        <div
            ref={contentRef}
            contentEditable={true}
            suppressContentEditableWarning={true}
            className="p-4 rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary min-h-[200px]"
            dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }} 
        />
      </article>

      <Dialog open={!!seoResults} onOpenChange={(open) => !open && setSeoResults(null)}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
            <DialogTitle>SEO Analysis Results</DialogTitle>
            <DialogDescription>
                Here are the AI-powered suggestions to improve your article's search engine optimization.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
                <div>
                    <h3 className="font-semibold mb-2">Alternative Titles</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        {seoResults?.suggestedTitles.map((title, i) => <li key={i}>{title}</li>)}
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold mb-2">Meta Description</h3>
                    <p className="text-sm text-muted-foreground p-3 bg-secondary rounded-md">{seoResults?.metaDescription}</p>
                </div>
                 <div>
                    <h3 className="font-semibold mb-2">Suggested Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                        {seoResults?.keywords.map((keyword, i) => (
                           <span key={i} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">{keyword}</span>
                        ))}
                    </div>
                </div>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
