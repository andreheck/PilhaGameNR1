"""Bake approved FBX animation into the existing lightweight map atlas format.
This is an asset processing job, separate from the game's browser regression.
Source archives are checked before extracting only the four expected file types.
"""
import base64,hashlib,json,os,subprocess,sys,time,zipfile,socket
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'artifacts/rigged-render';OUT.mkdir(parents=True,exist_ok=True)
WORK=ROOT/'artifacts/rigged-work';WORK.mkdir(parents=True,exist_ok=True)
rows=json.loads((ROOT/'data/continuous/npc-rigged.json').read_text(encoding='utf-8'))['bindings'];inputs=[]
for row in rows:
    source=ROOT/row['sourceZip']
    assert hashlib.sha256(source.read_bytes()).hexdigest()==row['sha256'],'Source archive changed'
    dest=WORK/row['key'];dest.mkdir(exist_ok=True)
    with zipfile.ZipFile(source) as archive:
        selected=[i for i in archive.infolist() if i.filename.lower().endswith(('.fbx','.png'))]
        assert len(selected)==4,'Unexpected FBX package'
        for info in selected:
            name=Path(info.filename).name
            assert '\\' not in name and info.file_size<80000000,'Invalid asset'
            (dest/name).write_bytes(archive.read(info))
    inputs.append({'key':row['key'],'id':row['id'],'fbx':next(p.name for p in dest.glob('*.fbx')),'texture':next(p.name for p in dest.glob('*_texture_0.png')),'roughness':next(p.name for p in dest.glob('*roughness.png')),'metallic':next(p.name for p in dest.glob('*metallic.png'))})
(WORK/'input.json').write_text(json.dumps(inputs),encoding='utf-8')
server=subprocess.Popen([sys.executable,'-m','http.server','8769','--bind','127.0.0.1'],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
    for _ in range(40):
        try:
            with socket.create_connection(('127.0.0.1',8769),.2):break
        except OSError:time.sleep(.1)
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_PATH') or None,args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage'])
        page=browser.new_page(viewport={'width':1200,'height':900});page.on('console',lambda m:print(m.type,m.text,flush=True))
        page.goto('http://127.0.0.1:8769/tools/render-rigged-npcs.html',wait_until='domcontentloaded')
        page.wait_for_function('window.riggedResult?.done===true',timeout=480000)
        report=page.evaluate('window.riggedResult');page.screenshot(path=str(OUT/'render-preview.png'),full_page=True)
        assert not report['errors'],report['errors']
        for image in report.pop('exports'):
            path=OUT/(image['key']+'-'+image['action']+'.png');path.write_bytes(base64.b64decode(image.pop('data').split(',',1)[1]))
            im=Image.open(path).convert('RGBA');assert im.size==(image['frames']*128,768)
            alpha=im.getchannel('A');assert alpha.getextrema()==(0,255),'Missing transparency'
            frames=[im.crop((f*128,0,(f+1)*128,192)).tobytes() for f in range(image['frames'])]
            if image['action']!='idle':assert len(set(frames))>1,'Animation is static'
            image.update({'file':path.name,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'distinctFrames':len(set(frames))})
            report.setdefault('atlases',[]).append(image)
        (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
        browser.close()
finally:server.terminate()
