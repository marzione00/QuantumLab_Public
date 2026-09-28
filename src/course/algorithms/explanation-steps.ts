import * as M from '../math/core';
import {step,type WorkStep} from '../book/types';

const matrix=(a:M.Mat)=>a.map(row=>'['+row.map(z=>M.cz(z,6)).join('; ')+']').join('\n');

/** These derivations use the same data as the worked examples. */
export function rootsOfUnitySteps(N:number):WorkStep[]{
 return [
  step('Sommare le radici dell’unità',`S=1+z+⋯+z^(${N}-1).\nzS=z+z²+⋯+z^${N}; (1−z)S=1−z^${N}.\nSe z≠1: S=(1−z^${N})/(1−z). Se z=1: S=${N}.`,'La sottrazione cancella tutti i termini intermedi. Il caso z=1 va separato prima della divisione.'),
  step('Dalla cancellazione all’unitarietà',`z=e^(2πi(x−x′)/${N}); z^${N}=1.\n⟨F${N}x′|F${N}x⟩=(1/${N})Σy zʸ=${N}/${N}=1 se x=x′; 0 altrimenti.`,'Per x e x′ distinti fra 0 e N−1, z≠1: le frecce delle radici si chiudono. Le colonne di Fourier sono quindi ortonormali e la trasformata conserva prodotti interni e norma.')
 ];
}

export function qftConstructionSteps(n:number,x:number):WorkStep[]{
 return [
  step('Scomporre la fase secondo i bit',`x=Σj xⱼ2^(n−1−j), y=Σj yⱼ2^(n−1−j).\ne^(2πixy/2ⁿ)=∏j e^(2πiyⱼx/2^(j+1)).\nF|x⟩=⊗j=0…n−1 (|0⟩+e^(2πix/2^(j+1))|1⟩)/√2.\nQui n=${n}, x=${x}.`,'L’indice j del prodotto è il filo in uscita in ordine big-endian. Ogni bit yⱼ sceglie il termine |0⟩ oppure il termine con fase del proprio fattore.'),
  step('Leggere le frazioni binarie',`x=2x₀+x₁ ⇒ F₄|x₀x₁⟩\n=(|0⟩+e^(2πi·0.x₁)|1⟩)/√2 ⊗ (|0⟩+e^(2πi·0.x₀x₁)|1⟩)/√2.\n0.x₁=x₁/2; 0.x₀x₁=x₀/2+x₁/4.`,'La notazione 0.x₀x₁ indica una frazione in base due, non un numero decimale. I denominatori 2,4,8 determinano fasi di 180°,90°,45°.'),
  step('Ricostruire le porte a due qubit','H sul filo q₀ produce la fase (−1)^x₀=e^(2πix₀/2).\nP(90°) su q₀ controllata da q₁ aggiunge e^(2πix₁/4).\nH su q₁ produce e^(2πix₁/2).\nI fattori sono nell’ordine opposto a quello di F₄: lo SWAP finale scambia q₀ e q₁.','Il controllo è ancora un bit di base quando imposta la fase sul primo filo. Per più qubit ogni bit successivo aggiunge P(180°/2^(k−j)); gli scambi finali invertono l’ordine dei fili.'),
  step('Espandere e rifattorizzare il caso preliminare','F₄|01⟩=(|00⟩+i|01⟩−|10⟩−i|11⟩)/2\n=((|0⟩−|1⟩)/√2)⊗((|0⟩+i|1⟩)/√2).','Moltiplicando i due fattori si ritrovano tutte e quattro le ampiezze. Il caso a due qubit mostra concretamente il procedimento che si estende al registro assegnato.'),
  step('Costruire i fattori del registro assegnato',`F_${2**n}|${x}⟩=${Array.from({length:n},(_,j)=>`(|0⟩+e^(2πi·${x}/${2**(j+1)})|1⟩)/√2`).join(' ⊗ ')}\nFasi dei fattori in ordine di filo: ${Array.from({length:n},(_,j)=>M.f(((x/2**(j+1))%1)*360,6)+'°').join(', ')}.`,n===3?'Per x=3 i fattori hanno fasi π, 3π/2, 3π/4: i coefficienti di |1⟩ sono −1, −i, (−1+i)/√2. Il circuito successivo realizza F₈ su |011⟩.':'Il circuito successivo realizza F₄ su |01⟩. Il confronto diretto verifica tutti i coefficienti e l’ordine dei fattori.')
 ];
}

