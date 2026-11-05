# Relatório Mobile V2.2 — Paraná Implantes

Data: 05/11/2026. **Sem commit, sem push, sem deploy.** A V2.2 está só na cópia local, aguardando a revisão do proprietário.

Base: V2.1 (`b3ff723`), **já publicada** no GitHub e no GitHub Pages. Os relatórios anteriores dizem "sem push" porque descrevem a situação da época. Foram mantidos como registro.

## 1. Resumo

Os critérios de aceite passaram nos testes em Chrome com emulação de toque. **Nada foi testado em aparelho físico.** A seção 8 lista o que continua sem verificação.

- A auditoria encontrou um defeito mais grave que os da lista inicial: **na V2.1, os links do menu mobile não levam a lugar nenhum.** O `#` da URL muda, mas a página fica parada. Está corrigido.
- A página em 375 × 812 caiu de 14.243 px para 11.935 px (−16%), sem perder conteúdo.
- O peso total da página em 375 px caiu de cerca de 1.051 KB para cerca de 582 KB (−45%).
- O desktop continua igual: mesma altura em 1024, 1280, 1440 e 1920 px, com no máximo 0,02% de pixels diferentes (seção 5).

## 2. Diagnóstico inicial

Medido na V2.1, em Chrome com toque emulado. Os números de 375 × 812 confirmam a auditoria recebida.

| Problema | Evidência |
| --- | --- |
| Menu mobile não navega | Ao tocar em um link, `scrollY` fica em 0. Destravar a rolagem cancelava a rolagem suave da âncora |
| Deslocamento dobrado nas âncoras | `scroll-padding-top` (104 px) somado a `scroll-margin-top` (104 px): a seção para a 208 px do topo |
| Navbar sobre a foto do Hero | Navbar termina em 72 px; a foto começa em 16 px |
| CTA cortado no Hero | Em 320 × 700, 360 × 800, 375 × 812 e 390 × 664 (altura real de um iPhone com a barra do navegador) |
| Nove links do rodapé abaixo de 44 px | 40 px de altura; "Início" com 38 × 40 px |
| Tratamentos muito altos | 8 cards em 16:10 na largura toda (209 px cada), com fotos originais de 546 × 197 |
| Agendamento em 768 px | Layout de duas colunas: botões vazavam na revisão |
| Teclado virtual | No iOS o `100dvh` não encolhe com o teclado, então o rodapé do modal ficaria atrás dele (conclusão pelo código e pelo comportamento conhecido do navegador, não observada em aparelho) |
| Erro de tratamento fora da vista | A mensagem aparecia abaixo das 9 opções, enquanto o foco ia para a primeira |
| Assinatura Or7 pesada | PNG de 2048 px e 477 KB exibido com no máximo 200 px, a maior transferência da página |
| Efeitos sem uso em touch | Animação de entrada dos Profile Cards rodando fora da tela; rolar sobre o card acionava inclinação e holografia |

Rolagem horizontal: nenhuma em nenhum viewport, antes ou depois.

## 3. Problemas corrigidos

- **Navbar:**
  - Os links do menu agora funcionam: o menu fecha primeiro, depois vêm a rolagem, a URL e o foco na seção de destino. Continuam sendo links reais, e o botão Voltar funciona.
  - O rótulo da seção para logo abaixo da navbar.
  - Fundo escurecido com o menu aberto: tocar fora só fecha, sem acionar o que está atrás.
  - O menu fecha se o foco sair dele e respeita as áreas seguras.
  - A ilha tem altura constante no mobile, sem recálculo de layout ao rolar.
- **Hero:**
  - Título e subtítulo aprovados, sem alteração.
  - A foto começa abaixo da navbar e tem altura calculada pela tela.
  - Nenhum CTA fica cortado nas 12 combinações de tela e toque medidas (seção 4).
  - Em telas muito baixas (375 × 553), texto e CTAs vêm primeiro e a foto depois.
  - Deitado, usa duas colunas.
  - Cinematic Reveal mais curto no mobile. Parallax e Magnetic CTA seguem ativos só com mouse.
