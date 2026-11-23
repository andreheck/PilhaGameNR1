/** Visual architecture, in metres. Same office sector and existing manager identity. */
export const OFFICE_SPACE=Object.freeze({
 manager:{id:'manager',name:'Gerência',caption:'1 posto de liderança',floor:'#668da5',accent:'#ffd166',labelAt:[4,-5.7],x:0,y:-6,width:8,depth:6,capacity:1,door:{x:4,y:0,width:1.2},wall:'#527c96'},
 meeting:{id:'meeting',name:'Sala de reuniões',caption:'Mesa para 4 pessoas',floor:'#5b9188',accent:'#67d8c2',labelAt:[12,-5.7],x:8,y:-6,width:8,depth:6,capacity:4,door:{x:11.5,y:0,width:1.4},seats:4,wall:'#497c75'},
 hr:{id:'hr',name:'RH · Pessoas',caption:'1 posto de atendimento',floor:'#806fa3',accent:'#c5a7ff',labelAt:[20,-5.7],x:16,y:-6,width:8,depth:6,capacity:1,door:{side:'south',x:20,y:0,width:1.4},wall:'#685a89'},
 furniture:[
  {id:'manager-desk',asset:'mesa-escritorio',type:'desk',x:3.1,y:-3.4,room:'manager',managerDesk:true},
  {id:'meeting-table',asset:'mesa-reuniao',type:'meetingTable',name:'Mesa de reunião · 4 lugares',x:10.9,y:-3.65,z:99,room:'meeting'},
  {id:'meeting-cabinet',asset:'armario-baixo',type:'cabinet',name:'Armário da sala de reuniões',x:8.55,y:-.85,z:99,room:'meeting'},
  {id:'meeting-water',asset:'bebedouro',type:'water-dispenser',name:'Filtro de água · bombona',x:14.95,y:-.85,z:99,room:'meeting'},
  {id:'meeting-fridge',type:'fridge',name:'Frigobar',x:8.55,y:-5.15,w:.7,d:.7,h:1.45,z:99,room:'meeting',amenity:true},
  {id:'meeting-tv',type:'television',name:'TV de apresentações',x:14.5,y:-5.55,w:1.25,d:.35,h:1.5,z:99,room:'meeting',amenity:true},
  {id:'hr-desk-raimunda',asset:'mesa-escritorio',type:'desk',name:'Posto de atendimento · Raimunda',x:18.1,y:-3.65,room:'hr',employeeId:'NPC-04'},
  {id:'hr-armario',asset:'armario-baixo',type:'cabinet',name:'Arquivo de pessoas',x:22.35,y:-5.25,room:'hr'},
  {id:'hr-bookshelf',asset:'estante-livros',type:'bookshelf',name:'Materiais e políticas internas',x:22.65,y:-.8,room:'hr'},
  {id:'hr-board',asset:'quadro',type:'noticeboard',name:'Mural de pessoas',x:20.25,y:-5.55,room:'hr'}
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
  {id:'meeting-front-right',x:12.2,y:-.04,w:3.8,d:.08,h:1.45},
  {id:'hr-back',x:16,y:-6,w:8,d:.08,h:2.1},
  {id:'hr-right',x:23.92,y:-6,w:.08,d:6,h:1.45},
  {id:'hr-front-left',x:16,y:-.04,w:3.3,d:.08,h:1.45},
  {id:'hr-front-right',x:20.7,y:-.04,w:3.3,d:.08,h:1.45}
 ],
 partitions:[
  {id:'office-focus',x:3.65,y:1,w:.08,d:1.6,h:1.25},
  {id:'office-meeting',x:.8,y:3.6,w:1.8,d:.08,h:1.25},
  {id:'office-support',x:7.65,y:5,w:.08,d:1.6,h:1.25}
 ]
});
