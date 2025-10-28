
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Check, Bot, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AiModelsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Personalized AI Models</h1>
        <p className="text-muted-foreground">
          Train the AI on your writing style to create content that sounds just like you.
        </p>
      </div>
      
      <Card className="bg-primary/10 border-primary/50">
        <CardHeader>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-full">
                    <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Unlock Your Unique Writing Voice</CardTitle>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <p className="text-muted-foreground">
                You are currently on the free-trial plan. Upgrade to a paid plan to train personalized AI models and generate content that perfectly matches your unique style and tone.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span>Train the AI with your blog posts, articles, or newsletters.</span>
                </div>
                <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span>Generate new content that automatically adopts your voice.</span>
                </div>
                 <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span>Create multiple models for different writing styles (e.g., professional vs. casual).</span>
                </div>
                 <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span>Ensure brand consistency across all your written content.</span>
                </div>
            </div>
            <div className="pt-4">
                <Button asChild size="lg">
                    <Link href="/dashboard/subscription">Upgrade to Unlock Personalized AI</Link>
                </Button>
            </div>
        </CardContent>
      </Card>
      
       <div className="mt-12 text-center">
            <Bot className="h-16 w-16 text-muted-foreground/50 mx-auto" />
            <h3 className="mt-4 text-xl font-semibold">Your AI Models will appear here</h3>
            <p className="mt-2 text-muted-foreground">Once you upgrade and create your first personalized model, you'll be able to manage it from this page.</p>
       </div>

    </div>
  );
}
