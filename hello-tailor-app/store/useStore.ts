// Hello Tailor — single unified store for all three roles (customer/tailor/admin).
// One session (role + auth) and one shared `bookings[]` array is the whole point of the
// merge: a booking made as a customer is immediately visible to the tailor role (filtered
// by tailorId) and to the admin orders table (unfiltered) — no separate mock datasets.
import { create } from 'zustand';
import type {
  Role, Booking, BookingStatus, NotificationItem, Tailor, Customer, Review, Payment,
  CommissionEntry, MembershipPlan, Coupon, Advertisement, Complaint, LocationEntry,
  AdminCategory, AdminNotification,
} from './types';
import {
  tailors as seedTailors, customers as seedCustomers, initialBookings, initialNotifications,
  reviews as seedReviews, payments as seedPayments, commissions as seedCommissions,
  membershipPlans as seedMembershipPlans, coupons as seedCoupons, advertisements as seedAds, complaints as seedComplaints,
  familyMembers as seedFamily, addresses as seedAddresses, measurements as seedMeasurements,
  locations as seedLocations, adminCategories as seedAdminCategories,
  ME_CUSTOMER, ME_TAILOR_ID,
} from '@/data/seed';
import type { Address, Measurement } from '@/data/seed';

export interface DayHours { day: string; open: boolean; from: string; to: string }
export const DEFAULT_HOURS: DayHours[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
  day, open: day !== 'Sun', from: '10:00', to: '19:30',
}));

export interface PriceEntry { categoryId: string; type: 'Starting at' | 'Fixed'; price: string; notes?: string }

export type CartItem = { id: string; name: string; price: number; image: string; qty: number };

export type BookingDraft = {
  tailorId?: string;
  category?: string;
  personId?: string;
  clothType?: string;
  material?: string;
  colour?: string;
  quantity?: number;
  customerProvidedCloth?: boolean;
  clothNotes?: string;
  designPhotos?: string[];
  measurementId?: string;
  newMeasurement?: Record<string, string>;
  bookingDate?: string;
  deliveryDate?: string;
  method?: Booking['pickupType'];
  addressId?: string;
  timeSlot?: string;
  notes?: string;
  couponCode?: string;
};

interface StoreState {
  // ---- session ----
  loggedIn: boolean;
  phone: string;
  role: Role | null;
  login: (phone: string) => void;
  logout: () => void;
  selectRole: (role: Role) => void;
  switchRole: () => void; // back to role-select without logging out
  language: 'English' | 'Tamil';
  setLanguage: (l: 'English' | 'Tamil') => void;

  // ---- shared cross-role data ----
  bookings: Booking[];
  createBooking: (b: Booking) => void;
  acceptBooking: (id: string) => void;
  rejectBooking: (id: string, reason: string, note?: string) => void;
  advanceBookingStage: (id: string, stage: BookingStatus) => void;
  cancelBooking: (id: string, reason: string) => void;

  tailors: Tailor[];
  customers: Customer[];
  reviews: Review[];
  payments: Payment[];
  commissions: CommissionEntry[];
  coupons: Coupon[];
  advertisements: Advertisement[];
  complaints: Complaint[];

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (audience: Role) => void;

  // ---- admin-only mutations (mock, in-memory) ----
  updateCustomerStatus: (id: string, status: Customer['status']) => void;
  updateTailorStatus: (id: string, status: Tailor['status']) => void;
  updateTailorVerification: (id: string, verification: Tailor['verification']) => void;
  updateTailorById: (id: string, patch: Partial<Tailor>) => void;

  addCoupon: (c: Coupon) => void;
  updateCoupon: (id: string, patch: Partial<Coupon>) => void;
  toggleCouponStatus: (id: string) => void;
  deleteCoupon: (id: string) => void;

  addAd: (a: Advertisement) => void;
  updateAd: (id: string, patch: Partial<Advertisement>) => void;
  toggleAdStatus: (id: string) => void;
  deleteAd: (id: string) => void;

  toggleReviewStatus: (id: string) => void;
  updateComplaint: (id: string, patch: Partial<Complaint>) => void;

  locations: LocationEntry[];
  toggleLocationServiceable: (id: string) => void;

  adminCategories: AdminCategory[];
  addCategory: (c: AdminCategory) => void;
  updateCategory: (id: string, patch: Partial<AdminCategory>) => void;
  toggleCategoryStatus: (id: string) => void;

  membershipPlans: MembershipPlan[];
  updateMembershipPlan: (id: string, patch: Partial<MembershipPlan>) => void;

  adminNotifications: AdminNotification[];
  sendNotification: (n: AdminNotification) => void;

  commissionRate: number;
  setCommissionRate: (rate: number) => void;
  gstRate: number;
  gstNumber: string;
  setGstConfig: (patch: { gstRate?: number; gstNumber?: string }) => void;

