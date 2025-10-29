'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Check, Bot, Sparkles, Plus, Loader2, Wand2, ArrowLeft, UploadCloud, FileAudio, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp, query, where } from 'firebase/firestore';
import { trainAiModelWithWritingSamples } from '@/ai/flows/train-ai-model-with-writing-samples';
import type { AiModel, UserSubscription } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDropzone } from 'react-dropzone';
import { blobToBase64 } from '@/lib/utils';
import { transcribeAudioToText } from '@/ai/flows/transcribe-audio-to-text';

const modelFormSchema = z.object({
  name: z.string().min(3, 'Model name must be at least 3 characters.'),
  description: z.string().optional(),
  sample1: z.string().optional(),
  sample2: z.string().optional(),
  sample3: z.string().optional(),
  audioSamples: z.array(z.instanceof(File)).max(3).optional(),
}).refine(data => {
    const textSamples = [data.sample1, data.sample2, data.sample3].filter(s => s && s.length >= 100).length;
    const audioSamples = data.audioSamples?.length || 0;
    return (textSamples + audioSamples) >= 3;
}, {
    message: "Please provide at least 3 total samples (text or audio). Text samples must be at least 100 characters.",
    path: ['sample1'], // You can associate the error with a specific field if you want
});


type ModelFormValues = z.infer<typeof modelFormSchema>;

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

function AudioSampleUploader({ field }: { field: any }) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            const currentFiles = field.value || [];
            const newFiles = [...currentFiles, ...acceptedFiles].slice(0, 3);
            field.onChange(newFiles);
        },
        accept: { 'audio/*': ['.mp3', '.wav', '.m4a', '.flac', '.ogg'] },
        maxFiles: 3,
    });

    const removeFile = (index: number) => {
        const currentFiles = field.value || [];
        const newFiles = currentFiles.filter((_: any, i: number) => i !== index);
        field.onChange(newFiles);
    };

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                }`}
            >
                <input {...getInputProps()} />
                <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground text-sm">
                {isDragActive ? 'Drop the files here...' : "Drag 'n' drop up to 3 audio samples, or click to select"}
                </p>
            </div>
            {field.value && field.value.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium">Uploaded Files:</p>
                    {field.value.map((file: File, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                            <div className="flex items-center gap-3 truncate">
                                <FileAudio className="h-5 w-5 shrink-0" />
                                <span className="truncate text-sm">{file.name}</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


function CreateModelForm({ onModelCreated, onBack }: { onModelCreated: () => void, onBack: () => void }) {
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
      audioSamples: [],
    },
  });

  async function onSubmit(data: ModelFormValues) {
    if (!user || !firestore) return;
    setIsCreating(true);

    try {
        const textSamples = [data.sample1, data.sample2, data.sample3].filter(s => s && s.length >= 100);
        
        const audioTranscriptions = [];
        if (data.audioSamples && data.audioSamples.length > 0) {
            toast({ title: 'Transcribing audio samples...', description: 'This may take a moment.' });
            for (const audioFile of data.audioSamples) {
                const audioDataUri = await blobToBase64(audioFile);
                const result = await transcribeAudioToText({ audioDataUri });
                audioTranscriptions.push(result.transcription);
            }
        }

        const allWritingSamples = [...textSamples, ...audioTranscriptions];

        if (allWritingSamples.length < 3) {
            throw new Error("Insufficient samples. Please provide at least 3 valid text or audio samples.");
        }
        
        toast({ title: 'Training AI model...', description: 'Analyzing your writing style.' });
        const trainingResult = await trainAiModelWithWritingSamples({ writingSamples: allWritingSamples });

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
        console.error(error);
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
             <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Create a New AI Model</CardTitle>
                    <CardDescription>Provide at least 3 writing samples (text or audio) for the AI to learn your style.</CardDescription>
                </div>
                <Button variant="outline" onClick={onBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Models
                </Button>
            </div>
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
                    
                    <Tabs defaultValue="text">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="text">Text Samples</TabsTrigger>
                            <TabsTrigger value="audio">Audio Samples</TabsTrigger>
                        </TabsList>
                        <TabsContent value="text" className="pt-4">
                             <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="sample1"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Writing Sample 1</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Paste a blog post, article, or newsletter you've written... (min 100 chars)" {...field} rows={6} />
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
                                                <Textarea placeholder="Paste another sample... (min 100 chars)" {...field} rows={6} />
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
                                                <Textarea placeholder="And one more... (min 100 chars)" {...field} rows={6} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                             </div>
                        </TabsContent>
                        <TabsContent value="audio" className="pt-4">
                            <FormField
                                control={form.control}
                                name="audioSamples"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <AudioSampleUploader field={field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </TabsContent>
                    </Tabs>
                    
                    {form.formState.errors.sample1 && (
                         <p className="text-sm font-medium text-destructive">{form.formState.errors.sample1.message}</p>
                    )}

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
                <CreateModelForm onModelCreated={() => setShowForm(false)} onBack={() => setShowForm(false)}/>
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

function UpsellView({ isTrial }: { isTrial: boolean }) {
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
                        You are currently on the {isTrial ? 'Pro trial' : 'Free'} plan. Upgrade to a paid plan to train personalized AI models and generate content that perfectly matches your unique style and tone.
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
    const { user } = useUser();
    const firestore = useFirestore();

    const subscriptionQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(
            collection(firestore, `users/${user.uid}/subscriptions`),
            where('status', 'in', ['active', 'on_trial'])
        );
    }, [firestore, user]);

    const { data: subscriptions, isLoading } = useCollection<UserSubscription>(subscriptionQuery);

    if (isLoading) {
        return <p>Loading subscription status...</p>
    }

    const activeSubscription = subscriptions?.[0];
    const isPaid = activeSubscription && activeSubscription.status === 'active';
    const isTrial = activeSubscription && activeSubscription.status === 'on_trial';

    return (
        <div className="max-w-6xl mx-auto">
            {isPaid ? <SubscribedView /> : <UpsellView isTrial={isTrial} />}
        </div>
    );
}
