'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AudioRecorder } from '@/components/dashboard/audio-recorder';
import { AudioUploader } from '@/components/dashboard/audio-uploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

function NewArticleContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const defaultTab = searchParams.get('upload') ? 'upload' : 'record';

    const handleTabChange = (value: string) => {
        const newPath = `/dashboard/new-article${value === 'upload' ? '?upload=true' : ''}`;
        router.replace(newPath, { scroll: false });
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Create New Article</h1>
                <p className="text-muted-foreground">Record your audio or upload a file and let the AI do the rest.</p>
            </div>

            <Tabs defaultValue={defaultTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                    <TabsTrigger value="record">
                        <Mic className="mr-2 h-4 w-4" />
                        Record Audio
                    </TabsTrigger>
                    <TabsTrigger value="upload">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload File
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="record" className="mt-6">
                    <AudioRecorder />
                </TabsContent>
                <TabsContent value="upload" className="mt-6">
                    <AudioUploader />
                </TabsContent>
            </Tabs>
        </div>
    )
}


export default function NewArticlePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewArticleContent />
        </Suspense>
    );
}
