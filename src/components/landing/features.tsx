import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { features } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '../ui/slider';
import { Check, Dot } from 'lucide-react';
import { cn } from '@/lib/utils';

const FeatureCard = ({
  step,
  title,
  subtitle,
  description,
  action,
  children,
}: (typeof features)[0] & { children: React.ReactNode }) => (
  <div className="container grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    <div className={cn(step % 2 === 0 ? "md:order-2" : "md:order-1")}>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
        Step {step}
      </h3>
      <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </p>
      <h2 className="mt-1 text-2xl font-semibold text-muted-foreground">{subtitle}</h2>
      <p className="mt-4 text-lg text-muted-foreground">{description}</p>
    </div>
    <div className={cn(step % 2 === 0 ? "md:order-1" : "md:order-2", "flex items-center justify-center")}>
      {children}
    </div>
  </div>
);

export function Features() {
  const steps = [
    'Record', 'Transcribe', 'Enrich', 'Publish'
  ]
  const currentStep = 'Enrich';

  return (
    <section id="features">
      <div className="container text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold">
          How It Works
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Our process is simple. Just talk, and let our AI handle the heavy lifting.
        </p>
      </div>

      <div className="container max-w-4xl mb-16">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-border -z-10" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2/3 h-0.5 bg-primary -z-10" />
          {steps.map((step, index) => {
            const isCompleted = steps.indexOf(currentStep) > index;
            const isCurrent = steps.indexOf(currentStep) === index;

            return (
              <div key={step} className="flex flex-col items-center gap-2 z-0 bg-background px-2">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-all", 
                  isCompleted ? "bg-primary text-primary-foreground" : 
                  isCurrent ? "bg-primary text-primary-foreground ring-4 ring-primary/30" : 
                  "bg-muted text-muted-foreground"
                )}>
                  {isCompleted ? <Check className="w-5 h-5" /> : <Dot className="w-6 h-6" />}
                </div>
                 <p className={cn("text-sm font-semibold", isCurrent && "text-primary")}>{step}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-24 md:space-y-32">
        <FeatureCard {...features[0]}>
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              <CardTitle>Speak Your Mind</CardTitle>
              <CardDescription>
                Start recording in any language. Just capture your ideas as they come.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-32 bg-secondary rounded-lg">
                <p className="text-4xl font-bold text-muted-foreground">01:23</p>
              </div>
            </CardContent>
          </Card>
        </FeatureCard>

        <FeatureCard {...features[1]}>
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              <CardTitle>From Speech to Structure</CardTitle>
              <CardDescription>
                Our AI transcribes your audio and organizes it into a polished article draft.
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm text-sm dark:prose-invert">
              <h4>Key Takeaways</h4>
              <ul>
                <li>AI drafts the post for you</li>
                <li>Generate outlines and ideas</li>
                <li>Get feedback on your drafts</li>
              </ul>
              <h4>Writing Tools</h4>
              <p>
                <strong>Smart Editor:</strong> It's more than just text. It's a full-featured editor.
              </p>
            </CardContent>
          </Card>
        </FeatureCard>

        <FeatureCard {...features[2]}>
           <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              <CardTitle>AI-Powered Enhancements</CardTitle>
               <CardDescription>Go beyond the first draft with powerful AI tools.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button>Enrich with Research</Button>
               <Button variant="secondary">Analyze SEO</Button>
            </CardContent>
          </Card>
        </FeatureCard>

        <FeatureCard {...features[3]}>
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              <CardTitle>Export Anywhere</CardTitle>
              <CardDescription>
                Copy and paste to any platform, hassle-free.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-2'>
                <Button>Copy as Markdown</Button>
                <Button variant="secondary">Copy as HTML</Button>
              </div>
            </CardContent>
          </Card>
        </FeatureCard>
      </div>
    </section>
  );
}
