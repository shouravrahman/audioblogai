'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';
import type { UserSubscription, AiModel, BlogPost } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { pricingPlans } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

export default function AccountPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const [usage, setUsage] = useState({ articles: 0, models: 0 });
  const [usageLoading, setUsageLoading] = useState(true);

  // Memoized query for the user's active subscription
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
    if (!user || !firestore || !activeSubscription) {
      setUsageLoading(false);
      return;
    };

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
  }, [user, firestore, activeSubscription]);


  if (!user) {
    return null;
  }
  
  const currentPlan = pricingPlans.find(p => p.variantIdMonthly === activeSubscription?.planId.toString() || p.variantIdYearly === activeSubscription?.planId.toString()) || pricingPlans[0];
  const articleLimit = currentPlan.features.find(f => f.includes('article'))?.split(' ')[0] || 3;
  const modelLimit = currentPlan.features.find(f => f.includes('personalized AI model'))?.split(' ')[0] || 0;


  const getPlanName = () => {
    if (isSubscriptionLoading) return 'Loading...';
    if (activeSubscription) {
      return (
        <>
          {activeSubscription.name} plan{' '}
          <Badge variant={activeSubscription.status === 'on_trial' ? 'secondary' : 'default'} className="ml-2">
            {activeSubscription.status.replace('_', ' ')}
          </Badge>
        </>
      );
    }
    return 'Free plan';
  };

  const UsageCard = () => {
     if (usageLoading || isSubscriptionLoading) {
      return (
         <Card className="h-full">
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

    return (
       <Card className="h-full">
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
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
       <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Account</h1>
        <p className="text-muted-foreground">
          Manage your account, subscription, and usage details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Account & Subscription Card */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Your account</h3>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                     <AvatarImage
                        src={user.photoURL || undefined}
                        alt={user.email || 'User Avatar'}
                      />
                      <AvatarFallback>
                        {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{user.displayName || 'User'}</p>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold mb-2">Subscription</h3>
                <p className="text-muted-foreground mb-4">
                  You are currently on the{' '}
                  <span className="font-semibold text-primary">{getPlanName()}</span>
                </p>
                <div className="flex gap-2">
                  <Button asChild>
                    <Link href="/dashboard/subscription">Update subscription</Link>
                  </Button>
                  <Button variant="outline" asChild disabled={!activeSubscription?.customerPortalUrl}>
                     <Link href={activeSubscription?.customerPortalUrl || '#'} target="_blank">Manage billing</Link>
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
        
        {/* Usage Card */}
        <div className="md:col-span-1">
          <UsageCard />
        </div>

      </div>
    </div>
  );
}
