import { useSearchParams } from "react-router-dom";

export interface TabDef {
  key: string;
  label: string;
  count?: number;
}

/** Abas persistidas na URL (?tab=). */
export function Tabs({ tabs, param = "tab" }: { tabs: TabDef[]; param?: string }) {
  const [params, setParams] = useSearchParams();
  const active = params.get(param) ?? tabs[0].key;

  return (
    <div className="tabs">
      {tabs.map((t) => (
        <button
          key={t.key}
          className={active === t.key ? "active" : ""}
          onClick={() => {
            const next = new URLSearchParams(params);
            next.set(param, t.key);
            setParams(next, { replace: true });
          }}
        >
          {t.label}
          {t.count !== undefined && <span className="count">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function useTab(tabs: TabDef[], param = "tab"): string {
  const [params] = useSearchParams();
  return params.get(param) ?? tabs[0].key;
}
