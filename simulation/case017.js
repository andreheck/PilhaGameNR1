/**
 * PilhA+ Game — Simulação do Caso 017
 *
 * Motor determinístico e educativo para modelar fatores organizacionais.
 *
 * Os valores são fictícios: não são escalas epidemiológicas, diagnósticos,
 * previsões clínicas nem evidência de conformidade com a NR-1.
 */

export const CASE017_VERSION = 1;
export const CASE017_DAYS = 30;

/**
 * Indicadores de risco/proteção no início do Caso 017.
 *
 * Para workload, conflicts, harassment e rest, valores maiores representam
 * maior exposição. Para autonomy, recognition e leadershipSupport, valores
 * maiores representam proteção.
 */
export const CASE017_INITIAL = Object.freeze({
  workload: 78,
  autonomy: 48,
  conflicts: 67,
  recognition: 39,
  leadershipSupport: 55,
  harassment: 27,
  rest: 75
});

/** Indicadores operacionais agregados usados apenas para feedback pedagógico. */
export const CASE017_OPERATIONAL_INITIAL = Object.freeze({
  absenteeism: 18,
  overtime: 34,
  productivity: 0,
  turnover: 7,
  teamClimate: 0
});

const METRIC_LABELS = Object.freeze({
  workload: 'Carga de trabalho',
  autonomy: 'Autonomia',
  conflicts: 'Conflitos',
  recognition: 'Reconhecimento',
  leadershipSupport: 'Apoio da liderança',
  harassment: 'Assédio',
  rest: 'Jornada e descanso'
});

const ACTIONS = Object.freeze({
  capacity: {
    label: 'Readequar dimensionamento e distribuição de demandas',
    effects: { workload: -12, autonomy: 4, leadershipSupport: 4 },
    operational: { absenteeism: -5, overtime: -12, productivity: 3, turnover: -2, teamClimate: 5 },
    feedback: 'A revisão do dimensionamento atua diretamente sobre a relação entre demanda, capacidade e prioridades.'
  },
  breaks: {
    label: 'Garantir pausas e revisão das escalas',
    effects: { workload: -6, conflicts: -4, rest: -18 },
    operational: { absenteeism: -7, overtime: -16, productivity: 2, turnover: -2, teamClimate: 7 },
    feedback: 'A proteção das pausas e da jornada reduz uma exposição organizacional identificada no caso.'
  },
  roles: {
    label: 'Redesenhar a passagem de turno e papéis',
    effects: { autonomy: 5, conflicts: -12, leadershipSupport: 3 },
    operational: { absenteeism: -3, overtime: -5, productivity: 1, turnover: -1, teamClimate: 4 },
    feedback: 'A clareza de papéis reduz conflitos de coordenação e melhora a autonomia possível no trabalho.'
  },
  listen: {
    label: 'Criar fórum de escuta com retorno verificável',
    effects: { autonomy: 3, recognition: 7, conflicts: -4, leadershipSupport: 4 },
    operational: { absenteeism: -2, overtime: -2, productivity: 0, turnover: -1, teamClimate: 5 },
    feedback: 'A participação protegida torna visíveis as condições reais e fortalece a confiança para acompanhar mudanças.'
  },
  leaders: {
    label: 'Preparar lideranças para resposta preventiva',
    effects: { conflicts: -4, recognition: 4, leadershipSupport: 10, harassment: -2 },
    operational: { absenteeism: -2, overtime: -3, productivity: 1, turnover: -1, teamClimate: 4 },
    feedback: 'A preparação das lideranças melhora a capacidade de reconhecer sinais e acionar medidas preventivas.'
  },
  counselling: {
    label: 'Ampliar acesso voluntário a apoio especializado',
    effects: { recognition: 2, leadershipSupport: 3, rest: -1 },
    operational: { absenteeism: -2, overtime: 0, productivity: 0, turnover: -1, teamClimate: 2 },
    feedback: 'O apoio individual pode complementar a prevenção, mas não altera sozinho a organização da carga e da jornada.'
  },
  campaign: {
    label: 'Campanha sobre autocuidado e gestão do tempo',
    effects: { recognition: 2, rest: -1 },
    operational: { absenteeism: 0, overtime: 1, productivity: 1, turnover: 0, teamClimate: 1 },
    feedback: 'Uma campanha pode sensibilizar, mas é insuficiente quando as metas e a jornada continuam incompatíveis.'
  },
  surveillance: {
    label: 'Monitorar publicamente a produtividade individual',
    effects: { workload: 8, autonomy: -8, conflicts: 9, recognition: -5, leadershipSupport: -4, harassment: 4, rest: 3 },
    operational: { absenteeism: 6, overtime: 9, productivity: 2, turnover: 5, teamClimate: -8 },
    feedback: 'O monitoramento nominal aumenta pressão e exposição; produtividade isolada não demonstra prevenção dos riscos.'
  }
});

