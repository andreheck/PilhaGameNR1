/* Gerado a partir dos catálogos canônicos; não editar à mão. */
export const NPC_PROFILES = Object.freeze({
  "NPC-01": {
    "id": "NPC-01",
    "name": "João",
    "type": "INTJ",
    "archetype": "Arquiteto",
    "group": "analistas",
    "portrait": "/assets/npcs/npc-01-joao-arquiteto.png",
    "age": 38,
    "roleLabel": "Planejamento e melhoria de processos",
    "summary": "Organiza prioridades e antecipa gargalos.",
    "strengths": [
      "Visão estratégica",
      "Organização e foco",
      "Análise de processos"
    ],
    "watchouts": [
      "Perfeccionismo",
      "Isolamento em projetos longos",
      "Impaciência com improvisação"
    ],
    "favorableConditions": [
      "metas_claras",
      "tempo_para_planejamento"
    ],
    "adverseConditions": [
      "metas_conflitantes",
      "tela_prolongada",
      "sobrecarga"
    ],
    "situationalSignals": [
      "fadiga_simulada",
      "tensao_muscular_simulada"
    ],
    "proposedSynergies": [
      "NPC-02",
      "NPC-03"
    ],
    "environments": {
      "positivos": [
        "lideranca",
        "servidor_tecnologia"
      ],
      "negativos": [
        "galpao_logistica",
        "saude_bem_estar"
      ],
      "neutro": "reunioes"
    },
    "proposedEffects": {
      "favoravel": {
        "saude": 1,
        "psicossocial": 4
      },
      "adverso": {
        "saude": -1,
        "psicossocial": -3
      }
    },
    "status": "parametros_prototipo",
    "disclaimer": "Perfil narrativo fictício; não determina saúde, doença ou aptidão."
  },
  "NPC-02": {
    "id": "NPC-02",
    "name": "Tiago",
    "type": "INTP",
    "archetype": "Lógico",
    "group": "analistas",
    "portrait": "/assets/npcs/npc-02-tiago-logico.png",
    "age": 27,
    "roleLabel": "Análise de tecnologia e solução de problemas",
    "summary": "Encontra alternativas técnicas e reduz retrabalho quando há suporte.",
    "strengths": [
      "Raciocínio analítico",
      "Criatividade técnica",
      "Aprendizado rápido"
    ],
    "watchouts": [
      "Dispersão com rotinas mal organizadas",
      "Pode adiar entregas",
      "Dificuldade com prazos não negociados"
    ],
    "favorableConditions": [
      "autonomia_com_suporte",
      "tempo_para_analise"
    ],
    "adverseConditions": [
      "interrupcoes_constantes",
      "cobranca_hostil",
      "jornada_imprevisivel"
    ],
    "situationalSignals": [
      "fadiga_simulada",
      "estresse_simulado"
    ],
    "proposedSynergies": [
      "NPC-01",
      "NPC-04"
    ],
    "environments": {
      "positivos": [
        "servidor_tecnologia",
        "operacao"
      ],
      "negativos": [
        "lideranca",
        "galpao_logistica"
      ],
      "neutro": "reunioes"
    },
    "proposedEffects": {
      "favoravel": {
        "saude": 0,
        "psicossocial": 3
      },
      "adverso": {
        "saude": -1,
        "psicossocial": -3
      }
    },
    "status": "parametros_prototipo",
    "disclaimer": "Perfil narrativo fictício; não determina saúde, doença ou aptidão."
  },
  "NPC-03": {
    "id": "NPC-03",
    "name": "Fernanda",
    "type": "ENTJ",
    "archetype": "Comandante",
    "group": "analistas",
    "portrait": "/assets/npcs/npc-03-fernanda-comandante.png",
    "age": 41,
    "roleLabel": "Coordenação e alinhamento de equipes",
    "summary": "Articula recursos e decisões sem ignorar os efeitos das metas.",
    "strengths": [
      "Liderança",
      "Decisão",
      "Visão de resultados"
    ],
    "watchouts": [
      "Pode centralizar decisões",
      "Impaciência",
      "Pode elevar pressão por metas"
    ],
    "favorableConditions": [
      "metas_claras",
      "recursos_adequados",
      "participacao_da_equipe"
    ],
    "adverseConditions": [
      "metas_inviaveis",
      "sobrecarga",
      "falta_de_recursos"
    ],
    "situationalSignals": [
      "estresse_simulado",
      "tensao_muscular_simulada"
    ],
    "proposedSynergies": [
      "NPC-07",
      "NPC-01"
    ],
    "environments": {
      "positivos": [
        "lideranca",
        "reunioes"
      ],
      "negativos": [
        "rh",
        "saude_bem_estar"
      ],
      "neutro": "operacao"
    },
    "proposedEffects": {
      "favoravel": {
        "saude": 0,
        "psicossocial": 3
      },
      "adverso": {
        "saude": -1,
        "psicossocial": -4
      }
    },
    "status": "parametros_prototipo",
    "disclaimer": "Perfil narrativo fictício; não determina saúde, doença ou aptidão."
  },
  "NPC-04": {
    "id": "NPC-04",
    "name": "Raimunda",
    "type": "ENTP",
    "archetype": "Debatedora",
    "group": "analistas",
    "portrait": "/assets/npcs/npc-04-raimunda-debatedora.png",
    "age": 34,
    "roleLabel": "Administração e melhoria organizacional",
    "summary": "Estimula análise crítica e melhoria colaborativa.",
    "strengths": [
      "Comunicação estratégica",
      "Questionamento construtivo",
      "Inovação"
    ],
    "watchouts": [
      "Pode prolongar debates",
      "Impaciência com processos rígidos",
      "Vários projetos simultâneos"
    ],
    "favorableConditions": [
      "espaco_para_propor",
      "acordos_de_prioridade"
    ],
    "adverseConditions": [
      "burocracia_sem_proposito",
      "sobrecarga",
      "conflitos_sem_mediacao"
    ],
    "situationalSignals": [
      "fadiga_simulada",
      "estresse_simulado"
    ],
    "proposedSynergies": [
      "NPC-08",
      "NPC-02"
    ],
    "environments": {
      "positivos": [
        "rh",
        "reunioes"
      ],
      "negativos": [
        "operacao",
        "galpao_logistica"
      ],
      "neutro": "servidor_tecnologia"
    },
    "proposedEffects": {
      "favoravel": {
        "saude": 0,
        "psicossocial": 4
      },
      "adverso": {
        "saude": -1,
        "psicossocial": -3
      }
    },
    "status": "parametros_prototipo",
    "disclaimer": "Perfil narrativo fictício; não determina saúde, doença ou aptidão."
  },
  "NPC-05": {
    "id": "NPC-05",
    "name": "Aline",
    "type": "INFJ",
    "archetype": "Advogada",
    "group": "diplomatas",
    "portrait": "/assets/npcs/npc-05-aline-advogada.png",
    "age": 35,
    "roleLabel": "Analista de clima e relações",
    "summary": "Ajuda colegas a nomear tensões e construir respostas.",
    "strengths": [
      "Escuta atenta",
      "Pensamento de longo prazo",
      "Mediação discreta"
    ],
    "watchouts": [
      "Pode absorver conflitos",
      "Demora a agir sem informações",
      "Precisa de limites emocionais"
    ],
    "favorableConditions": [
      "escuta_com_devolutiva",
      "recursos_adequados"
    ],
    "adverseConditions": [
      "conflitos_sem_mediacao",
      "falta_de_apoio",
      "sobrecarga"
    ],
    "situationalSignals": [
      "desgaste_simulado"
    ],
    "proposedSynergies": [
      "NPC-06",
      "NPC-07"
    ],
    "environments": {
      "positivos": [
        "rh",
        "saude_bem_estar"
      ],
      "negativos": [
        "operacao",
        "galpao_logistica"
      ],
      "neutro": "reunioes"
    },
    "proposedEffects": {
      "favoravel": {
        "saude": 1,
        "psicossocial": 4
      },
      "adverso": {
        "saude": -2,
        "psicossocial": -3
      }
    },
    "status": "parametros_prototipo",
    "disclaimer": "Perfil narrativo fictício; não determina saúde, doença ou aptidão."
  },
  "NPC-06": {
    "id": "NPC-06",
    "name": "Letícia",
    "type": "INFP",
    "archetype": "Mediadora",
    "group": "diplomatas",
    "portrait": "/assets/npcs/npc-06-leticia-mediadora.png",
    "age": 29,
    "roleLabel": "Apoio à experiência humana",
    "summary": "Facilita acordos, pertencimento e cooperação.",
    "strengths": [
      "Empatia e escuta",
      "Criatividade para conflitos",
      "Respeito às diferenças"
    ],
    "watchouts": [
      "Pode adiar confrontos",
      "Desgaste em comunicação hostil",
      "Precisa de prioridades claras"
    ],
    "favorableConditions": [
      "participacao_da_equipe",
      "escuta_com_devolutiva"
    ],
    "adverseConditions": [
      "cobranca_hostil",
      "falta_de_voz",
      "mudanca_sem_participacao"
    ],
    "situationalSignals": [
      "desgaste_simulado"
    ],
    "proposedSynergies": [
      "NPC-05",
      "NPC-14"
    ],
    "environments": {
      "positivos": [
        "saude_bem_estar",
        "rh"
      ],
      "negativos": [
        "lideranca",
        "servidor_tecnologia"
      ],
      "neutro": "operacao"
    },
    "proposedEffects": {
      "favoravel": {
        "saude": 2,
        "psicossocial": 4
      },
      "adverso": {
        "saude": -2,
        "psicossocial": -3
      }
    },
    "status": "parametros_prototipo",
    "disclaimer": "Perfil narrativo fictício; não determina saúde, doença ou aptidão."
  },
  "NPC-07": {
    "id": "NPC-07",
    "name": "Mariana",
    "type": "ENFJ",
    "archetype": "Protagonista",
    "group": "diplomatas",
    "portrait": "/assets/npcs/npc-07-mariana-protagonista.png",
    "age": 37,
    "roleLabel": "Articuladora de equipes",
    "summary": "Coordena apoio e reforça clareza de propósito.",
    "strengths": [
      "Comunicação acolhedora",
      "Engajamento",
      "Decisões coletivas"
    ],
    "watchouts": [
      "Pode assumir demandas alheias",
      "Dificuldade de dizer não",
      "Pode apressar consensos"
    ],
    "favorableConditions": [
      "apoio_entre_pares",
      "metas_claras"
    ],
    "adverseConditions": [
      "responsabilidade_isolada",
      "metas_conflitantes",
      "falta_de_recursos"
    ],
    "situationalSignals": [
      "sobrecarga_simulada"
    ],
    "proposedSynergies": [
      "NPC-12",
      "NPC-03"
    ],
    "environments": {
      "positivos": [
        "lideranca",
        "reunioes"
      ],
      "negativos": [
        "servidor_tecnologia",
        "galpao_logistica"
      ],
      "neutro": "rh"
    },
    "proposedEffects": {
      "favoravel": {
        "saude": 1,
        "psicossocial": 5
      },
      "adverso": {
        "saude": -2,
        "psicossocial": -4
      }
    },
    "status": "parametros_prototipo",
    "disclaimer": "Perfil narrativo fictício; não determina saúde, doença ou aptidão."
  },
  "NPC-08": {
    "id": "NPC-08",
    "name": "Pedro",
    "type": "ENFP",
    "archetype": "Ativista",
    "group": "diplomatas",
    "portrait": "/assets/npcs/npc-08-pedro-ativista.png",
    "age": 25,
    "roleLabel": "Facilitador de ideias",
    "summary": "Amplia iniciativas quando há tempo e objetivos claros.",
    "strengths": [
      "Criatividade colaborativa",
      "Energia em novos projetos",
      "Conexões entre pessoas"
    ],
    "watchouts": [
      "Pode começar frentes demais",
      "Precisa de apoio para concluir",
      "Desgaste com ambiguidade"
    ],
    "favorableConditions": [
      "tempo_para_ideias",
      "prioridades_claras"
    ],
    "adverseConditions": [
      "prioridades_incompativeis",
      "jornada_imprevisivel",
      "interrupcoes_constantes"
    ],
    "situationalSignals": [
      "fadiga_simulada"
    ],
    "proposedSynergies": [
      "NPC-04",
      "NPC-16"
    ],
    "environments": {
      "positivos": [
        "reunioes",
        "rh"
      ],
      "negativos": [
        "operacao",
        "servidor_tecnologia"
      ],
      "neutro": "saude_bem_estar"
    },
    "proposedEffects": {
      "favoravel": {
        "saude": 1,
        "psicossocial": 4
      },
      "adverso": {
        "saude": -1,
        "psicossocial": -4
      }
    },
    "status": "parametros_prototipo",
    "disclaimer": "Perfil narrativo fictício; não determina saúde, doença ou aptidão."
  },
  "NPC-09": {
    "id": "NPC-09",
    "name": "Carlos",
    "type": "ISTJ",
    "archetype": "Logístico",
    "group": "sentinelas",
    "portrait": "/assets/npcs/npc-09-carlos-logistico.png",
    "age": null,
    "roleLabel": null,
    "summary": null,
    "strengths": [],
    "watchouts": [],
    "favorableConditions": [],
    "adverseConditions": [],
    "situationalSignals": [],
    "proposedSynergies": [],
    "environments": null,
    "proposedEffects": null,
    "status": "pendente_refinamento",
    "disclaimer": "Perfil narrativo fictício; não determina saúde, doença ou aptidão."
  },
  "NPC-10": {
    "id": "NPC-10",
    "name": "Ana",
    "type": "ISFJ",
    "archetype": "Defensora",
    "group": "sentinelas",
    "portrait": "/assets/npcs/npc-10-ana-defensora.png",
    "age": null,
    "roleLabel": null,
    "summary": null,
    "strengths": [],
    "watchouts": [],
    "favorableConditions": [],
    "adverseConditions": [],
    "situationalSignals": [],
    "proposedSynergies": [],
    "environments": null,
    "proposedEffects": null,
    "status": "pendente_refinamento",
    "disclaimer": "Perfil narrativo fictício; não determina saúde, doença ou aptidão."
  },
  "NPC-11": {
    "id": "NPC-11",
    "name": "José",
    "type": "ESTJ",
    "archetype": "Executivo",
    "group": "sentinelas",
    "portrait": "/assets/npcs/npc-11-jose-executivo.png",
    "age": null,
    "roleLabel": null,
    "summary": null,
    "strengths": [],
    "watchouts": [],
    "favorableConditions": [],
    "adverseConditions": [],
    "situationalSignals": [],
    "proposedSynergies": [],
    "environments": null,
    "proposedEffects": null,
    "status": "pendente_refinamento",
    "disclaimer": "Perfil narrativo fictício; não determina saúde, doença ou aptidão."
  },
  "NPC-12": {
    "id": "NPC-12",
    "name": "Maria",
    "type": "ESFJ",
    "archetype": "Cônsul",
    "group": "sentinelas",
    "portrait": "/assets/npcs/npc-12-maria-consul.png",
    "age": null,
    "roleLabel": null,
    "summary": null,
    "strengths": [],
    "watchouts": [],
    "favorableConditions": [],
    "adverseConditions": [],
    "situationalSignals": [],
    "proposedSynergies": [],
    "environments": null,
    "proposedEffects": null,
    "status": "pendente_refinamento",
    "disclaimer": "Perfil narrativo fictício; não determina saúde, doença ou aptidão."
  },
  "NPC-13": {
    "id": "NPC-13",
    "name": "Alisson",
    "type": "ISTP",
    "archetype": "Virtuoso",
    "group": "exploradores",
    "portrait": "/assets/npcs/npc-13-alisson-virtuoso.png",
    "age": null,
    "roleLabel": null,
    "summary": null,
    "strengths": [],
    "watchouts": [],
    "favorableConditions": [],
    "adverseConditions": [],
    "situationalSignals": [],
    "proposedSynergies": [],
    "environments": null,
    "proposedEffects": null,
    "status": "pendente_refinamento",
    "disclaimer": "Perfil narrativo fictício; não determina saúde, doença ou aptidão."
  },
  "NPC-14": {
    "id": "NPC-14",
    "name": "Camila",
    "type": "ISFP",
    "archetype": "Aventureira",
    "group": "exploradores",
    "portrait": "/assets/npcs/npc-14-camila-aventureira.png",
    "age": null,
    "roleLabel": null,
    "summary": null,
    "strengths": [],
    "watchouts": [],
    "favorableConditions": [],
    "adverseConditions": [],
    "situationalSignals": [],
    "proposedSynergies": [],
    "environments": null,
    "proposedEffects": null,
    "status": "pendente_refinamento",
    "disclaimer": "Perfil narrativo fictício; não determina saúde, doença ou aptidão."
  },
  "NPC-15": {
    "id": "NPC-15",
    "name": "Lucas",
    "type": "ESTP",
    "archetype": "Empreendedor",
    "group": "exploradores",
    "portrait": "/assets/npcs/npc-15-lucas-empreendedor.png",
    "age": null,
    "roleLabel": null,
    "summary": null,
    "strengths": [],
    "watchouts": [],
    "favorableConditions": [],
    "adverseConditions": [],
    "situationalSignals": [],
    "proposedSynergies": [],
    "environments": null,
    "proposedEffects": null,
    "status": "pendente_refinamento",
    "disclaimer": "Perfil narrativo fictício; não determina saúde, doença ou aptidão."
  },
  "NPC-16": {
    "id": "NPC-16",
    "name": "Beatriz",
    "type": "ESFP",
    "archetype": "Artista",
    "group": "exploradores",
    "portrait": "/assets/npcs/npc-16-beatriz-artista.png",
    "age": null,
    "roleLabel": null,
    "summary": null,
    "strengths": [],
    "watchouts": [],
    "favorableConditions": [],
    "adverseConditions": [],
    "situationalSignals": [],
    "proposedSynergies": [],
    "environments": null,
    "proposedEffects": null,
    "status": "pendente_refinamento",
    "disclaimer": "Perfil narrativo fictício; não determina saúde, doença ou aptidão."
  }
});
export const npcProfile = id => NPC_PROFILES[id] || null;
