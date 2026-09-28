import * as M from '../math/core';
import type {Diagram,WorkedExample,WorkStep} from './types';
import {step} from './types';

const rv=(xs:number[])=>xs.map(x=>M.z(x));
const xy=(v:M.V)=>v.map(z=>z[0]) as M.R2;
const mat=(A:M.Mat)=>'['+A.map(r=>'['+r.map(z=>M.cz(z)).join(', ')+']').join(', ')+']';
const vectors=(title:string,vs:M.V[],labels:string[],extent?:number):Diagram=>({kind:'vectors',title,vectors:vs.map((v,j)=>({v:xy(v),label:labels[j]})),extent});
const bars=(title:string,values:number[],labels:string[]):Diagram=>({kind:'bars',title,values,labels});
const complex=(title:string,state:M.V,labels:string[]):Diagram=>({kind:'complex',title,state,labels});
const plus=rv([Math.SQRT1_2,Math.SQRT1_2]),minus=rv([Math.SQRT1_2,-Math.SQRT1_2]);
const labels4=['00','01','10','11'];

/** Each branch introduces only the objects needed by its own reading objective. */
export function revisedExample(mode:string,k:number):WorkedExample|undefined{
 const steps:WorkStep[]=[],extraFigures:Diagram[]=[];
 const S=(title:string,formula:string,text:string)=>steps.push(step(title,formula,text));
 const finish=(title:string,lead:string,diagram:Diagram,conclusion:string,state?:M.V):WorkedExample=>({title,lead,steps,diagram,conclusion,extraFigures,state,n:state?Math.log2(state.length):undefined});
 if(mode==='norma'){
  const u=k?[M.z(1,1),M.z(0,2)]:rv([3,4]),n=M.norm2(u),unit=M.normalize(u)!;
  S('Calcolare i moduli quadri',u.map((z,j)=>`|u${j+1}|²=(${z[0]})²+(${z[1]})²=${M.abs2(z)}`).join('\n'),'Ogni componente complessa contribuisce mediante entrambe le sue coordinate reali.');
  S('Sommare e prendere la radice',`‖u‖²=${u.map(M.abs2).join('+')}=${n}; ‖u‖=√${n}≈${M.f(Math.sqrt(n))}`,'Il totale è positivo perché u non è nullo.');
  S('Dividere ogni componente',`e=u/√${n}≈${M.cv(unit)}\n‖e‖²=(${u.map(M.abs2).join('+')})/${n}=1`,'Il medesimo fattore positivo conserva la direzione del vettore e le fasi delle componenti.');
  S('Separare il caso nullo','u=0 ⇒ ‖u‖=0; u/‖u‖ non definito','L’origine non individua una direzione da rendere unitaria.');
  return finish(k?'Normalizzare componenti complesse':'Il triangolo 3–4–5',`Dato u=${M.cv(u)}.`,k?complex('Componenti prima e dopo la normalizzazione',[...u,...unit],['u₁','u₂','e₁','e₂']):vectors('Una direzione con due lunghezze',[u,unit],['u','u/‖u‖']),k?'La norma è √6: entrambi i piani delle componenti vengono riscalati dello stesso fattore 1/√6.':'La lunghezza 5 diventa 1; le coordinate (3/5,4/5) conservano il rapporto 3:4.');
 }
 if(mode==='stati'||mode==='bra'){
  const a=k?1:2,n=a*a+1,raw=[M.z(a),M.z(0,1)],v=M.normalize(raw)!,r=M.bloch(v),P=M.outer(v);
  S('Normalizzare il dato',`‖(${a},i)ᵀ‖²=${a}²+|i|²=${n}\nψ=(${a},i)ᵀ/√${n}; α=${a}/√${n}; β=i/√${n}`,'I coefficienti sono riferiti alla base |0⟩=(1,0)ᵀ, |1⟩=(0,1)ᵀ.');
  if(mode==='bra'){
   S('Trasporre e coniugare','|ψ⟩ colonna ⇒ ⟨ψ| riga\n'+`⟨ψ|=(${a},−i)/√${n}`,'La trasposizione cambia la forma del vettore; il coniugio cambia i in −i.');
   S('Moltiplicare riga per colonna',`⟨ψ|ψ⟩=[${a}·${a}+(−i)i]/${n}=(${a*a}+1)/${n}=1\n⟨0|ψ⟩=${a}/√${n}; ⟨1|ψ⟩=i/√${n}`,'Il primo prodotto controlla la norma; gli altri due estraggono le coordinate nella base canonica.');
   S('Moltiplicare colonna per riga',`P=|ψ⟩⟨ψ|=(1/${n})[[${a*a},−${a}i],[${a}i,1]]\nP₀₀=αα*; P₀₁=αβ*; P₁₀=βα*; P₁₁=ββ*`,'L’ordine invertito produce una matrice 2×2, il proiettore sulla direzione ψ.');
   S('Verificare l’azione del proiettore',`Pψ=ψ(⟨ψ|ψ⟩)=ψ\nP²=|ψ⟩(⟨ψ|ψ⟩)⟨ψ|=P\nP|0⟩=(${a*a},${a}i)ᵀ/${n}`,'Applicare il proiettore a ψ lo conserva; applicarlo a un altro vettore ne estrae la componente lungo ψ.');
   extraFigures.push(complex('Elementi del prodotto esterno',P.flat(),['P₀₀','P₀₁','P₁₀','P₁₁']));
  }else{
   S('Interpretare i moduli quadri',`|α|²=${a*a}/${n}; |β|²=1/${n}; |α|²+|β|²=1`,'Per una misura nella base dichiarata, i due moduli quadri sono le probabilità degli esiti 0 e 1. La regola generale per altre basi verrà costruita con i proiettori.');
   S('Eliminare una fase comune',`iψ=(${a}i,−1)ᵀ/√${n}\n(iα)*(iβ)=α*β; |iα|²=|α|²; |iβ|²=|β|²`,'Le quantità usate per descrivere lo stato sono invarianti sotto una fase globale.');
  }
  S('Costruire le coordinate di Bloch',`α*β=${a}i/${n}\nrₓ=2Re(α*β)=0; rᵧ=2Im(α*β)=${2*a}/${n}; r𝓏=|α|²−|β|²=${a*a-1}/${n}\nr=${M.rv(r)}; ‖r‖²=(${2*a}/${n})²+(${a*a-1}/${n})²=1`,'La sfera è ottenuta dalle ampiezze e identifica vettori che differiscono per una fase globale. Le sue coordinate sono adimensionali.');
  if(mode==='stati')S('Ricavare mezzo angolo e probabilità',`cos θ=r𝓏=${a*a-1}/${n}; θ≈${M.f(Math.acos(r[2])*180/Math.PI)}°; φ=90°\n|α|=cos(θ/2); |β|=sin(θ/2)\nP(0)=(1+r𝓏)/2=${a*a}/${n}`,'L’identità cos²(θ/2)=(1+cos θ)/2 spiega il mezzo angolo. θ è un angolo sulla sfera di Bloch, non la fase relativa φ.');
  return finish(mode==='bra'?(k?'Prodotto esterno sullo stato equatoriale':'Bra e proiettore sullo stato assegnato'):(k?'Stato equatoriale con fase π/2':'Dalle ampiezze alla latitudine di Bloch'),`Dati ψ grezzo=(${a},i)ᵀ e base computazionale |0⟩=(1,0)ᵀ, |1⟩=(0,1)ᵀ.`,complex('Componenti del ket normalizzato',v,['α','β']),mode==='bra'?`Il prodotto interno restituisce lo scalare 1; il prodotto esterno restituisce il proiettore P. La figura di Bloch rappresenta la stessa direzione pura r=${M.rv(r)}.`:k?'I moduli uguali collocano lo stato sull’equatore; la fase relativa π/2 sceglie il punto +Y. La misura Z dà probabilità 1/2 a entrambi gli esiti.':'Le ampiezze (2,i)/√5 producono r=(0,4/5,3/5); il valore r𝓏=3/5 restituisce P(0)=4/5. La fase globale comune lascia invariato questo punto.',v);
 }
 if(mode==='fase'){
  const angle=k===2?0:k?180:90,e:M.Z=angle===0?[1,0]:angle===90?[0,1]:[-1,0],v=[M.z(Math.SQRT1_2),M.scale(e,Math.SQRT1_2)],out=M.mv(M.H,v),prob=out.map(M.abs2);
  S('Dichiarare le due basi','Base Z: |0⟩=(1,0)ᵀ, |1⟩=(0,1)ᵀ\nBase X: |+⟩=(1,1)ᵀ/√2, |−⟩=(1,−1)ᵀ/√2','I prodotti interni con questi vettori danno i coefficienti nelle due basi.');
  S('Inserire la fase relativa',`φ=${angle}°; e^(iφ)=${M.cz(e)}\nψφ=(1,${M.cz(e)})ᵀ/√2; |α|²=|β|²=1/2`,'Il primo coefficiente è reale positivo; il secondo porta la fase relativa dichiarata.');
  S('Calcolare i coefficienti nella base X',`a₊=(1+(${M.cz(e)}))/2=${M.cz(out[0])}\na₋=(1−(${M.cz(e)}))/2=${M.cz(out[1])}`,'La base X combina le due componenti mediante somma e differenza.');
  S('Calcolare i pesi della ricombinazione',out.map((z,j)=>`p${j?'−':'+'}=(${M.probabilityTerms(z)})=${M.f(prob[j])}`).join('\n'),'Le probabilità Z restano (1/2,1/2); quelle X dipendono dalla fase.');
  S('Posizionare lo stato sull’equatore',`r=(cos φ,sin φ,0)=${M.rv(M.bloch(v))}\np₊=(1+cos φ)/2; p₋=(1−cos φ)/2`,'Il valore della coordinata x coincide con la differenza fra i due pesi X.');
  S('Verificare l’invarianza globale','ψ′=iψ; ⟨u|ψ′⟩=i⟨u|ψ⟩\n|⟨u|ψ′⟩|²=|i|²|⟨u|ψ⟩|²=|⟨u|ψ⟩|²','La fase comune moltiplica tutte le ampiezze di misura per un fattore di modulo uno.');
  extraFigures.push(bars('Probabilità dopo la ricombinazione in X',prob,['+','−']));
  return finish(`Fase relativa ${angle}°`,`Dati φ=${angle}° e ψφ=(|0⟩+e^(iφ)|1⟩)/√2; confrontiamo le basi Z e X.`,complex('Componenti dello stato con fase relativa',v,['α','β']),angle===90?'Le due somme complesse hanno moduli uguali: gli esiti X sono equiprobabili.':angle===180?'La somma si cancella e la differenza vale due: X dà sempre −1, pur conservando probabilità Z uniformi.':'La differenza si cancella e la somma vale due: X dà sempre +1. Il confronto con 180° mostra che le fasi relative cambiano l’interferenza.',v);
 }
 if(mode==='unitarie'){
  const v=k?plus:M.normalize([M.z(2),M.z(0,1)])!,U=k?[[M.z(1),M.z()],[M.z(),M.z(0,1)]]:M.H,out=M.mv(U,v),r=M.bloch(v),s=M.bloch(out);
  S('Dichiarare l’operatore esatto',k?'U=[[1,0],[0,i]]; U†=[[1,0],[0,−i]]':'U=H=(1/√2)[[1,1],[1,−1]]; H†=H','Le matrici agiscono sulla base canonica |0⟩,|1⟩ e mantengono le ampiezze complesse.');
  S('Verificare l’unitarietà',k?'U†U=[[1,0],[0,(−i)i]]=I':'H†H=(1/2)[[1+1,1−1],[1−1,1+1]]=I','I prodotti sulle diagonali valgono uno e quelli fuori diagonale zero.');
  S('Moltiplicare riga per colonna',k?'U|+⟩=(1,i)ᵀ/√2':'Hψ=((2+i),(2−i))ᵀ/√10','La prima riga fornisce la nuova componente 0 e la seconda la nuova componente 1.');
  S('Controllare la norma in uscita',k?'‖Uψ‖²=(|1|²+|i|²)/2=1':'‖Hψ‖²=(|2+i|²+|2−i|²)/10=(5+5)/10=1','La conservazione verificata su questo stato è conseguenza dell’identità U†U=I valida per ogni ingresso.');
  S('Confrontare i punti di Bloch',`r iniziale=${M.rv(r)}; r finale=${M.rv(s)}\n`+(k?'(rₓ,rᵧ,r𝓏)↦(−rᵧ,rₓ,r𝓏)':'(rₓ,rᵧ,r𝓏)↦(r𝓏,−rᵧ,rₓ)'),k?'Il fattore i sulla seconda componente aggiunge 90° alla fase relativa: sulla sfera è una rotazione di 90° attorno a Z.':'Hadamard scambia le coordinate x e z e inverte y: equivale a una rotazione di 180° attorno all’asse (1,0,1)/√2, a meno di una fase globale del ket.');
  S('Applicare l’inversa',k?'U†(1,i)ᵀ/√2=(1,(−i)i)ᵀ/√2=|+⟩':'H(Hψ)=(1/√20)(4,2i)ᵀ=(2,i)ᵀ/√5=ψ','Il secondo calcolo ripristina esattamente l’ingresso.');
  extraFigures.push(complex('Componenti iniziali e finali',[...v,...out],['α iniziale','β iniziale','α finale','β finale']),{kind:'bloch',title:'Confronto Bloch: stato finale e riferimento iniziale',state:out,referenceState:v});
  return finish(k?'Porta di fase e rotazione attorno a Z':'Hadamard e scambio degli assi X/Z',k?'Dati ψ=|+⟩=(1,1)ᵀ/√2, U=diag(1,i).':'Dati ψ=(2,i)ᵀ/√5 e H=(1/√2)[[1,1],[1,−1]].',bars('Probabilità Z dopo la trasformazione',out.map(M.abs2),['0','1']),k?'Le probabilità Z restano uniformi mentre il punto di Bloch passa da +X a +Y. La porta agisce sulla fase relativa.':'Il punto (0,4/5,3/5) diventa (3/5,−4/5,0). Le probabilità Z finali sono uniformi e l’inversa H ripristina la preparazione.',out);
 }
 if(mode==='incompatibilita'){
  const a=k?1:2,n=a*a+1,v=M.normalize([M.z(a),M.z(0,1)])!,zb=[rv([1,0]),rv([0,1])],xb=[plus,minus],joint=M.sequential(v,xb,zb),reverse=M.sequential(v,zb,xb),zmean=(a*a-1)/n,ymean=2*a/n;
  S('Dichiarare osservabili e basi','X=[[0,1],[1,0]], Z=[[1,0],[0,−1]], Y=[[0,−i],[i,0]]\nX: |±⟩=(1,±1)ᵀ/√2, esiti ±1\nZ: |0⟩,|1⟩, esiti +1,−1','Le etichette 0,1 nelle tabelle identificano gli autostati di Z; i segni +,− identificano quelli di X.');
  S('Calcolare la prima misura X',`⟨+|ψ⟩=(${a}+i)/√${2*n}; ⟨−|ψ⟩=(${a}−i)/√${2*n}\npX(+)=pX(−)=(${a*a}+1)/${2*n}=1/2`,'Ogni ramo ha probabilità 1/2; lo stato condizionato è il corrispondente autostato X, a meno di fase globale.');
  S('Applicare Z nei due rami X','|⟨0|±⟩|²=|1/√2|²=1/2\n|⟨1|±⟩|²=|±1/√2|²=1/2\nP(X=±,Z=j)=(1/2)(1/2)=1/4','Le quattro probabilità congiunte derivano dalle probabilità del primo ramo moltiplicate per quelle condizionate.');
  S('Invertire l’ordine: prima Z',`⟨0|ψ⟩=${a}/√${n}; pZ(0)=${a*a}/${n}\n⟨1|ψ⟩=i/√${n}; pZ(1)=1/${n}`,'La prima misura ora prepara |0⟩ o |1⟩, con i pesi della distribuzione Z iniziale.');
  S('Applicare X nei due rami Z',`|⟨±|0⟩|²=|⟨±|1⟩|²=1/2\nP(Z=0,X=±)=${a*a}/${2*n}\nP(Z=1,X=±)=1/${2*n}`,'Entrambi gli stati propri Z hanno coefficienti X di modulo 1/√2.');
  S('Svolgere il commutatore','XZ=[[0,−1],[1,0]]=−iY\nZX=[[0,1],[−1,0]]=iY\n[X,Z]=XZ−ZX=[[0,−2],[2,0]]=−2iY','Le due moltiplicazioni danno matrici opposte; il commutatore è un operatore non nullo, indipendentemente dalla preparazione.');
  S('Calcolare i valori attesi sulla preparazione',`Xψ=(i,${a})ᵀ/√${n}; ⟨X⟩=(${a}i−${a}i)/${n}=0\nZψ=(${a},−i)ᵀ/√${n}; ⟨Z⟩=(${a*a}−1)/${n}=${M.f(zmean)}\nYψ=(1,${a}i)ᵀ/√${n}; ⟨Y⟩=(${a}+${a})/${n}=${M.f(ymean)}`,'Questi prodotti interni si riferiscono a copie dello stesso stato iniziale, prima di qualsiasi misura.');
  S('Ricavare varianze e limite di Robertson',`X²=Z²=I; ⟨X²⟩=⟨Z²⟩=1\nσX²=1−0²=1; σZ²=1−(${a*a-1}/${n})²=${4*a*a}/${n*n}\nσXσZ=${2*a}/${n}=|⟨[X,Z]⟩|/2=|⟨Y⟩|`,'La disuguaglianza σXσZ≥|⟨[X,Z]⟩|/2 è qui saturata. Essa riguarda dispersioni della preparazione, mentre le tabelle riguardano due misure sul medesimo sistema.');
  extraFigures.push({kind:'grid',title:'Ordine Z poi X',values:reverse.flat(),rowLabels:['primo Z=0','primo Z=1'],columnLabels:['poi X=+','poi X=−']});
  return finish(k?'Statistiche uguali per una preparazione speciale':'L’ordine modifica la distribuzione congiunta',`Dati ψ=(${a},i)ᵀ/√${n}; confrontiamo X→Z e Z→X su copie preparate allo stesso modo.`,{kind:'grid',title:'Ordine X poi Z',values:joint.flat(),rowLabels:['primo X=+','primo X=−'],columnLabels:['poi Z=0','poi Z=1']},k?'Per ψ=(1,i)/√2 entrambe le tabelle sono uniformi. Questa uguaglianza su una sola preparazione non implica commutatività: il calcolo XZ−ZX=−2iY resta non nullo.':'X→Z assegna 1/4 a ogni coppia; Z→X assegna 2/5 alle coppie con primo risultato 0 e 1/10 alle altre. Lo stato condizionato del primo ramo spiega la differenza.');
 }
 if(mode==='esperimento'){
  const a=k?1:2,n=a*a+1,v=M.normalize([M.z(a),M.z(0,1)])!,A=[[M.z(1),M.z(1,-1)],[M.z(1,1),M.z()]],e=M.eigenHermitian(A),b=M.born(v,e.vectors),Av=M.mv(A,v),A2v=M.mv(A,Av),o=M.observe(A,v);
  S('Controllare tutti i dati','A=[[1,1−i],[1+i,0]]\nA†=[[1,(1+i)*],[(1−i)*,0]]=A\n'+`ψ=(${a},i)ᵀ/√${n}; ‖ψ‖²=(${a*a}+1)/${n}=1`,'La diagonale di A è reale e i termini fuori diagonale sono coniugati: A è un’osservabile hermitiana.');
  S('Determinare gli autovalori','det(A−λI)=(1−λ)(−λ)−(1−i)(1+i)\n=λ²−λ−2=(λ−2)(λ+1)=0\nλ₊=2; λ₋=−1','Il prodotto dei termini complessi vale (1−i)(1+i)=2.');
  S('Risolvere il primo autovettore','λ=2: −x+(1−i)y=0; scegliamo y=1 ⇒ x=1−i\n(1+i)(1−i)−2=0\n‖(1−i,1)‖²=2+1=3; u₊=(1−i,1)ᵀ/√3','Il candidato soddisfa entrambe le equazioni; dividere per √3 lo normalizza.');
  S('Risolvere il secondo autovettore','λ=−1: 2x+(1−i)y=0; scegliamo y=2 ⇒ x=−1+i\n(1+i)(−1+i)+2=0\n‖(−1+i,2)‖²=2+4=6; u₋=(−1+i,2)ᵀ/√6','Gli autovalori distinti individuano due autospazi di dimensione uno.');
  S('Verificare l’ortogonalità','⟨u₊|u₋⟩=[(1+i)(−1+i)+2]/√18=(−2+2)/√18=0','I due vettori normalizzati costituiscono una base ortonormale di C².');
  S('Calcolare le ampiezze esatte',k?'a₊=[(1+i)·1+i]/√6=(1+2i)/√6\na₋=[(−1−i)·1+2i]/√12=(−1+i)/√12':'a₊=[(1+i)·2+i]/√15=(2+3i)/√15\na₋=[(−1−i)·2+2i]/√30=−2/√30','I bra degli autovettori coniugano la prima componente prima del prodotto.');
  S('Calcolare e sommare i moduli quadri',k?'p₊=(1²+2²)/6=5/6; p₋=((−1)²+1²)/12=1/6\np₊+p₋=1':'p₊=(2²+3²)/15=13/15; p₋=4/30=2/15\np₊+p₋=1','Le due probabilità coprono tutti gli esiti della misura.');
  b.forEach((row,j)=>{
   S('Proiettare nel ramo '+(j?'−':'+'),`P${j?'−':'+'}ψ=u${j?'−':'+'}a${j?'−':'+'}≈${M.cv(row.projection)}\nψ${j?'−':'+'}=P${j?'−':'+'}ψ/√p${j?'−':'+'}≈${M.cv(row.post!)}`,'Il ramo è possibile perché il suo peso è positivo. Lo stato condizionato ha norma uno e appartiene al relativo autospazio.');
  });
  S('Calcolare i momenti dallo spettro',k?'⟨A⟩=2·5/6−1/6=3/2\n⟨A²⟩=4·5/6+1/6=7/2\nVar(A)=7/2−(3/2)²=5/4':'⟨A⟩=2·13/15−2/15=8/5\n⟨A²⟩=4·13/15+2/15=18/5\nVar(A)=18/5−(8/5)²=26/25','Si pesano prima gli esiti, poi i loro quadrati; la varianza sottrae il quadrato della media.');
  M.rowTerms(A,v).forEach((row,j)=>S('Verifica Aψ, riga '+(j+1),`${row}≈${M.cz(Av[j])}`,'Ogni riga usa direttamente la preparazione normalizzata.'));
  M.rowTerms(A,Av).forEach((row,j)=>S('Verifica A²ψ, riga '+(j+1),`${row}≈${M.cz(A2v[j])}`,'La seconda applicazione usa l’uscita Aψ appena ottenuta.'));
  S('Confrontare i momenti matriciali',`⟨ψ|Aψ⟩=${M.dotTerms(v,Av)}≈${M.f(o.mean)}\n⟨ψ|A²ψ⟩=${M.dotTerms(v,A2v)}≈${M.f(o.second)}\nVar(A)≈${M.f(o.variance)}`,'I prodotti matriciali confermano le frazioni ricavate indipendentemente dallo spettro.');
  extraFigures.push(complex('Autovettori della base di misura',[...e.vectors[0],...e.vectors[1]],['(u₊)₀','(u₊)₁','(u₋)₀','(u₋)₁']),complex('Proiezioni prima della rinormalizzazione',[...b[0].projection,...b[1].projection],['(P₊ψ)₀','(P₊ψ)₁','(P₋ψ)₀','(P₋ψ)₁']));
  return finish(k?'Stessa osservabile, preparazione equatoriale':'Misura di un’osservabile complessa',`Dati A=[[1,1−i],[1+i,0]], ψ=(${a},i)ᵀ/√${n}; gli esiti della misura saranno gli autovalori di A.`,bars('Distribuzione degli autovalori',b.map(x=>x.probability),['2','−1']),k?'A conserva autovalori e autovettori del primo caso. Cambiare ψ modifica i pesi in (5/6,1/6), la media in 3/2 e la varianza in 5/4.':'La preparazione produce probabilità (13/15,2/15), media 8/5 e varianza 26/25. Due calcoli indipendenti, spettrale e matriciale, concordano.');
 }
 if(mode==='complessi'){
  const z:M.Z=k?[1,-1]:[2,1],r2=M.abs2(z),angle=M.phase(z)!;
  S('Individuare le due coordinate',`z=${M.cz(z)}; Re(z)=${z[0]}; Im(z)=${z[1]}`,'La freccia parte dall’origine e termina nel punto indicato dalle due coordinate reali.');
  S('Applicare Pitagora',`|z|²=(${z[0]})²+(${z[1]})²=${r2}; |z|=√${r2}≈${M.f(Math.sqrt(r2))}`,'Il modulo è una lunghezza e quindi è non negativo.');
  S('Determinare il quadrante e la fase',`cos φ=${z[0]}/√${r2}; sin φ=${z[1]}/√${r2}; φ≈${M.f(angle)}°\nz=√${r2}(cos φ+i sin φ)`,'I segni di seno e coseno distinguono il quadrante; aggiungere 360° conserva lo stesso punto.');
  S('Costruire il coniugato',`z*=${M.cz(M.conj(z))}; |z*|²=${r2}; arg(z*)≈${M.f(-angle)}°`,'Coniugare conserva la coordinata reale e cambia il segno della coordinata immaginaria: la figura mostra la riflessione rispetto all’asse reale.');
  S('Separare il caso nullo','z=0 ⇒ Re(z)=Im(z)=0; |z|=0; arg(0) non definito','L’origine appartiene al piano complesso, ma non individua un angolo.');
  return finish(k?'Componente immaginaria negativa':'Modulo e fase nel primo quadrante',`Dato z=${M.cz(z)}. Gli angoli sono orientati dall’asse reale positivo.`,{kind:'vectors',title:'Piano complesso: numero e coniugato',vectors:[{v:z,label:'z'},{v:M.conj(z),label:'z*'}]},k?'Il segno della parte immaginaria distingue z dal suo coniugato; entrambi hanno modulo √2.':'Il punto (2,1) e la forma polare descrivono lo stesso numero; il coniugio conserva √5 e inverte la fase.');
 }
 if(mode==='prodotto-complesso'){
  const a:M.Z=k?[1,1]:[2,1],b:M.Z=k?[-1,-1]:[0,1],sum=M.add(a,b),product=M.mul(a,b);
  S('Sommare le componenti',`a+b=(${a[0]}+(${b[0]}))+i(${a[1]}+(${b[1]}))=${M.cz(sum)}`,'La freccia di b viene traslata alla punta di a; la risultante parte dall’origine.');
  S('Distribuire i quattro prodotti',`ab=${a[0]}·(${b[0]})+i(${a[0]}·(${b[1]})+${a[1]}·(${b[0]}))+i²(${a[1]}·(${b[1]}))\n=(${a[0]*b[0]}−(${a[1]*b[1]}))+i(${a[0]*b[1]+a[1]*b[0]})=${M.cz(product)}`,'La sostituzione i²=−1 dà la parte reale; i due termini con un solo i danno quella immaginaria.');
  S('Leggere la trasformazione polare',`|ab|²=|a|²|b|²=${M.abs2(a)}·${M.abs2(b)}=${M.abs2(product)}\narg(ab)=arg(a)+arg(b) (mod 360°)≈${M.f(M.phase(a)!)}°+(${M.f(M.phase(b)!)}°)`,'Il prodotto somma le fasi e moltiplica i moduli. I due risultati si verificano dalle coordinate appena ottenute.');
  S('Controllare la lunghezza della somma',`|a+b|²=(${sum[0]})²+(${sum[1]})²=${M.abs2(sum)}`+(k?'\n|a+b|=0 mentre |a|+|b|=2√2':'\n|a+b|=√8; |a|+|b|=√5+1'),k?'Contributi opposti hanno una risultante nulla, pur avendo singolarmente modulo positivo.':'I moduli della somma e dei singoli contributi dipendono dall’angolo fra le frecce; in questo caso √8<√5+1.');
  return finish(k?'Cancellazione nella somma':'Moltiplicazione per i',`Dati a=${M.cz(a)}, b=${M.cz(b)}; confrontiamo a+b e ab.`,{kind:'vectors',title:'Piano complesso: punta-coda e prodotto',vectors:[{v:a,label:'a'},{v:b,from:a,label:'b traslato'},{v:sum,label:'a+b'},{v:product,label:'ab'}]},k?'La somma è zero perché i due contributi sono opposti. Il prodotto vale −2i: la cancellazione della somma non implica l’annullamento del prodotto.':'Il fattore i conserva il modulo √5 e ruota a di 90°; la somma a+i raggiunge invece il punto (2,2).');
 }
 if(mode==='basi'||mode==='cambio-base'){
  const t=k?2:1,B=M.real([[1,t],[0,1]]),v=rv(k?[5,2]:[3,2]),c=M.mv(M.inv2(B)!,v),A=M.real([[2,0],[0,1]]),Av=M.mv(A,v),C=M.mm(M.mm(M.inv2(B)!,A),B),d=M.mv(C,c);
  const lead=`Dati b₁=(1,0), b₂=(${t},1), B=[[1,${t}],[0,1]], v=${M.cv(v)}.`+(mode==='cambio-base'?' L’operatore in coordinate canoniche è A=[[2,0],[0,1]]. Riprendiamo la base obliqua per descriverne l’azione.':'');
  S('Ricostruire il vettore',`Bc=c₁(1,0)+c₂(${t},1)=(c₁+${t}c₂,c₂)=${M.cv(v)}`,'Le coordinate cercate sono i coefficienti c₁,c₂.');
  S('Risolvere il sistema',`c₂=${v[1][0]}; c₁=${v[0][0]}−${t}·${v[1][0]}=${c[0][0]}; [v]B=${M.cv(c)}`,'La seconda equazione determina c₂; la prima determina poi c₁ in modo unico.');
  S('Verificare la somma',`c₁b₁=${M.cv(rv([c[0][0],0]))}; c₂b₂=${M.cv(rv([t*c[1][0],c[1][0]]))}\nc₁b₁+c₂b₂=${M.cv(M.mv(B,c))}`,'I contributi hanno le direzioni della base, mentre la loro somma coincide con v.');
  if(mode==='basi'){
   S('Controllare l’indipendenza',`det B=1·1−${t}·0=1≠0\nCon b₂=2b₁: c₁b₁+c₂b₂=(c₁+2c₂,0)`,'Nel caso dipendente una componente verticale non nulla sarebbe irraggiungibile; una freccia orizzontale avrebbe più coppie di coefficienti.');
   return finish(k?'Base più inclinata':'Coordinate in una base obliqua',lead,{kind:'vectors',title:'Base e ricostruzione punta-coda',vectors:[{v:[1,0],label:'b₁'},{v:[t,1],label:'b₂'},{v:[c[0][0],0],label:'c₁b₁'},{v:[t*c[1][0],c[1][0]],from:[c[0][0],0],label:'c₂b₂ traslato'},{v:xy(v),label:'v'}]},`Le coordinate nella base scelta sono (${c[0][0]},${c[1][0]}). Il secondo contributo fornisce tutta la componente verticale; il primo completa quella orizzontale.`);
  }
  S('Applicare A in coordinate canoniche',`Av=(2·${v[0][0]},${v[1][0]})=${M.cv(Av)}\nAB=[[2,${2*t}],[0,1]]`,'A raddoppia la componente orizzontale di ciascun vettore della base.');
  S('Convertire le immagini nella base B',`B⁻¹=[[1,${-t}],[0,1]]\n[A]B=B⁻¹AB=[[2,${t}],[0,1]]\n[Av]B=[A]B c=(2·${c[0][0]}+${t}·${c[1][0]},${c[1][0]})=${M.cv(d)}`,'Il fattore B converte l’ingresso, A trasforma il vettore, B⁻¹ restituisce le coordinate di uscita.');
  S('Ricomporre la stessa uscita',`B[Av]B=(${d[0][0]}+${t}·${d[1][0]},${d[1][0]})=${M.cv(M.mv(B,d))}=Av`,'Le due strade producono lo stesso punto nel piano canonico.');
  extraFigures.push({kind:'vectors',title:'Ricomposizione dell’uscita in coordinate canoniche',vectors:[{v:[d[0][0],0],label:'d₁b₁'},{v:[t*d[1][0],d[1][0]],from:[d[0][0],0],label:'d₂b₂ traslato'},{v:xy(Av),label:'B[A]B c = Av'}],extent:Math.hypot(...xy(Av))*1.2});
  return finish(k?'Stessa dilatazione, base più obliqua':'Conversione prima e dopo A',lead,vectors('Vettore e trasformazione nel piano canonico',[v,Av],['v','Av'],Math.hypot(...xy(Av))*1.2),`A porta v in ${M.cv(Av)}; [A]B porta le coordinate c in ${M.cv(d)}. La ricostruzione con B verifica che l’azione geometrica coincide.`);
 }
 if(mode==='prodotto-interno'){
  const u=k?[M.z(1),M.z(0,1)]:rv([1,1]),v=k?[M.z(0,1),M.z(1)]:rv([2,0]),a=M.dot(u,v);
  S('Coniugare il primo argomento',`u* = (${u.map(z=>M.cz(M.conj(z))).join(', ')})\n⟨u,v⟩=${M.dotTerms(u,v)}=${M.cz(a)}`,'Il coniugio precede la moltiplicazione componente per componente.');
  S('Controllare lo scambio',`⟨v,u⟩=${M.dotTerms(v,u)}=${M.cz(M.dot(v,u))}=⟨u,v⟩*`,'Scambiare gli argomenti coniuga il risultato.');
  S('Confrontare prodotto e norme',`⟨u,u⟩=${M.dotTerms(u,u)}=${M.norm2(u)}\n⟨v,v⟩=${M.dotTerms(v,v)}=${M.norm2(v)}`,'Le norme quadre sono reali e positive perché ogni fattore è moltiplicato per il proprio coniugato.');
  S(k?'Verificare l’ortogonalità complessa':'Ricavare l’angolo reale',k?'⟨u,v⟩=1·i+(−i)·1=i−i=0':'cos θ=⟨u,v⟩/(‖u‖‖v‖)=2/(√2·2)=1/√2; θ=45°',k?'L’ortogonalità riguarda i vettori di C²; i piani delle singole componenti mostrano soltanto gli elementi del calcolo.':'Nel piano reale il prodotto interno diviso per le norme determina il coseno dell’angolo.');
  return finish(k?'Ortogonalità con componenti complesse':'Angolo fra due vettori reali',`Dati u=${M.cv(u)}, v=${M.cv(v)}.`,k?complex('Componenti dei due vettori di C²',[...u,...v],['u₁','u₂','v₁','v₂']):vectors('Vettori reali con angolo 45°',[u,v],['u','v']),k?'Il prodotto interno si annulla per cancellazione fra i e −i. La normalizzazione dei due vettori conserva questa ortogonalità.':'Il prodotto interno vale 2 e l’angolo è 45°. Nella prossima costruzione questo coefficiente permetterà di separare una componente parallela.');
 }
 if(mode==='proiezioni'){
  const u=rv([1,1]),v=rv(k?[2,2]:[2,0]),e=M.normalize(u)!,alpha=M.dot(e,v),p=M.vscale(e,alpha),w=M.vsub(v,p);
  S('Costruire il primo asse',`‖u‖²=1²+1²=2; e₁=(1,1)/√2`,'La norma non nulla permette di ottenere una direzione unitaria.');
  S('Separare la parte parallela',`α=⟨e₁,v⟩=(${v[0][0]}+${v[1][0]})/√2\np=αe₁=${k?'(2,2)':'(1,1)'}`,'Il coefficiente è il prodotto interno; moltiplicarlo per e₁ ricostruisce il vettore parallelo.');
  S('Sottrarre il residuo',`w=v−p=${k?'(0,0)':'(1,−1)'}; ⟨e₁,w⟩=${k?'0':'(1−1)/√2=0'}`,'La sottrazione elimina il contributo nella prima direzione.');
  S(k?'Riconoscere la dipendenza':'Normalizzare il secondo asse',k?'‖w‖²=0; v=2u; nessun e₂=w/‖w‖ è definito':'‖w‖²=1²+(−1)²=2; e₂=(1,−1)/√2; ⟨e₁,e₂⟩=0',k?'Un residuo nullo non aggiunge una nuova direzione. La procedura si ferma con un solo asse.':'I due assi hanno norma uno e prodotto interno nullo, quindi costituiscono una base ortonormale.');
  return finish(k?'Residuo nullo e vettori dipendenti':'Due assi ottenuti per sottrazione',`Dati u=(1,1), v=${M.cv(v)}.`,{kind:'vectors',title:'Proiezione e residuo, stessa scala',vectors:[{v:xy(v),label:'v'},{v:xy(p),label:'p'},{v:xy(w),from:xy(p),label:'w traslato'}]},k?'La proiezione coincide con v e il residuo è esattamente nullo. La normalizzazione del residuo sarebbe una divisione per zero.':'La somma (1,1)+(1,−1) ricostruisce (2,0); la seconda direzione nasce dal residuo ortogonale.');
 }
 if(mode==='matrici'||mode==='nucleo'||mode==='composizione'){
  const A=mode==='nucleo'?M.real(k?[[0,0],[0,0]]:[[1,2],[0,0]]):mode==='composizione'?M.real(k?[[2,0],[0,2]]:[[1,1],[0,1]]):M.real(k?[[1,-1],[1,1]]:[[1,1],[0,1]]),v=rv(k?[2,-1]:[1,2]),Av=M.mv(A,v),B=M.real([[0,-1],[1,0]]);
  const lead=`Dati A=${mat(A)}, v=${M.cv(v)}.`+(mode==='composizione'?' B=[[0,−1],[1,0]] è una rotazione di 90°. Confrontiamo i due ordini sullo stesso ingresso.':'');
  S('Leggere le colonne',`Ae₁=${M.cv(A.map(r=>r[0]))}; Ae₂=${M.cv(A.map(r=>r[1]))}`,'Le colonne sono le immagini dei due assi canonici e determinano la trasformazione.');
  M.rowTerms(A,v).forEach((row,j)=>S('Calcolare Av, componente '+(j+1),`${row}=${M.cz(Av[j])}`,'Ogni riga viene moltiplicata per la colonna delle coordinate di v.'));
  if(mode==='matrici'){
   S('Verificare con le colonne',`Av=${v[0][0]}Ae₁+(${v[1][0]})Ae₂=${M.cv(Av)}`,'La combinazione delle immagini degli assi restituisce il prodotto per righe.');
   return finish(k?'Rotazione e dilatazione':'Deformazione di taglio',lead,vectors('Colonne, ingresso e immagine',[A.map(r=>r[0]),A.map(r=>r[1]),v,Av],['Ae₁','Ae₂','v','Av']),k?'Le colonne sono ortogonali e hanno lunghezza √2: l’operatore ruota di 45° e dilata ogni lunghezza di √2.':'La seconda colonna è inclinata; la componente verticale resta invariata e quella orizzontale riceve il contributo verticale.');
  }
  if(mode==='nucleo'){
   S('Risolvere Ax=0',k?'0x+0y=0; x=s, y=t; ker A=R²':'x+2y=0; y=t; x=−2t; ker A={t(−2,1)}',k?'Ogni coppia di coordinate soddisfa il sistema.':'Una variabile libera parametrizza una retta di ingressi annullati.');
   S('Descrivere immagine e dimensioni',k?'im A={0}; rango A=0; dim ker A=2; 0+2=2':'im A=span{(1,0)}; rango A=1; dim ker A=1; 1+1=2','Il rango conta le direzioni indipendenti in uscita; la dimensione del nucleo conta quelle annullate.');
   const z=rv(k?[1,0]:[-2,1]),other=M.vadd(v,z);
   S('Verificare due ingressi indistinguibili',`w=v+z=${M.cv(other)}; Az=${M.cv(M.mv(A,z))}\nAw=${M.cv(M.mv(A,other))}=Av`,'Aggiungere un vettore del nucleo lascia invariata l’immagine.');
   return finish(k?'Operatore nullo':'Una direzione cancellata',lead,vectors('Ingressi distinti e immagine comune',[v,other,z,Av],['v','v+z','z nel nucleo','Av=A(v+z)']),k?'La matrice nulla invia tutto il piano all’origine. Il nucleo ha dimensione due e l’immagine dimensione zero.':'Gli ingressi differiscono di (−2,1), che A annulla. L’uscita è confinata all’asse orizzontale.');
  }
  const Bv=M.mv(B,v),ABv=M.mv(A,Bv),BAv=M.mv(B,Av);
  S('Applicare B per primo',`Bv=(−${v[1][0]},${v[0][0]})=${M.cv(Bv)}\nABv=${M.rowTerms(A,Bv).join('; ')}=${M.cv(ABv)}`,'Il vettore ruotato Bv diventa l’ingresso di A.');
  S('Applicare A per primo',`Av=${M.cv(Av)}\nBAv=${M.rowTerms(B,Av).join('; ')}=${M.cv(BAv)}`,'L’immagine Av già calcolata diventa l’ingresso di B.');
  S('Confrontare le matrici dei due ordini',`AB=${mat(M.mm(A,B))}; BA=${mat(M.mm(B,A))}\n(AB−BA)v=${M.cv(M.vsub(ABv,BAv))}`,'Il prodotto di matrici riassume i due passaggi senza perdere l’ordine.');
  const extent=Math.max(...[v,Bv,Av,ABv,BAv].map(w=>Math.hypot(...xy(w))))*1.2;
  extraFigures.push(vectors('Ordine A poi B',[v,Av,BAv],['v','Av','BAv'],extent));
  return finish(k?'Dilatazione uniforme e rotazione commutano':'Taglio e rotazione dipendono dall’ordine',lead,vectors('Ordine B poi A',[v,Bv,ABv],['v','Bv','ABv'],extent),k?'AB=BA perché una dilatazione uniforme moltiplica entrambe le coordinate dello stesso fattore. La coincidenza è verificata sull’intera matrice.':'ABv e BAv sono diversi sul medesimo ingresso: il taglio agisce su componenti che la rotazione scambia.');
 }
 if(mode==='aggiunto'){
  const A:M.Mat=k?M.real([[2,0],[0,1]]):[[M.z(1),M.z(0,1)],[M.z(),M.z(1)]],adj=M.adj(A),v=rv([1,1]),Av=M.mv(A,v),u=[M.z(1),M.z(0,1)];
  S('Trasporre e poi coniugare',`Aᵀ=${mat(A[0].map((_,j)=>A.map(r=>r[j])))}\nA†=${mat(adj)}`,'Trasporre sposta l’elemento (r,c) in (c,r); coniugare cambia il segno di ogni parte immaginaria.');
  S('Verificare la definizione',`Av=${M.cv(Av)}; A†u=${M.cv(M.mv(adj,u))}\n⟨u,Av⟩=${M.dotTerms(u,Av)}=${M.cz(M.dot(u,Av))}\n⟨A†u,v⟩=${M.dotTerms(M.mv(adj,u),v)}=${M.cz(M.dot(M.mv(adj,u),v))}`,'I due prodotti interni coincidono: l’aggiunto trasferisce A dal secondo al primo argomento.');
  S('Distinguere le due proprietà',`A† ${k?'=':'≠'} A\nA†A=${mat(M.mm(adj,A))}≠I\n‖v‖²=${M.norm2(v)}; ‖Av‖²=${M.norm2(Av)}`,'Hermitianità confronta A con il suo aggiunto; unitarietà confronta A†A con I. Sono condizioni differenti.');
  S('Confrontare con una matrice unitaria','U=[[1,0],[0,i]]; U†=[[1,0],[0,−i]]\nU†U=[[1,0],[0,(−i)i]]=I; U†≠U','Una fase su una coordinata fornisce anche un esempio unitario che non è hermitiano.');
  return finish(k?'Hermitiana con norma variabile':'Trasposizione e coniugio entrambi necessari',`Dati A=${mat(A)}, u=(1,i)ᵀ, v=(1,1)ᵀ.`,complex('Componenti prima e dopo A',[...v,...Av],['v₁','v₂','(Av)₁','(Av)₂']),k?'A=diag(2,1) è hermitiana e non unitaria: porta la norma quadra di v da 2 a 5.':'L’elemento i si sposta sotto la diagonale e diventa −i nell’aggiunto. A non è hermitiana né unitaria; U mostra che l’unitarietà può sussistere senza hermitianità.');
 }
 if(['spettro','base-propria','proiettori','funzioni-matrice'].includes(mode)){
  const a=mode==='spettro'?(k?0:2):(k?3:2),A=M.real([[a,1],[1,a]]),v=rv([2,1]),p=rv([1.5,1.5]),q=rv([.5,-.5]),Av=M.mv(A,v),A2v=M.mv(A,Av),lp=a+1,lm=a-1;
  const lead=`Dati A=[[${a},1],[1,${a}]], v=(2,1)ᵀ.`+(mode==='spettro'?'':` Caso progressivo della famiglia A=aI+[[0,1],[1,0]], qui a=${a}: riprendiamo le autodirezioni (1,1) e (1,−1) e svolgiamo ${mode==='base-propria'?'il cambio di coordinate':mode==='proiettori'?'la costruzione dei proiettori':'le funzioni della matrice'}.`);
  if(mode==='spettro'){
   S('Imporre una soluzione non nulla',`det(A−λI)=(${a}−λ)²−1=0\n${a}−λ=±1 ⇒ λ₊=${lp}, λ₋=${lm}`,'L’annullamento del determinante rende singolare il sistema (A−λI)u=0.');
   S('Risolvere i due sistemi',`λ₊=${lp}: −x+y=0 ⇒ u₊=(1,1)\nλ₋=${lm}: x+y=0 ⇒ u₋=(1,−1)`,'Sono scelte rappresentative delle due rette di soluzioni; nessun proiettore è necessario per riconoscerle.');
   S('Verificare le autodirezioni',`Au₊=(${lp},${lp})=${lp}u₊\nAu₋=(${lm},${-lm})=${lm}u₋\nAv=${M.cv(Av)}`,'Il vettore generico v può cambiare direzione, mentre ciascun autovettore resta sulla propria retta.');
   S('Controllare che le direzioni siano distinte','⟨u₊,u₋⟩=1·1+1·(−1)=0\ndet[[1,1],[1,−1]]=−1−1=−2≠0','I due vettori non nulli sono ortogonali e indipendenti. Potranno quindi essere normalizzati e usati come base nella sezione successiva.');
   extraFigures.push(vectors('Seconda autodirezione e sua immagine',[rv([1,-1]),rv([lm,-lm])],['u₋','λ₋u₋'],Math.max(2,Math.SQRT2*Math.abs(lp))*1.2));
   return finish(k?'Autovalore negativo e inversione del verso':'Autodirezioni con fattori distinti',lead,vectors('Prima autodirezione e sua immagine',[rv([1,1]),rv([lp,lp])],['u₊','λ₊u₊'],Math.max(2,Math.SQRT2*Math.abs(lp))*1.2),k?'Gli autovalori +1 e −1 conservano le due rette; il secondo inverte il verso. Il vettore nullo non serve a individuare un’autodirezione.':'A moltiplica la direzione (1,1) per 3 e quella (1,−1) per 1. Queste due direzioni indipendenti permettono di ricostruire ogni ingresso.');
  }
  if(mode==='base-propria'){
   S('Normalizzare le autodirezioni','‖(1,±1)‖²=2; u₊=(1,1)/√2; u₋=(1,−1)/√2\n⟨u₊,u₋⟩=(1−1)/2=0','Le due soluzioni normalizzate formano una base ortonormale.');
   S('Ottenere le coordinate proprie','c₊=⟨u₊,v⟩=(2+1)/√2=3/√2\nc₋=⟨u₋,v⟩=(2−1)/√2=1/√2','Le coordinate si ottengono dai prodotti interni grazie all’ortonormalità.');
   S('Ricostruire il vettore','c₊u₊=(3/2,3/2); c₋u₋=(1/2,−1/2)\nv=c₊u₊+c₋u₋=(2,1)','Le due componenti sono vettori del piano; i coefficienti sono numeri riferiti ai nuovi assi.');
   S('Descrivere A nella base propria',`U=[u₊ u₋]; U†U=I; U†AU=diag(${lp},${lm})\n[Av]U=(${lp}·3/√2,${lm}·1/√2)ᵀ`,'L’azione diventa diagonale perché ogni colonna è un autovettore.');
   return finish(k?'Stesse direzioni, autovalori traslati':'Coordinate lungo gli autovettori',lead,vectors('Componenti nella base ortonormale',[v,p,q],['v','c₊u₊','c₋u₋']),`Le coordinate di v sono (3/√2,1/√2), mentre quelle di Av sono (${lp}·3/√2,${lm}·1/√2). La base dipende dalle direzioni; gli autovalori determinano i fattori applicati.`);
  }
  if(mode==='proiettori'){
   const test=k?rv([1,-1]):v,pp=M.vscale(plus,M.dot(plus,test)),qq=M.vscale(minus,M.dot(minus,test));
   S('Formare i prodotti esterni','P₊=u₊u₊†=(1/2)[[1,1],[1,1]]\nP₋=u₋u₋†=(1/2)[[1,−1],[−1,1]]','Moltiplicare una colonna per una riga produce i quattro elementi di ciascuna matrice.');
   S('Applicare i due operatori',`Per w=${M.cv(test)}:\nP₊w=(${test[0][0]}+${test[1][0]})/2·(1,1)=${M.cv(pp)}\nP₋w=(${test[0][0]}−(${test[1][0]}))/2·(1,−1)=${M.cv(qq)}`,'Ogni proiettore mantiene soltanto il contributo sulla propria direzione.');
   S('Verificare le proprietà','P₊²=(1/4)[[2,2],[2,2]]=P₊; P₋²=P₋\nP₊P₋=(1/4)[[0,0],[0,0]]=0; P₊+P₋=I','Una componente già proiettata resta uguale; direzioni ortogonali si eliminano reciprocamente.');
   S('Ricomporre A e la sua azione',`A=${lp}P₊+${lm}P₋\nAw=${lp}P₊w+${lm}P₋w=${M.cv(M.mv(A,test))}`,'La somma dei proiettori pesati dagli autovalori ricostruisce l’operatore originale.');
   return finish(k?'Proiezione nulla su una direzione ortogonale':'Proiettori come matrici',lead+(k?' Per evidenziare un ramo nullo scegliamo come ingresso w=(1,−1).':' Qui w=v.'),vectors('Vettore e proiezioni complementari',[test,pp,qq,M.mv(A,test)],['w','P₊w','P₋w','Aw']),k?'P₊w=0 perché w è ortogonale a u₊; P₋w=w. La somma dei due operatori conserva comunque ogni vettore.':'I proiettori separano (2,1) in (3/2,3/2) e (1/2,−1/2). Pesare queste parti con 3 e 1 produce Av=(5,4).');
  }
  S('Richiamare la decomposizione già costruita',`P₊=(1/2)[[1,1],[1,1]]; P₋=(1/2)[[1,−1],[−1,1]]\nA=${lp}P₊+${lm}P₋; p=P₊v=(3/2,3/2); q=P₋v=(1/2,−1/2)`,'I proiettori sono quelli verificati nella sezione precedente; qui diventano strumenti per applicare una funzione.');
  S('Moltiplicare due decomposizioni',`A²=(${lp}P₊+${lm}P₋)²=${lp*lp}P₊+${lm*lm}P₋\nAv=${M.cv(Av)}; A²v=${lp*lp}p+${lm*lm}q=${M.cv(A2v)}`,'I termini misti svaniscono perché P₊P₋=P₋P₊=0; ogni P² si riduce a P.');
  S('Definire e sommare l’esponenziale',`e^(−itA)=Σₙ₌₀∞(−it)ⁿAⁿ/n!\n=Σₙ(−itλ₊)ⁿP₊/n!+Σₙ(−itλ₋)ⁿP₋/n!\n=e^(−i${lp}t)P₊+e^(−i${lm}t)P₋`,'La serie scalare dell’esponenziale si applica separatamente ai due autovalori. Il parametro t è adimensionale in questo esempio algebrico.');
  const time=k?Math.PI/2:Math.PI/4,U=M.spectral(A,l=>M.cis(-time*l)),out=M.mv(U,v);
  S('Sostituire un parametro preciso',k?'t=π/2: e^(−i4t)=1, e^(−i2t)=−1\nU=P₊−P₋=[[0,1],[1,0]]; Uv=(1,2)':'t=π/4: e^(−i3π/4)=(−1−i)/√2; e^(−iπ/4)=(1−i)/√2\nU=(1/√2)[[−i,−1],[−1,−i]]\nUv=((−1−2i)/√2,(−2−i)/√2)ᵀ','I fattori hanno modulo uno, quindi ruotano le componenti proprie senza cambiarne il peso.');
  S('Verificare unitarietà e norma','U†U=|e^(−itλ₊)|²P₊+|e^(−itλ₋)|²P₋=P₊+P₋=I\n‖Uv‖²=‖v‖²=5','L’esponenziale immaginario di una matrice hermitiana conserva la norma. Questa identità prepara il modello di evoluzione del modulo 3.');
  if(k)S('Trattare uno spettro degenere','D=2I: unico autovalore 2, autospazio C², proiettore P=I\nf(D)=f(2)I; D²=4I; e^(−itD)=e^(−2it)I','Una degenerazione raccoglie l’intero autospazio. Suddividerlo in direzioni arbitrarie non cambia la funzione dell’operatore.');
  extraFigures.push(complex('Piano complesso: fasi sulle componenti proprie',[M.z(3/Math.SQRT2),M.z(1/Math.SQRT2),M.mul(M.z(3/Math.SQRT2),M.cis(-time*lp)),M.mul(M.z(1/Math.SQRT2),M.cis(-time*lm))],['c₊ iniziale','c₋ iniziale','c₊ dopo U','c₋ dopo U']),complex('Componenti canoniche dopo l’esponenziale',out,['(Uv)₁','(Uv)₂']));
  return finish(k?'Quadrato, scambio unitario e degenerazione':'Quadrato ed esponenziale spettrale',lead,vectors('Potenze: v, Av e A²v sulla stessa scala',[v,Av,A2v],['v','Av','A²v']),`Il quadrato produce A²v=${M.cv(A2v)}, mentre e^(−itA) conserva la norma quadra 5. Le potenze amplificano i coefficienti propri; l’esponenziale qui svolto ne cambia le fasi.`);
 }
 if(['eventi','distribuzioni','momenti','condizionamento'].includes(mode)){
  const weights=k?[1,1,2,4]:[1,2,3,4],T=weights.reduce((s,x)=>s+x,0),p=weights.map(x=>x/T),values=[0,1,2,3];
  if(mode==='eventi'){
   const A=k?[0,1]:[0,2],B=k?[2,3]:[2,3],intersection=A.filter(x=>B.includes(x)),union=[...new Set([...A,...B])],P=(xs:number[])=>xs.reduce((s,x)=>s+p[x],0);
   S('Verificare la distribuzione assegnata',`Ω={0,1,2,3}; p=(${weights.map(x=>x+'/'+T).join(',')})\nΣp=(${weights.join('+')})/${T}=1`,'Le quattro probabilità sono dati dell’esperimento e sono tutte non negative.');
   S('Sommarne i pesi sugli eventi',`A={${A.join(',')}}; B={${B.join(',')}}\nP(A)=${A.map(x=>weights[x]+'/'+T).join('+')}=${M.f(P(A))}\nP(B)=${B.map(x=>weights[x]+'/'+T).join('+')}=${M.f(P(B))}`,'Un evento è un insieme di etichette; ciascun esito viene contato una sola volta.');
   S('Calcolare intersezione e unione',`A∩B=${intersection.length?'{'+intersection.join(',')+'}':'∅'}; P(A∩B)=${M.f(P(intersection))}\nA∪B={${union.join(',')}}; P(A∪B)=${M.f(P(A))}+${M.f(P(B))}−${M.f(P(intersection))}=${M.f(P(union))}`,'Il termine dell’intersezione corregge il doppio conteggio degli esiti comuni.');
   S('Includere eventi certo e impossibile','P(Ω)=1; P(∅)=0; P(Ω\\A)=1−P(A)','La somma sull’insieme vuoto non contiene contributi; il complemento raccoglie tutti gli esiti rimanenti.');
   return finish(k?'Eventi disgiunti ed esaustivi':'Eventi sovrapposti',`Dati gli esiti Ω={0,1,2,3} con probabilità (${weights.map(x=>x+'/'+T).join(', ')}).`,bars('Probabilità degli esiti elementari',p,values.map(String)),k?'A e B sono disgiunti e la loro unione è Ω, quindi P(A)+P(B)=1.':'L’esito 2 appartiene a entrambi gli eventi; sottrarne una volta il peso evita di contarlo due volte.');
  }
  S('Normalizzare i pesi',`W=${weights.join('+')}=${T}\np=(${weights.map(x=>x+'/'+T).join(', ')})\nΣp=1`,'Il totale positivo permette di dividere tutti i pesi per lo stesso numero.');
  if(mode==='distribuzioni'){
   const grouping=k?[0,1,1,0]:[0,1,0,1],grouped=[0,1].map(x=>p.reduce((s,w,j)=>s+(grouping[j]===x?w:0),0));
   S('Assegnare una variabile',grouping.map((x,j)=>`X(${j})=${x}`).join('; '),'La variabile assegna un valore numerico a ciascuna etichetta dell’esito.');
   [0,1].forEach(x=>S('Raggruppare il valore '+x,`P(X=${x})=${p.flatMap((_,j)=>grouping[j]===x?[weights[j]+'/'+T]:[]).join('+')}=${M.f(grouped[x])}`,'Si sommano i pesi di tutte le etichette che ricevono lo stesso valore.'));
   S('Controllare l’invarianza di scala',`w′=2w=(${weights.map(x=>2*x).join(',')}); W′=${2*T}\nw′ⱼ/W′=2wⱼ/(2W)=wⱼ/W`,'Raddoppiare tutti i pesi conserva la distribuzione. Se tutti fossero nulli, W=0 impedirebbe la normalizzazione.');
   extraFigures.push(bars('Distribuzione della variabile X',grouped,['0','1']));
   return finish(k?'Raggruppamento per una seconda variabile':'Dai pesi alla variabile di parità',`Dati pesi (${weights.join(', ')}) sulle etichette 0,1,2,3.`,bars('Distribuzione sulle quattro etichette',p,values.map(String)),`La variabile ha due valori con probabilità (${grouped.map(x=>M.f(x)).join(', ')}). Il raggruppamento riduce le etichette conservando il peso totale.`);
  }
  if(mode==='momenti'){
   const mean=p.reduce((s,x,j)=>s+j*x,0),second=p.reduce((s,x,j)=>s+j*j*x,0),variance=second-mean*mean;
   S('Definire i valori e calcolare la media',`X(j)=j, j=0,1,2,3\nμ=E[X]=${p.map((_,j)=>j+'·'+weights[j]+'/'+T).join('+')}=${M.f(mean)}`,'I valori sono numeri adimensionali; la media è il baricentro dei pesi lungo questo asse.');
   S('Calcolare il secondo momento',`E[X²]=${p.map((_,j)=>j+'²·'+weights[j]+'/'+T).join('+')}=${M.f(second)}`,'Si eleva al quadrato ciascun valore prima di moltiplicarlo per il suo peso.');
   S('Esporre tutti gli scarti',values.map((x,j)=>`x=${x}: x−μ=${M.f(x-mean)}; p(x)(x−μ)²=${weights[j]}/${T}·(${M.f(x-mean)})²=${M.f(p[j]*(x-mean)**2)}`).join('\n'),'Gli scarti possono avere segno diverso; il quadrato ne misura il contributo non negativo alla dispersione.');
   S('Verificare la varianza in due modi',`Σp(x)(x−μ)²=${M.f(variance)}\nE[X²]−μ²=${M.f(second)}−(${M.f(mean)})²=${M.f(variance)}; σ=√${M.f(variance)}≈${M.f(Math.sqrt(variance))}`,'Le due formule coincidono; una variabile costante avrebbe tutti gli scarti nulli.');
   extraFigures.push({kind:'numberline',title:'Baricentro μ e distanze dei valori dalla media',values,weights:p,mean,labels:values.map(String),min:-.3,max:3.3});
   return finish(k?'Pesi concentrati verso il valore massimo':'Media intera con dispersione positiva',`Dati X∈{0,1,2,3} con pesi (${weights.join(', ')}), valori adimensionali.`,bars('Probabilità dei valori di X',p,values.map(String)),`La media è ${M.f(mean)} e la varianza ${M.f(variance)}. Le distanze dalla media vengono pesate dalla probabilità, come mostrano l’asse dei valori e i contributi quadratici.`);
  }
  const joint=k?[.5,0,0,.5]:p,r0=joint[0]+joint[1],r1=joint[2]+joint[3],c0=joint[0]+joint[2],c1=joint[1]+joint[3];
  if(k){steps.length=0;S('Dichiarare la congiunta','P00=1/2; P01=0; P10=0; P11=1/2; ΣPab=1','Le due etichette della coppia indicano nell’ordine riga A e colonna B.');}
  S('Sommare righe e colonne',`P(A=0)=${M.f(joint[0])}+${M.f(joint[1])}=${M.f(r0)}; P(A=1)=${M.f(r1)}\nP(B=0)=${M.f(joint[0])}+${M.f(joint[2])}=${M.f(c0)}; P(B=1)=${M.f(c1)}`,'Le somme eliminano l’etichetta del sistema che non si sta descrivendo.');
  S('Condizionare sulla prima riga',`P(B=0|A=0)=${M.f(joint[0])}/${M.f(r0)}=${M.f(joint[0]/r0)}\nP(B=1|A=0)=${M.f(joint[1])}/${M.f(r0)}=${M.f(joint[1]/r0)}`,'Il denominatore è positivo e i due rapporti sommano a uno.');
  S('Invertire il condizionamento con Bayes',`P(A=0|B=0)=P(B=0|A=0)P(A=0)/P(B=0)\n=${M.f(joint[0]/r0)}·${M.f(r0)}/${M.f(c0)}=${M.f(joint[0]/c0)}`,'L’intersezione è la stessa cella P00; cambia l’insieme usato come riferimento.');
  if(k)S('Trattare un’informazione impossibile','E={A≠B}; P(E)=P01+P10=0\nP(A=0|E)=P(A=0 ed E)/P(E)=0/0 non definito','Un evento nullo non permette di costruire una distribuzione condizionata mediante questa formula.');
  return finish(k?'Correlazione perfetta e condizione impossibile':'Marginali e Bayes da una tabella',k?'Dati P00=P11=1/2 e P01=P10=0.':'Dati pesi congiunti (1,2,3,4) nell’ordine 00,01,10,11.',{kind:'grid',title:'Tabella congiunta P(A=a,B=b)',values:joint,rowLabels:['A=0','A=1'],columnLabels:['B=0','B=1']},k?'Sapere A=0 rende B=0 certo. Selezionare A≠B è impossibile nel modello e il rapporto condizionato non è definito.':'La marginale P(B=0)=0,4 diventa P(B=0|A=0)=1/3: selezionare una riga cambia il totale di riferimento.');
 }
 if(mode==='frequenze'){
  const n=k?4:3,p=k?.25:.5,observed=k?[[0,0,0,0],[1,0,0,0],[0,1,0,0],[1,0,1,0]]:[[1,0,1],[0,0,0],[1,1,1],[0,1,0]],counts=observed.map(row=>row.reduce((s,x)=>s+x,0)),hist=Array.from({length:n+1},(_,j)=>counts.filter(x=>x===j).length),theory=M.binomial(n,p);
  S('Definire il modello Bernoulli',`n=${n}; P(successo)=p=${p}; P(insuccesso)=1−p=${1-p}\nK=Σᵢ₌₁ⁿ Xᵢ; F=K/n`,'Ogni Xᵢ vale 1 per un successo e 0 altrimenti; le prove sono indipendenti e hanno la stessa probabilità.');
  S('Dichiarare una raccolta illustrativa',observed.map((row,j)=>`Raccolta ${j+1}: (${row.join(',')}); K=${counts[j]}; F=${counts[j]}/${n}≈${M.f(counts[j]/n)}`).join('\n'),'Queste sequenze sono dati illustrativi fissati per il calcolo delle frequenze, non nuove probabilità teoriche e non un campionamento eseguito dal simulatore.');
  S('Costruire l’istogramma delle raccolte',hist.map((x,j)=>`K=${j}: ${x} raccolte su ${observed.length}; frequenza relativa=${x}/${observed.length}`).join('\n'),'La frequenza F entro una raccolta e la frequenza delle raccolte in una classe K sono due rapporti differenti.');
  S('Contare le sequenze equiprobabili','P(K=j)=C(n,j)pʲ(1−p)^(n−j)\nC(n,j)=n!/[j!(n−j)!]; 0!=1','Una sequenza con j successi ha probabilità pʲ(1−p)^(n−j); il coefficiente binomiale conta le posizioni possibili dei successi.');
  theory.forEach((x,j)=>S('Probabilità teorica per K='+j,`P(K=${j})=${n}!/[${j}!·${n-j}!]·(${p})^${j}·(${1-p})^${n-j}≈${M.f(x)}`,'I possibili conteggi sono n+1, da zero a n inclusi.'));
  S('Confrontare media e dispersione',`E[K]=np=${n*p}; Var(K)=np(1−p)=${n*p*(1-p)}\nE[F]=p=${p}; Var(F)=p(1−p)/n=${M.f(p*(1-p)/n)}\nF complessiva osservata=${counts.reduce((s,x)=>s+x,0)}/${n*observed.length}≈${M.f(counts.reduce((s,x)=>s+x,0)/(n*observed.length))}`,'La media teorica descrive molte ripetizioni del modello; una raccolta finita può discostarsene. Con zero raccolte la frequenza relativa non è definita.');
  extraFigures.push(bars('Frequenze relative delle quattro raccolte dichiarate',hist.map(x=>x/observed.length),hist.map((_,j)=>String(j))));
  return finish(k?'Successo raro, quattro prove per raccolta':'Tre prove e quattro raccolte',`Dati n=${n}, p=${p}; quattro raccolte illustrative di ${n} prove binarie sono elencate nei passaggi.`,bars('Distribuzione binomiale teorica di K',theory,theory.map((_,j)=>String(j))),k?'Le cinque classi teoriche includono K=3 e K=4 anche se le quattro raccolte dichiarate non li contengono. Un conteggio osservato nullo non dimostra probabilità nulla.':'Le quattro raccolte producono una frequenza relativa 1/4 per ogni classe K, mentre la teoria assegna (1/8,3/8,3/8,1/8). La differenza rende visibili le fluttuazioni finite.');
 }
 if(mode==='born'){
  const v=k?plus:M.normalize([M.z(2),M.z(0,1)])!,b=M.born(v,[plus,minus]),p=k?[1,0]:[.5,.5],r=M.bloch(v);
  S('Dichiarare stato e base',k?'ψ=|+⟩=(1,1)ᵀ/√2; ‖ψ‖²=(1+1)/2=1\nu₊=(1,1)ᵀ/√2; u₋=(1,−1)ᵀ/√2':'ψ=(2,i)ᵀ/√5; ‖ψ‖²=(4+1)/5=1\nu₊=(1,1)ᵀ/√2; u₋=(1,−1)ᵀ/√2','La base X è ortonormale; associamo gli esiti +1 e −1 ai suoi due vettori.');
  S('Calcolare le ampiezze',k?'a₊=(1+1)/2=1; a₋=(1−1)/2=0':'a₊=(2+i)/√10; a₋=(2−i)/√10','Il bra di ciascun vettore di base moltiplica il ket dello stato.');
  S('Passare ai moduli quadri',k?'p₊=|1|²=1; p₋=|0|²=0':'p₊=(2²+1²)/10=1/2; p₋=(2²+(−1)²)/10=1/2','Le probabilità sono reali non negative e sommano a uno.');
  S('Costruire i vettori proiettati',k?'P₊ψ=a₊u₊=ψ; P₋ψ=a₋u₋=0':'P₊ψ=((2+i),(2+i))ᵀ/(2√5)\nP₋ψ=((2−i),(−2+i))ᵀ/(2√5)\nP₊ψ+P₋ψ=(2,i)ᵀ/√5','I due vettori nello spazio C² ricostruiscono lo stato iniziale. Le loro norme quadre sono le probabilità.');
  S('Normalizzare i rami possibili',k?'ψ₊=P₊ψ/√1=ψ\np₋=0: il ramo − è impossibile e non possiede uno stato condizionato':'ψ₊=((2+i),(2+i))ᵀ/√10\nψ₋=((2−i),(−2+i))ᵀ/√10\n‖ψ₊‖²=‖ψ₋‖²=1','Una probabilità esattamente zero impedisce la divisione. Un valore positivo molto piccolo resta un evento possibile; i decimali visualizzati possono essere arrotondati.');
  S('Verificare dalla sfera di Bloch',`r=${M.rv(r)}; nX=(1,0,0); r·nX=${M.f(r[0])}\np₊=(1+r·nX)/2=${k?'1':'1/2'}; p₋=(1−r·nX)/2=${k?'0':'1/2'}\nβ=${k?'0°':'90°'}; p₊=cos²(β/2)=${k?'1':'1/2'}`,'L’angolo β è fra due direzioni di Bloch. Un angolo retto sulla sfera dà probabilità 1/2; due stati ortogonali corrispondono invece a punti antipodali.');
  extraFigures.push(complex('Componenti delle proiezioni in C²',[...b[0].projection,...b[1].projection],['(P₊ψ)₀','(P₊ψ)₁','(P₋ψ)₀','(P₋ψ)₁']),{kind:'bloch',title:'Stato iniziale e direzione +X della misura',state:v,referenceState:plus});
  if(!k)extraFigures.push(complex('Stati condizionati dei due rami',[...b[0].post!,...b[1].post!],['(ψ₊)₀','(ψ₊)₁','(ψ₋)₀','(ψ₋)₁']));
  return finish(k?'Preparazione allineata: esito certo e ramo nullo':'Proiezioni complesse con pesi uguali',k?'Dati ψ=|+⟩ e misura nella base X={|+⟩,|−⟩}, con esiti +1 e −1.':'Dati ψ=(2,i)ᵀ/√5 e misura nella base X={|+⟩,|−⟩}, con esiti +1 e −1.',bars('Probabilità della misura X',p,['+1','−1']),k?'La misura X conserva |+⟩ con probabilità uno. Il proiettore ortogonale restituisce il vettore nullo, che non può essere normalizzato.':'Le fasi dei due coefficienti di proiezione sono diverse, ma i moduli quadri sono entrambi 1/2. I due rami condizionati rappresentano i punti +X e −X della sfera.',v);
 }
 if(mode==='osservabili'){
  const v=M.normalize([M.z(2),M.z(0,1)])!;
  if(k){
   S('Verificare l’operatore','A=2I=[[2,0],[0,2]]=A†; det(A−λI)=(2−λ)²','L’unico autovalore è 2 e il suo autospazio è tutto C².');
   S('Usare il proiettore sull’intero autospazio','P₂=I; p(2)=⟨ψ|I|ψ⟩=(4+1)/5=1\nP₂ψ=ψ; ψ₂=ψ/√1=ψ','La misura di questo operatore non distingue direzioni interne all’autospazio.');
   S('Calcolare i momenti','⟨A⟩=2·1=2; A²=4I; ⟨A²⟩=4\nVar(A)=4−2²=0','L’esito è certo per qualunque stato normalizzato.');
   S('Verificare direttamente sul ket','Aψ=(4,2i)ᵀ/√5=2ψ\nA²ψ=(8,4i)ᵀ/√5=4ψ\n⟨ψ|Aψ⟩=2⟨ψ|ψ⟩=2','Il calcolo matriciale conferma il singolo esito senza scegliere una base particolare dell’autospazio.');
   return finish('Osservabile degenere: un solo esito','Dati A=2I e ψ=(2,i)ᵀ/√5.',bars('Unico esito dell’osservabile 2I',[1],['2']),'La degenerazione richiede P₂=I: l’esito vale sempre 2 e la preparazione resta ψ. Una misura arbitraria delle due coordinate descriverebbe un esperimento diverso.',v);
  }
  S('Dichiarare autovalori e proiettori','A=Z=[[1,0],[0,−1]]=A†\nZ|0⟩=+|0⟩; Z|1⟩=−|1⟩\nP₊=[[1,0],[0,0]]; P₋=[[0,0],[0,1]]','Gli autovalori +1 e −1 sono i valori numerici osservati; 0 e 1 sono le etichette degli stati propri.');
  S('Calcolare le probabilità','a₊=⟨0|ψ⟩=2/√5; p₊=4/5\na₋=⟨1|ψ⟩=i/√5; p₋=1/5','I due moduli quadri sommano a uno.');
  S('Calcolare media e secondo momento','⟨Z⟩=1·4/5+(−1)·1/5=3/5\nZ²=I; ⟨Z²⟩=1·4/5+1·1/5=1','Il secondo momento usa il quadrato degli esiti.');
  S('Verificare con i prodotti matriciali','Zψ=(2,−i)ᵀ/√5\n⟨ψ|Zψ⟩=[2·2+(−i)(−i)]/5=(4−1)/5=3/5\nVar(Z)=1−(3/5)²=16/25; σZ=4/5','La somma sullo spettro e il prodotto matriciale forniscono la stessa media.');
  return finish('Osservabile con due esiti distinti','Dati A=Z e ψ=(2,i)ᵀ/√5; Z ha esiti +1 e −1.',bars('Distribuzione degli esiti di Z',[.8,.2],['+1','−1']),'Il valore medio 3/5 non è un possibile esito singolo. La varianza 16/25 descrive la dispersione di misure su copie identiche.',v);
 }
 if(['tensore','porte-locali','separabilita','composti'].includes(mode)){
  if(mode==='composti'){
   const v=M.vscale(rv(k?[0,1,1,0]:[1,0,0,1]),M.z(Math.SQRT1_2)),p=k?[0,.5,.5,0]:[.5,0,0,.5];
   S('Dichiarare e normalizzare la preparazione',k?'ψ=Ψ⁺=(|01⟩+|10⟩)/√2=(0,1,1,0)ᵀ/√2':'ψ=Φ⁺=(|00⟩+|11⟩)/√2=(1,0,0,1)ᵀ/√2','Ciascun vettore ha due componenti di modulo 1/√2 e quindi norma quadra uno.');
   S('Costruire la distribuzione congiunta',labels4.map((label,j)=>`P${label}=|c${label}|²=${p[j]===0?'0':'1/2'}`).join('\n'),'Le due etichette specificano gli esiti delle misure Z sul primo e sul secondo qubit.');
   S('Calcolare entrambe le marginali',`P(A=0)=P00+P01=1/2; P(A=1)=1/2\nP(B=0)=P00+P10=1/2; P(B=1)=1/2`,'Le distribuzioni locali sono uniformi in entrambi gli esempi.');
   S('Condizionare sul primo risultato',k?'P(B=0|A=0)=0/(1/2)=0\nP(B=1|A=0)=(1/2)/(1/2)=1':'P(B=0|A=0)=(1/2)/(1/2)=1\nP(B=1|A=0)=0/(1/2)=0','Il denominatore è la probabilità dell’esito selezionato A=0.');
   S('Quantificare la correlazione',k?'P(A=B)=P00+P11=0\nE[Z⊗Z]=P00−P01−P10+P11=−1':'P(A=B)=P00+P11=1\nE[Z⊗Z]=P00−P01−P10+P11=+1','Ai risultati 0 e 1 associamo rispettivamente i valori +1 e −1 di Z; il prodotto distingue uguaglianza e opposizione.');
   extraFigures.push(bars('Marginale del primo qubit',[.5,.5],['0','1']),bars('Marginale del secondo qubit',[.5,.5],['0','1']),complex('Quattro ampiezze della preparazione',v,labels4));
   return finish(k?'Bell anticorrelato nella base Z':'Bell correlato nella base Z',`Dati ${k?'Ψ⁺=(|01⟩+|10⟩)/√2':'Φ⁺=(|00⟩+|11⟩)/√2'}; ordine delle componenti 00,01,10,11; entrambe le misure sono Z.`,{kind:'grid',title:'Congiunta delle due misure Z',values:p,rowLabels:['A=0','A=1'],columnLabels:['B=0','B=1']},k?'Le marginali coincidono con quelle di Φ⁺, ma le celle non nulle sono 01 e 10: i risultati sono sempre opposti. Le sole statistiche locali non ricostruiscono le correlazioni.':'Le due marginali sono uniformi e i risultati coincidono sempre. Il prossimo esempio conserverà queste marginali e sposterà il peso sulle coppie opposte.');
  }
  if(mode==='separabilita'){
   const raw=k?rv([1,0,0,1]):rv([2,1,2,1]),v=M.normalize(raw)!;
   S('Verificare lo stato puro assegnato',k?'‖ψ‖²=(1²+0²+0²+1²)/2=1':'‖ψ‖²=(2²+1²+2²+1²)/10=1','Il criterio del determinante viene applicato alle quattro ampiezze di un ket puro normalizzato.');
   S('Disporre le ampiezze in una matrice',k?'C=(1/√2)[[1,0],[0,1]]':'C=(1/√10)[[2,1],[2,1]]','Le righe portano l’etichetta del primo qubit, le colonne quella del secondo.');
   S('Calcolare il determinante',k?'det C=(1·1−0·0)/2=1/2≠0':'det C=(2·1−1·2)/10=0','Un prodotto a⊗b richiede Cij=aᵢbⱼ e quindi una matrice di rango uno.');
   if(k)S('Mostrare la contraddizione della fattorizzazione','a₀b₀=1/√2≠0 ⇒ a₀≠0 e b₀≠0\na₀b₁=0 ⇒ b₁=0; a₁b₀=0 ⇒ a₁=0\na₁b₁=0 contraddice a₁b₁=1/√2','Le quattro equazioni di un prodotto non possono essere soddisfatte insieme.');
   else S('Ricostruire i fattori normalizzati','a=(1,1)ᵀ/√2; b=(2,1)ᵀ/√5\na⊗b=(2,1,2,1)ᵀ/√10=ψ\n‖a‖²=(1+1)/2=1; ‖b‖²=(4+1)/5=1','Le righe identiche identificano i coefficienti del primo fattore; normalizzare separatamente i fattori conserva il prodotto.');
   return finish(k?'Bell non ammette fattori locali':'Ricostruzione di uno stato prodotto',k?'Dato ψ=(|00⟩+|11⟩)/√2.':'Dato ψ=(2,1,2,1)ᵀ/√10; ordine 00,01,10,11.',complex('Coefficienti per la verifica della separabilità',v,labels4),k?'Il determinante non nullo e la contraddizione nelle quattro equazioni escludono una descrizione mediante due ket locali. Il criterio vale per lo stato puro dichiarato.':'Il determinante nullo individua uno stato prodotto; i fattori ricostruiti riproducono anche le ampiezze, comprese le loro fasi.');
  }
  const a=mode==='porte-locali'?M.normalize(k?[M.z(1),M.z(0,2)]:rv([1,2]))!:M.normalize(k?[M.z(1),M.z(0,1)]:rv([1,1]))!,b=M.normalize(rv([2,1]))!,v=M.tensor(a,b);
  const lead=`Dati a=${mode==='porte-locali'?(k?'(1,2i)ᵀ/√5':'(1,2)ᵀ/√5'):(k?'(1,i)ᵀ/√2':'(1,1)ᵀ/√2')}, b=(2,1)ᵀ/√5; ordine 00,01,10,11.`;
  S('Moltiplicare tutte le coppie di componenti',v.map((x,j)=>`c${labels4[j]}=a${Math.floor(j/2)}b${j%2}=(${M.cz(a[Math.floor(j/2)])})(${M.cz(b[j%2])})≈${M.cz(x)}`).join('\n'),'Il primo indice percorre le righe; per ciascun suo valore il secondo indice percorre 0 e 1.');
  S('Verificare la norma prodotto',`Σᵢⱼ|aᵢbⱼ|²=(Σᵢ|aᵢ|²)(Σⱼ|bⱼ|²)=1·1=1\nψ=a⊗b≈${M.cv(v)}`,'La somma sui quattro coefficienti si fattorizza in due somme locali.');
  if(mode==='tensore'){
   S('Scrivere l’espansione esatta nella base composta',k?'ψ=(2|00⟩+|01⟩+2i|10⟩+i|11⟩)/√10':'ψ=(2|00⟩+|01⟩+2|10⟩+|11⟩)/√10','Il denominatore √2·√5=√10 è comune ai quattro prodotti. L’espansione associa ogni coefficiente alla propria coppia di etichette.');
   S('Ricavare i pesi congiunti',v.map((z,j)=>`P${labels4[j]}=|c${labels4[j]}|²≈${M.f(M.abs2(z))}`).join('\n'),'Una fase locale può cambiare le ampiezze senza cambiare questi pesi nella base Z.');
   extraFigures.push({kind:'grid',title:'Probabilità del prodotto nella base Z',values:v.map(M.abs2),rowLabels:['primo 0','primo 1'],columnLabels:['secondo 0','secondo 1']});
   return finish(k?'Fase locale nelle ampiezze congiunte':'Prodotto di due stati reali',lead,complex('Quattro ampiezze costruite per prodotto',v,labels4),k?'La fase i del primo qubit compare nelle componenti 10 e 11. La distribuzione Z resta (2/5,1/10,2/5,1/10), come nel primo caso.':'Le quattro componenti sono (2,1,2,1)/√10; ogni coefficiente conserva l’informazione sull’ordine dei due sistemi.');
  }
  const U=M.kron(M.X,M.eye(2)),V=M.kron(M.eye(2),M.X),left=M.mv(U,v),right=M.mv(V,v);
  S('Scrivere le due azioni locali','X=[[0,1],[1,0]]\nX⊗I=[[0,0,1,0],[0,0,0,1],[1,0,0,0],[0,1,0,0]]\nI⊗X=[[0,1,0,0],[1,0,0,0],[0,0,0,1],[0,0,1,0]]','X sul primo qubit scambia 00↔10 e 01↔11; X sul secondo scambia 00↔01 e 10↔11.');
  S('Seguire tutti gli scambi',labels4.map((label,j)=>`(X⊗I)ψ: c′${label}=c${labels4[j^2]}≈${M.cz(left[j])}; (I⊗X)ψ: d′${label}=c${labels4[j^1]}≈${M.cz(right[j])}`).join('\n'),'La componente nuova viene copiata dalla componente con il bit scelto invertito.');
  S('Verificare attraverso i fattori',`Xa=${M.cv(M.mv(M.X,a))}; Xb=${M.cv(M.mv(M.X,b))}\n(Xa)⊗b=${M.cv(M.tensor(M.mv(M.X,a),b))}\na⊗(Xb)=${M.cv(M.tensor(a,M.mv(M.X,b)))}`,'Il calcolo a quattro componenti coincide con l’azione sulla sola preparazione locale interessata.');
  S('Controllare la norma e il caso invariante','‖(X⊗I)ψ‖²=‖(I⊗X)ψ‖²=1\nX|+⟩=(1,1)ᵀ/√2=|+⟩','I dati scelti rendono visibili gli scambi; una preparazione |+⟩ sul qubit trasformato sarebbe invece invariante.');
  extraFigures.push(complex('Dopo X sul primo qubit',left,labels4),complex('Dopo X sul secondo qubit',right,labels4));
  return finish(k?'Scambio locale di ampiezze con fase':'Due qubit, due scambi distinti',lead,complex('Prima delle porte locali',v,labels4),k?'Il fattore 2i cambia posizione quando si inverte il primo bit; invertire il secondo conserva le due righe e scambia le colonne.':'I due operatori agiscono su coppie diverse di componenti. Il confronto dei prodotti verifica quale qubit sia stato trasformato.');
 }
 return undefined;
}

