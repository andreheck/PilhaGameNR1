# Pátio e sala restaurativa V2 — 08/11/2026

Fonte autorizada pelo PM: pilha-itens-patio-sala-restaurativa-v2.zip. LEIAME e items.js foram lidos como documentação técnica, sem executar instruções ou substituir as decisões do PM. GLBs fornecidos são protótipos procedurais, não modelos novos gerados nesta entrega.

## Escala e espaço

Restauração mantém o salão original de 12×8 m e ganha um anexo de 12×10 m: 120 m² adicionais, total de 216 m². Corredores de acesso, limites da câmera, foco do setor e clique no piso incluem o anexo. Botão Ver pátio ampliado oferece foco específico. As demais salas mantêm as dimensões existentes; seu layout perde cadeiras duplicadas (a arte da mesa de reuniões já traz quatro cadeiras), recebe espaçamento maior e aproveita melhor as áreas livres dos quadrantes. Duas melhorias compatíveis com a mesma arte de posto compartilham um móvel, conservando os dois IDs visuais e todos os efeitos/recibos.

Medição real do banco Wi-Fi no GLB: 5,020×3,985 m e 0,95 m de altura. O ~7 m no LEIAME era uma aproximação; não foi usado para esticar o objeto. Projeção dos atlas calibrada na mesma régua de 1 célula = 1 m do renderer, sem ampliar objetos pequenos artificialmente.

## Itens

Os dez GLBs foram convertidos em atlas transparentes e entram no catálogo/laboratório. No mapa, o banco completo reúne os três arcos e o ponto central uma única vez; não são posicionadas cópias duplicadas dos módulos. Junto a ele ficam fonte de água, tapete indiano, almofadas, caixa de som e incensário. Os clipes fluxo, pulso e fumaca foram amostrados em oito quadros em loop; pausa e preferência por movimento reduzido congelam a apresentação. Os 16 nós SIT do banco e o nó do tapete estão preservados nos metadados para a próxima integração de assentos.

São assets de apresentação. Não criam 16 novas vagas de pausa nem concedem bônus econômicos/saúde gratuitos. Capacidade, compras, calendário e efeitos das melhorias existentes continuam no motor. Incenso/fonte/som não são declarados intervenções clínicas ou de controle de risco. Não foi adicionado áudio ambiente automático.

## Trajetos

Pausas e reuniões do pátio chegam à área livre à frente do banco, por um corredor lateral que evita atravessar os arcos. Meditação usa o tapete do anexo por outro acesso lateral. Biblioteca, bosque e auditório mantêm suas posições. Os caminhos continuam completos, sem cópias teleportadas dos personagens. Não foi declarada ocupação dos assentos com novos clipes riggados; essa é a etapa seguinte.

## Proveniência e limites

Pacote original em tools/restorative-sources/patio-sala-v2.zip, excluído do build. Hashes, dimensões, projeção, animações e nós de assento em assets/restorative-v2/catalog.json. Preparação local reproduzível: tools/render-restorative-v2.py. Renderização do jogo continua leve em canvas, com os GLBs amostrados em sprites. O anexo aumenta a área física, sem mudar saves ou adicionar um quinto setor de negócio.

Validação e publicação finais são registradas na PR #69. Permanecem: clipes reais de sentar/levantar, encaixe/ocupação dos SIT, carregamento riggado de materiais, auditoria de escala dos móveis 3D de escritório e possível expansão das salas de trabalho após essa medição.

Verificação local inicial: build, escala/packing (básico e todas as melhorias) 3/3, empresa viva 38/38 e anexo 3/3 passaram. QA Chrome em 1366×768 e 390×844 verificou seis conjuntos posicionados, todos os atlas carregados, visitante no novo pátio, câmera mantendo esse visitante visível, 16 humanos, sem alteração de saldo/recibos/semana e sem exceções. As duas capturas foram examinadas.

As compras existentes de Banco de convivência, Tapete e Almofadas passam a apontar para o banco Wi-Fi, tapete indiano e almofadas novos no anexo, com os mesmos IDs e recibos. O acabamento por nível e o Poof usam essas posições, sem desenhar cópias dos móveis antigos. Caixa de som, fonte e incensário são decorativos nesta etapa.
