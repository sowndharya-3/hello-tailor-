// Lightweight inline-SVG bar/line charts — no charting library, matches the mobile
// app's Chart.tsx so ported screens keep the same visual language.
export function BarChart({ data, width = 280, height = 100, color = '#0C7EBC' }: { data: number[]; width?: number; height?: number; color?: string }) {
  const max = Math.max(...data, 1);
  const barW = width / data.length;
  return (
    <svg width={width} height={height}>
      {data.map((v, i) => {
        const h = (v / max) * (height - 8);
        return (
          <rect
            key={i}
            x={i * barW + barW * 0.2}
            y={height - h}
            width={barW * 0.6}
            height={h}
            rx={3}
            fill={color}
            opacity={0.85}
          />
        );
      })}
    </svg>
  );
}

export function LineChart({ data, width = 280, height = 80, color = '#0C7EBC' }: { data: number[]; width?: number; height?: number; color?: string }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const stepX = width / (data.length - 1 || 1);
  const points = data.map((v, i) => `${i * stepX},${height - ((v - min) / range) * (height - 8) - 4}`).join(' ');
  return (
    <svg width={width} height={height}>
      <polyline points={points} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {data.map((v, i) => (
        <circle key={i} cx={i * stepX} cy={height - ((v - min) / range) * (height - 8) - 4} r={3} fill={color} />
      ))}
    </svg>
  );
}
