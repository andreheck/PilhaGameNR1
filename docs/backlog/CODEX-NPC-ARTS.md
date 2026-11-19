# CODEX — Integrar artes canônicas dos 16 NPCs

## Objetivo

Substituir a representação procedural atual dos funcionários pelas **artes já aprovadas**, mantendo exatamente as identidades, os scores de saúde, a movimentação, o relógio, o calendário e o restante do modo “empresa viva”.

A fonte de identidade continua sendo `data/continuous/employees.js`. O contrato visual está em `data/continuous/npc-art-manifest.json`.

**Atualização 23/10/2026:** os quatro NPCs roxos (João, Tiago, Fernanda e Raimunda) **já foram extraídos pelo Codex**. Não solicitar nem executar uma segunda extração. Localizar e reutilizar os PNGs resultantes no workspace/branch atual; caso não estejam commitados, integrá-los com os nomes do manifesto.

## Sequência obrigatória

1. **Importar e normalizar as 16 artes**
   - destino único: `assets/npcs/`;
   - nomes exatamente iguais aos do manifesto;
   - PNG/WebP com transparência real;
   - sem fundo branco, sem textos de card, sem molduras;
   - preservar proporção do personagem e não “reinterpretar” a arte aprovada.

2. **Roxos — extração concluída pelo Codex**
   - **Não recortar novamente** João, Tiago, Fernanda nem Raimunda;
   - localizar os quatro PNGs já extraídos na branch ou no workspace do Codex, conferir IDs e transparência;
   - se necessário, apenas copiar/renomear esses mesmos arquivos para os destinos canônicos de `data/continuous/npc-art-manifest.json`;
   - validar bordas, mãos, cabelos, sapatos e tablets sem reinterpretar os personagens.

3. **Verdes**
   - reutilizar os quatro arquivos individuais já aprovados: Aline, Letícia, Mariana e Pedro;
   - não usar os cards `*_card.png`.

4. **Azuis e amarelos**
   - usar as artes individuais aprovadas, não as pranchas de grupo;
   - confirmar o nome do personagem pelo manifesto antes de copiar/renomear;
   - não preencher uma arte ausente com outro NPC “parecido”.

5. **Vincular por ID, nunca por índice visual**
   - adicionar ao registro de funcionários um campo `avatar` ou resolver pelo manifesto;
   - vínculo fixo `NPC-01`…`NPC-16`;
   - nenhuma mudança em `health`, `home`, `type`, `role` ou regras de simulação.

## Onde a arte deve aparecer

### A. Mapa
O personagem circulante deve carregar a identidade visual correta. Se o motor atual não suportar PNG corpo inteiro como ator móvel, derivar um sprite leve a partir do mesmo arquivo canônico. A miniatura/ficha nunca pode mostrar outra pessoa.

### B. Lista de funcionários
Exibir miniatura real à esquerda, seguida por:
- nome;
- arquétipo;
- setor atual;
- score de saúde;
- status (“Saudável”, “Atenção”, “Precisa de cuidado”).

A lista continua ordenada do maior para o menor score.

### C. Ficha ao clicar
Usar a arte maior e manter:
- nome + MBTI + arquétipo;
- idade quando registrada;
- papel;
- forças;
- pontos de atenção;
- score e variação de saúde;
- setor de origem / localização atual;
- condições/contexto já presentes na versão atual.

### D. “O mundo corporativo de PilhA+”
O catálogo dos 16 NPCs também deve usar as mesmas imagens canônicas.

## Características já registradas

Não reescrever perfis manualmente. Consumir os dados existentes em:
- `data/continuous/employees.js`;
- catálogo de NPCs da branch de balanceamento, quando necessário;
- `simulation/company-living.js` para saúde/contexto.

**Regra de segurança de gameplay:** personalidade, aparência, idade, gênero e etnia **não** determinam o score de saúde. O score continua respondendo às condições simuladas do trabalho e aos recursos restaurativos.

## Fallback

Durante desenvolvimento:
- arte existente → usar a arte;
- arte ausente → manter o procedural atual e marcar `missingAsset`;
- nunca quebrar o mapa por 404;
- nunca mostrar a imagem de outro NPC como fallback.

Depois que os 16 arquivos existirem, adicionar teste que falha se algum arquivo canônico estiver ausente.

## Testes de aceite

1. Os 16 IDs têm imagem única.
2. Nenhum card com fundo/texto é exibido no jogo.
3. Lista, ficha, catálogo e mapa preservam a mesma identidade.
4. Selecionar cada NPC abre sua própria ficha.
5. Score de saúde e ordenação não mudam apenas pela troca da arte.
6. Movimento e pausa continuam funcionando.
7. Desktop 1366×900 e mobile 390×844 sem cortes críticos.
8. Sem 404 para `/assets/npcs/*`.
9. Teste automatizado percorre `npc-art-manifest.json` e confirma todos os assets.
10. Fazer screenshots da lista, uma ficha roxa, uma verde, uma azul e uma amarela para revisão.

## Não fazer

- não gerar novos personagens;
- não trocar nomes, MBTI ou arquétipos;
- não alterar a lógica de saúde;
- não recolorir roupas para “combinar” com setores;
- não reativar casos;
- não mexer nos seis heróis;
- não publicar se algum ID estiver apontando para a pessoa errada.

## Entrega esperada do Codex

1. Commit apenas de assets + binding + UI necessária;
2. testes;
3. screenshots de QA;
4. atualizar a PR #38 ou abrir PR dependente;
5. publicar na Vercel de testes **somente após** todos os testes passarem.
