import type {
  Customer, Tailor, Order, Payment, CommissionEntry, MembershipPlan, MembershipRecord,
  Coupon, Advertisement, Review, Complaint, NotificationRecord, LocationEntry, Category,
  OrderStatus, PaymentStatus,
} from '../types';

// ponytail: seeded PRNG so mock data is stable across renders instead of re-randomizing
let seed = 42;
function rand() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}
function randInt(min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}
function dateWithinDays(daysAgo: number) {
  const d = new Date(2026, 7, 21);
  d.setDate(d.getDate() - randInt(0, daysAgo));
  return d.toISOString().slice(0, 10);
}

const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Reyansh', 'Krishna', 'Ishaan', 'Rohan', 'Kabir',
  'Ananya', 'Diya', 'Priya', 'Saanvi', 'Aadhya', 'Isha', 'Kavya', 'Meera', 'Riya', 'Sneha',
  'Rajesh', 'Suresh', 'Vikram', 'Amit', 'Sanjay', 'Deepak', 'Manoj', 'Ravi', 'Anil', 'Ajay',
  'Pooja', 'Neha', 'Kiran', 'Anjali', 'Divya', 'Shreya', 'Nisha', 'Sunita', 'Rekha', 'Geeta'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Reddy', 'Nair', 'Iyer', 'Rao',
  'Mehta', 'Joshi', 'Chauhan', 'Malhotra', 'Kapoor', 'Bose', 'Das', 'Menon', 'Pillai', 'Agarwal'];
function randomName() {
  return `${pick(firstNames)} ${pick(lastNames)}`;
}

