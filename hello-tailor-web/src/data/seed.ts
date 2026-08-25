// Seed / mock data generator for the whole merged app — no backend, everything in-memory.
// ponytail: small seeded PRNG so the "random" data is stable across renders/reloads instead
// of re-randomizing on every render (same trick admin-panel used).
import type {
  Tailor, Customer, Booking, NotificationItem, Review, Payment, CommissionEntry,
  MembershipPlan, Coupon, Advertisement, Complaint, LocationEntry, AdminCategory, Category,
} from '@/store/types';

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
const seedImg = (s: string, w = 400, h = 400) => `https://picsum.photos/seed/${s}/${w}/${h}`;
const now = Date.now();
const daysAgo = (n: number) => new Date(now - n * 24 * 3600 * 1000).toISOString();
const daysFwd = (n: number) => new Date(now + n * 24 * 3600 * 1000).toISOString();
const hrsAgo = (n: number) => new Date(now - n * 3600 * 1000).toISOString();

export const CITIES: { city: string; state: string }[] = [
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Bengaluru', state: 'Karnataka' },
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Delhi', state: 'Delhi' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Ahmedabad', state: 'Gujarat' },
];

const localities = ['Anna Nagar', 'T. Nagar', 'Adyar', 'Velachery', 'Mylapore', 'Nungambakkam', 'Kilpauk', 'Indiranagar', 'Andheri West', 'Banjara Hills'];

export const categories: Category[] = [
  { id: 'men', name: 'Men', icon: 'shirt-outline' },
  { id: 'women', name: 'Women', icon: 'woman-outline' },
  { id: 'kids', name: 'Kids', icon: 'happy-outline' },
  { id: 'blouse', name: 'Blouse', icon: 'cut-outline' },
  { id: 'shirt', name: 'Shirt', icon: 'shirt-outline' },
  { id: 'pant', name: 'Pant', icon: 'body-outline' },
  { id: 'suit', name: 'Suit', icon: 'briefcase-outline' },
  { id: 'kurti', name: 'Kurti', icon: 'shirt-outline' },
  { id: 'dress', name: 'Dress', icon: 'sparkles-outline' },
  { id: 'lehenga', name: 'Lehenga', icon: 'sparkles-outline' },
  { id: 'sherwani', name: 'Sherwani', icon: 'shirt-outline' },
  { id: 'alteration', name: 'Alteration', icon: 'construct-outline' },
];
export const categoryNames = categories.map((c) => c.name);

const tailorNames: [string, string][] = [
  ['Rajendran Kumar', 'Master Stitch Tailoring'],
  ['Meena Selvi', "Meena's Boutique & Blouse Works"],
  ['Suresh Babu', 'Royal Gents Tailors'],
  ['Kavitha Raman', 'Kavitha Ladies Tailoring'],
  ['Anwar Basha', 'Al-Ameen Tailoring House'],
  ['Lakshmi Priya', 'Priya Designer Blouse Point'],
  ['Vignesh Iyer', 'Vignesh Perfect Fit Studio'],
  ['Fathima Begum', 'Fathima Kurti & Dress Works'],
  ['Manoharan S', 'Manohar Suits & Blazers'],
  ['Devi Shankar', 'Devi Alteration Experts'],
  ['Karthik Raja', "Karthik Men's Wear Tailors"],
  ['Sudha Narayan', 'Sudha Ethnic Wear Stitching'],
  ['Ramesh Kumar', 'Kumar Tailoring House'],
  ['Anitha Bose', 'Anitha Designer Studio'],
  ['Vikram Singh', 'Singh Gents Corner'],
  ['Pooja Menon', 'Pooja Fashion House'],
  ['Arjun Reddy', 'Reddy Custom Tailors'],
  ['Divya Nair', 'Divya Boutique'],
  ['Sanjay Gupta', 'Gupta Formal Wear'],
  ['Neha Chauhan', 'Neha Ethnic Studio'],
];

