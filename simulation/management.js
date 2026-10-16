export const MANAGEMENT_CHOICES = {
  protect: {
    label: 'Acolher e ajustar o trabalho',
    emoji: '🤝',
    title: 'PLANO DE PROTEÇÃO',
    detail: 'Afastamento protegido, ajuste de carga e retorno combinado.',
    state: 'pausing',
    outcome: 'positive',
    metrics: {trust: 12, workload: -10, wellbeing: 16, turnoverRisk: -14}
  },
  delay: {
    label: 'Adiar e apenas monitorar',
    emoji: '😶',
    title: 'PLANO ADIADO',
    detail: 'O sinal foi registrado, mas nenhuma mudança estrutural foi aplicada.',
    state: 'working',
    outcome: 'neutral',
    metrics: {trust: -3, workload: 4, wellbeing: -5, turnoverRisk: 7}
  },
  dismiss: {
    label: 'Demitir após adoecimento',
    emoji: '😔',
    title: 'ALERTA DE GESTÃO',
    detail: 'A demissão após adoecimento deixa o risco organizacional não atendido.',
    state: 'concerned',
    outcome: 'negative',
    metrics: {trust: -22, workload: 12, wellbeing: -20, turnoverRisk: 28}
  }
};

export function resolveManagementChoice(key, previous = {}) {
  const choice = MANAGEMENT_CHOICES[key];
  if (!choice) throw new Error(`Unknown management choice: ${key}`);
  const priorMetrics = previous.metrics || {};
  return {
    version: 1,
    days: 30,
    status: key === 'dismiss' ? 'unattended' : 'attended',
    outcome: choice.outcome,
    choice: key,
    emoji: choice.emoji,
    metrics: Object.fromEntries(Object.entries(choice.metrics).map(([metric, value]) => [metric, (priorMetrics[metric] || 0) + value]))
  };
}
