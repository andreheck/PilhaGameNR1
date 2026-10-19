# Motor de simulação temporal — acionista, especialistas e inventário
Data: 19/10/2026. Versão de parâmetros: `shareholder-1` / `director-prototype-1`.

## 1. Natureza e precedência
**Requisito do responsável pelo produto:** o jogador é o acionista. Ele escolhe os dois especialistas, autoriza habilidades, prioriza recursos e compra melhorias no inventário. Os especialistas executam intervenções conforme seu perfil. A arte e os seis modelos 3D próprios serão integrados futuramente; não confundir as seis fichas com os cinco atores atualmente renderizados no salão.

Este documento separa três origens: **requisitos do usuário** (papel, dupla, proporção temporal e exceção de permanência), **ficha conceitual existente do Diretor** (nomes e percentuais propostos) e **hipóteses de implementação desta entrega** (coeficientes, rampas, recargas, regra de pausa). A revisão Kimi não validou esse novo modelo. Sua base era Alpha 1.4/PR13.

O chamado motor estatístico é, nesta versão, um **modelo determinístico de simulação educativa**, não um modelo estatístico estimado com dados de trabalhadores. Não produz probabilidades de adoecimento, aceite de vaga, acidentes, afastamento ou diagnósticos; não possui intervalos de confiança empiricamente calibrados. A mesma sequência de eventos e tempo gera o mesmo resultado. Nenhuma semente aleatória ou ruído clínico é acrescentado.

## 2. Relógio e horizonte
Conversão exata definida pelo usuário:

`dias_simulados = milissegundos_ativos * 7 / 3.600.000`

| Marco | Tempo real ativo |
|---|---:|
| 7 dias | 1 hora |
| 14 dias | 2 horas |
| 21 dias | 3 horas |
| 28 dias / quatro semanas | 4 horas |
| 30 dias | 4h17min08,571s; interface arredonda para 4:17:09 |

**Quatro semanas não são 30 dias.** Mantemos a taxa exata: o horizonte mensal é de 30 dias e supera as quatro horas mínimas. Não há botão de avanço instantâneo no modo de jogo. Testes unitários podem fornecer deltas artificiais ao motor puro, mas isso não está exposto em controles ou parâmetros de URL para o jogador.

### Política operacional da alpha — hipótese explicitada
O relógio conta tempo com a aba do jogo visível, após comando Iniciar/Retomar. Não exige cliques contínuos. Pausa manual, aba escondida, página fechada, suspensão longa do dispositivo e mudança de aba não acumulam tempo offline. Essa política é uma escolha reversível de implementação, não uma exigência original adicional do usuário. O jogador pode cumprir o ciclo em várias sessões; não precisa ficar quatro horas ininterruptas.

Usa `performance.now()` para deltas monotônicos, sem depender de alterações do relógio civil. Persiste a cada cinco segundos e ao pausar; queda abrupta pode perder até aproximadamente cinco segundos. Um delta maior que cinco segundos é tratado como suspensão e não creditado. Em navegadores modernos, Web Locks limita o relógio a uma aba; fallback usa concessão local com vencimento, que é melhor esforço, não mecanismo antifraude.

Um único caso é acompanhado por vez. Trocar de aba de navegação dentro do jogo não apaga nem reinicia o ciclo. Iniciar outro caso elegível pausa o anterior. A dupla é congelada ao iniciar o ciclo para evitar reinicialização oportunista de passivas. A substituição contratual de especialistas no meio do ciclo é backlog.

## 3. Dados e integridade
- `pilha-hero-teams-v1`: seleção principal/apoio antes do ciclo.
- `pilha-mission-timeline-v1`: campanhas por Caso 01–05, equipe congelada, `elapsedMs`, estado, ações, aquisições e marcos.
- `pilha-investment-v1`: orçamento e inventário existente, preservados. Não cobra outra vez ao retomar ou renderizar.
- `pilha-case-XX-alpha14`: nota das decisões, violações e requisito temporal.
- Estados: não iniciado → em andamento ↔ pausado → ciclo acompanhado. Nota pedagógica e conclusão temporal são condições distintas.
- Nenhum dado clínico, biométrico ou identificador de trabalhador real é armazenado.
- JSON inválido, versão desconhecida, IDs não previstos e valores não finitos são tratados de forma defensiva.
- `localStorage` pode ser editado pelo dono do navegador: não serve como prova de tempo, conformidade ou certificação. Uma futura competição exigirá servidor autoritativo.

