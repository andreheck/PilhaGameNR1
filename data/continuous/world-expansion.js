/** Fixed square of the game world. The advanced company sits in an aligned 2x2 campus. */
export const WORLD_PLOT=Object.freeze({
  x:-3,y:-9,size:52,unit:'map-unit',
  plannedSpaces:Object.freeze([
    {id:'entrada',name:'Entrada',kind:'lobby',x:31,y:28,width:6,depth:7,door:{side:'south',offset:0,width:1.6},labelAt:[34,31.4],signAt:[34,37.05,1.6],counter:{x:32.25,y:31.1,width:3.5,depth:.72,height:1.08},staffCapacity:{min:1,max:2},workstations:[
      {id:'recepcao-1',x:33.1,y:30.48,facing:'south'},
      {id:'recepcao-2',x:34.8,y:30.48,facing:'south'}
    ],walls:[
      {id:'entrada-norte',x:31,y:28,width:6,depth:.12,height:1.45},
      {id:'entrada-oeste',x:31,y:28,width:.12,depth:7,height:1.45},
      {id:'entrada-leste',x:36.88,y:28,width:.12,depth:7,height:1.45},
      {id:'entrada-sul-b',x:32.6,y:34.88,width:4.4,depth:.12,height:1.45}
    ]}
  ]),
});
