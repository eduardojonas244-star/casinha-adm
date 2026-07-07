import { useNavigate } from "react-router-dom";

export function Kpi(props: {
  label: string;
  value: string;
  sub?: string;
  delta?: number;
  to?: string;
  tone?: string;
}) {
  const navigate = useNavigate();
  return (
    <div
      className={`kpi ${props.to ? "clickable" : ""}`}
      onClick={() => props.to && navigate(props.to)}
    >
      <div className="kpi-label">{props.label}</div>
      <div className="kpi-value" style={props.tone === "red" ? { color: "var(--red)" } : props.tone === "amber" ? { color: "var(--amber)" } : undefined}>
        {props.value}
      </div>
      {props.sub && <div className="kpi-sub">{props.sub}</div>}
      {props.delta !== undefined && (
        <div className={`delta ${props.delta >= 0 ? "up" : "down"}`}>
          {props.delta >= 0 ? "▲" : "▼"} {Math.abs(props.delta).toFixed(1).replace(".", ",")}% vs período anterior
        </div>
      )}
    </div>
  );
}
