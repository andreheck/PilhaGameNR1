/* Presentation adapter. Reuses canonical heroes and existing selection handlers.
 * No economy, timer, powers, IDs or localStorage writes belong in this module. */
import {buildHeroGalleryData} from './hero-gallery-data.js';
export const NEON_VERSION = '2026-10-23.1';
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const esc = escapeHtml;
const P_MARK = '<svg viewBox="0 0 512 560" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M142 46h182c89 0 145 53 134 132-9 70-62 108-135 108h-52L155 500l33-198h-83L142 46Zm81 86-14 93h110c32 0 51-18 56-49 4-29-16-44-47-44H223Z"/></svg>';
function icon(name) {
 const path = window.PilhaHeroisDados?.ICONS?.[name] || 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 19.5a6 6 0 0 1 12 0M16.5 11a2.5 2.5 0 1 0 0-5M21 19.5a5 5 0 0 0-4-4.9';
 return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${esc(path)}"/></svg>`;
}
function brand() { return `<div class="neon-brand"><span class="neon-mark">${P_MARK}</span><strong>PILHA<span>+ GAME</span></strong><small>HER\u00d3IS DO<br>AMBIENTE<br>DE TRABALHO</small></div><p class="neon-slogan">Pessoas bem,<br>organiza\u00e7\u00f5es fortes.</p>`; }
function data() {
 let storage;try { storage=window.localStorage; } catch {}
 return buildHeroGalleryData(storage).LIST;
}
export function portraitMarkup(h, className = '') {
 return `<img class="${esc(className)}" src="${esc(h.img)}" alt="" decoding="async" loading="eager">`;
}
function entryCard(h) {
 return `<button type="button" class="neon-hero-card" data-entry="next" data-neon-preview="${esc(h.id)}" style="--hc:${esc(h.cor)}" aria-label="Ver ${esc(h.nome)} e formar minha dupla"><span class="neon-card-art">${portraitMarkup(h)}<span class="neon-card-icon">${icon(h.icone)}</span><span class="neon-card-level">Nv. ${h.nivel ?? '\u2014'}</span></span><span class="neon-card-info"><strong>${esc(h.nome)}</strong><span>${esc(h.especializacao)}</span><i aria-hidden="true">\u203a</i></span></button>`;
}
function enhanceEntry(root, list) {
 const card=root.querySelector('.entry-card');if(!card || card.dataset.neonVersion===NEON_VERSION)return;
 card.dataset.neonVersion=NEON_VERSION;card.classList.add('neon-entry');
 const header=card.querySelector('header');if(header)header.innerHTML=brand();
 const roster=card.querySelector('.entry-roster');
 if(roster){
  card.classList.add('neon-entry--team');
  const article=card.querySelector('article'), focused=article.contains(document.activeElement);
  const rules=article.querySelector('ul')?.outerHTML || '';
  article.innerHTML=`<div class="neon-entry-intro"><div><small>03 \u00b7 SUA EQUIPE INICIAL</small><h1 tabindex="-1"><em>Escolha a dupla</em> que vai apoiar suas decis\u00f5es.</h1><p>Cada her\u00f3i traz uma perspectiva. Escolha um principal e um apoio para come\u00e7ar sua jornada.</p></div><div class="neon-entry-facts"><span>${icon('users')}<b>1 principal<br>e 1 apoio</b></span><span>${icon('star')}<b>Compet\u00eancias<br>complementares</b></span><span>${icon('shield')}<b>Her\u00f3is e NPCs<br>s\u00e3o elencos distintos</b></span></div></div><div class="neon-entry-layout"><div class="neon-entry-roster" aria-label="Conhe\u00e7a os seis her\u00f3is">${list.map(entryCard).join('')}</div><aside class="neon-entry-guide"><span class="neon-guide-kicker">${icon('users')} SUA DUPLA INICIAL</span><h2>Monte sua equipe de <em>dois her\u00f3is</em></h2><p>Combine especialidades diferentes para investigar os desafios da empresa.</p><ol><li><b>1</b><div><strong>Escolha seu principal</strong><span>Sua refer\u00eancia na miss\u00e3o.</span></div></li><li><b>2</b><div><strong>Escolha o apoio</strong><span>Uma compet\u00eancia complementar.</span></div></li><li><b>3</b><div><strong>Confirme sua dupla</strong><span>Confira as fichas antes de salvar.</span></div></li></ol><div class="neon-entry-actions"><button type="button" data-entry="back">Voltar</button><button type="button" data-entry="next" class="entry-primary">Escolher meus dois her\u00f3is <span aria-hidden="true">\u2192</span></button></div><details class="neon-entry-rules"><summary>Como a dupla funciona no jogo</summary>${rules}<p>Os trabalhadores que circulam na empresa s\u00e3o NPCs, n\u00e3o os her\u00f3is da sua dupla.</p></details></aside></div>`;
  card.querySelector('footer')?.remove();
  if(focused)article.querySelector('h1')?.focus({preventScroll:true});
 }
 const pair=card.querySelector('.entry-pair');
 if(pair){
  pair.classList.add('neon-entry-pair');
  pair.querySelectorAll(':scope > span').forEach(slot=>{
   const h=list.find(h=>h.nome===slot.querySelector('strong')?.textContent);if(!h)return;
   const figure=document.createElement('div');figure.className='neon-pair-portrait';figure.style.setProperty('--hc',h.cor);figure.innerHTML=portraitMarkup(h);slot.prepend(figure);
  });
 }
}
function enhanceSlots(root,list){
 root.querySelectorAll('[data-hero-role]').forEach(button=>{
  if(button.querySelector('.neon-slot-label'))return;
  const strong=button.querySelector('strong'), small=button.querySelector('small');if(!strong||!small)return;
  const h=list.find(h=>h.nome===strong.textContent),label=document.createElement('span');label.className='neon-slot-label';label.append(small,strong);
  const art=document.createElement('span');art.className='neon-slot-art';art.innerHTML=h?portraitMarkup(h):icon('users');if(h)art.style.setProperty('--hc',h.cor);
  button.replaceChildren(art,label);
 });
}
function enhanceGallery(root,list){
 root.classList.add('neon-gallery');
 if(!root.querySelector('.neon-roster-heading')){
  const heading=document.createElement('h2');heading.className='neon-roster-heading';heading.innerHTML='Seu time de <em>her\u00f3is</em>';root.querySelector('.ph-roster')?.prepend(heading);
 }
 enhanceSlots(root,list);
 const d=root.querySelector('.ph-d');if(!d||d.dataset.neonVersion===NEON_VERSION)return;
 const name=d.querySelector('#ph-d-name')?.textContent;
 const h=list.find(h=>h.nome===name);if(!h)return;
 d.dataset.neonVersion=NEON_VERSION;d.dataset.heroId=h.id;
 const txt=d.querySelector('.ph-d__txt'),cta=d.querySelector('.ph-cta');
 const purpose=document.createElement('p');purpose.className='neon-purpose';purpose.textContent=h.resumo;
 txt.querySelector('blockquote')?.before(purpose);
 if(cta)txt.append(cta);
 const tiles=d.querySelector('.ph-tiles');
 if(tiles){
  const extra=document.createElement('div');extra.className='ph-tile neon-info-tile';extra.innerHTML=`<div class="neon-stat-icon">${icon(h.icone)}</div><h3>Especializa\u00e7\u00e3o</h3><p>${esc(h.especializacao)}</p>`;tiles.append(extra);
  const team=document.createElement('div');team.className='ph-tile neon-info-tile neon-team-tile';team.innerHTML=`<div class="neon-stat-icon">${icon('users')}</div><h3>Na sua dupla</h3><p>Principal ou apoio</p><small>Escolher n\u00e3o aplica b\u00f4nus automaticamente.</small>`;tiles.append(team);
 }
}
let requestedHero=null;
function start(){
 if(!document.getElementById('pilha-hero-neon-style')){
  const style=document.createElement('link');style.id='pilha-hero-neon-style';style.rel='stylesheet';style.href='/ui/hero-neon.css?v='+NEON_VERSION;document.head.append(style);
 }
 let scheduled=false,observer;
 const snapshots=new WeakMap();
 function snapshot(root){if(!snapshots.has(root))snapshots.set(root,data());return snapshots.get(root);}
 function paint(){
  scheduled=false;observer.disconnect();
  try{
   document.querySelectorAll('.player-entry').forEach(root=>enhanceEntry(root,data()));
   document.querySelectorAll('.hero-gallery-dialog .ph-root').forEach(root=>enhanceGallery(root,snapshot(root)));
   if(requestedHero){
    const target=document.querySelector(`.hero-gallery-dialog[open] .ph-card[data-id="${requestedHero}"]`);
    if(target){requestedHero=null;target.click();document.querySelectorAll('.hero-gallery-dialog .ph-root').forEach(root=>enhanceGallery(root,snapshot(root)));}
   }
  }catch(error){console.warn('Pilha: visual neon indisponivel; controles originais preservados.',error);}
  finally{observer.observe(document.body,{childList:true,subtree:true});}
 }
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(paint);}}
 observer=new MutationObserver(records=>{
  if(records.some(record=>record.target.nodeType===1 && (record.target.closest?.('.player-entry,.hero-gallery-dialog') || [...record.addedNodes].some(node=>node.nodeType===1 && (node.matches?.('.player-entry,.hero-gallery-dialog') || node.querySelector?.('.player-entry,.hero-gallery-dialog'))))))schedule();
 });
 document.addEventListener('click',event=>{const card=event.target.closest?.('[data-neon-preview]');if(card)requestedHero=card.dataset.neonPreview;},true);
 paint();
}
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
}
