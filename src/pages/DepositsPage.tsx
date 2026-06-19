import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listAdminDeposits } from '../api/payments-admin';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { PaymentStatusBadge } from '../components/ui/Badge';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../components/ui/Table';
import { getErrorMessage } from '../api/client';
import { formatCentavos, formatDate } from '../lib/money';

const PAGE_SIZE = 20;

export function DepositsPage() {
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-deposits', page, status],
    queryFn: () => listAdminDeposits(page, PAGE_SIZE, status || undefined),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Depósitos</h1>
      <p className="mt-1 text-sm text-casino-muted">Listagem de depósitos PIX</p>

      <select
        className="mt-4 rounded-xl border border-casino-border bg-casino-card px-3 py-2 text-sm text-white"
        value={status}
        onChange={(e) => { setStatus(e.target.value); setPage(0); }}
      >
        <option value="">Todos os status</option>
        <option value="PENDING">Pendente</option>
        <option value="CONFIRMED">Confirmado</option>
        <option value="FAILED">Falhou</option>
      </select>

      {isLoading && <Spinner />}
      {error && <Alert variant="error" className="mt-4">{getErrorMessage(error)}</Alert>}

      {data && (
        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Usuário</TableHeaderCell>
                <TableHeaderCell>Valor</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Data</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.data.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.userName}<br /><span className="text-xs text-casino-muted">{d.userEmail}</span></TableCell>
                  <TableCell>{formatCentavos(d.amount)}</TableCell>
                  <TableCell><PaymentStatusBadge status={d.status} /></TableCell>
                  <TableCell className="text-casino-muted">{formatDate(d.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
