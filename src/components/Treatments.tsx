import { useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { TREATMENTS, type Treatment } from '../data/treatments';
import { asset } from '../lib/asset';
import { useBooking } from '../booking/BookingContext';
import { Dialog } from './Dialog';
import './Treatments.css';

/** Focus Cards (Aceternity) adaptados: o card em foco se destaca e os vizinhos suavizam. */
export function Treatments() {
  const [focused, setFocused] = useState<number | null>(null);
  const [selected, setSelected] = useState<Treatment | null>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const { openBooking } = useBooking();

  const requestBooking = () => {
    if (!selected) return;
    const id = selected.id;
    setSelected(null);
    // Aguarda o painel fechar e devolver o foco antes de abrir o agendamento.
    requestAnimationFrame(() => openBooking(id));
  };

  return (
    <section id="tratamentos" className="treatments section" aria-labelledby="treatments-title">
      <div className="container">
        <header className="section-head">
          <div>
            <p className="label">Tratamentos</p>
            <h2 id="treatments-title" className="section-title">
              Caminhos diferentes, cuidado individual.
            </h2>
          </div>
          <div className="section-head__aside">
            <p className="lead">
              Cada boca tem uma história. Conheça os tratamentos da clínica e, quando quiser, peça uma avaliação para
              entender o que faz sentido no seu caso.
            </p>
          </div>
        </header>

        <ul
          className="focus-grid"
          role="list"
          data-has-focus={focused !== null || undefined}
          onPointerLeave={() => setFocused(null)}
        >
          {TREATMENTS.map((treatment, index) => (
            <li key={treatment.id} className="focus-card" data-active={focused === index || undefined}>
              <button
                type="button"
                className="focus-card__button"
                onPointerEnter={(e) => e.pointerType === 'mouse' && setFocused(index)}
                onFocus={() => setFocused(index)}
                onBlur={() => setFocused(null)}
                onClick={(e) => {
                  lastTrigger.current = e.currentTarget;
                  setSelected(treatment);
                }}
                aria-haspopup="dialog"
              >
                <img
                  className="focus-card__img"
                  src={asset(treatment.image)}
                  alt=""
                  width={546}
                  height={197}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: treatment.focus }}
                />
                <span className="focus-card__shade" aria-hidden="true" />
                <span className="focus-card__body">
                  <span className="focus-card__title">{treatment.title}</span>
                  <span className="focus-card__cta">
                    <span className="visually-hidden">: conhecer tratamento</span>
                    <ArrowUpRight size={17} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="treatments__foot">
          <p>Ainda não sabe qual é o seu caso? A avaliação serve para isso.</p>
          <button type="button" className="btn btn--ghost" onClick={() => openBooking('outro')}>
            Pedir uma avaliação
            <ArrowRight className="btn__arrow" size={18} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>
      </div>

      <Dialog
        open={selected !== null}
        onRequestClose={() => setSelected(null)}
        labelledBy="treatment-dialog-title"
        describedBy="treatment-dialog-desc"
        returnFocus={lastTrigger}
      >
        {selected && (
          <article className="treatment-panel">
            <img
              className="treatment-panel__img"
              src={asset(selected.image)}
              alt={selected.alt}
              width={546}
              height={197}
              style={{ objectPosition: selected.focus }}
            />
            <div className="treatment-panel__body">
              <h2 id="treatment-dialog-title" className="treatment-panel__title">
                {selected.title}
              </h2>
              <p id="treatment-dialog-desc" className="treatment-panel__summary">
                {selected.summary}
              </p>
              {selected.details.map((paragraph) => (
                <p key={paragraph} className="treatment-panel__text">
                  {paragraph}
                </p>
              ))}
              <p className="treatment-panel__note">
                Conteúdo informativo. Não substitui consulta: a indicação de qualquer tratamento depende de avaliação
                presencial.
              </p>
              <div className="treatment-panel__actions">
                <button type="button" className="btn btn--primary" onClick={requestBooking}>
                  Solicitar avaliação
                </button>
                <button type="button" className="btn btn--ghost" onClick={() => setSelected(null)}>
                  Voltar aos tratamentos
                </button>
              </div>
            </div>
          </article>
        )}
      </Dialog>
    </section>
  );
}
