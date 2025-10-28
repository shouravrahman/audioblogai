import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { exampleArticles } from '@/lib/data';
import { cn } from '@/lib/utils';

export function ExampleArticles() {
  const articles = [...exampleArticles, ...exampleArticles]; // Duplicate for seamless scroll

  return (
    <section id="examples" className="py-12 md:py-20 bg-secondary/50">
      <div className="container text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold">
          Real articles written by companies and people
        </h2>
      </div>
      <div className="relative overflow-hidden group">
        <div className="flex gap-6 marquee group-hover:[animation-play-state:paused]">
          {articles.map((article, index) => (
            <Card key={index} className="w-[350px] shrink-0">
              {article.thumbnail && (
                <CardHeader className="p-0">
                  <div className="aspect-video relative">
                    <Image
                      src={article.thumbnail.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover rounded-t-lg"
                      data-ai-hint={article.thumbnail.imageHint}
                    />
                  </div>
                </CardHeader>
              )}
              <CardContent className="p-4">
                <h3 className="font-bold text-lg">{article.title}</h3>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={article.authorAvatar.imageUrl}
                    alt={article.author}
                    data-ai-hint={article.authorAvatar.imageHint}
                  />
                  <AvatarFallback>{article.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{article.author}</p>
                  {article.publication && (
                    <p className="text-xs text-muted-foreground">
                      {article.publication}
                    </p>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-secondary/50 to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-secondary/50 to-transparent"></div>
      </div>
    </section>
  );
}
