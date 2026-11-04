import { describe, expect, it } from 'vitest';
import {
  EMPTY_BOOKING,
  buildMessage,
  buildWhatsAppUrl,
  formatDateBR,
  formatPhone,
  hasAnyData,
  normalizePhone,
  validateDate,
  validatePhone,
  validateStep,
  type BookingData,
} from './booking';

const NOW = new Date(2026, 10, 4, 10, 0); // 04/11/2026

const filled: BookingData = {
  treatment: 'implante-dentario',
  name: '  Maria   da Silva ',
  phone: '41999998888',
  date: '2026-11-20',
  flexibleDate: false,
  period: 'manha',
  consent: true,
};

describe('telefone', () => {
  it('formata progressivamente e aceita colagem com +55', () => {
    expect(formatPhone('4')).toBe('(4');
    expect(formatPhone('41999')).toBe('(41) 999');
    expect(formatPhone('4135385558')).toBe('(41) 3538-5558');
    expect(formatPhone('+55 (41) 99216-6406')).toBe('(41) 99216-6406');
    expect(normalizePhone('55 41 99216 6406')).toBe('41992166406');
  });

  it('valida DDD e formato de celular', () => {
    expect(validatePhone('')).toBe('Informe seu telefone com DDD.');
    expect(validatePhone('9999-8888')).toMatch(/DDD/);
    expect(validatePhone('(01) 99999-8888')).toMatch(/DDD/);
    expect(validatePhone('(41) 89999-8888')).toMatch(/Celulares/);
    expect(validatePhone('(41) 99999-8888')).toBeNull();
    expect(validatePhone('(41) 3538-5558')).toBeNull();
  });
});

describe('data de preferência', () => {
  it('não aceita data passada', () => {
    expect(validateDate('2026-11-03', false, NOW)).toMatch(/futura/);
    expect(validateDate('2026-11-04', false, NOW)).toBeNull();
    expect(validateDate('', false, NOW)).toMatch(/combinar/);
    expect(validateDate('', true, NOW)).toBeNull();
  });

  it('formata em DD/MM/AAAA', () => {
    expect(formatDateBR('2026-11-20')).toBe('20/11/2026');
  });
});

describe('etapas', () => {
  it('bloqueia avanço sem dados obrigatórios', () => {
    expect(validateStep('tratamento', EMPTY_BOOKING, NOW).treatment).toBeTruthy();
    const contato = validateStep('contato', EMPTY_BOOKING, NOW);
    expect(contato.name).toBeTruthy();
    expect(contato.phone).toBe('Informe seu telefone com DDD.');
    const pref = validateStep('preferencia', EMPTY_BOOKING, NOW);
    expect(pref.date).toBeTruthy();
    expect(pref.period).toBeTruthy();
  });

  it('exige consentimento na revisão', () => {
    expect(validateStep('revisao', { ...filled, consent: false }, NOW).consent).toBeTruthy();
    expect(validateStep('revisao', filled, NOW)).toEqual({});
  });

  it('detecta dados preenchidos para confirmar o descarte', () => {
    expect(hasAnyData(EMPTY_BOOKING)).toBe(false);
    expect(hasAnyData({ ...EMPTY_BOOKING, treatment: 'alinhadores' })).toBe(false);
    expect(hasAnyData({ ...EMPTY_BOOKING, name: 'Ana' })).toBe(true);
  });
});

describe('mensagem e URL do WhatsApp', () => {
  it('monta a mensagem no formato combinado', () => {
    expect(buildMessage(filled)).toBe(
      [
        'Olá! Gostaria de solicitar uma avaliação na Paraná Implantes.',
        '',
        'Nome: Maria da Silva',
        'WhatsApp: (41) 99999-8888',
        'Tratamento de interesse: Implante dentário',
        'Data de preferência: 20/11/2026',
        'Período: Manhã',
        '',
        'Entendo que este é um pedido de contato e aguardo confirmação da clínica.',
      ].join('\n'),
    );
  });

  it('usa "A combinar" quando a data é flexível', () => {
    const msg = buildMessage({ ...filled, flexibleDate: true, period: 'qualquer', treatment: 'outro' });
    expect(msg).toContain('Data de preferência: A combinar');
    expect(msg).toContain('Período: Qualquer período');
    expect(msg).toContain('Tratamento de interesse: Outro / Não sei');
  });

  it('codifica a mensagem na URL do wa.me', () => {
    const url = buildWhatsAppUrl(buildMessage(filled));
    expect(url.startsWith('https://wa.me/5541992166406?text=')).toBe(true);
    const text = new URL(url).searchParams.get('text');
    expect(text).toBe(buildMessage(filled));
    expect(url).not.toContain(' ');
    expect(url).toContain('%0A');
  });
});
