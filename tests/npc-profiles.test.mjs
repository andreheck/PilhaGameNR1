import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {EMPLOYEES} from '../data/continuous/employees.js';import {NPC_PROFILES,npcProfile} from '../data/continuous/npc-profiles.js';import * as M from '../simulation/company-continuous.js';import * as L from '../simulation/company-living.js';import {avatar} from '../ui/employee-panel.js';
const json=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8')),catalog=json('data/npcs/catalogo-v1.json'),manifest=json('data/continuous/npc-art-manifest.json');
test('all16 IDs bind canonical names, groups, profiles and unique approved RGBA portraits',()=>{
 assert.equal(EMPLOYEES.length,16);assert.equal(new Set(EMPLOYEES.map(p=>p.id)).size,16);assert.equal(Object.keys(NPC_PROFILES).length,16);const hashes=new Set();
 for(const p of EMPLOYEES){const f=NPC_PROFILES[p.id],c=catalog.npcs.find(x=>x.id===p.id),a=manifest.npcs.find(x=>x.id===p.id);assert.equal(p.profile,f);assert.equal(p.name,f.name);assert.equal(p.type,f.type);assert.equal(p.group,f.group);assert.equal(p.portrait,'/'+a.canonical);assert.equal(f.name,c.nome);const bytes=fs.readFileSync(new URL('../'+a.canonical,import.meta.url));assert.equal(bytes.subarray(1,4).toString(),'PNG');assert.equal(bytes[25],6,'RGBA '+p.id);const hash=crypto.createHash('sha256').update(bytes).digest('hex');assert.equal(hash,a.sha256);hashes.add(hash);}
 assert.equal(hashes.size,16);assert.equal(npcProfile('absent'),null);
});
test('every narrative field comes from the canonical catalog; unregistered details stay missing',()=>{
 for(const p of EMPLOYEES){const f=p.profile,c=catalog.npcs.find(x=>x.id===p.id);assert.deepEqual(f.strengths,c.forcas??[]);assert.deepEqual(f.watchouts,c.pontos_de_atencao??[]);assert.deepEqual(f.favorableConditions,c.condicoes_favoraveis??[]);assert.deepEqual(f.adverseConditions,c.condicoes_adversas??[]);assert.deepEqual(f.proposedSynergies,c.sinergias_propostas??[]);assert.deepEqual(f.proposedEffects,c.pontos??null);assert.equal(f.age,c.idade??null);if(Number(p.id.slice(-2))>=9){assert.equal(p.age,null);assert.equal(f.age,null);assert.ok(f.strengths.length>=3);assert.equal(f.status,'narrativa_editorial_v1');assert.equal(f.proposedEffects,null);}}
});
test('profiles and artwork do not change the original health formula, balance or persisted records',()=>{
 const s=M.fresh(),before=JSON.stringify(s),rows=L.staffView(s);assert.equal(JSON.stringify(s),before);for(const p of rows){const expected=Math.round(70+(M.metrics(s,p.home).index-50)*.35);assert.equal(p.baseHealth,expected);assert.ok(p.health>=p.baseHealth&&p.health<=p.baseHealth+8);assert.ok(p.profile.disclaimer.includes('não determina saúde'));}
 s.staff=Object.fromEntries(EMPLOYEES.map((p,i)=>[p.id,{health:40+i,previous:39+i,week:1}]));const saved=JSON.stringify(s);assert.deepEqual(L.staffView(s).map(p=>[p.id,p.baseHealth]).sort(),EMPLOYEES.map((p,i)=>[p.id,40+i]).sort());assert.equal(JSON.stringify(s),saved);assert.equal(s.budget,10000);
});
test('avatar uses stable ID rather than score ordering and retains the original SVG of the same person',()=>{
 for(const p of [...EMPLOYEES].reverse()){const html=avatar(p);assert.ok(html.includes('data-npc-id="'+p.id+'"'));assert.ok(html.includes('src="'+p.portrait+'"'));assert.ok(html.includes('loading="lazy"'));assert.ok(html.includes('employee-avatar-fallback'));assert.ok(html.includes('aria-label="'+p.name+'"'));assert.ok(html.includes(p.skin));assert.ok(html.includes(p.shirt));const fallback=avatar({...p,portrait:null,profile:null});assert.ok(fallback.startsWith('<svg'));assert.ok(fallback.includes(p.name));}
 const malicious=avatar({...EMPLOYEES[0],name:'<img src=x onerror=alert(1)>',portrait:'" onerror="bad'});assert.ok(!malicious.includes('src="" onerror='));assert.ok(malicious.includes('&lt;img'));
});
test('QA art metadata matches every file and confirms actual transparent pixels',()=>{
 const report=json('docs/qa/npcs-fase1/art-integrity.json');assert.equal(report.assets.length,16);for(const p of report.assets){const bytes=fs.readFileSync(new URL('../'+p.file,import.meta.url));assert.equal(bytes.readUInt32BE(16),p.width);assert.equal(bytes.readUInt32BE(20),p.height);assert.equal(bytes.length,p.bytes);assert.equal(p.alphaMin,0);assert.ok(p.alphaMax>=250);assert.ok(p.transparentPixels>100);assert.ok(p.visiblePixels>1000);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),p.sha256);}
 assert.equal(NPC_PROFILES['NPC-14'].name,'Camila');assert.equal(NPC_PROFILES['NPC-16'].name,'Beatriz');assert.notEqual(NPC_PROFILES['NPC-14'].portrait,NPC_PROFILES['NPC-16'].portrait);
});
test('list, profile and world share the wrapper; narrative text is escaped and does not activate proposed effects',()=>{
 const ui=fs.readFileSync(new URL('../ui/employee-panel.js',import.meta.url),'utf8'),world=fs.readFileSync(new URL('../ui/living-world.js',import.meta.url),'utf8');assert.ok(world.includes("import {avatar}"));assert.ok(ui.includes('${narrative(p)}'));assert.ok(ui.includes('esc(v.replaceAll'));assert.ok(ui.includes("classList.add('is-missing')"));assert.ok(!ui.includes('proposedEffects'));assert.ok(world.includes('distinta da NPC Mediadora'));assert.ok(world.includes('/assets/actors/mentora-portrait.webp'));
});

