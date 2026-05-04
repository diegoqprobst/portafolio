"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  X,
  Save,
  Upload,
} from "lucide-react";

type Project = {
  id?: string;
  title_es: string;
  title_en: string;
  summary_es: string;
  summary_en: string;
  description_es: string;
  description_en: string;
  tech_tags: string[];
  industry: string;
  year: string;
  cover_image_url: string;
  external_link: string;
  case_study_slug: string;
  order: number;
  published: boolean;
};

const EMPTY_PROJECT: Project = {
  title_es: "",
  title_en: "",
  summary_es: "",
  summary_en: "",
  description_es: "",
  description_en: "",
  tech_tags: [],
  industry: "",
  year: new Date().getFullYear().toString(),
  cover_image_url: "",
  external_link: "",
  case_study_slug: "",
  order: 0,
  published: true,
};

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/projects");
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing) return;
    setSaving(true);
    const method = editing.id ? "PUT" : "POST";
    const url = editing.id
      ? `/api/admin/projects/${editing.id}`
      : "/api/admin/projects";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar este proyecto?")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    load();
  }

  async function uploadImage(file: File) {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const { url } = await res.json();
    setEditing((e) => e ? { ...e, cover_image_url: url } : e);
    setUploading(false);
  }

  if (loading)
    return (
      <div className="flex items-center gap-2 text-white/30">
        <Loader2 className="w-4 h-4 animate-spin" /> Cargando...
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black gradient-text">Proyectos</h1>
          <p className="text-white/40 text-sm mt-1">{projects.length} proyectos publicados</p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY_PROJECT })}
          className="btn-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nuevo proyecto
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4"
          >
            {p.cover_image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.cover_image_url}
                alt={p.title_en}
                className="w-16 h-12 object-cover rounded-xl border border-white/10 flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold truncate">{p.title_en || p.title_es}</h3>
              <p className="text-xs text-white/40 truncate mt-0.5">
                {p.tech_tags?.join(", ")} · {p.year}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(p)}
                className="p-2 rounded-xl text-white/40 hover:text-electric hover:bg-electric/10 transition-all"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => p.id && remove(p.id)}
                className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="bg-dark border border-white/10 rounded-3xl p-8 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black">
                {editing.id ? "Editar proyecto" : "Nuevo proyecto"}
              </h2>
              <button onClick={() => setEditing(null)}>
                <X className="w-5 h-5 text-white/40 hover:text-white" />
              </button>
            </div>

            <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Título ES">
                  <input className="input" value={editing.title_es}
                    onChange={(e) => setEditing({ ...editing, title_es: e.target.value })} />
                </Field>
                <Field label="Título EN">
                  <input className="input" value={editing.title_en}
                    onChange={(e) => setEditing({ ...editing, title_en: e.target.value })} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Resumen ES">
                  <textarea className="input resize-y" rows={3} value={editing.summary_es}
                    onChange={(e) => setEditing({ ...editing, summary_es: e.target.value })} />
                </Field>
                <Field label="Resumen EN">
                  <textarea className="input resize-y" rows={3} value={editing.summary_en}
                    onChange={(e) => setEditing({ ...editing, summary_en: e.target.value })} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Descripción ES">
                  <textarea className="input resize-y" rows={4} value={editing.description_es}
                    onChange={(e) => setEditing({ ...editing, description_es: e.target.value })} />
                </Field>
                <Field label="Descripción EN">
                  <textarea className="input resize-y" rows={4} value={editing.description_en}
                    onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} />
                </Field>
              </div>

              <Field label="Tags (separados por coma)">
                <input className="input" value={editing.tech_tags?.join(", ")}
                  onChange={(e) =>
                    setEditing({ ...editing, tech_tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })
                  } />
              </Field>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Industria">
                  <input className="input" value={editing.industry}
                    onChange={(e) => setEditing({ ...editing, industry: e.target.value })} />
                </Field>
                <Field label="Año">
                  <input className="input" value={editing.year}
                    onChange={(e) => setEditing({ ...editing, year: e.target.value })} />
                </Field>
                <Field label="Orden">
                  <input className="input" type="number" value={editing.order}
                    onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} />
                </Field>
              </div>

              <Field label="Case study slug (ej: saratoga)">
                <input className="input" value={editing.case_study_slug}
                  onChange={(e) => setEditing({ ...editing, case_study_slug: e.target.value })} />
              </Field>

              <Field label="Imagen de portada">
                <div className="flex gap-3 items-center">
                  <input className="input flex-1" value={editing.cover_image_url}
                    onChange={(e) => setEditing({ ...editing, cover_image_url: e.target.value })}
                    placeholder="URL o sube una imagen" />
                  <label className="cursor-pointer px-4 py-2 rounded-xl border border-white/10 hover:border-electric/50 text-sm font-bold flex items-center gap-2 flex-shrink-0">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Subir
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
                  </label>
                </div>
                {editing.cover_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={editing.cover_image_url} alt="preview"
                    className="mt-2 w-32 h-24 object-cover rounded-xl border border-white/10" />
                )}
              </Field>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/10">
              <button onClick={() => setEditing(null)}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-sm font-bold text-white/50 hover:text-white">
                Cancelar
              </button>
              <button onClick={save} disabled={saving}
                className="btn-primary px-6 py-2.5 rounded-xl font-bold flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-white/30 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
