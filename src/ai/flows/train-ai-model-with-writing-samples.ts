'use server';
/**
 * @fileOverview Analyzes user-provided writing samples to extract stylistic features
 * for personalizing AI-generated content.
 *
 * - trainAiModelWithWritingSamples - A function that initiates the style analysis process.
 * - TrainAiModelWithWritingSamplesInput - The input type for the trainAiModelWithWritingSamples function.
 * - TrainAiModelWithWritingSamplesOutput - The return type for the trainAiModelWithWritingSamples function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TrainAiModelWithWritingSamplesInputSchema = z.object({
  writingSamples: z
    .array(z.string())
    .describe('An array of text representing the user writing samples.'),
});
export type TrainAiModelWithWritingSamplesInput = z.infer<
  typeof TrainAiModelWithWritingSamplesInputSchema
>;

const TrainAiModelWithWritingSamplesOutputSchema = z.object({
  analysis: z.string().describe('A summary of the writing style, tone, and key characteristics found in the samples.'),
});
export type TrainAiModelWithWritingSamplesOutput = z.infer<
  typeof TrainAiModelWithWritingSamplesOutputSchema
>;

export async function trainAiModelWithWritingSamples(
  input: TrainAiModelWithWritingSamplesInput
): Promise<TrainAiModelWithWritingSamplesOutput> {
  return trainAiModelWithWritingSamplesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'trainAiModelWithWritingSamplesPrompt',
  input: {schema: TrainAiModelWithWritingSamplesInputSchema},
  output: {schema: TrainAiModelWithWritingSamplesOutputSchema},
  prompt: `You are an expert writing analyst. Analyze the following writing samples and produce a concise, actionable summary of the author's style. 

Focus on the following characteristics:
- **Tone**: Is it formal, conversational, humorous, academic, etc.?
- **Sentence Structure**: Are sentences long and complex, or short and punchy? Is there variation?
- **Vocabulary**: Is the language simple or sophisticated? Are there any recurring domain-specific terms?
- **Formatting**: Does the author use lists, bolding, italics, or other formatting frequently?
- **Overall Voice**: Describe the overall feeling or personality that comes through in the writing.

Your analysis will be used as a style guide for an AI to mimic this author. Be descriptive and specific.

Writing Samples:
{{#each writingSamples}}
---
{{{this}}}
---
{{/each}}
`,
});

const trainAiModelWithWritingSamplesFlow = ai.defineFlow(
  {
    name: 'trainAiModelWithWritingSamplesFlow',
    inputSchema: TrainAiModelWithWritingSamplesInputSchema,
    outputSchema: TrainAiModelWithWritingSamplesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
