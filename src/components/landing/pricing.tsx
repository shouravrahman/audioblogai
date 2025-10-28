'use client';

import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { pricingPlans } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

export function Pricing() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <section id="pricing" className="container space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Professional articles written 10x faster
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          The average cost of a single professional blog post ranges from $150 to
          $500 per article. Our plans start at just $12 per month.
        </p>
      </div>

      <div className="flex items-center justify-center space-x-4">
        <Label htmlFor="billing-cycle" className={cn(!isYearly && "text-primary font-semibold")}>Pay monthly</Label>
        <Switch
          id="billing-cycle"
          checked={isYearly}
          onCheckedChange={setIsYearly}
        />
        <Label htmlFor="billing-cycle" className={cn(isYearly && "text-primary font-semibold")}>
          Pay yearly <span className="text-green-600">(2 months free)</span>
        </Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              'flex flex-col',
              plan.recommended && 'border-2 border-primary'
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
                  ${isYearly ? plan.priceYearly.toFixed(0) : plan.priceMonthly}
                </span>
                <span className="text-muted-foreground"> / month</span>
              </CardDescription>
              <p className="text-xs text-muted-foreground">
                {isYearly
                  ? `Billed annually $${plan.yearlyBilling} (save $${plan.yearlyDiscount})`
                  : 'Billed monthly'}
              </p>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">{plan.cta}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
