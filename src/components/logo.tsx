import { Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Mic className="h-6 w-6 text-blue-500" />
      <span className="text-lg font-bold">AudioScribe AI</span>
    </div>
  );
}
