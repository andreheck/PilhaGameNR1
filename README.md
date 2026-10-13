# PilhA+ Game — Alpha v1.2

Protótipo educativo mobile-first de gestão e psicoeducação sobre **fatores de risco psicossociais relacionados ao trabalho**. O conteúdo da NR-1 é fundamentado em publicações do Ministério do Trabalho e Emprego (2025–2026). Esta experiência não realiza diagnósticos nem comprova conformidade legal.

## Agora disponível

- **[Missão 01 — Conhecendo a NR-1 no Brasil](https://pilha-plus-game-preview.vercel.app/missao01.html)** — biblioteca interativa, três conceitos, três perguntas, pontuação (0–100) e desbloqueio de aprendizagem.
- **[Visão geral](https://pilha-plus-game-preview.vercel.app/)** — mapa panorâmico isométrico e progresso.
- **[Casos](https://pilha-plus-game-preview.vercel.app/?view=casos)** — Missão 01, Caso 017 jogável e quatro casos em desenvolvimento.
- **[Caso 017 — Galpão Logístico](https://pilha-plus-game-preview.vercel.app/caso017.html)** — investigação, análise, plano de ação, acompanhamento e score fictício ≥75.
- **[Cena 3D experimental](https://pilha-plus-game-preview.vercel.app/scene3d.html)** — movimentação com GLB de personagens e importação local de **galpão GLB**.
- **[Laboratório de modelos 3D](https://pilha-plus-game-preview.vercel.app/viewer3d.html)** — testar os GLBs de personagens.

## Educação + pontuação

**Missão 01:** ler três conceitos (3×20=60), responder três questões (3×10=30) e concluir o percurso (+10). Acesso didático ao Caso 017: **≥70 pontos e ≥2 respostas corretas**. Novos jogadores passam por essa introdução. Jogadores com progresso anterior no caso continuam normalmente (chaves de estado não apagadas). Pode repetir o quiz sem perder o aprendizado já realizado.

**Caso 017:** nota mínima pedagógica 75/100 para cumprir requisito dos casos seguintes, que permanecem indisponíveis enquanto não forem desenvolvidos.

## Conteúdo e modelagem

- `content/mission01.json` — textos, diálogos, perguntas, gabarito, regras e fontes;
- `assets/v12/biblioteca-isometrica.svg` — ambiente vetorial modular provisório;
- `prompts/MESHY-MISSAO-01-ASSETS.md` — personagem gestor-mentor, cena biblioteca e 10 props;
- `docs/SESSAO-21-MISSAO-01.md` — wireflow, arquitetura e cronograma de sessões diárias de 1h;
- `missao01.html`, `mission01.css`, `mission01.js` — implementação do prólogo;
- `intro-gate.js` — proteção de onboarding para jogadores novos;
- `scene3d.html` — teste com GLB do galpão **importado no navegador**, escala normalizada e cache local.

O cenário definitivo do Meshy ainda precisa de **exportação/conversão de FBX para GLB otimizado** e calibração de colisões, pivôs e posições dos personagens. Importação local é experimental; não publica nem envia o arquivo original a servidores.

## QA

`node tests/mission01.test.mjs` e `node tests/static-flow.mjs` validam pontuação, retomada do caso, proteção pedagógica, regressão, assets e conteúdo. Verificação visual com browser automatizado ainda pendente.

## Fontes oficiais

- [MTE — NR-1 atualizada](https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-1)
- [MTE — Manual GRO/PGR 2026](https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/inspecao-do-trabalho/manuais-e-publicacoes/2026/manual_gro_pgr_da_nr_1.pdf)
- [MTE — Guia de fatores psicossociais 2025](https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/guia-nr-01-revisado.pdf)
