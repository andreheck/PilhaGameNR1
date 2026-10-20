# Três setores — integração visual aprovada pelo PM

Data: 20/10/2026. PM: André; PO: conversa de gestão do ChatGPT; executor: Codex.

## Decisão e base

Após PG-001, André autorizou: “pode seguir! esses 3 setores serão a nova base visual!!”. Esta entrega adota Escritório, Produção e Atendimento do pacote Claude. A decisão substitui a exigência anterior de salão único na apresentação principal. Não autoriza merge ou publicação.

Branch de trabalho: `codex/ux-tres-setores`. Base: PR #27, `171b396ef010fa434eb5d5fbf627c74ed3e9276d`, cujo runtime coincide com PR #26/`93e2d61`. PG-001 e seus logs registrados no commit `3e3e581`. O checkout antigo com alterações não publicadas foi preservado. Não há alterações em `simulation/*`, `world3d.js`, preços, taxa temporal, avaliação ética ou formato dos dados existentes.

Conferência remota adicional durante a implementação encontrou a PR #22 avançando de `76e02ef` para `1737278d5ace4f3091f27894166189ac0a61d350`, com a ficha aprovada da Psicóloga. Foram lidas e incorporadas seletivamente as fichas de Psicóloga e P&D Tech e seu índice. Nenhum motor antigo da PR #22 foi importado.

## Entrega

- Abertura e três dioramas isométricos do Claude, com cores marinho/dourado, câmera, seleção, zoom, pessoas circulando e alternativa estática por preferência de movimento reduzido.
- Módulos recebidos preservados em `ui/claude/`; alterações de integração explícitas por um contrato opcional `model`. A versão isolada do fornecedor continua separada das regras financeiras do jogo.
- `ui/sector-model.js` adapta o catálogo financeiro existente. Uma instalação atende à empresa inteira, com uma única transação local do orçamento compartilhado com a formação. Não inicia uma segunda carteira em `pilha-mapa-v1` nem importa/reset dados desse protótipo.
- Índices vêm dos quatro eixos do ciclo vigente. O painel explica que são compartilhados pela empresa; não simula índices independentes por setor nem mostra percentuais fictícios de afastamento. Os seis marcadores coloridos do diorama são áreas de observação, numeradas, e não seis medidas quantitativas novas.
- Instalação visível no inventário e onda de feedback no mapa; os efeitos do modelo continuam graduais. Custos e propriedade continuam os 12 recursos atuais, sem acrescentar três níveis de compra por setor.
- Cinco casos preservados. Agrupamento apenas visual: Produção → 01/03; Escritório → 02/05; Atendimento → 04. Conteúdo, ordem e bloqueios continuam nos módulos existentes.
- Central do acionista abre Casos, Equipe, Inventário, Biblioteca e Progresso. Os diálogos, escolhas, prólogo opcional, orçamento, XP, formação e faixa de dupla/nível/tempo continuam acessíveis. Painéis e diálogos recebem o tema do mapa.
- Documentação e conceitos atuais de P&D Tech (Lendário) e Psicóloga (Épico) exibidos sem inventar execução. O catálogo temporal continua somente com os dois poderes do Diretor. RS & TD permanece com ficha individual pendente.
- Teste `static-flow.mjs` normaliza CRLF na leitura para eliminar a falha de portabilidade encontrada na PG-001, mantendo as mesmas asserções.
- Teclas de mapa restritas ao canvas, Escape fecha a seleção do setor, 0 e centralizar enquadram a empresa, controles equivalentes ficam no DOM. O modo estático responde a câmera e seleção.

## Evidências reais

Ambiente: Windows/PowerShell, Node v24.18.1, arquivos servidos somente em localhost. Sem novas dependências.

