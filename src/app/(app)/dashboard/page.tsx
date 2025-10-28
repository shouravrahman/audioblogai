'use client';

import { useUser } from '@/firebase';
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
import { Wand2, Upload, Mic, BookOpen, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();

  // This is a fallback. The layout should handle redirecting unauthenticated users.
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
        {/* Column 1: Get Started & Your Articles */}
        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>Create your next masterpiece.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/new-article">
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
        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Your Articles</CardTitle>
              <CardDescription>
                Review and manage your generated content.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg">No articles yet</h3>
              <p className="text-sm text-muted-foreground">
                Start recording to see your articles here.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Column 3: Usage & AI Models */}
        <div className="space-y-6">
           <Card className="border-2 border-primary/50 bg-primary/5">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wand2 className="h-5 w-5 text-primary" />
                <span>Free Trial Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">Recordings</p>
                <p className="text-sm text-muted-foreground mb-2">
                  0 / 3 recorded articles this month.
                </p>
                <Progress value={0} aria-label="0 out of 3 articles recorded" />
              </div>
              <Button size="sm" className="w-full">
                Subscribe to Unlock More
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personalized AI</CardTitle>
              <CardDescription>
                Train the AI to write in your unique style.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <PlusCircle className="mr-2 h-5 w-5" />
                Create your first AI model
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Not available on the free trial.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
