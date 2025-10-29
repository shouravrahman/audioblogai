'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto bg-destructive/20 p-3 rounded-full w-fit">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="mt-4 text-2xl">Application Error</CardTitle>
              <CardDescription>
                We're sorry, but something went wrong.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-muted-foreground">
                An unexpected error occurred. Please try refreshing the page or
                clicking the button below. If the problem persists, please
                contact support.
              </p>
              
              {process.env.NODE_ENV === 'development' && error?.message && (
                <pre className="p-4 bg-secondary rounded-md text-left text-xs text-destructive overflow-auto">
                  {error.stack || error.message}
                </pre>
              )}

              <Button onClick={() => reset()}>
                Try again
              </Button>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
}
