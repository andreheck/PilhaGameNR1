# Heróis: ficha aprovada e experiência atual — 05/11/2026

Base da implementação: PR #69 / 1c692f4. Referência consultada no GitHub: PR #22 / 03d4b30553a95c77207dcbd136aa79ea239082d5. Os seis arquivos docs/herois/*.md individuais são idênticos aos locais após normalizar finais de linha. Não foi importado o runtime divergente da #22.

| ID | Interface | Arquétipo / área | Raridade | Ficha e galeria |
| --- | --- | --- | --- | --- |
| H01 | Diretor | Estrategista operacional / Operações | Épico | Coincidem; 6 atributos e 4 habilidades |
| H02 | Psicóloga | Guardiã do Equilíbrio Humano | Épico | Coincidem; 6 atributos e 4 habilidades |
| H03 | Cientista de Dados | Inteligência aplicada / inventor analítico | Épico | Coincidem; 6 atributos e 4 habilidades |
| H04 | Engenheiro de Segurança | Guardião preventivo / higiene ocupacional | Épico | Coincidem; 6 atributos e 4 habilidades |
| H05 | P&D Tech | Arquiteto da Transformação | Lendário | Coincidem; 6 atributos e 4 habilidades |
| H06 | RS & TD | Arquiteto de Talentos | Épico | Coincidem; 6 atributos e 4 habilidades |

Os nomes resumidos das artes (Comandante Pilha, Dados & IA, Tecnologia etc.) não criam outro elenco. IDs, raridade, ficha, retratos e seleção continuam vinculados ao roster. H06 é Épico; nenhuma alteração de raridade foi necessária.

## Correspondência técnica

- hero-roster.js contém os seis IDs, acesso beta e raridades aprovadas.
- ui/hero-sheets.js é gerado de docs/herois por tools/build-hero-sheets.mjs. O teste confere a reprodução exata dos dados gerados; a fonte imutável f929943 continua válida, pois os seis documentos conferem com a referência atual.
- ui/hero-gallery-data.js une a ficha a retratos aprovados e progresso real salvo. Consultar a galeria não escreve novo estado nem concede recompensa.
- simulation/hero-progression.js limita a progressão ao nível 30, separa XP de missão e formação, exige cotação válida e grava débito/progressão atomicamente. Testes cobrem limite, repetição de recompensas e falha de escrita.
- Na empresa contínua, a dupla participa das sinergias contextualizadas de novas compras e do adicional semanal por herói Épico. Esses efeitos não equivalem à execução de todos os poderes das fichas.

## Limites que permanecem

O fluxo contínuo mostra o progresso já salvo de missões/formações, mas semanas, pausas e compras de mobiliário não concedem XP novo. Os casos históricos e suas fontes de XP permanecem preservados; não foram reconectados ao mapa nesta entrega.

O motor temporal legado identifica duas habilidades do Diretor (Visão Sistêmica e Reorganização Estratégica). A seleção na empresa contínua marca as habilidades como não executáveis nesse fluxo. As 24 habilidades das seis fichas não são declaradas integralmente implementadas. Equipamentos, especializações ramificadas, controle completo dos heróis e rigs definitivos dos seis heróis continuam pendências próprias.

Validação local: hero-gallery 5/5; hero-progression 7/7. Nenhuma ficha, raridade, curva, recompensa ou poder foi alterado nesta auditoria.
