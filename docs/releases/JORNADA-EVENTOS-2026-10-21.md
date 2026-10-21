# Jornada inicial, empresa viva e eventos — 21/10/2026

## Base e autorização

Branch `codex/jornada-npcs-empresa`, derivada de `1340f4aba86761643921268a76eda0de346edfde`, publicado pela PR #28 no projeto de testes `pilha-plus-game-preview`. A PR desta entrega deve apontar para `codex/ux-tres-setores`; não presumir que a main contém o runtime publicado. Fetch anterior ao fechamento confirmou a referência e PR #22 em `b7a9113`. A ficha de RS & TD foi reconciliada seletivamente, sem importar o motor antigo ou a futura economia mensal.

O PM solicitou esta jornada, movimento, NPCs, conexões, alertas e mobiliário; depois autorizou explicitamente publicar a versão operacional no Vercel e enviou o pacote Claude C2. Isso autoriza o deploy no endereço de testes, sem merge das PRs. Os novos visuais dos seis heróis estão em outra frente do PM.

## Entrega e critérios

- Entrada: marca → cenário/objetivo → ações e orçamento → apresentação dos seis perfis → escolha persistida de principal e apoio → mapa. Cancelar, duplicar herói ou falhar ao salvar não libera o mapa. Retorno preserva a dupla congelada no ciclo.
- Logo PNG enviada pelo PM e três orbes coloridos na abertura e marca do convite. A animação respeita o sistema por padrão; o jogador pode ativar explicitamente no jogo. Corrigida a regra global antiga que anulava esse opt-in. Controle equivalente e persistido no mapa; a preferência não muda o sistema operacional.
- Três NPCs por setor renderizam o Walking dos GLBs existentes. O restante da população mantém o desenho do Claude. PNGs em quatro direções dispensam WebGL no mapa e não substituem as artes futuras dos heróis.
- Setores ligados por corredores visíveis. Alertas de observação fictícia voltam sobre trabalhadores, inclusive no modo estático. Móveis instalados, cadeiras, sofás, mesas e quadros mudam o ambiente. Cores do cenário comunicam instalações; as quatro notas temporais continuam graduais.
- Catálogo Claude C2: 19 eventos e cinco categorias; alerta → contexto → impacto → decisão → consequência. Estrutura visual e CSS preservados; adaptador com dialog nativo contém foco e torna o restante da aplicação inerte. Sem limite para leitura e sempre uma escolha gratuita. Escape cancela simulação/catálogo ou fecha consequência; decisão real pede uma resposta.
- Evento real e custo são persistidos na mesma transação local do orçamento de inventário/formação. Decisão repetida ou concorrente não cobra duas vezes. Recarregar retoma decisão/consequência sem reaplicar impacto. Falha de armazenamento não declara sucesso. Simular preserva integralmente o estado econômico.
- Cadência: 10 minutos completos de ciclo ativo após a instalação da camada de eventos, inclusive em saves antigos. Depois, intervalos alternados de 15 e 20 minutos ativos; contagem visível. Comprar não acelera o tempo. Não abrir durante outra janela, introdução ou aba oculta. O ciclo pausa na ocorrência real e “Continuar e retomar ciclo” retoma quando pertinente. Catálogo permite QA imediato.
- Proteções usam os IDs canônicos das melhorias. Efeitos favoráveis no cenário persistem; negativos perdem 25% por semana ativa (uma hora real no motor existente). Inflação/juros mudam preços de melhorias, com cotação e débito iguais nas duas lojas; formação mantém sua própria tabela. Custos financeiros não são reembolsados ao reiniciar apenas mobiliário.

## Compatibilização do Claude

Os arquivos foram movidos pelo usuário de Downloads para `Pilha Game/Versão Beta/C2` durante a sessão e recuperados nessa pasta. `ui/claude/pilha-eventos.js` e `.css` preservam o catálogo e o CSS originais. SHA256 do JS: `F6B0DDB37321DA0F3B0DB3E2461BFF992E91C3AA68EE7B6D7716F283453C3982`. `node tools/import-event-catalog.mjs` reproduz o módulo de dados. O adaptador fica em `ui/adverse-events.js`, e a lógica pura em `simulation/adverse-events.js`.

Não foram importadas as regras conflitantes do protótipo: uma compra não equivale a uma semana, não há orçamento paralelo `pilha-mapa-v1`, três níveis por setor ou substituição das notas canônicas por fatores visuais. Os preços/efeitos dos 19 eventos foram preservados; a cadência mais lenta foi ajustada conforme solicitação do PM. O guia do Claude é referência de implementação, não substitui a governança PM/PO.

## Verificação

Suíte de 17 arquivos em `package.json`, mais checks de sintaxe e `git diff --check`. Novos testes cobrem dupla, preferência de movimento, frames dos NPCs, instalação idempotente, os 19 eventos com todas as decisões, orçamento zero, transações repetidas/concurrentes, armazenamento inválido, cotação inflacionada e carência para saves antigos. Log em `docs/qa/evidence/player-experience/tests.txt`.

Navegador: fluxo novo completo; cancelamento e herói duplicado; retorno preservado; compras de ergonomia/pausas/escuta (saldo 10.000 → 6.100) com notas temporais intactas na instalação; início de ciclo; acesso ao Caso 01; os 19 eventos simulados com estado econômico idêntico antes/depois e console sem erros. Fixture local de ocorrência real: retomada após reload, Escape preserva decisão, Enter confirma, saldo 6.100 → 5.300 uma vez. Telas desktop 1280×800/1440×900 e móvel cerca de 390×844; sem overflow horizontal no cartão do evento. Capturas na mesma pasta. A captura com emulação CDP maior que o viewport nativo produziu mosaico; foi substituída por capturas com viewport real.

## Limitações e pendências

Não há novos poderes temporais dos heróis, backend ou economia financeira mensal. Os seis fatores dos eventos afetam o cenário ilustrativo e o caixa; não alteram retroativamente notas pedagógicas nem representam probabilidades de adoecimento. Não foi feita auditoria Lighthouse ou teste com leitor de tela dedicado. Persistência local continua sendo protótipo; fallback de transação sem Web Locks tem garantia apenas em uma aba. Novos visuais dos heróis, homologação pelo PM/PO e merge permanecem pendentes. Publicação e SHA final devem constar na PR e no relatório final.
