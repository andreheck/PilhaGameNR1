# Pacote visual fornecido pelo PM

Autoria atribuída a Claude no guia `CODEX-PILHA-UX.md` entregue por André. Origem: arquivos `pilha-iso (1).js`, `pilha-intro (1).js`, `pilha-intro (1).css`, `pilha-mapa.js` e `pilha-mapa.css` da pasta Versão Beta. Nomes normalizados nesta pasta para evitar sobrescrever os módulos anteriores do repositório.

A integração usa o desenho e a câmera fornecidos. `pilha-mapa.js` recebeu um contrato opcional `model` com `read`, `head`, `body` e `buy`, além de `refresh`. Quando fornecido, a persistência e a economia do protótipo não são iniciadas. A implementação do contrato fica em `../sector-map.js` e `../sector-model.js`, usando os módulos financeiros/temporais existentes.

Outras adaptações: índices compartilhados sem inferências clínicas, marcadores numerados em vez de escores de fatores, atalhos limitados ao mapa, centralização/fechamento acessíveis, atualização dinâmica da preferência de movimento reduzido, preservação de foco e limpeza do contador animado. Abertura tem a identificação de versão atual e isolamento do conteúdo ao fundo pelo host.

Os módulos anteriores na raiz, Three.js, GLBs e rotas da biblioteca foram preservados. A decisão do PM sobre a nova base visual está registrada em `../../docs/releases/TRES-SETORES-2026-10-20.md`.
