import assert from 'node:assert/strict';
import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const root=process.cwd();const target=path.join(root,'qa/course/math-test.cjs');
await build({entryPoints:['src/course/math/core.ts'],bundle:true,platform:'node',format:'cjs',outfile:target,logLevel:'silent'});
const require=createRequire(import.meta.url),M=require(target);let checks=0;const close=(a,b,tol=1e-8)=>{assert.ok(Math.abs(a-b)<tol,`${a} vs ${b}`);checks++;},matrix=(a,b)=>a.forEach((r,i)=>r.forEach((x,j)=>x.forEach((q,k)=>close(q,b[i][j][k]))));
const random=M.rng(91243),z=M.z;
for(let k=0;k<250;k++){
 const a=random()*6-3,d=random()*6-3,b=z(random()*4-2,random()*4-2),A=[[z(a),b],[M.conj(b),z(d)]],e=M.eigenHermitian(A),v=M.qubit(random()*180,random()*720-360);
 e.vectors.forEach((u,i)=>{close(M.norm2(u),1);M.mv(A,u).forEach((x,j)=>{const y=M.scale(u[j],e.values[i]);close(x[0],y[0]);close(x[1],y[1]);});});
 close(M.abs2(M.dot(e.vectors[0],e.vectors[1])),0);matrix(M.madd(...e.projectors),M.eye(2));matrix(M.spectral(A,x=>z(x)),A);
 const U=M.spectral(A,x=>M.cis(-.4*x));matrix(M.mm(M.adj(U),U),M.eye(2));close(M.norm2(M.mv(U,v)),1);
 const basis=M.measurementBasis(random()*180,random()*360-180),r=M.bloch(v),n=M.bloch(basis[0]),probs=M.born(v,basis);close(probs.reduce((s,x)=>s+x.probability,0),1);close(probs[0].probability,(1+r.reduce((s,x,i)=>s+x*n[i],0))/2);
 probs.forEach(x=>{if(x.post){close(M.norm2(x.post),1);close(M.abs2(M.dot(x.u,x.post)),1);}});
 const obs=M.observe(A,v);close(obs.mean,e.values.reduce((s,x,i)=>s+x*M.abs2(M.dot(e.vectors[i],v)),0));
 const B=M.real([[1,random()],[0,1]]),inverse=M.inv2(B);matrix(M.mm(B,inverse),M.eye(2));
 const w=M.qubit(random()*180,random()*360),t=M.tensor(v,w);close(M.norm2(t),1);close(M.abs2(M.sub(M.mul(t[0],t[3]),M.mul(t[1],t[2]))),0);
 const X=M.X,Z=M.Z,Ao=M.observe(X,v),Bo=M.observe(Z,v),C=M.msub(M.mm(X,Z),M.mm(Z,X)),bound=Math.hypot(...M.dot(v,M.mv(C,v)))/2;assert.ok(Ao.sd*Bo.sd+1e-9>=bound);checks++;
}
for(const A of [M.real([[1,1],[2,2]]),M.real([[1,0,0],[0,1,0],[0,0,0]]),M.real([[0,0],[0,0]]),M.real([[0,1,2],[0,2,4],[1,0,1]])]){const r=M.rref(A);close(r.rank+r.kernel.length,A[0].length);r.kernel.forEach(v=>close(M.norm2(M.mv(A,v)),0));}
for(const n of [1,20,1000,10000])for(const p of [0,.01,.3,.5,.99,1]){const q=M.binomial(n,p),total=q.reduce((a,b)=>a+b,0),mean=q.reduce((s,x,i)=>s+x*i,0),variance=q.reduce((s,x,i)=>s+x*(i-n*p)**2,0);close(total,1,2e-9);close(mean,n*p,2e-5);close(variance,n*p*(1-p),2e-5);}
const A=[[z(1),z(1,-1)],[z(1,1),z()]],psi=M.vscale([z(2),z(0,1)],z(1/Math.sqrt(5))),e=M.eigenHermitian(A),b=M.born(psi,e.vectors),o=M.observe(A,psi);close(e.values[0],2);close(e.values[1],-1);close(b[0].probability,13/15);close(b[1].probability,2/15);close(o.mean,8/5);close(o.variance,26/25);
close(b[0].amplitude[0],2/Math.sqrt(15));close(b[0].amplitude[1],3/Math.sqrt(15));close(b[1].amplitude[0],-2/Math.sqrt(30));
const deg=M.eigenHermitian(M.real([[2,0],[0,2]]));assert.equal(deg.degenerate,true);matrix(M.spectral(M.real([[2,0],[0,2]]),x=>z(x*x)),M.real([[4,0],[0,4]]));
assert.equal(M.inv2(M.real([[1,2],[2,4]])),null);assert.equal(M.normalize([z(),z()]),null);checks+=3;
for(const phase of [-180,-90,0,90,180]){let s=[z(1),z()];for(const gate of ['R','F','R'])s=M.mv(M.axisGate(gate,phase),s);close(M.abs2(s[0]),(1+Math.cos(M.rad(phase)))/2);}
const gram=M.gram([[z(1),z(0,1)],[z(1),z()]]);close(M.abs2(M.dot(...gram.basis)),0);
const report={status:'PASS',checks,randomHermitianCases:250,binomialMaxN:10000,reference:{eigenvalues:e.values,probabilities:b.map(x=>x.probability),mean:o.mean,variance:o.variance},scope:'Verifiche numeriche indipendenti dei modelli; non certificano l’interazione nel browser.'};fs.writeFileSync('qa/course/mathematics-results.json',JSON.stringify(report,null,2)+'\n');fs.unlinkSync(target);console.log(JSON.stringify(report));
