'use server';

import { inngest } from '@/inngest/client';
import { z } from 'zod';
import { LemonSqueezy } from '@lemonsqueezy/lemonsqueezy.js';
import { auth } from 'firebase-admin';
import { getFirebaseAdmin } from './firebase-admin';
import { redirect } from 'next/navigation';

const createArticleSchema = z.object({
  articleId: z.string(),
  userId: z.string(),
  audioDataUri: z.string(),
  selectedModel: z.string(),
  language: z.string(),
});

export async function createArticle(input: z.infer<typeof createArticleSchema>) {
  const { articleId, userId, audioDataUri, selectedModel, language } = createArticleSchema.parse(input);

  await inngest.send({
    name: 'app/article.generate',
    data: {
      articleId,
      userId,
      audioDataUri,
      selectedModel,
      language,
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

  const lemonSqueezy = new LemonSqueezy(process.env.LEMONSQUEEZY_API_KEY);

  const checkout = await lemonSqueezy.createCheckout({
    storeId: Number(process.env.LEMONSQUEEZY_STORE_ID),
    variantId: Number(planId),
    custom: {
      user_id: userId,
    },
    checkoutOptions: {
      embed: true,
      media: false,
      logo: false,
    },
    checkoutData: {
      email: userEmail,
    },
  });

  if (!checkout.data?.data.attributes.url) {
    throw new Error('Failed to create checkout');
  }
  
  redirect(checkout.data.data.attributes.url);
}

    