/** Historical purchase fixture, deliberately not a new purchase API. */
import {ITEMS,RULES} from '../../data/continuous/catalog.js';
import {lifecycle} from '../../simulation/improvement-lifecycle.js';
export function historicalSeg(input,sid='escritorio'){
 const s=JSON.parse(JSON.stringify(input)),c=ITEMS.find(c=>c.id==='seg'),level=s.receipts.filter(r=>r.sid===sid&&r.id==='seg').length+1,cost=Math.round(c.cost*RULES.costs[level-1]/50)*50;
 s.budget-=cost;s.receipts.push({sid,id:'seg',level,at:s.week,bonus:0,cost,lifecycle:lifecycle(c)});return s;
}
