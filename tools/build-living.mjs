/** Adapt built continuous mode only; legacy scenes and old entry remain intact. */
import fs from 'node:fs';import {fileURLToPath} from 'node:url';
const out=fileURLToPath(new URL('../dist/',import.meta.url));
function replace(s,a,b){if(!s.includes(a))throw Error('Living anchor missing: '+a.slice(0,70));return s.replace(a,b);}
let iso=fs.readFileSync(out+'ui/continuous/iso.js','utf8');
iso=replace(iso,'var envs = {}, order =','var employeeRows=[],employeeHits=[],employeeHover=null,employeePaused=false;\n    var envs = {}, order =');
iso=replace(iso,'function setRestVisitors(list){','function setRestVisitorsLegacy(list){');
iso=replace(iso,'    function resize() {',`
    function setEmployees(rows){
      var first=!employeeRows.length;employeeRows=rows.slice();
      Object.keys(envs).forEach(function(key){
        var e=envs[key],members=employeeRows.filter(function(p){return p.home===key;}).sort(function(a,b){return a.id.localeCompare(b.id);});
        if(first){var templates=e.people.filter(function(p){return !p.sit;});e.people=members.map(function(p,i){return Object.assign({},templates[i]||{},aislePoint(i*AISLE_LENGTH/members.length),{employeeId:p.id,name:p.name,shirt:p.shirt,skin:p.skin,hair:p.hair,hairStyle:p.hairStyle,score:p.health,progress:i*AISLE_LENGTH/members.length,sit:false,npc:-1,wait:i*.11,speed:1.05,phase:i,seed:i*.71,restAway:false});});}
        // Persist world positions of remaining workers; remove absent actors and restore returnees.
        e.people=e.people.filter(function(p){return !p.employeeId||members.some(function(m){return m.id===p.employeeId;});});
        members.forEach(function(m,i){
          if(e.people.some(function(p){return p.employeeId===m.id;}))return;
          var point=aislePoint((i+.35)*AISLE_LENGTH/Math.max(1,members.length));
          e.people.push(Object.assign({},point,{employeeId:m.id,name:m.name,shirt:m.shirt,
             skin:m.skin,hair:m.hair,hairStyle:m.hairStyle,score:m.health,
             progress:(i+.35)*AISLE_LENGTH/Math.max(1,members.length),
             sit:false,npc:-1,wait:0,speed:1.05,phase:i,seed:i*.71,restAway:false}));
        });
        e.people.forEach(function(p){var m=employeeRows.find(function(x){return x.id===p.employeeId;});if(m){p.score=m.health;p.name=m.name;}});
      });commuters=[];render();
    }
    function setRestVisitors(list){
      if(!employeeRows.length)return setRestVisitorsLegacy(list);var old=restVisitors;restVisitors=[];
      Object.keys(envs).forEach(function(k){envs[k].people.forEach(function(p){p.restAway=false;});});
      var pos={biblioteca:[2.9,2.1],bosque:[6.6,2.1],meditacao:[10.6,3.3],auditorio:[2.5,6.5],patio:[9.5,6.6]};
      list.forEach(function(v,i){var p=getEnv(v.sid).people.find(function(x){return x.employeeId===v.id;});if(!p)return;p.restAway=true;var xy=pos[v.space]||pos.bosque;restVisitors.push(Object.assign({},p,{home:v.sid,worker:v.id,x:xy[0]+i%2*.3,y:xy[1]+i%2*.25,sit:true,moving:false,npc:-1}));});render();
    }
    function PFor(c,x,y,z){var a=bx,b=by;bx=c.bx;by=c.by;var q=P(x,y,z);bx=a;by=b;return {x:q[0],y:q[1]};}
    function employeePositions(){var result=[];if(worldCfg)worldCfg.forEach(function(c){c.env.people.filter(function(p){return p.employeeId&&!p.restAway;}).forEach(function(p){result.push({id:p.employeeId,name:p.name,sector:c.key,x:p.x,y:p.y,screen:PFor(c,p.x,p.y,.7),moving:!!p.moving,health:p.score});});});restVisitors.forEach(function(p){var c=worldCfg&&worldCfg.find(function(c){return c.key==='restauracao';});if(c)result.push({id:p.employeeId,name:p.name,sector:'restauracao',x:p.x,y:p.y,screen:PFor(c,p.x,p.y,.7),moving:false,health:p.score});});return result;}
    function focusEmployee(id,dur){
      if(!worldCfg)return false;
      var p=employeePositions().find(function(x){return x.id===id;});
      if(!p)return false;
      var c=worldCfg.find(function(x){return x.key===p.sector;});
      if(!c)return false;
      var uv=tileUV(c.bx+p.x,c.by+p.y,.7);
      employeeHover=id;
      flyTo({cx:uv[0],cy:uv[1],k:clamp(Math.max(2.15,Math.min(cam.k,3)),KMIN,KMAX)},dur==null?.55:dur);
      return true;
    }
    function pickEmployee(x,y){var hits=employeeHits.filter(function(h){return x>=h.x-h.w/2&&x<=h.x+h.w/2&&y>=h.y-h.h&&y<=h.y+5;});hits.sort(function(a,b){return Math.hypot(x-a.x,y-a.y+a.h*.5)-Math.hypot(x-b.x,y-b.y+b.h*.5);});return hits[0]?hits[0].id:null;}
    function resize() {`);
