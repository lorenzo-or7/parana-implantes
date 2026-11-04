import { useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { DOCTORS, type Doctor } from '../data/site';
import { asset } from '../lib/asset';
import { useTheme } from '../theme/ThemeContext';
import { useBooking } from '../booking/BookingContext';
import ProfileCard from './ProfileCard/ProfileCard';
import { Dialog } from './Dialog';
import './Professionals.css';

export function Professionals() {
  const { theme } = useTheme();
  const { openBooking } = useBooking();
  const [selected, setSelected] = useState<Doctor | null>(null);
  const trigger = useRef<HTMLElement | null>(null);

  return (
    <section id="profissionais" className="pros section" aria-labelledby="pros-title">
      <div className="container">
        <header className="pros__head">
          <h2 id="pros-title" className="section-title">
            Quem cuida de você.
          </h2>
          <p className="lead">
            Bruna e Adan Barbaresco são irmãos e idealizaram a clínica em 2014. Conheça a formação de cada um e
            acompanhe o trabalho deles pelo Instagram.
          </p>
        </header>

        <div className="pros__cards">
          {DOCTORS.map((doctor) => (
            <ProfileCard
              key={doctor.id}
              name={doctor.name}
              title={doctor.title}
              avatarUrl={asset(doctor.portrait)}
              avatarAlt={`Retrato de ${doctor.name}`}
              photoPosition={doctor.portraitFocus}
              handle={doctor.instagramHandle}
              handleUrl={doctor.instagramUrl}
              handleLabel={`Instagram de ${doctor.shortName} (abre em nova aba)`}
              theme={theme}
              contactText="Conhecer profissional"
              onContactClick={(event) => {
                trigger.current = event.currentTarget;
                setSelected(doctor);
              }}
              holo={0.15}
              glare={0.25}
              tiltStrength={6}
              parallax={4}
              radius={20}
              enableTilt
              intro
              enableMobileTilt={false}
              className="pros__card"
            />
          ))}
        </div>
      </div>

      <Dialog
        open={selected !== null}
        onRequestClose={() => setSelected(null)}
        labelledBy="doctor-dialog-title"
        returnFocus={trigger}
        size="lg"
      >
        {selected && (
          <article className="doctor-panel">
            <figure className="doctor-panel__figure">
              <img
                src={asset(selected.procedure)}
                alt={selected.procedureAlt}
                width={436}
                height={312}
                loading="lazy"
                decoding="async"
              />
              <figcaption>Em atendimento na clínica</figcaption>
            </figure>
            <div className="doctor-panel__body">
              <h2 id="doctor-dialog-title" className="doctor-panel__title">
                {selected.name}
              </h2>
              <p className="doctor-panel__role">{selected.founderRole} da Paraná Implantes, em 2014</p>
              <ul className="doctor-panel__creds" role="list">
                {selected.credentials.map((credential) => (
                  <li key={credential}>{credential}</li>
                ))}
              </ul>
              <p className="doctor-panel__text">
                A proposta é a mesma desde a fundação: ouvir com atenção e explicar cada etapa do planejamento.
              </p>
              <div className="doctor-panel__actions">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => {
                    setSelected(null);
                    requestAnimationFrame(() => openBooking());
                  }}
                >
                  Solicitar avaliação
                </button>
                <a className="btn btn--ghost" href={selected.instagramUrl} target="_blank" rel="noopener noreferrer">
                  @{selected.instagramHandle}
                  <ExternalLink size={16} strokeWidth={1.8} aria-hidden="true" />
                  <span className="visually-hidden">(abre o Instagram em nova aba)</span>
                </a>
              </div>
            </div>
          </article>
        )}
      </Dialog>
    </section>
  );
}
