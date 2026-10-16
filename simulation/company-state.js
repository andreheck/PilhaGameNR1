export const COMPANY_STATE_KEY = 'pilha-company-state-v1';

const zeroMetrics = () => ({trust: 0, workload: 0, wellbeing: 0, turnoverRisk: 0});

export function createCompanyState(previous = {}) {
  return {
    version: 1,
    day: Number.isFinite(Number(previous.day)) ? Number(previous.day) : 0,
    metrics: {...zeroMetrics(), ...(previous.metrics || {})},
    management: previous.management || {choice: null, outcome: 'unreviewed', status: 'unreviewed', days: 0, updated: null},
    history: Array.isArray(previous.history) ? previous.history : [],
    updated: previous.updated || null
  };
}

const round = value => Math.round(Number(value) || 0);

export function applyCompanyDecision(previous, decision) {
  const base = createCompanyState(previous);
  const metrics = Object.fromEntries(Object.entries(base.metrics).map(([key, value]) => [key, value + (Number(decision.metrics?.[key]) || 0)]));
  const event = {
    choice: decision.choice || decision.key,
    outcome: decision.outcome || 'neutral',
    status: decision.status || 'attended',
    emoji: decision.emoji || '💬',
    days: Number(decision.days) || 30,
    updated: decision.updated || Date.now(),
    metrics: {...decision.metrics}
  };
  return {
    ...base,
    day: Math.max(base.day, Number(decision.days) || 30),
    metrics,
    management: event,
    history: [...base.history, event].slice(-12),
    updated: event.updated
  };
}

export function getCompanyCaseModifier(state, caseId) {
  const company = createCompanyState(state);
  const {trust, workload, wellbeing, turnoverRisk} = company.metrics;
  const modifiers = {
    '02': {
      silence: round(-trust * .4 + turnoverRisk * .3),
      psychologicalSafety: round(trust * .6 - turnoverRisk * .2),
      leadershipTrust: round(trust * .5 - turnoverRisk * .15)
    },
    '03': {
      clarity: round(trust * .3 - workload * .5),
      autonomy: round(trust * .4 - workload * .4),
      conflict: round(turnoverRisk * .3 + workload * .25)
    },
    '04': {
      privacyTrust: round(trust * .6),
      wellbeing: round(wellbeing * .6),
      confidentialityRisk: round(-trust * .5 + turnoverRisk * .2)
    },
    '05': {
      recovery: round(-workload * .6 + wellbeing * .3),
      onCallPressure: round(workload * .6 + turnoverRisk * .4)
    }
  };
  return modifiers[String(caseId)] || {};
}

export function getCompanySummary(state) {
  const company = createCompanyState(state);
  const choice = company.management?.choice;
  if (!choice) return {label: 'Sem decisão global registrada', emoji: '◌', choice: null};
  const label = choice === 'protect' ? 'Proteção aplicada' : choice === 'dismiss' ? 'Risco não atendido' : 'Monitoramento sem intervenção';
  return {label, emoji: company.management.emoji, choice, day: company.day};
}
