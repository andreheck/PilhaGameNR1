/** Interaction anchors follow the arranged furniture, never the obsolete room template. */
export function workTargets(items,aisle){
 const physical=items.filter(it=>!it.layoutHidden&&!it.visualProgram);
 function target(it,index){
  const gap=.38,candidates=[{x:it.x+it.w*.5,y:it.y+it.d+gap},{x:it.x+it.w+gap,y:it.y+it.d*.5},{x:it.x-gap,y:it.y+it.d*.5},{x:it.x+it.w*.5,y:it.y-gap}];
  const clear=p=>p.x>.1&&p.x<(it.y<0?7.9:11.9)&&p.y>(it.y<0?-5.9:.1)&&p.y<(it.y<0?-.1:7.9)&&!physical.some(b=>p.x>b.x-.22&&p.x<b.x+b.w+.22&&p.y>b.y-.22&&p.y<b.y+b.d+.22);
  const distance=p=>Math.min(...aisle.map((a,i)=>{const b=aisle[(i+1)%aisle.length],dx=b.x-a.x,dy=b.y-a.y,k=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy)));return Math.hypot(p.x-a.x-k*dx,p.y-a.y-k*dy);}));
  // Approved workstation art places its chair behind the monitor (negative Y).
  const valid=candidates.filter(clear);
  const at=it.t==='desk'&&clear(candidates[3])?candidates[3]:valid.sort((a,b)=>distance(a)-distance(b))[0];
  return at?{...at,managerSeat:!!it.managerDesk,seatId:it.t+':'+index,item:{x:it.x,y:it.y,w:it.w,d:it.d,type:it.t}}:null;
 }
 const all=physical.map((it,i)=>({it,point:target(it,i)})).filter(x=>x.point);
 return {stations:all.filter(x=>x.it.t==='desk').map(x=>x.point),sources:all.filter(x=>['crate','shelf','box'].includes(x.it.t)).map(x=>x.point),destinations:all.filter(x=>['conveyor','machine','table'].includes(x.it.t)).map(x=>x.point)};
}
