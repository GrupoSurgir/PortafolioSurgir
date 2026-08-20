import { useState } from "react";
import { site } from "../../data/site.js";

export default function ContactPage({ navigate }) {
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
    setStatus("sending");
    const done = () => setStatus("ok");
    const fail = () => setStatus("err");
    if (site.contactEndpoint) {
      fetch(site.contactEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then((r) => (r.ok ? done() : fail()))
        .catch(fail);
    } else {
      setTimeout(done, 900);
    }
  };

  return (
    <div className="sa-wrap">
      <h1 className="sa-h1">Contacto</h1>
      <p className="sa-lead">
        Escríbenos para solicitar un desarrollo, consultar productos o resolver
        dudas.
      </p>

      <div className="sa-contact" style={{ marginTop: 20 }}>
        <form onSubmit={submit}>
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
          <input
            className="sa-input"
            value={form.subject}
            onChange={set("subject")}
          />
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
              Mensaje enviado. Te responderemos pronto.
            </div>
          )}
          {status === "err" && (
            <div className="sa-msg err">
              No se pudo enviar. Revisa nombre, correo y mensaje.
            </div>
          )}
        </form>

        <div>
          <h2 className="sa-h2">Canales</h2>
          <div className="sa-channels">
            {site.contactChannels.map((c) =>
              c.href ? (
                <a key={c.id} className="sa-channel" href={c.href}>
                  <span className="sa-channel-label">{c.label}</span>
                  <span className="sa-channel-value">{c.value}</span>
                </a>
              ) : (
                <div key={c.id} className="sa-channel">
                  <span className="sa-channel-label">{c.label}</span>
                  <span className="sa-channel-value">{c.value}</span>
                </div>
              )
            )}
          </div>
          <p className="sa-muted" style={{ marginTop: 14, fontSize: 12 }}>
            Canales configurables en <code>src/data/site.js</code>. Los canales
            marcados como "(próximamente)" aún no están activos.
          </p>
        </div>
      </div>
    </div>
  );
}