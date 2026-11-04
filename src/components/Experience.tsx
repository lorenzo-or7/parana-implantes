import { asset } from '../lib/asset';
import './Experience.css';

const STRUCTURE = [
  'Entrada, banheiro, assentos e estacionamento com acessibilidade',
  'Estacionamento gratuito no local',
  'Banheiro de gênero neutro',
  'Espaço acolhedor para a comunidade LGBTQ+ e para pessoas trans',
  'Atendimento com agendamento',
  'Pagamento no crédito, no débito ou por aproximação (NFC)',
];

export function Experience() {
  return (
    <section id="experiencia" className="experience section" aria-labelledby="experience-title">
      <div className="container experience__grid">
        <div className="experience__copy">
          <h2 id="experience-title" className="section-title">
            Um espaço pensado para receber bem.
          </h2>
          <div className="experience__text">
            <p className="lead">
              Luz quente, madeira e lugares confortáveis para esperar. A clínica foi pensada para que a consulta comece
              tranquila, do estacionamento à cadeira do consultório.
            </p>
            <ul className="experience__list" role="list">
              {STRUCTURE.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <figure className="experience__main">
          <img
            src={asset('assets/clinica/recepcao_ambiente_02.webp')}
            alt="Balcão de recepção em madeira com o letreiro Paraná Implantes na parede e uma poltrona em primeiro plano"
            width={1024}
            height={1017}
            loading="lazy"
            decoding="async"
          />
          <figcaption>Recepção</figcaption>
        </figure>

        <figure className="experience__side">
          <img
            src={asset('assets/clinica/consultorio_03.webp')}
            alt="Consultório com cadeira odontológica em couro caramelo, refletor e armários de madeira"
            width={851}
            height={1024}
            loading="lazy"
            decoding="async"
          />
          <figcaption>Consultório</figcaption>
        </figure>
      </div>
    </section>
  );
}
