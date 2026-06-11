import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginForm } from '../lib/validators';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../api/client';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { paths } from '../routes/paths';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || paths.dashboard;
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setError('');
    try {
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-white">Entrar no painel</h1>
      <p className="mt-1 text-sm text-casino-muted">Acesso restrito a administradores e operadores.</p>

      {error && (
        <Alert variant="error" className="mt-4">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <Input label="E-mail" type="email" placeholder="admin@casino.local" error={errors.email?.message} {...register('email')} />
        <Input label="Senha" type="password" error={errors.password?.message} {...register('password')} />
        <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
          Entrar
        </Button>
      </form>
    </>
  );
}
