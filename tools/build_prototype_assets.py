"""PilhA+ experimental local assets, not Meshy-generated production models.
Creates low-poly PBR GLBs with recognizable human/environment features.
"""
from pathlib import Path
from math import sin, cos, pi
import numpy as np
import trimesh

ROOT=Path(__file__).resolve().parent
OUT=ROOT/'assets'/'v13';OUT.mkdir(parents=True,exist_ok=True)

COLORS={
 'floor':'#EDE9DC','side':'#D1DED5','back':'#E5E9D9','oak':'#BB9369','lightwood':'#E2C69C',
 'darkwood':'#765542','navy':'#203D52','blue':'#436C7A','gold':'#F1A54F','bronze':'#C98B3E',
 'cream':'#FFF5E4','sage':'#8EAE91','green':'#5C896F','charcoal':'#28353E','leaves':'#4C8B6D',
 'plant':'#50775C','skin':'#A96B48','skinlight':'#BB805A','hair':'#262D32','shoes':'#34343A',
 'pants':'#B6A082','white':'#F9FAF3','steel':'#9FB0B5','beige':'#DCD6C7',
 'book-red':'#D48469','book-blue':'#508A91','book-mustard':'#D9AB62','book-green':'#88AA8C',
 'screen':'#C2E2D9','glass':'#A8D0C8'
}

def rgba(color):
 h=COLORS.get(color,color).lstrip('#')
 return [int(h[i:i+2],16) for i in (0,2,4)]+[255]

def add(scene, name, mesh, color, xyz=(0,0,0), scale=None):
 mesh=mesh.copy();
 if scale is not None:mesh.apply_scale(scale)
 mesh.apply_translation(xyz)
 mat=trimesh.visual.material.PBRMaterial(name=f'mat_{color}',baseColorFactor=rgba(color),metallicFactor=.02,roughnessFactor=.82)
 mesh.visual=trimesh.visual.TextureVisuals(material=mat)
 scene.add_geometry(mesh,node_name=name,geom_name=name)

def box(s,name,xyz,size,color):add(s,name,trimesh.creation.box(extents=size),color,xyz)
def sphere(s,name,xyz,radii,color,sub=1):add(s,name,trimesh.creation.icosphere(subdivisions=sub,radius=1),color,xyz,scale=radii)
def cylinder(s,name,base,radius,height,color,sections=12):
 add(s,name,trimesh.creation.cylinder(radius=radius,height=height,sections=sections),color,(base[0],base[1]+height/2,base[2]))
def tube(s,name,start,end,radius,color,sections=8):
 a=np.array(start,float);b=np.array(end,float);d=b-a
 mesh=trimesh.creation.cylinder(radius=radius,height=np.linalg.norm(d),sections=sections)
 tf=trimesh.geometry.align_vectors([0,0,1],d/np.linalg.norm(d));mesh.apply_transform(tf)
 add(s,name,mesh,color,(a+b)/2)


