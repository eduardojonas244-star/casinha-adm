import { useQuery } from '@tanstack/react-query';
import { getPagnovoBalance, getPagnovoCredentials } from '../api/pagnovo';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { Card } from '../components/ui/Card';
import { getErrorMessage } from '../api/client';
import { formatCentavos } from '../lib/money';

function CopyRow({ label, value }: { label: string; value: string }) {
  const copy = () => void navigator.clipboard.writeText(value);
  return (
    <div className="flex items-center justify-between gap-4 border-b border-casino-border py-3 last:border-0">
      <div>
        <p className="text-xs uppercase text-casino-muted">{label}</p>
        <p className="font-mono text-sm text-white break-all">{value}</p>
      </div>
      <button type="button" onClick={copy} className="shrink-0 text-xs text-casino-green hover:underline">
        Copiar
      </button>
    </div>
  );
}

export function PagnovoCredentialsPage() {
  const credentials = useQuery({
    queryKey: ['admin-pagnovo-credentials'],
    queryFn: getPagnovoCredentials,
  });

  const balance = useQuery({
    queryKey: ['admin-pagnovo-balance'],
    queryFn: getPagnovoBalance,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Pagnovo — Credenciais</h1>
      <p className="mt-1 text-sm text-casino-muted">PIX cash-in / cash-out</p>

      <Alert variant="warning" className="mt-4">
        Em dev local, configure <code className="text-casino-green">APP_PUBLIC_URL</code> com tunnel HTTPS
        (ngrok/cloudflared). A Pagnovo exige HTTPS em produção e bloqueia IPs privados no cadastro do webhook.
      </Alert>

      {credentials.isLoading && <Spinner />}
      {credentials.error && (
        <Alert variant="error" className="mt-4">{getErrorMessage(credentials.error)}</Alert>
      )}

      {credentials.data && (
        <Card className="mt-6 max-w-2xl">
          <h2 className="font-semibold text-white">Integração</h2>
          <div className="mt-2">
            <CopyRow label="Ambiente" value={credentials.data.environment} />
            <CopyRow label="Secret Key" value={credentials.data.secretKey} />
            <CopyRow label="API URL" value={credentials.data.apiUrl} />
            <CopyRow label="Webhook callback" value={credentials.data.webhookCallbackUrl} />
            <CopyRow label="Scopes necessários" value={credentials.data.requiredScopes.join(', ')} />
          </div>
          <p className="mt-4 text-xs text-casino-muted">
            Sandbox: até {credentials.data.sandboxNotes.dailyCap} ops/dia.{' '}
            {credentials.data.sandboxNotes.testAmounts}
          </p>
        </Card>
      )}

      <Card className="mt-6 max-w-2xl">
        <h2 className="font-semibold text-white">Saldo da conta</h2>
        {balance.isLoading && <Spinner />}
        {balance.error && <Alert variant="error" className="mt-4">{getErrorMessage(balance.error)}</Alert>}
        {balance.data && (
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-casino-muted">Disponível</span>
              <span className="font-semibold text-white">
                {formatCentavos(balance.data.available ?? 0)}
              </span>
            </li>
            {balance.data.inSettlement != null && (
              <li className="flex justify-between">
                <span className="text-casino-muted">Em liquidação</span>
                <span className="text-white">{formatCentavos(balance.data.inSettlement)}</span>
              </li>
            )}
            {balance.data.cautiousBlocks != null && (
              <li className="flex justify-between">
                <span className="text-casino-muted">Bloqueios cautelares</span>
                <span className="text-white">{formatCentavos(balance.data.cautiousBlocks)}</span>
              </li>
            )}
          </ul>
        )}
        {!balance.isLoading && !balance.error && !balance.data && (
          <p className="mt-4 text-sm text-casino-muted">Saldo indisponível no momento.</p>
        )}
      </Card>
    </div>
  );
}
