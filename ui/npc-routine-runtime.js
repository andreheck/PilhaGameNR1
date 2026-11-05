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
        var start=aislePoint(p.homeProgress||0),cache=JSON.stringify(worldCfg.map(function(c){return [c.key,c.bx,c.by];}))+c.key+row.space+p.employeeId;
        var path=routinePaths[cache]||(routinePaths[cache]=global.PilhaNpcRoutes.route(worldCfg,AISLE,connections,c.key,row.space,p.employeeId,start));
        if(!path.length)return;
        if(phase<tripEnd){p.restAway=true;var resting=phase>=outEnd&&phase<pauseEnd,t=phase<outEnd?phase/outEnd:phase<pauseEnd?1:1-(phase-pauseEnd)/(tripEnd-pauseEnd),q=global.PilhaNpcRoutes.sample(path,t),clone=Object.assign({},p,q,{from:c.key,to:'restauracao',worker:p.employeeId,home:c.key,sit:resting,moving:!routineClock.paused&&!resting,phase:elapsed*.012*speed,transit:!resting,npc:-1});
          if(resting){var dest=worldCfg.find(function(c){return c.key==='restauracao';});clone.x-=dest.bx;clone.y-=dest.by;restVisitors.push(clone);}else commuters.push(clone);
        }else{
          var u=(phase-tripEnd)/(1-tripEnd),plan=workActivity(u,{sector:c.key,hasWorkstation:!!p.workstation}),oldX=p.x,oldY=p.y;
          p.activity=plan.activity;p.carrying=plan.carrying;p.sit=plan.sit;p.progress=p.homeProgress||0;p.phase=elapsed*.006*speed;
          if(plan.activity==='to-workstation'||plan.activity==='from-workstation'){
            var station=p.workstation,workKey=cache+'|work|'+station.seatId,workPath=routinePaths[workKey]||(routinePaths[workKey]=global.PilhaNpcRoutes.routeWithin(AISLE,start,station));
            var q=global.PilhaNpcRoutes.sample(workPath,plan.route);if(q)Object.assign(p,q);
          }else if(plan.activity==='computer'){
            p.x=p.workstation.x;p.y=p.workstation.y;p.tx=p.x;p.ty=p.y;
          }else if(plan.moving){
            var distance=(p.homeProgress||0)+plan.route*AISLE_LENGTH*.38;Object.assign(p,aislePoint(distance));p.progress=distance;
          }else{
            Object.assign(p,aislePoint(p.homeProgress||0));p.progress=p.homeProgress||0;p.tx=p.x;p.ty=p.y;
          }
          p.vx=p.x-oldX;p.vy=p.y-oldY;p.moving=!routineClock.paused&&plan.moving;
        }

      });});
    }
