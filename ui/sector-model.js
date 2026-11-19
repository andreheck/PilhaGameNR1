import {eventVisuals,eventInflation} from '../simulation/adverse-events.js';
import {UPGRADES,applyUpgrade,upgradePrice} from '../simulation/investment.js';
import {transactEconomy,readEconomy} from '../simulation/hero-progression.js';
import {BASE_AXES,evaluateCampaign} from '../simulation/mission-timeline.js';
import {companyVisuals} from './company-visuals.js';

// Visual grouping only: never changes unlocking, case data or stored ownership.
export const SECTOR_CASES = Object.freeze({
  escritorio:['02','05'], producao:['01','03'], atendimento:['04']
});
export function mapSnapshot(storage,campaign,caseId){
  const loaded=readEconomy(storage);
  const investment=loaded.ok?loaded.state:{budget:0,upgrades:[]};
  const values=campaign?evaluateCampaign(campaign).axes:BASE_AXES;
  const axes=Object.fromEntries(Object.entries(values).map(([key,value])=>[key,Math.round(value*10)/10]));
  return {balance:investment.budget,owned:investment.upgrades,visual:eventVisuals(investment,companyVisuals(investment.upgrades)),prices:Object.fromEntries(UPGRADES.map(u=>[u.id,upgradePrice(investment,u)])),inflation:eventInflation(investment),caseId,axes,
    sharedIndex:Object.values(axes).reduce((a,b)=>a+b,0)/4,
    status:campaign?.status||'not-started',storageAvailable:loaded.ok};
}
export async function purchaseMapUpgrade(storage,id){
  if(!UPGRADES.some(u=>u.id===id))return {ok:false,error:'unknown-upgrade'};
  return transactEconomy(storage,state=>{
    const next=applyUpgrade(state,id,Date.now());
    return next.error?{ok:false,error:next.error}:{ok:true,state:next};
  });
}
