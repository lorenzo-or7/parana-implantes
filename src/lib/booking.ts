import { treatmentTitle, type BookingTreatmentId } from '../data/treatments';
import { WHATSAPP_NUMBER } from '../data/site';

export type Period = 'manha' | 'tarde' | 'qualquer';

export const PERIOD_LABEL: Record<Period, string> = {
  manha: 'Manhã',
  tarde: 'Tarde',
  qualquer: 'Qualquer período',
};

export interface BookingData {
  treatment: BookingTreatmentId | null;
  name: string;
  phone: string;
  /** yyyy-mm-dd ou vazio */
  date: string;
  flexibleDate: boolean;
  period: Period | null;
  consent: boolean;
}

export const EMPTY_BOOKING: BookingData = {
  treatment: null,
  name: '',
  phone: '',
  date: '',
  flexibleDate: false,
  period: null,
  consent: false,
};

export const onlyDigits = (value: string) => value.replace(/\D/g, '');

/** Remove o código do país quando colado (+55) e limita a 11 dígitos. */
export function normalizePhone(value: string): string {
  let digits = onlyDigits(value);
  if (digits.length > 11 && digits.startsWith('55')) digits = digits.slice(2);
  if (digits.length > 11 && digits.startsWith('0')) digits = digits.replace(/^0+/, '');
  return digits.slice(0, 11);
}

/** Máscara progressiva: (41) 99216-6406 ou (41) 3538-5558. Aceita colagem. */
export function formatPhone(value: string): string {
  const d = normalizePhone(value);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  const ddd = d.slice(0, 2);
  const rest = d.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  if (d.length <= 10) return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
}

export function validateName(name: string): string | null {
  const trimmed = name.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) return 'Informe seu nome para a clínica saber com quem falar.';
  if (trimmed.length < 2 || !/\p{L}{2,}/u.test(trimmed)) return 'Digite seu nome com pelo menos duas letras.';
  if (trimmed.length > 80) return 'Use até 80 caracteres no nome.';
  return null;
}

export function validatePhone(phone: string): string | null {
  const d = normalizePhone(phone);
  if (d.length === 0) return 'Informe seu telefone com DDD.';
  if (d.length < 10) return 'Informe seu telefone com DDD, por exemplo (41) 99999-9999.';
  const ddd = Number(d.slice(0, 2));
  if (ddd < 11 || d[0] === '0' || d[1] === '0') return 'Confira o DDD: ele tem dois dígitos, como 41.';
  if (d.length === 11 && d[2] !== '9') return 'Celulares começam com 9 depois do DDD. Confira o número.';
  return null;
}

/** Data local de hoje em yyyy-mm-dd. */
export function todayISO(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function validateDate(date: string, flexible: boolean, now: Date = new Date()): string | null {
  if (flexible) return null;
  if (!date) return 'Escolha uma data de preferência ou marque “Prefiro combinar a data”.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'Use uma data válida.';
  if (date < todayISO(now)) return 'Escolha a data de hoje ou uma data futura.';
  return null;
}

export function formatDateBR(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function isSunday(iso: string): boolean {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).getDay() === 0;
}

export type StepId = 'tratamento' | 'contato' | 'preferencia' | 'revisao';
export const STEPS: readonly { id: StepId; label: string }[] = [
  { id: 'tratamento', label: 'Tratamento' },
  { id: 'contato', label: 'Contato' },
  { id: 'preferencia', label: 'Preferência' },
  { id: 'revisao', label: 'Revisão' },
];

export type StepErrors = Partial<Record<'treatment' | 'name' | 'phone' | 'date' | 'period' | 'consent', string>>;

export function validateStep(step: StepId, data: BookingData, now: Date = new Date()): StepErrors {
  const errors: StepErrors = {};
  if (step === 'tratamento') {
    if (!data.treatment) errors.treatment = 'Escolha um tratamento ou a opção “Outro / Não sei”.';
  }
  if (step === 'contato') {
    const name = validateName(data.name);
    const phone = validatePhone(data.phone);
    if (name) errors.name = name;
    if (phone) errors.phone = phone;
  }
  if (step === 'preferencia') {
    const date = validateDate(data.date, data.flexibleDate, now);
    if (date) errors.date = date;
    if (!data.period) errors.period = 'Escolha o período: manhã, tarde ou qualquer período.';
  }
  if (step === 'revisao') {
    for (const s of ['tratamento', 'contato', 'preferencia'] as const) Object.assign(errors, validateStep(s, data, now));
    if (!data.consent) errors.consent = 'Marque a confirmação para abrir o WhatsApp com os seus dados.';
  }
  return errors;
}

export function hasAnyData(data: BookingData): boolean {
  return Boolean(data.name.trim() || onlyDigits(data.phone) || data.date || data.period || data.flexibleDate);
}

export function buildMessage(data: BookingData): string {
  const name = data.name.trim().replace(/\s+/g, ' ');
  const date = data.flexibleDate || !data.date ? 'A combinar' : formatDateBR(data.date);
  const period = data.period ? PERIOD_LABEL[data.period] : 'Qualquer período';
  const treatment = data.treatment ? treatmentTitle(data.treatment) : 'Outro / Não sei';
  return [
    'Olá! Gostaria de solicitar uma avaliação na Paraná Implantes.',
    '',
    `Nome: ${name}`,
    `WhatsApp: ${formatPhone(data.phone)}`,
    `Tratamento de interesse: ${treatment}`,
    `Data de preferência: ${date}`,
    `Período: ${period}`,
    '',
    'Entendo que este é um pedido de contato e aguardo confirmação da clínica.',
  ].join('\n');
}

export function buildWhatsAppUrl(message: string, number: string = WHATSAPP_NUMBER): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
