import type { ReactNode } from 'react';

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

function statusVariant(status: string): BadgeVariant {
  if (status === 'ACTIVE') return 'success';
  if (status === 'SUSPENDED') return 'danger';
  return 'warning';
}

export function RoleBadge({ role }: { role: string }) {
  return <Badge variant={roleVariant(role)}>{role}</Badge>;
}

export function StatusBadge({ status }: { status: string }) {
  return <Badge variant={statusVariant(status)}>{status}</Badge>;
}
