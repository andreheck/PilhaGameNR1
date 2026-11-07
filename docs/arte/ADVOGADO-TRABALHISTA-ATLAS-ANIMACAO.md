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
- Meshy como ferramenta de autoria/modelagem e rigging, seguindo o fluxo já validado no Psiquiatra; Blender pode ser usado para inspeção técnica e ajustes se necessário.
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


## Referência dimensional obrigatória — modelo existente

O modelo-base para proporções e escala será **`assets/actors/psiquiatra.glb`**, já presente na branch principal do projeto. Ele deve ser aberto no Blender (ou ferramenta 3D equivalente) e usado como referência direta para:

- altura total do personagem, da sola do pé ao topo da cabeça/cabelo;
- largura dos ombros e quadril;
- proporção cabeça/corpo e comprimento dos membros;
- escala dos pés e distância entre eles na pose neutra;
- posição da origem (origin) e altura do plano do chão;
- orientação frontal e eixos locais;
- bounding box e escala aplicada na exportação.

O modelo `assets/actors/operadora.glb` pode servir como segunda referência de consistência entre personagens. A pasta `assets/actors` na branch principal também contém `psicologa.glb`.

**Regra:** não definir uma altura numérica arbitrária para o Advogado. Primeiro medir o GLB de referência no Blender e registrar suas dimensões reais (X/Y/Z) e unidade; em seguida, modelar o Advogado para corresponder à mesma altura e escala visual. A dimensão do bounding box pode variar ligeiramente por causa do coque, óculos ou postura, mas a altura corporal e a escala dos pés devem permanecer compatíveis.

**Contexto confirmado pelo responsável pelo projeto:** o Psiquiatra foi modelado e rigado no Meshy e já foi testado na primeira versão do mapa. Portanto, ele é uma referência validada de produção e integração, não apenas um arquivo GLB existente. O Advogado deverá seguir o mesmo fluxo de autoria no Meshy e o mesmo padrão de exportação/integração que funcionou com o Psiquiatra.

### Inspeção técnica do GLB fornecido (2026-11-07)

Arquivo analisado: `Meshy_AI_Rigged_Male_Psychiatr_All_Animations.glb`, fornecido pelo responsável pelo projeto.

- Contêiner: GLB, glTF 2.0; gerador identificado: Blender glTF I/O v4.0.43.
- Malha principal: 15.837 vértices e 10.334 triângulos, em uma primitiva.
- Esqueleto: 1 skin com 23 joints; nomes de ossos no padrão `mixamorig`, incluindo Hips, Spine/Spine1/Spine2, Neck, Head, braços, antebraços, mãos, pernas, pés e dedos dos pés. Há também o nó `headfront` incluído na skin.
- Materiais e imagens: 1 material, 2 referências de textura e 1 imagem incorporada.
- Nó raiz de personagem: `target_character`, com escala uniforme `0.01`.
- Bounds locais da posição da malha: X = -0,429968 a +0,429968; Y = aproximadamente 0 a 1,600000; Z = -0,299655 a +0,299655. Extensão local aproximada: 0,85994 × 1,60 × 0,59931.
- A escala `0.01` do nó raiz deve ser considerada ao calcular as dimensões efetivas no runtime. O GLB não declara uma unidade física explícita; portanto, não afirmar que as dimensões locais são metros nem converter para altura física sem confirmar a convenção do loader/runtime.
- Eixo vertical aparente da malha: Y. Confirmar orientação frontal e convenção de eixos no runtime antes de exportar o novo ator.
- Clips encontrados: `Running` (aprox. 0,708 s), `Walking` (aprox. 1,083 s), `Discuss_While_Moving` (aprox. 8,083 s) e `Armature|clip0|baselayer` (aprox. 0,042 s). Cada clip possui 46 canais, com canais de rotação e translação para os 23 joints.

**Implicação para o Advogado:** usar como referência o rig humanoide de 23 joints e a convenção de hierarquia/nomenclatura `mixamorig`; manter proporções visuais e escala compatíveis, respeitando o nó raiz com escala 0.01 apenas se a auditoria do runtime confirmar que esse é o padrão compartilhado pelos atores. O novo personagem precisará de clips próprios para gestos de fala, apontar e interação; não presumir que os quatro clips do Psiquiatra já atendem a essas ações.

### Critérios adicionais
- [x] Abrir e inspecionar o GLB do Psiquiatra fornecido pelo responsável.
- [x] Registrar dimensões locais da malha, escala do nó raiz, quantidade de vértices/triângulos, estrutura do rig e clips encontrados.
- [x] Confirmado pelo responsável: Psiquiatra modelado e rigado no Meshy, testado na primeira versão do mapa.
- [ ] Confirmar unidade física e escala efetiva no runtime/loader do jogo.
- [ ] Comparar visualmente com `operadora.glb` e `psicologa.glb`.
- [ ] Usar a mesma escala, origem, orientação e convenção de exportação no Advogado Trabalhista.
