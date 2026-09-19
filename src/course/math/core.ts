// Course mathematics. Inner products are conjugate-linear in the first argument.
export type Z=[number,number]; export type V=Z[]; export type Mat=Z[][]; export type R2=[number,number]; export type R3=[number,number,number];
export const z=(x=0,y=0):Z=>[x,y];
export const add=(a:Z,b:Z):Z=>[a[0]+b[0],a[1]+b[1]];
export const neg=(a:Z):Z=>[-a[0],-a[1]];
export const sub=(a:Z,b:Z)=>add(a,neg(b));
export const mul=(a:Z,b:Z):Z=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]];
export const conj=(a:Z):Z=>[a[0],-a[1]];
export const abs2=(a:Z)=>a[0]*a[0]+a[1]*a[1];
export const scale=(a:Z,k:number):Z=>[a[0]*k,a[1]*k];
export const div=(a:Z,b:Z):Z=>{const d=abs2(b);if(d<1e-24)throw Error('Divisione per zero');return scale(mul(a,conj(b)),1/d);};
export const cis=(t:number):Z=>[Math.cos(t),Math.sin(t)]; export const rad=(d:number)=>Math.PI*d/180;
export const phase=(a:Z)=>abs2(a)<1e-20?null:Math.atan2(a[1],a[0])*180/Math.PI;
export const dot=(a:V,b:V):Z=>a.reduce((s,x,i)=>add(s,mul(conj(x),b[i])),z());
export const norm2=(v:V)=>v.reduce((s,x)=>s+abs2(x),0);
export const vscale=(v:V,c:Z)=>v.map(x=>mul(x,c));
export const vadd=(v:V,w:V)=>v.map((x,i)=>add(x,w[i]));
export const vsub=(v:V,w:V)=>v.map((x,i)=>sub(x,w[i]));
export const normalize=(v:V):V|null=>norm2(v)<1e-20?null:vscale(v,z(1/Math.sqrt(norm2(v))));
export const eye=(n:number):Mat=>Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>z(i===j?1:0)));
export const mv=(a:Mat,v:V):V=>a.map(row=>row.reduce((s,x,j)=>add(s,mul(x,v[j])),z()));
export const adj=(a:Mat):Mat=>a[0].map((_,j)=>a.map(row=>conj(row[j])));
export const mm=(a:Mat,b:Mat):Mat=>a.map(row=>b[0].map((_,j)=>row.reduce((s,x,k)=>add(s,mul(x,b[k][j])),z())));
export const madd=(a:Mat,b:Mat)=>a.map((row,i)=>row.map((x,j)=>add(x,b[i][j])));
export const mscale=(a:Mat,c:Z)=>a.map(row=>row.map(x=>mul(x,c)));
export const msub=(a:Mat,b:Mat)=>madd(a,mscale(b,z(-1)));
export const outer=(v:V,w:V=v):Mat=>v.map(a=>w.map(b=>mul(a,conj(b))));
export const close=(a:Mat,b:Mat,tol=1e-9)=>a.length===b.length&&a.every((r,i)=>r.every((x,j)=>abs2(sub(x,b[i][j]))<tol*tol));
export const hermitian=(a:Mat)=>close(a,adj(a));export const unitary=(a:Mat)=>close(mm(adj(a),a),eye(a.length));
export const det2=(a:Mat)=>sub(mul(a[0][0],a[1][1]),mul(a[0][1],a[1][0]));
export function inv2(a:Mat):Mat|null{const d=det2(a);if(abs2(d)<1e-20)return null;return [[a[1][1],neg(a[0][1])],[neg(a[1][0]),a[0][0]]].map(row=>row.map(x=>div(x,d)));}
export function rref(a:Mat){const m=a.map(row=>row.map(x=>[...x] as Z)),steps:Mat[]=[m.map(r=>r.map(x=>[...x] as Z))],pivots:number[]=[],operations:string[]=[];let row=0;for(let col=0;col<m[0].length&&row<m.length;col++){let p=row;for(let i=row;i<m.length;i++)if(abs2(m[i][col])>abs2(m[p][col]))p=i;if(abs2(m[p][col])<1e-18)continue;if(p!==row){[m[p],m[row]]=[m[row],m[p]];operations.push(`Scambia le righe ${row+1} e ${p+1}.`);steps.push(m.map(r=>r.map(x=>[...x] as Z)));}const pivot=m[row][col];if(abs2(sub(pivot,z(1)))>1e-24){m[row]=m[row].map(x=>div(x,pivot));operations.push(`Dividi la riga ${row+1} per ${cz(pivot)}.`);steps.push(m.map(r=>r.map(x=>[...x] as Z)));}for(let i=0;i<m.length;i++)if(i!==row&&abs2(m[i][col])>1e-18){const q=m[i][col];m[i]=m[i].map((x,j)=>sub(x,mul(q,m[row][j])));operations.push(`Riga ${i+1}: sottrai (${cz(q)}) volte la riga ${row+1}.`);steps.push(m.map(r=>r.map(x=>[...x] as Z)));}pivots.push(col);row++;}const free=m[0].map((_,j)=>j).filter(j=>!pivots.includes(j)),kernel=free.map(j=>{const v=m[0].map(()=>z());v[j]=z(1);pivots.forEach((p,i)=>v[p]=neg(m[i][j]));return v;});return{matrix:m,rank:row,pivots,free,kernel,steps,operations};}
export function gram(vectors:V[]){const basis:V[]=[],records:{input:V;coefficients:Z[];projections:V[];residual:V;length:number;unit:V|null}[]=[];for(const v of vectors){const coefficients=basis.map(u=>dot(u,v)),projections=basis.map((u,i)=>vscale(u,coefficients[i]));let residual=v;for(const p of projections)residual=vsub(residual,p);const length=Math.sqrt(norm2(residual)),unit=normalize(residual);records.push({input:v,coefficients,projections,residual,length,unit});if(unit)basis.push(unit);}return{basis,records};}
export const tensor=(a:V,b:V):V=>a.flatMap(x=>b.map(y=>mul(x,y)));
export const kron=(a:Mat,b:Mat):Mat=>a.flatMap(row=>b.map(br=>row.flatMap(x=>br.map(y=>mul(x,y)))));
export const real=(a:number[][]):Mat=>a.map(r=>r.map(x=>z(x)));
export const X=real([[0,1],[1,0]]),Y:Mat=[[z(),z(0,-1)],[z(0,1),z()]],Z=real([[1,0],[0,-1]]),H=mscale(real([[1,1],[1,-1]]),z(Math.SQRT1_2));
export function qubit(theta:number,phi:number,global=0):V{const t=rad(theta)/2;return [mul(z(Math.cos(t)),cis(rad(global))),mul(scale(cis(rad(phi)),Math.sin(t)),cis(rad(global)))];}
export function bloch(v:V):R3{const n=norm2(v);if(n<1e-20)return [0,0,0];const c=mul(conj(v[0]),v[1]);return [2*c[0]/n,2*c[1]/n,(abs2(v[0])-abs2(v[1]))/n];}
export function fromBloch(r:R3):V{const t=Math.acos(Math.max(-1,Math.min(1,r[2])))*180/Math.PI,p=Math.atan2(r[1],r[0])*180/Math.PI;return qubit(t,p);}
export function measurementBasis(theta:number,phi:number):V[]{const t=rad(theta)/2,p=rad(phi);return [[z(Math.cos(t)),scale(cis(p),Math.sin(t))],[z(-Math.sin(t)),scale(cis(p),Math.cos(t))]];}
export function eigenHermitian(a:Mat){
 if(a.length!==2||!hermitian(a))throw Error('Occorre una matrice hermitiana 2 × 2');
 const t=a[0][0][0]/2+a[1][1][0]/2,q=a[0][0][0]/2-a[1][1][0]/2,b=a[0][1],r=Math.hypot(q,...b);
 if(r===0)return {values:[t,t],vectors:[[z(1),z()],[z(),z(1)]] as V[],projectors:[eye(2)],degenerate:true,axis:[0,0,1] as R3};
 // Solve in units of the spectral gap, avoiding absolute thresholds and cancellation.
 const n:R3=[b[0]/r,-b[1]/r,q/r],br:Z=[b[0]/r,b[1]/r];
 const make=(sign:number):V=>{const one:V=[br,z(sign-n[2])],two:V=[z(sign+n[2]),conj(br)];let raw=norm2(one)>=norm2(two)?one:two;const phaseElement=abs2(raw[1])>1e-28?raw[1]:raw[0];raw=vscale(raw,scale(conj(phaseElement),1/Math.hypot(...phaseElement)));return vscale(raw,z(1/Math.sqrt(norm2(raw))));};
 const u=make(1),w=make(-1);return{values:[t+r,t-r],vectors:[u,w],projectors:[outer(u),outer(w)],degenerate:false,axis:n};
}
export function spectral(a:Mat,fn:(lambda:number)=>Z):Mat{const e=eigenHermitian(a);if(e.degenerate)return mscale(eye(2),fn(e.values[0]));return madd(mscale(e.projectors[0],fn(e.values[0])),mscale(e.projectors[1],fn(e.values[1])));}
export function born(v:V,basis:V[]){return basis.map(u=>{const amplitude=dot(u,v),probability=abs2(amplitude),projection=vscale(u,amplitude);return{u,amplitude,probability,projection,post:probability>1e-16?normalize(projection):null};});}
export function observe(a:Mat,v:V){const av=mv(a,v),mean=dot(v,av),second=dot(av,av)[0],variance=Math.max(0,second-mean[0]**2);return{av,mean:mean[0],second,variance,sd:Math.sqrt(variance)};}
export function sequential(v:V,first:V[],second:V[]){return born(v,first).map(x=>second.map(u=>x.post?x.probability*abs2(dot(u,x.post)):0));}
export function rot(angle:number):Mat{const c=Math.cos(rad(angle)),s=Math.sin(rad(angle));return real([[c,-s],[s,c]]);}
export function phaseGate(angle:number):Mat{return [[z(1),z()],[z(),cis(rad(angle))]];}
export function axisGate(name:string,angle:number):Mat{if(name==='I')return eye(2);if(name==='X')return X;if(name==='Y')return Y;if(name==='Z')return Z;if(name==='R')return H;if(name==='F')return phaseGate(angle);return spectral(name==='Ux'?X:name==='Uy'?Y:Z,l=>cis(-rad(angle)*l/2));}
export function binomial(n:number,p:number):number[]{if(p===0)return Array.from({length:n+1},(_,k)=>k===0?1:0);if(p===1)return Array.from({length:n+1},(_,k)=>k===n?1:0);const logs=[0];for(let k=1;k<=n;k++)logs[k]=logs[k-1]+Math.log(k);return Array.from({length:n+1},(_,k)=>Math.exp(logs[n]-logs[k]-logs[n-k]+k*Math.log(p)+(n-k)*Math.log1p(-p)));}
export function moments(values:number[],weights:number[]){const sum=weights.reduce((a,b)=>a+b,0);if(sum<=0)return null;const p=weights.map(x=>x/sum),mean=values.reduce((s,x,i)=>s+x*p[i],0),second=values.reduce((s,x,i)=>s+x*x*p[i],0),terms=values.map((x,i)=>p[i]*(x-mean)**2);return{p,mean,second,variance:terms.reduce((a,b)=>a+b,0),terms};}
export function rng(seed=2026){let s=seed>>>0;return()=>{s+=0x6D2B79F5;let t=Math.imul(s^(s>>>15),1|s);t^=t+Math.imul(t^(t>>>7),61|t);return ((t^(t>>>14))>>>0)/4294967296;};}
export function choose(p:number[],random:()=>number){const u=random();let s=0;for(let i=0;i<p.length;i++){s+=p[i];if(u<s)return i;}return p.length-1;}
export const f=(x:number,d=4)=>Math.abs(x)<.5*10**(-d)?'0':Number(x.toFixed(d)).toLocaleString('it-IT',{maximumFractionDigits:d});
export const cz=(a:Z,d=4)=>Math.abs(a[1])<.5*10**(-d)?f(a[0],d):Math.abs(a[0])<.5*10**(-d)?`${Math.abs(a[1]-1)<1e-10?'':Math.abs(a[1]+1)<1e-10?'−':f(a[1],d)}i`:`${f(a[0],d)} ${a[1]<0?'−':'+'} ${Math.abs(Math.abs(a[1])-1)<1e-10?'':f(Math.abs(a[1]),d)}i`;
export const cv=(v:V)=>'('+v.map(x=>cz(x)).join('; ')+')ᵀ';
export const rv=(v:number[])=>'('+v.map(x=>f(x)).join('; ')+')';
export const dotTerms=(u:V,v:V)=>u.map((x,i)=>`(${cz(conj(x))})·(${cz(v[i])})`).join(' + ');
export const rowTerms=(a:Mat,v:V)=>a.map(row=>row.map((x,j)=>`(${cz(x)})·(${cz(v[j])})`).join(' + '));
export const probabilityTerms=(a:Z)=>`(${f(a[0])})² + (${f(a[1])})²`;

export function frequencyBins(n:number,p:number,zoom=false){
 const mean=n*p,sd=Math.sqrt(n*p*(1-p)),low=zoom?Math.max(0,Math.floor(mean-5*sd)):0,high=zoom?Math.min(n,Math.max(low+1,Math.ceil(mean+5*sd))):n;
 const width=Math.max(1,Math.ceil((high-low+1)/100)),axisLow=(low-.5)/n,axisHigh=(high+.5)/n;
 const coordinate=(k:number)=>65+705*((k/n-axisLow)/(axisHigh-axisLow));
 const bins=Array.from({length:Math.ceil((high-low+1)/width)},(_,i)=>{const start=low+i*width,end=Math.min(high,start+width-1);return{start,end,x:coordinate((start+end)/2),left:coordinate(start-.5),right:coordinate(end+.5)};});
 return{low,high,width,axisLow,axisHigh,coordinate,bins};
}
export const eventSet=(mask:boolean[])=>{const values=mask.flatMap((x,i)=>x?[i+1]:[]);return values.length?'{'+values.join(', ')+'}':'∅';};
