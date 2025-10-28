import { Check, Info, Mic, Pencil, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { comparisonFeatures } from '@/lib/data';

export function Comparison() {
  return (
    <section className="container">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold">
          Start publishing without writer&apos;s block
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Save countless hours by using Blog Recorder to create your articles
          faster than ever before.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <Card className="bg-secondary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Traditional content writing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="font-semibold">Without ChatGPT</h3>
            <ul className="space-y-2 text-muted-foreground">
              {comparisonFeatures.without.traditional.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <X className="h-5 w-5 text-destructive mt-1 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <h3 className="font-semibold pt-4">With ChatGPT</h3>
            <ul className="space-y-2 text-muted-foreground">
              {comparisonFeatures.without.chatGPT.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-yellow-500 mt-1 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-2 border-primary shadow-2xl shadow-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Mic className="h-5 w-5" />
              With Blog Recorder
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {comparisonFeatures.with.map((item, i) => (
              <div key={i} className={i % 2 === 0 ? 'font-semibold' : 'text-muted-foreground'}>
                {i % 2 === 0 ? (
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <p>{item}</p>
                  </div>
                ) : (
                  <p className="pl-7">{item}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
