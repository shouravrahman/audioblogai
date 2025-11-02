'use server';

import { serve } from 'inngest/next';
import { inngest, generateArticle } from '@/inngest/client';

const handler = serve({
  client: inngest,
  functions: [generateArticle],
  streaming: 'allow',
});

export const { GET, POST, PUT } = handler;
