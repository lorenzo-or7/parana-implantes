# Paraná Implantes — protótipo demonstrativo

Landing page de demonstração (Or7.Dev) para a clínica odontológica Paraná Implantes, Curitiba.
**Não é o site oficial.** Não há backend: o pré-agendamento só monta uma mensagem e abre o WhatsApp.

## Rodar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + build estático em dist/
npm run preview    # serve dist/ em http://localhost:4173
npm run lint       # oxlint
npm run typecheck  # tsc -b
npm test           # vitest (validações e mensagem/URL do WhatsApp)
npm run assets     # regenera public/assets a partir de assets-source/
```

O build usa `base: './'`, então `dist/` funciona em qualquer hospedagem estática e em subdiretório (ex.: GitHub Pages).

## Estrutura

```
assets-source/          arquivos originais do kit (fonte da verdade)
  restrito/             NÃO publicar — fora de public/ e ignorado pelo .gitignore
scripts/optimize-assets.mjs   gera WebP, logo com alfa e favicon em public/
public/assets/          versões web usadas pelo site
src/
  data/treatments.ts    8 tratamentos (dados tipados, ordem e fotos do briefing)
  data/site.ts          contato, endereço, profissionais, avaliações
  lib/booking.ts        validação, máscara, mensagem e URL do WhatsApp (+ testes)
  booking/              contexto e stepper de pré-agendamento
  theme/                tema claro/escuro (contexto + localStorage)
  components/           navbar, hero, seções, Dialog acessível, Profile Card adaptado
```

## Dependências e licenças

| Pacote | Uso | Licença |
| --- | --- | --- |
| react, react-dom | UI | MIT |
| motion | animações (hero, navbar, modais, stepper) | MIT |
| lucide-react | ícones (biblioteca única) | ISC |
| vite, @vitejs/plugin-react | build | MIT |
| typescript | tipos | Apache-2.0 |
| oxlint | lint | MIT |
| vitest | testes | MIT |
| sharp (dev) | conversão das imagens para WebP | Apache-2.0 |

Componentes de referência:

- **Profile Card (React Bits)**: adaptado a partir do código fornecido em `assets-source/PROFILE_CARD_CODIGO_ORIGINAL.txt`. Confirmar os termos de licença do React Bits antes de uso comercial.
- **Focus Cards (Aceternity UI)**, **Morphing Island Navbar** e **Morphing Scroll Navbar (21st.dev)**: o comportamento foi reimplementado neste projeto a partir da descrição do briefing. Nenhum código desses registros foi copiado ou instalado.

Fontes: Zodiak 700 e Plus Jakarta Sans 400 via Fontshare (CDN). Sem conexão, o navegador usa as fontes de fallback (Georgia / system-ui).
