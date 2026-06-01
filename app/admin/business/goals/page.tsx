"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Loader2, Save } from "lucide-react";
import { useCollection } from "@/components/admin/useCollection";
import { Loading, ErrorState, PageHeader, Progress, Modal, Field } from "@/components/admin/ui";
import { Goal, HORIZONS, GOAL_CATEGORIES, pct } from "@/lib/business";

const EMPTY: Goal = {
  title: "",
  description: "",
  category: "general",
  horizon: "now",
  status: "todo",
  target_value: 100,
  current_value: 0,
  unit: "%",
  sort_order: 0,
};

const STATUS_LABEL: Record<Goal["status"], string> = {
  todo: "Por hacer",
  doing: "En progreso",
  done: "Cumplida",
};

export default function GoalsPage() {
  const { items, loading, error, load, create, update, remove } = useCollection<Goal>("goals");
  const [editing, setEditing] = useState<Goal | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!editing) return;
    setSaving(true);
    if (editing.id) await update(editing.id, editing);
    else await create(editing);
    setSaving(false);
    setEditing(null);
  }

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <PageHeader
        title="Metas & Roadmap"
        subtitle="Tu mapa a seguir: organiza objetivos en Ahora, Siguiente y Después."
        action={
          <button
            onClick={() => setEditing({ ...EMPTY, sort_order: items.length + 1 })}
            className="btn-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nueva meta
          </button>
        }
      />

      {/* Mapa / roadmap por horizonte */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {HORIZONS.map((h, hi) => {
          const goals = items.filter((g) => g.horizon === h.key);
          return (
            <div key={h.key} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-dark"
                  style={{ background: ["#22C55E", "#1E90FF", "#A855F7"][hi] }}
                >
                  {hi + 1}
                </span>
                <h2 className="font-black">{h.label}</h2>
              </div>
              <p className="text-xs text-white/30 mb-4 ml-8">{h.hint}</p>

              <div className="space-y-3">
                {goals.length === 0 && (
                  <p className="text-xs text-white/20 italic py-4 text-center">
                    Sin metas en esta etapa
                  </p>
                )}
                {goals.map((g) => (
                  <div key={g.id} className="bg-black/20 rounded-xl p-4 group">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="text-sm font-medium leading-snug">{g.title}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={() => setEditing(g)}
                          className="text-white/40 hover:text-electric p-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => g.id && remove(g.id)}
                          className="text-white/40 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {g.description && (
                      <p className="text-xs text-white/40 mb-3 leading-relaxed">{g.description}</p>
                    )}
                    <div className="flex justify-between text-[11px] text-white/40 mb-1.5">
                      <span className="uppercase tracking-wider">{g.category}</span>
                      <span className="text-electric font-bold">
                        {g.current_value}/{g.target_value} {g.unit}
                      </span>
                    </div>
                    <Progress
                      value={pct(g.current_value, g.target_value)}
                      color={g.status === "done" ? "#22C55E" : "#1E90FF"}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <Modal
          title={editing.id ? "Editar meta" : "Nueva meta"}
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
          <Field label="Título">
            <input
              className="input"
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            />
          </Field>
          <Field label="Descripción">
            <textarea
              className="input resize-y"
              rows={2}
              value={editing.description}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Etapa">
              <select
                className="input"
                value={editing.horizon}
                onChange={(e) =>
                  setEditing({ ...editing, horizon: e.target.value as Goal["horizon"] })
                }
              >
                {HORIZONS.map((h) => (
                  <option key={h.key} value={h.key}>
                    {h.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Categoría">
              <select
                className="input"
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              >
                {GOAL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Estado">
              <select
                className="input"
                value={editing.status}
                onChange={(e) =>
                  setEditing({ ...editing, status: e.target.value as Goal["status"] })
                }
              >
                {Object.entries(STATUS_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Valor actual">
              <input
                className="input"
                type="number"
                value={editing.current_value}
                onChange={(e) =>
                  setEditing({ ...editing, current_value: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Meta">
              <input
                className="input"
                type="number"
                value={editing.target_value}
                onChange={(e) =>
                  setEditing({ ...editing, target_value: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Unidad">
              <input
                className="input"
                placeholder="$, %, clientes..."
                value={editing.unit}
                onChange={(e) => setEditing({ ...editing, unit: e.target.value })}
              />
            </Field>
          </div>
        </Modal>
      )}
    </div>
  );
}
