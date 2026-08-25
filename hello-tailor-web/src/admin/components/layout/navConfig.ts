import {
  LayoutDashboard, Users, Scissors, Home, Store, ShoppingBag, Wallet, Percent,
  Crown, Gem, Ticket, Megaphone, Star, MessageSquareWarning, Bell, MapPin,
  LayoutGrid, BarChart3, TrendingUp, PieChart, Activity, Settings,
} from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', path: '/admin', icon: LayoutDashboard }],
  },
  {
    title: 'People',
    items: [
      { label: 'Customers', path: '/admin/customers', icon: Users },
      { label: 'Tailors', path: '/admin/tailors', icon: Scissors },
      { label: 'Home Tailors', path: '/admin/tailors/home', icon: Home },
      { label: 'Shop Tailors', path: '/admin/tailors/shop', icon: Store },
    ],
  },
  {
    title: 'Commerce',
    items: [
      { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
      { label: 'Payments', path: '/admin/payments', icon: Wallet },
      { label: 'Commission', path: '/admin/commission', icon: Percent },
    ],
  },
  {
    title: 'Growth',
    items: [
      { label: 'Membership', path: '/admin/membership', icon: Crown },
      { label: 'Membership Plans', path: '/admin/membership-plans', icon: Gem },
      { label: 'Offers & Coupons', path: '/admin/offers', icon: Ticket },
      { label: 'Advertisements', path: '/admin/advertisements', icon: Megaphone },
    ],
  },
  {
    title: 'Trust & Support',
    items: [
      { label: 'Reviews', path: '/admin/reviews', icon: Star },
      { label: 'Complaints', path: '/admin/complaints', icon: MessageSquareWarning },
      { label: 'Notifications', path: '/admin/notifications', icon: Bell },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { label: 'Locations', path: '/admin/locations', icon: MapPin },
      { label: 'Categories', path: '/admin/categories', icon: LayoutGrid },
    ],
  },
  {
    title: 'Insights',
    items: [
      { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
      { label: 'Sales Report', path: '/admin/reports/sales', icon: TrendingUp },
      { label: 'Tailor Income', path: '/admin/reports/tailor-income', icon: PieChart },
      { label: 'App Income', path: '/admin/reports/app-income', icon: PieChart },
      { label: 'Analytics', path: '/admin/analytics', icon: Activity },
    ],
  },
  {
    title: 'System',
    items: [{ label: 'Settings', path: '/admin/settings', icon: Settings }],
  },
];
