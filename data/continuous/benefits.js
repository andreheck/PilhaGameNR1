/** PM request 29/10/2026. Fictional, revisable game balance; not clinical coefficients. */
export const BENEFITS=[
  {
    "id": "promocao",
    "name": "Promoção de cargo",
    "category": "Carreira",
    "cost": 1600,
    "factors": {
      "recon": 10,
      "auton": 4
    },
    "timing": {
      "kind": "imediato",
      "delay": 0,
      "ramp": 0
    },
    "lifecycle": {
      "start": "imediato",
      "duration": "permanente",
      "durationWeeks": 0,
      "frequency": "unico",
      "progression": "estavel",
      "growthWeeks": 0
    },
    "description": "Escolha um profissional ativo: Analista → Especialista → Coordenação. Não altera as três gerências.",
    "audience": "Pessoas ativas do setor; efeito contextual, sem inferir família ou condição de saúde.",
    "rest": false,
    "origin": "PM 29/10/2026 · hipótese de balanceamento",
    "promotion": true,
    "icon": "/assets/benefits/promocao.svg"
  },
  {
    "id": "bonus-produtividade",
    "name": "Bônus de produtividade",
    "category": "Remuneração",
    "cost": 800,
    "factors": {
      "recon": 8,
      "relac": 3,
      "carga": -2
    },
    "timing": {
      "kind": "imediato",
      "delay": 0,
      "ramp": 0
    },
    "lifecycle": {
      "start": "imediato",
      "duration": "temporario",
      "durationWeeks": 4,
      "frequency": "unico",
      "progression": "estavel",
      "growthWeeks": 0
    },
    "description": "Reconhecimento coletivo com metas realistas; a pressão de avaliação reduz Ritmo e carga em 2 pontos-base.",
    "audience": "Pessoas ativas do setor; efeito contextual, sem inferir família ou condição de saúde.",
    "rest": false,
    "origin": "PM 29/10/2026 · hipótese de balanceamento",
    "promotion": false,
    "icon": "/assets/benefits/bonus-produtividade.svg"
  },
  {
    "id": "ppr",
    "name": "Participação nos resultados — PPR",
    "category": "Remuneração",
    "cost": 1800,
    "factors": {
      "recon": 10,
      "relac": 5,
      "auton": 2
    },
    "timing": {
      "kind": "tardio",
      "delay": 1,
      "ramp": 1
    },
    "lifecycle": {
      "start": "tardio",
      "duration": "temporario",
      "durationWeeks": 12,
      "frequency": "unico",
      "progression": "progressivo",
      "growthWeeks": 1
    },
    "description": "Programa coletivo com critérios transparentes; não gera dinheiro extra para o jogador.",
    "audience": "Pessoas ativas do setor; efeito contextual, sem inferir família ou condição de saúde.",
    "rest": false,
    "origin": "PM 29/10/2026 · hipótese de balanceamento",
    "promotion": false,
    "icon": "/assets/benefits/ppr.svg"
  },
  {
    "id": "coparticipacao",
    "name": "Redução da coparticipação no plano",
    "category": "Cuidado e benefícios",
    "cost": 1400,
    "factors": {
      "seg": 7,
      "recon": 5
    },
    "timing": {
      "kind": "tardio",
      "delay": 1,
      "ramp": 1
    },
    "lifecycle": {
      "start": "tardio",
      "duration": "temporario",
      "durationWeeks": 12,
      "frequency": "unico",
      "progression": "progressivo",
      "growthWeeks": 1
    },
    "description": "Amplia acesso ao cuidado sem consultar prontuários ou exigir dados pessoais.",
    "audience": "Pessoas ativas do setor; efeito contextual, sem inferir família ou condição de saúde.",
    "rest": false,
    "origin": "PM 29/10/2026 · hipótese de balanceamento",
    "promotion": false,
    "icon": "/assets/benefits/coparticipacao.svg"
  },
  {
    "id": "vale-alimentacao",
    "name": "Aumento do vale-alimentação",
    "category": "Cuidado e benefícios",
    "cost": 1100,
    "factors": {
      "recon": 8,
      "carga": 3
    },
    "timing": {
      "kind": "imediato",
      "delay": 0,
      "ramp": 0
    },
    "lifecycle": {
      "start": "imediato",
      "duration": "temporario",
      "durationWeeks": 12,
      "frequency": "unico",
      "progression": "estavel",
      "growthWeeks": 0
    },
    "description": "Apoio material equitativo; não substitui cobertura de pausas e jornadas sustentáveis.",
    "audience": "Pessoas ativas do setor; efeito contextual, sem inferir família ou condição de saúde.",
    "rest": false,
    "origin": "PM 29/10/2026 · hipótese de balanceamento",
    "promotion": false,
    "icon": "/assets/benefits/vale-alimentacao.svg"
  },
  {
    "id": "consulta-psicologica",
    "name": "Primeira consulta psicológica gratuita",
    "category": "Cuidado e benefícios",
    "cost": 500,
    "factors": {
      "seg": 5,
      "auton": 3
    },
    "timing": {
      "kind": "imediato",
      "delay": 0,
      "ramp": 0
    },
    "lifecycle": {
      "start": "imediato",
      "duration": "temporario",
      "durationWeeks": 4,
      "frequency": "unico",
      "progression": "estavel",
      "growthWeeks": 0
    },
    "description": "Oferta opcional e confidencial; acesso, não diagnóstico ou promessa de melhora clínica.",
    "audience": "Pessoas ativas do setor; efeito contextual, sem inferir família ou condição de saúde.",
    "rest": false,
    "origin": "PM 29/10/2026 · hipótese de balanceamento",
    "promotion": false,
    "icon": "/assets/benefits/consulta-psicologica.svg"
  },
  {
    "id": "psicoterapia",
    "name": "Subsídio de psicoterapia",
    "category": "Cuidado e benefícios",
    "cost": 1500,
    "factors": {
      "seg": 8,
      "auton": 4
    },
    "timing": {
      "kind": "tardio",
      "delay": 1,
      "ramp": 1
    },
    "lifecycle": {
      "start": "tardio",
      "duration": "temporario",
      "durationWeeks": 12,
      "frequency": "unico",
      "progression": "progressivo",
      "growthWeeks": 1
    },
    "description": "Acesso voluntário a cuidado profissional, sem compartilhar conteúdo com a empresa.",
    "audience": "Pessoas ativas do setor; efeito contextual, sem inferir família ou condição de saúde.",
    "rest": false,
    "origin": "PM 29/10/2026 · hipótese de balanceamento",
    "promotion": false,
    "icon": "/assets/benefits/psicoterapia.svg"
  },
  {
    "id": "creche",
    "name": "Creche da empresa",
    "category": "Conciliação",
    "cost": 3200,
    "factors": {
      "carga": 7,
      "seg": 5,
      "recon": 4
    },
    "timing": {
      "kind": "tardio",
      "delay": 2,
      "ramp": 2
    },
    "lifecycle": {
      "start": "tardio",
      "duration": "temporario",
      "durationWeeks": 12,
      "frequency": "unico",
      "progression": "progressivo",
      "growthWeeks": 2
    },
    "description": "Programa de cuidado infantil e acesso inclusivo para quem precisar; não presume composição familiar dos NPCs.",
    "audience": "Pessoas ativas do setor; efeito contextual, sem inferir família ou condição de saúde.",
    "rest": false,
    "origin": "PM 29/10/2026 · hipótese de balanceamento",
    "promotion": false,
    "icon": "/assets/benefits/creche.svg"
  },
  {
    "id": "moradia",
    "name": "Auxílio-moradia",
    "category": "Conciliação",
    "cost": 2400,
    "factors": {
      "carga": 5,
      "seg": 5,
      "recon": 5
    },
    "timing": {
      "kind": "tardio",
      "delay": 1,
      "ramp": 1
    },
    "lifecycle": {
      "start": "tardio",
      "duration": "temporario",
      "durationWeeks": 12,
      "frequency": "unico",
      "progression": "progressivo",
      "growthWeeks": 1
    },
    "description": "Apoio habitacional com critérios equitativos e sem vínculo coercitivo à permanência no emprego.",
    "audience": "Pessoas ativas do setor; efeito contextual, sem inferir família ou condição de saúde.",
    "rest": false,
    "origin": "PM 29/10/2026 · hipótese de balanceamento",
    "promotion": false,
    "icon": "/assets/benefits/moradia.svg"
  },
  {
    "id": "mobilidade",
    "name": "Auxílio de mobilidade",
    "category": "Conciliação",
    "cost": 900,
    "factors": {
      "carga": 5,
      "recon": 3
    },
    "timing": {
      "kind": "imediato",
      "delay": 0,
      "ramp": 0
    },
    "lifecycle": {
      "start": "imediato",
      "duration": "temporario",
      "durationWeeks": 12,
      "frequency": "unico",
      "progression": "estavel",
      "growthWeeks": 0
    },
    "description": "Apoio ao deslocamento e alternativas acessíveis aos turnos.",
    "audience": "Pessoas ativas do setor; efeito contextual, sem inferir família ou condição de saúde.",
    "rest": false,
    "origin": "PM 29/10/2026 · hipótese de balanceamento",
    "promotion": false,
    "icon": "/assets/benefits/mobilidade.svg"
  },
  {
    "id": "bolsa-estudo",
    "name": "Bolsa de estudos",
    "category": "Carreira",
    "cost": 1300,
    "factors": {
      "auton": 6,
      "recon": 5
    },
    "timing": {
      "kind": "tardio",
      "delay": 1,
      "ramp": 2
    },
    "lifecycle": {
      "start": "tardio",
      "duration": "temporario",
      "durationWeeks": 12,
      "frequency": "unico",
      "progression": "progressivo",
      "growthWeeks": 2
    },
    "description": "Aprendizagem com tempo protegido; não exige estudar durante as pausas.",
    "audience": "Pessoas ativas do setor; efeito contextual, sem inferir família ou condição de saúde.",
    "rest": false,
    "origin": "PM 29/10/2026 · hipótese de balanceamento",
    "promotion": false,
    "icon": "/assets/benefits/bolsa-estudo.svg"
  },
  {
    "id": "flexibilidade",
    "name": "Flexibilidade de jornada",
    "category": "Conciliação",
    "cost": 1000,
    "factors": {
      "auton": 8,
      "carga": 5
    },
    "timing": {
      "kind": "tardio",
      "delay": 1,
      "ramp": 1
    },
    "lifecycle": {
      "start": "tardio",
      "duration": "temporario",
      "durationWeeks": 8,
      "frequency": "unico",
      "progression": "progressivo",
      "growthWeeks": 1
    },
    "description": "Reorganização pactuada e cobertura de turnos, sem transferir a carga aos colegas.",
    "audience": "Pessoas ativas do setor; efeito contextual, sem inferir família ou condição de saúde.",
    "rest": false,
    "origin": "PM 29/10/2026 · hipótese de balanceamento",
    "promotion": false,
    "icon": "/assets/benefits/flexibilidade.svg"
  },
  {
    "id": "desconexao",
    "name": "Direito à desconexão",
    "category": "Trabalho",
    "cost": 750,
    "factors": {
      "carga": 7,
      "seg": 4
    },
    "timing": {
      "kind": "imediato",
      "delay": 0,
      "ramp": 0
    },
    "lifecycle": {
      "start": "imediato",
      "duration": "temporario",
      "durationWeeks": 8,
      "frequency": "unico",
      "progression": "estavel",
      "growthWeeks": 0
    },
    "description": "Rotina de comunicação que respeita descanso e não exige resposta fora do turno.",
    "audience": "Pessoas ativas do setor; efeito contextual, sem inferir família ou condição de saúde.",
    "rest": false,
    "origin": "PM 29/10/2026 · hipótese de balanceamento",
    "promotion": false,
    "icon": "/assets/benefits/desconexao.svg"
  },
  {
    "id": "acessibilidade",
    "name": "Acessibilidade dos postos",
    "category": "Ambiente",
    "cost": 1900,
    "factors": {
      "auton": 6,
      "carga": 5,
      "seg": 4
    },
    "timing": {
      "kind": "tardio",
      "delay": 1,
      "ramp": 1
    },
    "lifecycle": {
      "start": "tardio",
      "duration": "permanente",
      "durationWeeks": 0,
      "frequency": "unico",
      "progression": "progressivo",
      "growthWeeks": 1
    },
    "description": "Adaptações pactuadas de ferramentas e circulação; não expõe necessidades individuais.",
    "audience": "Pessoas ativas do setor; efeito contextual, sem inferir família ou condição de saúde.",
    "rest": false,
    "origin": "PM 29/10/2026 · hipótese de balanceamento",
    "promotion": false,
    "icon": "/assets/benefits/acessibilidade.svg"
  }
];
