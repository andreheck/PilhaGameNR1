# Empresa contínua e restauração — decisão de produto de 23/10/2026

Base: 602a819 (galeria neon, Codex e três departamentos). Nova branch: feat/empresa-continua-restauracao. Sem merge na main.

## Autorização e precedência
O PM pediu seleção de heróis já na primeira tela, retirada temporária dos casos da experiência pública (não exclusão dos arquivos), métricas e layout do ZIP C3, três níveis por melhoria, efeitos imediatos/tardios/prolongados, alertas e um quarto ambiente restaurativo. Esta decisão substitui, somente no modo contínuo, o bloqueio global de 30 dias e a navegação por cinco casos. A versão antiga fica preservada em código e arquivos de save.

## Fonte verificável
Arquivo: `PilhA+ Game.zip`. SHA256 `cacd69bc9be7130df5c63f31f415cc20947d7ef03b1062bc4a3ba8797f3b2b77`.
Fonte de dados e referência: `data/continuous/catalog.js`. O build exporta também `data/continuous/register.json`, com valores de cada nível, origem e temporização.
Os 19 eventos do ZIP são iguais aos de `simulation/event-catalog.js`, reutilizados sem inventar novos valores de decisão. As seis ações de herói no ZIP são SAMPLE e não substituem os poderes canônicos.

## Métricas originais, sem bônus
| Setor | Índice exato | Exibição | Estresse | Absenteísmo | Clima | Produtividade |
|---|---:|---:|---:|---:|---:|---:|
| Escritório |33,5|34|64,2|9,98|30,3333|60,1|
| Produção |30,6667|31|72,3|10,32|33|58,4|
| Atendimento |31,3333|31|71,2|10,24|33,3333|58,8|

Índice da empresa: 31,8333, mostrado como 32. Saldo inicial 10.000. Meta empresarial 45; meta por setor 50.

| Fator | Escritório | Produção | Atendimento |
|---|---:|---:|---:|
| Ritmo e carga |28|22|24|
| Autonomia |42|30|28|
| Relações |35|40|32|
| Liderança |40|33|36|
| Reconhecimento |30|35|38|
| Segurança psicológica |26|24|30|

São índices sintéticos de 0 a 100, não avaliações clínicas; em fatores e índice, maior é melhor. Estresse/absenteísmo são derivados fictícios, não previsões para pessoas reais.

Fórmulas: índice = média dos seis fatores; empresa = média dos três setores de trabalho. Estresse = 100 − (0,4 carga + 0,3 autonomia + 0,3 liderança). Absenteísmo = 2 + 0,12(100 − índice). Clima = média de relações, reconhecimento e segurança. Produtividade = 40 + 0,6 índice. A restauração não entra na média para não diluir risco dos setores.

## Compra por setor e três níveis
Os valores de cada nível são incrementais, não substituem os anteriores. Multiplicadores de efeito 1,40 / 1,12 / 0,84. Multiplicadores de custo 1,0 / 1,4 / 1,9, arredondados para múltiplos de 50. Limite 100 nos fatores.
Exemplo original: Carga e Jornada em Produção custa 1.200 / 1.700 / 2.300 e acrescenta 28 / 22,4 / 16,8 em carga. Sem sinergia, a primeira compra passa carga de 22 para 50 e saldo de 10.000 para 8.800. Segurança Psicológica nível 1 acrescenta potencialmente 25,2 em segurança e 5,6 em relações, pelo preço 900.

## Regras novas, propostas para balanceamento
- Tempo: semana de 2 minutos ativos ou avanço manual. Compras não avançam semana. Pausa, aba oculta e diálogos suspendem o tempo; nenhuma recuperação offline fictícia. Não existe um prazo universal de 30 dias.
- Imediato: efeito na compra. Prolongado: cresce linearmente durante as semanas da ficha. Tardio: aguarda o atraso da ficha e então cresce durante sua duração. Depois de consolidado, o nível instalado continua ativo; custos recorrentes e manutenção ainda são backlog.
- Sinergia: 10% em categorias compartilhadas pelos dois heróis; 15% se a dupla incluir P&D Tech. Sem categoria compartilhada = sem bônus numérico. Bônus é mostrado antes de salvar e incorporado somente em compras novas, congelado no recibo. É uma regra experimental de dupla, não ativação dos poderes especiais canônicos.
- Evento: primeiro na semana 3, demais a cada 2 semanas após resolução. Ordem determinística de protótipo. Um evento real pendente pausa o avanço; decisão e custo são aplicados uma vez. Catálogo de prévias não grava alterações.

## Quarto ambiente e inventário
Bloco conectado: biblioteca, bosque, meditação, mini auditório, pomar/pátio. Inicia sem recursos positivos financiados. Todos os itens abaixo têm três níveis; preços são créditos fictícios de protótipo.

| Item | Custo nível1 | Efeito-base antes multiplicador | Tempo | Uso |
|---|---:|---|---|---|
| Puff |450|carga3, relações2|imediato|biblioteca|
| Árvore |700|carga4, segurança2|atraso2 + crescimento1|bosque|
| Almofadas |250|carga2, segurança1|imediato|meditação|
| Tapete de meditação |400|carga3, autonomia2|imediato|meditação|
| Capelão |1000|relações4, segurança4|crescimento2|auditório|
| Professor de yoga |1200|carga5, autonomia3|crescimento2|meditação|
| Plano de saúde |2200|segurança7, reconhecimento5|atraso1 + crescimento1|benefício|
| Livros |600|autonomia4, reconhecimento3|crescimento2|biblioteca|
| Cursos e palestras |900|liderança4, autonomia4, reconhecimento3|atraso1 + crescimento2|auditório|
| Árvore frutífera |850|carga4, relações3|atraso3 + crescimento1|pomar|
| Banco confortável |550|carga3, relações3|imediato|pátio|
| Intervalo estendido |650|carga6, autonomia4|imediato|descanso|

Recursos e uso geram recuperação limitada: até seis visitantes, identidade preservada e sem duplicar a pessoa no posto durante a pausa. Contribuição recente por visita limitada a dois pontos e por setor a seis pontos em carga; relações recebe metade, com teto. Sem recurso ativo não há visitante nem recuperação automática. A participação em yoga, meditação e capelania é voluntária, com alternativas inclusivas/laicas; serviços não substituem mudanças estruturais.

## Migração e integridade
Novo registro `pilha-company-continuous-v2`. Importa saldo legado e equivalentes de melhorias globais para os três setores. Mantém intactos saves antigos de investimento, XP, dupla, casos e ciclos. Registro inválido bloqueia alteração, em vez de zerar o saldo. Transação usa revisão, validação e Web Locks quando disponíveis. Duas abas não podem confirmar o mesmo orçamento desatualizado. Bônus não são recalculados retroativamente.

## Limites e continuidade
O quarto ambiente é um protótipo procedural, não cenário artístico final. O rodízio coloca a mesma identidade em pausa e de volta no setor por semanas; trajetos contínuos completos até cada assento ainda precisam de navegação dedicada. Serviços contratados são representados por elementos de cenário, não novos personagens rigados. Afastamentos afetam os indicadores/eventos; ausência individual com escala e retorno detalhados permanece backlog.

Ver `docs/backlog/RESTAURACAO-CODEX.md`. Não declarar publicação ou testes visuais sem registro de CI/SHA.
