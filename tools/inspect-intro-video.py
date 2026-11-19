import sys,http.server,threading,functools,json,base64
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'artifacts/qa-python'))
from playwright.sync_api import sync_playwright
server=http.server.ThreadingHTTPServer(('127.0.0.1',8775),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(headless=True,executable_path='C:/Program Files/Google/Chrome/Application/chrome.exe');page=b.new_page(viewport={'width':1200,'height':800});page.goto('http://127.0.0.1:8775/assets/cinematic/ao-trabalho-intro.mp4');page.wait_for_function('document.querySelector("video")?.readyState>=2');meta=page.evaluate('(()=>{const v=document.querySelector("video");v.pause();return {width:v.videoWidth,height:v.videoHeight,duration:v.duration};})()');print(json.dumps(meta))
  for i,f in enumerate([.08,.5,.9]):
   page.evaluate('(f)=>{document.querySelector("video").currentTime=document.querySelector("video").duration*f;}',f);page.wait_for_timeout(400);data=page.evaluate('(()=>{const v=document.querySelector("video"),c=document.createElement("canvas");c.width=v.videoWidth;c.height=v.videoHeight;c.getContext("2d").drawImage(v,0,0);return c.toDataURL("image/jpeg",.9);})()');path=ROOT/('assets/cinematic/ao-trabalho-poster.jpg' if i==1 else 'artifacts/intro-video-'+str(i)+'.jpg');path.write_bytes(base64.b64decode(data.split(',')[1]))
  b.close()
finally:server.shutdown()
