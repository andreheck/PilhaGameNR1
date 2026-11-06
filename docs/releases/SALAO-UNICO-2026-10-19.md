# PilhA+ Game — salão único, abertura e recursos evolutivos

## Escopo solicitado e implementado
Uma sala grande, sem divisórias internas, com cinco setores identificados por mobiliário, posição e áreas sutis no piso. Os 12 investimentos existentes agora estão ligados a objetos reais no salão. Selecione **Melhorar espaço**, toque no sinal **+** ou no próprio móvel, confira o preço e confirme. O recurso básico é substituído por sua versão melhorada; há um pulso dourado suave de 1,8 s e crescimento discreto. A preferência por movimento reduzido elimina essa animação. A alteração de malha é permanente e volta ao recarregar, sem repetir cobrança ou efeitos.

## Arquitetura
- `open-hall.js`: cenário unificado, versões básica/evoluída, colisões, seleção e animação visual.
- `resource-catalog.js`: mapeamento estável dos 12 IDs de investimento para posição/objeto/setor; não depende de WebGL.
- `simulation/investment.js`: regra financeira e indicadores educativos preservados. Instalação visual imediata não implica efeito clínico; os efeitos sintéticos amadurecem no horizonte do jogo.
- `world3d.js`: integra salão e modelos, carrega animações, mantém estado, acessibilidade e câmera; não contém mais as paredes de pequenas salas.
- `play.js`: usa as compras/persistência existentes e acrescenta o inspetor do recurso. Não transforma clique no mobiliário em compra sem confirmação.
- `game-refine.css`: layout com palco 3D e painel contextual; faixa separada para personagens; navegação mobile e rolagem legível.
- `pilha-intro.*`, `pilha-iso.js`, `opening.js`: abertura animada fornecida pelo usuário/Claude, com marca PilhA+ Game. Ilustração isométrica 2D da abertura não se confunde com a cena 3D do jogo.

## Personagens
Arquivos FBX/rigging do usuário convertidos para GLB com materiais embarcados e texturas de 1024 px. Ambos preservam 23 ossos e os clipes originais; adicionada pose estável de espera a partir da animação de conversa fornecida. `mentor-pilha.glb` substitui o mentor geométrico antigo na chave `gestor`; `mentora-biblioteca.glb` amplia a equipe com a chave `mentora`. Há cinco modelos riggados ativos, não seis: três anteriores e os dois fornecidos. Originais não foram apagados.

## Verificação
`npm test`, verificações de sintaxe e novos testes em `tests/open-hall.test.mjs`. Teste em Chromium de desktop 1440x900 confirmou cinco GLBs, compra de ergonomia por 1.800 créditos, saldo 8.200, transformação, botão duplicado bloqueado e restauração da melhoria após recarregar. As evidências de navegador em `qa/` são capturas reais do runtime de teste; emulação de viewport não equivale a Safari/Android físico. Falhas do executor/encerramento do navegador devem ser distinguidas de erros da aplicação. Verificar versão/SHA ao retestar.

## Compatibilidade e limites
Casos 01–05, progresso existente, estado global e orçamento local preservados. Rotas antigas profundas dos Casos 01/02 continuam; não foram portadas integralmente para o painel comum nesta entrega. O mapa urbano, contratação e negociação continuam no planejamento. Nenhuma alegação de conformidade normativa, diagnóstico ou efeitos empíricos. O modo 2D usa uma renderização do novo salão e permite continuar pelas ações do painel; não promete animações 3D em dispositivos sem WebGL.

## Continuidade Claude/Manus/André
Não voltar à estrutura de cinco salinhas. Claude refina escala, legibilidade e estados de seleção. Manus verifica navegação de agentes e colisões de móveis. André testa no aparelho real a abertura, toques, compras, retorno, persistência e redução de movimento. Publicação para teste autorizada pelo usuário na conversa; preservar branch de release e referência ao commit implantado.
