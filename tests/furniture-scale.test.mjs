import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
import {FURNITURE_VISUALS as V} from '../data/continuous/furniture-visuals.js';
import {createFurniturePresentation,spriteSize} from '../ui/furniture-presentation.js';
import {ITEMS} from '../data/continuous/catalog.js';
// Mirror the four rooms in the current continuous map. The previous source
// branch imported a world-graph module that is not part of the v1.5 baseline.
const WORLD={zones:[
 {id:'escritorio',name:'Escritório',x:0,y:0},
 {id:'producao',name:'Produção',x:14,y:0},
 {id:'atendimento',name:'Atendimento',x:0,y:10},
 {id:'restauracao',name:'Restauração',x:14,y:10}
]};
function engine(){
 const noop=()=>{},ctx=new Proxy({measureText:t=>({width:t.length*7}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>k in o?o[k]:noop});
 const window={devicePixelRatio:1,requestAnimationFrame:()=>1,cancelAnimationFrame:noop,setTimeout:noop};
 vm.runInNewContext(fs.readFileSync(new URL('../dist/ui/continuous/iso.js',import.meta.url),'utf8'),{window,Math,Set,performance:{now:()=>0},Date});
 const iso=window.PilhaIso.create({getContext:()=>ctx,getBoundingClientRect:()=>({width:1440,height:900})},null,null,WORLD);
 iso.resize();iso.setFurniturePresentation(createFurniturePresentation());iso.setWorld(WORLD.zones.map(z=>({key:z.id,name:z.name,bx:z.x,by:z.y})));iso.setSectorInventory({});iso.setFurnitureCatalog(V);return iso;
}
test('one metric ruler and category height ratios, alpha crop and interaction anchors',()=>{
 assert.equal(V.ruler.adultHeight,1.7);assert.equal(V.ruler.cellMeters,1);
 assert.deepEqual(V,JSON.parse(fs.readFileSync(new URL('../data/continuous/furniture-visuals.json',import.meta.url),'utf8')));
 const ratios={'mesa-escritorio':[.4,.5],'mesa-reuniao':[.4,.5],'poltrona-azul-a':[.5,.65],'sofa-azul':[.4,.6],'estante-livros':[1,1.2],'bebedouro':[.6,.7],'planta-grande':[.75,.9]};
 for(const a of V.assets){assert.ok(a.scale.width>0&&a.scale.depth>0&&a.scale.height>0);assert.equal(a.anchor.length,2);if(a.sitPoint)assert.equal(a.sitPoint.length,3);assert.equal(a.standPoint.length,3);assert.equal(a.bounds.length,4);const r=ratios[a.id];if(r)assert.ok(a.scale.height/1.7>=r[0]&&a.scale.height/1.7<=r[1]);const size=spriteSize(a,30);assert.ok(size.height>a.scale.height*30);}
 assert.deepEqual(V.amenities.map(a=>a.id),['geladeira','televisao','copa','banco-patio-a','banco-patio-b','jardineira-patio']);
});
test('all baseline and maximum-level furniture fits without overlapping aisles, doors or each other',()=>{
 const iso=engine();for(const max of [false,true]){
  iso.setSectorInventory(Object.fromEntries(WORLD.zones.map(z=>[z.id,Object.fromEntries(ITEMS.filter(i=>!!i.rest===(z.id==='restauracao')).map(i=>[i.id,max?3:0]))])));
  for(const z of iso.furnitureLayout()){
   assert.deepEqual(Array.from(z.unplaced),[],z.id+' hidden furniture');
   for(const a of z.items){assert.ok(!a.hidden);if(a.structural){assert.equal(z.id,'escritorio');}else if(a.managerRoom){assert.equal(z.id,'escritorio');assert.ok(a.x>=.3&&a.y>=-5.7&&a.x+a.w<=7.7&&a.y+a.d<=-.3);}else if(a.annex){assert.equal(z.id,'restauracao');assert.ok(a.x>=.6&&a.y>=8&&a.x+a.w<=11.8&&a.y+a.d<=17.6,z.id+' annex '+a.id);}else{assert.ok(a.x>=.5&&a.y>=.4&&a.x+a.w<=11.6&&a.y+a.d<=7.6,z.id+' '+a.id);for(const x of [4,8])assert.ok(a.x+a.w<x-.25||a.x>x+.25);assert.ok(a.y+a.d<3.8||a.y>4.2);}
    for(const b of z.items.filter(b=>b!==a&&!(a.structural&&b.structural)))assert.ok(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.d<=b.y||b.y+b.d<=a.y,z.id+': '+a.id+' overlaps '+b.id);
   }
  }
  const before=JSON.stringify(iso.furnitureLayout());iso.setFurnitureCatalog(V);assert.equal(JSON.stringify(iso.furnitureLayout()),before);
 }
});
test('static sprite does not mask the animated conveyor and new appliances are procedural',()=>{
 const p=createFurniturePresentation(),img={complete:true,naturalWidth:100,naturalHeight:100};
 assert.equal(p.draw({}, {t:'conveyor',visualAsset:'esteira-producao'}, {}, {catalog:V,images:{'esteira-producao':img},reveal:{}}),false);
 const source=fs.readFileSync(new URL('../ui/furniture-presentation.js',import.meta.url),'utf8');assert.doesNotMatch(source,/localStorage|purchase\(|budget\s*[-+]=/);
});
