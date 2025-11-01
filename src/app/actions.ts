'use server';

import { inngest } from '@/inngest/client';
import { z } from 'zod';
import { lemonSqueezySetup, createCheckout as createLsCheckout } from '@lemonsqueezy/lemonsqueezy.js';
import { redirect } from 'next/navigation';
import { trainAiModelWithWritingSamples, type TrainAiModelWithWritingSamplesInput, type TrainAiModelWithWritingSamplesOutput } from '@/ai/flows/train-ai-model-with-writing-samples';
import { transcribeAudioToText, type TranscribeAudioToTextInput, type TranscribeAudioToTextOutput } from '@/ai/flows/transcribe-audio-to-text';
import { researchAndExpandArticle, type ResearchAndExpandArticleInput, type ResearchAndExpandArticleOutput } from '@/ai/flows/research-and-expand-article';
import { analyzeSeo, type AnalyzeSeoInput, type AnalyzeSeoOutput } from '@/ai/flows/analyze-seo';
import { generateStructuredBlogPost, type GenerateStructuredBlogPostInput, type GenerateStructuredBlogPostOutput } from '@/ai/flows/generate-structured-blog-post';


const createArticleSchema = z.object({
  articleId: z.string(),
  userId: z.string(),
  audioDataUri: z.string(),
  selectedModel: z.string(),
  language: z.string(),
  blogType: z.string(),
  wordCount: z.string(),
});

export async function createArticle(input: z.infer<typeof createArticleSchema>) {
  const { articleId, userId, audioDataUri, selectedModel, language, blogType, wordCount } = createArticleSchema.parse(input);

  await inngest.send({
    name: 'app/article.generate',
    data: {
      articleId,
      userId,
      audioDataUri,
      selectedModel,
      language,
      blogType,
      wordCount,
    },
    user: {
        id: userId,
    }
  });
}

const createCheckoutSchema = z.object({
  planId: z.string(),
  userEmail: z.string(),
  userId: z.string(),
});

export async function createCheckout(input: z.infer<typeof createCheckoutSchema>) {
  const { planId, userEmail, userId } = createCheckoutSchema.parse(input);

  if (!process.env.LEMONSQUEEZY_API_KEY) {
    throw new Error('LEMONSQUEEZY_API_KEY is not set');
  }
  if (!process.env.LEMONSQUEEZY_STORE_ID) {
    throw new Error('LEMONSQUEEZY_STORE_ID is not set');
  }

  lemonSqueezySetup({
    apiKey: process.env.LEMONSQUEEZY_API_KEY,
  });

  const { data, error } = await createLsCheckout(process.env.LEMONSQUEEZY_STORE_ID!, planId, {
    checkoutData: {
      email: userEmail,
      custom: {
        user_id: userId,
      }
    },
    productOptions: {
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard`,
    }
  });


  if (error) {
    throw new Error(`Failed to create checkout: ${error.message}`);
  }
  
  if (!data?.data.attributes.url) {
     throw new Error('Failed to retrieve checkout URL');
  }
  
  redirect(data.data.attributes.url);
}

// Action for training AI model
export async function trainAiModelAction(input: TrainAiModelWithWritingSamplesInput): Promise<TrainAiModelWithWritingSamplesOutput> {
  return await trainAiModelWithWritingSamples(input);
}

// Action for transcribing audio
export async function transcribeAudioToAction(input: TranscribeAudioToTextInput): Promise<TranscribeAudioToTextOutput> {
  return await transcribeAudioToText(input);
}

// Action for researching and expanding an article
export async function researchAndExpandArticleAction(input: ResearchAndExpandArticleInput): Promise<ResearchAndExpandArticleOutput> {
  return await researchAndExpandArticle(input);
}

// Action for analyzing SEO
export async function analyzeSeoAction(input: AnalyzeSeoInput): Promise<AnalyzeSeoOutput> {
  return await analyzeSeo(input);
}

// Action for generating a blog post
export async function generateStructuredBlogPostAction(input: GenerateStructuredBlogPostInput): Promise<GenerateStructuredBlogPostOutput> {
    return await generateStructuredBlogPost(input);
}
