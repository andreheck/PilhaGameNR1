# Auditoria técnica inicial — Ao Trabalho

**Repositório:** andreheck/PilhaGameNR1  
**Branch inspecionada:** docs/hero-roster-beta  
**Escopo:** Etapa A — inspeção sem alteração de código  
**Status:** diagnóstico documental inicial; não equivale à execução local dos testes nem a QA visual no navegador.

## 1. Estrutura confirmada

Arquivos centrais encontrados na branch inspecionada:

- `index.html`: shell da aplicação principal; ainda contém título, marca, navegação e textos “PilhA+ Game / Alpha 1.4”.
- `play.js`: navegação principal, casos, elenco, biblioteca, progresso e interações do hub.
- `play.css`: estilos da aplicação principal.
- `world3d.js`: cena Three.js, regiões/setores clicáveis e carregamento de três personagens GLB.
- `cases-data.js`: cinco casos narrativos (017–021), perguntas, alternativas, pontuação e desbloqueio.
- `src/psychosocial-simulation.js`: domínios, intervenções, cálculo de snapshots e aplicação de intervenções.
- `logistica-simulacao.html` e `logistica-simulacao.js`: protótipo logístico independente.
- `src/office-actor-brain.js`: máquina de estados sintética dos personagens e helpers de movimentação/colisão.
- `tests/alpha14.test.mjs`, `tests/psychosocial-simulation.test.mjs`, `tests/logistica-simulacao.test.mjs`, `tests/office-actor-brain.test.mjs`.
- `package.json`: script `npm test` encadeia essas quatro suítes.

Não foram encontrados `src/App.jsx`, `src/App.tsx`, `src/main.jsx`, `src/main.tsx` ou `vite.config.js` nos caminhos consultados. A arquitetura desta versão é HTML/CSS/JavaScript com módulos ES e Three.js, não uma aplicação React/Vite convencional.

## 2. Estado funcional observado no código

### Aplicação e casos
- O hub principal oferece navegação entre visão geral, casos, equipe, biblioteca e progresso.
- Há cinco casos com quatro etapas e três alternativas cada.
- O desbloqueio é sequencial, com pontuação mínima de 75/100.
- A suíte Alpha 1.4 verifica casos, progressão, ativos GLB, CSS e alguns elementos da navegação.

### Simulação psicossocial
- O motor trabalha com seis domínios: saúde física percebida, bem-estar emocional, apoio social, satisfação no trabalho, condições de segurança/ambiente e recuperação.
- Há catálogo de intervenções com custos e efeitos sintéticos.
- A função de aplicação pode atingir a equipe ou um personagem específico.
- A simulação logística usa quatro pessoas sintéticas, orçamento inicial de R$ 8.000 e persistência em localStorage sob a chave `pilha-logistica-simulation-v1`.
- O protótipo logístico está separado do estado principal. A integração atual é por navegação/link, não uma única simulação integrada.

### Personagens e cenário 3D
- `world3d.js` declara regiões de Operações, Liderança, Recursos Humanos, Bem-estar e Tecnologia.
- O cenário carrega três personagens GLB: Operadora, Psicóloga e Psiquiatra.
- O módulo `office-actor-brain.js` define estados como idle, working, exploring, talking, resting e worried, com transições determinísticas por seed e helpers de colisão. A presença do módulo não prova, por si só, que toda a máquina esteja integrada ao loop visual principal; isso precisa ser validado no restante do código e em navegador.

### Contratação e economia
- README e documentação financeira indicam uma mecânica de contratação/proposta salarial existente ou planejada, com instrução explícita de reutilizar parâmetros já existentes.
- Nesta inspeção inicial, não foi possível confirmar no código consultado um módulo de domínio consolidado para contratação, aceite, folha, caixa e custos recorrentes.
- Antes de adicionar fornecedores, contratos ou trabalhadores terceirizados, localizar a implementação efetiva da proposta de trabalho e a Issue #30; distinguir funcionalidade implementada de backlog/documentação.

## 3. Marca e compatibilidade

O README já apresenta **Ao Trabalho — Desafios da implementação da NR-1**, mas a interface principal e a simulação logística ainda contêm referências legadas a PilhA+.

A migração de marca deve ser tratada separadamente de uma migração técnica:
1. atualizar títulos, logos, cabeçalhos, navegação, rodapé, metadados e textos visíveis;
2. manter temporariamente IDs internos, nomes de arquivos, chaves localStorage, URLs e nomes de assets legados;
3. não renomear repositório, branch ou URLs de preview sem decisão específica;
4. considerar migração de chaves apenas se houver necessidade real e testes para preservar progresso salvo.

## 4. Arquitetura proposta para os novos módulos

A proposta é acrescentar módulos JavaScript puros de domínio, independentes da apresentação, e depois conectá-los às telas existentes. Os nomes finais dos arquivos devem ser confirmados após a inspeção completa.

### A. Terceirização
Entidades conceituais:
- fornecedor;
- proposta comercial;
- contrato ativo;
- escopo e setor de prestação;
- trabalhadores vinculados ao fornecedor e expostos ao ambiente;
- métricas de qualidade, continuidade, integração, rotatividade e prevenção.

Taresolvido e Xacomigo devem ser fornecedores ficcionais com perfis comparáveis, não uma escolha binária com vencedor permanente. Contratação deve alterar custos e capacidade apenas conforme escopo e tempo. Trabalhadores terceirizados devem entrar na avaliação das condições do ambiente quando expostos, mas não ser duplicados como empregados próprios.

