'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Check, Bot, Sparkles, Plus, Loader2, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { trainAiModelWithWritingSamples } from '@/ai/flows/train-ai-model-with-writing-samples';
import type { AiModel } from '@/lib/types';

const modelFormSchema = z.object({
  name: z.string().min(3, 'Model name must be at least 3 characters.'),
  description: z.string().optional(),
  sample1: z.string().min(100, 'Please provide at least 100 characters for the writing sample.'),
  sample2: z.string().min(100, 'Please provide at least 100 characters for the writing sample.'),
  sample3: z.string().min(100, 'Please provide at least 100 characters for the writing sample.'),
});

type ModelFormValues = z.infer<typeof modelFormSchema>;

// Mock subscription status
const isSubscribed = true; 

function AiModelCard({ model }: { model: AiModel & { id: string } }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wand2 />
                    {model.name}
                </CardTitle>
                <CardDescription>{model.description || 'No description provided.'}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground">
                    Created on {new Date(model.createdAt).toLocaleDateString()}
                </p>
            </CardContent>
        </Card>
    );
}

function CreateModelForm({ onModelCreated }: { onModelCreated: () => void }) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<ModelFormValues>({
    resolver: zodResolver(modelFormSchema),
    defaultValues: {
      name: '',
      description: '',
      sample1: '',
      sample2: '',
      sample3: '',
    },
  });

  async function onSubmit(data: ModelFormValues) {
    if (!user || !firestore) return;
    setIsCreating(true);

    try {
        const writingSamples = [data.sample1, data.sample2, data.sample3];
        const trainingResult = await trainAiModelWithWritingSamples({ writingSamples });

        const modelsCollection = collection(firestore, `users/${user.uid}/aiModels`);
        await addDoc(modelsCollection, {
            userId: user.uid,
            name: data.name,
            description: data.description,
            trainingData: trainingResult.analysis, // Store the analysis
            createdAt: serverTimestamp(),
        });

        toast({
            title: 'AI Model Created!',
            description: 'Your new personalized model is ready to use.',
        });
        onModelCreated();
        form.reset();

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: error.message || 'Could not create the AI model.',
        });
    } finally {
        setIsCreating(false);
    }
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Create a New AI Model</CardTitle>
            <CardDescription>Provide at least 3 writing samples for the AI to learn your style. The more text, the better the results.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Model Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., 'My Professional Voice'" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., 'For formal blog posts'" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <FormField
                        control={form.control}
                        name="sample1"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Writing Sample 1</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Paste a blog post, article, or newsletter you've written..." {...field} rows={6} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="sample2"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Writing Sample 2</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Paste another sample..." {...field} rows={6} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="sample3"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Writing Sample 3</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="And one more..." {...field} rows={6} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isCreating}>
                        {isCreating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Creating Model...</> : <><Plus className="mr-2 h-4 w-4"/>Create Model</>}
                    </Button>
                </form>
            </Form>
        </CardContent>
    </Card>
  )
}


function SubscribedView() {
    const [showForm, setShowForm] = useState(false);
    const { user } = useUser();
    const firestore = useFirestore();

    const modelsQuery = useMemoFirebase(() => {
        if (!user) return null;
        return collection(firestore, `users/${user.uid}/aiModels`);
    }, [firestore, user]);

    const { data: models, isLoading } = useCollection<AiModel>(modelsQuery);

    return (
        <div>
             <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Your Personalized AI Models</h1>
                    <p className="text-muted-foreground">
                        Manage your custom writing styles to generate content that sounds just like you.
                    </p>
                </div>
                {!showForm && (
                     <Button onClick={() => setShowForm(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Model
                    </Button>
                )}
            </div>

            {showForm ? (
                <CreateModelForm onModelCreated={() => setShowForm(false)} />
            ) : (
                <>
                    {isLoading && <p>Loading models...</p>}
                    {!isLoading && (!models || models.length === 0) ? (
                         <div className="text-center py-16 border-2 border-dashed rounded-lg">
                            <Bot className="h-16 w-16 text-muted-foreground/50 mx-auto" />
                            <h3 className="mt-4 text-xl font-semibold">No AI Models Created Yet</h3>
                            <p className="mt-2 text-muted-foreground">Click 'Create New Model' to train your first personalized AI.</p>
                       </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {models?.map(model => (
                                <AiModelCard key={model.id} model={model} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

function UpsellView() {
    return (
        <div>
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

export default function AiModelsPage() {
  return (
    <div className="max-w-6xl mx-auto">
        {isSubscribed ? <SubscribedView /> : <UpsellView />}
    </div>
  );
}
