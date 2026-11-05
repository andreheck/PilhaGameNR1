/** Segment-sampled 2D navigation guards for the office X/Z plane. */
export function pointBlocked(x, z, rects, radius = 0.18) {
  return rects.some(([minX,minZ,maxX,maxZ]) =>
    x >= minX-radius && x <= maxX+radius &&
    z >= minZ-radius && z <= maxZ+radius
  );
}
export function segmentBlocked(from, to, rects, radius = 0.18, maxSample = 0.08) {
  const distance = Math.hypot(to.x-from.x, to.z-from.z);
  const samples = Math.max(1, Math.ceil(distance / Math.max(0.01,maxSample)));
  for (let i=1; i<=samples; i++) {
    const t=i/samples;
    if (pointBlocked(from.x+(to.x-from.x)*t,from.z+(to.z-from.z)*t,rects,radius)) return true;
  }
  return false;
}
export function moveSafely(from, target, rects, bounds, radius = 0.18) {
  const clamp = p => ({
    x: Math.max(bounds.minX+radius,Math.min(bounds.maxX-radius,p.x)),
    z: Math.max(bounds.minZ+radius,Math.min(bounds.maxZ-radius,p.z))
  });
  const start=clamp(from), destination=clamp(target);
  if (!segmentBlocked(start,destination,rects,radius)) return {...destination,blocked:false};
  const xSlide=clamp({x:destination.x,z:start.z});
  if (!segmentBlocked(start,xSlide,rects,radius)) return {...xSlide,blocked:true};
  const zSlide=clamp({x:start.x,z:destination.z});
  if (!segmentBlocked(start,zSlide,rects,radius)) return {...zSlide,blocked:true};
  return {...start,blocked:true};
}
