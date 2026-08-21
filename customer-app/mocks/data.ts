// In-memory mock data for the whole app. No backend — everything here is fake but realistic.
export type Tailor = {
  id: string;
  name: string;
  shopName: string;
  image: string;
  cover: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  startingPrice: number;
  categories: string[];
  type: 'Home' | 'Shop';
  isOpen: boolean;
  featured: boolean;
  city: string;
  locality: string;
  about: string;
  workingHours: string;
  deliveryDays: number;
  gallery: string[];
  services: { id: string; name: string; price: number; unit: string }[];
};

const seedImg = (seed: string, w = 400, h = 400) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const categories = [
  { id: 'men', name: 'Men', icon: 'shirt-outline' },
  { id: 'women', name: 'Women', icon: 'woman-outline' },
  { id: 'kids', name: 'Kids', icon: 'happy-outline' },
  { id: 'blouse', name: 'Blouse', icon: 'cut-outline' },
  { id: 'shirt', name: 'Shirt', icon: 'shirt-outline' },
  { id: 'pant', name: 'Pant', icon: 'body-outline' },
  { id: 'suit', name: 'Suit', icon: 'briefcase-outline' },
  { id: 'kurti', name: 'Kurti', icon: 'shirt-outline' },
  { id: 'dress', name: 'Dress', icon: 'sparkles-outline' },
  { id: 'alteration', name: 'Alteration', icon: 'construct-outline' },
];

const localities = ['Anna Nagar', 'T. Nagar', 'Adyar', 'Velachery', 'Mylapore', 'Nungambakkam', 'Kilpauk', 'Porur'];

const tailorNames = [
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
  ['Karthik Raja', 'Karthik Men’s Wear Tailors'],
  ['Sudha Narayan', 'Sudha Ethnic Wear Stitching'],
];

export const tailors: Tailor[] = tailorNames.map(([name, shopName], i) => {
  const cats = categories.filter((_, idx) => (idx + i) % 3 === 0).map((c) => c.name);
  return {
    id: `t${i + 1}`,
    name,
    shopName,
    image: seedImg(`tailor${i}`, 300, 300),
    cover: seedImg(`shop${i}`, 800, 400),
    distanceKm: +(0.6 + i * 0.4).toFixed(1),
    rating: +(3.8 + ((i * 7) % 12) / 10).toFixed(1),
    reviewCount: 20 + i * 17,
    experienceYears: 3 + (i % 10),
    startingPrice: 250 + i * 50,
    categories: cats.length ? cats : ['Men', 'Alteration'],
    type: i % 2 === 0 ? 'Shop' : 'Home',
    isOpen: i % 4 !== 0,
    featured: i % 3 === 0,
    city: 'Chennai',
    locality: localities[i % localities.length],
    about:
      `${name.split(' ')[0]} has been crafting well-fitted garments for over ${3 + (i % 10)} years, specialising in ${cats[0] ?? 'Men’s'} wear with a focus on precise measurements and on-time delivery.`,
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
  };
});

export const reviews = [
  { id: 'r1', tailorId: 't1', name: 'Priya Venkatesh', avatar: seedImg('u1', 100, 100), rating: 5, date: '2 weeks ago', text: 'Excellent fitting for my blouse, stitched exactly to my measurements. Highly recommend!', verified: true },
  { id: 'r2', tailorId: 't1', name: 'Arjun Mehta', avatar: seedImg('u2', 100, 100), rating: 4, date: '1 month ago', text: 'Good quality stitching, delivery was a day late but worth the wait.', verified: true },
  { id: 'r3', tailorId: 't1', name: 'Divya Shree', avatar: seedImg('u3', 100, 100), rating: 5, date: '1 month ago', text: 'Best tailor in Anna Nagar. Perfect fit every single time.', verified: false },
  { id: 'r4', tailorId: 't2', name: 'Ganesh Moorthy', avatar: seedImg('u4', 100, 100), rating: 5, date: '3 days ago', text: 'Amazing work on my wedding suit, very professional.', verified: true },
];

export const offers = [
  { id: 'o1', code: 'FIRST150', title: 'Flat ₹150 off on your first order', discount: '₹150 OFF', minOrder: 500, validity: '31 Aug 2026', terms: 'Valid for new customers only. Not combinable with other offers.' },
  { id: 'o2', code: 'STITCH20', title: '20% off on stitching services', discount: '20% OFF', minOrder: 800, validity: '15 Sep 2026', terms: 'Maximum discount ₹300. Valid on stitching category only.' },
  { id: 'o3', code: 'BLOUSE100', title: '₹100 off on blouse orders', discount: '₹100 OFF', minOrder: 400, validity: '10 Sep 2026', terms: 'Valid on blouse stitching orders above ₹400.' },
  { id: 'o4', code: 'WELCOME', title: 'Free alteration on your next visit', discount: 'FREE', minOrder: 0, validity: '30 Sep 2026', terms: 'One alteration item free, valid once per customer.' },
];

