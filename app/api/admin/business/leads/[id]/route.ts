import { updateDelete } from "@/lib/crud";
import { leadCreate, leadUpdate } from "@/lib/schemas";

export const { PUT, DELETE } = updateDelete({
  table: "leads",
  createSchema: leadCreate,
  updateSchema: leadUpdate,
});
