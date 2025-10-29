import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { exampleArticles } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import Link from 'next/link';

export function ExampleArticles() {

  return (
    <section id="examples" className="py-12 md:py-20">
      <div className="container text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">
          From Voice Memos to Viral Posts
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          See how creators, founders, and experts are turning their spoken ideas into polished content.
        </p>
      </div>
      <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {exampleArticles.slice(0, 6).map((article, index) => (
          <Card key={index} className="flex flex-col">
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
            <CardContent className="p-4 flex-1">
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
      <div className="container text-center mt-12">
        <Button asChild variant="outline">
          <Link href="/signup">See More & Get Started</Link>
        </Button>
      </div>
    </section>
  );
}
