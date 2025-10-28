import { Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <Mic className="h-6 w-6 text-primary" />
      <span className="text-lg font-bold">AudioScribe AI</span>
    </Link>
  );
}
