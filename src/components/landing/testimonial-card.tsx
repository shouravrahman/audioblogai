import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

interface TestimonialCardProps {
  name: string;
  title: string;
  quote: string;
  avatar: ImagePlaceholder;
  variant?: 'default' | 'large';
  className?: string;
}

export function TestimonialCard({
  name,
  title,
  quote,
  avatar,
  variant = 'default',
  className,
}: TestimonialCardProps) {
  const isLarge = variant === 'large';
  return (
    <Card
      className={cn(
        'break-inside-avoid-column',
        isLarge ? 'p-6 md:p-8' : 'p-4',
        className
      )}
    >
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex items-center gap-4">
          <Avatar className={cn(isLarge ? 'h-16 w-16' : 'h-10 w-10')}>
            <AvatarImage
              src={avatar.imageUrl}
              alt={name}
              data-ai-hint={avatar.imageHint}
            />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className={cn('font-semibold', isLarge ? 'text-lg' : 'text-base')}>
              {name}
            </p>
            <p
              className={cn(
                'text-muted-foreground',
                isLarge ? 'text-base' : 'text-sm'
              )}
            >
              {title}
            </p>
          </div>
        </div>
        <blockquote
          className={cn(
            'text-muted-foreground',
            isLarge ? 'text-xl md:text-2xl leading-relaxed' : 'text-base'
          )}
        >
          &ldquo;{quote}&rdquo;
        </blockquote>
      </CardContent>
    </Card>
  );
}
