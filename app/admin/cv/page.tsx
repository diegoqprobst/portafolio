"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Sparkles,
  Download,
  Loader2,
  Clock,
  ChevronDown,
} from "lucide-react";

type HistoryItem = {
  id: string;
  created_at: string;
  job_title: string;
  company: string;
  pdf_url: string;
};

type CvResult = {
  id: string;
  pdf_url: string;
  cv_json: Record<string, unknown>;
  provider: string;
};

type Provider = "auto" | "openai" | "claude";

const PROVIDERS: { value: Provider; label: string; badge: string; desc: string }[] = [
  { value: "auto",   label: "Auto",   badge: "🤖", desc: "OpenAI si está disponible, si no Claude" },
  { value: "openai", label: "OpenAI", badge: "💚", desc: "gpt-4o-mini — más barato y rápido" },
  { value: "claude", label: "Claude", badge: "🟠", desc: "claude-sonnet-4-6 — mejor razonamiento" },
];

export default function CvGenerator() {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [provider, setProvider] = useState<Provider>("auto");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CvResult | null>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  async function loadHistory() {
    const res = await fetch("/api/admin/cv/history");
    const data = await res.json();
    setHistory(data);
  }

  useEffect(() => { loadHistory(); }, []);

  async function generate() {
    if (!jobDesc.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/admin/cv/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_title: jobTitle,
          company,
          job_description: jobDesc,
          provider,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error generando CV");
      setResult(data);
      loadHistory();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black gradient-text flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-electric" />
          Generador de CV
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Claude adapta tu CV base a la job description que pegues aquí
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-5">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">
              Datos del puesto
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/30 mb-1.5 uppercase tracking-widest">
                  Título
                </label>
                <input
                  className="input"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="AI Automation Engineer"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/30 mb-1.5 uppercase tracking-widest">
                  Empresa
                </label>
                <input
                  className="input"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Startup XYZ"
                />
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
              Job Description
            </h2>
            <textarea
              className="input resize-y"
              rows={12}
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Pega aquí la descripción completa del puesto..."
            />
          </div>

          {/* Provider selector */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
              Modelo de IA
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {PROVIDERS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setProvider(p.value)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-center transition-all ${
                    provider === p.value
                      ? "border-electric/50 bg-electric/10 text-white"
                      : "border-white/10 text-white/40 hover:text-white hover:border-white/20"
                  }`}
                >
                  <span className="text-xl">{p.badge}</span>
                  <span className="text-xs font-bold">{p.label}</span>
                  <span className="text-[10px] text-white/30 leading-tight">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              {error}
            </p>
          )}

          <button
            onClick={generate}
            disabled={loading || !jobDesc.trim()}
            className="btn-primary w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Claude está generando tu CV...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generar CV personalizado
              </>
            )}
          </button>
        </div>

        {/* Result + history */}
        <div className="space-y-5">
          {result && (
            <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-green-400" />
                <h2 className="font-bold text-green-400">CV generado</h2>
                {result.provider && (
                  <span className="ml-auto text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/40">
                    {result.provider === "openai" ? "💚 OpenAI" : "🟠 Claude"}
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                {result.pdf_url && (
                  <a
                    href={result.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Descargar PDF
                  </a>
                )}
                <button
                  onClick={() => setShowPreview((v) => !v)}
                  className="px-4 py-3 rounded-xl border border-white/10 text-sm font-bold text-white/50 hover:text-white flex items-center gap-2"
                >
                  JSON
                  <ChevronDown
                    className="w-4 h-4 transition-transform"
                    style={{ transform: showPreview ? "rotate(180deg)" : "none" }}
                  />
                </button>
              </div>
              {showPreview && (
                <pre className="mt-4 text-xs text-white/50 bg-black/30 rounded-xl p-4 overflow-auto max-h-80">
                  {JSON.stringify(result.cv_json, null, 2)}
                </pre>
              )}
            </div>
          )}

          {/* History */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              Historial
            </h2>
            {history.length === 0 ? (
              <p className="text-white/20 text-sm">Aún no has generado ningún CV</p>
            ) : (
              <div className="space-y-2">
                {history.slice(0, 8).map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                  >
                    <div>
                      <p className="text-sm font-bold">
                        {h.job_title || "Sin título"}
                        {h.company && (
                          <span className="text-white/30 font-normal">
                            {" "}· {h.company}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-white/20">
                        {new Date(h.created_at).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    {h.pdf_url && (
                      <a
                        href={h.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-white/30 hover:text-electric transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
