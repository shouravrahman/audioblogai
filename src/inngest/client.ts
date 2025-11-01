import { EventSchemas, Inngest } from 'inngest';
import type { Events } from './events';
import { transcribeAudioToText } from '@/ai/flows/transcribe-audio-to-text';
import { generateStructuredBlogPost } from '@/ai/flows/generate-structured-blog-post';
import { getFirebaseAdmin } from '@/app/firebase-admin';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import type { AiModel } from '@/lib/types';
import { generateImage } from '@/ai/flows/generate-image';

export const inngest = new Inngest({ id: 'audio-scribe-ai', schemas: new EventSchemas().fromRecord<Events>() });

export const generateArticle = inngest.createFunction(
  { id: 'generate-article-from-audio' },
  { event: 'app/article.generate' },
  async ({ event, step }) => {
    const { firestore } = getFirebaseAdmin();
    const { articleId, userId, audioDataUri, selectedModel, language, blogType, wordCount } = event.data;

    const articleRef = doc(firestore, `users/${userId}/blogPosts`, articleId);

    try {
      const transcribedText = await step.run('transcribe-audio', async () => {
        const transcriptionResult = await transcribeAudioToText({ audioDataUri, language });
        if (!transcriptionResult.transcription) {
          throw new Error('Transcription failed or returned empty.');
        }
        return transcriptionResult.transcription;
      });

      const { preferences, styleGuide } = await step.run('fetch-preferences-and-model', async () => {
          // Fetch user preferences
          const preferencesRef = doc(firestore, 'userPreferences', userId);
          const preferencesSnap = await getDoc(preferencesRef);
          const preferences = preferencesSnap.exists() ? preferencesSnap.data() : {};

          // Fetch custom model if selected
          let styleGuide = '';
          if (selectedModel !== 'default') {
              const modelRef = doc(firestore, `users/${userId}/aiModels`, selectedModel);
              const modelSnap = await getDoc(modelRef);
              if (modelSnap.exists()) {
                  const model = modelSnap.data() as AiModel;
                  styleGuide = model.trainingData;
              }
          }
          return { preferences, styleGuide };
      });

      // Generate the initial blog post with image placeholders
      const structuredPostWithPlaceholders = await step.run('generate-structured-post', async () => {
        const result = await generateStructuredBlogPost({
          transcribedText,
          language,
          preferences,
          styleGuide,
          blogType,
          wordCount,
        });
        return result.structuredBlogPost;
      });

      // Generate cover image separately
      const coverImageUrl = await step.run('generate-cover-image', async () => {
         const result = await generateImage({
            articleContent: structuredPostWithPlaceholders.substring(0, 3000), // Use summary for prompt
          });
        return result.imageUrl;
      });
      
      // Find all image placeholders in the content
      const imagePrompts = [...structuredPostWithPlaceholders.matchAll(/\[image: (.*?)\]/g)].map(match => match[1]);

      let finalContent = structuredPostWithPlaceholders;

      if (imagePrompts.length > 0) {
        const generatedImages = await step.run('generate-in-line-images', async () => {
            const imagePromises = imagePrompts.map(prompt => 
                generateImage({ articleContent: prompt })
            );
            return await Promise.all(imagePromises);
        });

        // Replace placeholders with actual image tags
        finalContent = structuredPostWithPlaceholders.replace(/\[image: (.*?)\]/g, () => {
            const result = generatedImages.shift();
            if (result?.imageUrl) {
                return `<img src="${result.imageUrl}" alt="${imagePrompts.shift()}" class="rounded-lg shadow-md my-8" data-ai-hint="generated illustration" />`;
            }
            return ''; // Remove placeholder if image generation failed
        });
      }


      const lines = finalContent.split('\n');
      const title = lines[0].replace(/^#\s*/, '').trim() || 'Untitled Article';
      const content = lines.slice(1).join('\n').trim();

      await step.run('update-firestore-success', async () => {
        await updateDoc(articleRef, {
          title,
          content,
          coverImageUrl: coverImageUrl,
          status: 'completed',
          updatedAt: serverTimestamp(),
        });
      });

      return { success: true, articleId };

    } catch (error: any) {
        console.error('Article generation failed:', error);
        await step.run('update-firestore-failure', async () => {
            await updateDoc(articleRef, {
                status: 'failed',
                title: 'Article Generation Failed',
                content: error.message || 'An unknown error occurred during generation.',
                updatedAt: serverTimestamp(),
            });
        });
        // Re-throw the error to have Inngest mark the run as failed
        throw error;
    }
  }
);
