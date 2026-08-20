import { useState } from "react";
import { ENVIRONMENTS } from "../environments.js";
import { usePayments } from "../store/PaymentsContext.jsx";
import {
  REGIONS,
  COUNTRIES,
  CARD_BRANDS,
  LOCAL_METHODS,
  PROVIDERS,
  regionalProvider,
  paypalProvider,
  cardStatus,
  localStatus,
  paypalStatus,
  STATUS_META,
  localMethodsForMarket,
} from "../store/payments.js";

function Slider({ label, value, min, max, step, onChange, fmt }) {
  return (
    <div className="sg-row">
      <div className="sg-label">{label}</div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <div className="sg-val">{fmt(value)}</div>
    </div>
  );
}

function Pill({ status }) {
  const m = STATUS_META[status] || STATUS_META.disabled;
  return (
    <span className={`sg-pill sg-${m.cls}`}>
      {m.symbol} {m.label}
    </span>
  );
}

function OfficialLinks({ links }) {
  if (!links || !Object.keys(links).length) return null;
  const items = [
    { key: "configure", label: "Configurar proveedor", href: links.configure },
    { key: "docs", label: "Documentación", href: links.docs },
    { key: "dashboard", label: "Dashboard", href: links.dashboard },
    { key: "cards", label: "Configuración de tarjetas", href: links.cards },
  ];
  return (
    <div className="sg-links">
      {items.map(
        (i) =>
          i.href && (
            <a
              key={i.key}
              className="sg-link"
              href={i.href}
              target="_blank"
              rel="noreferrer noopener"
            >
              {i.label} ↗
            </a>
          )
      )}
    </div>
  );
}

