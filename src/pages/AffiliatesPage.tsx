import { Card } from '../components/ui/Card';

export function AffiliatesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Afiliados</h1>
      <p className="mt-1 text-sm text-casino-muted">Programa de afiliados</p>

      <Card className="mt-6 max-w-lg">
        <p className="text-sm text-casino-muted">
          Em breve — a API de afiliados ainda retorna dados vazios. Esta seção será habilitada quando o módulo
          estiver completo no backend.
        </p>
      </Card>
    </div>
  );
}
