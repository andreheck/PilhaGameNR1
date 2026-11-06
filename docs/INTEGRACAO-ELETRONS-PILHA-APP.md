# Elétrons — caminho futuro de integração PilhA+ App → PilhA+ Game
**Estado: proposta de arquitetura; não implementada.** Data: 19/10/2026. Registrar a ideia do usuário sem iniciar conexão de contas, leitura de energia ou tratamento de dados pessoais.

## 1. Caminho solicitado
Pessoa mede sua energia no PilhA+ App → o App consolida um score do dia → uma política de recompensa converte esse resultado em elétrons → o Game credita a carteira vinculada → a pessoa usa elétrons para uma forma de evolução do herói a definir.

Créditos organizacionais do acionista, XP de experiência, elétrons e níveis de habilidade devem continuar com unidades distintas. Não converter automaticamente elétrons em dinheiro, nem tratar nível de herói como estado de saúde do usuário. Troca por XP, formação, itens cosméticos ou outro avanço ainda precisa de decisão do PO.

## 2. Decisões necessárias antes de código
- Confirmar o contrato e a escala REAL do score diário no repositório do App: limites, versão de cálculo, validade, fuso, consolidação e tratamento de leitura incompleta. Não presumir escala 0–100 apenas por ser comum em protótipos.
- Definir coeficiente, arredondamento, teto diário e comportamento de revisões. Uma política linear `elétrons=floor(score_validado*k)` representa a ideia inicial, mas **k e teto não foram aprovados**. Não publicar exemplo 1:1 como regra definitiva.
- Avaliar se premiar score alto pressiona o usuário a manipular a medição ou penaliza quem está com baixa energia. Manter caminho completo por ações do jogo/XP; o vínculo com o App deve ser opcional e desligável.
- Alternativa para discussão, não substituição silenciosa da ideia: recompensa por participação ou faixas limitadas, com bônus moderado. Requer testes com usuários, especialmente em períodos de baixa energia.
- Aprovar o uso dos elétrons, custos, regras de estorno e direitos de acesso. Sem promessa de valor monetário ou escassez econômica.

## 3. Contrato mínimo sugerido
O vínculo de contas deve ser explícito e revogável. App e Game continuam serviços/repositórios separados. Um identificador pseudônimo de associação relaciona as contas; não usar e-mail público como chave no payload do jogo.

**Mensagem de recompensa**, produzida no servidor do App e validada pelo servidor do Game:

```json
{
  "eventId": "opaque-unique-event-id",
  "issuer": "pilha-app",
  "audience": "pilha-game",
  "linkId": "pseudonymous-account-link",
  "localDate": "YYYY-MM-DD",
  "timeZone": "IANA-zone-confirmed-by-policy",
  "amount": "integer-calculated-by-approved-policy",
  "policyVersion": "pending",
  "issuedAt": "timestamp",
  "expiresAt": "timestamp",
  "sourceRevision": "opaque-revision-id"
}
```

Esse objeto é **especificação**, não endpoint ativo ou segredo. Não enviar sono, humor, diagnósticos, biometria, questionários, texto clínico, histórico de leituras ou score bruto para a lógica de heróis. O Game só deve receber o mínimo necessário para reconciliar a recompensa. Mesmo o valor convertido pode revelar informação sobre energia quando a conversão é reversível; minimizar acesso, retenção e exposição também desse derivado.

## 4. Segurança e consistência propostas
- Autenticação entre servidores e verificação de assinatura, emissor, destinatário, expiração e vínculo ativo. Nenhum token secreto em JavaScript público ou query string.
- Idempotência por evento e restrição única por vínculo/data/política. Repetir chamada, abrir abas ou medir novamente não duplica recompensa diária.
- Definir consolidação do dia antes de pagar ou usar ajuste/estorno explícito no ledger. Mudança de fuso e score revisado não podem gerar dias extras arbitrários.
- Livro-razão transacional e append-only no servidor, separando crédito, débito, ajuste e estorno. Saldo calculado de lançamentos, não do localStorage editável.
- Cancelamento/revogação do vínculo interrompe novas mensagens; definir retenção/eliminação e consequências sobre lançamentos já necessários à conciliação.
- Estados de UI: não vinculado, consentimento pendente, vinculado, aguardando fechamento do dia, recompensa recebida, já processado, temporariamente indisponível e desvinculado. Falha de sincronização não impede jogar.

## 5. Privacidade e equidade como requisitos de projeto
Não exibir score, elétrons derivados de saúde ou ranking de energia para empregadores, recrutadores, gestores de RH ou outros jogadores. Não usar esses dados no Simulador de Propostas de Trabalho, contratação, comparação de candidatos, produtividade real ou inferência clínica. Evitar placares públicos capazes de revelar energia por equivalência.

Antes de implementar, a equipe deverá revisar finalidade, permissão/consentimento, base aplicável, retenção, minimização e desenho de segurança com especialistas. Este texto não substitui essa revisão nem afirma conformidade jurídica. Não há tratamento real iniciado por esta documentação.

## 6. Roadmap de maturação
1. PO + Kimi: política de recompensa, riscos de incentivo e critérios de equidade.
2. Equipe do App: contrato versionado do score e consolidação diária, sem mover dados de saúde ao Game.
3. Manus: desenho do vínculo, autenticação, ledger, replay, idempotência e estorno em ambiente isolado com dados sintéticos.
4. Claude: fluxo opcional de vínculo e estados explicáveis, sem pressão por medição.
5. Testes: evento duplicado, assinatura inválida, vínculo revogado, atraso, revisão de score, fuso, modo offline e falhas de armazenamento.
6. Aprovação de privacidade e segurança, piloto restrito e só então ativação.

**Nesta entrega:** somente créditos fictícios + XP local. Nenhum elétron é criado, nenhum score é buscado e nenhum serviço do App foi alterado.
