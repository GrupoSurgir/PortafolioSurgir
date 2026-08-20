import { useState } from "react";

// Formulario de contacto → Netlify Forms.
// En producción (Netlify) el envío es REAL: el mensaje queda en el panel de
// Forms y llega por correo a la notificación configurada en el dashboard.
// En local NO se simula el envío: se muestra un estado claro.

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus("err");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setStatus("err");
      return;
    }
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      setStatus("demo");
      return;
    }
    setStatus("sending");
    const body = new URLSearchParams({
      "form-name": "contact",
      "bot-field": "",
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    });
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    })
      .then((r) => setStatus(r.ok ? "ok" : "err"))
      .catch(() => setStatus("err"));
  };

  return (
    <div className="sa-wrap" style={{ maxWidth: 640 }}>
      <h1 className="sa-h1">Contacto</h1>
      <p className="sa-lead">
        Escríbenos para solicitar un desarrollo, consultar productos o resolver
        dudas.
      </p>

      <form
        className="sa-form"
        style={{ marginTop: 20 }}
        name="contact"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={submit}
      >
        <label>Nombre</label>
        <input className="sa-input" value={form.name} onChange={set("name")} />
        <label>Correo</label>
        <input
          className="sa-input"
          type="email"
          value={form.email}
          onChange={set("email")}
        />
        <label>Asunto</label>
        <input className="sa-input" value={form.subject} onChange={set("subject")} />
        <label>Mensaje</label>
        <textarea
          className="sa-area"
          value={form.message}
          onChange={set("message")}
        />
        <button
          className="sa-btn accent block"
          type="submit"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Enviando..." : "Enviar mensaje"}
        </button>
        {status === "ok" && (
          <div className="sa-msg ok">
            Mensaje enviado. Gracias, te responderemos pronto.
          </div>
        )}
        {status === "demo" && (
          <div className="sa-msg">
            En local no se envía el mensaje. Despliega en Netlify y configura en
            el panel la notificación por correo para recibir los mensajes.
          </div>
        )}
        {status === "err" && (
          <div className="sa-msg err">
            No se pudo enviar. Revisa nombre, correo y mensaje.
          </div>
        )}
      </form>
    </div>
  );
}