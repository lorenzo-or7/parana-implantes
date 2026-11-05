import { ArrowRight } from 'lucide-react';
import './Intro.css';

/** Pilares da clínica: só fatos do briefing (fundação, atendimento, endereço, estrutura). */
const PILLARS = [
  { term: 'Desde 2014', detail: 'Fundada pelos irmãos Bruna e Adan Barbaresco, dentistas da clínica.' },
  { term: 'Escuta primeiro', detail: 'A consulta começa pela conversa. O plano vem depois, explicado etapa por etapa.' },
  { term: 'Novo Mundo, Curitiba', detail: 'Av. Brasília, 5030, com estacionamento gratuito no local.' },
  { term: 'Estrutura acolhedora', detail: 'Acessibilidade, banheiro de gênero neutro e atendimento com hora marcada.' },
];

export function Intro() {
  return (
    <section id="sobre" className="intro section" aria-labelledby="intro-title">
      <div className="container">
        <div className="intro__panel">
          <div className="intro__head">
            <p className="label">Sobre a clínica</p>
            <h2 id="intro-title" className="intro__title">
              Cuidado que começa na escuta.
            </h2>
          </div>

          <div className="intro__story">
            <p className="intro__lead">
              Antes de qualquer tratamento, a gente quer entender o que trouxe você até aqui.
            </p>
            <p className="intro__text">
              A Paraná Implantes nasceu para unir boa odontologia a um atendimento sem pressa, em um espaço onde dá vontade
              de ficar. Você tira as dúvidas, entende as opções e decide com calma.
            </p>
            <a href="#historia" className="text-link">
              Conheça a nossa história
              <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
            </a>
          </div>

          <ul className="intro__pillars" role="list">
            {PILLARS.map((pillar) => (
              <li key={pillar.term} className="intro__pillar">
                <h3 className="intro__pillar-term">{pillar.term}</h3>
                <p className="intro__pillar-detail">{pillar.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
