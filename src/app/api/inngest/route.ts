import { serve } from 'inngest/next';
import { inngest } from '@/inngest/client';
import { generateArticle } from '@/inngest/functions';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    generateArticle,
  ],
  streaming: 'allow',
});
