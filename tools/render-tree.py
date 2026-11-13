"""Local four-view atlas of the PM tree. No API use or raw master in the deployment."""
import json,sys,os,base64,hashlib,http.server,functools,threading
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'artifacts/qa-python'))
from playwright.sync_api import sync_playwright
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',8793),functools.partial(Quiet,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_PATH') or ('C:/Program Files/Google/Chrome/Application/chrome.exe' if os.name=='nt' else None),args=['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disk-cache-size=1','--disable-gpu-shader-disk-cache']);page=b.new_page();page.goto('http://127.0.0.1:8793/tools/render-tree.html');page.wait_for_function('treeResult.done',timeout=180000);row=page.evaluate('treeResult');assert not row.get('error'),row;raw=base64.b64decode(row.pop('data').split(',')[1]);b.close()
finally:server.shutdown()
out=ROOT/'assets/nature';out.mkdir(exist_ok=True);(out/'arvore-sombra-views.png').write_bytes(raw);row.update(json.loads((ROOT/'artifacts/tree-source.json').read_text(encoding='utf-8')));row.update(url='/assets/nature/arvore-sombra-views.png',sha256=hashlib.sha256(raw).hexdigest());(out/'tree-provenance.json').write_text(json.dumps(row,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
p=ROOT/'data/continuous/furniture-visuals.json';d=json.loads(p.read_text(encoding='utf-8'));d['assets']=[a for a in d['assets'] if a['id']!='arvore-sombra'];d['assets'].append(dict(id='arvore-sombra',name='Árvore de sombra',url=row['url'],file='arvore-sombra-views.png',transparent=True,sitPoint=None,standPoint=[.45,1.3,0],facing=2,scale=dict(width=.9,depth=.9,height=2.4,cellMeters=1),canopyScale=row['scale'],anchor=row['projection']['anchor'],projection=row['projection'],bounds=[0,0,row['frameWidth'],row['frameHeight']],rotationViews=4,animation=dict(frames=1,duration=1,frameWidth=row['frameWidth'],frameHeight=row['frameHeight']),source=row['source'],sourceSha256=row['sourceSha256']))
for key in ['upgrades','items']:d[key]['arvore']['asset']='arvore-sombra'
p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');(ROOT/'data/continuous/furniture-visuals.js').write_text('export const FURNITURE_VISUALS=Object.freeze('+json.dumps(d,ensure_ascii=False,separators=(',',':'))+');\n',encoding='utf-8');print(json.dumps({k:row[k] for k in ['url','previewVertices','previewTriangles','frameWidth','frameHeight','sha256']}))
