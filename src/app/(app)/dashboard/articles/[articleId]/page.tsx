'use client';

import { useDoc, useMemoFirebase } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { doc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import type { BlogPost } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ArticlePage() {
  const { articleId } = useParams();
  const firestore = useFirestore();

  const articleRef = useMemoFirebase(() => {
    if (!articleId) return null;
    // This path will need to be updated once user auth is in place.
    // For now, it assumes a top-level 'blogPosts' collection.
    // The correct path will be `users/${userId}/blogPosts/${articleId}`
    return doc(firestore, 'blogPosts', articleId as string);
  }, [firestore, articleId]);

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

  return (
    <div className="max-w-4xl mx-auto">
       <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{article.title}</h1>
        <p className="text-muted-foreground mt-2">
          Published on {new Date(article.createdAt).toLocaleDateString()}
        </p>
      </div>

      <article className="prose prose-invert max-w-none">
        <p>{article.content}</p>
      </article>
    </div>
  );
}
