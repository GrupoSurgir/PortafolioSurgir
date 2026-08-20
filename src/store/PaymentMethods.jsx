import {
  CARD_BRANDS,
  localMethodsForMarket,
  currencyForMarket,
  cardStatus,
  localStatus,
  paypalStatus,
  STATUS_LABEL,
  COUNTRIES,
  REGIONS,
} from "./payments.js";

function Badge({ status }) {
  return <span className={`pm-badge pm-${status}`}>{STATUS_LABEL[status]}</span>;
}

function Chip({ label, status, detail }) {
  return (
    <div className="pm-chip">
      <span className="pm-name">{label}</span>
      <Badge status={status} />
      {detail && <span className="pm-detail">{detail}</span>}
    </div>
  );
}

// Vista PÚBLICA de métodos de pago.
// Solo muestra los métodos que el administrador haya habilitado para mostrar.
// Como no hay conexión real con el proveedor (connected=false), todo aparece
// como PRÓXIMAMENTE: la interfaz nunca simula que se acepta un pago real.
export function PaymentMethods({ cfg }) {
  const regionLabel = REGIONS.find((r) => r.id === cfg.region)?.label || "Latinoamérica";
  const countryLabel = COUNTRIES.find((c) => c.id === cfg.country)?.label || cfg.country;
  const currency = currencyForMarket(cfg);

  const cards = CARD_BRANDS.filter((c) => cfg.cards?.[c.id]);
  const locals = localMethodsForMarket(cfg).filter((m) => cfg.local?.[m.id]);
  const paypal = cfg.paypalEnabled;

  const hasMethods = cards.length > 0 || locals.length > 0 || paypal;

  return (
    <div className="pm-section">
      <h2 className="pm-title">Métodos de pago</h2>
      <p className="pm-region">
        {regionLabel} · {countryLabel} · {currency}
      </p>
      <p className="pm-note">
        {hasMethods
          ? "Métodos de pago preparados · Próximamente"
          : "Aún no hay métodos de pago configurados."}
      </p>

      {cards.length > 0 && (
        <>
          <p className="pm-sub">Tarjetas</p>
          <div className="pm-grid">
            {cards.map((c) => (
              <Chip key={c.id} label={c.label} status={cardStatus(cfg, c.id)} />
            ))}
          </div>
        </>
      )}

      {locals.length > 0 && (
        <>
          <p className="pm-sub">Métodos locales ({countryLabel})</p>
          <div className="pm-grid">
            {locals.map((m) => (
              <Chip
                key={m.id}
                label={m.label}
                status={localStatus(cfg, m.id)}
                detail={cfg.billing?.[m.id] || ""}
              />
            ))}
          </div>
        </>
      )}

      {paypal && (
        <>
          <p className="pm-sub">Internacional</p>
          <div className="pm-grid">
            <Chip
              label="PayPal"
              status={paypalStatus(cfg)}
              detail={cfg.billing?.paypalEmail || ""}
            />
          </div>
        </>
      )}
    </div>
  );
}
