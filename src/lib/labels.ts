function label(map: Record<string, string>, value: string): string {
  return map[value] ?? value;
}

export const userRoleLabels: Record<string, string> = {
  ADMIN: 'Administrador',
  OPERATOR: 'Operador',
  SUPPORT: 'Suporte',
  PLAYER: 'Jogador',
};

export const userStatusLabels: Record<string, string> = {
  ACTIVE: 'Ativo',
  SUSPENDED: 'Suspenso',
  PENDING_VERIFICATION: 'Aguardando confirmação',
};

export const paymentStatusLabels: Record<string, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  FAILED: 'Falhou',
  CANCELLED: 'Cancelado',
};

export const bonusStatusLabels: Record<string, string> = {
  ACTIVE: 'Ativo',
  USED: 'Utilizado',
  EXPIRED: 'Expirado',
  CANCELLED: 'Cancelado',
};

export const transactionStatusLabels: Record<string, string> = {
  PENDING: 'Pendente',
  COMPLETED: 'Concluído',
  FAILED: 'Falhou',
  CANCELLED: 'Cancelado',
};

export const gameRoundOutcomeLabels: Record<string, string> = {
  WIN: 'Vitória',
  LOSS: 'Perda',
  DRAW: 'Empate',
};

export function userRoleLabel(role: string): string {
  return label(userRoleLabels, role);
}

export function userStatusLabel(status: string): string {
  return label(userStatusLabels, status);
}

export function paymentStatusLabel(status: string): string {
  return label(paymentStatusLabels, status);
}

export function bonusStatusLabel(status: string): string {
  return label(bonusStatusLabels, status);
}

export function transactionStatusLabel(status: string): string {
  return label(transactionStatusLabels, status);
}

export function gameRoundOutcomeLabel(outcome: string): string {
  return label(gameRoundOutcomeLabels, outcome);
}
