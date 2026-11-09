import * as M from '../math/core';
import * as E from './engine';
import {step,type Diagram} from '../book/types';
import {circuitExample,groverExample,fourierExample,exampleThree,type ExampleResult} from './examples';
import {evolutionSteps,qftConstructionSteps,modularAdditionSteps} from './explanation-steps';

export type Config=Record<string,number|string>;
export type Field={key:string;label:string;value:number|string;min?:number;max?:number;step?:number;options?:{value:number|string;label:string}[];help?:string};
export type ExperimentResult={worked:ExampleResult;probabilities?:number[];labels?:string[];simon?:{n:number;secret:number;fn:number[];pairs:number[][]};log?:{r:number;g:number;h:number;prime:number};interpret?:(c:number)=>ExampleResult};
const num=(key:string,label:string,value:number,min:number,max:number,inc=1,help?:string):Field=>({key,label,value,min,max,step:inc,help});
const text=(key:string,label:string,value:string,help:string):Field=>({key,label,value,help});
const opt=(key:string,label:string,value:number|string,values:(number|string)[],labels?:string[]):Field=>({key,label,value,options:values.map((v,j)=>({value:v,label:labels?.[j]??String(v)}))});
export const circuitIds=['programma','reversibilita','porte','preparazione','inversa','interferometro','registro','bell','ausiliari','sintesi','deutsch','programma-completo'];
export const isCircuit=(chapter:number,id:string)=>chapter===3&&circuitIds.includes(id);
export function fields(chapter:number,id:string):Field[]{
 const n=num('n','Qubit del registro dati',3,2,4),iterations=num('iterations','Iterazioni',2,0,8),marked=text('marked','Indici delle soluzioni','1,5','Interi distinti separati da virgole. Il campo vuoto descrive l’assenza di soluzioni.'),m=num('m','Qubit di lettura',4,2,6),seed=num('seed','Seme riproducibile',2026,0,2147483647);
 if(isCircuit(chapter,id))return [];
 if(id==='evoluzione')return[num('time','Tempo adimensionale',.5,-3,3,.1),num('steps','Passi della suddivisione',4,1,16)];
 if(id==='simon')return[num('n','Bit della funzione',3,2,5),num('secret','Segreto non nullo (intero)',5,1,31),seed];
 if(id==='deutsch-jozsa')return[n,text('truth','Tabella di f, in ordine binario','0,1,1,0,1,0,0,1','Inserire 2^n valori 0 o 1. La funzione deve essere costante oppure bilanciata.')];
 if(id==='bernstein-vazirani')return[n,num('secret','Stringa nascosta (intero)',5,0,15),opt('affine','Termine affine',0,[0,1])];
 if(id==='swap')return[num('thetaU','Angolo polare di u (gradi)',0,0,180),num('phiU','Fase di u (gradi)',0,-360,360),num('thetaV','Angolo polare di v (gradi)',90,0,180),num('phiV','Fase di v (gradi)',0,-360,360)];
 if(id==='grover'||id==='grover-primo')return[{...n,value:id==='grover-primo'?2:3},{...marked,value:id==='grover-primo'?'3':'1,5'},iterations];
 if(id==='amplificazione')return[num('p','Probabilità iniziale del sottospazio favorevole',.1,0,1,.01),iterations];
 if(id==='ricerca-ignota')return[n,marked,num('budget','Numero massimo di tentativi',12,1,40),seed];
 if(id==='minimo')return[text('values','Valori della lista','9,4,7,1,6,3,8,2','Inserire 4, 8 oppure 16 interi, anche ripetuti.'),num('budget','Numero massimo di tentativi',12,1,40),seed];
 if(id==='fourier')return[n,num('period','Passo della preparazione periodica',2,1,16),num('offset','Indice iniziale',0,0,15),num('phase','Fase fra componenti successive (gradi)',0,-180,180)];
 if(id==='qft')return[n,num('input','Indice dello stato di base',3,0,15)];
 if(id==='hadamard-test')return[num('theta','Angolo polare del bersaglio (gradi)',90,0,180),num('angle','Fase della porta P (gradi)',90,-360,360),opt('part','Componente del valore atteso','real',['real','imag'],['Reale','Immaginaria'])];
 if(id.startsWith('qpe-'))return[m,num('phase0','Autofase di |0⟩ (giri)',0,0,1,1/96),num('phase1','Autofase di |1⟩ (giri)',id==='qpe-esatta'?3/8:1/3,0,1,1/96),num('weight','Probabilità iniziale di |1⟩',1,0,1,.05),num('relative','Fase relativa della preparazione (gradi)',0,-180,180)];
 if(id==='conteggio')return[n,marked,m];
 if(id==='stima-ampiezze')return[num('theta','Angolo della preparazione Ry (gradi)',60,0,180),m];
 if(id==='aritmetica')return[num('a','Intero da invertire',7,1,200),num('N','Modulo',40,2,200),num('message','Base della potenza',9,0,199),num('exponent','Esponente',13,0,100)];
 if(id==='rsa')return[opt('p','Primo p',5,[3,5,7,11,13]),opt('q','Primo q',11,[3,5,7,11,13]),num('e','Esponente pubblico',3,3,143),num('message','Messaggio intero',7,0,168)];
 if(id==='somma')return[num('n','Bit per addendo',3,2,5),num('a','Addendo A',3,0,31),num('b','Addendo B',2,0,31)];
 if(id==='moltiplicazione')return[num('N','Modulo',15,3,31),num('a','Moltiplicatore coprimo',2,1,30),num('x','Dato x',7,0,30)];
 if(['ordine-fattori','autostati'].includes(id))return[num('N','Modulo',15,3,31),num('a','Base coprima',2,2,30),...(id==='autostati'?[num('eigen','Indice dell’autostato',1,0,30)]:[])];
 if(id==='frazioni-continue')return[num('c','Numeratore osservato',85,0,1023),num('Q','Denominatore di lettura',512,2,1024),num('N','Modulo da verificare',21,3,31),num('a','Base coprima',2,2,30)];
 if(id.startsWith('shor-'))return[opt('N','Intero da fattorizzare',id==='shor-15'?15:21,[15,21,33]),num('a','Base del tentativo',2,2,32),num('m','Qubit di lettura',id==='shor-15'?8:9,4,11)];
 if(id==='logaritmo')return[opt('prime','Modulo primo',7,[5,7,11,13]),num('g','Generatore',3,2,12),num('h','Elemento h',2,1,12)];
 throw Error('Sezione priva di esperimento: '+id);
}
export const defaults=(chapter:number,id:string):Config=>Object.fromEntries(fields(chapter,id).map(f=>[f.key,f.value]));
export function validate(chapter:number,id:string,c:Config){
 for(const f of fields(chapter,id)){
  const v=c[f.key];
  if(f.options&&!f.options.some(o=>String(o.value)===String(v)))throw Error('Valore non ammesso: '+f.label);
  if(f.min!==undefined){const x=Number(v);if(!Number.isFinite(x)||x<f.min||x>f.max!)throw Error(`${f.label}: inserire un valore fra ${f.min} e ${f.max}.`);if(f.step===1&&!Number.isInteger(x))throw Error(f.label+': occorre un intero.');}
 }
}
function list(s:number|string){const t=String(s).trim();if(!t)return[];const values=t.split(/[,;\s]+/).map(Number);if(values.some(x=>!Number.isFinite(x)||!Number.isInteger(x)))throw Error('La lista deve contenere interi separati da virgole.');return values;}
function markedSet(c:Config,N:number){const a=list(c.marked);if(a.some(x=>x<0||x>=N)||new Set(a).size!==a.length)throw Error('Gli indici delle soluzioni devono essere distinti e compresi fra 0 e '+(N-1)+'.');return a;}
function baseResult(title:string,lead:string):ExampleResult{return{title,lead,steps:[],diagram:{kind:'bars',title:'Dati del calcolo',values:[],labels:[]},conclusion:''};}
function measured(worked:ExampleResult,p?:number[],labels?:string[]):ExperimentResult{const probabilities=p??worked.state?.map(M.abs2);return{worked,probabilities,labels:labels??probabilities?.map((_,j)=>worked.n?E.binary(j,worked.n):String(j))};}
const state=(theta:number,phi:number):M.V=>[M.z(Math.cos(theta*Math.PI/360)),M.scale(M.cis(phi*Math.PI/180),Math.sin(theta*Math.PI/360))];
const add=(r:ExampleResult,title:string,formula:string,prose:string)=>r.steps.push(step(title,formula,prose));
const histogram=(r:ExampleResult,p:number[],labels?:string[])=>{r.diagram={kind:'bars',title:'Probabilità teoriche',values:p,labels:labels??p.map((_,j)=>String(j))};};
function coprime(N:number,a:number){if(a>=N||E.gcd(N,a)!==1)throw Error('La base deve essere minore del modulo e coprima con esso.');}
function addPower(r:ExampleResult,a:number,e:number,N:number,title:string){const p=E.power(a,e,N);p.rows.forEach((row,j)=>add(r,`${title} · bit ${j}`,`e=${row[0]}; b=${row[1]}; r=${row[2]}; v=${row[3]}\nr′=${row[1]?`(${row[2]}·${row[3]}) mod ${N}`:String(row[2])}=${row[5]}\nv′=${row[3]}² mod ${N}=${row[3]*row[3]%N}`,'Il bit corrente decide se moltiplicare l’accumulatore; il quadrato prepara la potenza per il bit successivo.'));add(r,title+' · risultato',`${a}^${e} mod ${N}=${p.value}`,'L’accumulatore iniziale è 1; un esponente nullo conserva tale valore.');return p.value;}

