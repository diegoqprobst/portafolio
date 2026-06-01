import { listCreate } from "@/lib/crud";
import { financeEntryCreate, financeEntryUpdate } from "@/lib/schemas";

export const { GET, POST } = listCreate({
  table: "finance_entries",
  createSchema: financeEntryCreate,
  updateSchema: financeEntryUpdate,
  orderBy: { column: "entry_date", ascending: false },
});
