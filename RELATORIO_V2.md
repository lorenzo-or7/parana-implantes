# Relatório V2 — Paraná Implantes (redesign premium)

Data: 04/11/2026 · **Sem commit, sem push, sem deploy.** As alterações estão só na cópia local (`git status` mostra 45 arquivos modificados). O site no GitHub Pages continua na versão anterior.

## 1. Resumo

A V2 revisou composição, imagens e interações sem trocar a identidade nem a lógica aprovada.

- Os botões ganharam um sistema próprio:
  - raio de 6px;
  - três níveis: primário, secundário e textual;
  - variações para faixas escuras.
- Todas as seções ganharam um sistema editorial comum: rótulo com fio dourado, título, texto de apoio com largura controlada e divisórias. Cada seção tem uma grade diferente, para variar o ritmo.
- O hero, a introdução, os ambientes, a história, os profissionais, o agendamento, o contato e o rodapé foram refeitos.
- **Fotos sem ampliação além do tamanho real.** A principal causa da falta de nitidez era que todas as fotos eram exibidas maiores que o arquivo original.
- O mapa do Google entrou no lugar da foto em "Visite-nos".
- A scrollbar acompanha o tema.
- **Bug corrigido: a logo não aparecia no GitHub Pages.** Ver a seção 6.

### Skills

- **frontend-design:** suas diretrizes (lida na V1) guiaram as decisões:
  - sem eyebrow em caixa-alta;
  - numeração só onde há sequência real (etapas do agendamento);
  - uma única animação orquestrada (o hero).
- **impeccable:** o hook automático analisou cada arquivo salvo e não apontou problemas.
- **UI UX Pro Max, Taste, Humanizer e Web Design Guidelines** estão instaladas, mas **não foram executadas** nesta etapa. Os princípios equivalentes foram aplicados por análise própria:
  - hierarquia e grids;
  - estados e acessibilidade;
  - revisão dos textos novos para evitar promessas e frases genéricas.

## 2. Arquivos modificados

| Área | Arquivos |
| --- | --- |
| Tokens, botões, tipografia, scrollbar | `src/index.css` |
| Logo (bug de produção) | `src/components/Logo.tsx`, `Logo.css` |
| Hero | `Hero.tsx`, `Hero.css` |
| Introdução | `Intro.tsx`, `Intro.css` |
| Tratamentos | `Treatments.tsx`, `Treatments.css` |
| Ambientes | `Experience.tsx`, `Experience.css` |
| História | `History.tsx`, `History.css` |
| Profissionais | `Professionals.tsx`, `Professionals.css`, `ProfileCard/ProfileCard.css` (só desempenho) |
| Avaliações | `Reviews.tsx`, `Reviews.css` (rótulo e fundo) |
| CTA de agendamento | `BookingCta.tsx`, `BookingCta.css` |
| Modal de agendamento | `src/booking/BookingDialog.tsx`, `BookingDialog.css`, `src/components/Dialog.css` |
| Contato / mapa | `Visit.tsx`, `Visit.css`, `src/data/site.ts` (`MAPS_EMBED_URL`) |
| Rodapé | `Footer.tsx`, `Footer.css` |
| Navbar (só desempenho) | `Navbar.css` |
| Imagens | `scripts/optimize-assets.mjs` + as 15 fotos WebP regeneradas em `public/assets/` |

## 3. Correções por seção

- **Botões:**
  - Raio de 6px (`--r-btn`).
  - Primário em cor cheia, secundário com contorno fino e textual com sublinhado. Há variações claras para fundos escuros.
  - Seta só na ação principal. Ela desliza no hover e o clique tem um leve afundamento.
  - Foco visível, estado desabilitado e alvos de pelo menos 44px.
  - **Cápsula mantida só na navbar e no Champagne Switch**, como pedido. O botão "Agendar avaliação" da navbar também segue a cápsula, por estar dentro dela.