export const tailors: Tailor[] = tailorNames.map(([name, shopName], i) => {
  const loc = CITIES[i % CITIES.length];
  const cats = categoryNames.filter((_, idx) => (idx + i) % 3 === 0);
  return {
    id: `t${i + 1}`,
    name,
    shopName,
    phone: `+91 9${randInt(100000000, 999999999)}`,
    email: `${name.toLowerCase().replace(/ /g, '.')}${i}@mail.com`,
    image: seedImg(`tailor${i}`, 300, 300),
    cover: seedImg(`shop${i}`, 800, 400),
    distanceKm: +(0.6 + i * 0.4).toFixed(1),
    rating: +(3.8 + ((i * 7) % 12) / 10).toFixed(1),
    reviewCount: 20 + i * 17,
    experienceYears: 3 + (i % 15),
    startingPrice: 250 + i * 50,
    categories: cats.length ? cats : ['Men', 'Alteration'],
    type: i % 2 === 0 ? 'Shop' : 'Home',
    isOpen: i % 4 !== 0,
    online: i % 5 !== 0,
    featured: i % 3 === 0,
    verified: i % 4 !== 3,
    city: loc.city,
    state: loc.state,
    locality: localities[i % localities.length],
    about: `${name.split(' ')[0]} has been crafting well-fitted garments for over ${3 + (i % 15)} years, specialising in ${cats[0] ?? "Men's"} wear with a focus on precise measurements and on-time delivery.`,
    workingHours: 'Mon–Sat, 10:00 AM – 8:30 PM',
    deliveryDays: 4 + (i % 5),
    gallery: [0, 1, 2, 3, 4, 5].map((g) => seedImg(`gal${i}-${g}`, 500, 500)),
    services: [
      { id: 's1', name: 'Shirt Stitching', price: 350 + i * 10, unit: 'per piece' },
      { id: 's2', name: 'Pant Stitching', price: 400 + i * 10, unit: 'per piece' },
      { id: 's3', name: 'Blouse Stitching', price: 450 + i * 10, unit: 'per piece' },
      { id: 's4', name: 'Suit (2pc)', price: 3200 + i * 40, unit: 'per set' },
      { id: 's5', name: 'Alteration', price: 120 + i * 5, unit: 'per item' },
    ],
    membership: pick(['None', 'None', 'Silver', 'Gold', 'Premium', 'Diamond']),
    status: pick(['Active', 'Active', 'Active', 'Blocked', 'Pending']),
    verification: i % 4 !== 3 ? 'Verified' : pick(['Pending', 'Rejected']),
    income: randInt(5000, 420000),
    commissionPaid: randInt(500, 42000),
    joinedDate: daysAgo(randInt(30, 500)),
  };
});

const firstNames = ['Priya', 'Rahul', 'Ananya', 'Vikram', 'Kavita', 'Arjun', 'Meera', 'Suresh', 'Divya', 'Rohan', 'Sneha', 'Karthik', 'Anitha', 'Ganesh', 'Swathi', 'Kiran', 'Vishal', 'Nisha'];
const lastNames = ['Sharma', 'Verma', 'Iyer', 'Singh', 'Nair', 'Reddy', 'Pillai', 'Gupta', 'Menon', 'Kapoor', 'Joshi', 'Rajan', 'Moorthy', 'Venkatesh', 'Mehta'];
function randomName() {
  return `${pick(firstNames)} ${pick(lastNames)}`;
}

export const customers: Customer[] = Array.from({ length: 24 }, (_, i) => {
  const loc = pick(CITIES);
  const name = randomName();
  return {
    id: `CUS-${1000 + i}`,
    name,
    mobile: `9${randInt(100000000, 999999999)}`,
    email: `${name.toLowerCase().replace(' ', '.')}${i}@mail.com`,
    city: loc.city,
    state: loc.state,
    joinedDate: daysAgo(randInt(10, 400)),
    ordersCount: randInt(0, 24),
    membership: pick(['None', 'None', 'None', 'Silver', 'Gold', 'Premium', 'Diamond']),
    status: pick(['Active', 'Active', 'Active', 'Active', 'Blocked', 'Pending']),
    avatar: seedImg(`cust${i}`, 200, 200),
    totalSpend: randInt(500, 85000),
  };
});

