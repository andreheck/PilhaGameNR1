    var routineClock=null,routinePaths={};
    function setRoutineClock(state,rows){
      var elapsed=(state.week-1)*routineWeekMs+state.activeMs;
      routineClock={elapsed:elapsed,at:performance.now(),paused:state.paused,rows:rows};if(Object.keys(routinePaths).length>512)routinePaths={};updateRoutinePeople();if(!running)render();
    }
    function updateRoutinePeople(){
      if(!routineClock||!worldCfg)return;
      var elapsed=routineClock.elapsed+(routineClock.paused?0:performance.now()-routineClock.at),period=routineWeekMs*2/7;
      restVisitors=[];commuters=[];
      worldCfg.forEach(function(c){c.env.people.forEach(function(p){if(!p.employeeId)return;
        var row=routineClock.rows.find(function(r){return r.id===p.employeeId;});p.restAway=false;p.chairInUse=null;p.chairHealthBonus=0;if(!row)return;
        if(row.sampleAt){
          var pose=row.sampleAt(elapsed),speed=row.speed*(row.motionRate||1),oldX=p.x,oldY=p.y;
          p.riggedSeconds=elapsed*.001*speed;p.talking=!!pose.talking;p.partnerId=pose.partnerId;p.activity=pose.stage;p.isMeetingLeader=p.employeeId===pose.managerId;
          if(p.talking)p.facing=p.employeeId<pose.partnerId?0:2;
          if(pose.kind==='work'){
            p.riggedSeconds*=1-(row.workSlot%6)*.02;
            var distance=pose.gatherFraction*AISLE_LENGTH*.5;
            // Give every actor the same gather anchor before, during and after
            // conversation, so a partner appearing cannot teleport the actor.
            distance+=(row.workSlot%2?1:-1)*.26;
            var home=aislePoint(p.homeProgress||0),gather=aislePoint(distance);
            var points={home:home,gather:gather,station:p.workstation||home,source:p.materialSource||home,destination:p.materialDestination||home};
            // Keep this destination stable for the complete work window. A new
            // purchase/reassignment takes effect on the next trip, not by teleport.
            if(!p.workChair||p.workChair.window!==pose.workStart)p.workChair={window:pose.workStart,id:p.chair&&pose.workStart/routineWeekMs+1>=p.chair.activeFrom?p.chair.id:null,assignedAt:p.chair&&p.chair.assignedAt};
            var chairItem=p.workChair.id&&c.env.items.find(function(it){return !it.layoutHidden&&(it.visualId===p.workChair.id||(it.visualIds||[]).includes(p.workChair.id));}),chairAsset=chairItem&&furnitureCatalog&&furnitureCatalog.assets.find(function(a){return a.id===chairItem.visualAsset;}),seat=chairAsset&&chairAsset.seats&&chairAsset.seats[0];
            if(seat){var sx=seat.x,sy=seat.y,ww=chairItem.baseW||chairItem.w,dd=chairItem.baseD||chairItem.d;for(var turn=0;turn<(chairItem.turn||0);turn++){var nx=sy;sy=ww-sx;sx=nx;var size=ww;ww=dd;dd=size;}points.gather={x:chairItem.x+sx,y:chairItem.y+sy,item:{x:chairItem.x,y:chairItem.y,w:chairItem.w,d:chairItem.d,type:'individualChair'}};}
            var paths={};[['home','station'],['station','gather'],['station','home'],['destination','home'],['home','source'],['source','destination'],['destination','gather'],['home','gather'],['gather','home']].forEach(function(pair){var from=points[pair[0]],to=points[pair[1]],chairLeg=seat&&(pair.includes('gather')),key=c.key+'|'+p.employeeId+'|'+c.env.workRevision+'|'+[from.x,from.y,to.x,to.y].map(function(n){return n.toFixed(4);}).join(',')+'|'+(chairLeg?p.workChair.id:'');paths[pair.join('|')]=routinePaths[key]||(routinePaths[key]=global.PilhaNpcRoutes.routeWithin(AISLE,from,to,chairLeg?c.env.items.filter(function(it){return it!==chairItem;}):c.env.items));});
            var duration=pose.workEnd-pose.workStart;
            var plan=pacedWorkPlan((elapsed-pose.workStart)/duration,{durationMs:duration,conversationMs:routineWeekMs/24,sector:c.key,hasWorkstation:!!p.workstation,speed:speed,paths:paths});
            p.talking=!!pose.talking&&plan.activity==='conversation';
            if(seat&&plan.activity==='conversation'){plan.activity='using-chair';plan.sit=true;plan.seatProgress=1;plan.carrying=null;p.talking=false;if(p.chair&&p.chair.id===p.workChair.id&&p.chair.assignedAt===p.workChair.assignedAt){p.chairInUse=p.chair.id;p.chairHealthBonus=p.chair.healthBonus;}}
            p.activity=plan.activity;p.interaction=plan.interaction||null;p.handlingProgress=plan.handlingProgress||0;p.carrying=plan.carrying;p.seatProgress=plan.seatProgress??(plan.sit?1:0);p.sit=p.seatProgress>.02;p.seatHeight=seat&&plan.activity==='using-chair'?seat.height:.47;p.workTarget=points[plan.to];if(!plan.moving&&p.workTarget&&p.workTarget.item){var item=p.workTarget.item,faceX=item.x+item.w/2-p.x,faceY=item.y+item.d/2-p.y;p.facing=Math.abs(faceX)>Math.abs(faceY)?(faceX>0?1:3):(faceY>0?0:2);}
            if(plan.moving){
              var from=points[plan.from],workPath=plan.path;
              var q=global.PilhaNpcRoutes.sample(workPath,plan.route);if(q)Object.assign(p,q);else{Object.assign(p,from);plan.moving=false;}
            }else Object.assign(p,points[plan.to]);
            if(!plan.moving&&p.workTarget&&p.workTarget.item){var aim=p.workTarget.item,dx=aim.x+aim.w/2-p.x,dy=aim.y+aim.d/2-p.y;p.facing=Math.abs(dx)>Math.abs(dy)?(dx>0?1:3):(dy>0?0:2);}
            if(seat&&plan.activity==='using-chair'){var sf=seat.forward||[0,1],sx=sf[0],sy=sf[1];for(var st=0;st<(chairItem.turn||0);st++){var nx=sy;sy=-sx;sx=nx;}p.facing=Math.abs(sx)>Math.abs(sy)?(sx>0?1:3):(sy>0?0:2);}
            p.vx=p.x-oldX;p.vy=p.y-oldY;p.progress=p.homeProgress||0;p.moving=!routineClock.paused&&plan.moving;var covered=plan.moving?plan.route*plan.ms*.001*1.8*Math.max(.2,Math.min(1,speed)):0;p.phase=plan.moving?covered*7+(p.seed||0):elapsed*.0034*speed;if(plan.moving)p.riggedSeconds=covered/1.4;
            if(plan.moving&&Math.hypot(p.vx,p.vy)>.00001)p.facing=Math.abs(p.vx)>Math.abs(p.vy)?(p.vx>0?1:3):(p.vy>0?0:2);
          }else{
            p.sit=false;p.seatProgress=0;p.carrying=null;p.workTarget=null;
            var target=pose.target||pose.space,cache=JSON.stringify(worldCfg.map(function(c){return [c.key,c.bx,c.by];}))+c.key+target+p.employeeId;
            var path=routinePaths[cache]||(routinePaths[cache]=global.PilhaNpcRoutes.route(worldCfg,AISLE,connections,c.key,target,p.employeeId,aislePoint(p.homeProgress||0)));
            if(!path.length)return;
            var q=global.PilhaNpcRoutes.sample(path,pose.progress),nextQ=global.PilhaNpcRoutes.sample(path,pose.progress+(pose.stage.includes('return')?-.001:.001)),resting=pose.holding,clone=Object.assign({},p,q,{from:c.key,to:'restauracao',worker:p.employeeId,home:c.key,sit:resting&&!pose.meeting&&pose.space==='meditacao',seatProgress:resting&&!pose.meeting&&pose.space==='meditacao'?1:0,seatHeight:.46,moving:!routineClock.paused&&!resting,phase:elapsed*.0034*speed,transit:!resting,npc:-1,talking:!!pose.talking,activity:pose.stage,vx:nextQ.x-q.x,vy:nextQ.y-q.y});
            var routeLength=path.slice(1).reduce(function(n,p,i){return n+Math.hypot(p.x-path[i].x,p.y-path[i].y);},0),covered=routeLength*(pose.stage.includes('return')?2-pose.progress:pose.progress);clone.phase=covered*7+(p.seed||0);clone.riggedSeconds=resting?elapsed*.001*row.speed:covered/1.4;
            if(resting){var dest=worldCfg.find(function(c){return c.key==='restauracao';});if(dest){clone.x-=dest.bx;clone.y-=dest.by;}if(pose.meeting){var faceX=(dest&&dest.depth>8?4.1:9.8)-clone.x,faceY=(dest&&dest.depth>8?15.45:5.15)-clone.y;clone.facing=Math.abs(faceX)>Math.abs(faceY)?(faceX>0?1:3):(faceY>0?0:2);}restVisitors.push(clone);}else commuters.push(clone);
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
          p.activity=plan.activity;p.interaction=plan.interaction||null;p.handlingProgress=plan.handlingProgress||0;p.carrying=plan.carrying;p.seatProgress=plan.seatProgress??(plan.sit?1:0);p.sit=p.seatProgress>.02;p.seatHeight=seat&&plan.activity==='using-chair'?seat.height:.47;p.progress=p.homeProgress||0;p.phase=elapsed*.006*speed;
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
