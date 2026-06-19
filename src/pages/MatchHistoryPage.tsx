import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listGameRounds } from '../api/game-rounds';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { GameRoundOutcomeBadge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../components/ui/Table';
import { getErrorMessage } from '../api/client';
import { formatDate } from '../lib/money';

const PAGE_SIZE = 20;

export function MatchHistoryPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [outcome, setOutcome] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-game-rounds', page, search, outcome],
    queryFn: () => listGameRounds(page, PAGE_SIZE, {
      search: search || undefined,
      outcome: outcome || undefined,
    }),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Histórico de Partidas</h1>
      <p className="mt-1 text-sm text-casino-muted">Registros de apostas via webhook PlayFiver</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Input placeholder="Pesquisar" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
        <select
          className="rounded-xl border border-casino-border bg-casino-card px-3 py-2 text-sm text-white"
          value={outcome}
          onChange={(e) => { setOutcome(e.target.value); setPage(0); }}
        >
          <option value="">Todos os resultados</option>
          <option value="WIN">Vitória</option>
          <option value="LOSS">Perda</option>
          <option value="DRAW">Empate</option>
        </select>
      </div>

      {isLoading && <Spinner />}
      {error && <Alert variant="error" className="mt-4">{getErrorMessage(error)}</Alert>}

      {data && (
        <>
          <div className="mt-6 overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Usuário</TableHeaderCell>
                  <TableHeaderCell>Session</TableHeaderCell>
                  <TableHeaderCell>Transaction</TableHeaderCell>
                  <TableHeaderCell>Jogo</TableHeaderCell>
                  <TableHeaderCell>Tipo</TableHeaderCell>
                  <TableHeaderCell>Pagamento</TableHeaderCell>
                  <TableHeaderCell>Valor</TableHeaderCell>
                  <TableHeaderCell>Provedor</TableHeaderCell>
                  <TableHeaderCell>Data</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.data.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-casino-muted">Nenhuma partida registrada.</TableCell>
                  </TableRow>
                ) : (
                  data.data.map((round) => (
                    <TableRow key={round.id}>
                      <TableCell className="text-casino-muted">{round.userEmail}</TableCell>
                      <TableCell className="font-mono text-xs">{round.sessionId?.slice(0, 12) ?? '—'}</TableCell>
                      <TableCell className="font-mono text-xs">{round.transactionId.slice(0, 12)}…</TableCell>
                      <TableCell>{round.gameCode}</TableCell>
                      <TableCell>
                        <GameRoundOutcomeBadge outcome={round.outcome} />
                      </TableCell>
                      <TableCell className="text-casino-muted">{round.balanceSource ?? '—'}</TableCell>
                      <TableCell>R$ {round.amount}</TableCell>
                      <TableCell>{round.provider}</TableCell>
                      <TableCell className="text-casino-muted">{formatDate(round.createdAt)}</TableCell>
                    </TableRow>
                  ))
                )}
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