## 4. Conclusão e compatibilidade
Para **novas tentativas temporizadas**, a missão só libera a seguinte depois de: (a) plano aprovado, (b) ausência de violações pedagógicas impeditivas na tentativa aprovada, e (c) pelo menos 30 dias simulados acompanhados. A nota pode ser obtida antes e aparece como Plano registrado, não como missão temporal concluída.

Conquistas anteriores à migração são preservadas como histórico. Não são reinterpretadas como quatro horas comprovadas. Não apagar o melhor resultado por causa de uma nova tentativa. Rotas antigas aprofundadas do Caso 01/02 permanecem como experiências legadas; a unificação de todos os conteúdos com esse ciclo ainda é pendência (Kimi P3), e não é declarada concluída.

## 5. Eixos fictícios e cálculo reproduzível
Quatro eixos agregados da organização: espaço, condições das pessoas, práticas/cultura e organização operacional. Base de protótipo: 50/100 em todos, sem imputar uma avaliação real.

Para cada intervenção `j`, há um coeficiente não negativo `b_j`, uma rampa `w_j(t)` e, quando aplicável, peso do papel do herói `r_j`. Limitamos cada contribuição a 0,35. Para um eixo com base `B`:

`X(t) = B + (100 - B) * [1 - produto_j(1 - b_j * w_j(t) * r_j)]`

O produto implementa retornos decrescentes, limita o resultado a 100 e evita somar repetidamente bônus a cada frame. Não há dependência do número de atualizações por segundo. Os valores são arredondados somente na saída; comparações de tempo usam precisão do motor.

**Parâmetros novos, sujeitos a balanceamento:** base 50; contribuição espacial 0,12 por intervenção física; contribuição de pessoas `max(0, wellbeing)/100`; cultura `max(0, trust)/100`; operações `max(0, -workload)/100`, derivadas dos deltas fictícios do catálogo anterior. Herói principal pesa 1,0 e apoio 0,6. Esses pesos não representam eficácia profissional real.

Sinergia piloto: ergonomia + pausas adiciona `0,03 * min(w_ergonomia, w_pausas)` aos eixos pessoas/operações. É uma hipótese de jogo transparente, não um efeito quantitativo cientificamente estabelecido. Outras sinergias não são inferidas sem ficha e parâmetros aprovados.

O modelo atual representa maturação/expiração de intervenções protetivas, mas ainda não simula perturbações aleatórias, curvas negativas de exposição ou identificação de causalidade. Não extrapolar estes índices para doenças ou pessoas.

## 6. Maturação de recursos
A compra autorizada transforma imediatamente a malha do móvel no salão, como feedback de instalação, não de resultado humano instantâneo. O efeito nos eixos amadurece: preparação de um dia e rampa suave até 30 dias **desde a aquisição**.

`u = clamp((idade_da_aquisição - atraso) / rampa, 0, 1)`
`w = 3u² - 2u³`

Se comprado no dia 14, o recurso tem efeito apenas parcial ao fechar o dia 30. Os itens já existentes ao começar um novo ciclo são contexto herdado e entram com marco zero neste protótipo. Persistência do bem material não é um poder permanente: um móvel permanece comprado enquanto efeitos humanos não são presumidos instantâneos ou eternos.

O reset do orçamento é bloqueado depois que há um ciclo registrado para evitar destruir a rastreabilidade do inventário. Planejar futuramente nova empresa/campanha com confirmação e migração explícitas.

## 7. Habilidades e prazos
Cada habilidade possui ID, herói, tipo, nível do poder, atraso, rampa, duração, redução final, recarga, eixo-alvo e elegibilidade de permanência. Sua aplicação se baseia em eventos, não no número de cliques ou frames.