- **Tratamentos:**
  - Os cards passaram a 12:5 no celular e 2:1 no tablet, perto da proporção real das fotos: elas aparecem quase inteiras e não são ampliadas.
  - Os oito tratamentos, os Focus Cards e os painéis continuam. Não virou carrossel.
  - O toque dá o mesmo destaque do foco.
- **Avaliações:**
  - Nota e estrelas na mesma linha.
  - Depoimentos em corpo de 17 px, com entrelinha mais aberta.
  - Os seis textos seguem exatos e sem autoplay.
- **Profissionais:**
  - Quadro da foto menos alto, o que mostra mais do retrato horizontal e amplia menos.
  - Botão "Conhecer profissional" na largura toda do card.
  - Dois cards lado a lado a partir de 620 px.
  - Em touch saem a holografia, a inclinação e a animação de entrada. Com mouse, nada muda.
- **Rodapé:**
  - Links com 44 px de altura e área na largura da coluna.
  - Blocos empilhados no celular e navegação em duas colunas.
  - Logo, texto, assinatura Or7 logo abaixo deles, contatos, endereço, CTA final e informações legais preservados.
- **Agendamento** (lógica, dados e WhatsApp intactos):
  - O painel acompanha a área visível da tela, inclusive com o teclado aberto.
  - Com teclado, o cabeçalho encolhe: as barras indicam o progresso e só a etapa atual é nomeada.
  - O cabeçalho não salta entre etapas.
  - O erro aparece junto do campo, visível.
  - O botão longo da revisão quebra em duas linhas em vez de vazar.
  - O cabeçalho compacto vale até 899 px.
  - Deitado, o cabeçalho fica em uma linha.
- **Visite-nos:**
  - Em touch, a página rola por cima do mapa. Um toque no mapa, ou o botão "Mover o mapa", libera os gestos, e "Voltar a rolar a página" devolve a rolagem.
  - Localização oficial sem alteração.
  - No tema escuro em touch, o mapa fica sem o filtro de cor, que custava repintura.
- **Sobre, Ambientes, História e CTA:** só espaçamentos e proporção do "2014". O bloco "Estrutura da clínica" e a logo branca não voltaram.
- **Limpeza:** o arquivo acidental da raiz foi removido, depois de confirmar que não era rastreado e que continha apenas saída do `git`.

### Correções feitas durante os testes

Regressões e falhas que os testes pegaram nesta rodada e que foram resolvidas:

- CLS de até 0,08 em rede lenta, causado pelo reveal mais rápido com a foto dependendo da altura do texto. A foto passou a ter altura própria e o texto espera a fonte por no máximo 1,5 s.
- Rótulos do progresso sobrepostos em 320 px com o teclado aberto.
- Rolagem horizontal com texto a 200%.
- Deslocamento de fração de pixel no rodapé desktop de 1440 px, causado pela nova assinatura. A proporção original foi travada.

## 4. Alturas das seções

Em px, V2.1 → V2.2, medidas em Chrome com toque emulado.

