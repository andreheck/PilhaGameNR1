import {RULES} from '../data/continuous/catalog.js';
/** Robot is automation, not a seventeenth human employee. */
export const ROBOT={id:'ROBOT-01',name:'Robô Azul',home:'producao',stressImpact:0,outputMultiplier:3,dayMs:RULES.weekMs/7,rechargeShare:1/48};
export function robotStatus(state,elapsed=(state.week-1)*RULES.weekMs+state.activeMs){const phase=((elapsed/ROBOT.dayMs)%1+1)%1,workShare=1-ROBOT.rechargeShare,recharging=phase>=workShare;return {id:ROBOT.id,name:ROBOT.name,sector:'producao',stress:0,recharging,moving:!recharging,outputMultiplier:recharging?0:ROBOT.outputMultiplier,battery:recharging?20+80*(phase-workShare)/ROBOT.rechargeShare:100-80*phase/workShare,progress:recharging?0:phase/workShare,activity:recharging?'Recarga de bateria':'Operação automatizada',enabled:state.blueRobot===true};}
export function robotWeeklyRevenue(state){return state.blueRobot===true?1000/16*ROBOT.outputMultiplier*(1-ROBOT.rechargeShare):0;}