export const familyMembers = [
  { id: 'f1', name: 'Anitha Sharma', relationship: 'Spouse', gender: 'Female', dob: '14 Mar 1990', avatar: seedImg('fam1', 200, 200) },
  { id: 'f2', name: 'Rohan Sharma', relationship: 'Son', gender: 'Male', dob: '02 Jul 2014', avatar: seedImg('fam2', 200, 200) },
  { id: 'f3', name: 'Kamala Devi', relationship: 'Mother', gender: 'Female', dob: '21 Nov 1962', avatar: seedImg('fam3', 200, 200) },
];

export type Address = {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

export const addresses: Address[] = [
  { id: 'a1', label: 'Home', address: '12/4 Lake View Apartments, 2nd Street', landmark: 'Near Anna Nagar Tower Park', city: 'Chennai', state: 'Tamil Nadu', pincode: '600040', isDefault: true },
  { id: 'a2', label: 'Work', address: 'Tidel Park, Module 4, 3rd Floor', landmark: 'Opposite Taramani Railway Station', city: 'Chennai', state: 'Tamil Nadu', pincode: '600113', isDefault: false },
];

export type Measurement = {
  id: string;
  label: string;
  personId: string;
  category: string;
  date: string;
  fields: Record<string, string>;
};

export const measurements: Measurement[] = [
  { id: 'm1', label: 'My Shirt Measurement', personId: 'self', category: 'Shirt', date: '12 Jun 2026', fields: { Chest: '38 in', Waist: '34 in', Shoulder: '17 in', SleeveLength: '24 in', ShirtLength: '29 in', Collar: '15.5 in' } },
  { id: 'm2', label: 'Anitha Blouse Measurement', personId: 'f1', category: 'Blouse', date: '02 Jul 2026', fields: { Bust: '36 in', Waist: '32 in', ShoulderToWaist: '15 in', SleeveLength: '6 in', ArmRound: '12 in' } },
  { id: 'm3', label: 'Rohan Shirt Measurement', personId: 'f2', category: 'Shirt', date: '18 Jul 2026', fields: { Chest: '28 in', Waist: '26 in', Shoulder: '12 in', SleeveLength: '18 in', ShirtLength: '20 in' } },
];

export type OrderStage =
  | 'Booking Placed' | 'Accepted' | 'Pickup Scheduled' | 'Cloth Received' | 'Stitching Started'
  | 'In Progress' | 'Quality Check' | 'Ready' | 'Out for Delivery' | 'Delivered';

export const orderStages: OrderStage[] = [
  'Booking Placed', 'Accepted', 'Pickup Scheduled', 'Cloth Received', 'Stitching Started',
  'In Progress', 'Quality Check', 'Ready', 'Out for Delivery', 'Delivered',
];

export type Order = {
  id: string;
  tailorId: string;
  category: string;
  status: 'Active' | 'Completed' | 'Cancelled';
  currentStageIndex: number;
  placedOn: string;
  estimatedDelivery: string;
  amount: number;
  advancePaid: number;
  balanceDue: number;
  discount: number;
  tax: number;
  deliveryFee: number;
  paymentMethod: string;
};

export const orders: Order[] = [
  { id: 'HT-20260812-1041', tailorId: 't1', category: 'Shirt Stitching', status: 'Active', currentStageIndex: 5, placedOn: '12 Aug 2026', estimatedDelivery: '22 Aug 2026', amount: 850, advancePaid: 300, balanceDue: 550, discount: 50, tax: 42, deliveryFee: 0, paymentMethod: 'UPI' },
  { id: 'HT-20260805-0932', tailorId: 't2', category: 'Blouse Stitching', status: 'Completed', currentStageIndex: 9, placedOn: '05 Aug 2026', estimatedDelivery: '13 Aug 2026', amount: 650, advancePaid: 650, balanceDue: 0, discount: 0, tax: 33, deliveryFee: 40, paymentMethod: 'Card' },
  { id: 'HT-20260728-0714', tailorId: 't3', category: 'Suit Stitching', status: 'Completed', currentStageIndex: 9, placedOn: '28 Jul 2026', estimatedDelivery: '10 Aug 2026', amount: 3800, advancePaid: 3800, balanceDue: 0, discount: 200, tax: 190, deliveryFee: 0, paymentMethod: 'UPI' },
  { id: 'HT-20260718-0512', tailorId: 't4', category: 'Alteration', status: 'Cancelled', currentStageIndex: 1, placedOn: '18 Jul 2026', estimatedDelivery: '—', amount: 180, advancePaid: 0, balanceDue: 0, discount: 0, tax: 9, deliveryFee: 0, paymentMethod: '—' },
];

export type NotificationItem = {
  id: string;
  type: 'booking' | 'payment' | 'progress' | 'offers' | 'membership' | 'delivery' | 'system';
  title: string;
  body: string;
  time: string;
  read: boolean;
};

export const notifications: NotificationItem[] = [
  { id: 'n1', type: 'progress', title: 'Stitching started', body: 'Master Stitch Tailoring has started stitching your shirt order HT-20260812-1041.', time: '2h ago', read: false },
  { id: 'n2', type: 'offers', title: 'New offer for you', body: 'Get ₹150 off using code FIRST150 on your next order.', time: '5h ago', read: false },
  { id: 'n3', type: 'payment', title: 'Advance payment received', body: '₹300 advance received for order HT-20260812-1041.', time: '1d ago', read: true },
  { id: 'n4', type: 'booking', title: 'Booking confirmed', body: 'Your booking with Master Stitch Tailoring is confirmed for 12 Aug.', time: '1d ago', read: true },
  { id: 'n5', type: 'delivery', title: 'Out for delivery', body: 'Your blouse order HT-20260805-0932 is out for delivery.', time: '3d ago', read: true },
  { id: 'n6', type: 'membership', title: 'Membership expiring soon', body: 'Your Hello Tailor Gold membership expires in 5 days. Renew now.', time: '4d ago', read: true },
  { id: 'n7', type: 'system', title: 'App updated', body: 'We’ve improved measurement tracking. Check it out under Profile.', time: '6d ago', read: true },
];

export const complaints = [
  { id: 'c1', orderId: 'HT-20260805-0932', category: 'Stitching Quality', description: 'The blouse sleeve length is shorter than the measurement I provided.', status: 'Resolved' as const, date: '14 Aug 2026', adminResponse: 'We apologise for the inconvenience. A free alteration has been scheduled at no extra cost.', resolution: 'Alteration completed and redelivered on 16 Aug 2026.' },
  { id: 'c2', orderId: 'HT-20260812-1041', category: 'Delivery Delay', description: 'Order was expected yesterday, still not delivered.', status: 'In Progress' as const, date: '21 Aug 2026', adminResponse: 'We have followed up with the tailor, new delivery slot is being arranged.', resolution: '' },
];

export const faqs = [
  { q: 'How do I book a tailor?', a: 'Go to Home or Tailors tab, choose a tailor, select category, add measurements and design photos, then confirm your booking date.' },
  { q: 'Can I use saved measurements for family members?', a: 'Yes, add family members under Profile > Family Members and their measurements will appear as a quick option while booking.' },
  { q: 'How is the advance payment calculated?', a: 'Advance is typically 30-50% of the order value depending on the tailor and category, shown clearly before you pay.' },
  { q: 'What if I’m not satisfied with the stitching?', a: 'Raise a complaint from Profile > Support with your order details and photos, our team resolves it within 48 hours.' },
  { q: 'Can I reschedule pickup or delivery?', a: 'Yes, contact the tailor via Support Chat or call support to reschedule before the scheduled slot.' },
];

export const membershipPlans = [
  { id: 'p1', name: 'Gold – 3 Months', price: 299, duration: '3 Months', benefits: ['Free pickup & delivery', '10% off every order', 'Priority stitching slots'] },
  { id: 'p2', name: 'Gold – 12 Months', price: 999, duration: '12 Months', benefits: ['Free pickup & delivery', '15% off every order', 'Priority stitching slots', '2 free alterations/month'] },
];

export const walletTransactions = [
  { id: 'w1', type: 'credit' as const, label: 'Referral reward', amount: 100, date: '18 Aug 2026' },
  { id: 'w2', type: 'debit' as const, label: 'Used on order HT-20260812-1041', amount: 50, date: '12 Aug 2026' },
  { id: 'w3', type: 'refund' as const, label: 'Refund for cancelled order', amount: 180, date: '18 Jul 2026' },
  { id: 'w4', type: 'reward' as const, label: 'Membership signup bonus', amount: 50, date: '01 Jul 2026' },
];

export const loyaltyHistory = [
  { id: 'l1', label: 'Earned on order HT-20260812-1041', points: 85, date: '12 Aug 2026', type: 'earned' as const },
  { id: 'l2', label: 'Redeemed for ₹50 discount', points: -100, date: '05 Aug 2026', type: 'redeemed' as const },
  { id: 'l3', label: 'Earned on order HT-20260728-0714', points: 380, date: '28 Jul 2026', type: 'earned' as const },
];

export const referrals = [
  { id: 're1', name: 'Kiran Kumar', status: 'Joined', reward: 100, date: '10 Aug 2026' },
  { id: 're2', name: 'Swathi Reddy', status: 'Joined', reward: 100, date: '02 Aug 2026' },
  { id: 're3', name: 'Vishal Nair', status: 'Pending', reward: 0, date: '19 Aug 2026' },
];

export const materials = [
  { id: 'mat1', name: 'Premium Cotton Shirting Fabric', price: 450, unit: 'per meter', image: seedImg('mat1'), category: 'Cotton' },
  { id: 'mat2', name: 'Linen Blend Suiting Fabric', price: 890, unit: 'per meter', image: seedImg('mat2'), category: 'Linen' },
  { id: 'mat3', name: 'Pure Silk Blouse Material', price: 1200, unit: 'per meter', image: seedImg('mat3'), category: 'Silk' },
  { id: 'mat4', name: 'Georgette Kurti Fabric', price: 380, unit: 'per meter', image: seedImg('mat4'), category: 'Georgette' },
  { id: 'mat5', name: 'Wool Blend Blazer Fabric', price: 1550, unit: 'per meter', image: seedImg('mat5'), category: 'Wool' },
  { id: 'mat6', name: 'Cotton Kids Printed Fabric', price: 260, unit: 'per meter', image: seedImg('mat6'), category: 'Cotton' },
];

export const readymade = [
  { id: 'rd1', name: 'Men’s Formal Cotton Shirt', price: 1299, image: seedImg('rd1'), category: 'Men' },
  { id: 'rd2', name: 'Women’s Embroidered Kurti', price: 1599, image: seedImg('rd2'), category: 'Women' },
  { id: 'rd3', name: 'Kids Party Wear Dress', price: 999, image: seedImg('rd3'), category: 'Kids' },
  { id: 'rd4', name: 'Men’s Slim Fit Blazer', price: 3499, image: seedImg('rd4'), category: 'Men' },
  { id: 'rd5', name: 'Women’s Anarkali Suit Set', price: 2199, image: seedImg('rd5'), category: 'Women' },
  { id: 'rd6', name: 'Kids Cotton Ethnic Set', price: 799, image: seedImg('rd6'), category: 'Kids' },
];

export const clothTypesByCategory: Record<string, string[]> = {
  Shirt: ['Cotton', 'Linen', 'Poly-Cotton', 'Silk'],
  Pant: ['Cotton Twill', 'Wool Blend', 'Linen'],
  Suit: ['Wool', 'Wool Blend', 'Tweed'],
  Blouse: ['Silk', 'Cotton', 'Georgette', 'Net'],
  Kurti: ['Cotton', 'Georgette', 'Rayon'],
  Dress: ['Georgette', 'Crepe', 'Satin'],
  Men: ['Cotton', 'Linen', 'Poly-Cotton'],
  Women: ['Silk', 'Cotton', 'Georgette'],
  Kids: ['Cotton', 'Poly-Cotton'],
  Alteration: ['N/A'],
};

export const measurementFieldsByCategory: Record<string, string[]> = {
  Shirt: ['Chest', 'Waist', 'Shoulder', 'Sleeve Length', 'Shirt Length', 'Collar'],
  Pant: ['Waist', 'Hip', 'Inseam', 'Outseam', 'Thigh', 'Bottom'],
  Suit: ['Chest', 'Waist', 'Shoulder', 'Sleeve Length', 'Jacket Length', 'Collar'],
  Blouse: ['Bust', 'Waist', 'Shoulder to Waist', 'Sleeve Length', 'Arm Round'],
  Kurti: ['Bust', 'Waist', 'Hip', 'Kurti Length', 'Sleeve Length'],
  Dress: ['Bust', 'Waist', 'Hip', 'Dress Length', 'Shoulder'],
  Men: ['Chest', 'Waist', 'Shoulder', 'Sleeve Length', 'Length'],
  Women: ['Bust', 'Waist', 'Hip', 'Length'],
  Kids: ['Chest', 'Waist', 'Length'],
  Alteration: ['Notes'],
};
