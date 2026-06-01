import { updateDelete } from "@/lib/crud";
import { financeEntryCreate, financeEntryUpdate } from "@/lib/schemas";

export const { PUT, DELETE } = updateDelete({
  table: "finance_entries",
  createSchema: financeEntryCreate,
  updateSchema: financeEntryUpdate,
});
