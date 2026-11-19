"""Bake provided local models; only PNG atlases ship, never the source collection."""
import sys,json,http.server,threading,urllib.parse,base64,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'artifacts/qa-python'))
from playwright.sync_api import sync_playwright
SOURCE=Path(r'C:/Users/CRM7/Desktop/KONWERSA/PLANO B/PilhA+/Pilha Game/Assets_3D/Personagens')
manifest=json.loads((ROOT/'data/continuous/intro-cast.json').read_text(encoding='utf-8'));models={m['id']:m for m in manifest['models']}
for m in models.values():
 p=SOURCE/m['source'];m['_path']=p;m['texture']=next((f.name for f in p.parent.glob('*_texture_0.png')),None)
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**k):super().__init__(*a,directory=str(ROOT),**k)
 def log_message(self,*a):pass
 def do_GET(self):
  parsed=urllib.parse.urlparse(self.path)
  if parsed.path=='/config':
   row=models[urllib.parse.parse_qs(parsed.query)['id'][0]];data=json.dumps({k:v for k,v in row.items() if not k.startswith('_')}).encode();self.send_response(200);self.end_headers();self.wfile.write(data);return
  if parsed.path.startswith('/source/'):
   parts=parsed.path.split('/');m=models.get(parts[2]);name=urllib.parse.unquote(parts[-1]);p=m['_path'] if name.startswith('model.') else m['_path'].parent/name
   if not p.is_file() or p.parent!=m['_path'].parent:self.send_error(404);return
   data=p.read_bytes();self.send_response(200);self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data);return
  super().do_GET()
server=http.server.ThreadingHTTPServer(('127.0.0.1',8776),Handler);threading.Thread(target=server.serve_forever,daemon=True).start();report=[]
try:
 with sync_playwright() as p:
  b=p.chromium.launch(headless=True,executable_path='C:/Program Files/Google/Chrome/Application/chrome.exe',args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
  for m in models.values():
   if m['reused']:continue
   if '--missing-only' in sys.argv and (ROOT/m['file'].lstrip('/')).exists():continue
   print('Rendering '+m['id'],flush=True);ctx=b.new_context();page=ctx.new_page();page.goto('http://127.0.0.1:8776/tools/render-intro-cast.html?id='+m['id'],wait_until='domcontentloaded');page.wait_for_function('window.castResult?.done',timeout=180000);result=page.evaluate('castResult');assert not result.get('error'),result
   data=base64.b64decode(result.pop('data').split(',')[1]);assert data[1:4]==b'PNG';(ROOT/m['file'].lstrip('/')).write_bytes(data);m['duration']=result['duration'];m['anchorY']=result['anchorY'];result['atlasSha256']=hashlib.sha256(data).hexdigest();report.append(result);ctx.close()
  b.close()
finally:
 server.shutdown();(ROOT/'artifacts/intro-cast-render.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
 for m in models.values():m.pop('_path',None);m.pop('texture',None)
 (ROOT/'data/continuous/intro-cast.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
