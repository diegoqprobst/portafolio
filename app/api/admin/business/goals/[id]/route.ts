import { updateDelete } from "@/lib/crud";
import { goalCreate, goalUpdate } from "@/lib/schemas";

export const { PUT, DELETE } = updateDelete({
  table: "goals",
  createSchema: goalCreate,
  updateSchema: goalUpdate,
  softDelete: true,
});
