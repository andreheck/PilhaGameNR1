/** Preserve usable map space and frame located employees without a covering sheet. */
import fs from 'node:fs';import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const path=root+'ui/continuous-game.js',text=fs.readFileSync(path,'utf8');
const old="map.select(SECTORS.findIndex(s=>s.id===p.current));map.iso.hoverEmployee(id);";
if(!text.includes(old))throw Error('Employee locate anchor changed');
const next="map.deselect();requestAnimationFrame(()=>requestAnimationFrame(()=>{map.iso.resize();if(!map.iso.focusEmployee(id,0)){const index=SECTORS.findIndex(s=>s.id===p.current);if(index>=0)map.iso.focus(index,-1,0);map.iso.hoverEmployee(id);}}));";
fs.writeFileSync(path,text.replace(old,next));
fs.appendFileSync(root+'ui/living-company.css',`\n@media(max-width:899px){.pm-root.has-panel{grid-template-rows:minmax(0,1fr) min(42dvh,360px)}.pm-root.has-panel .pm-ph>p{display:none}.pm-root.has-panel .pm-ph{padding:12px}.pm-root.has-panel .pm-ring{width:66px;height:66px;flex-basis:66px}.pm-root.has-panel .pm-ring b{font-size:24px}.pm-root.has-panel .pm-score{gap:10px}.pm-root.has-panel .pm-sgoal{margin-top:7px}.pm-root.has-panel .pm-ph__row h2{font-size:17px}}\n`);

// Route visits use one clock and existing aisle/bridge geometry; no teleport clones.
const isoPath=root+'ui/continuous/iso.js';let iso=fs.readFileSync(isoPath,'utf8');
const routines=fs.readFileSync(new URL('../ui/npc-routine-runtime.js',import.meta.url),'utf8');
iso=iso.replace('    function PFor(c,x,y,z){',routines+'\n    function PFor(c,x,y,z){');
iso=iso.replace('      setEmployees:setEmployees,','      setRoutineClock:setRoutineClock,\n      setEmployees:setEmployees,');
iso=iso.replace('stepCommuters(dt);','if(!routineClock)stepCommuters(dt);updateRoutinePeople();');
iso=iso.replace('var old=restVisitors;restVisitors=[];','if(routineClock)return;var old=restVisitors;restVisitors=[];');
iso=iso.replace('return result;}','commuters.forEach(function(p){var c=worldCfg&&worldCfg.find(function(c){return c.key===p.from;});if(c&&p.employeeId)result.push({id:p.employeeId,name:p.name,sector:c.key,x:p.x-c.bx,y:p.y-c.by,screen:PFor(c,p.x-c.bx,p.y-c.by,.7),moving:p.moving,health:p.score});});return result;}');
fs.writeFileSync(isoPath,iso);
const htmlPath=root+'index.html';fs.writeFileSync(htmlPath,fs.readFileSync(htmlPath,'utf8').replace('<script src="/ui/continuous/iso.js">','<script src="/ui/npc-route-navigation.js"></script><script src="/ui/continuous/iso.js">'));

// Expose camera bounds for regression assertions at the real canvas dimensions.
let finalIso=fs.readFileSync(isoPath,'utf8');
finalIso=finalIso.replace('      setRoutineClock:setRoutineClock,','      getWorldFrame:function(){return {left:ox+bounds.umin*s,top:oy+bounds.vmin*s,right:ox+bounds.umax*s,bottom:oy+bounds.vmax*s,width:cw,height:ch};},\n      setRoutineClock:setRoutineClock,');
fs.writeFileSync(isoPath,finalIso);
