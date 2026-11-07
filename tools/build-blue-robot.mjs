import fs from 'node:fs';
const file=new URL('../dist/ui/continuous/iso.js',import.meta.url);let s=fs.readFileSync(file,'utf8');
function replace(a,b){if(!s.includes(a))throw Error('Robot anchor: '+a);s=s.replace(a,b);}
replace('var employeeRows=[],employeeHits=[],employeeHover=null,employeePaused=false;',`var employeeRows=[],employeeHits=[],employeeHover=null,employeePaused=false;
 var robotWalk=global.Image?new global.Image():null,robotIdle=global.Image?new global.Image():null;if(robotWalk){robotWalk.src='/assets/robots/blue-robot-walk.png';robotIdle.src='/assets/robots/blue-robot-idle.png';}`);
replace('});commuters=[];render();',`});var factory=envs.producao;if(factory&&!factory.people.some(function(p){return p.robotId;}))factory.people.push(Object.assign(aislePoint(0),{robotId:true,name:'Robô Azul',npc:-1,shirt:'#278cda',skin:'#278cda',hair:'#278cda',score:100,sit:false,phase:0,seed:0,wait:0,speed:1,moving:true}));commuters=[];render();`);
replace('if(!p.employeeId)return;',`if(p.robotId){var day=120000/7,phase=((elapsed/day)%1+1)%1,work=47/48,recharging=phase>=work,point=aislePoint(recharging?0:phase/work*AISLE_LENGTH),dx=point.x-p.x,dy=point.y-p.y;p.x=point.x;p.y=point.y;p.moving=!recharging;p.activity=recharging?'recharge':'robot-work';p.phase=elapsed/1000*8/1.0333333/1.4;p.facing=Math.abs(dx)>Math.abs(dy)?(dx>0?0:2):(dy>0?1:3);p.robotBattery=recharging?20+80*(phase-work)*48:100-80*phase/work;return;}if(!p.employeeId)return;`);
const selector=s.split('\n').find(l=>l.includes('var sprite = sharedIndexMode'));
replace(selector,selector+`
 if(p.robotId){sprite=p.moving?robotWalk:robotIdle;}`);
replace('fy-sh*(rigged?rigged.anchorY:1)','fy-sh*(p.robotId?.7919900286:rigged?rigged.anchorY:1)');
replace("if(p.activity==='computer'){",`if(p.robotId){ctx.save();ctx.font='bold 10px system-ui';ctx.fillStyle='#a9e8ff';ctx.textAlign='center';ctx.fillText(p.activity==='recharge'?'⚡ Recarga':'⚡ '+Math.round(p.robotBattery||100)+'%',fx,hy-14);ctx.restore();}if(p.activity==='computer'){`);
replace('getEmployees:employeePositions,',`getEmployees:employeePositions,getRobotActor:function(){var p=envs.producao&&envs.producao.people.find(function(p){return p.robotId;});return p?{x:p.x,y:p.y,moving:p.moving,activity:p.activity,battery:p.robotBattery,loaded:!!(robotWalk&&robotWalk.complete&&robotWalk.naturalWidth)}:null;},`);
replace('if (hz < 0.35 &&','if (!p.robotId && hz < 0.35 &&');
replace('} else if (hz > 0.8 &&','} else if (!p.robotId && hz > 0.8 &&');
fs.writeFileSync(file,s);