const MONITORING_BONUS = Object.freeze({
  hours: { effects: { rest: -2 }, operational: { overtime: -3 }, message: 'A verificação de jornada ajuda a detectar se as pausas foram realmente protegidas.' },
  return: { effects: { recognition: 2, leadershipSupport: 2 }, operational: { teamClimate: 3 }, message: 'A devolutiva coletiva cria participação para validar se a mudança alcançou o trabalho real.' },
  results: { effects: {}, operational: { absenteeism: -2, turnover: -1 }, message: 'Indicadores agregados ajudam a acompanhar tendências sem transformar pessoas em metas individuais.' },
  adapt: { effects: { autonomy: 2, conflicts: -2 }, operational: { productivity: 1, teamClimate: 2 }, message: 'Revisar o plano permite corrigir a implantação em vez de tratar o primeiro resultado como definitivo.' },
  productivity: { effects: {}, operational: {}, message: 'Produção isolada não permite concluir que os riscos psicossociais foram prevenidos.' },
  healthfiles: { effects: { recognition: -4, leadershipSupport: -5, harassment: 5 }, operational: { teamClimate: -6 }, message: 'Dados clínicos nominais não são uma medida legítima de gestão organizacional e comprometem a confidencialidade.' }
});

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(value)));
const normalizeList = value => Array.isArray(value) ? value.filter(id => typeof id === 'string') : [];
const addEffects = (target, effects = {}, factor = 1) => {
  for (const [key, value] of Object.entries(effects)) {
    target[key] = (target[key] || 0) + value * factor;
  }
};
const changedKeys = (initial, final) => Object.keys(initial).filter(key => initial[key] !== final[key]);

function qualityModifier({ evidence, hypothesis, monitoring }) {
  const evidenceCount = normalizeList(evidence).length;
  const monitoringCount = normalizeList(monitoring).length;
  let factor = 1;
  if (evidenceCount < 3) factor *= 0.75;
  if (hypothesis !== 'organization') factor *= 0.65;
  if (monitoringCount < 2) factor *= 0.8;
  return factor;
}

function buildFeedback({ actions, monitoring, hypothesis, metrics, deltas, violations, quality }) {
  const messages = [];
  const actionMessages = actions.map(id => ACTIONS[id]?.feedback).filter(Boolean);
  messages.push(...actionMessages);

  if (hypothesis !== 'organization') {
    messages.push('A hipótese escolhida não enfrenta completamente os fatores da organização do trabalho; os efeitos estruturais foram reduzidos na simulação.');
  }
  if (quality < 1) {
    messages.push('A qualidade da investigação ou do acompanhamento reduziu a confiança pedagógica do resultado.');
  }
  if (monitoring.includes('productivity')) {
    messages.push(MONITORING_BONUS.productivity.message);
  }
  if (violations.length) {
    messages.push('Atenção: a escolha inclui uma prática incompatível com proteção de privacidade ou participação segura.');
  }
  if (deltas.workload < 0 && deltas.rest < 0) {
    messages.push('O resultado indica melhoria conjunta na carga e na jornada, que deve ser validada com a equipe ao longo do tempo.');
  }
  if (metrics.productivity > CASE017_OPERATIONAL_INITIAL.productivity && metrics.overtime > CASE017_OPERATIONAL_INITIAL.overtime) {
    messages.push('Houve ganho operacional acompanhado de mais horas extras; o resultado não é sustentável sem revisar a jornada.');
  }
  return [...new Set(messages)];
}

/**
 * Simula o efeito educativo de uma decisão no Caso 017.
 *
 * @param {object} input
 * @param {string[]} input.actions IDs das ações escolhidas na etapa 03.
 * @param {string[]} input.evidence IDs das evidências investigadas.
 * @param {string|null} input.hypothesis hipótese escolhida na etapa 02.
 * @param {string[]} input.monitoring IDs dos acompanhamentos escolhidos.
 * @param {number} [input.days=30] horizonte simulado; limitado a 1–365 dias.
 * @returns {object} snapshot inicial, final, deltas, indicadores operacionais e feedback.
 */