// "You" — the logged-in demo customer (id used by the customer role screens).
export const ME_CUSTOMER = { id: 'me', name: 'Arun Prakash', phone: '+91 98765 43210', avatar: seedImg('me', 200, 200) };
// "You" — the logged-in demo tailor (matches store/useStore tailor profile default = tailors[0]).
export const ME_TAILOR_ID = 't1';

const catNamesForOrders = categoryNames.filter((c) => !['Men', 'Women', 'Kids'].includes(c));

function measurementsFor(garment: string) {
  if (garment === 'Blouse') {
    return [{ garment: 'Blouse', fields: [{ label: 'Chest', value: '34 in' }, { label: 'Waist', value: '30 in' }, { label: 'Shoulder', value: '14 in' }, { label: 'Sleeve Length', value: '6 in' }, { label: 'Blouse Length', value: '15 in' }] }];
  }
  if (garment === 'Suit' || garment === 'Sherwani') {
    return [{ garment: 'Upper Wear', fields: [{ label: 'Chest', value: '40 in' }, { label: 'Shoulder', value: '18 in' }, { label: 'Sleeve Length', value: '24 in' }, { label: 'Length', value: '29 in' }, { label: 'Collar', value: '16 in' }] }];
  }
  return [{ garment, fields: [{ label: 'Length', value: '40 in' }, { label: 'Waist', value: '32 in' }, { label: 'Hip', value: '38 in' }] }];
}

function mkBooking(i: number, status: Booking['status'], opts: Partial<Booking> = {}): Booking {
  const tailor = tailors[i % tailors.length];
  const cust = i % 3 === 0 ? ME_CUSTOMER : pick(customers);
  const cat = catNamesForOrders[i % catNamesForOrders.length];
  const amount = 400 + (i % 12) * 350;
  return {
    id: `HT-${1000 + i}`,
    customerId: cust.id === 'me' ? 'me' : cust.id,
    customerName: cust.name,
    customerAvatar: cust.avatar,
    tailorId: tailor.id,
    tailorName: tailor.shopName,
    category: cat,
    city: tailor.city,
    state: tailor.state,
    bookingDate: daysAgo(randInt(0, 20)),
    deliveryDate: daysFwd(randInt(-5, 10)),
    amount,
    advanceAmount: Math.round(amount * 0.3),
    advancePaid: i % 3 !== 0,
    balancePaid: false,
    discount: i % 5 === 0 ? 50 : 0,
    tax: Math.round(amount * 0.05),
    deliveryFee: i % 4 === 0 ? 40 : 0,
    paymentMethod: pick(['UPI', 'Card', 'Cash', 'Wallet']),
    location: `${localities[i % localities.length]}, ${tailor.city}`,
    pickupType: pick(['Self Drop', 'Self Pickup', 'Tailor Pickup', 'Home Delivery']),
    status: 'Requested',
    notes: i % 2 === 0 ? 'Please use matching thread color, prefer a slightly loose fit.' : undefined,
    measurements: measurementsFor(cat === 'Blouse' ? 'Blouse' : cat === 'Suit' || cat === 'Sherwani' ? cat : 'Shirt'),
    designPhotos: [seedImg(`design${i}a`, 600, 600), seedImg(`design${i}b`, 600, 600)],
    requestedAt: daysAgo(randInt(0, 20)),
    history: [{ stage: 'Requested', at: daysAgo(randInt(0, 20)) }],
    ...opts,
  };
}

