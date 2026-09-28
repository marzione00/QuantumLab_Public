import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {JSDOM,VirtualConsole} from 'jsdom';
import {fresnelScreen} from '../../src/lib/diffraction.ts';

// Independent values: scipy.special.fresnel, 64-node Gauss–Legendre
// quadrature over the full rectangular detector, including outside the crop.
// Coordinates and units are explicit so changing a grid cannot move a fixture.
const base={slits:1,coherent:true,spacing:4000,phase:0,aperture:2000,wavelength:550,distance:1,visibility:1,span:1,resolution:.5};
const references=[
 {options:base,n:6400,tolerance:2e-10,points:[[0,-.99984375,.2882219493658211],[3199,-.00015625,.972149233460202],[6399,.99984375,.2882219493658211]],bins:[[0,.00040211252092311415],[399,.0013521529356357207],[799,.00040211252092311415]]},
 {options:{...base,aperture:1000,span:150,resolution:.08},n:8800,tolerance:3e-5,points:[[0,-149.98295454545453,.000001634847958342611],[4399,-.017045454545467464,1.500514536641584],[8799,149.9829545454545,.0000016348479583463964]],bins:[[0,.000000599732186673959],[398,.06561798793574872],[399,.37682767513439425],[400,.3768276751344157],[401,.06561798793575385],[799,.0000005997321866742355]]},
 {options:{...base,aperture:8000,spacing:16000,span:7,resolution:.16},n:6400,tolerance:5e-8,points:[[0,-6.99890625,.0016303698848464604],[3199,-.00109375,.9956091184366211],[6399,6.99890625,.0016303698848464455]],bins:[[0,.000003731082563591458],[399,.0021825241220571846],[799,.0000037310825635914358]]}
];
let checks=0;
const near=(a,b,t=1e-10)=>{assert.ok(Math.abs(a-b)<=t,`${a} != ${b}; tolerance ${t}`);checks++;};
const sum=xs=>xs.reduce((s,x)=>s+x,0);
const bin=d=>Array.from({length:800},(_,i)=>sum(d.probabilities.slice(i*d.samplesPerBin,(i+1)*d.samplesPerBin)));
for(const {options,n,tolerance,points,bins} of references){
 const d=fresnelScreen(options),p=bin(d);
 assert.equal(d.ys.length,n);assert.equal(p.length,800);
 assert.equal(d.effectiveResolution,options.resolution);assert.equal(d.requestedResolution,options.resolution);
 assert.equal(d.detectorIntegration,'cubic-exact-support');checks+=5;
 for(const [i,y,I] of points){near(d.ys[i],y,1e-10);near(d.intensity[i],I,tolerance);}
 for(const [i,probability] of bins)near(p[i],probability,options.span===150?4e-6:1e-9);
 near(sum(p),1);assert.ok(d.probabilities.every(p=>p>=0));assert.ok(d.cdf.every((v,j)=>!j||v>=d.cdf[j-1]));assert.equal(d.cdf.at(-1),1);checks+=3;
 const refined=fresnelScreen({...options,samplesPerFringe:64}),q=bin(refined);
 // The 800 displayed bins retain midpoint integration of internal samples;
 // this bounds its finite-grid error separately from the detector reference.
 assert.ok(sum(p.map((v,j)=>Math.abs(v-q[j])))<1e-3);checks++;
}
// Same physical position with different crops: the wide-grid detector still
// averages both sides of the small crop boundary.
const narrow=fresnelScreen(base),wide=fresnelScreen({...base,span:3});
for(const j of [0,300,3000,6399]){const k=(j+6399)/3;near(narrow.ys[j],wide.ys[k]);near(narrow.intensity[j],wide.intensity[k],2e-10);}
near(narrow.geometry.at(-1),.5003125,1e-12);
assert.ok(Math.abs(narrow.detectedCapturedFraction-narrow.capturedFraction)>.001);checks++;
const farApart=fresnelScreen({...base,slits:2,aperture:10,spacing:20000,wavelength:400,distance:.5,span:40,resolution:0});
near(farApart.fresnelNumber,.0005);near(farApart.totalFresnelNumber,2002.0005,1e-9);
const thin=fresnelScreen({...base,aperture:20,span:70,resolution:0});
near(thin.capturedFraction,.9605951157653451);near(thin.detectedCapturedFraction,thin.capturedFraction);

