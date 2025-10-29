'use server';
/**
 * @fileOverview This file defines a Genkit flow that analyzes an article for SEO improvements.
 *
 * The flow acts as an SEO expert, suggesting better titles, generating a meta description,
 * and extracting relevant keywords to help the article rank better in search engines.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeSeoInputSchema = z.object({
  title: z.string().describe('The current title of the article.'),
  content: z.string().describe('The full content of the article.'),
});
export type AnalyzeSeoInput = z.infer<typeof AnalyzeSeoInputSchema>;

const AnalyzeSeoOutputSchema = z.object({
  suggestedTitles: z.array(z.string()).describe('A list of 5 alternative, SEO-friendly titles.'),
  metaDescription: z.string().describe('A compelling, SEO-friendly meta description (max 160 characters).'),
  keywords: z.array(z.string()).describe('A list of 10-15 relevant keywords and long-tail phrases.'),
});
export type AnalyzeSeoOutput = z.infer<typeof AnalyzeSeoOutputSchema>;

export async function analyzeSeo(
  input: AnalyzeSeoInput
): Promise<AnalyzeSeoOutput> {
  return analyzeSeoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSeoPrompt',
  input: { schema: AnalyzeSeoInputSchema },
  output: { schema: AnalyzeSeoOutputSchema },
  prompt: `You are an expert SEO analyst. Your task is to analyze the provided article and suggest improvements to enhance its search engine ranking.

**Analysis Task:**

1.  **Suggest Titles:** Generate 5 alternative titles that are more compelling and SEO-friendly. The titles should be engaging, include relevant keywords, and be likely to attract clicks.
2.  **Create Meta Description:** Write a concise and compelling meta description (maximum 160 characters) that summarizes the article and encourages users to click.
3.  **Extract Keywords:** Identify and list 10-15 primary and long-tail keywords that are most relevant to the article content.

**Article to Analyze:**

**Title:** {{{title}}}

**Content:**
{{{content}}}
`,
});

const analyzeSeoFlow = ai.defineFlow(
  {
    name: 'analyzeSeoFlow',
    inputSchema: AnalyzeSeoInputSchema,
    outputSchema: AnalyzeSeoOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
