import fs from 'node:fs';import assert from 'node:assert/strict';import {JSDOM,VirtualConsole} from 'jsdom';
const html=fs.readFileSync('dist/index.html','utf8'),errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!/CSS|navigation|Not implemented: HTMLCanvasElement|Not implemented: Window/.test(e.message))errors.push(e.message);});
const palette=JSON.parse(fs.readFileSync('src/course/matrix-palette.json','utf8')).screen;const testHTML=html.replace(/<style>[\s\S]*?<\/style>/g,'<style>*{'+Object.entries(palette).map(([k,v])=>'--mq-'+k+':'+v).join(';')+'}</style>');
const dom=new JSDOM(testHTML,{url:'https://lab.invalid/index.html',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});const {window:w}=dom;w.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};const blobs=[];w.URL.createObjectURL=blob=>{blobs.push(blob);return 'blob:lab-export';};w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){exports.push({href:this.href,download:this.download});};const exports=[];
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({canvas:this,createImageData:(a,b)=>({data:new Uint8ClampedArray(a*b*4)}),getImageData:(a,b,c,d)=>({data:new Uint8ClampedArray(c*d*4)}),measureText:s=>({width:String(s).length*8})},{get:(t,k)=>k in t?t[k]:()=>{}});};
w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
w.addEventListener('error',e=>errors.push(e.message));w.eval(html.match(/<script>([\s\S]*?)<\/script>/)[1]);let checks=0;const tick=()=>new Promise(r=>setTimeout(r,35));const click=async text=>{const b=[...w.document.querySelectorAll('button')].find(b=>b.textContent.trim()===text);assert.ok(b,'Button '+text);b.click();await tick();checks++;};const route=async hash=>{w.location.hash=hash;await tick();await tick();assert.ok(w.document.querySelector('h1'),hash+' :: '+JSON.stringify(errors));assert.ok(!/NaN|Infinity/.test(w.document.querySelector('main').textContent));checks++;};await tick();

const views=JSON.parse(fs.readFileSync('qa/course/views.json','utf8')).views.filter(v=>v.chapter>=3);
const openExperiment=async()=>{const d=w.document.querySelector('.algorithm-exploration');assert.ok(d);d.open=true;d.dispatchEvent(new w.Event('toggle'));await tick();};
for(const v of views){
 await route('#capitolo-'+v.chapter+'/'+v.id);await openExperiment();await click('Calcola l’esperimento');
 assert.ok(w.document.querySelector('.experiment-results'),'Result '+v.id);assert.ok(!w.document.querySelector('[role=alert]'),'No error '+v.id);
 assert.ok(w.document.querySelector('.experiment-results math'),'MathML '+v.id);checks+=3;
 const measure=[...w.document.querySelectorAll('button')].find(b=>b.textContent==='Esegui una misura');if(measure){measure.click();await tick();assert.match(w.document.querySelector('.measurement-panel').textContent,/Misure raccolte: 1/);checks++;}
 await click('Esporta configurazione e misure');
}
await route('#capitolo-4/simon');await openExperiment();await click('Calcola l’esperimento');await click('Esegui 20 misure');assert.match(w.document.querySelector('.simon-geometry').textContent,/Candidati non nulli: 1/);checks++;
await click('Azzera le misure');assert.match(w.document.querySelector('.simon-geometry').textContent,/Candidati non nulli: 7/);checks++;
const setter=Object.getOwnPropertyDescriptor(w.HTMLInputElement.prototype,'value').set;
const change=async(label,value)=>{const el=[...w.document.querySelectorAll('.experiment-fields label')].find(e=>e.textContent.startsWith(label)).querySelector('input');setter.call(el,value);el.dispatchEvent(new w.Event('input',{bubbles:true}));el.dispatchEvent(new w.Event('change',{bubbles:true}));await tick();};
await change('Segreto non nullo','8');assert.ok([...w.document.querySelectorAll('button')].find(b=>b.textContent==='Esegui una misura').disabled);await click('Calcola l’esperimento');assert.match(w.document.querySelector('[role=alert]').textContent,/segreto non nullo/);checks+=2;
await change('Segreto non nullo','3');await tick();await click('Calcola l’esperimento');await new Promise(r=>setTimeout(r,500));await click('Esegui 20 misure');await new Promise(r=>setTimeout(r,500));assert.equal(w.document.querySelectorAll('.simon-geometry').length,1);assert.match(w.document.querySelector('.simon-geometry').textContent,/Segreto ricavato dai vincoli: 011/);checks++;
await click('Ripristina l’esperimento');assert.ok(!w.document.querySelector('.experiment-results'));checks++;
await route('#capitolo-3/bell');await openExperiment();await click('Calcola l’esperimento');assert.match(w.document.querySelector('.reduced-states').textContent,/0,5/);checks++;
await click('Rimuovi');await click('Calcola l’esperimento');assert.equal(w.document.querySelectorAll('.experiment-results .book-circuit [role=button]').length,1);checks++;
assert.deepEqual(errors,[]);dom.window.close();const report={status:'PASS',checks,sections:views.length,exports:exports.length,scope:'React events and MathML/SVG DOM under jsdom; no CSS or browser layout validation.'};fs.writeFileSync('qa/course/experiment-dom-results.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