- **Hero:**
  - A foto (1024 × 1019 px) passou a ocupar a coluna da direita, e o texto fica sobre o marrom da moldura.
  - Em 1920px a foto aparece com 1085 × 1046 px (≈ 1,06×). Antes era esticada na largura toda (≈ 2×).
  - As 3 animações aprovadas foram preservadas:
    - Cinematic Reveal: a foto se abre com recorte da direita para a esquerda e o texto entra em sequência.
    - Parallax Depth: foto e texto em velocidades diferentes, só em desktop com mouse.
    - Magnetic CTA.
  - No mobile, a foto fica em cima (letreiro visível) e o texto embaixo, sem sobreposição.
- **"Cuidado que começa na escuta":**
  - Virou um painel com começo, meio e fim: título, narrativa curta e link para a história.
  - Fecha com 4 pilares (Desde 2014, Escuta primeiro, Novo Mundo, Estrutura acolhedora), todos com fatos já existentes no projeto.
- **Tratamentos:**
  - Os Focus Cards e o painel de detalhes foram mantidos.
  - Os cards mudaram para 16:10. As fotos têm 546 × 197 px e, nas 4 colunas, aparecem perto do tamanho real (~310 × 195 px).
  - O desfoque dos vizinhos agora vale só para a foto.
  - O overlay foi reforçado na faixa do texto.
  - No fim da seção há uma linha "Ainda não sabe qual é o seu caso?", que abre o agendamento com "Outro / Não sei".
- **Ambientes:**
  - Galeria em duas escalas:
    - recepção grande (5:6, ≤ 760px de largura);
    - consultório menor (4:5, ≤ 360px).
  - Legendas encostadas em cada foto.
  - A estrutura da clínica fecha o bloco em 3 colunas.
- **História:**
  - "2014" vira a linha de data da narrativa, com a legenda "Ano de fundação, em Curitiba". A coluna fica fixa durante a leitura no desktop.
  - O selo institucional ficou menor e integrado à coluna.
  - O texto foi dividido em 3 partes (A ideia / O jeito de atender / Hoje), usando só o texto que já existia. Nenhum marco foi inventado.
  - A seção fecha com os fundadores: retratos pequenos e um link para os profissionais.
  - O arco fino ao fundo vem das artes editoriais da marca.
- **Profissionais:**
  - Uma coluna editorial (título, texto e formação de cada um) fica ao lado dos cards. Em tablet, ela passa para cima.
  - Os Profile Cards ficaram com os mesmos props aprovados.
  - O card passou de 410px para 360px, e a área da foto ficou quase quadrada. Os retratos têm só ~357px de altura e antes eram ampliados 1,37×.
- **Avaliações:** ganharam rótulo e fundo alternado. Os depoimentos não foram alterados.
- **CTA de agendamento:** saiu do bloco marrom, para não repetir a faixa final do rodapé, e virou um painel claro com as 4 etapas.
- **Modal de agendamento:**
  - Desktop em duas colunas: à esquerda, uma coluna marrom com o selo de demonstração, o título, um texto curto e um **stepper vertical**. As etapas concluídas mostram o valor escolhido (tratamento, nome, data/período) e são clicáveis para voltar.
  - As opções viraram blocos sem contorno, e a selecionada fica em cor cheia.
  - Os campos têm raio de 8px e anel de foco.
  - No mobile:
    - o painel ocupa a tela inteira, subindo de baixo;
    - o progresso fica em barras horizontais;
    - os botões ficam fixos no rodapé;
    - o campo focado é rolado para o centro, para o teclado virtual não escondê-lo.
  - **A lógica não mudou:** mesmas 4 etapas, validações, revisão, consentimento, mensagem e URL do WhatsApp.
- **Visite-nos:**
  - Usa o **mapa do Google Maps incorporado**: o modo embed público, sem chave de API, buscando pelo endereço oficial. Nenhuma coordenada foi inventada.
  - Há um fundo de reserva com o endereço caso o iframe não carregue.
  - Uma barra sob o mapa tem "Abrir no Google Maps".
  - Também estão lá o botão "Como chegar", o WhatsApp, o telefone e o Instagram.
