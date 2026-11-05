import { useCallback, useEffect, useId, useRef, useState, type FocusEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, CircleHelp, Copy, ExternalLink, MessageCircle } from 'lucide-react';
import { asset } from '../lib/asset';
import { Dialog } from '../components/Dialog';
import { BOOKING_OPTIONS, treatmentTitle, type BookingTreatmentId } from '../data/treatments';
import {
  EMPTY_BOOKING,
  PERIOD_LABEL,
  STEPS,
  buildMessage,
  buildWhatsAppUrl,
  formatDateBR,
  formatPhone,
  hasAnyData,
  isSunday,
  todayISO,
  validateStep,
  type BookingData,
  type Period,
  type StepErrors,
} from '../lib/booking';
import { useBooking } from './BookingContext';
import './BookingDialog.css';

type View = 'form' | 'confirm-discard' | 'opened';

export function BookingDialog() {
  const { isOpen, closeBooking, preset, session, returnFocusTo } = useBooking();
  const [dirty, setDirty] = useState(false);
  const [view, setView] = useState<View>('form');

  // Cada abertura começa um fluxo novo (dados não persistem entre aberturas).
  const [seenSession, setSeenSession] = useState(session);
  if (seenSession !== session) {
    setSeenSession(session);
    setView('form');
    setDirty(false);
  }

  const requestClose = () => {
    if (view === 'confirm-discard') {
      setView('form');
      return;
    }
    if (view === 'form' && dirty) {
      setView('confirm-discard');
      return;
    }
    closeBooking();
  };

  return (
    <Dialog
      open={isOpen}
      onRequestClose={requestClose}
      labelledBy="booking-title"
      returnFocus={returnFocusTo}
      className="booking-dialog"
      closeLabel="Fechar agendamento"
    >
      <BookingFlow
        key={session}
        preset={preset}
        view={view}
        setView={setView}
        onDirtyChange={setDirty}
        onClose={closeBooking}
      />
    </Dialog>
  );
}

interface FlowProps {
  preset: BookingTreatmentId | null;
  view: View;
  setView: (view: View) => void;
  onDirtyChange: (dirty: boolean) => void;
  onClose: () => void;
}

