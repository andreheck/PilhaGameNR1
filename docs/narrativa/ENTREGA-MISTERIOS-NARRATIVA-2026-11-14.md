# Coleção de mistérios e narrativa interativa

14/11/2026 · implementação local na branch `codex/unified-social-agenda`.

## Direção visual e arte

As capas MIS-001–003 e MIS-005–010 foram geradas como ilustrações verticais 2:3, dioramas corporativos investigativos, sem texto, títulos ou logotipos incorporados. Os nomes e informações permanecem em HTML acessível e traduzível. A arte aprovada do piloto MIS-004 foi preservada. Arquivos finais: `assets/mysteries/mis-001-cover-v1.png` até `mis-010-cover-v1.png`, incluindo as peças existentes MIS-004. MIS-004 também conserva sua carta de ação `mis-004-action-v1.png`.

Cada capa tem tema, paleta e elemento central próprios conforme a tabela de direção de arte em `COLECAO-MISTERIOS-DIRECAO-E-PRODUCAO-2026-11-12.md`. O catálogo de conteúdo, narrativas, diálogos e escolhas fica em `ui/mystery-cases.js`; a galeria e o mural ficam em `ui/mystery-gallery.js` e `.css`.

## Fluxo narrativo implementado

- Coleção com dez casos, filtros para todos, não iniciados, em investigação e desvendados.
- Mural com quatro fragmentos por caso, fios de conexão e progresso persistido em uma chave separada do progresso da empresa.
- Ao abrir um fragmento, a narrativa é digitada na tela. Há ação para revelar o texto completo; leitores com movimento reduzido recebem o texto sem animação.
- Os casos são ficcionais. MIS-004 mantém contexto histórico e fontes externas já documentadas; as outras histórias não são atribuídas a fatos reais.
- A resolução exige uma escolha numa conversa final. Escolhas sem apoio nas pistas dão retorno e permitem nova tentativa.

## Prova temporária MIS-003

Ao abrir o segundo fragmento, uma sequência visual fica disponível por 60 segundos. Depois, o conteúdo visual desaparece e a pista passa a explicar o próximo passo sem repetir a resposta: ir ao Escritório, caminhar até uma mesa de trabalho e usar “Interagir”. A ação real no mapa marca a etapa de campo no progresso do mistério. Reabrir o arquivo libera a conversa final.

O cronômetro usa tempo real e continua enquanto o arquivo está aberto; a contagem salva permanece expirada ao reabrir. A mecânica não altera saúde, saldo ou semana. A sequência atual é uma demonstração editorial e pode ser ajustada após observar a dificuldade com jogadores.

## Compatibilidade e limites

A chave `pilha-mystery-collection-v2` guarda o progresso novo. O progresso anterior de MIS-004 em `pilha-mystery-pilot-v1` é migrado para a coleção sem apagar o registro antigo nem reescrever o save da empresa.

As escolhas finais aparecem como conversa narrada no dossiê, ainda sem interlocutor NPC visível e abordável no mapa. O deslocamento físico implementado nesta etapa é a ida até a mesa do Escritório no desafio MIS-003. Próxima etapa recomendada: ligar cada conversa final à busca e abordagem de um ator NPC identificado no runtime, preservando acessibilidade e rotas alternativas.

## Arquivos alterados

- `assets/mysteries/mis-00X-cover-v1.png` — capas sem texto.
- `ui/mystery-cases.js` — conteúdo dos dez casos.
- `ui/mystery-gallery.js` / `ui/mystery-gallery.css` — coleção, mural, texto digitado, escolhas e desafio de memória.
- `ui/player-exploration.js` — encaminha o objeto de campo junto com a ação realizada.
- `ui/continuous-game.js` — abre o painel de exploração no destino e registra a interação de campo.

## Validação e publicação

Não foi feito merge nem publicação. `npm run build` concluiu com sucesso após a integração. Não executei testes automatizados nem QA visual nesta rodada. Os roteiros de QA visual e de jogabilidade permanecem para a próxima etapa; as capas não contêm texto e não dependem de idioma.
