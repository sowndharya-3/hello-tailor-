import { create } from 'zustand';
import { CATEGORIES } from '@/data/categories';
import {
  Order, OrderStage, ORDER_STAGES, initialOrders,
  NotificationItem, initialNotifications, MembershipPlan, membershipPlans,
} from '@/data/mockData';

export interface DayHours {
  day: string;
  open: boolean;
  from: string; // '09:00'
  to: string; // '19:00'
}

export const DEFAULT_HOURS: DayHours[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
  day, open: day !== 'Sun', from: '10:00', to: '19:30',
}));

export interface PriceEntry {
  categoryId: string;
  type: 'Starting at' | 'Fixed';
  price: string;
  notes?: string;
}

export interface TailorProfile {
  name: string;
  phone: string;
  tailorType: 'home' | 'shop' | null;
  shopName: string;
  about: string;
  experience: string;
  photoUrl: string;
  coverUrl: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  categories: string[];
  prices: PriceEntry[];
  hours: DayHours[];
  photos: string[];
  minOrderValue: string;
  minLeadTime: string;
  stitchDuration: string;
  deliveryDuration: string;
  verified: boolean;
  online: boolean;
  activePlan: MembershipPlan | null;
  planExpiry: string | null;
  activeAd: { placement: string; expiry: string } | null;
  featuredActive: boolean;
  featuredExpiry: string | null;
}

const defaultProfile: TailorProfile = {
  name: 'Ramesh Kumar',
  phone: '+91 98450 12345',
  tailorType: 'shop',
  shopName: 'Kumar Tailoring House',
  about: 'Specialists in bridal blouses, lehengas and men\'s formal wear with 15+ years of experience in custom stitching.',
  experience: '15',
  photoUrl: 'https://picsum.photos/seed/tailorprofile/300',
  coverUrl: 'https://picsum.photos/seed/tailorshop/800/400',
  address: '12, MG Road, Near Central Mall',
  landmark: 'Opposite Axis Bank',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560001',
  categories: ['blouse', 'lehenga', 'salwar', 'sherwani', 'alteration'],
  prices: [
    { categoryId: 'blouse', type: 'Starting at', price: '450', notes: 'Includes lining' },
    { categoryId: 'lehenga', type: 'Starting at', price: '2500', notes: 'Excludes embroidery' },
    { categoryId: 'salwar', type: 'Fixed', price: '900' },
    { categoryId: 'sherwani', type: 'Starting at', price: '3200' },
    { categoryId: 'alteration', type: 'Starting at', price: '150' },
  ],
  hours: DEFAULT_HOURS,
  photos: [
    'https://picsum.photos/seed/shop1/500',
    'https://picsum.photos/seed/shop2/500',
    'https://picsum.photos/seed/shop3/500',
  ],
  minOrderValue: '300',
  minLeadTime: '2 days',
  stitchDuration: '4 days',
  deliveryDuration: '1 day',
  verified: true,
  online: true,
  activePlan: membershipPlans[1],
  planExpiry: new Date(Date.now() + 62 * 24 * 3600 * 1000).toISOString(),
  activeAd: null,
  featuredActive: false,
  featuredExpiry: null,
};

interface StoreState {
  profile: TailorProfile;
  updateProfile: (patch: Partial<TailorProfile>) => void;
  toggleOnline: () => void;
  profileCompletion: () => number;

  orders: Order[];
  acceptOrder: (id: string) => void;
  rejectOrder: (id: string, reason: string, note?: string) => void;
  advanceOrderStage: (id: string, stage: OrderStage) => void;
  cancelOrder: (id: string, reason: string) => void;

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  buyPlan: (plan: MembershipPlan) => void;
  buyAd: (placement: string, days: number) => void;
  buyFeatured: (days: number) => void;

  authPhone: string;
  setAuthPhone: (phone: string) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  profile: defaultProfile,
  updateProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),
  toggleOnline: () => set((s) => ({ profile: { ...s.profile, online: !s.profile.online } })),
  profileCompletion: () => {
    const p = get().profile;
    const checks = [
      !!p.name, !!p.shopName, !!p.about, !!p.experience, !!p.photoUrl, !!p.coverUrl,
      !!p.address && !!p.city && !!p.pincode, p.categories.length > 0, p.prices.length > 0,
      p.hours.some((h) => h.open), p.photos.length > 0, !!p.minOrderValue,
    ];
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  },

  orders: initialOrders,
  acceptOrder: (id) => set((s) => ({
    orders: s.orders.map((o) => o.id === id
      ? { ...o, status: 'Accepted', history: [...o.history, { stage: 'Accepted', at: new Date().toISOString() }] }
      : o),
  })),
  rejectOrder: (id, reason, note) => set((s) => ({
    orders: s.orders.map((o) => o.id === id
      ? { ...o, status: 'Rejected', rejectReason: note ? `${reason} — ${note}` : reason }
      : o),
  })),
  advanceOrderStage: (id, stage) => set((s) => ({
    orders: s.orders.map((o) => o.id === id
      ? { ...o, status: stage, history: [...o.history, { stage, at: new Date().toISOString() }] }
      : o),
  })),
  cancelOrder: (id, reason) => set((s) => ({
    orders: s.orders.map((o) => o.id === id ? { ...o, status: 'Cancelled', cancelReason: reason } : o),
  })),

  notifications: initialNotifications,
  markNotificationRead: (id) => set((s) => ({
    notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
  })),
  markAllNotificationsRead: () => set((s) => ({
    notifications: s.notifications.map((n) => ({ ...n, read: true })),
  })),

  buyPlan: (plan) => set((s) => ({
    profile: {
      ...s.profile, activePlan: plan,
      planExpiry: new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString(),
    },
  })),
  buyAd: (placement, days) => set((s) => ({
    profile: { ...s.profile, activeAd: { placement, expiry: new Date(Date.now() + days * 24 * 3600 * 1000).toISOString() } },
  })),
  buyFeatured: (days) => set((s) => ({
    profile: { ...s.profile, featuredActive: true, featuredExpiry: new Date(Date.now() + days * 24 * 3600 * 1000).toISOString() },
  })),

  authPhone: '',
  setAuthPhone: (phone) => set({ authPhone: phone }),
}));

export { ORDER_STAGES, CATEGORIES };
