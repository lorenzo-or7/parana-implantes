import './Intro.css';

const FACTS = [
  { term: 'Desde 2014', detail: 'Fundada pelos irmãos Bruna e Adan Barbaresco' },
  { term: 'Novo Mundo, Curitiba', detail: 'Av. Brasília, 5030' },
  { term: 'Estacionamento gratuito', detail: 'No próprio local, com vaga acessível' },
  { term: 'Atendimento com hora marcada', detail: 'Para você ser recebido sem pressa' },
];

export function Intro() {
  return (
    <section id="sobre" className="intro section" aria-labelledby="intro-title">
      <div className="container intro__grid">
        <h2 id="intro-title" className="intro__title">
          Cuidado que começa na escuta.
        </h2>
        <div className="intro__body">
          <p className="intro__statement">
            Antes de qualquer tratamento, a gente quer entender o que trouxe você até aqui. A Paraná Implantes nasceu para
            unir boa odontologia a um atendimento sem pressa, em um espaço onde dá vontade de ficar.
          </p>
          <dl className="intro__facts">
            {FACTS.map((fact) => (
              <div key={fact.term} className="intro__fact">
                <dt>{fact.term}</dt>
                <dd>{fact.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
