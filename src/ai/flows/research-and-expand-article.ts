'use server';
/**
 * @fileOverview This file defines a Genkit flow that acts as a research assistant.
 *
 * The flow takes an existing article, uses a web search tool to find relevant facts,
 * statistics, and sources, and then integrates this new information into the article
 * to add depth and credibility.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ResearchAndExpandArticleInputSchema = z.object({
  articleContent: z.string().describe('The content of the article to be enriched.'),
});
export type ResearchAndExpandArticleInput = z.infer<typeof ResearchAndExpandArticleInputSchema>;

const ResearchAndExpandArticleOutputSchema = z.object({
  enrichedArticle: z.string().describe('The updated article content with new research and citations integrated.'),
});
export type ResearchAndExpandArticleOutput = z.infer<typeof ResearchAndExpandArticleOutputSchema>;

// This is a placeholder for a real web search tool.
// In a real application, this would use an API like Google Search.
const webSearch = ai.defineTool(
    {
      name: 'webSearch',
      description: 'Performs a web search for a given query and returns relevant facts and sources.',
      inputSchema: z.object({ query: z.string() }),
      outputSchema: z.string(),
    },
    async ({ query }) => {
      // In a real implementation, you would call a search API here.
      // For now, we return mock data based on the query.
      if (query.toLowerCase().includes('productivity')) {
        return "A 2023 Stanford study found that remote work can increase productivity by up to 13%. Another report from Gallup notes that highly engaged teams show 21% greater profitability.";
      }
      if (query.toLowerCase().includes('writer\'s block')) {
          return "Studies from Yale University suggest that writer's block often stems from creative anxiety. Freewriting exercises and changing environments are common strategies to overcome it.";
      }
      return "No specific data found for this query, but general sources indicate this is a topic of growing interest.";
    }
);


export async function researchAndExpandArticle(
  input: ResearchAndExpandArticleInput
): Promise<ResearchAndExpandArticleOutput> {
  return researchAndExpandArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'researchAndExpandPrompt',
  input: { schema: ResearchAndExpandArticleInputSchema },
  output: { schema: ResearchAndExpandArticleOutputSchema },
  tools: [webSearch],
  prompt: `You are a research assistant and expert copy-editor. Your task is to enrich the provided article content with factual data, statistics, and citations.

**Your Process:**

1.  **Analyze the Article:** Read through the article to understand its main arguments and claims.
2.  **Identify Opportunities:** Identify statements that could be strengthened with data, a source, or a statistic.
3.  **Use the Web Search Tool:** Perform targeted web searches for each opportunity you identify.
4.  **Integrate Findings:** Seamlessly weave the facts, statistics, or sources you find into the article. The goal is to enhance the existing text, not to write completely new sections. The final output should be a single, cohesive article with the new information included. Ensure the tone remains consistent. Do not add a "Conclusion" or "Summary" section if one does not already exist.

**Article Content to Enrich:**
{{{articleContent}}}
`,
});

const researchAndExpandArticleFlow = ai.defineFlow(
  {
    name: 'researchAndExpandArticleFlow',
    inputSchema: ResearchAndExpandArticleInputSchema,
    outputSchema: ResearchAndExpandArticleOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