  // ---- customer-only ----
  booking: BookingDraft;
  updateBooking: (patch: Partial<BookingDraft>) => void;
  resetBooking: () => void;
  family: typeof seedFamily;
  addFamilyMember: (m: (typeof seedFamily)[number]) => void;
  addresses: Address[];
  addAddress: (a: Address) => void;
  setDefaultAddress: (id: string) => void;
  removeAddress: (id: string) => void;
  measurements: Measurement[];
  addMeasurement: (m: Measurement) => void;
  walletBalance: number;
  loyaltyPoints: number;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;

  // ---- tailor-only (profile of the demo logged-in tailor, id = ME_TAILOR_ID) ----
  myTailorId: string;
  updateTailorProfile: (patch: Partial<Tailor>) => void;
  toggleOnline: () => void;
  myHours: DayHours[];
  setHours: (h: DayHours[]) => void;
  myPrices: PriceEntry[];
  setPrices: (p: PriceEntry[]) => void;
  buyPlan: (plan: MembershipPlan) => void;
  buyAd: (placement: string, days: number) => void;

  authPhone: string;
  setAuthPhone: (phone: string) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  loggedIn: false,
  phone: '',
  role: null,
  login: (p) => set({ phone: p, loggedIn: true }),
  logout: () => set({ loggedIn: false, role: null }),
  selectRole: (role) => set({ role }),
  switchRole: () => set({ role: null }),
  language: 'English',
  setLanguage: (l) => set({ language: l }),

  bookings: initialBookings,
  createBooking: (b) => set((s) => ({
    bookings: [b, ...s.bookings],
    notifications: [
      { id: `nt-${b.id}`, audience: 'tailor', type: 'booking', title: 'New booking request', body: `${b.customerName} requested ${b.category}.`, time: new Date().toISOString(), read: false },
      ...s.notifications,
    ],
  })),
  acceptBooking: (id) => set((s) => ({
    bookings: s.bookings.map((b) => b.id === id ? { ...b, status: 'Accepted', history: [...b.history, { stage: 'Accepted', at: new Date().toISOString() }] } : b),
  })),
  rejectBooking: (id, reason, note) => set((s) => ({
    bookings: s.bookings.map((b) => b.id === id ? { ...b, status: 'Rejected', rejectReason: note ? `${reason} — ${note}` : reason } : b),
  })),
  advanceBookingStage: (id, stage) => set((s) => ({
    bookings: s.bookings.map((b) => b.id === id ? { ...b, status: stage, history: [...b.history, { stage, at: new Date().toISOString() }] } : b),
  })),
  cancelBooking: (id, reason) => set((s) => ({
    bookings: s.bookings.map((b) => b.id === id ? { ...b, status: 'Cancelled', cancelReason: reason } : b),
  })),

  tailors: seedTailors,
  customers: seedCustomers,
  reviews: seedReviews,
  payments: seedPayments,
  commissions: seedCommissions,
  coupons: seedCoupons,
  advertisements: seedAds,
  complaints: seedComplaints,