| Habilidade do Diretor | Estado desta entrega | Atraso | Rampa | Duração desde início | Redução final | Recarga após término |
|---|---|---:|---:|---:|---:|---:|
| Visão Sistêmica | Passiva de protótipo | 2 dias | 3 dias | 30 dias, limitada pelo ciclo | 0 | 0 |
| Reorganização Estratégica | Ativa de protótipo | 1 dia | 2 dias | 7 dias | 2 dias | 7 dias |
| Comando Integrado | Conceito visível, não ativado | a definir | a definir | a definir | a definir | a definir |
| Operação de Recuperação | Conceito visível, não ativado | a definir | a definir | a definir | a definir | a definir |

Os nomes e propostas de +8% / redução de 15% / sinergia de +10% vêm da ficha conceitual do Diretor. Nesta implementação, 0,08 e 0,15 são coeficientes sobre a margem restante do eixo operacional, **não garantias de ganhos de produtividade**. Todos os prazos da tabela são hipóteses novas documentadas para validação.

Estados de habilidade: disponível → preparando → em atuação (com rampa) → efeito diminuindo → recarga → disponível. Recarga começa depois de cessar o efeito; uma ação não pode ser repetida antes disso. O painel mostra o tempo restante convertido para tempo real. O início do efeito destaca o recurso relacionado no salão, sem fingir que um novo herói 3D foi carregado.

A nova leitura da PR22 no commit a7660cb encontrou também fichas consolidadas do Cientista de Dados e do Engenheiro de Segurança. Seus oito poderes conceituais foram incorporados ao painel, mas a implementação temporal depende dos contratos de evidência/inspeção, adequação do controle e balanceamento; nenhum índice de incerteza clínica foi fabricado. Psicóloga, P&D Tech e RS & TD seguem com fichas individuais pendentes. Os seis são selecionáveis. A interface informa isso em vez de inventar poderes, atribuir competências numéricas ou usar um mentor existente como arte definitiva.

## 8. Permanência
Regra: `excecao_permanente_aprovada OU (habilidade_elegivel E nivel_do_poder > 20)`.

Nível 20 não basta. Nível 21 não torna automaticamente todo poder permanente: exige elegibilidade. A exceção precisa ser explicitamente registrada no catálogo e revisada. Todas as habilidades hoje implementadas são nível 1 e **não** permanentes. Não existe progressão automática de nível nesta entrega. Uma campanha salva não pode ativar permanência por simples dado local: normalização restringe os poderes disponíveis ao catálogo atual.

## 9. Testes e limitações
Testes puros devem cobrir taxa temporal, 4h/28d e 30d, delta inválido, pausa, invariância a partição de ticks, delay/rampa/expiração/recarga, repetição, permissão do herói, permanência20/21, retornos decrescentes, compra tardia, armazenamento e grade temporal/ética.

Testes de navegador: abertura sem travamento reproduzido, mudança contínua de transform, carregamento 3D só após encerrar abertura, dupla sempre visível, pause/retome/recarregue, proteção entre abas, seleção congelada, habilidade sem efeito imediato, inventário e nota preservados. Testes emulados não equivalem a Android/iOS físicos. Não declarar quatro horas reais de sessão quando o fechamento foi testado com relógio controlado.

## 10. Próximos responsáveis
Claude: hierarquia visual, nomes de estados e futura arte própria dos seis heróis. Manus: eventos de intervenção, roteamento e animação de execução, migração dos casos profundos, persistência robusta e testes de longa sessão. Kimi: conteúdo e rastreabilidade qualitativa; **não** validar coeficientes fictícios como evidência empírica. André: verificar animação inicial, dupla visível em todas as áreas, pausa e retomada em aparelho real. PO: aprovar a política de tempo ativo, parâmetros e fichas restantes antes de avançar o balanceamento.


## Atualização recebida durante esta implementação
PR22, `a7660cb78e768b95266280ea709992791df33c67`: preservadas as fichas de Cientista de Dados e Engenheiro de Segurança, com nomes, especializações e habilidades conceituais. O painel não mostra esses dois como sem ficha. O catálogo de execução continua somente com a passiva/ativa piloto do Diretor; os outros poderes são apresentados com estado Programação temporal pendente. A revisão do Kimi precede todas essas mudanças.