// Panel de administración (accesible desde la experiencia 3D).
// Pestañas: Experiencia (audio/ambiente) y Pagos.
export default function AdminPanel({ settings, setSettings, onClose }) {
  const { payments, setPayments } = usePayments();
  const [tab, setTab] = useState("experiencia");

  const updateSettings = (patch) => setSettings((s) => ({ ...s, ...patch }));
  const updatePay = (patch) => setPayments((p) => ({ ...p, ...patch }));

  const rp = regionalProvider(payments);
  const pp = paypalProvider();
  const locals = localMethodsForMarket(payments);

  // Estado de conexión del proveedor regional.
  const providerStatus = !payments.regionalProviderId
    ? "disabled"
    : payments.connected
    ? "active"
    : "soon";

  const providerOptions = PROVIDERS.filter((p) => p.scope !== "international");

  return (
    <div className="sg-overlay">
      <div className="sg-panel sg-wide">
        <div className="sg-title">SURGIR · Administración</div>
        <div className="sg-tabs">
          <button
            className={`sg-tab ${tab === "experiencia" ? "active" : ""}`}
            onClick={() => setTab("experiencia")}
          >
            Experiencia
          </button>
          <button
            className={`sg-tab ${tab === "pagos" ? "active" : ""}`}
            onClick={() => setTab("pagos")}
          >
            Pagos
          </button>
        </div>

        {tab === "experiencia" && (
          <>
            <Slider
              label="Sonido"
              value={settings.volume}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => updateSettings({ volume: v })}
              fmt={(v) => `${Math.round(v * 100)}%`}
            />
            <div className="sg-row">
              <div className="sg-label">Ambiente</div>
              <select
                className="sg-select"
                value={settings.environment}
                onChange={(e) => updateSettings({ environment: e.target.value })}
              >
                {ENVIRONMENTS.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {tab === "pagos" && (
          <div className="sg-pagos">
            <p className="sg-note">
              Proveedor de pago <b>no es lo mismo</b> que marca de tarjeta. Elige
              primero el proveedor regional y luego qué métodos aceptar.
            </p>

            <div className="sg-block">
              <div className="sg-block-h">
                Región principal
                <select
                  className="sg-select sm"
                  value={payments.region}
                  onChange={(e) => updatePay({ region: e.target.value })}
                >
                  {REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sg-block-h">
                País / mercado
                <select
                  className="sg-select sm"
                  value={payments.country}
                  onChange={(e) => updatePay({ country: e.target.value })}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sg-block">
              <div className="sg-block-h">
                Pagos Latinoamérica
                <select
                  className="sg-select sm"
                  value={payments.regionalProviderId || ""}
                  onChange={(e) =>
                    updatePay({
                      regionalProviderId: e.target.value || null,
                    })
                  }
                >
                  {providerOptions.map((p) => (
                    <option key={p.id ?? "none"} value={p.id ?? ""}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <Pill status={providerStatus} />
              </div>
              {payments.regionalProviderId && (
                <p className="sg-mini">
                  {providerStatus === "soon"
                    ? "Proveedor seleccionado. La conexión real requiere un backend seguro con el proveedor."
                    : "Sin proveedor seleccionado."}
                </p>
              )}

              <div className="sg-sub-h">Tarjetas aceptadas</div>
              {CARD_BRANDS.map((c) => (
                <label className="sg-check" key={c.id}>
                  <input
                    type="checkbox"
                    checked={!!payments.cards[c.id]}
                    onChange={() =>
                      updatePay({
                        cards: {
                          ...payments.cards,
                          [c.id]: !payments.cards[c.id],
                        },
                      })
                    }
                  />
                  <span>{c.label}</span>
                  <Pill status={cardStatus(payments, c.id)} />
                </label>
              ))}

              <div className="sg-sub-h">
                Métodos locales ({COUNTRIES.find((c) => c.id === payments.country)?.label})
              </div>
              {locals.length === 0 ? (
                <p className="sg-mini">
                  Este proveedor no lista métodos locales conocidos para el país
                  seleccionado. Valida con la documentación oficial al integrar.
                </p>
              ) : (
                locals.map((m) => (
                  <label className="sg-check" key={m.id}>
                    <input
                      type="checkbox"
                      checked={!!payments.local[m.id]}
                      onChange={() =>
                        updatePay({
                          local: {
                            ...payments.local,
                            [m.id]: !payments.local[m.id],
                          },
                        })
                      }
                    />
                    <span>{m.label}</span>
                    <Pill status={localStatus(payments, m.id)} />
                  </label>
                ))
              )}
            </div>

            <div className="sg-block">
              <div className="sg-block-h">
                Pagos internacionales
                <label className="sg-check inline">
                  <input
                    type="checkbox"
                    checked={!!payments.paypalEnabled}
                    onChange={() => updatePay({ paypalEnabled: !payments.paypalEnabled })}
                  />
                  <span>PayPal</span>
                  <Pill status={paypalStatus(payments)} />
                </label>
              </div>
              <p className="sg-mini">
                PayPal se ofrece como método internacional para clientes del
                exterior. No reemplaza al proveedor regional en Latinoamérica.
              </p>
            </div>

            <div className="sg-block">
              <div className="sg-block-h">Modo</div>
              <label className="sg-check inline">
                <input
                  type="radio"
                  name="mode"
                  checked={payments.mode === "test"}
                  onChange={() => updatePay({ mode: "test" })}
                />
                <span>Prueba</span>
              </label>
              <label className="sg-check inline">
                <input
                  type="radio"
                  name="mode"
                  checked={payments.mode === "production"}
                  onChange={() => updatePay({ mode: "production" })}
                />
                <span>Producción</span>
              </label>
            </div>

            {rp.official && (
              <div className="sg-block">
                <div className="sg-block-h">Enlaces oficiales · {rp.name}</div>
                <OfficialLinks links={rp.links} />
              </div>
            )}
            {payments.paypalEnabled && (
              <div className="sg-block">
                <div className="sg-block-h">Enlaces oficiales · PayPal</div>
                <OfficialLinks links={pp.links} />
              </div>
            )}

            <p className="sg-security">
              🔒 Seguridad: las credenciales (Secret Keys, API privadas) viven
              únicamente en el servidor. SURGIR nunca almacena números de tarjeta,
              CVV, PIN ni datos sensibles de pago en el frontend.
            </p>
          </div>
        )}

        <div className="sg-actions">
          <button className="sg-btn" onClick={onClose}>
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
