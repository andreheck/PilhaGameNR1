/** Interaction anchors follow the arranged furniture, never the obsolete room template. */
export function workTargets(items,aisle){
 const physical=items.filter(it=>!it.layoutHidden&&!it.visualProgram);
 function target(it,index){
  const gap=.28,candidates=[{x:it.x+it.w*.5,y:it.y+it.d+gap},{x:it.x+it.w+gap,y:it.y+it.d*.5},{x:it.x-gap,y:it.y+it.d*.5},{x:it.x+it.w*.5,y:it.y-gap}];
  const clear=p=>p.x>.1&&p.x<11.9&&p.y>.1&&p.y<7.9&&!physical.some(b=>p.x>b.x-.16&&p.x<b.x+b.w+.16&&p.y>b.y-.16&&p.y<b.y+b.d+.16);
  const distance=p=>Math.min(...aisle.map((a,i)=>{const b=aisle[(i+1)%aisle.length],dx=b.x-a.x,dy=b.y-a.y,k=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy)));return Math.hypot(p.x-a.x-k*dx,p.y-a.y-k*dy);}));
  // Approved workstation art places its chair behind the monitor (negative Y).
  const valid=candidates.filter(clear);
  const at=it.t==='desk'&&clear(candidates[3])?candidates[3]:valid.sort((a,b)=>distance(a)-distance(b))[0];
  return at?{...at,seatId:it.t+':'+index,item:{x:it.x,y:it.y,w:it.w,d:it.d,type:it.t}}:null;
 }
 const all=physical.map((it,i)=>({it,point:target(it,i)})).filter(x=>x.point);
 return {stations:all.filter(x=>x.it.t==='desk').map(x=>x.point),sources:all.filter(x=>['crate','shelf','box'].includes(x.it.t)).map(x=>x.point),destinations:all.filter(x=>['conveyor','machine','table'].includes(x.it.t)).map(x=>x.point)};
}
