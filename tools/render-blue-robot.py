import http.server,threading,subprocess,json,base64
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**k):super().__init__(*a,directory=str(ROOT),**k)
 def do_POST(self):
  data=json.loads(self.rfile.read(int(self.headers['Content-Length'])))
  for row in data.pop('exports',[]):
   (ROOT/'assets/robots'/('blue-robot-'+row['action']+'.png')).write_bytes(base64.b64decode(row.pop('data').split(',')[1]));data.setdefault('atlases',[]).append(row)
  (ROOT/'assets/robots/report.json').write_text(json.dumps(data,indent=2),encoding='utf-8');self.send_response(200);self.end_headers()
server=http.server.ThreadingHTTPServer(('127.0.0.1',8773),Handler);threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 subprocess.run(['C:/Program Files/Google/Chrome/Application/chrome.exe','--headless','--disable-gpu-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-first-run','--user-data-dir='+str(ROOT/'artifacts/robot-chrome'),'--virtual-time-budget=60000','--dump-dom','http://127.0.0.1:8773/tools/render-blue-robot.html'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,timeout=100,creationflags=subprocess.CREATE_NO_WINDOW)
finally:server.shutdown()
print((ROOT/'assets/robots/report.json').read_text() if (ROOT/'assets/robots/report.json').exists() else 'NO REPORT')
