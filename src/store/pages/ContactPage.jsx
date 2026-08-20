// Formulario de contacto NATIVO (HTML), sin JavaScript en el envío.
// Netlify detecta el formulario en el build y recibe los envíos en su panel.
// Atributos: name="contact" + data-netlify (detección), honeypot anti-spam y
// URL de éxito. Después del envío Netlify redirige a /#/contact?sent=1 y la
// app muestra la confirmación al entrar.

export default function ContactPage({ params }) {
  const sent = params?.sent === "1";
  return (
    <div className="sa-wrap" style={{ maxWidth: 640 }}>
      <h1 className="sa-h1">Contacto</h1>
      <p className="sa-lead">
        Escríbenos para solicitar un desarrollo, consultar productos o resolver
        dudas.
      </p>

      {sent && (
        <div className="sa-msg ok" style={{ marginTop: 16 }}>
          Mensaje enviado. Gracias, te responderemos pronto.
        </div>
      )}

      <form
        className="sa-form"
        style={{ marginTop: 20 }}
        name="contact"
        method="post"
        action="/"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        data-netlify-success-url="/#/contact?sent=1"
      >
        <input type="hidden" name="form-name" value="contact" />
        <input type="hidden" name="bot-field" value="" />
        <label htmlFor="c-name">Nombre</label>
        <input id="c-name" className="sa-input" name="name" required />
        <label htmlFor="c-email">Correo</label>
        <input
          id="c-email"
          className="sa-input"
          type="email"
          name="email"
          required
        />
        <label htmlFor="c-subject">Asunto</label>
        <input id="c-subject" className="sa-input" name="subject" />
        <label htmlFor="c-message">Mensaje</label>
        <textarea id="c-message" className="sa-area" name="message" required />
        <button className="sa-btn accent block" type="submit">
          Enviar mensaje
        </button>
      </form>
    </div>
  );
}