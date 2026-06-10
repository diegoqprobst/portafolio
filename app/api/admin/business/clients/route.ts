import { listCreate } from "@/lib/crud";
import { clientCreate, clientUpdate } from "@/lib/schemas";

export const { GET, POST } = listCreate({
  table: "clients",
  createSchema: clientCreate,
  updateSchema: clientUpdate,
  orderBy: { column: "created_at", ascending: false },
  softDelete: true,
});
