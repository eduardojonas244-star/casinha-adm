import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createPagnovoWebhook,
  deletePagnovoWebhook,
  getPagnovoCredentials,
  getPagnovoMetrics,
  listPagnovoDeliveries,
  listPagnovoWebhooks,
  rotatePagnovoWebhookSecret,
  testPagnovoWebhook,
  updatePagnovoWebhook,
} from '../api/pagnovo';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '../components/ui/Table';
import { getErrorMessage } from '../api/client';
import type { PagnovoWebhook } from '../types/api';

const DEFAULT_EVENTS = [
  'cashin.paid',
  'cashin.refunded',
  'cashout.success',
  'cashout.failed',
  'cashout.returned',
];

export function PagnovoWebhooksPage() {
  const queryClient = useQueryClient();
  const [description, setDescription] = useState('Casino webhook');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [oneTimeSecret, setOneTimeSecret] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deliveriesPage, setDeliveriesPage] = useState(0);

  const credentials = useQuery({
    queryKey: ['admin-pagnovo-credentials'],
    queryFn: getPagnovoCredentials,
  });

  const webhooks = useQuery({
    queryKey: ['admin-pagnovo-webhooks'],
    queryFn: listPagnovoWebhooks,
  });

  const deliveries = useQuery({
    queryKey: ['admin-pagnovo-deliveries', selectedId, deliveriesPage],
    queryFn: () => listPagnovoDeliveries(selectedId!, deliveriesPage),
    enabled: Boolean(selectedId),
  });

  const metrics = useQuery({
    queryKey: ['admin-pagnovo-metrics', selectedId],
    queryFn: () => getPagnovoMetrics(selectedId!, '24h'),
    enabled: Boolean(selectedId),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin-pagnovo-webhooks'] });

  const handleCreate = async () => {
    setError('');
    setMessage('');
    try {
      const result = await createPagnovoWebhook({ description, events: DEFAULT_EVENTS });
      setOneTimeSecret(result.secret);
      setMessage('Webhook criado. Copie o secret — ele não será exibido novamente.');
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleToggleActive = async (hook: PagnovoWebhook) => {
    try {
      await updatePagnovoWebhook(hook.id, { active: !hook.active });
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleTest = async (id: string) => {
    setError('');
    try {
      const result = await testPagnovoWebhook(id);
      setMessage(`Teste: HTTP ${result.statusCode} em ${result.durationMs}ms`);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleRotate = async (id: string) => {
    if (!confirm('Rotacionar secret? O anterior permanece válido por 24h.')) return;
    try {
      const result = await rotatePagnovoWebhookSecret(id);
      setOneTimeSecret(result.secret);
      setMessage('Novo secret gerado. Copie agora.');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este webhook?')) return;
    try {
      await deletePagnovoWebhook(id);
      if (selectedId === id) setSelectedId(null);
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Pagnovo — Webhooks</h1>
      <p className="mt-1 text-sm text-casino-muted">Gerencie endpoints V2 na Pagnovo</p>

      {message && <Alert variant="success" className="mt-4">{message}</Alert>}
      {error && <Alert variant="error" className="mt-4">{error}</Alert>}

      {oneTimeSecret && (
        <Alert variant="warning" className="mt-4">
          <p className="font-semibold">Signing secret (exibido uma vez)</p>
          <p className="mt-2 font-mono text-sm break-all">{oneTimeSecret}</p>
          <Button className="mt-2" size="sm" onClick={() => setOneTimeSecret(null)}>
            Já copiei
          </Button>
        </Alert>
      )}

      <Card className="mt-6 max-w-3xl">
        <h2 className="font-semibold text-white">Criar webhook</h2>
        <p className="mt-1 text-xs text-casino-muted">
          URL: {credentials.data?.webhookCallbackUrl ?? '…'} · Eventos: {DEFAULT_EVENTS.join(', ')}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Input
            className="max-w-xs"
            label="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button className="self-end" onClick={handleCreate}>Criar webhook</Button>
        </div>
      </Card>

      <Card className="mt-6">
        <h2 className="mb-4 font-semibold text-white">Webhooks cadastrados</h2>
        {webhooks.isLoading && <Spinner />}
        {webhooks.error && <Alert variant="error">{getErrorMessage(webhooks.error)}</Alert>}
        {webhooks.data && (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>URL</TableHeaderCell>
                <TableHeaderCell>Eventos</TableHeaderCell>
                <TableHeaderCell>Ativo</TableHeaderCell>
                <TableHeaderCell>Ações</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {webhooks.data.map((hook) => (
                <TableRow key={hook.id}>
                  <TableCell>
                    <p className="font-mono text-xs">{hook.url}</p>
                    <p className="text-casino-muted text-xs">{hook.description ?? hook.id}</p>
                  </TableCell>
                  <TableCell className="text-xs">{hook.events.join(', ')}</TableCell>
                  <TableCell>{hook.active ? 'Sim' : 'Não'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleTest(hook.id)}>Testar</Button>
                      <Button size="sm" variant="ghost" onClick={() => { setSelectedId(hook.id); setDeliveriesPage(0); }}>
                        Deliveries
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setSelectedId(hook.id)}>Métricas</Button>
                      <Button size="sm" variant="ghost" onClick={() => handleToggleActive(hook)}>
                        {hook.active ? 'Pausar' : 'Ativar'}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleRotate(hook.id)}>Rotacionar</Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(hook.id)}>Excluir</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {selectedId && deliveries.data && (
        <Card className="mt-6">
          <h2 className="font-semibold text-white">Deliveries — {selectedId}</h2>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Evento</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Duração</TableHeaderCell>
                <TableHeaderCell>Data</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deliveries.data.data.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.event}</TableCell>
                  <TableCell>{d.statusCode}</TableCell>
                  <TableCell>{d.durationMs}ms</TableCell>
                  <TableCell className="text-xs">{new Date(d.createdAt).toLocaleString('pt-BR')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex gap-2">
            <Button size="sm" disabled={deliveriesPage === 0} onClick={() => setDeliveriesPage((p) => p - 1)}>
              Anterior
            </Button>
            <Button size="sm" onClick={() => setDeliveriesPage((p) => p + 1)}>Próxima</Button>
          </div>
        </Card>
      )}

      {selectedId && metrics.data && (
        <Card className="mt-6 max-w-md">
          <h2 className="font-semibold text-white">Métricas 24h</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex justify-between"><span className="text-casino-muted">Total</span><span>{metrics.data.totalDeliveries}</span></li>
            <li className="flex justify-between"><span className="text-casino-muted">Sucesso</span><span>{metrics.data.successCount}</span></li>
            <li className="flex justify-between"><span className="text-casino-muted">Falhas</span><span>{metrics.data.failureCount}</span></li>
            {metrics.data.avgLatencyMs != null && (
              <li className="flex justify-between"><span className="text-casino-muted">Latência média</span><span>{metrics.data.avgLatencyMs}ms</span></li>
            )}
          </ul>
        </Card>
      )}
    </div>
  );
}
