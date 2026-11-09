import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
vm.runInThisContext(fs.readFileSync(new URL('../src/models.js',import.meta.url),'utf8'));const C=globalThis.QuantumCore;let checks=0;const ok=(x,m)=>{assert.ok(x,m);checks++;},near=(a,b,t=1e-10)=>ok(Math.abs(a-b)<=t,`${a} != ${b}`);
// Analytic reference independent of the gate application used by the implementation.
for(let phi=-360;phi<=360;phi+=3){for(const recombine of [false,true]){const r=C.phase(phi,recombine);near(C.norm(r.state),1);near(r.probabilities[0],recombine?(1+Math.cos(phi*Math.PI/180))/2:.5);near(r.probabilities.reduce((a,b)=>a+b),1);}}
// All marked subsets at N=4 and N=8, all prefixes including a single reflection.
for(const n of [2,3])for(let mask=0;mask<2**(2**n);mask++){
 const marked=Array.from({length:2**n},(_,i)=>i).filter(i=>mask&(2**i)),theta=Math.asin(Math.sqrt(marked.length/2**n));
 for(let half=0;half<=16;half++){const r=C.grover(n,marked,half),k=Math.floor(half/2);near(r.probabilities.reduce((a,b)=>a+b),1,1e-9);near(r.success,Math.sin((2*k+1)*theta)**2,1e-9);near(r.projection.good**2,r.success,1e-9);near(r.projection.bad**2+r.projection.good**2,1,1e-9);ok(r.oracleCalls===Math.ceil(half/2),'oracle count');}
}
for(const msg of ['00','01','10','11']){const r=C.superdense(msg);r.snapshots.forEach(s=>near(C.norm(s),1));r.probabilities.forEach((p,i)=>near(p,i===parseInt(msg,2)?1:0));near(r.bobMarginal[0],.5);near(r.bobMarginal[1],.5);}
for(let theta=0;theta<=180;theta+=15)for(let phi=-180;phi<=180;phi+=30)for(const error of ['none','X0','X1','X2','X0X1','Z0']){
 const r=C.correction({theta,phi,error});r.snapshots.forEach(s=>near(C.norm(s),1));near(r.syndromeProbabilities.reduce((a,b)=>a+b),1);ok(r.syndrome===({none:'00',X0:'10',X1:'11',X2:'01',X0X1:'01',Z0:'00'})[error],'syndrome');
 const expected=error==='Z0'?Math.cos(theta*Math.PI/180)**2:error==='X0X1'?(Math.sin(theta*Math.PI/180)*Math.cos(phi*Math.PI/180))**2:1;near(r.fidelity,expected);
}
for(let message=0;message<55;message++){
 let r=C.rsa(message,20);near(r.cipher,message**3%55);if(C.gcd(message,55)===1){ok(r.order!==null,'order exists');r=C.rsa(message,r.order);near(r.recovered,message);ok(r.verified,'RSA verify');for(let k=1;k<r.order;k++)ok(C.powmod(r.cipher,k,55)!==1,'minimal order');}else{ok(r.order===null&&!r.periodVerified&&r.recovered===null,'nonunit not assigned order');}
}
for(let seed=0;seed<40;seed++)for(const eve of [false,true])for(const noise of [0,.1,.5]){
 const p={size:1024,seed,eve,noise},r=C.bb84(p);ok(JSON.stringify(r)===JSON.stringify(C.bb84(p)),'seed reproducible');ok(r.rows.length===1024,'row count');ok(r.kept===r.tested+r.candidateCount,'sample removed');ok(r.rows.filter(x=>x.sample).every(x=>x.keep),'sample subset');ok(r.candidateAlice.length===r.candidateCount,'key length');if(!eve&&noise===0){near(r.rawQber??0,0);ok(r.candidateAlice===r.candidateBob,'ideal candidates agree');}
 const observed=r.rawQber;if(observed!==null)near(observed,r.expectedQber,.11);
}
const q0=C.bb84({size:4096,seed:4,eve:true,noise:0});near(q0.rawQber,.25,.04);
const p=[.2,.3,.5],a=C.counts(p,1000,17);ok(JSON.stringify(a)===JSON.stringify(C.counts(p,1000,17)),'count reproducibility');near(a.reduce((x,y)=>x+y),1000);
for(const fn of [()=>C.phase(NaN),()=>C.grover(2,[4],0),()=>C.grover(2,[1,1],0),()=>C.grover(2,[1],17),()=>C.bb84({size:2}),()=>C.bb84({noise:.8}),()=>C.superdense('000'),()=>C.correction({theta:-1}),()=>C.correction({error:'Y'}),()=>C.rsa(55),()=>C.rng(-1),()=>C.counts([.2,.3],1,0)]){assert.throws(fn);checks++;}
const report={status:'PASS',checks,scope:['phase: analytic cosine reference','Grover: all subsets N=4,8 and 0..16 reflections','superdense: all 4 messages and no-signalling marginals','repetition code: angles, phases, single/double X and Z','RSA: all 55 messages with coprime domain handling','BB84: reproducibility, sifting, sampling, noise and intercept-resend statistics','invalid inputs'],notClaimed:['full QKD security','hardware performance','formal proof']};fs.mkdirSync(new URL('../qa',import.meta.url),{recursive:true});fs.writeFileSync(new URL('../qa/models.json',import.meta.url),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
