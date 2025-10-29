'use server';
/**
 * @fileOverview A flow that transcribes audio to text.
 *
 * - transcribeAudioToText - A function that transcribes audio to text.
 * - TranscribeAudioToTextInput - The input type for the transcribeAudioToText function.
 * - TranscribeAudioToTextOutput - The return type for the transcribeAudioToText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeAudioToTextInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The audio to transcribe, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  language: z.string().optional().describe('The language of the audio in BCP-47 format (e.g., "en-US", "es-ES").'),
});
export type TranscribeAudioToTextInput = z.infer<typeof TranscribeAudioToTextInputSchema>;

const TranscribeAudioToTextOutputSchema = z.object({
  transcription: z.string().describe('The transcribed text.'),
});
export type TranscribeAudioToTextOutput = z.infer<typeof TranscribeAudioToTextOutputSchema>;

export async function transcribeAudioToText(input: TranscribeAudioToTextInput): Promise<TranscribeAudioToTextOutput> {
  return transcribeAudioToTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'transcribeAudioToTextPrompt',
  input: {schema: TranscribeAudioToTextInputSchema},
  output: {schema: TranscribeAudioToTextOutputSchema},
  prompt: `Transcribe the following audio to text.{{#if language}} The language of the audio is {{language}}.{{/if}}\n\n{{media url=audioDataUri}}`,
});

const transcribeAudioToTextFlow = ai.defineFlow(
  {
    name: 'transcribeAudioToTextFlow',
    inputSchema: TranscribeAudioToTextInputSchema,
    outputSchema: TranscribeAudioToTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    