// Seed a realistic spread of statuses, weighted so `t1` (the demo tailor role) and `me`
// (the demo customer role) each have live examples across every stage.
export const initialBookings: Booking[] = [
  mkBooking(1, 'Requested', { tailorId: 't1', deliveryDate: daysFwd(5) }),
  mkBooking(2, 'Requested', { tailorId: 't1', deliveryDate: daysFwd(4) }),
  mkBooking(3, 'Accepted', { tailorId: 't1', deliveryDate: daysFwd(6) }),
  mkBooking(4, 'Cloth Received', { tailorId: 't1', deliveryDate: daysFwd(3) }),
  mkBooking(5, 'Stitching Started', { tailorId: 't1', deliveryDate: daysFwd(2), customerId: 'me', customerName: ME_CUSTOMER.name, customerAvatar: ME_CUSTOMER.avatar }),
  mkBooking(6, 'In Progress', { tailorId: 't1', deliveryDate: daysFwd(1) }),
  mkBooking(7, 'Ready', { tailorId: 't1', deliveryDate: daysFwd(1) }),
  mkBooking(8, 'Delivered', { tailorId: 't1', deliveryDate: daysAgo(1), advancePaid: true, balancePaid: true, customerId: 'me', customerName: ME_CUSTOMER.name, customerAvatar: ME_CUSTOMER.avatar }),
  mkBooking(9, 'Delivered', { tailorId: 't1', deliveryDate: daysAgo(4), advancePaid: true, balancePaid: true }),
  mkBooking(10, 'Rejected', { tailorId: 't1', rejectReason: 'Fully booked for this delivery window' }),
  mkBooking(11, 'Cancelled', { tailorId: 't1', cancelReason: 'Customer changed mind' }),
  ...Array.from({ length: 30 }, (_, i) => mkBooking(i + 12, pick(['Requested', 'Accepted', 'In Progress', 'Ready', 'Delivered', 'Cancelled']))),
];

export const reviews: Review[] = [
  { id: 'r1', tailorId: 't1', customerName: 'Priya Venkatesh', avatar: seedImg('u1', 100, 100), rating: 5, date: daysAgo(14), text: 'Excellent fitting for my blouse, stitched exactly to my measurements. Highly recommend!', verified: true, status: 'Visible' },
  { id: 'r2', tailorId: 't1', customerName: 'Arjun Mehta', avatar: seedImg('u2', 100, 100), rating: 4, date: daysAgo(30), text: 'Good quality stitching, delivery was a day late but worth the wait.', verified: true, status: 'Visible' },
  { id: 'r3', tailorId: 't1', customerName: 'Divya Shree', avatar: seedImg('u3', 100, 100), rating: 5, date: daysAgo(35), text: 'Best tailor in Anna Nagar. Perfect fit every single time.', verified: false, status: 'Visible' },
  { id: 'r4', tailorId: 't2', customerName: 'Ganesh Moorthy', avatar: seedImg('u4', 100, 100), rating: 5, date: daysAgo(3), text: 'Amazing work on my wedding suit, very professional.', verified: true, status: 'Visible' },
  { id: 'r5', tailorId: 't1', customerName: 'Vikram Singh', avatar: seedImg('u5', 100, 100), rating: 3, date: daysAgo(14), text: 'Decent work but delivery was 2 days late.', verified: true, status: 'Hidden' },
];

export const initialNotifications: NotificationItem[] = [
  { id: 'nc1', audience: 'customer', type: 'progress', title: 'Stitching started', body: 'Master Stitch Tailoring has started stitching your order.', time: hrsAgo(2), read: false },
  { id: 'nc2', audience: 'customer', type: 'offers', title: 'New offer for you', body: 'Get ₹150 off using code FIRST150 on your next order.', time: hrsAgo(5), read: false },
  { id: 'nc3', audience: 'customer', type: 'payment', title: 'Advance payment received', body: '₹300 advance received for your recent order.', time: daysAgo(1), read: true },
  { id: 'nc4', audience: 'customer', type: 'booking', title: 'Booking confirmed', body: 'Your booking with Master Stitch Tailoring is confirmed.', time: daysAgo(1), read: true },
  { id: 'nc5', audience: 'customer', type: 'delivery', title: 'Out for delivery', body: 'Your order is out for delivery.', time: daysAgo(3), read: true },
  { id: 'nt1', audience: 'tailor', type: 'booking', title: 'New booking request', body: 'You have a new booking request. Check your Bookings tab.', time: hrsAgo(1), read: false },
  { id: 'nt2', audience: 'tailor', type: 'payment', title: 'Advance payment received', body: '₹450 advance received from a customer.', time: hrsAgo(3), read: false },
  { id: 'nt3', audience: 'tailor', type: 'delivery_reminder', title: 'Delivery due tomorrow', body: 'One of your orders is due for delivery tomorrow.', time: hrsAgo(6), read: false },
  { id: 'nt4', audience: 'tailor', type: 'review', title: 'New 5-star review', body: 'A customer left a 5-star review on your service.', time: daysAgo(2), read: true },
  { id: 'na1', audience: 'admin', type: 'system', title: 'New tailor registration', body: 'A new tailor has submitted registration documents for verification.', time: hrsAgo(2), read: false },
  { id: 'na2', audience: 'admin', type: 'complaint', title: 'New complaint raised', body: 'A customer raised a complaint about delivery delay.', time: hrsAgo(5), read: false },
];

