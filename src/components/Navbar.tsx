import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { SECTIONS, type SectionId } from '../data/site';
import { useBooking } from '../booking/BookingContext';
import { lockScroll, unlockScroll } from '../lib/scrollLock';
import { Logo } from './Logo';
import { ThemeSwitch } from './ThemeSwitch';
import './Navbar.css';

/** Links sempre visíveis na faixa intermediária (900–1199px). */
const PRIORITY: SectionId[] = ['tratamentos', 'profissionais', 'contato'];

function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>('inicio');
  useEffect(() => {
    let raf = 0;
    // A seção ativa é a última cujo topo já passou de 40% da altura da tela.
    const compute = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let current: SectionId = 'inicio';
      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = 'contato';
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return active;
}

export function Navbar() {
  const { openBooking } = useBooking();
  const reduced = useReducedMotion();
  const active = useActiveSection();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Menu: Escape, clique fora, foco inicial e bloqueio de rolagem no mobile.
  useEffect(() => {
    if (!open) return;
    const isSmall = window.matchMedia('(max-width: 899px)').matches;
    if (isSmall) lockScroll();
    const raf = requestAnimationFrame(() => menuRef.current?.querySelector<HTMLElement>('a, button')?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onResize = () => {
      if (window.matchMedia('(min-width: 1200px)').matches) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      if (isSmall) unlockScroll();
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const startBooking = () => {
    setOpen(false);
    openBooking();
  };

  const spring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 380, damping: 36 };

  return (
    <header className="nav-wrap">
      <nav
        ref={navRef}
        className="island"
        data-scrolled={scrolled || undefined}
        data-open={open || undefined}
        aria-label="Navegação principal"
      >
        <div className="island__bar">
          <a href="#inicio" className="island__brand" onClick={() => setOpen(false)}>
            <Logo className="island__logo" label="Paraná Implantes — voltar ao início" />
          </a>

          <ul className="island__links" role="list">
            {SECTIONS.map(({ id, label }) => (
              <li key={id} className={PRIORITY.includes(id) ? 'is-priority' : undefined}>
                <a href={`#${id}`} className="island__link" aria-current={active === id ? 'true' : undefined}>
                  {active === id && <motion.span layoutId="nav-active" className="island__pill" transition={spring} />}
                  <span className="island__link-label">{label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="island__actions">
            <ThemeSwitch id="nav-theme" className="island__theme" />
            <button type="button" className="btn btn--primary btn--sm island__cta" onClick={startBooking} aria-label="Agendar avaliação">
              <span className="island__cta-long">Agendar avaliação</span>
              <span className="island__cta-short" aria-hidden="true">
                Agendar
              </span>
            </button>
            <button
              ref={toggleRef}
              type="button"
              className="island__toggle"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} strokeWidth={1.7} aria-hidden="true" /> : <Menu size={20} strokeWidth={1.7} aria-hidden="true" />}
              <span className="island__toggle-label">{open ? 'Fechar' : 'Menu'}</span>
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="site-menu"
              ref={menuRef}
              className="island__menu"
              initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={reduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul role="list" className="island__menu-list">
                {SECTIONS.map(({ id, label }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="island__menu-link"
                      aria-current={active === id ? 'true' : undefined}
                      onClick={() => setOpen(false)}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="island__menu-foot">
                <div className="island__menu-theme">
                  <span>Tema</span>
                  <ThemeSwitch id="menu-theme" />
                </div>
                <button type="button" className="btn btn--primary island__menu-cta" onClick={startBooking}>
                  Agendar avaliação
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
