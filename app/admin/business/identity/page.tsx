"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { Loading, Field } from "@/components/admin/ui";
import { BusinessProfile } from "@/lib/business";

const EMPTY: BusinessProfile = {
  business_name: "",
  tagline: "",
  mission: "",
  vision: "",
  values: [],
  primary_color: "#F5A623",
  secondary_color: "#FFD27F",
  accent_color: "#1E90FF",
  logo_url: "",
  brand_voice: "",
};

export default function IdentityPage() {
  const [data, setData] = useState<BusinessProfile>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/business/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d) setData({ ...EMPTY, ...d, values: d.values ?? [] });
      })
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    await fetch("/api/admin/business/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function uploadLogo(file: File) {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const { url } = await res.json();
    setData((d) => ({ ...d, logo_url: url }));
    setUploading(false);
  }

  if (loading) return <Loading />;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black gradient-text">Identidad</h1>
          <p className="text-white/40 text-sm mt-1">
            La esencia de tu marca: misión, visión, valores e identidad visual.
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

      {/* Vista previa de marca */}
      <div
        className="rounded-3xl p-8 mb-8 border border-white/10 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${data.primary_color}22, ${data.secondary_color}11)`,
        }}
      >
        <div className="flex items-center gap-4 mb-2">
          {data.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.logo_url}
              alt="logo"
              className="w-14 h-14 rounded-2xl object-cover border border-white/20 bg-black/20"
            />
          ) : (
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl"
              style={{ background: data.primary_color, color: "#fff" }}
            >
              {(data.business_name || "?").charAt(0)}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-black">{data.business_name || "Mi Negocio"}</h2>
            <p className="text-sm text-white/50">{data.tagline || "Tu eslogan aquí"}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          {[data.primary_color, data.secondary_color, data.accent_color].map((c, i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-xl border border-white/20"
              style={{ background: c }}
              title={c}
            />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <Section title="Lo básico">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Nombre del negocio">
              <input
                className="input"
                value={data.business_name}
                onChange={(e) => setData((d) => ({ ...d, business_name: e.target.value }))}
              />
            </Field>
            <Field label="Eslogan / Tagline">
              <input
                className="input"
                value={data.tagline}
                onChange={(e) => setData((d) => ({ ...d, tagline: e.target.value }))}
              />
            </Field>
          </div>
        </Section>

        <Section title="Misión">
          <textarea
            className="input resize-y w-full"
            rows={3}
            placeholder="¿Por qué existe tu negocio? ¿A quién sirves?"
            value={data.mission}
            onChange={(e) => setData((d) => ({ ...d, mission: e.target.value }))}
          />
        </Section>

        <Section title="Visión">
          <textarea
            className="input resize-y w-full"
            rows={3}
            placeholder="¿Dónde quieres estar en 3-5 años?"
            value={data.vision}
            onChange={(e) => setData((d) => ({ ...d, vision: e.target.value }))}
          />
        </Section>

        <Section title="Valores">
          <div className="space-y-3">
            {data.values.map((v, i) => (
              <div key={i} className="flex gap-3 items-start bg-black/20 rounded-xl p-3">
                <div className="flex-1 space-y-2">
                  <input
                    className="input"
                    placeholder="Título del valor"
                    value={v.title}
                    onChange={(e) => {
                      const values = [...data.values];
                      values[i] = { ...v, title: e.target.value };
                      setData((d) => ({ ...d, values }));
                    }}
                  />
                  <input
                    className="input"
                    placeholder="Descripción breve"
                    value={v.desc}
                    onChange={(e) => {
                      const values = [...data.values];
                      values[i] = { ...v, desc: e.target.value };
                      setData((d) => ({ ...d, values }));
                    }}
                  />
                </div>
                <button
                  onClick={() =>
                    setData((d) => ({ ...d, values: d.values.filter((_, j) => j !== i) }))
                  }
                  className="text-red-400 hover:text-red-300 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setData((d) => ({ ...d, values: [...d.values, { title: "", desc: "" }] }))
              }
              className="flex items-center gap-2 text-electric text-sm font-bold hover:opacity-80"
            >
              <Plus className="w-4 h-4" /> Añadir valor
            </button>
          </div>
        </Section>

        <Section title="Identidad visual">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <ColorField
              label="Color primario"
              value={data.primary_color}
              onChange={(v) => setData((d) => ({ ...d, primary_color: v }))}
            />
            <ColorField
              label="Color secundario"
              value={data.secondary_color}
              onChange={(v) => setData((d) => ({ ...d, secondary_color: v }))}
            />
            <ColorField
              label="Color de acento"
              value={data.accent_color}
              onChange={(v) => setData((d) => ({ ...d, accent_color: v }))}
            />
          </div>
          <Field label="Logo">
            <div className="flex gap-3 items-center">
              <input
                className="input flex-1"
                value={data.logo_url}
                placeholder="URL del logo o súbelo"
                onChange={(e) => setData((d) => ({ ...d, logo_url: e.target.value }))}
              />
              <label className="cursor-pointer px-4 py-2 rounded-xl border border-white/10 hover:border-electric/50 text-sm font-bold flex items-center gap-2 flex-shrink-0">
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                Subir
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])}
                />
              </label>
            </div>
          </Field>
        </Section>

        <Section title="Voz de marca">
          <textarea
            className="input resize-y w-full"
            rows={3}
            placeholder="¿Cómo suena tu marca? (cercana, profesional, atrevida...)"
            value={data.brand_voice}
            onChange={(e) => setData((d) => ({ ...d, brand_voice: e.target.value }))}
          />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg bg-transparent border border-white/10 cursor-pointer flex-shrink-0"
        />
        <input className="input" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </Field>
  );
}
