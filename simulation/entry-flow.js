import {validTeam} from './company-continuous.js';
/** The saved duo is the completion marker; legacy saves do not need to choose again. */
export function nextEntryStep(state){return !validTeam(state?.team)?'heroes':state.initialHiring?.status==='pending'?'hiring':'map';}
