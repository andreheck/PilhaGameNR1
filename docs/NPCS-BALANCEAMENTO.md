# NPCs — tabela de parâmetros dinâmicos (v1)

**Status:** catálogo de prototipagem, ainda não aplicado ao gameplay. **Referência técnica:** [JSON versionado](../data/npcs/catalogo-v1.json).

Os efeitos abaixo são pontos *fictícios por ciclo*, para teste e balanceamento. A coluna positivo usa Saúde / Psicossocial; a coluna adverso usa a mesma ordem. Não representam riscos clínicos ou predição a partir de tipos de personalidade.

| ID | Nome | Tipo | Idade | 2 espaços positivos | 2 negativos | 1 neutro | Bônus + (S/P) | Adverso (S/P) | Status |
|---|---|---|---:|---|---|---|---|---|---|
| NPC-01 | João | INTJ | 38 | Liderança, Servidor de Tecnologia | Galpão de Logística, Saúde e Bem-Estar | Reuniões | +1 / +4 | -1 / -3 | parametros_prototipo |
| NPC-02 | Tiago | INTP | 27 | Servidor de Tecnologia, Operação | Liderança, Galpão de Logística | Reuniões | +0 / +3 | -1 / -3 | parametros_prototipo |
| NPC-03 | Fernanda | ENTJ | 41 | Liderança, Reuniões | RH, Saúde e Bem-Estar | Operação | +0 / +3 | -1 / -4 | parametros_prototipo |
| NPC-04 | Raimunda | ENTP | 34 | RH, Reuniões | Operação, Galpão de Logística | Servidor de Tecnologia | +0 / +4 | -1 / -3 | parametros_prototipo |
| NPC-05 | Aline | INFJ | 35 | RH, Saúde e Bem-Estar | Operação, Galpão de Logística | Reuniões | +1 / +4 | -2 / -3 | parametros_prototipo |
| NPC-06 | Letícia | INFP | 29 | Saúde e Bem-Estar, RH | Liderança, Servidor de Tecnologia | Operação | +2 / +4 | -2 / -3 | parametros_prototipo |
| NPC-07 | Mariana | ENFJ | 37 | Liderança, Reuniões | Servidor de Tecnologia, Galpão de Logística | RH | +1 / +5 | -2 / -4 | parametros_prototipo |
| NPC-08 | Pedro | ENFP | 25 | Reuniões, RH | Operação, Servidor de Tecnologia | Saúde e Bem-Estar | +1 / +4 | -1 / -4 | parametros_prototipo |
| NPC-09 | Carlos | ISTJ | — | Pendente | Pendente | Pendente | — | — | pendente_refinamento |
| NPC-10 | Ana | ISFJ | — | Pendente | Pendente | Pendente | — | — | pendente_refinamento |
| NPC-11 | José | ESTJ | — | Pendente | Pendente | Pendente | — | — | pendente_refinamento |
| NPC-12 | Maria | ESFJ | — | Pendente | Pendente | Pendente | — | — | pendente_refinamento |
| NPC-13 | Alisson | ISTP | — | Pendente | Pendente | Pendente | — | — | pendente_refinamento |
| NPC-14 | Camila | ISFP | — | Pendente | Pendente | Pendente | — | — | pendente_refinamento |
| NPC-15 | Lucas | ESTP | — | Pendente | Pendente | Pendente | — | — | pendente_refinamento |
| NPC-16 | Beatriz | ESFP | — | Pendente | Pendente | Pendente | — | — | pendente_refinamento |

## Regras para futura implementação

1. Ler o catálogo JSON por `id` estável. Requerer um espaço presente no registro do NPC.
2. Ativar o efeito positivo apenas se houver atividade compatível, condições favoráveis verificáveis e recursos adequados.
3. Ativar o adverso apenas se houver uma condição adversa explícita do cenário e exposição relacionada. Presença ou tipo MBTI, isoladamente, não são gatilhos.
4. Espaço neutro e demais setores não classificados = zero. Nenhum efeito sem condição ativa.
5. Aplicar uma única vez por NPC, setor e ciclo; limites agregados por setor/ciclo: saúde −4 a +4, psicossocial −8 a +8; resultado final entre 0 e 100.
6. Sinergias com colegas não são bônus automáticos. Dependem de uma intervenção compatível, cooperação, condições concretas e teste.
7. Eventos como gripes, ansiedade, tensão muscular ou afastamentos não podem ser imputados à tipologia. Simular exposição organizacional, sem inferir diagnósticos nem qualificar candidatos reais por MBTI.

**Estado dos grupos:** Roxos e verdes (8 fichas propostas); azuis e amarelos (8 cadastros com efeitos `null`, aguardando refinamento).

Próxima etapa técnica: conectar o motor de eventos do cenário ao catálogo, adicionar histórico de aplicação, testes de regressão e balanceamento antes de integrar à versão pública.