export function simonModel(n:number,secret:number,seed:number){
 if(!Number.isInteger(n)||n<2||n>5||!Number.isInteger(secret)||secret<1||secret>=2**n)throw Error('Scegliere 2–5 bit e un segreto non nullo rappresentabile con n bit.');
 const N=2**n,rng=M.rng(seed),reps=Array.from({length:N},(_,x)=>Math.min(x,x^secret)),unique=[...new Set(reps)],labels=[...unique];
 for(let j=labels.length-1;j>0;j--){const k=Math.floor(rng()*(j+1));[labels[j],labels[k]]=[labels[k],labels[j]];}
 const fn=reps.map(x=>labels[unique.indexOf(x)]),pairs=labels.map(value=>fn.flatMap((v,x)=>v===value?[x]:[]));
 const branches=pairs.map(pair=>E.hadamards(Array.from({length:N},(_,x)=>M.z(pair.includes(x)?Math.SQRT1_2:0)),n));
 const p=Array.from({length:N},(_,y)=>branches.reduce((s,v)=>s+M.abs2(v[y])*2/N,0));
 return{n,secret,fn,pairs,branches,p};
}

export function simulate(chapter:number,id:string,c:Config):ExperimentResult{
 validate(chapter,id,c);const v=(key:string)=>Number(c[key]);
 if(id==='simon'){
  const sim=simonModel(v('n'),v('secret'),v('seed')),N=2**sim.n,r=baseResult('Simon · costruzione della distribuzione',`n=${sim.n}; ${N} ingressi. La tabella rispetta la promessa di Simon. Le etichette della funzione sono permutate usando il seme indicato.`);
  add(r,'Preparare i registri',`|Ψ⟩=(1/√${N})Σ_x|x⟩|f(x)⟩`,'Gli ingressi hanno uguale ampiezza. Le coppie della funzione condividono il valore del secondo registro.');
  sim.pairs.forEach((pair,j)=>{
   add(r,'Selezionare il ramo f='+sim.fn[pair[0]],`P(f=${sim.fn[pair[0]]})=2/${N}\n|ψ_f⟩=(|${E.binary(pair[0],sim.n)}⟩+|${E.binary(pair[1],sim.n)}⟩)/√2`,'La probabilità del ramo è la somma di due probabilità 1/N. Dividere le ampiezze iniziali per la radice di 2/N produce lo stato normalizzato.');
   add(r,'Trasformare il ramo '+j,`a_f(y)=(1/√2)(1/√${N})[(-1)^(${E.binary(pair[0],sim.n)}·y)+(-1)^(${E.binary(pair[1],sim.n)}·y)]`,'Ogni esponente è un prodotto scalare binario. Due contributi dello stesso segno si sommano; segni opposti producono cancellazione. La tabella associa ogni coefficiente alla sua uscita.');
  });
  add(r,'Somma delle probabilità dei rami',`P(y)=Σ_f(2/${N})|a_f(y)|²\nΣ_y P(y)≈${M.f(sim.p.reduce((a,b)=>a+b,0))}`,'I valori del secondo registro sono ortogonali. La misura successiva viene campionata da questa marginale calcolata.');
  r.table={headers:['y',...sim.pairs.map((p,j)=>'a nel ramo '+j),'P(y)'],rows:sim.p.map((p,y)=>[E.binary(y,sim.n),...sim.branches.map(b=>M.cz(b[y],7)),M.f(p,7)])};histogram(r,sim.p,sim.p.map((_,y)=>E.binary(y,sim.n)));r.conclusion='Ogni misura fornisce y·s=0. Solo un nuovo vincolo linearmente indipendente riduce ulteriormente lo spazio delle soluzioni.';
  return{...measured(r,sim.p,sim.p.map((_,y)=>E.binary(y,sim.n))),simon:sim};
 }
 if(id==='evoluzione'){
  const t=v('time'),n=v('steps'),angle=2*t/n*180/Math.PI,gates=Array.from({length:n},()=>[{name:'Rx',target:0,angle},{name:'Rz',target:0,angle}]).flat(),r=circuitExample('Evoluzione con suddivisione modificabile',`K=X+Z; t=${t}; r=${n}.`,1,E.basis(1),gates,evolutionSteps(t,n));
  const exact=M.mv(M.madd(M.mscale(M.eye(2),M.z(Math.cos(Math.SQRT2*t))),M.mscale(M.madd(M.X,M.Z),M.z(0,-Math.sin(Math.SQRT2*t)/Math.SQRT2))),E.basis(1));
  add(r,'Confrontare con la soluzione esatta',`e^(−it(X+Z))=cos(√2t)I−i sin(√2t)(X+Z)/√2\nψ_{esatta}≈${M.cv(exact)}\n‖ψ−ψ_{esatta}‖≈${M.f(Math.sqrt(M.norm2(M.vsub(r.state!,exact))),8)}`,'L’identità (X+Z)²=2I permette di separare le potenze pari e dispari dell’esponenziale. A tempo fissato il confronto quantifica l’errore della suddivisione.');return measured(r);
 }
 if(id==='deutsch-jozsa'||id==='bernstein-vazirani'){
  const n=v('n'),N=2**n,secret=v('secret'),affine=v('affine');
  if(id==='bernstein-vazirani'&&secret>=N)throw Error('La stringa nascosta deve essere rappresentabile con n bit.');
  const truth=id==='deutsch-jozsa'?list(c.truth):Array.from({length:N},(_,x)=>E.parity(x&secret)^affine);
  if(truth.length!==N||truth.some(x=>x!==0&&x!==1))throw Error(`Occorrono esattamente ${N} valori binari.`);
  const ones=truth.reduce((a,b)=>a+b,0);if(id==='deutsch-jozsa'&&![0,N/2,N].includes(ones))throw Error('La tabella deve descrivere una funzione costante oppure bilanciata.');
  const r=baseResult('Interrogazione di una funzione modificabile',`n=${n}; N=${N}; valori della funzione assegnati dall’utente.`),out=E.phaseOracle(truth);
  add(r,'Kickback sul registro dati',`|ψ⟩=(1/√${N})Σ_x(-1)^{f(x)}|x⟩`,'Il bersaglio |−⟩ è autostato di X con autovalore −1. Il valore f(x) diventa il segno del corrispondente ramo.');
  out.forEach((a,y)=>{const signs=truth.map((f,x)=>(f^E.parity(x&y))?-1:1);add(r,'Uscita '+E.binary(y,n),`a(${E.binary(y,n)})=(${signs.join('+')})/${N}=${signs.reduce((a,b)=>a+b,0)}/${N}\nP(${E.binary(y,n)})=|a|²≈${M.f(M.abs2(a),8)}`,'Gli Hadamard sommano i contributi con il segno determinato dal prodotto binario x·y.');});
  r.state=out;r.n=n;r.table={headers:['x','f(x)','Fase'],rows:truth.map((f,x)=>[E.binary(x,n),String(f),f?'−1':'+1'])};histogram(r,out.map(M.abs2),out.map((_,j)=>E.binary(j,n)));r.conclusion=id==='deutsch-jozsa'?`La funzione assegnata è ${ones===0||ones===N?'costante':'bilanciata'}. P(0…0)≈${M.f(M.abs2(out[0]))}.`:`La lettura identifica ${E.binary(secret,n)}. Il termine affine ${affine} modifica soltanto la fase globale.`;return measured(r);
 }
 if(id==='swap'){
  const u=state(v('thetaU'),v('phiU')),w=state(v('thetaV'),v('phiV')),r=circuitExample('Test SWAP su due stati modificabili','Le preparazioni sono definite dai rispettivi angoli polari e dalle fasi relative.',3,M.tensor(E.basis(1),M.tensor(u,w)),[{name:'H',target:0},{name:'X',target:1,controls:[2]},{name:'X',target:2,controls:[0,1]},{name:'X',target:1,controls:[2]},{name:'H',target:0}]),overlap=M.dot(u,w),p=E.marginal(r.state!,3,0);
  add(r,'Prodotto interno delle preparazioni',`u=${M.cv(u)}\nv=${M.cv(w)}\n⟨u|v⟩=${M.dotTerms(u,w)}≈${M.cz(overlap)}\nP(0)=(1+|⟨u|v⟩|²)/2≈${M.f(p[0],8)}`,'La probabilità dipende dal modulo quadro del prodotto interno. Le fasi relative possono modificare la sovrapposizione.');r.extraFigures=[{kind:'bloch',title:'Preparazione u',state:u},{kind:'bloch',title:'Preparazione v',state:w}];histogram(r,p);return measured(r,p,['0','1']);
 }
 if(['grover','grover-primo','amplificazione'].includes(id)){
  const N=id==='amplificazione'?4:2**v('n'),marked=id==='amplificazione'?[3]:markedSet(c,N),p=id==='amplificazione'?v('p'):marked.length/N,k=v('iterations'),initial=id==='amplificazione'?Array.from({length:4},(_,j)=>M.z(Math.sqrt(j===3?p:(1-p)/3))):undefined;
  if(p>0&&p<1)return measured(groverExample(N,marked,k,initial));
  const stages=E.grover(N,marked,k,initial),r=baseResult('Caso limite della ricerca',`N=${N}; p=${p}; k=${k}.`);r.state=stages.at(-1)!.state;r.n=Math.log2(N);r.snapshots=stages;
  stages.forEach(s=>add(r,s.label,s.work.join('\n')+'\nψ≈'+M.cv(s.state),'Il vettore viene trasformato mantenendo la preparazione come direzione della riflessione.'));
  histogram(r,r.state.map(M.abs2));r.conclusion=p===0?'La preparazione ha probabilità nulla nel sottospazio favorevole; queste iterazioni conservano probabilità di successo zero.':'La preparazione appartiene interamente al sottospazio favorevole; la probabilità di successo resta uno.';return measured(r);
 }
 if(id==='ricerca-ignota'||id==='minimo'){
  const values=id==='minimo'?list(c.values):[],N=id==='minimo'?values.length:2**v('n');if(![4,8,16].includes(N))throw Error('La lista deve contenere 4, 8 oppure 16 interi.');
  const fixed=id==='ricerca-ignota'?markedSet(c,N):[],rng=M.rng(v('seed')),r=baseResult('Ricerca a tentativi',`N=${N}; budget=${v('budget')}; seme=${v('seed')}.`);let window=1,best=0,cost=0,found=false;
  const rows:string[][]=[];for(let t=0;t<v('budget');t++){
   const good=id==='minimo'?values.flatMap((x,j)=>x<values[best]?[j]:[]):fixed,k=Math.floor(rng()*Math.ceil(window)),out=E.grover(N,good,k).at(-1)!.state,x=M.choose(out.map(M.abs2),rng),ok=good.includes(x);cost+=k+1;
   add(r,`Tentativo ${t+1}`,`w≈${M.f(window)}; k=${k}; ψ≈${M.cv(out)}\nP(${x})≈${M.f(M.abs2(out[x]),8)}; x=${x}; interrogazioni=${k}+1`,'Si sceglie casualmente il numero di iterazioni ammesso dalla finestra; poi si campiona il registro e si verifica il candidato con una chiamata all’oracolo.');
   rows.push([String(t+1),String(k),String(x),M.f(M.abs2(out[x]),8),ok?'accettato':'nessun aggiornamento',String(cost)]);
   if(ok){found=true;if(id==='minimo'){best=x;window=1;}else break;}else window=Math.min(Math.sqrt(N),window*6/5);
  }
  r.table={headers:['Tentativo','Iterazioni','Misura','P(esito)','Verifica','Interrogazioni cumulate'],rows};
  if(id==='minimo'){const exact=Math.min(...values);r.diagram={kind:'numberline',title:'Valori della lista sulla retta',values,labels:values.map((_,j)=>'indice '+j),min:Math.min(...values)-1,max:Math.max(...values)+1};r.conclusion=`Candidato: indice ${best}, valore ${values[best]}. Controllo esaustivo separato: minimo ${exact}; ${values[best]===exact?'candidato corretto':'budget insufficiente'}. Costo del controllo: ${N} accessi aggiuntivi.`;}
  else {histogram(r,Array.from({length:N},(_,j)=>fixed.includes(j)?1:0));r.diagram.title='Indicatore delle soluzioni';r.conclusion=found?'È stato osservato e verificato un elemento favorevole.':'Il budget è esaurito senza una soluzione verificata. Questa osservazione da sola non dimostra che non esistano soluzioni.';}
  r.cost=`${cost} interrogazioni, inclusa la verifica dei candidati.${id==='minimo'?` Il controllo finale aggiunge ${N} accessi alla lista.`:''}`;return{worked:r};
 }
 if(id==='fourier'){
  const n=v('n'),N=2**n,period=v('period'),offset=v('offset');if(offset>=N||period>N)throw Error('Passo e indice iniziale devono rientrare nella dimensione del registro.');
  const raw=Array.from({length:N},(_,x)=>x>=offset&&(x-offset)%period===0?M.cis((x-offset)/period*v('phase')*Math.PI/180):M.z());const r=fourierExample(n,M.normalize(raw)!);r.steps.unshift(step('Normalizzare la preparazione assegnata',`v=${M.cv(raw)}\n‖v‖²=${raw.map(z=>M.f(M.abs2(z),8)).join('+')}≈${M.f(M.norm2(raw),8)}\nψ=v/√(${M.f(M.norm2(raw),8)})`,'La fase assegnata moltiplica componenti successive della progressione aritmetica degli indici. Si conservano soltanto gli indici entro il registro.'));return measured(r);
 }
 if(id==='qft'){
  const n=v('n'),x=v('input');if(x>=2**n)throw Error('L’indice di ingresso deve essere minore di 2^n.');const gates=E.qftGates(n);for(let j=0;j<Math.floor(n/2);j++){const b=n-1-j;gates.push({name:'X',target:b,controls:[j]},{name:'X',target:j,controls:[b]},{name:'X',target:b,controls:[j]});}
  const r=circuitExample('QFT con ingresso modificabile',`n=${n}; ingresso ${E.binary(x,n)}.`,n,E.basis(n,x),gates,qftConstructionSteps(n,x));add(r,'Confronto con la trasformata diretta',`‖ψ−F|${x}⟩‖≈${M.f(Math.sqrt(M.norm2(M.vsub(r.state!,E.qft(E.basis(n,x))))),10)}`,'La verifica confronta tutte le ampiezze, comprese le fasi e l’ordine dei bit.');return measured(r);
 }
 if(id==='hadamard-test'){
  const u=state(v('theta'),0),imag=c.part==='imag',angle=v('angle'),r=circuitExample('Valore atteso di una fase controllata',`Bersaglio Ry(${v('theta')}°)|0⟩; U=P(${angle}°).`,2,M.tensor(E.basis(1),u),[{name:'H',target:0},{name:'P',target:1,controls:[0],angle},...(imag?[{name:'P',target:0,angle:-90}]:[]),{name:'H',target:0}]),overlap=M.dot(u,M.mv(M.phaseGate(angle),u)),p=E.marginal(r.state!,2,0);
  add(r,'Valore atteso e lettura',`⟨u|U|u⟩≈${M.cz(overlap,8)}\nP(0)=(1+${imag?'Im':'Re'}⟨u|U|u⟩)/2≈${M.f(p[0],8)}`,'La somma delle probabilità sui valori del bersaglio fornisce la marginale del controllo.');histogram(r,p);return measured(r,p,['0','1']);
 }
 if(id.startsWith('qpe-')||id==='conteggio'||id==='stima-ampiezze')return phaseExperiment(id,c);
 if(id==='aritmetica'||id==='rsa'){
  const rsa=id==='rsa',p=v('p'),q=v('q'),N=rsa?p*q:v('N'),a=rsa?v('e'):v('a'),mod=rsa?(p-1)*(q-1)/E.gcd(p-1,q-1):N,message=v('message'),r=baseResult(rsa?'RSA con parametri modificabili':'Aritmetica modulare',`N=${N}; ${rsa?'e':'a'}=${a}; messaggio=${message}.`);
  if(rsa&&p===q)throw Error('Scegliere due primi distinti.');if(message>=N)throw Error('Il messaggio deve essere minore di N.');if(rsa&&(a>=mod||E.gcd(a,mod)!==1))throw Error('e deve essere minore di λ(N) e coprimo con λ(N).');
  if(rsa)add(r,'Dai primi al modulo degli esponenti',`N=${p}·${q}=${N}\nλ(N)=(${p}-1)(${q}-1)/gcd(${p-1},${q-1})=${mod}`,'La conoscenza dei fattori permette di calcolare il modulo necessario per invertire l’esponente pubblico.');
  const eu=E.euclid(a,mod),inv=E.inverse(a,mod);eu.rows.forEach((x,j)=>add(r,'Divisione euclidea '+j,`${x[0]}=${x[2]}·${x[1]}+${x[3]}\n${x[3]}=${a}·(${x[4]})+${mod}·(${x[5]})`,'La stessa sottrazione aggiorna resto e coefficienti della combinazione lineare.'));
  add(r,'Identità di Bézout',`${a}·(${eu.s})+${mod}·(${eu.t})=${eu.gcd}${inv===null?'':`\n${a}⁻¹ mod ${mod}=${inv}; ${a}·${inv} mod ${mod}=1`}`,inv===null?'Il massimo comune divisore è diverso da uno: l’inverso non esiste.':'Il coefficiente di a ridotto modulo il modulo è l’inverso cercato.');
  const encrypted=addPower(r,message,rsa?a:v('exponent'),N,rsa?'Cifratura':'Potenza');
  if(rsa){const decrypted=addPower(r,encrypted,inv!,N,'Decifratura');for(const prime of [p,q])add(r,'Correttezza modulo '+prime,message%prime===0?`m≡0 mod ${prime} ⇒ m^(ed)≡0`:`ed=${a}·${inv}=${a*inv!}=1+${(a*inv!-1)/(prime-1)}·${prime-1}\nm^${prime-1}≡1 mod ${prime} ⇒ m^(ed)≡m mod ${prime}`,'Si usa il residuo zero nel caso divisibile; negli altri casi si applica il piccolo teorema di Fermat.');r.conclusion=`c=${encrypted}; d=${inv}; messaggio recuperato=${decrypted}. Conoscendo p e q si è ricostruito d: questo è il collegamento fra fattorizzazione con Shor e vulnerabilità di RSA.`;}
  else r.conclusion=`Potenza calcolata: ${encrypted}; ${inv===null?'inverso inesistente':'inverso verificato: '+inv}.`;
  r.diagram={kind:'orbit',title:'Residui delle potenze della base',values:Array.from({length:Math.min(12,N)},(_,j)=>E.powmod(message,j,N))};return{worked:r};
 }
 if(id==='somma'){
  const n=v('n'),a=v('a'),b=v('b');if(a>=2**n||b>=2**n)throw Error('Gli addendi devono essere rappresentabili con n bit.');const r=baseResult('Somma reversibile',`n=${n}; a=${a}; b=${b}.`),net=E.ripple(a,b,n);let carry=0;
  for(let j=0;j<n;j++){const x=(a>>j)&1,y=(b>>j)&1,total=x+y+carry,next=total>=2?1:0;add(r,'Colonna di peso '+2**j,`a_${j}=${x}; b_${j}=${y}; c_${j}=${carry}\ns_${j}=${x}⊕${y}⊕${carry}=${total%2}\nc_${j+1}=(${x}·${y})⊕(${x}·${carry})⊕(${y}·${carry})=${next}`,'La parità determina il bit della somma; almeno due bit unitari producono un riporto.');carry=next;}
  add(r,'Risultato e pulizia',`${a}+${b}=${net.sum}+${2**n}·${net.carryOut}\nS=${E.binary(net.sum,n)}`,'Dopo aver copiato la somma si percorrono in ordine inverso le porte dei riporti. Il trabocco è un valore intermedio; per conservarlo occorrerebbe copiarlo prima della pulizia.');r.table={headers:['Passo','Porta','Fili','Stato'],rows:net.records.map((x,j)=>[String(j+1),x.gate.label,x.gate.targets.join(','),x.bits.join('')])};histogram(r,Array.from({length:n},(_,j)=>(net.sum>>j)&1));r.diagram.title='Bit della somma, dal meno significativo';r.conclusion=`Somma modulo ${2**n}: ${net.sum}. Ausiliari ripristinati: ${net.clean?'sì':'no'}.`;return{worked:r};
 }
 if(id==='moltiplicazione'){
  const N=v('N'),a=v('a'),x=v('x');coprime(N,a);if(x>=N)throw Error('x deve essere minore di N.');const product=E.modularMultiply(a,x,N),r=baseResult('Prodotto modulare modificabile',`a=${a}; x=${x}; N=${N}.`);
  for(const row of product.rows){add(r,'Bit '+row.j,`k_${row.j}=${a}·2^${row.j} mod ${N}=${row.constant}\nx_${row.j}=${row.bit}\nt=${row.acc}+${row.bit}·${row.constant}=${row.sum}\nr′=${row.sum}${row.subtract?'−'+N:''}=${row.next}`,'Ogni accumulatore e ogni costante sono minori di N; una sottrazione è sufficiente per la riduzione.');}
  const inv=E.inverse(a,N)!;add(r,'Inversa e pulizia',`${a}⁻¹ mod ${N}=${inv}\n${a}·${x}=${Math.floor(a*x/N)}·${N}+${product.value}\nP⁻¹(P(${x}))=${inv}·${product.value} mod ${N}=${x}`,'La permutazione è estesa come identità agli stati binari fuori dominio. Applicare l’inversa cancella il registro di lavoro dopo lo scambio.');r.diagram={kind:'orbit',title:'Accumulatore dopo ogni bit',values:[0,...product.rows.map(q=>q.next)]};r.conclusion=`Il risultato ${product.value} coincide con il resto del prodotto intero.`;return{worked:r};
 }
 if(id==='ordine-fattori'||id==='autostati'){
  const N=v('N'),a=v('a');coprime(N,a);const cycle=E.orbit(N,a),order=cycle.length,index=v('eigen');if(id==='autostati'&&index>=order)throw Error('L’indice dell’autostato deve essere minore dell’ordine '+order+'.');const r=baseResult('Orbita della moltiplicazione',`N=${N}; a=${a}.`);
  cycle.forEach((x,j)=>add(r,'Passo '+j,`${a}·${x}=${Math.floor(a*x/N)}·${N}+${a*x%N}`,'Il primo ritorno al residuo 1 determina l’ordine in questa verifica classica.'));add(r,'Ordine',`${a}^${order} mod ${N}=1; r=${order}`,'L’orbita viene usata per studiare l’operatore; il simulatore di Shor costruisce separatamente la distribuzione senza ricevere questo ordine.');
  if(id==='autostati'){const coefficients=cycle.map((_,j)=>M.scale(M.cis(-2*Math.PI*index*j/order),1/Math.sqrt(order))),shifted=coefficients.map((_,j)=>coefficients[(j+order-1)%order]),lambda=M.cis(2*Math.PI*index/order);add(r,'Costruire l’autostato',`|u_${index}⟩=(1/√${order})Σ_j e^(−2πi·${index}j/${order})|${a}^j mod ${N}⟩\nλ=e^(2πi·${index}/${order})≈${M.cz(lambda)}`,'La moltiplicazione sposta ogni residuo nel successivo. Il coefficiente che arriva in posizione j proviene dalla posizione j−1.');coefficients.forEach((z,j)=>add(r,'Coefficiente sul residuo '+cycle[j],`c_${j}≈${M.cz(z,7)}\nc′_${j}=c_${(j+order-1)%order}≈${M.cz(shifted[j],7)}\nλc_${j}≈${M.cz(M.mul(lambda,z),7)}`,'Il confronto verifica la stessa fase moltiplicativa su ciascuna componente.'));r.extraFigures=[{kind:'vectors',title:'Coefficienti dell’autostato nel piano complesso',axisLabels:['Re','Im'],vectors:coefficients.map((z,j)=>({v:z,label:String(cycle[j])})),circles:[1/Math.sqrt(order)],extent:1}];r.conclusion='La rotazione comune delle ampiezze è l’autovalore; una potenza controllata rende questa fase relativa sul controllo.';}
  else {const half=order%2===0?E.powmod(a,order/2,N):null;add(r,'Fattorizzazione',half===null?`r=${order} dispari`:`t=${a}^${order/2} mod ${N}=${half}\ngcd(t−1,N)=${E.gcd(half-1,N)}\ngcd(t+1,N)=${E.gcd(half+1,N)}`,'Si accettano soltanto divisori propri. Un ordine dispari o una radice ±1 richiedono una nuova base.');r.conclusion='Il ritorno periodico e la fattorizzazione riuscita sono condizioni da verificare separatamente.';}
  r.diagram={kind:'orbit',title:'Orbita dei residui',values:cycle};return{worked:r};
 }
 if(id==='frazioni-continue'){if(v('c')>=v('Q'))throw Error('c deve essere minore di Q.');coprime(v('N'),v('a'));return{worked:recoverExample(v('c'),v('Q'),v('N'),v('a'))};}
 if(id.startsWith('shor-'))return shorExperiment(v('N'),v('a'),v('m'));
 if(id==='logaritmo')return logarithmExperiment(v('prime'),v('g'),v('h'));
 throw Error('Esperimento non implementato: '+id);
}

