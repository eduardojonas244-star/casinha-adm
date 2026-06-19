import type { ReactNode } from 'react';
import {
  bonusStatusLabel,
  gameRoundOutcomeLabel,
  paymentStatusLabel,
  userRoleLabel,
  userStatusLabel,
} from '../../lib/labels';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'muted' | 'green';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  success: 'bg-casino-success/20 text-casino-success border-casino-success/40',
  warning: 'bg-casino-warning/20 text-casino-warning border-casino-warning/40',
  danger: 'bg-casino-danger/20 text-casino-danger border-casino-danger/40',
  muted: 'bg-casino-surface text-casino-muted border-casino-border',
  green: 'bg-casino-green/20 text-casino-green border-casino-green/40',
};

export function Badge({ children, variant = 'muted' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

function roleVariant(role: string): BadgeVariant {
  if (role === 'ADMIN') return 'green';
  if (role === 'OPERATOR') return 'success';
  if (role === 'SUPPORT') return 'warning';
  return 'muted';
}

function userStatusVariant(status: string): BadgeVariant {
  if (status === 'ACTIVE') return 'success';
  if (status === 'SUSPENDED') return 'danger';
  return 'warning';
}

function paymentStatusVariant(status: string): BadgeVariant {
  if (status === 'CONFIRMED' || status === 'COMPLETED') return 'success';
  if (status === 'FAILED' || status === 'CANCELLED') return 'danger';
  return 'warning';
}

function bonusStatusVariant(status: string): BadgeVariant {
  if (status === 'ACTIVE') return 'success';
  if (status === 'USED') return 'warning';
  if (status === 'EXPIRED' || status === 'CANCELLED') return 'danger';
  return 'muted';
}

function gameRoundOutcomeVariant(outcome: string): BadgeVariant {
  if (outcome === 'WIN') return 'success';
  if (outcome === 'LOSS') return 'warning';
  return 'muted';
}

export function RoleBadge({ role }: { role: string }) {
  return <Badge variant={roleVariant(role)}>{userRoleLabel(role)}</Badge>;
}

export function StatusBadge({ status }: { status: string }) {
  return <Badge variant={userStatusVariant(status)}>{userStatusLabel(status)}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: string }) {
  return <Badge variant={paymentStatusVariant(status)}>{paymentStatusLabel(status)}</Badge>;
}

export function BonusStatusBadge({ status }: { status: string }) {
  return <Badge variant={bonusStatusVariant(status)}>{bonusStatusLabel(status)}</Badge>;
}

export function GameRoundOutcomeBadge({ outcome }: { outcome: string }) {
  return (
    <Badge variant={gameRoundOutcomeVariant(outcome)}>{gameRoundOutcomeLabel(outcome)}</Badge>
  );
}