export function groverPlaneSteps(initial:M.V,marked:number[],spectrum=true):WorkStep[]{
 const p=marked.reduce((sum,j)=>sum+M.abs2(initial[j]),0),theta=Math.asin(Math.sqrt(p));
 if(p<=0||p>=1)return [step('Caso degenere della ricerca',`p=${p}`,'Se una delle due proiezioni è nulla, il corrispondente asse normalizzato non è definito: si considera direttamente il sottospazio occupato.')];
 const g=initial.map((z,j)=>M.scale(z,marked.includes(j)?1/Math.sqrt(p):0)),b=initial.map((z,j)=>M.scale(z,marked.includes(j)?0:1/Math.sqrt(1-p))),C=1-2*p,T=2*Math.sqrt(p*(1-p));
 const out=[
  step('Costruire gli assi dalle proiezioni',`|a⟩=A|0⟩; ΠG=Σx∈G|x⟩⟨x|; p=⟨a|ΠG|a⟩=${M.f(p,6)}.\n|g⟩=ΠG|a⟩/√p≈${M.cv(g)}\n|b⟩=(I−ΠG)|a⟩/√(1−p)≈${M.cv(b)}.\n⟨b|g⟩=0; ‖b‖=‖g‖=1.`,'I supporti sono disgiunti. Per la preparazione uniforme questi vettori diventano Σx∈G|x⟩/√M e Σx∉G|x⟩/√(N−M). Per una preparazione non uniforme conservano i suoi pesi e le sue fasi.'),
  step('Proiettare la preparazione nel piano',`⟨b|a⟩=√(1−p)=${M.f(Math.sqrt(1-p),6)}; ⟨g|a⟩=√p=${M.f(Math.sqrt(p),6)}.\n|a⟩=cosθ|b⟩+sinθ|g⟩; θ=arcsin√p≈${M.f(theta,6)} rad.`,'Gli assi sono stati collettivi, non singoli esiti. Le coordinate qui sono reali perché le fasi della preparazione sono state incluse nella definizione degli assi.'),
  step('Scrivere le due riflessioni','Nella base ordinata (|b⟩,|g⟩):\nO=I−2ΠG=[[1,0],[0,−1]].\nD_A=2|a⟩⟨a|−I\n=[[2cos²θ−1,2cosθsinθ],[2cosθsinθ,2sin²θ−1]]\n=[[cos2θ,sin2θ],[sin2θ,−cos2θ]].','O riflette rispetto all’asse |b⟩. D_A riflette rispetto alla retta della preparazione |a⟩. L’ordine temporale è prima O e poi D_A.'),
  step('Moltiplicare e ottenere la rotazione',`Q=D_AO=[[cos2θ,−sin2θ],[sin2θ,cos2θ]]\n≈[[${M.f(C,6)},${M.f(-T,6)}],[${M.f(T,6)},${M.f(C,6)}]].\nO(cosθ,sinθ)ᵀ=(cosθ,−sinθ)ᵀ;\nQ(cosθ,sinθ)ᵀ=(cos3θ,sin3θ)ᵀ.\nQᵏ|a⟩=cos((2k+1)θ)|b⟩+sin((2k+1)θ)|g⟩.`,'Il prodotto riga per colonna dà le formule di addizione del seno e del coseno. Ogni coppia completa di riflessioni ruota di 2θ; dopo il solo oracolo si usa invece la riflessione, non la formula delle iterazioni complete.')
 ];
 if(Math.abs(p-.25)<1e-12)out.push(step('Verificare il caso p=1/4','θ=π/6; |a⟩=(√3/2,1/2)ᵀ.\nO|a⟩=(√3/2,−1/2)ᵀ.\nD_A=[[1/2,√3/2],[√3/2,−1/2]].\nD_AO|a⟩=(√3/4−√3/4,√3·√3/4+1/4)ᵀ=(0,1)ᵀ.','Il medesimo calcolo vale per N=4,M=1 e per N=8,M=2. Una sola coppia di riflessioni porta tutto il peso sul sottospazio buono.'));
 if(spectrum)out.push(
  step('Ricavare autovettori e autofasi','det(Q−λI)=λ²−2cos(2θ)λ+1=0.\nλ±=cos2θ±i sin2θ=e^(±2iθ).\n|u+⟩=(|b⟩−i|g⟩)/√2; |u−⟩=(|b⟩+i|g⟩)/√2.\nQ|u±⟩=e^(±2iθ)|u±⟩; φ+=θ/π, φ−=1−θ/π (mod 1).','Gli autovettori hanno coordinate complesse nel piano collettivo; non sono due frecce reali sul piano di Grover. Le autofasi sono frazioni di giro, poiché QPE usa e^(2πiφ).'),
  step('Determinare i coefficienti della preparazione','β+=⟨u+|a⟩=(cosθ+i sinθ)/√2=e^(iθ)/√2.\nβ−=⟨u−|a⟩=(cosθ−i sinθ)/√2=e^(−iθ)/√2.\n|a⟩=β+|u+⟩+β−|u−⟩; |β+|²=|β−|²=1/2.','I due pesi uguali derivano dal prodotto interno con la preparazione. Manteniamo anche le fasi dei coefficienti: servono per ricostruire il bersaglio coerente condizionato dopo QPE.')
 );
 return out;
}