| Seção | 375 × 812 | 320 × 700 | 430 × 932 | 768 × 1024 | 667 × 375 |
| --- | --- | --- | --- | --- | --- |
| Hero | 859 → 799 | 836 → 719 | 932 → 928 | 1024 → 1007 | 735 → 375 |
| Sobre | 1266 → 1094 | 1340 → 1168 | 1165 → 993 | 946 → 950 | 955 → 959 |
| Tratamentos | **2419 → 1759** | 2204 → 1636 | 2696 → 1910 | 1514 → 1325 | 1419 → 1253 |
| Ambientes | 1227 → 1127 | 1221 → 1121 | 1289 → 1189 | 880 → 864 | 897 → 881 |
| História | 1279 → 1084 | 1379 → 1181 | 1253 → 1062 | 1117 → 991 | 1176 → 1050 |
| Profissionais | **1620 → 1374** | 1564 → 1340 | 1675 → 1470 | 1546 → 983 | 1656 → 990 |
| Avaliações | **1684 → 1307** | 1757 → 1400 | 1660 → 1251 | 1272 → 1228 | 1256 → 1212 |
| Pré-agendamento | 965 → 817 | 1167 → 975 | 943 → 771 | 856 → 825 | 864 → 838 |
| Contato | 1294 → 1202 | 1294 → 1203 | 1295 → 1203 | 1244 → 1212 | 1236 → 1136 |
| Rodapé | **1622 → 1371** | 1670 → 1416 | 1521 → 1353 | 1267 → 1291 | 1254 → 1278 |
| **Total** | **14243 → 11935** | 14441 → 12160 | 14436 → 12129 | 11674 → 10684 | 11456 → 9981 |

Em 768 e 667 px o rodapé cresceu 24 px e "Sobre" cresceu 4 px. No rodapé, o aumento vem dos links de 44 px.

| Tela | Rolagem horizontal | Alvos abaixo de 44 px | CTA do Hero cortado |
| --- | --- | --- | --- |
| 320, 360, 375, 390 (antes) | não | 9 | em 320, 360 e 375 × 812, e em 390 × 664 |
| 12 combinações mobile, tablet e deitado (agora) | não | 0 | nenhum |

## 5. Desktop preservado

Comparação tela a tela entre a V2.1 e a V2.2, com rolagem real, imagens decodificadas e mapa oculto. Uma rodada de controle da V2.1 contra ela mesma deu no máximo 9 pixels de diferença.

| Largura | Altura V2.1 / V2.2 | Pixels diferentes | Onde |
| --- | --- | --- | --- |
| 1024 | 8445 / 8445 | 0,0202% | Assinatura Or7 e uma borda fina no Profile Card |
| 1280 | 9233 / 9233 | 0,0073% | Assinatura Or7 |
| 1440 | 9103 / 9103 | 0,0123% | Assinatura Or7 (aparece em duas telas) |
| 1920 | 9307 / 9307 | 0,0047% | Assinatura Or7 |

Resultados iguais nos temas claro e escuro.

- **Assinatura Or7:** a diferença vem da cópia de 480 px, com a mesma arte e a mesma proporção. O arquivo original continua em `public/assets/marca/`.
- **Borda em 1024 px:** cerca de 870 pixels, com a causa não confirmada. Apareceu nos dois temas nesta rodada e só no claro na rodada anterior, o que sugere o fim da animação do card. Nenhum CSS de desktop do card foi alterado.

Primeira tentativa, descartada: a captura de "página inteira" mostrou a navbar com largura errada e galerias vazias. Medindo ao vivo, a navbar tem 1240 px nas duas versões, então o problema estava na captura.

## 6. Performance

**Lighthouse Mobile** (3 rodadas em cada versão, build de produção local):

| Métrica | V2.1 | V2.2 |
| --- | --- | --- |
| Performance | 0,91 | 0,91 |
| Acessibilidade | 100 | 100 |
| Boas práticas | 100 | 100 |
| LCP (simulado) | 3,4–3,5 s | 3,4–3,5 s |
| FCP (simulado) | 1,4 s | 1,4 s |
| CLS | 0 | 0–0,001 |
| TBT | 20–30 ms | 40 ms |
| Transferência inicial | 438 KiB | 463 KiB |

**Chrome com CPU 4× mais lenta, sem limitar a rede** (375 × 812, última rodada de 5 execuções por versão, com o build final):

| Métrica | V2.1 | V2.2 |
| --- | --- | --- |
| LCP (foto do Hero) | 1176–1360 ms | 1232–1460 ms |
| CLS | 0 | 0 |
| Interação mais lenta (aproximação do INP: abrir menu e modal) | 160–224 ms | 144–192 ms |
| Tarefas longas ao rolar a página | 0 | 0 |
| Maior tarefa longa no carregamento | 457–544 ms | 509–691 ms |
| Peso total após rolar a página | ~1051 KB | **~582 KB** |

