const COLOR: Record<string, string> = {
  ACTIVE: "green", ATIVO: "green", ATIVA: "green", SUCCESS: "green", OK: "green",
  APPROVED: "green", PAID: "green", CONVERTIDO: "green",
  PENDING: "amber", IN_REVIEW: "amber", GENERATED: "amber", AGENDADA: "amber",
  DORMENTE: "amber", PAUSADA: "amber", PAUSADO: "amber", "MÉDIO": "amber", PENDENTE: "amber",
  DENIED: "red", ERROR: "red", BLOCKED: "red", REJECTED: "red", SELF_EXCLUDED: "red",
  FAILED: "red", EXPIRED: "red", EXPIRADO: "red", CANCELADO: "red", DIVERGENTE: "red",
  ALTO: "red", ENCERRADA: "gray", DISABLED: "gray", NOT_REQUESTED: "gray",
  BAIXO: "green",
};

const LABEL: Record<string, string> = {
  ACTIVE: "Ativo", BLOCKED: "Bloqueado", SELF_EXCLUDED: "Autoexcluído", DISABLED: "Desativado",
  SUCCESS: "Sucesso", DENIED: "Negado", ERROR: "Erro",
  APPROVED: "Aprovado", PENDING: "Pendente", IN_REVIEW: "Em análise", REJECTED: "Rejeitado",
  NOT_REQUESTED: "Não exigido", PAID: "Pago", GENERATED: "Gerado", EXPIRED: "Expirado",
  FAILED: "Falha",
};

export function StatusTag({ value }: { value: string }) {
  return <span className={`tag ${COLOR[value] ?? "blue"}`}>{LABEL[value] ?? value}</span>;
}