function BookingFlow({ preset, view, setView, onDirtyChange, onClose }: FlowProps) {
  const reduced = useReducedMotion();
  const uid = useId();
  const [data, setData] = useState<BookingData>({ ...EMPTY_BOOKING, treatment: preset });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<StepErrors>({});
  const [direction, setDirection] = useState(1);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const pendingFocus = useRef(false);
  const prevView = useRef(view);

  // O título da etapa recebe o foco quando a nova etapa termina de montar
  // (a transição mantém a etapa anterior na tela por alguns milissegundos).
  const headingCallback = useCallback((el: HTMLHeadingElement | null) => {
    headingRef.current = el;
    if (el && pendingFocus.current) {
      pendingFocus.current = false;
      el.focus({ preventScroll: true });
    }
  }, []);

  const current = STEPS[step];
  const message = buildMessage(data);
  const url = buildWhatsAppUrl(message);

  // Ao trocar de etapa ou de tela, o foco vai para o título correspondente.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    bodyRef.current?.scrollTo({ top: 0 });
    if (prevView.current !== view) {
      // Troca de tela: o novo título já está montado.
      prevView.current = view;
      headingRef.current?.focus({ preventScroll: true });
    } else {
      // Troca de etapa: espera a nova etapa montar (ver headingCallback).
      pendingFocus.current = true;
    }
  }, [step, view]);

  // Atualiza os dados e informa na hora se há algo preenchido (para confirmar o descarte).
  const patch = (changes: Partial<BookingData>) => {
    const nextData = { ...data, ...changes };
    setData(nextData);
    onDirtyChange(hasAnyData(nextData));
    setErrors((prev) => {
      const keys = Object.keys(changes).filter((key) => key in prev);
      if (keys.length === 0) return prev;
      const next = { ...prev };
      for (const key of keys) delete next[key as keyof StepErrors];
      return next;
    });
  };
  const update = <K extends keyof BookingData>(key: K, value: BookingData[K]) =>
    patch({ [key]: value } as Partial<BookingData>);

  const focusFirstError = (found: StepErrors) => {
    const order: (keyof StepErrors)[] = ['treatment', 'name', 'phone', 'date', 'period', 'consent'];
    const first = order.find((key) => found[key]);
    if (!first) return;
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>(`[data-field="${first}"]`);
      el?.focus();
    });
  };

  const goTo = (index: number) => {
    setDirection(index > step ? 1 : -1);
    setErrors({});
    setStep(index);
  };

  const next = () => {
    const found = validateStep(current.id, data);
    if (Object.keys(found).length) {
      setErrors(found);
      focusFirstError(found);
      return;
    }
    goTo(step + 1);
  };

  const openWhatsApp = () => {
    const found = validateStep('revisao', data);
    if (Object.keys(found).length) {
      setErrors(found);
      const stepWithError = found.treatment ? 0 : found.name || found.phone ? 1 : found.date || found.period ? 2 : 3;
      if (stepWithError !== 3) goTo(stepWithError);
      focusFirstError(found);
      return;
    }
    const win = window.open(url, '_blank');
    if (win) {
      win.opener = null;
      setPopupBlocked(false);
    } else {
      setPopupBlocked(true);
    }
    setView('opened');
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied('ok');
    } catch {
      setCopied('fail');
    }
  };

  const slide = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.12 } }
    : {
        initial: { opacity: 0, x: 16 * direction },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -16 * direction },
        transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const },
      };

  const errorId = (field: keyof StepErrors) => `${uid}-${field}-error`;
  const fieldError = (field: keyof StepErrors) =>
    errors[field] ? (
      <p id={errorId(field)} className="booking__error">
        {errors[field]}
      </p>
    ) : null;

  const errorCount = Object.keys(errors).length;

  // Resumo de cada etapa no stepper lateral (desktop).
  const stepValue = (id: (typeof STEPS)[number]['id']) => {
    if (id === 'tratamento') return data.treatment ? treatmentTitle(data.treatment) : '';
    if (id === 'contato') return data.name.trim();
    if (id === 'preferencia') {
      const date = data.flexibleDate ? 'Data a combinar' : data.date ? formatDateBR(data.date) : '';
      const period = data.period ? PERIOD_LABEL[data.period] : '';
      return [date, period].filter(Boolean).join(', ');
    }
    return '';
  };

  // No mobile, o campo focado sobe para o centro (o teclado virtual não o esconde).
  const keepFieldVisible = (event: FocusEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !['text', 'tel', 'date'].includes(target.type)) return;
    if (!window.matchMedia('(max-width: 640px)').matches) return;
    window.setTimeout(() => target.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' }), 280);
  };

  const badge = <span className="booking__badge">Demonstração — solicitação via WhatsApp</span>;

  // ---------- telas fora do formulário ----------
  if (view === 'confirm-discard') {
    return (
      <div className="booking booking--message">
        <header className="booking__aside booking__aside--compact">
          {badge}
          <h2 id="booking-title" className="booking__title" tabIndex={-1} ref={headingCallback}>
            Descartar o pedido?
          </h2>
        </header>
        <div className="booking__main">
          <div className="booking__body">
            <p className="booking__text">
              Os dados que você preencheu serão apagados. Se quiser, volte e termine o pedido antes de fechar.
            </p>
          </div>
          <footer className="booking__foot">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Descartar e fechar
            </button>
            <button type="button" className="btn btn--primary" onClick={() => setView('form')}>
              Continuar preenchendo
            </button>
          </footer>
        </div>
      </div>
    );
  }

  if (view === 'opened') {
    return (
      <div className="booking booking--message">
        <header className="booking__aside booking__aside--compact">
          {badge}
          <h2 id="booking-title" className="booking__title" tabIndex={-1} ref={headingCallback}>
            {popupBlocked ? 'Falta só abrir o WhatsApp' : 'Sua mensagem está pronta no WhatsApp'}
          </h2>
        </header>
        <div className="booking__main">
          <div className="booking__body">
            <div className="booking__status" role="status">
              {popupBlocked ? (
                <p className="booking__text">
                  O navegador não deixou abrir uma nova aba. Use o botão abaixo para abrir o WhatsApp com a mensagem, ou
                  copie o texto e envie você mesmo.
                </p>
              ) : (
                <p className="booking__text">
                  Abrimos o WhatsApp com o seu pedido preenchido. Para a clínica receber, é só tocar em enviar por lá. O
                  pedido ainda não é um agendamento: a equipe responde para confirmar data e horário.
                </p>
              )}
            </div>
            <pre className="booking__preview" aria-label="Mensagem preparada">
              {message}
            </pre>
            <p className="booking__copy-status" aria-live="polite">
              {copied === 'ok' && 'Mensagem copiada.'}
              {copied === 'fail' && 'Não foi possível copiar automaticamente. Selecione o texto acima e copie.'}
            </p>
          </div>
          <footer className="booking__foot booking__foot--wrap">
            <button type="button" className="btn btn--ghost" onClick={copyMessage}>
              {copied === 'ok' ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
              Copiar mensagem
            </button>
            <a className="btn btn--ghost" href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={18} aria-hidden="true" />
              Abrir novamente
              <span className="visually-hidden">(WhatsApp em nova aba)</span>
            </a>
            <button type="button" className="btn btn--primary" onClick={onClose}>
              Fechar
            </button>
          </footer>
        </div>
      </div>
    );
  }

  // ---------- formulário em etapas ----------
  return (
    <div className="booking">
      <header className="booking__aside">
        {badge}
        <h2 id="booking-title" className="booking__title">
          Solicitar avaliação
        </h2>
        <p className="booking__intro">
          Monte o pedido em quatro etapas. Nada fica reservado: a clínica responde pelo WhatsApp para combinar o horário.
        </p>

        <ol className="booking__progress" aria-label="Etapas do pedido">
          {STEPS.map((s, index) => {
            const state = index < step ? 'done' : index === step ? 'current' : 'todo';
            const value = state === 'done' ? stepValue(s.id) : '';
            const content = (
              <>
                <span className="booking__progress-marker" aria-hidden="true">
                  {state === 'done' ? <Check size={14} strokeWidth={2.2} /> : index + 1}
                </span>
                <span className="booking__progress-text">
                  <span className="booking__progress-label">
                    <span className="visually-hidden">
                      Etapa {index + 1} de {STEPS.length}:{' '}
                    </span>
                    {s.label}
                    {state === 'done' && <span className="visually-hidden"> (concluída)</span>}
                  </span>
                  {value && <span className="booking__progress-value">{value}</span>}
                </span>
              </>
            );
            return (
              <li
                key={s.id}
                className="booking__progress-item"
                data-state={state}
                aria-current={index === step ? 'step' : undefined}
              >
                {state === 'done' ? (
                  <button
                    type="button"
                    className="booking__progress-hit"
                    onClick={() => goTo(index)}
                    aria-label={`Voltar para a etapa ${index + 1}: ${s.label}`}
                  >
                    {content}
                  </button>
                ) : (
                  <span className="booking__progress-hit">{content}</span>
                )}
              </li>
            );
          })}
        </ol>

        <p className="booking__aside-note">É um pedido de contato, não um horário reservado.</p>
      </header>

      <form
        className="booking__main"
        noValidate
        aria-labelledby="booking-title"
        onSubmit={(event) => {
          event.preventDefault();
          if (current.id === 'revisao') openWhatsApp();
          else next();
        }}
      >
        <div className="booking__body" ref={bodyRef} onFocus={keepFieldVisible}>
          <p className="visually-hidden" aria-live="polite">
            {errorCount > 0 ? `Há ${errorCount} ${errorCount === 1 ? 'campo para corrigir' : 'campos para corrigir'}.` : ''}
          </p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={current.id} className="booking__step" {...slide}>
              {current.id === 'tratamento' && (
                <fieldset className="booking__fieldset" aria-describedby={errors.treatment ? errorId('treatment') : undefined}>
                  <legend className="booking__legend">
                    <h3 ref={headingCallback} tabIndex={-1} className="booking__step-title">
                      Qual tratamento você procura?
                    </h3>
                  </legend>
                  <p className="booking__hint">Se ainda não sabe, escolha “Outro / Não sei”. A avaliação serve para isso.</p>
                  <div className="booking__options">
                    {BOOKING_OPTIONS.map((option, index) => (
                      <label key={option.id} className="booking__option">
                        <input
                          type="radio"
                          name={`${uid}-treatment`}
                          value={option.id}
                          checked={data.treatment === option.id}
                          onChange={() => update('treatment', option.id)}
                          data-field={
                            (data.treatment ? data.treatment === option.id : index === 0) ? 'treatment' : undefined
                          }
                        />
                        <span className="booking__option-box">
                          {option.image ? (
                            <img
                              className="booking__option-thumb"
                              src={asset(option.image)}
                              alt=""
                              width={546}
                              height={197}
                              loading="lazy"
                              decoding="async"
                              style={{ objectPosition: option.focus }}
                            />
                          ) : (
                            <span className="booking__option-thumb booking__option-thumb--neutral" aria-hidden="true">
                              <CircleHelp size={22} strokeWidth={1.5} />
                            </span>
                          )}
                          <span className="booking__option-title">{option.title}</span>
                          <span className="booking__option-check" aria-hidden="true">
                            <Check size={13} strokeWidth={2.4} />
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                  {fieldError('treatment')}
                </fieldset>
              )}

              {current.id === 'contato' && (
                <div className="booking__fields">
                  <h3 ref={headingCallback} tabIndex={-1} className="booking__step-title">
                    Como a clínica fala com você?
                  </h3>
                  <div className="booking__field">
                    <label htmlFor={`${uid}-name`}>Nome</label>
                    <input
                      id={`${uid}-name`}
                      data-field="name"
                      type="text"
                      autoComplete="name"
                      autoCapitalize="words"
                      enterKeyHint="next"
                      maxLength={80}
                      value={data.name}
                      onChange={(e) => update('name', e.target.value)}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? errorId('name') : undefined}
                      placeholder="Como você gostaria de ser chamado"
                    />
                    {fieldError('name')}
                  </div>
                  <div className="booking__field">
                    <label htmlFor={`${uid}-phone`}>WhatsApp com DDD</label>
                    <input
                      id={`${uid}-phone`}
                      data-field="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      enterKeyHint="next"
                      value={data.phone}
                      onChange={(e) => update('phone', formatPhone(e.target.value))}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={`${uid}-phone-hint${errors.phone ? ` ${errorId('phone')}` : ''}`}
                      placeholder="(41) 99999-9999"
                    />
                    <p id={`${uid}-phone-hint`} className="booking__hint">
                      Pode colar o número como estiver: a formatação é automática.
                    </p>
                    {fieldError('phone')}
                  </div>
                  <p className="booking__privacy">
                    Seu nome e telefone servem só para montar a mensagem. Nada é salvo neste site nem enviado sem você tocar
                    em enviar no WhatsApp.
                  </p>
                </div>
              )}

              {current.id === 'preferencia' && (
                <div className="booking__fields">
                  <h3 ref={headingCallback} tabIndex={-1} className="booking__step-title">
                    Quando você prefere ser atendido?
                  </h3>
                  <div className="booking__field">
                    <label htmlFor={`${uid}-date`}>Data de preferência</label>
                    <input
                      id={`${uid}-date`}
                      data-field="date"
                      type="date"
                      min={todayISO()}
                      value={data.date}
                      disabled={data.flexibleDate}
                      onChange={(e) => update('date', e.target.value)}
                      aria-invalid={Boolean(errors.date)}
                      aria-describedby={`${uid}-date-hint${errors.date ? ` ${errorId('date')}` : ''}`}
                    />
                    <p id={`${uid}-date-hint`} className="booking__hint">
                      {data.date && !data.flexibleDate && isSunday(data.date)
                        ? 'Você escolheu um domingo. A clínica confirma pela conversa se há atendimento nesse dia ou sugere outra data.'
                        : 'É só uma preferência. A disponibilidade é confirmada pela clínica na conversa.'}
                    </p>
                    {fieldError('date')}
                    <label className="booking__check">
                      <input
                        type="checkbox"
                        checked={data.flexibleDate}
                        onChange={(e) =>
                          patch({ flexibleDate: e.target.checked, date: e.target.checked ? '' : data.date })
                        }
                      />
                      <span>Prefiro combinar a data</span>
                    </label>
                  </div>

                  <fieldset className="booking__fieldset" aria-describedby={errors.period ? errorId('period') : undefined}>
                    <legend className="booking__label">Período</legend>
                    <div className="booking__segmented">
                      {(Object.keys(PERIOD_LABEL) as Period[]).map((period, index) => (
                        <label key={period} className="booking__segment">
                          <input
                            type="radio"
                            name={`${uid}-period`}
                            value={period}
                            checked={data.period === period}
                            onChange={() => update('period', period)}
                            data-field={(data.period ? data.period === period : index === 0) ? 'period' : undefined}
                          />
                          <span>{PERIOD_LABEL[period]}</span>
                        </label>
                      ))}
                    </div>
                    {fieldError('period')}
                  </fieldset>
                </div>
              )}

              {current.id === 'revisao' && (
                <div className="booking__fields">
                  <h3 ref={headingCallback} tabIndex={-1} className="booking__step-title">
                    Confira antes de enviar
                  </h3>
                  <dl className="booking__summary">
                    <SummaryRow
                      term="Tratamento"
                      value={data.treatment ? treatmentTitle(data.treatment) : '—'}
                      onEdit={() => goTo(0)}
                    />
                    <SummaryRow term="Nome" value={data.name.trim()} onEdit={() => goTo(1)} />
                    <SummaryRow term="WhatsApp" value={formatPhone(data.phone)} onEdit={() => goTo(1)} />
                    <SummaryRow
                      term="Data"
                      value={data.flexibleDate || !data.date ? 'A combinar' : formatDateBR(data.date)}
                      onEdit={() => goTo(2)}
                    />
                    <SummaryRow
                      term="Período"
                      value={data.period ? PERIOD_LABEL[data.period] : '—'}
                      onEdit={() => goTo(2)}
                    />
                  </dl>

                  <details className="booking__details">
                    <summary>Ver a mensagem que será preparada</summary>
                    <pre className="booking__preview">{message}</pre>
                  </details>

                  <label className="booking__check booking__consent">
                    <input
                      type="checkbox"
                      data-field="consent"
                      checked={data.consent}
                      onChange={(e) => update('consent', e.target.checked)}
                      aria-invalid={Boolean(errors.consent)}
                      aria-describedby={errors.consent ? errorId('consent') : undefined}
                    />
                    <span>
                      Concordo em abrir o WhatsApp com estes dados para enviar o pedido à Paraná Implantes. Sei que é um
                      pedido de contato, não um horário reservado.
                    </span>
                  </label>
                  {fieldError('consent')}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="booking__foot">
          {step > 0 ? (
            <button type="button" className="btn btn--ghost" onClick={() => goTo(step - 1)}>
              <ArrowLeft size={18} strokeWidth={1.8} aria-hidden="true" />
              Voltar
            </button>
          ) : (
            <span className="booking__step-count">
              Etapa {step + 1} de {STEPS.length}
            </span>
          )}
          {current.id === 'revisao' ? (
            <button type="submit" className="btn btn--primary booking__submit">
              <MessageCircle size={18} strokeWidth={1.8} aria-hidden="true" />
              Abrir WhatsApp para solicitar
            </button>
          ) : (
            <button type="submit" className="btn btn--primary booking__submit">
              Continuar
              <ArrowRight className="btn__arrow" size={18} strokeWidth={1.8} aria-hidden="true" />
            </button>
          )}
        </footer>
      </form>
    </div>
  );
}

function SummaryRow({ term, value, onEdit }: { term: string; value: string; onEdit: () => void }) {
  return (
    <div className="booking__summary-row">
      <dt>{term}</dt>
      <dd>{value}</dd>
      <dd className="booking__summary-edit">
        <button type="button" className="booking__edit" onClick={onEdit} aria-label={`Editar ${term.toLowerCase()}`}>
          Editar
        </button>
      </dd>
    </div>
  );
}
