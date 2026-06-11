import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { paths } from '../routes/paths';

export function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-casino-bg p-8">
      <Card className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-white">Acesso negado</h1>
        <p className="mt-2 text-sm text-casino-muted">
          Sua conta não possui permissão de administrador ou operador.
        </p>
        <Link to={paths.login} className="mt-6 inline-block">
          <Button variant="secondary">Voltar ao login</Button>
        </Link>
      </Card>
    </div>
  );
}
