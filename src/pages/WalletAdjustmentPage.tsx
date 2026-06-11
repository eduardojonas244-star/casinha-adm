import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { walletAdjustmentSchema, type WalletAdjustmentForm } from '../lib/validators';
import { createAdjustment } from '../api/wallets';
import { formatCentavos } from '../lib/money';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { getErrorMessage } from '../api/client';

export function WalletAdjustmentPage() {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WalletAdjustmentForm>({ resolver: zodResolver(walletAdjustmentSchema) });

  const onSubmit = async (data: WalletAdjustmentForm) => {
    setError('');
    setSuccess('');
    try {
      const result = await createAdjustment(data);
      setSuccess(`Ajuste aplicado (transação ${result.id}, ${formatCentavos(result.amount)})`);
      reset();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Ajuste de carteira</h1>
      <p className="mt-1 text-sm text-casino-muted">Crédito ou débito manual em centavos (valor inteiro)</p>

      <Card className="mt-6 max-w-lg" title="Novo ajuste">
        {error && <Alert variant="error" className="mb-4">{error}</Alert>}
        {success && <Alert variant="success" className="mb-4">{success}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="ID do usuário (UUID)"
            placeholder="00000000-0000-0000-0000-000000000000"
            error={errors.userId?.message}
            {...register('userId')}
          />
          <Input
            label="Valor (centavos)"
            type="number"
            placeholder="1000 = R$ 10,00"
            error={errors.amount?.message}
            {...register('amount', { valueAsNumber: true })}
          />
          <Input
            label="Motivo"
            placeholder="Correção manual de saldo"
            error={errors.reason?.message}
            {...register('reason')}
          />
          <Button type="submit" loading={isSubmitting}>
            Aplicar ajuste
          </Button>
        </form>
      </Card>
    </div>
  );
}
