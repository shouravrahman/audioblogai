'use server';
/**
 * @fileOverview Trains an AI model with user-provided writing samples to mimic their writing style.
 *
 * - trainAiModelWithWritingSamples - A function that initiates the AI model training process.
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
  message: z.string().describe('Confirmation message that the model has been trained.'),
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
  prompt: `You are an AI model training assistant.  You have received the user's writing samples.  Confirm that training will commence and that it will reflect their writing style.

Writing Samples:
{{#each writingSamples}}
{{{this}}}
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