def mentor():
 s=trimesh.Scene();
 # Y up. Person faces +Z. Total height around 1.65 units; neutral pose for display only.
 sphere(s,'jacket_torso',(0,.97,0),(.26,.39,.17),'navy',2)
 box(s,'shirt',(0,1.08,.148),(.215,.40,.055),'cream')
 tube(s,'lapel_l',(-.22,1.30,.19),(-.065,.92,.194),.033,'blue')
 tube(s,'lapel_r',(.22,1.30,.19),(.067,.92,.194),.033,'blue')
 box(s,'pocket_square',(.18,1.19,.179),(.08,.048,.008),'gold')
 # cropped trousers and shoes
 for sign,k in [(-1,'l'),(1,'r')]:
  cylinder(s,f'leg_{k}',(sign*.13,.15,0),.104,.50,'pants',12)
  sphere(s,f'shoe_{k}',(sign*.13,.11,.10),(.133,.075,.19),'shoes',1)
  tube(s,f'arm_{k}',(sign*.25,1.26,0),(sign*.36,.87,.07),.090,'navy',12)
  sphere(s,f'hand_{k}',(sign*.37,.81,.08),(.083,.10,.072),'skinlight',1)
 cylinder(s,'neck',(0,1.28,0),.095,.16,'skin')
 sphere(s,'head',(0,1.45,.02),(.243,.271,.216),'skinlight',2)
 sphere(s,'ear_l',(-.238,1.45,.012),(.054,.081,.047),'skin',1)
 sphere(s,'ear_r',(.238,1.45,.012),(.054,.081,.047),'skin',1)
 # natural close curls over hairline
 sphere(s,'hairbase',(0,1.630,-.025),(.247,.115,.20),'hair',1)
 for i,(x,z,y) in enumerate([(-.19,-.04,1.646),(-.10,-.16,1.675),(.01,-.15,1.68),(.14,-.13,1.669),(.205,-.025,1.635),(-.06,.135,1.651),(.07,.13,1.651),(-.17,.08,1.659),(.17,.08,1.659)]):
  sphere(s,f'curl_{i}',(x,y,z),(.084,.072,.08),'hair',1)
 # eyes at near-front z, glasses frame as 4 posts / horizontal beams; shaded lenses omitted for visibility
 for sign,k in [(-1,'l'),(1,'r')]:
  sphere(s,f'eye_{k}',(sign*.101,1.493,.211),(.024,.026,.013),'charcoal',1)
  # square rounded glasses frames in navy
  z=.222;cx=sign*.106;w=.116;h=.079
  tube(s,f'glass_{k}_top',(cx-w/2,1.56,z),(cx+w/2,1.56,z),.010,'charcoal')
  tube(s,f'glass_{k}_bottom',(cx-w/2,1.44,z),(cx+w/2,1.44,z),.010,'charcoal')
  tube(s,f'glass_{k}_left',(cx-w/2,1.44,z),(cx-w/2,1.56,z),.010,'charcoal')
  tube(s,f'glass_{k}_right',(cx+w/2,1.44,z),(cx+w/2,1.56,z),.010,'charcoal')
 tube(s,'glasses_bridge',(-.048,1.51,.224),(.048,1.51,.224),.012,'charcoal')
 sphere(s,'nose',(0,1.427,.23),(.037,.045,.041),'skin',1)
 for i in range(6):
  u=-.060+i*.04;v=-.028+(.060-(abs(u)))**2*3
  if i: tube(s,f'smile_{i}',(u-.04,1.390+(-.028+(.060-abs(u-.04)))**2*3,.230),(u,1.390+v,.230),.008,'darkwood')
 p=OUT/'gestor-mentor-prototipo.glb';p.write_bytes(s.export(file_type='glb'))
 return s,p


