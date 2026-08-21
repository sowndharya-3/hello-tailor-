// Central mock domain data for the Tailor app (in-memory only, no backend).

export type OrderStage =
  | 'Accepted'
  | 'Cloth Received'
  | 'Stitching Started'
  | 'In Progress'
  | 'Quality Check'
  | 'Ready'
  | 'Completed';

export const ORDER_STAGES: OrderStage[] = [
  'Accepted',
  'Cloth Received',
  'Stitching Started',
  'In Progress',
  'Quality Check',
  'Ready',
  'Completed',
];

export type OrderStatus = 'requested' | OrderStage | 'Rejected' | 'Cancelled';

export type PaymentStatus = 'Paid' | 'Pending' | 'Not Required';

export interface Measurement {
  garment: string;
  fields: { label: string; value: string }[];
}

export interface Order {
  id: string;
  customerName: string;
  customerAvatar: string;
  category: string;
  bookingDate: string; // ISO
  deliveryDate: string; // ISO
  amount: number;
  advanceAmount: number;
  advancePaid: PaymentStatus;
  balancePaid: PaymentStatus;
  location: string;
  pickupType: 'Home Pickup' | 'Drop at Shop';
  status: OrderStatus;
  rejectReason?: string;
  cancelReason?: string;
  notes?: string;
  measurements: Measurement[];
  designPhotos: string[];
  requestedAt: string;
  history: { stage: string; at: string }[];
}

const now = Date.now();
const hrs = (n: number) => new Date(now + n * 3600 * 1000).toISOString();
const daysAgo = (n: number) => new Date(now - n * 24 * 3600 * 1000).toISOString();
const daysFwd = (n: number) => new Date(now + n * 24 * 3600 * 1000).toISOString();

const names = [
  'Priya Sharma', 'Rahul Verma', 'Ananya Iyer', 'Vikram Singh', 'Kavita Nair',
  'Arjun Reddy', 'Meera Pillai', 'Suresh Gupta', 'Divya Menon', 'Rohan Kapoor',
  'Sneha Joshi', 'Karthik Rajan',
];

const localities = [
  'Indiranagar, Bengaluru', 'Andheri West, Mumbai', 'T. Nagar, Chennai',
  'Banjara Hills, Hyderabad', 'Salt Lake, Kolkata', 'Koregaon Park, Pune',
  'Vasant Kunj, Delhi', 'Satellite, Ahmedabad',
];

const measurementsFor = (garment: string): Measurement[] => {
  if (garment === 'Blouse Stitching') {
    return [{
      garment: 'Blouse',
      fields: [
        { label: 'Chest', value: '34 in' },
        { label: 'Waist', value: '30 in' },
        { label: 'Shoulder', value: '14 in' },
        { label: 'Sleeve Length', value: '6 in' },
        { label: 'Blouse Length', value: '15 in' },
        { label: 'Neck Depth (Front)', value: '6 in' },
      ],
    }];
  }
  if (garment === "Men's Suit / Blazer" || garment === 'Sherwani') {
    return [{
      garment: 'Upper Wear',
      fields: [
        { label: 'Chest', value: '40 in' },
        { label: 'Shoulder', value: '18 in' },
        { label: 'Sleeve Length', value: '24 in' },
        { label: 'Length', value: '29 in' },
        { label: 'Collar', value: '16 in' },
      ],
    }];
  }
  return [{
    garment,
    fields: [
      { label: 'Length', value: '40 in' },
      { label: 'Waist', value: '32 in' },
      { label: 'Hip', value: '38 in' },
    ],
  }];
};

const catNames = [
  'Blouse Stitching', 'Lehenga Stitching', 'Salwar Kameez', "Men's Kurta Pajama",
  "Men's Suit / Blazer", 'Gown Stitching', 'Sherwani', 'Alterations & Resizing',
];

