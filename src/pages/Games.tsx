import { useState } from "react";
import { games, categories, providers, aggregators, banners, openGamesRule, brl, d } from "../mock/data";
import { StatusTag } from "../ui/StatusTag";
import { Tabs, useTab } from "../ui/Tabs";
import { Toggle } from "../ui/Toggle";
import { useToast } from "../ui/Toast";

const TABS = [
  { key: "categorias", label: "Categorias" },
  { key: "catalogo", label: "Catálogo de jogos" },
  { key: "provedores", label: "Provedores" },
  { key: "agregadores", label: "Agregadores" },
  { key: "banners", label: "Banners" },
  { key: "abertura", label: "Config. de abertura" },
];

export function GamesPage() {
  const tab = useTab(TABS);
  return (
    <>
      <h1 className="page-title">Jogos & Conteúdo</h1>
      <p className="page-subtitle">Categorias N:N (um jogo em várias), catálogo com soft-disable, provedores, agregadores e banners.</p>
      <Tabs tabs={TABS} />
      {tab === "categorias" && <CategoriesTab />}
      {tab === "catalogo" && <CatalogTab />}
      {tab === "provedores" && <ProvidersTab />}
      {tab === "agregadores" && <AggregatorsTab />}
      {tab === "banners" && <BannersTab />}
      {tab === "abertura" && <OpenRuleTab />}
    </>
  );
}

function CategoriesTab() {
  const { toast } = useToast();
  const [selected, setSelected] = useState<string | null>(null);
  const cat = categories.find((c) => c.id === selected);

  return (
    <>
      <div className="panel" style={{ marginBottom: 12 }}>
        <div className="toolbar">
          <input placeholder="Buscar categoria…" style={{ width: 220 }} />
          <div className="spacer" />
          <button className="primary" onClick={() => toast("Nova categoria (demonstração)")}>+ Nova categoria</button>
        </div>
        <p className="dim" style={{ fontSize: 12, marginTop: 0 }}>Arraste ⠿ pra reordenar a home — a ordem persiste e muda a resposta da API do lobby.</p>
        {categories.map((c) => (
          <div key={c.id} className="wallet-cell" style={{ marginBottom: 8, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", cursor: "grab" }}>
            <span className="dim">⠿</span>
            <strong style={{ width: 20 }}>{c.position}º</strong>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontWeight: 600 }}>
                {c.name} <span className="tag gray mono" style={{ fontWeight: 400 }}>/{c.slug}</span>{" "}
                <span className={`tag ${c.type === "DINÂMICA" ? "blue" : "gray"}`}>{c.type.toLowerCase()}</span>
              </div>
              <div className="dim" style={{ fontSize: 12 }}>
                {c.rule ?? "curadoria manual"} · {c.gamesCount} jogos · {c.onHomeCount} na home
              </div>
            </div>
            {c.onHome && <span className="tag green">na home</span>}
            <Toggle defaultOn={c.active} onChange={() => toast("Toggle de categoria (demonstração)")} />
            <button className="small" onClick={() => setSelected(c.id)}>Detalhes</button>
            <button className="small" onClick={() => toast("Categoria duplicada (demonstração)")}>Duplicar</button>
            <button
              className="small danger"
              disabled={c.onHome}
              title={c.onHome ? "Bloqueado: categoria ativa na home" : ""}
              onClick={() => toast("Categoria excluída (demonstração)")}
            >
              Excluir
            </button>
          </div>
        ))}
      </div>

      {cat && <CategoryDetail cat={cat} onClose={() => setSelected(null)} />}
    </>
  );
}

