/** Deterministic, visual-only work activities layered over the existing NPC/rest clock. */
export function workActivity(progress,{sector,hasWorkstation=false}={}){
 const p=Math.max(0,Math.min(1,Number(progress)||0));
 if(hasWorkstation){
  if(p<.16)return {activity:'to-workstation',moving:true,sit:false,carrying:null,route:p/.16};
  if(p<.62)return {activity:'computer',moving:false,sit:true,carrying:null,route:1};
  if(p<.78)return {activity:'from-workstation',moving:true,sit:false,carrying:null,route:1-(p-.62)/.16};
  return {activity:'walk',moving:true,sit:false,carrying:sector==='producao'?'box':'folder',route:(p-.78)/.22};
 }
 if(p<.12)return {activity:sector==='producao'?'handling':'walk',moving:false,sit:false,carrying:null,route:0};
 if(p<.72)return {activity:'moving-material',moving:true,sit:false,carrying:sector==='producao'?'box':'folder',route:(p-.12)/.6};
 return {activity:sector==='producao'?'handling':'walk',moving:false,sit:false,carrying:null,route:1};
}