export function recoverExample(c:number,Q:number,N:number,a:number):ExampleResult{
 const r=baseResult('Dall’esito ai candidati di periodo',`c=${c}; Q=${Q}; N=${N}; a=${a}.`),cf=E.continuedFraction(c,Q);
 add(r,'Rapporto misurato e condizioni iniziali',`c/Q=${c}/${Q}\np_{−2}=0; p_{−1}=1; q_{−2}=1; q_{−1}=0`,'Ogni quoziente euclideo aggiorna numeratore e denominatore del convergente.');
 cf.forEach((x,j)=>add(r,'Convergente '+j,`${x.a}=${x.quotient}·${x.b}+${x.remainder}\np_${j}=${x.quotient}·${j?cf[j-1].p:1}+${j>1?cf[j-2].p:j===1?1:0}=${x.p}\nq_${j}=${x.quotient}·${j?cf[j-1].q:0}+${j>1?cf[j-2].q:j===1?0:1}=${x.q}\np_${j}/q_${j}=${x.p}/${x.q}`,'Le divisioni sono fra interi. La precisione decimale non interviene nella costruzione.'));
 const candidates=E.recover(c,Q,N,a);candidates.forEach(x=>{add(r,'Verificare denominatore '+x.q,`${a}^${x.q} mod ${N}=${E.powmod(a,x.q,N)}`,x.period?'Il candidato è un esponente di ritorno verificato.':'Il candidato non è un esponente di ritorno.');if(x.period&&x.t!==null)add(r,'Provare i divisori',`t=${a}^${x.q/2} mod ${N}=${x.t}\ngcd(t−1,${N})=${E.gcd(x.t-1,N)}\ngcd(t+1,${N})=${E.gcd(x.t+1,N)}`,'Si conservano i divisori propri che dividono N senza resto.');});
 const factors=[...new Set(candidates.flatMap(x=>x.factors))];r.conclusion=factors.length?`Divisori verificati: ${factors.join(', ')}.`:'Questo esito non fornisce fattori utili con i convergenti verificati; occorre ripetere il tentativo.';
 r.diagram={kind:'numberline',title:'Rapporto e convergenti',values:[c/Q,...cf.map(x=>x.p/x.q)],labels:[`${c}/${Q}`,...cf.map(x=>`${x.p}/${x.q}`)],min:0,max:1};return r;
}

