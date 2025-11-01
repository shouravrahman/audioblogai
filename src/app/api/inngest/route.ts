import { serve } from 'inngest/next';
import { inngest } from '@/inngest/server-client';
import { generateArticle } from '@/inngest/functions';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    generateArticle,
  ],
});
