import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAdminUser } from '../api/admin-users';
import { formatCentavos, formatDate } from '../lib/money';
import { RoleBadge, StatusBadge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { Card } from '../components/ui/Card';
import { getErrorMessage } from '../api/client';
import { paths } from '../routes/paths';

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-user', id],
    queryFn: () => getAdminUser(id!),
    enabled: Boolean(id),
  });

  return (
    <div>
      <Link to={paths.users} className="text-sm text-casino-green hover:underline">
        ← Voltar para usuários
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-white">Detalhe do usuário</h1>
      <p className="mt-1 text-sm text-casino-muted">Informações da conta</p>

      {isLoading && <Spinner />}
      {error && <Alert variant="error" className="mt-4">{getErrorMessage(error)}</Alert>}

      {data && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="font-semibold text-white">Conta</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-casino-muted">Nome</dt>
                <dd className="text-right text-white">{data.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-casino-muted">E-mail</dt>
                <dd className="text-right text-white">{data.email}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-casino-muted">CPF</dt>
                <dd className="text-right text-white">{data.cpf}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-casino-muted">Telefone</dt>
                <dd className="text-right text-white">{data.phone ?? '—'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-casino-muted">Perfil</dt>
                <dd><RoleBadge role={data.role} /></dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-casino-muted">Status</dt>
                <dd><StatusBadge status={data.status} /></dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-casino-muted">Cadastro</dt>
                <dd className="text-white">{formatDate(data.createdAt)}</dd>
              </div>
            </dl>
          </Card>

          {data.wallet && (
            <Card>
              <h2 className="font-semibold text-white">Carteira</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-casino-muted">Saldo</dt>
                  <dd className="text-white">{formatCentavos(String(data.wallet.balance))}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-casino-muted">Bônus</dt>
                  <dd className="text-white">{formatCentavos(String(data.wallet.bonusBalance))}</dd>
                </div>
              </dl>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
