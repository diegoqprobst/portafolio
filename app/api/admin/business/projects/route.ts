import { listCreate } from "@/lib/crud";

export const { GET, POST } = listCreate("business_projects", { column: "created_at", ascending: false });