- Todos os 15 scripts do `package.json` executados individualmente, exit code 0; `npm.cmd test` e chamada direta do CLI npm também terminaram com exit code 0. Logs e resumo em `docs/qa/evidence/three-sectors/`.
- Sete testes novos cobrem: mapeamento dos cinco casos, conceitos sem ativação de P&D/Psicóloga, saldo compartilhado com formação, duplicação/concorrência, falha de storage, preservação de dados e ausência de efeito/tempo instantâneo.
- `node --check` nos 55 JS/MJS rastreados da base e seis novos arquivos: aprovado; checagem adicional dos 13 arquivos JS/MJS alterados/novos depois dos ajustes: aprovada.
- `git diff --check`: aprovado, com avisos do Git de conversão LF/CRLF, sem erro de whitespace.
- Navegador in-app: abertura → mapa → setor → compra → recarga; saldo 10.000 → escuta 900 → 9.100 → formação Diretor 500 → 8.600. Dupla Diretor/P&D salva e congelada ao iniciar ciclo; nível refletido na faixa. XP das quatro decisões adequadas levou o apoio ao nível 2 sem novo débito.
- Caso 01 percorrido com escolhas 1/0/0/1: plano 100/100, feedback específico e fechamento ainda dependente do ciclo; nenhum avanço de 30 dias.
- Câmera/seleção e teclas 0/1/3/Escape verificadas no modo estático. Capturas finais e medidas em 320×844, 390×844 e 1440×900 CSS px, sem rolagem horizontal. O navegador usa zoom efetivo de 94%; a emulação foi compensada e `viewport-*.json` registra as medidas CSS, separadas do tamanho físico dos PNGs. Uma rodada preliminar usou 1531×957 CSS px.
- Capturas normais antes/depois confirmam deslocamento dos personagens. O navegador tinha `prefers-reduced-motion: reduce` ativo; foi emulado `no-preference` apenas para o teste e depois restaurado. Modo reduzido permanece estático por acessibilidade.
- Console consultado durante os fluxos: nenhuma exceção/aviso registrado. Captura padrão do navegador indisponível; evidências PNG obtidas pela capacidade CDP do mesmo navegador.
- Reteste final sem cache confirmou ALPHA 1.5 na abertura, conteúdo de fundo inerte durante a apresentação, entrada/foco restaurados, orçamento 8.600, dupla/níveis e ciclo pausado em 00:08:29 preservados após navegação. Não foi alegado teste de sessão longa.

As capturas e os logs descrevem estes testes locais, não a versão pública nem uma homologação em aparelho físico.

## Limites e decisões pendentes

- Pessoas do mapa usam a arte canvas do Claude. Os GLBs aprovados permanecem nos arquivos e na biblioteca 3D/rotas existentes; esta entrega não os transforma em sprites ou substitui a arte por modelos improvisados.
- O mapa não implementa uma nova economia por setor, três níveis de recurso ou novos coeficientes. Esses itens do protótipo exigem um pacote de produto específico caso sejam desejados.
- Os índices permanecem compartilhados pelo ciclo; dados e intervenções realmente independentes por setor exigem contrato e migração aprovados.
- Mantêm-se PG-002 (sessão longa/abas/storage em navegador), PG-004 (unificação do Caso 01), revisão de silence/fontes, balanceamento, dispositivos físicos, leitor de tela e Lighthouse. Não foi declarada homologação de 4h17 de sessão contínua, WCAG ou desempenho em hardware de entrada.
- Elétrons continuam apenas documentados; sem conexão com o App, dinheiro ou dados reais.

## Revisão e publicação

PR incremental deve usar `docs/governanca-pm-po-codex` como base, preservando a cadeia aberta de contribuições e a main. `vercel.json` bloqueia deploy automático **somente** de `codex/ux-tres-setores`, usando `git.deploymentEnabled` documentado em https://vercel.com/docs/project-configuration/git-configuration . Não altera as regras de outras branches. Assim é possível revisar a PR sem tratar push como autorização de site novo.

Próxima decisão: parecer do PO e autorização do PM para integrar/publicar esta entrega. Quando autorizada, liberar a branch ou executar publicação explícita do commit revisado no projeto de testes, validar novamente o deployment e só então informar o endereço atualizado. A configuração local de proteção de deploy não substitui essa decisão.
