import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import { Card } from '../ui/card';

export function Hero() {
  const videoThumbnail = PlaceHolderImages.find(
    (img) => img.id === 'demo-video-thumbnail'
  );

  return (
    <section className="container py-12 md:py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
        Go from Raw Ideas to<br />
        Polished Articles in Minutes.
      </h1>
      <p className="mt-6 max-w-[700px] mx-auto text-lg text-muted-foreground md:text-xl">
        Stop staring at a blank page. Just talk about your ideas, and let our AI transform your voice into a well-structured, ready-to-publish blog post in minutes.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button size="lg" asChild>
          <Link href="/signup">Get Started for Free</Link>
        </Button>
        <p className="text-xs text-muted-foreground">
          No credit card required.
        </p>
      </div>

      <div className="mt-12 md:mt-16 flex items-center justify-center">
          {videoThumbnail && (
            <Card className="overflow-hidden rounded-xl shadow-2xl w-full max-w-4xl mx-auto">
              <div className="relative aspect-video">
                <Image
                  src={videoThumbnail.imageUrl}
                  alt={videoThumbnail.description}
                  fill
                  className="object-cover"
                  data-ai-hint={videoThumbnail.imageHint}
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <PlayCircle className="h-20 w-20 text-white/70 hover:text-white transition-colors cursor-pointer" />
                </div>
              </div>
            </Card>
          )}
        </div>
    </section>
  );
}
