import { inngest } from './client';
import { transcribeAudioToText } from '@/ai/flows/transcribe-audio-to-text';
import { generateStructuredBlogPost } from '@/ai/flows/generate-structured-blog-post';
import { getFirebaseAdmin } from '@/app/firebase-admin';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import type { AiModel } from '@/lib/types';


export const generateArticle = inngest.createFunction(
  { id: 'generate-article-from-audio' },
  { event: 'app/article.generate' },
  async ({ event, step }) => {
    const { firestore } = getFirebaseAdmin();
    const { articleId, userId, audioDataUri, selectedModel, language } = event.data;

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

      const structuredPost = await step.run('generate-blog-post', async () => {
        const blogPostResult = await generateStructuredBlogPost({
          transcribedText,
          language,
          preferences,
          styleGuide,
        });
        return blogPostResult.structuredBlogPost;
      });

      const lines = structuredPost.split('\n');
      const title = lines[0].replace(/^#\s*/, '').trim() || 'Untitled Article';
      const content = lines.slice(1).join('\n').trim();

      await step.run('update-firestore-success', async () => {
        await updateDoc(articleRef, {
          title,
          content,
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

    