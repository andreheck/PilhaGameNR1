# Sessões 12–14 — Vertical slice Alpha v0.8

## Entregas implementadas
- Grade isométrica 13x10 com projeção e conversão de coordenadas de tela.
- Obstáculos e algoritmo BFS de caminhos, incluindo aproximação de NPCs por célula adjacente.
- Seis NPCs: Joana, Carla, Renata, Marina, Ana (psicóloga) e Vítor (psiquiatra).
- Conversas com quatro evidências fictícias organizacionais.
- Três intervenções e mensagens educativas comparando medidas estruturais e complementares.
- Três perspectivas, estado salvo localmente e visualização de progresso.
- Acesso mobile/desktop por canvas e botões equivalentes.

## Arquivos
- `index.html` — versão principal.
- `src/world.js` — dados do mapa e funções de navegação.
- `prototypes/capitulo-01-alpha.html` — cópia de teste no subdiretório.
- Laboratórios antigos permanecem como histórico.

## Restrições e cuidados
**Ainda não é jogo 3D nem animação definitiva.** Os avatares são figuras Canvas, sem sprites animados. Não há autenticação, banco de dados, chat com IA, campanha multicapítulos nem modelo clínico. O Caso 017 é uma simulação com números fictícios. A decisão do jogador não calcula risco clínico, eficácia terapêutica ou recuperação individual.

Psicologia e psiquiatria são funções complementares dentro do jogo. A equipe gerencial não acessa prontuários ou diagnósticos. Intervenções organizacionais são distintas de cuidados individuais.

## Testes recomendados
1. Iniciar sem progresso; falar com Joana, Carla, Renata e Marina; confirmar 4/4 evidências.
2. Escolher uma intervenção; conferir feedback e acompanhamento.
3. Atualizar a página; verificar persistência de dados.
4. Reiniciar; confirmar limpeza das evidências.
5. Clicar em obstáculos, confirmar bloqueio.
6. Validar proporções no smartphone e desktop; revisar acessibilidade do Canvas.

## Pendências para revisão conjunta
- Validação da pedagogia e de afirmações normativas.
- Ilustração/sprites definitivos, fontes e trilha de áudio.
- Condições de desbloqueio e economia do jogo.
- Design da trilha de cuidado e retorno ao trabalho com privacidade.
- Autorização de publicação automática entre GitHub e Vercel.

## Próximos incrementos sugeridos
- Extrair elementos de interface em módulos reutilizáveis.
- Testes automatizados de rotas e lógica.
- Estruturar Caso 017 em JSON separado.
- Criar capítulo 02 e progressão de missões após validar o primeiro.
