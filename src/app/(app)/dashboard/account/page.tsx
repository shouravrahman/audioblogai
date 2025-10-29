
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
import { collection, query, where } from 'firebase/firestore';
import type { UserSubscription } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

export default function AccountPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const subscriptionQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, `users/${user.uid}/subscriptions`),
      where('status', 'in', ['active', 'on_trial'])
    );
  }, [firestore, user]);

  const { data: subscriptions, isLoading: isSubscriptionLoading } = useCollection<UserSubscription>(subscriptionQuery);
  const activeSubscription = subscriptions?.[0];

  if (!user) {
    return null;
  }

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
                  <Button variant="outline" asChild>
                     <Link href="#">Manage billing</Link>
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
        
        {/* Usage Card */}
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Your usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div>
                <p className="text-sm font-semibold">Recordings</p>
                <Progress value={33} className="my-2" />
                <p className="text-sm text-muted-foreground">1/3 recorded articles this month.</p>
              </div>
               <div>
                <p className="text-sm font-semibold">Personalized AI Models</p>
                <Progress value={0} className="my-2" />
                <p className="text-sm text-muted-foreground">0/0 in total (0/0 created this month)</p>
                <p className="text-xs text-muted-foreground mt-1">Personalized AI models are not available on free trial</p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
