import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listAdminWithdrawals } from '../api/payments-admin';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../components/ui/Table';
import { getErrorMessage } from '../api/client';
import { formatCentavos, formatDate } from '../lib/money';

const PAGE_SIZE = 20;

export function WithdrawalsPage() {
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-withdrawals', page, status],
    queryFn: () => listAdminWithdrawals(page, PAGE_SIZE, status || undefined),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Saques</h1>
      <p className="mt-1 text-sm text-casino-muted">Listagem de saques PIX</p>

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
                <TableHeaderCell>Chave PIX</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Data</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.data.map((w) => (
                <TableRow key={w.id}>
                  <TableCell>{w.userName}</TableCell>
                  <TableCell>{formatCentavos(w.amount)}</TableCell>
                  <TableCell className="font-mono text-xs">{w.pixKey}</TableCell>
                  <TableCell><Badge>{w.status}</Badge></TableCell>
                  <TableCell className="text-casino-muted">{formatDate(w.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
