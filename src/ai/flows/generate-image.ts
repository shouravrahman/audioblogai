'use server';
/**
 * @fileOverview This file defines a Genkit flow that generates a blog post cover image.
 *
 * It uses the article's content to create a prompt for a text-to-image model,
 * resulting in a visually relevant and appealing cover image.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateImageInputSchema = z.object({
  articleContent: z.string().describe('The full content of the article to generate an image for.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated cover image.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(
  input: GenerateImageInput
): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async ({ articleContent }) => {
    
    const summaryPrompt = `Based on the following text, create a visually descriptive phrase (5-10 words) that can be used as a prompt to generate a compelling and relevant image. Focus on the core subject, action, and mood.

    Text:
    ${articleContent.substring(0, 2000)}...
    `;

    const { text: imagePrompt } = await ai.generate({
      prompt: summaryPrompt,
      model: 'googleai/gemini-2.5-flash',
    });


    const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `A professional, high-quality, cinematic-style image representing: "${imagePrompt}". Style: professional photography, high detail, visually appealing for a blog post.`,
    });
    
    if (!media.url) {
      throw new Error('Image generation failed to produce an image.');
    }

    return { imageUrl: media.url };
  }
);
