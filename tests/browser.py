"""Real HTTP + Chromium regression. CSP is never removed or rewritten.
The local server emulates a GitHub Pages project subpath, not github.com itself.
"""
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
import json, os, shutil, contextlib, subprocess
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]; DIST=ROOT/'dist'; OUT=ROOT/'qa/screenshots'; OUT.mkdir(parents=True,exist_ok=True)
DOWNLOADS=ROOT/'qa/downloads';DOWNLOADS.mkdir(exist_ok=True)
PREFIX='/QuantumLab_Repository_Separata/'
INLINE=os.environ.get('QL_BROWSER_MODE')=='inline'
INLINE_FILE=ROOT/'qa/browser-inline.html'
if INLINE: subprocess.run(['node','scripts/standalone.mjs',str(INLINE_FILE)],cwd=ROOT,check=True)
DATA=json.loads((ROOT/'content/catalogue.json').read_text()); checks=0; errors=[]; misses=[]; requests=[]; console_errors=[]
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw): super().__init__(*a,directory=str(DIST),**kw)
 def do_GET(self):
  if self.path.startswith(PREFIX): self.path='/'+self.path[len(PREFIX):]
  return super().do_GET()
 def log_message(self,*args): pass
server=ThreadingHTTPServer(('127.0.0.1',0),Handler);Thread(target=server.serve_forever,daemon=True).start()
BASE=f'http://127.0.0.1:{server.server_port}'+PREFIX

def check(condition,message):
 global checks
 checks+=1
 if not condition: raise AssertionError(message+'; JS errors: '+str(errors))
def route(page,hashvalue,selector=None):
 page.evaluate('(h)=>location.hash=h',hashvalue)
 if selector:page.wait_for_selector(selector,state='attached',timeout=15000)
 else:page.wait_for_timeout(90)
def activity_url(a):return f"#modulo-{a['module']}/{a['slug']}"

def launch(pw):
 kwargs={'headless':True,'args':['--no-sandbox']}
 exe=os.environ.get('CHROMIUM_EXECUTABLE') or shutil.which('chromium')
 if exe:kwargs['executable_path']=exe
 return pw.chromium.launch(**kwargs)
