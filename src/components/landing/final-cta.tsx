import { Button } from '../ui/button';

export function FinalCta() {
  return (
    <section className="container text-center">
      <div className="bg-secondary p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl md:text-4xl font-bold">Get started for free</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          You can create 3 articles you get to keep, completely free.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
            <Button size="lg">Start with 3 free articles</Button>
            <p className="text-xs text-muted-foreground">
              Try for free. Cancel anytime. No credit card required.
            </p>
          </div>
      </div>
    </section>
  );
}
