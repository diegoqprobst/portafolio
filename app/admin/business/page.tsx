"use client";

import { useMemo } from "react";
import {
  Users,
  Briefcase,
  Target,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useCollection } from "@/components/admin/useCollection";
import { Loading, ErrorState, Progress } from "@/components/admin/ui";
import {
  Client,
  BusinessProject,
  Goal,
  FinanceEntry,
  money,
  pct,
  CLIENT_STATUS,
  PROJECT_STATUS,
} from "@/lib/business";

export default function BusinessDashboard() {
  const clients = useCollection<Client>("clients");
  const projects = useCollection<BusinessProject>("projects");
  const goals = useCollection<Goal>("goals");
  const finance = useCollection<FinanceEntry>("finance");

  const loading =
    clients.loading || projects.loading || goals.loading || finance.loading;
  const error =
    clients.error || projects.error || goals.error || finance.error;
  const reloadAll = () => {
    clients.load();
    projects.load();
    goals.load();
    finance.load();
  };

  const stats = useMemo(() => {
    const activeClients = clients.items.filter((c) => c.status === "active").length;
    const leads = clients.items.filter((c) => c.status === "lead").length;
    const activeProjects = projects.items.filter((p) => p.status === "active").length;

    const income = finance.items
      .filter((f) => f.kind === "income")
      .reduce((s, f) => s + Number(f.amount || 0), 0);
    const expense = finance.items
      .filter((f) => f.kind === "expense")
      .reduce((s, f) => s + Number(f.amount || 0), 0);

    const pipeline = clients.items
      .filter((c) => c.status === "lead" || c.status === "active")
      .reduce((s, c) => s + Number(c.value || 0), 0);

    const goalsDone = goals.items.filter((g) => g.status === "done").length;

    return {
      activeClients,
      leads,
      activeProjects,
      income,
      expense,
      net: income - expense,
      pipeline,
      goalsDone,
      goalsTotal: goals.items.length,
    };
  }, [clients.items, projects.items, goals.items, finance.items]);

  // Ingresos por mes (últimos 6 meses) para la mini-gráfica de barras
  const monthly = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>();
    const now = new Date();
    const keys: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      keys.push(k);
      map.set(k, { income: 0, expense: 0 });
    }
    for (const f of finance.items) {
      const k = (f.entry_date || "").slice(0, 7);
      const bucket = map.get(k);
      if (bucket) {
        if (f.kind === "income") bucket.income += Number(f.amount || 0);
        else bucket.expense += Number(f.amount || 0);
      }
    }
    const max = Math.max(1, ...keys.map((k) => map.get(k)!.income));
    return keys.map((k) => ({
      label: k.slice(5),
      ...map.get(k)!,
      h: Math.round((map.get(k)!.income / max) * 100),
    }));
  }, [finance.items]);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={reloadAll} />;

  const empty =
    clients.items.length === 0 &&
    projects.items.length === 0 &&
    finance.items.length === 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black gradient-text">Panel de tu negocio</h1>
        <p className="text-white/40 text-sm mt-1">
          Todo se calcula en vivo a partir de tus clientes, proyectos y finanzas.
        </p>
      </div>

      {empty && (
        <div className="mb-8 p-6 bg-electric/5 border border-electric/20 rounded-2xl text-sm text-white/60">
          👋 Empieza añadiendo tu{" "}
          <a href="/admin/business/identity" className="text-electric font-bold">
            identidad
          </a>
          , tus{" "}
          <a href="/admin/business/clients" className="text-electric font-bold">
            clientes
          </a>{" "}
          y registra ingresos en{" "}
          <a href="/admin/business/finance" className="text-electric font-bold">
            finanzas
          </a>
          . Las métricas aparecerán aquí automáticamente.
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Kpi
          icon={TrendingUp}
          label="Balance neto"
          value={money(stats.net)}
          tone={stats.net >= 0 ? "green" : "red"}
        />
        <Kpi icon={Users} label="Clientes activos" value={String(stats.activeClients)} sub={`${stats.leads} prospectos`} />
        <Kpi icon={Briefcase} label="Proyectos en curso" value={String(stats.activeProjects)} />
        <Kpi
          icon={Target}
          label="Metas cumplidas"
          value={`${stats.goalsDone}/${stats.goalsTotal}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingresos vs gastos + barras */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
            Ingresos · últimos 6 meses
          </h2>
          <div className="flex items-end gap-3 h-40 mb-4">
            {monthly.map((m) => (
              <div key={m.label} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-electric/40 to-electric transition-all"
                    style={{ height: `${m.h}%`, minHeight: m.income > 0 ? 4 : 0 }}
                    title={money(m.income)}
                  />
                </div>
                <span className="text-[10px] text-white/30 font-mono">{m.label}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
            <MiniStat label="Ingresos" value={money(stats.income)} icon={ArrowUpRight} tone="green" />
            <MiniStat label="Gastos" value={money(stats.expense)} icon={ArrowDownRight} tone="red" />
            <MiniStat label="Pipeline" value={money(stats.pipeline)} />
          </div>
        </div>

        {/* Distribución de clientes */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
            Clientes por estado
          </h2>
          <div className="space-y-4">
            {Object.entries(CLIENT_STATUS).map(([key, { label, color }]) => {
              const count = clients.items.filter((c) => c.status === key).length;
              const total = clients.items.length || 1;
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-white/60">{label}</span>
                    <span className="text-white/40 font-mono">{count}</span>
                  </div>
                  <Progress value={(count / total) * 100} color={color} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Metas en progreso */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
            Avance de metas
          </h2>
          {goals.items.length === 0 ? (
            <p className="text-white/30 text-sm">Aún no has definido metas.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.items.slice(0, 6).map((g) => (
                <div key={g.id} className="bg-black/20 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <span className="text-sm font-medium text-white/80">{g.title}</span>
                    <span className="text-xs text-electric font-bold whitespace-nowrap">
                      {g.current_value}/{g.target_value} {g.unit}
                    </span>
                  </div>
                  <Progress value={pct(g.current_value, g.target_value)} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Proyectos activos */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
            Proyectos
          </h2>
          {projects.items.length === 0 ? (
            <p className="text-white/30 text-sm">Aún no hay proyectos.</p>
          ) : (
            <div className="space-y-3">
              {projects.items.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
                  <span className="text-sm text-white/70 w-40 truncate">{p.name}</span>
                  <div className="flex-1">
                    <Progress value={p.progress} color={p.color} />
                  </div>
                  <span className="text-xs text-white/40 w-10 text-right">{p.progress}%</span>
                  <span
                    className="text-[11px] font-bold w-24 text-right"
                    style={{ color: PROJECT_STATUS[p.status].color }}
                  >
                    {PROJECT_STATUS[p.status].label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  value: string;
  sub?: string;
  tone?: "green" | "red";
}) {
  const color = tone === "green" ? "#22C55E" : tone === "red" ? "#EF4444" : "#1E90FF";
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <Icon className="w-5 h-5 mb-3" style={{ color }} />
      <div className="text-2xl font-black" style={{ color }}>
        {value}
      </div>
      <div className="text-[11px] uppercase tracking-widest text-white/40 mt-1">{label}</div>
      {sub && <div className="text-xs text-white/30 mt-0.5">{sub}</div>}
    </div>
  );
}

function MiniStat({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  tone?: "green" | "red";
}) {
  const color = tone === "green" ? "#22C55E" : tone === "red" ? "#EF4444" : "rgba(255,255,255,.6)";
  return (
    <div>
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-white/30">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </div>
      <div className="text-sm font-bold mt-1" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
