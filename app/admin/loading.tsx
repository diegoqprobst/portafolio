import { Loader2 } from "lucide-react";

// Fallback de carga a nivel de segmento /admin/* — se muestra durante las
// transiciones de ruta mientras el server component resuelve.
export default function AdminLoading() {
  return (
    <div className="flex items-center gap-2 text-white/30">
      <Loader2 className="w-4 h-4 animate-spin" /> Cargando...
    </div>
  );
}
