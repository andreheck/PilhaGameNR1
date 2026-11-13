/**
 * Control-role state for the Ao Trabalho hero duo.
 *
 * This is deliberately transient: it does not write localStorage, mutate the
 * company simulation, award XP, or change the saved principal/support pair.
 * The rendering/navigation adapter can consume this contract in a later slice.
 */
const HERO_IDS = new Set(Array.from({length: 6}, (_, i) => 'PILHA-H0' + (i + 1)));

export function isValidHeroPair(pair) {
  return !!pair
    && HERO_IDS.has(pair.principal)
    && HERO_IDS.has(pair.support)
    && pair.principal !== pair.support;
}

export function createHeroControl(pair, controlledHeroId = pair?.principal) {
  if (!isValidHeroPair(pair)) throw new TypeError('invalid-hero-pair');
  if (controlledHeroId !== pair.principal && controlledHeroId !== pair.support) {
    throw new TypeError('hero-not-in-pair');
  }
  return Object.freeze({
    controlledHeroId,
    autonomousHeroId: controlledHeroId === pair.principal ? pair.support : pair.principal,
    controlledRole: controlledHeroId === pair.principal ? 'principal' : 'support',
    autonomousRole: controlledHeroId === pair.principal ? 'support' : 'principal'
  });
}

export function selectControlledHero(pair, current, heroId) {
  if (!isValidHeroPair(pair)) throw new TypeError('invalid-hero-pair');
  if (heroId !== pair.principal && heroId !== pair.support) {
    throw new TypeError('hero-not-in-pair');
  }
  // Recompute both roles from the canonical saved pair. Never mutate it.
  return createHeroControl(pair, heroId);
}

export function switchControlledHero(pair, current) {
  if (!isValidHeroPair(pair)) throw new TypeError('invalid-hero-pair');
  const active = current?.controlledHeroId;
  if (active !== pair.principal && active !== pair.support) {
    throw new TypeError('invalid-control-state');
  }
  return createHeroControl(pair, active === pair.principal ? pair.support : pair.principal);
}
