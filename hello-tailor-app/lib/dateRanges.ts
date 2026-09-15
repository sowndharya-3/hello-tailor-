// Admin Reports date-filter helpers (Step 15/16 of the brief). All ranges are inclusive
// day-boundaries [from 00:00:00, to 23:59:59] so "Today" reliably includes everything created
// today regardless of time-of-day.
export type ReportPeriod = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'Custom';

export interface DateRange {
  from: Date;
  to: Date;
}

function startOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}
function endOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(23, 59, 59, 999);
  return c;
}
function addDays(d: Date, n: number) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

export function startOfWeek(d: Date) {
  const c = startOfDay(d);
  const day = c.getDay(); // 0 = Sunday
  return addDays(c, -day);
}
export function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
export function endOfMonth(d: Date) {
  return endOfDay(new Date(d.getFullYear(), d.getMonth() + 1, 0));
}
export function startOfYear(d: Date) {
  return new Date(d.getFullYear(), 0, 1);
}
export function endOfYear(d: Date) {
  return endOfDay(new Date(d.getFullYear(), 11, 31));
}

// The preset buttons shown per period (Step 15: Today/Yesterday, This Week/Last Week, This
// Month/Last Month, This Year/Last Year).
export const PRESETS_BY_PERIOD: Record<Exclude<ReportPeriod, 'Custom'>, string[]> = {
  Daily: ['Today', 'Yesterday'],
  Weekly: ['This Week', 'Last Week'],
  Monthly: ['This Month', 'Last Month'],
  Yearly: ['This Year', 'Last Year'],
};

export function resolvePreset(period: ReportPeriod, preset: string, now = new Date()): DateRange {
  if (period === 'Daily') {
    if (preset === 'Yesterday') {
      const y = addDays(now, -1);
      return { from: startOfDay(y), to: endOfDay(y) };
    }
    return { from: startOfDay(now), to: endOfDay(now) };
  }
  if (period === 'Weekly') {
    const thisWeekStart = startOfWeek(now);
    if (preset === 'Last Week') {
      const lastWeekStart = addDays(thisWeekStart, -7);
      return { from: lastWeekStart, to: endOfDay(addDays(lastWeekStart, 6)) };
    }
    return { from: thisWeekStart, to: endOfDay(addDays(thisWeekStart, 6)) };
  }
  if (period === 'Monthly') {
    if (preset === 'Last Month') {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
    }
    return { from: startOfMonth(now), to: endOfMonth(now) };
  }
  // Yearly
  if (preset === 'Last Year') {
    const lastYear = new Date(now.getFullYear() - 1, 0, 1);
    return { from: startOfYear(lastYear), to: endOfYear(lastYear) };
  }
  return { from: startOfYear(now), to: endOfYear(now) };
}

export function defaultRangeFor(period: ReportPeriod, now = new Date()): DateRange {
  if (period === 'Custom') return { from: startOfMonth(now), to: endOfDay(now) };
  const [firstPreset] = PRESETS_BY_PERIOD[period];
  return resolvePreset(period, firstPreset, now);
}

export function isWithinRange(iso: string, range: DateRange) {
  const t = new Date(iso).getTime();
  return t >= range.from.getTime() && t <= range.to.getTime();
}

export function formatDDMMYYYY(d: Date) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}
export function formatYYYYMMDD(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// Groups an array of dated records into per-day or per-month buckets covering the full selected
// range (so a day/month with zero records still shows a zero bar instead of being skipped) — used
// to build the report chart from the real filtered dataset instead of static mock trend arrays.
export function bucketByDay<T>(range: DateRange, items: T[], dateOf: (t: T) => string, valueOf: (t: T) => number) {
  const buckets: { label: string; value: number }[] = [];
  let cursor = startOfDay(range.from);
  const end = startOfDay(range.to);
  while (cursor.getTime() <= end.getTime()) {
    const dayStart = cursor.getTime();
    const dayEnd = endOfDay(cursor).getTime();
    const value = items.reduce((sum, it) => {
      const t = new Date(dateOf(it)).getTime();
      return t >= dayStart && t <= dayEnd ? sum + valueOf(it) : sum;
    }, 0);
    buckets.push({ label: cursor.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), value });
    cursor = addDays(cursor, 1);
    if (buckets.length > 62) break; // safety cap — Custom range CSV still covers the full span, only the chart truncates
  }
  return buckets;
}

export function bucketByMonth<T>(range: DateRange, items: T[], dateOf: (t: T) => string, valueOf: (t: T) => number) {
  const buckets: { label: string; value: number }[] = [];
  let cursor = startOfMonth(range.from);
  const end = startOfMonth(range.to);
  while (cursor.getTime() <= end.getTime()) {
    const monthStart = cursor.getTime();
    const monthEnd = endOfMonth(cursor).getTime();
    const value = items.reduce((sum, it) => {
      const t = new Date(dateOf(it)).getTime();
      return t >= monthStart && t <= monthEnd ? sum + valueOf(it) : sum;
    }, 0);
    buckets.push({ label: cursor.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }), value });
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    if (buckets.length > 36) break;
  }
  return buckets;
}
