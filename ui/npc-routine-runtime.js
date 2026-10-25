    var routineClock=null,routinePaths={};
    function setRoutineClock(state,rows){
      var elapsed=(state.week-1)*120000+state.activeMs;
      routineClock={elapsed:elapsed,at:performance.now(),paused:state.paused,rows:rows};updateRoutinePeople();if(!running)render();
    }
    function updateRoutinePeople(){
      if(!routineClock||!worldCfg)return;
      var elapsed=routineClock.elapsed+(routineClock.paused?0:performance.now()-routineClock.at),period=120000*2/7;
      restVisitors=[];commuters=[];
      worldCfg.forEach(function(c){c.env.people.forEach(function(p){if(!p.employeeId)return;
        var row=routineClock.rows.find(function(r){return r.id===p.employeeId;});p.restAway=false;if(!row)return;
        var phase=((elapsed/period-row.offset)%1+1)%1,k=row.scale||1,speed=row.speed||1,outEnd=row.outEnd,pauseEnd=row.pauseEnd,tripEnd=row.tripEnd;
        var cache=JSON.stringify(worldCfg.map(function(c){return [c.key,c.bx,c.by];}))+c.key+row.space+p.employeeId;
        var path=routinePaths[cache]||(routinePaths[cache]=global.PilhaNpcRoutes.route(worldCfg,AISLE,connections,c.key,row.space,p.employeeId));
        if(!path.length)return;
        if(phase<tripEnd){p.restAway=true;var resting=phase>=outEnd&&phase<pauseEnd,t=phase<outEnd?phase/outEnd:phase<pauseEnd?1:1-(phase-pauseEnd)/(tripEnd-pauseEnd),q=global.PilhaNpcRoutes.sample(path,t),clone=Object.assign({},p,q,{from:c.key,to:'restauracao',worker:p.employeeId,home:c.key,sit:resting,moving:!routineClock.paused&&!resting,phase:elapsed*.012*speed,transit:!resting,npc:-1});
          if(resting){var dest=worldCfg.find(function(c){return c.key==='restauracao';});clone.x-=dest.bx;clone.y-=dest.by;restVisitors.push(clone);}else commuters.push(clone);
        }else{var u=(phase-tripEnd)/(1-tripEnd),distance=(u<.5?u*2:(1-u)*2)*AISLE_LENGTH*.5*speed,oldX=p.x,oldY=p.y;Object.assign(p,aislePoint(distance));p.progress=distance;p.vx=p.x-oldX;p.vy=p.y-oldY;p.moving=!routineClock.paused;p.phase=elapsed*.006*speed;}

      });});
    }
