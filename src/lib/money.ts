export function formatCentavos(value: string | number): string {
  const cents = typeof value === 'string' ? parseInt(value, 10) : value;
  if (Number.isNaN(cents)) return 'R$ 0,00';
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatReais(reais: number): string {
  if (!Number.isFinite(reais)) return 'R$ 0,00';
  return reais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleString('pt-BR');
}