const healthLine=iso.split('\n').find(l=>l.includes('var hz =')&&l.includes('p.x'));
if(!healthLine)throw Error('Health drawing anchor missing');
iso=replace(iso,healthLine,healthLine+'\n      if(p.employeeId){hz=p.score/100;hl=.2+.8*hz;}');
iso=replace(iso,'      // balões de estado',`      if(p.employeeId){
        var hitHeight=1.5*u;employeeHits.push({id:p.employeeId,x:fx,y:fy,w:Math.max(22,.8*u),h:Math.max(30,hitHeight)});
        var dot=p.score>=70?'#4fce9b':p.score>=45?'#ffd166':'#fa6988';ell(fx,hy-.33*u,Math.max(3,u*.11),Math.max(3,u*.11),dot);
        if(employeeHover===p.employeeId){ctx.font='700 12px system-ui';var text=p.name+' '+Math.round(p.score)+'/100',tw=ctx.measureText(text).width+16;rr(fx-tw/2,fy-hitHeight-22,tw,23,7);ctx.fillStyle='#081b35ed';ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,fx,fy-hitHeight-10);}
      }
      // balões de estado`);
iso=replace(iso,'var walkers=e.people.filter(function(p){return !p.sit;})','var walkers=e.people.filter(function(p){return !p.sit&&!p.restAway;})');
iso=replace(iso,'    function render() {','    function render() {\n      employeeHits=[];');
iso=replace(iso,'connections=worldGeometry?worldGeometry.links:companyConnections(worldCfg);resetCommuters();','connections=worldGeometry?worldGeometry.links:companyConnections(worldCfg);if(!employeeRows.length)resetCommuters();else commuters=[];');
iso=replace(iso,'      setSharedIndexMode:',`      setEmployees:setEmployees,getEmployees:employeePositions,pickEmployee:pickEmployee,focusEmployee:focusEmployee,
      hoverEmployee:function(id){employeeHover=id;if(!running)render();},
      setManualPause:function(v){if(employeePaused===!!v)return;employeePaused=!!v;if(employeePaused){running=false;if(raf)global.cancelAnimationFrame(raf);raf=0;}else if(!running){isStatic=false;running=true;last=0;raf=global.requestAnimationFrame(loop);}render();},
      isManuallyPaused:function(){return employeePaused;},
      setSharedIndexMode:`);
iso=replace(iso,'if (isStatic || running) return;','if (isStatic || running || employeePaused) return;');
fs.writeFileSync(out+'ui/continuous/iso.js',iso);
let map=fs.readFileSync(out+'ui/continuous/map.js','utf8');
map=replace(map,'iso.setStatic(reduce);','iso.setStatic(false);');
map=replace(map,'    function onMapClick(p) {',`    function onMapClick(p) {var id=iso.pickEmployee(p.x,p.y);if(id&&o.onEmployee){o.onEmployee(id);return;}`);
map=replace(map,'var h = iso.pick(p.x, p.y); iso.setHover(h);','var id=iso.pickEmployee(p.x,p.y);iso.hoverEmployee(id);var h = iso.pick(p.x, p.y); iso.setHover(h);');
map=replace(map,'function onMotion() { reduce = motion.matches; iso.stop(); iso.setStatic(reduce); if (!reduce && !document.hidden) iso.start(); iso.render(); }','function onMotion(){reduce=motion.matches;iso.setStatic(false);if(!iso.isManuallyPaused())iso.start();iso.render();}');
map=replace(map,"function setMotion(reduced){reduce=!!reduced;iso.stop();iso.setStatic(reduce);if(!reduce&&!document.hidden)iso.start();iso.render();root.dataset.motion=reduce?'reduced':'on';}","function setMotion(reduced){reduce=!!reduced;iso.setStatic(false);if(!iso.isManuallyPaused())iso.start();iso.render();}");
fs.writeFileSync(out+'ui/continuous/map.js',map);
let intro=fs.readFileSync(out+'ui/claude/pilha-intro.js','utf8');
const a=intro.indexOf('    var reduce = motion.matches, motionChoice;'),b=intro.indexOf('    var signals =',a);if(a<0||b<0)throw Error('Intro anchor');
intro=intro.slice(0,a)+"    var reduce=motion.matches,motionChoice='on',leaving=false;\n"+intro.slice(b);
intro=replace(intro,"'</div></section><button type=\"button\" class=\"pi-motion\"></button>';","'</div></section>';");
const c=intro.indexOf("    var motionButton=root.querySelector('.pi-motion');"),d=intro.indexOf('    function later',c);if(c<0||d<0)throw Error('Intro button anchor');
intro=intro.slice(0,c)+`    function applyMotion(){root.dataset.motion=reduce?'reduced':'on';if(iso){iso.setStatic(false);iso.render();if(!invite.hidden)iso.start();}}
    function onSystemMotion(){reduce=motion.matches;applyMotion();}motion.addEventListener('change',onSystemMotion);
`+intro.slice(d);
intro=replace(intro,'    function start() {','    function start() {if(leaving)return;leaving=true;');
fs.writeFileSync(out+'ui/continuous/intro.js',intro);
let html=fs.readFileSync(out+'index.html','utf8');html=replace(html,'</head>','<link rel="stylesheet" href="/ui/claude/pilha-intro.css"><link rel="stylesheet" href="/ui/living-company.css"></head>');html=replace(html,'<script type="module" src="/ui/continuous-game.js">','<script src="/ui/continuous/intro.js"></script><script type="module" src="/ui/continuous-game.js">');fs.writeFileSync(out+'index.html',html);
console.log('Living mode: opening, named workers, manual pause and calendar.');
