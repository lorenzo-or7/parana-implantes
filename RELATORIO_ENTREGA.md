# Relatório de entrega local — Paraná Implantes (protótipo)

Data: 04/11/2026 · **Sem commit, sem push, sem deploy.** A pasta não é um repositório git.

## Estado inicial

- `parana-implantes/` estava vazia. O projeto foi criado do zero (Vite + React 19 + TypeScript).
- O kit foi copiado para `assets-source/`. Os 22 arquivos de imagem batem com a listagem do `LEIA-ME.md`.
- O `PROFILE_CARD_CODIGO_ORIGINAL.txt` foi separado em JSX e CSS e portado para TypeScript.

## Skills consultadas

- **frontend-design**: carregada e lida antes da implementação.
- **impeccable**: o hook do plugin rodou automaticamente a cada arquivo salvo e não apontou problemas. A skill em si não foi invocada.
- UI UX Pro Max, Taste, Web Design Guidelines e Humanizer estão instaladas, mas **não foram executadas**. Os princípios do briefing foram aplicados manualmente: hierarquia, contraste, estados, microcopy sem promessas.

## Decisões preservadas

| Decisão aprovada | Como ficou |
| --- | --- |
| Paleta oficial (6 cores), sem turquesa | Tokens em `src/index.css`. As variações são só de luminosidade, para superfícies e contraste de texto |
| Zodiak 700 / Plus Jakarta Sans 400 | Link do Fontshare. O carregamento das duas foi conferido no navegador (`document.fonts`). `font-synthesis: none` evita negrito falso |
| Logo manuscrita sem redesenho | O desenho é o arquivo original. Para a logo acompanhar o tema, foi gerada uma versão com alfa (`logo_principal_alpha.png`): só o fundo taupe sai, com o mesmo traço e as mesmas proporções. O original segue em `public/assets/marca/` |
| Logo secundária apenas institucional | Selo na seção “Nossa história” e favicon (recorte do símbolo do dente) |
| Assinatura Or7 obrigatória | Arquivo original no rodapé, com proporção e fundo preservados e alt descritivo. Como a imagem já tem o crédito, o texto não foi repetido |
| Tema claro/escuro + Champagne Switch | Cápsula sol/lua em champagne, com seleção em marrom/creme e animação. Tem radiogroup, setas e foco visível. A escolha fica salva em `localStorage`. O tema inicial respeita `prefers-color-scheme` e um script inline evita o flash |
| Navbar morphing island + scroll | Cápsula flutuante que contrai ao rolar e se expande para baixo com o menu. Indicador ativo animado. Links por faixa: 6 (≥1200px), 3 + Menu (900–1199px), Agendar + Menu (<900px) |
| Hero Cinematic Editorial | Foto `recepcao_principal_hero`, eyebrow, título, subtítulo e CTAs aprovados. **Cinematic Reveal** (~1,6 s), **Parallax Depth** (só ≥900px e com ponteiro fino), **Magnetic CTA** com seta animada (desligado em toque e com movimento reduzido) |
| Ordem da home (10 itens) | Hero → introdução → Tratamentos → Experiência → História → Profissionais → Avaliações → Pré-agendamento → Visite-nos → Footer |
| Focus Cards, 8 tratamentos, fotos e ordem exatas | `src/data/treatments.ts`. O card em foco destaca e os vizinhos suavizam (opacidade, blur de 1,5px), só com hover em mouse. Cada card abre um painel acessível com texto curto, aviso de que não substitui consulta e **Solicitar avaliação** com o tratamento já selecionado |
| Profile Cards (React Bits) | Valores exatos: holo 0.15, glare 0.25, tilt 6, parallax 4, radius 20, intro, sem tilt mobile. Holografia em champagne/dourado, sem status “Online”. O handle virou link real do Instagram e o botão “Conhecer profissional” abre um painel com os dados públicos |
| Avaliações reais sem edição | Os 6 depoimentos aparecem com o texto exato (inclusive “Otimo” e “Está”), mais data e origem Google. Nota 4,9 / 138 aparece como dado de referência, com aviso. Sem estrelas individuais e sem fotos de perfil |
| Pré-agendamento | Stepper em 4 etapas → `wa.me/5541992166406` com a mensagem no formato combinado. Detalhes abaixo |
| Foto restrita | **Não usada.** Fica fora de `public/` e de `dist/`, ignorada no `.gitignore`, e nenhum arquivo do código a referencia |

