export default function Avatar({ seed, size = 36 }: { seed: string; size?: number }) {
  return (
    <img
      src={`https://picsum.photos/seed/${seed}/${size * 2}`}
      alt=""
      style={{ width: size, height: size }}
      className="rounded-full object-cover shrink-0"
    />
  );
}
