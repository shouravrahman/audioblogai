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

  if (!user) {
    // This will be handled by the layout, but as a fallback
    return null;
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, {user.displayName || user.email}!
        </h1>
        <p className="text-muted-foreground">Here's your personal dashboard.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Create & Manage */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>Create your next masterpiece.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center gap-4">
              <Button asChild size="lg" className="w-full">
                <Link href="/new-article">
                    <Mic className="mr-2" />
                    Record a new article
                </Link>
              </Button>
              <Button variant="secondary" size="lg" className="w-full">
                <Upload className="mr-2" />
                Upload an audio file
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column: Articles & AI Models */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Your Articles</CardTitle>
              <CardDescription>
                Review and manage your generated content.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold">No articles yet</h3>
              <p className="text-sm text-muted-foreground">
                Start recording to see your articles here.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Usage & AI Models */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="border-2 border-blue-500 bg-blue-500/10">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-blue-400" />
                <span>Free Trial Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">Recordings</p>
                <p className="text-sm text-muted-foreground mb-2">
                  0 / 3 recorded articles this month.
                </p>
                <Progress value={0} />
              </div>
              <Button
                size="sm"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Subscribe to Unlock More
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personalized AI</CardTitle>
              <CardDescription>
                Train the AI to write in your unique style.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <PlusCircle className="mr-2" />
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
