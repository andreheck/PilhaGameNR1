import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const wide=[{key:'escritorio',name:'Escritório',bx:0,by:0},{key:'producao',name:'Produção',bx:14,by:0},{key:'atendimento',name:'Atendimento',bx:0,by:10}];
const tall=wide.map((d,i)=>({...d,bx:i*10,by:i*10}));
function engine(){
 let raf;const noop=()=>{},ctx=new Proxy({measureText:t=>({width:t.length*7}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>k in o?o[k]:noop});
 const window={devicePixelRatio:1,requestAnimationFrame:fn=>(raf=fn,1),cancelAnimationFrame:()=>{raf=null;}};
 vm.runInNewContext(fs.readFileSync(new URL('../ui/claude/pilha-iso.js',import.meta.url),'utf8'),{window,Math,Set});
 const iso=window.PilhaIso.create({getContext:()=>ctx,getBoundingClientRect:()=>({width:1200,height:720})});iso.resize();iso.setSharedIndexMode(true);iso.setWorld(wide);return {iso,nav:window.PilhaIso.navigation,tick:ts=>raf?.(ts)};
}
test('empresa tem duas passagens físicas entre entradas, sem cruzar os centros das salas',()=>{
 const {nav}=engine();for(const defs of [wide,tall]){
  const links=nav.connections(defs);assert.equal(links.length,2);assert.equal(new Set(links.flatMap(c=>[c.from,c.to])).size,3);
  for(const l of links){const a=defs.find(d=>d.key===l.from),b=defs.find(d=>d.key===l.to),first=l.points[0],last=l.points.at(-1);assert.equal(l.door.key,b.key);assert.ok(first.x>=a.bx&&first.x<=a.bx+12&&first.y>=a.by&&first.y<=a.by+8);assert.ok(last.x>=b.bx&&last.x<=b.bx+12&&last.y>=b.by&&last.y<=b.by+8);for(let i=1;i<l.points.length;i++)assert.ok(l.points[i].x===l.points[i-1].x||l.points[i].y===l.points[i-1].y,'passagens ortogonais');}
 }
});
test('trajeto inteiro mantém margem da mobília original e instalada nos três departamentos',()=>{
 const {iso,nav}=engine();iso.setInventory(['ergonomia','escuta-segura','protocolo-antassedio','psicoeducacao','clima-ventilacao','pausas','papel-autonomia','lideranca','conflitos','comunicacao-mudancas','apoio-retorno']);
 for(const def of wide){const e=iso.getEnv(def.key);for(let d=0;d<nav.length;d+=.04){const p=nav.point(d);assert.ok(p.x>=.2&&p.x<=11.8&&p.y>=.2&&p.y<=7.8);for(const it of e.items){let w=it.w+(it.t==='desk'?.22:it.t==='sofa'?.25:0);assert.ok(!(p.x>it.x-.2&&p.x<it.x+w+.2&&p.y>it.y-.2&&p.y<it.y+it.d+.2),`${def.key}: ${it.t} bloqueia ${p.x},${p.y}`);}}}
});
test('dois minutos simulados mantêm continuidade, espaçamento e circulação em todos os setores',()=>{
 const {iso,nav,tick}=engine(),previous=new Map(),movedById=new Map(),previousTransit=new Map(),faces=new Set(),initial=JSON.stringify(iso.getCirculation().commuters);let moved=0;
 iso.setNpcSheets([{}]);iso.start();for(let frame=1;frame<=2400;frame++){
  tick(frame*50);
  for(const c of iso.getCirculation().commuters){const id=c.from+c.to,old=previousTransit.get(id);if(old)assert.ok(Math.hypot(c.x-old.x,c.y-old.y)<.049,'travessia sem saltos');previousTransit.set(id,c);}
  for(const def of wide){const walkers=iso.getEnv(def.key).people.filter(p=>!p.sit);for(let i=0;i<walkers.length;i++){const p=walkers[i],id=def.key+i,old=previous.get(id);if(old){const displacement=Math.hypot(p.x-old.x,p.y-old.y);assert.ok(displacement<.065,'sem teletransporte entre quadros');if(displacement>0){moved++;movedById.set(id,(movedById.get(id)||0)+1);if(p.npc>=0)faces.add(p.facing);}}previous.set(id,{x:p.x,y:p.y});for(let j=i+1;j<walkers.length;j++){const gap=(walkers[j].progress-p.progress+nav.length)%nav.length;assert.ok(Math.min(gap,nav.length-gap)>=.649,'distância mínima entre caminhantes');}}}
 }
 assert.ok(moved>30000);assert.equal(movedById.size,33);assert.ok([...movedById.values()].every(n=>n>500),'cada trabalhador circula');assert.deepEqual([...faces].sort(),[0,1,2,3],'quatro direções do atlas');assert.notEqual(JSON.stringify(iso.getCirculation().commuters),initial);
 iso.stop();const paused=JSON.stringify(iso.getCirculation());iso.setStatic(true);iso.start();tick(121000);assert.equal(JSON.stringify(iso.getCirculation()),paused);
});
test('trânsito usa as mesmas portas após redimensionamento e foco não troca departamentos',()=>{
 const {iso,tick}=engine();iso.start();tick(50);tick(100);const before=JSON.stringify(iso.getCirculation().connections);iso.focus(1,-1,.8);iso.resize();assert.equal(JSON.stringify(iso.getCirculation().connections),before);iso.setWorld(tall);const state=iso.getCirculation();assert.equal(state.connections.length,2);assert.equal(state.commuters.length,2);assert.ok(state.commuters.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));
 const ui=fs.readFileSync(new URL('../ui/claude/pilha-mapa.js',import.meta.url),'utf8');assert.equal((ui.match(/root.clientHeight > root.clientWidth \* 1.05/g)||[]).length,2,'layout depende do conjunto, não da área reduzida pelo painel');
});
