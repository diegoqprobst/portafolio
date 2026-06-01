"use client";

import { useCallback, useEffect, useState } from "react";

// Hook genérico para una colección REST (/api/admin/business/<name>).
//
// Resiliente por diseño:
//   - load() siempre baja `loading` en finally (antes, si fetch lanzaba, la UI
//     quedaba en "Cargando..." para siempre — justo lo que pasaba si Insforge
//     se caía).
//   - Captura errores y los expone en `error` para que la página muestre un
//     estado de error con botón de reintento, en vez de una pantalla vacía.
//   - Las mutaciones (create/update/remove) nunca lanzan sin manejar: capturan
//     internamente, setean `error`, y devuelven `true`/`false` para que el
//     llamador pueda reaccionar si quiere.
export function useCollection<T extends { id?: number }>(name: string) {
  const base = `/api/admin/business/${name}`;
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(base);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError(
        "No se pudo cargar la información. Revisa tu conexión o el estado del backend."
      );
    } finally {
      setLoading(false);
    }
  }, [base]);

  useEffect(() => {
    load();
  }, [load]);

  const mutate = useCallback(
    async (run: () => Promise<Response>): Promise<boolean> => {
      try {
        const res = await run();
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await load();
        return true;
      } catch {
        setError("No se pudo guardar el cambio. Inténtalo de nuevo.");
        return false;
      }
    },
    [load]
  );

  const create = useCallback(
    (body: Partial<T>) =>
      mutate(() =>
        fetch(base, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      ),
    [base, mutate]
  );

  const update = useCallback(
    (id: number, body: Partial<T>) =>
      mutate(() =>
        fetch(`${base}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      ),
    [base, mutate]
  );

  const remove = useCallback(
    (id: number) => mutate(() => fetch(`${base}/${id}`, { method: "DELETE" })),
    [base, mutate]
  );

  return { items, loading, error, load, create, update, remove };
}
