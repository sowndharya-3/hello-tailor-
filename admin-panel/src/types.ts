export type Status = 'Active' | 'Blocked' | 'Pending' | 'Inactive';

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  joinedDate: string;
  orders: number;
  membership: 'None' | 'Silver' | 'Gold' | 'Premium' | 'Diamond';
  status: Status;
  avatarSeed: string;
  totalSpend: number;
}

export type TailorType = 'Home' | 'Shop';

export interface Tailor {
  id: string;
  name: string;
  shopName: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  type: TailorType;
  categories: string[];
  joinedDate: string;
  orders: number;
  rating: number;
  membership: 'None' | 'Silver' | 'Gold' | 'Premium' | 'Diamond';
  status: Status;
  verification: 'Verified' | 'Pending' | 'Rejected';
  avatarSeed: string;
  income: number;
  commissionPaid: number;
  experience: number;
}

export type OrderStatus =
  | 'Placed'
  | 'Confirmed'
  | 'Measurement Scheduled'
  | 'In Stitching'
  | 'Ready'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentStatus = 'Paid' | 'Partial' | 'Pending' | 'Refunded' | 'Failed';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  tailorId: string;
  tailorName: string;
  category: string;
  city: string;
  state: string;
  date: string;
  amount: number;
  advance: number;
  balance: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'UPI' | 'Card' | 'Cash' | 'Wallet' | 'Net Banking';
  timeline: { label: string; date: string; done: boolean }[];
}

export interface Payment {
  id: string;
  orderId: string;
  customerName: string;
  tailorName: string;
  type: 'Advance' | 'Balance' | 'Full Payment' | 'Refund';
  amount: number;
  status: PaymentStatus;
  gatewayRef: string;
  method: string;
  date: string;
}

export interface CommissionEntry {
  id: string;
  orderId: string;
  tailorName: string;
  orderAmount: number;
  commissionRate: number;
  commissionAmount: number;
  period: string;
  status: 'Collected' | 'Pending';
  date: string;
}

export interface MembershipPlan {
  id: string;
  name: 'Silver' | 'Gold' | 'Premium' | 'Diamond';
  audience: 'Tailor' | 'Customer';
  price: number;
  duration: string;
  benefits: string[];
  featureLimits: { label: string; value: string }[];
  visible: boolean;
  active: boolean;
  color: string;
}

export interface MembershipRecord {
  id: string;
  userType: 'Tailor' | 'Customer';
  userName: string;
  plan: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Expired' | 'Cancelled';
  amountPaid: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'Percentage' | 'Flat';
  discountValue: number;
  minBooking: number;
  maxDiscount: number;
  validFrom: string;
  validTo: string;
  eligibility: 'All Users' | 'New Users' | 'Premium Members';
  status: 'Active' | 'Inactive';
  usageCount: number;
}

export interface Advertisement {
  id: string;
  title: string;
  type: 'Tailor Ad' | 'Banner' | 'Material Ad';
  placement: string;
  imageSeed: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Scheduled' | 'Expired' | 'Paused';
}

export interface Review {
  id: string;
  customerName: string;
  tailorName: string;
  orderId: string;
  rating: number;
  comment: string;
  date: string;
  status: 'Visible' | 'Hidden';
}

export interface Complaint {
  ticketId: string;
  customerName: string;
  orderId: string;
  category: string;
  submittedDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedAdmin: string;
  resolution: string;
  description: string;
}

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  target: string;
  sentDate: string;
  status: 'Sent' | 'Scheduled';
  recipients: number;
}

export interface LocationEntry {
  id: string;
  state: string;
  city: string;
  serviceable: boolean;
  tailorCount: number;
}

export interface Category {
  id: string;
  name: string;
  subcategories: string[];
  imageSeed: string;
  status: 'Active' | 'Inactive';
  order: number;
}
