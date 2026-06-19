import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
});

export type LoginForm = z.infer<typeof loginSchema>;

export const walletAdjustmentSchema = z.object({
  userId: z.string().uuid('UUID inválido'),
  amount: z.number({ error: 'Valor deve ser inteiro (centavos)' }).int('Valor deve ser inteiro (centavos)'),
  reason: z.string().min(3, 'Motivo mínimo 3 caracteres').max(500),
});

export type WalletAdjustmentForm = z.infer<typeof walletAdjustmentSchema>;

export const createBonusSchema = z.object({
  userId: z.string().uuid('UUID inválido'),
  amount: z.number({ error: 'Valor inválido' }).int().positive('Valor deve ser positivo'),
  expiresAt: z.string().optional(),
});

export type CreateBonusForm = z.infer<typeof createBonusSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  slug: z.string().min(1, 'Slug obrigatório').regex(/^[a-z0-9-]+$/, 'Slug: apenas minúsculas, números e hífen'),
  description: z.string().max(1000).optional(),
  imageUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  showOnHome: z.boolean().optional(),
});

export type CategoryForm = z.infer<typeof categorySchema>;
