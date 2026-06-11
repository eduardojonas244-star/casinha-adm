import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteProvider, listProviders, syncProviders, updateProvider } from '../api/providers';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../components/ui/Table';
import { getErrorMessage } from '../api/client';

const PAGE_SIZE = 20;

export function ProvidersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { data, isLoading, error: queryError } = useQuery({
    queryKey: ['admin-providers', page, search],
    queryFn: () => listProviders(page, PAGE_SIZE, search || undefined),
  });

  const handleSync = async () => {
    setSyncing(true);
    setMessage('');
    setError('');
    try {
      const result = await syncProviders();
      setMessage(`${result.synced} provedores sincronizados.`);
      await queryClient.invalidateQueries({ queryKey: ['admin-providers'] });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSyncing(false);
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      await updateProvider(id, { active: !active });
      await queryClient.invalidateQueries({ queryKey: ['admin-providers'] });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este provedor?')) return;
    try {
      await deleteProvider(id);
      await queryClient.invalidateQueries({ queryKey: ['admin-providers'] });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Todos os Provedores</h1>
          <p className="mt-1 text-sm text-casino-muted">Catálogo PlayFiver com overrides locais</p>
        </div>
        <Button loading={syncing} onClick={() => void handleSync()}>Sync PlayFiver</Button>
      </div>

      {message && <Alert variant="success" className="mt-4">{message}</Alert>}
      {error && <Alert variant="error" className="mt-4">{error}</Alert>}

      <div className="mt-4">
        <Input placeholder="Pesquisar" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
      </div>

      {isLoading && <Spinner />}
      {queryError && <Alert variant="error" className="mt-4">{getErrorMessage(queryError)}</Alert>}

      {data && (
        <>
          <div className="mt-6">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Código</TableHeaderCell>
                  <TableHeaderCell>Nome</TableHeaderCell>
                  <TableHeaderCell>Distribuição</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>RTP</TableHeaderCell>
                  <TableHeaderCell>Views</TableHeaderCell>
                  <TableHeaderCell>Ações</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.data.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.code}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell className="text-casino-muted">{p.distribution}</TableCell>
                    <TableCell>
                      <Badge variant={p.active ? 'success' : 'muted'}>{p.active ? 'Ativo' : 'Inativo'}</Badge>
                    </TableCell>
                    <TableCell>{p.rtp}%</TableCell>
                    <TableCell>{p.views}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => void toggleActive(p.id, p.active)}>
                          {p.active ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => void handleDelete(p.id)}>Excluir</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex gap-3">
            <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
            <span className="text-sm text-casino-muted">Página {page + 1} · {data.total} resultados</span>
            <Button variant="secondary" size="sm" disabled={(page + 1) * PAGE_SIZE >= data.total} onClick={() => setPage((p) => p + 1)}>Próxima</Button>
          </div>
        </>
      )}
    </div>
  );
}
