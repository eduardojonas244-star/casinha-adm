/**
 * DADOS DE DEMONSTRAÇÃO — todo o backoffice é visualização.
 * Valores monetários em CENTAVOS inteiros (padrão da casa), formatados na exibição.
 */

// ---------- formatação ----------
export function brl(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const reais = Math.floor(abs / 100).toLocaleString("pt-BR");
  const cent = String(abs % 100).padStart(2, "0");
  return `${sign}R$ ${reais},${cent}`;
}

export function pct(v: number, digits = 1): string {
  return `${v.toFixed(digits).replace(".", ",")}%`;
}

export function dt(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export function d(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR");
}

// ---------- Jogadores ----------
export interface Player {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  status: "ACTIVE" | "BLOCKED" | "SELF_EXCLUDED";
  kyc: "APPROVED" | "PENDING" | "IN_REVIEW" | "REJECTED" | "NOT_REQUESTED";
  segment: "VIP" | "Alto valor" | "Regular" | "Novo" | "Em risco";
  affiliate: string | null;
  createdAt: string;
  totalDeposited: number;
  depositCount: number;
  totalWithdrawn: number;
  withdrawCount: number;
  ggr: number;
  balanceReal: number;
  balanceBonus: number;
  openBets: number;
  withdrawBlocked: boolean;
  maxWithdrawOverride: number | null;
  deviceShared: boolean;
}

export const players: Player[] = [
  { id: "P-1043", name: "Ana Beatriz Souza", email: "ana.souza@gmail.com", cpf: "412.883.190-04", phone: "(11) 98877-1043", status: "ACTIVE", kyc: "APPROVED", segment: "VIP", affiliate: "AF-BETMAX", createdAt: "2026-01-14T10:22:00", totalDeposited: 4870000, depositCount: 62, totalWithdrawn: 3110000, withdrawCount: 18, ggr: 1264000, balanceReal: 182450, balanceBonus: 0, openBets: 4500, withdrawBlocked: false, maxWithdrawOverride: null, deviceShared: false },
  { id: "P-2381", name: "Bruno Ferreira Lima", email: "brunofl92@hotmail.com", cpf: "289.441.302-77", phone: "(21) 97654-2381", status: "ACTIVE", kyc: "PENDING", segment: "Alto valor", affiliate: "AF-TIGER77", createdAt: "2026-03-02T19:45:00", totalDeposited: 1240000, depositCount: 21, totalWithdrawn: 380000, withdrawCount: 3, ggr: 402000, balanceReal: 96200, balanceBonus: 15000, openBets: 0, withdrawBlocked: false, maxWithdrawOverride: null, deviceShared: false },
  { id: "P-3117", name: "Carla Mendes Oliveira", email: "carlamendes@yahoo.com.br", cpf: "155.209.876-31", phone: "(31) 99123-3117", status: "ACTIVE", kyc: "APPROVED", segment: "Regular", affiliate: null, createdAt: "2026-04-18T08:10:00", totalDeposited: 268000, depositCount: 14, totalWithdrawn: 92000, withdrawCount: 2, ggr: 88400, balanceReal: 31780, balanceBonus: 8200, openBets: 1200, withdrawBlocked: false, maxWithdrawOverride: null, deviceShared: false },
  { id: "P-4402", name: "Diego Santana Rocha", email: "diego.rocha@gmail.com", cpf: "601.337.458-90", phone: "(41) 98444-4402", status: "ACTIVE", kyc: "IN_REVIEW", segment: "Em risco", affiliate: "AF-TIGER77", createdAt: "2026-05-30T22:31:00", totalDeposited: 90000, depositCount: 3, totalWithdrawn: 0, withdrawCount: 0, ggr: -412000, balanceReal: 502000, balanceBonus: 0, openBets: 0, withdrawBlocked: true, maxWithdrawOverride: 100000, deviceShared: true },
  { id: "P-5210", name: "Elisa Cristina Prado", email: "elisaprado@outlook.com", cpf: "733.590.211-46", phone: "(51) 99777-5210", status: "ACTIVE", kyc: "APPROVED", segment: "Regular", affiliate: "AF-BETMAX", createdAt: "2026-02-09T14:05:00", totalDeposited: 415000, depositCount: 19, totalWithdrawn: 210000, withdrawCount: 5, ggr: 131000, balanceReal: 12300, balanceBonus: 0, openBets: 0, withdrawBlocked: false, maxWithdrawOverride: null, deviceShared: false },
  { id: "P-6094", name: "Fábio Nogueira Dias", email: "fabinho.dias@gmail.com", cpf: "824.116.930-15", phone: "(61) 98111-6094", status: "BLOCKED", kyc: "REJECTED", segment: "Em risco", affiliate: null, createdAt: "2026-06-12T03:47:00", totalDeposited: 30000, depositCount: 1, totalWithdrawn: 0, withdrawCount: 0, ggr: 4200, balanceReal: 0, balanceBonus: 0, openBets: 0, withdrawBlocked: true, maxWithdrawOverride: null, deviceShared: true },
  { id: "P-7731", name: "Gabriela Torres Cunha", email: "gabi.torres@gmail.com", cpf: "348.772.605-88", phone: "(71) 99666-7731", status: "ACTIVE", kyc: "APPROVED", segment: "Alto valor", affiliate: "AF-LUCKY", createdAt: "2025-12-03T16:20:00", totalDeposited: 2110000, depositCount: 44, totalWithdrawn: 1470000, withdrawCount: 11, ggr: 587000, balanceReal: 74900, balanceBonus: 22000, openBets: 8000, withdrawBlocked: false, maxWithdrawOverride: null, deviceShared: false },
  { id: "P-8156", name: "Henrique Vaz Martins", email: "hvmartins@uol.com.br", cpf: "917.204.339-52", phone: "(81) 98555-8156", status: "SELF_EXCLUDED", kyc: "APPROVED", segment: "Regular", affiliate: null, createdAt: "2026-01-27T11:58:00", totalDeposited: 620000, depositCount: 28, totalWithdrawn: 350000, withdrawCount: 7, ggr: 214000, balanceReal: 5400, balanceBonus: 0, openBets: 0, withdrawBlocked: false, maxWithdrawOverride: null, deviceShared: false },
  { id: "P-9023", name: "Isabela Farias Neto", email: "isa.farias@gmail.com", cpf: "266.458.017-23", phone: "(85) 99222-9023", status: "ACTIVE", kyc: "NOT_REQUESTED", segment: "Novo", affiliate: "AF-LUCKY", createdAt: "2026-06-28T20:14:00", totalDeposited: 5000, depositCount: 1, totalWithdrawn: 0, withdrawCount: 0, ggr: 1800, balanceReal: 3200, balanceBonus: 5000, openBets: 0, withdrawBlocked: false, maxWithdrawOverride: null, deviceShared: false },
  { id: "P-9871", name: "João Pedro Alencar", email: "jpalencar@gmail.com", cpf: "590.663.842-60", phone: "(11) 97333-9871", status: "ACTIVE", kyc: "PENDING", segment: "Regular", affiliate: "AF-BETMAX", createdAt: "2026-05-11T09:36:00", totalDeposited: 152000, depositCount: 8, totalWithdrawn: 40000, withdrawCount: 1, ggr: 47600, balanceReal: 28150, balanceBonus: 0, openBets: 2000, withdrawBlocked: false, maxWithdrawOverride: null, deviceShared: false },
  { id: "P-1120", name: "Karen Lopes Brito", email: "karen.brito@hotmail.com", cpf: "108.930.574-19", phone: "(19) 98999-1120", status: "ACTIVE", kyc: "APPROVED", segment: "Regular", affiliate: null, createdAt: "2026-03-25T17:42:00", totalDeposited: 336000, depositCount: 16, totalWithdrawn: 118000, withdrawCount: 4, ggr: 99800, balanceReal: 41200, balanceBonus: 12500, openBets: 0, withdrawBlocked: false, maxWithdrawOverride: null, deviceShared: false },
  { id: "P-1287", name: "Lucas Gabriel Moura", email: "lucasgmoura@gmail.com", cpf: "475.812.096-34", phone: "(27) 99444-1287", status: "ACTIVE", kyc: "APPROVED", segment: "VIP", affiliate: "AF-TIGER77", createdAt: "2025-11-19T13:03:00", totalDeposited: 6920000, depositCount: 88, totalWithdrawn: 5140000, withdrawCount: 26, ggr: 1533000, balanceReal: 264800, balanceBonus: 0, openBets: 15000, withdrawBlocked: false, maxWithdrawOverride: null, deviceShared: false },
];

export function playerById(id: string): Player {
  return players.find((p) => p.id === id) ?? players[0];
}

// ---------- Extrato do ledger (perfil) ----------
export interface LedgerLine {
  id: string;
  at: string;
  kind: string;
  desc: string;
  amount: number;
  balanceAfter: number;
  account: "REAL" | "BONUS";
}

export const ledgerLines: LedgerLine[] = [
  { id: "L-99812", at: "2026-07-01T18:42:00", kind: "WIN", desc: "Ganho — Fortune Tiger (round #88213)", amount: 18400, balanceAfter: 182450, account: "REAL" },
  { id: "L-99807", at: "2026-07-01T18:41:00", kind: "BET", desc: "Aposta — Fortune Tiger (round #88213)", amount: -9200, balanceAfter: 164050, account: "REAL" },
  { id: "L-99781", at: "2026-07-01T17:15:00", kind: "DEPOSIT", desc: "Depósito PIX — E2E8817f2ab", amount: 50000, balanceAfter: 173250, account: "REAL" },
  { id: "L-99754", at: "2026-07-01T15:03:00", kind: "WITHDRAWAL_RESERVE", desc: "Reserva de saque — pedido W-7301", amount: -80000, balanceAfter: 123250, account: "REAL" },
  { id: "L-99720", at: "2026-06-30T23:55:00", kind: "BONUS_CONVERSION", desc: "Conversão de bônus — rollover cumprido (Boas-vindas 100%)", amount: 20000, balanceAfter: 203250, account: "REAL" },
  { id: "L-99719", at: "2026-06-30T23:55:00", kind: "BONUS_CONVERSION", desc: "Baixa do saldo bônus — conversão", amount: -20000, balanceAfter: 0, account: "BONUS" },
  { id: "L-99693", at: "2026-06-30T21:12:00", kind: "BET", desc: "Aposta — Aviator (round #87990)", amount: -15000, balanceAfter: 183250, account: "REAL" },
  { id: "L-99671", at: "2026-06-30T20:44:00", kind: "MANUAL_ADJUSTMENT", desc: "Ajuste manual (+) — cortesia atraso no saque (op: financeiro@ricaobet.dev)", amount: 10000, balanceAfter: 198250, account: "REAL" },
  { id: "L-99630", at: "2026-06-29T19:30:00", kind: "BONUS_GRANT", desc: "Concessão — Cashback semanal 10%", amount: 20000, balanceAfter: 20000, account: "BONUS" },
  { id: "L-99584", at: "2026-06-28T22:08:00", kind: "WITHDRAWAL_PAYOUT", desc: "Saque pago — W-7218 (PIX)", amount: -120000, balanceAfter: 188250, account: "REAL" },
];

// ---------- Saques ----------
export interface Withdrawal {
  id: string;
  playerId: string;
  playerName: string;
  email: string;
  amount: number;
  pixKey: string;
  pixOwnerMatch: boolean;
  status: "PENDING" | "APPROVED" | "PAID" | "REJECTED" | "FAILED";
  requestedAt: string;
  minutesInQueue: number;
  risk: "BAIXO" | "MÉDIO" | "ALTO";
  checks: { kyc: boolean; rollover: boolean; pixCpf: boolean; winRatio: boolean; device: boolean };
  blockedByOperator: boolean;
}

export const withdrawals: Withdrawal[] = [
  { id: "W-7301", playerId: "P-1043", playerName: "Ana Beatriz Souza", email: "ana.souza@gmail.com", amount: 80000, pixKey: "412.883.190-04", pixOwnerMatch: true, status: "PENDING", requestedAt: "2026-07-01T15:03:00", minutesInQueue: 24, risk: "BAIXO", checks: { kyc: true, rollover: true, pixCpf: true, winRatio: true, device: true }, blockedByOperator: false },
  { id: "W-7300", playerId: "P-4402", playerName: "Diego Santana Rocha", email: "diego.rocha@gmail.com", amount: 480000, pixKey: "outra-chave@pix.com", pixOwnerMatch: false, status: "PENDING", requestedAt: "2026-07-01T11:47:00", minutesInQueue: 220, risk: "ALTO", checks: { kyc: false, rollover: true, pixCpf: false, winRatio: false, device: false }, blockedByOperator: true },
  { id: "W-7298", playerId: "P-7731", playerName: "Gabriela Torres Cunha", email: "gabi.torres@gmail.com", amount: 150000, pixKey: "348.772.605-88", pixOwnerMatch: true, status: "PENDING", requestedAt: "2026-07-01T13:58:00", minutesInQueue: 89, risk: "MÉDIO", checks: { kyc: true, rollover: false, pixCpf: true, winRatio: true, device: true }, blockedByOperator: false },
  { id: "W-7295", playerId: "P-1287", playerName: "Lucas Gabriel Moura", email: "lucasgmoura@gmail.com", amount: 300000, pixKey: "(27) 99444-1287", pixOwnerMatch: true, status: "APPROVED", requestedAt: "2026-07-01T10:15:00", minutesInQueue: 0, risk: "BAIXO", checks: { kyc: true, rollover: true, pixCpf: true, winRatio: true, device: true }, blockedByOperator: false },
  { id: "W-7290", playerId: "P-5210", playerName: "Elisa Cristina Prado", email: "elisaprado@outlook.com", amount: 60000, pixKey: "733.590.211-46", pixOwnerMatch: true, status: "PAID", requestedAt: "2026-06-30T19:22:00", minutesInQueue: 0, risk: "BAIXO", checks: { kyc: true, rollover: true, pixCpf: true, winRatio: true, device: true }, blockedByOperator: false },
  { id: "W-7288", playerId: "P-6094", playerName: "Fábio Nogueira Dias", email: "fabinho.dias@gmail.com", amount: 25000, pixKey: "chave-terceiro@pix.com", pixOwnerMatch: false, status: "REJECTED", requestedAt: "2026-06-30T15:40:00", minutesInQueue: 0, risk: "ALTO", checks: { kyc: false, rollover: false, pixCpf: false, winRatio: true, device: false }, blockedByOperator: false },
  { id: "W-7284", playerId: "P-1120", playerName: "Karen Lopes Brito", email: "karen.brito@hotmail.com", amount: 45000, pixKey: "108.930.574-19", pixOwnerMatch: true, status: "FAILED", requestedAt: "2026-06-30T12:11:00", minutesInQueue: 0, risk: "BAIXO", checks: { kyc: true, rollover: true, pixCpf: true, winRatio: true, device: true }, blockedByOperator: false },
];

// ---------- Depósitos ----------
export interface Deposit {
  id: string;
  playerName: string;
  email: string;
  amount: number;
  status: "PAID" | "GENERATED" | "EXPIRED";
  at: string;
  txid: string;
  e2e: string | null;
  gateway: string;
}

export const deposits: Deposit[] = [
  { id: "D-18821", playerName: "Ana Beatriz Souza", email: "ana.souza@gmail.com", amount: 50000, status: "PAID", at: "2026-07-01T17:15:00", txid: "TXQR8817F2AB01", e2e: "E2E8817f2ab9921", gateway: "PagFast" },
  { id: "D-18820", playerName: "Lucas Gabriel Moura", email: "lucasgmoura@gmail.com", amount: 200000, status: "PAID", at: "2026-07-01T16:48:00", txid: "TXQR7745C1DD02", e2e: "E2E7745c1dd8830", gateway: "PagFast" },
  { id: "D-18819", playerName: "Isabela Farias Neto", email: "isa.farias@gmail.com", amount: 5000, status: "PAID", at: "2026-07-01T16:31:00", txid: "TXQR5510A9EE03", e2e: "E2E5510a9ee7742", gateway: "PagFast" },
  { id: "D-18818", playerName: "Bruno Ferreira Lima", email: "brunofl92@hotmail.com", amount: 30000, status: "GENERATED", at: "2026-07-01T16:20:00", txid: "TXQR3390B7CC04", e2e: null, gateway: "PagFast" },
  { id: "D-18817", playerName: "Carla Mendes Oliveira", email: "carlamendes@yahoo.com.br", amount: 10000, status: "EXPIRED", at: "2026-07-01T15:02:00", txid: "TXQR2281D5FF05", e2e: null, gateway: "PixPago" },
  { id: "D-18816", playerName: "João Pedro Alencar", email: "jpalencar@gmail.com", amount: 25000, status: "PAID", at: "2026-07-01T14:44:00", txid: "TXQR1173E3AA06", e2e: "E2E1173e3aa6651", gateway: "PixPago" },
  { id: "D-18815", playerName: "Gabriela Torres Cunha", email: "gabi.torres@gmail.com", amount: 100000, status: "PAID", at: "2026-07-01T13:37:00", txid: "TXQR0064F1BB07", e2e: "E2E0064f1bb5560", gateway: "PagFast" },
  { id: "D-18814", playerName: "Karen Lopes Brito", email: "karen.brito@hotmail.com", amount: 15000, status: "EXPIRED", at: "2026-07-01T12:19:00", txid: "TXQR9955A8CC08", e2e: null, gateway: "PagFast" },
];

// ---------- Gateways / failover / conciliação ----------
export interface Gateway {
  id: string;
  name: string;
  apiUrl: string;
  webhookUrl: string;
  active: boolean;
  priority: number;
  feePct: number;
  feeFixed: number;
  healthy: boolean;
  latencyMs: number;
  rangeMin: number | null;
  rangeMax: number | null;
}

export const gateways: Gateway[] = [
  { id: "GW-1", name: "PagFast", apiUrl: "https://api.pagfast.com.br/v2", webhookUrl: "https://api.ricaobet.com/webhooks/pagfast/cb-7f2a91", active: true, priority: 1, feePct: 1.4, feeFixed: 10, healthy: true, latencyMs: 182, rangeMin: null, rangeMax: null },
  { id: "GW-2", name: "PixPago", apiUrl: "https://gateway.pixpago.io/api", webhookUrl: "https://api.ricaobet.com/webhooks/pixpago/cb-3d81b4", active: true, priority: 2, feePct: 1.9, feeFixed: 0, healthy: true, latencyMs: 240, rangeMin: null, rangeMax: 500000 },
  { id: "GW-3", name: "TransferMax", apiUrl: "https://api.transfermax.com/v1", webhookUrl: "https://api.ricaobet.com/webhooks/transfermax/cb-9c44e0", active: false, priority: 3, feePct: 2.2, feeFixed: 25, healthy: false, latencyMs: 1840, rangeMin: 500001, rangeMax: null },
];

export const failoverConfig = {
  enabled: true,
  windowMinutes: 12,
  minGenerated: 5,
  lastSwitch: { at: "2026-06-27T03:12:00", from: "PagFast", to: "PixPago", reason: "0 depósitos confirmados em 12 min (7 PIX gerados)", returnedAt: "2026-06-27T04:05:00" },
};

export interface ReconciliationRun {
  date: string;
  ledgerDeposits: number;
  gatewayDeposits: number;
  ledgerWithdrawals: number;
  gatewayWithdrawals: number;
  divergences: number;
  status: "OK" | "DIVERGENTE";
}

export const reconciliationRuns: ReconciliationRun[] = [
  { date: "2026-06-30", ledgerDeposits: 8734500, gatewayDeposits: 8734500, ledgerWithdrawals: 5211000, gatewayWithdrawals: 5211000, divergences: 0, status: "OK" },
  { date: "2026-06-29", ledgerDeposits: 9120300, gatewayDeposits: 9120300, ledgerWithdrawals: 6034000, gatewayWithdrawals: 6034000, divergences: 0, status: "OK" },
  { date: "2026-06-28", ledgerDeposits: 11250800, gatewayDeposits: 11290800, ledgerWithdrawals: 7412000, gatewayWithdrawals: 7412000, divergences: 2, status: "DIVERGENTE" },
  { date: "2026-06-27", ledgerDeposits: 7845200, gatewayDeposits: 7845200, ledgerWithdrawals: 4980000, gatewayWithdrawals: 4980000, divergences: 0, status: "OK" },
  { date: "2026-06-26", ledgerDeposits: 8433100, gatewayDeposits: 8433100, ledgerWithdrawals: 5502000, gatewayWithdrawals: 5502000, divergences: 0, status: "OK" },
];

export const reconciliationItems = [
  { id: "RI-1", date: "2026-06-28", kind: "Transação sem lançamento", ref: "TXQR8823AB11 (PagFast)", amount: 25000, note: "Webhook perdido — reentregue manualmente às 09:14" },
  { id: "RI-2", date: "2026-06-28", kind: "Transação sem lançamento", ref: "TXQR8830CD22 (PagFast)", amount: 15000, note: "Webhook perdido — reentregue manualmente às 09:15" },
];

// ---------- KYC ----------
export interface KycCase {
  id: string;
  playerId: string;
  playerName: string;
  status: "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED";
  lockedAmount: number;
  waitingHours: number;
  docs: string[];
  birthDate: string;
  cpfCheck: "OK" | "DIVERGENTE" | "PENDENTE";
  submittedAt: string;
}

export const kycCases: KycCase[] = [
  { id: "K-501", playerId: "P-2381", playerName: "Bruno Ferreira Lima", status: "PENDING", lockedAmount: 96200, waitingHours: 3.5, docs: ["RG (frente)", "RG (verso)", "Selfie"], birthDate: "1992-08-14", cpfCheck: "OK", submittedAt: "2026-07-01T14:30:00" },
  { id: "K-502", playerId: "P-9871", playerName: "João Pedro Alencar", status: "PENDING", lockedAmount: 28150, waitingHours: 1.2, docs: ["CNH", "Selfie"], birthDate: "1998-02-27", cpfCheck: "PENDENTE", submittedAt: "2026-07-01T16:50:00" },
  { id: "K-499", playerId: "P-4402", playerName: "Diego Santana Rocha", status: "IN_REVIEW", lockedAmount: 502000, waitingHours: 26.0, docs: ["RG (frente)", "RG (verso)", "Selfie", "Comprovante de residência"], birthDate: "2001-11-05", cpfCheck: "DIVERGENTE", submittedAt: "2026-06-30T12:00:00" },
  { id: "K-495", playerId: "P-1043", playerName: "Ana Beatriz Souza", status: "APPROVED", lockedAmount: 0, waitingHours: 0, docs: ["CNH", "Selfie"], birthDate: "1989-04-02", cpfCheck: "OK", submittedAt: "2026-06-25T10:12:00" },
  { id: "K-490", playerId: "P-6094", playerName: "Fábio Nogueira Dias", status: "REJECTED", lockedAmount: 0, waitingHours: 0, docs: ["RG (frente)", "Selfie"], birthDate: "2009-07-19", cpfCheck: "DIVERGENTE", submittedAt: "2026-06-22T18:44:00" },
];

// ---------- Bônus ----------
export const bonusHouseConfig = {
  rolloverWelcome: 30,
  rolloverCashback: 2,
  validityDays: 7,
  maxBetWithBonus: null as number | null, // sem limite (decisão do Hugo, seção 3.8)
  weights: { slots: 100, live: 100, crash: 100 },
};

export interface BonusCampaign {
  id: string;
  name: string;
  type: "Match de depósito" | "Cashback" | "Valor fixo" | "Freespins";
  trigger: string;
  status: "ATIVA" | "AGENDADA" | "ENCERRADA" | "PAUSADA";
  granted: number;
  converted: number;
  costOverNgr: number;
  rollover: number;
  validityDays: number;
  maxPct: number | null;
  cap: number | null;
  start: string;
  end: string | null;
}

export const bonusCampaigns: BonusCampaign[] = [
  { id: "B-01", name: "Boas-vindas 100% até R$ 200", type: "Match de depósito", trigger: "1º depósito", status: "ATIVA", granted: 5480000, converted: 918000, costOverNgr: 8.4, rollover: 30, validityDays: 7, maxPct: 100, cap: 20000, start: "2026-05-01", end: null },
  { id: "B-02", name: "Cashback semanal 10%", type: "Cashback", trigger: "Perdas da semana (seg 00h)", status: "ATIVA", granted: 2120000, converted: 1490000, costOverNgr: 5.1, rollover: 2, validityDays: 7, maxPct: 10, cap: 50000, start: "2026-04-15", end: null },
  { id: "B-03", name: "Recarga de sexta 50%", type: "Match de depósito", trigger: "Depósito na sexta-feira", status: "AGENDADA", granted: 0, converted: 0, costOverNgr: 0, rollover: 30, validityDays: 5, maxPct: 50, cap: 15000, start: "2026-07-04", end: "2026-07-04" },
  { id: "B-04", name: "Freespins Fortune Tiger", type: "Freespins", trigger: "Código promocional TIGER50", status: "PAUSADA", granted: 340000, converted: 88000, costOverNgr: 2.2, rollover: 20, validityDays: 3, maxPct: null, cap: null, start: "2026-06-01", end: "2026-06-30" },
  { id: "B-05", name: "Mega bônus junino 150%", type: "Match de depósito", trigger: "Depósito ≥ R$ 100 (código JUNINA)", status: "ENCERRADA", granted: 8900000, converted: 2130000, costOverNgr: 12.7, rollover: 35, validityDays: 7, maxPct: 150, cap: 30000, start: "2026-06-10", end: "2026-06-24" },
];

export interface BonusGrant {
  id: string;
  playerId: string;
  playerName: string;
  campaign: string;
  amount: number;
  wagered: number;
  target: number;
  status: "ATIVO" | "DORMENTE" | "CONVERTIDO" | "EXPIRADO" | "CANCELADO";
  expiresAt: string;
}

export const bonusGrants: BonusGrant[] = [
  { id: "G-881", playerId: "P-2381", playerName: "Bruno Ferreira Lima", campaign: "Boas-vindas 100% até R$ 200", amount: 15000, wagered: 189000, target: 450000, status: "ATIVO", expiresAt: "2026-07-06T23:59:00" },
  { id: "G-874", playerId: "P-3117", playerName: "Carla Mendes Oliveira", campaign: "Cashback semanal 10%", amount: 8200, wagered: 9840, target: 16400, status: "ATIVO", expiresAt: "2026-07-07T23:59:00" },
  { id: "G-869", playerId: "P-9023", playerName: "Isabela Farias Neto", campaign: "Boas-vindas 100% até R$ 200", amount: 5000, wagered: 0, target: 150000, status: "DORMENTE", expiresAt: "2026-07-05T23:59:00" },
  { id: "G-860", playerId: "P-7731", playerName: "Gabriela Torres Cunha", campaign: "Cashback semanal 10%", amount: 22000, wagered: 30800, target: 44000, status: "ATIVO", expiresAt: "2026-07-07T23:59:00" },
  { id: "G-855", playerId: "P-1043", playerName: "Ana Beatriz Souza", campaign: "Cashback semanal 10%", amount: 20000, wagered: 40000, target: 40000, status: "CONVERTIDO", expiresAt: "2026-07-07T23:59:00" },
  { id: "G-841", playerId: "P-1120", playerName: "Karen Lopes Brito", campaign: "Mega bônus junino 150%", amount: 12500, wagered: 61000, target: 437500, status: "EXPIRADO", expiresAt: "2026-06-30T23:59:00" },
];

export const bonusAlerts = [
  { id: "BA-1", at: "2026-07-01T09:20:00", kind: "Aposta de cobertura", detail: "P-4402 Diego Santana — apostas simultâneas em vermelho/preto (Roleta Brasileira) com saldo bônus ativo", severity: "ALTO" },
  { id: "BA-2", at: "2026-06-30T22:41:00", kind: "Multi-conta coletando bônus", detail: "Device a8f2…c91 compartilhado por P-4402 e P-6094 — ambos resgataram Boas-vindas 100%", severity: "ALTO" },
  { id: "BA-3", at: "2026-06-29T14:05:00", kind: "Padrão de aposta mínima", detail: "P-1120 Karen Lopes — 4.100 rodadas de R$ 0,40 em sequência no rollover", severity: "MÉDIO" },
];

// ---------- Afiliados ----------
export interface Affiliate {
  id: string;
  code: string;
  user: string;
  model: "CPA" | "RevShare" | "Híbrido";
  toReceive: number;
  status: "ATIVO" | "PAUSADO";
  registrations: number;
  ftds: number;
  ftdValue: number;
  depositsCount: number;
  depositsValue: number;
  withdrawalsValue: number;
  betsValue: number;
  ggr: number;
  ngr: number;
  pixKey: string;
}

export const affiliates: Affiliate[] = [
  { id: "AF-BETMAX", code: "BETMAX", user: "betmax.midia@gmail.com", model: "Híbrido", toReceive: 1240000, status: "ATIVO", registrations: 1842, ftds: 512, ftdValue: 4180000, depositsCount: 6230, depositsValue: 48120000, withdrawalsValue: 31240000, betsValue: 182400000, ggr: 12180000, ngr: 8320000, pixKey: "51.998.204/0001-33" },
  { id: "AF-TIGER77", code: "TIGER77", user: "tiger77@influmax.com.br", model: "RevShare", toReceive: 683000, status: "ATIVO", registrations: 977, ftds: 288, ftdValue: 1920000, depositsCount: 3140, depositsValue: 22350000, withdrawalsValue: 15870000, betsValue: 90210000, ggr: 5940000, ngr: 4020000, pixKey: "tiger77@influmax.com.br" },
  { id: "AF-LUCKY", code: "LUCKY", user: "luckypromo@gmail.com", model: "CPA", toReceive: 245000, status: "ATIVO", registrations: 634, ftds: 141, ftdValue: 780000, depositsCount: 1220, depositsValue: 7640000, withdrawalsValue: 4890000, betsValue: 30110000, ggr: 2210000, ngr: 1540000, pixKey: "227.443.981-06" },
  { id: "AF-ROLLIN", code: "ROLLIN", user: "rollinbet@hotmail.com", model: "CPA", toReceive: 0, status: "PAUSADO", registrations: 118, ftds: 12, ftdValue: 61000, depositsCount: 84, depositsValue: 420000, withdrawalsValue: 280000, betsValue: 1830000, ggr: 122000, ngr: 84000, pixKey: "(11) 96222-8090" },
];

export interface AffiliatePayoutReceipt {
  id: string;
  affiliateId: string;
  affiliateCode: string;
  at: string;
  amount: number;
  txid: string;
  e2e: string;
  paidBy: string;
}

export const affiliateReceipts: AffiliatePayoutReceipt[] = [
  { id: "AP-118", affiliateId: "AF-BETMAX", affiliateCode: "BETMAX", at: "2026-06-25T14:10:00", amount: 1850000, txid: "TXAF9912BM01", e2e: "E2Eaff9912bm4471", paidBy: "financeiro@ricaobet.dev" },
  { id: "AP-117", affiliateId: "AF-TIGER77", affiliateCode: "TIGER77", at: "2026-06-25T14:05:00", amount: 920000, txid: "TXAF8821TG02", e2e: "E2Eaff8821tg3350", paidBy: "financeiro@ricaobet.dev" },
  { id: "AP-116", affiliateId: "AF-LUCKY", affiliateCode: "LUCKY", at: "2026-06-25T14:01:00", amount: 310000, txid: "TXAF7730LK03", e2e: "E2Eaff7730lk2249", paidBy: "financeiro@ricaobet.dev" },
  { id: "AP-115", affiliateId: "AF-BETMAX", affiliateCode: "BETMAX", at: "2026-06-10T11:32:00", amount: 1620000, txid: "TXAF6644BM04", e2e: "E2Eaff6644bm1108", paidBy: "admin@ricaobet.dev" },
  { id: "AP-114", affiliateId: "AF-TIGER77", affiliateCode: "TIGER77", at: "2026-06-10T11:28:00", amount: 745000, txid: "TXAF5533TG05", e2e: "E2Eaff5533tg0097", paidBy: "admin@ricaobet.dev" },
];

// ---------- Jogos & Conteúdo ----------
export interface Game {
  id: string;
  name: string;
  provider: string;
  rtp: number;
  active: boolean;
  tags: ("novo" | "hot" | "exclusivo")[];
  sessions7d: number;
  ggr7d: number;
  emoji: string;
  categories: string[];
}

export const games: Game[] = [
  { id: "J-01", name: "Fortune Tiger", provider: "PG Soft", rtp: 96.81, active: true, tags: ["hot"], sessions7d: 48210, ggr7d: 1820000, emoji: "🐯", categories: ["Populares", "Slots", "Exclusivos da casa"] },
  { id: "J-02", name: "Aviator", provider: "Spribe", rtp: 97.0, active: true, tags: ["hot"], sessions7d: 39440, ggr7d: 1410000, emoji: "✈️", categories: ["Populares", "Crash"] },
  { id: "J-03", name: "Gates of Olympus", provider: "Pragmatic Play", rtp: 96.5, active: true, tags: [], sessions7d: 22780, ggr7d: 980000, emoji: "⚡", categories: ["Populares", "Slots"] },
  { id: "J-04", name: "Roleta Brasileira", provider: "Evolution", rtp: 97.3, active: true, tags: [], sessions7d: 15230, ggr7d: 760000, emoji: "🎡", categories: ["Populares", "Ao vivo"] },
  { id: "J-05", name: "Mines", provider: "Spribe", rtp: 97.0, active: true, tags: [], sessions7d: 18110, ggr7d: 640000, emoji: "💣", categories: ["Populares", "Crash"] },
  { id: "J-06", name: "Fortune Rabbit", provider: "PG Soft", rtp: 96.75, active: true, tags: ["novo"], sessions7d: 12890, ggr7d: 520000, emoji: "🐰", categories: ["Novos", "Slots"] },
  { id: "J-07", name: "Sweet Bonanza", provider: "Pragmatic Play", rtp: 96.48, active: true, tags: [], sessions7d: 9870, ggr7d: 410000, emoji: "🍬", categories: ["Slots"] },
  { id: "J-08", name: "Crazy Time", provider: "Evolution", rtp: 96.08, active: true, tags: ["hot"], sessions7d: 8650, ggr7d: 505000, emoji: "🎪", categories: ["Ao vivo"] },
  { id: "J-09", name: "Spaceman", provider: "Pragmatic Play", rtp: 96.5, active: true, tags: [], sessions7d: 7420, ggr7d: 310000, emoji: "🚀", categories: ["Crash"] },
  { id: "J-10", name: "Fortune Ox", provider: "PG Soft", rtp: 96.75, active: false, tags: [], sessions7d: 0, ggr7d: 0, emoji: "🐂", categories: ["Slots"] },
  { id: "J-11", name: "Bac Bo", provider: "Evolution", rtp: 98.87, active: true, tags: ["novo"], sessions7d: 5110, ggr7d: 195000, emoji: "🎲", categories: ["Novos", "Ao vivo"] },
  { id: "J-12", name: "Penalty Shoot-out", provider: "Evoplay", rtp: 96.2, active: true, tags: [], sessions7d: 4230, ggr7d: 152000, emoji: "⚽", categories: ["Crash"] },
];

export interface GameCategory {
  id: string;
  name: string;
  slug: string;
  type: "MANUAL" | "DINÂMICA";
  rule: string | null;
  gamesCount: number;
  onHomeCount: number;
  active: boolean;
  onHome: boolean;
  position: number;
}

export const categories: GameCategory[] = [
  { id: "C-1", name: "Populares", slug: "populares", type: "DINÂMICA", rule: "Top 20 por sessões — 7 dias (job de hora em hora)", gamesCount: 20, onHomeCount: 10, active: true, onHome: true, position: 1 },
  { id: "C-2", name: "Slots", slug: "slots", type: "MANUAL", rule: null, gamesCount: 214, onHomeCount: 12, active: true, onHome: true, position: 2 },
  { id: "C-3", name: "Ao vivo", slug: "ao-vivo", type: "MANUAL", rule: null, gamesCount: 48, onHomeCount: 8, active: true, onHome: true, position: 3 },
  { id: "C-4", name: "Crash", slug: "crash", type: "MANUAL", rule: null, gamesCount: 22, onHomeCount: 8, active: true, onHome: true, position: 4 },
  { id: "C-5", name: "Novos", slug: "novos", type: "DINÂMICA", rule: "Adicionados nos últimos 30 dias", gamesCount: 16, onHomeCount: 10, active: true, onHome: true, position: 5 },
  { id: "C-6", name: "Exclusivos da casa", slug: "exclusivos", type: "MANUAL", rule: null, gamesCount: 6, onHomeCount: 6, active: true, onHome: false, position: 6 },
];

export const providers = [
  { id: "PR-1", name: "PG Soft", active: true, gamesCount: 96, ggr7d: 2610000, lobbyOrder: 1, aggregator: "Playfiver" },
  { id: "PR-2", name: "Pragmatic Play", active: true, gamesCount: 188, ggr7d: 1930000, lobbyOrder: 2, aggregator: "Playfiver" },
  { id: "PR-3", name: "Evolution", active: true, gamesCount: 74, ggr7d: 1520000, lobbyOrder: 3, aggregator: "Playfiver" },
  { id: "PR-4", name: "Spribe", active: true, gamesCount: 12, ggr7d: 2080000, lobbyOrder: 4, aggregator: "SoftGate" },
  { id: "PR-5", name: "Evoplay", active: false, gamesCount: 61, ggr7d: 0, lobbyOrder: 5, aggregator: "SoftGate" },
];

export const aggregators = [
  { id: "AG-1", name: "Playfiver", active: true, providers: "PG Soft, Pragmatic, Evolution", healthy: true },
  { id: "AG-2", name: "SoftGate", active: true, providers: "Spribe, Evoplay", healthy: true },
];

export const banners = [
  { id: "BN-1", name: "Boas-vindas 100%", target: "Promoção → Bônus de boas-vindas", active: true, position: 1, clicks: 18240, ctr: 4.8, from: "2026-05-01", to: null, emoji: "🎁" },
  { id: "BN-2", name: "Fortune Tiger — jogue agora", target: "Jogo → Fortune Tiger", active: true, position: 2, clicks: 12110, ctr: 3.6, from: "2026-06-01", to: null, emoji: "🐯" },
  { id: "BN-3", name: "Cassino ao vivo", target: "Categoria → Ao vivo", active: true, position: 3, clicks: 6320, ctr: 2.1, from: "2026-06-15", to: null, emoji: "🎥" },
  { id: "BN-4", name: "Copa de premiações junina", target: "Promoção → Mega bônus junino", active: false, position: 4, clicks: 22890, ctr: 6.2, from: "2026-06-10", to: "2026-06-24", emoji: "🎉" },
];

export const openGamesRule = { requireDeposit: true, exceptions: [] as string[] };

// ---------- Dashboard ----------
export const dashboard = {
  // Fluxo de caixa
  cashflow: [
    { label: "Valor em depósito", value: brl(8734500), sub: "no período", delta: 12.4 },
    { label: "Quantidade de depósitos", value: "1.284", sub: "transações pagas", delta: 10.8 },
    { label: "Valor em saque", value: brl(5211000), sub: "no período", delta: 8.1 },
    { label: "Quantidade de saques", value: "312", sub: "pedidos", delta: 6.4 },
    { label: "Netdeposit", value: brl(3523500), sub: "depósito − saque", delta: 19.2 },
    { label: "% Netdeposit", value: "40,3%", sub: "net / depósitos", delta: 5.6 },
    { label: "Ticket médio depósito", value: brl(6802), sub: "por transação", delta: -1.5 },
    { label: "Ticket médio saque", value: brl(16702), sub: "por pedido", delta: 2.3 },
    { label: "Conversão PIX", value: "87,2%", sub: "gerado → pago (1.473 → 1.284)", delta: 1.1 },
  ],
  // Resultado
  result: [
    { label: "Valor de GGR", value: brl(2841000), sub: "apostas − ganhos", delta: 6.8 },
    { label: "% GGR", value: "3,1%", sub: "GGR / total apostado", delta: 0.4 },
    { label: "Valor bônus convertido", value: brl(391000), sub: "rollover cumprido no período", delta: -2.4 },
    { label: "Taxa da processadora", value: brl(137600), sub: "PagFast 1,4% + R$ 0,10", delta: 9.7 },
    { label: "NGR", value: brl(2312400), sub: "GGR − bônus convertido − taxa da processadora", delta: 5.2 },
  ],
  // Carteiras
  wallets: [
    { label: "Saldo total das carteiras", value: brl(14283000), sub: "liability — direto do ledger", delta: 3.9 },
    { label: "Saldo bônus em carteira", value: brl(563000), sub: "ainda não convertido", delta: -4.1 },
  ],
  // Aquisição & atividade
  acquisition: [
    { label: "Cadastros", value: "1.912", sub: "no período", delta: 9.6 },
    { label: "FTD (quantidade)", value: "486", sub: "primeiros depósitos", delta: 4.2 },
    { label: "FTD (valor)", value: brl(3120000), sub: "soma dos primeiros depósitos", delta: 7.9 },
    { label: "% conversão cadastro → FTD", value: "25,4%", sub: "486 de 1.912", delta: 1.8 },
    { label: "Depositantes únicos", value: "1.108", sub: "no período", delta: 2.8 },
    { label: "% de redepósito", value: "63,0%", sub: "depositaram mais de uma vez", delta: 3.4 },
    { label: "Usuários ativos", value: "1.108", sub: "depositaram no período selecionado", delta: 5.1 },
  ],
  actions: [
    { label: "Saques pendentes", value: "3", sub: "SLA médio 1h44 — acima de 1h ⚠", to: "/payments", tone: "red" },
    { label: "KYC pendentes", value: "2", sub: `${brl(124350)} travados`, to: "/kyc", tone: "amber" },
    { label: "Alertas de risco", value: "3", sub: "2 de alta severidade", to: "/bonus?tab=alertas", tone: "red" },
    { label: "Tickets abertos", value: "12", sub: "suporte (F2)", to: "/support", tone: "gray" },
  ],
  topGames: [
    { game: "Fortune Tiger", provider: "PG Soft", wagered: 30190000, ggr: 1820000, sessions: 48210 },
    { game: "Aviator", provider: "Spribe", wagered: 26700000, ggr: 1410000, sessions: 39440 },
    { game: "Gates of Olympus", provider: "Pragmatic Play", wagered: 18120000, ggr: 980000, sessions: 22780 },
    { game: "Roleta Brasileira", provider: "Evolution", wagered: 15400000, ggr: 760000, sessions: 15230 },
    { game: "Mines", provider: "Spribe", wagered: 12010000, ggr: 640000, sessions: 18110 },
  ],
  topProviders: [
    { provider: "PG Soft", games: 96, wagered: 48310000, ggr: 2610000 },
    { provider: "Spribe", games: 12, wagered: 40200000, ggr: 2080000 },
    { provider: "Pragmatic Play", games: 188, wagered: 35880000, ggr: 1930000 },
    { provider: "Evolution", games: 74, wagered: 31150000, ggr: 1520000 },
    { provider: "Evoplay", games: 61, wagered: 2840000, ggr: 98000 },
  ],
};

export const health = [
  { label: "Gateway PIX", status: "green" as const, detail: "PagFast operacional · 182ms" },
  { label: "Webhooks PAM", status: "green" as const, detail: "Playfiver ok · fila 0" },
  { label: "Fila CAPI", status: "amber" as const, detail: "312 eventos aguardando (pico normal)" },
];

// ---------- Equipe / papéis / audit ----------
export const members = [
  { id: "M-1", name: "Hugo Nakano", email: "hugo@ricaobet.dev", role: "ADMIN", status: "ACTIVE", createdAt: "2025-11-01" },
  { id: "M-2", name: "Ricardo Financeiro", email: "financeiro@ricaobet.dev", role: "FINANCEIRO", status: "ACTIVE", createdAt: "2025-11-10" },
  { id: "M-3", name: "Nicolas Suporte", email: "nicolas@ricaobet.dev", role: "SUPORTE", status: "ACTIVE", createdAt: "2025-12-02" },
  { id: "M-4", name: "Marina CRM", email: "marina.crm@ricaobet.dev", role: "CRM", status: "ACTIVE", createdAt: "2026-01-15" },
  { id: "M-5", name: "Paulo Risco", email: "paulo.risco@ricaobet.dev", role: "RISCO", status: "ACTIVE", createdAt: "2026-02-20" },
  { id: "M-6", name: "Auditor Externo", email: "auditoria@parceiro.com", role: "LEITURA", status: "DISABLED", createdAt: "2026-03-08" },
];

export const roles = [
  { name: "ADMIN", members: 1, withdrawalLimit: null as number | null, adjustmentLimit: null as number | null },
  { name: "FINANCEIRO", members: 1, withdrawalLimit: 50000, adjustmentLimit: 50000 },
  { name: "SUPORTE", members: 1, withdrawalLimit: 0, adjustmentLimit: 0 },
  { name: "CRM", members: 1, withdrawalLimit: 0, adjustmentLimit: 0 },
  { name: "RISCO", members: 1, withdrawalLimit: 0, adjustmentLimit: 0 },
  { name: "LEITURA", members: 1, withdrawalLimit: 0, adjustmentLimit: 0 },
];

export const permissionsMatrix: { module: string; permissions: { key: string; desc: string; roles: string[] }[] }[] = [
  {
    module: "players",
    permissions: [
      { key: "players.view", desc: "Ver lista e perfil de jogadores", roles: ["ADMIN", "FINANCEIRO", "SUPORTE", "CRM", "RISCO", "LEITURA"] },
      { key: "players.balance_adjust", desc: "Ajuste manual de saldo real", roles: ["ADMIN", "FINANCEIRO"] },
      { key: "players.bonus_adjust", desc: "Ajuste manual de saldo bônus", roles: ["ADMIN", "CRM"] },
      { key: "players.block", desc: "Bloquear jogador / bloquear saque", roles: ["ADMIN", "RISCO"] },
    ],
  },
  {
    module: "payments",
    permissions: [
      { key: "payments.view", desc: "Ver depósitos e saques", roles: ["ADMIN", "FINANCEIRO", "SUPORTE", "RISCO", "LEITURA"] },
      { key: "payments.withdrawals.approve", desc: "Aprovar saques", roles: ["ADMIN", "FINANCEIRO"] },
      { key: "payments.withdrawals.reject", desc: "Rejeitar saques", roles: ["ADMIN", "FINANCEIRO"] },
      { key: "payments.gateways.manage", desc: "Gerenciar gateways e failover", roles: ["ADMIN"] },
    ],
  },
  {
    module: "kyc",
    permissions: [
      { key: "kyc.view", desc: "Ver fila de KYC", roles: ["ADMIN", "SUPORTE", "RISCO", "LEITURA"] },
      { key: "kyc.review", desc: "Aprovar / rejeitar KYC", roles: ["ADMIN", "RISCO"] },
    ],
  },
  {
    module: "bonus",
    permissions: [
      { key: "bonus.view", desc: "Ver campanhas e concessões", roles: ["ADMIN", "CRM", "LEITURA"] },
      { key: "bonus.campaigns.manage", desc: "Criar / editar campanhas", roles: ["ADMIN", "CRM"] },
      { key: "bonus.grant_manual", desc: "Concessão manual de bônus", roles: ["ADMIN", "CRM"] },
      { key: "bonus.config.manage", desc: "Editar config global de bônus", roles: ["ADMIN"] },
    ],
  },
  {
    module: "affiliates",
    permissions: [
      { key: "affiliates.view", desc: "Ver afiliados e KPIs", roles: ["ADMIN", "FINANCEIRO", "LEITURA"] },
      { key: "affiliates.pay", desc: "Pagar afiliado", roles: ["ADMIN", "FINANCEIRO"] },
    ],
  },
  {
    module: "games",
    permissions: [
      { key: "games.view", desc: "Ver catálogo, categorias, banners", roles: ["ADMIN", "CRM", "LEITURA"] },
      { key: "games.manage", desc: "Editar catálogo, categorias, banners", roles: ["ADMIN"] },
    ],
  },
];

export interface AuditEntry {
  id: string;
  at: string;
  who: string;
  role: string;
  module: string;
  action: string;
  entity: string;
  outcome: "SUCCESS" | "DENIED";
  reason: string | null;
  ip: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
}

export const auditLog: AuditEntry[] = [
  { id: "A-9981", at: "2026-07-01T18:50:00", who: "financeiro@ricaobet.dev", role: "FINANCEIRO", module: "payments", action: "withdrawals.approve", entity: "W-7295", outcome: "SUCCESS", reason: "Todos os checks OK, risco baixo", ip: "187.44.102.18", before: { status: "PENDING" }, after: { status: "APPROVED" } },
  { id: "A-9978", at: "2026-07-01T17:32:00", who: "nicolas@ricaobet.dev", role: "SUPORTE", module: "payments", action: "withdrawals.approve", entity: "W-7300", outcome: "DENIED", reason: null, ip: "201.17.88.240", before: null, after: { error: "Permissão necessária: payments.withdrawals.approve" } },
  { id: "A-9975", at: "2026-07-01T16:58:00", who: "paulo.risco@ricaobet.dev", role: "RISCO", module: "players", action: "block_withdraw", entity: "P-4402", outcome: "SUCCESS", reason: "Chave PIX de terceiro + device compartilhado — investigação em curso", ip: "177.92.14.55", before: { withdrawBlocked: false }, after: { withdrawBlocked: true } },
  { id: "A-9970", at: "2026-07-01T15:44:00", who: "hugo@ricaobet.dev", role: "ADMIN", module: "bonus", action: "config.update", entity: "bonus_house_config", outcome: "SUCCESS", reason: "Decisão registrada — seção 3.8 do epic (sem aposta máxima)", ip: "189.40.77.101", before: { maxBetWithBonus: 2000 }, after: { maxBetWithBonus: null } },
  { id: "A-9967", at: "2026-07-01T14:21:00", who: "marina.crm@ricaobet.dev", role: "CRM", module: "bonus", action: "grant_manual", entity: "G-874", outcome: "SUCCESS", reason: "Compensação por instabilidade no jogo Sweet Bonanza (29/06)", ip: "200.155.9.73", before: null, after: { playerId: "P-3117", amount: 8200 } },
  { id: "A-9962", at: "2026-07-01T11:47:00", who: "financeiro@ricaobet.dev", role: "FINANCEIRO", module: "players", action: "balance_adjust", entity: "P-1043", outcome: "SUCCESS", reason: "Cortesia — atraso no saque W-7218 (SLA estourado)", ip: "187.44.102.18", before: { balanceReal: 188250 }, after: { balanceReal: 198250 } },
  { id: "A-9958", at: "2026-07-01T10:12:00", who: "hugo@ricaobet.dev", role: "ADMIN", module: "games", action: "category.reorder", entity: "home", outcome: "SUCCESS", reason: "Subir Crash pra 3ª posição no fim de semana", ip: "189.40.77.101", before: { order: ["Populares", "Slots", "Ao vivo", "Crash"] }, after: { order: ["Populares", "Slots", "Crash", "Ao vivo"] } },
  { id: "A-9950", at: "2026-06-30T22:41:00", who: "sistema", role: "—", module: "risk", action: "alert.create", entity: "BA-2", outcome: "SUCCESS", reason: "Device compartilhado coletando bônus em múltiplas contas", ip: "—", before: null, after: { severity: "ALTO", players: ["P-4402", "P-6094"] } },
  { id: "A-9944", at: "2026-06-30T19:22:00", who: "financeiro@ricaobet.dev", role: "FINANCEIRO", module: "payments", action: "withdrawals.approve", entity: "W-7290", outcome: "SUCCESS", reason: "Checks OK", ip: "187.44.102.18", before: { status: "PENDING" }, after: { status: "APPROVED" } },
  { id: "A-9931", at: "2026-06-30T08:15:00", who: "sistema", role: "—", module: "payments", action: "gateway.failover", entity: "PagFast → PixPago", outcome: "SUCCESS", reason: "0 depósitos confirmados em 12 min (7 PIX gerados)", ip: "—", before: { active: "PagFast" }, after: { active: "PixPago" } },
];

// ---------- Perfil: dados por aba ----------
export const playerLogins = [
  { at: "2026-07-01T18:38:00", ip: "187.101.44.12", device: "iPhone 15 · Safari", fingerprint: "f8a1…22c", shared: false },
  { at: "2026-07-01T09:02:00", ip: "187.101.44.12", device: "iPhone 15 · Safari", fingerprint: "f8a1…22c", shared: false },
  { at: "2026-06-30T21:15:00", ip: "200.98.71.200", device: "Windows 11 · Chrome", fingerprint: "a8f2…c91", shared: true },
  { at: "2026-06-29T14:40:00", ip: "187.101.44.12", device: "iPhone 15 · Safari", fingerprint: "f8a1…22c", shared: false },
];

export const playerNotes = [
  { at: "2026-07-01T16:59:00", by: "paulo.risco@ricaobet.dev", text: "Saque bloqueado até conclusão da investigação de device compartilhado. Não desbloquear sem OK do risco." },
  { at: "2026-06-28T11:20:00", by: "nicolas@ricaobet.dev", text: "Jogador reclamou de atraso no saque W-7218 via chat. Prometido retorno em 24h." },
  { at: "2026-06-25T10:14:00", by: "marina.crm@ricaobet.dev", text: "Perfil VIP — incluir na régua de cashback especial a partir de julho." },
];

export const playerBets = [
  { round: "#88213", game: "Fortune Tiger", provider: "PG Soft", bet: 9200, win: 18400, at: "2026-07-01T18:41:00" },
  { round: "#88190", game: "Fortune Tiger", provider: "PG Soft", bet: 9200, win: 0, at: "2026-07-01T18:39:00" },
  { round: "#87990", game: "Aviator", provider: "Spribe", bet: 15000, win: 0, at: "2026-06-30T21:12:00" },
  { round: "#87912", game: "Roleta Brasileira", provider: "Evolution", bet: 20000, win: 38000, at: "2026-06-30T20:05:00" },
  { round: "#87800", game: "Mines", provider: "Spribe", bet: 5000, win: 11500, at: "2026-06-29T22:47:00" },
];

export const responsibleGaming = {
  depositLimit: { value: 500000, period: "mensal", setBy: "jogador", since: "2026-05-02" },
  lossLimit: null as { value: number; period: string; setBy: string; since: string } | null,
  sessionLimit: { value: 180, period: "diário (minutos)", setBy: "operador", since: "2026-06-15" },
  coolingOff: null as { until: string } | null,
  selfExclusion: null as { until: string } | null,
};
