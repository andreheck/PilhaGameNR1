# Seleção compacta e benefícios — 29/10/2026

Pedido PM: priorizar seleção de heróis sem rolagem desnecessária; ampliar melhorias, benefícios e assets.

Base: PR #56 / 047f81d. Branch: codex/herois-compactos-beneficios. Nova entrega empilhada, sem merge ou troca do alias público.

## Heróis

Desktop: seis cards em 3×2, principal/apoio e salvar visíveis, retrato selecionado e resumo compacto. Ficha extensa, poderes, especialização e marcos preservados em Ficha completa. Conteúdo canônico e progresso não foram apagados para comprimir a interface. Celular: 2×3 com controles de toque; perfis abrem separadamente. Alturas menores que 600 px e zoom elevado mantêm rolagem de segurança para não cortar controles.

## Benefícios e efeitos reais no jogo

14 programas adicionais, com custo inicial e três níveis na economia existente, por setor. Custos e fatores estão em data/continuous/benefits.js; são hipóteses de balanceamento, não estimativas clínicas. Programas temporários têm vigência explícita, sem débitos mensais automáticos. Usam os recibos existentes: não há nova chave de armazenamento, pagamento retroativo, carteira ou serviço real. Os fatores mudam o setor; a saúde individual responde ao ambiente no fechamento semanal, segundo as regras vigentes, sem cura instantânea.

- Promoção: escolha de pessoa ativa; Analista → Especialista → Coordenação. Não cria quarta gerência nem altera o conselho. Cargo salvo no recibo, refletido na ficha e organograma; não usa personalidade ou saúde para decidir promoção.
- Bônus de produtividade e PPR: reconhecimento e cooperação; bônus traz contrapartida explícita de carga, PPR não concede saldo extra ao jogador.
- Redução de coparticipação, aumento do vale-alimentação, primeira consulta psicológica gratuita, subsídio de psicoterapia, creche e auxílio-moradia: apoio e acesso com critérios equitativos; não presume família ou diagnóstico dos NPCs.
- Outras opções: auxílio de mobilidade, bolsa de estudos com tempo protegido, flexibilidade de jornada com cobertura, desconexão e acessibilidade dos postos.

Saúde e cuidado psicológico: participação opcional, confidencialidade e prevenção organizacional mantidas. Remuneração não substitui corrigir sobrecarga e assédio. As descrições não representam orientação sobre contratação real desses benefícios.

## Assets

14 ícones vetoriais originais e leves em assets/benefits, usados nos cards. Metadados classificam programas como não físicos: a compra de um benefício não cria mesa, bloco de creche ou NPC de saúde no corredor. Os 25 sprites de mobiliário e as animações atuais permanecem.

Próximo pacote físico recomendado: sala de escuta com privacidade (cabine/divisória acústica), módulo de creche (mesa infantil, brinquedoteca e berço), refeitório (mesa coletiva e micro-ondas), vestiário (armários) e bicicletário. Devem ser modelados com a régua 1 célula = 1 m, pontos de interação e corredores livres. Estes modelos 3D não são declarados entregues pelos ícones.

## Validação

Testes de catálogo/ciclo, efeitos e expiração, ausência de pagamentos extras, promoção direcionada e persistência. QA de navegador: 1366×768, 1440×900, 1920×1080, 320×640 e 390×844; seis heróis e controles dentro do viewport, alvos de toque, ficha completa, compras reais no save fictício e reload. Resultados finais, capturas e SHA serão vinculados à PR. Homologação em aparelhos físicos e parecer PO/PM continuam etapas distintas.
