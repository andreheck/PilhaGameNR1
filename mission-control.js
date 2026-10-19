import {HERO_CONCEPTS} from './hero-concepts.js';
import {HERO_ROSTER,getHero} from './hero-roster.js';
import {getHeroTeam} from './simulation/hero-team.js';
import {ABILITIES,getAbility,abilityState} from './simulation/hero-abilities.js';
import {TIMELINE_KEY,CYCLE_MS,CHECKPOINT_DAYS,AXIS_LABELS,simulationDay,realMsForDays,createCampaign,advanceCampaign,setCampaignRunning,registerPurchase,activateAbility,evaluateCampaign,readTimeline,writeTimeline,isCycleComplete} from './simulation/mission-timeline.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const storage=()=>{try{return localStorage;}catch{return null;}};
const duration=ms=>{const sec=Math.ceil(Math.max(0,ms)/1000),h=Math.floor(sec/3600),m=Math.floor(sec%3600/60);return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;};
const PHASES={preparing:'Preparando',active:'Em atuação',fading:'Efeito diminuindo',cooldown:'Em recarga',ready:'Disponível',invalid:'Indisponível'};
let state=readTimeline(storage()),context='01',strip,dialog,hooks={},owns=false,releaseLock=null,lastTime=0,lastSave=0,notice='',shownPhases=new Map();
const ownerId=globalThis.crypto?.randomUUID?.()||String(Math.random());
let timer=null,lockGeneration=0;
function persist(){const ok=writeTimeline(storage(),state);if(!ok){notice='O navegador não permitiu salvar. O relógio foi pausado para proteger seu progresso.';owns=false;releaseLock?.();releaseLock=null;for(const c of Object.values(state.campaigns))if(c.status==='running')c.status='paused';}return ok;}
function campaign(id=context){return state.campaigns[id]||null;}
function currentPair(){return campaign()?.team||getHeroTeam(storage(),context);}
function notify(){render();document.dispatchEvent(new CustomEvent('pilha:campaign-change',{detail:{caseId:context}}));}
async function acquire(){
 if(owns)return true;
 if(navigator.locks){const generation=++lockGeneration;return new Promise(resolve=>{navigator.locks.request('pilha-active-campaign',{ifAvailable:true},async lock=>{if(!lock){resolve(false);return;}owns=true;resolve(true);await new Promise(r=>{releaseLock=r;});if(generation===lockGeneration)owns=false;}).catch(()=>resolve(false));});}
 try{const store=storage(),lease=JSON.parse(store?.getItem('pilha-clock-lease')||'null');if(lease&&lease.until>Date.now()&&lease.owner!==ownerId)return false;store.setItem('pilha-clock-lease',JSON.stringify({owner:ownerId,until:Date.now()+6000}));owns=true;releaseLock=()=>{owns=false;const l=JSON.parse(store.getItem('pilha-clock-lease')||'null');if(l?.owner===ownerId)store.removeItem('pilha-clock-lease');};return true;}catch{return false;}
}
async function start(id=context){
 if(owns&&state.activeCaseId===id&&campaign(id)?.status==='running'){tick();context=id;render();return true;}
 if(owns){tick();if(!persist())return false;}
 if(isCycleComplete(campaign(id))){context=id;render();return true;}
 if(!hooks.canStart?.(id)){notice='Conclua a missão anterior para iniciar este ciclo.';render();return false;}
 const pair=campaign(id)?.team||getHeroTeam(storage(),id);
 if(!pair?.principal||!pair?.support){notice='Forme e salve a dupla antes de iniciar o ciclo.';hooks.formTeam?.(id);render();return false;}
 if(document.hidden)return false;
 if(!await acquire()){notice='O ciclo está aberto em outra aba. Pause lá antes de continuar aqui.';render();return false;}
 state=readTimeline(storage());context=id;
 for(const c of Object.values(state.campaigns))if(c.caseId!==id&&c.status==='running')c.status='paused';
 if(!campaign(id))state.campaigns[id]=createCampaign(id,pair,hooks.inventory?.()||[],Date.now());
 state.activeCaseId=id;state.campaigns[id]=setCampaignRunning(campaign(id),true);lastTime=performance.now();lastSave=lastTime;
 if(!persist()){render();return false;}notice='';notify();return true;
}
function pause(message='Ciclo pausado. Seu tempo ativo e sua dupla estão salvos.'){
 tick();const c=state.campaigns[state.activeCaseId];if(owns&&c){state.campaigns[c.caseId]=setCampaignRunning(c,false);persist();}releaseLock?.();releaseLock=null;owns=false;notice=message;render();
}
function tick(){
 const c=state.campaigns[state.activeCaseId],now=performance.now(),delta=now-lastTime;lastTime=now;
 if(!owns||!c||c.status!=='running'||document.hidden)return;
 if(!navigator.locks){try{const lease=JSON.parse(storage().getItem('pilha-clock-lease')||'null');if(lease?.owner!==ownerId){owns=false;notice='Relógio assumido por outra aba.';render();return;}storage().setItem('pilha-clock-lease',JSON.stringify({owner:ownerId,until:Date.now()+6000}));}catch{owns=false;releaseLock?.();releaseLock=null;notice='Armazenamento indisponível; relógio pausado.';render();return;}}
 // Long suspension/sleep gaps do not silently count as play time.
 if(delta>5000||delta<0){notice='Intervalo de suspensão ignorado; a contagem retomou sem avançar no tempo ausente.';render();return;}
 const previousCheckpoints=c.checkpoints.length;
 state.campaigns[c.caseId]=advanceCampaign(c,delta);const updated=campaign(c.caseId);
 if(now-lastSave>=5000||updated.status==='complete'||updated.checkpoints.length>previousCheckpoints){persist();lastSave=now;}
 if(updated.checkpoints.length>previousCheckpoints){hooks.message?.('Marco de acompanhamento: dia '+updated.checkpoints.at(-1)+'.');hooks.checkpoint?.(updated.caseId,updated.checkpoints.at(-1));}
 const ev=evaluateCampaign(updated);
 for(const effect of ev.contributors.filter(e=>e.kind==='ability')){const key=updated.caseId+effect.abilityId,prior=shownPhases.get(key);if(prior!==effect.phase){shownPhases.set(key,effect.phase);if(effect.phase==='active'){const a=getAbility(effect.abilityId);hooks.effect?.(a.target,a.name);}}}
 if(updated.status==='complete'){releaseLock?.();releaseLock=null;owns=false;notice='30 dias acompanhados. Revise o resultado das decisões para concluir a missão.';hooks.complete?.(updated.caseId);}
 render();
}
function action(abilityId){const c=campaign();if(!c||!owns){notice='Retome o ciclo nesta aba antes de ativar uma habilidade.';render();return;}const result=activateAbility(c,abilityId);if(!result.ok){notice=result.error==='cooldown'?'A habilidade ainda está em preparação, atuação ou recarga.':'Retome o ciclo com o especialista designado para ativar a habilidade.';}else{state.campaigns[context]=result.campaign;if(persist())notice='Habilidade programada. O efeito respeitará preparação, duração e recarga.';}render(true);}
function render(expanded=false){
 if(!strip)return;const c=campaign(),pair=currentPair(),d=simulationDay(c?.elapsedMs||0),running=owns&&c?.status==='running',complete=isCycleComplete(c);
 strip.querySelector('[data-mission-case]').textContent='CASO '+context+' · VOCÊ É O ACIONISTA';
 for(const role of ['principal','support']){const h=getHero(pair?.[role]);strip.querySelector('[data-mission-'+role+']').textContent=h?.name||(role==='principal'?'Principal não escolhido':'Apoio não escolhido');}
 strip.querySelector('[data-mission-clock]').textContent=duration(c?.elapsedMs||0);
 strip.querySelector('[data-mission-day]').textContent=`Dia ${d.toFixed(1)} de 30 · ${complete?'ciclo acompanhado':running?'em andamento':c?'pausado':'não iniciado'}`;
 strip.querySelector('progress').value=Math.min(1,(c?.elapsedMs||0)/CYCLE_MS);
 strip.querySelector('[data-mission-toggle]').textContent=running?'Pausar':complete?'Ciclo acompanhado':c?'Retomar ciclo':'Iniciar ciclo';
 strip.querySelector('[data-mission-toggle]').disabled=complete;
 strip.querySelector('[data-mission-notice]').textContent=notice;
 const fields=dialog?.open?dialog:null;if(fields){
  fields.querySelector('[data-detail-time]').textContent=`Dia ${d.toFixed(2)} · ${duration(c?.elapsedMs||0)} de ${duration(CYCLE_MS)} reais ativos`;
  fields.querySelector('[data-detail-note]').textContent=notice;
  const evaluation=c?evaluateCampaign(c):{axes:{space:50,people:50,culture:50,operations:50}};
  for(const [key,value] of Object.entries(evaluation.axes)){const cell=fields.querySelector(`[data-axis="${key}"]`);cell.querySelector('b').textContent=value.toFixed(1);cell.querySelector('meter').value=value;}
  fields.querySelectorAll('[data-checkpoint]').forEach(el=>el.classList.toggle('done',d>=Number(el.dataset.checkpoint)));
  if(expanded||fields.dataset.case!==context){paintDetails();return;}
  fields.querySelectorAll('[data-ability-status]').forEach(el=>{const a=getAbility(el.dataset.abilityStatus),last=c?.actions?.filter(x=>x.abilityId===a.id).at(-1),phase=last?abilityState(last,d):null;el.textContent=phase?`${PHASES[phase.phase]}${phase.remainingDays>0?' · '+duration(realMsForDays(phase.remainingDays))+' reais restantes':''}`:'Aguardando comando do acionista';const btn=el.parentElement.querySelector('[data-activate]');if(btn)btn.disabled=!running||!!phase&&phase.phase!=='ready';});
 }
}
function paintDetails(){
 const pair=currentPair(),c=campaign(),profiles=['principal','support'].map(role=>{const hero=getHero(pair?.[role]);if(!hero)return `<article class="mission-specialist"><h3>${role==='principal'?'Principal':'Apoio'} não escolhido</h3></article>`;const skills=ABILITIES.filter(a=>a.heroId===hero.id);return `<article class="mission-specialist"><small>${role==='principal'?'ESPECIALISTA PRINCIPAL':'ESPECIALISTA DE APOIO'} · NÍVEL 1</small><h3>${esc(hero.name)}</h3><p>${esc(hero.specialization)}</p>${skills.length?skills.map(a=>`<section class="ability"><h4>${esc(a.name)} <span>${a.kind==='passive'?'Passiva':'Ativa'}</span></h4><p>${esc(a.description)}</p><dl><div><dt>Preparação</dt><dd>${a.delayDays} dia(s) · ${duration(realMsForDays(a.delayDays))}</dd></div><div><dt>Duração</dt><dd>${a.durationDays} dias simulados</dd></div><div><dt>Recarga após efeito</dt><dd>${a.cooldownDays} dias</dd></div></dl><strong data-ability-status="${a.id}"></strong>${a.kind==='active'?`<button type="button" data-activate="${a.id}">Ativar habilidade</button>`:''}</section>`).join(''):'<p class="pending-skill">Especialista disponível para compor a dupla. Confira abaixo as habilidades documentadas. Quando não houver ficha consolidada, os efeitos permanecerão pendentes.</p>'}${(HERO_CONCEPTS[hero.id]||[]).map(skill=>`<section class="ability concept-ability"><h4>${esc(skill.name)} <span>${esc(skill.kind)}</span></h4><p>${esc(skill.effect)}</p><strong>Conceito documentado · programação temporal ainda não ativada.</strong></section>`).join('')}${!skills.length&&!HERO_CONCEPTS[hero.id]?'<p class="pending-skill">Ficha individual em validação. Não há poderes inventados para este especialista.</p>':''}</article>`;}).join('');
 dialog.innerHTML=`<header><div><small>PAINEL DO ACIONISTA · CASO ${context}</small><h2>Especialistas em atuação</h2><p data-detail-time></p></div><button type="button" data-mission-close aria-label="Fechar painel do acionista">×</button></header><div class="mission-detail-body"><p>Você define o orçamento, seleciona especialistas e compra melhorias no inventário. Os efeitos simulados amadurecem no espaço, nas condições das pessoas e nas práticas de trabalho.</p><div class="mission-checkpoints">${CHECKPOINT_DAYS.map(day=>`<span data-checkpoint="${day}">${day===30?'Fechamento':'Dia '+day}<small>${duration(realMsForDays(day))}</small></span>`).join('')}</div><div class="mission-axis-grid">${Object.entries(AXIS_LABELS).map(([key,label])=>`<div data-axis="${key}"><span>${label}</span><b>50.0</b><meter min="0" max="100" value="50"></meter></div>`).join('')}</div><p class="mission-disclaimer">Índices sintéticos do modelo de jogo (base 50/100). Não são probabilidades, diagnósticos, avaliação de pessoas ou comprovação de conformidade. O orçamento, as notas pedagógicas e estes índices são controles separados.</p><div class="mission-specialists">${profiles}</div><h3>Inventário acompanhado</h3><ul>${c?.inventory?.length?c.inventory.map(r=>`<li>${esc(r.id)} · ${r.inherited?'disponível ao iniciar':'comprado no dia '+r.atDay.toFixed(1)}</li>`).join(''):'<li>Nenhuma melhoria registrada para este ciclo.</li>'}</ul><p>O ciclo conta apenas com o jogo em primeiro plano. Ao sair ou ocultar a aba, pause e retome quando retornar. Não é necessário ficar clicando. A dupla é preservada durante o ciclo. Novos visuais 3D dos seis heróis ainda não estão incluídos.</p><p data-detail-note role="status"></p></div>`;
 dialog.dataset.case=context;render();
}
export function initMissionControl(config){hooks=config;strip=document.createElement('section');strip.className='mission-strip';strip.setAttribute('aria-label','Dupla e ciclo da missão');strip.innerHTML='<div class="mission-team"><small data-mission-case></small><strong><span data-mission-principal></span> <i>+</i> <span data-mission-support></span></strong><span class="mission-role-key">principal · apoio</span></div><div class="mission-time"><b data-mission-clock></b><span data-mission-day></span><progress max="1" value="0" aria-label="Progresso do ciclo de 30 dias"></progress></div><div class="mission-buttons"><button type="button" data-mission-toggle>Iniciar ciclo</button><button type="button" data-mission-details>Habilidades e ciclo</button></div><p data-mission-notice role="status"></p>';
 document.querySelector('.stage-top').after(strip);
 dialog=document.createElement('dialog');dialog.className='mission-dialog';dialog.setAttribute('aria-label','Painel do acionista');document.body.appendChild(dialog);
 strip.addEventListener('click',async e=>{if(e.target.closest('[data-mission-toggle]')){if(owns&&campaign()?.status==='running')pause();else await start();}if(e.target.closest('[data-mission-details]')){paintDetails();dialog.showModal();render();}});
 dialog.addEventListener('click',e=>{if(e.target.closest('[data-mission-close]'))dialog.close();const btn=e.target.closest('[data-activate]');if(btn)action(btn.dataset.activate);});
 document.addEventListener('pilha:hero-team-saved',()=>{notice='Dupla salva e disponível para esta missão.';render();});
 window.addEventListener('storage',e=>{if(e.key===TIMELINE_KEY&&!owns){state=readTimeline(storage());render();}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&owns)pause('Pausa automática: retome o ciclo ao voltar ao jogo.');});
 window.addEventListener('pagehide',()=>{if(owns)pause();});
 timer=setInterval(tick,1000);render();
 return {setContext(id){context=id;render();},get(id=context){return campaign(id);},ensureStart:start,pause,isComplete:id=>isCycleComplete(campaign(id)),canFinish:id=>isCycleComplete(campaign(id)),recordPurchase(id){const cid=state.activeCaseId,c=campaign(cid);if(c){const result=registerPurchase(c,id);if(result.ok){state.campaigns[cid]=result.campaign;persist();render(true);}}},dispose(){clearInterval(timer);pause();strip.remove();dialog.remove();}};
}
