/** Storage inventory only. Importing this module never reads/writes or migrates a save.
 * Add a documented entry before introducing a new persistent key.
 * Filename suffixes are not necessarily the version of their JSON envelope.
 */
export const STORAGE_KEYS=Object.freeze([
 {key:'pilha-company-continuous-v2',version:2,format:'json',owner:'simulation/company-continuous.js',scope:'active',migration:'Existing v2 is preserved; absent v2 may import investment-v1 or mapa-v1. Living fields added without retroactive income or health effects.'},
 {key:'pilha-investment-v1',version:[1,2],format:'json',owner:'simulation/investment.js',scope:'legacy-economy',migration:'Envelope v1/v2 read defensively; original key retained when imported into continuous mode; XP and training remain here.'},
 {key:'pilha-mapa-v1',version:1,format:'json-v-field',owner:'ui/claude/pilha-mapa.js',scope:'legacy-map',migration:'v=1 balance and sector levels may be copied into absent continuous-v2; original bytes retained.'},
 {key:'pilha-hero-teams-v1',version:1,format:'json',owner:'simulation/hero-team.js',scope:'legacy-teams',migration:'Valid two-hero selection may seed a new continuous save; original case pairs retained.'},
 {key:'pilha-heroi-v1',version:null,format:'hero-id-string',owner:'ui/claude/herois/pilha-herois.js',scope:'gallery-preference',migration:'Single selected gallery hero; not the authoritative two-hero team; no destructive conversion.'},
 {key:'pilha-mission-timeline-v1',version:1,format:'json',owner:'simulation/mission-timeline.js',scope:'legacy-campaigns',migration:'Sanitized campaign history for cases 01–05; never interpreted as continuous-company elapsed time.'},
 {key:'pilha-company-state-v1',version:1,format:'json',owner:'simulation/company-state.js',scope:'legacy-company',migration:'Legacy organizational decisions and case modifiers; separate from continuous-v2.'},
 {key:'pilha-management-v1',version:1,format:'json',owner:'play.js',scope:'legacy-management',migration:'May initialize absent legacy company-state-v1; not silently mapped to continuous finances.'},
 {key:'pilha-motion-v1',version:null,format:'on-off-string',owner:'ui/company-visuals.js',scope:'preference',migration:'Decorative/legacy motion preference; continuous worker movement still follows the manual game pause.'},
 {key:'pilha-clock-lease',version:null,format:'json-owner-until',owner:'mission-control.js',scope:'transient-lock',migration:'Six-second fallback lease for legacy campaign clock, not player progress; released only by its owner.'},
 {key:'pilha-case01-v2',version:2,format:'json',owner:'case01.js',scope:'legacy-deep-case',migration:'Preserved by legacy routes; not overwritten by the public continuous map.'},
 {key:'pilha-case01-v1',version:null,format:'legacy-json',owner:'caso01-v1.html',scope:'legacy-deep-case',migration:'Prior deep-case history retained; no blanket reset or new conversion in this delivery.'},
 {key:'pilha-missao01-v1',version:1,format:'json',owner:'mission01.js',scope:'legacy-library',migration:'Shared by library, 3D and accessible fallback; not equivalent to finishing the continuous company.'},
 {key:'pilha-menu-preferences-v1',version:null,format:'legacy-json',owner:'menu.js',scope:'legacy-preference',migration:'Preference payload without mandatory envelope version; retained.'},
 {key:'pilha-v08',version:null,format:'legacy-json',owner:'game.html',scope:'legacy-chapter',migration:'Historical chapter progress; no automatic deletion or migration into the live runtime.'},
 ...['01','02','03','04','05'].map(id=>({key:`pilha-case-${id}-alpha14`,version:null,format:'case-attempt-json',owner:'cases-data.js',scope:'legacy-case-history',migration:'Attempt/reward and ethics history retained by canonical case ID; no retrospective claim of elapsed time.'}))
].map(Object.freeze));
export const STORAGE_LOCK_NAMES=Object.freeze(['pilha-economy','pilha-active-campaign']);
export const storageKeyInfo=key=>STORAGE_KEYS.find(row=>row.key===key)||null;
