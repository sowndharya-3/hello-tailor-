import { clsx } from './clsx';

export default function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('animate-pulse rounded-ht-input bg-ht-disabled-bg', className)} />;
}