export function evolutionSteps(t:number,r:number):WorkStep[]{
 const dt=t/r,C=Math.cos(Math.SQRT2*t),S=Math.sin(Math.SQRT2*t)/Math.SQRT2,exact:M.Mat=[[M.z(C,-S),M.z(0,-S)],[M.z(0,-S),M.z(C,S)]],cx=Math.cos(dt),sx=Math.sin(dt),rx:M.Mat=[[M.z(cx),M.z(0,-sx)],[M.z(0,-sx),M.z(cx)]],rz:M.Mat=[[M.cis(-dt),M.z()],[M.z(),M.cis(dt)]],short=M.mm(rz,rx);let approx=M.eye(2);for(let j=0;j<r;j++)approx=M.mm(short,approx);
 return [
  step('Definire il generatore e il parametro','K=X+Z=[[1,1],[1,−1]]; U(t)=exp(−itK); ψ(0)=|0⟩.\nK†=K ⇒ U(t)†U(t)=I.','K è il generatore hermitiano dell’evoluzione e H continua a indicare la porta Hadamard. In questo modello t è adimensionale: una scala di frequenza è assorbita nel tempo, equivalendo alla consueta scelta ℏ=1 con energia misurata nella scala adottata.'),
  step('Costruire lo spettro di K','K²=[[1,1],[1,−1]]²=[[2,0],[0,2]]=2I.\nλ²=2 ⇒ λ+=√2, λ−=−√2.\nP±=(I±K/√2)/2; P±²=P±, P+P−=0, P++P−=I.','Le due radici sono entrambe autovalori perché la traccia di K è zero e K non è scalare. I proiettori separano le due autodirezioni senza richiedere una scelta di fase degli autovettori.'),
  step('Calcolare l’esponenziale spettrale','U(t)=e^(−i√2t)P++e^(i√2t)P−\n=cos(√2t)I−i sin(√2t)K/√2.\nC=cos(√2t), S=sin(√2t)/√2 ⇒ U=[[C−iS,−iS],[−iS,C+iS]].','Sostituiamo P± e raccogliamo separatamente I e K. La stessa formula segue raggruppando le potenze pari e dispari della serie, perché K²=2I.'),
  step('Giustificare un passo di Trotter',`Δt=t/r=${M.f(dt,6)}.\ne^(−iΔtZ)e^(−iΔtX)=I−iΔt(X+Z)−Δt²(I+ZX)+O(Δt³).\ne^(−iΔt(X+Z))=I−iΔt(X+Z)−Δt²I+O(Δt³).\nDifferenza locale=−Δt²ZX+O(Δt³)=−(Δt²/2)[Z,X]+O(Δt³).`,'I termini di primo ordine coincidono; quelli incrociati distinguono il prodotto dalla somma quando i generatori non commutano. Su r passi, a tempo fissato, l’errore globale di primo ordine diminuisce come O(t²/r).'),
  step('Tradurre gli esponenziali in rotazioni',`Rx(α)=exp(−iαX/2), Rz(α)=exp(−iαZ/2).\nα=2Δt=${M.f(2*dt,6)} rad=${M.f(2*dt*180/Math.PI,6)}°.\nU_r=[Rz(2Δt)Rx(2Δt)]^${r}.`,'Il circuito applica prima Rx e poi Rz, quindi la matrice a sinistra è Rz. Il fattore due nasce dalla definizione delle rotazioni del qubit; il tempo t e l’angolo sulla sfera sono grandezze diverse.'),
  step('Confrontare le matrici prima dei vettori',`U(${t})≈\n${matrix(exact)}\nRz(2Δt)Rx(2Δt)≈\n${matrix(short)}\nU_${r}≈\n${matrix(approx)}`,'Le matrici specificano l’evoluzione su ogni ingresso. Per |0⟩ il vettore in uscita è la loro prima colonna; il confronto successivo usa la norma vettoriale con la fase fissata dalle evoluzioni. Il costo della suddivisione è 2r rotazioni.')
 ];
}

