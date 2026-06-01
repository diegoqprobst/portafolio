import { listCreate } from "@/lib/crud";

export const { GET, POST } = listCreate("finance_entries", { column: "entry_date", ascending: false });
