/** Preserve usable map space and frame located employees without a covering sheet. */
import fs from 'node:fs';import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const path=root+'ui/continuous-game.js',text=fs.readFileSync(path,'utf8');
const old="map.select(SECTORS.findIndex(s=>s.id===p.current));map.iso.hoverEmployee(id);";
if(!text.includes(old))throw Error('Employee locate anchor changed');
const next="const index=SECTORS.findIndex(s=>s.id===p.current);map.deselect();requestAnimationFrame(()=>requestAnimationFrame(()=>{map.iso.resize();map.iso.focus(index,-1,0);map.iso.hoverEmployee(id);}));";
fs.writeFileSync(path,text.replace(old,next));
fs.appendFileSync(root+'ui/living-company.css',`\n@media(max-width:899px){.pm-root.has-panel{grid-template-rows:minmax(0,1fr) min(42dvh,360px)}.pm-root.has-panel .pm-ph>p{display:none}.pm-root.has-panel .pm-ph{padding:12px}.pm-root.has-panel .pm-ring{width:66px;height:66px;flex-basis:66px}.pm-root.has-panel .pm-ring b{font-size:24px}.pm-root.has-panel .pm-score{gap:10px}.pm-root.has-panel .pm-sgoal{margin-top:7px}.pm-root.has-panel .pm-ph__row h2{font-size:17px}}\n`);