function CategoryDetail({ cat, onClose }: { cat: typeof categories[number]; onClose: () => void }) {
  const { toast } = useToast();
  const inCategory = games.filter((g) => g.categories.includes(cat.name));
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ width: 780 }} onClick={(e) => e.stopPropagation()}>
        <h3>Categoria — {cat.name}</h3>
        <div className="grid-2" style={{ gap: 10, marginBottom: 12 }}>
          <label className="field">Nome<input defaultValue={cat.name} /></label>
          <label className="field">Slug (auto, editável)<input defaultValue={cat.slug} /></label>
          <label className="field">Tipo
            <select defaultValue={cat.type}>
              <option value="MANUAL">Manual</option>
              <option value="DINÂMICA">Dinâmica (job BullMQ a cada hora)</option>
            </select>
          </label>
          <label className="field">Regra dinâmica
            <select defaultValue={cat.rule ?? ""}>
              <option value="">—</option>
              <option>Mais jogados 7d</option>
              <option>Mais apostados 7d</option>
              <option>Novos 30d</option>
            </select>
          </label>
          <label className="field">Limite na home + "ver todos"<input defaultValue={cat.onHomeCount} /></label>
          <label className="field">Ordenação interna
            <select defaultValue="manual"><option>manual</option><option>popularidade</option><option>data</option></select>
          </label>
          <label className="field">Imagem<button className="small" type="button" onClick={() => toast("Upload pro storage do projeto (demonstração)")}>Upload de imagem</button></label>
          <label className="field">Ícone<button className="small" type="button" onClick={() => toast("Upload pro storage do projeto (demonstração)")}>Upload de ícone</button></label>
          <label className="field">Agendamento visível de<input type="date" /></label>
          <label className="field">até<input type="date" /></label>
        </div>

        <div className="toolbar">
          <strong>Jogos da categoria</strong>
          <span className="dim" style={{ fontSize: 12 }}>{inCategory.length} jogos · {Math.min(inCategory.length, cat.onHomeCount)} na home</span>
          <div className="spacer" />
          <input placeholder="Buscar por nome/provedor…" style={{ width: 180 }} />
          <button className="small" onClick={() => toast("Adição em massa (demonstração)")}>+ Adicionar em massa</button>
          <button className="small" onClick={() => toast("Copiar jogos de outra categoria (demonstração)")}>Copiar de outra categoria</button>
        </div>
        <div className="game-grid">
          {inCategory.map((g) => (
            <div key={g.id} className="game-card">
              <div className="g-thumb">{g.emoji}</div>
              <div className="g-name">{g.name}</div>
              <div className="g-provider">{g.provider}</div>
              <button className="link small" style={{ color: "var(--red)", alignSelf: "flex-start" }} onClick={() => toast("Removido da categoria (demonstração)")}>remover</button>
            </div>
          ))}
        </div>
        <div className="actions">
          <button onClick={onClose}>Fechar</button>
          <button className="primary" onClick={() => { toast("Categoria salva (demonstração)"); onClose(); }}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

