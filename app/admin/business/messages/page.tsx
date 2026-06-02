"use client";

import { Trash2, Mail, Building2, Download } from "lucide-react";
import { useCollection } from "@/components/admin/useCollection";
import { Loading, ErrorState, PageHeader } from "@/components/admin/ui";

type ContactMessage = {
  id?: number;
  name: string;
  company: string;
  email: string;
  project_type: string;
  message: string;
  created_at?: string;
};

type Lead = {
  id?: number;
  email: string;
  source: string;
  created_at?: string;
};

function fmtDate(s?: string) {
  if (!s) return "";
  // Evitar new Date() sin argumentos; con string es válido.
  const d = new Date(s);
  return isNaN(d.getTime()) ? s : d.toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" });
}

export default function MessagesPage() {
  const msgs = useCollection<ContactMessage>("messages");
  const leads = useCollection<Lead>("leads");

  if (msgs.loading || leads.loading) return <Loading />;
  if (msgs.error || leads.error)
    return (
      <ErrorState
        message={msgs.error ?? leads.error}
        onRetry={() => {
          msgs.load();
          leads.load();
        }}
      />
    );

  function exportLeadsCsv() {
    const rows = [["email", "source", "created_at"], ...leads.items.map((l) => [l.email, l.source, l.created_at ?? ""])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "lumen-leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <PageHeader
        title="Mensajes"
        subtitle={`${msgs.items.length} mensajes de contacto · ${leads.items.length} leads del checklist`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mensajes de contacto */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">
            Formulario de contacto
          </h2>
          {msgs.items.length === 0 ? (
            <p className="text-white/30 text-sm">Aún no hay mensajes.</p>
          ) : (
            msgs.items.map((m) => (
              <div
                key={m.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-white/90">{m.name || "—"}</div>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-white/40">
                      <a href={`mailto:${m.email}`} className="flex items-center gap-1 hover:text-electric">
                        <Mail className="w-3 h-3" /> {m.email}
                      </a>
                      {m.company && (
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" /> {m.company}
                        </span>
                      )}
                      {m.project_type && (
                        <span className="px-2 py-0.5 rounded-full bg-electric/10 text-electric font-bold">
                          {m.project_type}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[11px] text-white/30">{fmtDate(m.created_at)}</span>
                    <button
                      onClick={() => m.id && confirm("¿Eliminar este mensaje?") && msgs.remove(m.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {m.message && (
                  <p className="text-sm text-white/60 mt-3 whitespace-pre-wrap">{m.message}</p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Leads del checklist */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">
              Leads (checklist)
            </h2>
            {leads.items.length > 0 && (
              <button
                onClick={exportLeadsCsv}
                className="flex items-center gap-1 text-electric text-xs font-bold hover:opacity-80"
              >
                <Download className="w-3 h-3" /> CSV
              </button>
            )}
          </div>
          {leads.items.length === 0 ? (
            <p className="text-white/30 text-sm">Aún no hay leads.</p>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl divide-y divide-white/5">
              {leads.items.map((l) => (
                <div key={l.id} className="flex items-center justify-between gap-2 px-4 py-3">
                  <a href={`mailto:${l.email}`} className="text-sm text-white/70 hover:text-electric truncate">
                    {l.email}
                  </a>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] text-white/25">{fmtDate(l.created_at)}</span>
                    <button
                      onClick={() => l.id && msgs && confirm("¿Eliminar este lead?") && leads.remove(l.id)}
                      className="text-red-400/70 hover:text-red-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