### Pré-agendamento — detalhes

- As entradas por navbar, hero, cards de tratamento, painel do profissional, seção CTA e rodapé abrem o mesmo fluxo.
- Etapas: Tratamento (8 opções + “Outro / Não sei”) → Contato (nome e telefone com máscara que aceita colagem, inclusive com +55) → Preferência (data mínima = hoje, “Prefiro combinar a data”, Manhã/Tarde/Qualquer período) → Revisão (resumo com “Editar” por item, prévia da mensagem e consentimento obrigatório).
- A validação roda por etapa, com mensagens que dizem como corrigir. O foco vai para o primeiro erro e depois para o título da nova etapa.
- Se houver dados, Escape, fundo ou ✕ pedem confirmação antes do descarte. Ao fechar, os dados são apagados e o foco volta ao botão de origem.
- Depois de abrir o WhatsApp, a tela diz “Sua mensagem está pronta no WhatsApp” e explica que o pedido ainda não é agendamento. Se o pop-up for bloqueado, mostra “Falta só abrir o WhatsApp”. Nos dois casos há **Abrir novamente** e **Copiar mensagem**.
- Nada vai para `localStorage` (conferido: só a chave `pi-theme`) nem para analytics. O selo “Demonstração — solicitação via WhatsApp” aparece em todas as telas.
- Domingo: a data não é bloqueada (não há horário oficial). O aviso diz que a clínica confirma pela conversa, sem afirmar disponibilidade.

## Mapa de arquivos

```
index.html                     fontes, meta noindex, tema sem flash, preload do hero
vite.config.ts                 base './', config do vitest
scripts/optimize-assets.mjs    WebP + logo com alfa + favicon (restrito nunca processado)
assets-source/                 kit original (inclui restrito/, fora do build)
public/assets/…, favicon.png   imagens web
src/index.css                  tokens, temas, base, botões
src/App.tsx, main.tsx
src/data/{treatments,site}.ts
src/lib/{booking,booking.test,asset,scrollLock}.ts
src/theme/ThemeContext.tsx
src/booking/{BookingContext,BookingDialog}.tsx + .css
src/components/{Navbar,ThemeSwitch,Logo,Hero,MagneticButton,Intro,Treatments,Experience,
  History,Professionals,Reviews,BookingCta,Visit,Footer,Dialog}.tsx + .css
src/components/ProfileCard/ProfileCard.{tsx,css}
.claude/launch.json            configurações de preview (dev 5173 / preview 4173)
README.md, RELATORIO_ENTREGA.md
```

## Comandos executados e resultados

| Comando | Resultado |
| --- | --- |
| `npm test` | 10/10 testes passando: máscara/validação de telefone, data passada, bloqueio por etapa, consentimento, mensagem exata, “A combinar”, codificação da URL |
| `npm run typecheck` (`tsc -b`) | sem erros |
| `npm run lint` (oxlint) | 0 erros, 1 aviso: `slowUntil` no motor original do Profile Card. É falso positivo (variável local do efeito) e o código foi mantido como no original |
| `npm run build` | ok. JS 436 kB (139 kB gzip), CSS 43 kB (9,6 kB gzip) |
| `npm run preview` + navegador | sem imagens quebradas, fontes carregadas, 1 `h1`, nenhum `href="#"`, todos os `target=_blank` com `noopener` |

## Verificação no navegador (painel embutido, dev server)

