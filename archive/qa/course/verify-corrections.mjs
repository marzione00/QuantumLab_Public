// Regression checks for scientific and pedagogical defects found in the course audit.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {build} from 'esbuild';
const require=createRequire(import.meta.url),root=process.cwd(),target=path.join(root,'qa/course/corrections.cjs');
await build({stdin:{contents:`export * as M from './src/course/math/core';export {TensorDemo,SpectrumDemo} from './src/course/demos/algebra-advanced';export {FrequencyDemo,EventsDemo} from './src/course/demos/probability';export {UnitaryDemo,BornDemo} from './src/course/demos/quantum';export {LabDiagnosis} from './src/components/lab-diagnosis';`,resolveDir:root,loader:'tsx'},bundle:true,platform:'node',format:'cjs',jsx:'automatic',alias:{'@':path.join(root,'src')},external:['react','react-dom','react-dom/server','react/jsx-runtime'],outfile:target,logLevel:'silent'});
const {M,...D}=require(target),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');let checks=0;
const close=(a,b,tol=1e-10)=>{assert.ok(Math.abs(a-b)<=tol,`${a} ≠ ${b}`);checks++;};
for(const magnitude of [1,1e-6,1e-11,1e-40,1e-150]){
 for(const raw of [[[0,1],[1,0]],[[1,0],[0,-1]],[[2,1],[1,2]]]){
  const A=M.real(raw.map(r=>r.map(x=>x*magnitude))),e=M.eigenHermitian(A);assert.equal(e.degenerate,false);checks++;
  for(let i=0;i<2;i++){close(M.norm2(e.vectors[i]),1);const lhs=M.mv(A,e.vectors[i]),rhs=M.vscale(e.vectors[i],M.z(e.values[i]));for(let j=0;j<2;j++){close(lhs[j][0]/magnitude,rhs[j][0]/magnitude);close(lhs[j][1]/magnitude,rhs[j][1]/magnitude);}}
 }
}
for(const n of [1,2,20,1000,10000])for(const p of [0,.5,1])for(const zoom of [false,true]){
 const l=M.frequencyBins(n,p,zoom);assert.ok(l.axisHigh>l.axisLow);checks++;
 for(const bin of l.bins){const recovered=(l.axisLow+(bin.x-65)/705*(l.axisHigh-l.axisLow))*n;close(recovered,(bin.start+bin.end)/2,1e-8);assert.ok(bin.right>bin.left);checks++;}
}
assert.equal(M.eventSet([false,false]),'∅');assert.equal(M.eventSet([true,false]),'{1}');checks+=2;
assert.ok(M.rref(M.eye(2)).operations.every(x=>!x.endsWith('per 1.')));checks++;
// Server-render components at multiple allowed UI states; this is not a browser interaction test.
function render(Component,states=[]){const original=React.useState;let i=0;React.useState=(initial)=>original(i<states.length?states[i++]:typeof initial==='function'?initial():initial);try{return renderToStaticMarkup(React.createElement(Component));}finally{React.useState=original;}}
const z=M.z,a=[z(1),z(2)],b=[z(3),z(4)];
const before=render(D.TensorDemo,[a,b,'I','I',0]),after=render(D.TensorDemo,[a,b,'X','Z',0]);
const tensorFigure=html=>html.match(/class="complex-planes tensor-comparison"[\s\S]*?(?=<div class="geo-caption")/)[0];assert.notEqual(tensorFigure(before),tensorFigure(after));assert.ok(after.includes('d00'));checks+=2;
const A=render(D.SpectrumDemo,[2,1,2,[2,1],30,'A',.25]),square=render(D.SpectrumDemo,[2,1,2,[2,1],30,'square',.25]);
const resultFigure=html=>html.match(/aria-label="La funzione della matrice agisce sul vettore"[\s\S]*?<\/svg>/)[0];assert.notEqual(resultFigure(A),resultFigure(square));checks++;
const one=render(D.FrequencyDemo,[1,.5,0,false,2026,[0,0]]);assert.match(one,/Frequenza dei successi K\/N/);assert.ok(!/NaN|Infinity/.test(one));checks+=2;
const pole=render(D.FrequencyDemo,[1,1,1,true,2026,[0,0]]);assert.match(pole,/fill="var\(--mq-violet\)"/);assert.ok(!/NaN|Infinity/.test(pole));checks+=2;
const empty=render(D.EventsDemo,[[1,1,1,1,1,1],Array(6).fill(false),Array(6).fill(false)]);assert.ok(empty.includes('A = ∅'));assert.ok(!empty.includes('{∅}'));checks+=2;
const circuit=render(D.UnitaryDemo);assert.match(circuit,/σₙ=nₓX/);assert.match(circuit,/tratteggio corallo/);assert.match(circuit,/>Y<\/text>/);checks+=3;
const born=render(D.BornDemo);assert.match(born,/mezzo angolo/);assert.match(born,/β=/);checks+=2;
const diagnosis=render(D.LabDiagnosis);assert.ok(!diagnosis.includes('Previsione da annotare'));assert.ok(!diagnosis.includes('Esamina i modelli'));assert.ok(diagnosis.includes('Apparato 1: interferometro'));checks+=3;
const palette=JSON.parse(fs.readFileSync('src/course/matrix-palette.json','utf8'));const luminance=color=>[1,3,5].map(i=>parseInt(color.slice(i,i+2),16)/255).reduce((s,x,i)=>s+[.2126,.7152,.0722][i]*(x<=.04045?x/12.92:((x+.055)/1.055)**2.4),0);for(const mode of ['screen','print'])for(const foreground of ['text','muted','green','blue','violet','coral','amber'])for(const background of ['bg','panel','surface','raised']){const a=luminance(palette[mode][foreground]),b=luminance(palette[mode][background]);assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,mode+' '+foreground+' on '+background);checks++;}
const report={status:'PASS',checks,coverage:['small Hermitian matrices','histogram positions and endpoint states','empty event notation','nontrivial row operations','tensor and spectral result figures','measurement angle and rotation axes','demonstration without quizzes','contrast'],serverRenderedStateVariants:10,browserInteractionTested:false};fs.writeFileSync('qa/course/corrections-results.json',JSON.stringify(report,null,2)+'\n');fs.unlinkSync(target);console.log(JSON.stringify(report));
