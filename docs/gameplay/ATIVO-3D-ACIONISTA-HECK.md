# Ativo 3D de teste — Acionista Heck

**Status:** ativo recebido e em validação isolada. Ainda não integrado ao mapa jogável.

## Arquivos recebidos

- `Meshy_AI_Rigged_Stylized_Man_biped_Meshy_Merged_Animations.fbx`
- `Meshy_AI_Rigged_Stylized_Man_biped_texture_0.png` — textura de cor/base color
- `Meshy_AI_Rigged_Stylized_Man_biped_texture_0_roughness.png` — mapa de rugosidade
- `Meshy_AI_Rigged_Stylized_Man_biped_texture_0_metallic.png` — mapa metálico

Identidade de teste no jogo: **Acionista Heck**.

## Inspeção inicial do arquivo

A inspeção binária local identificou FBX binário versão 7400 e estruturas de nós/curvas compatíveis com hierarquia de esqueleto e animação. Isso é um indício técnico, não comprovação visual de skinning correto, nomes dos clipes ou qualidade do ciclo de caminhada. Esses pontos dependem de carregar o FBX com FBXLoader e inspecionar o resultado no navegador.

## Arquitetura existente a reutilizar

A linha 3D anterior do jogo já utiliza Three.js, `GLTFLoader`, `AnimationMixer`, câmera ortográfica e atores GLB. A linha atual do Ao Trabalho usa um mapa isométrico Canvas 2D. A integração deve:

1. validar o ativo isoladamente;
2. converter o FBX validado para GLB, preservando esqueleto, animações e materiais;
3. carregar o GLB como ator na camada 3D compatível, sem duplicar economia, calendário, NPCs ou estado da empresa;
4. conectar o ator ao contrato transitório de controle da dupla em `simulation/hero-control.js`;
5. projetar sua posição na navegação/mapa existente e manter seleção de setores, câmera e saves.

Não inserir o FBX diretamente no Canvas 2D nem criar um segundo sistema de simulação.

## Critérios de aceite do ativo

- malha e materiais completos;
- textura de cor em espaço sRGB; mapas roughness/metallic tratados como dados lineares;
- malha skinned ligada ao esqueleto;
- clipes identificados e reproduzidos sem exceções;
- escala/orientação coerentes com os personagens e cenário;
- ciclo de caminhada utilizável e transições sem saltos;
- desempenho e memória avaliados antes de incluir o ativo no bundle principal.

## Limites desta etapa

- Nenhuma conversão FBX→GLB foi homologada ainda.
- Nenhuma animação foi visualmente aprovada ainda.
- Nenhum arquivo binário do personagem foi adicionado ao repositório nesta etapa.
- Nenhuma alteração de save, economia, calendário, atributos ou decisões foi feita.
- Nenhum merge ou deploy foi realizado.

O validador local entregue ao PO carrega os quatro arquivos no navegador por meio do Three.js FBXLoader, mostra as animações disponíveis e permite conferir os mapas de textura. Para módulos ES e import map, deve ser servido por HTTP local (por exemplo, `python -m http.server 8000`), não aberto diretamente por `file://`.