function phaseExperiment(id:string,c:Config):ExperimentResult{
 const m=Number(c.m),Q=2**m,estimation=id==='conteggio'||id==='stima-ampiezze';let N:number,initial:M.V,transform:(v:M.V)=>M.V,description:string,marked:number[]=[];
 if(estimation){N=id==='conteggio'?2**Number(c.n):2;marked=id==='conteggio'?markedSet(c,N):[1];initial=id==='conteggio'?Array.from({length:N},()=>M.z(1/Math.sqrt(N))):state(Number(c.theta),0);transform=v=>{const o=v.map((z,j)=>M.scale(z,marked.includes(j)?-1:1));return M.vsub(M.vscale(initial,M.scale(M.dot(initial,o),2)),o);};description=`N=${N}; G={${marked.join(',')}}. La preparazione e l’oracolo costruiscono Q_G=D_AO.`;}
 else {N=2;const weight=Number(c.weight);initial=[M.z(Math.sqrt(1-weight)),M.scale(M.cis(Number(c.relative)*Math.PI/180),Math.sqrt(weight))];const phases=[Number(c.phase0),Number(c.phase1)];transform=v=>v.map((z,j)=>M.mul(z,M.cis(2*Math.PI*phases[j])));description=`U=diag(e^(2πi·${phases[0]}),e^(2πi·${phases[1]})); m=${m}.`;}
 // Build every U^x|psi> through applications of U; no eigenphase or known probability enters QPE for counting.
 const powers:M.V[]=[initial];for(let x=1;x<Q;x++)powers.push(transform(powers.at(-1)!));
 const transformed=Array.from({length:N},(_,y)=>E.fft(powers.map(v=>M.scale(v[y],1/Math.sqrt(Q))),true));
 const probabilities=Array.from({length:Q},(_,x)=>transformed.reduce((s,v)=>s+M.abs2(v[x]),0));
 const r=baseResult(estimation?'Stima operativa con potenze controllate':'QPE su una preparazione modificabile',description);
 add(r,'Preparare e controllare le potenze',`|Ψ⟩=(1/√${Q})Σ_x|x⟩U^x|ψ⟩\n|ψ⟩≈${M.cv(initial)}`,'La simulazione costruisce gli stati U^x|ψ⟩ applicando l’operatore ai vettori. La composizione binaria delle potenze controllate produce lo stesso stato congiunto.');
 r.table={headers:['x',...Array.from({length:N},(_,y)=>'Ampiezza sul dato '+y)],rows:powers.map((v,x)=>[String(x),...v.map(z=>M.cz(z,8))])};
 const products:string[][]=[];
 for(let x=1;x<Q;x++){
  if(estimation){const previous=powers[x-1],oracle=previous.map((z,y)=>M.scale(z,marked.includes(y)?-1:1)),overlap=M.dot(initial,oracle);
   products.push([String(x),'Prodotto interno',`⟨a|Oψ⟩=${M.dotTerms(initial,oracle)}≈${M.cz(overlap,8)}`]);
   for(let y=0;y<N;y++)products.push([String(x),String(y),`Oψ(${y})=${marked.includes(y)?'-':''}(${M.cz(previous[y],8)})≈${M.cz(oracle[y],8)}; (D_AOψ)(${y})=2·(${M.cz(initial[y],8)})·(${M.cz(overlap,8)})−(${M.cz(oracle[y],8)})≈${M.cz(powers[x][y],8)}`]);
  }else for(let y=0;y<N;y++){const phase=Number(c[y?'phase1':'phase0']),factor=M.cis(2*Math.PI*phase);products.push([String(x),String(y),`e^(2πi·${phase})·(${M.cz(powers[x-1][y],8)})=(${M.cz(factor,8)})·(${M.cz(powers[x-1][y],8)})≈${M.cz(powers[x][y],8)}`]);}
 }
 r.extra=[{title:'Tutti i prodotti delle applicazioni successive di U',mathColumns:[2],headers:['Potenza x','Componente','Prodotti e risultato'],rows:products}];

 add(r,'Fourier inversa sul controllo',`A(c,y)=(1/${Q})Σ_x e^(−2πixc/${Q})[U^xψ]_y\nP(c)=Σ_y|A(c,y)|²`,'Per ogni dato y si sommano le ampiezze dei rami x. La marginale del controllo somma i moduli quadri sui dati ortogonali.');
 histogram(r,probabilities);r.conclusion='La distribuzione deriva dall’operatore e dalla preparazione. Una misura seleziona un esito e permette di svilupparne il calcolo e lo stato condizionato.';r.cost=`${m} qubit di lettura; ${Math.log2(N)} qubit dati. ${Q-1} applicazioni dell’operatore nella simulazione per ripetizione. Le operazioni controllate sono simulate a livello di vettori; la sintesi elementare non è inclusa.`;
 const interpret=(observed:number)=>{
  const out=baseResult('Analisi dell’esito '+observed,`c/Q=${observed}/${Q}; P(c)≈${M.f(probabilities[observed],10)}.`);
  for(let y=0;y<N;y++)add(out,'Ampiezza congiunta sul dato '+y,`A(${observed},${y})=(1/${Q})[${powers.map((w,x)=>`(${M.cz(w[y],7)})e^(−2πi·${x}·${observed}/${Q})`).join('+')}]\n≈${M.cz(transformed[y][observed],9)}`,'Ogni addendo proviene dalla corrispondente riga della tabella U^x|ψ⟩.');
  add(out,'Marginale dell’esito',`P(${observed})=${transformed.map(v=>M.f(M.abs2(v[observed]),10)).join('+')}≈${M.f(probabilities[observed],10)}`,'I diversi dati del bersaglio sono ortogonali.');
  if(probabilities[observed]>0){const conditional=transformed.map(v=>M.scale(v[observed],1/Math.sqrt(probabilities[observed])));add(out,'Bersaglio condizionato',`|ψ_c⟩≈${M.cv(conditional)}\n‖ψ_c‖²≈${M.f(M.norm2(conditional))}`,'Ogni ampiezza congiunta viene divisa per √P(c).');out.state=conditional;out.n=Math.log2(N);out.diagram={kind:'complex',title:'Ampiezze condizionate',state:conditional};}
  if(estimation){const estimate=Math.sin(Math.PI*observed/Q)**2,actual=id==='conteggio'?markedSet(c,N).length/N:M.abs2(initial[1]);add(out,'Convertire la lettura',`p̂=sin²(π·${observed}/${Q})≈${M.f(estimate,8)}${id==='conteggio'?`\nM̂=${N}p̂≈${M.f(N*estimate,8)}`:''}\np_{verifica}=${M.f(actual,8)}`,'Il valore di controllo viene calcolato separatamente sui dati assegnati. La distribuzione è stata costruita dall’azione dell’operatore, senza ricevere p come autofase.');}
  let tip:M.R2=[0,0];const arrows=powers.map((w,x)=>{const term=M.scale(M.mul(w[0],M.cis(-2*Math.PI*x*observed/Q)),1/Q),from:M.R2=[...tip];tip=M.add(tip,term);return{v:term,from,label:''};});out.extraFigures=[{kind:'vectors',title:'Somma delle ampiezze per il dato y=0',axisLabels:['Re','Im'],vectors:[...arrows,{v:tip,label:'somma'}],extent:1.1}];
  out.conclusion='La risoluzione finita del registro produce una distribuzione di stime. Ripetere l’esperimento permette di confrontare le frequenze con le probabilità teoriche.';return out;
 };
 return{worked:r,probabilities,labels:probabilities.map((_,j)=>String(j)),interpret};
}

