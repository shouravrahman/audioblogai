'use client';
import { AudioRecorder } from '@/components/dashboard/audio-recorder';

export default function NewArticlePage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Create New Article</h1>
                <p className="text-muted-foreground">Record your audio and let the AI do the rest.</p>
            </div>
            <AudioRecorder />
        </div>
    )
}
