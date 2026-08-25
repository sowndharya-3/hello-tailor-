import type { HTMLAttributes } from 'react';
import { clsx } from './clsx';

export default function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'rounded-ht-card bg-ht-card p-4 shadow-[0_4px_12px_rgba(23,59,87,0.06)]',
        className,
      )}
      {...rest}
    />
  );
}
