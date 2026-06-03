import { insforge } from "@/lib/insforge";

// Envío de email transaccional vía Insforge (AWS SES por proyecto).
//
// Degrada con elegancia: el envío de email a demanda de Insforge requiere
// plan de pago; en free tier (o si no está configurado) devuelve error. En
// ese caso NO rompemos el flujo — registramos un aviso y devolvemos false.
// Quien llama debe tratar el email como "best-effort": el lead/mensaje ya
// quedó guardado en la DB pase lo que pase.
//
// Cuando Diego active un plan/configuración de email, esto empieza a enviar
// solo, sin cambios de código.
export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<boolean> {
  try {
    const { error } = await insforge.emails.send({
      from: "Lumen Studio",
      ...opts,
    });
    if (error) {
      console.warn("[email] no enviado:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn("[email] fallo de envío:", e);
    return false;
  }
}
