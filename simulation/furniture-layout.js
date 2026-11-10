/** Saved visual layout, separate from ownership and financial effects. */
export function validateLayoutSchema(layout){
 if(layout===undefined)return true;if(!layout||layout.version!==1||!layout.rooms||Array.isArray(layout.rooms)||Object.keys(layout.rooms).length>4)throw Error('invalid-furniture-layout');
 for(const [sid,rows] of Object.entries(layout.rooms)){if(!['escritorio','producao','atendimento','restauracao'].includes(sid)||!rows||Array.isArray(rows)||Object.keys(rows).length>100)throw Error('invalid-furniture-layout');for(const [key,p] of Object.entries(rows)){if(!/^[a-zA-Z0-9:.,_-]{1,160}$/.test(key)||['__proto__','constructor','prototype'].includes(key)||!p||!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<0||p.x>(sid==='producao'?25:12)||p.y<(sid==='escritorio'?-6:0)||p.y>18||!Number.isInteger(p.turn)||p.turn<0||p.turn>3)throw Error('invalid-furniture-position');}}
 return true;
}
export function validatePlacement(proposal,items,sid){
 const p=proposal,depth=sid==='restauracao'?18:8,gap=.40;
 const cargo=p&&sid==='producao'&&p.x>=12,manager=p&&sid==='escritorio'&&p.y<0,inside=cargo?p.x>=12.3&&p.x+p.w<=24.7&&p.y>=.3&&p.y+p.d<=11.7:manager?p.x>=.3&&p.x+p.w<=7.7&&p.y>=-5.7&&p.y+p.d<=-.3:p&&p.x>=.3&&p.y>=.3&&p.x+p.w<=11.7&&p.y+p.d<=depth-.3;
 if(!p||![p.x,p.y,p.w,p.d].every(Number.isFinite)||p.w<=0||p.d<=0||!inside)return {ok:false,reason:'Mantenha o móvel dentro da sala.'};
 const overlap=(a,b,g)=>a.x<b.x+b.w+g-1e-6&&a.x+a.w+g>b.x+1e-6&&a.y<b.y+b.d+g-1e-6&&a.y+a.d+g>b.y+1e-6;
 if(!p.walkable&&items.some(b=>b.layoutKey!==p.layoutKey&&!b.layoutHidden&&!b.visualProgram&&!b.walkable&&overlap(p,b,gap)))return {ok:false,reason:'Deixe pelo menos 40 cm livres entre os móveis.'};
 const final=items.filter(b=>b.layoutKey!==p.layoutKey).concat(p),deskSpace=d=>({x:d.x+.08,y:d.y-.66,w:d.w-.16,d:.66});
 if(final.some(d=>d.t==='desk'&&!d.layoutHidden&&(deskSpace(d).y<(sid==='escritorio'&&d.y<0?-5.7:.25)||final.some(b=>b!==d&&!b.walkable&&!b.visualProgram&&!b.layoutHidden&&overlap(deskSpace(d),b,0)))))return {ok:false,reason:'Reserve espaço de acesso à cadeira atrás da mesa.'};
 const aisle=[{x:.35,y:.28},{x:4,y:.28},{x:4,y:4},{x:8,y:4},{x:8,y:.28},{x:11.75,y:.28},{x:11.75,y:7.7},{x:.35,y:7.7}],segments=aisle.map((a,i)=>[a,aisle[(i+1)%aisle.length]]);
 if(sid==='restauracao')for(const [a,b] of [[[8,7.7],[7.5,7.7]],[[7.5,7.7],[7.5,15.2]],[[7.5,15.2],[3.5,15.2]],[[11.6,7.7],[11.6,13.6]],[[11.6,13.6],[9.8,13.6]]])segments.push([{x:a[0],y:a[1]},{x:b[0],y:b[1]}]);
 if(sid==='producao')segments.push([{x:11.75,y:4},{x:14.1,y:4}],[{x:14.1,y:4},{x:14.1,y:9.5}],[{x:14.1,y:9.5},{x:23.8,y:9.5}]);
 if(sid==='escritorio')segments.push([{x:4,y:.28},{x:4,y:-5.5}]);
 if(!p.walkable&&segments.some(([a,b])=>overlap(p,{x:Math.min(a.x,b.x),y:Math.min(a.y,b.y),w:Math.abs(a.x-b.x)||.001,d:Math.abs(a.y-b.y)||.001},.22)))return {ok:false,reason:'Este espaço é uma passagem. Mantenha o trajeto livre.'};
 return {ok:true};
}
export function applyLayoutOverrides(items,edits,sid){
 const proposals=items.map(it=>{const p=edits[it.layoutKey];if(!p)return {...it};const turn=it.canRotate?p.turn:0,w=turn%2?it.baseD:it.baseW,d=turn%2?it.baseW:it.baseD;return {...it,x:p.x,y:p.y,w,d,turn};}),bad=[];
 for(const it of proposals)if(edits[it.layoutKey]&&!validatePlacement(it,proposals,sid).ok)bad.push(it.layoutKey);
 // A changed item must never discard the other saved positions in this room.
 return {items:proposals.map((it,i)=>bad.includes(it.layoutKey)?{...items[i]}:it),warnings:bad};
}
