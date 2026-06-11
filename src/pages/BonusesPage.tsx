import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBonusSchema, type CreateBonusForm } from '../lib/validators';
import { createBonus } from '../api/bonuses';
import { formatCentavos } from '../lib/money';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { getErrorMessage } from '../api/client';

export function BonusesPage() {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateBonusForm>({ resolver: zodResolver(createBonusSchema) });

  const onSubmit = async (data: CreateBonusForm) => {
    setError('');
    setSuccess('');
    try {
      const bonus = await createBonus({
        userId: data.userId,
        amount: data.amount,
        expiresAt: data.expiresAt || undefined,
      });
      setSuccess(`Bônus criado: ${formatCentavos(bonus.amount)} (${bonus.status})`);
      reset();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Bônus</h1>
      <p className="mt-1 text-sm text-casino-muted">Criar bônus para um usuário</p>

      <Card className="mt-6 max-w-lg" title="Novo bônus">
        {error && <Alert variant="error" className="mb-4">{error}</Alert>}
        {success && <Alert variant="success" className="mb-4">{success}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="ID do usuário (UUID)"
            error={errors.userId?.message}
            {...register('userId')}
          />
          <Input
            label="Valor (centavos)"
            type="number"
            error={errors.amount?.message}
            {...register('amount', { valueAsNumber: true })}
          />
          <Input
            label="Expira em (ISO, opcional)"
            type="datetime-local"
            error={errors.expiresAt?.message}
            {...register('expiresAt')}
          />
          <Button type="submit" loading={isSubmitting}>
            Criar bônus
          </Button>
        </form>
      </Card>
    </div>
  );
}