  notifications: initialNotifications,
  markNotificationRead: (id) => set((s) => ({ notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n) })),
  markAllNotificationsRead: (audience) => set((s) => ({ notifications: s.notifications.map((n) => n.audience === audience ? { ...n, read: true } : n) })),

  updateCustomerStatus: (id, status) => set((s) => ({ customers: s.customers.map((c) => c.id === id ? { ...c, status } : c) })),
  updateTailorStatus: (id, status) => set((s) => ({ tailors: s.tailors.map((t) => t.id === id ? { ...t, status } : t) })),
  updateTailorVerification: (id, verification) => set((s) => ({ tailors: s.tailors.map((t) => t.id === id ? { ...t, verification, ...(verification === 'Verified' ? { verified: true } : {}) } : t) })),
  updateTailorById: (id, patch) => set((s) => ({ tailors: s.tailors.map((t) => t.id === id ? { ...t, ...patch } : t) })),

  addCoupon: (c) => set((s) => ({ coupons: [c, ...s.coupons] })),
  updateCoupon: (id, patch) => set((s) => ({ coupons: s.coupons.map((c) => c.id === id ? { ...c, ...patch } : c) })),
  toggleCouponStatus: (id) => set((s) => ({ coupons: s.coupons.map((c) => c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c) })),
  deleteCoupon: (id) => set((s) => ({ coupons: s.coupons.filter((c) => c.id !== id) })),

  addAd: (a) => set((s) => ({ advertisements: [a, ...s.advertisements] })),
  updateAd: (id, patch) => set((s) => ({ advertisements: s.advertisements.map((a) => a.id === id ? { ...a, ...patch } : a) })),
  toggleAdStatus: (id) => set((s) => ({ advertisements: s.advertisements.map((a) => a.id === id ? { ...a, status: a.status === 'Active' ? 'Paused' : 'Active' } : a) })),
  deleteAd: (id) => set((s) => ({ advertisements: s.advertisements.filter((a) => a.id !== id) })),

  toggleReviewStatus: (id) => set((s) => ({ reviews: s.reviews.map((r) => r.id === id ? { ...r, status: r.status === 'Visible' ? 'Hidden' : 'Visible' } : r) })),
  updateComplaint: (id, patch) => set((s) => ({ complaints: s.complaints.map((c) => c.id === id ? { ...c, ...patch } : c) })),

  locations: seedLocations,
  toggleLocationServiceable: (id) => set((s) => ({ locations: s.locations.map((l) => l.id === id ? { ...l, serviceable: !l.serviceable } : l) })),

  adminCategories: seedAdminCategories,
  addCategory: (c) => set((s) => ({ adminCategories: [...s.adminCategories, c] })),
  updateCategory: (id, patch) => set((s) => ({ adminCategories: s.adminCategories.map((c) => c.id === id ? { ...c, ...patch } : c) })),
  toggleCategoryStatus: (id) => set((s) => ({ adminCategories: s.adminCategories.map((c) => c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c) })),

  membershipPlans: seedMembershipPlans,
  updateMembershipPlan: (id, patch) => set((s) => ({ membershipPlans: s.membershipPlans.map((p) => p.id === id ? { ...p, ...patch } : p) })),

  adminNotifications: [],
  sendNotification: (n) => set((s) => ({ adminNotifications: [n, ...s.adminNotifications] })),

  commissionRate: 10,
  setCommissionRate: (rate) => set({ commissionRate: rate }),
  gstRate: 18,
  gstNumber: '33ABCDE1234F1Z5',
  setGstConfig: (patch) => set((s) => ({ gstRate: patch.gstRate ?? s.gstRate, gstNumber: patch.gstNumber ?? s.gstNumber })),

  booking: {},
  updateBooking: (patch) => set((s) => ({ booking: { ...s.booking, ...patch } })),
  resetBooking: () => set({ booking: {} }),
  family: seedFamily,
  addFamilyMember: (m) => set((s) => ({ family: [...s.family, m] })),
  addresses: seedAddresses,
  addAddress: (a) => set((s) => ({ addresses: [...s.addresses, a] })),
  setDefaultAddress: (id) => set((s) => ({ addresses: s.addresses.map((a) => ({ ...a, isDefault: a.id === id })) })),
  removeAddress: (id) => set((s) => ({ addresses: s.addresses.filter((a) => a.id !== id) })),
  measurements: seedMeasurements,
  addMeasurement: (m) => set((s) => ({ measurements: [...s.measurements, m] })),
  walletBalance: 340,
  loyaltyPoints: 620,
  cart: [],
  addToCart: (item) => set((s) => {
    const existing = s.cart.find((c) => c.id === item.id);
    if (existing) return { cart: s.cart.map((c) => (c.id === item.id ? { ...c, qty: c.qty + item.qty } : c)) };
    return { cart: [...s.cart, item] };
  }),
  removeFromCart: (id) => set((s) => ({ cart: s.cart.filter((c) => c.id !== id) })),

  myTailorId: ME_TAILOR_ID,
  updateTailorProfile: (patch) => set((s) => ({ tailors: s.tailors.map((t) => t.id === s.myTailorId ? { ...t, ...patch } : t) })),
  toggleOnline: () => set((s) => ({ tailors: s.tailors.map((t) => t.id === s.myTailorId ? { ...t, online: !t.online } : t) })),
  myHours: DEFAULT_HOURS,
  setHours: (h) => set({ myHours: h }),
  myPrices: [
    { categoryId: 'blouse', type: 'Starting at', price: '450', notes: 'Includes lining' },
    { categoryId: 'shirt', type: 'Fixed', price: '350' },
    { categoryId: 'suit', type: 'Starting at', price: '3200' },
    { categoryId: 'alteration', type: 'Starting at', price: '150' },
  ],
  setPrices: (p) => set({ myPrices: p }),
  buyPlan: (plan) => set((s) => ({ tailors: s.tailors.map((t) => t.id === s.myTailorId ? { ...t, membership: plan.name } : t) })),
  buyAd: () => {},

  authPhone: '',
  setAuthPhone: (phone) => set({ authPhone: phone }),
}));

// Convenience selectors used across role screens.
export const useMyTailor = () => useStore((s) => s.tailors.find((t) => t.id === s.myTailorId)!);
export const useMyBookings = () => useStore((s) => s.bookings.filter((b) => b.tailorId === s.myTailorId));
export const useCustomerBookings = () => useStore((s) => s.bookings.filter((b) => b.customerId === 'me'));

export { ME_CUSTOMER, ME_TAILOR_ID };
export type { Booking, BookingStatus, Tailor, Customer } from './types';
