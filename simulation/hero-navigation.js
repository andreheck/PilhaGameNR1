/**
 * Deterministic grid pathfinding for the Ao Trabalho controlled hero.
 *
 * Coordinates are logical map cells, not canvas pixels or screen coordinates.
 * The map adapter is responsible for translating world positions to cells and
 * supplying blocked cells from the existing furniture/collision model.
 *
 * No map state, NPC route, save data, or company simulation is mutated here.
 */

function keyOf(point) {
  return point.x + ',' + point.y;
}

function validPoint(point, width, height) {
  return !!point
    && Number.isInteger(point.x)
    && Number.isInteger(point.y)
    && point.x >= 0 && point.x < width
    && point.y >= 0 && point.y < height;
}

function compareNodes(a, b) {
  return a.f - b.f || a.h - b.h || a.y - b.y || a.x - b.x;
}

/**
 * Find a shortest four-direction path through a rectangular walkable grid.
 *
 * @returns {Array<{x:number,y:number}>|null} Path includes start and goal;
 * null means invalid input or no walkable route.
 */
export function findHeroPath({ width, height, start, goal, blocked = [] } = {}) {
  if (!Number.isInteger(width) || width < 1
    || !Number.isInteger(height) || height < 1
    || !validPoint(start, width, height)
    || !validPoint(goal, width, height)
    || !Array.isArray(blocked)) return null;

  const blockedKeys = new Set();
  for (const cell of blocked) {
    if (!validPoint(cell, width, height)) return null;
    blockedKeys.add(keyOf(cell));
  }

  const startKey = keyOf(start);
  const goalKey = keyOf(goal);
  if (blockedKeys.has(startKey) || blockedKeys.has(goalKey)) return null;
  if (startKey === goalKey) return [{ x: start.x, y: start.y }];

  const heuristic = (x, y) => Math.abs(goal.x - x) + Math.abs(goal.y - y);
  const open = [{ x: start.x, y: start.y, g: 0, h: heuristic(start.x, start.y), f: heuristic(start.x, start.y) }];
  const openKeys = new Set([startKey]);
  const cameFrom = new Map();
  const bestCost = new Map([[startKey, 0]]);
  const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];

  while (open.length) {
    open.sort(compareNodes);
    const current = open.shift();
    const currentKey = keyOf(current);
    openKeys.delete(currentKey);

    if (currentKey === goalKey) {
      const path = [{ x: goal.x, y: goal.y }];
      let cursor = goalKey;
      while (cursor !== startKey) {
        cursor = cameFrom.get(cursor);
        if (!cursor) return null;
        const [x, y] = cursor.split(',').map(Number);
        path.push({ x, y });
      }
      path.reverse();
      return path;
    }

    for (const [dx, dy] of directions) {
      const x = current.x + dx;
      const y = current.y + dy;
      const next = { x, y };
      if (!validPoint(next, width, height)) continue;
      const nextKey = keyOf(next);
      if (blockedKeys.has(nextKey)) continue;
      const tentative = current.g + 1;
      if (tentative >= (bestCost.get(nextKey) ?? Infinity)) continue;

      cameFrom.set(nextKey, currentKey);
      bestCost.set(nextKey, tentative);
      const h = heuristic(x, y);
      const node = { x, y, g: tentative, h, f: tentative + h };
      if (!openKeys.has(nextKey)) {
        open.push(node);
        openKeys.add(nextKey);
      } else {
        const index = open.findIndex(item => keyOf(item) === nextKey);
        if (index >= 0) open[index] = node;
      }
    }
  }

  return null;
}
