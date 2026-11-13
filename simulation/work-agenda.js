/** Deterministic, visual-only work activities layered over the existing NPC/rest clock. */
export function workTask(progress,{sector,hasWorkstation=false,speed=1}={}){
 const p=Math.max(0,Math.min(1,progress)),v=Math.max(.4,Math.min(1.3,speed));
 if(hasWorkstation&&sector!=='producao'){
  const a=.18/v,b=1-.18/v,pick=a+(b-a)*.8;
  if(p<a)return {activity:'to-workstation',moving:true,sit:false,carrying:null,from:'home',to:'station',route:p/a};
  if(p<pick)return {activity:'computer',moving:false,sit:true,carrying:null,to:'station',route:1};
  if(p<b)return {activity:'handling-folder',moving:false,sit:false,carrying:'folder',to:'station',route:1};
  return {activity:'from-workstation',moving:true,sit:false,carrying:'folder',from:'station',to:'gather',route:(p-b)/(1-b)};
 }
 const a=.12/v,b=.15/v,c=.12/v,hold=(1-a-b-c)/2,material=sector==='producao'?'box':'folder';
 if(p<a)return {activity:'to-material',moving:true,sit:false,carrying:null,from:'home',to:'source',route:p/a};
 if(p<a+hold)return {activity:'handling',moving:false,sit:false,carrying:material,interaction:'pickup',handlingProgress:(p-a)/hold,to:'source',route:1};
 if(p<a+hold+b)return {activity:'moving-material',moving:true,sit:false,carrying:material,from:'source',to:'destination',route:(p-a-hold)/b};
 if(p<1-c)return {activity:'handling',moving:false,sit:false,carrying:material,interaction:'place',handlingProgress:(p-a-hold-b)/hold,to:'destination',route:1};
 return {activity:'walk',moving:true,sit:false,carrying:null,from:'destination',to:'gather',route:(p-1+c)/c};
}
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