export const bridges:Record<string,string>={
 complessi:'La rappresentazione cartesiana rende disponibili le componenti; sommandole e moltiplicandole potremo seguire cancellazioni, rotazioni e dilatazioni.',
 'prodotto-complesso':'Le somme di contributi verranno ora generalizzate ai vettori: scegliere una base significa fissare le direzioni che ricostruiscono ogni ingresso.',
 basi:'Una base assegna coordinate a un vettore. Per confrontarne le lunghezze occorre specificare la norma, che resta indipendente dalla particolare scrittura in una base.',
 norma:'La somma dei moduli quadri calcola una lunghezza. Il prodotto interno estenderà lo stesso coniugio al confronto fra due vettori e riconoscerà l’ortogonalità.',
 'prodotto-interno':'Il coefficiente ottenuto dal prodotto interno permette di sottrarre una componente parallela; applicheremo questa idea per costruire una base ortonormale.',
 proiezioni:'Le proiezioni hanno mostrato come costruire direzioni utili. Descriveremo ora una trasformazione indicando dove manda i vettori di una base.',
 matrici:'Le colonne determinano tutte le uscite. Studiare quali loro combinazioni si annullano permetterà di identificare nucleo e perdita di informazione.',
 nucleo:'Dopo aver distinto direzioni conservate e annullate, seguiremo due trasformazioni consecutive per verificare come l’ordine ne cambi l’effetto.',
 composizione:'La composizione consente anche di convertire coordinate, applicare un operatore e riconvertire l’uscita. Questa successione costruirà la matrice in una nuova base.',
 'cambio-base':'Il cambio di base ha richiesto l’inversa. L’aggiunto è un’operazione differente, costruita per trasferire una matrice fra i due argomenti del prodotto interno.',
 aggiunto:'Hermitianità e unitarietà sono state distinte attraverso i loro prodotti. Per comprendere le direzioni su cui un operatore agisce con un solo fattore cercheremo gli autovettori.',
 spettro:'Le rette proprie possono diventare assi di coordinate. Normalizzeremo gli autovettori e ricostruiremo un ingresso mediante le sue componenti proprie.',
 'base-propria':'I coefficienti propri ricostruiscono il vettore. I prodotti esterni degli assi unitari permetteranno di calcolare ogni componente mediante una matrice proiettore.',
 proiettori:'La somma dei proiettori pesati dagli autovalori ricostruisce A. Sostituire una funzione agli autovalori permetterà di ottenere potenze ed esponenziali.',
 'funzioni-matrice':'L’esponenziale immaginario conserva la norma e preparerà le evoluzioni del modulo 3. Prima di interpretare le proiezioni come esiti di misura, costruiamo il linguaggio degli eventi e delle probabilità.',
 eventi:'Un evento raccoglie etichette. Una variabile raggrupperà gli stessi esiti secondo i valori assegnati, producendo una nuova distribuzione.',
 distribuzioni:'Dopo aver normalizzato e raggruppato i pesi, li useremo per calcolare il baricentro dei valori e la dispersione intorno a esso.',
 momenti:'Media e varianza descrivono una distribuzione teorica. Le raccolte di prove produrranno conteggi e frequenze che fluttuano intorno a queste previsioni.',
 frequenze:'Le frequenze distinguono dati osservati e modello. Le tabelle congiunte permetteranno ora di aggiornare la distribuzione quando un risultato parziale è noto.',
 condizionamento:'La selezione di un evento richiede un peso positivo. Nella misura quantistica ritroveremo questa rinormalizzazione dopo aver costruito le ampiezze dello stato.',
 stati:'Le componenti normalizzate e la loro mappa di Bloch descrivono un qubit puro. Il passaggio dal ket al bra renderà espliciti i prodotti interni con altre preparazioni.',
 bra:'Il bra calcola coefficienti rispetto a una direzione. Nelle basi X e Z useremo questi coefficienti per rendere visibile il ruolo della fase relativa.',
 fase:'La stessa preparazione può avere distribuzioni differenti in basi differenti. Formalizzeremo il calcolo delle probabilità e degli stati condizionati attraverso i proiettori.',
 born:'La misura separa rami e richiede un aggiornamento condizionato. Studieremo ora trasformazioni unitarie che conservano insieme tutte le ampiezze e la norma.',
 unitarie:'Le trasformazioni unitarie cambiano la preparazione. Un’osservabile assegnerà valori numerici reali agli esiti e permetterà di calcolarne media e varianza.',
 osservabili:'La distribuzione di una singola osservabile è determinata. Per due misure successive servirà invece seguire lo stato condizionato in ciascun ramo e confrontare entrambi gli ordini.',
 incompatibilita:'L’ordine delle misure e le dispersioni su copie hanno ruoli distinti. Riuniremo i calcoli in un esperimento con un’osservabile complessa esplicitamente dichiarata.',
 esperimento:'Il calcolo completo ha collegato stato, autospazi e risultati. Per estenderlo a due sistemi occorre costruire lo spazio congiunto mediante il prodotto tensoriale.',
 tensore:'Le quattro ampiezze conservano le due etichette locali. Le matrici X⊗I e I⊗X mostreranno come trasformare soltanto il sistema indicato.',
 'porte-locali':'Le porte locali agiscono sui fattori quando una preparazione è prodotto. Verificheremo ora quando quattro ampiezze ammettano effettivamente due fattori locali.',
 separabilita:'La fattorizzazione riguarda le ampiezze pure. Le probabilità congiunte permetteranno di vedere come preparazioni con le stesse statistiche locali possano avere correlazioni differenti.',
 composti:'Nel modulo 3 le basi tensoriali diventeranno registri, le matrici unitarie diventeranno porte e i prodotti ordinati diventeranno programmi. I proiettori già costruiti forniranno la lettura finale e gli eventuali rami condizionati.'
};
