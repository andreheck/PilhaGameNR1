import {validTeam} from './company-continuous.js';
/** New saves use one persistent player character; valid legacy pairs remain compatible. */
export function nextEntryStep(state){return !(state?.playerCharacterId||validTeam(state?.team))?'heroes':state.initialHiring?.status==='pending'?'hiring':'map';}
