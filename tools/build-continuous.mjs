/** Builds the continuous public mode, preserving case source files unchanged. */
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {SECTORS,FACTORS,ITEMS,RULES,SOURCE} from '../data/continuous/catalog.js';
const root=fileURLToPath(new URL('..',import.meta.url)),out=path.join(root,'dist');
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
const exclude=new Set(['.git','.github','dist','node_modules','artifacts','tests','tools','docs','.vercel']);
for(const e of fs.readdirSync(root,{withFileTypes:true})){if(exclude.has(e.name)||e.name.startsWith('.env'))continue;fs.cpSync(path.join(root,e.name),path.join(out,e.name),{recursive:true});}
function replace(s,a,b){if(!s.includes(a))throw Error('Missing build anchor: '+a.slice(0,80));return s.replace(a,b);}
let map=fs.readFileSync(path.join(root,'ui/claude/pilha-mapa.js'),'utf8');
const start=map.indexOf('  var SECTORS = ['),end=map.indexOf('  var AVATARS',start);if(start<0||end<0)throw Error('Missing sectors');
map=map.slice(0,start)+'  var SECTORS = '+JSON.stringify(SECTORS.map(s=>({id:s.id,nome:s.name,desc:s.description,base:s.base,sint:s.symptoms})))+';\n\n'+map.slice(end);
map=replace(map,'atendimento: [0, 10]','atendimento: [0, 10], restauracao: [14, 10]');
map=replace(map,'atendimento: [20, 20]','atendimento: [20, 20], restauracao: [30, 30]');
map=replace(map,'três setores: Escritório, Produção e Atendimento.','quatro ambientes: Escritório, Produção, Atendimento e Restauração.');
map=replace(map,'iso.setSharedIndexMode(!!o.model);','iso.setSharedIndexMode(false);');
map=replace(map,'if(o.model)iso.setInventory(st.owned||[]);','if(o.model)iso.setSectorInventory(st.levels||[]);');
map=replace(map,'"Índice do ciclo · compartilhado"','"Índice da empresa · meta 45"');
map=replace(map,'root.querySelector(".pm-goal__bar u").hidden = true;','root.querySelector(".pm-goal__bar u").hidden = false;');
map=replace(map,"o.model ? (st.owned.length ? '· em melhoria' : '· observar') : Math.round(h) + '%'","Math.round(h) + '%'");
map=replace(map,'o.model.body(SECTORS[sel], st)','o.model.body(SECTORS[sel], st, {zone:selZone,filter:catFilter})');
map=replace(map,'async function buy(cid) {','async function buy(cid, expectedLevel, expectedRevision) {');
map=replace(map,'await o.model.buy(cid)','await o.model.buy(cid, SECTORS[sel].id, expectedLevel, expectedRevision)');
map=replace(map,'buy(b.getAttribute("data-id"));','buy(b.getAttribute("data-id"), Number(b.dataset.level), Number(b.dataset.revision));');
map=replace(map,'setMotion: setMotion, refresh: refresh','toast: toast, setMotion: setMotion, refresh: refresh');
map=replace(map,'"1","2","3"','"1","2","3","4"');
map=replace(map,'case "1": case "2": case "3": select(+e.key - 1, -1); break;','case "1": case "2": case "3": case "4": select(+e.key - 1, -1); break;');
let iso=fs.readFileSync(path.join(root,'ui/claude/pilha-iso.js'),'utf8');
iso=replace(iso,'inventory = new Set(), npcSheets','inventory = new Set(), localLevels = null, restVisitors = [], npcSheets');
const extras=`
      if(localLevels){
        var levels=localLevels[e.key]||{},oldInventory=inventory;
        var names={seg:'escuta-segura',asse:'protocolo-antassedio',psic:'psicoeducacao',fisi:'clima-ventilacao',jorn:'pausas',auto:'papel-autonomia',lide:'lideranca',rela:'conflitos',muda:'comunicacao-mudancas',apoi:'apoio-retorno'};
        inventory=new Set(Object.keys(levels).filter(function(id){return levels[id]>0;}).map(function(id){return names[id];}).filter(Boolean));
        if(e.key==='restauracao'){
          var rest={puff:['sofa',.8,1.2,.8,.7,.4,'#debf6c',0],livros:['shelf',.8,2.6,2,.45,1.4,'#bd9661',0],plano:['board',2.7,.8,.25,.5,.9,'#59cec4',0],arvore:['tree',5.4,1.3,.7,.7,1.1,'#597951',1],intervalo:['chair',6.3,2.5,.6,.6,.55,'#d6cda0',1],almofadas:['sofa',9,1.4,.75,.7,.2,'#ae82c5',2],tapete:['mat',8.7,2.5,2.4,.7,.06,'#7f62b8',2],yoga:['board',10.5,.7,.8,.2,1.1,'#5ac2a5',2],cursos:['board',1.1,4.7,2,.25,1.7,'#55c8ed',3],capelao:['table',1,6.2,1.5,.8,.5,'#ab8d61',3],frutifera:['tree',5.2,5.4,.8,.8,1.2,'#58a46e',4],banco:['sofa',8.7,5.5,2,.8,.55,'#cab67d',5]};
          Object.keys(rest).forEach(function(id){if(!levels[id])return;var a=rest[id];e.items.push({t:a[0],x:a[1],y:a[2],w:a[3],d:a[4],h:a[5],c:a[6],z:a[7],installed:id});
            if(id==='cursos')for(var n=0;n<levels[id]+2;n++)e.items.push({t:'chair',x:.9+n*.65,y:7,w:.4,d:.4,h:.45,c:'#405c88',z:3,installed:id});
            if(id==='arvore'||id==='frutifera')for(var n=1;n<levels[id];n++)e.items.push({t:'tree',x:a[1]+n*.7,y:a[2]+n*.4,w:.45,d:.45,h:.6,c:a[6],z:a[7],installed:id});
          });
        }
        if(levels.ergo)e.items.forEach(function(it){if(it.t==='desk')it.c='#54b8b0';});
      }
`;
iso=replace(iso,'      inventory.forEach(function(id){var a=additions[id];',extras+'      inventory.forEach(function(id){var a=additions[id];');
const marker='inventory.forEach(function(id){var a=additions[id];if(a)e.items.push({t:a[0],x:a[1],y:a[2],w:a[3],d:a[4],h:a[5],c:a[6],z:a[7],installed:id});});';
iso=replace(iso,marker,marker+'\n      if(localLevels)inventory=oldInventory;');
const visitorCode=`
    function setRestVisitors(list){
      restVisitors=[];Object.keys(envs).forEach(function(key){envs[key].people.forEach(function(p){p.restAway=false;});});
      if(!worldCfg)return;
      var positions={biblioteca:[2.9,2.1],bosque:[6.6,2.1],meditacao:[10.6,3.3],auditorio:[2.5,6.5],patio:[9.5,6.6]};
      list.forEach(function(v,i){var e=getEnv(v.sid),p=e.people.filter(function(p){return !p.sit;})[v.index];if(!p)return;p.restAway=true;var xy=positions[v.space]||positions.bosque;restVisitors.push(Object.assign({},p,{home:v.sid,worker:v.id,x:xy[0]+(i%2)*.35,y:xy[1]+(i%2)*.25,tx:6,ty:4,sit:true,moving:false,npc:-1}));});render();
    }
`;
iso=replace(iso,'    function resize() {',visitorCode+'    function resize() {');
iso=replace(iso,'e.people.forEach(function (p) { list.push','e.people.forEach(function (p) { if(p.restAway)return; list.push');
iso=replace(iso,'(visitors||[]).forEach(function(p){',"(e.key==='restauracao'?(visitors||[]).concat(restVisitors):(visitors||[])).forEach(function(p){");
iso=replace(iso,'setInventory:function(ids){','setRestVisitors:setRestVisitors,\n setSectorInventory:function(levels){if(JSON.stringify(levels)===JSON.stringify(localLevels))return;localLevels=levels;Object.keys(envs).forEach(function(key){applyInstallations(envs[key]);});if(!running)render();},\n setInventory:function(ids){');
iso=replace(iso,'function drawItem(it, e) {',`function drawItem(it,e){
      if(it.t==='mat'){box(it.x,it.y,.01,it.w,it.d,it.h,it.c,.85);return;}
      if(it.t==='tree'){box(it.x,it.y,0,.18,.18,it.h,'#926c42',.9);var leaf=P(it.x+.1,it.y+.1,it.h+.4),rad=ZU*s*.7;ell(leaf[0],leaf[1],rad,rad*1.1,'#429a61');ell(leaf[0]-rad*.5,leaf[1]+rad*.3,rad*.65,rad*.7,'#61b96a');if(it.installed==='frutifera')ell(leaf[0]+rad*.3,leaf[1],rad*.14,rad*.14,'#f2b143');return;}
`);
iso=replace(iso,'if ((isZ || isZh || cam.k > 2.7) && zoneNames[z]) {',"var localZoneNames=e.key==='restauracao'?['Biblioteca','Bosque','Meditação','Auditório','Pomar','Pátio']:zoneNames;\n if((isZ||isZh||cam.k>2.7||e.key==='restauracao')&&localZoneNames[z]){");
iso=replace(iso,'pill(zc[0], zc[1] + r + 15, zoneNames[z],','pill(zc[0], zc[1] + r + 15, localZoneNames[z],');
fs.mkdirSync(path.join(out,'ui/continuous'),{recursive:true});fs.writeFileSync(path.join(out,'ui/continuous/map.js'),map);fs.writeFileSync(path.join(out,'ui/continuous/iso.js'),iso);
const html=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>PilhA+ Game · Empresa viva</title><meta name="theme-color" content="#0a1933"><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/ui/claude/pilha-mapa.css"><link rel="stylesheet" href="/ui/claude/pilha-eventos.css"><link rel="stylesheet" href="/ui/claude/herois/pilha-herois.css"><link rel="stylesheet" href="/ui/hero-gallery.css"><link rel="stylesheet" href="/ui/hero-neon.css"><link rel="stylesheet" href="/ui/continuous-game.css"><link rel="stylesheet" href="/ui/furniture-effects.css"></head><body><main id="continuous-app"><p>Preparando sua empresa...</p></main><script src="/ui/continuous/iso.js"></script><script src="/ui/continuous/map.js"></script><script src="/ui/claude/herois/pilha-herois-dados.js"></script><script src="/ui/claude/herois/pilha-herois.js"></script><script type="module" src="/ui/continuous-game.js"></script><noscript>Ative JavaScript para jogar.</noscript></body></html>`;
fs.mkdirSync(path.join(out,'archive'),{recursive:true});fs.copyFileSync(path.join(root,'index.html'),path.join(out,'archive/legacy-entry.html'));fs.writeFileSync(path.join(out,'index.html'),html);
const register={...SOURCE,rules:RULES,sourceSectors:SECTORS.slice(0,3),levels:ITEMS.map(c=>({id:c.id,name:c.name,origin:c.origin,timing:c.timing,levels:RULES.effects.map((k,i)=>({level:i+1,cost:Math.round(c.cost*RULES.costs[i]/50)*50,effects:Object.fromEntries(Object.entries(c.factors).map(([f,v])=>[f,+(v*k).toFixed(4)]))}))}))};
fs.writeFileSync(path.join(out,'data/continuous/register.json'),JSON.stringify(register,null,2));
console.log('Empresa contínua: quatro ambientes, casos preservados e catálogo exportado.');
