import { useState } from "react";

const PRESETS = ["Hoje", "7 dias", "30 dias", "Personalizado"];

/** Seletor de período global (demonstrativo) com comparação vs período anterior. */
export function PeriodSelector() {
  const [active, setActive] = useState("7 dias");
  return (
    <div className="toolbar" style={{ marginBottom: 0 }}>
      {PRESETS.map((p) => (
        <button key={p} className={`small ${active === p ? "primary" : ""}`} onClick={() => setActive(p)}>
          {p}
        </button>
      ))}
      {active === "Personalizado" && (
        <>
          <input type="date" defaultValue="2026-06-24" />
          <input type="date" defaultValue="2026-07-01" />
        </>
      )}
      <span className="dim" style={{ fontSize: 12 }}>comparando com o período anterior</span>
    </div>
  );
}