Leitura sem exagero:

- **O ganho real é o peso total:** −45%, quase todo pela assinatura Or7.
- **LCP não melhorou.** Na rodada final, a V2.2 ficou de 50 a 100 ms acima; em rodadas anteriores, com outras versões do código, os intervalos se sobrepuseram. O score do Lighthouse é o mesmo.
- **A maior tarefa longa no carregamento e o TBT subiram um pouco.** O JS principal segue em 140 kB gzip, praticamente igual.
- **A transferência inicial subiu 25 KiB.** A causa mais provável é a página mais curta, que traz mais imagens lazy para perto da tela no carregamento. Não foi confirmada. O CSS cresceu de 53 para 64,5 kB (11,2 → 13,1 kB gzip).
- **Não houve code splitting** do JS: seria uma refatoração não pedida.

## 7. Testes executados

| Teste | Resultado |
| --- | --- |
| `npm run typecheck` | sem erros |
| `npm run lint` | 0 erros, 1 aviso já conhecido (`slowUntil`, Profile Card) |
| `npm test` | 10/10 |
| `npm run build` | ok. JS 445 kB (140,8 kB gzip), CSS 64,5 kB (13,1 kB gzip) |
| Fluxos em Chrome com toque emulado | **138/138** |
| Capturas revisadas | 375 px nos dois temas e por seção; Hero em 6 tamanhos; deitado; tablet; modal |

Os 138 fluxos cobrem:

- **Navegação:** menu em 6 tamanhos, âncoras do menu, do Hero e do rodapé, foco de destino, botão Voltar do navegador.
- **Conteúdo:** 8 painéis de tratamento, Profile Cards, mapa (bloquear, ativar, devolver a rolagem).
- **Agendamento completo em 6 combinações de tamanho e tema:**
  - seleção das 9 opções, miniaturas, validações, máscara de telefone;
  - revisão, consentimento, link `wa.me/5541992166406` com a mensagem conferida (com `window.open` simulado);
  - tela final e fechamento, confirmação de descarte, `localStorage` só com `pi-theme`.
- **Acessibilidade:**
  - `prefers-reduced-motion` **emulado de verdade** (a media query, não só o código): Hero sem deslocamento nem recorte, sem rolagem suave, menu sem animar a altura;
  - contraste AA nos 140 textos sobre fundo sólido, nos dois temas;
  - texto a 200% em 375 px e zoom equivalente a 200% (640 × 400 CSS), sem rolagem horizontal;
  - ordem de foco por teclado no topo da página.
- **Console e rede locais:** sem erros.

O teclado virtual foi **simulado**, encolhendo o viewport em 56% com o campo em foco (`visualViewport`). O botão e o campo continuaram visíveis em 320 e 375 px.

Ferramentas de teste usadas fora do projeto, em pasta temporária: `puppeteer-core` e `lighthouse` com o Chrome instalado. Nenhuma dependência foi adicionada ao `package.json`.

## 8. Limitações: o que não foi verificado

- **Aparelhos físicos iOS ou Android.** Toda a verificação foi em Chrome com emulação.
- **Teclado virtual real.** Em especial no Safari do iOS, onde a correção é mais necessária e a simulação não reproduz tudo.
- **Safari.** O motor WebKit não foi testado. O ajuste do campo de data para iOS é preventivo.
- **Leitor de tela.**
- **Gestos reais dentro do mapa do Google.** O bloqueio e a liberação foram testados, mas não o arrastar e o pinçar dentro do iframe.
- **Abertura real do WhatsApp.**
- **Áreas seguras (notch).** As regras estão no CSS, mas a emulação não tem notch.
- **INP de campo.** O valor acima é uma aproximação, em poucas interações.
- **Rede lenta real.** Só a simulação do Lighthouse.

