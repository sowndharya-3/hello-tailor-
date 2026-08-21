// Presentational trend data for admin charts (Dashboard/Analytics/Reports) — ported from
// admin-panel/src/data/mockData.ts's seeded generators. Not stored in the zustand store since
// nothing else reads or mutates it; kept here so every chart-bearing screen shares one source.
let seed = 7;
function rand() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}
function randInt(min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

export const revenueTrend = MONTHS.map((month) => ({ label: month, value: randInt(450000, 950000) }));
export const orderTrend = MONTHS.map((month) => ({ label: month, value: randInt(900, 2600) }));
export const cancelledTrend = MONTHS.map((month) => ({ label: month, value: randInt(20, 140) }));
export const customerGrowth = MONTHS.map((month) => ({ label: month, value: randInt(200, 1400) }));
export const tailorGrowth = MONTHS.map((month) => ({ label: month, value: randInt(20, 180) }));

export const topCategories = ['Blouse Stitching', "Men's Shirt", 'Suit / Salwar Kameez', 'Alterations', 'Kids Wear', 'Lehenga Stitching']
  .map((name) => ({ name, orders: randInt(400, 3200) }))
  .sort((a, b) => b.orders - a.orders);

export const topCities = ['Chennai', 'Bengaluru', 'Mumbai', 'Hyderabad', 'Delhi', 'Pune']
  .map((name) => ({ name, orders: randInt(600, 4200) }))
  .sort((a, b) => b.orders - a.orders);

export const incomeBreakdown = [
  { name: 'Booking Commission', value: 1010460 },
  { name: 'Memberships', value: 284900 },
  { name: 'Advertisements', value: 96400 },
  { name: 'Featured Listings', value: 52100 },
  { name: 'Other', value: 9200 },
];

export function inr(n: number) {
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}
