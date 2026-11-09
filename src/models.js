/* Quantum Lab 5 — numerical models. No DOM, network, clocks or hidden state.
 * Basis convention: |q0 q1 ...>, q0 most significant. Angles in degrees in the public API.
 * Random generators are reproducible simulation tools, never cryptographic generators.
 */
(function(root){'use strict';
 const check=(condition,message)=>{if(!condition)throw new RangeError(message);};
 const integer=(x,lo,hi,label)=>{check(Number.isInteger(x)&&x>=lo&&x<=hi,label+' fuori intervallo');return x;};
 const finite=(x,lo,hi,label)=>{check(Number.isFinite(x)&&x>=lo&&x<=hi,label+' fuori intervallo');return x;};
 const c=(re=0,im=0)=>[re,im],add=(a,b)=>[a[0]+b[0],a[1]+b[1]],mul=(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]],scale=(a,s)=>[a[0]*s,a[1]*s],abs2=a=>a[0]*a[0]+a[1]*a[1];
 const clone=s=>s.map(z=>z.slice());
 const probabilities=s=>s.map(abs2),norm=s=>probabilities(s).reduce((a,b)=>a+b,0);
 const H=[[c(Math.SQRT1_2),c(Math.SQRT1_2)],[c(Math.SQRT1_2),c(-Math.SQRT1_2)]],X=[[c(),c(1)],[c(1),c()]],Z=[[c(1),c()],[c(),c(-1)]];
 function gate(state,q,matrix,controls=[]){
  const n=Math.log2(state.length);integer(n,1,12,'Qubit');integer(q,0,n-1,'Qubit bersaglio');
  for(const j of controls){integer(j,0,n-1,'Controllo');check(j!==q,'Controllo uguale al bersaglio');}
  const result=clone(state),mask=2**(n-1-q);
  for(let i=0;i<state.length;i++)if(!(i&mask)&&controls.every(j=>i&(2**(n-1-j)))){
   const a=state[i],b=state[i|mask];result[i]=add(mul(matrix[0][0],a),mul(matrix[0][1],b));result[i|mask]=add(mul(matrix[1][0],a),mul(matrix[1][1],b));
  }return result;
 }
 function rng(seed){integer(seed,0,4294967295,'Seme');let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
 function sample(p,random){check(p.every(x=>Number.isFinite(x)&&x>=0),'Probabilità non valide');const total=p.reduce((a,b)=>a+b,0);check(Math.abs(total-1)<1e-8,'Probabilità non normalizzate');let u=random()*total;for(let j=0;j<p.length;j++){u-=p[j];if(u<0)return j;}return p.length-1;}
 function counts(p,shots,seed){integer(shots,1,100000,'Numero di prove');const random=rng(seed),out=p.map(()=>0);for(let j=0;j<shots;j++)out[sample(p,random)]++;return out;}
 function phase(degrees=90,recombine=true){finite(degrees,-360,360,'Fase');const phi=degrees*Math.PI/180,start=[c(1),c()],prepared=gate(start,0,H),shifted=gate(prepared,0,[[c(1),c()],[c(),c(Math.cos(phi),Math.sin(phi))]]),state=recombine?gate(shifted,0,H):shifted;return{state,probabilities:probabilities(state),snapshots:[start,prepared,shifted,...(recombine?[state]:[])]};}
 function grover(n=2,marked=[1],halfSteps=0){integer(n,2,4,'Numero di qubit');integer(halfSteps,0,16,'Riflessioni');const N=2**n;check(Array.isArray(marked)&&new Set(marked).size===marked.length,'Soluzioni duplicate');marked.forEach(j=>integer(j,0,N-1,'Soluzione'));let a=Array(N).fill(1/Math.sqrt(N));const M=marked.length,set=new Set(marked),snapshots=[{label:'Preparazione uniforme',amplitudes:a.slice()}];
  for(let k=1;k<=halfSteps;k++){
   if(k%2)a=a.map((v,j)=>set.has(j)?-v:v);else{const mean=a.reduce((x,y)=>x+y,0)/N;a=a.map(v=>2*mean-v);}
   snapshots.push({label:k%2?'Marcatura '+Math.ceil(k/2):'Diffusore '+(k/2),amplitudes:a.slice()});
  }
  const project=values=>({bad:M<N?values.reduce((s,v,j)=>s+(set.has(j)?0:v),0)/Math.sqrt(N-M):0,good:M?values.reduce((s,v,j)=>s+(set.has(j)?v:0),0)/Math.sqrt(M):0});
  const p=a.map(v=>v*v);return{amplitudes:a,probabilities:p,success:marked.reduce((s,j)=>s+p[j],0),projection:project(a),trajectory:snapshots.map(s=>project(s.amplitudes)),snapshots,oracleCalls:Math.ceil(halfSteps/2)};
 }
 function bb84({size=128,seed=17,eve=false,noise=0,sampleFraction=.25}={}){
  integer(size,8,4096,'Numero di segnali');finite(noise,0,.5,'Errore di lettura');finite(sampleFraction,.05,.5,'Quota di controllo');check(typeof eve==='boolean','Intercettazione non valida');const random=rng(seed),bit=()=>random()<.5?0:1,rows=[];
  for(let j=0;j<size;j++){
   const alice=bit(),aliceBasis=bit(),bobBasis=bit();let transmitted=alice,transmittedBasis=aliceBasis,eveBasis=null,eveBit=null;
   if(eve){eveBasis=bit();eveBit=eveBasis===aliceBasis?alice:bit();transmitted=eveBit;transmittedBasis=eveBasis;}
   let bob=bobBasis===transmittedBasis?transmitted:bit();const flipped=random()<noise;if(flipped)bob^=1;
   rows.push({index:j+1,alice,aliceBasis,bob,bobBasis,eveBasis,eveBit,flipped,keep:aliceBasis===bobBasis,sample:false});
  }
  const kept=rows.filter(r=>r.keep),indices=kept.map((_,j)=>j);
  for(let j=indices.length-1;j>0;j--){const k=Math.floor(random()*(j+1));[indices[j],indices[k]]=[indices[k],indices[j]];}
  const tested=Math.min(kept.length,Math.max(kept.length?1:0,Math.floor(kept.length*sampleFraction)));
  for(const j of indices.slice(0,tested))kept[j].sample=true;
  const publicSample=kept.filter(r=>r.sample),candidate=kept.filter(r=>!r.sample),errors=publicSample.filter(r=>r.alice!==r.bob).length;
  const rawQber=kept.length?kept.filter(r=>r.alice!==r.bob).length/kept.length:null;
  const base=eve?.25:0;
  return{rows,kept:kept.length,tested,errors,qber:tested?errors/tested:null,rawQber,candidateCount:candidate.length,candidateAlice:candidate.map(r=>r.alice).join(''),candidateBob:candidate.map(r=>r.bob).join(''),expectedQber:base+noise-2*base*noise,parameters:{size,seed,eve,noise,sampleFraction}};
 }
 function superdense(message='00'){
  check(/^[01]{2}$/.test(message),'Messaggio: due bit');const [phaseBit,flipBit]=message.split('').map(Number),start=[c(1),c(),c(),c()],bell=gate(gate(start,0,H),1,X,[0]);let encoded=clone(bell);if(phaseBit)encoded=gate(encoded,0,Z);if(flipBit)encoded=gate(encoded,0,X);const cnot=gate(encoded,1,X,[0]),decoded=gate(cnot,0,H),p=probabilities(decoded),before=probabilities(encoded);
  return{message,bell,encoded,decoded,probabilities:p,bobMarginal:[before[0]+before[2],before[1]+before[3]],snapshots:[bell,encoded,encoded,cnot,decoded],labels:['Coppia di Bell condivisa','Codifica locale di Alice','Invio del qubit di Alice a Bob','CNOT: q₀ controlla q₁','Hadamard e lettura di entrambi i qubit']};
 }
 function correction({theta=90,phi=0,error='X0'}={}){
  finite(theta,0,180,'Angolo di preparazione');finite(phi,-180,180,'Fase');check(['none','X0','X1','X2','X0X1','Z0'].includes(error),'Errore sconosciuto');const t=theta*Math.PI/360,f=phi*Math.PI/180,logical=[c(Math.cos(t)),c(Math.sin(t)*Math.cos(f),Math.sin(t)*Math.sin(f))];let encoded=Array.from({length:8},()=>c());encoded[0]=logical[0];encoded[7]=logical[1];let disturbed=clone(encoded);
  if(error==='Z0')disturbed=gate(disturbed,0,Z);else for(const q of [0,1,2])if(error.includes('X'+q))disturbed=gate(disturbed,q,X);
  const syndromeProbabilities=[0,0,0,0];disturbed.forEach((z,i)=>{const a=(i>>2)&1,b=(i>>1)&1,d=i&1;syndromeProbabilities[((a^b)<<1)|(b^d)]+=abs2(z);});
  const syndrome=syndromeProbabilities.indexOf(Math.max(...syndromeProbabilities)),target=({0:null,1:2,2:0,3:1})[syndrome],corrected=target===null?clone(disturbed):gate(disturbed,target,X),decoded=gate(gate(corrected,1,X,[0]),2,X,[0]);
  let overlap=c();for(let j=0;j<2;j++)overlap=add(overlap,mul([logical[j][0],-logical[j][1]],decoded[j*4]));
  return{logical,encoded,disturbed,corrected,decoded,syndrome:syndrome.toString(2).padStart(2,'0'),syndromeProbabilities,target,fidelity:abs2(overlap),snapshots:[encoded,disturbed,disturbed,corrected,decoded],labels:['Codifica coerente','Errore nel canale','Misura dei due controlli di parità','Correzione indicata dalla sindrome','Decodifica e confronto con la preparazione']};
 }
 const gcd=(a,b)=>{while(b)[a,b]=[b,a%b];return a;};
 function powmod(a,e,N){integer(N,2,65535,'Modulo');integer(e,0,65535,'Esponente');integer(a,0,65535,'Base');let r=1;for(a%=N;e;e=Math.floor(e/2),a=a*a%N)if(e%2)r=r*a%N;return r;}
 function inverse(a,N){if(N===1)return 0;let [t,newT,r,newR]=[0,1,N,a%N];while(newR){const q=Math.floor(r/newR);[t,newT]=[newT,t-q*newT];[r,newR]=[newR,r-q*newR];}return r===1?((t%N)+N)%N:null;}
 function rsa(message=2,candidate=20){integer(message,0,54,'Messaggio');integer(candidate,1,80,'Periodo candidato');const N=55,e=3,cipher=powmod(message,e,N),coprime=gcd(cipher,N)===1,orbit=[1];let order=null;
  if(coprime){let value=1;for(let k=1;k<=40;k++){value=value*cipher%N;orbit.push(value);if(value===1){order=k;break;}}}
  const periodVerified=coprime&&powmod(cipher,candidate,N)===1,d=periodVerified?inverse(e,candidate):null,recovered=d===null?null:powmod(cipher,d,N);
  return{N,e,message,cipher,coprime,orbit,order,candidate,periodVerified,d,recovered,verified:recovered!==null&&powmod(recovered,e,N)===cipher};
 }
 root.QuantumCore=Object.freeze({c,add,mul,scale,abs2,gate,H,X,Z,norm,probabilities,rng,sample,counts,phase,grover,bb84,superdense,correction,gcd,powmod,inverse,rsa});
})(globalThis);
