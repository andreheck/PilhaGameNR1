/* PilhA+ Game — Catálogo de eventos adversos (dados puros, sem dependências).
 *
 * Cada evento segue a mesma estrutura visual e narrativa:
 *   alerta (ícone + nome + animação curta) → contexto → impacto → decisão → consequência.
 *
 * Campos:
 *   id, c (categoria 0–4), n (nome), ic (caminho SVG 24x24, traço), an (animação do alerta),
 *   sev ("warn" amarelo = atenção | "crit" vermelho = urgência),
 *   sec (lista de setores que podem ser afetados), prot (id da melhoria que protege: o impacto cai pela metade),
 *   ctx (frase de contexto; {s} = nome do setor), ind (indicadores qualitativos afetados),
 *   now (impacto imediato, sempre aplicado), opts (decisões; a primeira sempre existe e a última é gratuita).
 *
 * Efeitos ({ mods, all, bal, balPct, infl }):
 *   mods   fatores psicossociais do setor afetado (carga, auton, relac, lider, recon, seg)
 *   all    o mesmo, para os 3 setores
 *   bal    variação de caixa (moedas)        balPct  variação de caixa em fração do saldo
 *   infl   variação do custo das melhorias, em pontos percentuais
 *   Regra: efeito positivo em fator é permanente; efeito negativo é temporário e se dissipa em algumas semanas.
 */
