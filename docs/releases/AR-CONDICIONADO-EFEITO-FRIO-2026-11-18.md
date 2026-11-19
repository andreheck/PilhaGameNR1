# Climatização visível com efeito frio — 18/11/2026

## O que mudou

- A melhoria canônica **Condições Físicas → Climatização e iluminação** agora instala um ar-condicionado mural em cada setor de trabalho comprado.
- O aparelho tem proporções próprias, acabamento azul a partir do nível 2 e detalhe dourado no nível 3.
- Uma névoa fria curta e contínua sai da unidade enquanto o cenário está animado. A opção do sistema `prefers-reduced-motion` congela o efeito.

## Regras preservadas

- O equipamento só aparece após a compra existente de `fisi`/`clima-ventilacao`.
- Preço, progressão e impactos de simulação continuam definidos pelo catálogo canônico em `data/continuous/catalog.js`.
- O desenho e a animação são apresentação de cenário; não criam bônus adicionais nem alteram salvamento.

## Validação

- `npm run build` materializa os builders e verifica que as novas definições são aceitas no bundle.
- Testes automatizados não foram executados nesta alteração.
