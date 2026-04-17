import { Resend } from "resend";
import { NextResponse } from "next/server";
const resend = new Resend(process.env.RESEND_API_KEY);
export async function POST(req: Request) {
  const { nombre, email, asunto, mensaje } = await req.json();
  try {
    await resend.emails.send({
      from: "Latino LV <hola@latinolasvegas.com>",
      to: "hola@latinolasvegas.com",
      subject: `[Latino LV] ${asunto} — de ${nombre}`,
      html: `<p><strong>Nombre:</strong> ${nombre}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Asunto:</strong> ${asunto}</p>
             <p><strong>Mensaje:</strong><br/>${mensaje}</p>`,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
