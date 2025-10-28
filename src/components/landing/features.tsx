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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '../ui/slider';

const FeatureCard = ({
  step,
  title,
  subtitle,
  description,
  action,
  children,
}: (typeof features)[0] & { children: React.ReactNode }) => (
  <div className="container grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    <div className="md:order-2">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
        Step {step}
      </h3>
      <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        {subtitle}
      </p>
      <h2 className="mt-1 text-2xl font-semibold text-muted-foreground">{title}</h2>
      <p className="mt-4 text-lg text-muted-foreground">{description}</p>
      <Button className="mt-6">{action}</Button>
    </div>
    <div className="md:order-1 flex items-center justify-center">
      {children}
    </div>
  </div>
);

export function Features() {
  return (
    <section id="features">
      <div className="container text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold">
          How your voice becomes an article
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Our process is simple. Just talk, and let our AI handle the heavy lifting.
        </p>
      </div>

      <div className="space-y-24 md:space-y-32">
        <FeatureCard {...features[0]}>
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              <CardTitle>Speak Your Mind</CardTitle>
              <CardDescription>
                Start recording and capture your ideas as they come.
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
              <CardTitle>AI Transcription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <p>0:00</p>
                <Slider defaultValue={[20]} max={100} step={1} />
                <p>07:23</p>
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an AI model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Your personal AI model</SelectItem>
                  <SelectItem value="default">AudioScribe AI default</SelectItem>
                  <SelectItem value="conversational">
                    Conversational and friendly
                  </SelectItem>
                  <SelectItem value="professional">
                    Professional and authoritative
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </FeatureCard>

        <FeatureCard {...features[2]}>
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              <CardTitle>From Speech to Structure</CardTitle>
              <CardDescription>
                Our AI organizes your transcript into a polished article.
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm text-sm">
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

        <FeatureCard {...features[3]}>
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              <CardTitle>Export Anywhere</CardTitle>
              <CardDescription>
                Copy and paste to any platform, hassle-free.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="markdown" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="richtext">Rich text</TabsTrigger>
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="markdown">Markdown</TabsTrigger>
                  <TabsTrigger value="text">Plain text</TabsTrigger>
                </TabsList>
                <TabsContent value="richtext">
                  <pre className="mt-2 text-xs p-4 bg-secondary rounded-md overflow-x-auto">
                    A rich text representation of your blog post...
                  </pre>
                </TabsContent>
                <TabsContent value="html">
                  <pre className="mt-2 text-xs p-4 bg-secondary rounded-md overflow-x-auto">
                    <code>{`<h2>Title</h2><p>Paragraph...</p>`}</code>
                  </pre>
                </TabsContent>
                <TabsContent value="markdown">
                  <pre className="mt-2 text-xs p-4 bg-secondary rounded-md overflow-x-auto">
                    <code>{`## Title\n\nA paragraph...`}</code>
                  </pre>
                </TabsContent>
                <TabsContent value="text">
                  <pre className="mt-2 text-xs p-4 bg-secondary rounded-md overflow-x-auto">
                    A plain text version of your blog post...
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </FeatureCard>
      </div>
    </section>
  );
}
