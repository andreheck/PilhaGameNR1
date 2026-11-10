/** Visual architecture, in metres. Same office sector and existing manager identity. */
export const OFFICE_SPACE=Object.freeze({
 manager:{x:0,y:-6,width:8,depth:6,door:{x:4,y:0,width:1.2}},
 furniture:[
  {id:'manager-desk',asset:'mesa-escritorio',type:'desk',x:1.1,y:-3.2,managerDesk:true},
  {id:'manager-library',asset:'estante-livros',type:'shelf',x:.8,y:-5.5},
  {id:'manager-sofa',asset:'sofa-azul',type:'sofa',x:5.1,y:-3.6},
  {id:'manager-coffee-table',asset:'mesa-centro-redonda',type:'table',x:5.7,y:-1.8},
  {id:'manager-meeting',asset:'mesa-reuniao',type:'table',x:.9,y:-1.4},
  {id:'manager-plant',asset:'planta-pequena',type:'plant',x:6.7,y:-5.2},
  {id:'manager-picture',asset:'quadro',type:'board',x:5,y:-5.5}
 ],
 walls:[
  {id:'manager-back',x:0,y:-6,w:8,d:.08,h:2.1},
  {id:'manager-left',x:0,y:-6,w:.08,d:6,h:2.1},
  {id:'manager-right',x:7.92,y:-6,w:.08,d:6,h:1.45},
  {id:'manager-front-left',x:0,y:-.04,w:3.4,d:.08,h:1.45},
  {id:'manager-front-right',x:4.6,y:-.04,w:3.4,d:.08,h:1.45}
 ],
 partitions:[
  {id:'office-focus',x:3.65,y:1,w:.08,d:1.6,h:1.25},
  {id:'office-meeting',x:.8,y:3.6,w:1.8,d:.08,h:1.25},
  {id:'office-support',x:7.65,y:5,w:.08,d:1.6,h:1.25}
 ]
});
