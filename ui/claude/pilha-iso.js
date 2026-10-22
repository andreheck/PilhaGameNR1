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
  var AX = [0.35, 4, 8, 11.75]; // clear of furniture, including installed items
  var AY = [0.28, 4, 7.7];
  // A directed loop visits every aisle without head-on traffic or crossing furniture.
  var AISLE = [[0,0],[1,0],[1,1],[2,1],[2,0],[3,0],[3,1],[3,2],[2,2],[1,2],[0,2],[0,1]].map(function(n){return {x:AX[n[0]],y:AY[n[1]]};});
  var AISLE_LENGTH = AISLE.reduce(function(sum,p,i){var q=AISLE[(i+1)%AISLE.length];return sum+Math.hypot(q.x-p.x,q.y-p.y);},0);
  function aislePoint(distance) {
    var d=((distance%AISLE_LENGTH)+AISLE_LENGTH)%AISLE_LENGTH;
    for(var i=0;i<AISLE.length;i++){var a=AISLE[i],b=AISLE[(i+1)%AISLE.length],length=Math.hypot(b.x-a.x,b.y-a.y);if(d<length)return {x:a.x+(b.x-a.x)*d/length,y:a.y+(b.y-a.y)*d/length,tx:b.x,ty:b.y,edge:i};d-=length;}
    return {x:AISLE[0].x,y:AISLE[0].y,tx:AISLE[1].x,ty:AISLE[1].y,edge:0};
  }
  function companyConnections(defs) {
    if(defs.length<2)return [];
    var joined=[defs[0]],rest=defs.slice(1),links=[];
    while(rest.length){
      var best=null;joined.forEach(function(a){rest.forEach(function(b){var d=Math.abs(a.bx-b.bx)+Math.abs(a.by-b.by);if(!best||d<best.d)best={a:a,b:b,d:d};});});
      var a=best.a,b=best.b;rest.splice(rest.indexOf(b),1);joined.push(b);
      var horizontal=Math.abs(a.by-b.by)<D-1&&Math.abs(a.bx-b.bx)>=W;
      if(horizontal&&a.bx>b.bx||!horizontal&&a.by>b.by){var tmp=a;a=b;b=tmp;}
      var points,door;
      if(horizontal){
        var y=Math.max(a.by,b.by)+4;
        points=[{x:a.bx+AX[3],y:y},{x:b.bx+AX[0],y:y}];
        door={key:b.key,axis:'x',at:y-b.by};
      }else{
        var ax=a.bx===b.bx?8:AX[3],bx=a.bx===b.bx?8:AX[0],mid=(a.by+D+b.by)/2;
        points=[{x:a.bx+ax,y:a.by+AY[2]},{x:a.bx+ax,y:mid},{x:b.bx+bx,y:mid},{x:b.bx+bx,y:b.by+AY[0]}].filter(function(p,i,arr){return !i||p.x!==arr[i-1].x||p.y!==arr[i-1].y;});
        door={key:b.key,axis:'y',at:bx};
      }
      links.push({from:a.key,to:b.key,points:points,door:door});
    }
    return links;
  }

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
    // Staggered patrols: one direction, individual short stops, minimum headway.
    for (var n = 0; n < 11; n++) {
      var progress=n*AISLE_LENGTH/11;
      var p = look(Object.assign({progress:progress,phase:rand()*6,speed:.95+rand()*.3,wait:rand(),moving:false,z:0},aislePoint(progress)));
      p.npc = n < 3 ? n : -1;
      people.push(p);
    }
    return { key: key, pal: PALETTES[key], items: items, people: people, zh: [0, 0, 0, 0, 0, 0], lit: [false, false, false, false, false, false], tgt: [0, 0, 0, 0, 0, 0], waves: [], rand: rand };
  }

  /* ---------- renderizador ---------- */
  function create(canvas, zoneColors, zoneNamesIn) {
    var ctx = canvas.getContext("2d");
    var cw = 1, ch = 1, dpr = 1, s = 1, ox = 0, oy = 0;
    var envs = {}, order = ["escritorio", "producao", "atendimento"];
    var env = null, time = 0, raf = 0, last = 0, isStatic = false, running = false, sharedIndexMode = false, inventory = new Set(), npcSheets = [], connections = [], commuters = [];
    var colors = zoneColors || ["#ffd166", "#48cae4", "#52b788", "#f4a261", "#9b5de5", "#e63946"];

    var bx = 0, by = 0, worldCfg = null, cam = { cx: 0, cy: 0, k: 1 }, home = { cx: 0, cy: 0, k: 1 }, s0 = 1,
        anim = null, hoverHit = null, selIdx = -1, selZone = -1, hintIdx = -1, bounds = null, camReady = false,
        zoneNames = zoneNamesIn || [];
    function P(x, y, z) {
      x += bx; y += by;
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
      if (!envs[key]) { envs[key] = buildEnv(key, order.indexOf(key)); applyInstallations(envs[key]); }
      return envs[key];
    }
    function applyInstallations(e){
      e.items=e.items.filter(function(it){return !it.installed;});
      var additions={
        'escuta-segura':['table',8.4,4.8,1.5,.8,.5,'#39b9a4',5],
        'protocolo-antassedio':['board',10.9,1.3,.6,.2,1,'#ffd24b',2],
        'psicoeducacao':['shelf',8.4,5.8,1.3,.4,1.2,'#9574cc',5],
        'clima-ventilacao':['plant',11.0,6.4,.5,.5,.45,'#abd9ee',5],
        'pausas':['sofa',4.6,5.2,1.8,.65,.45,'#3bba98',4],
        'papel-autonomia':['board',4.5,.6,1.4,.2,.85,'#54cad7',1],
        'lideranca':['table',8.5,.8,1.4,.75,.55,'#e8c777',2],
        'conflitos':['table',.7,5.0,1.4,.75,.55,'#6ac2a5',3],
        'comunicacao-mudancas':['board',5,4.6,1.5,.2,1,'#6a99d8',4],
        'apoio-retorno':['sofa',8.7,4.9,1.5,.65,.55,'#68c5a4',5]
      };
      inventory.forEach(function(id){var a=additions[id];if(a)e.items.push({t:a[0],x:a[1],y:a[2],w:a[3],d:a[4],h:a[5],c:a[6],z:a[7],installed:id});});
    }

    function resize() {
      var r = canvas.getBoundingClientRect();
      dpr = Math.min(2, global.devicePixelRatio || 1);
      cw = Math.max(1, r.width); ch = Math.max(1, r.height);
      canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
      if (worldCfg) { layoutWorld(camReady); render(); return; }
      var spanX = (W + D) * TW / 2, top = WALLH * ZU, bottom = (W + D) * TH / 2 + SLAB * ZU;
      s = Math.min(cw * 0.97 / spanX, ch * 0.97 / (top + bottom));
      ox = cw / 2 - ((W - D) * TW / 4) * s;
      oy = ch / 2 - ((bottom - top) / 2) * s;
      render();
    }

    /* --- cenário --- */
    function drawWalls(e) {
      var pal = e.pal, avg = (e.zh[0] + e.zh[1] + e.zh[2]) / 3, avgL = (e.zh[0] + e.zh[3]) / 2;
      var doors=connections.filter(function(c){return c.door.key===e.key;}).map(function(c){return c.door;});
      function wall(axis,length,color){
        var cuts=doors.filter(function(d){return d.axis===axis;}).map(function(d){return [Math.max(0,d.at-.62),Math.min(length,d.at+.62)];}).sort(function(a,b){return a[0]-b[0];});
        function face(a,b,z,h){if(b<=a)return;poly(axis==='y'?[P(a,0,z),P(b,0,z),P(b,0,h),P(a,0,h)]:[P(0,a,z),P(0,b,z),P(0,b,h),P(0,a,h)],color);}
        var start=0;cuts.forEach(function(c){face(start,c[0],0,WALLH);face(c[0],c[1],2.55,WALLH);var a=axis==='y'?P(c[0],0,0):P(0,c[0],0),b=axis==='y'?P(c[0],0,2.55):P(0,c[0],2.55),d=axis==='y'?P(c[1],0,2.55):P(0,c[1],2.55),f=axis==='y'?P(c[1],0,0):P(0,c[1],0);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.lineTo(d[0],d[1]);ctx.lineTo(f[0],f[1]);ctx.strokeStyle='#74d6e5';ctx.lineWidth=Math.max(1.5,2*s);ctx.stroke();start=c[1];});face(start,length,0,WALLH);
      }
      wall('y',W,tone(pal.wallR,0.3+0.7*avg,1));wall('x',D,tone(pal.wall,0.3+0.7*avgL,1));
      var i, hl;
      for (i = 0; i < 5; i++) {
        var x0 = 0.9 + i * 2.25;
        if(doors.some(function(d){return d.axis==='y'&&x0<d.at+.7&&x0+1.5>d.at-.7;}))continue;
        hl = e.zh[clamp(Math.floor(x0 / 4), 0, 2)];
        poly([P(x0, 0, 1.0), P(x0 + 1.5, 0, 1.0), P(x0 + 1.5, 0, 2.5), P(x0, 0, 2.5)], tone("#9bd8ff", hl, 1), "rgba(255,255,255,.25)", 1);
        ctx.beginPath(); var a = P(x0 + 0.75, 0, 1.0), b = P(x0 + 0.75, 0, 2.5);
        ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.strokeStyle = "rgba(255,255,255,.2)"; ctx.stroke();
      }
      for (i = 0; i < 3; i++) {
        var y0 = 0.9 + i * 2.4;
        if(doors.some(function(d){return d.axis==='x'&&y0<d.at+.7&&y0+1.5>d.at-.7;}))continue;
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
      if(sharedIndexMode){
        if(inventory.has('ergonomia')&&it.t==='desk'){w+=.22;h+=.12;c='#54b8b0';hl=Math.max(hl,.85);}
        if(inventory.has('clima-ventilacao'))hl=Math.max(hl,.78);
        if(inventory.has('apoio-retorno')&&it.t==='sofa'){c='#48b896';w+=.25;h+=.12;hl=.9;}
        if(inventory.has('psicoeducacao')&&(it.t==='shelf'||it.t==='board')){c='#a286e9';hl=.95;}
        if(inventory.has('espaco-seguro')&&it.t==='crate'){w*=.78;d*=.78;}
      }
      if (it.t === "desk") {
        // cadeira
        box(x + w * 0.35, y + d + 0.08, 0, 0.5, 0.5, 0.45, inventory.has('ergonomia')?'#229b8e':"#3b4f6b", hl);
        if(inventory.has('ergonomia'))box(x+w*.35,y+d+.48,.3,.5,.12,.5,'#229b8e',.95);
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
      var hz = p.transit ? .65 : e.zh[zoneOf(p.x, p.y)], hl = 0.2 + 0.8 * hz, u = ZU * s;
      var q = P(p.x, p.y, 0), fx = q[0], fy = q[1], sit = !!p.sit;
      var walking = !sit && p.moving;
      var bob = walking ? -Math.abs(Math.sin(p.phase)) * 0.07 * u : (sit && hz > 0.5 ? Math.sin(time * 7 + p.seed) * 0.012 * u : 0);
      var lean = (1 - hz) * 0.12 * u;
      ell(fx, fy, 0.26 * u, 0.11 * u, "rgba(0,0,0,.28)");
      var hipY = fy - (sit ? 0.42 : 0.62) * u + bob;
      var sprite = sharedIndexMode && !sit && p.npc >= 0 && npcSheets.length ? npcSheets[(p.sprite==null?p.npc+Math.max(0,order.indexOf(e.key)):p.sprite)%npcSheets.length] : null;
      if(!sprite){
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
      }else{
        var dx=p.vx==null?p.tx-p.x:p.vx,dy=p.vy==null?p.ty-p.y:p.vy;
        // Atlas row 0 faces screen-left/down (+Y), row 1 right/down (+X).
        if(p.moving&&Math.hypot(dx,dy)>.00001)p.facing=Math.abs(dx)>Math.abs(dy)?(dx>0?1:3):(dy>0?0:2);
        var frame=walking&&!isStatic?Math.floor(p.phase*1.4)%8:2;
        var sh=2.15*u,sw=sh*128/192;
        ctx.drawImage(sprite,frame*128,(p.facing||0)*192,128,192,fx-sw/2,fy-sh,sw,sh);
        hr=.16*u;hy=fy-1.83*u;
      }
      // balões de estado
      var cyc = (time * 0.35 + p.seed) % 5;
      if (hz < 0.35 && (cyc < 1.4 || isStatic && !sit && p.seed < 4)) {
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
        var target = e.tgt ? e.tgt[i] : (e.lit[i] ? 1 : 0);
        e.zh[i] += (target - e.zh[i]) * Math.min(1, dt * 2.2);
      }
      var walkers=e.people.filter(function(p){return !p.sit;}),positions=walkers.map(function(p){return p.progress;});
      for (i = 0; i < walkers.length; i++) {
        p = walkers[i];
        hz = e.zh[zoneOf(p.x, p.y)];
        if (p.wait > 0) { p.wait = Math.max(0,p.wait-dt); p.moving = false; continue; }
        var headway=AISLE_LENGTH;
        positions.forEach(function(d,j){if(j!==i){var gap=(d-positions[i]+AISLE_LENGTH)%AISLE_LENGTH;headway=Math.min(headway,gap);}});
        var sp=Math.min(p.speed*(.65+.35*hz)*dt,Math.max(0,headway-.65)),before=p.edge;
        var oldX=p.x,oldY=p.y;p.progress=(p.progress+sp)%AISLE_LENGTH;Object.assign(p,aislePoint(p.progress));p.vx=p.x-oldX;p.vy=p.y-oldY;p.moving=sp>.00001;p.phase+=sp*7;
        if(before!==p.edge&&e.rand()<.28)p.wait=.3+e.rand()*.9;
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

    function renderEnv(e, visitors) {
      drawWalls(e); drawFloor(e);
      var list = [];
      e.items.forEach(function (it) { list.push({ k: it.x + it.w / 2 + it.y + it.d / 2, f: function () { drawItem(it, e); } }); });
      e.people.forEach(function (p) { list.push({ k: p.x + p.y + (p.sit ? 0.02 : 0), f: function () { person(p, e); } }); });
      (visitors||[]).forEach(function(p){list.push({k:p.x+p.y,f:function(){person(p,e);}});});
      list.sort(function (a, b) { return a.k - b.k; });
      list.forEach(function (o) { o.f(); });
      effects(e);
    }

    /* ================= MODO MUNDO: vários ambientes, câmera e seleção ================= */
    var KMIN = 0.75, KMAX = 4.6;
    function lerp(a, b, t) { return a + (b - a) * t; }
    function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function avgH(e) { var t = 0; for (var i = 0; i < 6; i++) t += e.zh[i]; return t / 6; }
    function hcolor(h) { return h < 0.35 ? "#ef476f" : h < 0.5 ? "#ffd166" : "#4ade80"; }
    function tileUV(X, Y, z) { return [(X - Y) * TW / 2, (X + Y) * TH / 2 - (z || 0) * ZU]; }

    function worldBounds() {
      var b = { umin: 1e9, umax: -1e9, vmin: 1e9, vmax: -1e9 };
      worldCfg.forEach(function (c) {
        b.umin = Math.min(b.umin, (c.bx - (c.by + D)) * TW / 2);
        b.umax = Math.max(b.umax, ((c.bx + W) - c.by) * TW / 2);
        b.vmin = Math.min(b.vmin, (c.bx + c.by) * TH / 2 - WALLH * ZU - 50);
        b.vmax = Math.max(b.vmax, (c.bx + W + c.by + D) * TH / 2 + SLAB * ZU);
      });
      return b;
    }
    function applyCam() { s = s0 * cam.k; ox = cw / 2 - cam.cx * s; oy = ch / 2 - cam.cy * s; }
    function clampCam() {
      var mx = (bounds.umax - bounds.umin) * 0.12, my = (bounds.vmax - bounds.vmin) * 0.12;
      cam.k = clamp(cam.k, KMIN, KMAX);
      cam.cx = clamp(cam.cx, bounds.umin - mx, bounds.umax + mx);
      cam.cy = clamp(cam.cy, bounds.vmin - my, bounds.vmax + my);
    }
    function layoutWorld(keep) {
      bounds = worldBounds();
      var bw = bounds.umax - bounds.umin, bh = bounds.vmax - bounds.vmin;
      s0 = Math.min(cw * 0.94 / bw, ch * 0.94 / bh);
      home = { cx: (bounds.umin + bounds.umax) / 2, cy: (bounds.vmin + bounds.vmax) / 2, k: 1 };
      if (!keep || !camReady) { cam = { cx: home.cx, cy: home.cy, k: 1 }; camReady = true; }
      clampCam(); applyCam();
    }
    function viewFor(i, zone) {
      var c = worldCfg[i], bwid = (W + D) * TW / 2, bhei = (W + D) * TH / 2 + (WALLH + SLAB) * ZU + 50, uv, k;
      if (zone == null || zone < 0) {
        uv = tileUV(c.bx + W / 2, c.by + D / 2, 0.9);
        k = Math.min(cw * 0.92 / bwid, ch * 0.84 / bhei) / s0;
      } else {
        uv = tileUV(c.bx + 4 * (zone % 3) + 2, c.by + 4 * Math.floor(zone / 3) + 2, 1.0);
        k = Math.min(cw * 0.8 / (8 * TW / 2 + 90), ch * 0.72 / (8 * TH / 2 + 150)) / s0;
      }
      return { cx: uv[0], cy: uv[1], k: clamp(k, KMIN, KMAX) };
    }
    function flyTo(v, dur) {
      var t = { cx: v.cx, cy: v.cy, k: clamp(v.k, KMIN, KMAX) };
      if (!running || !dur) { anim = null; cam = t; clampCam(); applyCam(); render(); return; }
      anim = { from: { cx: cam.cx, cy: cam.cy, k: cam.k }, to: t, t: 0, dur: dur };
    }
    function stepCamera(dt) {
      if (!anim) return;
      anim.t += dt;
      var u = ease(Math.min(1, anim.t / anim.dur));
      cam.cx = lerp(anim.from.cx, anim.to.cx, u);
      cam.cy = lerp(anim.from.cy, anim.to.cy, u);
      cam.k = Math.exp(lerp(Math.log(anim.from.k), Math.log(anim.to.k), u));
      if (anim.t >= anim.dur) anim = null;
    }
    function pickAt(px, py) {
      if (!worldCfg) return null;
      applyCam();
      var u = cam.cx + (px - cw / 2) / s, v = cam.cy + (py - ch / 2) / s + 0.55 * ZU;
      var a = u / (TW / 2), b = v / (TH / 2), X = (a + b) / 2, Y = (b - a) / 2;
      for (var i = 0; i < worldCfg.length; i++) {
        var c = worldCfg[i], lx = X - c.bx, ly = Y - c.by;
        if (lx >= 0 && lx < W && ly >= 0 && ly < D) return { i: i, zone: zoneOf(lx, ly) };
      }
      return null;
    }

    function drawPlazas() {
      if(sharedIndexMode){
        var pts=[];worldCfg.forEach(function(c){[[c.bx-.7,c.by-.7],[c.bx+W+.7,c.by-.7],[c.bx+W+.7,c.by+D+.7],[c.bx-.7,c.by+D+.7]].forEach(function(p){pts.push(p);});});
        pts.sort(function(a,b){return a[0]-b[0]||a[1]-b[1];});
        function cross(o,a,b){return (a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);}
        var lower=[],upper=[];pts.forEach(function(p){while(lower.length>=2&&cross(lower[lower.length-2],lower[lower.length-1],p)<=0)lower.pop();lower.push(p);});pts.slice().reverse().forEach(function(p){while(upper.length>=2&&cross(upper[upper.length-2],upper[upper.length-1],p)<=0)upper.pop();upper.push(p);});
        lower.pop();upper.pop();var hull=lower.concat(upper);
        poly(hull.map(function(p){return P(p[0]+.2,p[1]+.2,-SLAB-.35);}), 'rgba(2,10,25,.4)');
        poly(hull.map(function(p){return P(p[0],p[1],-SLAB-.06);}), '#1b3548','rgba(116,214,229,.3)',Math.max(1,1.4*s));return;
      }
      worldCfg.forEach(function (c) {
        var h = avgH(c.env), z = -SLAB - 0.02, m = 1.4;
        poly([P(c.bx - m, c.by - m, z), P(c.bx + W + m, c.by - m, z), P(c.bx + W + m, c.by + D + m, z), P(c.bx - m, c.by + D + m, z)],
          "rgba(255,210,75," + (0.035 + 0.09 * h) + ")", "rgba(255,210,75," + (0.1 + 0.25 * h) + ")", Math.max(1, 1.4 * s));
        m = 0.6;
        poly([P(c.bx - m, c.by - m, z), P(c.bx + W + m, c.by - m, z), P(c.bx + W + m, c.by + D + m, z), P(c.bx - m, c.by + D + m, z)],
          "rgba(255,255,255,0.035)", null);
      });
    }
    function drawLinks() {
      ctx.save();
      connections.forEach(function(link){
        for(var i=1;i<link.points.length;i++){
          var a=link.points[i-1],b=link.points[i],horizontal=Math.abs(a.x-b.x)>.01,w=.6;
          var x=Math.min(a.x,b.x)-(horizontal?0:w),y=Math.min(a.y,b.y)-(horizontal?w:0),ww=horizontal?Math.abs(b.x-a.x):w*2,dd=horizontal?w*2:Math.abs(b.y-a.y);
          box(x,y,-SLAB,ww,dd,SLAB,'#426c7c',.9);
          var q=[P(x,y,.015),P(x+ww,y,.015),P(x+ww,y+dd,.015),P(x,y+dd,.015)];
          poly(q,'#365b70','rgba(116,214,229,.7)',Math.max(1,1.5*s));
          // Fixed walking markings: these are actual passages, not animated data lines.
          var n=Math.max(1,Math.floor(Math.hypot(b.x-a.x,b.y-a.y)/.6));
          for(var j=0;j<=n;j++){var t=j/n,cx=a.x+(b.x-a.x)*t,cy=a.y+(b.y-a.y)*t,p1=horizontal?P(cx,cy-.32,.02):P(cx-.32,cy,.02),p2=horizontal?P(cx,cy+.32,.02):P(cx+.32,cy,.02);ctx.beginPath();ctx.moveTo(p1[0],p1[1]);ctx.lineTo(p2[0],p2[1]);ctx.strokeStyle='rgba(197,238,240,.4)';ctx.lineWidth=Math.max(1,s);ctx.stroke();}
        }
      });
      ctx.restore();
    }
    function resetCommuters(){
      var prior=commuters;
      commuters=connections.map(function(link,i){
        var points=link.points.concat(link.points.slice(0,-1).reverse()),length=0;
        for(var j=1;j<points.length;j++)length+=Math.hypot(points[j].x-points[j-1].x,points[j].y-points[j-1].y);
        var old=prior.find(function(p){return p.from===link.from&&p.to===link.to;}),model=getEnv(link.from).people.find(function(p){return p.npc===i%3;});
        return Object.assign({},model,{from:link.from,to:link.to,points:points,length:length,distance:old?old.distance/old.length*length:length*(.15+i*.27),phase:old?old.phase:0,wait:old?old.wait:0,npc:i%3,sprite:i%3,transit:true,moving:false});
      });
      commuters.forEach(placeCommuter);
    }
    function placeCommuter(p){
      var d=p.distance;
      for(var i=1;i<p.points.length;i++){var a=p.points[i-1],b=p.points[i],length=Math.hypot(b.x-a.x,b.y-a.y);if(d<=length){p.x=a.x+(b.x-a.x)*d/length;p.y=a.y+(b.y-a.y)*d/length;p.tx=b.x;p.ty=b.y;p.edge=i;return;}d-=length;}
    }
    function stepCommuters(dt){
      commuters.forEach(function(p){
        if(p.wait>0){p.wait=Math.max(0,p.wait-dt);p.moving=false;return;}
        var oldX=p.x,oldY=p.y,half=p.length/2,old=p.distance,move=dt*.95;
        // Stop inside the entrance before turning, never teleport to the other side.
        var target=old<half?half:p.length;move=Math.min(move,target-old);p.distance=old+move;p.phase+=move*7;p.moving=move>0;
        placeCommuter(p);p.vx=p.x-oldX;p.vy=p.y-oldY;
        if(p.distance>=target-.000001){p.wait=1.2+(p.sprite*.4);if(target===p.length)p.distance=0;}
      });
    }
    function pill(x, y, text, o) {
      ctx.font = "800 " + o.fs + "px Inter,system-ui,sans-serif";
      var tw = ctx.measureText(text).width, padX = 11, dotW = o.dot ? 15 : 0, h = o.fs + 13, w = tw + padX * 2 + dotW;
      rr(x - w / 2, y - h / 2, w, h, h / 2);
      ctx.fillStyle = o.bg || "rgba(8,14,30,.88)"; ctx.fill();
      ctx.lineWidth = 1.6; ctx.strokeStyle = o.border || "rgba(255,255,255,.2)"; ctx.stroke();
      if (o.dot) { ctx.beginPath(); ctx.arc(x - w / 2 + padX + 4, y, 4.5, 0, 7); ctx.fillStyle = o.dot; ctx.fill(); }
      ctx.fillStyle = o.color || "#f4f6fb"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(text, x - w / 2 + padX + dotW, y + 0.5);
    }
    function drawOverlay() {
      var i, z, c, e;
      for (i = 0; i < worldCfg.length; i++) {
        c = worldCfg[i]; e = c.env;
        var isSel = i === selIdx, isHov = !!hoverHit && hoverHit.i === i;
        if (isSel || (isHov && selIdx < 0)) {
          ctx.save();
          ctx.shadowColor = isSel ? "rgba(255,210,75,.95)" : "rgba(255,255,255,.7)"; ctx.shadowBlur = 16;
          poly([P(c.bx, c.by, 0), P(c.bx + W, c.by, 0), P(c.bx + W, c.by + D, 0), P(c.bx, c.by + D, 0)], null,
            isSel ? "#ffd24b" : "rgba(255,255,255,.9)", Math.max(2, 3 * s));
          ctx.restore();
        }
        var showM = isSel || cam.k > 1.7;
        for (z = 0; z < 6; z++) {
          var h = e.zh[z], isZ = isSel && selZone === z, isZh = isSel && !!hoverHit && hoverHit.i === i && hoverHit.zone === z;
          if (isZ || isZh) {
            var zx = c.bx + 4 * (z % 3) + 0.3, zy = c.by + 4 * Math.floor(z / 3) + 0.3;
            ctx.save(); ctx.shadowColor = colors[z]; ctx.shadowBlur = isZ ? 14 : 8;
            poly([P(zx, zy, 0.02), P(zx + 3.4, zy, 0.02), P(zx + 3.4, zy + 3.4, 0.02), P(zx, zy + 3.4, 0.02)],
              isZ ? rgba(colors[z], 0.12 + 0.06 * Math.sin(time * 4)) : null, isZ ? colors[z] : "rgba(255,255,255,.85)", Math.max(2, 2.6 * s));
            ctx.restore();
          }
          if (!showM) continue;
          var zc = P(c.bx + 4 * (z % 3) + 2, c.by + 4 * Math.floor(z / 3) + 2, 2.5), r = clamp(9 + cam.k * 3, 11, 17);
          ctx.beginPath(); ctx.arc(zc[0], zc[1], r + 3.5, 0, 7); ctx.fillStyle = "rgba(8,14,30,.9)"; ctx.fill();
          ctx.beginPath(); ctx.arc(zc[0], zc[1], r + 1.5, 0, 7); ctx.lineWidth = 3; ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.stroke();
          ctx.beginPath(); ctx.arc(zc[0], zc[1], r + 1.5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp(h, 0.03, 1));
          ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.strokeStyle = colors[z]; ctx.stroke();
          ctx.beginPath(); ctx.arc(zc[0], zc[1], r - 2, 0, 7); ctx.fillStyle = tone(colors[z], h, 1); ctx.fill();
          ctx.fillStyle = "#fff"; ctx.font = "900 " + Math.round(r * 0.86) + "px Inter,system-ui,sans-serif";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.save(); ctx.shadowColor = "rgba(0,0,0,.7)"; ctx.shadowBlur = 3; ctx.fillText(sharedIndexMode ? String(z + 1) : String(Math.round(h * 100)), zc[0], zc[1] + 0.5); ctx.restore();
          if ((isZ || isZh || cam.k > 2.7) && zoneNames[z]) {
            pill(zc[0], zc[1] + r + 15, zoneNames[z], { fs: 11, border: colors[z] });
          }
        }
        var lp = P(c.bx + W / 2, c.by, WALLH + 0.8), ah = avgH(e);
        pill(lp[0], lp[1], c.name + (sharedIndexMode ? "" : "  " + Math.round(ah * 100) + "%"), {
          fs: clamp(11 + cam.k * 1.2, 12, 15), dot: hcolor(ah), border: isSel ? "#ffd24b" : isHov ? "#fff" : null
        });
        if (i === hintIdx && selIdx < 0) {
          var by0 = lp[1] - 34 - Math.abs(Math.sin(time * 3.2)) * 7;
          pill(lp[0], by0, "Comece por aqui", { fs: 12, bg: "#ffd24b", color: "#1a1400", border: "#fff3a0" });
          ctx.beginPath(); ctx.moveTo(lp[0] - 6, by0 + 14); ctx.lineTo(lp[0] + 6, by0 + 14); ctx.lineTo(lp[0], by0 + 21); ctx.closePath();
          ctx.fillStyle = "#ffd24b"; ctx.fill();
        }
      }
    }
    function renderWorld() {
      applyCam();
      drawPlazas(); drawLinks();
      var visitors={};worldCfg.forEach(function(c){visitors[c.key]=[];});
      commuters.forEach(function(p){
        var owner=worldCfg.find(function(c){return p.x>=c.bx&&p.x<=c.bx+W&&p.y>=c.by&&p.y<=c.by+D;});
        if(!owner)owner=worldCfg.filter(function(c){return c.key===p.from||c.key===p.to;}).sort(function(a,b){return Math.hypot(p.x-a.bx-W/2,p.y-a.by-D/2)-Math.hypot(p.x-b.bx-W/2,p.y-b.by-D/2);})[0];
        visitors[owner.key].push(Object.assign({},p,{x:p.x-owner.bx,y:p.y-owner.by,tx:p.tx-owner.bx,ty:p.ty-owner.by}));
      });
      worldCfg.map(function (c) { return c; }).sort(function (a, b) { return (a.bx + a.by) - (b.bx + b.by); })
        .forEach(function (c) { bx = c.bx; by = c.by; renderEnv(c.env,visitors[c.key]); });
      bx = 0; by = 0;
      drawOverlay();
    }
    function render() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      if (worldCfg) { renderWorld(); return; }
      if (!env) return;
      bx = 0; by = 0;
      renderEnv(env);
    }

    function loop(ts) {
      if (!running) return;
      var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016;
      last = ts; time += dt;
      if (worldCfg) { stepCamera(dt); worldCfg.forEach(function (c) { step(c.env, dt); }); stepCommuters(dt); } else step(env, dt);
      render();
      raf = global.requestAnimationFrame(loop);
    }

    return {
      setSharedIndexMode: function (value) { sharedIndexMode = !!value; render(); },
      setInventory:function(ids){if(JSON.stringify(Array.from(inventory))===JSON.stringify(ids))return;inventory=new Set(ids);Object.keys(envs).forEach(function(k){applyInstallations(envs[k]);});if(!running)render();},
      setNpcSheets:function(sheets){npcSheets=sheets;render();},
      resize: resize,
      setWorld: function (defs, names) {
        worldCfg = defs.map(function (d) { return { key: d.key, name: d.name, bx: d.bx, by: d.by, env: getEnv(d.key) }; });
        connections=companyConnections(worldCfg);resetCommuters();
        if (names) zoneNames = names;
        camReady = false; if (cw > 1) layoutWorld(false); render();
      },
      setHealth: function (key, zone, v, immediate) {
        var e = getEnv(key); e.tgt[zone] = clamp(v, 0, 1);
        if (immediate || isStatic) e.zh[zone] = e.tgt[zone];
        if (!running) render();
      },
      getHealth: function (key, zone) { return getEnv(key).zh[zone]; },
      wave: function (key, zone) { if (!isStatic) getEnv(key).waves.push({ i: zone, t: time }); },
      pick: pickAt,
      setHover: function (h) { hoverHit = h; if (!running) render(); },
      setSelection: function (i, zone) { selIdx = i; selZone = zone == null ? -1 : zone; if (!running) render(); },
      setHint: function (i) { hintIdx = i; if (!running) render(); },
      focus: function (i, zone, dur) { flyTo(viewFor(i, zone), dur == null ? 0.9 : dur); },
      home: function (dur) { flyTo(home, dur == null ? 0.9 : dur); },
      panBy: function (dx, dy) { anim = null; cam.cx -= dx / s; cam.cy -= dy / s; clampCam(); applyCam(); if (!running) render(); },
      zoomAt: function (px, py, f) {
        anim = null;
        var u = cam.cx + (px - cw / 2) / s, v = cam.cy + (py - ch / 2) / s;
        cam.k = clamp(cam.k * f, KMIN, KMAX); s = s0 * cam.k;
        cam.cx = u - (px - cw / 2) / s; cam.cy = v - (py - ch / 2) / s;
        clampCam(); applyCam(); if (!running) render();
      },
      getZoom: function () { return cam.k; },
      getCirculation: function(){return {connections:connections.map(function(c){return {from:c.from,to:c.to,door:Object.assign({},c.door),points:c.points.map(function(p){return Object.assign({},p);})};}),commuters:commuters.map(function(p){return {from:p.from,to:p.to,x:p.x,y:p.y,moving:p.moving,phase:p.phase};})};},
      render: render,
      setEnv: function (key) { env = getEnv(key); if (isStatic) { for (var i = 0; i < 6; i++) env.zh[i] = env.lit[i] ? 1 : 0; } render(); },
      getEnv: getEnv,
      setStatic: function (v) { isStatic = !!v; },
      light: function (i) {
        env.lit[i] = true; env.tgt[i] = 1;
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

  global.PilhaIso = { create: create, navigation: {aisle:AISLE, length:AISLE_LENGTH, point:aislePoint, connections:companyConnections} };
})(typeof window !== "undefined" ? window : this);
