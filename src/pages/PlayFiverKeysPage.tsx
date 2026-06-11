import { useQuery } from '@tanstack/react-query';
import { getPlayFiverBalances, getPlayFiverCredentials } from '../api/playfiver';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { Card } from '../components/ui/Card';
import { getErrorMessage } from '../api/client';

function CopyRow({ label, value }: { label: string; value: string }) {
  const copy = () => void navigator.clipboard.writeText(value);
  return (
    <div className="flex items-center justify-between gap-4 border-b border-casino-border py-3 last:border-0">
      <div>
        <p className="text-xs uppercase text-casino-muted">{label}</p>
        <p className="font-mono text-sm text-white">{value}</p>
      </div>
      <button type="button" onClick={copy} className="text-xs text-casino-green hover:underline">Copiar</button>
    </div>
  );
}

export function PlayFiverKeysPage() {
  const credentials = useQuery({
    queryKey: ['admin-playfiver-credentials'],
    queryFn: getPlayFiverCredentials,
  });

  const balances = useQuery({
    queryKey: ['admin-playfiver-balances'],
    queryFn: getPlayFiverBalances,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Chaves dos Jogos</h1>
      <p className="mt-1 text-sm text-casino-muted">Credenciais PlayFiver (somente leitura)</p>

      <Alert variant="warning" className="mt-4">
        Rotação de chaves é feita via variáveis de ambiente no deploy, não pela interface.
      </Alert>

      {credentials.isLoading && <Spinner />}
      {credentials.error && <Alert variant="error" className="mt-4">{getErrorMessage(credentials.error)}</Alert>}

      {credentials.data && (
        <Card className="mt-6 max-w-2xl">
          <h2 className="font-semibold text-white">Credenciais</h2>
          <div className="mt-2">
            <CopyRow label="Agent Code" value={credentials.data.agentCode} />
            <CopyRow label="Agent Token" value={credentials.data.agentToken} />
            <CopyRow label="Secret Key" value={credentials.data.secretKey} />
            <CopyRow label="API URL" value={credentials.data.apiUrl} />
            <CopyRow label="Webhook Balance" value={credentials.data.webhookBalanceUrl} />
            <CopyRow label="Webhook Transaction" value={credentials.data.webhookTransactionUrl} />
          </div>
        </Card>
      )}

      <Card className="mt-6 max-w-2xl">
        <h2 className="font-semibold text-white">Saldo do agente</h2>
        {balances.isLoading && <Spinner />}
        {balances.error && <Alert variant="error" className="mt-4">{getErrorMessage(balances.error)}</Alert>}
        {balances.data && (
          <ul className="mt-4 space-y-2">
            {Object.entries(balances.data).map(([key, value]) => (
              <li key={key} className="flex justify-between text-sm">
                <span className="text-casino-muted">{key}</span>
                <span className="text-white">{value}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
