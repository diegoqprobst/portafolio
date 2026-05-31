// Tipos compartidos del Sistema de Negocio (Business OS)

export type BusinessProfile = {
  id?: number;
  business_name: string;
  tagline: string;
  mission: string;
  vision: string;
  values: { title: string; desc: string }[];
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  logo_url: string;
  brand_voice: string;
};

export type Goal = {
  id?: number;
  title: string;
  description: string;
  category: string;
  horizon: "now" | "next" | "later";
  status: "todo" | "doing" | "done";
  target_value: number;
  current_value: number;
  unit: string;
  due_date?: string | null;
  sort_order: number;
};

export type Client = {
  id?: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "lead" | "active" | "paused" | "closed";
  value: number;
  source: string;
  tags: string[];
  notes: string;
  created_at?: string;
};

export type BusinessProject = {
  id?: number;
  name: string;
  description: string;
  client_id?: number | null;
  status: "planning" | "active" | "paused" | "done";
  progress: number;
  value: number;
  start_date?: string | null;
  due_date?: string | null;
  color: string;
  created_at?: string;
};

export type FinanceEntry = {
  id?: number;
  entry_date: string;
  kind: "income" | "expense";
  amount: number;
  concept: string;
  client_id?: number | null;
  created_at?: string;
};

export const HORIZONS: { key: Goal["horizon"]; label: string; hint: string }[] = [
  { key: "now", label: "Ahora", hint: "En lo que trabajas hoy" },
  { key: "next", label: "Siguiente", hint: "Lo que viene pronto" },
  { key: "later", label: "Después", hint: "Visión a futuro" },
];

export const CLIENT_STATUS: Record<Client["status"], { label: string; color: string }> = {
  lead: { label: "Prospecto", color: "#EAB308" },
  active: { label: "Activo", color: "#22C55E" },
  paused: { label: "En pausa", color: "#F97316" },
  closed: { label: "Cerrado", color: "#6B7280" },
};

export const PROJECT_STATUS: Record<BusinessProject["status"], { label: string; color: string }> = {
  planning: { label: "Planeación", color: "#EAB308" },
  active: { label: "En curso", color: "#1E90FF" },
  paused: { label: "En pausa", color: "#F97316" },
  done: { label: "Terminado", color: "#22C55E" },
};

export const GOAL_CATEGORIES = ["ingresos", "clientes", "producto", "personal", "general"];

export function money(n: number): string {
  return new Intl.NumberFormat("es", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export function pct(current: number, target: number): number {
  if (!target) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}
