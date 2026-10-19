import {heroLevel} from './simulation/hero-progression.js';
import {readTimeline} from './simulation/mission-timeline.js';
import {HERO_ROSTER,getHero} from './hero-roster.js';
import {getHeroTeam,saveHeroTeam,validateHeroPair} from './simulation/hero-team.js';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const storage=()=>{try{return window.localStorage;}catch{return null;}};
let dialog=null,context={caseId:'01',view:'casos',host:null},editingCase='01',draft={},activeRole='principal',opener=null;
function summary(pair){return pair?getHero(pair.principal).name+' + '+getHero(pair.support).name:'Principal + apoio';}
/** Called after the host panel renders; does not change the existing game state. */
export function renderHeroTeamLauncher(host,view,caseId){
  context={host,view,caseId};
  if(!host||!['casos','equipe'].includes(view))return;
  const body=host.querySelector('.panel-body');if(!body)return;
  body.querySelector('.hero-launcher')?.remove();
  const runningCampaign=readTimeline(storage()).campaigns[caseId];const pair=runningCampaign?.team||getHeroTeam(storage(),caseId);
  const section=document.createElement('section');section.className='hero-launcher';
  section.innerHTML=`<div><span class="hero-eyebrow">DUPLA DA MISSÃO · PRÉVIA BETA</span><strong>${escape(summary(pair))}</strong><small>Caso ${escape(caseId)} · ${pair?'dupla salva neste navegador':'escolha duas competências complementares'}</small></div><button type="button" class="hero-open" aria-haspopup="dialog">${runningCampaign?'Dupla em missão':pair?'Alterar dupla':'Formar dupla'} <span aria-hidden="true">↗</span></button>`;
  section.querySelector('button').disabled=!!runningCampaign;section.querySelector('button').title=runningCampaign?'A dupla é preservada durante este ciclo. Consulte Habilidades e ciclo no salão.':'';section.querySelector('button').addEventListener('click',e=>openHeroTeam(caseId,e.currentTarget));
  body.prepend(section);
}
function ensureDialog(){
  if(dialog)return;
  dialog=document.createElement('dialog');dialog.className='hero-dialog';dialog.id='hero-team-dialog';dialog.setAttribute('aria-labelledby','hero-team-title');dialog.setAttribute('aria-describedby','hero-team-intro');
  dialog.addEventListener('click',event=>{
    const btn=event.target.closest('button');if(!btn)return;
    if(btn.hasAttribute('data-hero-close')){dialog.close();return;}
    if(btn.dataset.heroRole){activeRole=btn.dataset.heroRole;paint(btn.dataset.heroRole);return;}
    if(btn.dataset.heroId){
      const id=btn.dataset.heroId,other=activeRole==='principal'?'support':'principal';
      if(draft[other]===id){announce('Este herói já ocupa a outra posição. Escolha outro ou use Trocar funções.');return;}
      draft[activeRole]=id;
      if(activeRole==='principal'&&!draft.support)activeRole='support';
      paint(id);return;
    }
    if(btn.hasAttribute('data-hero-swap')){[draft.principal,draft.support]=[draft.support,draft.principal];paint('swap');return;}
    if(btn.hasAttribute('data-hero-save')){
      if(readTimeline(storage()).campaigns[editingCase]){announce('Esta dupla já iniciou um ciclo e está preservada. Feche para acompanhar a missão.');return;}
      const result=saveHeroTeam(storage(),editingCase,draft);
      if(!result.ok){announce(result.error==='storage-unavailable'?'O navegador não permitiu salvar. Sua seleção continua aberta; nenhum progresso do jogo foi alterado.':'Escolha dois heróis diferentes antes de salvar.');return;}
      document.dispatchEvent(new CustomEvent('pilha:hero-team-saved',{detail:{caseId:editingCase,team:{...result.team},bonusesApplied:false}}));
      dialog.close();renderHeroTeamLauncher(context.host,context.view,context.caseId);
      context.host?.querySelector('.hero-open')?.focus();
    }
  });
  dialog.addEventListener('close',()=>{if(opener?.isConnected)opener.focus();});
  document.body.appendChild(dialog);
}
function announce(message){const el=dialog.querySelector('.hero-notice');if(el)el.textContent=message;}
function paint(focus){
  const complete=!validateHeroPair(editingCase,draft),roleName=activeRole==='principal'?'principal':'de apoio';
  dialog.innerHTML=`<header class="hero-header"><div><span class="hero-eyebrow">PILHA+ GAME · LABORATÓRIO DA BETA</span><h2 id="hero-team-title">Forme sua dupla.</h2><p id="hero-team-intro">Caso ${escape(editingCase)}. Um herói principal e um de apoio, com competências complementares.</p></div><button type="button" class="hero-close" data-hero-close aria-label="Fechar seleção de heróis">×</button></header>
  <div class="hero-content"><div class="hero-roles" aria-label="Posição a preencher">${['principal','support'].map(role=>`<button type="button" class="hero-slot ${activeRole===role?'is-active':''} ${draft[role]?'is-filled':''}" data-hero-role="${role}" aria-pressed="${activeRole===role}"><span>${role==='principal'?'01 · PRINCIPAL':'02 · APOIO'}</span><strong>${escape(getHero(draft[role])?.name||'Escolher herói')}</strong><small>${role==='principal'?'Define a abordagem':'Complementa a equipe'}</small></button>`).join('')}</div>
  <p class="hero-selection-label">Escolha o herói <strong>${roleName}</strong><span>6 disponíveis · sem bloqueio por raridade</span></p>
  <div class="hero-grid">${HERO_ROSTER.map(hero=>{const role=draft.principal===hero.id?'Principal':draft.support===hero.id?'Apoio':null;return `<button type="button" class="hero-card ${role?'is-selected':''}" data-hero-id="${hero.id}" aria-pressed="${draft[activeRole]===hero.id}"><span class="hero-icon" aria-hidden="true">${hero.initials}</span><span class="hero-card-text"><span class="hero-card-top"><strong>${escape(hero.name)}</strong><span class="hero-level-inline">Nv. ${heroLevel(storage(),hero.id)}</span>${role?`<span class="hero-role-badge">${role}</span>`:''}</span><span class="hero-specialization">${escape(hero.specialization)}</span><small>${escape(hero.status)}${hero.rarity==='Épico'?' · Épico':''}</small></span></button>`;}).join('')}</div>
  <aside class="hero-scope-note"><strong>Seleção experimental, sem bônus automáticos.</strong> A dupla fica salva para testar a composição da equipe. Poderes, sinergias, números e novos modelos 3D ainda dependem de validação. O elenco atual do salão e sua pontuação não são alterados.</aside>
  </div><footer class="hero-footer"><p class="hero-notice" role="status" aria-live="polite">${complete?'Dupla completa. Pronta para salvar.':'Selecione dois heróis diferentes.'}</p><div><button type="button" class="hero-secondary" data-hero-swap ${!draft.principal&&!draft.support?'disabled':''}>Trocar funções</button><button type="button" class="hero-save" data-hero-save ${complete?'':'disabled'}>Salvar dupla <span aria-hidden="true">→</span></button></div></footer>`;
  const target=focus==='swap'?dialog.querySelector('[data-hero-swap]'):['principal','support'].includes(focus)?dialog.querySelector(`[data-hero-role="${focus}"]`):focus?dialog.querySelector(`[data-hero-id="${focus}"]`):null;
  target?.focus();
}
function openHeroTeam(caseId,source){
  if(readTimeline(storage()).campaigns[caseId])return;
  ensureDialog();editingCase=caseId;opener=source;const saved=getHeroTeam(storage(),caseId);draft=saved?{principal:saved.principal,support:saved.support}:{};activeRole='principal';paint();dialog.showModal();dialog.querySelector('[data-hero-role="principal"]').focus();
}

document.addEventListener('pilha:campaign-change',()=>renderHeroTeamLauncher(context.host,context.view,context.caseId));
