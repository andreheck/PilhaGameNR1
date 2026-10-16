# Revisão técnica do GitHub — 16/10/2026

## Estado confirmado na revisão
Os PRs #2 a #9 foram encontrados como merged na `main`. Em conjunto, eles já entregam:
- hub 3D expandido, setores e mobiliário CC0;
- missão de liderança (Caso 018) e feedback emocional;
- rotinas autônomas, seis estados narrativos e retorno ao setor;
- decisões de gestão protect/delay/dismiss, indicadores sintéticos de 30 dias e persistência em localStorage;
- primeiros retângulos de colisão, limites de movimento e paredes mais legíveis;
- testes automatizados de mecânicas e integração.

Referências:
- PR #8: https://github.com/andreheck/PilhaGameNR1/pull/8
- PR #9: https://github.com/andreheck/PilhaGameNR1/pull/9
- commit de estados/consequências: https://github.com/andreheck/PilhaGameNR1/commit/83d99bc91afb898c6db87a4d77c5d2de40c6d33e
- commit de guardrails de colisão: https://github.com/andreheck/PilhaGameNR1/commit/eb8907bdac73cf4ff428345b0939709d0f5ca90a

## Risco encontrado
O helper de movimento na `main` verifica limites e se a posição de destino cai dentro de um retângulo de colisão. Uma verificação só no destino pode falhar em movimentos maiores (o segmento entre origem e destino pode atravessar um obstáculo mesmo que os dois extremos estejam livres).

## Correção proposta nesta branch
A branch `fix/navigation-segment-collision` adiciona `simulation/navigation.js`:
- amostragem do segmento entre posição atual e destino;
- margem de segurança por raio do personagem;
- deslizamento por eixo alternativo quando o caminho direto bloqueia;
- respeito aos limites do escritório.

O helper está ligado ao `safeStep` de `world3d.js`. Foram adicionados `tests/navigation-collision.test.mjs` e sua execução no `npm test`. PR de revisão: https://github.com/andreheck/PilhaGameNR1/pull/11.

## O que ainda não está confirmado
- A execução do workflow CI para o novo commit ainda não foi observada nesta revisão.
- Não foi feito teste manual real em navegador nesta revisão.
- A verificação é geométrica em planta X/Z com retângulos estáticos; não é um grafo de navegação nem colisão completa com os volumes reais de cada GLB/móvel.
- É necessário testar as rotas de cada personagem, retorno ao setor, cantos/corredores e responsividade; inspecionar o console e a experiência real no preview.

## Próxima sequência
1. Esperar CI do PR #11 e corrigir qualquer falha.
2. Abrir o preview gerado para o PR e testar em desktop e celular.
3. Se a navegação estiver estável, mapear os corredores por waypoints/grafo, usando os limites e objetos reais.
4. Rever o PR #10 separadamente: ele foi criado sobre uma branch psicossocial anterior e pode duplicar estados/consequências que já estão na `main`. Não o mesclar automaticamente.
5. Só depois ampliar animações/rotinas e efeitos persistentes. Não fazer merge nem deploy de produção sem autorização explícita.