- **Rodapé (refeito):**
  1. Faixa de encerramento marrom com "Seu próximo sorriso começa aqui.", um texto de apoio, "Agendar avaliação" e "Conversar no WhatsApp", mais os arcos finos da marca.
  2. Informações:
     - logo e uma frase;
     - navegação em 2 colunas;
     - contato com WhatsApp, telefone e Instagram;
     - endereço com "Como chegar".
  3. Faixa institucional com copyright, um aviso de protótipo e um botão de voltar ao topo.
  4. Assinatura Or7 com o arquivo original, 44px de altura e centralizada.
- **Scrollbar:** nativa, com `scrollbar-width: thin` e `scrollbar-color`:
  - tema claro: trilho champagne e indicador taupe escuro;
  - tema escuro: trilho chocolate e indicador champagne.
  - Há um fallback `::-webkit-scrollbar` para o Safari.
- **Temas:**
  - No escuro, as seções alternam três tons (`--bg`, `--bg-alt`, `--surface`) com divisórias finas, em vez de um bloco marrom contínuo.
  - O hero e a faixa final são escuros nos dois temas.

## 4. Componentes preservados

- Pré-agendamento: lógica, validações e mensagem.
- WhatsApp `5541992166406`.
- Dados institucionais.
- Os 8 tratamentos, na mesma ordem e com as mesmas fotos.
- Profile Cards: holo 0.15, glare 0.25, tilt 6, parallax 4, radius 20, intro, sem tilt no mobile.
- Tema claro/escuro e Champagne Switch.
- Navbar Morphing Island/Scroll.
- Paleta de 6 cores.
- Zodiak 700 e Plus Jakarta Sans 400.
- Logo manuscrita.
- Assinatura Or7 original.
- A foto restrita continua fora do site e do build.

## 5. Desempenho: o que foi encontrado e corrigido

| Causa provável de travamento | Correção |
| --- | --- |
| `backdrop-filter: blur(20px) saturate(1.6)` no corpo de cada Profile Card (sem efeito visível, porque o fundo é sólido) | removido |
| `backdrop-filter: blur(18px)` na navbar fixa, recalculado a cada quadro de rolagem sobre as fotos | removido; o fundo ficou mais opaco (95%) |
| `backdrop-filter` no fundo dos modais, no botão secundário do hero, no botão fechar e no selo do mapa | removidos |
| `filter: blur()` aplicado ao card inteiro em 7 cards ao mesmo tempo (texto incluso) | desfoque só na foto |
| Hero com imagem ampliada ~2× e `will-change` permanente em duas camadas | foto em tamanho real; `will-change` removido |

Medido no navegador (dev server, 1440px):
- nenhum elemento com `backdrop-filter`;
- nenhuma long task durante uma varredura de rolagem pela página inteira (48 posições em 17 ms);
- o loop de animação do Profile Card só roda enquanto há interação e para sozinho;
- não há listeners duplicados: scroll e resize da navbar são passivos, com `requestAnimationFrame`.

**Limitação:** o painel do navegador estava oculto durante os testes. Por isso não foi possível medir FPS real nem gravar um perfil de quadros. A fluidez percebida deve ser confirmada no navegador do proprietário.

## 6. Bug encontrado no site publicado

A logo da navbar e do rodapé não aparecia no GitHub Pages: o espaço vazio à esquerda na navbar e no rodapé das capturas enviadas.

- **Causa:** a máscara usava `url()` relativa dentro de uma variável CSS. O navegador resolve essa URL a partir do arquivo CSS do build (`/assets/index-*.css`), o que gerava `/assets/assets/marca/...` e dava 404.
- **Correção:** a máscara foi para o estilo inline, que resolve a partir da página.
- **Verificação:** no build de produção servido localmente (`vite preview`), a logo é pedida em `/assets/marca/logo_principal_alpha.png` e responde 200.

## 7. Testes executados

