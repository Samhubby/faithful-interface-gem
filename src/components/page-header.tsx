import type { ReactNode } from "react";

export function PageHeader({
  title,
  accent,
  subtitle,
  actions,
}: {
  title: string;
  accent?: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-l-4 border-accent pl-4">
      <div>
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight">
          {title} {accent && <span className="text-accent">{accent}</span>}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  tone?: "default" | "primary" | "accent" | "warn" | "danger";
}) {
  const toneClass = {
    default: "text-foreground",
    primary: "text-primary",
    accent: "text-accent",
    warn: "text-amber-400",
    danger: "text-destructive",
  }[tone];
  return (
    <div className="rounded-xl border border-border bg-card/70 p-5 transition hover:border-primary/40">
      <div className="flex items-start justify-between">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className={`mt-3 font-display text-3xl font-bold ${toneClass}`}>{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
