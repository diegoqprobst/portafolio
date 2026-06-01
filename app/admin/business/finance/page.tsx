"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, Loader2, Save, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useCollection } from "@/components/admin/useCollection";
import { Loading, ErrorState, PageHeader, Modal, Field } from "@/components/admin/ui";
import { FinanceEntry, money } from "@/lib/business";

function today() {
  return new Date().toISOString().slice(0, 10);
}

const EMPTY: FinanceEntry = {
  entry_date: today(),
  kind: "income",
  amount: 0,
  concept: "",
  client_id: null,
};

export default function FinancePage() {
  const { items, loading, error, load, create, remove } = useCollection<FinanceEntry>("finance");
  const [editing, setEditing] = useState<FinanceEntry | null>(null);
  const [saving, setSaving] = useState(false);

  const totals = useMemo(() => {
    const income = items
      .filter((f) => f.kind === "income")
      .reduce((s, f) => s + Number(f.amount || 0), 0);
    const expense = items
      .filter((f) => f.kind === "expense")
      .reduce((s, f) => s + Number(f.amount || 0), 0);
    return { income, expense, net: income - expense };
  }, [items]);

  async function save() {
    if (!editing) return;
    setSaving(true);
    await create(editing);
    setSaving(false);
    setEditing(null);
  }

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <PageHeader
        title="Finanzas"
        subtitle="Registra ingresos y gastos. Alimenta las métricas del panel."
        action={
          <button
            onClick={() => setEditing({ ...EMPTY })}
            className="btn-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nuevo movimiento
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <SummaryCard label="Ingresos" value={money(totals.income)} color="#22C55E" />
        <SummaryCard label="Gastos" value={money(totals.expense)} color="#EF4444" />
        <SummaryCard
          label="Balance neto"
          value={money(totals.net)}
          color={totals.net >= 0 ? "#1E90FF" : "#EF4444"}
        />
      </div>

      {items.length === 0 ? (
        <p className="text-white/30 text-sm">Aún no hay movimientos registrados.</p>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {items.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-4 px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: f.kind === "income" ? "#22C55E1a" : "#EF44441a",
                  color: f.kind === "income" ? "#22C55E" : "#EF4444",
                }}
              >
                {f.kind === "income" ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{f.concept || "—"}</p>
                <p className="text-xs text-white/30">{f.entry_date}</p>
              </div>
              <span
                className="font-black text-sm"
                style={{ color: f.kind === "income" ? "#22C55E" : "#EF4444" }}
              >
                {f.kind === "income" ? "+" : "−"}
                {money(f.amount)}
              </span>
              <button
                onClick={() => f.id && remove(f.id)}
                className="text-white/30 hover:text-red-400 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <Modal
          title="Nuevo movimiento"
          onClose={() => setEditing(null)}
          footer={
            <>
              <button
                onClick={() => setEditing(null)}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-sm font-bold text-white/50 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="btn-primary px-6 py-2.5 rounded-xl font-bold flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Guardar
              </button>
            </>
          }
        >
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setEditing({ ...editing, kind: "income" })}
              className={`py-3 rounded-xl font-bold text-sm border transition-all ${
                editing.kind === "income"
                  ? "bg-green-500/15 text-green-400 border-green-500/40"
                  : "border-white/10 text-white/40"
              }`}
            >
              Ingreso
            </button>
            <button
              onClick={() => setEditing({ ...editing, kind: "expense" })}
              className={`py-3 rounded-xl font-bold text-sm border transition-all ${
                editing.kind === "expense"
                  ? "bg-red-500/15 text-red-400 border-red-500/40"
                  : "border-white/10 text-white/40"
              }`}
            >
              Gasto
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Monto ($)">
              <input
                className="input"
                type="number"
                value={editing.amount}
                onChange={(e) => setEditing({ ...editing, amount: Number(e.target.value) })}
              />
            </Field>
            <Field label="Fecha">
              <input
                className="input"
                type="date"
                value={editing.entry_date}
                onChange={(e) => setEditing({ ...editing, entry_date: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Concepto">
            <input
              className="input"
              placeholder="Ej: Pago proyecto, suscripción..."
              value={editing.concept}
              onChange={(e) => setEditing({ ...editing, concept: e.target.value })}
            />
          </Field>
        </Modal>
      )}
    </div>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <div className="text-[11px] uppercase tracking-widest text-white/40 mb-2">{label}</div>
      <div className="text-2xl font-black" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
