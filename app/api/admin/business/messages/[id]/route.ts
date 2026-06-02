import { updateDelete } from "@/lib/crud";
import { contactMessageCreate, contactMessageUpdate } from "@/lib/schemas";

export const { PUT, DELETE } = updateDelete({
  table: "contact_messages",
  createSchema: contactMessageCreate,
  updateSchema: contactMessageUpdate,
});
