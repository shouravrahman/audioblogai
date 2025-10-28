'use client';

import { useDoc, useMemoFirebase, useUser } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { doc } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import type { BlogPost } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ArticlePage() {
  const { articleId } = useParams();
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const articleRef = useMemoFirebase(() => {
    if (!user || !articleId) return null;
    return doc(firestore, `users/${user.uid}/blogPosts`, articleId as string);
  }, [firestore, user, articleId]);

  const {
    data: article,
    isLoading,
    error,
  } = useDoc<BlogPost>(articleRef);

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
                            <pre className="text-xs bg-black/20 p-2 rounded-md overflow-x-auto">
                                {article.content || 'No specific error message available.'}
                            </pre>
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
       <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{article.title}</h1>
        {article.createdAt && (
            <p className="text-muted-foreground mt-2">
                Published on {new Date(article.createdAt).toLocaleDateString()}
            </p>
        )}
      </div>

      <article className="prose prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }} />
      </article>
    </div>
  );
}
