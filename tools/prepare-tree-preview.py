"""Cluster the very dense supplied tree only for a local isometric render; keep master intact."""
import json,struct,io,hashlib
from pathlib import Path
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];source=Path.home()/'Downloads/Meshy_AI_tree_model_1109210605_image-to-3d-texture.glb'
with source.open('rb') as f:
 f.seek(12);size,kind=struct.unpack('<II',f.read(8));g=json.loads(f.read(size));offset=12+8+size+8
def array(i):
 a=g['accessors'][i];v=g['bufferViews'][a['bufferView']];return np.memmap(source,mode='r',offset=offset+v.get('byteOffset',0)+a.get('byteOffset',0),dtype={5126:'<f4',5125:'<u4',5123:'<u2'}[a['componentType']],shape=(a['count'],{'SCALAR':1,'VEC2':2,'VEC3':3}[a['type']]))
p=g['meshes'][0]['primitives'][0];positions=array(p['attributes']['POSITION']);lo=positions.min(axis=0);span=np.max(positions.max(axis=0)-lo)
# Bounded temporary allocations: original arrays remain memory-mapped on disk.
quantized=np.asarray((positions-lo)/span*150,dtype=np.uint32);keys=quantized[:,0]+quantized[:,1]*256+quantized[:,2]*65536;del quantized
_,first,inverse=np.unique(keys,return_index=True,return_inverse=True);del keys
inverse=inverse.astype(np.uint32);indices=array(p['indices']).reshape(-1,3);parts=[]
for start in range(0,len(indices),200000):
 tri=inverse[indices[start:start+200000]];parts.append(tri[(tri[:,0]!=tri[:,1])&(tri[:,0]!=tri[:,2])&(tri[:,1]!=tri[:,2])])
tri=np.concatenate(parts);del parts,inverse
_,unique=np.unique(np.sort(tri,axis=1),axis=0,return_index=True);tri=tri[np.sort(unique)].astype('<u4');binary=bytearray();views=[];accessors=[]
def append(raw):
 while len(binary)%4:binary.append(0)
 views.append({'buffer':0,'byteOffset':len(binary),'byteLength':len(raw)});binary.extend(raw);return len(views)-1
for name,i in p['attributes'].items():
 old=g['accessors'][i];a=np.asarray(array(i)[first]);accessors.append({'bufferView':append(a.tobytes()),'componentType':5126,'count':len(a),'type':old['type'],**({'min':a.min(axis=0).tolist(),'max':a.max(axis=0).tolist()} if name=='POSITION' else {})});p['attributes'][name]=len(accessors)-1
accessors.append({'bufferView':append(tri.tobytes()),'componentType':5125,'count':tri.size,'type':'SCALAR'});p['indices']=len(accessors)-1
with source.open('rb') as f:
 for img in g['images']:
  v=g['bufferViews'][img['bufferView']];f.seek(offset+v.get('byteOffset',0));im=Image.open(io.BytesIO(f.read(v['byteLength']))).convert('RGB');im.thumbnail((1024,1024));out=io.BytesIO();im.save(out,format='JPEG',quality=90);img['bufferView']=append(out.getvalue())
g['bufferViews']=views;g['accessors']=accessors;g['buffers']=[{'byteLength':len(binary)}];raw=json.dumps(g,separators=(',',':')).encode();raw+=b' '*((-len(raw))%4);binary+=b'\0'*((-len(binary))%4)
out=ROOT/'artifacts/tree-preview.glb';out.write_bytes(struct.pack('<III',0x46546c67,2,12+8+len(raw)+8+len(binary))+struct.pack('<II',len(raw),0x4e4f534a)+raw+struct.pack('<II',len(binary),0x004e4942)+binary)
metadata={'source':source.name,'sourceBytes':source.stat().st_size,'sourceSha256':hashlib.file_digest(source.open('rb'),'sha256').hexdigest(),'originalVertices':len(positions),'originalTriangles':len(indices),'previewVertices':len(first),'previewTriangles':len(tri),'previewBytes':out.stat().st_size,'method':'150-cell spatial clustering for local atlas only; master untouched; textures <=1024px'}
(ROOT/'artifacts/tree-source.json').write_text(json.dumps(metadata,indent=2),encoding='utf-8');print(json.dumps(metadata),flush=True)
