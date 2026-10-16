import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import assert from 'node:assert/strict';
const ROOT=path.resolve(import.meta.dirname,'..');
const file=name=>fs.readFileSync(path.join(ROOT,name),'utf8');
const cfg=JSON.parse(file('content/mission01.json'));
assert.equal(cfg.stations.length,3);
assert.equal(cfg.quiz.length,3);
assert.equal(cfg.rules.maximumScore,100);
assert.equal(cfg.rules.passScore,70);
assert.equal(cfg.rules.minimumCorrect,2);
for(const q of cfg.quiz)assert.equal(q.options.filter(o=>o.id===q.correct).length,1);
let error=null;
const source=file('mission01.js');
const harness=source.replace('boot();\n})();',`globalThis.__gameTest={
  get:()=>state,set(x){state={...initial(),...x}},
  getScore:()=>score(), command, render, setOpened(id){opened=id},
  finish:()=>complete(),loaded:()=>!!config
};
boot();
})();`);
assert.ok(harness.includes('__gameTest'));
function mockStore(seed={}){const db=new Map(Object.entries(seed));return {db,getItem:k=>db.get(k)??null,setItem:(k,v)=>db.set(k,String(v)),removeItem:k=>db.delete(k)}}
function initMission(seed={}){
 const store=mockStore(seed),listeners={};const app={innerHTML:'',focus(){}};
 const context={
  console,URLSearchParams,window:{addEventListener(){},scrollTo(){}},
  location:{reload(){}},localStorage:store,
  document:{getElementById:()=>app,addEventListener:(k,v)=>listeners[k]=v,querySelector:()=>null},
  fetch:async uri=>({ok:uri==='/content/mission01.json',json:async()=>cfg})
 };
 context.globalThis=context;
 vm.createContext(context);
 vm.runInContext(harness,context,{filename:'mission01.js',timeout:2000});
 return {api:context.__gameTest,app,store,context,listeners};
}
const t=initMission();
await new Promise(resolve=>setImmediate(resolve));
assert.ok(t.api.loaded());
assert.match(t.app.innerHTML,/Sua jornada começa pelo conhecimento/);
t.api.command('start',{});
assert.equal(t.api.get().phase,'explore');
for(const item of cfg.stations){
 t.api.setOpened(item.id);
 t.api.command('markStation',{dataset:{id:item.id}});
}
assert.equal(t.api.get().explored.length,3);
t.api.command('beginQuiz',{});
assert.equal(t.api.get().phase,'quiz');
for(let i=0;i<3;i++){
 const question=cfg.quiz[i];
 t.api.get().answers[question.id]=question.correct;
 t.api.command('confirmAnswer',{});
 assert.equal(t.api.get().feedback,true);
 t.api.command('nextQuestion',{});
}
assert.equal(t.api.get().phase,'result');
assert.equal(t.api.getScore().total,100);
assert.equal(t.api.getScore().passed,true);
assert.equal(t.api.get().correct,3);
assert.match(t.app.innerHTML,/Iniciar Caso 01/);
const zero=initMission();await new Promise(resolve=>setImmediate(resolve));
zero.api.set({...zero.api.get(),explored:cfg.stations.map(x=>x.id),completed:true,answers:Object.fromEntries(cfg.quiz.map(q=>[q.id,q.options.find(o=>o.id!==q.correct).id]))});
assert.equal(zero.api.getScore().total,70);
assert.equal(zero.api.getScore().passed,false,'70 points with zero correct cannot pass');
const one=initMission();await new Promise(resolve=>setImmediate(resolve));
one.api.set({...one.api.get(),explored:cfg.stations.map(x=>x.id),completed:true,answers:Object.fromEntries(cfg.quiz.map((q,i)=>[q.id,i===0?q.correct:q.options.find(o=>o.id!==q.correct).id]))});
assert.equal(one.api.getScore().total,80);
assert.equal(one.api.getScore().passed,false,'80 points with only one answer cannot pass');
const two=initMission();await new Promise(resolve=>setImmediate(resolve));
two.api.set({...two.api.get(),explored:cfg.stations.map(x=>x.id),completed:true,answers:Object.fromEntries(cfg.quiz.map((q,i)=>[q.id,i<2?q.correct:q.options.find(o=>o.id!==q.correct).id]))});
assert.equal(two.api.getScore().total,90);
assert.equal(two.api.getScore().passed,true);
// Independent navigation guard regression
const gate=file('intro-gate.js');
function gateRedirect(seed){const store=mockStore(seed),location={url:'',replace(url){this.url=url}};vm.runInNewContext(gate,{localStorage:store,window:{location}}, {timeout:1000});return location.url}
assert.equal(gateRedirect({}),'/missao01.html?return=caso01');
assert.equal(gateRedirect({'pilha-missao01-v1':JSON.stringify({version:1,completed:true,passed:true,score:90,correct:2})}), '');
assert.equal(gateRedirect({'pilha-case01-v2':JSON.stringify({version:2,step:2})}), '');
assert.equal(gateRedirect({'pilha-case01-v1':JSON.stringify({step:3})}), '');
// Content includes original approved definitions, remains single-source
for(const term of ['Saúde mental','Fatores de risco psicossociais','Segurança psicológica'])assert.ok(file('app.js').includes(term));
const app=file('app.js');
assert.ok(app.includes('prelude-card'));
assert.ok(app.includes('/missao01.html'));
assert.ok(file('caso01.html').includes('/intro-gate.js'));
assert.ok(file('scene3d.html').includes('warehouse-glb'));
assert.ok(file('scene3d.html').includes('pilha-plus-ambientes-v01'));
assert.match(file('mission01.css'),/prefers-reduced-motion/);
assert.ok(fs.existsSync(path.join(ROOT,'assets/v12/biblioteca-isometrica.svg')));
console.log('Mission 01: pass 100, fail 70 and 80 with insufficient correct answers; pass 90. Guard and content pass.');
