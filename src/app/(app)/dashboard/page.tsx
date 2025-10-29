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
import { Upload, Mic, BookOpen, Loader2, Gem, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useFirestore } from '@/firebase';
import { collection, query, orderBy, where, getCountFromServer } from 'firebase/firestore';
import type { BlogPost, UserSubscription } from '@/lib/types';
import { useEffect, useState } from 'react';
import { pricingPlans } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function ArticleCard({ article }: { article: BlogPost & { id: string } }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/articles/${article.id}`);
  };
  
  const articlePlaceholder = PlaceHolderImages.find(p => p.id === 'demo-video-thumbnail');

  const getStatusContent = () => {
    switch (article.status) {
      case 'processing':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p className="text-sm font-semibold">Generating your article...</p>
          </div>
        );
      case 'failed':
        return (
           <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
            <p className="text-sm font-semibold text-destructive">Generation Failed</p>
            <p className="text-xs text-destructive/80">Click to see details.</p>
          </div>
        );
      case 'completed':
      default:
        return (
          <Image 
            src={article.coverImageUrl || articlePlaceholder?.imageUrl || ''} 
            alt={article.title} 
            fill 
            className="object-cover transition-transform group-hover:scale-105"
            data-ai-hint="blog post cover"
          />
        );
    }
  }

  return (
    <Card 
      className="flex flex-col cursor-pointer hover:border-primary transition-colors group overflow-hidden"
      onClick={handleClick}
    >
      <CardHeader className="relative aspect-video p-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
        {getStatusContent()}
         <CardTitle className="absolute bottom-0 left-0 p-4 text-lg text-white z-20">
          <span className="line-clamp-2">{article.title || 'Untitled Article'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-1">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {article.status === 'completed' 
              ? (article.content ? new DOMParser().parseFromString(article.content, "text/html").body.textContent?.substring(0, 120) + '...' : 'No content yet.')
              : 'Content is being generated...'}
          </p>
      </CardContent>
    </Card>
  );
}

function UsageCard() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [usage, setUsage] = useState({ articles: 0, models: 0 });
    const [usageLoading, setUsageLoading] = useState(true);

    const subscriptionQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(
          collection(firestore, `users/${user.uid}/subscriptions`),
          where('status', 'in', ['active', 'on_trial'])
        );
      }, [firestore, user]);
    
    const { data: subscriptions, isLoading: isSubscriptionLoading } = useCollection<UserSubscription>(subscriptionQuery);
    const activeSubscription = subscriptions?.[0];

    useEffect(() => {
        if (!user || !firestore) return;
        
        const fetchUsage = async () => {
            setUsageLoading(true);
            try {
                const articlesCollection = collection(firestore, `users/${user.uid}/blogPosts`);
                const modelsCollection = collection(firestore, `users/${user.uid}/aiModels`);
                
                const articlesSnapshot = await getCountFromServer(articlesCollection);
                const modelsSnapshot = await getCountFromServer(modelsCollection);
                
                setUsage({
                  articles: articlesSnapshot.data().count,
                  models: modelsSnapshot.data().count
                });

            } catch (error) {
                console.error("Error fetching usage data:", error);
            } finally {
                setUsageLoading(false);
            }
        };
        fetchUsage();
    }, [user, firestore]);

    if (usageLoading || isSubscriptionLoading) {
      return (
        <Card>
            <CardHeader>
              <CardTitle>Your usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div>
                  <Skeleton className="h-4 w-1/4 mb-2" />
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-3 w-3/4 mt-2" />
               </div>
                <div>
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-3 w-3/4 mt-2" />
               </div>
            </CardContent>
        </Card>
      )
    }

    const currentPlan = pricingPlans.find(p => p.variantIdMonthly === activeSubscription?.planId.toString() || p.variantIdYearly === activeSubscription?.planId.toString()) || pricingPlans[0];
    const articleLimit = currentPlan.features.find(f => f.includes('article'))?.split(' ')[0] || 3;
    const modelLimit = currentPlan.features.find(f => f.includes('personalized AI model'))?.split(' ')[0] || 0;

    return (
        <Card>
            <CardHeader>
              <CardTitle>Your usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div>
                <p className="text-sm font-semibold">Recordings</p>
                <Progress value={(usage.articles / Number(articleLimit)) * 100} className="my-2" />
                <p className="text-sm text-muted-foreground">{usage.articles}/{articleLimit} articles created this month.</p>
              </div>
               <div>
                <p className="text-sm font-semibold">Personalized AI Models</p>
                <Progress value={(usage.models / Number(modelLimit)) * 100} className="my-2" />
                <p className="text-sm text-muted-foreground">{usage.models}/{modelLimit} models created.</p>
                {currentPlan.name === 'Free' && (
                    <p className="text-xs text-muted-foreground mt-1">Personalized AI models are not available on the free plan.</p>
                 )}
                 {activeSubscription?.status === 'on_trial' && currentPlan.name !== 'Free' && (
                    <p className="text-xs text-muted-foreground mt-1">Personalized AI models are not available on free trial.</p>
                 )}
              </div>
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
    return query(collection(firestore, `users/${user.uid}/blogPosts`), orderBy('createdAt', 'desc'));
  }, [firestore, user]);

  const { data: articles, isLoading: articlesLoading } = useCollection<BlogPost>(articlesQuery);

  if (!user) {
    return null;
  }

  const { data: subscriptions } = useCollection<UserSubscription>(
    useMemoFirebase(() => {
      if (!user) return null;
      return query(
        collection(firestore, `users/${user.uid}/subscriptions`),
        where('status', 'in', ['active', 'on_trial'])
      );
    }, [firestore, user])
  );
  const isFreeTier = !subscriptions || subscriptions.length === 0 || subscriptions[0].name === 'Free';


  return (
    <div className="container mx-auto p-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, {user.displayName || user.email}!
        </h1>
        <p className="text-muted-foreground">Here's your personal dashboard.</p>
      </div>

      {isFreeTier && (
        <Card className="mb-8 border-primary/50 bg-secondary/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Gem className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">
                    {subscriptions?.[0]?.status === 'on_trial' ? 'Pro Trial Active' : 'You are on the Free Plan'}
                  </h3>
                </div>
                <p className="text-muted-foreground">You can create up to 3 articles for free. Upgrade to unlock more features and higher limits.</p>
              </div>
              <Button asChild>
                <Link href="/dashboard/subscription">Subscribe to Pro</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}


      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
        {/* Column 1: Get Started & Usage */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>Create your next masterpiece.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button asChild size="lg">
                <Link href="/dashboard/new-article">
                  <Mic className="mr-2 h-5 w-5" />
                  Record an article
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/dashboard/new-article?upload=true">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload an audio file
                </Link>
              </Button>
            </CardContent>
          </Card>
           <UsageCard />
        </div>

        {/* Column 2 & 3: Your Articles */}
        <div className="space-y-6 md:col-span-2">
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
              ) : !articlesLoading && (
                 <div className="flex-1 flex flex-col items-center justify-center text-center h-full py-12 border-2 border-dashed rounded-lg">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg">No articles yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Start by recording or uploading an audio file.
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
