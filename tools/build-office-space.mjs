/** Adapt the spatial intent of PR74 to the current isometric engine, not its legacy Three scene. */
import fs from 'node:fs';import {OFFICE_SPACE} from '../data/continuous/office-space.js';
const file=new URL('../dist/ui/continuous/iso.js',import.meta.url);let s=fs.readFileSync(file,'utf8');
function replace(a,b){if(!s.includes(a))throw Error('Office space anchor: '+a.slice(0,90));s=s.replace(a,b);}
replace('    function renderEnv(e, visitors) {',`var officeSpace=${JSON.stringify(OFFICE_SPACE)};
function drawOfficeExtension(e){if(!worldCfg||e.key!=='escritorio')return;
 [officeSpace.manager,officeSpace.meeting,officeSpace.hr].forEach(function(room){var x=room.x,y=room.y,w=room.width,d=room.depth;
   poly([P(x,y,0),P(x+w,y,0),P(x+w,y+d,0),P(x,y+d,0)],room.floor,room.accent,Math.max(1,1.1*s));
   poly([P(x+.28,y+.28,.012),P(x+w-.28,y+.28,.012),P(x+w-.28,y+d-.28,.012),P(x+.28,y+d-.28,.012)],'rgba(255,255,255,.025)',null);
   if(room.id!=='hr'){var door=room.door,half=door.width/2;poly([P(door.x-half,door.y-.12,.025),P(door.x+half,door.y-.12,.025),P(door.x+half,door.y+.2,.025),P(door.x-half,door.y+.2,.025)],room.accent,null);}
 });
 poly([P(24,-6,0),P(24,0,0),P(24,0,-SLAB),P(24,-6,-SLAB)],'#1e3547');
 poly([P(0,-6,0),P(24,-6,0),P(24,-6,-SLAB),P(0,-6,-SLAB)],'#243b4d');
 // Each room has a distinct entrance; the HR door opens from the meeting room.
 poly([P(3.4,-.15,.015),P(4.6,-.15,.015),P(4.6,.35,.015),P(3.4,.35,.015)],'#597b86');
 poly([P(10.8,-.15,.015),P(12.2,-.15,.015),P(12.2,.35,.015),P(10.8,.35,.015)],'#597b86');
}
function focusManagerOffice(dur){var c=worldCfg&&worldCfg.find(function(c){return c.key==='escritorio';});if(!c)return;var uv=tileUV(c.bx+4,c.by-3,.7),k=Math.min(cw*.88/500,ch*.82/390)/s0;flyTo({cx:uv[0],cy:uv[1],k:k},dur||0);}
function officeRoomOccupants(c,room,visitors){return (c.env.people||[]).concat(visitors||[]).filter(function(p){return (p.employeeId||p.isPlayer)&&!p.restAway&&p.x>=room.x&&p.x<=room.x+room.width&&p.y>=room.y&&p.y<=room.y+room.depth;}).map(function(p){return {id:p.employeeId||p.id,name:p.name,position:p.isPlayer?'Explorador':p.position||'',activity:p.activity||'work',moving:!!p.moving,sitting:!!p.sit};});}
function drawManagerLabel(e,visitors){
 if(!worldCfg)return;
 if(e&&e.key==='escritorio'&&(selIdx===0||cam.k>1.6)){var c=e;[officeSpace.manager,officeSpace.meeting,officeSpace.hr].forEach(function(room){var q=P(c.bx+room.labelAt[0],c.by+room.labelAt[1],2.2);pill(q[0],q[1],room.name+' · '+room.caption,{fs:10,border:room.accent,bg:'rgba(8,20,38,.94)'});var occupants=officeRoomOccupants(c,room,visitors);if(!occupants.length&&room.id==='manager'){var manager=c.env.people.find(function(p){return !p.restAway&&p.workstation&&p.workstation.managerSeat;});if(manager)occupants=[{id:manager.employeeId,name:manager.name,position:manager.position,activity:manager.activity||'work',moving:!!manager.moving,sitting:!!manager.sit}];}if(!occupants.length&&room.id==='hr'){var hr=c.env.people.find(function(p){return !p.restAway&&p.employeeId==='NPC-04';});if(hr)occupants=[{id:hr.employeeId,name:hr.name,position:hr.position,activity:hr.activity||'work',moving:!!hr.moving,sitting:!!hr.sit}];}var names=occupants.map(function(p){return p.name;}).filter(Boolean),text=names.length?(room.id==='meeting'?'Em reunião · ':'Posto ocupado · ')+names.slice(0,2).join(', ')+(names.length>2?' +'+(names.length-2):''):(room.id==='meeting'?'Livre · encontros semanais no pátio':'Livre agora');var detail=P(c.bx+room.labelAt[0],c.by+room.labelAt[1]+.82,1.7);pill(detail[0],detail[1],text,{fs:9,border:occupants.length?room.accent:'#65809a',bg:'rgba(8,20,38,.88)'});});}
 if(e&&e.key==='restauracao'&&typeof routineClock!=='undefined'&&routineClock){var elapsed=routineClock.elapsed+(routineClock.paused?0:performance.now()-routineClock.at),attendees=(routineClock.rows||[]).filter(function(row){if(typeof row.sampleAt!=='function')return false;var pose=row.sampleAt(elapsed);return pose.meeting&&pose.inRestArea&&pose.space==='patio';}),names=attendees.map(function(p){return p.name;}).filter(Boolean);if(names.length){var q=P(e.bx+9.5,e.by+7.45,1.9),text='Reunião no pátio · '+names.slice(0,2).join(', ')+(names.length>2?' +'+(names.length-2):'');pill(q[0],q[1],text,{fs:9,border:'#67d8c2',bg:'rgba(8,20,38,.94)'});}}
}
    function renderEnv(e, visitors) {`);
