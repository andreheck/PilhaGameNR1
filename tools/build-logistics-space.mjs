/** Production annex on the compiled renderer. Never adds a sector or changes economics. */
import fs from 'node:fs';import {LOGISTICS_SPACE} from '../data/continuous/logistics-space.js';import {WORLD_PLOT} from '../data/continuous/world-expansion.js';
const file=new URL('../dist/ui/continuous/iso.js',import.meta.url);let s=fs.readFileSync(file,'utf8');
function replace(a,b){if(!s.includes(a))throw Error('Logistics anchor: '+a.slice(0,100));s=s.replace(a,b);}
replace('    function renderEnv(e, visitors) {',`var logisticsSpace=${JSON.stringify(LOGISTICS_SPACE)},worldPlot=${JSON.stringify(WORLD_PLOT)};
function drawWorldPlot(){if(!worldCfg)return;var oldX=bx,oldY=by;bx=0;by=0;var x=worldPlot.x,y=worldPlot.y,n=worldPlot.size,z=-SLAB-.42;
 poly([P(x,y,z),P(x+n,y,z),P(x+n,y+n,z),P(x,y+n,z)],'#122b38','#416477',Math.max(2,2.1*s));
 worldPlot.reservedLots.forEach(function(lot){var q=[P(lot.x,lot.y,-SLAB-.025),P(lot.x+lot.size,lot.y,-SLAB-.025),P(lot.x+lot.size,lot.y+lot.size,-SLAB-.025),P(lot.x,lot.y+lot.size,-SLAB-.025)];poly(q,'rgba(93,181,194,.045)','rgba(112,204,216,.44)',Math.max(1.2,1.4*s));if(cam.k>=.82){var c=P(lot.x+lot.size/2,lot.y+lot.size/2,-.18);pill(c[0],c[1],lot.name,{fs:Math.max(8,9*s),bg:'rgba(7,23,38,.72)',border:'rgba(112,204,216,.35)',color:'#a8cbd5'});}});bx=oldX;by=oldY;}
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
const wa=s.indexOf('    function worldBounds(){'),wb=s.indexOf('    function applyCam()',wa);if(wa<0||wb<0)throw Error('Square world bounds');
s=s.slice(0,wa)+`    function worldBounds(){var b={umin:1e9,umax:-1e9,vmin:1e9,vmax:-1e9};worldCfg.forEach(function(c){var points=[[0,0],[W,0],[W,roomDepth(c)],[0,roomDepth(c)]];if(c.key==='producao')points.push([12,0],[25,0],[25,12],[12,12]);if(c.key==='escritorio')points.push([0,-6],[8,-6],[8,0]);points.forEach(function(p){var u=(c.bx+p[0]-c.by-p[1])*TW/2,v=(c.bx+p[0]+c.by+p[1])*TH/2;b.umin=Math.min(b.umin,u);b.umax=Math.max(b.umax,u);b.vmin=Math.min(b.vmin,v-WALLH*ZU-50);b.vmax=Math.max(b.vmax,v+SLAB*ZU);});});[[worldPlot.x,worldPlot.y],[worldPlot.x+worldPlot.size,worldPlot.y],[worldPlot.x+worldPlot.size,worldPlot.y+worldPlot.size],[worldPlot.x,worldPlot.y+worldPlot.size]].forEach(function(p){var u=(p[0]-p[1])*TW/2,v=(p[0]+p[1])*TH/2;b.umin=Math.min(b.umin,u);b.umax=Math.max(b.umax,u);b.vmin=Math.min(b.vmin,v-SLAB*ZU-20);b.vmax=Math.max(b.vmax,v+SLAB*ZU);});return b;}
`+s.slice(wb);
replace('      applyCam();\n      drawPlazas(); drawLinks();','      applyCam();\n      drawWorldPlot();drawPlazas(); drawLinks();');
replace('      focusManagerOffice:focusManagerOffice,',`      getWorldPlot:function(){return worldPlot;},focusLogistics:focusLogistics,getLogisticsSpace:function(){var c=worldCfg&&worldCfg.find(function(c){return c.key==='producao';});return c?{area:logisticsSpace,items:c.env.items.filter(function(it){return it.warehouse;}).map(function(it){return {id:it.layoutKey,x:it.x,y:it.y,w:it.w,d:it.d,fixedScene:!!it.fixedScene};})}:null;},
      focusManagerOffice:focusManagerOffice,`);
replace('asset:it.visualAsset,managerRoom:', 'warehouse:!!it.warehouse,fixedScene:!!it.fixedScene,asset:it.visualAsset,managerRoom:');
fs.writeFileSync(file,s);