function mkOrder(i: number, status: OrderStatus, opts: Partial<Order> = {}): Order {
  const cat = catNames[i % catNames.length];
  const name = names[i % names.length];
  const amount = 800 + (i % 9) * 450;
  return {
    id: `ORD-${1000 + i}`,
    customerName: name,
    customerAvatar: `https://picsum.photos/seed/cust${i}/200`,
    category: cat,
    bookingDate: opts.bookingDate ?? daysAgo(3 - (i % 4)),
    deliveryDate: opts.deliveryDate ?? daysFwd((i % 6) + 1),
    amount,
    advanceAmount: Math.round(amount * 0.3),
    advancePaid: i % 3 === 0 ? 'Pending' : 'Paid',
    balancePaid: status === 'Completed' ? 'Paid' : 'Pending',
    location: localities[i % localities.length],
    pickupType: i % 2 === 0 ? 'Home Pickup' : 'Drop at Shop',
    status,
    notes: i % 2 === 0 ? 'Please use matching thread color, customer prefers a slightly loose fit around the waist.' : undefined,
    measurements: measurementsFor(cat),
    designPhotos: [
      `https://picsum.photos/seed/design${i}a/600`,
      `https://picsum.photos/seed/design${i}b/600`,
      `https://picsum.photos/seed/design${i}c/600`,
    ],
    requestedAt: daysAgo(3 - (i % 4)),
    history: [{ stage: 'Requested', at: daysAgo(3 - (i % 4)) }],
    ...opts,
  };
}

export const initialOrders: Order[] = [
  mkOrder(1, 'requested', { deliveryDate: daysFwd(5) }),
  mkOrder(2, 'requested', { deliveryDate: daysFwd(4) }),
  mkOrder(3, 'requested', { deliveryDate: daysFwd(7) }),
  mkOrder(4, 'Accepted', { deliveryDate: daysFwd(3) }),
  mkOrder(5, 'Cloth Received', { deliveryDate: daysFwd(2) }),
  mkOrder(6, 'Stitching Started', { deliveryDate: daysFwd(1) }),
  mkOrder(7, 'In Progress', { deliveryDate: daysFwd(2) }),
  mkOrder(8, 'Quality Check', { deliveryDate: daysFwd(1) }),
  mkOrder(9, 'Ready', { deliveryDate: daysFwd(1) }),
  mkOrder(10, 'Completed', { deliveryDate: daysAgo(1) }),
  mkOrder(11, 'Completed', { deliveryDate: daysAgo(3) }),
  mkOrder(12, 'Completed', { deliveryDate: daysAgo(6) }),
  mkOrder(13, 'Rejected', { rejectReason: 'Fully booked for this delivery window' }),
  mkOrder(14, 'Cancelled', { cancelReason: 'Customer changed mind, chose different fabric elsewhere' }),
  mkOrder(15, 'Cancelled', { cancelReason: 'Duplicate booking created by mistake' }),
];

export interface ReviewItem {
  id: string;
  customerName: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  category: string;
}

export const reviews: ReviewItem[] = [
  { id: 'r1', customerName: 'Priya Sharma', avatar: 'https://picsum.photos/seed/cust1/200', rating: 5, comment: 'Beautiful blouse fitting, delivered a day early. Highly recommend!', date: daysAgo(2), category: 'Blouse Stitching' },
  { id: 'r2', customerName: 'Rahul Verma', avatar: 'https://picsum.photos/seed/cust2/200', rating: 4, comment: 'Good stitching quality, sleeve length was slightly off but they fixed it quickly.', date: daysAgo(5), category: "Men's Suit / Blazer" },
  { id: 'r3', customerName: 'Ananya Iyer', avatar: 'https://picsum.photos/seed/cust3/200', rating: 5, comment: 'Best tailor in Indiranagar. My lehenga fit perfectly for the wedding.', date: daysAgo(9), category: 'Lehenga Stitching' },
  { id: 'r4', customerName: 'Vikram Singh', avatar: 'https://picsum.photos/seed/cust4/200', rating: 3, comment: 'Decent work but delivery was 2 days late.', date: daysAgo(14), category: 'Sherwani' },
  { id: 'r5', customerName: 'Kavita Nair', avatar: 'https://picsum.photos/seed/cust5/200', rating: 5, comment: 'Very professional, kept me updated at every stage.', date: daysAgo(20), category: 'Gown Stitching' },
];

