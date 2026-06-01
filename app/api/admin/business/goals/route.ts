import { listCreate } from "@/lib/crud";

export const { GET, POST } = listCreate("goals", { column: "sort_order", ascending: true });
