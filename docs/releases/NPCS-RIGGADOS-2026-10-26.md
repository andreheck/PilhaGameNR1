# NPCs riggados — Beatriz e Mariana — 26/10/2026

Pedido do PM: substituir os modelos padrão pelos dois personagens animados fornecidos, mantendo-os como NPCs. Continuidade na PR41, branch codex/npcs-fase1-perfis; não autoriza merge.

## Fontes e identificação

Os caminhos Downloads citados não existiam; localizadas cópias com os mesmos nomes nas pastas canônicas NPCs/Amarelo e NPCs/Verde do projeto. Originais preservados. ZIPs íntegros versionados em tools/npc-rigged-sources, excluídos da distribuição pública pelo build atual.

- Meshy_AI_woman_rigged_biped.zip → **NPC-16 / Beatriz**, grupo amarelo: blusa branca, calça escura, cinto/sapatos amarelos e cabelo cacheado, compatíveis com o retrato aprovado. Contém Walking.
- Meshy_AI_Woman_Braids_Rigged_biped.zip → **NPC-07 / Mariana**, grupo verde: blazer verde, calça escura e tranças, compatíveis com o retrato aprovado. Contém Talk Passionately, não Walking.
- SHA256 dos ZIPs e associação por ID em data/continuous/npc-rigged.json. Os retratos, personalidade, cargos, contratações e registros canônicos não foram modificados.

## Integração no mapa

O mapa atual é canvas isométrico. Os FBXs foram renderizados em atlas transparentes de quatro direções, preservando aparência e rig. O jogo usa PNGs leves, sem baixar FBX/texturas4K ou exigir WebGL/Three por personagem no celular. Não é migração do motor para3D ao vivo.

Walking da Beatriz é original. Para Mariana, caminhada adaptada do rig fornecido da Beatriz com SkeletonUtils.retargetClip, preservando posições dos ossos e proporções: **24/24 ossos compatíveis**, sem geração Meshy, sem novas chamadas pagas. [Implementação primária utilizada: Three r180](https://github.com/mrdoob/three.js/blob/r180/examples/jsm/utils/SkeletonUtils.js).

Caminhada em8quadros por direção; conversa da Mariana em64quadros por direção para preservar melhor o gesto. Repouso usa pose congelada dos próprios clipes; não foi inventado um clipe Idle. Pivô no piso calculado pela câmera ortográfica para evitar pés flutuando. Relatório de renderização, clipes, hashes e imagens em assets/npc-sprites/rigged/report.json.

Somente NPC-07 e NPC-16 recebem os novos visuais, também no deslocamento ao pátio e na pausa. Conversa é reproduzida quando Mariana está em pausa; o tipo de personalidade não aciona efeitos clínicos ou novos bônus. Caminhada acompanha o fator de velocidade vigente (60% abaixo55); pausa manual congela o relógio da animação. Fallback padrão permanece se uma imagem não carregar. IDs, quantidade de atores, rotas, câmera, saúde, economia e saves permanecem os mesmos. Nenhuma contratação/reativação automática: os visuais aparecem quando essas pessoas estão ativas.

## Validação

Conversão reproduzível em .github/workflows/npc-rigged-render.yml. Testes de identidade/hash, quadros distintos, animação, conversa durante pausa restaurativa, pausa manual, velocidade reduzida, fallback e ausência de mutação do save. QA padrão de cinco resoluções ampliado para verificar que os cinco atlas carregam e somente os dois IDs renderizam os novos visuais, com quadros avançando.

CI, evidências e SHA publicado serão consolidados na PR após a rodada final. Homologação em aparelhos físicos/Safari continua pendente. Os14outros NPCs mantêm o padrão até o envio e compatibilização de seus próprios modelos; não clonar os dois novos visuais para outras identidades.

## Fechamento validado — 26/10/2026

Código testado e destinado ao site de testes: **837d582e7939fb21259f39e5c06e3d488812f30c**. Branch codex/npcs-fase1-perfis, PR41 aberta, sem merge.

- [Validar jogo](https://github.com/andreheck/PilhaGameNR1/actions/runs/40320220240): aprovado.
- [Equipe viva e calendário](https://github.com/andreheck/PilhaGameNR1/actions/runs/40320220110): aprovado, incluindo npm test, test:continuous, test:living (com cinco regressões próprias dos rigs) e test:npcs.
- **874 verificações de navegador, zero erros**, em320×844,1366×900,390×844,844×390 e1440×900. Confirmados os cinco atlas carregados, dois IDs exclusivos, quadros reais avançando e ambos os NPCs localizáveis no mapa. Os testes anteriores de contratação, pausa, calendário, renda, eventos e progresso continuam aprovados.
- [Conversão reproduzida](https://github.com/andreheck/PilhaGameNR1/actions/runs/40320220168): aprovada. Walking8quadros, Talk64quadros, quatro direções, poses de repouso e pivô vertical0,7919900286 do quadro. Caminhada adaptada com24/24ossos compatíveis.
- [Capturas, relatório e fonte testada](https://github.com/andreheck/PilhaGameNR1/actions/runs/40320220110/artifacts/12648982201), disponíveis até02/11/2026.

Capturas de integração inspecionadas: [Mariana no mapa](../qa/npcs-fase1/rigged-mariana-desktop.png) e [Beatriz no mapa](../qa/npcs-fase1/rigged-beatriz-desktop.png). A renderização mantém o piso, a ordem de profundidade dos móveis, o nome e o indicador de saúde. Os14outros NPCs preservam a aparência anterior. Os testes de navegador são do CI; não alegam homologação física/Safari.

Deployment solicitado no mesmo projeto Vercel de testes: dpl_RTaFTua4nNQcAowCoKy7KE7BEPjU, para https://pilha-plus-game-preview.vercel.app/. Confirmação final do alias e HTTP registrada na PR. Recuperação anterior: dpl_NgiLE6XTpFTFyjVzisrJgXsaNL5P /713ed54. Documentação posterior não altera o código testado acima.
