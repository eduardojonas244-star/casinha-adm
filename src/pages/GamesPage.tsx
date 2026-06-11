import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { listAdminGames, syncAdminGames, updateAdminGame } from '../api/admin-games';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../components/ui/Table';
import { getErrorMessage } from '../api/client';

const PAGE_SIZE = 20;

export function GamesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [syncMessage, setSyncMessage] = useState('');
  const [syncError, setSyncError] = useState('');
  const [syncing, setSyncing] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-games', page, search],
    queryFn: () => listAdminGames(page, PAGE_SIZE, { search: search || undefined }),
  });

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage('');
    setSyncError('');
    try {
      const result = await syncAdminGames();
      setSyncMessage(`${result.synced} jogos sincronizados (${result.validImages} imagens válidas).`);
      await queryClient.invalidateQueries({ queryKey: ['admin-games'] });
    } catch (err) {
      setSyncError(getErrorMessage(err));
    } finally {
      setSyncing(false);
    }
  };

  const toggleField = async (id: string, field: 'showOnHome' | 'gameOriginal' | 'active', value: boolean) => {
    try {
      await updateAdminGame(id, { [field]: !value });
      await queryClient.invalidateQueries({ queryKey: ['admin-games'] });
    } catch (err) {
      setSyncError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Todos os Jogos</h1>
          <p className="mt-1 text-sm text-casino-muted">Catálogo admin com toggles e sync PlayFiver</p>
        </div>
        <Button loading={syncing} onClick={() => void handleSync()}>Sincronizar catálogo</Button>
      </div>

      {syncMessage && <Alert variant="success" className="mt-4">{syncMessage}</Alert>}
      {syncError && <Alert variant="error" className="mt-4">{syncError}</Alert>}

      <div className="mt-4">
        <Input placeholder="Pesquisar" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
      </div>

      {isLoading && <Spinner />}
      {error && <Alert variant="error" className="mt-4">{getErrorMessage(error)}</Alert>}

      {data && (
        <>
          <div className="mt-6 overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Imagem</TableHeaderCell>
                  <TableHeaderCell>Provedor</TableHeaderCell>
                  <TableHeaderCell>Nome</TableHeaderCell>
                  <TableHeaderCell>Home</TableHeaderCell>
                  <TableHeaderCell>Original</TableHeaderCell>
                  <TableHeaderCell>Jogado</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.data.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-casino-muted">Nenhum jogo. Clique em sincronizar.</TableCell>
                  </TableRow>
                ) : (
                  data.data.map((game) => (
                    <TableRow key={game.id}>
                      <TableCell>
                        {game.imageUrl ? (
                          <img src={game.imageUrl} alt={game.name} className="h-10 w-10 rounded object-cover" />
                        ) : '—'}
                      </TableCell>
                      <TableCell className="text-casino-muted">{game.provider}</TableCell>
                      <TableCell>{game.name}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => void toggleField(game.id, 'showOnHome', game.showOnHome)}>
                          {game.showOnHome ? 'Sim' : 'Não'}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => void toggleField(game.id, 'gameOriginal', game.gameOriginal)}>
                          {game.gameOriginal ? 'Sim' : 'Não'}
                        </Button>
                      </TableCell>
                      <TableCell>{game.playCount}</TableCell>
                      <TableCell>
                        <Badge variant={game.active ? 'success' : 'muted'}>{game.active ? 'Ativo' : 'Inativo'}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
            <span className="text-sm text-casino-muted">Página {page + 1} · {data.total} jogos</span>
            <Button variant="secondary" size="sm" disabled={(page + 1) * PAGE_SIZE >= data.total} onClick={() => setPage((p) => p + 1)}>Próxima</Button>
          </div>
        </>
      )}
    </div>
  );
}
