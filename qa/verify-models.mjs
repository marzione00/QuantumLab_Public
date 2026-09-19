import assert from 'node:assert/strict';
import * as P from '../src/lib/physics.ts';
const close=(a,b,tol=1e-10)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
const energy=g=>g.particles.reduce((s,p)=>s+p.vx**2+p.vy**2,0);
let checks=0;const returns=[];
for(const n of [12,24,48,72]){
 const g=P.createGas(n),start=P.cloneGas(g),e=energy(g);
 for(let i=0;i<400;i++)P.advanceGas(g,.01);
 close(energy(g)/e,1,1e-12);
 const bad=P.cloneGas(g);P.invertGas(g);P.invertGas(bad,.5);
 for(let i=0;i<400;i++){P.advanceGas(g,.01);P.advanceGas(bad,.01);}
 const err=P.positionError(g,start),pert=P.positionError(bad,start);
 assert.ok(err<.001,'Loschmidt return '+n+': '+err);assert.ok(pert>err);
 g.particles.forEach(p=>{assert.ok(p.x>=g.radius-1e-7&&p.x<=g.width-g.radius+1e-7);assert.ok(p.y>=g.radius-1e-7&&p.y<=g.height-g.radius+1e-7);});
 returns.push({particles:n,idealError:err,perturbedError:pert});checks++;
}
close(P.polarProbability(45,0),.5);close(P.polarProbability(-45,0),.5);close(P.polarProbability(45,45),1);close(P.polarProbability(-45,45),0);checks+=4;
for(const a of [0,13,45,90])for(const b of [0,21,45,90])for(const kind of ['entangled','mixture']){const p=P.pairProbabilities(kind,a,b);close(p.reduce((a,b)=>a+b),1);close(p[0]+p[1],.5);close(p[0]+p[2],.5);assert.ok(p.every(x=>x>=-1e-15));checks++;}
assert.deepEqual(P.pairProbabilities('mixture',45,45),[.25,.25,.25,.25]);
for(const phase of [0,90,180,270])for(const coupling of [0,25,75,100]){const p=P.environmentProbabilities(coupling,phase),rev=P.environmentProbabilities(coupling,phase,true);close(p.reduce((a,b)=>a+b),1);close(rev[0]+rev[1],(1+Math.cos(P.rad(phase)))/2);if(coupling===100)close(p[0]+p[1],.5);checks++;}
for(const phase of [0,90,180,270,360])for(const gates of [['H','P','H'],['P','H','H'],['H','P']]){const states=P.circuit(gates,phase);states.forEach(v=>close(Math.hypot(...v),1));checks++;}
for(const coherent of [true,false]){const d=P.screenDistribution(2,coherent,180,0);close(d.probabilities.reduce((a,b)=>a+b),1);assert.ok(d.cdf.every((x,i,a)=>i===0||x>=a[i-1]));checks++;}
const original=P.createGas(32);P.advanceGas(original,2.5);const restored=P.cloneGas(original),coarse=P.coarseReconstruction(original);assert.equal(P.gasLeft(original),P.gasLeft(coarse));P.advanceGas(original,3);P.advanceGas(restored,3);close(P.positionError(original,restored),0);checks++;
console.log(JSON.stringify({checks,returns,result:'PASS'},null,2));
