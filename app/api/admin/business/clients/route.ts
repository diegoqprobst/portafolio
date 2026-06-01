import { listCreate } from "@/lib/crud";

export const { GET, POST } = listCreate("clients", { column: "created_at", ascending: false });
