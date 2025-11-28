'use client';

import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { pricingPlans } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { useUser } from '@/firebase';
import { createCheckout } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { ClientOnly } from '../ui/client-only';

export function Pricing() {
  const [isYearly, setIsYearly] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState<string | null>(null);
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const handleCheckout = async (planId: string) => {
    if (!user) {
      router.push('/login?redirect=/dashboard/subscription');
      return;
    }
    
    setIsRedirecting(planId);
    try {
      await createCheckout({
        planId,
        userEmail: user.email!,
        userId: user.uid,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Checkout Error',
        description: error.message || 'Could not create checkout session.',
      });
      setIsRedirecting(null);
    }
  }

  return (
    <section id="pricing" className="container space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Flexible Pricing for Every Creator
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Choose a plan that works for you. Start for free and upgrade when you're ready.
        </p>
      </div>

      <div className="flex items-center justify-center space-x-4">
        <Label htmlFor="billing-cycle" className={cn(!isYearly && "text-primary font-semibold")}>Monthly</Label>
        <Switch
          id="billing-cycle"
          checked={isYearly}
          onCheckedChange={setIsYearly}
        />
        <Label htmlFor="billing-cycle" className={cn(isYearly && "text-primary font-semibold")}>
          Yearly <span className="text-green-600">(Save 20%)</span>
        </Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {pricingPlans.map((plan) => {
           const planId = isYearly ? plan.variantIdYearly : plan.variantIdMonthly;
           const isLoading = isRedirecting === planId;
          
          return (
          <Card
            key={plan.name}
            className={cn(
              'flex flex-col',
              plan.recommended && 'border-2 border-primary shadow-2xl shadow-primary/20'
            )}
          >
            {plan.recommended && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                RECOMMENDED
              </Badge>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold">
                  ${isYearly ? plan.priceYearly : plan.priceMonthly}
                </span>
                <span className="text-muted-foreground"> / month</span>
              </CardDescription>
              <p className="text-xs text-muted-foreground">
                {isYearly && plan.name !== 'Free'
                  ? `Billed as $${plan.priceYearly * 12} per year`
                  : 'Billed monthly'}
              </p>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
                <ClientOnly>
                    <Button 
                        className="w-full"
                        onClick={() => planId && handleCheckout(planId)}
                        disabled={plan.name === 'Free' || isLoading}
                        variant={plan.recommended ? 'default' : 'secondary'}
                    >
                        {isLoading ? 'Redirecting...' : plan.cta}
                    </Button>
              </ClientOnly>
            </CardFooter>
          </Card>
        )})}
      </div>
    </section>
  );
}
