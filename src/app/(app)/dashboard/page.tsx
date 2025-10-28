'use client';

import { useUser, useCollection, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Wand2, Upload, Mic, BookOpen, PlusCircle, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { BlogPost } from '@/lib/types';


function ArticleCard({ article }: { article: BlogPost & { id: string } }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/articles/${article.id}`);
  };

  return (
    <Card 
      className="flex flex-col cursor-pointer hover:border-primary transition-colors"
      onClick={handleClick}
    >
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          {article.status === 'processing' ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <FileText className="h-5 w-5" />
          )}
          <span className="truncate">{article.title || 'Untitled Article'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        {article.status === 'processing' ? (
          <>
            <p className="text-sm text-muted-foreground">Generating your article...</p>
            <Progress value={50} className="w-full" />
          </>
        ) : (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {article.content
              ? article.content.substring(0, 100) + '...'
              : 'No content yet.'}
          </p>
        )}
      </CardContent>
    </Card>
  );
}


export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const articlesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/blogPosts`);
  }, [firestore, user]);

  const { data: articles, isLoading: articlesLoading } = useCollection<BlogPost>(articlesQuery);

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, {user.displayName || user.email}!
        </h1>
        <p className="text-muted-foreground">Here's your personal dashboard.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Column 1: Get Started */}
        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>Create your next masterpiece.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/dashboard/new-article">
                  <Mic className="mr-2 h-5 w-5" />
                  Record a new article
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="#">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload an audio file
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Column 2: Your Articles */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Your Articles</CardTitle>
              <CardDescription>
                Review and manage your generated content.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              {articlesLoading && <p>Loading articles...</p>}
              {!articlesLoading && articles && articles.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                 <div className="flex-1 flex flex-col items-center justify-center text-center h-full">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg">No articles yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Start recording to see your articles here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
