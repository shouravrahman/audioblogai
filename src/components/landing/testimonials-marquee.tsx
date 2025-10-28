import { testimonials } from '@/lib/data';
import { TestimonialCard } from './testimonial-card';
import { cn } from '@/lib/utils';

export function TestimonialsMarquee({ reverse = false }: { reverse?: boolean }) {
  const firstHalf = testimonials.slice(0, Math.ceil(testimonials.length / 2));
  const secondHalf = testimonials.slice(Math.ceil(testimonials.length / 2));

  return (
    <section className="py-12 md:py-20 bg-secondary/50">
      <div className="container text-center mb-8">
        <p className="font-semibold text-primary">Trusted by professional writers</p>
      </div>
      <div className="relative overflow-hidden">
        <div className={cn("flex gap-4", reverse ? "flex-row-reverse" : "")}>
            <div className={cn("flex min-w-full shrink-0 gap-4 py-4", reverse ? "[animation-direction:reverse]" : "", "marquee")}>
                {[...firstHalf, ...firstHalf].map((testimonial, index) => (
                    <TestimonialCard key={index} {...testimonial} className="w-80" />
                ))}
            </div>
        </div>
        <div className={cn("flex gap-4", !reverse ? "flex-row-reverse" : "")}>
            <div className={cn("flex min-w-full shrink-0 gap-4 py-4", !reverse ? "[animation-direction:reverse]" : "", "marquee")}>
                {[...secondHalf, ...secondHalf].map((testimonial, index) => (
                    <TestimonialCard key={index} {...testimonial} className="w-80" />
                ))}
            </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-secondary/50 to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-secondary/50 to-transparent"></div>
      </div>
    </section>
  );
}
