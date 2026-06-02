import { listCreate } from "@/lib/crud";
import { leadCreate, leadUpdate } from "@/lib/schemas";

export const { GET, POST } = listCreate({
  table: "leads",
  createSchema: leadCreate,
  updateSchema: leadUpdate,
  orderBy: { column: "created_at", ascending: false },
});
