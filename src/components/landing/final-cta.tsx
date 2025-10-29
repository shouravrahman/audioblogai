import Link from 'next/link';
import { Button } from '../ui/button';

export function FinalCta() {
  return (
    <section className="container text-center">
      <div className="bg-primary/10 border border-primary/20 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl md:text-4xl font-bold">Ready to Stop Typing and Start Talking?</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform your creative process today. Get your first three articles on us.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
            <Button size="lg" asChild>
                <Link href="/signup">Start Recording for Free</Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              No credit card required.
            </p>
          </div>
      </div>
    </section>
  );
}