export type NotificationType =
  | 'booking' | 'cancelled' | 'payment' | 'order_reminder'
  | 'delivery_reminder' | 'review' | 'membership' | 'advertisement' | 'system';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  at: string;
  read: boolean;
}

export const initialNotifications: NotificationItem[] = [
  { id: 'n1', type: 'booking', title: 'New booking request', body: 'Priya Sharma requested Blouse Stitching for ' + new Date(daysFwd(5)).toLocaleDateString('en-IN'), at: hrs(-1), read: false },
  { id: 'n2', type: 'payment', title: 'Advance payment received', body: '₹450 advance received from Rahul Verma for ORD-1002', at: hrs(-3), read: false },
  { id: 'n3', type: 'delivery_reminder', title: 'Delivery due tomorrow', body: 'ORD-1009 (Ananya Iyer) is due for delivery tomorrow', at: hrs(-6), read: false },
  { id: 'n4', type: 'cancelled', title: 'Booking cancelled', body: 'Customer cancelled ORD-1014 — Duplicate booking created by mistake', at: daysAgo(1), read: true },
  { id: 'n5', type: 'review', title: 'New 5-star review', body: 'Priya Sharma left a 5-star review on your Blouse Stitching service', at: daysAgo(2), read: true },
  { id: 'n6', type: 'order_reminder', title: 'Stitching pending', body: 'ORD-1007 has been "In Progress" for 3 days — update the status', at: daysAgo(2), read: true },
  { id: 'n7', type: 'membership', title: 'Gold plan expiring soon', body: 'Your Gold membership expires in 5 days. Renew to keep premium visibility.', at: daysAgo(3), read: true },
  { id: 'n8', type: 'advertisement', title: 'Ad campaign live', body: 'Your "Festive Season Offers" ad is now live on the home banner', at: daysAgo(4), read: true },
  { id: 'n9', type: 'system', title: 'Profile verified', body: 'Your shop profile has been verified by the Hello Tailor team', at: daysAgo(10), read: true },
];

export interface MembershipPlan {
  id: string;
  name: 'Silver' | 'Gold' | 'Premium' | 'Diamond';
  price: number;
  duration: string;
  color: string;
  benefits: string[];
}

export const membershipPlans: MembershipPlan[] = [
  { id: 'silver', name: 'Silver', price: 499, duration: '3 months', color: '#8A94A6', benefits: ['Basic profile listing', 'Up to 20 bookings/month', 'Standard support'] },
  { id: 'gold', name: 'Gold', price: 999, duration: '6 months', color: '#D9A441', benefits: ['Priority listing in search', 'Unlimited bookings', 'Booking analytics', 'Priority support'] },
  { id: 'premium', name: 'Premium', price: 1799, duration: '12 months', color: '#0C7EBC', benefits: ['Top-of-search placement', 'Featured badge on profile', 'Advanced income reports', '2 free ad credits'] },
  { id: 'diamond', name: 'Diamond', price: 2999, duration: '12 months', color: '#173B57', benefits: ['#1 placement in category', 'Dedicated account manager', 'Unlimited ad credits', 'Early access to new features'] },
];

export interface AdPlacement {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
}

export const adPlacements: AdPlacement[] = [
  { id: 'home-banner', name: 'Home Banner', description: 'Top banner slot on customer home screen', price: 799, duration: '7 days' },
  { id: 'category-top', name: 'Category Top Listing', description: 'Pinned above search results in your categories', price: 499, duration: '7 days' },
  { id: 'search-boost', name: 'Search Boost', description: 'Higher ranking for relevant customer searches', price: 349, duration: '7 days' },
];
