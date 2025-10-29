import { Comparison } from '@/components/landing/comparison';
import { ExampleArticles } from '@/components/landing/example-articles';
import { Faq } from '@/components/landing/faq';
import { Features } from '@/components/landing/features';
import { FinalCta } from '@/components/landing/final-cta';
import { Hero } from '@/components/landing/hero';
import { PersonalizedAi } from '@/components/landing/personalized-ai';
import { Pricing } from '@/components/landing/pricing';

export default function Home() {
  return (
    <>
      <Hero />
      <div className="space-y-24 md:space-y-32 lg:space-y-40 xl:space-y-48 py-24 md:py-32 lg:py-40">
        <Features />
        <PersonalizedAi />
        <ExampleArticles />
        <Comparison />
        <Pricing />
        <Faq />
        <FinalCta />
      </div>
    </>
  );
}
