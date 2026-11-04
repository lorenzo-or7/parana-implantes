import { useBooking } from '../booking/BookingContext';
import './BookingCta.css';

const STEPS = [
  { title: 'Escolha o tratamento', text: 'Ou marque “Não sei” se ainda tem dúvida.' },
  { title: 'Deixe nome e WhatsApp', text: 'Só o necessário para a clínica responder.' },
  { title: 'Diga sua preferência', text: 'Data e período que funcionam melhor para você.' },
  { title: 'Revise e envie', text: 'A mensagem abre no seu WhatsApp, pronta para enviar.' },
];

export function BookingCta() {
  const { openBooking } = useBooking();
  return (
    <section id="agendamento" className="booking-cta section" aria-labelledby="booking-cta-title">
      <div className="container">
        <div className="booking-cta__panel">
          <div className="booking-cta__copy">
            <h2 id="booking-cta-title" className="section-title">
              Conte com a gente para começar.
            </h2>
            <p className="booking-cta__lead">
              Em quatro passos você monta um pedido de avaliação e envia pelo WhatsApp. A equipe responde para combinar o
              horário com você.
            </p>
            <button type="button" className="btn booking-cta__btn" onClick={() => openBooking()}>
              Agendar avaliação
            </button>
          </div>
          <ol className="booking-cta__steps">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <span className="booking-cta__num" aria-hidden="true">
                  {index + 1}
                </span>
                <span>
                  <strong className="booking-cta__step-title">{step.title}</strong>
                  <span className="booking-cta__step-text">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
