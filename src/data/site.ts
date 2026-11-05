// Dados institucionais recebidos no briefing. Itens marcados como "validar" estão
// listados no relatório como pendências antes de uso comercial.

/** WhatsApp da clínica (fonte: Instagram). Validar número final antes da publicação. */
export const WHATSAPP_NUMBER = '5541992166406';
export const WHATSAPP_DISPLAY = '(41) 99216-6406';

/** Telefone fixo listado no perfil do Google (validar). */
export const PHONE_DISPLAY = '(41) 3538-5558';
export const PHONE_TEL = '+554135385558';

export const ADDRESS = {
  name: 'Clínica Paraná Implantes',
  street: 'Av. Brasília, 5030',
  district: 'Novo Mundo',
  city: 'Curitiba',
  state: 'PR',
  zip: '81020-010',
};

export const ADDRESS_ONE_LINE = `${ADDRESS.street} — ${ADDRESS.district}, ${ADDRESS.city} — ${ADDRESS.state}, ${ADDRESS.zip}`;

export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${ADDRESS.name}, ${ADDRESS.street}, ${ADDRESS.district}, ${ADDRESS.city} - ${ADDRESS.state}, ${ADDRESS.zip}`,
)}`;

/**
 * Mapa incorporado sem chave de API (modo embed público do Google Maps), pela busca do
 * endereço oficial: nenhuma coordenada foi inventada. Se o iframe for bloqueado,
 * o link MAPS_URL continua disponível ao lado.
 */
export const MAPS_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(
  `${ADDRESS.street} - ${ADDRESS.district}, ${ADDRESS.city} - ${ADDRESS.state}, ${ADDRESS.zip}`,
)}&z=16&hl=pt-BR&output=embed`;

export const INSTAGRAM_URL = 'https://www.instagram.com/clinicaparanaimplantes/';

export const SECTIONS = [
  { id: 'inicio', label: 'Início' },
  { id: 'tratamentos', label: 'Tratamentos' },
  { id: 'historia', label: 'Nossa História' },
  { id: 'profissionais', label: 'Profissionais' },
  { id: 'avaliacoes', label: 'Avaliações' },
  { id: 'contato', label: 'Contato' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];

export interface Doctor {
  id: 'bruna' | 'adan';
  name: string;
  shortName: string;
  title: string;
  founderRole: string;
  credentials: string[];
  portrait: string;
  portraitFocus: string;
  procedure: string;
  procedureAlt: string;
  instagramHandle: string;
  instagramUrl: string;
}

export const DOCTORS: readonly Doctor[] = [
  {
    id: 'bruna',
    name: 'Dra. Bruna Lorena Barbaresco',
    shortName: 'Dra. Bruna',
    title: 'Implantes dentários',
    founderRole: 'Cofundadora',
    credentials: ['Mestre em Odontologia Clínica', 'Especialista em Implantes Dentários'],
    portrait: 'assets/doutores/bruna_retrato.webp',
    portraitFocus: '45% 50%',
    procedure: 'assets/doutores/bruna_procedimento.webp',
    procedureAlt: 'Dra. Bruna Barbaresco paramentada durante um atendimento clínico',
    instagramHandle: 'brubarbaresco',
    instagramUrl: 'https://www.instagram.com/brubarbaresco/',
  },
  {
    id: 'adan',
    name: 'Dr. Adan Rodrigo Barbaresco',
    shortName: 'Dr. Adan',
    title: 'Implantes e prótese dentária',
    founderRole: 'Cofundador',
    credentials: ['Especialista em Implantes Dentários', 'Especialista em Prótese Dentária'],
    portrait: 'assets/doutores/adan_retrato.webp',
    portraitFocus: '49% 50%',
    procedure: 'assets/doutores/adan_procedimento.webp',
    procedureAlt: 'Dr. Adan Barbaresco paramentado durante um atendimento clínico',
    instagramHandle: 'dr_adanbarbaresco',
    instagramUrl: 'https://www.instagram.com/dr_adanbarbaresco/',
  },
];

export interface Review {
  author: string;
  /** ISO yyyy-mm-dd */
  date: string;
  text: string;
}

/** Depoimentos copiados do material (Google). Texto preservado sem edição. */
export const REVIEWS: readonly Review[] = [
  {
    author: 'Sandra Rosario da Silva',
    date: '2025-04-15',
    text: 'Excelente atendimento e profissionais muito competentes. Recomendo sem dúvida alguma.',
  },
  {
    author: 'Nathan Camargo Pape',
    date: '2024-01-13',
    text: 'Excelente atendimento, estrutura impecável e profissionais excelentes.',
  },
  { author: 'Mauro Luis Dorneles', date: '2024-03-26', text: 'Profissionais atenciosos. Estacionamento próprio.' },
  { author: 'Emelly Dias', date: '2024-01-13', text: 'Horários acessíveis, amei!' },
  { author: 'Simone Miquelasso', date: '2024-01-24', text: 'Otimo atendimento! Recomendo' },
  { author: 'Ana Bortolaci', date: '2024-01-13', text: 'Até o presente momento Está sendo ótimo' },
];

/** Nota agregada do material de referência (captura). Sujeita a mudança. */
export const RATING = { value: '4,9', count: 138 };
