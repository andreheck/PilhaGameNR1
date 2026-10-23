"""Exercise the built company mode using isolated synthetic saves."""
import json,os,socket,subprocess,sys,time
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'artifacts'/'continuous';OUT.mkdir(parents=True,exist_ok=True)
report={'viewports':[],'checks':[],'errors':[]}
def check(ok,label):
    if not ok:raise AssertionError(label)
    report['checks'].append(label)
def run(browser,w,h):
    tag=f'{w}x{h}';ctx=browser.new_context(viewport={'width':w,'height':h},reduced_motion='reduce');page=ctx.new_page();errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    def snap(name):page.screenshot(path=str(OUT/f'{name}-{tag}.png'))
    def state():return page.evaluate('JSON.parse(localStorage.getItem("pilha-company-continuous-v2"))')
    try:
        page.goto('http://127.0.0.1:8766/',wait_until='domcontentloaded');page.locator('.continuous-gallery-dialog[open]').wait_for()
        page.locator('[data-direct-pick="PILHA-H01|principal"]').wait_for();page.wait_for_timeout(350)
        check(page.locator('[data-direct-pick]').count()==12,tag+': direct role controls on first screen')
        check(page.locator('.ph-card__art img').evaluate_all('(is)=>is.every(i=>i.complete&&i.naturalWidth>0)'),tag+': six original portraits loaded')
        page.locator('[data-direct-pick="PILHA-H01|principal"]').click()
        check(page.locator('[data-direct-pick="PILHA-H01|support"]').is_disabled(),tag+': duplicate hero blocked')
        page.locator('[data-direct-pick="PILHA-H03|support"]').click()
        check('+10%' in page.locator('.hero-notice').inner_text(),tag+': synergy visible before saving')
        page.locator('[data-direct-pick="PILHA-H02|support"]').click();snap('heroes')
        page.locator('[data-team-save]').click();page.locator('.pm-root').wait_for();page.wait_for_timeout(250)
        check(state()['budget']==10000,tag+': no credits spent on team')
        check(page.locator('.pm-tab').count()==5,tag+': four areas plus overview')
        check('Caso 01' not in page.locator('.pm-root').inner_text(),tag+': cases hidden from main navigation')
        check(page.locator('.pm-goal__v').inner_text()=='32',tag+': source company index 32');snap('map')
        page.locator('.pm-tab[data-i="0"]').click()
        check(page.locator('.pm-ring b').inner_text()=='34',tag+': source office baseline 34')
        check(page.locator('.pm-factors .pm-factor').count()==6,tag+': six independent factors')
        page.locator('.pm-tab[data-i="1"]').click();page.wait_for_timeout(250)
        check(page.locator('.pm-ring b').inner_text()=='31',tag+': source production baseline 31')
        page.locator('[data-act="buy"][data-id="jorn"]').click();page.wait_for_timeout(250)
        check(state()['budget']==8800,tag+': source level1 cost 1200')
        check(state()['week']==1,tag+': purchase does not advance time')
        check(state()['receipts'][0]['level']==1,tag+': first level saved')
        check('50' in page.locator('.pm-factor[data-z="0"] b').inner_text(),tag+': immediate source delta28 applied');snap('production')
        page.locator('[data-act="buy"][data-id="jorn"]').click();page.wait_for_timeout(120)
        check(state()['budget']==7100,tag+': source level2 cost1700')
        page.locator('[data-act="buy"][data-id="jorn"]').click();page.wait_for_timeout(120)
        check(state()['budget']==4800,tag+': source level3 cost2300')
        check(page.locator('[data-act="buy"][data-id="jorn"]').is_disabled(),tag+': fourth level blocked')
        page.locator('.pm-tab[data-i="3"]').click();page.wait_for_timeout(150)
        check(page.locator('.pm-item').count()==12,tag+': twelve new restoration upgrades')
        page.locator('[data-act="buy"][data-id="puff"]').click();page.wait_for_timeout(150)
        check(len(state()['receipts'])==4,tag+': restoration purchase saved')
        check('pessoa' in page.locator('.visitor-list').inner_text(),tag+': restorative visitor visible');snap('restoration')
        page.locator('[data-company="advance"]').click();page.wait_for_timeout(120)
        check(state()['week']==2,tag+': individual effect clock')
        page.locator('[data-company="advance"]').click();page.wait_for_timeout(120)
        check(state()['events']['current']['stage']=='decision',tag+': original event becomes due')
        page.locator('[data-company="event"]').click();page.locator('.continuous-modal[open]').wait_for()
        check(page.locator('[data-event-choice]').count()>=2,tag+': source event decisions');snap('event')
        page.locator('[data-event-choice]').last.click();page.locator('[data-event-finish]').click()
        check(state()['events']['current'] is None,tag+': event completed once')
        before=page.evaluate('localStorage.getItem("pilha-company-continuous-v2")')
        page.locator('[data-company="event"]').click()
        check(page.locator('[data-preview-event]').count()==19,tag+': all19 source events available')
        page.locator('[data-preview-event="epid"]').click();page.locator('[data-event-choice]').last.click();page.locator('[data-event-finish]').click()
        check(before==page.evaluate('localStorage.getItem("pilha-company-continuous-v2")'),tag+': epidemic preview does not mutate or charge')
        page.reload(wait_until='domcontentloaded');page.locator('[data-team-save]').click();page.locator('.pm-root').wait_for()
        check(state()['budget']==4350,tag+': balance and upgrades survive reload')
        check(not errors,tag+': no uncaught JS errors')
        check(page.locator('.pm-root').evaluate('(e)=>e.scrollWidth<=e.clientWidth+2'),tag+': no horizontal page overflow')
        report['viewports'].append({'width':w,'height':h,'ok':True})
    except Exception:
        snap('FAILED');(OUT/f'FAILED-{tag}.html').write_text(page.content(),encoding='utf-8');report['errors'].extend(errors);raise
    finally:ctx.close()
server=subprocess.Popen([sys.executable,'-m','http.server','8766','--bind','127.0.0.1'],cwd=ROOT/'dist',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
    for _ in range(40):
        try:
            with socket.create_connection(('127.0.0.1',8766),.2):break
        except OSError:time.sleep(.1)
    with sync_playwright() as p:
        opts={'headless':True,'args':['--no-sandbox']}
        if os.environ.get('CHROMIUM_PATH'):opts['executable_path']=os.environ['CHROMIUM_PATH']
        b=p.chromium.launch(**opts)
        for w,h in [(1366,900),(390,844)]:run(b,w,h)
        b.close()
except Exception as e:report['errors'].append(str(e));raise
finally:
    server.terminate();(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(report,ensure_ascii=False),flush=True)
