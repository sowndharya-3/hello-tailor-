import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import EmptyState from './EmptyState';

// ponytail: thin wrapper over EmptyState so error states get a distinct icon/copy without duplicating layout
export default function ErrorState({
  icon = 'cloud-offline-outline',
  title,
  message,
  ctaLabel = 'Try Again',
  onPress,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  ctaLabel?: string;
  onPress?: () => void;
}) {
  return <EmptyState icon={icon} title={title} message={message} ctaLabel={ctaLabel} onPress={onPress} />;
}