function CatalogTab() {
  const { toast } = useToast();
  const [provider, setProvider] = useState("");
  const rows = games.filter((g) => !provider || g.provider === provider);
  return (
    <div className="panel">
      <div className="toolbar">
        <input placeholder="Buscar jogo…" style={{ width: 200 }} />
        <select value={provider} onChange={(e) => setProvider(e.target.value)}>
          <option value="">Provedor: todos</option>
          {providers.map((p) => <option key={p.id}>{p.name}</option>)}
        </select>
        <div className="spacer" />
        <button className="small" onClick={() => toast("Ativação em massa (demonstração)")}>Ativar seleção</button>
        <button className="small" onClick={() => toast("Desativação em massa (demonstração)")}>Desativar seleção</button>
        <button className="primary small" onClick={() => toast("Sync com agregador disparado — job em execução (demonstração)")}>⟳ Sync com agregador</button>
      </div>
      <p className="dim" style={{ fontSize: 12, marginTop: 0 }}>
        Jogos nunca são excluídos — <strong>soft-disable</strong>: some do lobby, mantém histórico de partidas.
      </p>
      <div className="table-wrap">
        <table className="data">
          <thead><tr><th></th><th>Jogo</th><th>Provedor</th><th className="right">RTP</th><th>Marcadores</th><th>Categorias (N:N)</th><th className="right">Sessões 7d</th><th className="right">GGR 7d</th><th>Ativo</th></tr></thead>
          <tbody>
            {rows.map((g) => (
              <tr key={g.id}>
                <td><input type="checkbox" /></td>
                <td>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div className="thumb game emoji">{g.emoji}</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{g.name}</div>
                      <button className="link small" onClick={() => toast("Editar thumbnail / nome de exibição (demonstração)")}>editar exibição</button>
                    </div>
                  </div>
                </td>
                <td className="dim">{g.provider}</td>
                <td className="right mono">{g.rtp.toFixed(2).replace(".", ",")}%</td>
                <td>{g.tags.map((t) => <span key={t} className={`tag ${t === "hot" ? "red" : t === "novo" ? "blue" : "amber"}`} style={{ marginRight: 4 }}>{t}</span>)}</td>
                <td className="dim" style={{ fontSize: 12 }}>{g.categories.join(" · ")}</td>
                <td className="right mono">{g.sessions7d.toLocaleString("pt-BR")}</td>
                <td className="right mono">{brl(g.ggr7d)}</td>
                <td><Toggle defaultOn={g.active} onChange={() => toast("Soft-disable aplicado (demonstração)")} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProvidersTab() {
  const { toast } = useToast();
  const [onlyActive, setOnlyActive] = useState(false);
  const rows = providers.filter((p) => !onlyActive || p.active);
  return (
    <div className="panel">
      <div className="toolbar">
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
          <input type="checkbox" checked={onlyActive} onChange={(e) => setOnlyActive(e.target.checked)} /> somente ativos
        </label>
      </div>
      <div className="table-wrap">
        <table className="data">
          <thead><tr><th>Provedor</th><th className="right">Jogos</th><th className="right">GGR 7d</th><th className="right">Ordem no lobby</th><th>Agregador</th><th>Credenciais</th><th>Ativo</th></tr></thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td className="right mono">{p.gamesCount}</td>
                <td className="right mono">{brl(p.ggr7d)}</td>
                <td className="right mono">{p.lobbyOrder}</td>
                <td className="dim">{p.aggregator}</td>
                <td><span className="mono dim">••••••</span> <button className="link small" onClick={() => toast("Credenciais (demonstração)")}>trocar</button></td>
                <td><Toggle defaultOn={p.active} onChange={() => toast("Desativar provedor esconde todos os jogos dele do lobby (demonstração)")} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AggregatorsTab() {
  const { toast } = useToast();
  return (
    <div className="panel">
      <div className="toolbar">
        <span className="dim" style={{ fontSize: 12 }}>Trocar um jogo de agregador não quebra o histórico de partidas.</span>
        <div className="spacer" />
        <button className="primary" onClick={() => toast("Novo agregador (demonstração)")}>+ Adicionar agregador</button>
      </div>
      {aggregators.map((a) => (
        <div key={a.id} className="wallet-cell" style={{ marginBottom: 10, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <span className={`health-dot ${a.healthy ? "green" : "red"}`} />
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontWeight: 600 }}>{a.name}</div>
            <div className="dim" style={{ fontSize: 12 }}>provedores: {a.providers}</div>
            <div className="dim" style={{ fontSize: 12 }}>credenciais: <span className="mono">••••••••</span> (criptografadas)</div>
          </div>
          <Toggle defaultOn={a.active} onChange={() => toast("Toggle de agregador (demonstração)")} />
          <button className="small" onClick={() => toast("Conexão OK — handshake em 210ms (demonstração)")}>Testar conexão</button>
          <button className="small danger" onClick={() => toast("Remoção de agregador (demonstração)")}>Remover</button>
        </div>
      ))}
    </div>
  );
}

function BannersTab() {
  const { toast } = useToast();
  return (
    <div className="panel">
      <div className="toolbar">
        <span className="dim" style={{ fontSize: 12 }}>Arraste ⠿ pra reordenar. Upload em versões desktop e mobile.</span>
        <div className="spacer" />
        <button className="primary" onClick={() => toast("Novo banner com upload desktop + mobile (demonstração)")}>+ Novo banner</button>
      </div>
      <div className="table-wrap">
        <table className="data">
          <thead><tr><th></th><th>Preview</th><th>Banner</th><th>Destino</th><th>Agendamento</th><th className="right">Cliques</th><th className="right">CTR</th><th>Ativo</th><th></th></tr></thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b.id}>
                <td className="dim" style={{ cursor: "grab" }}>⠿ {b.position}º</td>
                <td><div className="thumb banner emoji">{b.emoji}</div></td>
                <td style={{ fontWeight: 600 }}>{b.name}</td>
                <td className="dim" style={{ fontSize: 12 }}>{b.target}</td>
                <td className="dim nowrap" style={{ fontSize: 12 }}>{d(b.from)}{b.to ? ` → ${d(b.to)}` : " → sem fim"}</td>
                <td className="right mono">{b.clicks.toLocaleString("pt-BR")}</td>
                <td className="right mono">{b.ctr.toFixed(1).replace(".", ",")}%</td>
                <td><Toggle defaultOn={b.active} onChange={() => toast("Desativado sem remover (demonstração)")} /></td>
                <td><button className="link" style={{ color: "var(--red)" }} onClick={() => toast("Banner removido (demonstração)")}>remover</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OpenRuleTab() {
  const { toast } = useToast();
  return (
    <div className="panel">
      <h3 className="panel-title">Regra global de abertura de jogos</h3>
      <div className="wallet-cell" style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
        <Toggle defaultOn={openGamesRule.requireDeposit} onChange={() => toast("Regra global (demonstração) — aplicada no endpoint de launch, não só na UI")} />
        <div>
          <div style={{ fontWeight: 600 }}>Apenas jogadores com pelo menos 1 depósito confirmado podem abrir jogos</div>
          <div className="dim" style={{ fontSize: 12 }}>Aplicada no backend (endpoint de launch). Jogador sem depósito recebe erro mesmo chamando a API direto.</div>
        </div>
      </div>
      <div className="wallet-cell" style={{ marginTop: 10 }}>
        <div className="lbl">Exceções por categoria (ex: liberar demo)</div>
        <div className="dim" style={{ fontSize: 13, marginTop: 4 }}>Estrutura prevista — desligadas por default. Nenhuma exceção configurada.</div>
      </div>
    </div>
  );
}
