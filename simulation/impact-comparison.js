/** Pure projection for the educational before/after intervention comparison. */
export const IMPACT_INDICATORS = Object.freeze(['wellbeing','workload','trust','turnoverRisk']);
export function projectIndicatorImpact(indicators = {}, effects = {}) {
 const before = Object.fromEntries(IMPACT_INDICATORS.map(key => [key, clamp(indicators[key] ?? 50)]));
 const after = {...before};
 for (const [key, delta] of Object.entries(effects || {})) {
  if (IMPACT_INDICATORS.includes(key)) after[key] = clamp(before[key] + (Number(delta) || 0));
 }
 return {before, after, deltas:Object.fromEntries(IMPACT_INDICATORS.map(key=>[key,after[key]-before[key]]))};
}
function clamp(value) { return Math.max(0,Math.min(100,Number(value)||0)); }
