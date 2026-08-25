import { clsx } from './clsx';

export default function Avatar({ src, size = 44, className }: { src: string; size?: number; className?: string }) {
  return (
    <img
      src={src}
      alt=""
      style={{ width: size, height: size }}
      className={clsx('rounded-full object-cover border-2 border-white/40', className)}
    />
  );
}
