# Galeria compacta integrada

Portados seletivamente o CSS compacto e o botão Ficha completa da PR #57 para a frente unificada #69. Seis heróis em grade 3×2 no desktop e 2×3 no celular, com seleção principal/apoio e confirmação visíveis. A ficha extensa abre em diálogo próprio, mantendo conteúdo canônico e retorno de foco.

Alturas abaixo de 600 px mantêm rolagem de segurança para orientação paisagem e zoom elevado. Nenhuma alteração de dupla, XP, compras, saves ou contratação inicial.

Build e testes de galeria/neon/miniaturas passaram localmente. QA Playwright do fluxo real foi ampliado para conferir os seis cards e controles dentro da tela, abrir a ficha completa no desktop e testar 1366×768. Evidências desktop/celular no CI da PR #69. Sem merge ou produção.
