'use server';
/**
 * @fileOverview This file defines a Genkit flow that transforms transcribed text into a structured blog post.
 *
 * The flow uses an AI model to automatically add section headings and lists where appropriate,
 * creating a well-organized article. It also incorporates user-defined writing preferences and
 * a custom style guide to tailor the tone, style, and formatting of the output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Extracted from the preferences page form schema
const UserPreferencesSchema = z.object({
  titleTone: z.string().optional(),
  specialChars: z.string().optional(),
  headingCasing: z.string().optional(),
  headingFrequency: z.string().optional(),
  titleEmoji: z.string().optional(),
  bodyEmoji: z.string().optional(),
  postBodyTone: z.string().optional(),
}).optional();


const GenerateStructuredBlogPostInputSchema = z.object({
  transcribedText: z
    .string()
    .describe('The transcribed text to be transformed into a structured blog post.'),
  preferences: UserPreferencesSchema.describe("The user's writing style preferences."),
  styleGuide: z.string().optional().describe('An optional, detailed style guide for the AI to follow, derived from a custom model.'),
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
  prompt: `You are an AI expert in structuring blog posts. Take the following transcribed text and transform it into a well-organized blog post with section headings and lists where appropriate.

{{#if styleGuide}}
IMPORTANT: You MUST adhere to the following comprehensive style guide, which reflects the author's unique voice. This guide overrides any other conflicting preferences.
<styleGuide>
{{{styleGuide}}}
</styleGuide>
{{else}}
Adhere to the following user preferences for writing style:
{{#if preferences.titleTone}}
- Tone of the title: Use a {{preferences.titleTone}} style.
{{/if}}
{{#if preferences.postBodyTone}}
- Tone of the article body: Use a {{preferences.postBodyTone}} style.
{{/if}}
{{#if preferences.headingCasing}}
- Heading casing: Use {{preferences.headingCasing}} for all section headings.
{{/if}}
{{#if preferences.headingFrequency}}
- Heading frequency: Aim for a {{preferences.headingFrequency}} frequency of headings to break up the text.
{{/if}}
{{#if preferences.titleEmoji}}
- Emojis in title: {{#if (eq preferences.titleEmoji "allow")}}You can use emojis in the title.{{else}}Do not use any emojis in the title.{{/if}}
{{/if}}
{{#if preferences.bodyEmoji}}
- Emojis in body: {{#if (eq preferences.bodyEmoji "allow")}}You can use emojis within the article body.{{else}}Do not use any emojis in the article body.{{/if}}
{{/if}}
{{#if preferences.specialChars}}
- Special characters in headings: {{#if (eq preferences.specialChars "remove")}}Remove special characters to keep headings simple (e.g., "Day 1 Arrival" instead of "Day 1: Arrival!").{{else}}You are allowed to use special characters like colons, question marks, or exclamation points in headings.{{/if}}
{{/if}}
{{/if}}


Transcribed Text:
{{{transcribedText}}}
`,
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
