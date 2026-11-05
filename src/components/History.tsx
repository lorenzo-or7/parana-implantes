import { ArrowRight } from 'lucide-react';
import { DOCTORS } from '../data/site';
import { asset } from '../lib/asset';
import './History.css';

/** Leitura progressiva da história real (sem marcos ou datas além da fundação). */
const CHAPTERS = [
  { title: 'A ideia', text: 'Um lugar onde o paciente fosse ouvido antes de qualquer decisão.' },
  {
    title: 'O jeito de atender',
    text: 'O atendimento começa com conversa, com tempo para explicar cada etapa e tirar dúvidas, sem pressa.',
  },
  {
    title: 'Hoje',
    text: 'A proposta segue a mesma: atendimento humanizado, escuta e acolhimento, da recepção ao fim do tratamento.',
  },
];

/**
 * Heritage Editorial — Paraná Signature.
 * Ano e título dividem a primeira linha (separados por um fio vertical); os capítulos
 * formam a segunda; os fundadores fecham a seção.
 */
export function History() {
  return (
    <section id="historia" className="history section" aria-labelledby="history-title">
      <div className="container">
        <p className="label">Nossa história</p>

        <div className="history__top">
          <div className="history__dateline">
            <p className="history__year" aria-hidden="true">
              2014
            </p>
            <p className="history__year-caption">
              <span className="visually-hidden">2014. </span>
              Ano de fundação, em Curitiba
            </p>
          </div>

          <div className="history__intro">
            <h2 id="history-title" className="section-title">
              Uma clínica criada para acolher.
            </h2>
            <p className="lead history__lead">
              A Paraná Implantes abriu as portas em 2014, idealizada pelos irmãos Dra. Bruna Lorena Barbaresco e Dr. Adan
              Rodrigo Barbaresco.
            </p>
          </div>
        </div>

        <ol className="history__chapters" role="list">
          {CHAPTERS.map((chapter) => (
            <li key={chapter.title} className="history__chapter">
              <h3 className="history__chapter-title">{chapter.title}</h3>
              <p>{chapter.text}</p>
            </li>
          ))}
        </ol>

        <div className="history__founders">
          <ul className="history__people" role="list">
            {DOCTORS.map((doctor) => (
              <li key={doctor.id} className="history__person">
                <img
                  src={asset(doctor.portrait)}
                  alt=""
                  width={112}
                  height={112}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: doctor.portraitFocus }}
                />
                <span>
                  <span className="history__person-name">{doctor.name}</span>
                  <span className="history__person-role">{doctor.founderRole}</span>
                </span>
              </li>
            ))}
          </ul>
          <a href="#profissionais" className="text-link">
            Conheça os profissionais
            <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
