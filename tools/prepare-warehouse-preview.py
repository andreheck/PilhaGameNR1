"""Optimise the single supplied FBX mesh for local atlas rendering; master remains intact."""
import json,struct,zlib,io,hashlib,sys
from pathlib import Path
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
config=ROOT/'artifacts/warehouse-source-map.json'
if len(sys.argv)>1:
 folder=Path(sys.argv[1]).resolve();models=list(folder.glob('*.fbx'))
 if len(models)!=1:raise SystemExit('Supply the approved Galpao_Diorama folder, containing one FBX.')
 textures=ROOT/'artifacts/warehouse-source';textures.mkdir(parents=True,exist_ok=True);original={}
 for image in folder.glob('*.png'):
  raw=image.read_bytes();original[image.name]={'sha256':hashlib.sha256(raw).hexdigest(),'bytes':len(raw)}
  im=Image.open(image);im.thumbnail((1024,1024));im.save(textures/image.name)
 model=models[0];cfg={'model':str(model),'textures':str(textures),'source':model.name,'sourceSha256':hashlib.sha256(model.read_bytes()).hexdigest(),'sourceBytes':model.stat().st_size,'originalTextures':original};config.write_text(json.dumps(cfg,indent=2),encoding='utf-8')
else:cfg=json.loads(config.read_text(encoding='utf-8'))
source=Path(cfg['model']);f=source.open('rb');f.seek(23);version=struct.unpack('<I',f.read(4))[0];wide=version>=7500;header='<QQQB' if wide else '<IIIB';hs=25 if wide else 13;arrays={}
def walk(end,parents=()):
 while f.tell()+hs<=end:
  stop,count,length,nlen=struct.unpack(header,f.read(hs))
  if not stop:break
  name=f.read(nlen).decode();propEnd=f.tell()+length
  if name in ['Vertices','PolygonVertexIndex','UV','UVIndex'] and 'Geometry' in parents and name not in arrays:
   typ=f.read(1).decode();n,encoding,nbytes=struct.unpack('<III',f.read(12));raw=f.read(nbytes);arrays[name]=np.frombuffer(zlib.decompress(raw) if encoding else raw,dtype={'d':'<f8','i':'<i4'}[typ]).copy()
  f.seek(propEnd)
  if f.tell()<stop-hs:walk(stop-hs,parents+(name,))
  f.seek(stop)
walk(source.stat().st_size);f.close();v=arrays['Vertices'].reshape(-1,3);idx=arrays['PolygonVertexIndex'];ends=np.flatnonzero(idx<0);assert np.all(np.diff(np.r_[-1,ends])==3),'Only triangle mesh is supported';idx=np.where(idx<0,-idx-1,idx).astype(np.uint32);uv=arrays['UV'].reshape(-1,2);uvi=arrays['UVIndex'];# Keep UV seams exactly: positional clustering mixes unrelated texture islands.
pairs=np.column_stack((idx,uvi)).astype(np.uint32);unique,inverse=np.unique(pairs,axis=0,return_inverse=True)
pos=np.asarray(v[unique[:,0]],dtype='<f4');tex=np.asarray(uv[unique[:,1]],dtype='<f4');tex[:,1]=1-tex[:,1]
tri=inverse.reshape(-1,3).astype(np.uint32);norm=np.zeros_like(pos);face=np.cross(pos[tri[:,1]]-pos[tri[:,0]],pos[tri[:,2]]-pos[tri[:,0]]);[np.add.at(norm,tri[:,i],face) for i in range(3)];norm/=np.maximum(1e-9,np.linalg.norm(norm,axis=1,keepdims=True))
binary=bytearray();views=[];accessors=[]
def add(raw):
 while len(binary)%4:binary.append(0)
 views.append({'buffer':0,'byteOffset':len(binary),'byteLength':len(raw)});binary.extend(raw);return len(views)-1
for a,kind in [(pos,'VEC3'),(norm,'VEC3'),(tex,'VEC2')]:accessors.append({'bufferView':add(a.tobytes()),'componentType':5126,'count':len(a),'type':kind,**({'min':pos.min(axis=0).tolist(),'max':pos.max(axis=0).tolist()} if len(accessors)==0 else {})})
accessors.append({'bufferView':add(tri.astype('<u4').tobytes()),'componentType':5125,'count':tri.size,'type':'SCALAR'})
names=list(cfg['originalTextures']);images=[]
for channel in ['color','normal','roughness','metallic']:
 name=next(n for n in names if (channel=='color' and not any(x in n for x in ['normal','roughness','metallic'])) or channel!='color' and channel in n);raw=(Path(cfg['textures'])/name).read_bytes();images.append({'bufferView':add(raw),'mimeType':'image/png'})
g={'asset':{'version':'2.0','generator':'PilhA+ supplied warehouse atlas preparation'},'scene':0,'scenes':[{'nodes':[0]}],'nodes':[{'mesh':0}],'meshes':[{'primitives':[{'attributes':{'POSITION':0,'NORMAL':1,'TEXCOORD_0':2},'indices':3,'material':0}]}],'materials':[{'doubleSided':True,'pbrMetallicRoughness':{'baseColorTexture':{'index':0},'metallicFactor':0,'roughnessFactor':.9},'normalTexture':{'index':1}}],'textures':[{'source':i} for i in range(4)],'images':images,'bufferViews':views,'accessors':accessors,'buffers':[{'byteLength':len(binary)}]};raw=json.dumps(g,separators=(',',':')).encode();raw+=b' '*((-len(raw))%4);binary+=b'\0'*((-len(binary))%4);out=ROOT/'artifacts/warehouse-preview.glb';out.write_bytes(struct.pack('<III',0x46546c67,2,28+len(raw)+len(binary))+struct.pack('<II',len(raw),0x4e4f534a)+raw+struct.pack('<II',len(binary),0x004e4942)+binary)
cfg.update(originalVertices=len(v),originalTriangles=len(idx)//3,previewVertices=len(pos),previewTriangles=len(tri),previewBytes=out.stat().st_size,method='Original FBX triangles and UV seams preserved in local GLB; master unchanged');(ROOT/'artifacts/warehouse-source-map.json').write_text(json.dumps(cfg,indent=2),encoding='utf-8');print(json.dumps({k:cfg[k] for k in ['originalVertices','originalTriangles','previewVertices','previewTriangles','previewBytes']}))
