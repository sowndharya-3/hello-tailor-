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
    items: [{ label: 'Dashboard', path: '/', icon: LayoutDashboard }],
  },
  {
    title: 'People',
    items: [
      { label: 'Customers', path: '/customers', icon: Users },
      { label: 'Tailors', path: '/tailors', icon: Scissors },
      { label: 'Home Tailors', path: '/tailors/home', icon: Home },
      { label: 'Shop Tailors', path: '/tailors/shop', icon: Store },
    ],
  },
  {
    title: 'Commerce',
    items: [
      { label: 'Orders', path: '/orders', icon: ShoppingBag },
      { label: 'Payments', path: '/payments', icon: Wallet },
      { label: 'Commission', path: '/commission', icon: Percent },
    ],
  },
  {
    title: 'Growth',
    items: [
      { label: 'Membership', path: '/membership', icon: Crown },
      { label: 'Membership Plans', path: '/membership-plans', icon: Gem },
      { label: 'Offers & Coupons', path: '/offers', icon: Ticket },
      { label: 'Advertisements', path: '/advertisements', icon: Megaphone },
    ],
  },
  {
    title: 'Trust & Support',
    items: [
      { label: 'Reviews', path: '/reviews', icon: Star },
      { label: 'Complaints', path: '/complaints', icon: MessageSquareWarning },
      { label: 'Notifications', path: '/notifications', icon: Bell },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { label: 'Locations', path: '/locations', icon: MapPin },
      { label: 'Categories', path: '/categories', icon: LayoutGrid },
    ],
  },
  {
    title: 'Insights',
    items: [
      { label: 'Reports', path: '/reports', icon: BarChart3 },
      { label: 'Sales Report', path: '/reports/sales', icon: TrendingUp },
      { label: 'Tailor Income', path: '/reports/tailor-income', icon: PieChart },
      { label: 'App Income', path: '/reports/app-income', icon: PieChart },
      { label: 'Analytics', path: '/analytics', icon: Activity },
    ],
  },
  {
    title: 'System',
    items: [{ label: 'Settings', path: '/settings', icon: Settings }],
  },
];
