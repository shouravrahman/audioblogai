'use client';

import { useDoc, useMemoFirebase, useUser } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { doc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import type { BlogPost } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ArticlePage() {
  const { articleId } = useParams();
  const { user } = useUser();
  const firestore = useFirestore();

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
