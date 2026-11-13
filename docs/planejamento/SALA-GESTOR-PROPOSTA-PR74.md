# Sala do gestor — referência da PR #74

Revisão de 08/11/2026: PR #74, ba945d8. A proposta já inclui implementação inicial no motor Three.js legado (world3d.js), ainda sem QA visual. A frente #69 usa quatro setores em Canvas/atlas. Preservamos o desenho como referência; o código não foi copiado para a entrada atual. Adaptar planta, colisões, vidro e assets ao renderer contínuo antes de considerar entregue. TV BI ainda é placeholder.

# Sala do gestor — integração ao departamento administrativo

## Objetivo
Construir uma sala compacta para o gestor dentro da região administrativa/liderança do mapa 3D. Não criar uma cena independente nem substituir o ambiente atual.

## Leitura do repositório
- A cena principal é montada em `world3d.js` com Three.js.
- A região existente `Liderança` usa o identificador `02`, centro aproximado `(-4.8, -3.0)` e dimensões `4.1 × 3.3`.
- A biblioteca de mobiliário Kenney já contém modelos GLB reutilizáveis: `desk.glb`, `chairDesk.glb`, `bookcaseOpen.glb`, `computerScreen.glb`, `laptop.glb`, `loungeSofa.glb`, `tableRound.glb`, `lampSquareFloor.glb` e `pottedPlant.glb`.
- `world3d.js` já carrega alguns desses móveis em posições globais. Antes de adicionar novos, reorganizar/reaproveitar os objetos existentes para evitar duplicidade e sobreposição.
- O aquário ainda não aparece na lista atual de modelos Kenney identificada nesta revisão; verificar a biblioteca completa antes de criar ou importar um novo GLB.
- A TV de BI tem especificação visual em `docs/ARTE-TV-BI-SALA-DIRETOR.md`, mas os binários ainda precisam ser integrados.

## Planta e composição propostas
- Reservar uma porção da região Liderança (02) como sala do gestor, sem expandir a área externa nem bloquear a circulação do setor.
- Manter o piso alinhado à malha/altura do restante do departamento.
- Criar paredes de vidro em painéis com perfis discretos escuros ou azul-petróleo; transparência suficiente para reconhecer a sala e enxergar personagens/mobiliário.
- Deixar uma abertura/porta clara voltada para o corredor interno. Não fechar a rota de circulação.
- Reutilizar uma mesa, cadeira de gestor, assentos de visitante, estante, luminária e planta existentes; ajustar escala e rotação com base nas dimensões reais dos GLBs.
- Instalar a TV BI em uma parede interna, com orientação para a cadeira do gestor e leitura visível do corredor.
- Inserir aquário pequeno sobre aparador/estante baixa, sem ocupar passagem nem competir visualmente com a TV.
- Manter decoração enxuta: a sala deve comunicar liderança acessível e transparência, não ostentação.

## Requisitos técnicos
- Implementar a sala como um `THREE.Group` nomeado e isolado (ex.: `managerOffice`) dentro de `world3d.js`, para facilitar visibilidade, testes e evolução.
- Materiais de vidro: `transparent: true`, opacidade moderada, `depthWrite: false`; revisar ordenação de renderização e double-sided apenas onde necessário. Evitar painéis totalmente opacos.
- Se necessário, dividir vidro em painéis e perfis para reduzir artefatos de transparência.
- Manter colisores simples nas paredes/perfis e uma abertura sem colisão para a porta. Não bloquear o caminho de personagens.
- Mobiliário GLB deve preservar proporção, sombras e materiais originais sempre que possível.
- TV e aquário devem ser objetos independentes, com nomes e pivôs estáveis para futuras interações.
- Não criar ainda mecânica de gestão exclusiva, diálogos ou novos indicadores: esta entrega é construção espacial e integração visual.

## Critérios de aceite
- [x] Sala localizada dentro do setor administrativo/Liderança (02), sem virar cenário separado.
- [x] Chamadas de carregamento dos móveis GLB existentes adicionadas ao grupo da sala (validação visual ainda pendente).
- [x] Painéis de vidro e perfis estruturais implementados (QA visual desktop/mobile pendente).
- [x] Abertura de acesso e folha de porta articulada implementadas; colisores de paredes adicionados (teste de navegação pendente).
- [x] Aquário pequeno procedural inserido sobre console.
- [x] Placeholder de TV BI posicionado na parede; substituir pelo asset final quando os binários forem versionados.
- [ ] Personagens circulam sem atravessar paredes ou ficar presos.
- [ ] Sala continua legível em diferentes zooms e ângulos.
- [ ] QA visual no navegador e screenshot do mapa atualizado.

## Sequência recomendada
1. Medir os GLBs e revisar o layout atual de `Liderança` antes de posicionar qualquer objeto.
2. Criar o grupo espacial e as paredes/porta de vidro.
3. Reorganizar o mobiliário já carregado para dentro da sala.
4. Posicionar aquário e TV BI (usar placeholder temporário apenas enquanto os binários da TV não estiverem no repositório).
5. Ajustar colisões e navegação.
6. Validar visualmente em navegador real, desktop e mobile.

## Referência visual
A imagem conceitual da conversa é apenas referência de organização: sala compacta, vidro, mesa, cadeiras, TV BI, aquário e plantas. Não usar a imagem como textura nem substituir os GLBs existentes por ilustração 2D.


## Implementação inicial (branch `feat/sala-gestor-administrativo`)
- Criado o grupo `manager-office-glass-room` dentro da região Liderança (02), em `world3d.js`.
- Painéis de vidro, perfis, abertura de entrada e folha de porta articulada.
- Mobiliário Kenney carregado diretamente no grupo da sala (mesa, cadeira, estante e planta).
- Aquário pequeno com tanque transparente, água, pedras e peixes estilizados.
- Placeholder independente `manager-office-bi-display`; ainda não é o PNG final da TV BI.
- Adicionados limites de colisão aproximados para paredes e segmentos da entrada.
- **Ainda não validado:** escala real dos GLBs, transparência em navegador, colisões com os personagens, screenshot desktop/mobile e integração do asset final da TV.
