"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

// Error boundary a nivel de segmento /admin/*. Si cualquier página del panel
// lanza un error de render (datos inesperados, bug, etc.), en vez de pantalla
// en blanco el usuario ve un mensaje claro con botón de reintento.
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log para diagnóstico (visible en consola del navegador / logs de Vercel).
    console.error("[admin error boundary]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-start gap-4 bg-red-500/5 border border-red-500/20 rounded-2xl p-8 max-w-lg">
      <div className="flex items-center gap-2 text-red-400 font-bold text-lg">
        <AlertTriangle className="w-5 h-5" /> Algo salió mal en el panel
      </div>
      <p className="text-white/50 text-sm">
        Ocurrió un error al cargar esta sección. Puede ser un problema temporal
        del backend. Reintenta; si persiste, revisa los logs.
      </p>
      <button
        onClick={reset}
        className="btn-primary px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" /> Reintentar
      </button>
    </div>
  );
}