export const membershipPlans: MembershipPlan[] = [
  { id: 'silver', name: 'Silver', audience: 'Tailor', price: 499, duration: '3 months', color: '#8A94A6', benefits: ['Basic profile listing', 'Up to 20 bookings/month', 'Standard support'] },
  { id: 'gold', name: 'Gold', audience: 'Tailor', price: 999, duration: '6 months', color: '#D9A441', benefits: ['Priority listing in search', 'Unlimited bookings', 'Booking analytics', 'Priority support'] },
  { id: 'premium', name: 'Premium', audience: 'Tailor', price: 1799, duration: '12 months', color: '#0C7EBC', benefits: ['Top-of-search placement', 'Featured badge on profile', 'Advanced income reports'] },
  { id: 'diamond', name: 'Diamond', audience: 'Tailor', price: 2999, duration: '12 months', color: '#173B57', benefits: ['#1 placement in category', 'Dedicated account manager', 'Unlimited ad credits'] },
  { id: 'cust-gold-3', name: 'Gold', audience: 'Customer', price: 299, duration: '3 Months', color: '#D9A441', benefits: ['Free pickup & delivery', '10% off every order', 'Priority stitching slots'] },
  { id: 'cust-gold-12', name: 'Gold', audience: 'Customer', price: 999, duration: '12 Months', color: '#D9A441', benefits: ['Free pickup & delivery', '15% off every order', '2 free alterations/month'] },
];

export const coupons: Coupon[] = [
  { id: 'o1', code: 'FIRST150', title: 'Flat ₹150 off on your first order', discountType: 'Flat', discountValue: 150, minBooking: 500, maxDiscount: 150, validTo: '31 Aug 2026', eligibility: 'New Users', status: 'Active', usageCount: 214 },
  { id: 'o2', code: 'STITCH20', title: '20% off on stitching services', discountType: 'Percentage', discountValue: 20, minBooking: 800, maxDiscount: 300, validTo: '15 Sep 2026', eligibility: 'All Users', status: 'Active', usageCount: 96 },
  { id: 'o3', code: 'BLOUSE100', title: '₹100 off on blouse orders', discountType: 'Flat', discountValue: 100, minBooking: 400, maxDiscount: 100, validTo: '10 Sep 2026', eligibility: 'All Users', status: 'Active', usageCount: 58 },
  { id: 'o4', code: 'WELCOME', title: 'Free alteration on your next visit', discountType: 'Flat', discountValue: 0, minBooking: 0, maxDiscount: 0, validTo: '30 Sep 2026', eligibility: 'New Users', status: 'Inactive', usageCount: 340 },
];

export const advertisements: Advertisement[] = [
  { id: 'ad1', title: 'Festive Season Offers', type: 'Banner', placement: 'Home Banner', imageSeed: 'ad1', startDate: daysAgo(5), endDate: daysFwd(2), status: 'Active' },
  { id: 'ad2', title: 'Master Stitch — Category Top', type: 'Tailor Ad', placement: 'Category Top Listing', imageSeed: 'ad2', startDate: daysAgo(2), endDate: daysFwd(5), status: 'Active' },
  { id: 'ad3', title: 'Premium Cotton Fabric Launch', type: 'Material Ad', placement: 'Search Boost', imageSeed: 'ad3', startDate: daysFwd(3), endDate: daysFwd(10), status: 'Scheduled' },
];

