from pathlib import Path
import trimesh
root=Path(__file__).resolve().parents[1]
for name,minimum,maximum,size_limit in [
 ('biblioteca-modular-prototipo.glb',100,100000,800000),
 ('gestor-mentor-prototipo.glb',25,300000,500000)
]:
 p=root/'assets/v13'/name
 assert p.read_bytes()[:4]==b'glTF'
 assert p.stat().st_size<size_limit,(name,p.stat().st_size)
 model=trimesh.load(p,force='scene')
 assert len(model.geometry)>=minimum,(name,len(model.geometry))
 assert all(not geo.is_empty for geo in model.geometry.values())
 assert -5<model.bounds[0][0]<0 and model.bounds[1][1]>1
 print(name,'meshes',len(model.geometry),'triangles',sum(len(x.faces) for x in model.geometry.values()),'size',p.stat().st_size)
assert (root/'assets/v13/biblioteca-3d-preview.png').exists()
print('GLB integrity + preview passed')
