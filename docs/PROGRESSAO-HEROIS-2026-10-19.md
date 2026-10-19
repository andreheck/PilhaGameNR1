# Progressão de heróis — créditos, XP e futuros elétrons
Data: 19/10/2026. Modelo de protótipo: `heroes-1`. Requisito: pedido do acionista/PO; preços, curva, multiplicadores e quantidades de XP abaixo são hipóteses de balanceamento, não parâmetros aprovados por pesquisa.

## 1. Três caminhos, estados distintos
| Caminho | Implementação nesta entrega | Limites |
|---|---|---|
| Investir créditos do orçamento | Comprar +1 nível com confirmação e preço visível | Créditos fictícios; sem cobrança em reais, gateway ou cartão |
| Resolver situações e casos | XP de confirmação adequada e bônus no fechamento aprovado do ciclo | Primeira recompensa por situação/caso/herói; sem repetir prêmio no mesmo evento |
| Elétrons do PilhA+ App | Arquitetura documentada | Não há vínculo, recebimento de energia, carteira ativa ou conversão implementada |

O jogador continua sendo o **acionista**, decidindo quanto investir no inventário e quanto destinar à formação dos especialistas. Não confundir o nível de um personagem fictício com avaliação de pessoas reais.

## 2. Curva implementada para testar
Todos os seis heróis começam no nível 1. Limite configurado: nível 30.

- XP necessário entre nível `L` e `L+1`: `100 + 50*(L-1)`.
- Total acumulado necessário ao nível `L`: `100*(L-1) + 25*(L-1)*(L-2)`.
- Investimento para comprar o próximo nível: `500 + 150*(L-1)` créditos.
- A compra preenche apenas os pontos que faltam ao próximo nível; o custo exibido é a tarifa de avanço desse nível, não proporcional aos pontos faltantes.
- `earnedXp` representa XP conquistado; `trainingXp` representa formação comprada. O nível deriva da soma; a interface apresenta as duas origens separadamente.

| Passagem | XP do intervalo | XP acumulado ao destino | Custo de compra |
|---|---:|---:|---:|
| 1 → 2 | 100 | 100 | 500 |
| 2 → 3 | 150 | 250 | 650 |
| 3 → 4 | 200 | 450 | 800 |
| 4 → 5 | 250 | 700 | 950 |

Exemplo: com 25 XP conquistados no nível 1, a compra de 500 créditos acrescenta 75 pontos de formação, alcançando o nível 2. A compra exige confirmação e não é repetida automaticamente. Uma cotação com nível desatualizado é recusada, mesmo se houver saldo.

Os cinco casos atuais oferecem um número finito de eventos. Não se promete alcançar todos os níveis apenas repetindo esse conteúdo. Novas situações, orçamento e economia futura dependem de balanceamento.

## 3. Regras de XP implementadas
**Situação:** 25 XP para cada especialista da dupla congelada no caso, na primeira confirmação de uma opção adequada (pontuação editorial ≥20) e sem violação ética em qualquer etapa já respondida. Clicar em uma opção não concede XP; confirmar a etapa é obrigatório.

**Caso:** 150 XP para cada especialista somente quando o registro de decisões tem a avaliação ética vigente, foi concluído com aprovação sem violações e o ciclo de 30 dias foi integralmente acompanhado. O resultado é recalculado das escolhas; não se confia apenas em um booleano `passed` recebido da UI.

IDs de eventos: `xp1:<caso>:step<0..3>:<heroi>` e `xp1:<caso>:case:<heroi>`. Repetir, voltar, recarregar ou abrir novamente a mesma missão não concede o mesmo prêmio. Caso já aprovado no fluxo legado não é convertido automaticamente em recompensa temporal nova.

Aprendizado correto anterior não é removido por uma escolha posterior errada, mas isso não aprova o plano e não concede o bônus do caso. Tempo ocioso, compra de níveis e simples visita à página não geram XP. O acúmulo não substitui a revisão pedagógica.

## 4. Orçamento e persistência
O crédito de formação sai do **mesmo saldo** usado para comprar recursos do salão. Exemplo em uma sessão nova: 10.000 → formação 500 → 9.500 → ergonomia 1.800 → 7.700.

A progressão foi incluída no envelope já existente `pilha-investment-v1`, propriedade `heroProgression`, sem apagar inventário, histórico, progresso de casos ou dupla. Débito, pontos e novo nível são gravados em **um único `localStorage.setItem`**; falha de gravação não confirma a compra. `spent` continua representando recursos estruturais; `heroProgression.spentCredits` representa formação. Reset de estruturas devolve apenas o gasto estrutural e preserva XP, níveis, recibos e despesas de formação; continua bloqueado em ciclos registrados.

Quando disponível, o Web Lock `pilha-economy` serializa formação, compras e XP entre abas. Fallback antigo serializa apenas nesta aba: suporte transacional entre várias abas sem Web Locks não é garantido. Navegadores e armazenamento local não são uma carteira segura contra edição por console, fraude ou sincronização externa. Antes de qualquer moeda valiosa, resgate ou integração, migrar para livro-razão no servidor.

## 5. Efeito do nível e poderes
Somente os dois poderes do Diretor já definidos no motor têm execução temporal nesta etapa. Para eles foi acrescentado o fator hipotético `1 + 0,02*(nível_do_herói-1)`, limitado a **1,58**, multiplicando apenas sua contribuição operacional no modelo. O fator incide sobre o efeito, não adiciona 58 pontos ao indicador. O modelo continua com retornos decrescentes e contribuições individuais limitadas.

O nível usado fica registrado na **ativação**. A passiva captura o nível ao iniciar a campanha; a ativa captura o nível no novo comando. Comprar um nível durante uma ação não altera retroativamente sua preparação, duração, efeito ou recarga. A próxima ativação poderá usar o nível novo. Os demais perfis acumulam nível, mas não recebem poderes ou coeficientes inventados.

**Nível do herói é diferente de nível da habilidade.** Nesta versão, habilidades executáveis permanecem no nível 1. Comprar nível 21 do herói NÃO torna qualquer poder permanente. Permanência exige habilidade explicitamente elegível e nível da habilidade estritamente acima de 20, ou exceção aprovada. Nenhum poder permanente novo foi habilitado.

Comprar nível não pula o relógio, não muda notas pedagógicas, não compra aprovação e não elimina os requisitos de proteção das pessoas. A taxa continua em 7 dias/hora; quatro semanas são 28 dias/4h; 30 dias requerem 4h17min09s ativos.

## 6. Validação e próximos responsáveis
- Testes puros: curvas, mistura de fontes, saldo insuficiente, confirmação desatualizada, cap, gravação atômica, corrupção, repetição, preservação de inventário, XP seguro, final temporizado e ausência de permanência automática.
- Navegador: cancelar/confirmar, visualizar nível da dupla, ganhar XP por etapa, repetir sem duplicação, recarregar, manter orçamento e timer; evidências especificam emulação ou aparelho real.
- **Manus:** servidor/ledger futuro, ensaio de longa duração, conflitos de abas e integração às rotinas 3D.
- **Claude:** clareza da formação paga versus experiência, arte dos seis perfis e hierarquia mobile.
- **Kimi:** revisar lógica pedagógica de recompensas e evitar associação com mérito ou saúde de pessoas reais.
- **PO/André:** validar preços/curva e testar no próprio aparelho antes de chamar o balanceamento de definitivo.
