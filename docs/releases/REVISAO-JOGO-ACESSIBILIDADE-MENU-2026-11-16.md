# Revisão do jogo: fluxo, menu e acessibilidade

## Ajustes

- A explicação de primeira partida agora descreve a escolha de um personagem explorador, separada da contratação inicial dos NPCs. A tela de configurações também se refere ao personagem, sem sugerir que a partida depende de uma dupla.
- O perfil de personagens especiais não aponta mais para “Personagens e animações”, uma opção técnica que não existe no menu do jogador.
- Os itens de depuração “Personagens e animações” e “Teste Mixamo” foram retirados do menu; as ações de gestão e jogo continuam acessíveis.
- Os testes de escala agora reconhecem a sala de reunião recém-adicionada, e o teste dos perfis NPC acompanha a renderização de narrativa vigente.

## Verificação

- `npm test`: build e suíte completa aprovados no checkout da branch `codex/unified-social-agenda`.
- `git diff --check`: aprovado.
- Navegador local desktop, viewport aproximada de 1361×957: abertura, guia, seleção do explorador, contratação aleatória de três gerentes e três funcionários, passagem de entrada, mapa, menu, diálogo de poderes, configurações e celular.
- Marcar uma mensagem como lida aumentou a contagem da pasta Arquivadas. As configurações usam controles nativos associados a rótulos; os diálogos abertos têm rótulo acessível, os botões só com ícone possuem `aria-label` e as imagens sem texto alternativo são decorativas.
- Os testes automatizados de preferências, calendário, navegação, contratação, mobiliário, NPCs e telas cobrem regras e regressões do fluxo. Estilos de foco visível estão definidos para controles interativos.

## Limites

- A revisão visual foi feita em desktop. Não foi realizada homologação em aparelho físico, avaliação com leitor de tela ou auditoria automatizada de contraste nesta rodada.
- A simulação é local ao navegador e usa indicadores fictícios. O teste de navegação ocorreu em um perfil local de QA.
- O destino autorizado para a versão pública é `https://vaideplanob.com.br/ao-trabalho/`. Esta entrega permanece em branch; não foi feito merge em `main`.
