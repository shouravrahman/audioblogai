import Link from 'next/link';
import { Button } from '../ui/button';

export function FinalCta() {
  return (
    <section className="container text-center">
      <div className="bg-secondary p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl md:text-4xl font-bold">Get started for free</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Start with a free plan. Upgrade when you're ready.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
            <Button size="lg" asChild>
                <Link href="/signup">Start for free</Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              No credit card required.
            </p>
          </div>
      </div>
    </section>
  );
}
