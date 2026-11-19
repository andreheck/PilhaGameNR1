# Triagem da revisão Kimi — sem substituir o parecer recebido
Documento de origem: `revisao-pilha-game-nr1.md`, enviado pelo usuário em 19/10/2026. SHA 256 do original: `8d6c74aaede09e18b7e53cd9c51c307a0179ae8c6fc097949fd78c51f59b4b42`.

A revisão examinou a main Alpha 1.4 e a PR #13. Sua avaliação não é uma validação do salão, da seleção de dupla, do relógio ou dos poderes implementados depois. Os itens abaixo preservam a numeração/terminologia P 1–P 10. O texto original não foi corrigido silenciosamente. A cópia integral, com hash idêntico ao anexo, está em `KIMI-2026-10-19-ORIGINAL.md`.

| Item do parecer | Encaminhamento desta entrega |
|---|---|
| P 1 — Violações de ética não falham o caso | Implementado na experiência in-shell: flags por opção, aprovação impedida e teto pedagógico 49. Também impedida aprovação com violações no motor dedicado do Caso 02. O teto 49 é escolha de produto entre as alternativas sugeridas, não pontuação cientificamente validada. |
| P 2 — Escore do Caso 02 ignora silence | Pendente de balanceamento: não modificar pesos do motor silenciosamente. Mantido como hipótese explícita para próxima revisão. |
| P 3 — Duas fontes de verdade Caso 01 | Pendente. Rotas profundas continuam legadas; não declarar unificação. Novo ciclo temporal cobre a jornada principal. |
| P 4 — Curva binária 75 | Meta 75 preservada. Não adotada meta 70 sem piloto. Revisão de escolhas e melhor nota permanecem. |
| P 5 — Feedback genérico | No relatório in-shell, as justificativas já existentes por escolha passam a aparecer separadamente, em lista; não criar novas afirmações clínicas. Motor dedicado ainda deve ser harmonizado. |
| P 6 — Mistura dos grupos de risco | Módulo renomeado Inventário de prevenção e SST, distinguindo condições físicas/ergonomia dos fatores organizacionais/psicossociais. Nenhuma declaração de equivalência oficial entre os 12 domínios e uma taxonomia normativa. |
| P 7 — Aditividade e ausência de interação | Novo modelo temporal separado usa retornos decrescentes e sinergia piloto ergonomia×pausas, explicitamente hipotéticos. Não apresentado como estatística estimada. |
| P 8 — Reconhecimento/recompensa e DE&I | Pendente; não foram inventados 13º/14ºdomínios, valores ou preços. |
| P 9 — Quiz sem rastreabilidade | Matriz inicial documentada; auditoria item a item e verificação de fontes pendentes, sem selo de conteúdo validado. |
| P 10 — Acessibilidade/mobile | Testes emulados e critérios de foco/contraste/reduced-motion; dispositivos físicos e leitor de tela continuam pendentes. |

## Verificação externa pontual — distinta do parecer Kimi
Foram consultadas fontes oficiais, não substituídas as frases do original:
- Página vigente da NR-1 do MTE apresenta histórico da atualização e entrada da redação de 1.5 em 26/05/2026. Evitar resumir a menção explícita atual como se fosse apenas o texto em vigor desde 2022. Fonte: https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-1
- O SATEPSI/CFP lista a Resolução 31/2022 como norma de avaliação psicológica, revogando 09/2018. Não publicar a referência 02/2019 como se estivesse verificada para esse fim. Fontes: https://satepsi.cfp.org.br/legislacao.cfm e https://site.cfp.org.br/nova-resolucao-do-cfp-destaca-diretrizes-para-a-avaliacao-psicologica/
- HSE confirma seis áreas: demands, control, support, relationships, role e change. Fonte: https://www.hse.gov.uk/stress/standards/overview.htm
- A associação da Portaria 3733/2024 aos guias e o status brasileiro da Convenção 190 citados no parecer permanecem **não verificados nesta entrega**. Não foram usados para novas alegações na interface.
- Esta checagem pontual não é parecer jurídico nem validação integral do conteúdo NR-1. Não pressupõe que ISO 45003 mapeie diretamente todos os 12 domínios do jogo.

## Escopo das flags pedagógicas
`simulation/case-ethics.js` registra IDs de caso, índice da etapa/opção e código de violação. São regras de segurança pedagógica para exposição, coerção, retaliação e uso nominal de dados clínicos; não são classificação jurídica automática de atos reais. Os testes validam todas as opções marcadas com três outras respostas perfeitas. Uma futura migração de texto/ordem deve atualizar os IDs e os testes conjuntamente.
