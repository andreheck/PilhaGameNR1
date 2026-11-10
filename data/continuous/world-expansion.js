/** Fixed square of the game world. Empty plots are reserved for future places. */
export const WORLD_PLOT=Object.freeze({
  x:-5,y:-10,size:48,unit:'map-unit',
  reservedLots:Object.freeze([
    {id:'expansao-leste',name:'Área reservada',x:31,y:14,size:9},
    {id:'expansao-oeste',name:'Área reservada',x:-5,y:20,size:9},
    {id:'expansao-sul-1',name:'Área reservada',x:0,y:29,size:9},
    {id:'expansao-sul-2',name:'Área reservada',x:12,y:29,size:9},
    {id:'expansao-sul-3',name:'Área reservada',x:27,y:29,size:9},
    {id:'expansao-norte',name:'Área reservada',x:31,y:-10,size:9}
  ])
});
