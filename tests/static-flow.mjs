import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import path from 'node:path';
import { CASE017_INITIAL, simulateCase017 } from '../simulation/case017.js';
import { deriveCase017SceneState } from '../simulation/case017-scene.js';
const root=path.resolve(import.meta.dirname,'..');
const src=name=>fs.readFileSync(path.join(root,name),'utf8');
function runtime(initial={}){
  const local=new Map(Object.entries(initial));
  const main={innerHTML:'',addEventListener(){},focus(){}};
  const attrs={};
  const context={
    console,URLSearchParams,
    localStorage:{getItem:k=>local.has(k)?local.get(k):null,setItem:(k,v)=>local.set(k,String(v)),removeItem:k=>local.delete(k)},
    document:{title:'',documentElement:{dataset:attrs},getElementById:()=>main,addEventListener(){},querySelector(){return null}},
    ROOT:main,window:{addEventListener(){},confirm(){return true}},
    history:{pushState(){}},location:{search:'',pathname:'/'},scrollTo(){},confirm(){return true},
    setTimeout,clearTimeout
  };
  context.globalThis=context;vm.createContext(context);
  return {context,main,local};
}
const code=src('case.js').replace("import { CASE017_INITIAL, simulateCase017 } from './simulation/case017.js';\n",'').replace("import { deriveCase017SceneState } from './simulation/case017-scene.js';\n",'');
const end='put();render();\n})();';
assert.ok(code.includes(end));
const harness=code.replace(end,'globalThis.__caseTest={setState(x){s={...INIT(),...x}},scoreBreakdown,load,get(){return s},reset:INIT,actions,evidence,monitoring,hypothesis,disclosure,checkpoints,render};\nput();render();\n})();');
const test=runtime();Object.assign(test.context,{CASE017_INITIAL,simulateCase017,deriveCase017SceneState});vm.runInContext(harness,test.context,{filename:'case.js',timeout:2000});
const c=test.context.__caseTest;
assert.ok(test.main.innerHTML.includes('GALPÃO · CASO 017'));
assert.ok(test.main.innerHTML.includes('actor-dot'));
const good={version:2,step:4,evidence:['schedule','reports','observation'],spoken:['operadora','colaborador','psicologa','psiquiatra'],hypothesis:'organization',disclosure:'aggregate',actions:['capacity','breaks','listen'],monitoring:['hours','return','results'],checkpoint:'30',completed:true};
c.setState(good);const won=c.scoreBreakdown();assert.ok(won.score>=75 && won.passed,JSON.stringify(won));
c.render();assert.ok(test.main.innerHTML.includes('Meta alcançada'));
const bad={version:2,step:4,evidence:['leadership','aggregates','reports'],spoken:[],hypothesis:'wait',disclosure:'leadonly',actions:['counselling','campaign'],monitoring:['productivity','healthfiles'],checkpoint:'120',completed:true};
c.setState(bad);const lost=c.scoreBreakdown();assert.ok(lost.score<75&&!lost.passed,JSON.stringify(lost));
assert.ok(lost.reasons.length>=1);
c.setState({...good,disclosure:'expose'});assert.ok(c.scoreBreakdown().score<=69);
c.setState({...good,hypothesis:'handoff'});assert.ok(c.scoreBreakdown().score<=74);
console.log('Caso 017: success',won.score,'failure',lost.score,'ethical guardrails pass');
const appCode=src('app.js').replace('render();\n})();','globalThis.__appTest={render,home,cases,team,view,prefs,state};\nrender();\n})();');
const ui=runtime();vm.runInContext(appCode,ui.context,{filename:'app.js',timeout:2000});
assert.ok(!ui.main.innerHTML.includes('world-overview.webp'));
assert.ok(ui.main.innerHTML.includes('3D INTERATIVO'));
assert.ok(ui.main.innerHTML.includes('Meta: 75/100'));
ui.context.location.search='?view=casos';ui.context.__appTest.render();
assert.equal((ui.main.innerHTML.match(/class="future-card"/g)||[]).length,4);
assert.ok(ui.main.innerHTML.includes('galpao-dashboard.webp'));
assert.equal((ui.main.innerHTML.match(/Em breve<\/button>/g)||[]).length,4);
ui.context.location.search='?view=equipe';ui.context.__appTest.render();
assert.equal((ui.main.innerHTML.match(/class="person-card"/g)||[]).length,4);
for(const f of ['operadora','psicologa','psiquiatra','colaborador'])assert.ok(ui.main.innerHTML.includes(f+'-portrait.webp'));
ui.local.set('pilha-case017-v2',JSON.stringify({...good,score:won.score}));
ui.context.location.search='?view=casos';ui.context.__appTest.render();
assert.ok(ui.main.innerHTML.includes('Meta atingida'));
console.log('App: home, 5 cases (1 playable, 4 disabled), 4 portraits, score persistence pass');
for(const f of ['scene-leadership.webp','scene-people.webp','scene-wellbeing.webp','scene-technology.webp','galpao-dashboard.webp','galpao-diorama.webp','operadora-portrait.webp','psicologa-portrait.webp','psiquiatra-portrait.webp','colaborador-portrait.webp']){
  const raw=fs.readFileSync(path.join(root,'assets','v11',f));
  assert.equal(raw.toString('ascii',0,4),'RIFF');assert.equal(raw.toString('ascii',8,12),'WEBP');
}
console.log('Assets: 10 WebP files valid; static overview removed');
