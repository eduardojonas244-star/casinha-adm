import { useQuery } from '@tanstack/react-query';
import { getFinancialReport } from '../api/reports';
import { formatCentavos } from '../lib/money';
import { StatCard } from '../components/ui/StatCard';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { getErrorMessage } from '../api/client';

export function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['financial-report'],
    queryFn: getFinancialReport,
  });

  if (isLoading) return <Spinner />;
  if (error) return <Alert variant="error">{getErrorMessage(error)}</Alert>;
  if (!data) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-casino-muted">Resumo financeiro da plataforma</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Depósitos confirmados"
          value={formatCentavos(data.deposits.total)}
          sub={`${data.deposits.count} transações`}
        />
        <StatCard
          label="Saques confirmados"
          value={formatCentavos(data.withdrawals.total)}
          sub={`${data.withdrawals.count} transações`}
        />
        <StatCard label="GGR" value={formatCentavos(data.ggr)} sub="Apostas − ganhos" />
        <StatCard
          label="Total apostado"
          value={formatCentavos(data.bets.total)}
          sub={`${data.bets.count} apostas`}
        />
        <StatCard
          label="Total ganho"
          value={formatCentavos(data.wins.total)}
          sub={`${data.wins.count} vitórias`}
        />
      </div>
    </div>
  );
}