export function modularAdditionSteps(N:number,constant:number,x:number):WorkStep[]{
 const n=Math.ceil(Math.log2(N)),b=((constant%N)+N)%N,sum=x+b,flag=Number(sum>=N),y=sum-flag*N;
 return [
  step('Collegare somma binaria e somma modulo N',`B=${b}, N=${N}; 0≤x,B<N; n=⌈log₂N⌉=${n}.\nRegistro S di n+1=${n+1} bit: S←x+B; flag f←[S≥N]; S←S−fN.\nCaso x=${x}: S=${sum}, f=${flag}, risultato y=${y}.`,'Il bit supplementare conserva il trabocco della somma ordinaria. Una sola sottrazione basta perché x+B<2N. Confronto e sottrazione sono calcoli reversibili: le reti di riporti del sommatore si eseguono e poi si ripercorrono all’indietro. Per una somma controllata, il controllo c abilita il blocco: c=0 dà l’identità, c=1 dà T_B; c resta disponibile anche durante il ripristino.'),
  step('Ripulire il flag della riduzione','Per B fisso e 0≤x<N: f=[x+B≥N]=[y<B].\nCalcola reversibilmente [y<B] in un ausiliario pulito; applica CNOT verso f; disfa il confronto.\nf←f⊕[y<B]=0; gli ausiliari del confronto tornano a zero.','Se non c’è riduzione, y=x+B≥B; se c’è riduzione, y=x+B−N<B. Questa equivalenza permette di cancellare il flag dal risultato, evitando di scartare informazione in modo irreversibile.'),
  step('Definire la permutazione sull’intero registro',`T_B(x)=(x+${b}) mod ${N} per x<${N}; T_B(x)=x per x≥${N}.\nT_B⁻¹(y)=(y−${b}) mod ${N} nel dominio valido; identità fuori dominio.\n|x⟩|0⟩ → |x⟩|T_B(x)⟩ → |T_B(x)⟩|x⟩\n→ |T_B(x)⟩|x⊕T_B⁻¹(T_B(x))⟩=|T_B(x)⟩|0⟩.`,'Il confronto x<N conserva un flag di dominio durante il calcolo; dopo lo scambio lo si cancella ricomputando y<N, che è invariato dalla permutazione. Gli oracoli XOR conservano l’ingresso: calcolano somma, confronto e riduzione in lavoro, copiano il risultato, poi disfano la storia. Questa è una costruzione aritmetica a blocchi; la rete effettivamente verificata nei piccoli esempi usa invece i mintermini dichiarati.')
 ];
}
