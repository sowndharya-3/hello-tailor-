// RN port of admin-panel/src/components/layout/navConfig.ts — lucide icons swapped for Ionicons.
import { Ionicons } from '@expo/vector-icons';

export interface NavItem {
  label: string;
  href: string;
  icon: keyof typeof Ionicons.glyphMap;
}
export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  { title: 'Overview', items: [{ label: 'Dashboard', href: '/(admin)', icon: 'speedometer-outline' }] },
  {
    title: 'People',
    items: [
      { label: 'Customers', href: '/(admin)/customers', icon: 'people-outline' },
      { label: 'Tailors', href: '/(admin)/tailors', icon: 'cut-outline' },
      { label: 'Home Tailors', href: '/(admin)/tailors/home', icon: 'home-outline' },
      { label: 'Shop Tailors', href: '/(admin)/tailors/shop', icon: 'storefront-outline' },
    ],
  },
  {
    title: 'Commerce',
    items: [
      { label: 'Orders', href: '/(admin)/orders', icon: 'bag-handle-outline' },
      { label: 'Payments', href: '/(admin)/payments', icon: 'wallet-outline' },
      { label: 'Commission', href: '/(admin)/commission', icon: 'cash-outline' },
    ],
  },
  {
    title: 'Growth',
    items: [
      { label: 'Membership', href: '/(admin)/membership', icon: 'medal-outline' },
      { label: 'Membership Plans', href: '/(admin)/membership-plans', icon: 'diamond-outline' },
      { label: 'Offers & Coupons', href: '/(admin)/offers', icon: 'pricetag-outline' },
      { label: 'Advertisements', href: '/(admin)/advertisements', icon: 'megaphone-outline' },
    ],
  },
  {
    title: 'Trust & Support',
    items: [
      { label: 'Reviews', href: '/(admin)/reviews', icon: 'star-outline' },
      { label: 'Complaints', href: '/(admin)/complaints', icon: 'warning-outline' },
      { label: 'Notifications', href: '/(admin)/notifications', icon: 'notifications-outline' },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { label: 'Locations', href: '/(admin)/locations', icon: 'location-outline' },
      { label: 'Categories', href: '/(admin)/categories', icon: 'grid-outline' },
    ],
  },
  {
    title: 'Insights',
    items: [
      { label: 'Reports', href: '/(admin)/reports', icon: 'bar-chart-outline' },
      { label: 'Sales Report', href: '/(admin)/reports/sales', icon: 'trending-up-outline' },
      { label: 'Tailor Income', href: '/(admin)/reports/tailor-income', icon: 'pie-chart-outline' },
      { label: 'App Income', href: '/(admin)/reports/app-income', icon: 'pie-chart-outline' },
      { label: 'Analytics', href: '/(admin)/analytics', icon: 'pulse-outline' },
    ],
  },
  { title: 'System', items: [{ label: 'Settings', href: '/(admin)/settings', icon: 'settings-outline' }] },
];
