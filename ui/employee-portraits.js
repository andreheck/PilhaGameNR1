const NPC_VISUALS = Object.freeze({
  'NPC-01': { portrait: 'NPC-01-joao.png', package: 'NPC-01-joao.png' },
  'NPC-02': { portrait: 'NPC-02-tiago.png', package: 'NPC-02-tiago.png' },
  'NPC-03': { portrait: 'NPC-03-fernanda.png', package: 'NPC-03-fernanda.png' },
  'NPC-04': { portrait: 'NPC-04-raimunda.png', package: 'NPC-04-raimunda.png' },
  'NPC-05': { portrait: 'NPC-05-aline.png', package: 'NPC-05-aline.png' },
  'NPC-06': { portrait: 'NPC-06-leticia.png', package: 'NPC-06-leticia.png' },
  'NPC-07': { portrait: 'NPC-07-mariana.png', package: 'NPC-07-mariana.png' },
  'NPC-08': { portrait: 'NPC-08-pedro.png', package: 'NPC-08-pedro.png' },
  'NPC-09': { portrait: 'NPC-09-carlos.png', package: 'NPC-09-carlos.png' },
  'NPC-10': { portrait: 'NPC-10-ana.png', package: 'NPC-10-ana.png' },
  'NPC-11': { portrait: 'NPC-11-jose.png', package: 'NPC-11-jose.png' },
  'NPC-12': { portrait: 'NPC-12-maria.png', package: 'NPC-12-maria.png' },
  'NPC-13': { portrait: 'NPC-13-alisson.png', package: 'NPC-13-alisson.png' },
  'NPC-14': { portrait: 'NPC-14-camila.png', package: 'NPC-14-camila.png' },
  'NPC-15': { portrait: 'NPC-15-lucas.png', package: 'NPC-15-lucas.png' },
  'NPC-16': { portrait: 'NPC-16-beatriz.png', package: 'NPC-16-beatriz.png' }
});

const hiredStates = new Set(['active', 'onboarding', 'leave']);

/** Map the five approved expression anchors to score ranges between anchors. */
export function employeeScoreBand(score) {
  const value = Math.max(0, Math.min(100, Number(score)));
  if (!Number.isFinite(value) || value < 30) return '20';
  if (value < 50) return '40';
  if (value < 70) return '60';
  if (value <= 90) return '80';
  return '90+';
}

export function employeePortrait(p, { packaged = false } = {}) {
  const visual = NPC_VISUALS[p?.id];
  if (!visual) return p?.portrait ?? p?.profile?.portrait ?? null;
  if (packaged) return `/assets/employee-packages/${visual.package}`;

  if (hiredStates.has(p?.employment) && Number.isFinite(Number(p?.health))) {
    return `/assets/employee-score/${p.id}/${employeeScoreBand(p.health)}.png`;
  }
  return `/assets/employee-portraits/${visual.portrait}`;
}
