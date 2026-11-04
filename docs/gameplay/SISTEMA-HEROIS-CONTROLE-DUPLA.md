# Ao Trabalho — sistema de heróis controláveis e autônomos

**Status:** fundação lógica isolada; não é ainda uma funcionalidade jogável completa.  
**Base:** Ao Trabalho v1.5+, commit `d504d36c5f4215c2ac1e445be9a6a75637360813`.  
**Princípio:** ampliar o mapa e o elenco existentes sem criar outro motor de gestão, calendário, economia ou NPCs.

## Auditoria de duplicidade

Antes desta branch foram conferidas as frentes e PRs relevantes:

- PR #57 / `codex/herois-compactos-beneficios`: seleção compacta dos seis heróis, principal/apoio, fichas e benefícios. Continua draft e diverge do baseline v1.5+; a base `d504d36` já possui `state.team`, galeria e seleção principal/apoio. Reaproveitar o que já existe na base; portar apenas melhorias específicas de layout/benefícios após conciliação, sem merge integral.
- PRs #53–56 e módulos de empresa viva: mapa contínuo, circulação, NPCs, conversas, pausas e reuniões. Reaproveitar; não criar outro mapa nem rotina de NPC.
- PR #40: foco de câmera em funcionário localizado. Referência para foco contextual, mas não é controle de um herói.
- PR #60: tela inicial Ao Trabalho já foi integrada por merge em 03/11/2026. Não duplicar a abertura.
- Branches antigas `feat/hero-spotlight-codex` e `feature/collab-hero-duos` estão atrás da base v1.5+ e não devem ser portadas sem necessidade.
- PR #62 é QA documental da base v1.5+; não implementa o controle de heróis. Sua existência reforça que a linha `d504d36` é a referência para esta evolução.

## Distinção de elenco

- **Heróis:** os seis conselheiros canônicos da dupla selecionada; não são os 16 funcionários/NPCs.
- **NPCs:** trabalhadores que já circulam e executam rotinas automáticas na empresa.
- **Herói controlado:** um dos dois heróis escolhidos, selecionado para exploração/interação direta.
- **Herói parceiro:** o outro membro da dupla, com atuação autônoma limitada às competências e ações que forem implementadas.

## Contrato implementado nesta primeira fatia

O módulo `simulation/hero-control.js` deriva um estado transitório a partir da dupla já salva:

- principal controlado por padrão; apoio autônomo;
- alternância manual entre os dois integrantes;
- seleção restrita aos dois heróis da dupla;
- não altera `state.team`, não grava nova chave de armazenamento e não muda economia, XP, relógio ou simulação;
- não confunde o parceiro autônomo com os NPCs existentes.

A suíte `tests/hero-control.test.mjs` cobre par válido, seleção, alternância reversível, imutabilidade e entradas inválidas.

## Próximas prioridades

1. **Controle manual no mapa:** implementar um adaptador de navegação do jogador no motor isométrico existente, com destino por clique/toque e controles de teclado; manter a navegação da câmera separada da movimentação do herói.
2. **Representação visual do herói:** escolher assets/rigs canônicos para os seis heróis. As fichas e retratos atuais não equivalem a modelos animados de mundo; não substituir os NPCs nem inventar que os retratos já são rigs.
3. **Parceiro autônomo:** criar agenda de tarefas por especialidade, com limites, feedback e pausa segura. Não duplicar o cérebro/rotina dos NPCs.
4. **Interação contextual:** aproveitar os painéis existentes de setor e funcionário; clique em departamento abre necessidades, equipe e melhorias já disponíveis.
5. **Influência/iluminação:** camada visual de descoberta, calculada pelos atributos do herói e pela proximidade, sem alterar os indicadores psicossociais por efeito cosmético.
6. **QA e integração:** testar desktop/mobile, teclado/toque, movimento reduzido, persistência dos saves antigos, colisões e coexistência com o calendário.

## Bloqueio técnico identificado antes da próxima fatia

O motor atual `ui/claude/pilha-iso.js` expõe câmera, foco, seleção de setores, iluminação por zona e circulação automática de NPCs. A API consultada não expõe movimento de ator controlável nem uma entidade de herói renderizada no mapa. Portanto, esta branch entrega o contrato de controle e os testes, mas não declara movimentação ou interação jogável. A próxima implementação deve ampliar o motor atual com uma entidade do jogador e caminho seguro, após selecionar/validar os rigs disponíveis.

## Guardrails

- Não alterar a dupla salva nem migrar saves.
- Não criar uma segunda simulação econômica, calendário ou motor de NPC.
- Não atribuir poderes, XP ou bônus automáticos ainda não implementados.
- O herói parceiro não executa compras ou decisões irreversíveis sem confirmação do jogador.
- A iluminação é feedback de exploração/influência, não evidência de saúde real.
- Nenhum merge ou deploy de produção sem autorização explícita.
