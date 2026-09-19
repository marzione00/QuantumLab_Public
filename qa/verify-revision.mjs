import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {polarVector,operation,screenDistribution} from '../src/lib/physics.ts';
import {blochCoordinates,toView,rotateView,dragBlochPoint,fromBlochAngles} from '../src/lib/bloch-interaction.ts';
import {pairDistribution,configuredCircuit,probabilityH,decoheredPair,archivedRange,archiveAlternatives,diagnosticDistribution} from '../src/lib/quantum-experiments.ts';
import {ReversibleGas} from '../src/lib/reversible-gas.ts';
let checks=0;
const near=(a,b,e=1e-10)=>{assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);checks++;};
near(blochCoordinates(polarVector(-45)).phase,180);
near(blochCoordinates(operation(polarVector(-45),'P',-90)).phase,90);
assert.equal(blochCoordinates(polarVector(0)).hasPhase,false);checks++;
// Direct cursor displacement must have the same sign on both hemispheres.
for(const v of [[1,0,0],[-1,0,0],fromBlochAngles(63,-71)])for(const camera of [0,30,-60,120]){
 const before=toView(rotateView(v,camera));const dx=before[0]>0?-.025:.025,dy=before[1]>0?-.018:.018;
 const after=dragBlochPoint(v,dx,dy,camera),screen=toView(rotateView(after,camera));
 near(Math.hypot(...after),1);near(screen[0]-before[0],dx);near(screen[1]-before[1],dy);
 assert.equal(Math.sign(screen[2]),Math.sign(before[2]));checks++;
}
for(const [phase,expected] of [[0,1],[180,0],[-180,0],[90,.5],[-90,.5],[360,1],[-360,1]]){
 const blocks=[{gate:'H',phase:0,axis:0},{gate:'P',phase,axis:0},{gate:'H',phase:0,axis:0}];
 near(probabilityH(configuredCircuit(blocks,[0,0,1]).at(-1)),expected);
 near(probabilityH(configuredCircuit(blocks,[0,0,1],false).at(-1)),.5);
}
const d=screenDistribution(2,true,400,0,40,400,.5,1),bins=Array(800).fill(0);
d.probabilities.forEach((p,i)=>bins[Math.floor(i/8)]+=p);
near(bins.reduce((a,b)=>a+b,0),1);assert.ok(44/800<.5/8);checks++;
const central=bins.filter((_,i)=>Math.abs(-22+(i+.5)*44/800)<.5),min=Math.min(...central),max=Math.max(...central);
assert.ok((max-min)/(max+min)>.93,'Le frange centrali devono restare risolte');checks++;
for(const phase of [0,90,180,-90]){
 const coherent=pairDistribution('coherent-even',45,45,phase),mixed=pairDistribution('mixed-even',45,45,phase);
 near(coherent[0]+coherent[3],(1+Math.cos(phase*Math.PI/180))/2);
 near(mixed[0]+mixed[3],.5);
 const anti=pairDistribution('coherent-odd',0,0,phase);near(anti[1]+anti[2],1);
}
for(const interaction of [0,25,50,75,100]){
 const hv=decoheredPair(interaction,0);near(hv[0]+hv[3],1);
}
near(decoheredPair(100,45)[0]+decoheredPair(100,45)[3],.5);
for(const z of [-1,-.5,0,.5,1]){
 const bounds=archivedRange(z,'H');near(bounds[0],(1-Math.sqrt(1-z*z))/2);near(bounds[1],(1+Math.sqrt(1-z*z))/2);
 for(const phase of [-180,-90,0,90,180])near(probabilityH(archiveAlternatives(z,phase)),(1+z)/2);
}
for(const stabilize of [false,true])for(const undo of [false,true]){
 for(const cause of ['phase','marker']){
  const enabled=cause==='phase'?stabilize:undo;
  const p0=diagnosticDistribution(cause,0,stabilize,undo),p180=diagnosticDistribution(cause,180,stabilize,undo);
  near(p0[0]+p0[1],enabled?1:.5);near(p180[0]+p180[1],enabled?0:.5);
 }
}
for(const n of [1000,5000,10000])near(new ReversibleGas(n).range,3.8);
const report={status:'PASS',checks,screenBins:800,screenSamples:d.ys.length,smallestFringeMm:.5,centralContrast:(max-min)/(max+min),tested:['fase effettiva','trascinamento sui due emisferi','camera indipendente','R–F–R e bypass','risoluzione delle frange','correlazione e anticorrelazione','fase a 90°','ambiente','archivi generici','diagnosi','interazione del gas indipendente da N']};
await fs.writeFile(new URL('./revision-results.json',import.meta.url),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