// Exercise the actual React controls and CSV serializer in memory. Canvas is
// deliberately unavailable here; this test does not claim visual/browser QA.
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
const dom=new JSDOM('<div id="root"></div>',{runScripts:'outside-only',pretendToBeVisual:true,url:'https://detector.invalid',virtualConsole:vc});
const w=dom.window;w.HTMLCanvasElement.prototype.getContext=()=>null;w.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};
const blobs=[];w.URL.createObjectURL=blob=>{blobs.push(blob);return 'blob:detector';};w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){};
const compiled=await build({stdin:{contents:"import React from 'react';import {createRoot} from 'react-dom/client';import {LabSlitsLarge} from './src/components/lab-slits';createRoot(document.getElementById('root')).render(<LabSlitsLarge/>);",resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,platform:'browser',format:'iife',jsx:'automatic',logLevel:'silent'});
w.eval(compiled.outputFiles[0].text);
const tick=()=>new Promise(resolve=>setTimeout(resolve,25));await tick();await tick();
const click=async text=>{const button=[...w.document.querySelectorAll('button')].find(b=>b.textContent.trim()===text);assert.ok(button,`Button ${text}`);button.click();await tick();checks++;};
const slider=label=>[...w.document.querySelectorAll('[role="slider"]')].find(s=>w.document.getElementById(s.getAttribute('aria-labelledby'))?.textContent===label);
const key=async(label,value)=>{const control=slider(label);assert.ok(control,`Slider ${label}`);control.dispatchEvent(new w.KeyboardEvent('keydown',{key:value,bubbles:true}));await tick();checks++;};
const csv=async()=>{await click('Esporta dati');const content=await new Promise((resolve,reject)=>{const reader=new w.FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsText(blobs.at(-1));});return String(content).trim().split('\n').map(line=>line.replace(/^\uFEFF/,'').split(';').map(field=>field.replace(/^"|"$/g,'')));};
await click('Limite geometrico');await click('+100');await click('Conserva questo profilo');
await key('Risoluzione del rivelatore','Home');
assert.match(w.document.querySelector('.status-note').textContent,/risoluzione richiesta 0\.16 mm · supporto applicato 0\.16 mm/);checks++;
await click('Regime intermedio');await key('Semilarghezza dello schermo','End');
for(let j=0;j<8;j++)await key('Risoluzione del rivelatore','ArrowRight');
let rows=await csv();const header=rows[0],field=(name,row=rows[1])=>row[header.indexOf(name)];
assert.equal(rows.length,801);assert.ok(rows.every(row=>row.length===header.length));
near(Number(field('risoluzione_mm')),.08);near(Number(field('risoluzione_effettiva_mm')),.08);near(Number(field('passo_campionamento_mm')),300/8800);
assert.equal(field('integrazione_rivelatore'),'cubic-exact-support');assert.equal(Number(field('campioni_per_intervallo')),11);
near(sum(rows.slice(1).map(row=>Number(field('previsione',row)))),1);checks+=4;
const two=[...w.document.querySelectorAll('[role="tab"]')].find(t=>t.textContent==='Due');assert.ok(two);two.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));await tick();
await key('Larghezza delle fenditure','Home');await key('Separazione delle fenditure','End');await key('Lunghezza d’onda','Home');await key('Distanza dello schermo','Home');
assert.match(w.document.querySelector('.stats-strip').textContent,/Fuori dal regime di Fraunhofer/);
assert.doesNotMatch(w.document.querySelector('.stats-strip').textContent,/Diffrazione di campo lontano/);checks+=2;
rows=await csv();near(Number(field('F_singola')),.0005);near(Number(field('F_estensione')),2002.0005,1e-9);
assert.ok(Number(field('frazione_finestra_fisica'))>0);assert.ok(Number(field('frazione_finestra_rivelatore'))>0);assert.deepEqual(errors,[]);checks+=3;
dom.window.close();
console.log(JSON.stringify({status:'PASS',checks,regressions:['V01 full detector support at crop edges','V02 exact positive resolution and CSV discretization','V03 individual and total Fresnel numbers','V09 retained profile resolution and captured fractions'],reference:'SciPy 1.17.0 Fresnel and 64-node Gauss–Legendre fixtures',interactionScope:'React keyboard events and actual CSV serialization in jsdom; no Canvas, CSS layout or real browser validation'}));
