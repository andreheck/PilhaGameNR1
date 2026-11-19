# Embalagens do personagem e contratação — 14/11/2026

## Experiência atualizada

- Na escolha inicial do explorador, o catálogo deixa as embalagens menores em uma lista à esquerda e amplia a embalagem selecionada no painel à direita.
- O painel do explorador separa Perfil, Competências e Visão de trabalho em abas horizontais. A troca por mouse, foco e setas mantém a seleção inicial sem salvar até o jogador confirmar.
- Na contratação inicial, escolher gerente ou funcionário mantém a escolha e abre sua embalagem ampliada. A ficha traz abas de Perfil, Contribuições e Apoios, os traços simulados já existentes e um lema editorial do personagem.
- Os lemas estão em `data/continuous/character-mottos.js` para três exploradores e os 16 NPCs. São frases ficcionais de apresentação; não alteram personalidade, saúde, hierarquia, sinergia ou simulação.
- A visualização ajusta a escala para desktop/tablet e mantém o catálogo empilhado em telas estreitas. Há suporte a movimento reduzido.

## Verificações

- `node --check` em `ui/player-character-catalog.js`, `ui/continuous-game.js` e `data/continuous/character-mottos.js`.
- `node --test tests/player-character.test.mjs tests/initial-hiring.test.mjs`: 13 testes passaram.
- `npm run build`: passou.
- `git diff --check`: passou.
- A captura/inspeção visual com Computer Use foi interrompida pelo ambiente ao tentar abrir o endereço local; não foi possível registrar evidência renderizada nesta rodada. O browser do usuário não foi navegado nem alterado após esse bloqueio.

## Limites

Nenhuma regra de contratação, perfil canônico, poder, raridade, estado salvo ou mecânica de equipe foi alterada. Não houve publicação/novo deploy nesta entrega. A inspeção final de layout em janela desktop/tablet continua pendente.
