/* PilhA+ Game — Abertura + camada de convite (JS puro, sem dependências).
 * Requer pilha-iso.js (motor isométrico) carregado antes.
 *
 * Uso:
 *   PilhaIntro.mount({
 *     role: "Missão PilhA+",
 *     onStart: () => { ... abrir o menu/Capítulo 01 ... },
 *   });
 *
 * Também dispara o evento "pilha:intro-start" em `document` ao aceitar a missão.
 */
(function (global) {
  "use strict";

  var ENVS = [
    { key: "escritorio",  label: "Escritório" },
    { key: "producao",    label: "Produção" },
    { key: "atendimento", label: "Atendimento" },
  ];

  // Sinais do ambiente adoecido (um por setor). Textos e cores são editáveis.
  var SIGNALS = [
    { id: "carga", label: "Ritmo e carga",         color: "#ffd166" },
    { id: "auton", label: "Autonomia",             color: "#48cae4" },
    { id: "relac", label: "Relações",              color: "#52b788" },
    { id: "lider", label: "Liderança",             color: "#f4a261" },
    { id: "recon", label: "Reconhecimento",        color: "#9b5de5" },
    { id: "seg",   label: "Segurança psicológica", color: "#e63946" },
  ];

  var HINTS = {
    escritorio: [
      "Prazos que se acumulam na mesma semana e e-mails que não param: o cansaço vira rotina.",
      "Aprovações em cadeia para tarefas simples: ninguém decide e tudo demora.",
      "Setores que só se falam por e-mail e conflitos que ficam sem resposta.",
      "A porta da gestão fica fechada e as dúvidas viram boatos.",
      "Entregas boas passam sem comentário: o esforço ninguém vê.",
      "Errar vira motivo de exposição, então ninguém levanta a mão para pedir ajuda.",
    ],
    producao: [
      "Metas de turno que sobem sem reforçar a equipe: pausas encurtadas e fadiga no fim do dia.",
      "O operador vê o problema na linha, mas precisa esperar autorização para parar.",
      "Turnos que não passam informação um ao outro: as mesmas falhas se repetem.",
      "Supervisão que cobra números, mas não escuta o chão de fábrica.",
      "Quem evita um acidente ou melhora o processo não é lembrado.",
      "Relatar um quase acidente gera culpa, então os riscos ficam escondidos.",
    ],
    atendimento: [
      "Fila que não zera, ligação cronometrada e pouco intervalo entre atendimentos.",
      "Roteiro rígido: a pessoa não pode resolver o problema do cliente do jeito certo.",
      "Clientes agressivos e equipe sem espaço para se apoiar depois da ligação.",
      "Feedback só quando a meta cai: ninguém pergunta como a equipe está.",
      "O cliente elogia, mas o elogio nunca chega a quem atendeu.",
      "Pedir pausa depois de uma ligação difícil é visto como fraqueza.",
    ],
  };

  var DEFAULTS = {
    container: null, // padrão: document.body
    role: "Missão PilhA+",
    splashMs: 3200,
    skipSplash: false,
    ctaLabel: "Aceitar a missão",
    environments: ENVS,
    signals: SIGNALS,
    hints: HINTS,
    onStart: null,
  };

  var uid = 0;

  function orbitHtml(prefix, colors) {
    return (
      '<div class="pi-orbit__ring" aria-hidden="true"></div>' +
      '<div class="pi-orbit__sat" aria-hidden="true">' +
      '<i class="pi-orbit__orb" style="--c:' + colors[0] + '"></i>' +
      '<i class="pi-orbit__orb pi-orbit__orb--b" style="--c:' + colors[1] + '"></i></div>' +
      '<div class="pi-orbit__sat pi-orbit__sat--inner" aria-hidden="true">' +
      '<i class="pi-orbit__orb" style="--c:' + colors[2] + '"></i></div>' +
      '<div class="pi-logo"><img src="/assets/branding/pilha-logo-puro.png" width="1280" height="1280" alt="Símbolo PilhA+"></div>'
    );
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function mount(userOpts) {
    var o = Object.assign({}, DEFAULTS, userOpts || {});
    var id = "pi" + ++uid + "-";
    var host = o.container || document.body;
    var motion = global.matchMedia("(prefers-reduced-motion: reduce)");
    var reduce = motion.matches, motionChoice;
    try { motionChoice=global.localStorage.getItem('pilha-motion-v1'); } catch (_) {}
    if(motionChoice==='on')reduce=false;
    if(motionChoice==='off')reduce=true;
    var signals = o.signals, envs = o.environments, hints = o.hints;
    var cur = 0; // ambiente atual
    var timers = [];
    var iso = null, ro = null;
    var shown = false;

    var root = document.createElement("div");
    root.className = "pi-root";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-label", "Convite para a missão do PilhA+ Game");
    root.style.setProperty("--pi-splash-ms", o.splashMs + "ms");

    var nodes = signals
      .map(function (s, i) {
        return (
          '<button type="button" class="pi-node" data-i="' + i + '" style="--c:' + s.color + '" ' +
          'aria-pressed="false" aria-label="Investigar sinal: ' + esc(s.label) + '">' +
          '<span class="pi-node__body"><span class="pi-node__orb"></span><span class="pi-node__label">' + esc(s.label) + "</span></span></button>"
        );
      })
      .join("");

    var tabs = envs
      .map(function (e, i) {
        return (
          '<button type="button" role="tab" class="pi-tab" id="' + id + 'tab' + i + '" data-env="' + i + '" aria-selected="' + (i === 0) + '">' +
          esc(e.label) + '<span class="pi-tab__ok" aria-hidden="true">✓</span></button>'
        );
      })
      .join("");

    root.innerHTML =
      // ----- Etapa 1: abertura -----
      '<section class="pi-stage pi-splash" aria-live="polite">' +
      '<div class="pi-orbit">' + orbitHtml(id + "s", ["#ffd166", "#48cae4", "#e63946"]) + "</div>" +
      '<h1 class="pi-wordmark">PilhA<b>+</b> <span>Game</span></h1>' +
      '<p class="pi-tagline">Gestão &amp; Cuidado</p>' +
      '<div class="pi-loading" role="progressbar" aria-label="Preparando o jogo"><i></i></div>' +
      "</section>" +
      // ----- Etapa 2: convite -----
      '<section class="pi-stage pi-invite" hidden>' +
      '<header class="pi-top">' +
      '<div class="pi-brand-group"><div class="pi-orbit pi-brand-mark" aria-hidden="true">'+orbitHtml(id+'b',["#ffd166", "#48cae4", "#e63946"])+'</div><div class="pi-brand">PilhA<b>+</b> Game<small>GESTÃO &amp; CUIDADO</small></div></div>' +
      '<span class="pi-badge">ALPHA 1.5</span></header>' +
      '<div class="pi-scene">' +
      '<div class="pi-field" role="group" aria-label="Ambiente de trabalho adoecido, visto de cima">' +
      '<canvas class="pi-iso" aria-hidden="true"></canvas>' + nodes + "</div>" +
      '<div class="pi-tabs" role="tablist" aria-label="Ambientes de trabalho">' + tabs + "</div>" +
      "</div>" +
      '<div class="pi-panel">' +
      '<span class="pi-role">' + esc(o.role) + "</span>" +
      '<h2 class="pi-title">O ambiente de trabalho <em>adoeceu</em>.</h2>' +
      '<p class="pi-lead">Veja as pessoas circulando. Toque nos sinais de cada setor para entender o que está drenando a energia e ajudar a recuperar o lugar.</p>' +
      '<div class="pi-meter" aria-live="polite"><span class="pi-meter__txt"></span><div class="pi-meter__bar"><i></i></div></div>' +
      '<p class="pi-hint" aria-live="polite"></p>' +
      '<button type="button" class="pi-cta">' + esc(o.ctaLabel) +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>' +
      '<button type="button" class="pi-skip">Pular introdução</button>' +
      '<p class="pi-disclaimer">Simulação fictícia para aprendizagem. Não substitui avaliação profissional, clínica ou jurídica.</p>' +
      '</div></section><button type="button" class="pi-motion"></button>';

    host.appendChild(root);

    var splash = root.querySelector(".pi-splash");
    var invite = root.querySelector(".pi-invite");
    var field = root.querySelector(".pi-field");
    var canvas = root.querySelector(".pi-iso");
    var nodeEls = [].slice.call(root.querySelectorAll(".pi-node"));
    var tabEls = [].slice.call(root.querySelectorAll(".pi-tab"));
    var meterTxt = root.querySelector(".pi-meter__txt");
    var meterBar = root.querySelector(".pi-meter__bar i");
    var hint = root.querySelector(".pi-hint");
    var cta = root.querySelector(".pi-cta");
    var skip = root.querySelector(".pi-skip");
    var motionButton=root.querySelector('.pi-motion');
    function applyMotion(){
      root.dataset.motion=reduce?'reduced':'on';
      motionButton.textContent=reduce?'Ativar animações':'Pausar animações';
      motionButton.setAttribute('aria-pressed',String(!reduce));
      if(iso){iso.stop();iso.setStatic(motionChoice==='off');iso.render();if(!document.hidden&&!invite.hidden)iso.start();}
    }
    motionButton.addEventListener('click',function(){reduce=!reduce;motionChoice=reduce?'off':'on';try{global.localStorage.setItem('pilha-motion-v1',motionChoice);}catch(_){}applyMotion();});
    function onSystemMotion(){if(motionChoice!=='on'&&motionChoice!=='off'){reduce=motion.matches;applyMotion();}}
    motion.addEventListener('change',onSystemMotion);

    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

    function envKey() { return envs[cur].key; }
    function litCount(k) {
      var n = 0;
      for (var i = 0; i < signals.length; i++) if (iso.isLit(k, i)) n++;
      return n;
    }
    function totalLit() {
      var n = 0;
      envs.forEach(function (e) { n += litCount(e.key); });
      return n;
    }

    function placeNodes() {
      nodeEls.forEach(function (el, i) {
        var a = iso.anchor(i);
        el.style.setProperty("--x", a.x + "px");
        el.style.setProperty("--y", a.y + "px");
      });
    }

    function sync() {
      var k = envKey(), n = litCount(k), all = signals.length;
      nodeEls.forEach(function (el, i) {
        var on = iso.isLit(k, i);
        el.classList.toggle("is-lit", on);
        el.setAttribute("aria-pressed", on ? "true" : "false");
      });
      tabEls.forEach(function (t, i) {
        t.classList.toggle("is-done", litCount(envs[i].key) === all);
      });
      meterBar.style.setProperty("--p", Math.round((n / all) * 100) + "%");
      meterTxt.textContent = n + " de " + all + " sinais investigados neste ambiente";
      root.classList.toggle("is-restored", n === all);
      cta.classList.toggle("is-ready", n === all);
    }

    function selectEnv(i, focusTab) {
      cur = i;
      tabEls.forEach(function (t, j) {
        t.setAttribute("aria-selected", j === i ? "true" : "false");
        t.tabIndex = j === i ? 0 : -1;
      });
      if (focusTab) tabEls[i].focus();
      canvas.classList.add("is-swap");
      later(function () { canvas.classList.remove("is-swap"); }, 30);
      iso.setEnv(envKey());
      hint.textContent = litCount(envKey()) === signals.length
        ? "Este ambiente foi recuperado. Visite os outros ou aceite a missão."
        : "Toque nos sinais para investigar este ambiente.";
      sync();
    }

    function showInvite() {
      if (shown) return;
      shown = true;
      splash.classList.add("is-out");
      later(function () {
        splash.hidden = true;
        invite.hidden = false;
        invite.classList.add("is-in");
        iso.resize();
        placeNodes();
        iso.start();
        cta.focus({ preventScroll: true });
      }, reduce ? 0 : 600);
    }

    function onNode(e) {
      var btn = e.target.closest(".pi-node");
      if (!btn) return;
      var i = +btn.getAttribute("data-i"), k = envKey();
      hint.textContent = hints[k][i];
      if (!iso.isLit(k, i)) {
        iso.light(i);
        sync();
        if (litCount(k) === signals.length) {
          hint.textContent = hints[k][i] + " Este ambiente foi recuperado.";
        }
      }
    }

    function onTab(e) {
      var t = e.target.closest(".pi-tab");
      if (t) selectEnv(+t.getAttribute("data-env"), false);
    }
    function onTabKey(e) {
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      selectEnv((cur + d + envs.length) % envs.length, true);
    }

    function start() {
      timers.forEach(clearTimeout);
      root.classList.add("is-leaving");
      var payload = { signalsInvestigated: totalLit() };
      document.dispatchEvent(new CustomEvent("pilha:intro-start", { detail: payload }));
      if (typeof o.onStart === "function") o.onStart(payload);
      later(destroy, reduce ? 0 : 650);
    }

    function destroy() {
      timers.forEach(clearTimeout);
      if (iso) iso.stop();
      if (ro) ro.disconnect();
      global.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      motion.removeEventListener('change',onSystemMotion);
      root.removeEventListener("click", onNode);
      if (root.parentNode) root.parentNode.removeChild(root);
    }

    function onResize() { if (!invite.hidden) { iso.resize(); placeNodes(); } }
    function onVis() { if (document.hidden) iso.stop(); else if (!invite.hidden) iso.start(); }

    iso = global.PilhaIso.create(canvas, signals.map(function (s) { return s.color; }));
    iso.setStatic(motionChoice==='off');
    applyMotion();
    iso.setEnv(envKey());
    selectEnv(0, false);

    root.addEventListener("click", onNode);
    root.querySelector(".pi-tabs").addEventListener("click", onTab);
    root.querySelector(".pi-tabs").addEventListener("keydown", onTabKey);
    cta.addEventListener("click", start);
    skip.addEventListener("click", start);
    splash.addEventListener("click", showInvite);
    global.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    if (global.ResizeObserver) { ro = new ResizeObserver(onResize); ro.observe(field); }
    document.addEventListener("keydown", function esc_(e) {
      if (!root.isConnected) return document.removeEventListener("keydown", esc_);
      if (e.key === "Escape") start();
      if (!shown && (e.key === "Enter" || e.key === " ")) showInvite();
    });

    if (o.skipSplash) showInvite();
    else later(showInvite, reduce ? 800 : o.splashMs);

    return { destroy: destroy, root: root };
  }

  global.PilhaIntro = { mount: mount, defaults: DEFAULTS };
})(typeof window !== "undefined" ? window : this);
