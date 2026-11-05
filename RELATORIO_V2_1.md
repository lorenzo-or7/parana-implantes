# Relatório V2.1 — Paraná Implantes (refinamento pontual)

Data: 04/11/2026 · **Sem commit, sem push, sem deploy.** A V2 e a V2.1 estão só na cópia local, e o GitHub Pages continua na versão publicada anteriormente.

Base: V2 (`RELATORIO_V2.md`). Só as seis correções pedidas foram feitas. As demais áreas não foram tocadas.

## Resumo das seis correções

1. **Hero:**
   - Novo título: "Cuidar do seu sorriso também é cuidar de você."
   - Novo subtítulo: "Tecnologia, acolhimento e atenção personalizada em cada etapa do seu cuidado."
   - Para caber a copy mais longa:
     - o bloco do título passou de 11ch para 12,5ch;
     - a escala máxima passou de 5rem para 4,6rem;
     - o subtítulo ganhou 38ch de largura.
   - As quebras são naturais, sem `<br>` forçado. Em 1440px o título ocupa 4 linhas, em 390px 3 linhas.
   - Foto, layout dividido, Cinematic Reveal, Parallax Depth, Magnetic CTA e botões não mudaram.
2. **Imagens no agendamento:**
   - Cada opção da etapa "Tratamento" virou um card compacto com miniatura da foto real (76 × 52 px, ou 60 × 44 px abaixo de 420px), nome e indicador circular.
   - "Outro / Não sei" usa um quadro neutro tracejado com ícone de dúvida, sem foto.
   - Estados:
     - hover com borda discreta;
     - selecionado com realce champagne (mais forte no tema escuro) e indicador preenchido;
     - foco por teclado com contorno.
   - O card inteiro é o `<label>` do rádio: clicar em qualquer ponto seleciona e as setas do teclado funcionam.
   - Duas colunas no desktop (o modal foi de 940 para 1000px, para os nomes caberem melhor) e uma coluna no mobile, com o botão Continuar fixo no rodapé.
   - **Lógica, validações, campos, resumo e mensagem não mudaram.** A única mudança de dados é que `BOOKING_OPTIONS` agora também leva `image` e `focus`, vindos de `TREATMENTS`.
3. **Ambientes:**
   - Cabeçalho no padrão editorial do site: título à esquerda, texto de apoio à direita.
   - Galeria equilibrada: recepção (7/12) e consultório (5/12) **com a mesma altura de moldura**, e legendas logo abaixo, alinhadas.
   - Em 1440px as fotos aparecem com 730 × 540 e 522 × 540 px, abaixo do tamanho original (1024 × 1017 e 851 × 1024), sem ampliação.
   - `object-position` ajustado para manter letreiro, balcão, cadeira e refletor no quadro.
   - No mobile, as fotos ficam empilhadas na mesma largura, ambas em 5:4.
4. **"Estrutura da clínica" removida:**
   - O bloco e a lista `STRUCTURE` saíram de `Experience.tsx`, e o CSS correspondente foi apagado.
   - Nada foi movido para outro lugar e não sobrou espaço vazio.
   - Alguns desses fatos já existiam fora do bloco e continuam onde estavam (pilares da introdução e "Visite-nos").
5. **História (Heritage Editorial — Paraná Signature):**
   - **O selo branco com a logo secundária saiu da seção.** O arquivo continua em `public/assets/marca/` e no favicon.
   - O arco decorativo da V2 também saiu.
   - Nova composição:
     - **Linha 1:** "2014" em grande escala com a legenda "Ano de fundação, em Curitiba". Um fio vertical o separa do título e do texto de abertura.
     - **Linha 2:** três capítulos em colunas (A ideia / O jeito de atender / Hoje), separados por fios finos e marcados por traço champagne.
     - **Linha 3:** os dois fundadores com retrato pequeno, nome e papel (Cofundadora/Cofundador, dado já existente), mais o link "Conheça os profissionais".
   - Os textos são os mesmos da V2, sem fatos novos.
   - Abaixo de 900px a leitura fica vertical, com o ano acima do título, sem sobreposição.
