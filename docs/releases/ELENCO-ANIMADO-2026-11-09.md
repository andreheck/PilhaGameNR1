# Elenco atualizado — 9 de novembro de 2026

Entrega na branch `codex/unified-social-agenda`, PR #69, após `78f5439`. Destino autorizado: preview de testes; sem merge ou publicação em main.

## Resultado

- Dez GLBs fornecidos pelo PM inventariados: 134 clipes originais. Foram preparados **53 conjuntos de atividade**, quatro orientações, com hashes e dimensões verificados. Os arquivos mestres (252 MB) ficam locais, intactos. O jogo usa os atlas preparados (48 MB no total, carregados conforme a atividade), como o restante do cenário existente.
- Mariana conserva `NPC-07`, ficha, cargo e retrato canônico; seu corpo no mapa usa caminhada, espera e conversa atualizadas. Beatriz mantém o modelo anterior aprovado. Nenhum dos outros 15 funcionários recebe a identidade de outra pessoa.
- Malik, professor de yoga, aparece no tapete restaurativo: respira, senta no chão, permanece sentado e levanta em ciclo. Sua posição acompanha o tapete reorganizado pelo jogador.
- Advogado aparece no Escritório, com caminhada calma pelo corredor e espera. Ambos são personagens de apoio visual, fora das vagas, organograma funcional, receita e cálculo de saúde. Não adicionam um benefício não aprovado à economia.
- **Menu → Personagens e animações** permite conhecer os dez modelos, escolher atividade/orientação, pausar/reiniciar a prévia e colocar/retirar os personagens de apoio. Mariana abre sua própria ficha; não gera uma cópia contratada. Alterações visuais desse elenco não são novas contratações nem persistem no save.
- A abertura interativa atualiza sete modelos existentes e acrescenta jovem profissional, yoga e advogado: **18 personagens**, com escala e número de quadros lidos do próprio atlas.
- Pausar a empresa congela o elenco do mapa; a prévia da galeria tem seu próprio controle de reprodução. Os movimentos não aceleram a semana. Nenhuma estatística foi recolocada sobre os setores.

## Proveniência e reprodução

`data/continuous/expanded-cast.json` contém nome do mestre, SHA-256, tamanho, inventário de clipes, associação confirmada, origem das atividades e hashes dos atlas. Sem caminhos privados ou chave de API.

Preparação local: `python tools/prepare-expanded-cast.py`; renderização: `python tools/render-expanded-cast.py --missing-only`. O preparador busca os dez nomes exatos nas pastas organizadas e Downloads. Caminhos absolutos ficam apenas em `artifacts`, ignorado pelo Git. O renderizador usa Three.js r180, os próprios clipes/texturas dos mestres e Chrome local; não usa créditos Meshy ou geração paga. Exige Playwright/Pillow e acesso ao CDN de Three.js durante a preparação.

O build integra os atlas já versionados; CI não depende da presença dos mestres privados. O relatório anterior dos FBXs de Beatriz/Mariana permanece como histórico de proveniência; o último passo do build atualiza exclusivamente o corpo confirmado de Mariana.

## Limites conhecidos

- Uma adaptação de sentar da Gestora para Mariana foi **rejeitada na inspeção visual**, apesar dos 23 ossos correspondentes: pés e quadril ficaram incorretos. Essa animação não está no pacote público. Mariana continua com a pose procedural validada nos assentos. Não retargetear outra pessoa apenas pela cor da roupa.
- Os clipes nativos de sentar dos demais papéis estão disponíveis na galeria. Ainda é necessário vincular os papéis a identidades canônicas antes de substituir funcionários contratados e sincronizar esses assentos automaticamente com seus postos.
- “Animação adicional 1/2” do advogado preserva nomes neutros porque o mestre usa identificadores UUID; não foi inventada finalidade jurídica. O gesto de pegar/arremessar do operador fica apenas na prévia, sem lançar caixas durante o trabalho.
- O apoio visual não reserva postos de funcionário nem oferece consulta, aula ou bônus de saúde funcional. Essa camada exige requisito próprio antes de entrar na simulação. O professor ocupa o tapete, não uma cadeira de escritório.
- A galeria usa atlas reduzidos para manter o desempenho do mapa; uma apresentação 3D ampliada em tempo real exigiria outro orçamento de memória. O catálogo distingue as 53 atividades preparadas dos 134 clipes originais.
- Permanecem as pendências registradas em `CIRCULACAO-OCUPACAO-EDITOR-2026-11-09.md`: ocupação integral dos postos Wi-Fi, manipulação de materiais persistentes, giro das artes restantes e demais poderes/XP contínuo.

## Verificação

`npm test`; testes de empresa viva e rigs existentes; testes de manifesto, hashes, dimensões, clipes originais e identidades. QA Chrome isolado em 1366×768 e 390×844: dez modelos, atividades de yoga, giro de prévia, pausa, inclusão/retirada, preservação de saldo/compras/saúde/equipe/semana, ausência de erros e requisições quebradas. Regressão da abertura em quatro resoluções e editor de móveis. Capturas e relatório: artefato CI `expanded-cast-qa`.

QA de navegador não substitui homologação em celular físico ou sessão prolongada. Publicação do preview deve ser confirmada pelo SHA do deployment na conclusão da PR.
