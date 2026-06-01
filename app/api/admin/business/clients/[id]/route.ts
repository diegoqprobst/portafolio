import { updateDelete } from "@/lib/crud";
import { clientCreate, clientUpdate } from "@/lib/schemas";

export const { PUT, DELETE } = updateDelete({
  table: "clients",
  createSchema: clientCreate,
  updateSchema: clientUpdate,
});
