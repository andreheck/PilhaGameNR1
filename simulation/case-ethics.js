/** Editorial game safeguards, not an automated legal judgment. Kimi P1. */
export const ETHICS_VERSION=2;
export const ETHICS_CAP=49;
export const ETHICS_RULES=Object.freeze({
 '01':[{step:0,option:2,code:'clinical-identification'},{step:3,option:2,code:'health-disclosure'}],
 '02':[{step:0,option:0,code:'public-exposure'},{step:2,option:1,code:'forced-exposure'},{step:3,option:0,code:'retaliatory-ranking'}],
 '03':[{step:3,option:2,code:'retaliatory-list'}],
 '04':[{step:0,option:1,code:'clinical-disclosure'},{step:1,option:1,code:'diagnosis-disclosure'},{step:2,option:1,code:'coercion'},{step:3,option:1,code:'diagnosis-publication'}],
 '05':[{step:0,option:2,code:'clinical-identification'},{step:3,option:2,code:'public-pressure'}]
});
export function ethicsViolations(caseId,choices){return (ETHICS_RULES[caseId]||[]).filter(r=>choices?.[r.step]===r.option).map(r=>({...r}));}