## 9. Pendências e decisões

1. **Âncoras no desktop (decisão do proprietário):** o deslocamento dobrado também existe de 900 px para cima. Medido em 1440 px: a seção para a 208 px do topo, com a navbar terminando em 78 px e o rótulo em cerca de 340 px, o que deixa o fim da seção anterior visível. **Não foi alterado**, porque esta etapa preserva o desktop. A correção é pequena.
2. **Selo "Demonstração":** fica oculto em dois estados por falta de espaço: com o teclado aberto e com o celular deitado. Nas demais telas ele continua lá. Decisão minha, a confirmar.
3. **Holografia em touch:** foi retirada no toque, seguindo a diretriz de não depender desses efeitos. Em repouso ela já era quase imperceptível.
4. **Fotos:** continuam as limitações de resolução da V2.
5. **Pasta `capturas-v2-2/`:** criada para esta revisão e ainda não rastreada. Decida se entra no commit ou se é descartada.
6. **Conteúdo (de `RELATORIO_ENTREGA.md`):** WhatsApp, telefone, CRO, credenciais, direitos de imagem, depoimentos, licença do React Bits, mapa e LGPD seguem pendentes.

### Divergência em relação às skills

Das skills citadas, só a **Web Design Guidelines** foi carregada, e suas regras guiaram parte das decisões (`touch-action`, cor de toque, `overscroll-behavior`, área segura, foco, dimensões de imagem). **UI UX Pro Max, Taste, Impeccable e Humanizer não foram executadas nesta etapa**: a identidade já está aprovada, e a revisão visual foi feita por capturas. Os únicos textos novos de interface são os do botão do mapa ("Mover o mapa" e "Voltar a rolar a página").

## 10. Arquivos modificados

- **Base:** `index.html` (`interactive-widget=resizes-content`), `src/index.css`
- **Navbar e Hero:** `Navbar.tsx`, `Navbar.css`, `Hero.tsx`, `Hero.css`
- **Seções (só CSS):** `Intro.css`, `Treatments.css`, `Experience.css`, `History.css`, `Reviews.css`, `BookingCta.css`
- **Profissionais:** `Professionals.tsx`, `Professionals.css`, `ProfileCard/ProfileCard.tsx`, `ProfileCard/ProfileCard.css`
- **Contato e rodapé:** `Visit.tsx`, `Visit.css`, `Footer.tsx`, `Footer.css`
- **Modais:** `Dialog.tsx`, `Dialog.css`, `src/booking/BookingDialog.tsx`, `BookingDialog.css`
- **Assets:** `scripts/optimize-assets.mjs`, `public/assets/marca/marca_dagua_or7_480.webp` (novo)
- **Relatório e capturas:** `RELATORIO_MOBILE_V2_2.md`, `capturas-v2-2/` (novos)
- **Removido:** o arquivo acidental `git commit -m feat prototipo premium Parana Implantes`, não rastreado

`src/lib/booking.ts`, `src/data/*` e os testes **não foram alterados**.

## 11. Capturas

Em `capturas-v2-2/`:

| Arquivo | Conteúdo |
| --- | --- |
| `01-hero-antes-depois-375.jpg` | Hero V2.1 e V2.2, em 375 × 812 e 390 × 664 |
| `02` e `03-secoes-375-claro` | Todas as seções, tema claro |
| `04` e `05-secoes-375-escuro` | Todas as seções, tema escuro |
| `06-menu-e-agendamento.jpg` | Menu, etapas do modal e teclado simulado |
| `07-deitado.jpg` | Hero e modal com o celular deitado |
| `08-tablet.jpg` | Hero e modal em 768 e 820 px |

## 12. Para revisar

```bash
npm run dev
```

No celular, na mesma rede: `npm run dev -- --host`, abrindo o endereço de rede que o Vite mostrar.
