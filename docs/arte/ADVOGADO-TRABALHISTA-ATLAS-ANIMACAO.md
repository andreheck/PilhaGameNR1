# Advogado Trabalhista — modelagem 3D, rig e animação

**Status:** direção visual aprovada; modelagem, rigging e animação ainda não executados nem validados no runtime.  
**Issue:** #73  
**Branch:** `feat/advogado-trabalhista-sprite-spec`

## Decisão de produção

O personagem será produzido como **modelo 3D com esqueleto (armature/rig)** e animações reutilizáveis. A câmera isométrica 2D será uma forma de apresentação do mundo 3D (ou renderização do personagem), não motivo para construir um atlas 2D independente. Não produzir spritesheet como ativo principal.

## Identidade visual

- Homem negro, cabelo trançado preso em coque (cock/bun), óculos.
- Terno azul-marinho, camisa branca sem gravata, sapatos sociais escuros.
- Aparência profissional, contemporânea, acessível e confiante.
- Manter rosto, tom de pele, penteado, óculos e proporções consistentes em todas as animações.

## Especificação do modelo

### Malha e apresentação
- Personagem humanoide estilizado, proporções e nível de detalhe compatíveis com os demais personagens do jogo.
- Topologia limpa e deformável, com loops suficientes em ombros, cotovelos, quadris, joelhos, pescoço e rosto.
- Geometria separada quando facilitar rig/deformação: corpo, cabelo/tranças, óculos, paletó, camisa, calça e sapatos. Evitar peças soltas que atravessem o corpo.
- Materiais PBR simples e econômicos, sem transparências desnecessárias; paleta azul-marinho, branco e tons naturais.
- Cabelo trançado preso em coque modelado de forma legível na câmera de jogo, sem excesso de polígonos.
- Óculos presos à cabeça/face por parent ou bones adequados, sem escorregar durante movimentos.
- Mãos com dedos simplificados, suficientes para gestos e interação.

### Rig humanoide
- Hierarquia central: root, pelvis/hips, spine, chest, neck, head.
- Membros: clavicles, upper arms, forearms, hands; thighs, shins, feet e toes.
- Controles IK para mãos e pés, pole targets para cotovelos/joelhos e controle global de locomoção.
- Pesos de skinning revisados em ombros, virilha, cotovelos e joelhos.
- Root motion desabilitado por padrão; deslocamento no mapa controlado pelo sistema de navegação do jogo, salvo se o runtime existente exigir outra convenção.
- Definir orientação frontal e eixos do modelo de acordo com o padrão já usado pelos atores atuais. Não presumir +Y/+Z ou eixo frontal sem auditar os assets e o loader.

## Animações mínimas do primeiro pacote

1. **Idle** — respiração sutil e postura neutra.
2. **Walk** — ciclo de caminhada em loop.
3. **Run** — ciclo de corrida em loop.
4. **Turn / start-stop** — transições ou blend apropriado para mudança de direção e início/parada.
5. **Talk / explain** — gestos contidos para mediação e orientação.
6. **Point** — apontar para documento, setor ou elemento da interface/mundo.
7. **Interact** — alcançar/consultar documento ou objeto.
8. **Sit / work** — sentar e trabalhar ao computador, em pacote posterior.

As animações de locomoção devem funcionar em qualquer direção por rotação do personagem no mundo, não por oito conjuntos direcionais duplicados, a menos que a câmera, o modelo ou o pipeline atual imponham uma necessidade específica.

## Exportação e integração

- Formato de intercâmbio preferencial: glTF 2.0 / GLB, com malha, armature, materiais e clips de animação.
- Blender como ferramenta de autoria sugerida; confirmar pipeline e versão de runtime antes de fechar configurações.
- Aplicar transformações, escala consistente e nomes estáveis para bones e actions.
- Incluir clips separados e nomeados de forma inequívoca: `Idle`, `Walk`, `Run`, `Talk`, `Point`, `Interact`.
- Verificar orientação frontal, unidade, escala, origem/pivot no chão e bounding box.
- Otimizar malha, materiais e texturas para o orçamento dos personagens existentes.
- Testar GLB no mesmo loader, câmera, iluminação e controlador usados pelos atores atuais.
- Movimento de navegação e rotação devem continuar sob controle do jogo; não criar um segundo controlador paralelo.

## Etapas e critérios de aceite

### Etapa A — auditoria do pipeline (obrigatória antes de modelar)
- [ ] Identificar formato, escala, orientação e convenção de rig dos modelos em `assets/actors`.
- [ ] Identificar loader, controlador de personagem, câmera e sistema de animação usados no runtime.
- [ ] Definir orçamento de polígonos/texturas e convenção de nomes dos clips/bones com base nos atores existentes.

### Etapa B — modelo e rig
- [ ] Modelo 3D reconhecível e coerente com a referência aprovada.
- [ ] Rig humanoide funcional, skin weights revisados e controles IK úteis.
- [ ] Teste de deformação em poses extremas sem clipping grave.
- [ ] GLB de teste importado no pipeline do projeto.

### Etapa C — animação e runtime
- [ ] Idle, Walk e Run reproduzidos sem foot sliding excessivo.
- [ ] Rotação e deslocamento coerentes nas oito direções de navegação do mapa.
- [ ] Blend/transições entre parado, caminhada e corrida sem estalos.
- [ ] Talk, Point e Interact funcionando como ações contextuais.
- [ ] Teste visual no jogo com escala, iluminação e câmera isométrica reais.

## Restrições de escopo

Esta especificação não adiciona o herói ao roster e não altera seleção de personagens, atributos, habilidades, raridade, economia ou regras de missão. Não declara modelagem, rigging ou integração concluídos. Preservar os sistemas existentes de navegação e NPCs; integrar o personagem ao pipeline já existente em vez de criar uma arquitetura paralela.
