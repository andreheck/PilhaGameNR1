# PilhA+ Game — Riscos Psicossociais no Trabalho

Jogo educativo de simulação e gestão de riscos psicossociais relacionados ao trabalho, com três perspectivas: **liderança**, **RH/SST** e **trabalhadores**. Mobile-first, exploração de ambientes isométricos e decisões com feedback educacional fictício.

## Experimente a versão Alpha v1.0

- **[Central de gestão — galpão logístico](https://pilha-plus-game-preview.vercel.app/)**
- **[Conheça a equipe — 4 personagens](https://pilha-plus-game-preview.vercel.app/?view=equipe)**
- **[Caso 017 — jornada completa](https://pilha-plus-game-preview.vercel.app/caso017.html)**
- **[Exploração experimental 2.5D](https://pilha-plus-game-preview.vercel.app/game.html)**
- **[Laboratório de personagens 3D](https://pilha-plus-game-preview.vercel.app/viewer3d.html)**

A central de gestão exibe um galpão estático, um mapa de riscos ilustrativo e os quatro personagens aprovados. O menu mantém Missões, Equipe, Biblioteca, Configurações e Sobre. Os Casos 018/019 aparecem como planejamento, não como missões jogáveis.

## Arquivos do produto

| Arquivo | Papel |
|---|---|
| `index.html` | Central de gestão e entrada do jogo |
| `menu.css`, `menu.js`, `v10.css` | Layout responsivo, central de gestão, equipe e preferências |
| `assets/v10/` | Retratos WebP e galpão ilustrado otimizados |
| `caso017.html` | Jornada principal completa com cinco etapas |
| `game.html` | Capítulo 01 com investigação e decisões |
| `viewer3d.html` | Laboratório 3D para importar modelos GLB privados |
| `src/world.js` | Mapa, NPCs, obstáculos e rotas |
| `tests/menu.test.js` | Verificações estáticas das rotas |
| `docs/SESSAO-17-MENU-INICIAL-UX.md` | Wireframes, mapa de navegação, estados e critérios |

## Documentação

- [Sessão 19 — Central de gestão e equipe](docs/SESSAO-19-CENTRAL-DE-GESTAO.md)
- [Sessão 17 — Menu, UX e wireframes](docs/SESSAO-17-MENU-INICIAL-UX.md)
- [GDD](docs/GDD.md) e [simulação](docs/SIMULACAO.md)
- [NR-1 e limites éticos](docs/NR1-ETICA.md)
- [Arquitetura](docs/ARQUITETURA.md) e [direção visual](docs/SESSAO-03.md)
- [Cronograma](planning/CRONOGRAMA.md) e [backlog](planning/BACKLOG.md)
- [Orientações para Codex](AGENTS.md)
- [Biblioteca Drive](https://drive.google.com/drive/folders/1B-mPPAQ1aPbBmAi-e8H21aFxKETnVX19) (acesso restrito)
- [FigJam — fluxo do jogo](https://www.figma.com/board/i2BUcF0vH9CRcdXtvPa0k9)

## Estado atual

A central de gestão é uma interface ilustrada e o Caso 017 possui um fluxo educativo completo de cinco etapas, ainda experimental. A arte isométrica e os avatares do menu são ilustrações provisórias. Os modelos GLB originais permanecem privados no Google Drive e são carregados localmente no navegador pelo laboratório 3D.

> Conteúdo fictício e educativo. Não emite diagnóstico, não comprova conformidade legal com a NR-1 e não substitui avaliação profissional especializada. Licença de lançamento comercial pendente.
