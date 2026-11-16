const FALLBACK_LAYOUT = [
  { key: 'escritorio', bx: 0, by: 0, width: 12, depth: 8 },
  { key: 'producao', bx: 14, by: 0, width: 12, depth: 8 },
  { key: 'atendimento', bx: 0, by: 10, width: 12, depth: 8 },
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function fitLayout(layout, size, padding) {
  const rooms = (layout?.length ? layout : FALLBACK_LAYOUT).map(source => {
    const room = source.meetingRoom ? { ...source, by: source.by - source.meetingRoom.depth, width: source.meetingRoom.x + source.meetingRoom.width, depth: source.meetingRoom.depth + (source.depth || 8) } : source;
    return ({
    ...room,
    width: Number(room.width) || 12,
    depth: Number(room.depth) || 8,
    });
  });
  const minX = Math.min(...rooms.map(room => room.bx));
  const minY = Math.min(...rooms.map(room => room.by));
  const maxX = Math.max(...rooms.map(room => room.bx + room.width));
  const maxY = Math.max(...rooms.map(room => room.by + room.depth));
  const scale = Math.min((size - padding * 2) / (maxX - minX), (size - padding * 2) / (maxY - minY));
  const offsetX = (size - (maxX - minX) * scale) / 2;
  const offsetY = (size - (maxY - minY) * scale) / 2;
  return rooms.map(room => ({
    ...room,
    x: offsetX + (room.bx - minX) * scale,
    y: offsetY + (room.by - minY) * scale,
    w: room.width * scale,
    h: room.depth * scale,
  }));
}

function tone(score) {
  if (score === null || !Number.isFinite(score)) return '#667e94';
  if (score < 45) return '#ef476f';
  if (score < 70) return '#ffd166';
  return '#4ade80';
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, width, height, radius);
  else ctx.rect(x, y, width, height);
}

/** Draws the live company layout as one circular, color-coded heat map. */
export function drawHealthMinimap(canvas, sectors, layout, connections = []) {
  if (!canvas) return [];
  const size = Math.max(1, canvas.clientWidth || 92);
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(size * dpr);
  canvas.height = Math.round(size * dpr);
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, size, size);

  const rooms = fitLayout(layout, size, 9);
  const cx = size / 2;
  const cy = size / 2;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, size / 2 - 1.5, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = '#07172a';
  ctx.fillRect(0, 0, size, size);

  const grid = ctx.createRadialGradient(cx, cy, size * .08, cx, cy, size * .57);
  grid.addColorStop(0, '#153a51');
  grid.addColorStop(1, '#091b30');
  ctx.fillStyle = grid;
  ctx.fillRect(0, 0, size, size);

  const rawRooms = rooms;
  const minX = Math.min(...rawRooms.map(room => room.bx));
  const minY = Math.min(...rawRooms.map(room => room.by));
  const scale = Math.min(
    (size - 18) / (Math.max(...rawRooms.map(room => room.bx + (Number(room.width) || 12))) - minX),
    (size - 18) / (Math.max(...rawRooms.map(room => room.by + (Number(room.depth) || 8))) - minY),
  );
  const offsetX = (size - (Math.max(...rawRooms.map(room => room.bx + (Number(room.width) || 12))) - minX) * scale) / 2;
  const offsetY = (size - (Math.max(...rawRooms.map(room => room.by + (Number(room.depth) || 8))) - minY) * scale) / 2;
  const project = point => [offsetX + (point.x - minX) * scale, offsetY + (point.y - minY) * scale];

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(137,190,208,.32)';
  ctx.lineWidth = Math.max(2, scale * .72);
  connections.forEach(link => {
    if (!link.points?.length) return;
    ctx.beginPath();
    link.points.forEach((point, index) => {
      const [x, y] = project(point);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  });

  rooms.forEach(room => {
    const data = sectors.find(sector => sector.id === room.key);
    const score = data?.score ?? null;
    const color = tone(score);
    const inset = Math.max(1, size * .012);
    const x = room.x + inset;
    const y = room.y + inset;
    const w = room.w - inset * 2;
    const h = room.h - inset * 2;
    const radius = Math.max(2, size * .035);

    roundedRect(ctx, x, y, w, h, radius);
    ctx.fillStyle = '#102b42';
    ctx.fill();
    ctx.save();
    roundedRect(ctx, x, y, w, h, radius);
    ctx.clip();
    const glow = ctx.createRadialGradient(x + w / 2, y + h / 2, 0, x + w / 2, y + h / 2, Math.max(w, h) * .78);
    glow.addColorStop(0, color + '88');
    glow.addColorStop(1, color + '20');
    ctx.fillStyle = glow;
    ctx.fillRect(x, y, w, h);

    const gap = Math.max(1, size * .012);
    const cellW = (w - gap * 4) / 3;
    const cellH = (h - gap * 3) / 2;
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        const heat = clamp((score ?? 28) / 100, .12, 1);
        roundedRect(ctx, x + gap + col * (cellW + gap), y + gap + row * (cellH + gap), cellW, cellH, Math.max(1, radius * .35));
        ctx.fillStyle = score === null ? 'rgba(121,148,171,.15)' : color + Math.round(22 + heat * 68).toString(16).padStart(2, '0');
        ctx.fill();
      }
    }
    ctx.restore();
    roundedRect(ctx, x, y, w, h, radius);
    ctx.strokeStyle = color + 'b0';
    ctx.lineWidth = Math.max(1, size * .018);
    ctx.stroke();
  });

  ctx.restore();
  ctx.beginPath();
  ctx.arc(cx, cy, size / 2 - 1.5, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(152,204,225,.78)';
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, size / 2 - 5, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,.14)';
  ctx.lineWidth = 1;
  ctx.stroke();
  return rooms.map(room => ({ key: room.key, x: room.x, y: room.y, w: room.w, h: room.h, size }));
}
