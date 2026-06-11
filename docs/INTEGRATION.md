# Integração — casino-admin ↔ casino-backend

Este painel consome **somente** a API do `casino-backend`. Nunca chame `api.playfivers.com` diretamente.

## Contrato canônico

Documentação completa das rotas admin:

**`../casino-backend/docs/admin-jogos-conteudo.md`**

Swagger (backend rodando): `http://localhost:3000/docs`

## Configuração

| Variável | Dev | Produção |
|----------|-----|----------|
| `VITE_API_URL` | `/api` (proxy Vite → `:3000`) | URL pública do backend |

Copie `.env.example` para `.env` se necessário.

## Autenticação

- Login: `POST /auth/login`
- Token em `localStorage` (`admin_access_token`)
- Roles necessários: `ADMIN` ou `OPERATOR`

## Telas — Jogos & Conteúdo

| Rota frontend | Endpoint backend | Módulo API |
|---------------|------------------|------------|
| `/games/categories` | `/admin/categories` | `src/api/categories.ts` |
| `/games/providers` | `/admin/providers` | `src/api/providers.ts` |
| `/games` | `/admin/games` | `src/api/admin-games.ts` |
| `/games/match-history` | `/admin/game-rounds` | `src/api/game-rounds.ts` |
| `/games/launch-config` | `/admin/game-launch-config` | `src/api/game-launch-config.ts` |
| `/games/keys` | `/admin/playfiver/*` | `src/api/playfiver.ts` |

## Checklist

- [x] Grupo "Jogos & Conteúdo" no sidebar
- [x] CRUD categorias
- [x] Listagem/sync provedores
- [x] Listagem jogos + toggles + sync
- [x] Histórico de partidas (read-only)
- [x] Config abertura de jogos
- [x] Chaves PlayFiver (read-only)

## Tipos

DTOs espelhados em `src/types/api.ts`: `GameCategory`, `CatalogProvider`, `AdminGame`, `GameRound`, `GameLaunchConfig`, `PlayFiverCredentials`.
