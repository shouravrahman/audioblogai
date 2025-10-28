import Image from 'next/image';
import { happyUsers } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import { Card } from '../ui/card';

export function Hero() {
  const videoThumbnail = PlaceHolderImages.find(
    (img) => img.id === 'demo-video-thumbnail'
  );

  return (
    <section className="container py-12 md:py-20">
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="flex flex-col justify-center text-center md:text-left">
          <div className="flex justify-center md:justify-start items-center gap-2 mb-4">
            <div className="flex -space-x-2 overflow-hidden">
              {happyUsers.map((user, index) => (
                <Avatar key={index} className="border-2 border-background">
                  <AvatarImage
                    src={user.imageUrl}
                    alt={user.description}
                    data-ai-hint={user.imageHint}
                  />
                  <AvatarFallback>{user.description.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              JOIN THOUSANDS OF CREATORS
            </p>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Turn your voice into compelling articles
          </h1>
          <p className="mt-4 max-w-[600px] mx-auto md:mx-0 text-lg text-muted-foreground md:text-xl">
            Conquer writer's block and publish more content. Your audio is transformed into structured blog posts, ready for you to edit, export, and share.
          </p>
          <div className="mt-8 flex flex-col items-center md:items-start gap-4">
            <Button size="lg">Start for Free</Button>
            <p className="text-xs text-muted-foreground">
              No credit card required.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          {videoThumbnail && (
            <Card className="overflow-hidden rounded-xl shadow-2xl w-full max-w-lg">
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
      </div>
    </section>
  );
}
