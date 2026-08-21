import React, { createContext, useContext, useState, useMemo } from 'react';
import { notifications as seedNotifications, NotificationItem, familyMembers as seedFamily, addresses as seedAddresses, measurements as seedMeasurements } from '../mocks/data';

export type BookingDraft = {
  tailorId?: string;
  category?: string;
  personId?: string; // 'self' or family member id
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
  method?: 'Self Drop' | 'Self Pickup' | 'Tailor Pickup' | 'Home Delivery';
  addressId?: string;
  timeSlot?: string;
  notes?: string;
  couponCode?: string;
};

type Ctx = {
  loggedIn: boolean;
  phone: string;
  login: (phone: string) => void;
  logout: () => void;
  language: 'English' | 'Tamil';
  setLanguage: (l: 'English' | 'Tamil') => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  booking: BookingDraft;
  updateBooking: (patch: Partial<BookingDraft>) => void;
  resetBooking: () => void;
  family: typeof seedFamily;
  addFamilyMember: (m: (typeof seedFamily)[number]) => void;
  addresses: typeof seedAddresses;
  addAddress: (a: (typeof seedAddresses)[number]) => void;
  setDefaultAddress: (id: string) => void;
  removeAddress: (id: string) => void;
  measurements: typeof seedMeasurements;
  addMeasurement: (m: (typeof seedMeasurements)[number]) => void;
  walletBalance: number;
  loyaltyPoints: number;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
};

export type CartItem = { id: string; name: string; price: number; image: string; qty: number };

const AppContext = createContext<Ctx | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState<'English' | 'Tamil'>('English');
  const [notifications, setNotifications] = useState(seedNotifications);
  const [booking, setBooking] = useState<BookingDraft>({});
  const [family, setFamily] = useState(seedFamily);
  const [addresses, setAddresses] = useState(seedAddresses);
  const [measurementsList, setMeasurementsList] = useState(seedMeasurements);
  const [cart, setCart] = useState<CartItem[]>([]);

  const value = useMemo<Ctx>(
    () => ({
      loggedIn,
      phone,
      login: (p: string) => {
        setPhone(p);
        setLoggedIn(true);
      },
      logout: () => setLoggedIn(false),
      language,
      setLanguage,
      notifications,
      markNotificationRead: (id: string) =>
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n))),
      markAllRead: () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),
      booking,
      updateBooking: (patch: Partial<BookingDraft>) => setBooking((prev) => ({ ...prev, ...patch })),
      resetBooking: () => setBooking({}),
      family,
      addFamilyMember: (m) => setFamily((prev) => [...prev, m]),
      addresses,
      addAddress: (a) => setAddresses((prev) => [...prev, a]),
      setDefaultAddress: (id: string) =>
        setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id }))),
      removeAddress: (id: string) => setAddresses((prev) => prev.filter((a) => a.id !== id)),
      measurements: measurementsList,
      addMeasurement: (m) => setMeasurementsList((prev) => [...prev, m]),
      walletBalance: 340,
      loyaltyPoints: 620,
      cart,
      addToCart: (item: CartItem) =>
        setCart((prev) => {
          const existing = prev.find((c) => c.id === item.id);
          if (existing) return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + item.qty } : c));
          return [...prev, item];
        }),
      removeFromCart: (id: string) => setCart((prev) => prev.filter((c) => c.id !== id)),
    }),
    [loggedIn, phone, language, notifications, booking, family, addresses, measurementsList, cart]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppStateProvider');
  return ctx;
}
