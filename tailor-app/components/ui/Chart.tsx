import { View, Text, StyleSheet } from 'react-native';
import Svg, { Line, Polyline, Circle, Rect } from 'react-native-svg';
import { colors, font } from '@/theme';

// Lightweight custom-built bar chart (no chart library dependency needed).
export function BarChart({ data, height = 160 }: { data: { label: string; value: number }[]; height?: number }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const barWidth = 26;
  const gap = 14;
  const width = data.length * (barWidth + gap) + gap;

  return (
    <View>
      <Svg width={width} height={height}>
        {data.map((d, i) => {
          const barHeight = Math.max((d.value / max) * (height - 30), 3);
          const x = gap + i * (barWidth + gap);
          const y = height - barHeight - 20;
          return (
            <Rect key={d.label} x={x} y={y} width={barWidth} height={barHeight} rx={6} fill={i === data.length - 1 ? colors.ocean : colors.gold} opacity={i === data.length - 1 ? 1 : 0.75} />
          );
        })}
        <Line x1={0} y1={height - 20} x2={width} y2={height - 20} stroke={colors.border} strokeWidth={1} />
      </Svg>
      <View style={[styles.labelsRow, { width }]}>
        {data.map((d) => (
          <Text key={d.label} style={[styles.label, { width: barWidth + gap }]} numberOfLines={1}>{d.label}</Text>
        ))}
      </View>
    </View>
  );
}

// Simple line/sparkline chart for dashboard mini income overview.
export function LineChart({ data, height = 90, width = 300 }: { data: number[]; height?: number; width?: number }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const stepX = width / (data.length - 1 || 1);
  const points = data.map((v, i) => `${i * stepX},${height - ((v - min) / range) * (height - 16) - 8}`).join(' ');

  return (
    <Svg width={width} height={height}>
      <Polyline points={points} fill="none" stroke={colors.ocean} strokeWidth={2.5} />
      {data.map((v, i) => {
        const x = i * stepX;
        const y = height - ((v - min) / range) * (height - 16) - 8;
        return <Circle key={i} cx={x} cy={y} r={3.5} fill={colors.ocean} />;
      })}
    </Svg>
  );
}

const styles = StyleSheet.create({
  labelsRow: { flexDirection: 'row', marginTop: 4 },
  label: { fontFamily: font.regular, fontSize: 10, color: colors.textSecondary, textAlign: 'center' },
});
