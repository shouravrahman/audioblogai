import { serve } from 'inngest/next';
import { inngest } from '@/inngest/client';
import { generateArticle } from '@/inngest/functions';

const handler = serve({
  client: inngest,
  functions: [
    generateArticle,
  ],
  streaming: 'allow',
});

export const { GET, POST, PUT } = handler;