- Desktop 1440×900, tema escuro e claro: hero, navbar contraída ao rolar, todas as seções, rodapé com Or7.
- Mobile 375×812: hero com o letreiro visível acima do texto. O menu abre, foca o primeiro link, bloqueia a rolagem, fecha com Escape e devolve o foco ao botão. A troca de tema pelo menu persiste. Agendamento como painel inferior com ações fixas.
- Sem rolagem horizontal em 360, 375, 390, 768, 1024 e 1440 (`scrollWidth ≤ innerWidth`).
- Console sem erros e rede sem 404.
- Fluxo completo: card → painel → agendamento com tratamento pré-selecionado. Erros por etapa, data passada recusada, aviso de domingo, edição a partir da revisão, consentimento obrigatório. A URL gerada foi decodificada e bate com o modelo. O caminho “pop-up bloqueado” foi testado simulando `window.open` → `null`. O WhatsApp real **não** foi aberto durante os testes.
- Contraste (WCAG): todos os pares de texto ≥ 4,5:1. O tom “ink-faint” claro foi escurecido para #725645 (5,2:1 no fundo do rodapé). O dourado #B58A34 sobre creme (2,9:1) só aparece em elementos decorativos (estrelas, aspas, barra de progresso). Para texto pequeno usa-se um dourado escurecido derivado (#7D5C1D, 5,6:1).

**Não verificado:** emulação real de `prefers-reduced-motion` (o código desliga parallax, tilt, magnetismo e reveal, e o CSS zera transições, mas isso não foi conferido no navegador). Também não foram testados leitor de tela nem dispositivos físicos iOS/Android. O painel do navegador estava oculto durante parte dos testes, o que atrasa `requestAnimationFrame`, por isso as animações foram conferidas por estado e não por fluidez.

## Diferenças em relação ao briefing

- **Navbar e Focus Cards**: as páginas do 21st.dev e da Aceternity não foram abertas e nenhum código delas foi instalado. O comportamento descrito (cápsula, morph, contração, foco/blur) foi reimplementado com `motion` e CSS.
- **Profile Card**: o ícone Hugeicons virou Lucide (biblioteca única). O `mix-blend` da holografia passou de `color-dodge`/`multiply` para `soft-light`, para não gerar arco-íris. Os alvos de toque foram para 44px e o rodapé quebra linha em cards estreitos para o @ não ser cortado.
- **Playwright e2e**: não instalado (download de navegadores). Os testes de fluxo foram feitos no navegador embutido e estão descritos acima.
- **Mapa**: link externo do Google Maps com o endereço codificado, sem iframe nem chave de API.

## Pendências de conteúdo (validar antes de qualquer uso comercial)

1. **WhatsApp** `5541992166406`: confirmar o número final. O `(41) 9216-6406` sem o 9 não foi usado.
2. **Telefone fixo** `(41) 3538-5558`, vindo da captura do Google: confirmar.
3. **CRO** dos responsáveis e responsável técnico: ausentes. Não foram inventados e a norma do CFO exige esses dados em publicidade.
4. **Credenciais** (mestrado, especializações): exibidas “conforme material fornecido” e precisam de comprovação.
5. **Direitos de imagem**: retratos, fotos de procedimento, ambientes e as 8 fotos de tratamento. Estas parecem de banco de imagens: confirmar licença e se há pessoas identificáveis. As fotos de tratamento têm 546×197 px e ficam levemente suavizadas nos cards grandes. Versões maiores melhorariam o acabamento.
6. **Depoimentos**: confirmar permissão de uso e a nota/contagem atual (4,9 / 138).
7. **Estrutura** (acessibilidade, estacionamento gratuito, banheiro neutro, espaço acolhedor LGBTQ+, formas de pagamento): confirmar se está atual.
8. **Horário de atendimento**: não informado e não exibido.
9. **Privacidade/LGPD**: o texto atual é informativo. Uma política formal depende de revisão jurídica.
10. **Licença do React Bits** para uso comercial.
11. **Domínio oficial**: `noindex` está ativo e canonical/OG não foram definidos. Ajustar quando o domínio for aprovado.
12. **Portfólio Or7**: a assinatura não tem link, porque nenhuma URL foi confirmada.

## Para rodar

```bash
cd parana-implantes
npm install
npm run dev
```
