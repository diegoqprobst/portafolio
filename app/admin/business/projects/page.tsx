"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Loader2, Save, Calendar } from "lucide-react";
import { useCollection } from "@/components/admin/useCollection";
import { Loading, PageHeader, Modal, Field, Progress, StatusBadge } from "@/components/admin/ui";
import { BusinessProject, Client, PROJECT_STATUS, money } from "@/lib/business";

const EMPTY: BusinessProject = {
  name: "",
  description: "",
  client_id: null,
  status: "planning",
  progress: 0,
  value: 0,
  start_date: null,
  due_date: null,
  color: "#1E90FF",
};

export default function ProjectsPage() {
  const { items, loading, create, update, remove } = useCollection<BusinessProject>("projects");
  const clients = useCollection<Client>("clients");
  const [editing, setEditing] = useState<BusinessProject | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!editing) return;
    setSaving(true);
    const payload = { ...editing, client_id: editing.client_id || null };
    if (editing.id) await update(editing.id, payload);
    else await create(payload);
    setSaving(false);
    setEditing(null);
  }

  const clientName = (id?: number | null) =>
    clients.items.find((c) => c.id === id)?.name ?? "";

  if (loading) return <Loading />;

  return (
    <div>
      <PageHeader
        title="Proyectos"
        subtitle={`${items.length} proyectos · seguimiento de avance y entregas`}
        action={
          <button
            onClick={() => setEditing({ ...EMPTY })}
            className="btn-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nuevo proyecto
          </button>
        }
      />

      {items.length === 0 ? (
        <p className="text-white/30 text-sm">Aún no hay proyectos. Crea el primero.</p>
      ) : (
        <div className="space-y-4">
          {items.map((p) => (
            <div
              key={p.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all group"
              style={{ borderLeft: `3px solid ${p.color}` }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-bold">{p.name || "Sin nombre"}</h3>
                    <StatusBadge
                      label={PROJECT_STATUS[p.status].label}
                      color={PROJECT_STATUS[p.status].color}
                    />
                  </div>
                  {p.description && (
                    <p className="text-sm text-white/40 mt-1 line-clamp-2">{p.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {Number(p.value) > 0 && (
                    <span className="text-sm font-black text-electric">{money(p.value)}</span>
                  )}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditing(p)}
                      className="text-white/40 hover:text-electric p-1.5"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => p.id && confirm("¿Eliminar proyecto?") && remove(p.id)}
                      className="text-white/40 hover:text-red-400 p-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1">
                  <Progress value={p.progress} color={p.color} />
                </div>
                <span className="text-xs text-white/40 w-10 text-right">{p.progress}%</span>
              </div>

              <div className="flex gap-4 text-[11px] text-white/40 flex-wrap">
                {clientName(p.client_id) && <span>👤 {clientName(p.client_id)}</span>}
                {p.due_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Entrega: {p.due_date}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <Modal
          title={editing.id ? "Editar proyecto" : "Nuevo proyecto"}
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
          <Field label="Nombre del proyecto">
            <input
              className="input"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
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
          <div className="grid grid-cols-2 gap-4">
            <Field label="Cliente">
              <select
                className="input"
                value={editing.client_id ?? ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    client_id: e.target.value ? Number(e.target.value) : null,
                  })
                }
              >
                <option value="">— Sin cliente —</option>
                {clients.items.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.company ? `(${c.company})` : ""}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Estado">
              <select
                className="input"
                value={editing.status}
                onChange={(e) =>
                  setEditing({ ...editing, status: e.target.value as BusinessProject["status"] })
                }
              >
                {Object.entries(PROJECT_STATUS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label={`Avance: ${editing.progress}%`}>
              <input
                type="range"
                min={0}
                max={100}
                value={editing.progress}
                onChange={(e) => setEditing({ ...editing, progress: Number(e.target.value) })}
                className="w-full accent-electric"
              />
            </Field>
            <Field label="Valor ($)">
              <input
                className="input"
                type="number"
                value={editing.value}
                onChange={(e) => setEditing({ ...editing, value: Number(e.target.value) })}
              />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Inicio">
              <input
                className="input"
                type="date"
                value={editing.start_date ?? ""}
                onChange={(e) => setEditing({ ...editing, start_date: e.target.value || null })}
              />
            </Field>
            <Field label="Entrega">
              <input
                className="input"
                type="date"
                value={editing.due_date ?? ""}
                onChange={(e) => setEditing({ ...editing, due_date: e.target.value || null })}
              />
            </Field>
            <Field label="Color">
              <input
                type="color"
                value={editing.color}
                onChange={(e) => setEditing({ ...editing, color: e.target.value })}
                className="w-full h-[42px] rounded-xl bg-transparent border border-white/10 cursor-pointer"
              />
            </Field>
          </div>
        </Modal>
      )}
    </div>
  );
}
