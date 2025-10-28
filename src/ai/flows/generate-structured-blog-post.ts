'use server';
/**
 * @fileOverview This file defines a Genkit flow that transforms transcribed text into a structured blog post.
 *
 * The flow uses an AI model to automatically add section headings and lists where appropriate,
 * creating a well-organized article. It exports the main function `generateStructuredBlogPost`,
 * along with its input and output types.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStructuredBlogPostInputSchema = z.object({
  transcribedText: z
    .string()
    .describe('The transcribed text to be transformed into a structured blog post.'),
});
export type GenerateStructuredBlogPostInput = z.infer<
  typeof GenerateStructuredBlogPostInputSchema
>;

const GenerateStructuredBlogPostOutputSchema = z.object({
  structuredBlogPost: z.string().describe('The structured blog post with section headings and lists.'),
});
export type GenerateStructuredBlogPostOutput = z.infer<
  typeof GenerateStructuredBlogPostOutputSchema
>;

export async function generateStructuredBlogPost(
  input: GenerateStructuredBlogPostInput
): Promise<GenerateStructuredBlogPostOutput> {
  return generateStructuredBlogPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStructuredBlogPostPrompt',
  input: {schema: GenerateStructuredBlogPostInputSchema},
  output: {schema: GenerateStructuredBlogPostOutputSchema},
  prompt: `You are an AI expert in structuring blog posts. Take the following transcribed text and transform it into a well-organized blog post with section headings and lists where appropriate.\n\nTranscribed Text: {{{transcribedText}}}`,
});

const generateStructuredBlogPostFlow = ai.defineFlow(
  {
    name: 'generateStructuredBlogPostFlow',
    inputSchema: GenerateStructuredBlogPostInputSchema,
    outputSchema: GenerateStructuredBlogPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
