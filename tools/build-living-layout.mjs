/** Preserve usable map space and frame located employees without a covering sheet. */
import fs from 'node:fs';import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
// Remaining compatibility adapter: routines still share the legacy renderer's
// private drawing state. Every insertion must match exactly once, never silently.
function patch(text,anchor,replacement){if(text.split(anchor).length!==2)throw Error('Living adapter anchor changed: '+anchor.slice(0,70));return text.replace(anchor,replacement);}
// Route visits use one clock and existing aisle/bridge geometry; no teleport clones.
const isoPath=root+'ui/continuous/iso.js';let iso=fs.readFileSync(isoPath,'utf8');
const routines=fs.readFileSync(new URL('../ui/npc-routine-runtime.js',import.meta.url),'utf8');
iso=patch(iso,'    function PFor(c,x,y,z){',routines+'\n    function PFor(c,x,y,z){');
iso=patch(iso,'      setEmployees:setEmployees,','      setRoutineClock:setRoutineClock,\n      setEmployees:setEmployees,');
iso=patch(iso,'stepCommuters(dt);','if(!routineClock)stepCommuters(dt);updateRoutinePeople();');
iso=patch(iso,'var old=restVisitors;restVisitors=[];','if(routineClock)return;var old=restVisitors;restVisitors=[];');
iso=patch(iso,'return result;}','commuters.forEach(function(p){var c=worldCfg&&worldCfg.find(function(c){return c.key===p.from;});if(c&&p.employeeId)result.push({id:p.employeeId,name:p.name,sector:c.key,x:p.x-c.bx,y:p.y-c.by,screen:PFor(c,p.x-c.bx,p.y-c.by,.7),moving:p.moving,health:p.score});});return result;}');
fs.writeFileSync(isoPath,iso);
const htmlPath=root+'index.html';fs.writeFileSync(htmlPath,patch(fs.readFileSync(htmlPath,'utf8'),'<script src="/ui/continuous/iso.js">','<script src="/ui/npc-route-navigation.js"></script><script src="/ui/continuous/iso.js">'));
