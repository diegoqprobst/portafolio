import { listCreate } from "@/lib/crud";
import { contactMessageCreate, contactMessageUpdate } from "@/lib/schemas";

export const { GET, POST } = listCreate({
  table: "contact_messages",
  createSchema: contactMessageCreate,
  updateSchema: contactMessageUpdate,
  orderBy: { column: "created_at", ascending: false },
});
