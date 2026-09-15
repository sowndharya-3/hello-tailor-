// Shared domain types for Hello Tailor — used by all three roles (customer/tailor/admin).
// This is the "superset" shape: one Booking record is written by the customer booking flow,
// read by the tailor bookings/orders screens, and read by the admin orders table — that shared
// array is what makes this one app instead of three apps glued together.

export type Role = 'customer' | 'tailor' | 'admin';

export type Category = { id: string; name: string; icon: string };

export type TailorService = { id: string; name: string; price: number; unit: string };

export type Tailor = {
  id: string;
  name: string;
  shopName: string;
  phone: string;
  email: string;
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
  online: boolean;
  featured: boolean;
  verified: boolean;
  city: string;
  state: string;
  locality: string;
  about: string;
  workingHours: string;
  deliveryDays: number;
  gallery: string[];
  services: TailorService[];
  membership: 'None' | 'Silver' | 'Gold' | 'Premium' | 'Diamond';
  status: 'Active' | 'Blocked' | 'Pending' | 'Inactive';
  verification: 'Verified' | 'Pending' | 'Rejected';
  income: number;
  commissionPaid: number;
  joinedDate: string;
};

export type Customer = {
  id: string;
  name: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  joinedDate: string;
  ordersCount: number;
  membership: 'None' | 'Silver' | 'Gold' | 'Premium' | 'Diamond';
  status: 'Active' | 'Blocked' | 'Pending' | 'Inactive';
  avatar: string;
  totalSpend: number;
};

// The full lifecycle a booking can move through — union of customer/tailor/admin stage names.
export type BookingStatus =
  | 'Requested'
  | 'Accepted'
  | 'Rejected'
  | 'Pickup Scheduled'
  | 'Cloth Received'
  | 'Stitching Started'
  | 'In Progress'
  | 'Quality Check'
  | 'Ready'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export const BOOKING_STAGES: BookingStatus[] = [
  'Requested',
  'Accepted',
  'Pickup Scheduled',
  'Cloth Received',
  'Stitching Started',
  'In Progress',
  'Quality Check',
  'Ready',
  'Out for Delivery',
  'Delivered',
];

export type BookingMeasurement = { garment: string; fields: { label: string; value: string }[] };

// THE cross-role record. customer booking-confirm -> pushes one of these.
// tailor bookings/orders screens filter by tailorId. admin orders table reads all of them.
export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  tailorId: string;
  tailorName: string;
  category: string;
  gender?: 'Men' | 'Women' | 'Kids';
  service?: string;
  customerProvidedCloth?: boolean;
  materialPreference?: string;
  colourPreference?: string;
  pickupSlot?: string;
  finalDeliveryMethod?: 'Self Pickup' | 'Home Delivery';
  quoteStatus?: 'Pending' | 'Sent' | 'Accepted' | 'Changes Requested' | 'Rejected';
  stitchingCharge?: number;
  materialCost?: number;
  pickupFee?: number;
  customizationCharge?: number;
  tailorNotes?: string;
  city: string;
  state: string;
  bookingDate: string; // ISO
  deliveryDate: string; // ISO
  amount: number;
  advanceAmount: number;
  advancePaid: boolean;
  balancePaid: boolean;
  discount: number;
  tax: number;
  deliveryFee: number;
  paymentMethod: 'UPI' | 'Card' | 'Cash' | 'Wallet' | 'Net Banking' | '—';
  location: string;
  pickupType: 'Self Drop' | 'Self Pickup' | 'Tailor Pickup' | 'Home Delivery' | 'Drop at Shop';
  status: BookingStatus;
  rejectReason?: string;
  cancelReason?: string;
  notes?: string;
  measurements: BookingMeasurement[];
  designPhotos: string[];
  requestedAt: string; // ISO
  history: { stage: string; at: string }[];
}

export type NotificationItem = {
  id: string;
  audience: Role;
  type: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

export type Review = {
  id: string;
  tailorId: string;
  customerName: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
  status: 'Visible' | 'Hidden';
  orderId?: string;
};

export type Payment = {
  id: string;
  bookingId: string;
  customerName: string;
  tailorName: string;
  type: 'Advance' | 'Balance' | 'Full Payment' | 'Refund';
  amount: number;
  status: 'Paid' | 'Partial' | 'Pending' | 'Refunded' | 'Failed';
  method: string;
  gatewayRef: string;
  date: string;
};

export type CommissionEntry = {
  id: string;
  bookingId: string;
  tailorName: string;
  orderAmount: number;
  commissionRate: number;
  commissionAmount: number;
  period: string;
  status: 'Collected' | 'Pending';
  date: string;
};

export type MembershipPlan = {
  id: string;
  name: 'Silver' | 'Gold' | 'Premium' | 'Diamond';
  audience: 'Tailor' | 'Customer';
  price: number;
  duration: string;
  color: string;
  benefits: string[];
};

export type Coupon = {
  id: string;
  code: string;
  title: string;
  discountType: 'Percentage' | 'Flat';
  discountValue: number;
  minBooking: number;
  maxDiscount: number;
  validTo: string;
  eligibility: 'All Users' | 'New Users' | 'Premium Members';
  status: 'Active' | 'Inactive';
  usageCount: number;
};

export type Advertisement = {
  id: string;
  title: string;
  type: 'Tailor Ad' | 'Banner' | 'Material Ad';
  placement: string;
  imageSeed: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Scheduled' | 'Expired' | 'Paused';
};

export type Complaint = {
  id: string;
  bookingId: string;
  customerName: string;
  category: string;
  description: string;
  submittedDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedAdmin: string;
  adminResponse: string;
  resolution: string;
};

export type LocationEntry = { id: string; state: string; city: string; serviceable: boolean; tailorCount: number };

export type AdminCategory = { id: string; name: string; subcategories: string[]; imageSeed: string; status: 'Active' | 'Inactive'; order: number };

// Admin-sent broadcast notifications (distinct from the per-user notification feed above).
export type AdminNotification = {
  id: string;
  title: string;
  message: string;
  target: 'All Customers' | 'All Tailors' | 'Premium Members' | 'Specific Tailor' | 'Specific Customer';
  sentDate: string;
  status: 'Sent' | 'Scheduled';
  recipients: number;
};
