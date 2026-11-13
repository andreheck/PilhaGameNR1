import fs from 'node:fs';
const file=new URL('../dist/ui/continuous/iso.js',import.meta.url);let s=fs.readFileSync(file,'utf8');
function replace(a,b){if(!s.includes(a))throw Error('Intro cast anchor: '+a.slice(0,90));s=s.replace(a,b);}
replace('var employeeRows=[],employeeHits=[],employeeHover=null,employeePaused=false;',`var employeeRows=[],employeeHits=[],employeeHover=null,employeePaused=false;var introCastImages={},introCastRows=[],introCastDrawn={};
 function setIntroCast(rows){introCastRows=rows.slice();introCastImages={};['escritorio','producao','atendimento'].forEach(function(key){var e=getEnv(key),members=rows.filter(function(m){return m.sector===key;});e.people=members.map(function(m,i){var d=(i+.5)*AISLE_LENGTH/Math.max(1,members.length),point=aislePoint(d);if(global.Image){var image=new global.Image();image.onload=function(){if(!running)render();};image.src=m.file;introCastImages[m.id]=image;}return Object.assign({},point,{introCastKey:m.id,progress:d,homeProgress:d,phase:i*.8,seed:i*.7,sit:false,npc:-1,moving:true,speed:.50+(i%4)*.09,wait:0,shirt:'#4c9fb5',skin:'#bd8e70',hair:'#302622',score:70});});});render();}
`);
const selector=s.split('\n').find(l=>l.includes('var sprite = p.isPlayer&&playerSpriteImage'));
replace(selector,selector+`
 var introDef=p.introCastKey&&introCastRows.find(function(m){return m.id===p.introCastKey;}),introImage=introDef&&introCastImages[introDef.id];if(introDef&&introImage&&introImage.complete&&introImage.naturalWidth)sprite=introImage;`);
replace('var sh=(p.isPlayer?(p.spriteHeight||2.15):2.15)*u,sw=sh*128/192,anchor=p.isPlayer?(p.spriteAnchorY||.739):1;',`if(introDef)frame=walking&&!isStatic?Math.floor(time*Math.min(.8,p.speed)/Math.max(.8,introDef.duration)*(introDef.frames||8))%(introDef.frames||8):0;
        var sh=(introDef?(introDef.renderHeight||2.7):p.isPlayer?(p.spriteHeight||2.15):2.15)*u,sw=sh*128/192,anchor=introDef?introDef.anchorY:(p.isPlayer?(p.spriteAnchorY||.739):1);if(introDef)introCastDrawn[introDef.id]={id:introDef.id,frame:frame,x:p.x,y:p.y,moving:p.moving,sector:e.key};`);
replace('fy-sh*(p.robotId?.7919900286:rigged?rigged.anchorY:anchor)','fy-sh*(introDef?introDef.anchorY:p.robotId?.7919900286:rigged?rigged.anchorY:anchor)');
replace('      setRoutineClock:setRoutineClock,',`      setIntroCast:setIntroCast,getIntroCastStatus:function(){return {count:introCastRows.length,loaded:Object.values(introCastImages).filter(function(i){return i.complete&&i.naturalWidth;}).length,drawn:Object.values(introCastDrawn)};},
      setRoutineClock:setRoutineClock,`);
replace('if (!p.robotId && !p.isPlayer && hz < 0.35 &&',"if (!p.robotId && !p.isPlayer && p.introCastKey!=='robo' && hz < 0.35 &&");
replace('} else if (!p.robotId && !p.isPlayer && hz > 0.8 &&',"} else if (!p.robotId && !p.isPlayer && p.introCastKey!=='robo' && hz > 0.8 &&");
fs.writeFileSync(file,s);
