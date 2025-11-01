import { serve } from 'inngest/next';
import { inngest, generateArticle } from '@/inngest/client';

export const runtime = 'edge';

const handler = serve({
  client: inngest,
  functions: [
    generateArticle,
  ],
  streaming: 'allow',
});

export const GET = handler;
export const POST = handler;
export const PUT = handler;
