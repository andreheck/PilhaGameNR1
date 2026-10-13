/* Fallback acessivel da Biblioteca NR-1; opera sem Three.js ou WebGL. */
(()=>{
 'use strict';
 const KEY='pilha-missao01-v1';
 const $=id=>document.getElementById(id);
 const ids=['saude-mental','fatores-psicossociais','seguranca-psicologica'];
 let cfg=null,current=null,lastFocus=null;
 function read(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}}
 function save(s){try{localStorage.setItem(KEY,JSON.stringify(s));return true}catch{return false}}
 function state(){const s=read();return s&&s.version===1?s:{version:1,phase:'explore',explored:[],answers:{},score:0,correct:0,completed:false,certified:false};}
 function progress(){
   const done=new Set(Array.isArray(state().explored)?state().explored:[]);
   const total=ids.filter(id=>done.has(id)).length;
   $('score-line').textContent=`${total}/3 leituras · ${total*20}/60 pontos`;
   $('read-counter').textContent=`${total}/3`;
   $('track-fill').style.width=`${total/3*100}%`;
   const list=$('station-list');list.replaceChildren();
   for(const st of cfg.stations){
     const button=document.createElement('button');button.type='button';button.className='station-item';
     const number=document.createElement('span');number.className='station-n';number.textContent=st.number;
     const desc=document.createElement('span');desc.className='station-desc';
     const name=document.createElement('strong');name.textContent=st.label;
     const sub=document.createElement('span');sub.textContent=st.subtitle;
     desc.append(name,sub);
     const sign=document.createElement('span');sign.className='station-done';sign.textContent=done.has(st.id)?'✓':'+';
     button.append(number,desc,sign);button.setAttribute('aria-label',`Ler estação ${st.number}: ${st.label}`);
     button.addEventListener('click',()=>open(st));list.append(button);
   }
 }
 function close(){
   $('dialog-backdrop').hidden=true;current=null;
   if(lastFocus?.isConnected)lastFocus.focus();else $('talk-mentor').focus();
 }
 function open(st){
   lastFocus=document.activeElement;
   current=st.id;
   $('dialog-kicker').textContent=`ESTAÇÃO ${st.number}`;
   $('dialog-title').textContent=st.label;
   $('dialog-definition').textContent=st.definition;
   $('dialog-expanded').textContent=st.expanded;
   $('dialog-example').textContent=st.workExample;
   $('dialog-takeaway').textContent=st.keyInsight;
   $('dialog-complete').textContent=state().explored?.includes(st.id)?'Leitura já concluída':'Concluir leitura (+20)';
   for(const id of ['dialog-expanded-title','dialog-example-title','dialog-takeaway-title','dialog-expanded','dialog-example'])$(id).hidden=false;
   $('dialog-takeaway').parentElement.hidden=false;
   $('dialog-complete').hidden=false;
   $('dialog-backdrop').hidden=false;
   $('dialog-close').focus();
 }
 function mentor(){
   lastFocus=document.activeElement;current=null;
   $('dialog-kicker').textContent='FACILITADOR DE APRENDIZAGEM';
   $('dialog-title').textContent=cfg.mentor.name;
   $('dialog-definition').textContent=cfg.mentor.intro;
   $('dialog-expanded').textContent=cfg.mentor.direction;
   $('dialog-expanded').hidden=false;$('dialog-expanded-title').hidden=false;
   for(const id of ['dialog-example-title','dialog-takeaway-title','dialog-example'])$(id).hidden=true;
   $('dialog-takeaway').parentElement.hidden=true;
   $('dialog-complete').hidden=true;
   $('dialog-backdrop').hidden=false;
   $('dialog-close').focus();
 }
 async function boot(){
   // Um modulo Three.js funcional assume a cena; nao duplique os ouvintes nem o estado.
   if(window.__pilha3DReady)return;
   window.__pilha3DFallbackActive=true;
   $('status').textContent='Modo de leitura disponível. A visualização 3D não carregou neste dispositivo.';
   document.querySelectorAll('[data-dir]').forEach(b=>{b.disabled=true;b.hidden=true});
   $('interact').hidden=true;
   try{
     const r=await fetch('/content/mission01.json',{cache:'no-store'});if(!r.ok)throw Error(`HTTP ${r.status}`);
     cfg=await r.json();if(!Array.isArray(cfg.stations)||cfg.stations.length!==3)throw Error('Dados incompletos');
     progress();
     $('talk-mentor').addEventListener('click',mentor);
     $('dialog-close').addEventListener('click',close);
     $('dialog-back').addEventListener('click',close);
     $('dialog-backdrop').addEventListener('click',e=>{if(e.target===$('dialog-backdrop'))close()});
     $('dialog-complete').addEventListener('click',()=>{
       if(!current)return;const s=state();if(!Array.isArray(s.explored))s.explored=[];
       if(!s.explored.includes(current))s.explored.push(current);
       if(s.phase==='intro')s.phase='explore';
       $('status').textContent=save(s)?'Leitura registrada na Missão 01.':'Não foi possível salvar este progresso.';
       progress();close();
     });
     document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('dialog-backdrop').hidden)close()});
   }catch(err){
     $('status').textContent='Conteúdo temporariamente indisponível.';
     $('station-list').innerHTML='<a href="/missao01.html" class="outline">Abrir versão 2D acessível</a>';
   }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,4000));
 else setTimeout(boot,4000);
})();
