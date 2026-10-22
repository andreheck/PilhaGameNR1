/* PilhA+ Game — Tela de heróis (visualização e seleção). JS puro, sem dependências.
 * Requer pilha-herois-dados.js (dados) e pilha-herois.css.
 *
 * Uso:
 *   var tela = PilhaHerois.mount({
 *     container: null,            // padrão: document.body
 *     assetBase: "",              // prefixo dos caminhos de imagem dos dados
 *     selectedId: null,           // herói já escolhido (padrão: lê do localStorage)
 *     onSelect: function (hero) {},   // jogador confirmou "Escolher"
 *     onClose: function () {},        // botão Voltar (só aparece se informado)
 *     onHistory: function (hero) {}   // botão "Ver histórico"
 *   });
 *   tela.view(id); tela.choose(id); tela.chosen(); tela.destroy();
 *
 * Desktop: grade de cards à esquerda e ficha do herói à direita.
 * Celular (até 899px): grade de cards; tocar abre a ficha em tela cheia (como "Perfil").
 */
(function (global) {
  "use strict";

  var KEY = "pilha-heroi-v1";
  var D = global.PilhaHeroisDados;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  function fmt(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function svg(name, cls) {
    return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + D.ICONS[name] + '"/></svg>';
  }
  function load() { try { return global.localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { global.localStorage.setItem(KEY, v); } catch (e) { /* sem armazenamento */ } }

  var LOGO =
    '<svg viewBox="0 0 512 560" aria-hidden="true"><defs><linearGradient id="phg" x1="120" y1="50" x2="370" y2="455" gradientUnits="userSpaceOnUse">' +
    '<stop offset="0" stop-color="#fff9a8"/><stop offset=".18" stop-color="#fff200"/><stop offset=".58" stop-color="#ffd200"/><stop offset="1" stop-color="#ff9f00"/></linearGradient></defs>' +
    '<path fill="url(#phg)" fill-rule="evenodd" stroke="#ffae00" stroke-width="7" stroke-linejoin="round" d="M142 46h182c89 0 145 53 134 132-9 70-62 108-135 108h-52L155 500l33-198h-83L142 46Zm81 86-14 93h110c32 0 51-18 56-49 4-29-16-44-47-44H223Z"/></svg>';

  function mount(userOpts) {
    var o = Object.assign({ container: null, assetBase: "", selectedId: null, onSelect: null, onClose: null, onHistory: null }, userOpts || {});
    var data = o.data || D;
    var list = data.LIST, by = {};
    list.forEach(function (h, i) { h.i = i; by[h.id] = h; });
    var host = o.container || document.body;
    var mq = global.matchMedia ? global.matchMedia("(max-width: 899px)") : { matches: false, addEventListener: function () {} };
    var chosen = by[o.selectedId] ? o.selectedId : (o.persist === false ? null : (by[load()] ? load() : null));
    var viewing = chosen || list[0].id;
    var sheetOpen = false, lastCard = null;

    var root = document.createElement("div");
    root.className = "ph-root";
    root.setAttribute("role", "region");
    root.setAttribute("aria-label", "Heróis do ambiente de trabalho");

    function src(h) { return esc(o.assetBase + h.img); }
    function cardHtml(h) {
      var pct = Math.round(h.xp / h.xpMax * 100);
      return '<li><button type="button" class="ph-card" data-id="' + h.id + '" style="--hc:' + h.cor + '">' +
        '<span class="ph-card__art"><img src="' + src(h) + '" alt="" loading="lazy" decoding="async" style="--z:' + (h.crop && h.crop.z || 1) + ';--cy:' + (h.crop && h.crop.y || 0) + '%">' +
          '<span class="ph-card__ico">' + svg(h.icone) + '</span>' +
          '<span class="ph-card__lv">Nv. ' + (h.nivel == null ? '—' : h.nivel) + '</span>' +
          '<span class="ph-card__mine">' + svg("star") + 'Seu herói</span></span>' +
        '<span class="ph-card__info">' +
          '<span class="ph-card__row"><span class="ph-card__ring">' + svg(h.icone) + '</span>' +
            '<span class="ph-card__id"><span class="ph-card__name"><span class="ph-sr">Ver perfil de </span>' + esc(h.nome) + '</span><span class="ph-card__role">' + esc(h.cargo) + '</span></span></span>' +
          '<span class="ph-card__desc">' + esc(h.resumo) + '</span>' +
          '<span class="ph-card__spec"><small>Especialização</small><em>' + esc(h.especializacao) + '</em></span>' +
        '</span></button></li>';
    }

    root.innerHTML =
      '<header class="ph-top">' +
        (o.onClose ? '<button type="button" class="ph-back" aria-label="Voltar ao jogo">' + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></button>' : "") +
        '<div class="ph-logo">' + LOGO + '<span>PILHA <b>GAME</b></span></div>' +
        '<h1 class="ph-title">Heróis do ambiente de trabalho</h1>' +
        '<p class="ph-slogan">Pessoas bem, organizações fortes.</p>' +
      '</header>' +
      (o.toolbarHtml || '') + '<div class="ph-main">' +
        '<section class="ph-roster" aria-label="Escolha o seu herói">' +
          '<p class="ph-hint" id="ph-hint">Toque em um herói para ver a ficha completa e escolher quem lidera a sua equipe.</p>' +
          '<ul class="ph-grid" aria-describedby="ph-hint">' + list.map(cardHtml).join("") + '</ul>' +
        '</section>' +
        '<aside class="ph-detail" aria-label="Ficha do herói"></aside>' +
      '</div>' +
      '<footer class="ph-foot"><span>Cada herói traz uma perspectiva única.</span><i aria-hidden="true">' + LOGO + '</i><span>Juntos, eles transformam ambientes de trabalho.</span></footer>' +
      (data.SAMPLE ? '<p class="ph-sample">Dados de exemplo: substituir pelos dados reais dos heróis.</p>' : "") +
      '<div class="ph-status" role="status" aria-live="polite"></div>';
    host.appendChild(root);

    var main = root.querySelector(".ph-main"), top = root.querySelector(".ph-top"), foot = root.querySelector(".ph-foot");
    var grid = root.querySelector(".ph-grid"), detail = root.querySelector(".ph-detail"), status = root.querySelector(".ph-status");
    var cards = [].slice.call(root.querySelectorAll(".ph-card"));
    var statusTimer = 0;

    function say(t) {
      status.textContent = "";
      clearTimeout(statusTimer);
      statusTimer = setTimeout(function () { status.textContent = t; status.classList.add("is-on"); statusTimer = setTimeout(function () { status.classList.remove("is-on"); }, 3200); }, 30);
    }

    /* --- ficha --- */
    function canonicalHtml(h) {
      if (!h.skills) return '';
      return '<details class="ph-canonical"><summary>Habilidades documentadas · ' + h.skills.length + '</summary>' + h.skills.map(function (a) { return '<article><small>' + esc(a.kind) + '</small><h4>' + esc(a.name) + '</h4><p>' + esc(a.text) + '</p><strong>' + (a.runtime ? 'Versão de protótipo implementada' : 'Conceito documentado · efeito ainda não ativado') + '</strong>' + (a.runtimeText ? '<p>' + esc(a.runtimeText) + '</p>' : '') + '</article>'; }).join('') + '</details>' +
        '<details class="ph-canonical"><summary>Atributos de referência · conceituais</summary><p>Parâmetros de prototipagem da ficha, sem bônus automáticos de seleção.</p>' + h.attributes.map(function (a) { return '<div class="ph-attribute"><span>' + esc(a.name) + '</span><b>' + a.value + '</b><meter min="0" max="100" value="' + a.value + '" aria-label="' + esc(a.name) + '"></meter></div>'; }).join('') + '</details><p class="ph-source"><a href="' + esc(h.source) + '" target="_blank" rel="noopener noreferrer">Ficha consolidada no GitHub ↗</a></p>';
    }
    function detailHtml(h) {
      var pct = Math.round(h.xp / h.xpMax * 100), mine = chosen === h.id;
      var otherRole=o.activeRole==='support'?'principal':'support',duplicate=o.roles&&o.roles[otherRole]===h.id;
      return '<div class="ph-d" style="--hc:' + h.cor + '" tabindex="-1" aria-labelledby="ph-d-name">' +
        '<div class="ph-d__bar"><button type="button" class="ph-d__back" aria-label="Voltar para a lista de heróis">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></button><span>Perfil</span></div>' +
        '<div class="ph-d__hero">' +
          '<div class="ph-d__fig"><span class="ph-d__glow"></span><img src="' + src(h) + '" alt="' + esc(h.alt || h.nome) + '" style="--z:' + (h.crop && h.crop.z || 1) + ';--cy:' + (h.crop && h.crop.y || 0) + '%"></div>' +
          '<div class="ph-d__txt">' +
            '<p class="ph-d__role">' + svg(h.icone) + esc(h.cargo) + '</p>' +
            '<h2 id="ph-d-name">' + esc(h.nome) + '</h2>' +
            '<p class="ph-d__lv">Nv. ' + (h.nivel == null ? '—' : h.nivel) + '</p>' +
            '<div class="ph-xp" role="progressbar" aria-label="Experiência" aria-valuemin="0" aria-valuemax="' + h.xpMax + '" aria-valuenow="' + h.xp + '"><i style="--p:' + pct + '%"></i></div>' +
            '<p class="ph-xp__n">' + (h.progressAvailable===false?'Progresso indisponível':h.atCap?'Nível máximo do protótipo':fmt(h.xp)+' / '+fmt(h.xpMax)+' XP') + '</p>' +
            '<blockquote><small>Arquétipo</small>' + esc(h.frase) + '</blockquote>' +
          '</div>' +
        '</div>' +
        '<div class="ph-tiles">' +
          '<div class="ph-tile"><div class="ph-ring" style="--p:' + h.energia + '"><b>' + (h.progressAvailable===false?'—':h.energia+'%') + '</b></div><h3>Progresso de nível</h3><p>XP e formação</p><div class="ph-mini"><i style="--p:' + h.energia + '%"></i></div></div>' +
          '<div class="ph-tile"><div class="ph-medal">' + svg("star") + '</div><h3>' + fmt(h.pontos) + '</h3><p>XP conquistado<br><small>Formação: ' + fmt(h.trainingXp || 0) + ' XP</small></p></div>' +
        '</div>' +
        '<section class="ph-spec" aria-label="Especialização"><h3>Especialização</h3><p class="ph-spec__n">' + esc(h.especializacao) + '</p><p class="ph-spec__d">' + esc(h.habilidade) + '</p></section>' +
        canonicalHtml(h) + '<section class="ph-ach" aria-label="Marcos registrados"><h3>Marcos registrados</h3><ul>' +
          h.conquistas.map(function (c) {
            return '<li class="' + (c.ok ? "is-ok" : "is-off") + '"><span class="ph-ach__ico">' + svg(c.icone) + '</span><span>' + esc(c.nome) + '<em class="ph-sr">' + (c.ok ? " (conquistada)" : " (bloqueada)") + '</em></span></li>';
          }).join("") + '</ul></section>' +
        '<div class="ph-cta">' +
          '<button type="button" class="ph-btn ph-btn--pick' + (mine ? " is-mine" : "") + '" data-act="pick"' + (o.readOnly || duplicate ? ' disabled' : '') + (mine ? ' aria-pressed="true"' : '') + '>' + (o.readOnly ? 'Dupla preservada no ciclo' : duplicate ? 'Já escolhido como ' + (otherRole==='support'?'apoio':'principal') : mine ? 'Selecionado como ' + (o.activeRole === 'support' ? 'apoio' : 'principal') : 'Escolher ' + esc(h.nome) + ' como ' + (o.activeRole === 'support' ? 'apoio' : 'principal')) + '</button>' +
          '<button type="button" class="ph-btn ph-btn--hist" data-act="hist">Ver histórico<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>' +
        '</div></div>';
    }
    function renderDetail(animate) {
      var h = by[viewing];
      detail.style.setProperty("--hc", h.cor);
      detail.innerHTML = detailHtml(h);
      detail.classList.remove("is-swap"); if (animate) { void detail.offsetWidth; detail.classList.add("is-swap"); }
    }
    function markCards() {
      cards.forEach(function (c) {
        var id = c.getAttribute("data-id");
        if (id === viewing) c.setAttribute("aria-current", "true"); else c.removeAttribute("aria-current");
        var role = o.roles && (o.roles.principal === id ? "Principal" : o.roles.support === id ? "Apoio" : null);
        c.classList.toggle("is-mine", !!role || id === chosen);
        c.querySelector(".ph-card__mine").innerHTML = svg("star") + (role || "Selecionado");
      });
    }

    /* --- celular: ficha em tela cheia --- */
    function syncMode() {
      var mob = mq.matches;
      root.classList.toggle("is-mobile", mob);
      if (!mob) {
        sheetOpen = false; detail.classList.remove("is-open");
        detail.removeAttribute("role"); detail.removeAttribute("aria-modal"); detail.removeAttribute("aria-hidden");
        detail.inert = false; [top, grid.parentNode, foot, root.querySelector(".ph-team-bar")].filter(Boolean).forEach(function (n) { n.inert = false; n.removeAttribute("aria-hidden"); });
      } else if (!sheetOpen) {
        detail.setAttribute("aria-hidden", "true"); detail.inert = true;
      }
    }
    function openSheet(card) {
      if (!mq.matches) return;
      lastCard = card || lastCard; sheetOpen = true;
      detail.inert = false; detail.removeAttribute("aria-hidden");
      detail.setAttribute("role", "dialog"); detail.setAttribute("aria-modal", "true");
      detail.classList.add("is-open");
      [top, grid.parentNode, foot, root.querySelector(".ph-team-bar")].filter(Boolean).forEach(function (n) { n.inert = true; n.setAttribute("aria-hidden", "true"); });
      var d = detail.querySelector(".ph-d"); detail.scrollTop = 0;
      setTimeout(function () { if (d) d.focus({ preventScroll: true }); }, 60);
    }
    function closeSheet() {
      if (!sheetOpen) return;
      sheetOpen = false; detail.classList.remove("is-open");
      detail.removeAttribute("role"); detail.removeAttribute("aria-modal");
      [top, grid.parentNode, foot, root.querySelector(".ph-team-bar")].filter(Boolean).forEach(function (n) { n.inert = false; n.removeAttribute("aria-hidden"); });
      detail.setAttribute("aria-hidden", "true"); detail.inert = true;
      if (lastCard) lastCard.focus({ preventScroll: true });
    }

    function view(id, fromCard) {
      if (!by[id]) return;
      var changed = id !== viewing; viewing = id;
      if (changed) renderDetail(true); else if (!detail.firstChild) renderDetail(false);
      markCards();
      if (mq.matches) { if (changed) renderDetail(false); openSheet(fromCard); }
    }
    function choose(id) {
      if (!by[id] || o.readOnly) return;
      if (o.persist === false) { if (typeof o.onSelect === "function") o.onSelect(by[id]); return; }
      chosen = id; save(id); markCards(); renderDetail(false);
      var h = by[id]; say(h.nome + " agora é o seu herói.");
      var b = detail.querySelector(".ph-btn--pick"); if (b) { b.classList.add("is-pop"); b.focus({ preventScroll: true }); }
      if (typeof o.onSelect === "function") o.onSelect(h);
    }

    /* --- eventos --- */
    function onClick(e) {
      var card = e.target.closest(".ph-card");
      if (card) return view(card.getAttribute("data-id"), card);
      if (e.target.closest(".ph-back")) return o.onClose && o.onClose();
      if (e.target.closest(".ph-d__back")) return closeSheet();
      var b = e.target.closest("[data-act]"); if (!b) return;
      if (b.getAttribute("data-act") === "pick") choose(viewing);
      else if (b.getAttribute("data-act") === "hist") {
        if (typeof o.onHistory === "function") o.onHistory(by[viewing]); else say("O histórico de " + by[viewing].nome + " ainda não está disponível nesta versão.");
      }
    }
    function onKey(e) {
      if (!root.isConnected) return document.removeEventListener("keydown", onKey);
      if (document.querySelector(".hero-history[open]")) return;
      if (e.key === "Escape" && sheetOpen) { e.preventDefault(); e.stopPropagation(); closeSheet(); }
      if (e.key === "Tab" && sheetOpen) {
        var f = [].slice.call(detail.querySelectorAll("button:not([disabled]), a[href], summary")); if (!f.length) return;
        var a = document.activeElement, d = detail.querySelector(".ph-d");
        if (e.shiftKey && (a === f[0] || a === d)) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && a === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    }
    function onMq() { syncMode(); }
    root.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    if (mq.addEventListener) mq.addEventListener("change", onMq); else if (mq.addListener) mq.addListener(onMq);

    renderDetail(false); markCards(); syncMode();

    function destroy() {
      clearTimeout(statusTimer);
      document.removeEventListener("keydown", onKey);
      if (mq.removeEventListener) mq.removeEventListener("change", onMq);
      if (root.parentNode) root.parentNode.removeChild(root);
    }
    return { root: root, destroy: destroy, view: function (id) { view(id, null); }, choose: choose, chosen: function () { return chosen; }, closeProfile: closeSheet, setSelection: function (id, roles, activeRole, readOnly) { chosen = by[id] ? id : null; o.roles = roles; o.activeRole = activeRole; o.readOnly = !!readOnly; markCards(); renderDetail(false); } };
  }

  global.PilhaHerois = { mount: mount };
})(typeof window !== "undefined" ? window : this);
