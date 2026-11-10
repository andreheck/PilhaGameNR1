/** Production annex on the compiled renderer. Never adds a sector or changes economics. */
import fs from 'node:fs';import {LOGISTICS_SPACE} from '../data/continuous/logistics-space.js';
const file=new URL('../dist/ui/continuous/iso.js',import.meta.url);let s=fs.readFileSync(file,'utf8');
function replace(a,b){if(!s.includes(a))throw Error('Logistics anchor: '+a.slice(0,100));s=s.replace(a,b);}
replace('    function renderEnv(e, visitors) {',`var logisticsSpace=${JSON.stringify(LOGISTICS_SPACE)};
function drawLogisticsExtension(e){if(!worldCfg||e.key!=='producao')return;
 poly([P(12,0,0),P(25,0,0),P(25,12,0),P(12,12,0)],'#40525a');
 poly([P(25,0,0),P(25,12,0),P(25,12,-SLAB),P(25,0,-SLAB)],'#223742');
 poly([P(12,12,0),P(25,12,0),P(25,12,-SLAB),P(12,12,-SLAB)],'#293e49');
 poly([P(11.7,3.2,.015),P(14.2,3.2,.015),P(14.2,4.8,.015),P(11.7,4.8,.015)],'#6a7670');
}
function focusLogistics(dur){var c=worldCfg&&worldCfg.find(function(c){return c.key==='producao';});if(!c)return;var uv=tileUV(c.bx+18.5,c.by+6,1),k=Math.min(cw*.82/850,ch*.80/550)/s0;flyTo({cx:uv[0],cy:uv[1],k:k},dur||0);}
    function renderEnv(e, visitors) {`);
replace('drawOfficeExtension(e);','drawLogisticsExtension(e);drawOfficeExtension(e);');
replace("if(c.key==='escritorio')points.push", "if(c.key==='producao')points.push([12,0],[25,0],[25,12],[12,12]);if(c.key==='escritorio')points.push");
replace("lx>=0&&lx<W&&((ly>=0&&ly<roomDepth(c))||(c.key==='escritorio'&&lx<8&&ly>=-6&&ly<0))", "((lx>=0&&lx<W&&((ly>=0&&ly<roomDepth(c))||(c.key==='escritorio'&&lx<8&&ly>=-6&&ly<0)))||(c.key==='producao'&&lx>=12&&lx<25&&ly>=0&&ly<12))");
replace('zone: ly>=D||ly<0?-1:zoneOf(lx, ly)','zone: lx>=W||ly>=D||ly<0?-1:zoneOf(lx, ly)');
replace("my=c.key==='escritorio'?-6:0,rd=roomDepth(c),bwid=(W+rd-my)","my=c.key==='escritorio'?-6:0,rd=c.key==='producao'?12:roomDepth(c),rw=c.key==='producao'?25:W,bwid=(rw+rd-my)");
replace('tileUV(c.bx+W/2,c.by+(rd+my)/2,.9)','tileUV(c.bx+rw/2,c.by+(rd+my)/2,.9)');
replace('      focusManagerOffice:focusManagerOffice,',`      focusLogistics:focusLogistics,getLogisticsSpace:function(){var c=worldCfg&&worldCfg.find(function(c){return c.key==='producao';});return c?{area:logisticsSpace,items:c.env.items.filter(function(it){return it.warehouse;}).map(function(it){return {id:it.layoutKey,x:it.x,y:it.y,w:it.w,d:it.d,fixedScene:!!it.fixedScene};})}:null;},
      focusManagerOffice:focusManagerOffice,`);
replace('asset:it.visualAsset,managerRoom:', 'warehouse:!!it.warehouse,fixedScene:!!it.fixedScene,asset:it.visualAsset,managerRoom:');
fs.writeFileSync(file,s);