replace('drawRestAnnex(e);drawWalls(e); drawFloor(e);','drawOfficeExtension(e);drawRestAnnex(e);drawWalls(e); drawFloor(e);');
const a=s.indexOf('    function worldBounds() {'),b=s.indexOf('    function applyCam()',a);if(a<0||b<0)throw Error('World bounds');
s=s.slice(0,a)+`    function worldBounds(){var b={umin:1e9,umax:-1e9,vmin:1e9,vmax:-1e9};worldCfg.forEach(function(c){var points=[[0,0],[W,0],[W,roomDepth(c)],[0,roomDepth(c)]];if(c.key==='escritorio')points.push([0,-6],[24,-6],[24,0],[0,0]);points.forEach(function(p){var u=(c.bx+p[0]-c.by-p[1])*TW/2,v=(c.bx+p[0]+c.by+p[1])*TH/2;b.umin=Math.min(b.umin,u);b.umax=Math.max(b.umax,u);b.vmin=Math.min(b.vmin,v-WALLH*ZU-50);b.vmax=Math.max(b.vmax,v+SLAB*ZU);});});return b;}
`+s.slice(b);
replace('lx >= 0 && lx < W && ly >= 0 && ly < roomDepth(c)',"lx>=0&&lx<W&&((ly>=0&&ly<roomDepth(c))||(c.key==='escritorio'&&lx<16&&ly>=-6&&ly<0))");
replace('zone: ly>=D?-1:zoneOf(lx, ly)', 'zone: ly>=D||ly<0?-1:zoneOf(lx, ly)');
replace('var c = worldCfg[i], rd=roomDepth(c), bwid = (W + rd)',"var c = worldCfg[i], my=c.key==='escritorio'?-6:0,rd=roomDepth(c),bwid=(W+rd-my+(c.key==='escritorio'?4:0))");
replace('uv = tileUV(c.bx + W / 2, c.by + rd / 2, 0.9);',"uv=tileUV(c.bx+(c.key==='escritorio'?8:W/2),c.by+(c.key==='escritorio'?1:rd/2),.9);");
replace("function wall(axis,length,color){", "if(worldCfg&&e.key==='escritorio'){doors.push({axis:'y',at:4});doors.push({axis:'y',at:11.5});}function wall(axis,length,color){");
replace('function face(a,b,z,h){if(b<=a)return;poly(', "function face(a,b,z,h){if(b<=a)return;if(worldCfg&&e.key==='escritorio'&&axis==='y'&&a<8&&b>8){face(a,8,z,h);face(8,b,z,h);return;}poly(");
replace('],color);}',"],worldCfg&&e.key==='escritorio'&&axis==='y'&&a<8?'rgba(117,202,218,.10)':color);}");
replace('var x0 = 0.9 + i * 2.25;',"var x0 = .9+i*2.25;if(worldCfg&&e.key==='escritorio'&&x0<8)continue;");
replace('      effects(e);','      effects(e);drawManagerLabel(worldCfg&&worldCfg.find(function(room){return room.env===e;})||e,visitors);');
replace('width:W,depth:roomDepth(c)',"width:W,depth:roomDepth(c),managerRoom:c.key==='escritorio'?officeSpace.manager:null,meetingRoom:c.key==='escritorio'?officeSpace.meeting:null,hrRoom:c.key==='escritorio'?officeSpace.hr:null");
replace('      focusAnnex:focusRestAnnex,',`      focusManagerOffice:focusManagerOffice,getOfficeSpace:function(){var c=worldCfg&&worldCfg.find(function(c){return c.key==='escritorio';});return c?{area:officeSpace.manager,meeting:officeSpace.meeting,hr:officeSpace.hr,occupancy:{manager:officeRoomOccupants(c,officeSpace.manager),meeting:officeRoomOccupants(c,officeSpace.meeting),hr:officeRoomOccupants(c,officeSpace.hr)},partitions:c.env.items.filter(function(it){return it.structural;}).map(function(it){return {id:it.id,x:it.x,y:it.y,w:it.w,d:it.d};}),manager:c.env.people.filter(function(p){return p.workstation&&p.workstation.managerSeat;}).map(function(p){return {id:p.employeeId,workstation:p.workstation};}),meetingFurniture:c.env.items.filter(function(it){return it.managerRoom&&!it.managerDesk;}).map(function(it){return {id:it.layoutKey,type:it.t,x:it.x,y:it.y};})}:null;},
      focusAnnex:focusRestAnnex,`);
replace('annex:!!it.annex,walkable:!!it.walkable', 'asset:it.visualAsset,managerRoom:!!it.managerRoom,meetingRoom:!!it.meetingRoom,hrRoom:!!it.hrRoom,hrEmployeeId:it.hrEmployeeId||null,managerDesk:!!it.managerDesk,structural:!!it.structural,annex:!!it.annex,walkable:!!it.walkable');
fs.writeFileSync(file,s);