function shorExperiment(N:number,a:number,m:number):ExperimentResult{
 if(a>=N)throw Error('La base deve essere minore di N.');const d=E.gcd(a,N);if(d!==1){const r=baseResult('Fattore trovato nel controllo classico',`N=${N}; a=${a}.`);add(r,'Massimo comune divisore',`gcd(${a},${N})=${d}\n${N}=${d}·${N/d}`,'La scelta della base ha già fornito un divisore proprio; il circuito di ricerca dell’ordine non è necessario per questo tentativo.');r.conclusion='Il controllo classico preliminare conclude la fattorizzazione.';return{worked:r};}
 const sim=E.shor(N,a,m),r=baseResult('Shor · tentativo modificabile',`N=${N}; a=${a}; m=${m}; Q=${sim.Q}. ${sim.Q<N*N?'La precisione scelta è inferiore alla soglia N²: il recupero può diventare più difficile.':'La precisione soddisfa Q≥N².'}`);
 add(r,'Preparazione',`|Ψ_0⟩=(1/√${sim.Q})Σ_x|x⟩|1⟩`,'L’esponente è uniforme. Il registro dati parte dal residuo 1.');
 sim.constants.forEach((b,j)=>add(r,'Potenza binaria '+j,`${j?`b_${j}=(${sim.constants[j-1]})² mod ${N}`:`b_0=${a} mod ${N}`}=${b}\nx_${j}=1 ⇒ |y⟩↦|${b}y mod ${N}⟩`,'La costante è ricavata per quadrati successivi. Le parole fuori dominio restano fisse e la moltiplicazione è reversibile.'));
 r.table={headers:['x','Stringa binaria','a^x mod N'],rows:sim.values.map((y,x)=>[String(x),E.binary(x,m),String(y)])};
 add(r,'Trasformazione e marginale',`A(c,y)=(1/${sim.Q})Σ_{x:a^x mod N=y} e^(−2πixc/${sim.Q})\nP(c)=Σ_y|A(c,y)|²`,'L’ordine non è un ingresso del calcolo. La distribuzione nasce dai valori dell’esponenziazione e dalla Fourier inversa.');histogram(r,sim.p);r.conclusion='Eseguire una misura per ottenere c; le frazioni continue e i test modulari verificheranno i candidati.';r.cost=`${m} qubit di lettura, ${sim.n} qubit dati; reti modulari verificate su piccoli registri. La sintesi per mintermini ha costo esponenziale e serve a questi esempi didattici.`;
 const interpret=(c:number)=>{const out=recoverExample(c,sim.Q,N,a),residues=[...new Set(sim.values)];const extra=residues.map(y=>step('Ampiezza del ramo bersaglio '+y,`A(${c},${y})=(1/${sim.Q})[${sim.values.flatMap((v,x)=>v===y?[`e^(−2πi·${c}·${x}/${sim.Q})`]:[]).join('+')}]\n≈${M.cz(sim.transformed[y][c],9)}`,'Sono riportati tutti gli esponenti che producono questo residuo.'));out.steps.unshift(...extra,step('Probabilità dell’esito',`P(${c})=${residues.map(y=>M.f(M.abs2(sim.transformed[y][c]),10)).join('+')}≈${M.f(sim.p[c],10)}`,'Si sommano le probabilità dei bersagli ortogonali.'));return out;};return{worked:r,probabilities:sim.p,labels:sim.p.map((_,j)=>String(j)),interpret};
}

