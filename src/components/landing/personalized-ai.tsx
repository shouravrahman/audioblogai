import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Input } from '../ui/input';
import { Plus } from 'lucide-react';

const writingExamples = [
  'https://www.eddyvinck.com/blog/how-to-test-apple-pay-for-web',
  'https://www.eddyvinck.com/blog/dont-make-these-3-mistakes-building-a-computer',
  'https://www.eddyvinck.com/blog/how-to-study-for-the-aws-developer-associate-exam',
];

export function PersonalizedAi() {
  return (
    <section id="personalized-ai">
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">Personalized AI Models</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Train your own AI model with 3 to 10 articles you already have, or use
            the articles you wrote using Blog Recorder to make it sound just like you.
          </p>
          <Button className="mt-6">Create new writing AI</Button>
        </div>
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              <CardTitle>Eddy’s AI Model</CardTitle>
              <CardDescription>
                Add 3 to 10 writing examples.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="https://..." />
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {writingExamples.map((url, i) => (
                  <div key={i} className="p-2 bg-secondary rounded-md text-sm text-muted-foreground truncate">
                    {url}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
