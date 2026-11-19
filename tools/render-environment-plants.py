"""Bake compact four-view WebP sprites directly from approved zipped FBX assets.
The master ZIP files remain untouched and are streamed to the renderer, not extracted.
"""
import base64,hashlib,http.server,json,os,socketserver,threading,zipfile
from pathlib import Path
from urllib.parse import unquote,urlparse
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
SOURCE=Path(r'C:\Users\CRM7\Desktop\KONWERSA\PLANO B\PilhA+\Pilha Game\Assets_3D\Cenarios\Plantas')
SPECS=[
 {'key':'monstera','id':'planta-grande','source':'Meshy_AI_Monstera_Ethnic_Plant_20261116_image-to-3d-texture_fbx.zip','targetHeight':1.4,'output':'monstera-interior-views.webp'},
 {'key':'snake-plant','id':'planta-pequena','source':'Meshy_AI_Snake_Plant_Ethnic_Pot_20261116_image-to-3d-texture_fbx.zip','targetHeight':.82,'output':'snake-plant-views.webp'},
]
archives={};inputs=[]
for spec in SPECS:
 path=SOURCE/spec['source'];assert path.is_file(),f'Missing approved asset: {path}'
 sha=hashlib.file_digest(path.open('rb'),'sha256').hexdigest()
 archive=zipfile.ZipFile(path);files=[i for i in archive.infolist() if not i.is_dir()]
 fbx=[i for i in files if i.filename.lower().endswith('.fbx')]
 colors=[i for i in files if i.filename.lower().endswith('.png') and not any(k in Path(i.filename).stem.lower() for k in ('metallic','normal','roughness'))]
 assert len(fbx)==1 and colors,f'Unexpected contents in {spec["source"]}'
 archives[spec['key']]={'zip':archive,'files':files,'sourcePath':path}
 inputs.append({**spec,'fbx':Path(fbx[0].filename).name,'texture':Path(colors[0].filename).name,
  'sourceSha256':sha,'sourceBytes':path.stat().st_size,'modelBytes':fbx[0].file_size,'textureBytes':colors[0].file_size})

class Handler(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
 def do_GET(self):
  path=unquote(urlparse(self.path).path)
  if path=='/plant-inputs.json':
   raw=json.dumps(inputs).encode();self.send_response(200);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(raw)));self.end_headers();self.wfile.write(raw);return
  if path.startswith('/source/'):
   parts=path.split('/',3)
   if len(parts)<4 or parts[2] not in archives:self.send_error(404);return
   item=next((i for i in archives[parts[2]]['files'] if Path(i.filename).name==parts[3]),None)
   if not item:self.send_error(404);return
   self.send_response(200);self.send_header('Content-Length',str(item.file_size));self.send_header('Content-Type','image/png' if parts[3].lower().endswith('.png') else 'application/octet-stream');self.end_headers()
   with archives[parts[2]]['zip'].open(item) as src:
    while chunk:=src.read(1024*1024):self.wfile.write(chunk)
   return
  return super().do_GET()

server=socketserver.ThreadingTCPServer(('127.0.0.1',8795),Handler);server.daemon_threads=True
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_PATH') or None,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage','--disk-cache-size=1'])
  page=browser.new_page(viewport={'width':1000,'height':800});page.on('console',lambda m:print(m.type,m.text,flush=True))
  page.goto('http://127.0.0.1:8795/tools/render-environment-plants.html',wait_until='domcontentloaded')
  page.wait_for_function('window.plantResult?.done===true',timeout=600000)
  result=page.evaluate('window.plantResult');browser.close()
  assert not result['errors'],result['errors']
finally:
 server.shutdown();server.server_close()

out=ROOT/'assets/nature';out.mkdir(parents=True,exist_ok=True);provenance=[]
for row in inputs:
 frame=next(x for x in result['exports'] if x['key']==row['key'])
 png=Image.open(__import__('io').BytesIO(base64.b64decode(frame['data'].split(',',1)[1]))).convert('RGBA')
 assert png.size==(frame['frameWidth'],frame['frameHeight']*4)
 frames=[png.crop((0,i*frame['frameHeight'],frame['frameWidth'],(i+1)*frame['frameHeight'])).tobytes() for i in range(4)]
 assert len(set(frames))>1,'Expected distinct four-direction views'
 path=out/row['output'];png.save(path,format='WEBP',quality=92,method=6)
 with Image.open(path) as check:assert check.size==png.size and check.mode in ('RGBA','RGB')
 frame.pop('data',None)
 frame.update({'file':path.name,'url':'/assets/nature/'+path.name,'source':row['source'],'sourceSha256':row['sourceSha256'],
  'sourceBytes':row['sourceBytes'],'modelBytes':row['modelBytes'],'textureBytes':row['textureBytes'],'atlasBytes':path.stat().st_size,
  'atlasSha256':hashlib.file_digest(path.open('rb'),'sha256').hexdigest(),'compressionRatio':round(path.stat().st_size/row['sourceBytes'],5)})
 provenance.append(frame)

catalogPath=ROOT/'data/continuous/furniture-visuals.json';catalog=json.loads(catalogPath.read_text(encoding='utf-8'))
byId={a['id']:a for a in catalog['assets']}
for frame in provenance:
 asset=byId[frame['id']];asset.update({'file':frame['file'],'url':frame['url'],'scale':{'width':frame['width'],'depth':frame['depth'],'height':frame['height'],'cellMeters':1},
  'anchor':frame['projection']['anchor'],'projection':frame['projection'],'bounds':[0,0,frame['frameWidth'],frame['frameHeight']],
  'rotationViews':4,'animation':{'frames':1,'duration':1,'frameWidth':frame['frameWidth'],'frameHeight':frame['frameHeight']},
  'standPoint':frame['standPoint'],'sitPoint':None,'facing':2,'source':frame['source'],'sourceSha256':frame['sourceSha256']})
catalogPath.write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(ROOT/'data/continuous/furniture-visuals.js').write_text('// Generated from furniture-visuals.json by tools/import_furniture_kit.py\nexport const FURNITURE_VISUALS = Object.freeze('+json.dumps(catalog,ensure_ascii=False,separators=(',',':'))+');\n',encoding='utf-8')
(out/'environment-plants-provenance.json').write_text(json.dumps(provenance,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps([{'id':x['id'],'file':x['file'],'sourceBytes':x['sourceBytes'],'atlasBytes':x['atlasBytes'],'dimensions':[x['width'],x['depth'],x['height']]} for x in provenance],ensure_ascii=False))
