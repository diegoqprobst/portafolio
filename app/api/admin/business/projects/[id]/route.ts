import { updateDelete } from "@/lib/crud";
import { businessProjectCreate, businessProjectUpdate } from "@/lib/schemas";

export const { PUT, DELETE } = updateDelete({
  table: "business_projects",
  createSchema: businessProjectCreate,
  updateSchema: businessProjectUpdate,
  softDelete: true,
});