function logarithmExperiment(prime:number,g:number,h:number):ExperimentResult{
 if(g>=prime||h>=prime)throw Error('g e h devono essere residui non nulli minori del primo.');const r=E.orbit(prime,g).length;if(r!==prime-1)throw Error('g deve generare il gruppo moltiplicativo: scegliere un elemento di ordine p−1.');
 const hi=E.inverse(h,prime)!,fn=Array.from({length:r},(_,a)=>Array.from({length:r},(_,b)=>E.powmod(g,a,prime)*E.powmod(hi,b,prime)%prime)),p=Array(r*r).fill(0);
 for(const value of new Set(fn.flat())){const branch=fn.map(row=>E.qft(row.map(x=>M.z(x===value?1/r:0))));for(let v=0;v<r;v++){const col=E.qft(branch.map(row=>row[v]));col.forEach((z,u)=>p[u*r+v]+=M.abs2(z));}}
 const out=baseResult('Logaritmo discreto su un piccolo gruppo',`p=${prime}; g=${g}; h=${h}; ordine r=${r}.`);
 add(out,'Funzione periodica su due registri',`f(a,b)=${g}^a·${h}^(−b) mod ${prime}\n${h}⁻¹ mod ${prime}=${hi}`,'La tabella è costruita da g e h; l’esponente cercato d rimane incognito.');out.table={headers:['a','b','f(a,b)'],rows:fn.flatMap((row,a)=>row.map((f,b)=>[String(a),String(b),String(f)]))};
 add(out,'Due Fourier e marginale',`A_k(u,v)=(1/r²)Σ_{a,b:f(a,b)=k} e^(2πi(au+bv)/r)\nP(u,v)=Σ_k|A_k(u,v)|²`,'I rami qui conservano l’ampiezza congiunta 1/r; ogni Fourier contribuisce 1/√r. La distribuzione viene calcolata dalla tabella.');
 add(out,'Interpretare le misure',`h=g^d ⇒ f(a,b)=g^(a−db)\ndu+v≡0 mod ${r}`,'Dopo ciascuna misura si conservano tutti gli esponenti compatibili con la congruenza. L’intersezione riduce i candidati; il confronto g^d=h verifica il risultato.');histogram(out,p,p.map((_,j)=>`${Math.floor(j/r)},${j%r}`));out.extraFigures=[{kind:'grid',title:'Coppie con f(a,b)=1',points:fn.flatMap((row,a)=>row.flatMap((f,b)=>f===1?[{x:a,y:b,label:`${a},${b}`,value:1/r}]:[])),xMax:r-1,yMax:r-1,xLabel:'a',yLabel:'b'}];out.conclusion='Gli indici sono coordinate discrete modulo r. La Fourier su r livelli viene applicata come matrice; la sintesi binaria è fuori dal modello quando r non è una potenza di due.';return{worked:out,probabilities:p,labels:p.map((_,j)=>`${Math.floor(j/r)},${j%r}`),log:{r,g,h,prime}};
}
