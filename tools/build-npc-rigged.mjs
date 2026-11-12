/** Approved FBX-derived atlases replace only their canonical map actors. */
import fs from 'node:fs';
const root=new URL('../',import.meta.url),file=new URL('dist/ui/continuous/iso.js',root);
const catalog=JSON.parse(fs.readFileSync(new URL('data/continuous/npc-rigged.json',root),'utf8'));
const report=JSON.parse(fs.readFileSync(new URL('assets/npc-sprites/rigged/report.json',root),'utf8'));
const originalWalk=report.models.find(m=>m.key==='beatriz').clips.find(c=>/walk/i.test(c.name))?.duration||report.models.find(m=>m.key==='beatriz').clips[0].duration;
const bindings=Object.fromEntries(catalog.bindings.map(p=>[p.id,{key:p.key,anchorY:report.atlases.find(a=>a.id===p.id&&a.action==='walk').anchor?.[1]||1,walk:p.walk,idle:p.idle,talk:p.talk,walkDuration:report.atlases.find(a=>a.id===p.id&&a.action==='walk').duration||originalWalk,talkDuration:report.models.find(m=>m.key===p.key).clips[0].duration,walkFrames:report.atlases.find(a=>a.id===p.id&&a.action==='walk').frames,talkFrames:report.atlases.find(a=>a.id===p.id&&a.action==='talk')?.frames||8}]));
let source=fs.readFileSync(file,'utf8');
function replace(a,b){if(!source.includes(a))throw Error('Rigged NPC build anchor changed: '+a.slice(0,70));source=source.replace(a,b);}
replace('var employeeRows=[],employeeHits=[],employeeHover=null,employeePaused=false;',`var employeeRows=[],employeeHits=[],employeeHover=null,employeePaused=false;
    var riggedBindings=${JSON.stringify(bindings)},riggedImages={},riggedDrawn={};
    if(global.Image)Object.keys(riggedBindings).forEach(function(id){var row=riggedBindings[id];['walk','idle','talk'].forEach(function(action){if(!row[action])return;var img=new global.Image();riggedImages[id+'|'+action]=img;img.onload=function(){if(!running)render();};img.src=row[action];});});`);
const selector=source.split('\n').find(l=>l.includes('var sprite = p.isPlayer&&playerSpriteImage'));
replace(selector,selector+`
      var rigged=riggedBindings[p.employeeId],riggedAction=walking?'walk':(p.talking||sit&&p.activity!=='computer')&&rigged&&rigged.talk?'talk':'idle';
      var approvedSheet=riggedImages[p.employeeId+'|'+riggedAction];
      if(rigged)sprite=sit&&(p.activity==='computer'||p.activity==='using-chair')?null:(approvedSheet&&approvedSheet.complete&&approvedSheet.naturalWidth?approvedSheet:null);`);
replace('ctx.drawImage(sprite,frame*128,(p.facing||0)*192,128,192,fx-sw/2,fy-sh*anchor,sw,sh);','ctx.drawImage(sprite,frame*128,(p.facing||0)*192,128,192,fx-sw/2,fy-sh*(rigged?rigged.anchorY:anchor),sw,sh);');
replace('hr=.16*u;hy=fy-1.83*u;',`hr=.16*u;hy=fy-1.83*u;
      }
      if(p.talking&&(p.activity==='meeting'?p.isMeetingLeader:p.employeeId<p.partnerId)){
        var label=p.activity==='meeting'?'Reunião':'Conversa',socialY=hy-hr*3.6-10;
        ctx.save();ctx.font='700 10px system-ui';var socialWidth=ctx.measureText(label).width+12;
        rr(fx-socialWidth/2,socialY-11,socialWidth,18,6);ctx.fillStyle='#123b48';ctx.fill();ctx.strokeStyle='#82ddc1';ctx.stroke();ctx.fillStyle='#effff9';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,fx,socialY-2);ctx.restore();
      }
      if(p.activity==='computer'){`);
replace('var frames=p.isPlayer?(p.spriteFrames||8):8,frame=walking&&!isStatic?Math.floor(p.phase*1.4)%frames:Math.min(2,frames-1);',`var frames=p.isPlayer?(p.spriteFrames||8):8,frame=walking&&!isStatic?Math.floor(p.phase*1.4)%frames:Math.min(2,frames-1);
        if(rigged){var elapsed=riggedAction==='walk'&&p.riggedSeconds!=null?p.riggedSeconds:((routineClock?routineClock.elapsed+(routineClock.paused?0:performance.now()-routineClock.at):time*1000)/1000);
          var duration=riggedAction==='talk'?rigged.talkDuration:rigged.walkDuration;
          var frameCount=riggedAction==='talk'?rigged.talkFrames:rigged.walkFrames;frame=riggedAction==='idle'?0:Math.floor(Math.max(0,elapsed)/duration*frameCount)%frameCount;
          riggedDrawn[p.employeeId]={id:p.employeeId,key:rigged.key,action:riggedAction,frame:frame,elapsedSeconds:elapsed,durationSeconds:duration,frames:frameCount,direction:p.facing||0};}`);
replace('var phase=((elapsed/period-row.offset)%1+1)%1,k=row.scale||1,speed=row.speed||1,outEnd=row.outEnd,pauseEnd=row.pauseEnd,tripEnd=row.tripEnd;',
 'var phase=((elapsed/period-row.offset)%1+1)%1,k=row.scale||1,speed=row.speed||1,outEnd=row.outEnd,pauseEnd=row.pauseEnd,tripEnd=row.tripEnd;p.riggedSeconds=elapsed*.001*speed;');
replace('      employeeHits=[];', '      employeeHits=[];riggedDrawn={};');
replace('      setRoutineClock:setRoutineClock,',`      riggedAssetsStatus:function(){return {bindings:Object.keys(riggedBindings),loaded:Object.keys(riggedImages).filter(function(k){var i=riggedImages[k];return i.complete&&i.naturalWidth;}).length,drawn:Object.values(riggedDrawn)};},
      setRoutineClock:setRoutineClock,`);
fs.writeFileSync(file,source);
console.log('Rigged NPCs: Beatriz/NPC-16 and Mariana/NPC-07, canonical routes retained.');