try:
 with sync_playwright() as pw:
  browser=launch(pw);page=browser.new_page(viewport={'width':1600,'height':1050},device_scale_factor=1)
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('request',lambda r:requests.append(r.url))
  page.on('response',lambda r:misses.append(r.url) if r.status>=400 else None)
  page.on('console',lambda m:console_errors.append(m.text) if m.type=='error' else None)
  if INLINE: page.set_content(INLINE_FILE.read_text(),wait_until='networkidle')
  else: page.goto(BASE,wait_until='networkidle')
  check(page.locator('.ql-module-card').count()==7,'7 modules rendered in browser')
  check('5.1.0' in page.locator('.ql-lab-home').inner_text(),'version aligned')
  check(page.locator('meta[http-equiv="Content-Security-Policy"]').count()==1,'actual CSP retained')
  check(page.locator('#ql-ambient[aria-hidden="true"] canvas').count()==2,'two decorative, inaccessible canvases')
  state=page.evaluate('QuantumAmbient.getState()');check(state['running'] and state['effectiveMode']=='animated','ambient running on desktop')
  page.wait_for_timeout(500);check(page.evaluate('QuantumAmbient.getState().drawCount')>state['drawCount'],'animation advances')
  # Initial screen and all new activities must not eagerly load the historical bundle.
  if not INLINE: check(not any('legacy-runtime' in r for r in requests),'legacy runtime initially lazy')
  page.screenshot(path=str(OUT/'01-home-desktop.png'),full_page=False)
  page.locator('#ql-effects').click();check(page.locator('#ql-effects-dialog').is_visible(),'effects dialog opens')
  page.locator('input[name=ql-ambient-mode][value=static]').check();page.wait_for_timeout(100)
  count=page.evaluate('QuantumAmbient.getState().drawCount');page.wait_for_timeout(250)
  check(page.evaluate('QuantumAmbient.getState().drawCount')==count,'static mode stops drawing')
  page.keyboard.press('Escape');check(not page.locator('#ql-effects-dialog').is_visible(),'escape closes dialog')
  check(page.locator('#ql-effects').evaluate('(el)=>el===document.activeElement'),'focus restored to effects button')
  if not INLINE:
   page.reload(wait_until='networkidle');check(page.evaluate('QuantumAmbient.getState().effectiveMode')=='static','effect preference persists')
  page.evaluate("QuantumAmbient.setMode('animated')");page.emulate_media(reduced_motion='reduce');page.wait_for_timeout(100)
  check(page.evaluate('QuantumAmbient.getState().effectiveMode')=='static','reduced motion wins over animated preference')
  check(not page.evaluate('QuantumAmbient.getState().running'),'reduced motion stops animation loop')
  page.locator('#ql-effects').click();check(page.locator('[value=animated][name=ql-ambient-mode]').is_disabled(),'no forced animation with reduced motion')
  page.keyboard.press('Escape');page.emulate_media(reduced_motion='no-preference')
  page.evaluate("QuantumAmbient.setMode('off')");check(page.locator('#ql-ambient').is_hidden(),'effects can be fully disabled')
  page.evaluate("QuantumAmbient.setMode('animated')")
  page.locator('#ql-search').fill('Simon');check(page.locator('.ql-result').count()>0,'search Simon');page.locator('#ql-search').fill('nonesiste999');check(page.locator('.ql-result').count()==0,'empty search')
  for m in DATA['modules']:
   route(page,'#modulo-'+str(m['id']),'.ql-activity-list');check(page.locator('.ql-activity-card').count()==len(m['activities']),'module activity count')
  for a in [a for a in DATA['activities'] if a['kind']=='native']:
   route(page,activity_url(a),'.ql-native');check(page.locator('h1').inner_text()==a['title'],'native '+a['id']);check(page.locator('#ql-native-error').inner_text()=='','native error empty')
  if not INLINE: check(not any('legacy-runtime' in r for r in requests),'native activities retain lazy loading')
  for a in [a for a in DATA['activities'] if a['kind']=='legacy']:
   route(page,activity_url(a),'#ql-legacy');page.wait_for_function("document.querySelector('#ql-legacy')?.children.length>0")
   check(page.locator('h1').first.inner_text()==a['title'],'legacy '+a['id']);check(bool(page.locator('#ql-legacy').inner_text().strip()),'legacy content '+a['id'])
  for alias in ['moto','capitolo-1/polarizzazione','capitolo-2/tensore','capitolo-3/deutsch','capitolo-4/simon','capitolo-4/shor-21','capitolo-4/grover']:
   route(page,'#'+alias,'#ql-legacy');expected=next(a for a in DATA['activities'] if a['id']==DATA['aliases'][alias]);check(page.locator('h1').first.inner_text()==expected['title'],'alias '+alias)
  route(page,'#modulo-3/fase-guidata','.ql-native');page.locator('[data-preset=phase90]').click();page.locator('[data-action=measure-100]').click()
  check('100' in page.locator('.ql-distribution').inner_text(),'phase sampling')
  page.locator('[data-mode-button=math]').click();check(page.locator('.ql-calculation').is_visible(),'calculations open');check(page.locator('[data-control=phi][type=number]').input_value()=='90','configuration retained in math')
  page.locator('[data-mode-button=explore]').click();check(page.locator('[data-control=phi][type=number]').input_value()=='90','configuration retained in exploration')
  with page.expect_download() as download:page.locator('[data-action=export]').click()
  saved=DOWNLOADS/'phase.json';download.value.save_as(str(saved));result=json.loads(saved.read_text());check(result['parameters']['phi']==90 and result['shots']==100,'export includes current numerical data')
  page.locator('[data-action=reset]').click();page.locator('#ql-import-file').set_input_files(str(saved));page.wait_for_timeout(100);check(page.locator('[data-control=phi][type=number]').input_value()=='90','reimport computes same configuration')
  bad=DOWNLOADS/'bad.json';bad.write_text('{"format":1,"application":"tm-quantum-lab","activity":"fase-guidata","parameters":{"phi":"<script>bad</script>"}}');page.locator('#ql-import-file').set_input_files(str(bad));page.wait_for_timeout(100);check(bool(page.locator('#ql-native-error').inner_text()),'invalid input rejected');page.locator('[data-action=reset]').click()
  page.screenshot(path=str(OUT/'02-phase-desktop.png'),full_page=False)
  route(page,'#modulo-4/simon','#ql-legacy');page.locator('[data-mode-button=explore]').click();page.wait_for_timeout(200)
  for name in ['Calcola l’esperimento','Esegui una misura','Esegui 20 misure']:
   page.get_by_role('button',name=name,exact=True).click();page.wait_for_timeout(60)
  check('Misure raccolte: 21' in page.locator('#ql-legacy').inner_text(),'historical Simon calculates and samples')
  page.locator('[data-mode-button=math]').click();page.locator('[data-mode-button=explore]').click();check('Misure raccolte: 21' in page.locator('#ql-legacy').inner_text(),'historical experiment state retained')
  route(page,'#modulo-7/bb84','.ql-native');check(not page.locator('[data-control=privateView]').is_checked(),'private protocol data hidden by default')
  for _ in range(3):page.locator('[data-action=next-stage]').click()
  check('Non è stata generata una chiave sicura.' in page.locator('.ql-native').inner_text(),'BB84 limitations retained')
  for width in [1920,1440,1200,1199,1024,720,390,320]:
   page.set_viewport_size({'width':width,'height':900})
   for value in ['#indice','#modulo-7','#modulo-3/fase-guidata','#modulo-7/bb84','#modulo-7/superdensa','#modulo-7/correzione','#modulo-6/grover-guidato','#modulo-4/simon','#licenza']:
    route(page,value);check(page.evaluate('document.documentElement.scrollWidth-innerWidth')<=2,f'no horizontal page overflow {width} {value}')
   if width>=1200:
    check(page.locator('.ql-rail-left').bounding_box()['width']>60,'visible lateral margins')
    bounds=page.locator('#ql-main').bounding_box();rail=page.locator('.ql-rail-right').bounding_box();check(bounds['x']+bounds['width']<=rail['x']+2,'no ambient overlay on reading area')
   else:check(not page.evaluate('QuantumAmbient.getState().running'),'no animation on narrow display')
  page.set_viewport_size({'width':390,'height':844});route(page,'#indice')
  page.locator('#ql-menu').click();check(page.locator('#ql-menu').get_attribute('aria-expanded')=='true','mobile navigation opens');page.keyboard.press('Escape');check(page.locator('#ql-menu').get_attribute('aria-expanded')=='false','mobile navigation closes')
  route(page,'#modulo-7/superdensa','.ql-native');page.locator('#ql-theme').click();check(page.locator('html').get_attribute('data-theme')=='light','light mode');page.screenshot(path=str(OUT/'03-superdense-mobile-light.png'),full_page=True)
  page.locator('#ql-effects').click();check(page.locator('#ql-effects-dialog').is_visible(),'effects controls usable on mobile');check(page.evaluate('document.documentElement.scrollWidth-innerWidth')<=2,'dialog no mobile overflow');page.keyboard.press('Escape')
  route(page,'#licenza');check('CC BY-SA 4.0' in page.locator('#ql-main').inner_text(),'visible license');check(page.locator('#ql-main a[rel~=license]').count()==1,'license relationship')
  route(page,'#informazioni');check('decorativa' in page.locator('#ql-main').inner_text(),'decoration explicitly distinguished from model')
  route(page,'#not-a-route');check('Attività non trovata' in page.locator('h1').inner_text(),'invalid route handled')
  # Root deployment uses exactly the same files and relative URLs.
  if not INLINE:
   page.goto(BASE.replace(PREFIX,'/'),wait_until='networkidle');check(page.locator('.ql-module-card').count()==7,'root deployment also works')
  check(not errors,'no uncaught JavaScript errors');check(not misses,'no missing resources');check(not console_errors,'no CSP violations or console errors')
  external=[u for u in requests if not u.startswith(f'http://127.0.0.1:{server.server_port}/')];check(not external,'no automatic external network requests')
  report={'status':'PASS','checks':checks,'activitiesMounted':87,'legacyActivities':81,'nativeActivities':6,'browser':browser.version,'viewportWidths':[1920,1600,1440,1200,1199,1024,720,390,320],'serving':('Monofile generated from the same build, Chromium set_content with actual inline-hash CSP. HTTP navigation blocked by environment policy; network serving, lazy loading and persistence reload not tested here.' if INLINE else 'Real local HTTP at root and project subpath; original CSP enabled. No request interception or content replacement.'),'projectSubpath':None if INLINE else PREFIX,'animation':['running desktop','static halts draw','off hides','preference selection' if INLINE else 'preference persists','prefers-reduced-motion respected','no animation below 1200px','modal escape + focus return'],'uncaughtErrors':errors,'missingAssets':misses,'consoleErrors':console_errors,'externalAutomaticRequests':external,'notClaimed':['GitHub account deployment','WCAG certification','learning outcomes','remote parent site availability']}
  (ROOT/('qa/browser-inline.json' if INLINE else 'qa/browser-http.json')).write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False,indent=2));browser.close()
finally:server.shutdown();server.server_close()
