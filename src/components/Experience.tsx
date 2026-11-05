import { asset } from '../lib/asset';
import './Experience.css';

export function Experience() {
  return (
    <section id="experiencia" className="experience section" aria-labelledby="experience-title">
      <div className="container">
        <header className="section-head">
          <div>
            <p className="label">Ambientes</p>
            <h2 id="experience-title" className="section-title">
              Um espaço pensado para receber bem.
            </h2>
          </div>
          <div className="section-head__aside">
            <p className="lead">
              Luz quente, madeira e lugares confortáveis para esperar. A consulta começa tranquila, do estacionamento à
              cadeira do consultório.
            </p>
          </div>
        </header>

        {/* Architectural Gallery: as duas fotos dividem a mesma altura (recepção mais larga,
            consultório complementar). Ambas aparecem abaixo do tamanho original. */}
        <div className="experience__gallery">
          <figure className="experience__figure experience__figure--main">
            <div className="experience__frame">
              <img
                src={asset('assets/clinica/recepcao_ambiente_02.webp')}
                alt="Balcão de recepção em madeira com o letreiro Paraná Implantes na parede e uma poltrona em primeiro plano"
                width={1024}
                height={1017}
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption>
              <span className="experience__place">Recepção</span>
              <span>Painel de madeira ripada, balcão iluminado e poltronas para esperar sem pressa.</span>
            </figcaption>
          </figure>

          <figure className="experience__figure experience__figure--side">
            <div className="experience__frame">
              <img
                src={asset('assets/clinica/consultorio_03.webp')}
                alt="Consultório com cadeira odontológica em couro caramelo, refletor e armários de madeira"
                width={851}
                height={1024}
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption>
              <span className="experience__place">Consultório</span>
              <span>Cadeira odontológica, refletor e armários em madeira, no mesmo tom da recepção.</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
