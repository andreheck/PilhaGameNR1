/* PilhA+ Game — motor isométrico dos ambientes de trabalho (canvas 2D, sem dependências).
 *
 * Cada ambiente é um diorama 12x8 dividido em 6 setores (3 colunas x 2 linhas).
 * Pessoas circulam pelos corredores. Um setor "adoecido" fica cinza, com névoa e gente lenta;
 * ao investigar o sinal, o setor ganha cor, luz e as pessoas voltam a andar com energia.
 *
 * API:
 *   var iso = PilhaIso.create(canvas);
 *   iso.resize(); iso.setEnv("escritorio"); iso.setStatic(bool);
 *   iso.light(zoneIndex, color);  // acende um setor (com onda)
 *   iso.anchor(zoneIndex)         // {x, y} em px CSS, para posicionar botões
 *   iso.start(); iso.stop(); iso.render();
 */
(function (global) {
  "use strict";

  var TW = 64, TH = 32, ZU = 30; // largura/altura do losango e unidade vertical
  var W = 12, D = 8, WALLH = 3.2, SLAB = 0.4;
  var AX = [0.4, 4, 8, 11.6]; // eixos dos corredores
  var AY = [0.4, 4, 7.6];

  var SHIRTS = ["#ef476f", "#06d6a0", "#118ab2", "#ffd166", "#9b5de5", "#f78c6b", "#4cc9f0", "#fb8500"];
  var SKINS = ["#f1c27d", "#e0ac69", "#c68642", "#8d5524", "#ffdbac"];
  var HAIRS = ["#2b1d0e", "#4a3728", "#111827", "#a16207", "#7f1d1d"];

  var PALETTES = {
    escritorio: { floorA: "#3a4f6b", floorB: "#33465f", wall: "#2a4160", wallR: "#223652", line: "rgba(255,255,255,.14)" },
    producao:   { floorA: "#555f6d", floorB: "#4c5663", wall: "#37465a", wallR: "#2d3a4b", line: "rgba(255,210,75,.5)" },
    atendimento:{ floorA: "#40407a", floorB: "#393970", wall: "#35356b", wallR: "#2b2b58", line: "rgba(190,160,255,.25)" }
  };

  /* ---------- utilidades ---------- */
  function hex(h) {
    var n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  // hl = "saúde" local (0 doente, 1 saudável); f = sombreamento da face
  function tone(c, hl, f) {
    var r = typeof c === "string" ? hex(c) : c;
    var g = r[0] * 0.3 + r[1] * 0.59 + r[2] * 0.11;
    var k = 0.78 * (1 - hl);
    var b = (0.64 + 0.36 * hl) * (f || 1);
    var o = [];
    for (var i = 0; i < 3; i++) o.push(Math.round(clamp((r[i] + (g - r[i]) * k) * b, 0, 255)));
    return "rgb(" + o[0] + "," + o[1] + "," + o[2] + ")";
  }
  function rgba(c, a) {
    var r = hex(c);
    return "rgba(" + r[0] + "," + r[1] + "," + r[2] + "," + a + ")";
  }
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function zoneOf(x, y) {
    var c = clamp(Math.floor(x / 4), 0, 2), r = clamp(Math.floor(y / 4), 0, 1);
    return r * 3 + c;
  }

  /* ---------- montagem dos ambientes ---------- */
  var VARIANTS = {
    escritorio:  ["A", "B", "A", "C", "B", "A"],
    producao:    ["P1", "P2", "P3", "P3", "P1", "P2"],
    atendimento: ["T1", "T2", "T1", "T1", "T2", "T3"]
  };

  function buildEnv(key, index) {
    var rand = rng(1000 + index * 77);
    var items = [];
    function add(t, x, y, w, d, h, c, z, extra) {
      var it = { t: t, x: x, y: y, w: w, d: d, h: h, c: c, z: z };
      if (extra) for (var k in extra) it[k] = extra[k];
      items.push(it);
    }
    for (var z = 0; z < 6; z++) {
      var zx = 4 * (z % 3), zy = 4 * Math.floor(z / 3), v = VARIANTS[key][z];
      var wood = "#c9a77a";
      if (v === "A") {
        add("desk", zx + 0.8, zy + 0.7, 1.6, 0.8, 0.42, wood, z, { sit: true });
        add("desk", zx + 0.8, zy + 2.1, 1.6, 0.8, 0.42, wood, z, { sit: z % 2 === 0 });
        add("plant", zx + 2.8, zy + 0.8, 0.4, 0.4, 0.3, "#7a5c3e", z);
      } else if (v === "B") {
        add("table", zx + 1.0, zy + 1.3, 1.8, 1.2, 0.5, "#b98f62", z);
        add("chair", zx + 1.2, zy + 0.7, 0.45, 0.45, 0.45, "#3b4f6b", z);
        add("chair", zx + 2.1, zy + 0.7, 0.45, 0.45, 0.45, "#3b4f6b", z);
        add("chair", zx + 1.2, zy + 2.65, 0.45, 0.45, 0.45, "#3b4f6b", z);
        add("chair", zx + 2.1, zy + 2.65, 0.45, 0.45, 0.45, "#3b4f6b", z);
        add("plant", zx + 3.0, zy + 3.0, 0.4, 0.4, 0.3, "#7a5c3e", z);
      } else if (v === "C") {
        add("desk", zx + 0.8, zy + 0.7, 1.6, 0.8, 0.42, wood, z, { sit: true });
        add("desk", zx + 0.8, zy + 2.1, 1.6, 0.8, 0.42, wood, z, { sit: true });
        add("box", zx + 2.7, zy + 2.3, 0.6, 0.5, 0.55, "#d5dbe6", z);
      } else if (v === "P1") {
        add("machine", zx + 0.8, zy + 0.5, 0.9, 0.7, 1.35, "#64748b", z);
        add("machine", zx + 2.3, zy + 0.5, 0.9, 0.7, 1.1, "#7c8ba1", z);
        add("conveyor", zx + 0.8, zy + 1.9, 2.4, 0.7, 0.35, "#27303d", z);
      } else if (v === "P2") {
        add("shelf", zx + 0.8, zy + 0.6, 2.4, 0.5, 1.5, "#64748b", z);
        add("crate", zx + 0.9, zy + 2.2, 0.7, 0.7, 0.6, "#b8864b", z);
        add("crate", zx + 1.7, zy + 2.2, 0.7, 0.7, 0.9, "#a87a41", z);
        add("crate", zx + 2.5, zy + 2.35, 0.6, 0.6, 0.5, "#b8864b", z);
      } else if (v === "P3") {
        add("machine", zx + 0.8, zy + 0.7, 1.4, 1.1, 1.5, "#52607a", z);
        add("machine", zx + 2.5, zy + 0.7, 0.7, 1.1, 1.1, "#7c8ba1", z);
        add("crate", zx + 1.0, zy + 2.5, 0.7, 0.7, 0.6, "#b8864b", z);
      } else if (v === "T1") {
        add("desk", zx + 0.8, zy + 0.7, 1.6, 0.8, 0.42, "#d6d3e8", z, { sit: true, head: true });
        add("desk", zx + 0.8, zy + 2.1, 1.6, 0.8, 0.42, "#d6d3e8", z, { sit: true, head: true });
        add("plant", zx + 2.8, zy + 0.8, 0.4, 0.4, 0.3, "#7a5c3e", z);
      } else if (v === "T2") {
        add("board", zx + 0.8, zy + 0.55, 2.4, 0.25, 1.4, "#1e1b4b", z);
        add("desk", zx + 1.1, zy + 2.0, 1.6, 0.8, 0.42, "#d6d3e8", z, { sit: true, head: true });
      } else if (v === "T3") {
        add("sofa", zx + 0.8, zy + 2.4, 1.8, 0.8, 0.5, "#8b5cf6", z);
        add("box", zx + 1.2, zy + 1.2, 0.8, 0.6, 0.35, "#e5e7eb", z);
        add("plant", zx + 2.9, zy + 0.8, 0.4, 0.4, 0.3, "#7a5c3e", z);
      }
    }

    var people = [];
    function look(p) {
      p.shirt = SHIRTS[Math.floor(rand() * SHIRTS.length)];
      p.skin = SKINS[Math.floor(rand() * SKINS.length)];
      p.hair = HAIRS[Math.floor(rand() * HAIRS.length)];
      p.seed = rand() * 10;
      return p;
    }
    items.forEach(function (it) {
      if (it.sit) {
        people.push(look({ x: it.x + it.w * 0.35 + 0.22, y: it.y + it.d + 0.42, sit: true, z: it.z }));
      }
    });
    // andarilhos: caminhada aleatória pelo grafo de corredores
    var nodes = [];
    for (var n = 0; n < 11; n++) {
      var gi = Math.floor(rand() * 4), gj = Math.floor(rand() * 3);
      var p = look({ gi: gi, gj: gj, pi: -1, pj: -1, x: AX[gi], y: AY[gj], phase: rand() * 6, speed: 0.9 + rand() * 0.6, wait: rand() * 2, moving: true, z: 0 });
      pickNext(p, rand);
      people.push(p);
    }
    return { key: key, pal: PALETTES[key], items: items, people: people, zh: [0, 0, 0, 0, 0, 0], lit: [false, false, false, false, false, false], waves: [], rand: rand };
  }

  function pickNext(p, rand) {
    var opts = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(function (d) { return [p.gi + d[0], p.gj + d[1]]; })
      .filter(function (c) { return c[0] >= 0 && c[0] < 4 && c[1] >= 0 && c[1] < 3; });
    var fwd = opts.filter(function (c) { return !(c[0] === p.pi && c[1] === p.pj); });
    var list = fwd.length ? fwd : opts;
    var c = list[Math.floor(rand() * list.length)];
    p.pi = p.gi; p.pj = p.gj; p.gi = c[0]; p.gj = c[1];
    p.tx = AX[c[0]]; p.ty = AY[c[1]];
  }

  /* ---------- renderizador ---------- */
  function create(canvas, zoneColors) {
    var ctx = canvas.getContext("2d");
    var cw = 1, ch = 1, dpr = 1, s = 1, ox = 0, oy = 0;
    var envs = {}, order = ["escritorio", "producao", "atendimento"];
    var env = null, time = 0, raf = 0, last = 0, isStatic = false, running = false;
    var colors = zoneColors || ["#ffd166", "#48cae4", "#52b788", "#f4a261", "#9b5de5", "#e63946"];

    function P(x, y, z) {
      return [ox + (x - y) * TW / 2 * s, oy + (x + y) * TH / 2 * s - (z || 0) * ZU * s];
    }
    function poly(pts, fill, stroke, lw) {
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.closePath();
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); }
    }
    function ell(x, y, rx, ry, fill) {
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
    }
    function rr(x, y, w, h, r) {
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h);
    }
    function box(x, y, z, w, d, h, c, hl) {
      poly([P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)], tone(c, hl, 0.84));
      poly([P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)], tone(c, hl, 0.62));
      poly([P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)], tone(c, hl, 1.1));
    }

    function getEnv(key) {
      if (!envs[key]) envs[key] = buildEnv(key, order.indexOf(key));
      return envs[key];
    }

    function resize() {
      var r = canvas.getBoundingClientRect();
      dpr = Math.min(2, global.devicePixelRatio || 1);
      cw = Math.max(1, r.width); ch = Math.max(1, r.height);
      canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
      var spanX = (W + D) * TW / 2, top = WALLH * ZU, bottom = (W + D) * TH / 2 + SLAB * ZU;
      s = Math.min(cw * 0.97 / spanX, ch * 0.97 / (top + bottom));
      ox = cw / 2 - ((W - D) * TW / 4) * s;
      oy = ch / 2 - ((bottom - top) / 2) * s;
      render();
    }

    /* --- cenário --- */
    function drawWalls(e) {
      var pal = e.pal, avg = (e.zh[0] + e.zh[1] + e.zh[2]) / 3, avgL = (e.zh[0] + e.zh[3]) / 2;
      poly([P(0, 0, 0), P(W, 0, 0), P(W, 0, WALLH), P(0, 0, WALLH)], tone(pal.wallR, 0.3 + 0.7 * avg, 1));
      poly([P(0, 0, 0), P(0, D, 0), P(0, D, WALLH), P(0, 0, WALLH)], tone(pal.wall, 0.3 + 0.7 * avgL, 1));
      var i, hl;
      for (i = 0; i < 5; i++) {
        var x0 = 0.9 + i * 2.25;
        hl = e.zh[clamp(Math.floor(x0 / 4), 0, 2)];
        poly([P(x0, 0, 1.0), P(x0 + 1.5, 0, 1.0), P(x0 + 1.5, 0, 2.5), P(x0, 0, 2.5)], tone("#9bd8ff", hl, 1), "rgba(255,255,255,.25)", 1);
        ctx.beginPath(); var a = P(x0 + 0.75, 0, 1.0), b = P(x0 + 0.75, 0, 2.5);
        ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.strokeStyle = "rgba(255,255,255,.2)"; ctx.stroke();
      }
      for (i = 0; i < 3; i++) {
        var y0 = 0.9 + i * 2.4;
        hl = e.zh[Math.floor(y0 / 4) * 3];
        poly([P(0, y0, 1.0), P(0, y0 + 1.5, 1.0), P(0, y0 + 1.5, 2.5), P(0, y0, 2.5)], tone("#9bd8ff", hl, 0.86), "rgba(255,255,255,.22)", 1);
      }
    }

    function drawFloor(e) {
      var pal = e.pal, i, j;
      // laterais da laje
      poly([P(0, D, 0), P(W, D, 0), P(W, D, -SLAB), P(0, D, -SLAB)], tone(pal.floorB, 0.4, 0.55));
      poly([P(W, 0, 0), P(W, D, 0), P(W, D, -SLAB), P(W, 0, -SLAB)], tone(pal.floorB, 0.4, 0.4));
      for (i = 0; i < W; i++) {
        for (j = 0; j < D; j++) {
          var hl = 0.3 + 0.7 * e.zh[zoneOf(i + 0.5, j + 0.5)];
          poly([P(i, j, 0), P(i + 1, j, 0), P(i + 1, j + 1, 0), P(i, j + 1, 0)], tone((i + j) & 1 ? pal.floorA : pal.floorB, hl, 1));
        }
      }
      // marcações dos corredores
      ctx.save();
      ctx.setLineDash([7 * s, 6 * s]); ctx.lineWidth = Math.max(1, 1.6 * s); ctx.strokeStyle = pal.line;
      [4, 8].forEach(function (x) { var a = P(x, 0, 0), b = P(x, D, 0); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); });
      var a2 = P(0, 4, 0), b2 = P(W, 4, 0); ctx.beginPath(); ctx.moveTo(a2[0], a2[1]); ctx.lineTo(b2[0], b2[1]); ctx.stroke();
      ctx.restore();
      // tapetes dos setores
      for (var z = 0; z < 6; z++) {
        var zx = 4 * (z % 3) + 0.3, zy = 4 * Math.floor(z / 3) + 0.3, zh = e.zh[z];
        var pts = [P(zx, zy, 0.01), P(zx + 3.4, zy, 0.01), P(zx + 3.4, zy + 3.4, 0.01), P(zx, zy + 3.4, 0.01)];
        poly(pts, rgba(colors[z], 0.05 + 0.26 * zh), zh > 0.04 ? rgba(colors[z], 0.25 + 0.55 * zh) : "rgba(255,255,255,.08)", Math.max(1, 1.6 * s));
      }
    }

    /* --- objetos --- */
    function drawItem(it, e) {
      var hl = 0.22 + 0.78 * e.zh[it.z], t = time, x = it.x, y = it.y, w = it.w, d = it.d, h = it.h, c = it.c;
      var seed = it.x * 3 + it.y;
      if (it.t === "desk") {
        // cadeira
        box(x + w * 0.35, y + d + 0.08, 0, 0.5, 0.5, 0.45, "#3b4f6b", hl);
        box(x, y, 0, w, d, h, c, hl);
        // monitor
        var mx = x + w * 0.22, my = y + d * 0.2, mw = 0.62, md = 0.08, mh = 0.5;
        box(mx, my, h, mw, md, mh, "#111827", hl);
        var sc = hl > 0.7 ? "#7dd3fc" : hl > 0.4 ? "#94a3b8" : (Math.floor(t * 2.5 + seed) % 6 === 0 ? "#ef4444" : "#4b5563");
        var yy = my + md;
        poly([P(mx + 0.05, yy, h + 0.06), P(mx + mw - 0.05, yy, h + 0.06), P(mx + mw - 0.05, yy, h + mh - 0.06), P(mx + 0.05, yy, h + mh - 0.06)], sc);
        // teclado e fone
        box(x + w * 0.3, y + d * 0.62, h, 0.5, 0.2, 0.03, "#cbd5e1", hl);
        if (it.head) box(x + w * 0.78, y + d * 0.3, h, 0.18, 0.18, 0.16, "#7c3aed", hl);
      } else if (it.t === "table") {
        box(x, y, 0, w, d, h, c, hl);
        box(x + w * 0.4, y + d * 0.35, h, 0.4, 0.3, 0.04, "#e5e7eb", hl);
      } else if (it.t === "plant") {
        box(x, y, 0, w, d, h, c, hl);
        var p0 = P(x + w / 2, y + d / 2, h), r0 = 0.34 * ZU * s * (0.6 + 0.4 * hl);
        var leaf = tone("#2fbf71", hl, 1);
        ell(p0[0], p0[1] - r0 * 0.9, r0, r0 * 1.05, leaf);
        ell(p0[0] - r0 * 0.7, p0[1] - r0 * 0.3, r0 * 0.7, r0 * 0.7, tone("#25a862", hl, 0.9));
        ell(p0[0] + r0 * 0.7, p0[1] - r0 * 0.4, r0 * 0.7, r0 * 0.7, tone("#3ad483", hl, 1));
      } else if (it.t === "machine") {
        box(x, y, 0, w, d, h, c, hl);
        box(x + w * 0.2, y + d * 0.3, h, w * 0.3, d * 0.3, 0.12, "#334155", hl);
        var lp = P(x + w * 0.75, y + d * 0.75, h + 0.2);
        var on = hl > 0.6 ? "#4ade80" : (Math.floor(t * 3 + seed) % 2 ? "#ef4444" : "#7f1d1d");
        ell(lp[0], lp[1], 0.09 * ZU * s, 0.09 * ZU * s, on);
        if (hl > 0.6) { ctx.fillStyle = "rgba(74,222,128,.22)"; ctx.beginPath(); ctx.arc(lp[0], lp[1], 0.2 * ZU * s, 0, 7); ctx.fill(); }
        // painel frontal
        poly([P(x + 0.08, y + d, 0.3), P(x + w - 0.08, y + d, 0.3), P(x + w - 0.08, y + d, h * 0.62), P(x + 0.08, y + d, h * 0.62)], tone("#1e293b", hl, 0.9));
      } else if (it.t === "conveyor") {
        box(x, y, 0, w, d, h, c, hl);
        // esteira em movimento: faixas e caixas
        var speed = 0.25 + 0.9 * e.zh[it.z], off = (t * speed) % 0.6;
        for (var k = -1; k < w / 0.6; k++) {
          var sx = x + k * 0.6 + off;
          if (sx < x || sx + 0.06 > x + w) continue;
          poly([P(sx, y + 0.05, h + 0.005), P(sx + 0.06, y + 0.05, h + 0.005), P(sx + 0.06, y + d - 0.05, h + 0.005), P(sx, y + d - 0.05, h + 0.005)], tone("#fbbf24", hl, 0.9));
        }
        var cx = x + ((t * speed * 0.7) % (w + 0.4)) - 0.4;
        if (cx > x && cx + 0.4 < x + w) box(cx, y + 0.15, h, 0.4, 0.4, 0.3, "#b8864b", hl);
      } else if (it.t === "shelf") {
        box(x, y, 0, w, d, h, c, hl);
        for (var q = 1; q < 4; q++) {
          var zz = h * q / 4;
          poly([P(x + 0.04, y + d, zz), P(x + w - 0.04, y + d, zz), P(x + w - 0.04, y + d, zz + 0.05), P(x + 0.04, y + d, zz + 0.05)], tone("#94a3b8", hl, 1));
          for (var m = 0; m < 4; m++) box(x + 0.15 + m * 0.55, y + 0.08, zz + 0.05, 0.38, 0.3, 0.22, ["#fb923c", "#38bdf8", "#facc15", "#a78bfa"][(m + q) % 4], hl);
        }
      } else if (it.t === "board") {
        box(x, y, 0, w, d, h, c, hl);
        // painel de fila: barras
        for (var b = 0; b < 6; b++) {
          var bh = 0.15 + ((Math.sin(t * 1.6 + b * 1.3 + seed) + 1) / 2) * (hl < 0.5 ? 0.9 : 0.4);
          var bc = hl > 0.6 ? "#a78bfa" : (bh > 0.7 ? "#ef4444" : "#6b7280");
          poly([P(x + 0.15 + b * 0.37, y + d, 0.2), P(x + 0.45 + b * 0.37, y + d, 0.2), P(x + 0.45 + b * 0.37, y + d, 0.2 + bh), P(x + 0.15 + b * 0.37, y + d, 0.2 + bh)], bc);
        }
      } else {
        box(x, y, 0, w, d, h, c, hl); // chair, crate, box, sofa
        if (it.t === "sofa") box(x, y, h, w, 0.2, 0.35, c, hl);
      }
    }

    /* --- pessoas --- */
    function person(p, e) {
      var hz = e.zh[zoneOf(p.x, p.y)], hl = 0.2 + 0.8 * hz, u = ZU * s;
      var q = P(p.x, p.y, 0), fx = q[0], fy = q[1], sit = !!p.sit;
      var walking = !sit && p.moving;
      var bob = walking ? -Math.abs(Math.sin(p.phase)) * 0.07 * u : (sit && hz > 0.5 ? Math.sin(time * 7 + p.seed) * 0.012 * u : 0);
      var lean = (1 - hz) * 0.12 * u;
      ell(fx, fy, 0.26 * u, 0.11 * u, "rgba(0,0,0,.28)");
      var hipY = fy - (sit ? 0.42 : 0.62) * u + bob;
      if (!sit) {
        ctx.lineCap = "round"; ctx.lineWidth = 0.13 * u; ctx.strokeStyle = tone("#1e293b", hl, 1);
        var sw = walking ? Math.sin(p.phase) * 0.14 * u : 0;
        ctx.beginPath(); ctx.moveTo(fx - 0.07 * u, hipY); ctx.lineTo(fx - 0.07 * u + sw, fy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(fx + 0.07 * u, hipY); ctx.lineTo(fx + 0.07 * u - sw, fy); ctx.stroke();
      }
      var tw = 0.34 * u, th = (sit ? 0.46 : 0.52) * u;
      rr(fx - tw / 2 + lean * 0.25, hipY - th, tw, th, tw * 0.42);
      ctx.fillStyle = tone(p.shirt, hl, 1); ctx.fill();
      var hr = 0.165 * u, hx = fx + lean * 0.9, hy = hipY - th - hr * 0.75 + (1 - hz) * 0.07 * u;
      ctx.beginPath(); ctx.arc(hx, hy, hr, 0, Math.PI * 2); ctx.fillStyle = tone(p.skin, hl, 1); ctx.fill();
      ctx.beginPath(); ctx.arc(hx, hy - hr * 0.1, hr * 1.02, Math.PI, 0); ctx.fillStyle = tone(p.hair, hl, 1); ctx.fill();
      // balões de estado
      var cyc = (time * 0.35 + p.seed) % 5;
      if (hz < 0.35 && cyc < 1.4) {
        var by = hy - hr * 2.1;
        ctx.beginPath(); ctx.arc(fx, by, 0.2 * u, 0, 7); ctx.fillStyle = "#e63946"; ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = "800 " + Math.max(8, Math.round(0.28 * u)) + "px Inter,system-ui,sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("!", fx, by + 0.01 * u);
      } else if (hz > 0.8 && cyc < 1.6) {
        var rise = (cyc / 1.6), ay = hy - hr * 1.9 - rise * 0.5 * u;
        ctx.globalAlpha = 1 - rise; ctx.fillStyle = "#ffd24b";
        ctx.font = "900 " + Math.max(9, Math.round(0.34 * u)) + "px Inter,system-ui,sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("+", fx, ay);
        ctx.globalAlpha = 1;
      }
    }

    function step(e, dt) {
      var i, p, hz;
      for (i = 0; i < 6; i++) {
        var target = e.lit[i] ? 1 : 0;
        e.zh[i] += (target - e.zh[i]) * Math.min(1, dt * 2.2);
      }
      for (i = 0; i < e.people.length; i++) {
        p = e.people[i];
        if (p.sit) continue;
        hz = e.zh[zoneOf(p.x, p.y)];
        if (p.wait > 0) { p.wait -= dt; p.moving = false; continue; }
        var dx = p.tx - p.x, dy = p.ty - p.y, dist = Math.hypot(dx, dy);
        var sp = p.speed * (0.3 + 0.9 * hz) * dt;
        if (dist <= sp) {
          p.x = p.tx; p.y = p.ty; pickNext(p, e.rand);
          p.wait = e.rand() < 0.4 ? (hz < 0.4 ? 1.6 : 0.5) * e.rand() : 0;
        } else {
          p.x += dx / dist * sp; p.y += dy / dist * sp; p.moving = true; p.phase += sp * 7;
        }
      }
    }

    function effects(e) {
      var i, z;
      // ondas ao acender
      e.waves = e.waves.filter(function (w) { return time - w.t < 1.3; });
      e.waves.forEach(function (w) {
        var k = (time - w.t) / 1.3, r = 0.4 + k * 4.2, cx = 4 * (w.i % 3) + 2, cy = 4 * Math.floor(w.i / 3) + 2, pts = [];
        for (var a = 0; a < 28; a++) { var an = a / 28 * Math.PI * 2; pts.push(P(cx + Math.cos(an) * r, cy + Math.sin(an) * r, 0.02)); }
        poly(pts, null, rgba(colors[w.i], (1 - k) * 0.9), Math.max(2, 3 * s));
      });
      for (z = 0; z < 6; z++) {
        var zh = e.zh[z], cx2 = 4 * (z % 3) + 2, cy2 = 4 * Math.floor(z / 3) + 2;
        if (zh < 0.6) {
          // névoa do setor adoecido
          var pc = P(cx2 + Math.sin(time * 0.3 + z) * 0.4, cy2 + Math.cos(time * 0.25 + z) * 0.4, 0.9), rad = 1.9 * TW / 2 * s;
          ctx.save(); ctx.translate(pc[0], pc[1]); ctx.scale(1, 0.5);
          var g = ctx.createRadialGradient(0, 0, 0, 0, 0, rad);
          g.addColorStop(0, "rgba(96,104,120," + (0.3 * (1 - zh)) + ")"); g.addColorStop(1, "rgba(96,104,120,0)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rad, 0, 7); ctx.fill(); ctx.restore();
        } else {
          // faíscas douradas do setor recuperado
          for (i = 0; i < 6; i++) {
            var ph = (time * 0.35 + i / 6 + z * 0.13) % 1, a2 = i * 2.3 + z;
            var sp2 = P(cx2 + Math.cos(a2) * 1.4, cy2 + Math.sin(a2) * 1.4, 0.3 + ph * 2.2);
            ctx.globalAlpha = (1 - ph) * zh * 0.9; ctx.fillStyle = "#ffe433";
            var rs = Math.max(1.2, 0.05 * ZU * s * 1.6);
            ctx.fillRect(sp2[0] - rs, sp2[1] - rs * 0.3, rs * 2, rs * 0.6); ctx.fillRect(sp2[0] - rs * 0.3, sp2[1] - rs, rs * 0.6, rs * 2);
          }
          ctx.globalAlpha = 1;
        }
      }
    }

    function render() {
      if (!env) return;
      var e = env;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      drawWalls(e); drawFloor(e);
      var list = [];
      e.items.forEach(function (it) { list.push({ k: it.x + it.w / 2 + it.y + it.d / 2, f: function () { drawItem(it, e); } }); });
      e.people.forEach(function (p) { list.push({ k: p.x + p.y + (p.sit ? 0.02 : 0), f: function () { person(p, e); } }); });
      list.sort(function (a, b) { return a.k - b.k; });
      list.forEach(function (o) { o.f(); });
      effects(e);
    }

    function loop(ts) {
      if (!running) return;
      var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016;
      last = ts; time += dt;
      step(env, dt); render();
      raf = global.requestAnimationFrame(loop);
    }

    return {
      resize: resize,
      render: render,
      setEnv: function (key) { env = getEnv(key); if (isStatic) { for (var i = 0; i < 6; i++) env.zh[i] = env.lit[i] ? 1 : 0; } render(); },
      getEnv: getEnv,
      setStatic: function (v) { isStatic = !!v; },
      light: function (i) {
        env.lit[i] = true;
        if (isStatic) env.zh[i] = 1; else env.waves.push({ i: i, t: time });
        render();
      },
      isLit: function (key, i) { return getEnv(key).lit[i]; },
      anchor: function (i) {
        var p = P(4 * (i % 3) + 2, 4 * Math.floor(i / 3) + 2, 2.3);
        return { x: p[0], y: p[1] };
      },
      start: function () {
        if (isStatic || running) return;
        running = true; last = 0; raf = global.requestAnimationFrame(loop);
      },
      stop: function () { running = false; if (raf) global.cancelAnimationFrame(raf); raf = 0; }
    };
  }

  global.PilhaIso = { create: create };
})(typeof window !== "undefined" ? window : this);