### B. Sindicalização e representação
Modelar representação coletiva e pautas como entidades organizacionais. Não disponibilizar lista nominal de filiados à liderança. A adesão é escolha voluntária do trabalhador; não pode alterar seleção, avaliação, remuneração, promoção ou escala individual. Benefícios devem distinguir direitos legais, cláusulas negociadas e serviços de entidade sindical.

### C. Intranet
Criar catálogo de mensagens com metadados de ativação:
- condição/evento;
- setor/população;
- janela/ciclo;
- cooldown;
- tema e tom;
- política de autoria (nome sintético ou anônimo);
- classificação de sensibilidade.

O feed deve ser dirigido por eventos e estado, não aleatório. As 33 frases já estão na especificação de relações de trabalho. O motor deve selecionar mensagens elegíveis, limitar repetição e permitir perspectivas divergentes.

### D. Ouvidoria e comitê
Separar:
- relato recebido;
- triagem;
- medida de proteção;
- investigação;
- deliberação;
- comunicação;
- acompanhamento;
- encerramento/reabertura.

A quantidade de relatos não deve ser um score negativo. Relato não é prova automática. Acesso aos dados deve ser restrito e a UI deve exibir ao comitê uma síntese protegida, com impedimentos por conflito de interesse. Casos graves com risco imediato exigem fluxo de proteção prioritário, não espera por reunião ordinária.

## 5. Integrações obrigatórias

- Persistência: avaliar versionamento/migração de localStorage e evitar colisões com chaves atuais.
- Pessoas: reutilizar IDs e cadastros sintéticos existentes; distinguir empregado próprio, trabalhador terceirizado e prestador.
- Setores: usar o mapa de setores já existente, sem duplicar taxonomia.
- Economia: integrar custos contratuais e custos de pessoal ao modelo financeiro, sem cobrar valores diários/mensais em periodicidade errada.
- Riscos psicossociais: eventos e decisões devem repercutir em fatores organizacionais, sem simular diagnóstico clínico.
- Diversidade e inclusão: respeitar a especificação ID/FI, privacidade, grupos comparáveis e bloqueio de proteção; filiação sindical nunca entra nos índices.
- Intranet e ouvidoria: não inferir identidade de autor anônimo nem expor pessoas afetadas.
- Acessibilidade: navegação por teclado, mobile e leitores de tela.

## 6. Ordem recomendada de implementação

1. **Fechar inspeção do motor econômico e da proposta de trabalho:** localizar a mecânica existente e os limites de escopo da Issue #30.
2. **Domínio de trabalhadores e contratos:** vínculo, empregador, setor de prestação, escopo, custos, fornecedor e exposição ao ambiente.
3. **Fornecedores Taresolvido/Xacomigo:** propostas comparáveis, contratação, acompanhamento e consequências.
4. **Representação sindical:** adesão voluntária abstrata, representação e pautas, sem cadastro nominal acessível à gestão.
5. **Motor de eventos e intranet:** inserir as 33 mensagens por gatilho, cooldown e ciclo.
6. **Ouvidoria e proteção:** protocolo, triagem, medidas, prazos, apuração e confidencialidade.
7. **Comitê/Conselho:** deliberação justificada, impedimentos, responsáveis e acompanhamento.
8. **Integração sistêmica:** economia, riscos, confiança, diversidade/inclusão e eventos.
9. **Migração visual da marca:** Ao Trabalho em todas as telas e metadados, preservando identificadores internos.
10. **Testes e QA:** unitários, regressão, persistência, acessibilidade e navegador desktop/mobile.

## 7. Riscos técnicos a evitar

- Criar um segundo cadastro de empregados.
- Duplicar a contratação/proposta salarial e produzir custos inconsistentes.
- Contabilizar trabalhadores terceirizados duas vezes.
- Tornar a sindicalização uma variável individual visível ou um critério de seleção.
- Tratar denúncia como prova ou quantidade de relatos como indicador de piora.
- Criar feed aleatório sem ligação com estado e decisões.
- Misturar relatos confidenciais com a intranet pública.
- Conceder bônus econômico que compense violações graves.
- Refatorar o app para React/TypeScript ou trocar stack sem justificativa e autorização.
- Declarar testes executados ou QA visual sem execução real.

## 8. Limites desta auditoria

Esta etapa foi feita por leitura remota dos arquivos disponíveis na branch documental. Não foi executado `npm test`, não houve execução local do jogo e não foi realizado QA visual no navegador. O índice de arquivos não foi obtido por listagem integral do repositório; a inspeção cobriu os arquivos centrais identificados no README e no handoff. Portanto, a próxima ação técnica é aprofundar a busca pela mecânica de proposta de trabalho/economia e mapear o fluxo de estado/persistência antes de fechar o plano de arquivos.

## 9. Próximo passo para Codex

Executar uma segunda inspeção sem alterar código:
1. ler a implementação completa de contratação/proposta e o código de economia;
2. ler integralmente a simulação logística e seus testes;
3. localizar a Issue #30 e identificar o que está implementado versus planejado;
4. mapear as chaves de localStorage, os contratos de dados e o ciclo temporal;
5. devolver lista precisa de arquivos a criar/alterar, sequência de commits, testes e riscos;
6. aguardar aprovação antes de implementar.
