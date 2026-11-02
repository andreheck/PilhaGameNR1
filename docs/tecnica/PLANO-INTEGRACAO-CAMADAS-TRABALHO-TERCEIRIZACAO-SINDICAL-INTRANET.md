# Plano de integração — vínculos, terceirização, representação sindical e relações de trabalho

**Projeto:** Ao Trabalho — Desafios da implementação da NR-1  
**Branch de trabalho:** `docs/hero-roster-beta`  
**Status:** plano técnico baseado em inspeção remota dos arquivos existentes; ainda não é implementação de código.

## 1. Diretriz

Evoluir a estrutura funcional existente, preservando os fluxos, os dados locais e os módulos já testados. Não criar um segundo cadastro psicossocial, uma segunda regra de contratação ou uma economia paralela.

A implementação deve começar no protótipo logístico, onde já existe um estado de trabalhadores e intervenções, e depois definir a integração com o hub principal e com a economia quando o contrato financeiro estiver implementado.

## 2. Estado técnico observado

- `play.js` e `index.html`: hub principal, navegação, cinco casos, equipe de personagens e progresso local dos casos. O código inspecionado não apresentou um cadastro geral de trabalhadores, contratação ou folha.
- `src/psychosocial-simulation.js`: motor compartilhado com domínios, snapshots, intervenções e histórico. É a base a preservar.
- `logistica-simulacao.js`: protótipo funcional com quatro personagens sintéticos, orçamento de demonstração, mapa, intervenções e persistência local.
- `logistica-simulacao.js` persiste o estado em `pilha-logistica-simulation-v1`. Essa chave e o formato legado devem continuar legíveis.
- `world3d.js`: cena Three.js com três modelos GLB e avatares provisórios; não há, no trecho inspecionado, sistema geral de uniformes por vínculo.
- `package.json`: testes Node executados em sequência para casos, motor psicossocial, logística e cérebro dos personagens.
- `docs/ECONOMIA-PRODUTIVIDADE-FINANCAS.md` e Issue #30 descrevem economia planejada; a Issue exige reutilizar a contratação/proposta existente, mas a inspeção não confirmou um motor de contratação/folha consolidado no hub.
- A Issue #29 depende da integração com a economia da Issue #30. Evitar ligar efeitos financeiros novos antes de existir contrato financeiro único.

**Limite da auditoria:** inspeção remota de arquivos e testes existentes. Não foi executado `npm test`, não houve execução local/browser e não foi validado o estado de produção.

## 3. Modelo de dados proposto

Estender o objeto de pessoa já utilizado pelo motor psicossocial, sem criar uma segunda lista de pessoas:

```js
{
  id: "person-id",
  name: "Nome fictício",
  role: "Função",
  sectorId: "operations",
  relationship: {
    type: "employee", // employee | outsourced
    supplierId: null, // null | taresolvido | xacomigo
    contractId: null
  },
  representation: {
    unionMember: false
  },
  uniform: {
    baseColor: "own-blue",
    supplierColor: null,
    badge: null
  }
}
```

Regras:
- `relationship.type` define o vínculo operacional, não a identidade ou o valor da pessoa.
- Terceirizado deve ter `supplierId` e contrato válido; pessoa própria não deve ter fornecedor.
- A filiação sindical é voluntária e independente do vínculo. Pode existir pessoa própria ou terceirizada sindicalizada.
- Não usar filiação sindical em recrutamento, aceite de proposta, salário, promoção, avaliação, produtividade, retenção ou score psicossocial.
- Não usar filiação sindical como filtro público ou dado individual visível à liderança. A insígnia visual solicitada deve ser tratada como elemento didático de representação no cenário, sem expor a identidade individual: preferir símbolo coletivo/contextual, adesivo em painel de representação ou identificação de representante autorizado, e não uma marca pessoal ostensiva.
- Não inferir vínculo, filiação ou características pessoais por aparência, nome, uniforme atual ou comportamento.

## 4. Identidade visual

Paleta inicial, configurável por CSS e tokens, com símbolos e texto para não depender somente da cor:

| Grupo | Cor sugerida | Identificador acessível |
|---|---|---|
| Equipe própria | Azul institucional | Ícone de pessoa / etiqueta “Próprio” |
| Taresolvido | Laranja | Marca “T” / etiqueta do fornecedor |
| Xacomigo | Verde | Marca “X” / etiqueta do fornecedor |
| Representação coletiva | Insígnia neutra violeta ou grafite | Símbolo de grupo/representação, sem identificar filiados individualmente |

A cor do fornecedor deve ser aplicada ao uniforme base ou a um detalhe consistente (colete, faixa ou manga). A representação sindical não altera a cor do fornecedor. No caso de pessoa terceirizada que também participe da representação coletiva, o vínculo continua identificado pelo uniforme e a representação aparece apenas em contexto coletivo ou de representação autorizada.

A primeira implementação visual deve abranger a lista de pessoas, os marcadores no mapa e a ficha individual da simulação logística. Depois, avaliar a integração aos personagens 3D sem trocar os GLBs existentes.

## 5. Terceirização

Criar catálogo configurável de prestadores fictícios Taresolvido e Xacomigo. Comparar propostas por:
- preço inicial e recorrente;
- escopo, capacidade e cobertura de turnos;
- qualidade, retrabalho e continuidade;
- integração e treinamento;
- rotatividade e histórico contratual;
- práticas de saúde e segurança, comunicação e resposta a incidentes;
- plano de correção e risco residual.

