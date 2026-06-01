"use client";

import { useCallback, useEffect, useState } from "react";

// Hook genérico para una colección REST (/api/admin/business/<name>).
export function useCollection<T extends { id?: number }>(name: string) {
  const base = `/api/admin/business/${name}`;
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch(base);
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [base]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (body: Partial<T>) => {
      await fetch(base, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await load();
    },
    [base, load]
  );

  const update = useCallback(
    async (id: number, body: Partial<T>) => {
      await fetch(`${base}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await load();
    },
    [base, load]
  );

  const remove = useCallback(
    async (id: number) => {
      await fetch(`${base}/${id}`, { method: "DELETE" });
      await load();
    },
    [base, load]
  );

  return { items, loading, load, create, update, remove };
}
