# Mobiliário da empresa — cobertura visual e próximos assets

## Integrado com as artes aprovadas
Mesas de trabalho completas (monitor/teclado/cadeira), mesa de reunião, poltronas de visita, sofá, mesa de centro, plantas pequenas, gaveteiros, quadros e caixas de materiais agora substituem os objetos procedurais equivalentes na base do mapa. Não representam compra gratuita, não alteram o save, não concedem efeitos. Melhorias adquiridas continuam com seus próprios objetos, níveis e Poof. Assets usados exclusivamente do kit aprovado de20 WebPs.

## Criar a seguir, em ordem de prioridade
| Prioridade | Asset | Uso e característica mínima |
|---|---|---|
| P1 | Máquina de produção compacta | Corpo industrial, painel, proteção física, luz de estado; variantes ligada/parada; footprint1.4×1.1 |
| P1 | Esteira transportadora | Módulos retos com roletes/correia, terminais de entrada/saída;2.4×0.7 |
| P1 | Estante industrial | Metal e caixas de estoque, visual distinto da estante de livros;2.4×0.5 |
| P1 | Bancada operacional | Ferramentas organizadas e posto de montagem/inspeção;1.8×0.8 |
| P1 | Estação de atendimento | Headset, monitor, identificação e divisória curta;1.6×0.8 |
| P2 | Balcão de recepção | Frente identificada e superfície acessível;2.4×0.8 |
| P2 | Cadeira de trabalho avulsa | Regulagem, rodízios e encosto; a poltrona atual é para visita/descanso |
| P2 | Armário de EPI/ferramentas | Portas, pictogramas claros, versões fechada/aberta;0.8×0.5 |
| P2 | Palete/carrinho logístico | Caixas fixadas, base baixa, sem ocupar corredores;0.8×0.7 |
| P3 | Luminária de trabalho | Versão mesa/teto; apoio à leitura visual de conforto |

Piso de circulação, marcações de segurança, nomes e placas de setor podem continuar em código vetorial; não precisam de nova arte raster. Banco, bebedouro, árvore frutífera, tapete/almofadas, livros, divisória de vidro e móveis de reunião já existem no kit; evitar recriá-los.

## Contrato de arte
Mesmo ângulo isométrico e iluminação do kit; PNG/WebP RGBA com fundo transparente, pivô no centro da base e sombra suave. Tamanho de referência240px para mesas/máquinas,120px para assentos/acessórios. Sem pessoas incorporadas aos novos móveis, para permitir NPCs separados. Respeitar footprints e corredores já navegáveis. Máquinas, esteiras e prateleiras industriais permanecem procedurais até aprovação das artes próprias; não usar estante de livros como estoque industrial.

## Atualização25/10 — cinco assets criados e integrados para teste
Máquina, esteira, estante industrial, bancada operacional e estação de atendimento estão em `assets/furniture/generated/`, com fundo transparente e manifesto de geração. Substituem os equivalentes básicos de Produção/Atendimento, sem alterar economia. A bancada adiciona um posto visual operacional. Os20WebPs aprovados permanecem intactos.

P1 visual básico concluído; variantes ligada/parada, terminais de esteira e versões adicionais permanecem futuras. Próximos assets: balcão de recepção, cadeira avulsa, armário de EPI/ferramentas, palete/carrinho e luminária. Não usar o trecho histórico acima sobre fallback procedural como descrição da versão atual.