| Teste | Resultado |
| --- | --- |
| `npm run typecheck` | sem erros |
| `npm run lint` | 0 erros, 1 aviso conhecido (`slowUntil` no motor original do Profile Card, falso positivo já documentado) |
| `npm test` | 10/10 passando |
| `npm run build` | ok. JS 442 kB (140 kB gzip), CSS 54 kB (11,5 kB gzip) |
| Build de produção no navegador | 0 requisições com erro, 0 imagens quebradas, 1 `h1`, nenhum `href="#"`, todos os `target=_blank` com `noopener`, mapa carregado, console sem erros |
| Fluxo de agendamento (desktop, tema escuro) | Seleção do tratamento → contato (Tab entre campos, Enter avança) → "Prefiro combinar a data" + Tarde → revisão. Sem consentimento, mostra o erro e foca a caixa. Com consentimento, a URL gerada (com `window.open` simulado) bate com o modelo. A tela final aparece e o `localStorage` guarda só `pi-theme` |
| Stepper | Valores das etapas concluídas aparecem no stepper; foco vai para o título de cada etapa |
| Descarte | Com dados pessoais, Escape abre "Descartar o pedido?". Um segundo Escape volta ao formulário com os dados mantidos. "Descartar e fechar" fecha. Escolher só o tratamento não pede confirmação, como na V1 |
| Rolagem horizontal | nenhuma em 360, 390, 430, 768, 1024 e 1920px (`scrollWidth ≤ innerWidth`). Os 375px e 1440px foram conferidos visualmente |
| Capturas reais | 1440px (claro e escuro), 375px (hero, introdução, tratamentos, ambientes, história, modal), 768px e 1024px (ambientes, profissionais, rodapé) |
| Tema | troca pelo switch, com seções diferenciadas no escuro |

**Não verificado:**
- `prefers-reduced-motion` emulado: o painel não permite a emulação. O código desliga reveal, parallax, magnetismo e tilt, e o CSS zera as transições, mas isso não foi conferido no navegador.
- Leitor de tela.
- Dispositivos físicos iOS/Android, incluindo o teclado virtual real cobrindo os campos.
- FPS real (ver a seção 5).
- O WhatsApp real não foi aberto.

## 8. Pendências

- As pendências de conteúdo do relatório anterior continuam (`RELATORIO_ENTREGA.md`, seção "Pendências de conteúdo"): número do WhatsApp, telefone fixo, CRO, credenciais, direitos de imagem, permissão dos depoimentos, licença do React Bits.
- **Mapa do Google (privacidade):** o iframe carrega conteúdo e cookies do Google quando a seção se aproxima (`loading="lazy"`). Para publicação oficial, avaliar com a clínica se o mapa deve abrir só após um clique (consentimento LGPD).
- Na raiz do projeto há um arquivo solto chamado `git commit -m feat：prototipo premium Parana Implantes` (aparentemente criado por engano no terminal). Não foi tocado. Remover se não for necessário.
- Reverificar desktop e mobile no navegador do proprietário antes de aprovar o deploy.

## 9. Limitações das imagens originais

| Arquivo | Tamanho | Consequência |
| --- | --- | --- |
| `recepcao_principal_hero` | 1024 × 1019 | Por isso o hero passou a ter duas colunas. Em telas retina (2×), ainda fica levemente macia. Uma versão de 2000px+ melhoraria. |
| 8 fotos de tratamento | 546 × 197 | Faixas muito horizontais. Os cards foram ajustados para não ampliar, mas o recorte é estreito. Versões de ~1200 × 800 permitiriam cards maiores. |
| Retratos dos doutores | ~550 × 360 (paisagem) | Limitam a altura do Profile Card. Retratos verticais de ~900 × 1200 permitiriam o formato 4:5 original do componente. |
| `consultorio_03`, `recepcao_ambiente_02` | 851–1024px | Exibidos no máximo em 760px. Ok em 1×, macios em retina. |

Nenhuma imagem foi ampliada por IA nem teve detalhes inventados. As fotos foram só recodificadas em WebP com qualidade 92 e `smartSubsample`, na mesma resolução.

## 10. Evidências visuais

As capturas foram feitas no painel do navegador durante a sessão (1440, 1024, 768 e 375px, temas claro e escuro). Não foram salvas como arquivo no projeto.

## Para rodar

```bash
npm install
npm run dev
```
