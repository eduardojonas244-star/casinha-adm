import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getGameLaunchConfig, updateGameLaunchConfig } from '../api/game-launch-config';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { Card } from '../components/ui/Card';
import { getErrorMessage } from '../api/client';

export function GameLaunchConfigPage() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const { data, isLoading, error: queryError } = useQuery({
    queryKey: ['admin-game-launch-config'],
    queryFn: getGameLaunchConfig,
  });

  const handleToggle = async () => {
    if (!data) return;
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await updateGameLaunchConfig({ requireDailyDeposit: !data.requireDailyDeposit });
      setMessage('Configuração salva.');
      await queryClient.invalidateQueries({ queryKey: ['admin-game-launch-config'] });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Config. Abertura de Jogos</h1>
      <p className="mt-1 text-sm text-casino-muted">Regras para abertura de jogos pelos usuários</p>

      {isLoading && <Spinner />}
      {queryError && <Alert variant="error" className="mt-4">{getErrorMessage(queryError)}</Alert>}

      {data && (
        <Card className="mt-6 max-w-2xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-white">Exigir Depósito Diário?</p>
              <p className="mt-1 text-sm text-casino-muted">
                Se ativo: usuário sem saldo real ou só com bônus precisa depositar hoje. Com saldo real, pode jogar.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={data.requireDailyDeposit}
              onClick={() => void handleToggle()}
              disabled={saving}
              className={`relative h-7 w-12 rounded-full transition ${data.requireDailyDeposit ? 'bg-casino-green' : 'bg-casino-border'}`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition ${data.requireDailyDeposit ? 'left-5' : 'left-0.5'}`}
              />
            </button>
          </div>

          {message && <Alert variant="success" className="mt-4">{message}</Alert>}
          {error && <Alert variant="error" className="mt-4">{error}</Alert>}

          <div className="mt-6 rounded-xl border border-casino-border bg-casino-bg p-4 text-sm text-casino-muted">
            <p className="font-semibold text-white">Informações importantes</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Esta configuração afeta todos os usuários da plataforma.</li>
              <li>A verificação é feita no backend ao chamar <code className="text-casino-green">POST /games/:id/launch</code>.</li>
              <li>Tentativas bloqueadas são registradas em AuditLog.</li>
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
}
