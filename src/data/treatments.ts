export type TreatmentId =
  | 'protese-protocolo'
  | 'implante-dentario'
  | 'ortodontia-convencional'
  | 'alinhadores'
  | 'tratamento-de-canal'
  | 'harmonizacao-orofacial'
  | 'lipo-de-papada'
  | 'clinico-geral';

export interface Treatment {
  id: TreatmentId;
  title: string;
  /** Arquivo em public/assets/tratamentos (ordem e foto definidas no briefing). */
  image: string;
  /** Recorte da foto no card (object-position). */
  focus: string;
  alt: string;
  summary: string;
  details: string[];
}

export const TREATMENTS: readonly Treatment[] = [
  {
    id: 'protese-protocolo',
    title: 'Prótese protocolo',
    image: 'assets/tratamentos/01_protese_protocolo.webp',
    focus: '48% 50%',
    alt: 'Mãos segurando uma prótese dentária completa',
    summary: 'Reabilitação com prótese fixa apoiada sobre implantes.',
    details: [
      'É uma opção para quem perdeu vários dentes ou todos os dentes de uma arcada. A prótese fica fixa sobre implantes, sem a necessidade de retirar para limpar como uma dentadura comum.',
      'Se ela faz sentido para você, quem responde é a avaliação individual: exames, condição óssea e o seu histórico entram no planejamento.',
    ],
  },
  {
    id: 'implante-dentario',
    title: 'Implante dentário',
    image: 'assets/tratamentos/02_implante_dentario.webp',
    focus: '60% 40%',
    alt: 'Paciente sorrindo durante uma avaliação odontológica',
    summary: 'Reposição de dentes perdidos com planejamento odontológico.',
    details: [
      'O implante substitui a raiz de um dente perdido e serve de base para uma nova coroa. Pode ser usado para um único dente ou como apoio para próteses maiores.',
      'Cada caso começa com uma avaliação e exames de imagem, para entender se o implante é indicado e qual o melhor caminho.',
    ],
  },
  {
    id: 'ortodontia-convencional',
    title: 'Ortodontia convencional',
    image: 'assets/tratamentos/03_ortodontia_convencional.webp',
    focus: '58% 50%',
    alt: 'Jovem com aparelho ortodôntico fixo durante uma consulta',
    summary: 'Alinhamento dental com aparelhos tradicionais.',
    details: [
      'O aparelho fixo corrige a posição dos dentes e a mordida com ajustes periódicos ao longo do tratamento.',
      'Na primeira consulta, o ortodontista avalia o caso e explica o tempo estimado, os cuidados e a frequência das manutenções.',
    ],
  },
  {
    id: 'alinhadores',
    title: 'Alinhadores',
    image: 'assets/tratamentos/04_alinhadores.webp',
    focus: '45% 50%',
    alt: 'Pessoa encaixando um alinhador transparente nos dentes',
    summary: 'Correção com alinhadores transparentes, mediante indicação.',
    details: [
      'Os alinhadores são placas transparentes trocadas em sequência, que movimentam os dentes aos poucos. São removíveis e discretos no dia a dia.',
      'Nem todo caso é indicado para alinhadores. A avaliação mostra se eles atendem ao que você precisa ou se outro tipo de aparelho é mais adequado.',
    ],
  },
  {
    id: 'tratamento-de-canal',
    title: 'Tratamento de canal',
    image: 'assets/tratamentos/05_tratamento_de_canal.webp',
    focus: '38% 50%',
    alt: 'Modelo anatômico de um dente mostrando a raiz e o canal',
    summary: 'Tratamento endodôntico para preservar o dente, quando indicado.',
    details: [
      'O tratamento de canal limpa e trata a parte interna do dente quando a polpa está inflamada ou infectada, com o objetivo de manter o dente natural.',
      'Se você sente dor ou sensibilidade, procure uma avaliação. Só o exame clínico e radiográfico confirma a indicação.',
    ],
  },
  {
    id: 'harmonizacao-orofacial',
    title: 'Harmonização orofacial',
    image: 'assets/tratamentos/06_harmonizacao_orofacial.webp',
    focus: '50% 35%',
    alt: 'Mulher com as mãos apoiadas no contorno do rosto',
    summary: 'Avaliação de procedimentos estéticos faciais adequados ao caso.',
    details: [
      'A harmonização reúne procedimentos estéticos da face. O que pode ser feito depende da sua anatomia, das suas expectativas e de uma conversa franca sobre limites.',
      'A consulta é o momento de tirar dúvidas e entender as opções com calma, sem compromisso de realizar nenhum procedimento.',
    ],
  },
  {
    id: 'lipo-de-papada',
    title: 'Lipo de papada',
    image: 'assets/tratamentos/07_lipo_de_papada.webp',
    focus: '55% 40%',
    alt: 'Profissional avaliando a região do pescoço de uma paciente',
    summary: 'Informações gerais sobre o procedimento na região submentual.',
    details: [
      'A lipo de papada é um procedimento voltado à gordura localizada abaixo do queixo. A indicação, a técnica e a recuperação variam de pessoa para pessoa.',
      'Na avaliação, você recebe as informações sobre preparo, cuidados e o que é realista esperar no seu caso.',
    ],
  },
  {
    id: 'clinico-geral',
    title: 'Clínico geral',
    image: 'assets/tratamentos/08_clinico_geral.webp',
    focus: '50% 30%',
    alt: 'Dois profissionais de saúde sorrindo em um consultório',
    summary: 'Avaliações, limpeza e cuidado preventivo.',
    details: [
      'Consultas de rotina, limpeza, restaurações e orientação de cuidados em casa. É também o ponto de partida quando você não sabe qual tratamento procurar.',
      'Manter as visitas regulares ajuda a identificar cedo o que precisa de atenção.',
    ],
  },
];

export const OTHER_OPTION = { id: 'outro', title: 'Outro / Não sei' } as const;

export type BookingTreatmentId = TreatmentId | typeof OTHER_OPTION.id;

/** Opções do agendamento: os 8 tratamentos com a foto do card (miniatura) + “Outro / Não sei” sem foto. */
export const BOOKING_OPTIONS: readonly { id: BookingTreatmentId; title: string; image?: string; focus?: string }[] = [
  ...TREATMENTS.map(({ id, title, image, focus }) => ({ id, title, image, focus })),
  OTHER_OPTION,
];

export const treatmentTitle = (id: BookingTreatmentId) =>
  BOOKING_OPTIONS.find((option) => option.id === id)?.title ?? OTHER_OPTION.title;
