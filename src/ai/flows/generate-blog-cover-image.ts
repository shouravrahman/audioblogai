'use server';
/**
 * @fileOverview This file defines a Genkit flow that generates a blog post cover image.
 *
 * It uses the article's content to create a prompt for a text-to-image model,
 * resulting in a visually relevant and appealing cover image.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateBlogCoverImageInputSchema = z.object({
  articleContent: z.string().describe('The full content of the article to generate an image for.'),
});
export type GenerateBlogCoverImageInput = z.infer<typeof GenerateBlogCoverImageInputSchema>;

const GenerateBlogCoverImageOutputSchema = z.object({
  coverImageUrl: z.string().describe('The data URI of the generated cover image.'),
});
export type GenerateBlogCoverImageOutput = z.infer<typeof GenerateBlogCoverImageOutputSchema>;

export async function generateBlogCoverImage(
  input: GenerateBlogCoverImageInput
): Promise<GenerateBlogCoverImageOutput> {
  return generateBlogCoverImageFlow(input);
}

const generateBlogCoverImageFlow = ai.defineFlow(
  {
    name: 'generateBlogCoverImageFlow',
    inputSchema: GenerateBlogCoverImageInputSchema,
    outputSchema: GenerateBlogCoverImageOutputSchema,
  },
  async ({ articleContent }) => {
    
    const summaryPrompt = `Summarize the following article content into a short, visually descriptive phrase (5-10 words) that can be used to generate a compelling blog cover image. Focus on the core subject and mood.
    
    Article Content:
    ${articleContent.substring(0, 2000)}...
    `;

    const { text: imagePrompt } = await ai.generate({
      prompt: summaryPrompt,
      model: 'googleai/gemini-2.5-flash',
    });


    const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `A professional, high-quality blog cover image representing: "${imagePrompt}". Style: cinematic, professional photography, high detail.`,
    });
    
    if (!media.url) {
      throw new Error('Image generation failed to produce an image.');
    }

    return { coverImageUrl: media.url };
  }
);