export const CITIES: { city: string; state: string }[] = [
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Delhi', state: 'Delhi' },
  { city: 'Bengaluru', state: 'Karnataka' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Lucknow', state: 'Uttar Pradesh' },
  { city: 'Surat', state: 'Gujarat' },
  { city: 'Chandigarh', state: 'Chandigarh' },
  { city: 'Indore', state: 'Madhya Pradesh' },
  { city: 'Kochi', state: 'Kerala' },
  { city: 'Bhopal', state: 'Madhya Pradesh' },
];

export const CATEGORIES = [
  'Blouse Stitching', 'Saree Fall & Edging', 'Suit / Salwar Kameez', 'Lehenga Stitching',
  'Men\'s Shirt', 'Men\'s Trousers', 'Sherwani', 'Kids Wear', 'Alterations', 'Coat & Blazer',
  'Wedding Wear', 'Gown Stitching',
];

const orderStatuses: OrderStatus[] = ['Placed', 'Confirmed', 'Measurement Scheduled', 'In Stitching', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'];
const paymentStatuses: PaymentStatus[] = ['Paid', 'Partial', 'Pending', 'Refunded', 'Failed'];

export const customers: Customer[] = Array.from({ length: 64 }, (_, i) => {
  const loc = pick(CITIES);
  const name = randomName();
  return {
    id: `CUS-${1000 + i}`,
    name,
    mobile: `9${randInt(100000000, 999999999)}`,
    email: `${name.toLowerCase().replace(' ', '.')}${i}@mail.com`,
    city: loc.city,
    state: loc.state,
    joinedDate: dateWithinDays(400),
    orders: randInt(0, 24),
    membership: pick(['None', 'None', 'None', 'Silver', 'Gold', 'Premium', 'Diamond']),
    status: pick(['Active', 'Active', 'Active', 'Active', 'Blocked', 'Pending']),
    avatarSeed: `cust${i}`,
    totalSpend: randInt(500, 85000),
  };
});

export const tailors: Tailor[] = Array.from({ length: 48 }, (_, i) => {
  const loc = pick(CITIES);
  const name = randomName();
  const type = pick<'Home' | 'Shop'>(['Home', 'Shop']);
  return {
    id: `TLR-${2000 + i}`,
    name,
    shopName: type === 'Shop' ? `${name.split(' ')[1]} Tailoring House` : `${name} (Home Tailor)`,
    mobile: `8${randInt(100000000, 999999999)}`,
    email: `${name.toLowerCase().replace(' ', '.')}${i}@mail.com`,
    city: loc.city,
    state: loc.state,
    type,
    categories: Array.from(new Set(Array.from({ length: randInt(2, 4) }, () => pick(CATEGORIES)))),
    joinedDate: dateWithinDays(500),
    orders: randInt(0, 340),
    rating: Math.round((3 + rand() * 2) * 10) / 10,
    membership: pick(['None', 'None', 'Silver', 'Gold', 'Premium', 'Diamond']),
    status: pick(['Active', 'Active', 'Active', 'Blocked', 'Pending']),
    verification: pick(['Verified', 'Verified', 'Verified', 'Pending', 'Rejected']),
    avatarSeed: `tlr${i}`,
    income: randInt(5000, 420000),
    commissionPaid: randInt(500, 42000),
    experience: randInt(1, 22),
  };
});

export const orders: Order[] = Array.from({ length: 120 }, (_, i) => {
  const cust = pick(customers);
  const tlr = pick(tailors);
  const amount = randInt(400, 12000);
  const status = pick(orderStatuses);
  const payStatus = status === 'Cancelled' ? pick<PaymentStatus>(['Refunded', 'Pending']) : pick(paymentStatuses);
  const advance = payStatus === 'Pending' ? 0 : Math.round(amount * 0.3);
  const date = dateWithinDays(180);
  const allSteps = ['Placed', 'Confirmed', 'Measurement Scheduled', 'In Stitching', 'Ready', 'Out for Delivery', 'Delivered'];
  const idx = allSteps.indexOf(status);
  const timeline = allSteps.map((s, si) => ({
    label: s,
    date: si <= idx || status === 'Cancelled' ? date : '',
    done: status === 'Cancelled' ? si === 0 : si <= idx,
  }));
  return {
    id: `ORD-${5000 + i}`,
    customerId: cust.id,
    customerName: cust.name,
    tailorId: tlr.id,
    tailorName: tlr.shopName,
    category: pick(CATEGORIES),
    city: cust.city,
    state: cust.state,
    date,
    amount,
    advance,
    balance: amount - advance,
    status,
    paymentStatus: payStatus,
    paymentMethod: pick(['UPI', 'Card', 'Cash', 'Wallet', 'Net Banking']),
    timeline,
  };
});

export const payments: Payment[] = orders.slice(0, 90).map((o, i) => ({
  id: `PAY-${7000 + i}`,
  orderId: o.id,
  customerName: o.customerName,
  tailorName: o.tailorName,
  type: pick(['Advance', 'Balance', 'Full Payment', 'Refund']),
  amount: o.amount,
  status: o.paymentStatus,
  gatewayRef: `RZP${randInt(100000000, 999999999)}`,
  method: o.paymentMethod,
  date: o.date,
}));

export const commissionEntries: CommissionEntry[] = orders.slice(0, 90).map((o, i) => {
  const rate = 12;
  return {
    id: `COM-${8000 + i}`,
    orderId: o.id,
    tailorName: o.tailorName,
    orderAmount: o.amount,
    commissionRate: rate,
    commissionAmount: Math.round(o.amount * rate / 100),
    period: o.date.slice(0, 7),
    status: o.paymentStatus === 'Paid' ? 'Collected' : 'Pending',
    date: o.date,
  };
});

export const membershipPlans: MembershipPlan[] = [
  {
    id: 'PLN-1', name: 'Silver', audience: 'Tailor', price: 499, duration: '3 Months',
    benefits: ['Basic profile listing', 'Up to 20 orders/month', 'Standard support'],
    featureLimits: [{ label: 'Orders/month', value: '20' }, { label: 'Featured Listing', value: 'No' }],
    visible: true, active: true, color: '#98A2B3',
  },
  {
    id: 'PLN-2', name: 'Gold', audience: 'Tailor', price: 999, duration: '6 Months',
    benefits: ['Priority profile listing', 'Up to 60 orders/month', 'Priority support', 'Badge on profile'],
    featureLimits: [{ label: 'Orders/month', value: '60' }, { label: 'Featured Listing', value: 'Weekly' }],
    visible: true, active: true, color: '#D9A441',
  },
  {
    id: 'PLN-3', name: 'Premium', audience: 'Tailor', price: 1999, duration: '12 Months',
    benefits: ['Top-of-search placement', 'Unlimited orders', 'Dedicated support', 'Reduced commission 8%'],
    featureLimits: [{ label: 'Orders/month', value: 'Unlimited' }, { label: 'Featured Listing', value: 'Daily' }],
    visible: true, active: true, color: '#0C7EBC',
  },
  {
    id: 'PLN-4', name: 'Diamond', audience: 'Tailor', price: 3499, duration: '12 Months',
    benefits: ['#1 placement in city', 'Unlimited orders', '24x7 concierge support', 'Reduced commission 5%', 'Featured on homepage'],
    featureLimits: [{ label: 'Orders/month', value: 'Unlimited' }, { label: 'Featured Listing', value: 'Pinned' }],
    visible: true, active: true, color: '#173B57',
  },
  {
    id: 'PLN-5', name: 'Gold', audience: 'Customer', price: 299, duration: '6 Months',
    benefits: ['Free alterations', 'Priority delivery', '10% off on every order'],
    featureLimits: [{ label: 'Discount', value: '10%' }, { label: 'Free Deliveries', value: '6' }],
    visible: true, active: true, color: '#D9A441',
  },
  {
    id: 'PLN-6', name: 'Premium', audience: 'Customer', price: 599, duration: '12 Months',
    benefits: ['Free alterations', 'Same-day priority delivery', '18% off on every order', 'Personal stylist chat'],
    featureLimits: [{ label: 'Discount', value: '18%' }, { label: 'Free Deliveries', value: 'Unlimited' }],
    visible: true, active: false, color: '#0C7EBC',
  },
];

export const membershipRecords: MembershipRecord[] = Array.from({ length: 40 }, (_, i) => {
  const isTailor = i % 2 === 0;
  const user = isTailor ? pick(tailors) : pick(customers);
  const plan = pick(['Silver', 'Gold', 'Premium', 'Diamond']);
  return {
    id: `MEM-${9000 + i}`,
    userType: isTailor ? 'Tailor' : 'Customer',
    userName: 'name' in user ? user.name : '',
    plan,
    startDate: dateWithinDays(300),
    endDate: dateWithinDays(0),
    status: pick(['Active', 'Active', 'Expired', 'Cancelled']),
    amountPaid: randInt(299, 3499),
  };
});

export const coupons: Coupon[] = [
  { id: 'CPN-1', code: 'WELCOME50', discountType: 'Percentage', discountValue: 50, minBooking: 500, maxDiscount: 300, validFrom: '2026-01-01', validTo: '2026-12-31', eligibility: 'New Users', status: 'Active', usageCount: 214 },
  { id: 'CPN-2', code: 'FESTIVE200', discountType: 'Flat', discountValue: 200, minBooking: 1000, maxDiscount: 200, validFrom: '2026-08-01', validTo: '2026-09-15', eligibility: 'All Users', status: 'Active', usageCount: 88 },
  { id: 'CPN-3', code: 'PREMIUM15', discountType: 'Percentage', discountValue: 15, minBooking: 2000, maxDiscount: 500, validFrom: '2026-06-01', validTo: '2026-12-31', eligibility: 'Premium Members', status: 'Active', usageCount: 41 },
  { id: 'CPN-4', code: 'MONSOON100', discountType: 'Flat', discountValue: 100, minBooking: 600, maxDiscount: 100, validFrom: '2026-06-01', validTo: '2026-07-31', eligibility: 'All Users', status: 'Inactive', usageCount: 302 },
  { id: 'CPN-5', code: 'DIWALI25', discountType: 'Percentage', discountValue: 25, minBooking: 1500, maxDiscount: 750, validFrom: '2026-10-15', validTo: '2026-11-15', eligibility: 'All Users', status: 'Active', usageCount: 0 },
];

export const advertisements: Advertisement[] = [
  { id: 'ADV-1', title: 'Diwali Collection Banner', type: 'Banner', placement: 'Home Top Banner', imageSeed: 'ad1', destination: '/offers/diwali', startDate: '2026-10-10', endDate: '2026-11-05', status: 'Scheduled' },
  { id: 'ADV-2', title: 'Featured: Meera Boutique', type: 'Tailor Ad', placement: 'Search Results', imageSeed: 'ad2', destination: '/tailor/TLR-2004', startDate: '2026-08-01', endDate: '2026-08-31', status: 'Active' },
  { id: 'ADV-3', title: 'Premium Silk Fabric', type: 'Material Ad', placement: 'Category Page', imageSeed: 'ad3', destination: '/materials/silk', startDate: '2026-07-01', endDate: '2026-08-15', status: 'Expired' },
  { id: 'ADV-4', title: 'Wedding Season Promo', type: 'Banner', placement: 'App Home Carousel', imageSeed: 'ad4', destination: '/offers/wedding', startDate: '2026-08-15', endDate: '2026-09-30', status: 'Active' },
  { id: 'ADV-5', title: 'Featured: Rathi Tailors', type: 'Tailor Ad', placement: 'Home Recommendations', imageSeed: 'ad5', destination: '/tailor/TLR-2010', startDate: '2026-08-05', endDate: '2026-08-25', status: 'Paused' },
];

export const reviews: Review[] = Array.from({ length: 30 }, (_, i) => {
  const o = pick(orders);
  const comments = [
    'Excellent stitching quality, fit was perfect!', 'Delivery was a bit late but the work was great.',
    'Not satisfied with the fitting, had to get it altered.', 'Best tailor in the city, highly recommend!',
    'Good work but pricing is a little high.', 'Amazing attention to detail on the embroidery.',
    'Average experience, expected better finishing.', 'Super fast delivery and great communication.',
  ];
  return {
    id: `REV-${100 + i}`,
    customerName: o.customerName,
    tailorName: o.tailorName,
    orderId: o.id,
    rating: randInt(2, 5),
    comment: pick(comments),
    date: o.date,
    status: pick(['Visible', 'Visible', 'Visible', 'Hidden']),
  };
});

export const complaints: Complaint[] = Array.from({ length: 22 }, (_, i) => {
  const o = pick(orders);
  const categories = ['Delayed Delivery', 'Poor Fitting', 'Damaged Fabric', 'Wrong Measurements', 'Payment Issue', 'Rude Behaviour', 'Order Mismatch'];
  const admins = ['Ritu Sinha', 'Amit Deshmukh', 'Kavya Menon', 'Unassigned'];
  const status = pick<'Open' | 'In Progress' | 'Resolved' | 'Closed'>(['Open', 'In Progress', 'Resolved', 'Closed']);
  return {
    ticketId: `TCK-${300 + i}`,
    customerName: o.customerName,
    orderId: o.id,
    category: pick(categories),
    submittedDate: o.date,
    priority: pick(['Low', 'Medium', 'High', 'Urgent']),
    status,
    assignedAdmin: status === 'Open' ? 'Unassigned' : pick(admins),
    resolution: status === 'Resolved' || status === 'Closed' ? 'Refund of ₹250 processed and customer notified.' : '',
    description: `Customer reported an issue regarding ${o.category.toLowerCase()} on order ${o.id}. Needs review by support team.`,
  };
});

export const notificationHistory: NotificationRecord[] = [
  { id: 'NTF-1', title: 'Independence Day Offer!', message: 'Flat 20% off on all stitching orders this week.', target: 'All Customers', sentDate: '2026-08-14', status: 'Sent', recipients: 12400 },
  { id: 'NTF-2', title: 'New Commission Structure', message: 'Updated commission rates effective Sept 1.', target: 'All Tailors', sentDate: '2026-08-10', status: 'Sent', recipients: 980 },
  { id: 'NTF-3', title: 'Diwali Collection Launch', message: 'Check out our new festive stitching categories.', target: 'Premium Members', sentDate: '2026-08-25', status: 'Scheduled', recipients: 3100 },
  { id: 'NTF-4', title: 'Profile Verification Reminder', message: 'Please complete your KYC to continue receiving orders.', target: 'Specific Tailor', sentDate: '2026-08-18', status: 'Sent', recipients: 1 },
];

export const locations: LocationEntry[] = CITIES.map((c, i) => ({
  id: `LOC-${i}`,
  state: c.state,
  city: c.city,
  serviceable: i !== CITIES.length - 1,
  tailorCount: randInt(5, 120),
}));

export const categories: Category[] = CATEGORIES.map((c, i) => ({
  id: `CAT-${i}`,
  name: c,
  subcategories: ['Standard', 'Premium', 'Express'],
  imageSeed: `cat${i}`,
  status: i === CATEGORIES.length - 1 ? 'Inactive' : 'Active',
  order: i + 1,
}));

export const dashboardStats = {
  totalCustomers: customers.length * 38,
  totalTailors: tailors.length * 12,
  activeTailors: tailors.filter(t => t.status === 'Active').length * 12,
  totalOrders: orders.length * 22,
  todayOrders: 47,
  completedOrders: orders.filter(o => o.status === 'Delivered').length * 22,
  revenue: 8420500,
  commission: 1010460,
  membershipIncome: 284900,
  advertisementIncome: 96400,
  pendingComplaints: complaints.filter(c => c.status === 'Open').length,
};

export const revenueTrend = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  revenue: randInt(450000, 950000),
  commission: randInt(50000, 120000),
}));

export const orderTrend = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  orders: randInt(900, 2600),
  cancelled: randInt(20, 140),
}));

export const customerGrowth = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  customers: randInt(200, 1400),
}));

export const tailorGrowth = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  tailors: randInt(20, 180),
}));

export const topCategories = CATEGORIES.slice(0, 6).map((c) => ({ name: c, orders: randInt(400, 3200) })).sort((a, b) => b.orders - a.orders);
export const topCities = CITIES.slice(0, 6).map((c) => ({ name: c.city, orders: randInt(600, 4200) })).sort((a, b) => b.orders - a.orders);

export const incomeBreakdown = [
  { name: 'Booking Commission', value: 1010460 },
  { name: 'Memberships', value: 284900 },
  { name: 'Advertisements', value: 96400 },
  { name: 'Featured Listings', value: 52100 },
  { name: 'Product Listings', value: 18700 },
  { name: 'Other', value: 9200 },
];
