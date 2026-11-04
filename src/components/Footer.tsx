import { ArrowUp } from 'lucide-react';
import { ADDRESS, INSTAGRAM_URL, MAPS_URL, SECTIONS, WHATSAPP_NUMBER } from '../data/site';
import { asset } from '../lib/asset';
import { useBooking } from '../booking/BookingContext';
import { Logo } from './Logo';
import './Footer.css';

export function Footer() {
  const { openBooking } = useBooking();

  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    // Leva o foco ao topo para quem navega por teclado.
    document.querySelector<HTMLElement>('.island__brand')?.focus({ preventScroll: true });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__hero">
          <p className="footer__phrase">Seu próximo sorriso começa aqui.</p>
          <button type="button" className="btn btn--primary footer__cta" onClick={() => openBooking()}>
            Agendar avaliação
          </button>
        </div>

        <div className="footer__grid">
          <div className="footer__brand">
            <Logo className="footer__logo" />
            <p>Clínica odontológica em Curitiba, desde 2014.</p>
          </div>

          <nav className="footer__col" aria-label="Seções do site">
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
                  WhatsApp<span className="visually-hidden"> (abre em nova aba)</span>
                </a>
              </li>
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  Instagram<span className="visually-hidden"> (abre em nova aba)</span>
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
              {ADDRESS.zip}
            </address>
            <a className="footer__directions" href={MAPS_URL} target="_blank" rel="noopener noreferrer">
              Como chegar<span className="visually-hidden"> (abre o Google Maps em nova aba)</span>
            </a>
          </div>
        </div>

        <div className="footer__base">
          <p>© 2026 {ADDRESS.name}. Protótipo demonstrativo.</p>
          <button type="button" className="footer__top" onClick={backToTop}>
            <ArrowUp size={16} strokeWidth={1.8} aria-hidden="true" />
            Voltar ao topo
          </button>
        </div>

        <div className="footer__signature">
          <img
            src={asset('assets/marca/marca_dagua_or7_original.png')}
            alt="Or7 — idealizado e desenvolvido por Lorenzo Orsetti"
            width={2048}
            height={682}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </footer>
  );
}