def environment():
 s=trimesh.Scene()
 box(s,'floor',(0,-.07,0),(8.4,.16,8.4),'floor')
 box(s,'rear_wall',(0,1.47,-4.13),(8.42,2.98,.15),'back')
 box(s,'left_wall',(-4.13,1.47,0),(.15,2.98,8.4),'side')
 box(s,'floor_border',(0,-.14,0),(8.63,.1,8.63),'darkwood')
 # back wall artwork frames, no embedded text
 for i,x in enumerate([1.0,2.55]):
  box(s,f'wall_picture_frame_{i}',(x,1.72,-3.995),(1.04,.82,.09),'oak')
  box(s,f'wall_picture_canvas_{i}',(x,1.72,-3.925),(.92,.70,.035),'cream')
  box(s,f'wall_art_patch_{i}',(x,1.68,-3.899),(.48,.35,.013),'sage')
 # left wall shelving units
 for a,x in enumerate([-2.9,-1.55]):
  z=-3.49
  box(s,f'shelf_end_l_{a}',(x-.54,1.16,z),(.115,2.13,.60),'darkwood')
  box(s,f'shelf_end_r_{a}',(x+.54,1.16,z),(.115,2.13,.60),'darkwood')
  for row in range(4):
   y=.24+row*.56
   box(s,f'shelf_{a}_{row}',(x,y,z),(1.14,.095,.62),'oak')
   for j in range(7):
    col=['book-red','book-mustard','book-blue','book-green','cream'][(j+row+a)%5]
    hi=.31+((j*7+row*3)%5)*.033
    box(s,f'book_{a}_{row}_{j}',(x-.39+j*.13,y+.05+hi/2,z),(.09,hi,.26),col)
 # left wall storage near left side
 box(s,'bench_left',(-3.38,.32,-.64),(.62,.54,1.5),'oak')
 box(s,'bench_cushion',(-3.38,.64,-.64),(.69,.12,1.56),'sage')
 # central carpet and table
 box(s,'carpet',(0,-.003,.2),(2.7,.012,2.15),'beige')
 box(s,'table_top',(.05,.73,.1),(1.70,.14,1.05),'lightwood')
 for k,x in [('l',-.60),('r',.69)]:
  for j,z in enumerate([-.25,.43]): cylinder(s,f'table_leg_{k}{j}',(x,.045,z),.06,.66,'darkwood',8)
 for i,x in enumerate([-.41,-.22,.09]):
  box(s,f'table_book_{i}',(x,.827,-.12+i*.045),(.3,.07,.40),['book-red','book-blue','book-mustard'][i])
 # chair with backs and legs
 def chair(prefix,x,z,rot=0):
  box(s,f'{prefix}_seat',(x,.43,z),(.60,.18,.60),'sage')
  box(s,f'{prefix}_back',(x,.74,z-.30),(.60,.67,.15),'green')
  for i,xx in enumerate([x-.24,x+.24]):
   for j,zz in enumerate([z-.24,z+.24]):cylinder(s,f'{prefix}_leg_{i}{j}',(xx,.06,zz),.034,.35,'darkwood',8)
 chair('chair_central',-.35,1.40)
 chair('chair_rear',1.20,-.50)
 # three electronic podiums: IDs match JSON stations
 for name,x,z,c in [('health',-2.43,1.28,'sage'),('risk',1.28,-1.58,'gold'),('trust',2.86,1.78,'book-blue')]:
  box(s,f'{name}_plinth',(x,.49,z),(.64,.98,.50),'navy')
  box(s,f'{name}_display',(x,1.10,z+.033),(.79,.55,.105),'blue')
  box(s,f'{name}_screen',(x,1.10,z+.094),(.67,.42,.028),'screen')
  box(s,f'{name}_accent',(x,1.40,z+.05),(.69,.047,.13),c)
  box(s,f'{name}_button',(x,.79,z+.279),(.19,.035,.05),'gold')
 # side reception / mentor area
 box(s,'reception_desk',(-1.72,.61,2.74),(1.18,1.05,.60),'navy')
 box(s,'reception_counter',(-1.72,1.19,2.74),(1.28,.15,.74),'lightwood')
 # planters near walls and station
 for i,(x,z) in enumerate([(-3.60,2.55),(3.59,-3.45),(3.55,3.43)]):
  cylinder(s,f'plant_pot_{i}',(x,.12,z),.22,.31,'charcoal',9)
  tube(s,f'plant_stalk_{i}',(x,.38,z),(x,.84,z),.032,'plant')
  for j in range(6):
   a=j*pi/3
   sphere(s,f'plant_leaf_{i}_{j}',(x+sin(a)*.16,.67+(j%3)*.085,z+cos(a)*.15),(.10,.23,.05),'leaves',1)
 # rear wall accent lighting and cork boards
 for i,x in enumerate([-2.85,2.90]):
  sphere(s,f'sconce_{i}',(x,2.66,-3.95),(.12,.12,.11),'gold',1)
 box(s,'cork_board',(-.09,1.96,-3.99),(1.30,.70,.07),'oak')
 box(s,'cork_insert',(-.09,1.96,-3.94),(1.20,.60,.029),'beige')
 # root look for previews
 p=OUT/'biblioteca-modular-prototipo.glb';p.write_bytes(s.export(file_type='glb'))
 return s,p

if __name__=='__main__':
 for func in (mentor,environment):
  scene,path=func()
  scan=trimesh.load(path,force='scene');faces=sum(len(m.faces) for m in scan.geometry.values())
  print(f'{path} bytes={path.stat().st_size} meshes={len(scan.geometry)} triangles={faces} bounds={np.round(scan.bounds,2)}')
