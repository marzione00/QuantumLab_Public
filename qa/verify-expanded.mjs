import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {DiskGas,gasRms} from '../src/lib/gas-engine.ts';
import {reconstructArchive} from '../src/lib/archive-model.ts';
import {wilson} from '../src/lib/statistics.ts';
import * as P from '../src/lib/physics.ts';

let cases=0; const timings=[];
const near=(a,b,tol=1e-10)=>assert.ok(Math.abs(a-b)<=tol,`${a} != ${b}, tol=${tol}`);
function geometry(g){
 const buckets=new Map(),size=2.1*g.radius,cols=Math.ceil(g.width/size);
 for(const p of g.particles){
  assert.ok([p.x,p.y,p.vx,p.vy].every(Number.isFinite));
  assert.ok(p.x>=g.radius-1e-6&&p.x<=g.width-g.radius+1e-6);
  assert.ok(p.y>=g.radius-1e-6&&p.y<=g.height-g.radius+1e-6);
  const ix=Math.floor(p.x/size),iy=Math.floor(p.y/size);
  if(g.interactions)for(let y=-1;y<=1;y++)for(let x=-1;x<=1;x++)for(const q of buckets.get((iy+y)*cols+ix+x)||[])assert.ok(Math.hypot(p.x-q.x,p.y-q.y)>=2*g.radius-1e-6,'overlapping disks');
  const key=iy*cols+ix,b=buckets.get(key)||[];b.push(p);buckets.set(key,b);
 }
}
// Large ensembles: analytic wall reflections, reversible without a trajectory log.
for(const n of [1000,5000,10000]){
 const t=performance.now(),g=new DiskGas(n,31415,true,undefined,false),initial=g.snapshot(),energy=g.energy();
 for(let k=1;k<=50;k++)g.advance(k*.4);geometry(g);g.reverse();
 for(let k=1;k<=50;k++)g.advance(20+k*.4);
 near(gasRms(g.particles,initial.particles),0,1e-9);near(g.energy()/energy,1,1e-12);geometry(g);
 timings.push({model:'free',n,milliseconds:Math.round(performance.now()-t),returnRms:gasRms(g.particles,initial.particles)});cases++;
}
// Independent O(N²) collision solver and the cell/event solver must agree.
for(const n of [24,48,100]){
 const g=new DiskGas(n,542),reference=g.snapshot();
 for(let k=1;k<=10;k++){g.advance(k*.02);P.advanceGas(reference,.02);}
 near(gasRms(g.particles,reference.particles),0,1e-7);geometry(g);cases++;
}
// High counts: elastic energy, bounds, exclusion, and bounded chunks.
for(const n of [1000,5000,10000]){
 const t=performance.now(),g=new DiskGas(n),start=g.snapshot(),energy=g.energy();let slices=0;
 while(!g.advance(.4,2)){assert.ok(g.time<=.4);assert.ok(++slices<10000);}
 near(g.time,.4);geometry(g);near(g.energy()/energy,1,1e-12);g.reverse();g.advance(.8);geometry(g);
 near(g.energy()/energy,1,1e-12);
 const err=gasRms(g.particles,start.particles);assert.ok(err<1e-3,'short-time numerical return');
 timings.push({model:'hard-disks',n,milliseconds:Math.round(performance.now()-t),collisions:g.collisions,returnRms:err});cases++;
}
for(const phase of [0,30,90,180,270])for(const a of [0,13,45,90])for(const b of [0,21,45,90]){
 const p=P.pairProbabilities('entangled',a,b,phase);near(p.reduce((a,b)=>a+b),1);near(p[0]+p[1],.5);near(p[0]+p[2],.5);assert.ok(p.every(x=>x>=0&&x<=1));cases++;
}
near(P.pairProbabilities('entangled',45,45,0)[0],.5);near(P.pairProbabilities('entangled',45,45,180)[0],0);near(P.pairProbabilities('entangled',45,45,90)[0],.25);
for(const v of [[0,0,1],[1,0,0],[0,1,0]])for(const gate of ['I','X','Y','Z','H','P']){
 for(const state of P.circuit([gate,gate],180,v))near(Math.hypot(...state),1);
 P.circuit([gate,gate],180,v).at(-1).forEach((x,i)=>near(x,v[i]));cases++;
}
for(const c of [0,25,75,100])for(const phase of [0,90,180,270])for(const a of [0,17,45,90])for(const undo of [false,true]){
 const p=P.environmentProbabilities(c,phase,undo,a),base=P.environmentProbabilities(c,phase,undo,0);
 near(p.reduce((a,b)=>a+b),1);assert.ok(p.every(x=>x>=-1e-14));near(p[0]+p[1],base[0]+base[1]);cases++;
}
const erased=P.environmentProbabilities(100,0,false,45);near(erased[0],.5);near(erased[3],.5);near(erased[1]+erased[2],0);
for(const slits of [1,2])for(const a of [10,80])for(const wavelength of [400,700])for(const distance of [.5,2])for(const visibility of [0,1]){
 const d=P.screenDistribution(slits,true,180,90,a,wavelength,distance,visibility);near(d.probabilities.reduce((a,b)=>a+b),1);assert.ok(d.probabilities.every(x=>x>=0));assert.ok(d.cdf.every((x,i)=>i===0||x>=d.cdf[i-1]));cases++;
}
const source=new DiskGas(5000,84,true,undefined,false);source.advance(2.5);const saved=source.snapshot();
const occupancy=(g,cells)=>{const nx=cells===2?2:cells===8?4:8,ny=cells/nx,a=new Array(cells).fill(0);for(const p of g.particles)a[Math.min(cells-1,Math.floor(p.x/g.width*nx)+nx*Math.floor(p.y/g.height*ny))]++;return a;};
for(const cells of [2,8,32]){const restored=reconstructArchive(saved,'counts',cells);assert.deepEqual(occupancy(saved,cells),occupancy(restored,cells));geometry({...restored,interactions:true});cases++;}
const missingVelocities={...saved,particles:saved.particles.map(p=>({...p,vx:0,vy:0}))};
assert.deepEqual(reconstructArchive(saved,'positions'),reconstructArchive(missingVelocities,'positions'));cases++;
const identical=new DiskGas(5000,84,true,reconstructArchive(saved,'full'),false);source.advance(14.5);identical.advance(14.5);near(gasRms(source.particles,identical.particles),0);cases++;
for(const n of [1,1000,100000])for(const k of [0,Math.floor(n/2),n]){const [lo,hi]=wilson(k,n);assert.ok(lo>=0&&hi<=1&&lo<=hi);assert.ok(lo<=k/n+1e-15&&hi>=k/n-1e-15);cases++;}
near(wilson(4,20)[0],.080656,1e-5);near(wilson(4,20)[1],.416022,1e-5);
// One million actual draws, not a rescaled small sample.
const d=P.screenDistribution(2,true,180,0),rng=P.randomSource(8381),counts=new Uint32Array(d.probabilities.length);for(let i=0;i<1000000;i++)counts[P.screenSample(d.cdf,rng)]++;
assert.equal(counts.reduce((a,b)=>a+b),1000000);
// Compare the 800 displayed histogram regions: finer integration points are
// quadrature samples, not additional independent plotted categories.
const observed=Array(800).fill(0),predicted=Array(800).fill(0);
counts.forEach((n,i)=>{observed[Math.floor(i/8)]+=n;predicted[Math.floor(i/8)]+=d.probabilities[i];});
const tv=observed.reduce((s,n,i)=>s+Math.abs(n/1000000-predicted[i]),0)/2;assert.ok(tv<.02);cases++;
const result={result:'PASS',cases,timings,oneMillionScreenDraws:{total:1000000,totalVariation:tv},scope:'Numerical models. Does not replace interactive browser testing.'};
writeFileSync(new URL('./expanded-results.json',import.meta.url),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
