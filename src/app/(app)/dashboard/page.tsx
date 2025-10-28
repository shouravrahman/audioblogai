'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Wand2, Upload, Menu } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/');
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
        <Logo />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={user.photoURL || undefined} alt={user.email || ''} />
                <AvatarFallback>
                  {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-2 border-blue-500 bg-blue-500/10">
              <CardHeader className="flex flex-row items-center gap-4">
                <Wand2 className="h-6 w-6 text-blue-400" />
                <CardTitle>Free trial active</CardTitle>
              </CardHeader>
              <CardContent>
                <p>You can create 3 articles for free! Enjoy!</p>
                <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">Subscribe to create more</Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
                 <Button className="w-full">Record a new article</Button>
                 <Button variant="secondary" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload audio file
                 </Button>
            </div>

            <div>
              <Input type="search" placeholder="Search by title..." className="mb-4" />
              <div className="text-center text-muted-foreground py-8">
                <p>No articles found.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Create your first AI model</CardTitle>
                <CardDescription>Get better results when recording articles! You can teach the AI to write like you by training it on your content!</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">Try it out!</p>
                <Button variant="outline" asChild>
                  <Link href="#">Go to AI models</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Your usage</CardTitle>
                <CardDescription>You are on the free trial</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                    <p className="font-medium">Recordings</p>
                    <p className="text-sm text-muted-foreground mb-2">0 / 3 recorded articles this month.</p>
                    <Progress value={0} />
                </div>
                <div>
                    <p className="font-medium">Personalized AI Models</p>
                    <p className="text-sm text-muted-foreground">0 / 0 in total (0 / 0 created this month)</p>
                     <p className="text-xs text-muted-foreground mt-1">Personalized AI models are not available on free trial</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
