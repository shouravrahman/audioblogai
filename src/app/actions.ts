'use server';

import { inngest } from '@/inngest/client';
import { z } from 'zod';

const createArticleSchema = z.object({
  articleId: z.string(),
  userId: z.string(),
  audioDataUri: z.string(),
  selectedModel: z.string(),
});

export async function createArticle(input: z.infer<typeof createArticleSchema>) {
  const { articleId, userId, audioDataUri, selectedModel } = createArticleSchema.parse(input);

  await inngest.send({
    name: 'app/article.generate',
    data: {
      articleId,
      userId,
      audioDataUri,
      selectedModel,
    },
    user: {
        id: userId,
    }
  });
}
