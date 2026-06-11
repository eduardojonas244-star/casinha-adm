interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
}

export function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-casino-border bg-casino-card p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-casino-muted">{label}</p>
      <p className="mt-2 text-xl font-bold text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-casino-muted">{sub}</p>}
    </div>
  );
}
