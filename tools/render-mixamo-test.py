"""Inspect and bake only the PM-supplied local FBX. No source upload or generated motion."""
import os,sys,json,http.server,threading,base64,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'artifacts/qa-python'))
from playwright.sync_api import sync_playwright
SOURCE=Path(r'C:/Users/CRM7/Downloads/Shoved Reaction With Spin.fbx');OUT=ROOT/'assets/animation-tests';OUT.mkdir(parents=True,exist_ok=True)
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**k):super().__init__(*a,directory=str(ROOT),**k)
 def log_message(self,*a):pass
 def do_GET(self):
  if self.path=='/source/model.fbx':
   self.send_response(200);self.send_header('Content-Length',str(SOURCE.stat().st_size));self.end_headers();self.wfile.write(SOURCE.read_bytes());return
  super().do_GET()
server=http.server.ThreadingHTTPServer(('127.0.0.1',8785),Handler);threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_PATH') or ('C:/Program Files/Google/Chrome/Application/chrome.exe' if os.name=='nt' else None),args=['--use-angle=swiftshader','--enable-unsafe-swiftshader']);page=b.new_page();page.goto('http://127.0.0.1:8785/tools/render-mixamo-test.html');page.wait_for_function('window.castResult?.done',timeout=180000);r=page.evaluate('castResult');assert not r.get('error'),r
  data=base64.b64decode(r.pop('data').split(',')[1]);(OUT/'mixamo-reaction.png').write_bytes(data);r.update(source=SOURCE.name,sourceBytes=SOURCE.stat().st_size,sourceSha256=hashlib.sha256(SOURCE.read_bytes()).hexdigest(),atlasSha256=hashlib.sha256(data).hexdigest(),frames=32,directions=4,frameWidth=128,frameHeight=192,file='/assets/animation-tests/mixamo-reaction.png',rootTranslation='XZ locked; supplied bone rotations retained',purpose='Manual visual compatibility test, no canonical employee assignment');(OUT/'mixamo-reaction.json').write_text(json.dumps(r,indent=2),encoding='utf-8');b.close();print(json.dumps(r))
finally:server.shutdown()
