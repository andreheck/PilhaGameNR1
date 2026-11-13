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
