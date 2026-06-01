import { listCreate } from "@/lib/crud";
import { goalCreate, goalUpdate } from "@/lib/schemas";

export const { GET, POST } = listCreate({
  table: "goals",
  createSchema: goalCreate,
  updateSchema: goalUpdate,
  orderBy: { column: "sort_order", ascending: true },
});
