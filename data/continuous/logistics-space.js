/** Production annex. Approved merged diorama stays fixed; loading apron is walkable. */
export const LOGISTICS_SPACE=Object.freeze({x:12,y:0,width:13,depth:12,door:{x:12,y:4,width:1.6},furniture:[
{id:'approved-diorama',asset:'galpao-logistico',type:'warehouse',x:15,y:.7,fixedScene:true},
{id:'loading-shelf',asset:'estante-industrial',type:'shelf',x:13,y:7},
{id:'loading-crates',asset:'caixa-material',type:'crate',x:15.5,y:10.2},
{id:'dispatch-bench',asset:'bancada-operacional',type:'table',x:20,y:10.2}
],walls:[{id:'logistics-door-north',x:11.97,y:0,w:.06,d:3.2,h:1.2},{id:'logistics-door-south',x:11.97,y:4.8,w:.06,d:3.2,h:1.2}]});
