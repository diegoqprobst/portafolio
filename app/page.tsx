import HomeClient from "@/components/home/HomeClient";
import { getHomeContent } from "@/lib/home-content";

// ISR: la home se regenera como máximo cada 5 min, y el editor /admin/home
// llama revalidatePath("/") al guardar para refrescarla de inmediato.
// Si getHomeContent() falla, devuelve null y HomeClient usa su fallback.
export const revalidate = 300;

export default async function Page() {
  const content = await getHomeContent();
  return <HomeClient content={content} />;
}
