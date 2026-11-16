/** Visual architecture, in metres. Same office sector and existing manager identity. */
export const OFFICE_SPACE=Object.freeze({
 manager:{x:0,y:-6,width:8,depth:6,door:{x:4,y:0,width:1.2}},
 meeting:{x:8,y:-6,width:8,depth:6,door:{x:11.5,y:0,width:1.4},seats:4},
 furniture:[
  {id:'manager-desk',asset:'mesa-escritorio',type:'desk',x:3.1,y:-3.4,managerDesk:true},
  {id:'meeting-table',asset:'mesa-reuniao',type:'meetingTable',name:'Mesa de reunião · 4 lugares',x:10.9,y:-3.65,z:99},
  {id:'meeting-cabinet',asset:'armario-baixo',type:'cabinet',name:'Armário da sala de reuniões',x:8.55,y:-.85,z:99},
  {id:'meeting-water',asset:'bebedouro',type:'water-dispenser',name:'Filtro de água · bombona',x:14.95,y:-.85,z:99},
  {id:'meeting-fridge',type:'fridge',name:'Frigobar',x:8.55,y:-5.15,w:.7,d:.7,h:1.45,z:99,amenity:true},
  {id:'meeting-tv',type:'television',name:'TV de apresentações',x:14.5,y:-5.55,w:1.25,d:.35,h:1.5,z:99,amenity:true}
 ],
 walls:[
  {id:'manager-back',x:0,y:-6,w:8,d:.08,h:2.1},
  {id:'manager-left',x:0,y:-6,w:.08,d:6,h:2.1},
  {id:'manager-right-a',x:7.92,y:-6,w:.08,d:2.3,h:1.45},
  {id:'manager-right-b',x:7.92,y:-2.3,w:.08,d:2.3,h:1.45},
  {id:'manager-front-left',x:0,y:-.04,w:3.4,d:.08,h:1.45},
  {id:'manager-front-right',x:4.6,y:-.04,w:3.4,d:.08,h:1.45},
  {id:'meeting-back',x:8,y:-6,w:8,d:.08,h:2.1},
  {id:'meeting-right',x:15.92,y:-6,w:.08,d:6,h:1.45},
  {id:'meeting-front-left',x:8,y:-.04,w:2.8,d:.08,h:1.45},
  {id:'meeting-front-right',x:12.2,y:-.04,w:3.8,d:.08,h:1.45}
 ],
 partitions:[
  {id:'office-focus',x:3.65,y:1,w:.08,d:1.6,h:1.25},
  {id:'office-meeting',x:.8,y:3.6,w:1.8,d:.08,h:1.25},
  {id:'office-support',x:7.65,y:5,w:.08,d:1.6,h:1.25}
 ]
});
