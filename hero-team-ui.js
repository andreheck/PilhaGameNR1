import {readTimeline} from './simulation/mission-timeline.js';
import {getHero} from './hero-roster.js';
import {getHeroTeam,saveHeroTeam,validateHeroPair} from './simulation/hero-team.js';
import {buildHeroGalleryData,heroHistory} from './ui/hero-gallery-data.js';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const storage=()=>{try{return window.localStorage;}catch{return null;}};
let dialog=null,gallery=null,context={caseId:'01',view:'casos',host:null},editingCase='01',draft={},activeRole='principal',opener=null,readOnly=false,notice='';
function summary(pair){return pair?getHero(pair.principal).name+' + '+getHero(pair.support).name:'Principal + apoio';}
export function renderHeroTeamLauncher(host,view,caseId){
 context={host,view,caseId};if(!host||!['casos','equipe'].includes(view))return;
 const body=host.querySelector('.panel-body');if(!body)return;body.querySelector('.hero-launcher')?.remove();
 const running=readTimeline(storage()).campaigns[caseId],pair=running?.team||getHeroTeam(storage(),caseId);
 const section=document.createElement('section');section.className='hero-launcher';
 section.innerHTML=`<div><span class="hero-eyebrow">DUPLA DA MISSÃO · GALERIA DOS HERÓIS</span><strong>${escape(summary(pair))}</strong><small>Caso ${escape(caseId)} · ${running?'dupla preservada no ciclo':pair?'dupla salva neste navegador':'escolha duas competências complementares'}</small></div><button type="button" class="hero-open" aria-haspopup="dialog">${running?'Consultar dupla':pair?'Ver galeria / alterar dupla':'Formar dupla'} ↗</button>`;
 section.querySelector('button').addEventListener('click',e=>openHeroTeam(caseId,e.currentTarget));body.prepend(section);
}
function paintControls(focus){
 const controls=gallery?.root.querySelector('.ph-team-bar');if(!controls)return;
 const complete=!validateHeroPair(editingCase,draft);
 controls.innerHTML=`<div class="ph-team-intro"><strong id="hero-team-title">${readOnly?'Dupla em missão':'Forme sua dupla'}</strong><span id="hero-team-intro">Caso ${editingCase} · ${readOnly?'Consulta das fichas; composição preservada durante o ciclo.':'Escolha um principal e um apoio diferentes. Salvar não aplica bônus nem gasta créditos.'}</span></div><div class="ph-team-slots">${['principal','support'].map(role=>`<button type="button" data-hero-role="${role}" aria-pressed="${activeRole===role}" ${readOnly?'disabled':''}><small>${role==='principal'?'01 · PRINCIPAL':'02 · APOIO'}</small><strong>${escape(getHero(draft[role])?.name||'Escolher herói')}</strong></button>`).join('')}</div><div class="ph-team-actions"><p class="hero-notice" role="status">${escape(notice||(readOnly?'A dupla fica preservada até o encerramento do ciclo.':complete?'Dupla completa. Confira e salve.':'Abra uma ficha e escolha o herói '+(activeRole==='support'?'de apoio.':'principal.')))}</p><button type="button" data-hero-swap ${readOnly||!draft.principal&&!draft.support?'disabled':''}>Trocar funções</button><button type="button" class="ph-team-save" data-hero-save ${readOnly||!complete?'disabled':''}>${readOnly?'Dupla preservada':'Salvar dupla →'}</button><button type="button" data-hero-close aria-label="Fechar seleção de heróis">${readOnly?'Voltar ao jogo':'Cancelar'}</button></div>`;
 gallery.setSelection(draft[activeRole],{...draft},activeRole,readOnly);
 if(focus)controls.querySelector(focus)?.focus({preventScroll:true});
}
function openHistory(hero){
 const history=heroHistory(storage(),hero.id),h=document.createElement('dialog');h.className='hero-history';h.setAttribute('aria-label','Histórico de '+hero.nome);
 h.innerHTML=`<header><h2>${escape(hero.nome)} · Histórico</h2><button type="button" aria-label="Fechar histórico">×</button></header>${history.available?`<p>XP conquistado: <b>${history.earnedXp}</b> · Formação: <b>${history.trainingXp} XP</b></p><ul>${history.entries.map(e=>`<li>Caso ${e.caseId} · ${escape(e.label)} · +${e.xp} XP${e.at>0?' · '+new Date(e.at).toLocaleDateString('pt-BR'):''}</li>`).join('')||'<li>Nenhuma recompensa de missão registrada para este herói.</li>'}</ul><p>A formação aparece pelo total de XP salvo. Não são inventadas datas ou conquistas.</p>`:'<p>Os dados locais não puderam ser validados. Seu progresso foi preservado.</p>'}`;
 document.body.append(h);const source=document.activeElement;h.querySelector('button').onclick=()=>h.close();h.addEventListener('close',()=>{h.remove();if(source?.isConnected)source.focus();},{once:true});h.showModal();
}
function ensureDialog(){
 if(dialog)return;dialog=document.createElement('dialog');dialog.className='hero-gallery-dialog';dialog.id='hero-team-dialog';dialog.setAttribute('aria-labelledby','hero-team-title');dialog.setAttribute('aria-describedby','hero-team-intro');document.body.append(dialog);
 dialog.addEventListener('close',()=>{gallery?.destroy();gallery=null;if(opener?.isConnected)opener.focus();else context.host?.querySelector('.hero-open')?.focus();});
 dialog.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.hasAttribute('data-hero-close')){dialog.close();return;}
  if(b.dataset.heroRole){activeRole=b.dataset.heroRole;notice='';paintControls(`[data-hero-role="${activeRole}"]`);return;}
  if(b.hasAttribute('data-hero-swap')){if(readOnly)return;[draft.principal,draft.support]=[draft.support,draft.principal];notice='Funções trocadas. Salve para confirmar.';paintControls('[data-hero-swap]');return;}
  if(!b.hasAttribute('data-hero-save'))return;
  if(readTimeline(storage()).campaigns[editingCase]){notice='Esta dupla já iniciou um ciclo e está preservada.';readOnly=true;paintControls();return;}
  const result=saveHeroTeam(storage(),editingCase,draft);
  if(!result.ok){notice=result.error==='storage-unavailable'?'O navegador não permitiu salvar. A seleção permanece aberta e nenhum progresso foi alterado.':'Escolha dois heróis diferentes.';paintControls();return;}
  document.dispatchEvent(new CustomEvent('pilha:hero-team-saved',{detail:{caseId:editingCase,team:{...result.team},bonusesApplied:false}}));dialog.close();renderHeroTeamLauncher(context.host,context.view,context.caseId);
 });
}
function openHeroTeam(caseId,source){
 ensureDialog();editingCase=caseId;opener=source;const campaign=readTimeline(storage()).campaigns[caseId],saved=campaign?.team||getHeroTeam(storage(),caseId);draft=saved?{principal:saved.principal,support:saved.support}:{};activeRole='principal';readOnly=!!campaign;notice='';
 gallery?.destroy();dialog.innerHTML='';
 gallery=window.PilhaHerois.mount({container:dialog,data:buildHeroGalleryData(storage()),persist:false,selectedId:draft.principal,roles:{...draft},activeRole,readOnly,toolbarHtml:'<section class="ph-team-bar" aria-label="Escolha do principal e apoio"></section>',onClose:()=>dialog.close(),onHistory:openHistory,onSelect:hero=>{
  if(readOnly||readTimeline(storage()).campaigns[editingCase]){notice='O ciclo já começou; a dupla está preservada.';readOnly=true;paintControls();return;}
  const other=activeRole==='principal'?'support':'principal';if(draft[other]===hero.id){notice='Este herói já ocupa a outra posição. Escolha outro ou troque as funções.';paintControls();return;}
  draft[activeRole]=hero.id;notice='';if(activeRole==='principal'&&!draft.support)activeRole='support';paintControls();gallery.closeProfile();
  gallery.root.querySelector(!validateHeroPair(editingCase,draft)?'[data-hero-save]':`[data-hero-role="${activeRole}"]`)?.focus({preventScroll:true});
 }});
 paintControls();dialog.showModal();gallery.root.querySelector(readOnly?'.ph-back':'[data-hero-role="principal"]')?.focus();
}
document.addEventListener('pilha:campaign-change',()=>renderHeroTeamLauncher(context.host,context.view,context.caseId));
export function chooseInitialPair(source){
 const frozen=readTimeline(storage()).campaigns['01']?.team;if(frozen)return Promise.resolve(frozen);
 return new Promise(resolve=>{openHeroTeam('01',source);dialog.addEventListener('close',()=>resolve(getHeroTeam(storage(),'01')||null),{once:true});});
}
