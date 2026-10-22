/* PilhA+ Game — Camada 2: Mapa da empresa (JS puro, sem dependências).
 * Requer pilha-iso.js (motor isométrico) e pilha-mapa.css.
 *
 * Uso:
 *   PilhaMapa.mount({ onReady: function (api) {}, onReplayIntro: function () {} });
 *
 * Economia: todo jogador começa com 10.000 moedas (START_BALANCE).
 * Cada melhoria tem 3 níveis; cada nível custa mais e rende menos (EFF/COSTM).
 * O índice de cada setor é a média dos 6 fatores psicossociais (0–100).
 */
(function (global) {
  "use strict";

  var START_BALANCE = 10000;
  var GOAL_COMPANY = 45;  // meta da fase 1: índice da empresa
  var GOAL_SECTOR = 50;   // setor considerado "recuperado"
  var EFF = [1.4, 1.12, 0.84];   // fração do efeito base por nível (1º, 2º, 3º)
  var COSTM = [1, 1.4, 1.9];     // multiplicador do custo por nível
  var KEY = "pilha-mapa-v1";

  // Os 6 fatores psicossociais (um por zona do setor, na mesma ordem do motor isométrico).
  var FACTORS = [
    { id: "carga", nome: "Ritmo e carga",         cor: "#ffd166" },
    { id: "auton", nome: "Autonomia",             cor: "#48cae4" },
    { id: "relac", nome: "Relações",              cor: "#52b788" },
    { id: "lider", nome: "Liderança",             cor: "#f4a261" },
    { id: "recon", nome: "Reconhecimento",        cor: "#9b5de5" },
    { id: "seg",   nome: "Segurança psicológica", cor: "#e63946" }
  ];
  var CATS = ["Todos", "Saúde Mental", "Trabalho", "Ambiente", "Liderança", "Condições"];

  // As 12 melhorias do mock-up. f = pontos base por fator; o = o que muda em cada setor.
  var CATALOG = [
    { id: "seg",  n: "Segurança Psicológica", d: "Ambiente de confiança e escuta.", cat: "Saúde Mental", c: 900,  f: { seg: 18, relac: 4 },
      o: { escritorio: "Rituais de escuta nas equipes", producao: "Canal seguro de relato", atendimento: "Espaço de apoio pós-ligação" } },
    { id: "asse", n: "Prevenção ao Assédio", d: "Respeito e diversidade.", cat: "Saúde Mental", c: 1400, f: { seg: 10, relac: 10, lider: 4 },
      o: { escritorio: "Política e canal de denúncia", producao: "Respeito no turno e na linha", atendimento: "Protocolo contra clientes abusivos" } },
    { id: "psic", n: "Psicoeducação", d: "Conhecimento que protege.", cat: "Saúde Mental", c: 1100, f: { seg: 6, relac: 4, carga: 4 },
      o: { escritorio: "Oficinas de bem-estar", producao: "Diálogo de segurança (DDS)", atendimento: "Treino de manejo emocional" } },
    { id: "ergo", n: "Ergonomia", d: "Conforto e produtividade.", cat: "Ambiente", c: 1800, f: { carga: 12 },
      o: { escritorio: "Mesas e cadeiras ajustáveis", producao: "Bancadas e postos de trabalho", atendimento: "Estações e headsets" } },
    { id: "fisi", n: "Condições Físicas", d: "Ar, luz e temperatura ideais.", cat: "Condições", c: 2600, f: { carga: 8, relac: 4 },
      o: { escritorio: "Climatização e iluminação", producao: "Ventilação e luz da linha", atendimento: "Acústica e climatização" } },
    { id: "espa", n: "Espaço e Confinamento", d: "Circulação segura e acesso.", cat: "Condições", c: 2600, f: { seg: 8, carga: 6 },
      o: { escritorio: "Layout e circulação", producao: "Corredores e sinalização", atendimento: "Cabines e privacidade" } },
    { id: "jorn", n: "Carga e Jornada", d: "Equilíbrio e pausas reais.", cat: "Trabalho", c: 1200, f: { carga: 20 },
      o: { escritorio: "Metas e prazos realistas", producao: "Escala de turnos e pausas", atendimento: "Fila, TMA e pausas" } },
    { id: "auto", n: "Autonomia e Papéis", d: "Clareza e propósito.", cat: "Trabalho", c: 1000, f: { auton: 20, recon: 4 },
      o: { escritorio: "Alçadas e papéis claros", producao: "Autonomia para parar a linha", atendimento: "Flexibilidade no roteiro" } },
    { id: "lide", n: "Liderança", d: "Decisões mais justas.", cat: "Liderança", c: 1500, f: { lider: 18, recon: 8 },
      o: { escritorio: "Formação de gestores", producao: "Supervisão que escuta", atendimento: "Feedback e coaching de líderes" } },
    { id: "rela", n: "Relações e Conflitos", d: "Diálogo e cooperação.", cat: "Trabalho", c: 950,  f: { relac: 20 },
      o: { escritorio: "Rituais entre áreas", producao: "Passagem de turno estruturada", atendimento: "Apoio entre pares" } },
    { id: "muda", n: "Mudanças", d: "Comunicação e participação.", cat: "Liderança", c: 850,  f: { recon: 12, auton: 6 },
      o: { escritorio: "Comunicação de mudanças", producao: "Participação na melhoria contínua", atendimento: "Escuta antes de novos processos" } },
    { id: "apoi", n: "Apoio e Recuperação", d: "Voltar bem é possível.", cat: "Saúde Mental", c: 1300, f: { seg: 8, carga: 6, recon: 4 },
      o: { escritorio: "Acolhimento e retorno gradual", producao: "Retorno seguro pós-afastamento", atendimento: "Pausa e suporte psicológico" } }
  ];

  var SECTORS = [
    { id: "escritorio", nome: "Escritório", desc: "Prazos que se acumulam e decisões que demoram.",
      base: { carga: 28, auton: 42, relac: 35, lider: 40, recon: 30, seg: 26 },
      sint: [
        "Prazos que se acumulam na mesma semana e e-mails que não param: o cansaço vira rotina.",
        "Aprovações em cadeia para tarefas simples: ninguém decide e tudo demora.",
        "Setores que só se falam por e-mail e conflitos que ficam sem resposta.",
        "A porta da gestão fica fechada e as dúvidas viram boatos.",
        "Entregas boas passam sem comentário: o esforço ninguém vê.",
        "Errar vira motivo de exposição, então ninguém levanta a mão para pedir ajuda."
      ] },
    { id: "producao", nome: "Produção", desc: "Metas de turno altas e riscos escondidos.",
      base: { carga: 22, auton: 30, relac: 40, lider: 33, recon: 35, seg: 24 },
      sint: [
        "Metas de turno que sobem sem reforçar a equipe: pausas encurtadas e fadiga no fim do dia.",
        "O operador vê o problema na linha, mas precisa esperar autorização para parar.",
        "Turnos que não passam informação um ao outro: as mesmas falhas se repetem.",
        "Supervisão que cobra números, mas não escuta o chão de fábrica.",
        "Quem evita um acidente ou melhora o processo não é lembrado.",
        "Relatar um quase acidente gera culpa, então os riscos ficam escondidos."
      ] },
    { id: "atendimento", nome: "Atendimento", desc: "Fila que não zera e pouco tempo para respirar.",
      base: { carga: 24, auton: 28, relac: 32, lider: 36, recon: 38, seg: 30 },
      sint: [
        "Fila que não zera, ligação cronometrada e pouco intervalo entre atendimentos.",
        "Roteiro rígido: a pessoa não pode resolver o problema do cliente do jeito certo.",
        "Clientes agressivos e equipe sem espaço para se apoiar depois da ligação.",
        "Feedback só quando a meta cai: ninguém pergunta como a equipe está.",
        "O cliente elogia, mas o elogio nunca chega a quem atendeu.",
        "Pedir pausa depois de uma ligação difícil é visto como fraqueza."
      ] }
  ];

  var AVATARS = [
    { bg: "#1c3a78", skin: "#f1c27d", shirt: "#118ab2", hair: "#2b1d0e" },
    { bg: "#5a1f3d", skin: "#c68642", shirt: "#ef476f", hair: "#111827" },
    { bg: "#1f4a3d", skin: "#8d5524", shirt: "#06d6a0", hair: "#111827" },
    { bg: "#3a2a6b", skin: "#ffdbac", shirt: "#9b5de5", hair: "#a16207" }
  ];

  var ZERO = {};
  SECTORS.forEach(function (s) { ZERO[s.id] = {}; CATALOG.forEach(function (c) { ZERO[s.id][c.id] = 0; }); });
  var SEC = {}; SECTORS.forEach(function (s, i) { s.i = i; SEC[s.id] = s; });
  var CAT = {}; CATALOG.forEach(function (c, i) { c.i = i; CAT[c.id] = c; });

  var LAYOUTS = {
    wide: { escritorio: [0, 0], producao: [14, 0], atendimento: [0, 10] },
    tall: { escritorio: [0, 0], producao: [10, 10], atendimento: [20, 20] }
  };

  /* ---------- utilidades ---------- */
  function fmt(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function dec(n) { return (Math.round(n * 10) / 10).toFixed(1).replace(".", ","); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  function hcolor(h) { return h < 35 ? "#ef476f" : h < GOAL_SECTOR ? "#ffd166" : "#4ade80"; }
  function price(c, l) { return Math.round(c.c * COSTM[l] / 50) * 50; }
  function avatar(i) {
    var a = AVATARS[i % AVATARS.length];
    return '<svg viewBox="0 0 44 44" aria-hidden="true"><rect width="44" height="44" fill="' + a.bg + '"/>' +
      '<path d="M5 44c1-10 8-15 17-15s16 5 17 15z" fill="' + a.shirt + '"/>' +
      '<circle cx="22" cy="19" r="8" fill="' + a.skin + '"/>' +
      '<path d="M13.5 18a8.5 8.5 0 0 1 17 0c-3-3-6-4-8.5-4s-5.5 1-8.5 4z" fill="' + a.hair + '"/></svg>';
  }

  /* ---------- modelo do jogo ---------- */
  function freshState() {
    var lv = {}; SECTORS.forEach(function (s) { lv[s.id] = {}; CATALOG.forEach(function (c) { lv[s.id][c.id] = 0; }); });
    return { v: 1, balance: START_BALANCE, lv: lv, coach: false, flags: {} };
  }
  function loadState() {
    try {
      var raw = global.localStorage.getItem(KEY);
      if (!raw) return freshState();
      var s = JSON.parse(raw), f = freshState();
      if (!s || s.v !== 1 || typeof s.balance !== "number") return f;
      SECTORS.forEach(function (sec) { CATALOG.forEach(function (c) {
        var l = s.lv && s.lv[sec.id] && s.lv[sec.id][c.id]; f.lv[sec.id][c.id] = (l >= 0 && l <= 3) ? l | 0 : 0;
      }); });
      f.balance = Math.max(0, Math.min(START_BALANCE, s.balance)); f.coach = !!s.coach; f.flags = s.flags || {};
      return f;
    } catch (e) { return freshState(); }
  }
  function saveState(st) { try { global.localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* sem armazenamento */ } }

  function fval(st, sid, fid, lvMap) {
    if(st.visual && st.visual[sid]) return st.visual[sid][fid];
    if (Number.isFinite(st.sharedIndex)) return st.sharedIndex;
    var v = SEC[sid].base[fid], lv = (lvMap || st.lv)[sid];
    CATALOG.forEach(function (c) { var l = lv[c.id]; for (var k = 0; k < l; k++) v += (c.f[fid] || 0) * EFF[k]; });
    return Math.min(100, v);
  }
  function health(st, sid, lvMap) {
    var t = 0; FACTORS.forEach(function (f) { t += fval(st, sid, f.id, lvMap); }); return t / FACTORS.length;
  }
  function inds(st, sid, lvMap) {
    var f = function (id) { return fval(st, sid, id, lvMap); }, h = health(st, sid, lvMap);
    return {
      estresse: 100 - (f("carga") * 0.4 + f("auton") * 0.3 + f("lider") * 0.3),
      abs: 2 + (100 - h) * 0.12,
      clima: (f("relac") + f("recon") + f("seg")) / 3,
      prod: 40 + h * 0.6
    };
  }
  function companyHealth(st) { var t = 0; SECTORS.forEach(function (s) { t += health(st, s.id); }); return t / SECTORS.length; }
  function gains(st, sid, c, l) {
    var out = [];
    FACTORS.forEach(function (fa, z) {
      var g = (c.f[fa.id] || 0) * EFF[l];
      if (g > 0) { var cur = fval(st, sid, fa.id); out.push({ z: z, f: fa, g: Math.round(Math.min(100, cur + g) - cur) }); }
    });
    return out;
  }

  /* ---------- montagem ---------- */
  function mount(userOpts) {
    var o = Object.assign({ container: null, onReady: null, onReplayIntro: null }, userOpts || {});
    var host = o.container || document.body;
    var reduce = !!(global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches);
    var st = o.model ? o.model.read() : loadState();
    var sel = -1, selZone = -1, catFilter = "Todos", flashId = null, shownBal = st.balance, alerted = false;
    var timers = [], curTall = null, lastW = 0, lastH = 0, resetArmed = false, balRaf = 0;

    var root = document.createElement("div");
    root.className = "pm-root";
    root.setAttribute("role", "region");
    root.setAttribute("aria-label", "Mapa da empresa PilhA+");
    root.innerHTML =
      '<div class="pm-stage">' +
        '<header class="pm-hud">' +
          '<div class="pm-brand">PilhA<b>+</b> Game<small>Mapa da empresa</small></div>' +
          '<div class="pm-hud__mid">' +
            '<div class="pm-goal"><div class="pm-goal__top"><span>Índice da empresa · meta ' + GOAL_COMPANY + '</span><b class="pm-goal__v">0</b></div>' +
              '<div class="pm-goal__bar"><i></i><u style="--t:' + GOAL_COMPANY + '%"></u></div></div>' +
            '<div class="pm-balance" role="status" aria-live="polite"><span class="pm-coin"></span>' +
              '<span class="pm-balance__txt"><small>Saldo</small><b class="pm-bal">' + fmt(st.balance) + '</b></span></div>' +
            '<button type="button" class="pm-reset">Reiniciar</button>' +
            (o.onReplayIntro ? '<button type="button" class="pm-reset pm-replay">Rever abertura</button>' : '') +
          '</div>' +
        '</header>' +
        '<nav class="pm-tabs" aria-label="Setores da empresa">' +
          '<button type="button" class="pm-tab" data-i="-1" aria-pressed="true">Visão geral</button>' +
          SECTORS.map(function (s) {
            return '<button type="button" class="pm-tab" data-i="' + s.i + '" aria-pressed="false"><i></i>' + esc(s.nome) + ' <em></em></button>';
          }).join("") +
        '</nav>' +
        '<div class="pm-view">' +
          '<canvas class="pm-canvas" role="img" aria-label="Mapa isométrico da empresa com três setores: Escritório, Produção e Atendimento. Use as abas acima para escolher um setor."></canvas>' +
          '<div class="pm-zoom">' +
            '<button type="button" data-z="in" aria-label="Aproximar">+</button>' +
            '<button type="button" data-z="out" aria-label="Afastar">−</button>' +
            '<button type="button" data-z="home" aria-label="Visão geral"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button>' +
          '</div>' +
          '<div class="pm-legend" aria-hidden="true"><span><i style="background:#ef476f"></i>Crítico</span><span><i style="background:#ffd166"></i>Atenção</span><span><i style="background:#4ade80"></i>Recuperado</span></div>' +
          '<div class="pm-toasts" aria-live="polite"></div>' +
        '</div>' +
      '</div>' +
      '<aside class="pm-panel" aria-label="Diagnóstico e melhorias do setor"><div class="pm-ph"></div><div class="pm-scroll"></div></aside>';
    host.appendChild(root);

    var stage = root.querySelector(".pm-stage"), view = root.querySelector(".pm-view"), canvas = root.querySelector(".pm-canvas");
    var tabs = [].slice.call(root.querySelectorAll(".pm-tab")), toasts = root.querySelector(".pm-toasts");
    var balBox = root.querySelector(".pm-balance"), balEl = root.querySelector(".pm-bal");
    var goalV = root.querySelector(".pm-goal__v"), goalBar = root.querySelector(".pm-goal__bar i");
    var panel = root.querySelector(".pm-panel"), ph = root.querySelector(".pm-ph"), sc = root.querySelector(".pm-scroll");

    if (o.model) {
      root.querySelector(".pm-reset").hidden = true;
      root.querySelector(".pm-goal__top span").textContent = "Índice do ciclo · compartilhado";
      root.querySelector(".pm-goal__bar u").hidden = true;
      root.querySelector(".pm-legend").textContent = "Cenário ilustrativo · índices sintéticos";
      balEl.setAttribute("aria-live", "polite");
    }
    var iso = global.PilhaIso.create(canvas, FACTORS.map(function (f) { return f.cor; }), FACTORS.map(function (f) { return f.nome; }));
    iso.setSharedIndexMode(!!o.model);
    iso.setStatic(reduce);

    function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }

    /* --- motor <-> estado --- */
    function layoutDefs(tall) {
      var L = tall ? LAYOUTS.tall : LAYOUTS.wide;
      return SECTORS.map(function (s) { return { key: s.id, name: s.nome, bx: L[s.id][0], by: L[s.id][1] }; });
    }
    function syncEngine(sid, immediate) {
      if(o.model)iso.setInventory(st.owned||[]);
      FACTORS.forEach(function (f, z) { iso.setHealth(sid, z, fval(st, sid, f.id) / 100, immediate); });
    }
    function sickest() {
      var b = 0; SECTORS.forEach(function (s, i) { if (health(st, s.id) < health(st, SECTORS[b].id)) b = i; }); return b;
    }
    function refocus(dur) {
      if (sel >= 0) iso.focus(sel, selZone, dur); else iso.home(dur);
    }
    function fit(force) {
      var w = view.clientWidth, h = view.clientHeight;
      if (!force && Math.abs(w - lastW) < 2 && Math.abs(h - lastH) < 2) return;
      lastW = w; lastH = h;
      var tall = root.clientHeight > root.clientWidth * 1.05;
      if (tall !== curTall) { curTall = tall; iso.setWorld(layoutDefs(tall), FACTORS.map(function (f) { return f.nome; })); iso.resize(); refocus(0); return; }
      iso.resize(); refocus(reduce ? 0 : .55);
    }

    /* --- HUD --- */
    function setBalance(to, animate) {
      var from = shownBal; shownBal = to;
      if (balRaf) cancelAnimationFrame(balRaf);
      if (!animate || reduce) { balEl.textContent = fmt(to); return; }
      var t0 = performance.now();
      (function step(t) {
        var u = Math.min(1, (t - t0) / 650);
        balEl.textContent = fmt(from + (to - from) * (1 - Math.pow(1 - u, 3)));
        if (u < 1) balRaf = requestAnimationFrame(step);
      })(t0);
      balBox.classList.remove("is-bump"); void balBox.offsetWidth; balBox.classList.add("is-bump");
    }
    function updateHud() {
      var c = Math.round(o.model ? st.sharedIndex : companyHealth(st));
      goalV.textContent = c; goalBar.style.setProperty("--p", c + "%");
      tabs.forEach(function (t) {
        var i = +t.getAttribute("data-i");
        t.setAttribute("aria-pressed", String(i === sel));
        if (i >= 0) {
          var h = health(st, SECTORS[i].id);
          t.querySelector("em").textContent = o.model ? (st.owned.length ? '· em melhoria' : '· observar') : Math.round(h) + '%';
          t.querySelector("i").style.setProperty("--c", hcolor(h));
        }
      });
      if (sel < 0) tabs[0].setAttribute("aria-pressed", "true");
      var act = tabs[sel + 1], nav = act && act.parentNode;
      if (nav && nav.scrollWidth > nav.clientWidth + 2) {
        var left = Math.max(0, act.offsetLeft - (nav.clientWidth - act.offsetWidth) / 2);
        if (nav.scrollTo) nav.scrollTo({ left: left, behavior: reduce ? "auto" : "smooth" }); else nav.scrollLeft = left;
      }
    }

    /* --- painel --- */
    function delta(now, was, lowerIsBetter, suffix, d1) {
      var d = now - was; if (Math.abs(d) < 0.5 && !d1) return "";
      if (d1 && Math.abs(d) < 0.05) return "";
      var good = lowerIsBetter ? d < 0 : d > 0, sign = d > 0 ? "▲" : "▼";
      return '<em class="' + (good ? "pm-up" : "pm-down") + '">' + sign + " " + (d1 ? dec(Math.abs(d)) : Math.round(Math.abs(d))) + (suffix || "") + "</em>";
    }
    function renderHead() {
      if (sel < 0) { ph.innerHTML = ""; return; }
      if (o.model) { ph.innerHTML = o.model.head(SECTORS[sel], st); return; }
      var s = SECTORS[sel], h = health(st, s.id), i1 = inds(st, s.id), i0 = inds(st, s.id, ZERO);
      var done = h >= GOAL_SECTOR, falta = Math.max(0, Math.ceil(GOAL_SECTOR - h));
      ph.innerHTML =
        '<div class="pm-ph__row"><span class="pm-ph__dot" style="background:' + hcolor(h) + '"></span><h2>' + esc(s.nome) + '</h2>' +
        '<button type="button" class="pm-x" data-act="close" aria-label="Fechar painel e voltar à visão geral">✕</button></div>' +
        '<p>' + esc(s.desc) + '</p>' +
        '<div class="pm-score"><div class="pm-ring" style="--p:' + Math.round(h) + ';--rc:' + hcolor(h) + '"><div><b>' + Math.round(h) + '</b><small>Índice</small></div></div>' +
        '<div class="pm-kpis">' +
          '<div class="pm-kpi"><small>Estresse</small><b>' + Math.round(i1.estresse) + '%</b>' + delta(i1.estresse, i0.estresse, true, "") + '</div>' +
          '<div class="pm-kpi"><small>Absenteísmo</small><b>' + dec(i1.abs) + '%</b>' + delta(i1.abs, i0.abs, true, "", true) + '</div>' +
          '<div class="pm-kpi"><small>Clima</small><b>' + Math.round(i1.clima) + '</b>' + delta(i1.clima, i0.clima, false, "") + '</div>' +
          '<div class="pm-kpi"><small>Produtividade</small><b>' + Math.round(i1.prod) + '</b>' + delta(i1.prod, i0.prod, false, "") + '</div>' +
        '</div></div>' +
        '<div class="pm-sgoal' + (done ? " is-done" : "") + '"><span>' + (done ? "Setor recuperado ✓" : "Meta do setor: " + GOAL_SECTOR + " (faltam " + falta + ")") + '</span>' +
        '<div class="pm-goal__bar"><i style="--p:' + Math.min(100, h / GOAL_SECTOR * 100) + '%"></i></div></div>';
    }
    function renderBody() {
      if (sel < 0) { sc.innerHTML = ""; return; }
      if (o.model) { var scroll = sc.scrollTop; sc.innerHTML = o.model.body(SECTORS[sel], st); sc.scrollTop = scroll; return; }
      var s = SECTORS[sel], top = sc.scrollTop, html = "";
      html += '<section class="pm-sec"><h3>Fatores psicossociais <span>· toque para examinar a área</span></h3><div class="pm-factors">';
      FACTORS.forEach(function (f, z) {
        var v = fval(st, s.id, f.id), b = s.base[f.id], g = Math.round(v - b);
        html += '<button type="button" class="pm-factor' + (selZone === z ? " is-on" : "") + '" data-act="factor" data-z="' + z + '" style="--c:' + f.cor + '" aria-pressed="' + (selZone === z) + '">' +
          '<i></i><span>' + esc(f.nome) + '</span><b>' + Math.round(v) + (g > 0 ? '<em>+' + g + '</em>' : '') + '</b>' +
          '<div class="pm-bar" style="--c:' + f.cor + '"><i style="--w:' + v + '%"></i><u style="--b:' + b + '%"></u></div></button>';
      });
      html += "</div>";
      if (selZone >= 0) {
        html += '<div class="pm-sym" style="--c:' + FACTORS[selZone].cor + '"><small>O que está acontecendo</small>' + esc(s.sint[selZone]) + '</div>' +
          '<button type="button" class="pm-link" data-act="whole">↩ Ver o setor inteiro</button>';
      }
      html += "</section>";

      html += '<section class="pm-sec"><h3>Melhorias <span>· nível dos objetos e programas</span></h3><div class="pm-cats">';
      CATS.forEach(function (c) { html += '<button type="button" class="pm-cat" data-act="cat" data-c="' + esc(c) + '" aria-pressed="' + (catFilter === c) + '">' + esc(c) + "</button>"; });
      html += '</div><div class="pm-list">';
      var fid = selZone >= 0 ? FACTORS[selZone].id : null;
      var list = CATALOG.filter(function (c) { return catFilter === "Todos" || c.cat === catFilter; });
      if (fid) list = list.slice().sort(function (a, b) { return (b.f[fid] || 0) - (a.f[fid] || 0) || a.i - b.i; });
      list.forEach(function (c) {
        var l = st.lv[s.id][c.id], max = l >= 3, p = max ? 0 : price(c, l), can = !max && p <= st.balance;
        var help = fid && c.f[fid] > 0;
        var gs = max ? [] : gains(st, s.id, c, l);
        html += '<article class="pm-card' + (help ? " is-help" : "") + (flashId === s.id + c.id ? " is-flash" : "") + '"' + (help ? ' style="--hc:' + FACTORS[selZone].cor + '"' : "") + '>' +
          '<div class="pm-card__ico">' + (c.i < 9 ? "0" : "") + (c.i + 1) + '</div>' +
          '<div><h4>' + esc(c.n) + ' <span class="pm-lv ' + (max ? "pm-lv--max" : "pm-lv--" + (l + 1)) + '">' + (max ? "Máximo" : "Nível " + (l + 1)) + '</span></h4>' +
          '<p class="pm-obj">' + esc(c.o[s.id]) + '</p></div>' +
          '<div class="pm-card__mid"><span class="pm-pips" role="img" aria-label="Nível atual ' + l + ' de 3">' +
            [0, 1, 2].map(function (k) { return '<i class="' + (k < l ? "on" : "") + '"></i>'; }).join("") + '<span>Nível ' + l + '/3</span></span>' +
          '<span class="pm-eff">' + (max ? "" : gs.map(function (g) { return '<span class="pm-chip">' + (g.g > 0 ? "+" + g.g : "no limite") + " " + esc(g.f.nome) + "</span>"; }).join("")) + '</span></div>' +
          '<div class="pm-card__buy">' + (max
            ? '<span class="pm-max">Nível máximo ✓</span>'
            : '<span class="pm-price"><span class="pm-coin pm-coin--s"></span>' + fmt(p) + '</span>' +
              '<button type="button" class="pm-btn" data-act="buy" data-id="' + c.id + '"' + (can ? "" : " disabled") + ' aria-label="Melhorar ' + esc(c.n) + ' para o nível ' + (l + 1) + ' por ' + fmt(p) + ' moedas">' +
              (can ? "Melhorar" : "Faltam " + fmt(p - st.balance)) + "</button>") + '</div></article>';
      });
      html += "</div></section>";
      sc.innerHTML = html; sc.scrollTop = top; flashId = null;
    }
    function renderPanel() { renderHead(); renderBody(); }

    /* --- avisos --- */
    function toast(t) {
      var el = document.createElement("div");
      el.className = "pm-toast pm-toast--" + (t.kind || "info");
      el.setAttribute("role", t.kind === "alert" ? "alert" : "status");
      el.innerHTML = '<div class="pm-toast__av">' + avatar(t.av || 0) + '</div><div><h3>' + esc(t.title) + '</h3><p>' + esc(t.text || "") + '</p>' +
        (t.delta ? '<div class="pm-delta">' + t.delta + '</div>' : "") +
        (t.chips ? '<div class="pm-toast__row">' + t.chips.join("") + '</div>' : "") +
        (t.action ? '<button type="button" class="pm-toast__act">' + esc(t.action.label) + '</button>' : "") + '</div>' +
        '<button type="button" class="pm-toast__x" aria-label="Fechar aviso">✕</button>';
      function close() { if (!el.parentNode) return; el.classList.add("is-out"); setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, reduce ? 0 : 300); }
      el.querySelector(".pm-toast__x").addEventListener("click", close);
      if (t.action) el.querySelector(".pm-toast__act").addEventListener("click", function () { t.action.fn(); close(); });
      toasts.appendChild(el);
      var maxT = (global.matchMedia && global.matchMedia("(max-width: 899px)").matches) ? 2 : 3;
      while (toasts.children.length > maxT) toasts.removeChild(toasts.firstChild);
      later(close, t.ms || (t.kind === "alert" ? 11000 : 7500));
    }
    function chip(txt, cls) { return '<span class="pm-chip' + (cls ? " " + cls : "") + '">' + esc(txt) + "</span>"; }

    /* --- seleção e câmera --- */
    function applyLayout() {
      root.classList.toggle("has-panel", sel >= 0);
      // força o layout novo antes de reenquadrar a câmera
      void view.offsetWidth; lastW = view.clientWidth; lastH = view.clientHeight;
      var tall = root.clientHeight > root.clientWidth * 1.05;
      if (tall !== curTall) { curTall = tall; iso.setWorld(layoutDefs(tall), FACTORS.map(function (f) { return f.nome; })); }
      iso.resize();
    }
    function select(i, zone) {
      var wasSel = sel; sel = i; selZone = zone == null ? -1 : zone;
      iso.setSelection(sel, selZone); iso.setHint(-1);
      applyLayout();
      iso.focus(sel, selZone, wasSel < 0 ? 0.9 : 0.8);
      renderPanel(); updateHud();
      if (selZone >= 0) later(function () { var el = sc.querySelector(".pm-factor.is-on"); if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" }); }, 50);
      if (o.onSelect) o.onSelect(SECTORS[sel].id);
      if (wasSel < 0) { var x = ph.querySelector(".pm-x"); if (x) x.focus({ preventScroll: true }); }
    }
    function deselect() {
      if (sel < 0) { iso.home(0.8); return; }
      var tab = tabs[0]; sel = -1; selZone = -1;
      iso.setSelection(-1); applyLayout(); iso.home(0.8);
      renderPanel(); updateHud(); tab.focus({ preventScroll: true });
    }
    function zoneFocus(z) {
      if (sel < 0) return;
      selZone = (selZone === z) ? -1 : z;
      iso.setSelection(sel, selZone); iso.focus(sel, selZone, 0.8); renderPanel();
      if (selZone >= 0) later(function () { var el = sc.querySelector(".pm-factor.is-on"); if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" }); }, 30);
    }

    /* --- compra --- */
    async function buy(cid) {
      if (o.model) {
        if (sel < 0 || root.dataset.buying === "true") return;
        root.dataset.buying = "true";
        var result;
        try { result = await o.model.buy(cid); }
        catch (_) { result = {ok:false}; }
        finally { delete root.dataset.buying; }
        refresh();
        if (result && result.ok) {
          for (var z=0; z<6; z++) iso.wave(SECTORS[sel].id,z);
          toast({kind:"success",title:"Melhoria instalada",text:result.message});
        } else toast({kind:"alert",title:"Compra não realizada",text:result && result.message || "Não foi possível salvar a compra. Saldo preservado."});
        var replacement = sc.querySelector('[data-id="' + cid + '"]');
        if (replacement) replacement.focus({preventScroll:true});
        return;
      }
      if (sel < 0) return;
      var s = SECTORS[sel], c = CAT[cid], l = st.lv[s.id][cid];
      if (!c || l >= 3) return;
      var p = price(c, l);
      if (p > st.balance) { balBox.classList.remove("is-shake"); void balBox.offsetWidth; balBox.classList.add("is-shake"); return; }
      var before = health(st, s.id), gs = gains(st, s.id, c, l), i0 = inds(st, s.id), cBefore = companyHealth(st);
      st.balance -= p; st.lv[s.id][cid] = l + 1;
      var after = health(st, s.id), i1 = inds(st, s.id), cAfter = companyHealth(st);
      syncEngine(s.id, false);
      gs.forEach(function (g) { iso.wave(s.id, g.z); });
      setBalance(st.balance, true); flashId = s.id + cid;
      renderPanel(); updateHud();

      toast({ kind: "success", av: 0, title: "Melhoria implementada!", text: c.n + " · " + c.o[s.id] + " (Nível " + (l + 1) + ")",
        delta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg><span>Índice do setor <b>' + Math.round(before) + ' → ' + Math.round(after) + '</b></span>',
        chips: [chip("− " + fmt(p), "pm-chip--cost")].concat(gs.filter(function (g) { return g.g > 0; }).map(function (g) { return chip("+" + g.g + " " + g.f.nome); })) });
      var red = Math.round((1 - i1.abs / inds(st, s.id, ZERO).abs) * 100);
      if (red >= 1) later(function () {
        toast({ kind: "info", av: 3, title: "Nova previsão (30 dias)", text: "Com as melhorias aplicadas, o risco de afastamento em " + s.nome + " pode reduzir em até " + red + "%.", ms: 6500 });
      }, 900);
      if (before < GOAL_SECTOR && after >= GOAL_SECTOR && !st.flags["rec_" + s.id]) {
        st.flags["rec_" + s.id] = 1;
        later(function () { toast({ kind: "goal", av: 2, title: "Setor recuperado!", text: s.nome + " passou de " + GOAL_SECTOR + ". Veja as pessoas voltando a circular com energia.", ms: 8000 }); }, 1700);
      }
      if (cBefore < GOAL_COMPANY && cAfter >= GOAL_COMPANY && !st.flags.goal) {
        st.flags.goal = 1;
        later(function () { toast({ kind: "goal", av: 1, title: "Meta da fase 1 atingida!", text: "O índice da empresa chegou a " + Math.round(cAfter) + ". Continue investindo para consolidar a recuperação.", ms: 10000 }); }, 2600);
      }
      saveState(st);
      var minNext = 1e9;
      SECTORS.forEach(function (sec) { CATALOG.forEach(function (cc) { var ll = st.lv[sec.id][cc.id]; if (ll < 3) minNext = Math.min(minNext, price(cc, ll)); }); });
      if (st.balance < minNext) later(function () {
        toast({ kind: "info", av: 3, title: "Orçamento esgotado", text: "Você investiu todo o saldo e levou a empresa a " + Math.round(cAfter) + " de índice. Quer tentar outra estratégia?",
          action: { label: "Recomeçar", fn: reset }, ms: 15000 });
      }, 3400);
    }

    function reset() {
      if (o.model) return;
      st = freshState(); st.coach = true; saveState(st);
      SECTORS.forEach(function (s) { syncEngine(s.id, true); });
      setBalance(st.balance, true);
      toasts.innerHTML = "";
      if (sel >= 0) { sel = -1; selZone = -1; iso.setSelection(-1); applyLayout(); iso.home(0.6); }
      iso.setHint(sickest()); renderPanel(); updateHud();
    }

    /* --- tutorial e alerta inicial --- */
    var coach = null;
    function showCoach() {
      coach = document.createElement("div");
      coach.className = "pm-coach"; coach.setAttribute("role", "region"); coach.setAttribute("aria-label", "Como jogar");
      coach.innerHTML = '<h2>Recupere a <em>empresa</em></h2>' +
        '<p>Os três setores estão adoecidos. Você começa com <b>' + fmt(START_BALANCE) + ' moedas</b> para investir, mas não dá para melhorar tudo: escolha onde cuidar primeiro.</p>' +
        '<ul><li><span>1</span>Toque em um setor para ver o diagnóstico.</li>' +
        '<li><span>2</span>Examine cada fator psicossocial e invista nas melhorias.</li>' +
        '<li><span>3</span>Chegue a ' + GOAL_COMPANY + ' de índice na empresa. Arraste e use o zoom para explorar.</li></ul>' +
        '<button type="button" class="pm-btn">Começar</button>';
      coach.querySelector(".pm-btn").addEventListener("click", function () {
        st.coach = true; saveState(st); coach.parentNode && coach.parentNode.removeChild(coach); coach = null;
        later(alertFirst, 2500);
      });
      view.appendChild(coach);
    }
    function alertFirst() {
      if (alerted || sel >= 0) return; alerted = true;
      var i = sickest(), s = SECTORS[i];
      toast({ kind: "alert", av: 1, title: "Atenção!", text: "Um colaborador de " + s.nome + " apresentou sinais de estresse.",
        action: { label: "Ver detalhes", fn: function () { select(i); } } });
    }

    /* --- interação: ponteiro, roda, teclado --- */
    var ptrs = {}, nPtr = 0, moved = false, downAt = null, pinch = 0, lastPos = null;
    function pos(e) { var r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
    function two() { var k = Object.keys(ptrs); return [ptrs[k[0]], ptrs[k[1]]]; }
    function onMapClick(p) {
      var hit = iso.pick(p.x, p.y);
      if (!hit) return;
      if (sel === hit.i) zoneFocus(hit.zone); else select(hit.i, -1);
    }
    canvas.addEventListener("pointerdown", function (e) {
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignora */ }
      ptrs[e.pointerId] = pos(e); nPtr = Object.keys(ptrs).length;
      if (nPtr === 1) { downAt = pos(e); lastPos = pos(e); moved = false; }
      else if (nPtr === 2) { moved = true; var t = two(); pinch = dist(t[0], t[1]); }
    });
    canvas.addEventListener("pointermove", function (e) {
      var p = pos(e);
      if (!ptrs[e.pointerId]) {
        if (e.pointerType === "mouse") { var h = iso.pick(p.x, p.y); iso.setHover(h); canvas.classList.toggle("is-hit", !!h); }
        return;
      }
      if (nPtr === 2) {
        var prev = two(); var pm = { x: (prev[0].x + prev[1].x) / 2, y: (prev[0].y + prev[1].y) / 2 };
        ptrs[e.pointerId] = p; var t = two(), d = dist(t[0], t[1]), nm = { x: (t[0].x + t[1].x) / 2, y: (t[0].y + t[1].y) / 2 };
        if (pinch > 0) iso.zoomAt(nm.x, nm.y, d / pinch);
        iso.panBy(nm.x - pm.x, nm.y - pm.y); pinch = d; return;
      }
      ptrs[e.pointerId] = p;
      if (!moved && downAt && dist(p, downAt) > 6) { moved = true; canvas.classList.add("is-drag"); iso.setHover(null); }
      if (moved && lastPos) iso.panBy(p.x - lastPos.x, p.y - lastPos.y);
      lastPos = p;
    });
    function up(e) {
      var wasOne = nPtr === 1, p = pos(e);
      delete ptrs[e.pointerId]; nPtr = Object.keys(ptrs).length; pinch = 0; canvas.classList.remove("is-drag");
      if (nPtr === 1) { lastPos = ptrs[Object.keys(ptrs)[0]]; }
      if (wasOne && !moved && e.type === "pointerup") onMapClick(p);
    }
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") { iso.setHover(null); canvas.classList.remove("is-hit"); } });
    canvas.addEventListener("wheel", function (e) {
      e.preventDefault(); var p = pos(e);
      iso.zoomAt(p.x, p.y, Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0016)));
    }, { passive: false });

    root.querySelector(".pm-zoom").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      var k = b.getAttribute("data-z"), cx = view.clientWidth / 2, cy = view.clientHeight / 2;
      if (k === "in") iso.zoomAt(cx, cy, 1.3); else if (k === "out") iso.zoomAt(cx, cy, 1 / 1.3); else deselect();
    });
    root.querySelector(".pm-tabs").addEventListener("click", function (e) {
      var b = e.target.closest(".pm-tab"); if (!b) return;
      var i = +b.getAttribute("data-i"); if (i < 0) deselect(); else select(i, -1);
    });
    root.querySelector(".pm-reset").addEventListener("click", function (e) {
      var b = e.currentTarget;
      if (!resetArmed) { resetArmed = true; b.textContent = "Confirmar?"; later(function () { resetArmed = false; b.textContent = "Reiniciar"; }, 3000); return; }
      resetArmed = false; b.textContent = "Reiniciar"; reset();
    });
    var replayBtn = root.querySelector(".pm-replay");
    if (replayBtn) replayBtn.addEventListener("click", function () { o.onReplayIntro(); });
    panel.addEventListener("click", function (e) {
      var b = e.target.closest("[data-act]"); if (!b || b.disabled) return;
      var a = b.getAttribute("data-act");
      if (a === "close") deselect();
      else if (a === "factor") zoneFocus(+b.getAttribute("data-z"));
      else if (a === "whole") { selZone = -1; iso.setSelection(sel, -1); iso.focus(sel, -1, 0.8); renderPanel(); }
      else if (a === "cat") { catFilter = b.getAttribute("data-c"); renderBody(); }
      else if (a === "buy") buy(b.getAttribute("data-id"));
    });
    function onKey(e) {
      if (!root.isConnected) return document.removeEventListener("keydown", onKey);
      if (document.querySelector("dialog[open]") || document.querySelector(".pi-root")) return;
      if (e.key === "Escape" && root.contains(e.target)) { e.preventDefault(); deselect(); return; }
      if (e.target !== canvas) return;
      if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"," ","+","-","0","1","2","3"].includes(e.key)) e.preventDefault();
      var cx = view.clientWidth / 2, cy = view.clientHeight / 2;
      switch (e.key) {
        case "+": case "=": iso.zoomAt(cx, cy, 1.25); break;
        case "-": case "_": iso.zoomAt(cx, cy, 0.8); break;
        case "ArrowLeft": if (e.target === canvas || e.target === document.body) iso.panBy(70, 0); break;
        case "ArrowRight": if (e.target === canvas || e.target === document.body) iso.panBy(-70, 0); break;
        case "ArrowUp": if (e.target === canvas || e.target === document.body) iso.panBy(0, 70); break;
        case "ArrowDown": if (e.target === canvas || e.target === document.body) iso.panBy(0, -70); break;
        case "Escape": if (sel >= 0) deselect(); break;
        case "0": deselect(); break;
        case "1": case "2": case "3": select(+e.key - 1, -1); break;
        default: return;
      }
    }
    document.addEventListener("keydown", onKey);
    canvas.tabIndex = 0;

    /* --- arranque --- */
    curTall = null;
    var ro = global.ResizeObserver ? new ResizeObserver(function () { fit(false); }) : null;
    if (ro) ro.observe(view); else global.addEventListener("resize", function () { fit(false); });
    function onVis() { if (document.hidden) iso.stop(); else iso.start(); }
    document.addEventListener("visibilitychange", onVis);

    SECTORS.forEach(function (s) { syncEngine(s.id, true); });
    fit(true);
    iso.setHint(o.model ? (st.status === 'not-started' ? 1 : -1) : sickest());
    iso.start();
    setBalance(st.balance, false);
    renderPanel(); updateHud();
    if (!o.model) { if (!st.coach) showCoach(); else later(alertFirst, 4000); }

    function refresh() {
      if (!o.model) return;
      var next = o.model.read();
      if (JSON.stringify(next) === JSON.stringify(st)) return;
      st = next;
      SECTORS.forEach(function(s){ syncEngine(s.id, false); });
      setBalance(st.balance, false);
      // Do not replace controls every clock tick; keep focus and scroll stable.
      var focused = document.activeElement, id = focused && focused.dataset && focused.dataset.id;
      var act = focused && focused.dataset && focused.dataset.act;
      var selectedCase = focused && focused.dataset && focused.dataset.sectorCase;
      renderPanel(); updateHud();
      if (id) sc.querySelector('[data-id="' + id + '"]')?.focus({preventScroll:true});
      else if (selectedCase) sc.querySelector('[data-sector-case="' + selectedCase + '"]')?.focus({preventScroll:true});
      else if (act === 'close') ph.querySelector('[data-act="close"]')?.focus({preventScroll:true});
    }
    var motion = global.matchMedia("(prefers-reduced-motion: reduce)");
    function onMotion() { reduce = motion.matches; iso.stop(); iso.setStatic(reduce); if (!reduce && !document.hidden) iso.start(); iso.render(); }
    function setMotion(reduced){reduce=!!reduced;iso.stop();iso.setStatic(reduce);if(!reduce&&!document.hidden)iso.start();iso.render();root.dataset.motion=reduce?'reduced':'on';}
    motion.addEventListener("change", onMotion);
    function destroy() {
      motion.removeEventListener("change", onMotion);
      cancelAnimationFrame(balRaf);
      timers.forEach(clearTimeout); iso.stop(); if (ro) ro.disconnect();
      document.removeEventListener("keydown", onKey); document.removeEventListener("visibilitychange", onVis);
      if (root.parentNode) root.parentNode.removeChild(root);
    }
    var api = {
      setMotion: setMotion, refresh: refresh, destroy: destroy, root: root, select: select, deselect: deselect, buy: buy, reset: reset,
      state: function () { return JSON.parse(JSON.stringify(st)); },
      health: function (sid) { return health(st, sid); },
      company: function () { return companyHealth(st); },
      iso: iso
    };
    if (typeof o.onReady === "function") o.onReady(api);
    return api;
  }

  global.PilhaMapa = { mount: mount, data: { FACTORS: FACTORS, CATALOG: CATALOG, SECTORS: SECTORS, START_BALANCE: START_BALANCE } };
})(typeof window !== "undefined" ? window : this);
