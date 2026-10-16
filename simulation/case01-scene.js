import { CASE01_INITIAL, simulateCase01 } from './case01.js';

export const CASE01_SCENE_VERSION = 1;
const CASE_ID = '01';
const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(Number(value) || 0)));
const list = value => Array.isArray(value) ? [...new Set(value.filter(item => typeof item === 'string'))] : [];
const copy = value => ({ ...(value || {}) });

function deriveVisualFlags(simulation) {
  const actions = new Set(list(simulation.selectedActions));
  const flags = [];

  if (simulation.metrics.workload < CASE01_INITIAL.workload) flags.push('workload-improved');
  if (simulation.metrics.rest < CASE01_INITIAL.rest) flags.push('breaks-protected');
  if (simulation.metrics.conflicts < CASE01_INITIAL.conflicts) flags.push('conflicts-reduced');
  if (actions.has('capacity')) flags.push('capacity-rebalanced');
  if (actions.has('roles')) flags.push('handoff-reworked');
  if (actions.has('leaders')) flags.push('leadership-prepared');
  if (actions.has('listen')) flags.push('listening-forum');
  if (actions.has('counselling')) flags.push('support-available');
  if (actions.has('campaign')) flags.push('self-care-campaign');
  if (actions.has('surveillance')) flags.push('individual-surveillance');
  if (list(simulation.violations).includes('healthfiles')) flags.push('confidentiality-warning');

  return [...new Set(flags)];
}

export function deriveCase01SceneState(simulation, score = null, generatedAt = null) {
  if (!simulation || simulation.version !== 1 || !simulation.final?.metrics) {
    throw new TypeError('Uma simulação válida do Caso 01 é necessária.');
  }

  return normalizeCase01SceneState({
    version: CASE01_SCENE_VERSION,
    caseId: CASE_ID,
    environment: 'standard-office',
    sector: 'operations',
    phase: 'after-simulation',
    generatedAt,
    days: clamp(simulation.days, 1, 365),
    score: score === null ? null : clamp(score),
    metrics: copy(simulation.final.metrics),
    operational: copy(simulation.final.operational),
    deltas: copy(simulation.deltas),
    operationalDeltas: copy(simulation.operationalDeltas),
    selectedActions: list(simulation.selectedActions),
    selectedMonitoring: list(simulation.selectedMonitoring),
    violations: list(simulation.violations),
    quality: Number(simulation.quality) || 0,
    visualFlags: deriveVisualFlags(simulation)
  });
}

export function normalizeCase01SceneState(value) {
  if (!value || value.version !== CASE01_SCENE_VERSION || value.caseId !== CASE_ID) return null;

  return {
    version: CASE01_SCENE_VERSION,
    caseId: CASE_ID,
    environment: value.environment === 'standard-office' ? value.environment : 'standard-office',
    sector: value.sector === 'operations' ? value.sector : 'operations',
    phase: value.phase === 'after-simulation' ? value.phase : 'after-simulation',
    generatedAt: Number.isFinite(Number(value.generatedAt)) ? Number(value.generatedAt) : null,
    days: clamp(value.days, 1, 365),
    score: value.score === null || value.score === undefined ? null : clamp(value.score),
    metrics: copy(value.metrics),
    operational: copy(value.operational),
    deltas: copy(value.deltas),
    operationalDeltas: copy(value.operationalDeltas),
    selectedActions: list(value.selectedActions),
    selectedMonitoring: list(value.selectedMonitoring),
    violations: list(value.violations),
    quality: Math.max(0, Math.min(1, Number(value.quality) || 0)),
    visualFlags: list(value.visualFlags)
  };
}

export function serializeCase01SceneState(state) {
  const normalized = normalizeCase01SceneState(state);
  if (!normalized) throw new TypeError('Estado visual inválido para serialização.');
  return JSON.stringify(normalized);
}

export function deserializeCase01SceneState(serialized) {
  if (typeof serialized !== 'string' || serialized.length > 100_000) return null;
  try {
    return normalizeCase01SceneState(JSON.parse(serialized));
  } catch {
    return null;
  }
}

export function simulateCase01Scene(input = {}, score = null, generatedAt = null) {
  return deriveCase01SceneState(simulateCase01(input), score, generatedAt);
}