O menor preço não deve vencer automaticamente. Contrato e prestador devem ser entidades separadas dos trabalhadores. Cada pessoa terceirizada aparece uma única vez na equipe do setor e não deve ser duplicada como empregado próprio. A exposição ao ambiente e às intervenções deve considerar local/setor de trabalho, sem confundir isso com o empregador.

A contabilidade de contratos deve aguardar o livro-caixa único da Issue #30, evitando criar despesas recorrentes incompatíveis com o calendário financeiro.

## 6. Representação sindical

Modelar a representação como uma camada coletiva:
- adesão voluntária e não coercitiva;
- nenhuma penalidade ou vantagem por filiação ou não filiação;
- nenhuma exposição individual desnecessária;
- negociação, consulta, pauta coletiva, acompanhamento de acordos e devolutivas;
- registro de reuniões, encaminhamentos, responsáveis e prazos;
- separação entre direitos legais, cláusulas negociadas e serviços ofertados pela entidade.

Não registrar filiação em indicadores de diversidade, inclusão, performance ou produtividade.

## 7. Intranet e ouvidoria

A intranet deve exibir publicações ficcionais contextualizadas por setor, decisões, condições de trabalho e eventos. Não deve revelar autores anônimos nem permitir vigilância individual.

A ouvidoria deve manter fluxo auditável: protocolo, triagem, proteção, encaminhamento, apuração imparcial, deliberação, comunicação protegida, acompanhamento e encerramento fundamentado. Receber relato não significa comprovação nem penalidade automática. A quantidade de relatos, isoladamente, não deve reduzir indicadores nem punir quem relata.

O comitê deve registrar conflito de interesse, impedimento, justificativa, responsável, prazo e acompanhamento. Não oferecer ações de retaliação, descoberta de autor anônimo ou ocultação de denúncia.

## 8. Sequência de implementação

### Fase 0 — compatibilidade e contratos de dados
1. Inspecionar o arquivo completo de testes, o restante do hub e todos os módulos de contratação/proposta eventualmente existentes no repositório.
2. Mapear formato e migração de `pilha-logistica-simulation-v1`.
3. Definir validação de vínculo, fornecedor e representação.
4. Criar testes unitários para migração e invariantes de dados.

### Fase 1 — vínculo e identidade visual
1. Estender o modelo de pessoa com `relationship` e metadados visuais.
2. Migrar os quatro personagens sintéticos sem alterar seus IDs, scores, alertas ou localização.
3. Exibir vínculo e fornecedor na lista, no mapa e na ficha.
4. Criar tokens CSS e marcadores acessíveis; manter layout mobile.
5. Não expor filiação individual: representação visual inicialmente coletiva/contextual.

### Fase 2 — contratos e fornecedores
1. Criar catálogo Taresolvido/Xacomigo e contratos.
2. Comparar custo total, capacidade, qualidade, continuidade e salvaguardas.
3. Vincular pessoas terceirizadas ao setor/local e ao contrato sem duplicação.
4. Conectar custos ao livro-caixa quando a Issue #30 estiver implementada.

### Fase 3 — representação coletiva
1. Criar entidade de representação e agenda coletiva.
2. Simular adesão voluntária e negociação sem consequências individuais.
3. Criar testes que provem que a filiação não altera contratação, salário, score, produtividade ou progressão.

### Fase 4 — intranet e ouvidoria
1. Criar feed contextual com controle de repetição e diversidade de mensagens.
2. Criar protocolo e fluxo protegido de ouvidoria.
3. Criar deliberação do comitê com trilha de auditoria e impedimentos.
4. Testar sigilo, proteção, retaliação, encerramento e não penalização do relato.

## 9. Testes e critérios de aceite

- Dados legados continuam carregando com os mesmos IDs, scores, alertas, orçamento e histórico.
- Próprio, Taresolvido e Xacomigo são distinguíveis por cor, símbolo e texto.
- Pessoa terceirizada não é contada duas vezes na equipe nem recebe salário próprio por engano.
- Uma pessoa pode ser própria ou terceirizada e participar voluntariamente da representação coletiva.
- Alterar filiação não muda nenhum indicador individual, proposta, salário, avaliação ou resultado econômico.
- O feed não expõe autores anônimos e as mensagens dependem do contexto.
- Relatos não causam punição automática nem redução de scores; proteção e investigação são registradas.
- Custos contratuais só são lançados uma vez por período, com teste de fechamento mensal após integração financeira.
- Executar `npm test` e validação manual em desktop e mobile antes de declarar a fase concluída.

## 10. Decisões em aberto para validação durante a implementação

- Se o marcador sindical será exclusivamente coletivo/contextual ou aplicado apenas a representantes formalmente autorizados. A recomendação técnica é não identificar individualmente filiados.
- Quais contratos/serviços iniciais serão oferecidos pelos dois fornecedores e quais setores poderão contratar cada escopo.
- Qual relógio/ciclo financeiro será adotado pela economia da Issue #30.
- Como o protótipo logístico será integrado ao hub principal sem perder sua persistência legada.

## Referências internas

- [Economia, produtividade e finanças](../ECONOMIA-PRODUTIVIDADE-FINANCAS.md)
- [Especificação de relações de trabalho, intranet e ouvidoria](ESPECIFICACAO-RELACOES-DE-TRABALHO-INTRANET-OUVIDORIA.md)
- [Especificação técnica de diversidade e inclusão](ESPECIFICACAO-TECNICA-DIVERSIDADE-INCLUSAO.md)
- [Issue #29 — eventos adversos](https://github.com/andreheck/PilhaGameNR1/issues/29)
- [Issue #30 — economia da empresa](https://github.com/andreheck/PilhaGameNR1/issues/30)
