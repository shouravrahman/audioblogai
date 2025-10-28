
import { Pricing } from '@/components/landing/pricing';

export default function SubscriptionPage() {
  return (
    <div>
       <div className="mb-12">
        <h1 className="text-3xl font-bold">Update Subscription</h1>
        <p className="text-muted-foreground">
          Choose a plan that best fits your needs.
        </p>
      </div>
      <Pricing />
    </div>
  );
}
