const KEY='pilha-first-objective-v1';
const EMPTY={version:1,status:'new',step:0};
const copy=value=>JSON.parse(JSON.stringify(value));
export function readFirstObjective(storage){
 try{const raw=storage?.getItem(KEY);if(!raw)return copy(EMPTY);if(raw.length>2048)throw Error('large');const v=JSON.parse(raw);if(v?.version!==1||!['new','pending','skipped','complete'].includes(v.status)||!Number.isInteger(v.step)||v.step<0||v.step>3)throw Error('invalid');const p=v.purchase&&typeof v.purchase==='object'?{name:String(v.purchase.name||'').slice(0,100),sector:String(v.purchase.sector||'').slice(0,80),cost:Number.isFinite(v.purchase.cost)?Math.max(0,v.purchase.cost):0,timing:String(v.purchase.timing||'').slice(0,240)}:null;return {version:1,status:v.status,step:v.step,purchase:p};}catch{return copy(EMPTY);}
}
export function writeFirstObjective(storage,value){
 const p=value?.purchase,safe={version:1,status:['new','pending','skipped','complete'].includes(value?.status)?value.status:'new',step:Number.isInteger(value?.step)?Math.max(0,Math.min(3,value.step)):0,purchase:p&&typeof p==='object'?{name:String(p.name||'').slice(0,100),sector:String(p.sector||'').slice(0,80),cost:Number.isFinite(p.cost)?Math.max(0,p.cost):0,timing:String(p.timing||'').slice(0,240)}:null};
 try{storage?.setItem(KEY,JSON.stringify(safe));return true;}catch{return false;}
}
const esc=text=>String(text??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function createFirstObjective({storage,getState,openProduction,scrollToShop}){
 let dialog=null;
 const current=()=>readFirstObjective(storage);
 function save(next){writeFirstObjective(storage,next);}
 function close(){if(dialog?.open)dialog.close();}
 function render(){
  const s=current(),previous=dialog;if(previous){previous.removeEventListener('click',onClick);if(previous.open)previous.close();previous.remove();dialog=null;}
  dialog=document.createElement('dialog');dialog.className='first-objective';dialog.setAttribute('aria-labelledby','first-objective-title');
  const content=[
   {eyebrow:'GUIA OPCIONAL · 60–90 SEGUNDOS',title:'Primeira decisão da empresa',text:'Observe um setor, compare uma melhoria e veja quando ela começa a fazer efeito. Você decide se quer comprar; pode pular ou voltar a este guia pelo Menu.',button:'Começar'},
   {eyebrow:'ETAPA 1 DE 3 · OBSERVE',title:'Comece pela Produção',text:'Veja os indicadores e a situação do setor. Os números são fictícios e mostram tendências do ambiente, não diagnósticos de pessoas.',button:'Abrir Produção'},
   {eyebrow:'ETAPA 2 DE 3 · COMPARE',title:'Compare antes de investir',text:'Nos cards da loja, confira o custo, os fatores que mudam e o prazo do efeito. A compra é opcional e não avança o calendário.',button:'Ver melhorias'},
   {eyebrow:'ETAPA 3 DE 3 · ACOMPANHE',title:'Sua escolha ficou registrada',text:s.purchase?`${s.purchase.name} · ${s.purchase.sector} · ${s.purchase.cost.toLocaleString('pt-BR')} créditos. Prazo: ${s.purchase.timing}. A compra não avança a semana. Uma semana simulada dura 15 minutos reais ativos. Eventos chegam como ligações e aguardam sua decisão com o relógio pausado.`:'Escolha uma melhoria para ver aqui o custo e o prazo. A compra é sua decisão e não avança a semana. Uma semana simulada dura 15 minutos reais ativos. Eventos chegam como ligações e aguardam sua decisão com o relógio pausado.',button:s.purchase?'Concluir guia':'Voltar para a loja'}
  ];
  const p=content[s.step];
  dialog.innerHTML=`<section class="first-objective-card"><header><span>AO TRABALHO <b>· PRIMEIROS PASSOS</b></span><button data-guide="close" aria-label="Fechar guia">×</button></header><small class="first-objective-eyebrow">${esc(p.eyebrow)}</small><h2 id="first-objective-title">${esc(p.title)}</h2><p>${esc(p.text)}</p>${s.step===0?'<p class="first-objective-note">Heróis são conselheiros. Três gerentes e três funcionários foram contratados para circular no mapa.</p>':''}<footer><button data-guide="skip">Pular guia</button><button class="first-objective-primary" data-guide="next">${esc(p.button)}</button></footer></section>`;
  const instance=dialog;document.body.append(instance);instance.addEventListener('click',onClick);instance.addEventListener('close',()=>{instance.remove();if(dialog===instance)dialog=null;},{once:true});instance.showModal();
 }
 function onClick(e){const b=e.target.closest('[data-guide]');if(!b)return;const action=b.dataset.guide,s=current();if(action==='close'){close();return;}if(action==='skip'){save({...s,status:'skipped'});close();return;}if(action!=='next')return;
  if(s.step===0){save({...s,status:'pending',step:1});render();return;}
  if(s.step===1){save({...s,status:'pending',step:2});close();openProduction?.();setTimeout(()=>{scrollToShop?.();render();},160);return;}
  if(s.step===2){close();openProduction?.();setTimeout(()=>{scrollToShop?.();},80);return;}
  if(s.step===3&&s.purchase){save({...s,status:'complete',step:3});close();return;}
  if(s.step===3){save({...s,status:'pending',step:2,purchase:null});close();openProduction?.();setTimeout(()=>scrollToShop?.(),80);return;}
 }
 function startAfterHiring(){if(getState()?.initialHiring?.status!=='complete')return false;const s=current();save({version:1,status:'pending',step:s.status==='new'?0:s.step,purchase:s.purchase});render();return true;}
 function open(){const s=current();if(s.status==='complete')save({...s,status:'pending',step:0,purchase:null});else if(s.status==='skipped')save({...s,status:'pending'});render();}
 function onPurchase(detail){const s=current();if(s.status!=='pending'||s.step!==2)return;const purchase={name:detail.name,sector:detail.sector,cost:detail.cost,timing:detail.timing};save({...s,step:3,purchase});render();}
 function dispose(){close();window.removeEventListener('pilha:guided-purchase',purchaseListener);}
 const purchaseListener=e=>onPurchase(e.detail||{});window.addEventListener('pilha:guided-purchase',purchaseListener);
 return {startAfterHiring,open,dispose,getState:current};
}
