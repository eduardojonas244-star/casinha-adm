import type { ReactNode } from 'react';

interface AlertProps {
  variant?: 'info' | 'success' | 'error' | 'warning';
  children: ReactNode;
  className?: string;
}

const styles = {
  info: 'border-casino-accent/40 bg-casino-accent/10 text-blue-200',
  success: 'border-casino-success/40 bg-casino-success/10 text-green-200',
  error: 'border-casino-danger/40 bg-casino-danger/10 text-red-200',
  warning: 'border-casino-gold/40 bg-casino-gold/10 text-yellow-200',
};

export function Alert({ variant = 'info', children, className = '' }: AlertProps) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles[variant]} ${className}`}>
      {children}
    </div>
  );
}
