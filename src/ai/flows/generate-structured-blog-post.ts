'use server';
/**
 * @fileOverview This file defines a Genkit flow that transforms transcribed text into a structured blog post.
 *
 * The flow uses an AI model to automatically add section headings and lists where appropriate,
 * creating a well-organized article. It also incorporates user-defined writing preferences and
 * a custom style guide to tailor the tone, style, and formatting of the output.
 * It will also strategically insert image placeholders for later processing.
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
  language: z.string().optional().describe('The language of the content in BCP-47 format (e.g., "en-US", "es-ES").'),
  preferences: UserPreferencesSchema.describe("The user's writing style preferences."),
  styleGuide: z.string().optional().describe('An optional, detailed style guide for the AI to follow, derived from a custom model.'),
  blogType: z.string().optional().describe('The desired format of the blog post (e.g., standard, listicle, how-to).'),
  wordCount: z.string().optional().describe('The target word count for the article (e.g., 300, 500, 1000).'),
});
export type GenerateStructuredBlogPostInput = z.infer<
  typeof GenerateStructuredBlogPostInputSchema
>;

const GenerateStructuredBlogPostOutputSchema = z.object({
  structuredBlogPost: z.string().describe('The structured blog post with section headings, lists, and image placeholders.'),
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
  prompt: `You are an expert copywriter and editor. Your task is to transform the provided raw audio transcription into a well-written, engaging, and publish-ready blog post in the specified language.

**Language for Output:** {{language}}

**Core Instructions:**

1.  **Humanize the Content**: Convert the conversational, spoken-word transcription into clean, readable, and engaging written content. Fix grammatical errors, remove filler words (like 'um', 'ah', 'you know'), and restructure sentences for clarity and flow.
2.  **Structure the Article**: Organize the content logically. Add a compelling title, a brief introduction to hook the reader, clear section headings to break up the text, and a concluding summary. Use lists (bulleted or numbered) where appropriate to make information digestible. All output (title, headings, content) must be in the specified language.
3.  **Generate Image Placeholders**: As you write, identify 2-3 key opportunities to add a visual aid (like an illustrative image, a simple chart, or an infographic). At these points, insert a placeholder tag in the format: \`[image: A descriptive prompt for a visually appealing image that illustrates this concept]\`. For example: \`[image: A vibrant, abstract representation of neural networks connecting]\`.
4.  **Apply Content and Styling Rules**: Adhere strictly to the content format and styling guidelines provided below.

**Content Format and Length:**
{{#if blogType}}
- **Post Type**: Format this article as a '{{blogType}}'. For a 'listicle', use numbered headings for each point. For a 'how-to', use clear, step-by-step instructions.
{{/if}}
{{#if wordCount}}
- **Target Word Count**: The final article should be approximately {{wordCount}} words long.
{{/if}}

**Styling and Voice Guidelines:**
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

**Raw Transcription:**
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