(function (global) {
  "use strict";

  var ALL = ["escritorio", "producao", "atendimento"];

  var CATS = [
    { n: "Operacionais e tecnológicos", cor: "#4cc9f0" },
    { n: "Humanos e psicossociais",     cor: "#b794f6" },
    { n: "Financeiros e estratégicos",  cor: "#ffd24b" },
    { n: "Saúde, segurança e ambiente", cor: "#fb923c" },
    { n: "Externos e socioeconômicos",  cor: "#2dd4bf" }
  ];

  var LIST = [
    /* 1. Operacionais e tecnológicos */
    { id: "equip", c: 0, n: "Falha de equipamento", an: "blink", sev: "warn", sec: ["producao"], prot: null,
      ic: "M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8",
      ctx: "Uma máquina de {s} parou, mesmo com a manutenção preventiva em dia. A capacidade caiu e os prazos de entrega estão ameaçados.",
      ind: ["Capacidade ▼", "Entrega ▼"],
      now: { mods: { carga: -6 } },
      opts: [
        { l: "Reparo emergencial", d: "Chamar a assistência técnica agora.", cost: 700, e: { mods: { carga: 5 } }, r: "A linha voltou em poucas horas e o turno recuperou o ritmo." },
        { l: "Redistribuir a produção", d: "Cobrir a falha com os outros postos.", cost: 0, e: { mods: { carga: -3, relac: -2 } }, r: "O prazo foi salvo, mas a equipe fez horas extras e o cansaço aumentou." }
      ] },
    { id: "sist", c: 0, n: "Indisponibilidade do sistema", an: "blink", sev: "warn", sec: ["escritorio", "atendimento"], prot: "muda",
      ic: "M3 5h18v11H3zM8 20h8M12 16v4M12 8v3.5M12 13.5v.01",
      ctx: "Uma atualização derrubou os sistemas de {s}. Há filas, retrabalho e frustração entre as pessoas.",
      ind: ["Entrega ▼", "Clima ▼"],
      now: { mods: { carga: -5, relac: -2 } },
      opts: [
        { l: "Acionar o suporte e comunicar a equipe", d: "Informar o prazo de volta a cada hora.", cost: 500, e: { mods: { carga: 4, relac: 2, seg: 2 } }, r: "A comunicação clara reduziu a ansiedade enquanto o suporte restaurava o sistema." },
        { l: "Esperar a correção", d: "Sem ação extra por ora.", cost: 0, e: { mods: { carga: -3, seg: -2 } }, r: "Sem notícias sobre o prazo, a frustração cresceu e a confiança caiu." }
      ] },
    { id: "gargalo", c: 0, n: "Gargalo operacional", an: "slide", sev: "warn", sec: ["producao"], prot: "auto",
      ic: "M3 14h18M5 14v3M19 14v3M6 10h4v4H6zM12 8h4v6h-4z",
      ctx: "Um setor melhorou o desempenho e sobrecarregou o seguinte. A eficiência local subiu, mas a entrega total em {s} piorou.",
      ind: ["Entrega ▼", "Capacidade ▼"],
      now: { mods: { carga: -6, auton: -2 } },
      opts: [
        { l: "Rebalancear equipes entre os setores", d: "Mover pessoas para onde o fluxo trava.", cost: 600, e: { mods: { carga: 6, relac: 2 } }, r: "O fluxo se destravou e os dois setores passaram a conversar sobre capacidade." },
        { l: "Ampliar a capacidade do setor seguinte", d: "Investimento maior, solução mais estável.", cost: 1200, e: { mods: { carga: 9, auton: 2 } }, r: "O gargalo foi resolvido na origem e a entrega total voltou a subir." },
        { l: "Manter como está", d: "Esperar o fluxo se ajustar.", cost: 0, e: { mods: { carga: -3, recon: -2 } }, r: "As caixas continuaram acumulando e ninguém reconheceu o esforço extra da equipe." }
      ] },

    /* 2. Humanos e psicossociais */
    { id: "mud", c: 1, n: "Resistência à mudança", an: "pulse", sev: "warn", sec: ALL, prot: "muda",
      ic: "M20 12a8 8 0 1 1-2.5-5.8M20 4v4h-4",
      ctx: "Um novo processo chegou a {s}, mas a equipe tem dificuldade de confiar, entender e adotar a mudança.",
      ind: ["Adoção ▼", "Saúde psicossocial ▼"],
      now: { mods: { auton: -4, seg: -3 } },
      opts: [
        { l: "Treinar e ouvir as dúvidas", d: "Oficinas curtas e canal aberto.", cost: 600, e: { mods: { auton: 6, seg: 4, recon: 2 } }, r: "As dúvidas viraram sugestões e a equipe passou a se sentir parte da mudança." },
        { l: "Nomear defensores da mudança", d: "Pessoas de referência em cada turno.", cost: 300, e: { mods: { auton: 3, relac: 3 } }, r: "Colegas de confiança ajudaram a destravar a adoção do novo processo." },
        { l: "Exigir adoção imediata", d: "Sem tempo de adaptação.", cost: 0, e: { mods: { auton: -3, seg: -4, lider: -2 } }, r: "A adoção foi forçada e a equipe passou a esconder dificuldades." }
      ] },
    { id: "conf", c: 1, n: "Conflito entre colegas", an: "shake", sev: "warn", sec: ALL, prot: "rela",
      ic: "M3 4h10v7H9l-3 3v-3H3zM11 13h10v7h-2v2l-3-2h-5z",
      ctx: "Responsabilidades mal definidas provocaram atritos em {s}. A cooperação caiu e as entregas estão atrasando.",
      ind: ["Cooperação ▼", "Entrega ▼"],
      now: { mods: { relac: -6, seg: -2 } },
      opts: [
        { l: "Mediar com apoio de RH", d: "Conversa guiada entre as pessoas envolvidas.", cost: 500, e: { mods: { relac: 8, seg: 3 } }, r: "A mediação abriu espaço para acordos e a cooperação foi retomada." },
        { l: "Redefinir papéis e responsabilidades", d: "Deixar claro quem decide o quê.", cost: 400, e: { mods: { relac: 5, auton: 4, lider: 2 } }, r: "Com papéis claros, os atritos perderam o motivo e as entregas voltaram ao ritmo." },
        { l: "Deixar que resolvam sozinhos", d: "Sem intervenção.", cost: 0, e: { mods: { relac: -3, seg: -3 } }, r: "O conflito se arrastou e o clima do setor ficou mais pesado." }
      ] },
    { id: "fadiga", c: 1, n: "Fadiga acumulada", an: "sway", sev: "warn", sec: ["producao", "atendimento", "escritorio"], prot: "jorn",
      ic: "M3 8h15v8H3zM18 11h3v2h-3zM6 10.5v3",
      ctx: "Semanas intensas deixaram a equipe de {s} cansada e irritadiça. O risco de erros e afastamentos cresce, mesmo com o ambiente adequado.",
      ind: ["Energia ▼", "Risco de afastamento ▲"],
      now: { mods: { carga: -8, seg: -2 } },
      opts: [
        { l: "Pausas e rodízio de tarefas", d: "Aliviar a carga sem parar a operação.", cost: 600, e: { mods: { carga: 8, seg: 2 } }, r: "As pausas reais devolveram energia e os erros diminuíram." },
        { l: "Folga coletiva", d: "Um dia de recuperação para todos.", cost: 1100, e: { mods: { carga: 12, relac: 3, recon: 3 } }, r: "A equipe voltou descansada e percebeu o cuidado da gestão." },
        { l: "Reforçar a meta e seguir", d: "Pedir mais um esforço.", cost: 0, e: { mods: { carga: -4, lider: -3 } }, r: "A meta foi cumprida, mas a confiança na liderança diminuiu." }
      ] },

    /* 3. Financeiros e estratégicos */
    { id: "corte", c: 2, n: "Corte inesperado de orçamento", an: "drop", sev: "warn", sec: ALL, prot: null,
      ic: "M4 4v16h16M7 8l4 4 3-3 4 5M18 14v-2.5h-2.5",
      ctx: "A empresa perdeu parte dos recursos disponíveis. É preciso rever prioridades sem abrir mão dos controles de saúde e segurança.",
      ind: ["Caixa ▼"],
      now: { balPct: -0.12 },
      opts: [
        { l: "Priorizar saúde e segurança", d: "Adiar o que não for essencial.", cost: 0, e: { all: { seg: 2 } }, r: "Os controles essenciais foram preservados e a equipe percebeu o cuidado." },
        { l: "Cortar também treinamentos e pausas", d: "Alívio rápido no caixa, com custo humano.", cost: 0, e: { bal: 900, all: { seg: -4, carga: -4, recon: -3 } }, r: "O caixa respirou, mas o risco psicossocial subiu em toda a empresa." }
      ] },
    { id: "demanda", c: 2, n: "Pico inesperado de demanda", an: "rise", sev: "warn", sec: ["producao", "atendimento", "escritorio"], prot: "jorn",
      ic: "M4 13h5l1 2h4l1-2h5M4 13l2-7h12l2 7v6H4zM12 3v5M9.5 5.5L12 8l2.5-2.5",
      ctx: "Chegaram mais pedidos do que {s} consegue atender. A receita está à vista, mas há risco de sobrecarga, atrasos e retrabalho.",
      ind: ["Capacidade ▲ no limite", "Receita ▲"],
      now: { mods: { carga: -5 } },
      opts: [
        { l: "Aceitar todos os pedidos", d: "Mais receita, mais pressão.", cost: 0, e: { bal: 1800, mods: { carga: -8, seg: -2 } }, r: "A receita entrou, mas a equipe operou no limite e o retrabalho cresceu." },
        { l: "Contratar temporários", d: "Reforço para o pico.", cost: 500, e: { bal: 1500, mods: { carga: -2, relac: -1 } }, r: "O reforço absorveu o pico, com um período curto de adaptação." },
        { l: "Aceitar só o que a capacidade permite", d: "Receita menor, ritmo sustentável.", cost: 0, e: { bal: 700, mods: { carga: 2 } }, r: "A entrega ficou em dia e a equipe manteve o ritmo." }
      ] },
    { id: "retorno", c: 2, n: "Investimento com baixo retorno", an: "drop", sev: "warn", sec: ALL, prot: null, when: "invested",
      ic: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8v6M9.5 12L12 14.5 14.5 12",
      ctx: "Uma melhoria em {s} resolveu apenas parte do problema: a causa principal estava em outro processo ou condição de trabalho.",
      ind: ["Retorno ▼", "Expectativa ▼"],
      now: { mods: { recon: -3, auton: -2 } },
      opts: [
        { l: "Investigar a causa raiz", d: "Mapear onde o problema realmente nasce.", cost: 400, e: { mods: { auton: 5, recon: 3, lider: 2 } }, r: "A causa foi encontrada e a equipe reavaliou a estratégia com mais clareza." },
        { l: "Insistir no mesmo investimento", d: "Aguardar o efeito completo.", cost: 0, e: { mods: { recon: -2, lider: -2 } }, r: "O resultado continuou modesto e a equipe perdeu parte da confiança no plano." }
      ] },

    /* 4. Saúde, segurança e ambiente */
    { id: "risco", c: 3, n: "Novo risco no ambiente", an: "blink", sev: "crit", sec: ALL, prot: "espa",
      ic: "M12 3l10 18H2zM12 10v4.5M12 17.5v.01",
      ctx: "Uma mudança no layout de {s} bloqueou uma rota de circulação e criou um perigo que ninguém previu.",
      ind: ["Segurança ▼", "Risco de acidente ▲"],
      now: { mods: { seg: -6 } },
      opts: [
        { l: "Interditar e corrigir a rota", d: "Resolver na origem, agora.", cost: 800, e: { mods: { seg: 9, carga: 1 } }, r: "A rota foi liberada e sinalizada. O risco deixou de existir." },
        { l: "Sinalizar provisoriamente", d: "Reduz o risco enquanto planeja.", cost: 200, e: { mods: { seg: 3 } }, r: "A sinalização ajudou, mas o problema de layout continua pendente." },
        { l: "Ignorar por ora", d: "Tratar depois.", cost: 0, e: { mods: { seg: -5, relac: -2 } }, r: "O perigo continuou e as pessoas passaram a evitar a área, perdendo confiança na gestão." }
      ] },
    { id: "quase", c: 3, n: "Quase acidente", an: "pulse", sev: "warn", sec: ["producao", "escritorio"], prot: "psic",
      ic: "M4 16h16M5 16a7 7 0 0 1 14 0M12 6v5M3 19h18",
      ctx: "Uma carga instável quase atingiu um colega em {s}. Ninguém se feriu, mas o episódio exige investigação e prevenção.",
      ind: ["Segurança ▼", "Investigação pendente"],
      now: { mods: { seg: -4 } },
      opts: [
        { l: "Investigar sem culpar ninguém", d: "Foco em causas, não em culpados.", cost: 400, e: { mods: { seg: 8, auton: 2, lider: 2 } }, r: "As pessoas relataram com tranquilidade e a causa foi corrigida." },
        { l: "Reforçar o procedimento e treinar", d: "Revisar o método e treinar o turno.", cost: 700, e: { mods: { seg: 9, recon: 3 } }, r: "O procedimento foi revisado com a equipe e o risco caiu." },
        { l: "Arquivar o caso", d: "Sem dano, sem ação.", cost: 0, e: { mods: { seg: -6, lider: -3 } }, r: "O caso foi esquecido e os próximos quase acidentes deixaram de ser relatados." }
      ] },
    { id: "clima", c: 3, n: "Condição ambiental extrema", an: "sway", sev: "crit", sec: ALL, prot: "fisi",
      ic: "M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0zM12 9v7",
      ctx: "Uma onda de calor atingiu {s}. A climatização não dá conta e a operação ficou limitada.",
      ind: ["Capacidade ▼", "Saúde ▼"],
      now: { mods: { carga: -8, seg: -2 } },
      opts: [
        { l: "Ventilação, hidratação e pausas extras", d: "Medidas imediatas de proteção.", cost: 600, e: { mods: { carga: 8 } }, r: "As pausas e a hidratação mantiveram a equipe segura durante o calor." },
        { l: "Reduzir o turno", d: "Menos horas expostas, menos produção.", cost: 1000, e: { mods: { carga: 11, seg: 2, recon: 2 } }, r: "A redução do turno protegeu a equipe e foi bem recebida." },
        { l: "Manter a operação", d: "Seguir como se nada tivesse mudado.", cost: 0, e: { mods: { carga: -5, lider: -3 } }, r: "A equipe trabalhou no calor e a confiança na liderança diminuiu." }
      ] },

    /* 5. Externos e socioeconômicos */
    { id: "forn", c: 4, n: "Atraso de fornecedor", an: "slide", sev: "warn", sec: ["producao", "atendimento"], prot: null,
      ic: "M2 6h11v9H2zM13 9h4l3 3v3h-7zM6 18a1.8 1.8 0 1 0 .01 0M17 18a1.8 1.8 0 1 0 .01 0",
      ctx: "Insumos e equipamentos de {s} não chegaram no prazo. É preciso reorganizar o estoque, negociar prazos ou buscar alternativas.",
      ind: ["Estoque ▼", "Entrega ▼"],
      now: { mods: { carga: -4, auton: -2 } },
      opts: [
        { l: "Buscar um fornecedor alternativo", d: "Custo extra, entrega garantida.", cost: 800, e: { mods: { carga: 5, auton: 3 } }, r: "O novo fornecedor entregou a tempo e a equipe ganhou segurança no plano B." },
        { l: "Renegociar prazos com os clientes", d: "Transparência sobre o atraso.", cost: 0, e: { mods: { recon: -2, carga: 2 } }, r: "Os clientes aceitaram novos prazos, com algum desgaste." },
        { l: "Esperar a entrega", d: "Sem ação extra.", cost: 0, e: { mods: { carga: -4, lider: -2 } }, r: "A equipe ficou parada à espera do material e a pressão por prazos aumentou." }
      ] },
    { id: "saida", c: 4, n: "Saída de profissional-chave", an: "pulse", sev: "warn", sec: ALL, prot: "auto",
      ic: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M17 8h5",
      ctx: "Uma pessoa importante de {s} deixou a empresa. A equipe perdeu conhecimento e há tarefas sem responsável.",
      ind: ["Capacidade ▼", "Conhecimento ▼"],
      now: { mods: { carga: -5, auton: -3, seg: -2 } },
      opts: [
        { l: "Reorganizar tarefas e documentar", d: "Registrar o que só uma pessoa sabia.", cost: 500, e: { mods: { auton: 5, carga: 3 } }, r: "As tarefas ganharam responsáveis e o conhecimento deixou de depender de uma só pessoa." },
        { l: "Abrir vaga e acompanhar a transição", d: "Substituição com acolhimento.", cost: 900, e: { mods: { carga: 6, seg: 3, lider: 2 } }, r: "A transição foi planejada e a equipe sentiu que não ficou sozinha." },
        { l: "Distribuir entre quem ficou", d: "Sem reforço.", cost: 0, e: { mods: { carga: -5, relac: -2 } }, r: "A sobrecarga recaiu sobre poucas pessoas e a tensão aumentou." }
      ] },
    { id: "vaga", c: 4, n: "Escassez de candidatos qualificados", an: "drop", sev: "warn", sec: ALL, prot: null,
      ic: "M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM15.5 15.5L21 21",
      ctx: "A vaga de {s} segue aberta há semanas e as poucas candidaturas não têm o perfil. A pressão sobre a equipe atual continua.",
      ind: ["Vagas abertas ▲", "Pressão sobre a equipe ▲"],
      now: { mods: { carga: -5, recon: -2 } },
      opts: [
        { l: "Revisar proposta e canais de divulgação", d: "Tornar a vaga mais atraente e visível.", cost: 600, e: { mods: { carga: 4, recon: 3 } }, r: "A proposta revisada atraiu mais candidatos e a vaga ganhou ritmo." },
        { l: "Indicação e formação interna", d: "Crescer talentos dentro de casa.", cost: 900, e: { mods: { carga: 6, recon: 4, auton: 2 } }, r: "A formação interna abriu caminhos de carreira e a equipe se sentiu valorizada." },
        { l: "Seguir esperando", d: "Manter o processo como está.", cost: 0, e: { mods: { carga: -4, seg: -2 } }, r: "A vaga continuou aberta e a equipe seguiu sobrecarregada." }
      ] },
    { id: "infl", c: 4, n: "Inflação", an: "rise", sev: "warn", sec: ALL, prot: null,
      ic: "M3 12V4h8l9 9-8 8zM7.5 8v.01M14 6l3 0 0 3",
      ctx: "Os custos de insumos, serviços e operação subiram. Se o planejamento não for adaptado, as melhorias ficam mais caras.",
      ind: ["Custos ▲", "Margem ▼"],
      now: { infl: 8 },
      opts: [
        { l: "Renegociar com fornecedores", d: "Reduz o aumento de custos.", cost: 400, e: { infl: -5 }, r: "Os novos contratos seguraram parte do aumento." },
        { l: "Repassar parte ao preço final", d: "Dividir o impacto com o mercado.", cost: 0, e: { infl: -3 }, r: "Parte do custo foi repassada, com cuidado para não perder clientes." },
        { l: "Absorver o aumento", d: "Manter preços e margem menor.", cost: 0, e: {}, r: "A empresa absorveu o aumento e seguiu com o plano, em um cenário mais caro." }
      ] },
    { id: "juros", c: 4, n: "Juros elevados", an: "rise", sev: "warn", sec: ALL, prot: null,
      ic: "M5 19L19 5M7 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
      ctx: "Empréstimos e financiamentos ficaram mais caros. Investimentos que dependem de crédito precisam ser adiados ou redimensionados.",
      ind: ["Custo financeiro ▲"],
      now: { infl: 5 },
      opts: [
        { l: "Quitar parte da dívida", d: "Libera o orçamento no longo prazo.", cost: 900, e: { infl: -5 }, r: "A dívida menor aliviou o custo financeiro e liberou margem." },
        { l: "Renegociar o prazo do financiamento", d: "Parcelas menores, custo moderado.", cost: 300, e: { infl: -2 }, r: "O novo prazo reduziu o peso das parcelas." },
        { l: "Seguir com o plano", d: "Manter os investimentos previstos.", cost: 0, e: {}, r: "Os investimentos seguem, em condições de crédito mais caras." }
      ] },
    { id: "vida", c: 4, n: "Custo de vida elevado", an: "rise", sev: "warn", sec: ALL, prot: null,
      ic: "M3 11l9-8 9 8M5 10v10h14V10M10 20v-5h4v5",
      ctx: "Moradia, alimentação e transporte ficaram mais caros. A remuneração perdeu poder de compra e a satisfação em {s} cai.",
      ind: ["Satisfação ▼", "Retenção ▼"],
      now: { mods: { recon: -6, seg: -2 } },
      opts: [
        { l: "Auxílio-alimentação e transporte", d: "Alívio direto no orçamento das pessoas.", cost: 900, e: { mods: { recon: 8, relac: 2 } }, r: "O auxílio aliviou o orçamento das famílias e fortaleceu a retenção." },
        { l: "Reajuste parcial com comunicação clara", d: "Explicar o que é possível e quando.", cost: 600, e: { mods: { recon: 5, seg: 2 } }, r: "O reajuste parcial, explicado com franqueza, foi bem recebido." },
        { l: "Nada a fazer por ora", d: "Esperar o cenário melhorar.", cost: 0, e: { mods: { recon: -4, auton: -2 } }, r: "A equipe sentiu que a empresa não percebeu a realidade e o desânimo cresceu." }
      ] },
    { id: "epid", c: 4, n: "Epidemia local", an: "pulse", sev: "crit", sec: ["atendimento", "escritorio", "producao"], prot: "apoi",
      ic: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM12 8v7M8.5 11.5h7",
      ctx: "Um surto local reduziu temporariamente a equipe de {s}. É preciso reorganizar as atividades, proteger quem segue trabalhando e manter a continuidade.",
      ind: ["Equipe disponível ▼", "Continuidade em risco"],
      now: { mods: { carga: -7, seg: -3 } },
      opts: [
        { l: "Plano de contingência e revezamento", d: "Escalas e medidas de prevenção.", cost: 700, e: { mods: { carga: 7, seg: 4 } }, r: "O revezamento manteve a operação e as pessoas se sentiram protegidas." },
        { l: "Trabalho remoto ou híbrido onde der", d: "Menos pessoas no mesmo espaço.", cost: 500, e: { mods: { carga: 5, relac: -2, seg: 2 } }, r: "Parte da equipe passou a trabalhar à distância, com algum custo de integração." },
        { l: "Manter tudo igual", d: "Sem mudanças de rotina.", cost: 0, e: { mods: { carga: -5, seg: -4 } }, r: "A equipe reduzida carregou o mesmo volume e a preocupação com a saúde aumentou." }
      ] }
  ];

  var BY = {};
  LIST.forEach(function (e, i) { e.i = i; BY[e.id] = e; });

  global.PilhaEventos = { CATS: CATS, LIST: LIST, BY: BY };
})(typeof window !== "undefined" ? window : this);
