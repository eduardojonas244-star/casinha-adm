import { useQuery } from '@tanstack/react-query';
import { listAffiliates } from '../api/affiliates';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../components/ui/Table';
import { getErrorMessage } from '../api/client';
import { formatCentavos } from '../lib/money';

export function AffiliatesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['affiliates'],
    queryFn: () => listAffiliates(0, 50),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Afiliados</h1>
      <p className="mt-1 text-sm text-casino-muted">Programa de afiliados</p>

      {isLoading && <Spinner />}
      {error && <Alert variant="error" className="mt-4">{getErrorMessage(error)}</Alert>}

      {data && (
        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Código</TableHeaderCell>
                <TableHeaderCell>Usuário</TableHeaderCell>
                <TableHeaderCell>Indicações</TableHeaderCell>
                <TableHeaderCell>Comissões</TableHeaderCell>
                <TableHeaderCell>Total</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.data.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-mono">{a.referralCode}</TableCell>
                  <TableCell>{a.userName}<br /><span className="text-xs text-casino-muted">{a.userEmail}</span></TableCell>
                  <TableCell>{a.referralCount}</TableCell>
                  <TableCell>{a.commissionCount}</TableCell>
                  <TableCell>{formatCentavos(a.totalEarnings)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
