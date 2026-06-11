export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  cpf: string;
  status: string;
  role: string;
  emailVerifiedAt: string | null;
  createdAt: string;
}

export interface AdminUserListItem {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  createdAt: string;
}

export interface FinancialReport {
  deposits: { total: string; count: number };
  withdrawals: { total: string; count: number };
  ggr: string;
  bets: { total: string; count: number };
  wins: { total: string; count: number };
}

export interface Game {
  id: string;
  provider: string;
  externalId: string;
  name: string;
  category: string | null;
  imageUrl: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface GameCategory {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  slug: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogProvider {
  id: string;
  code: string;
  name: string;
  distribution: string;
  imageUrl: string | null;
  active: boolean;
  rtp: number;
  views: number;
  externalId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminGame {
  id: string;
  provider: string;
  externalId: string;
  name: string;
  category: string | null;
  categoryId: string | null;
  imageUrl: string | null;
  active: boolean;
  showOnHome: boolean;
  gameOriginal: boolean;
  playCount: number;
  createdAt: string;
  updatedAt: string;
  categoryRef?: GameCategory | null;
}

export interface GameRound {
  id: string;
  userEmail: string;
  sessionId: string | null;
  transactionId: string;
  gameCode: string;
  outcome: string;
  balanceSource: string | null;
  amount: string;
  provider: string;
  createdAt: string;
}

export interface GameLaunchConfig {
  id: string;
  requireDailyDeposit: boolean;
  updatedAt: string;
}

export interface PlayFiverCredentials {
  agentCode: string;
  agentToken: string;
  secretKey: string;
  apiUrl: string;
  webhookBalanceUrl: string;
  webhookTransactionUrl: string;
}

export interface PaginatedGames extends PaginatedResponse<Game> {}
export interface PaginatedAdminGames extends PaginatedResponse<AdminGame> {}
export interface PaginatedCategories extends PaginatedResponse<GameCategory> {}
export interface PaginatedProviders extends PaginatedResponse<CatalogProvider> {}
export interface PaginatedGameRounds extends PaginatedResponse<GameRound> {}

export interface Bonus {
  id: string;
  userId: string;
  amount: string;
  status: string;
  expiresAt: string | null;
  createdAt: string;
}

export interface WalletAdjustmentResult {
  id: string;
  amount: string;
  type: string;
  status: string;
}

export interface PagnovoCredentials {
  secretKey: string;
  apiUrl: string;
  environment: string;
  webhookCallbackUrl: string;
  requiredScopes: string[];
  sandboxNotes: { dailyCap: number; testAmounts: string };
}

export interface PagnovoBalance {
  available: number;
  inSettlement?: number;
  guaranteeDeposits?: number;
  cautiousBlocks?: number;
  chargebackReserves?: number;
}

export interface PagnovoWebhook {
  id: string;
  url: string;
  description?: string;
  events: string[];
  active: boolean;
  secret?: string;
}

export interface PagnovoWebhookTestResult {
  statusCode: number;
  durationMs: number;
  responseBody?: string;
}

export interface PagnovoWebhookDelivery {
  id: string;
  event: string;
  statusCode: number;
  durationMs: number;
  createdAt: string;
  responseBody?: string;
}

export interface PagnovoWebhookDeliveryPage {
  data: PagnovoWebhookDelivery[];
  page: number;
  limit: number;
}

export interface PagnovoWebhookMetrics {
  period: string;
  totalDeliveries: number;
  successCount: number;
  failureCount: number;
  avgLatencyMs?: number;
}
