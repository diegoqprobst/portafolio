"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, Edit2, Loader2, Save, Mail, Phone, Building2 } from "lucide-react";
import { useCollection } from "@/components/admin/useCollection";
import { Loading, ErrorState, PageHeader, Modal, Field, StatusBadge } from "@/components/admin/ui";
import { Client, CLIENT_STATUS, money } from "@/lib/business";

const EMPTY: Client = {
  name: "",
  company: "",
  email: "",
  phone: "",
  status: "lead",
  value: 0,
  source: "",
  tags: [],
  notes: "",
};

export default function ClientsPage() {
  const { items, loading, error, load, create, update, remove } = useCollection<Client>("clients");
  const [editing, setEditing] = useState<Client | null>(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((c) => c.status === filter)),
    [items, filter]
  );

  const totalValue = useMemo(
    () => items.reduce((s, c) => s + Number(c.value || 0), 0),
    [items]
  );

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
        title="Clientes"
        subtitle={`${items.length} clientes · ${money(totalValue)} en valor total`}
        action={
          <button
            onClick={() => setEditing({ ...EMPTY })}
            className="btn-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nuevo cliente
          </button>
        }
      />

      {/* Filtros */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <FilterChip label="Todos" active={filter === "all"} onClick={() => setFilter("all")} />
        {Object.entries(CLIENT_STATUS).map(([key, { label, color }]) => (
          <FilterChip
            key={key}
            label={label}
            active={filter === key}
            color={color}
            onClick={() => setFilter(key)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-white/30 text-sm">No hay clientes en esta vista.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0">
                  <h3 className="font-bold truncate">{c.name || "Sin nombre"}</h3>
                  {c.company && (
                    <p className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3" /> {c.company}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditing(c)}
                    className="text-white/40 hover:text-electric p-1.5"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => c.id && confirm("¿Eliminar cliente?") && remove(c.id)}
                    className="text-white/40 hover:text-red-400 p-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <StatusBadge
                  label={CLIENT_STATUS[c.status].label}
                  color={CLIENT_STATUS[c.status].color}
                />
                {Number(c.value) > 0 && (
                  <span className="text-sm font-black text-electric">{money(c.value)}</span>
                )}
              </div>

              <div className="space-y-1 text-xs text-white/40">
                {c.email && (
                  <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 hover:text-white">
                    <Mail className="w-3 h-3" /> {c.email}
                  </a>
                )}
                {c.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3" /> {c.phone}
                  </span>
                )}
              </div>

              {c.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] uppercase tracking-wider bg-white/5 border border-white/10 rounded-full px-2 py-0.5 text-white/50"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {editing && (
        <Modal
          title={editing.id ? "Editar cliente" : "Nuevo cliente"}
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
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nombre">
              <input
                className="input"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
            </Field>
            <Field label="Empresa">
              <input
                className="input"
                value={editing.company}
                onChange={(e) => setEditing({ ...editing, company: e.target.value })}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email">
              <input
                className="input"
                value={editing.email}
                onChange={(e) => setEditing({ ...editing, email: e.target.value })}
              />
            </Field>
            <Field label="Teléfono">
              <input
                className="input"
                value={editing.phone}
                onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
              />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Estado">
              <select
                className="input"
                value={editing.status}
                onChange={(e) =>
                  setEditing({ ...editing, status: e.target.value as Client["status"] })
                }
              >
                {Object.entries(CLIENT_STATUS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Valor ($)">
              <input
                className="input"
                type="number"
                value={editing.value}
                onChange={(e) => setEditing({ ...editing, value: Number(e.target.value) })}
              />
            </Field>
            <Field label="Origen">
              <input
                className="input"
                placeholder="Referido, web..."
                value={editing.source}
                onChange={(e) => setEditing({ ...editing, source: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Etiquetas (separadas por coma)">
            <input
              className="input"
              value={editing.tags?.join(", ")}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                })
              }
            />
          </Field>
          <Field label="Notas">
            <textarea
              className="input resize-y"
              rows={3}
              value={editing.notes}
              onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
            />
          </Field>
        </Modal>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  color = "#1E90FF",
  onClick,
}: {
  label: string;
  active: boolean;
  color?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
      style={
        active
          ? { background: `${color}1a`, color, borderColor: `${color}55` }
          : { background: "transparent", color: "rgba(255,255,255,.4)", borderColor: "rgba(255,255,255,.1)" }
      }
    >
      {label}
    </button>
  );
}
