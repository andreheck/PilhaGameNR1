"""Exercise the built game with isolated synthetic saves; no real player data."""
import json,os,socket,subprocess,sys,time
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'artifacts'/'living';OUT.mkdir(parents=True,exist_ok=True)
report={'viewports':[],'checks':[],'errors':[]}
def check(ok,label):
    if not ok:raise AssertionError(label)
    report['checks'].append(label)
def run(browser,w,h):
    tag=f'{w}x{h}';ctx=browser.new_context(viewport={'width':w,'height':h},reduced_motion='reduce',has_touch=w<900);page=ctx.new_page();errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    def snap(name):page.screenshot(path=str(OUT/f'{name}-{tag}.png'))
    def state():return page.evaluate('PilhaLiving.getState()')
    def positions():return page.evaluate('PilhaLiving.getEmployees().map(p=>[p.id,p.x,p.y])')
    def saved(expr):page.wait_for_function('()=>{const s=PilhaLiving.getState();return '+expr+';}')
    def menu():
        if not page.locator('.living-more').evaluate('(e)=>e.open'):page.locator('.living-more summary').click()
    def enter():
        page.locator('.pi-root').wait_for();check(page.locator('.pi-motion').count()==0,tag+': no animation toggle in opening')
        # Splash transitions automatically; clicking it races with the invite fade-in.
        page.locator('.pi-skip').wait_for(state='visible')
        page.locator('.pi-skip').click();page.locator('.living-guide[open]').wait_for();snap('guide')
        for _ in range(3):page.locator('[data-guide="next"]').click()
        page.locator('.continuous-gallery-dialog[open]').wait_for()
    try:
        page.goto('http://127.0.0.1:8768/',wait_until='domcontentloaded')
        page.locator('.pi-root').wait_for();snap('opening');enter()
        check(page.locator('[data-direct-pick]').count()==12,tag+': explanation then six selectable heroes')
        page.locator('.hero-xp-help summary').click()
        check('25 XP' in page.locator('.hero-xp-help').inner_text() and '150 XP' in page.locator('.hero-xp-help').inner_text(),tag+': XP sources and current mode limitation explained')
        page.locator('.hero-xp-help summary').click()
        page.locator('[data-direct-pick="PILHA-H01|principal"]').click()
        page.locator('[data-direct-pick="PILHA-H02|support"]').click()
        page.locator('[data-team-save]').click()
        page.locator('.hiring-dialog[open]').wait_for();snap('hiring-managers')
        check(page.locator('[data-hire-manager]').count()==16,tag+': all canonical NPC cards available for management')
        check(page.locator('[data-hiring-next]').is_disabled(),tag+': three managers required before continuing')
        for pid in ['NPC-02','NPC-09','NPC-05']:page.locator(f'[data-hire-manager="{pid}"]').click()
        page.locator('[data-hiring-next]').click();snap('hiring-employees')
        check(page.locator('[data-hire-employee]').count()==13,tag+': managers cannot be selected again as employees')
        for pid in ['NPC-04','NPC-14','NPC-06']:page.locator(f'[data-hire-employee="{pid}"]').click()
        page.locator('[data-hiring-next]').click();page.locator('.pm-canvas').wait_for();page.wait_for_timeout(700)
        check(len(page.evaluate('PilhaLiving.getEmployees()'))==6,tag+': initial team has exactly three managers and three employees')
        initial=state();check(initial['budget']==10000 and initial['initialHiring']['managers']['producao']=='NPC-09',tag+': chosen managers persist without spending starting capital');snap('initial-six')
        menu();page.locator('[data-company="staffing"]').click()
        check(page.locator('[data-canonical-hire]').count()==10,tag+': remaining ten canonical NPCs available with cards and hiring price')
        check('Contribuições:' in page.locator('.hiring-card').first.inner_text(),tag+': hiring shows personality and strengths')
        page.locator('[data-canonical-hire="NPC-01"]').click()
        saved('s.staff["NPC-01"].employment==="onboarding"')
        check(state()['budget']==9100,tag+': additional canonical hire charges admission once')
        page.locator('.continuous-modal [data-close]').click()
        # Separate legacy fixture: preserve the original full-workforce regression below.
        page.evaluate('()=>{const k="pilha-company-continuous-v2",s=JSON.parse(localStorage.getItem(k));delete s.initialHiring;delete s.staffing.canonicalHires;for(const p of Object.values(s.staff))p.employment="active";s.budget=10000;localStorage.setItem(k,JSON.stringify(s));PilhaLiving.syncClock();}')
        page.wait_for_function('PilhaLiving.getEmployees().length===16')
        check(page.locator('.living-topbar').count()==1,tag+': transparent header groups all controls')
        header=page.locator('.living-topbar').bounding_box();view=page.locator('.pm-view').bounding_box()
        check(view['y']>=header['y']+header['height']-1,tag+': map starts below complete header')
        check(header['height']<(130 if w>=900 else 170),tag+': compact header leaves map space')
        page.locator('.living-chrome-toggle').click();check(page.locator('.living-topbar').bounding_box()['height']<45,tag+': player can collapse chrome to sector strip');snap('collapsed-chrome')
        page.locator('.living-chrome-toggle').click()
        check(page.locator('.living-topbar .living-clock-holder [data-company="calendar"]').count()==1,tag+': calendar remains in header')
        check(len(page.evaluate('PilhaLiving.getEmployees()'))==16,tag+': sixteen employees rendered')

        # Actual approved furniture sprites and Poof atlas must be served as image bytes.
        furniture=page.evaluate("""async () => {
          const base='/assets/furniture/sprites/webp/';
          const ids=['sofa-azul','poltrona-azul-a','poltrona-azul-b','mesa-centro-redonda','mesa-escritorio','mesa-reuniao','estante-livros','gaveteiro','bebedouro','planta-grande','planta-pequena','divisoria-vidro','tapete-almofadas','puff-azul','banco-lounge','arvore-frutifera','pilha-livros','quadro','caixa-material','armario-baixo'];
          const images=await Promise.all(ids.map(async id => {const i=new Image();i.src=base+id+'.webp';try{await i.decode();return i.naturalWidth>0&&i.naturalHeight>0}catch{return false}}));
          const poof=new Image();poof.src='/assets/furniture/effects/poof_atlas_4x3.png';try{await poof.decode()}catch{}
          return {count:images.filter(Boolean).length,atlas:poof.naturalWidth===1024&&poof.naturalHeight===768};
        }""")
        check(furniture['count']==20,tag+': all twenty approved WebP furnishings decode')
        page.wait_for_function('PilhaLiving.getFurniture()?.loaded===25')
        check(page.evaluate('PilhaLiving.getFurniture().assets')==25,tag+': all five new operation sprites loaded')
        check(page.evaluate('PilhaLiving.getFurniture().baseline')>20,tag+': approved art replaces baseline furnishings before any purchase')
        check(furniture['atlas'],tag+': twelve-frame Poof atlas is present')
        check(len(set(p[0] for p in positions()))==16,tag+': every identity unique')
        a=positions();page.wait_for_timeout(1000);check(a!=positions(),tag+': walking automatically despite reduced decorative motion')
        check(page.locator('.pm-canvas').bounding_box()['height']>200,tag+': map has usable height')
        frame=page.evaluate('PilhaLiving.getWorldFrame()')
        check(frame['left']>=0 and frame['top']>=0 and frame['right']<=frame['width'] and frame['bottom']<=frame['height'],tag+': all four rooms fit fully inside map viewport')
        layout=page.locator('.pm-root').evaluate('(root)=>({width:root.clientWidth,scrollWidth:root.scrollWidth,offenders:[...root.querySelectorAll(".living-topbar,.living-topbar *")].filter(e=>e.scrollWidth>e.clientWidth+2||e.getBoundingClientRect().right>root.clientWidth+2).map(e=>({class:e.className,width:e.clientWidth,scrollWidth:e.scrollWidth,right:e.getBoundingClientRect().right,overflow:getComputedStyle(e).overflowX})).slice(0,25)})')
        print(json.dumps({'viewport':tag,'layout':layout}),flush=True)
        check(layout['scrollWidth']<=layout['width']+2,tag+': map without horizontal overflow')
        check(page.locator('[data-company="event"]').is_hidden(),tag+': catalogue absent from main map')
        digits=page.locator('.living-time-digits').inner_text();page.wait_for_timeout(1200)
        check(page.locator('.living-time-digits').inner_text()!=digits,tag+': visible simulated clock advances');snap('map')
        page.locator('[data-company="pause"]').click();saved('s.paused===true')
        a=positions();t=state()['activeMs'];page.wait_for_timeout(1400)
        check(positions()==a and state()['activeMs']==t,tag+': manual pause freezes movement and simulated time')
        page.locator('[data-company="calendar"]').click();snap('calendar')
        check(page.locator('.calendar-day.is-today').count()==1,tag+': simulated date highlighted')
        title=page.locator('.calendar-controls h2').inner_text();page.locator('[data-cal="next"]').click()
        check(page.locator('.calendar-controls h2').inner_text()!=title,tag+': calendar month navigation works')
        page.locator('[data-cal="today"]').click();check(page.locator('.calendar-controls h2').inner_text()==title,tag+': return to current simulated date')
        page.locator('.living-calendar [data-world-close]').click()
        menu();page.locator('[data-company="employees"]').click()
        health=page.locator('.employee-row').evaluate_all('(rs)=>rs.map(r=>Number(r.dataset.health))')
        check(len(health)==16 and health==sorted(health,reverse=True),tag+': compact employee list ordered by health');snap('employees')
        page.locator('[data-employee="NPC-04"]').click()
        check('Raimunda' in page.locator('.employee-profile-head').inner_text(),tag+': employee details reflect matching identity');snap('profile')
        check(page.locator('.employee-profile-head h2').evaluate('(e)=>e===document.activeElement'),tag+': profile heading receives focus')
        page.keyboard.press('Tab')
        check(page.locator('[data-employee-locate]').evaluate('(e)=>e===document.activeElement'),tag+': keyboard reaches locate action')
        page.keyboard.press('Shift+Tab');page.keyboard.press('Enter')
        check(page.locator('[data-employee="NPC-04"]').evaluate('(e)=>e===document.activeElement'),tag+': keyboard back returns to matching worker')
        page.keyboard.press('Enter')

        # Phase1: all identities and canonical narrative fields, in both target viewports.
        catalog=json.loads((ROOT/'data/npcs/catalogo-v1.json').read_text(encoding='utf-8'))['npcs']
        colors={'NPC-04':'roxa','NPC-05':'verde','NPC-11':'azul','NPC-14':'camila','NPC-16':'amarela'}
        for person in catalog:
            pid=person['id'];page.locator('[data-employee-list]').click();page.locator(f'[data-employee="{pid}"]').click()
            page.wait_for_function('()=>{const i=document.querySelector(".employee-profile-head img[data-npc-art]");return i&&i.complete&&i.naturalWidth>0;}')
            portrait=page.locator('.employee-profile-head .employee-avatar--art')
            check(portrait.get_attribute('data-npc-id')==pid,tag+': portrait identity '+pid)
            check(person['nome'] in page.locator('.employee-profile-head h2').inner_text(),tag+': profile name '+pid)
            check(portrait.locator('img').evaluate('(i)=>getComputedStyle(i).objectFit')=='contain',tag+': full portrait without cover crop '+pid)
            traits=page.locator('.employee-traits').inner_text()
            check('não determina saúde' in traits,tag+': narrative disclaimer '+pid)
            if int(pid[-2:])>=9:
                check('referência canônica' in traits and person['forcas'][0] in traits,tag+': completed editorial narrative '+pid)
                check(' anos' not in page.locator('.employee-profile-head').inner_text(),tag+': missing age stays absent '+pid)
            else:
                check(bool(person.get('forcas')) and person['forcas'][0] in traits,tag+': canonical strengths '+pid)
            if pid in colors:snap('ficha-'+colors[pid])
        page.locator('[data-employee-list]').click();page.locator('[data-employee="NPC-04"]').click()
        original=page.locator('.employee-profile-head img[data-npc-art]').get_attribute('src')
        before_fallback=state()
        page.locator('.employee-profile-head img[data-npc-art]').evaluate('(i)=>{i.src="/assets/npcs/qa-intentional-404.png";}')
        page.locator('.employee-profile-head .is-missing').wait_for()
        check(page.locator('.employee-avatar-fallback svg').get_attribute('aria-label')=='Raimunda',tag+': 404 fallback keeps the same person')
        check(page.locator('.employee-avatar-fallback').is_visible(),tag+': same-person SVG fallback visible');snap('fallback-raimunda')
        page.locator('.employee-profile-head img[data-npc-art]').evaluate('(i,src)=>{i.src=src;}',original)
        page.wait_for_function('()=>{const a=document.querySelector(".employee-profile-head .employee-avatar--art"),i=a.querySelector("img");return !a.classList.contains("is-missing")&&i.complete&&i.naturalWidth>0;}')
        check(state()['budget']==before_fallback['budget'] and state()['staff']==before_fallback['staff'],tag+': fallback and recovery do not change state')
        page.locator('[data-employee-locate]').click();page.wait_for_timeout(400)
        people=page.evaluate('PilhaLiving.getEmployees()');canvas=page.locator('.pm-canvas').bounding_box()
        found=next((p for p in people if p['id']=='NPC-04'),None)
        check(bool(found),tag+': locate preserves selected worker')
        check(abs(found['screen']['x']-canvas['width']/2)<canvas['width']*.28 and abs(found['screen']['y']-canvas['height']/2)<canvas['height']*.28,tag+': locate frames selected worker in map center')
        page.mouse.click(canvas['x']+found['screen']['x'],canvas['y']+found['screen']['y'])
        page.locator('.employees-dialog[open]').wait_for()
        check('Raimunda' in page.locator('.employee-profile-head').inner_text(),tag+': clicking walking NPC opens its own health profile')
        page.locator('[data-employee-close]').click()
        before=state();menu();world_button=page.locator('[data-company="world"]')
        if w<900:world_button.tap()
        else:world_button.click()
        snap('world')
        page.locator('[data-world-tab="personagens"]').click()
        check(page.locator('.world-heroes button').count()==6,tag+': world contains all six heroes')
        check(page.locator('.world-staff button').count()==16,tag+': world contains all sixteen NPCs')
        check(page.locator('.world-specials article').count()==2,tag+': special mentors remain a separate category')
        page.wait_for_function('()=>Array.from(document.querySelectorAll(".world-heroes img")).every(i=>i.complete&&i.naturalWidth>0)')
        check(page.locator('.world-heroes img').evaluate_all('(is)=>is.every(i=>i.complete&&i.naturalWidth>0)'),tag+': canonical hero artwork loaded')
        # Lazy portraits outside the mobile scrollport load only when visited.
        for portrait_image in page.locator('.world-staff img[data-npc-art]').all():
            portrait_image.scroll_into_view_if_needed()
            portrait_image.evaluate('(i)=>i.decode()')
        page.locator('.world-staff button').first.scroll_into_view_if_needed()
        page.wait_for_function('()=>Array.from(document.querySelectorAll(".world-staff img[data-npc-art]")).length===16&&Array.from(document.querySelectorAll(".world-staff img[data-npc-art]")).every(i=>i.complete&&i.naturalWidth>0)')
        check(page.locator('.world-staff [data-npc-id]').count()==16,tag+': same16 portraits in world catalogue')
        check(page.locator('.world-staff [data-npc-id]').evaluate_all('(rows)=>rows.every(r=>{const b=r.getBoundingClientRect();return b.width>=30&&b.width<=60;})'),tag+': catalogue portraits compact without flex stretching')
        check(page.locator('.world-specials img').evaluate_all('(is)=>is.every(i=>!i.src.includes("/assets/npcs/"))'),tag+': Leticia of library remains a distinct special character')
        snap('characters');page.locator('[data-world-tab="organograma"]').click()
        check(page.locator('[data-org-id]').count()==16,tag+': organization lists16 staff once')
        check(page.locator('[data-org-hero]').count()==6,tag+': six administrative advisors')
        check(page.locator('.organization-manager button').count()==3,tag+': one manager per department')
        check(page.locator('[data-org-average]').count()==3,tag+': sector health averages visible')
        check('−5' in page.locator('.organization-rule-guide').inner_text() and '+7' in page.locator('.organization-rule-guide').inner_text(),tag+': both management rules explained')
        check(page.locator('.organization-influence .is-risk').count()==3,tag+': initial high-stress management risk visible')
        check(page.locator('.organization-departments').evaluate('(e)=>e.scrollWidth<=e.clientWidth+1'),tag+': responsive organization without overflow');snap('organization')
        page.locator('[data-org-id="NPC-11"]').click()
        check('Gerente de Produção' in page.locator('.employee-fields').inner_text(),tag+': job visible in linked profile')
        page.locator('[data-employee-close]').click();menu();page.locator('[data-company="world"]').click()
        page.locator('[data-world-tab="eventos"]').click()
        check(page.locator('.world-events details').count()==19,tag+': nineteen occurrences in read-only guide')
        page.locator('.world-events details').first.locator('summary').click()
        after=state();check(before['budget']==after['budget'] and before['receipts']==after['receipts'] and before['events']==after['events'],tag+': reading catalogue never spends or triggers events')
        page.locator('.living-world [data-world-close]').click()
        page.locator('[data-company="pause"]').click();saved('s.paused===false');a=positions();page.wait_for_timeout(1100)
        check(a!=positions(),tag+': resume restarts employees')
        audio=page.evaluate('PilhaLiving.audio()');check(audio['state']=='running' and audio['played']>0,tag+': WebAudio unlocked and tones scheduled after gestures')
        page.evaluate('()=>{const k="pilha-company-continuous-v2",s=JSON.parse(localStorage.getItem(k));s.lastWallMs-=240500;localStorage.setItem(k,JSON.stringify(s));}')
        page.evaluate('PilhaLiving.syncClock()');saved('s.week>=3')
        check(state()['events']['current']['stage']=='decision',tag+': background catch-up keeps pending decision unanswered')
        old=state()['week'];old_money=state()['budget'];old_finance=state()['finance'];page.locator('[data-company="advance"]').click();saved('s.week>'+str(old))
        check(abs(state()['budget']-(old_money+1000*(state()['week']-old)+state()['finance']['earned']-old_finance['earned']-state()['finance']['operationalCosts']+old_finance['operationalCosts']))<.02,tag+': weekly base500 plus two epic bonuses250 each deposited')
        check(state()['weeklyIncome']['lastPayment']['amount']==1000,tag+': weekly income receipt persisted')
        check('1.000,00' in page.locator('.continuous-income').inner_text(),tag+': weekly income visible in HUD')
        check(state()['events']['current']['pick'] is None,tag+': pending event does not freeze time or auto-pick')
        current=state()
        check(all(p.get('leadership',{}).get('week')==current['week'] for p in current['staff'].values()),tag+': weekly management effects persisted for all16')
        check(all(-5<=p['leadership']['delta']<=7 for p in current['staff'].values()),tag+': management health deltas bounded')
        menu();page.locator('[data-company="world"]').click();page.locator('[data-world-tab="organograma"]').click()
        check('semana '+str(current['week']) in page.locator('.organization-influence').first.inner_text(),tag+': organization shows actual applied week')
        page.evaluate('()=>{const k="pilha-company-continuous-v2",s=JSON.parse(localStorage.getItem(k));s.lastWallMs-=120500;localStorage.setItem(k,JSON.stringify(s));}')
        page.evaluate('PilhaLiving.syncClock()')
        page.wait_for_function('()=>document.querySelector(".organization-influence").textContent.includes("semana "+PilhaLiving.getState().week)')
        check(state()['week']>current['week'],tag+': live organization updates after a weekly tick')
        expected=sum(p['health'] for pid,p in state()['staff'].items() if pid in ['NPC-01','NPC-02','NPC-03','NPC-04','NPC-07','NPC-16'])/6
        check(abs(float(page.locator('[data-org-average="escritorio"]').inner_text())-expected)<.06,tag+': live sector health matches persisted data')

        page.locator('.living-world [data-world-close]').click()

        page.locator('[data-company="pause"]').click();saved('s.paused===true');money=state()['budget'];week=state()['week']
        page.reload(wait_until='domcontentloaded');enter();page.locator('[data-team-save]').click();page.locator('.pm-root').wait_for();page.wait_for_timeout(500)
        check(state()['paused'] and state()['week']==week and state()['budget']==money,tag+': reload preserves pause, week and balance')
        check(len(state()['staff'])==16,tag+': individual health persists')
        # Same-origin real second tab: shared storage and Web Locks must consume one week.
        if w==1366:
            other=ctx.new_page();other.goto('http://127.0.0.1:8768/',wait_until='domcontentloaded')
            other.locator('.pi-skip').wait_for(state='visible');other.locator('.pi-skip').click()
            for _ in range(3):other.locator('[data-guide="next"]').click()
            other.locator('[data-team-save]').click();other.locator('.pm-root').wait_for()
            old_week=state()['week'];old_budget=state()['budget'];old_total=state()['weeklyIncome']['total'];old_finance=state()['finance']
            page.evaluate('()=>{const k="pilha-company-continuous-v2",s=JSON.parse(localStorage.getItem(k));s.paused=false;s.lastWallMs=Date.now()-120500;localStorage.setItem(k,JSON.stringify(s));PilhaLiving.syncClock();}')
            other.evaluate('PilhaLiving.syncClock()')
            saved('s.week==='+str(old_week+1))
            check(abs(state()['budget']-(old_budget+1000+state()['finance']['earned']-old_finance['earned']-state()['finance']['operationalCosts']+old_finance['operationalCosts']))<.02 and state()['weeklyIncome']['total']==old_total+1000,tag+': two browser tabs deposit one weekly income')
            check(other.evaluate('PilhaLiving.getState().budget')==state()['budget'],tag+': both tabs share current budget')
            page.locator('[data-company="pause"]').click();saved('s.paused===true');other.close()

        # Presentation preserves the actual event transaction and supports free choices.
        page.evaluate("""async()=>{const M=await import('/simulation/company-continuous.js');const k=M.KEY,s=JSON.parse(localStorage.getItem(k));s.events.current=null;s.paused=true;s.week=Math.max(3,s.week);const r=M.startEvent(s,'clima','escritorio',{preview:true});if(!r.ok)throw Error(r.error);localStorage.setItem(k,JSON.stringify(r.state));await PilhaLiving.syncClock();}""")
        menu();page.locator('[data-company="event"]').click()
        page.locator('.event-presentation[open]').wait_for()
        check(page.locator('.event-option').count()==3,tag+': event layout presents all three existing choices')
        check('IMPACTO' in page.locator('.event-label').first.inner_text().upper(),tag+': impact hierarchy visible')
        check(page.locator('.event-chips .is-negative').count()>0,tag+': negative consequences visible before choosing')
        check(page.locator('.event-presentation').evaluate('(e)=>e.scrollWidth<=e.clientWidth+1'),tag+': event card fits viewport')
        snap('event-reference');page.locator('.event-presentation').screenshot(path=str(OUT/f'event-card-{tag}.png'))
        before_event=state()['budget'];page.locator('[data-event-choice="2"]').click();saved('s.events.current?.stage==="result"')
        check(state()['budget']==before_event and state()['events']['current']['stage']=='result',tag+': free choice keeps balance and stores consequence')
        snap('event-consequence');page.locator('[data-event-finish]').click();saved('s.events.current===null')
        check(state()['events']['current'] is None,tag+': continue resolves the event once')

        check(not errors,tag+': no uncaught browser exceptions')
        report['viewports'].append({'width':w,'height':h,'ok':True})
    except Exception:
        snap('FAILED');(OUT/f'FAILED-{tag}.html').write_text(page.content(),encoding='utf-8');report['errors'].extend(errors);raise
    finally:ctx.close()
server=subprocess.Popen([sys.executable,'-m','http.server','8768','--bind','127.0.0.1'],cwd=ROOT/'dist',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
    for _ in range(40):
        try:
            with socket.create_connection(('127.0.0.1',8768),.2):break
        except OSError:time.sleep(.1)
    with sync_playwright() as p:
        opts={'headless':True,'args':['--no-sandbox']}
        if os.environ.get('CHROMIUM_PATH'):opts['executable_path']=os.environ['CHROMIUM_PATH']
        b=p.chromium.launch(**opts)
        for w,h in [(320,844),(1366,900),(390,844),(844,390),(1440,900)]:run(b,w,h)
        b.close()
except Exception as e:report['errors'].append(str(e));raise
finally:
    server.terminate();(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(report,ensure_ascii=False),flush=True)