export const complaints: Complaint[] = [
  { id: 'c1', bookingId: initialBookings[8]?.id ?? 'HT-1009', customerName: 'Priya Venkatesh', category: 'Stitching Quality', description: 'The blouse sleeve length is shorter than the measurement I provided.', submittedDate: daysAgo(7), priority: 'Medium', status: 'Resolved', assignedAdmin: 'Admin User', adminResponse: 'A free alteration has been scheduled at no extra cost.', resolution: 'Alteration completed and redelivered.' },
  { id: 'c2', bookingId: initialBookings[5]?.id ?? 'HT-1006', customerName: 'Arun Prakash', category: 'Delivery Delay', description: 'Order was expected yesterday, still not delivered.', submittedDate: daysAgo(1), priority: 'High', status: 'In Progress', assignedAdmin: 'Admin User', adminResponse: 'We have followed up with the tailor, new delivery slot is being arranged.', resolution: '' },
];

export const payments: Payment[] = initialBookings.slice(0, 20).map((b, i) => ({
  id: `PAY-${5000 + i}`,
  bookingId: b.id,
  customerName: b.customerName,
  tailorName: b.tailorName,
  type: b.advancePaid ? (b.balancePaid ? 'Full Payment' : 'Advance') : 'Advance',
  amount: b.advancePaid ? b.advanceAmount : 0,
  status: b.advancePaid ? 'Paid' : 'Pending',
  method: b.paymentMethod,
  gatewayRef: `GTW${randInt(100000, 999999)}`,
  date: b.bookingDate,
}));

export const commissions: CommissionEntry[] = initialBookings.slice(0, 15).map((b, i) => ({
  id: `COM-${7000 + i}`,
  bookingId: b.id,
  tailorName: b.tailorName,
  orderAmount: b.amount,
  commissionRate: 10,
  commissionAmount: Math.round(b.amount * 0.1),
  period: 'Aug 2026',
  status: i % 3 === 0 ? 'Pending' : 'Collected',
  date: b.bookingDate,
}));

export const locations: LocationEntry[] = CITIES.map((c, i) => ({
  id: `loc${i}`,
  state: c.state,
  city: c.city,
  serviceable: i < 6,
  tailorCount: tailors.filter((t) => t.city === c.city).length,
}));

export const adminCategories: AdminCategory[] = categories.map((c, i) => ({
  id: c.id,
  name: c.name,
  subcategories: [],
  imageSeed: c.id,
  status: 'Active' as const,
  order: i + 1,
}));

export const materials = [
  { id: 'mat1', name: 'Premium Cotton Shirting Fabric', price: 450, unit: 'per meter', image: seedImg('mat1'), category: 'Cotton' },
  { id: 'mat2', name: 'Linen Blend Suiting Fabric', price: 890, unit: 'per meter', image: seedImg('mat2'), category: 'Linen' },
  { id: 'mat3', name: 'Pure Silk Blouse Material', price: 1200, unit: 'per meter', image: seedImg('mat3'), category: 'Silk' },
  { id: 'mat4', name: 'Georgette Kurti Fabric', price: 380, unit: 'per meter', image: seedImg('mat4'), category: 'Georgette' },
];

export const readymade = [
  { id: 'rd1', name: "Men's Formal Cotton Shirt", price: 1299, image: seedImg('rd1'), category: 'Men' },
  { id: 'rd2', name: "Women's Embroidered Kurti", price: 1599, image: seedImg('rd2'), category: 'Women' },
  { id: 'rd3', name: 'Kids Party Wear Dress', price: 999, image: seedImg('rd3'), category: 'Kids' },
];

export const familyMembers = [
  { id: 'f1', name: 'Anitha Sharma', relationship: 'Spouse', gender: 'Female', dob: '14 Mar 1990', avatar: seedImg('fam1', 200, 200) },
  { id: 'f2', name: 'Rohan Sharma', relationship: 'Son', gender: 'Male', dob: '02 Jul 2014', avatar: seedImg('fam2', 200, 200) },
];