test('catalogue portrait wrappers stay compact and mobile portraits fit their grid track',()=>{const css=fs.readFileSync(new URL('../ui/living-company.css',import.meta.url),'utf8');assert.match(css,/\.world-staff button>\.employee-avatar--art\{flex:none;display:block;width:48px;height:56px\}/);assert.match(css,/\.employee-row \.employee-avatar--art\{width:36px;height:44px\}/);});

test('transient image errors show same-person fallback, retry once, and recover on load',async()=>{
 const handlers={},classes=new Set();let retries=0;const image={isConnected:true,naturalWidth:0,dataset:{},matches:()=>true,getAttribute:()=>'/assets/npcs/npc-04-raimunda-debatedora.png',closest:()=>({classList:{add:k=>classes.add(k),remove:k=>classes.delete(k)}}),set src(v){assert.equal(v,'/assets/npcs/npc-04-raimunda-debatedora.png');retries++;}};
 globalThis.document={addEventListener:(event,fn)=>handlers[event]=fn};try{await import('../ui/employee-panel.js?fallback-event-test');}finally{delete globalThis.document;}
 handlers.error({target:image});assert.ok(classes.has('is-missing'));await new Promise(r=>setTimeout(r,800));assert.equal(retries,1);handlers.error({target:image});await new Promise(r=>setTimeout(r,800));assert.equal(retries,1,'no unbounded retry loop');image.naturalWidth=1122;handlers.load({target:image});assert.equal(classes.has('is-missing'),false);assert.equal(image.dataset.npcRetry,undefined);
});


test('organization has exactly16 unique jobs, three home managers and six non-worker advisors',async()=>{
 const {MANAGERS,BOARD,jobFor}=await import('../data/continuous/organization.js');
 const {organizationMarkup}=await import('../ui/company-organization.js');
 assert.equal(BOARD.length,6);assert.equal(new Set(BOARD.map(h=>h.heroId)).size,6);assert.equal(jobFor('missing','escritorio'),null);
 for(const sid of ['escritorio','producao','atendimento']){const people=EMPLOYEES.filter(p=>p.home===sid),leaders=people.filter(p=>p.organization.rank==='estrategico');assert.equal(leaders.length,1);assert.equal(leaders[0].id,MANAGERS[sid]);assert.equal(leaders[0].organization.reportsTo,'conselho');for(const p of people.filter(p=>p.id!==MANAGERS[sid]))assert.equal(p.organization.reportsTo,MANAGERS[sid]);}
 const state=M.fresh(),before=JSON.stringify(state),html=organizationMarkup(L.staffView(state),[]);assert.equal(JSON.stringify(state),before);assert.equal((html.match(/data-org-id=/g)||[]).length,16);assert.equal((html.match(/data-org-hero=/g)||[]).length,6);for(const p of EMPLOYEES)assert.equal(html.split('data-org-id="'+p.id+'"').length,2);
 assert.ok(html.includes('Gerente de Produção'));assert.ok(html.includes('Gerente de Atendimento'));assert.ok(html.includes('Gerente do Escritório'));
});
