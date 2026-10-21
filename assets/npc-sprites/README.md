# NPCs do mapa

Atlas transparentes renderizados dos GLBs existentes em `assets/actors/`, sem nova geração ou custo Meshy. Cada imagem tem 1024×768: quatro direções, oito quadros de 128×192 do clipe Walking. Origem e nomes completos dos clipes em `manifest.json`.

Reprodução: servir o repositório e abrir `tools/render-npc-sprites.html`; “Gerar sprites” produz `window.spriteExports`. O gerador normaliza o personagem depois de avaliar o clipe para impedir que a escala da animação recorte o corpo. Não modifica os GLBs. O jogo carrega somente estes PNGs para três NPCs por setor; os demais trabalhadores mantêm a arte do Claude. São figurantes, sem vínculo com os novos visuais dos seis heróis que o PM prepara em outra frente.
