import { config } from 'dotenv';
config();

import '@/ai/flows/transcribe-audio-to-text.ts';
import '@/ai/flows/train-ai-model-with-writing-samples.ts';
import '@/ai/flows/generate-structured-blog-post.ts';