6. **Assinatura Or7:**
   - Saiu da faixa isolada no fim da página e foi para o **bloco da marca, abaixo da logo manuscrita e do texto institucional**.
   - Tamanho:
     - 200 × 67 px no desktop e no tablet (antes, 44px de altura);
     - 180px de largura no mobile.
   - Imagem original, proporção preservada, alinhada à esquerda, sem caixa extra.
   - Em tablet (≤ 1023px) o bloco da marca ocupa a linha inteira e fica empilhado: logo, texto, Or7.

## Arquivos modificados na V2.1

- `src/components/Hero.tsx`, `Hero.css`
- `src/booking/BookingDialog.tsx`, `BookingDialog.css`
- `src/data/treatments.ts` (`BOOKING_OPTIONS` com `image`/`focus`)
- `src/components/Experience.tsx`, `Experience.css`
- `src/components/History.tsx`, `History.css`
- `src/components/Footer.tsx`, `Footer.css`
- `RELATORIO_V2_1.md` (este arquivo)
- `.impeccable/config.json`: criado pelo hook de design ao registrar um falso positivo na barra de progresso do agendamento (fim da V2)

## Testes executados

| Teste | Resultado |
| --- | --- |
| `npm run typecheck` | sem erros |
| `npm run lint` | 0 erros, 1 aviso conhecido (`slowUntil` no motor original do Profile Card) |
| `npm test` | 10/10 passando |
| `npm run build` | ok. JS 442,5 kB (140 kB gzip), CSS 53 kB (11,2 kB gzip) |
| Build de produção (`vite preview`) | 0 requisições com erro, 0 imagens quebradas, logo 200, assinatura Or7 carregada (2048px original, exibida em 200 × 67), selo secundário ausente da página, nenhum `href="#"`, todos os `target=_blank` com `noopener` |
| Console | sem erros (dev e produção) |
| Agendamento completo (tema claro) | Lipo de papada → nome/telefone → "Prefiro combinar a data" + Manhã → revisão com resumo correto → consentimento. A URL gerada (com `window.open` simulado) bate com o modelo |
| Teclado na etapa de tratamento | Enter na CTA da navbar abre o modal. ArrowDown ×2 seleciona "Ortodontia convencional" |
| Tema escuro | modal, galeria, história e rodapé conferidos por captura. O realce da seleção foi reforçado após a revisão |
| Rolagem horizontal | nenhuma em 360, 390, 430, 768, 1024 e 1920px (`scrollWidth ≤ innerWidth`) |
| Capturas reais | 1440px (hero, ambientes, história, rodapé, modal claro e escuro), 1920px (hero), 768px (rodapé), 390px (hero, modal, ambientes, história, rodapé) |

**Problemas encontrados e corrigidos durante a verificação:**
- Em 768px, o bloco da marca no rodapé ficava em 3 colunas e a assinatura sobrepunha o texto. Passou a ficar empilhado.
- No tema escuro, o card selecionado ficava pouco distinto. O realce champagne foi aumentado.

**Não verificado:**
- `prefers-reduced-motion` emulado: o painel não permite a emulação. O código da V2 que desliga as animações não mudou.
- Leitor de tela.
- Dispositivos físicos.
- FPS real: o painel do navegador estava oculto.
- O WhatsApp real não foi aberto.
- 1440px não foi medido por script nesta rodada, só conferido visualmente.

## Pendências

- Continuam as pendências de conteúdo de `RELATORIO_ENTREGA.md`: WhatsApp, telefone fixo, CRO, credenciais, direitos de imagem, depoimentos, licença do React Bits.
- Mapa do Google e consentimento LGPD: ver `RELATORIO_V2.md`.
- As miniaturas do agendamento recortam faixas de 546 × 197 px. Em telas retina ficam levemente macias. Fotos maiores dos tratamentos melhorariam as miniaturas e os cards.
- Arquivo solto na raiz: `git commit -m feat：prototipo premium Parana Implantes`. Não foi tocado.

## Evidências visuais

As capturas foram feitas no painel do navegador durante a sessão. Não foram salvas como arquivo no projeto.
