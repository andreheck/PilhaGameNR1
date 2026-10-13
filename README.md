# PilhA+ Game — Riscos Psicossociais no Trabalho

Jogo educativo de simulação e gestão de riscos psicossociais relacionados ao trabalho, com três perspectivas: **liderança**, **RH/SST** e **trabalhadores**. Mobile-first, exploração de ambientes isométricos e decisões com feedback educacional fictício.

## Experimente a versão Alpha v0.9

- **[Tela inicial e navegação](https://pilha-plus-game-preview.vercel.app/)**
- **[Capítulo 01 — Caso 017](https://pilha-plus-game-preview.vercel.app/game.html)**
- **[Laboratório de personagens 3D](https://pilha-plus-game-preview.vercel.app/viewer3d.html)**

O novo menu contém Missões, Equipe, Biblioteca, Configurações e Sobre. Os Casos 018/019 aparecem como planejamento, não como missões jogáveis.

## Arquivos do produto

| Arquivo | Papel |
|---|---|
| `index.html` | Tela de entrada do jogo |
| `menu.css`, `menu.js` | Layout responsivo, navegação e preferências |
| `game.html` | Capítulo 01 com investigação e decisões |
| `viewer3d.html` | Laboratório 3D para importar modelos GLB privados |
| `src/world.js` | Mapa, NPCs, obstáculos e rotas |
| `tests/menu.test.js` | Verificações estáticas das rotas |
| `docs/SESSAO-17-MENU-INICIAL-UX.md` | Wireframes, mapa de navegação, estados e critérios |

## Documentação

- [Sessão 17 — Menu, UX e wireframes](docs/SESSAO-17-MENU-INICIAL-UX.md)
- [GDD](docs/GDD.md) e [simulação](docs/SIMULACAO.md)
- [NR-1 e limites éticos](docs/NR1-ETICA.md)
- [Arquitetura](docs/ARQUITETURA.md) e [direção visual](docs/SESSAO-03.md)
- [Cronograma](planning/CRONOGRAMA.md) e [backlog](planning/BACKLOG.md)
- [Orientações para Codex](AGENTS.md)
- [Biblioteca Drive](https://drive.google.com/drive/folders/1B-mPPAQ1aPbBmAi-e8H21aFxKETnVX19) (acesso restrito)
- [FigJam — fluxo do jogo](https://www.figma.com/board/i2BUcF0vH9CRcdXtvPa0k9)

## Estado atual

A tela inicial e o Capítulo 01 são protótipos navegáveis. A arte isométrica e os avatares do menu são ilustrações provisórias. Os modelos GLB originais permanecem privados no Google Drive e são carregados localmente no navegador pelo laboratório 3D.

> Conteúdo fictício e educativo. Não emite diagnóstico, não comprova conformidade legal com a NR-1 e não substitui avaliação profissional especializada. Licença de lançamento comercial pendente.
