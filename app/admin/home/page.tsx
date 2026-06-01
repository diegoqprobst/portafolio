"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Plus, Trash2, AlertTriangle } from "lucide-react";
import {
  DEFAULT_METRICS,
  DEFAULT_SERVICES,
  DEFAULT_ABOUT,
  type HomeMetric,
  type HomeService,
} from "@/lib/home-defaults";

type EditorData = {
  about_es: string;
  about_en: string;
  metrics: HomeMetric[];
  services: HomeService[];
};

const EMPTY: EditorData = {
  about_es: DEFAULT_ABOUT.body_es,
  about_en: DEFAULT_ABOUT.body_en,
  metrics: DEFAULT_METRICS,
  services: DEFAULT_SERVICES,
};

export default function HomeEditor() {
  const [data, setData] = useState<EditorData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/home")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setData({
            about_es: d.about_es || DEFAULT_ABOUT.body_es,
            about_en: d.about_en || DEFAULT_ABOUT.body_en,
            metrics:
              Array.isArray(d.metrics) && d.metrics.length ? d.metrics : DEFAULT_METRICS,
            services:
              Array.isArray(d.services) && d.services.length ? d.services : DEFAULT_SERVICES,
          });
        }
      })
      .catch(() => {
        // Si falla la carga, el editor queda con los defaults (no rompe).
      })
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("No se pudo guardar. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  // ── helpers servicios ──────────────────────────────────────
  function patchService(i: number, patch: Partial<HomeService>) {
    setData((d) => {
      const services = [...d.services];
      services[i] = { ...services[i], ...patch };
      return { ...d, services };
    });
  }
  function addService() {
    setData((d) => ({
      ...d,
      services: [
        ...d.services,
        {
          icon: "✨",
          title_en: "",
          title_es: "",
          desc_en: "",
          desc_es: "",
          deliverables: [],
        },
      ],
    }));
  }
  function removeService(i: number) {
    setData((d) => ({ ...d, services: d.services.filter((_, j) => j !== i) }));
  }
  function patchDeliverable(si: number, di: number, patch: { en?: string; es?: string }) {
    setData((d) => {
      const services = [...d.services];
      const deliverables = [...services[si].deliverables];
      deliverables[di] = { ...deliverables[di], ...patch };
      services[si] = { ...services[si], deliverables };
      return { ...d, services };
    });
  }
  function addDeliverable(si: number) {
    setData((d) => {
      const services = [...d.services];
      services[si] = {
        ...services[si],
        deliverables: [...services[si].deliverables, { en: "", es: "" }],
      };
      return { ...d, services };
    });
  }
  function removeDeliverable(si: number, di: number) {
    setData((d) => {
      const services = [...d.services];
      services[si] = {
        ...services[si],
        deliverables: services[si].deliverables.filter((_, j) => j !== di),
      };
      return { ...d, services };
    });
  }

  if (loading)
    return (
      <div className="flex items-center gap-2 text-white/30">
        <Loader2 className="w-4 h-4 animate-spin" /> Cargando...
      </div>
    );

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-dark/90 backdrop-blur py-3 z-10">
        <div>
          <h1 className="text-3xl font-black gradient-text">Editar Home</h1>
          <p className="text-white/40 text-sm mt-1">
            Los cambios se reflejan en la home pública al guardar
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="btn-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saved ? "¡Guardado!" : "Guardar"}
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 bg-red-500/5 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
          <AlertTriangle className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="space-y-8">
        {/* ── About ── */}
        <Section
          title="Sección About"
          hint="Un párrafo por bloque; deja una línea en blanco para separar párrafos."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextArea
              label="Inglés"
              value={data.about_en}
              rows={8}
              onChange={(v) => setData((d) => ({ ...d, about_en: v }))}
            />
            <TextArea
              label="Español"
              value={data.about_es}
              rows={8}
              onChange={(v) => setData((d) => ({ ...d, about_es: v }))}
            />
          </div>
        </Section>

        {/* ── Métricas ── */}
        <Section title="Métricas">
          <div className="space-y-3">
            {data.metrics.map((m, i) => (
              <div key={i} className="flex gap-3 items-center">
                <input
                  value={m.value}
                  onChange={(e) => {
                    const metrics = [...data.metrics];
                    metrics[i] = { ...m, value: e.target.value };
                    setData((d) => ({ ...d, metrics }));
                  }}
                  placeholder="200+"
                  className="input w-24"
                />
                <input
                  value={m.label_en}
                  onChange={(e) => {
                    const metrics = [...data.metrics];
                    metrics[i] = { ...m, label_en: e.target.value };
                    setData((d) => ({ ...d, metrics }));
                  }}
                  placeholder="Documents built"
                  className="input flex-1"
                />
                <input
                  value={m.label_es}
                  onChange={(e) => {
                    const metrics = [...data.metrics];
                    metrics[i] = { ...m, label_es: e.target.value };
                    setData((d) => ({ ...d, metrics }));
                  }}
                  placeholder="Documentos generados"
                  className="input flex-1"
                />
                <button
                  onClick={() =>
                    setData((d) => ({ ...d, metrics: d.metrics.filter((_, j) => j !== i) }))
                  }
                  className="text-red-400 hover:text-red-300 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setData((d) => ({
                  ...d,
                  metrics: [...d.metrics, { value: "", label_en: "", label_es: "" }],
                }))
              }
              className="flex items-center gap-2 text-electric text-sm font-bold hover:opacity-80"
            >
              <Plus className="w-4 h-4" /> Añadir métrica
            </button>
          </div>
        </Section>

        {/* ── Servicios ── */}
        <Section
          title="Servicios"
          hint="Las tarjetas de la sección «Lo que construyo para ti» de la home."
        >
          <div className="space-y-6">
            {data.services.map((s, i) => (
              <div key={i} className="bg-black/20 border border-white/10 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/30">
                    Servicio {i + 1}
                  </span>
                  <button
                    onClick={() => removeService(i)}
                    className="text-red-400 hover:text-red-300 flex items-center gap-1 text-sm"
                  >
                    <Trash2 className="w-4 h-4" /> Quitar
                  </button>
                </div>

                <div className="flex gap-3">
                  <input
                    value={s.icon}
                    onChange={(e) => patchService(i, { icon: e.target.value })}
                    placeholder="⚡"
                    className="input w-16 text-center"
                  />
                  <input
                    value={s.badge_en ?? ""}
                    onChange={(e) => patchService(i, { badge_en: e.target.value })}
                    placeholder="Badge EN (opcional, ej. Most requested)"
                    className="input flex-1"
                  />
                  <input
                    value={s.badge_es ?? ""}
                    onChange={(e) => patchService(i, { badge_es: e.target.value })}
                    placeholder="Badge ES (opcional)"
                    className="input flex-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    value={s.title_en}
                    onChange={(e) => patchService(i, { title_en: e.target.value })}
                    placeholder="Título EN"
                    className="input"
                  />
                  <input
                    value={s.title_es}
                    onChange={(e) => patchService(i, { title_es: e.target.value })}
                    placeholder="Título ES"
                    className="input"
                  />
                  <textarea
                    value={s.desc_en}
                    onChange={(e) => patchService(i, { desc_en: e.target.value })}
                    placeholder="Descripción EN"
                    rows={3}
                    className="input resize-y"
                  />
                  <textarea
                    value={s.desc_es}
                    onChange={(e) => patchService(i, { desc_es: e.target.value })}
                    placeholder="Descripción ES"
                    rows={3}
                    className="input resize-y"
                  />
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">
                    Entregables
                  </p>
                  <div className="space-y-2">
                    {s.deliverables.map((d, di) => (
                      <div key={di} className="flex gap-2">
                        <input
                          value={d.en}
                          onChange={(e) => patchDeliverable(i, di, { en: e.target.value })}
                          placeholder="Entregable EN"
                          className="input flex-1"
                        />
                        <input
                          value={d.es}
                          onChange={(e) => patchDeliverable(i, di, { es: e.target.value })}
                          placeholder="Entregable ES"
                          className="input flex-1"
                        />
                        <button
                          onClick={() => removeDeliverable(i, di)}
                          className="text-red-400 hover:text-red-300 p-2"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addDeliverable(i)}
                      className="flex items-center gap-1 text-electric text-xs font-bold hover:opacity-80"
                    >
                      <Plus className="w-3 h-3" /> Añadir entregable
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addService}
              className="flex items-center gap-2 text-electric text-sm font-bold hover:opacity-80"
            >
              <Plus className="w-4 h-4" /> Añadir servicio
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">{title}</h2>
      {hint && <p className="text-white/30 text-xs mb-4">{hint}</p>}
      <div className={hint ? "" : "mt-4"}>{children}</div>
    </div>
  );
}

function TextArea({
  label,
  value,
  rows = 6,
  onChange,
}: {
  label: string;
  value: string;
  rows?: number;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-bold text-white/30 mb-2">{label}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="input w-full resize-y"
      />
    </div>
  );
}
