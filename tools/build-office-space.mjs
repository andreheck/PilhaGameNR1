/** Adapt the spatial intent of PR74 to the current isometric engine, not its legacy Three scene. */
import fs from 'node:fs';import {OFFICE_SPACE} from '../data/continuous/office-space.js';
const file=new URL('../dist/ui/continuous/iso.js',import.meta.url);let s=fs.readFileSync(file,'utf8');
function replace(a,b){if(!s.includes(a))throw Error('Office space anchor: '+a.slice(0,90));s=s.replace(a,b);}
replace('    function renderEnv(e, visitors) {',`var officeSpace=${JSON.stringify(OFFICE_SPACE)};
function drawOfficeExtension(e){if(!worldCfg||e.key!=='escritorio')return;
 poly([P(0,-6,0),P(8,-6,0),P(8,0,0),P(0,0,0)],'#344c59');
 poly([P(8,-6,0),P(16,-6,0),P(16,0,0),P(8,0,0)],'#334a55');
 poly([P(16,-6,0),P(16,0,0),P(16,0,-SLAB),P(16,-6,-SLAB)],'#1e3547');
 poly([P(0,-6,0),P(16,-6,0),P(16,-6,-SLAB),P(0,-6,-SLAB)],'#243b4d');
 // Both rooms open to the main office; a shared door connects them inside.
 poly([P(3.4,-.15,.015),P(4.6,-.15,.015),P(4.6,.35,.015),P(3.4,.35,.015)],'#597b86');
 poly([P(10.8,-.15,.015),P(12.2,-.15,.015),P(12.2,.35,.015),P(10.8,.35,.015)],'#597b86');
}
function focusManagerOffice(dur){var c=worldCfg&&worldCfg.find(function(c){return c.key==='escritorio';});if(!c)return;var uv=tileUV(c.bx+4,c.by-3,.7),k=Math.min(cw*.88/500,ch*.82/390)/s0;flyTo({cx:uv[0],cy:uv[1],k:k},dur||0);}
function drawManagerLabel(){var c=worldCfg&&worldCfg.find(function(c){return c.key==='escritorio';});if(!c||!(selIdx===0||cam.k>1.6))return;var q=P(c.bx+4,c.by-5.7,2.2),m=P(c.bx+12,c.by-5.7,2.2);pill(q[0],q[1],'Sala do gerente',{fs:11,border:'#83c8d8'});pill(m[0],m[1],'Sala de reuniões',{fs:11,border:'#83c8d8'});}
    function renderEnv(e, visitors) {`);
replace('drawRestAnnex(e);drawWalls(e); drawFloor(e);','drawOfficeExtension(e);drawRestAnnex(e);drawWalls(e); drawFloor(e);');
const a=s.indexOf('    function worldBounds() {'),b=s.indexOf('    function applyCam()',a);if(a<0||b<0)throw Error('World bounds');
s=s.slice(0,a)+`    function worldBounds(){var b={umin:1e9,umax:-1e9,vmin:1e9,vmax:-1e9};worldCfg.forEach(function(c){var points=[[0,0],[W,0],[W,roomDepth(c)],[0,roomDepth(c)]];if(c.key==='escritorio')points.push([0,-6],[16,-6],[16,0],[0,0]);points.forEach(function(p){var u=(c.bx+p[0]-c.by-p[1])*TW/2,v=(c.bx+p[0]+c.by+p[1])*TH/2;b.umin=Math.min(b.umin,u);b.umax=Math.max(b.umax,u);b.vmin=Math.min(b.vmin,v-WALLH*ZU-50);b.vmax=Math.max(b.vmax,v+SLAB*ZU);});});return b;}
`+s.slice(b);
replace('lx >= 0 && lx < W && ly >= 0 && ly < roomDepth(c)',"lx>=0&&lx<W&&((ly>=0&&ly<roomDepth(c))||(c.key==='escritorio'&&lx<16&&ly>=-6&&ly<0))");
replace('zone: ly>=D?-1:zoneOf(lx, ly)', 'zone: ly>=D||ly<0?-1:zoneOf(lx, ly)');
replace('var c = worldCfg[i], rd=roomDepth(c), bwid = (W + rd)',"var c = worldCfg[i], my=c.key==='escritorio'?-6:0,rd=roomDepth(c),bwid=(W+rd-my+(c.key==='escritorio'?4:0))");
replace('uv = tileUV(c.bx + W / 2, c.by + rd / 2, 0.9);',"uv=tileUV(c.bx+(c.key==='escritorio'?8:W/2),c.by+(c.key==='escritorio'?1:rd/2),.9);");
replace("function wall(axis,length,color){", "if(worldCfg&&e.key==='escritorio'){doors.push({axis:'y',at:4});doors.push({axis:'y',at:11.5});}function wall(axis,length,color){");
replace('function face(a,b,z,h){if(b<=a)return;poly(', "function face(a,b,z,h){if(b<=a)return;if(worldCfg&&e.key==='escritorio'&&axis==='y'&&a<8&&b>8){face(a,8,z,h);face(8,b,z,h);return;}poly(");
replace('],color);}',"],worldCfg&&e.key==='escritorio'&&axis==='y'&&a<8?'rgba(117,202,218,.10)':color);}");
replace('var x0 = 0.9 + i * 2.25;',"var x0 = .9+i*2.25;if(worldCfg&&e.key==='escritorio'&&x0<8)continue;");
replace('drawFurnitureEditOverlay();','drawFurnitureEditOverlay();drawManagerLabel();');
replace('width:W,depth:roomDepth(c)',"width:W,depth:roomDepth(c),managerRoom:c.key==='escritorio'?officeSpace.manager:null,meetingRoom:c.key==='escritorio'?officeSpace.meeting:null");
replace('      focusAnnex:focusRestAnnex,',`      focusManagerOffice:focusManagerOffice,getOfficeSpace:function(){var c=worldCfg&&worldCfg.find(function(c){return c.key==='escritorio';});return c?{area:officeSpace.manager,meeting:officeSpace.meeting,partitions:c.env.items.filter(function(it){return it.structural;}).map(function(it){return {id:it.id,x:it.x,y:it.y,w:it.w,d:it.d};}),manager:c.env.people.filter(function(p){return p.workstation&&p.workstation.managerSeat;}).map(function(p){return {id:p.employeeId,workstation:p.workstation};}),meetingFurniture:c.env.items.filter(function(it){return it.managerRoom&&!it.managerDesk;}).map(function(it){return {id:it.layoutKey,type:it.t,x:it.x,y:it.y};})}:null;},
      focusAnnex:focusRestAnnex,`);
replace('annex:!!it.annex,walkable:!!it.walkable', 'asset:it.visualAsset,managerRoom:!!it.managerRoom,managerDesk:!!it.managerDesk,structural:!!it.structural,annex:!!it.annex,walkable:!!it.walkable');
fs.writeFileSync(file,s);
