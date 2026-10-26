# NPCs do mapa

Atlas transparentes renderizados dos GLBs existentes em `assets/actors/`, sem nova geração ou custo Meshy. Cada imagem tem 1024×768: quatro direções, oito quadros de 128×192 do clipe Walking. Origem e nomes completos dos clipes em `manifest.json`.

Reprodução: servir o repositório e abrir `tools/render-npc-sprites.html`; “Gerar sprites” produz `window.spriteExports`. O gerador normaliza o personagem depois de avaliar o clipe para impedir que a escala da animação recorte o corpo. Não modifica os GLBs. O jogo carrega somente estes PNGs para três NPCs por setor; os demais trabalhadores mantêm a arte do Claude. São figurantes, sem vínculo com os novos visuais dos seis heróis que o PM prepara em outra frente.

## Atualização26/10/2026 — modelos individuais
Beatriz/NPC-16 e Mariana/NPC-07 usam os atlas de assets/npc-sprites/rigged, associados por ID e independentes dos três figurantes históricos acima. Caminhada de ambas e conversa da Mariana vêm dos dois FBXs fornecidos pelo PM, com adaptação entre rigs compatíveis. A geração é reproduzível em tools/render-rigged-npcs.html e tools/render-rigged-npcs.py, executados pelo workflow dedicado. ZIPs originais em tools/npc-rigged-sources não são incluídos no site. Ver docs/releases/NPCS-RIGGADOS-2026-10-26.md.
