import { ArrowUpRight, MapPin } from 'lucide-react';
import {
  ADDRESS,
  INSTAGRAM_URL,
  MAPS_EMBED_URL,
  MAPS_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
} from '../data/site';
import './Visit.css';

export function Visit() {
  return (
    <section id="contato" className="visit section" aria-labelledby="visit-title">
      <div className="container visit__grid">
        <div className="visit__copy">
          <p className="label">Contato</p>
          <h2 id="visit-title" className="section-title">
            Visite-nos no Novo Mundo.
          </h2>

          <address className="visit__address">
            <span className="visit__street">{ADDRESS.street}</span>
            <span>
              {ADDRESS.district}, {ADDRESS.city} — {ADDRESS.state}
            </span>
            <span>CEP {ADDRESS.zip}</span>
          </address>
          <p className="visit__hint">
            Estacionamento gratuito no local. O atendimento é com hora marcada: combine o seu horário antes de vir.
          </p>

          <div className="visit__actions">
            <a className="btn btn--primary" href={MAPS_URL} target="_blank" rel="noopener noreferrer">
              <MapPin size={18} strokeWidth={1.8} aria-hidden="true" />
              Como chegar
              <span className="visually-hidden">(abre o Google Maps em nova aba)</span>
            </a>
            <a className="btn btn--ghost" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
              Conversar no WhatsApp
              <span className="visually-hidden">(abre em nova aba)</span>
            </a>
          </div>

          <dl className="visit__contacts">
            <div>
              <dt>WhatsApp</dt>
              <dd>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                  {WHATSAPP_DISPLAY}
                  <span className="visually-hidden">(abre em nova aba)</span>
                </a>
              </dd>
            </div>
            <div>
              <dt>Telefone</dt>
              <dd>
                <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
              </dd>
            </div>
            <div>
              <dt>Instagram</dt>
              <dd>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  @clinicaparanaimplantes
                  <span className="visually-hidden">(abre em nova aba)</span>
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <figure className="visit__map">
          <div className="visit__map-frame">
            {/* Fica por baixo do iframe: aparece se o mapa não carregar. */}
            <div className="visit__map-fallback" aria-hidden="true">
              <MapPin size={28} strokeWidth={1.5} />
              <span>{ADDRESS.street}</span>
            </div>
            <iframe
              src={MAPS_EMBED_URL}
              title={`Mapa: ${ADDRESS.name}, ${ADDRESS.street}, ${ADDRESS.district}, ${ADDRESS.city}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <figcaption className="visit__map-bar">
            <span>
              <strong>{ADDRESS.name}</strong>
              <span>
                {ADDRESS.street}, {ADDRESS.district}
              </span>
            </span>
            <a className="text-link" href={MAPS_URL} target="_blank" rel="noopener noreferrer">
              Abrir no Google Maps
              <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
              <span className="visually-hidden">(nova aba)</span>
            </a>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
