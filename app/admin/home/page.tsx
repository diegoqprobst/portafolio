"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";

type HomeContent = {
  hero_taglines_es: string[];
  hero_taglines_en: string[];
  about_es: string;
  about_en: string;
  metrics: { value: string; label_es: string; label_en: string }[];
};

const EMPTY: HomeContent = {
  hero_taglines_es: [],
  hero_taglines_en: [],
  about_es: "",
  about_en: "",
  metrics: [],
};

export default function HomeEditor() {
  const [data, setData] = useState<HomeContent>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/home")
      .then((r) => r.json())
      .then((d) => { if (d) setData(d); })
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    await fetch("/api/admin/home", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading)
    return (
      <div className="flex items-center gap-2 text-white/30">
        <Loader2 className="w-4 h-4 animate-spin" /> Cargando...
      </div>
    );

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
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
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saved ? "¡Guardado!" : "Guardar"}
        </button>
      </div>

      <div className="space-y-8">
        {/* Taglines typewriter */}
        <Section title="Frases del Typewriter">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TaglineEditor
              label="Español"
              lines={data.hero_taglines_es}
              onChange={(v) => setData((d) => ({ ...d, hero_taglines_es: v }))}
            />
            <TaglineEditor
              label="Inglés"
              lines={data.hero_taglines_en}
              onChange={(v) => setData((d) => ({ ...d, hero_taglines_en: v }))}
            />
          </div>
        </Section>

        {/* About */}
        <Section title="Sección About">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextArea
              label="Español"
              value={data.about_es}
              onChange={(v) => setData((d) => ({ ...d, about_es: v }))}
            />
            <TextArea
              label="Inglés"
              value={data.about_en}
              onChange={(v) => setData((d) => ({ ...d, about_en: v }))}
            />
          </div>
        </Section>

        {/* Metrics */}
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
                  placeholder="4+"
                  className="input w-20"
                />
                <input
                  value={m.label_es}
                  onChange={(e) => {
                    const metrics = [...data.metrics];
                    metrics[i] = { ...m, label_es: e.target.value };
                    setData((d) => ({ ...d, metrics }));
                  }}
                  placeholder="Años Exp."
                  className="input flex-1"
                />
                <input
                  value={m.label_en}
                  onChange={(e) => {
                    const metrics = [...data.metrics];
                    metrics[i] = { ...m, label_en: e.target.value };
                    setData((d) => ({ ...d, metrics }));
                  }}
                  placeholder="Years Exp."
                  className="input flex-1"
                />
                <button
                  onClick={() =>
                    setData((d) => ({
                      ...d,
                      metrics: d.metrics.filter((_, j) => j !== i),
                    }))
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
                  metrics: [
                    ...d.metrics,
                    { value: "", label_es: "", label_en: "" },
                  ],
                }))
              }
              className="flex items-center gap-2 text-electric text-sm font-bold hover:opacity-80"
            >
              <Plus className="w-4 h-4" /> Añadir métrica
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function TaglineEditor({
  label,
  lines,
  onChange,
}: {
  label: string;
  lines: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div>
      <p className="text-xs font-bold text-white/30 mb-2">{label}</p>
      <div className="space-y-2">
        {lines.map((l, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={l}
              onChange={(e) => {
                const next = [...lines];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="input flex-1"
            />
            <button
              onClick={() => onChange(lines.filter((_, j) => j !== i))}
              className="text-red-400 hover:text-red-300 p-2"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange([...lines, ""])}
          className="flex items-center gap-1 text-electric text-xs font-bold hover:opacity-80"
        >
          <Plus className="w-3 h-3" /> Añadir
        </button>
      </div>
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-bold text-white/30 mb-2">{label}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        className="input w-full resize-y"
      />
    </div>
  );
}
