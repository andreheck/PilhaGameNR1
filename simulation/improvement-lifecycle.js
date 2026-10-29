/** Versioned life cycle for fictional workplace improvements. A month is four simulated weeks. */
export const MONTH_WEEKS=4;
const legacy={start:'imediato',duration:'permanente',frequency:'unico',periodWeeks:0,progression:'estavel',growthWeeks:0};
const defaults={
 seg:{start:'imediato',duration:'permanente',frequency:'mensal',progression:'progressivo',growthWeeks:12},
 asse:{start:'tardio',duration:'permanente',frequency:'unico'},
 psic:{start:'imediato',duration:'temporario',durationWeeks:12,frequency:'mensal',progression:'progressivo',growthWeeks:8},
 ergo:{start:'imediato',duration:'permanente',frequency:'unico'},
 fisi:{start:'imediato',duration:'permanente',frequency:'unico'},
 espa:{start:'imediato',duration:'permanente',frequency:'unico'},
 jorn:{start:'imediato',duration:'temporario',durationWeeks:8,frequency:'mensal'},
 auto:{start:'tardio',duration:'permanente',frequency:'unico'},
 lide:{start:'imediato',duration:'permanente',frequency:'mensal',progression:'progressivo',growthWeeks:12},
 rela:{start:'imediato',duration:'temporario',durationWeeks:12,frequency:'mensal',progression:'progressivo',growthWeeks:8},
 muda:{start:'imediato',duration:'temporario',durationWeeks:8,frequency:'unico'},
 apoi:{start:'tardio',duration:'temporario',durationWeeks:12,frequency:'mensal'},
 puff:{start:'imediato',duration:'permanente',frequency:'unico'},
 arvore:{start:'tardio',duration:'permanente',frequency:'unico'},
 almofadas:{start:'imediato',duration:'permanente',frequency:'unico'},
 tapete:{start:'imediato',duration:'permanente',frequency:'unico'},
 capelao:{start:'tardio',duration:'temporario',durationWeeks:12,frequency:'mensal',progression:'progressivo',growthWeeks:8},
 yoga:{start:'imediato',duration:'temporario',durationWeeks:8,frequency:'mensal',progression:'progressivo',growthWeeks:8},
 plano:{start:'tardio',duration:'temporario',durationWeeks:12,frequency:'mensal'},
 livros:{start:'imediato',duration:'permanente',frequency:'unico',progression:'progressivo',growthWeeks:8},
 cursos:{start:'tardio',duration:'temporario',durationWeeks:12,frequency:'mensal',progression:'progressivo',growthWeeks:8},
 frutifera:{start:'tardio',duration:'permanente',frequency:'unico'},
 banco:{start:'imediato',duration:'permanente',frequency:'unico'},
 intervalo:{start:'imediato',duration:'temporario',durationWeeks:8,frequency:'mensal'}
};
export function lifecycle(item){
 const d=item.lifecycle||defaults[item.id]||{};
 return Object.freeze({
  ...legacy,...d,
  delayWeeks:item.timing.delay||0,
  durationWeeks:d.duration==='temporario'?d.durationWeeks:0,
  periodWeeks:d.frequency==='mensal'?MONTH_WEEKS:0,
  growthWeeks:d.progression==='progressivo'?d.growthWeeks:0
 });
}
export function stage(receipt,week,item){
 const spec=receipt.lifecycle||null;
 if(!spec){const age=week-receipt.at-item.timing.delay;return {active:age>=0,progress:age<0?0:item.timing.ramp?Math.min(1,Math.max(0,age/item.timing.ramp)):1,expiresAt:null,nextMonthly:null,legacy:true};}
 const age=week-receipt.at-spec.delayWeeks;
 const active=age>=0&&(spec.duration==='permanente'||age<spec.durationWeeks);
 const progress=!active?0:spec.progression==='progressivo'?Math.min(1,Math.max(0,(age+1)/Math.max(1,spec.growthWeeks))):1;
 return {active,progress,expiresAt:spec.duration==='temporario'?receipt.at+spec.delayWeeks+spec.durationWeeks:null,nextMonthly:spec.frequency==='mensal'&&active?receipt.at+spec.delayWeeks+(Math.floor(age/MONTH_WEEKS)+1)*MONTH_WEEKS:null,legacy:false};
}
export function factorFor(receipt,week,item){return stage(receipt,week,item).progress;}
export function recurringContribution(receipt,week,item){
 const p=stage(receipt,week,item);if(!p.active)return 0;
 // A monthly recurring service remains effective throughout its paid simulated term.
 // Each four-week period has a single contribution: never stack monthly copies.
 return p.progress;
}