export function simulateCase017({
  actions = [],
  evidence = [],
  hypothesis = null,
  monitoring = [],
  days = CASE017_DAYS
} = {}) {
  const selectedActions = normalizeList(actions);
  const selectedMonitoring = normalizeList(monitoring);
  const unknownActions = selectedActions.filter(id => !ACTIONS[id]);
  const unknownMonitoring = selectedMonitoring.filter(id => !MONITORING_BONUS[id]);
  const violations = [];
  const safeActions = selectedActions.filter(id => ACTIONS[id]);
  const safeMonitoring = selectedMonitoring.filter(id => MONITORING_BONUS[id]);
  const horizon = clamp(Number.isFinite(Number(days)) ? Number(days) : CASE017_DAYS, 1, 365);

  const metricDelta = Object.fromEntries(Object.keys(CASE017_INITIAL).map(key => [key, 0]));
  const operationalDelta = Object.fromEntries(Object.keys(CASE017_OPERATIONAL_INITIAL).map(key => [key, 0]));

  for (const id of safeActions) {
    addEffects(metricDelta, ACTIONS[id].effects);
    addEffects(operationalDelta, ACTIONS[id].operational);
    if (id === 'surveillance') violations.push('surveillance');
  }

  for (const id of safeMonitoring) {
    addEffects(metricDelta, MONITORING_BONUS[id].effects);
    addEffects(operationalDelta, MONITORING_BONUS[id].operational);
    if (id === 'healthfiles') violations.push('healthfiles');
  }

  const quality = qualityModifier({ evidence, hypothesis, monitoring });
  const isStructural = safeActions.some(id => ['capacity', 'breaks', 'roles'].includes(id));
  if (hypothesis !== 'organization' || !isStructural) {
    // Sem estruturalidade ou sem hipótese organizacional, a intervenção não
    // deve produzir uma falsa impressão de que o fator principal foi corrigido.
    for (const key of ['workload', 'conflicts', 'rest']) metricDelta[key] *= 0.5;
    operationalDelta.overtime *= 0.5;
    operationalDelta.absenteeism *= 0.5;
  }

  for (const key of Object.keys(metricDelta)) metricDelta[key] *= quality;
  for (const key of Object.keys(operationalDelta)) operationalDelta[key] *= quality;

  const metrics = Object.fromEntries(Object.entries(CASE017_INITIAL).map(([key, initial]) => [key, clamp(initial + metricDelta[key])]));
  const operational = Object.fromEntries(Object.entries(CASE017_OPERATIONAL_INITIAL).map(([key, initial]) => {
    const min = key === 'productivity' || key === 'teamClimate' ? -100 : 0;
    return [key, clamp(initial + operationalDelta[key], min, 100)];
  }));
  const deltas = Object.fromEntries(Object.keys(CASE017_INITIAL).map(key => [key, metrics[key] - CASE017_INITIAL[key]]));
  const operationalDeltas = Object.fromEntries(Object.keys(CASE017_OPERATIONAL_INITIAL).map(key => [key, operational[key] - CASE017_OPERATIONAL_INITIAL[key]]));

  return {
    version: CASE017_VERSION,
    days: horizon,
    initial: { metrics: { ...CASE017_INITIAL }, operational: { ...CASE017_OPERATIONAL_INITIAL } },
    final: { metrics, operational },
    metrics,
    operational,
    deltas,
    operationalDeltas,
    changedMetrics: changedKeys(CASE017_INITIAL, metrics),
    quality,
    selectedActions: safeActions,
    selectedMonitoring: safeMonitoring,
    unknownActions,
    unknownMonitoring,
    violations: [...new Set(violations)],
    feedback: buildFeedback({
      actions: safeActions,
      monitoring: safeMonitoring,
      hypothesis,
      metrics: operational,
      deltas,
      violations,
      quality
    })
  };
}

export function metricLabel(id) {
  return METRIC_LABELS[id] || id;
}

export function actionLabel(id) {
  return ACTIONS[id]?.label || id;
}

export function monitoringLabel(id) {
  return id === 'hours' ? 'Conferir jornada e pausas por setor'
    : id === 'return' ? 'Fazer devolutiva coletiva e ouvir a equipe'
      : id === 'results' ? 'Revisar absenteísmo, conflitos e rotatividade'
        : id === 'adapt' ? 'Revisar o plano com supervisão e trabalhadores'
          : id === 'productivity' ? 'Avaliar apenas produção e entregas'
            : id === 'healthfiles' ? 'Exigir dados clínicos nominais nos relatórios'
              : id;
}
