import {getHeroTeam,validateHeroPair} from '../simulation/hero-team.js';
import {readTimeline} from '../simulation/mission-timeline.js';
// A running campaign owns its pair even if the editable team save differs.
export function initialPair(storage){
 const pair=readTimeline(storage).campaigns['01']?.team||getHeroTeam(storage,'01');
 return validateHeroPair('01',pair)?null:pair;
}