export type Address = { id: string; label: 'Home' | 'Work' | 'Other'; address: string; landmark: string; city: string; state: string; pincode: string; isDefault: boolean };
export const addresses: Address[] = [
  { id: 'a1', label: 'Home', address: '12/4 Lake View Apartments, 2nd Street', landmark: 'Near Anna Nagar Tower Park', city: 'Chennai', state: 'Tamil Nadu', pincode: '600040', isDefault: true },
  { id: 'a2', label: 'Work', address: 'Tidel Park, Module 4, 3rd Floor', landmark: 'Opposite Taramani Railway Station', city: 'Chennai', state: 'Tamil Nadu', pincode: '600113', isDefault: false },
];

export type Measurement = { id: string; label: string; personId: string; category: string; date: string; fields: Record<string, string> };
export const measurements: Measurement[] = [
  { id: 'm1', label: 'My Shirt Measurement', personId: 'self', category: 'Shirt', date: '12 Jun 2026', fields: { Chest: '38 in', Waist: '34 in', Shoulder: '17 in' } },
  { id: 'm2', label: 'Anitha Blouse Measurement', personId: 'f1', category: 'Blouse', date: '02 Jul 2026', fields: { Bust: '36 in', Waist: '32 in', ShoulderToWaist: '15 in' } },
];

export const faqs = [
  { q: 'How do I book a tailor?', a: 'Go to Home or Tailors tab, choose a tailor, select category, add measurements and design photos, then confirm your booking date.' },
  { q: 'How is the advance payment calculated?', a: 'Advance is typically 30-50% of the order value depending on the tailor and category.' },
];

export const walletTransactions = [
  { id: 'w1', type: 'credit' as const, label: 'Referral reward', amount: 100, date: daysAgo(3) },
  { id: 'w2', type: 'debit' as const, label: 'Used on order', amount: 50, date: daysAgo(9) },
];

export const loyaltyHistory = [
  { id: 'l1', label: 'Earned on order', points: 85, date: daysAgo(9), type: 'earned' as const },
  { id: 'l2', label: 'Redeemed for ₹50 discount', points: -100, date: daysAgo(16), type: 'redeemed' as const },
];

export const referrals = [
  { id: 're1', name: 'Kiran Kumar', status: 'Joined', reward: 100, date: daysAgo(11) },
  { id: 're2', name: 'Swathi Reddy', status: 'Pending', reward: 0, date: daysAgo(2) },
];

export const clothTypesByCategory: Record<string, string[]> = {
  Shirt: ['Cotton', 'Linen', 'Poly-Cotton', 'Silk'],
  Pant: ['Cotton Twill', 'Wool Blend', 'Linen'],
  Suit: ['Wool', 'Wool Blend', 'Tweed'],
  Blouse: ['Silk', 'Cotton', 'Georgette', 'Net'],
  Kurti: ['Cotton', 'Georgette', 'Rayon'],
  Dress: ['Georgette', 'Crepe', 'Satin'],
  Alteration: ['N/A'],
};

export const measurementFieldsByCategory: Record<string, string[]> = {
  Shirt: ['Chest', 'Waist', 'Shoulder', 'Sleeve Length', 'Shirt Length', 'Collar'],
  Pant: ['Waist', 'Hip', 'Inseam', 'Outseam', 'Thigh', 'Bottom'],
  Suit: ['Chest', 'Waist', 'Shoulder', 'Sleeve Length', 'Jacket Length', 'Collar'],
  Blouse: ['Bust', 'Waist', 'Shoulder to Waist', 'Sleeve Length', 'Arm Round'],
  Kurti: ['Bust', 'Waist', 'Hip', 'Kurti Length', 'Sleeve Length'],
  Dress: ['Bust', 'Waist', 'Hip', 'Dress Length', 'Shoulder'],
  Alteration: ['Notes'],
};

export const adPlacements = [
  { id: 'home-banner', name: 'Home Banner', description: 'Top banner slot on customer home screen', price: 799, duration: '7 days' },
  { id: 'category-top', name: 'Category Top Listing', description: 'Pinned above search results in your categories', price: 499, duration: '7 days' },
  { id: 'search-boost', name: 'Search Boost', description: 'Higher ranking for relevant customer searches', price: 349, duration: '7 days' },
];
