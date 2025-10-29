'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useEffect } from 'react';
import { languages } from '@/lib/data';

const preferencesFormSchema = z.object({
  language: z.string().min(1, 'Please select a default language.'),
  titleTone: z.string().min(1, 'Please select a title tone.'),
  specialChars: z.string().min(1, 'Please select a preference.'),
  headingCasing: z.string().min(1, 'Please select a casing style.'),
  headingFrequency: z.string().min(1, 'Please select a frequency.'),
  titleEmoji: z.string().min(1, 'Please select an emoji preference.'),
  bodyEmoji: z.string().min(1, 'Please select an emoji preference.'),
  postBodyTone: z.string().min(1, 'Please select a post body tone.'),
});

type PreferencesFormValues = z.infer<typeof preferencesFormSchema>;

export default function PreferencesPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const preferencesRef = useMemoFirebase(() => {
    if (!user) return null;
    // Use the user's UID as the document ID for their preferences
    return doc(firestore, 'userPreferences', user.uid);
  }, [firestore, user]);

  const { data: savedPreferences, isLoading: preferencesLoading } = useDoc<PreferencesFormValues>(preferencesRef);

  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: {
      language: 'en-US',
      titleTone: '',
      specialChars: '',
      headingCasing: '',
      headingFrequency: '',
      titleEmoji: '',
      bodyEmoji: '',
      postBodyTone: '',
    },
  });

  useEffect(() => {
    if (savedPreferences) {
      form.reset(savedPreferences);
    }
  }, [savedPreferences, form]);

  async function onSubmit(data: PreferencesFormValues) {
    if (!preferencesRef) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to save preferences.',
      });
      return;
    }

    try {
      await setDoc(preferencesRef, {
        ...data,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      toast({
        title: 'Preferences Saved',
        description: 'Your default writing preferences have been updated.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not save preferences.',
      });
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Default Writing Preferences</h1>
        <p className="text-muted-foreground">
          Configure your default writing preferences for blog post generation.
          These settings will be used when generating posts with the default AI
          model or{' '}
          <Link href="/dashboard/ai-models" className="underline text-primary">
            custom models
          </Link>{' '}
          that don&apos;t have their own preferences configured.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Language Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Language</h3>
                 <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Language</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={preferencesLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languages.map(lang => (
                             <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                       <p className="text-xs text-muted-foreground">
                          This will be your default language for transcription and generation.
                        </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Writing Style Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Writing Style</h3>
                <FormField
                  control={form.control}
                  name="titleTone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tone of the title</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={preferencesLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select title tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="playful">Playful</SelectItem>
                          <SelectItem value="inspirational">Inspirational</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Heading Preferences Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Heading Preferences
                </h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="specialChars"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special characters in headings</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={preferencesLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select special characters preference" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="allow">Allow</SelectItem>
                            <SelectItem value="remove">Remove</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Headings will be kept simple like "Day 1 Arrival", "The
                          Benefits And Challenges"
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="headingCasing"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heading casing style</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={preferencesLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select heading casing" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="title">Title Case</SelectItem>
                            <SelectItem value="sentence">Sentence case</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="headingFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heading frequency</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={preferencesLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select heading frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Emoji Usage Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Emoji Usage</h3>
                 <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="titleEmoji"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emoji usage in titles</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={preferencesLoading}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select title emoji usage" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="allow">Allow</SelectItem>
                              <SelectItem value="remove">Do not use</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bodyEmoji"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emoji usage in article body</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={preferencesLoading}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select body emoji usage" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="allow">Use emojis</SelectItem>
                              <SelectItem value="remove">Do not use emojis</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                 </div>
              </div>
              
              {/* Post Body Style Section */}
              <div>
                 <h3 className="text-xl font-semibold mb-4">Post Body Style</h3>
                  <FormField
                    control={form.control}
                    name="postBodyTone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tone and style of the article body</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={preferencesLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select post body tone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="conversational">Conversational</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                             <SelectItem value="humorous">Humorous</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

            </CardContent>
          </Card>
          
           <div className="flex justify-start">
             <Button type="submit" disabled={form.formState.isSubmitting || preferencesLoading}>
              {form.formState.isSubmitting ? 'Saving...' : 'Save Default Preferences'}
             </Button>
          </div>
        </form>
      </Form>

      <Card className="mt-12 bg-secondary/50">
        <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">How it works</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>These preferences apply to all blog posts generated with the default AI model</li>
                <li>Custom AI models can have their own specific preferences that override these defaults</li>
                <li>When creating new custom AI models, they will initially inherit these default settings</li>
                <li>You can configure model-specific preferences from the <Link href="/dashboard/ai-models" className="underline text-primary">AI Training section</Link></li>
            </ul>
        </CardContent>
      </Card>

    </div>
  );
}

    