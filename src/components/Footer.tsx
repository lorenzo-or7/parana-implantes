import { ArrowRight, ArrowUp, ArrowUpRight } from 'lucide-react';
import {
  ADDRESS,
  INSTAGRAM_URL,
  MAPS_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
  SECTIONS,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
} from '../data/site';
import { asset } from '../lib/asset';
import { useBooking } from '../booking/BookingContext';
import { Logo } from './Logo';
import './Footer.css';

/** Architectural Signature Footer: encerramento, informações (com a assinatura Or7 no bloco da marca) e faixa institucional. */
export function Footer() {
  const { openBooking } = useBooking();

  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    // Leva o foco ao topo para quem navega por teclado.
    document.querySelector<HTMLElement>('.island__brand')?.focus({ preventScroll: true });
  };

  return (
    <footer className="footer">
      {/* 1. Encerramento editorial */}
      <div className="footer__closing">
        <div className="container footer__closing-grid">
          <p className="footer__phrase">Seu próximo sorriso começa aqui.</p>
          <div className="footer__closing-aside">
            <p>Monte o pedido de avaliação em quatro passos. A equipe responde pelo WhatsApp para combinar o horário.</p>
            <div className="footer__closing-actions">
              <button type="button" className="btn btn--light btn--lg" onClick={() => openBooking()}>
                Agendar avaliação
                <ArrowRight className="btn__arrow" size={18} strokeWidth={1.8} aria-hidden="true" />
              </button>
              <a
                className="btn btn--outline-light btn--lg"
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Conversar no WhatsApp
                <span className="visually-hidden">(abre em nova aba)</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* 2. Informações */}
        <div className="footer__info">
          <div className="footer__brand">
            <Logo className="footer__logo" />
            <p>Clínica odontológica no Novo Mundo, em Curitiba, desde 2014.</p>
            {/* Assinatura Or7: arquivo original, proporção preservada, junto da identidade da clínica. */}
            <img
              className="footer__signature"
              src={asset('assets/marca/marca_dagua_or7_480.webp')}
              alt="Or7 — idealizado e desenvolvido por Lorenzo Orsetti"
              width={2048}
              height={682}
              loading="lazy"
              decoding="async"
            />
          </div>

          <nav className="footer__col footer__col--nav" aria-label="Seções do site">
            <h2 className="footer__heading">Navegue</h2>
            <ul role="list">
              {SECTIONS.map(({ id, label }) => (
                <li key={id}>
                  <a href={`#${id}`}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__col">
            <h2 className="footer__heading">Fale com a clínica</h2>
            <ul role="list">
              <li>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                  WhatsApp {WHATSAPP_DISPLAY}
                  <span className="visually-hidden"> (abre em nova aba)</span>
                </a>
              </li>
              <li>
                <a href={`tel:${PHONE_TEL}`}>Telefone {PHONE_DISPLAY}</a>
              </li>
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  Instagram @clinicaparanaimplantes
                  <span className="visually-hidden"> (abre em nova aba)</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <h2 className="footer__heading">Endereço</h2>
            <address>
              {ADDRESS.street}
              <br />
              {ADDRESS.district}, {ADDRESS.city} — {ADDRESS.state}
              <br />
              CEP {ADDRESS.zip}
            </address>
            <a className="text-link footer__directions" href={MAPS_URL} target="_blank" rel="noopener noreferrer">
              Como chegar
              <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
              <span className="visually-hidden"> (abre o Google Maps em nova aba)</span>
            </a>
          </div>
        </div>

        {/* 3. Faixa institucional */}
        <div className="footer__base">
          <p>
            © 2026 {ADDRESS.name}. Protótipo demonstrativo: conteúdo sujeito à validação da clínica. As informações do
            site não substituem a consulta.
          </p>
          <button type="button" className="btn btn--ghost btn--sm footer__top" onClick={backToTop}>
            <ArrowUp size={16} strokeWidth={1.8} aria-hidden="true" />
            Voltar ao topo
          </button>
        </div>

      </div>
    </footer>
  );
}
