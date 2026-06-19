import { useQuery } from '@tanstack/react-query';
import { listBanners } from '../api/banners';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../components/ui/Table';
import { getErrorMessage } from '../api/client';

export function BannersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: listBanners,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Banners</h1>
      <p className="mt-1 text-sm text-casino-muted">Hero carousel do frontend</p>

      {isLoading && <Spinner />}
      {error && <Alert variant="error" className="mt-4">{getErrorMessage(error)}</Alert>}

      {data && (
        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Título</TableHeaderCell>
                <TableHeaderCell>Destaque</TableHeaderCell>
                <TableHeaderCell>Ordem</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{b.title}</TableCell>
                  <TableCell className="text-casino-muted">{b.highlight ?? '—'}</TableCell>
                  <TableCell>{b.sortOrder}</TableCell>
                  <TableCell><Badge variant={b.active ? 'success' : 'muted'}>{b.active ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
