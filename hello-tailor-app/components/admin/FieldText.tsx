import React from 'react';
import { Text } from 'react-native';
import { colors, font } from '@/theme';

// Small shared cell-text helper for DataTable columns across every admin list screen.
export default function FieldText({ children, bold, muted }: { children: React.ReactNode; bold?: boolean; muted?: boolean }) {
  return (
    <Text style={{ fontFamily: bold ? font.semibold : font.regular, fontSize: bold ? 13 : 12, color: muted ? colors.textSecondary : colors.text }} numberOfLines={2}>
      {children}
    </Text>
  );
}

export const STATUS_TONE: Record<string, 'success' | 'error' | 'warning' | 'info' | 'gold' | 'neutral' | 'navy'> = {
  Active: 'success', Blocked: 'error', Pending: 'warning', Inactive: 'neutral',
  Verified: 'success', Rejected: 'error',
  Visible: 'success', Hidden: 'neutral',
  Paid: 'success', Partial: 'warning', Refunded: 'info', Failed: 'error',
  Collected: 'success',
  Scheduled: 'info', Expired: 'neutral', Paused: 'warning',
  Open: 'error', 'In Progress': 'warning', Resolved: 'success', Closed: 'neutral',
  Sent: 'success',
};
