import { asset } from '../lib/asset';
import './History.css';

export function History() {
  return (
    <section id="historia" className="history section" aria-labelledby="history-title">
      <div className="container history__grid">
        <div className="history__mark">
          <p className="history__year" aria-hidden="true">
            2014
          </p>
          <div className="history__seal">
            <img
              src={asset('assets/marca/logo_secundaria_dente_dourado.png')}
              alt="Marca institucional Paraná Implantes, com o símbolo de um dente e implante em dourado"
              width={1024}
              height={572}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div className="history__copy">
          <h2 id="history-title" className="section-title">
            Uma clínica criada para acolher.
          </h2>
          <p className="lead">
            A Paraná Implantes abriu as portas em 2014, idealizada pelos irmãos Dra. Bruna Lorena Barbaresco e Dr. Adan
            Rodrigo Barbaresco.
          </p>
          <p className="history__text">
            A ideia era simples: um lugar onde o paciente fosse ouvido antes de qualquer decisão. Por isso o atendimento
            começa com conversa, com tempo para explicar cada etapa e para tirar dúvidas, sem pressa.
          </p>
          <p className="history__text">
            Desde então, a proposta segue a mesma: atendimento humanizado, escuta e acolhimento, da recepção ao fim do
            tratamento.
          </p>
          <a href="#profissionais" className="text-link">
            Conheça quem fundou a clínica
          </a>
        </div>
      </div>
    </section>
  );
}
