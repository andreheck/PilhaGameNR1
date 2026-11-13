"""Fixed-view local rendering of the approved logistical diorama, without publishing its master."""
import sys,os,json,base64,hashlib,threading,http.server,urllib.parse
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'artifacts/qa-python'))
from playwright.sync_api import sync_playwright
cfg=json.loads((ROOT/'artifacts/warehouse-source-map.json').read_text(encoding='utf-8'));names=list(cfg['originalTextures']);textures={k:next(n for n in names if (k=='color' and not any(x in n for x in ['normal','roughness','metallic'])) or k!='color' and k in n) for k in ['color','normal','roughness','metallic']}
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**k):super().__init__(*a,directory=str(ROOT),**k)
 def log_message(self,*a):pass
 def do_GET(self):
  path=urllib.parse.urlparse(self.path).path
  if path=='/warehouse/config':self.send_response(200);self.end_headers();self.wfile.write(json.dumps({'textures':textures}).encode());return
  if path.startswith('/warehouse/'):
   name=urllib.parse.unquote(path.split('/')[-1]);target=Path(cfg['model']) if name=='model.fbx' else Path(cfg['textures'])/name if name in names else None
   if not target:self.send_error(404);return
   self.send_response(200);self.send_header('Content-Length',str(target.stat().st_size));self.end_headers();self.wfile.write(target.read_bytes());return
  super().do_GET()
server=http.server.ThreadingHTTPServer(('127.0.0.1',8797),Handler);threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_PATH') or ('C:/Program Files/Google/Chrome/Application/chrome.exe' if os.name=='nt' else None),args=['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-shader-disk-cache','--disk-cache-size=1']);page=b.new_page();page.goto('http://127.0.0.1:8797/tools/render-warehouse.html');page.wait_for_function('warehouseResult.done',timeout=240000);row=page.evaluate('warehouseResult');assert not row.get('error'),row;raw=base64.b64decode(row.pop('data').split(',')[1]);b.close()
finally:server.shutdown()
out=ROOT/'assets/logistics';out.mkdir(exist_ok=True);(out/'warehouse-views.png').write_bytes(raw);row.update({k:v for k,v in cfg.items() if k not in ['model','textures']});row.update(url='/assets/logistics/warehouse-views.png',sha256=hashlib.sha256(raw).hexdigest());(out/'warehouse-provenance.json').write_text(json.dumps(row,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(json.dumps({k:row[k] for k in ['scale','url','frameWidth','frameHeight','sha256']}))
