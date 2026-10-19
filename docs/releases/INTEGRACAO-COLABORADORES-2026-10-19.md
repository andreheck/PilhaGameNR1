# Integração das contribuições — 19/10/2026

## Fontes lidas antes da implementação
- **PR #21 / Manus**, `fix/pr20-mobile-glb-qa`, revisão `20b2948e382f1e57aff63ad85480b417de6bdfe5`: proteção de animações vazias; correção de etiquetas no layout antigo; relatório de QA em Chromium emulado. A revisão 20b2948 apenas atualiza documentação/CI. A falha de deploy por identificação do autor é distinta de erro do jogo; nenhuma proteção do Vercel foi desativada.
- **PR #22 / heróis**, `docs/hero-roster-beta`, `85e92820ff11cbaf568af502be38cf3ee6c1d919`: `docs/herois/README.md` e `docs/herois/diretor.md`. Seis heróis disponíveis na beta, dupla de principal e apoio, sem bloqueio por raridade. A PR também carrega histórico antigo de motor/movimento: esse código NÃO foi importado.
- **main**, `a0cb244f4950ffbbbd5ad466402c9d702419adb0`: roadmap e especificação do simulador de propostas de trabalho; módulos futuros, não capacidades já implementadas.
- **Base de execução**, `release/alpha15-opening-characters` em `a0a17ef8ac8c2174f7188b9a76028eaf395ebb84`: salão único publicado, 12 upgrades visuais, cinco GLBs e abertura do usuário/Claude.

## Decisões de conciliação
| Origem | O que foi aproveitado | O que não foi importado |
|---|---|---|
| Manus PR21 | Guarda `a.clips?.length`, ampliada com guarda de clipe compatível; testes de regressão | `position:absolute` do antigo layout de etiquetas: o salão atual usa faixa própria e não deve regredir |
| Heróis PR22 | Catálogo de seis, especializações, principal/apoio, raridade não restringe acesso; documentos preservados | Motor de atores antigo, bônus percentuais sem balanceamento, GLBs/arte não fornecidos |
| Roadmap main | Documentação de produto e ofertas de trabalho preservada | Fórmulas empíricas de salário, predição de aceite ou diagnóstico sem fontes |
| Claude / abertura | Tela animada existente preservada | Nenhuma reescrita da abertura ou retorno às salas separadas |

## Entrega implementada
**Formar dupla**, nas áreas Casos e Equipe, abre um diálogo acessível para a missão selecionada. Há seis opções: Diretor, Psicóloga, Dados & IA, Eng. de Segurança, P&D Tech e RS & TD. O jogador escolhe um principal e um apoio diferentes, pode trocar as funções e salvar. Escape ou fechar descarta alterações não salvas.

O armazenamento `pilha-hero-teams-v1` é versionado e separado do progresso e orçamento. Guarda uma dupla por Caso 01–05; rejeita IDs inválidos/duplicados, é tolerante a JSON corrompido e informa falha de armazenamento sem declarar sucesso. O jogo não exige a escolha para acessar casos já existentes: é uma **prévia experimental da seleção**, não o motor de poderes da beta.

Não foram aplicados bônus, mudanças de pontuação, alterações de orçamento ou substituições dos cinco GLBs. As seis fichas usam iniciais e texto; isso não representa seis novos personagens 3D. A ficha do Diretor contém propostas de atributos/poderes na documentação; não foram transcritas como efeitos validados.

Correções adicionais: não executar `clipAction` com lista vazia ou clipe indefinido; pausar comando de câmera por teclado enquanto um diálogo nativo estiver aberto; favicon local; remover script de feedback de deploy antigo que estava incorporado no HTML.

## Verificação realizada
- Suíte existente `npm test` aprovada, acrescida de **7 testes de heróis/estado/guarda de animação**.
- Chromium headless em **1440×900** e **390×844**: cinco GLBs carregados, seis opções de heróis, bloqueio de seleção incompleta/duplicada, gravação, Escape sem salvar, troca de funções, independência por caso e restauração após recarga.
- Nenhum overflow horizontal da página ou do diálogo nos dois viewports; nenhuma exceção JavaScript observada nos percursos exercitados.
- Compra existente de ergonomia permaneceu em 1.800 créditos: saldo 10.000 → 8.200, sem interferência da dupla.
- Relatórios de teste em `docs/qa/evidence/hero-duos/` distinguem emulação de aparelhos físicos. Não houve homologação completa em Safari/Android real, leitor de tela ou validação clínica/normativa.

## Próximos colaboradores
**Claude:** refinar hierarquia das fichas e aprovar arte própria para os heróis, sem confundi-los com os mentores existentes. **Manus:** conectar duplas a eventos/diálogos após contrato de dados e balanceamento aprovado; preservar a guarda de animação e colisão segmentada. **Kimi + especialistas:** verificar fundamentos e limites de habilidades/sinergias antes de efeitos numéricos. **André:** testar salvar, trocar e recarregar no aparelho real. **Coordenação:** manter este registro como delta sobre a visão do salão, sem fechar/mesclar PRs antigas automaticamente.
