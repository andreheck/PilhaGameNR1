import test from 'node:test';
import assert from 'node:assert/strict';
import { findHeroPath } from '../simulation/hero-navigation.js';

const pathLength = path => path.length - 1;

test('returns a deterministic shortest path on an open grid', () => {
  const input = { width: 5, height: 4, start: { x: 0, y: 0 }, goal: { x: 3, y: 2 } };
  const first = findHeroPath(input);
  assert.deepEqual(first, findHeroPath(input));
  assert.deepEqual(first[0], input.start);
  assert.deepEqual(first.at(-1), input.goal);
  assert.equal(pathLength(first), 5);
});

test('routes around blocked furniture cells without diagonal corner cutting', () => {
  const path = findHeroPath({
    width: 5, height: 5,
    start: { x: 0, y: 2 }, goal: { x: 4, y: 2 },
    blocked: [{ x: 2, y: 2 }, { x: 1, y: 1 }, { x: 1, y: 3 }]
  });
  assert.ok(path);
  assert.equal(pathLength(path), 8);
  assert.ok(path.every(point => !(point.x === 2 && point.y === 2)));
  for (let i = 1; i < path.length; i++) {
    assert.equal(Math.abs(path[i].x - path[i - 1].x) + Math.abs(path[i].y - path[i - 1].y), 1);
  }
});

test('returns null when the destination is isolated or blocked', () => {
  assert.equal(findHeroPath({
    width: 3, height: 3, start: { x: 0, y: 0 }, goal: { x: 2, y: 2 },
    blocked: [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }]
  }), null);
  assert.equal(findHeroPath({
    width: 3, height: 3, start: { x: 0, y: 0 }, goal: { x: 1, y: 1 }, blocked: [{ x: 1, y: 1 }]
  }), null);
});

test('returns the current cell when start and goal match', () => {
  assert.deepEqual(findHeroPath({
    width: 2, height: 2, start: { x: 1, y: 1 }, goal: { x: 1, y: 1 }
  }), [{ x: 1, y: 1 }]);
});

test('rejects malformed grids and coordinates without throwing', () => {
  assert.equal(findHeroPath(null), null);
  assert.equal(findHeroPath({ width: 0, height: 2, start: { x: 0, y: 0 }, goal: { x: 1, y: 1 } }), null);
  assert.equal(findHeroPath({ width: 2, height: 2, start: { x: -1, y: 0 }, goal: { x: 1, y: 1 } }), null);
  assert.equal(findHeroPath({ width: 2, height: 2, start: { x: 0, y: 0 }, goal: { x: 1, y: 1 }, blocked: 'bad' }), null);
});
