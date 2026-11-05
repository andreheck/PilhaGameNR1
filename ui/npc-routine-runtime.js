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
        if(row.sampleAt){
          var pose=row.sampleAt(elapsed),speed=row.speed*(row.motionRate||1),oldX=p.x,oldY=p.y;
          p.riggedSeconds=elapsed*.001*speed;p.talking=!!pose.talking;p.partnerId=pose.partnerId;p.activity=pose.stage;p.isMeetingLeader=p.employeeId===pose.managerId;
          if(p.talking)p.facing=p.employeeId<pose.partnerId?0:2;
          if(pose.kind==='work'){
            p.riggedSeconds*=1-(row.workSlot%6)*.02;
            var distance=pose.workFraction*AISLE_LENGTH*.5;
            if(pose.talking)distance+=p.employeeId<pose.partnerId?-.28:.28;
            Object.assign(p,aislePoint(distance));p.vx=p.x-oldX;p.vy=p.y-oldY;p.progress=distance;p.moving=!routineClock.paused&&pose.moving;p.phase=elapsed*.006*speed;
          }else{
            var target=pose.target||pose.space,cache=JSON.stringify(worldCfg.map(function(c){return [c.key,c.bx,c.by];}))+c.key+target+p.employeeId;
            var path=routinePaths[cache]||(routinePaths[cache]=global.PilhaNpcRoutes.route(worldCfg,AISLE,connections,c.key,target,p.employeeId,aislePoint(p.homeProgress||0)));
            if(!path.length)return;
            var q=global.PilhaNpcRoutes.sample(path,pose.progress),nextQ=global.PilhaNpcRoutes.sample(path,pose.progress+(pose.stage.includes('return')?-.001:.001)),resting=pose.holding,clone=Object.assign({},p,q,{from:c.key,to:'restauracao',worker:p.employeeId,home:c.key,sit:resting&&!pose.meeting,moving:!routineClock.paused&&!resting,phase:elapsed*.012*speed,transit:!resting,npc:-1,talking:!!pose.talking,activity:pose.stage,vx:nextQ.x-q.x,vy:nextQ.y-q.y});
            if(resting){var dest=worldCfg.find(function(c){return c.key==='restauracao';});if(dest){clone.x-=dest.bx;clone.y-=dest.by;}if(pose.meeting){var faceX=9.8-clone.x,faceY=5.15-clone.y;clone.facing=Math.abs(faceX)>Math.abs(faceY)?(faceX>0?1:3):(faceY>0?0:2);}restVisitors.push(clone);}else commuters.push(clone);
            p.restAway=true;
          }
          return;
        }
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
