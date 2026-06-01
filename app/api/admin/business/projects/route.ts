import { listCreate } from "@/lib/crud";
import { businessProjectCreate, businessProjectUpdate } from "@/lib/schemas";

export const { GET, POST } = listCreate({
  table: "business_projects",
  createSchema: businessProjectCreate,
  updateSchema: businessProjectUpdate,
  orderBy: { column: "created_at", ascending: false },
});
