/** Allocate complete routes before starting a task; never squeeze walking into a short gap. */
export function pacedWorkPlan(progress,{durationMs,conversationMs=5000,speed=1,sector,hasWorkstation,paths}={}){
 const rate=1.8*Math.max(.2,Math.min(1,speed)),duration=Math.max(0,durationMs||0);
 const length=path=>(path||[]).slice(1).reduce((n,p,i)=>n+Math.hypot(p.x-path[i].x,p.y-path[i].y),0);
 const leg=(from,to,carrying=null)=>({from,to,carrying,moving:true,sit:false,activity:carrying?'moving-material':'walk',path:paths[from+'|'+to],ms:length(paths[from+'|'+to])/rate*1000});
 const hold=(to,ms,activity,sit=false,carrying=null,interaction=null)=>({to,ms,activity,sit,carrying,interaction,moving:false});
 const computer=hasWorkstation&&sector!=='producao';
 const material=sector==='producao'?'box':'folder';
 let sequence=computer?[leg('home','station'),hold('station',2500,'computer',true),hold('station',800,'handling-folder',false,'folder'),leg('station','gather','folder')]:[leg('home','source'),hold('source',800,'handling',false,material,'pickup'),leg('source','destination',material),hold('destination',800,'handling',false,material,'place'),leg('destination','gather')];
 const conversation=Math.min(conversationMs,duration*.30),half=(duration-conversation)/2,back=leg('gather','home');
 const valid=rows=>rows.every(r=>!r.moving||r.path?.length>=1);
 const total=rows=>rows.reduce((n,r)=>n+r.ms,0);
 if(!valid(sequence)||total(sequence)>half)sequence=[leg('home','gather')];
 if(!valid(sequence)||total(sequence)>half||!valid([back])||back.ms>half)sequence=[hold('home',duration,'idle')];
 else{
  const dwell=sequence.find(r=>r.activity==='computer')||sequence.find(r=>r.activity==='handling');
  const spare=Math.max(0,half-total(sequence));if(dwell)dwell.ms+=spare;else sequence.unshift(hold('home',spare,'idle'));
  sequence.push(hold('gather',conversation,'conversation'),back,hold('home',Math.max(0,half-back.ms),'idle'));
 }
 // Spare time is spent working/pausing, never accelerating a leg.
 let t=Math.max(0,Math.min(1,progress))*duration;
 for(let i=0;i<sequence.length;i++){
  const row=sequence[i];if(t<row.ms||i===sequence.length-1)return {...row,route:row.ms?Math.max(0,Math.min(1,t/row.ms)):1,handlingProgress:row.ms?Math.max(0,Math.min(1,t/row.ms)):1};
  t-=row.ms;
 }
}
