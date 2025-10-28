import { Comparison } from '@/components/landing/comparison';
import { ExampleArticles } from '@/components/landing/example-articles';
import { Faq } from '@/components/landing/faq';
import { Features } from '@/components/landing/features';
import { FinalCta } from '@/components/landing/final-cta';
import { Footer } from '@/components/landing/footer';
import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { PersonalizedAi } from '@/components/landing/personalized-ai';
import { Pricing } from '@/components/landing/pricing';
import { TestimonialCard } from '@/components/landing/testimonial-card';
import { TestimonialsMarquee } from '@/components/landing/testimonials-marquee';
import { testimonials } from '@/lib/data';

export default function Home() {
  const keithNewtonTestimonial = testimonials.find(
    (t) => t.name === 'Keith Newton, MD'
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <TestimonialsMarquee />

        <div className="space-y-24 md:space-y-32 lg:space-y-40 xl:space-y-48 py-24 md:py-32 lg:py-40">
          <Features />
          <PersonalizedAi />
        </div>
        
        <ExampleArticles />
        
        <div className="space-y-24 md:space-y-32 lg:space-y-40 xl:space-y-48 py-24 md:py-32 lg:py-40">
          <Comparison />

          {keithNewtonTestimonial && (
            <section className="container max-w-4xl">
              <TestimonialCard {...keithNewtonTestimonial} variant="large" />
            </section>
          )}

          <Pricing />
          <Faq />
          <FinalCta />
        </div>
      </main>
      <Footer />
    </div>
  );
}
