type AlgorithmTheory = {
  intro: string;
  theory: string[];
  definition: string;
  space: string;
  bridge: string;
};

// Le definizioni precedono le formule; i raccordi richiamano la costruzione appena svolta.
export const algorithmTheory = {
  programma: {
    intro: 'Nel modulo precedente uno stato era un vettore normalizzato e una trasformazione reversibile era una matrice unitaria. Un circuito organizza questi oggetti in un programma: preparazione dell’ingresso, trasformazioni in ordine temporale e misura dell’uscita.',
    theory: [
      'Un qubit ha stato |ψ⟩=α|0⟩+β|1⟩, con α e β complessi e |α|²+|β|²=1. Una porta U sostituisce il vettore colonna ψ con Uψ. La porta Hadamard H=1/√2 [[1,1],[1,−1]] calcola somma e differenza delle ampiezze; la porta Z=diag(1,−1) cambia il segno della seconda.',
      'Nel disegno il tempo procede da sinistra a destra. Se U₁ agisce prima di U₂, il vettore finale è U₂U₁ψ: il fattore più a destra agisce per primo. I fili sono ordinati dall’alto con q₀ più significativo; per n qubit la parola x₀…xₙ₋₁ denota x=Σⱼxⱼ2^(n−1−j). Questa è la convenzione big-endian.',
      'La misura nella base computazionale produce l’etichetta x con probabilità P(x)=|⟨x|ψ⟩|². Il simulatore calcola queste probabilità teoriche. Selezionare una porta permette di ispezionare il vettore intermedio senza misurarlo e senza eliminare componenti.',
    ],
    definition: 'ψⱼ₊₁=Uⱼψⱼ; ψfinale=Uₖ⋯U₂U₁ψ₀; P(x)=|⟨x|ψfinale⟩|².',
    space: 'Il circuito mostra fili logici e successione di operazioni. Ogni piano complesso ha assi Re e Im di un’ampiezza, senza unità fisiche; le barre mostrano probabilità fra 0 e 1. Nessuna di queste coordinate indica la posizione del qubit nello spazio.',
    bridge: 'L’unitarietà conserva il prodotto interno e rende invertibile il programma. Per incorporare una funzione classica come AND dobbiamo quindi conservare l’informazione che una sua uscita, da sola, perderebbe.',
  },
  reversibilita: {
    intro: 'AND associa tre ingressi distinti all’uscita zero, perciò il risultato non basta a ricostruire l’ingresso. Un calcolo reversibile conserva gli ingressi e scrive la funzione in un registro aggiuntivo.',
    theory: [
      'Per bit a,b,t∈{0,1}, il prodotto ab è AND e il simbolo ⊕ indica XOR, cioè somma modulo due. La porta Toffoli, detta anche CCX, cambia il bersaglio t soltanto quando entrambi i controlli a e b valgono uno: (a,b,t)↦(a,b,t⊕ab).',
      'Applicando due volte la stessa porta si ottiene t⊕ab⊕ab=t. La mappa è quindi una permutazione degli otto vettori della base e la sua matrice è unitaria. Per linearità la stessa operazione agisce sulle sovrapposizioni, trasportando ciascuna ampiezza senza alterarne la fase.',
      'Un bersaglio iniziale t=0 restituisce ab; con t=1 restituisce 1⊕ab. Specificare l’inizializzazione dell’ausiliario fa dunque parte del programma. La conservazione degli ingressi non autorizza a copiare uno stato quantistico arbitrario: qui si definisce una trasformazione delle etichette di base.',
    ],
    definition: 'CCX|a,b,t⟩=|a,b,t⊕ab⟩; CCX²=I.',
    space: 'Le parole 000,…,111 etichettano la base di C⁸. Le frecce indicano una permutazione di etichette, non traiettorie fisiche; le ampiezze complesse rimangono associate ai rami del registro.',
    bridge: 'Le permutazioni reversibili sono un primo esempio di unitarie. Le porte di un qubit estendono la costruzione a combinazioni lineari e fasi, che non si descrivono soltanto spostando bit.',
  },
  porte: {
    intro: 'Una porta su un qubit è una matrice 2×2 nella base ordinata |0⟩,|1⟩. Per capire il programma seguiamo sia le due ampiezze complesse sia il punto di Bloch che rappresenta il loro stato fisico.',
    theory: [
      'Le matrici di Pauli sono X=[[0,1],[1,0]], Y=[[0,−i],[i,0]], Z=[[1,0],[0,−1]]. X scambia le ampiezze, Z introduce un segno relativo e Y combina scambio e fasi. Nel primo esempio X, Y e Z agiscono in sequenza sul medesimo stato |+⟩=(|0⟩+|1⟩)/√2.',
      'Per un asse k∈{x,y,z} definiamo Rₖ(θ)=exp(−iθσₖ/2), dove σₖ è la corrispondente matrice di Pauli e θ è in radianti. Poiché σₖ²=I, separare i termini pari e dispari della serie esponenziale dà Rₖ(θ)=cos(θ/2)I−i sin(θ/2)σₖ. Le etichette delle porte esprimono lo stesso angolo in gradi.',
      'Per ψ=(α,β), il punto di Bloch ha coordinate (2Re(ᾱβ),2Im(ᾱβ),|α|²−|β|²). Da Rᵧ(θ)|0⟩=(cos(θ/2),sin(θ/2)) segue Bloch=(sinθ,0,cosθ): le ampiezze contengono il mezzo angolo, mentre sulla sfera la rotazione è θ. La fase P(φ)=diag(1,exp(iφ)) equivale a Rz(φ) a meno del fattore globale exp(iφ/2).',
    ],
    definition: 'Rᵧ(θ)=[[cos(θ/2),−sin(θ/2)],[sin(θ/2),cos(θ/2)]].',
    space: 'Le ampiezze appartengono a C²; la sfera di Bloch ha coordinate reali adimensionali e raggio uno per uno stato puro. I suoi assi rappresentano valori attesi di X,Y,Z, non direzioni di moto dell’apparato.',
    bridge: 'Una rotazione Rᵧ fissa i moduli delle due ampiezze e una porta P ne fissa la fase relativa. Questa separazione consente di costruire una preparazione assegnata.',
  },
  preparazione: {
    intro: 'Dato uno stato normalizzato α|0⟩+β|1⟩, cerchiamo porte che lo preparino da |0⟩. I due dati fisicamente rilevanti sono il peso di |1⟩ e la fase relativa fra le componenti.',
    theory: [
      'Se entrambe le componenti sono non nulle, togliamo il fattore globale exp(i argα) e scriviamo lo stato come |α||0⟩+exp(iφ)|β||1⟩, con φ=argβ−argα. Ponendo θ=2 arccos|α|, la normalizzazione dà sin(θ/2)=|β|. Quindi P(φ)Rᵧ(θ)|0⟩ realizza lo stato richiesto a meno di quella fase globale.',
      'Ai poli una delle componenti è zero e il suo argomento non è definito: per |0⟩ basta θ=0, per |1⟩ basta θ=π; possiamo scegliere φ=0 perché la fase della sola componente presente è globale. Nei due esempi α è già reale positivo, quindi la costruzione coincide anche con la convenzione di fase del vettore dato.',
      'La prima porta porta Bloch dal polo nord al meridiano y=0. La fase P ruota le coordinate x,y attorno a z e conserva le probabilità nella base computazionale. I punti successivi della sfera vanno letti insieme alle ampiezze dopo ciascuna porta.',
    ],
    definition: 'P(φ)Rᵧ(θ)|0⟩=cos(θ/2)|0⟩+exp(iφ) sin(θ/2)|1⟩.',
    space: 'I piani Re/Im conservano la convenzione di fase del vettore; Bloch identifica vettori che differiscono solo per fase globale. I punti selezionati mostrano gli stati dopo le porte, senza implicare una misura intermedia.',
    bridge: 'Conosciuta la sequenza che prepara lo stato, possiamo percorrerla all’indietro. L’ordine delle inverse è essenziale quanto gli angoli delle porte.',
  },
  inversa: {
    intro: 'La preparazione precedente è una trasformazione reversibile. Per ricostruire l’ingresso annulliamo prima l’ultima operazione e proseguiamo nell’ordine opposto.',
    theory: [
      'L’aggiunto U† è la trasposta coniugata: si scambiano righe e colonne e si coniugano gli elementi. Una matrice unitaria soddisfa U†U=I, quindi U⁻¹=U†. Per U=U₃U₂U₁, il prodotto U₁†U₂†U₃†U cancella le coppie adiacenti cominciando da U₃.',
      'H, X e Z sono auto-inverse. Per le porte dipendenti da un angolo si cambia il segno: P(φ)†=P(−φ), Rᵧ(θ)†=Rᵧ(−θ). L’uguaglianza dei soli moduli quadrati non verifica l’inversione: occorre recuperare anche le fasi relative del vettore iniziale.',
    ],
    definition: '(U₃U₂U₁)⁻¹=U₁†U₂†U₃†; U†Uψ=ψ.',
    space: 'La successione di punti su Bloch segue andata e ritorno dello stato puro. I piani complessi permettono di controllare le componenti anche quando uno stesso punto di Bloch corrisponde a vettori con fase globale diversa.',
    bridge: 'L’ultima H di un interferometro può annullare la prima H solo se tra le due non cambia la fase relativa. Inserendo P osserviamo come una fase diventa una probabilità misurabile.',
  },
  interferometro: {
    intro: 'La porta P modifica una fase relativa senza cambiare i moduli delle ampiezze. Il circuito H–P–H ricombina le componenti e rende questa variazione leggibile nella misura.',
    theory: [
      'Da |0⟩ la prima Hadamard produce (|0⟩+|1⟩)/√2. Dopo P(φ) il vettore è (1,exp(iφ))/√2. L’ultima H dà le ampiezze (1+exp(iφ))/2 e (1−exp(iφ))/2; per ottenere probabilità si calcola il modulo quadrato di ciascuna somma.',
      'Poiché |1+exp(iφ)|²=(1+exp(iφ))(1+exp(−iφ))=2+2cosφ, P(0)=(1+cosφ)/2 e P(1)=(1−cosφ)/2. A 0° il risultato è 0 con certezza, a 180° è 1 con certezza, a 90° i due risultati hanno probabilità 1/2. Una fase globale moltiplicherebbe entrambe le ampiezze e non produrrebbe questo confronto.',
    ],
    definition: 'HP(φ)H|0⟩=[(1+exp(iφ))|0⟩+(1−exp(iφ))|1⟩]/2.',
    space: 'Le frecce complesse si sommano nel piano Re/Im. L’angolo φ è una fase, espressa in gradi nei comandi e in radianti negli esponenziali; le barre sono probabilità teoriche, senza campionamento.',
    bridge: 'La ricombinazione funziona anche dentro un registro composto. Occorre però conservare le ampiezze congiunte: una porta controllata può collegare i qubit in modo che non abbiano più stati puri separati.',
  },
  registro: {
    intro: 'Due qubit hanno uno stato congiunto in C²⊗C², di dimensione quattro. Il prodotto tensoriale del modulo 2 diventa qui la regola per assegnare matrici ai fili del circuito.',
    theory: [
      'Usiamo la base |00⟩,|01⟩,|10⟩,|11⟩ e scriviamo ψ=(c₀₀,c₀₁,c₁₀,c₁₁)ᵀ, con Σ|cₐᵦ|²=1. Una porta U sul primo filo è U⊗I; sul secondo è I⊗U. Un controllo è coerente: in una sovrapposizione ciascun ramo segue la regola senza leggere classicamente il controllo.',
      'CNOT, o CX, agisce come |a,b⟩↦|a,b⊕a⟩. La sua matrice è [[1,0,0,0],[0,1,0,0],[0,0,0,1],[0,0,1,0]], quindi scambia c₁₀ e c₁₁, comprese le rispettive fasi. La probabilità di leggere solo il primo bit a si ottiene sommando |cₐ₀|²+|cₐ₁|².',
    ],
    definition: 'CX(c₀₀,c₀₁,c₁₀,c₁₁)ᵀ=(c₀₀,c₀₁,c₁₁,c₁₀)ᵀ.',
    space: 'I quattro piani complessi rappresentano coordinate dello stesso vettore congiunto. I fili sono sottosistemi logici; i valori 00,…,11 sono etichette binarie. Le marginali sommano probabilità di rami ortogonali.',
    bridge: 'Applicando CNOT a un controllo in sovrapposizione possiamo ottenere un vettore che non si fattorizza. Gli stati di Bell permettono di riconoscere questa proprietà attraverso misure in più basi.',
  },
  bell: {
    intro: 'H sul primo qubit e CNOT preparano lo stato di Bell |Φ+⟩=(|00⟩+|11⟩)/√2. Questo stato è entangled: nessun prodotto di due vettori di un qubit riproduce le sue quattro ampiezze.',
    theory: [
      'Misurando in Z,Z, gli unici esiti possibili sono 00 e 11, ciascuno con probabilità 1/2. Per ogni qubit separato P(0)=P(1)=1/2. La matrice ridotta, ottenuta sommando sul secondo indice, è ρA=diag(1/2,1/2)=I/2; la stessa relazione vale per B. Il centro di Bloch rappresenta questa descrizione mista.',
      'La base X è formata da |+⟩ e |−⟩. Applicare H prima della misura Z realizza una misura X, perché H|+⟩=|0⟩ e H|−⟩=|1⟩. Siccome (H⊗H)|Φ+⟩=|Φ+⟩, anche X,X dà risultati uguali con probabilità 1/2 per ciascuna coppia.',
      'Una miscela classica di |00⟩ e |11⟩ con pesi 1/2 riproduce Z,Z, ma dopo H⊗H dà quattro esiti equiprobabili. Il confronto fra i due esempi distingue quindi la coerenza dello stato Bell da una sola correlazione classica. Se si cambia soltanto la base di B, (I⊗H)|Φ+⟩=(|00⟩+|01⟩+|10⟩−|11⟩)/2: in Z,X la distribuzione è uniforme.',
    ],
    definition: 'ρA(a,a′)=Σᵦcₐᵦc̄ₐ′ᵦ; per |Φ+⟩, ρA=ρB=I/2.',
    space: 'Lo stato congiunto usa quattro ampiezze; le barre delle misure riportano etichette nella base scelta. Una marginale mista non viene sostituita da un vettore puro locale arbitrario.',
    bridge: 'Un registro di lavoro può rimanere correlato ai dati proprio come il secondo qubit di Bell. Per usarlo temporaneamente e recuperare l’interferenza dobbiamo ripristinarlo dopo il calcolo.',
  },
  ausiliari: {
    intro: 'Un’ancilla è un qubit ausiliario preparato in uno stato noto, qui |0⟩. La usiamo per calcolare una funzione, applicare una fase dipendente dal risultato e restituire il registro di lavoro allo stato iniziale.',
    theory: [
      'L’oracolo reversibile di una funzione booleana f è U_f|x,t⟩=|x,t⊕f(x)⟩. Per f(a,b)=ab è una Toffoli. Partendo da Σₓcₓ|x⟩|0⟩, il calcolo dà Σₓcₓ|x⟩|f(x)⟩; Z sull’ancilla moltiplica ogni ramo per (−1)^(f(x)).',
      'La seconda applicazione di U_f, uguale alla sua inversa, riporta l’ancilla a zero: Σₓ(−1)^(f(x))cₓ|x⟩|0⟩. La fase resta nei dati. Se omettiamo il ripristino, rami con valori diversi di f conservano ancille ortogonali; ignorare l’ancilla fa perdere i termini di coerenza fra quei gruppi.',
    ],
    definition: 'U_f†(I⊗Z)U_f|x,0⟩=(−1)^(f(x))|x,0⟩.',
    space: 'Le otto ampiezze descrivono due qubit dati e un ausiliario. Pulire il lavoro significa riportarlo a |0⟩ su tutti i rami, non azzerare arbitrariamente componenti del vettore.',
    bridge: 'Il blocco calcolo–fase–ripristino è una porta composta. Per sostituirlo, o sostituire altre porte, con operazioni elementari dobbiamo verificare l’intera trasformazione lineare.',
  },
  sintesi: {
    intro: 'Sintetizzare una porta significa realizzare la sua matrice mediante un prodotto di porte disponibili. Una verifica su tutti i vettori della base dimostra l’identità anche sulle sovrapposizioni.',
    theory: [
      'CZ è la porta controllata Z: nella base 00,01,10,11 ha diagonale (1,1,1,−1). La relazione HZH=X segue moltiplicando le tre matrici 2×2. Quando il controllo vale 0, due Hadamard sul bersaglio danno H²=I; quando vale 1, il bersaglio riceve HZH=X.',
      'Ne segue CX=(I⊗H)CZ(I⊗H). Provare soltanto le probabilità finali non basta: due circuiti potrebbero introdurre fasi relative diverse. I vettori completi e il caso in sovrapposizione verificano anche questo aspetto. Una fase globale comune è fisicamente equivalente per la porta isolata, ma richiede attenzione quando la porta viene controllata.',
    ],
    definition: 'CZ=diag(1,1,1,−1); CX=(I⊗H)CZ(I⊗H).',
    space: 'Le matrici 4×4 agiscono nello spazio delle ampiezze dei due qubit. Le porte del circuito rappresentano fattori ordinati del prodotto; i piani Re/Im mostrano le fasi degli stati intermedi.',
    bridge: 'Hadamard converte una fase in un cambiamento di etichetta. Deutsch usa la stessa idea insieme a un oracolo di funzione per estrarre una proprietà globale con una sola interrogazione.',
  },
  deutsch: {
    intro: 'Data f:{0,1}→{0,1}, vogliamo sapere se f(0)=f(1), caso costante, oppure f(0)≠f(1), caso bilanciato. Gli esempi coprono tutte e quattro le funzioni.',
    theory: [
      'Prepariamo il registro dati in |+⟩=(|0⟩+|1⟩)/√2 e il bersaglio in |−⟩=(|0⟩−|1⟩)/√2. Poiché X|−⟩=−|−⟩, l’oracolo U_f|x,t⟩=|x,t⊕f(x)⟩ agisce come U_f|x⟩|−⟩=(−1)^(f(x))|x⟩|−⟩. Questo trasferimento della fase al controllo è il ritorno di fase, o phase kickback.',
      'La H finale sul registro dati produce ampiezza [(−1)^(f(0))+(−1)^(f(1))]/2 per 0 e [(−1)^(f(0))−(−1)^(f(1))]/2 per 1. Segni uguali concentrano la probabilità su 0; segni opposti su 1. Il bersaglio rimane |−⟩ e non contiene l’uscita decisionale.',
      'Per leggere soltanto il dato sommiamo le probabilità congiunte sui due valori del bersaglio: P(dato=0)=P(00)+P(01). L’eventuale segno globale delle ampiezze distingue le convenzioni dei quattro casi, senza cambiare questa decisione.',
    ],
    definition: 'P(dato=0)=1 per f costante; P(dato=1)=1 per f bilanciata.',
    space: 'Il vettore vive in C⁴, ma il risultato dell’algoritmo è la marginale di un solo qubit. Le somme e differenze sono interferenza di ampiezze; le somme sui valori del bersaglio sono marginalizzazione di probabilità.',
    bridge: 'Deutsch usa una marcatura di fase per distinguere due proprietà. Nella ricerca di Grover marchiamo la soluzione e scegliamo una seconda riflessione che ne aumenta la probabilità.',
  },
  'grover-primo': {
    intro: 'Cerchiamo una sola parola marcata w fra N=4 etichette. L’oracolo di fase O cambia il segno di |w⟩; una seconda riflessione D, costruita dalla preparazione uniforme, rende certa la soluzione dopo una iterazione.',
    theory: [
      'Poniamo |g⟩=|w⟩ e |b⟩=Σₓ≠w|x⟩/√3. Questi vettori normalizzati sono ortogonali perché hanno supporti disgiunti. Lo stato uniforme |s⟩=Σₓ|x⟩/2 ha coordinate (√3/2,1/2) nella base ordinata (|b⟩,|g⟩); scriviamo quindi |s⟩=cosθ|b⟩+sinθ|g⟩ con θ=π/6.',
      'Dal proiettore P_s=|s⟩⟨s| del modulo 2 otteniamo la riflessione D=2P_s−I: la componente lungo |s⟩ resta invariata e quella ortogonale cambia segno. Nel piano (b,g), O=diag(1,−1) e D=[[1/2,√3/2],[√3/2,−1/2]]. Quindi O(√3/2,1/2)=(√3/2,−1/2) e DO(√3/2,1/2)=(0,1).',
      'Sulle quattro ampiezze la stessa D dà c′ₓ=2μ−cₓ, dove μ=Σₓcₓ/4 è la media dopo l’oracolo. Il risultato geometrico e il calcolo sulle ampiezze descrivono la stessa operazione; l’indice marcato cambia |g⟩, ma non l’angolo iniziale.',
    ],
    definition: 'O=I−2|g⟩⟨g|; D=2|s⟩⟨s|−I; Q=DO; Q|s⟩=|g⟩ per N=4,M=1.',
    space: 'Gli assi b e g sono coordinate reali rispetto a due vettori dello spazio C⁴. Una freccia nel piano riassume ampiezze collettive; la probabilità buona è il quadrato della coordinata g. Il piano non è lo spazio fisico e non è la sfera di Bloch del registro.',
    bridge: 'Una sequenza discreta di porte realizza qui una rotazione. Possiamo anche partire da un generatore continuo e costruire una sequenza di piccole rotazioni che ne approssimi l’evoluzione.',
  },
  evoluzione: {
    intro: 'Le funzioni di matrice del modulo 2 permettono di trasformare un generatore hermitiano K in una famiglia unitaria U(t)=exp(−itK). Qui K=X+Z; la lettera H rimane riservata alla porta Hadamard.',
    theory: [
      'Il parametro t è un tempo adimensionale: abbiamo assorbito la scala energetica e la costante fisica ℏ nelle unità del modello. K descrive due contributi alla dinamica di un qubit. Per una matrice hermitiana l’esponenziale ha autovalori di modulo uno e conserva la norma.',
      'Poiché X²=Z²=I e XZ+ZX=0, K²=2I. I suoi autovalori sono ±√2 e i proiettori sono P±=(I±K/√2)/2. La formula spettrale dà U(t)=exp(−i√2 t) P₊+exp(i√2 t) P₋=cos(√2t)I−i sin(√2t)K/√2. Si ottiene la stessa identità separando potenze pari e dispari nella serie esponenziale.',
      'Dividiamo t in r passi Δt=t/r. Per un passo, exp(−iΔt Z) exp(−iΔt X)=I−iΔt(X+Z)+O(Δt²), lo stesso termine di primo ordine di exp(−iΔt K). Il termine quadratico differisce di −(Δt²/2)[Z,X], dove [Z,X]=ZX−XZ: la non commutatività produce l’errore. A t fissato la ripetizione di r passi ha errore di ordine t²/r.',
      'Ogni fattore exp(−iΔt X) è Rx(2Δt), e analogamente per Z; per questo gli angoli sono 2t/r radianti, convertiti in gradi nelle porte. Il prodotto applica X prima di Z e richiede 2r rotazioni. Il confronto usa la norma euclidea dei vettori con fase fissata; tale norma non è una distanza fisica invariante rispetto alla fase globale.',
    ],
    definition: 'U(t)=cos(√2t)I−i sin(√2t)(X+Z)/√2; Uᵣ(t)=[Rz(2t/r)Rx(2t/r)]ʳ.',
    space: 'Le matrici 2×2 agiscono sulle ampiezze; Bloch rappresenta lo stato del qubit. t è adimensionale, gli angoli della teoria sono in radianti e quelli delle porte in gradi. I due esempi confrontano accuratezza e numero di operazioni sullo stesso ingresso.',
    bridge: 'Il confronto fra prodotto di porte e matrice complessiva è anche un metodo di verifica. Lo usiamo nel programma conclusivo, dove preparazione, controllo e cambio di base devono produrre un’unica distribuzione coerente.',
  },
  'programma-completo': {
    intro: 'Riuniamo preparazione complessa, porte locali, CNOT e lettura in basi diverse. Il programma è definito dall’ingresso, dall’ordine delle porte e dalla base della misura, non soltanto dalla lista dei loro nomi.',
    theory: [
      'Il primo qubit parte da (2|0⟩+i|1⟩)/√5 e il secondo da |0⟩: il tensore dà ψ₀=(2,0,i,0)ᵀ/√5 nella base 00,01,10,11. Usiamo S=P(π/2)=diag(1,i), oppure S†=diag(1,−i) nella variante; seguono H sul primo filo e CNOT dal primo al secondo.',
      'La misura richiesta è Z sul qubit A e X sul qubit B. La realizziamo con una H sul secondo filo prima della lettura computazionale. Il bit letto su B etichetta quindi |+⟩ o |−⟩ della base X. Le probabilità congiunte sono i moduli quadrati delle quattro ampiezze finali; ogni marginale si ottiene sommando sui valori dell’altro bit.',
      'Per la variante S le probabilità attese sono (1/20,1/20,9/20,9/20). La variante S† cambia le interferenze e permette di verificare il ruolo della fase prima della CNOT. Il registro completo mantiene le correlazioni necessarie a ricostruire tutte le letture.',
    ],
    definition: 'ψfinale=(I⊗H)CX(H⊗I)(S⊗I)ψ₀; P(a,b)=|⟨a,b|ψfinale⟩|².',
    space: 'Le quattro componenti appartengono allo stato congiunto. Le barre finali usano etichette Z,X secondo il cambio di base dichiarato; il simulatore mostra probabilità teoriche, senza estrarre una sequenza di misure.',
    bridge: 'Il modulo 4 riutilizza preparazione, oracolo reversibile e interferenza su registri più grandi. Deutsch–Jozsa generalizza la somma di segni di Deutsch a tutte le parole di n bit.',
  },
  'deutsch-jozsa': {
    intro: 'L’ingresso è un oracolo per f:{0,1}ⁿ→{0,1}, con la promessa che f sia costante oppure bilanciata, cioè uguale a uno su esattamente metà delle N=2ⁿ parole. L’obiettivo è distinguere i due casi.',
    theory: [
      'Prepariamo |s⟩=Σₓ|x⟩/√N applicando H a ciascuno degli n qubit. Come in Deutsch, il bersaglio |−⟩ converte U_f in una marcatura O_f|x⟩=(−1)^(f(x))|x⟩. La seconda H⊗n usa H⊗n|x⟩=Σᵧ(−1)^(x·y)|y⟩/√N, dove x·y=⊕ⱼxⱼyⱼ è il prodotto binario modulo due.',
      'L’ampiezza della parola nulla è la media dei segni (−1)^(f(x)). Una funzione costante dà ampiezza +1 oppure −1 e probabilità uno; una bilanciata ha tanti +1 quanti −1 e dà probabilità zero. Sotto la promessa, leggere qualunque parola non nulla certifica il caso bilanciato. Fuori dalla promessa questa regola non decide la classe.',
      'Gli esempi calcolano direttamente lo stato dopo l’oracolo di fase e applicano Hadamard: il bersaglio separabile |−⟩ è eliminato algebricamente. Si verifica la distribuzione dell’oracolo assegnato, senza sintetizzare una rete elementare per U_f.',
    ],
    definition: 'a(y)=2^(−n)Σₓ(−1)^(f(x)+x·y); P(0…0)=1 se costante, 0 se bilanciata.',
    space: 'Le stringhe x,y etichettano la base di C^(2ⁿ). Il prodotto x·y è binario; la somma delle ampiezze è invece una somma reale con segno. Le barre mostrano probabilità teoriche.',
    bridge: 'La cancellazione dipende dalla struttura dei segni. Se f nasconde una stringa attraverso un prodotto binario, come in Bernstein–Vazirani, la stessa trasformazione concentra l’uscita proprio su quella stringa.',
  },
  'bernstein-vazirani': {
    intro: 'La promessa è f(x)=s·x⊕b, con x,s∈{0,1}ⁿ e b∈{0,1}. La stringa s è ignota; b è un termine costante. Per b=0 la funzione è lineare, mentre con b=1 è affine.',
    theory: [
      'Dopo preparazione uniforme, oracolo di fase e Hadamard, l’ampiezza di y è 2^(−n)Σₓ(−1)^(s·x+b+x·y). Poiché ogni bit xⱼ viene sommato indipendentemente su 0 e 1, la somma si fattorizza in (−1)^b2^(−n)∏ⱼ[1+(−1)^(sⱼ+yⱼ)].',
      'Se yⱼ≠sⱼ per almeno un bit, quel fattore è 1−1=0. Se y=s, tutti i fattori sono due e compensano 2^(−n). Quindi il vettore finale è (−1)^b|s⟩: la lettura restituisce s con certezza in entrambi i casi, mentre b cambia soltanto la fase globale.',
      'Come in Deutsch–Jozsa il modello usa direttamente la marcatura di fase; l’ancilla |−⟩ e la sintesi elementare di U_f non vengono simulate qui. Il caso affine mantiene il segno nelle ampiezze anche se non cambia le probabilità.',
    ],
    definition: 'a(y)=(−1)^b2^(−n)∏ⱼ[1+(−1)^(sⱼ+yⱼ)]=(−1)^bδᵧ,ₛ.',
    space: 'I fattori sono somme sui singoli bit nello spazio binario; δᵧ,ₛ vale uno quando y=s e zero altrimenti. Le coordinate finali sono ampiezze reali con segno, le barre sono i loro quadrati.',
    bridge: 'Bernstein–Vazirani legge s in una sola uscita perché tutta la struttura è lineare. In Simon la stringa compare invece come simmetria XOR: ogni misura fornisce un vincolo e serve combinare più equazioni.',
  },
  simon: {
    intro: 'Consideriamo f:{0,1}ⁿ→{0,1}ⁿ con una stringa segreta non nulla s≠0. La promessa completa è f(x)=f(x′) se e soltanto se x′=x oppure x′=x⊕s. Ogni valore raggiunto ha quindi esattamente due preimmagini, e l’obiettivo è ricostruire s.',
    theory: [
      'Il circuito ideale prepara Σₓ|x⟩|f(x)⟩/√(2ⁿ) usando un oracolo reversibile. Condizionare sul valore f(x₀) del secondo registro lascia (|x₀⟩+|x₀⊕s⟩)/√2 nel primo. La sola invarianza f(x)=f(x⊕s) sarebbe insufficiente: per n>1 una funzione costante la soddisfa, ma ha fibre più grandi di due e viola la promessa.',
      'Dopo H⊗n, l’ampiezza di y è (−1)^(x₀·y)[1+(−1)^(s·y)]/√(2^(n+1)). Se s·y=1 i termini si cancellano; se s·y=0 il modulo quadrato vale 2/2ⁿ. Per n=3 ci sono quattro y ammessi, ciascuno con probabilità 1/4, indipendentemente dal ramo f(x₀).',
      'Le uscite danno equazioni y·s=0 su F₂, il campo dei bit con somma XOR. Per isolare lo spazio delle soluzioni {0,s} servono n−1 righe linearmente indipendenti; la promessa s≠0 seleziona poi s. Misure eseguite su nuove preparazioni sono probabilisticamente indipendenti, ma possono dare righe ripetute o la riga nulla, che non aumentano il rango.',
      'Il modello costruisce la tabella di f e ne raggruppa le fibre: non sintetizza l’oracolo porta per porta. Le sequenze degli esempi sono uscite ammesse prefissate per mostrare l’eliminazione, non estrazioni casuali. Il caso s=0 corrisponderebbe alla promessa iniettiva e richiederebbe un problema distinto; qui è escluso fin dall’inizio.',
    ],
    definition: 'f(x)=f(x′) ⇔ (x′=x oppure x′=x⊕s), s≠0; P(y)=2^(1−n) se y·s=0, altrimenti 0.',
    space: 'XOR e prodotto binario operano sulle stringhe; il rango è calcolato modulo due. Il registro quantistico usa ampiezze complesse, mentre la tabella di eliminazione è un calcolo classico esatto sui bit.',
    bridge: 'Negli oracoli la struttura della funzione determina quali ampiezze interferiscono. Il test SWAP usa invece uno scambio controllato per trasformare la sovrapposizione di due preparazioni in una probabilità leggibile.',
  },
  swap: {
    intro: 'Dati due stati puri normalizzati |u⟩ e |v⟩, vogliamo conoscere |⟨u|v⟩|² senza misurare separatamente tutte le loro ampiezze. Un qubit ausiliario controlla lo scambio dei registri che li contengono.',
    theory: [
      'Da |0⟩|u⟩|v⟩, una H sull’ausiliario e lo SWAP controllato producono (|0⟩|u⟩|v⟩+|1⟩|v⟩|u⟩)/√2. La H finale porta nel ramo ausiliario zero il vettore (|u⟩|v⟩+|v⟩|u⟩)/2.',
      'La norma quadrata di questo ramo è [1+1+⟨u|v⟩⟨v|u⟩+⟨v|u⟩⟨u|v⟩]/4=(1+|⟨u|v⟩|²)/2. La marginale si ottiene sommando le probabilità congiunte sui due registri bersaglio. Gli esempi danno rispettivamente P(0)=1,3/4,1/2 per stati uguali, sovrapposti e ortogonali.',
      'Il valore teorico P(0) determina il modulo quadro del prodotto interno tramite 2P(0)−1. In un esperimento occorrerebbero misure ripetute per stimarlo da frequenze; qui sono calcolate le probabilità esatte del modello. Il test non determina la fase del prodotto interno.',
    ],
    definition: 'P(ausiliario=0)=(1+|⟨u|v⟩|²)/2; P(1)=1−P(0).',
    space: 'I due stati di un qubit e l’ausiliario formano otto ampiezze congiunte. Le due barre marginali descrivono soltanto l’ausiliario. Il prodotto interno misura la sovrapposizione nello spazio degli stati, senza una distanza spaziale fra apparati.',
    bridge: 'Il prodotto interno quantifica anche la componente di uno stato lungo una direzione assegnata. Grover usa proiezioni e riflessioni per accrescere la componente nello spazio delle soluzioni.',
  },
  grover: {
    intro: 'Sia G l’insieme delle M soluzioni fra N etichette, con 0<M<N. La ricerca mantiene lo stato in un piano di dimensione due, anche quando il registro completo possiede N ampiezze.',
    theory: [
      'Definiamo |g⟩=Σₓ∈G|x⟩/√M e |b⟩=Σₓ∉G|x⟩/√(N−M). I supporti disgiunti e le normalizzazioni li rendono ortonormali. Lo stato uniforme è |s⟩=√(1−M/N)|b⟩+√(M/N)|g⟩. Scegliamo θ∈(0,π/2) con sin²θ=M/N: le sue coordinate sono (cosθ,sinθ).',
      'Il proiettore sui marcati è ΠG=Σₓ∈G|x⟩⟨x|. L’oracolo O=I−2ΠG ha matrice diag(1,−1) nel piano. La diffusione D=2|s⟩⟨s|−I ha matrice [[cos2θ,sin2θ],[sin2θ,−cos2θ]]. Moltiplicando nell’ordine Q=DO otteniamo [[cos2θ,−sin2θ],[sin2θ,cos2θ]], una rotazione di 2θ.',
      'Dopo k iterazioni le coordinate diventano (cos((2k+1)θ),sin((2k+1)θ)). Il successo cresce fino alla zona dell’asse g e poi diminuisce: il numero di iterazioni deve essere scelto in funzione di θ. In termini di query all’oracolo, per M piccolo rispetto a N servono circa (π/4)√(N/M) iterazioni; il costo per costruire un oracolo è una questione separata.',
      'Se M=0 manca la direzione g e la probabilità buona è sempre zero; se M=N manca b e vale già uno. Questi casi non richiedono la base bidimensionale. Il primo Grover del modulo 3 è il caso θ=π/6: dopo una iterazione (2k+1)θ=π/2.',
    ],
    definition: 'Q|s⟩=cos3θ|b⟩+sin3θ|g⟩; Psuccesso(k)=sin²((2k+1)θ).',
    space: 'Il piano usa assi ortonormali b e g e coordinate di ampiezza reali adimensionali. La riflessione dell’oracolo attraversa l’asse b; quella della diffusione attraversa la retta di |s⟩. I quadrati delle proiezioni danno le probabilità dei due gruppi.',
    bridge: 'La scelta di k richiede una stima di M. Se M è ignoto, possiamo variare il numero di iterazioni fra i tentativi e verificare ciascun candidato con l’oracolo.',
  },
  'ricerca-ignota': {
    intro: 'Quando il numero M di soluzioni è ignoto, una scelta fissa di k può oltrepassare il massimo di Grover. Usiamo tentativi indipendenti con un numero casuale di iterazioni scelto entro una finestra crescente.',
    theory: [
      'Poniamo inizialmente m=1. A ogni tentativo scegliamo uniformemente j fra 0,…,⌈m⌉−1, riprepariamo lo stato uniforme, eseguiamo j iterazioni e leggiamo un candidato x. Il simbolo ⌈m⌉ è il più piccolo intero almeno pari a m; m può essere non intero.',
      'La verifica f(x)=1 decide il successo. Se fallisce, aggiorniamo m←min(6m/5,√N) e ripetiamo entro un budget dichiarato. Nel conteggio didattico un tentativo costa j interrogazioni per le iterazioni e una per verificare x. Per M=0 ogni verifica fallisce: l’esaurimento del budget non dimostra l’assenza di soluzioni.',
      'La tabella separa finestra m, iterazioni j, candidato osservato, probabilità teorica buona e costo. Qui una traiettoria è effettivamente campionata con un generatore pseudocasuale e seme dichiarato, così che si possa riprodurre lo stesso esempio; la probabilità del tentativo rimane distinta dall’esito estratto.',
    ],
    definition: 'j uniforme in {0,…,⌈m⌉−1}; costo del tentativo=j+1; m←min(6m/5,√N).',
    space: 'Le righe sono tentativi successivi, non stati coerenti dello stesso registro. Le probabilità sono quelle previste dal modello e gli indici estratti sono dati classici. Il costo conta interrogazioni, non secondi di esecuzione.',
    bridge: 'Finora la preparazione è uniforme. La stessa coppia di riflessioni amplifica anche una distribuzione iniziale assegnata, purché possiamo applicare la preparazione A e la sua inversa.',
  },
  amplificazione: {
    intro: 'Una matrice unitaria A prepara |a⟩=A|0⟩, con ampiezze anche non uniformi. Il proiettore ΠG seleziona il sottospazio buono e p=⟨a|ΠG|a⟩ è la probabilità iniziale di successo.',
    theory: [
      'Per 0<p<1 costruiamo gli assi dalle proiezioni normalizzate: |g⟩=ΠG|a⟩/√p e |b⟩=(I−ΠG)|a⟩/√(1−p). Le componenti ereditano tutte le fasi della preparazione; in generale non sono somme uniformi di etichette. Rispetto a questi assi |a⟩=cosθ|b⟩+sinθ|g⟩, con sin²θ=p.',
      'La riflessione D_A=2|a⟩⟨a|−I si costruisce come A(2|0⟩⟨0|−I)A†. Applicata a v, dà 2|a⟩⟨a|v⟩−v, con il prodotto interno coniugato nel primo argomento. Composta con O=I−2ΠG ha nel piano la stessa matrice di Grover e quindi lo stesso angolo 2θ.',
      'Dopo k iterazioni la probabilità buona è sin²((2k+1)θ). Si amplifica il peso complessivo della componente buona mantenendone i rapporti interni; non si uniformano le ampiezze dei marcati. Per p=0 la preparazione non ha componente buona da amplificare, mentre per p=1 ha già successo certo. Negli esempi A è una preparazione assegnata come primitiva: D_A è applicata direttamente al vettore, senza sintetizzare una rete elementare per A e A†.',
    ],
    definition: 'Q_A=D_AO; D_Av=2a⟨a|v⟩−v; p=‖ΠG a‖²=sin²θ.',
    space: 'Il piano (b,g) ha coordinate reali perché gli assi incorporano le fasi della preparazione. Il registro completo conserva invece tutte le componenti complesse. Le due descrizioni coincidono nel sottospazio generato dalle proiezioni.',
    bridge: 'La marcatura può dipendere da una proprietà aggiornata durante un algoritmo. Per cercare un minimo marchiamo gli indici il cui valore è inferiore alla migliore soglia trovata finora.',
  },
  minimo: {
    intro: 'Sia valore(x) una lista indicizzata da x=0,…,N−1. Una soglia corrente τ definisce un problema di ricerca: trovare un indice con valore(x)<τ. Ogni miglioramento verificato permette di abbassare τ.',
    theory: [
      'L’oracolo fτ(x) vale uno precisamente quando il confronto è vero. Il numero dei marcati dipende dalla soglia ed è ignoto, quindi ciascuna ricerca interna usa la procedura a finestra crescente e un budget. Un candidato viene accettato solo dopo averne verificato il valore.',
      'La sequenza delle soglie è strettamente decrescente quando ci sono miglioramenti. Se la lista contiene minimi uguali, uno qualsiasi dei loro indici è un risultato valido; il confronto stretto non tratta un valore uguale alla soglia come miglioramento.',
      'Un tentativo fallito non certifica che la soglia sia minima. In questi piccoli esempi una scansione esaustiva finale confronta tutti i valori e certifica il risultato: il suo costo classico è dichiarato separatamente dalle interrogazioni della ricerca. La traccia con budget e questa verifica non costituiscono da sole una dimostrazione del costo asintotico dell’algoritmo generale.',
    ],
    definition: 'fτ(x)=1 ⇔ valore(x)<τ; dopo un candidato verificato, τ←valore(x).',
    space: 'La lista e la soglia sono dati classici. Gli insiemi marcati cambiano fra tentativi; le distribuzioni appartengono a preparazioni diverse. Il controllo finale è una scansione della lista, non una misura quantistica aggiuntiva.',
    bridge: 'Le ricerche precedenti sfruttano interferenza in un piano. Fourier organizza invece le fasi di tutte le componenti per rendere leggibili periodicità e autovalori: sarà il secondo strumento del modulo.',
  },
  fourier: {
    intro: 'La trasformata discreta di Fourier F_N agisce su N ampiezze complesse. Alla base |x⟩ associa una progressione di fasi lungo gli indici y=0,…,N−1; qui scegliamo sempre il segno positivo nell’esponente.',
    theory: [
      'Definiamo ω=exp(2πi/N), una radice N-esima dell’unità, e (F_N)ᵧₓ=ω^(xy)/√N. Per un vettore v, l’uscita y è la somma degli N vettori ω^(xy)vₓ/√N nel piano complesso. L’inversa F_N† cambia il segno dell’esponente.',
      'La cancellazione deriva dalla somma geometrica S=1+z+⋯+z^(N−1). Moltiplicando per z, tutti i termini intermedi si cancellano in S−zS=1−zᴺ. Per z≠1, S=(1−zᴺ)/(1−z); per z=1, S=N. Se zᴺ=1 e z≠1, la somma è zero.',
      'Il prodotto interno fra le colonne x e x′ di F_N è (1/N)Σᵧω^((x′−x)y). Vale uno se x=x′ e zero altrimenti per la stessa identità: le colonne sono ortonormali, quindi F_N è unitaria. Una periodicità del vettore fa riapparire queste somme e concentra la probabilità su indici compatibili.',
    ],
    definition: '(F_Nv)ᵧ=(1/√N)Σₓexp(2πixy/N)vₓ; Σ(j=0,…,N−1) zʲ=0 se zᴺ=1 e z≠1.',
    space: 'Il piano Re/Im mostra addendi e risultante di una singola ampiezza. x e y sono etichette discrete, non coordinate fisiche; le fasi sono angoli adimensionali. La trasformata non implica una misura: la misura successiva usa |(F_Nv)ᵧ|².',
    bridge: 'Quando N=2ⁿ, la scrittura binaria separa la fase in n fattori. Questo permette di ricavare una rete di Hadamard e fasi controllate che realizza la stessa F_N.',
  },
  qft: {
    intro: 'La QFT è la trasformata F_(2ⁿ) realizzata su n qubit. Per costruirne il circuito partiamo dalla formula di Fourier e fattorizziamo lo stato in uscita usando i bit della parola, con il più significativo in alto.',
    theory: [
      'Scriviamo x=Σ(j=0,…,n−1) xⱼ2^(n−1−j) e y=Σ(j=0,…,n−1) yⱼ2^(n−1−j). Allora exp(2πixy/2ⁿ)=∏ⱼexp(2πixyⱼ/2^(j+1)). La somma sui bit yⱼ si separa: F_(2ⁿ)|x⟩=⊗(j=0,…,n−1) [(|0⟩+exp(2πix/2^(j+1))|1⟩)/√2]. In ciascun fattore conta solo la parte frazionaria x/2^(j+1), perché i giri interi hanno fase uno.',
      'Per due qubit x=2x₀+x₁, i fattori finali sono (|0⟩+e^(2πi·0.x₁)|1⟩)/√2 e (|0⟩+e^(2πi·0.x₀x₁)|1⟩)/√2, dove 0.x₀x₁=x₀/2+x₁/4. Per x=01 otteniamo (|0⟩−|1⟩)⊗(|0⟩+i|1⟩)/2=(|00⟩+i|01⟩−|10⟩−i|11⟩)/2.',
      'La rete applica H a q₀: il suo |1⟩ acquista il segno (−1)^(x₀). Una P(π/2) su q₀ controllata da q₁ aggiunge i^(x₁), formando la fase 0.x₀x₁. Poi H su q₁ forma 0.x₁. Questi fattori sono nell’ordine opposto a quello dell’uscita Fourier, quindi uno SWAP finale li scambia.',
      'In generale, dopo H sul filo qⱼ, il controllo qₖ con k>j aggiunge una fase π/2^(k−j) sul bersaglio qⱼ: per distanza uno è 90°, per distanza due 45°. Gli scambi finali invertono l’ordine dei fili. L’inversa percorre le porte nell’ordine opposto e cambia segno agli angoli. La fattorizzazione su |x⟩ dimostra la rete su tutta la base e dunque, per linearità, su ogni stato.',
    ],
    definition: 'F_(2ⁿ)|x⟩=⊗(j=0,…,n−1) [(|0⟩+e^(2πix/2^(j+1))|1⟩)/√2]; q₀ è il bit più significativo.',
    space: 'Il circuito usa fili logici big-endian e Fourier positiva. Le fasi binarie 0.x₀x₁… sono frazioni di giro; le porte riportano angoli in gradi. Gli scambi cambiano l’ordine dei fattori tensoriali, non il segno di Fourier.',
    bridge: 'Le fasi controllate della QFT mostrano come un controllo coerente trasferisca informazione al registro di lettura. L’Hadamard test usa un solo controllo per leggere una componente di ⟨ψ|U|ψ⟩; QPE userà più controlli per stimare un’autofase.',
  },
  'hadamard-test': {
    intro: 'Sia U una matrice unitaria sul registro bersaglio preparato nello stato normalizzato |ψ⟩. Il numero complesso z=⟨ψ|U|ψ⟩ confronta la preparazione con la sua trasformata; un qubit ausiliario permette di leggerne la parte reale o immaginaria.',
    theory: [
      'Dopo H sull’ausiliario e U controllata, lo stato è (|0⟩|ψ⟩+|1⟩U|ψ⟩)/√2. Una seconda H produce nel ramo zero (|ψ⟩+U|ψ⟩)/2; la sua norma quadrata è (1+Re z)/2.',
      'Per la parte immaginaria inseriamo S†=P(−π/2)=diag(1,−i) sull’ausiliario prima dell’ultima H. Il ramo zero diventa (|ψ⟩−iU|ψ⟩)/2 e la norma dà (1+Im z)/2. Il segno di S† è quindi parte del significato della misura.',
      'Nei preset |ψ⟩=|+⟩ e U=P(φ). Allora z=(1+exp(iφ))/2. Il caso reale con φ=90° dà P(0)=3/4; quello immaginario con φ=−90° dà P(0)=1/4 e rende visibile il segno negativo della componente immaginaria. Per leggere l’ausiliario sommiamo sempre sui valori del bersaglio.',
    ],
    definition: 'P(0)=[1+Re⟨ψ|U|ψ⟩]/2; con S† sull’ausiliario, P(0)=[1+Im⟨ψ|U|ψ⟩]/2.',
    space: 'I piani complessi descrivono lo stato congiunto; le due barre marginali descrivono l’ausiliario letto. U è una trasformazione del bersaglio, mentre S† agisce sul controllo: sono porte con ruoli distinti.',
    bridge: 'Se |ψ⟩ è autostato di U, il confronto contiene una sola fase e il bersaglio resta invariato a meno di quel fattore. Usando potenze controllate di U possiamo scrivere questa fase su più qubit e ricombinarla con Fourier inversa.',
  },
  'qpe-esatta': {
    intro: 'La stima di fase quantistica, QPE, riceve un’unitaria U e un suo autostato normalizzato |u⟩: U|u⟩=exp(2πiφ)|u⟩. L’autofase φ∈[0,1) è una frazione di giro, cioè un angolo 2πφ radianti; l’obiettivo è leggerne una rappresentazione binaria.',
    theory: [
      'Il registro di lettura ha m qubit e Q=2ᵐ etichette. Prepariamo (1/√Q)Σₓ|x⟩|u⟩. In ordine big-endian il filo qⱼ ha peso 2^(m−1−j) e controlla U elevata a quella potenza: per m=3, dall’alto, U⁴,U²,U. Un ramo con etichetta x applica Uˣ e acquisisce exp(2πixφ), mentre il bersaglio rimane |u⟩.',
      'Dopo Fourier inversa, l’ampiezza dell’esito c∈{0,…,Q−1} è aφ(c)=Q⁻¹Σₓexp(2πix(φ−c/Q)). Se φ=ℓ/Q per un intero ℓ, per c=ℓ tutti i termini valgono uno; per c≠ℓ la loro ragione z è una radice Q-esima diversa da uno. La somma geometrica di Fourier dà dunque aφ(c)=δc,ℓ. Per Q=8 e φ=3/8 la sola uscita è c=3, parola 011.',
      'Per un bersaglio Σₛβₛ|uₛ⟩, gli |uₛ⟩ sono autostati ortonormali di U e βₛ sono ampiezze complesse con Σₛ|βₛ|²=1. Lo stato finale è Σc,s βₛaφₛ(c)|c⟩|uₛ⟩. La marginale somma probabilità di bersagli ortogonali: P(c)=Σₛ|βₛ|²|aφₛ(c)|². Le fasi dei βₛ restano invece nello stato condizionato.',
      'Nei casi elementari si può scegliere U diagonale nella base |0⟩,|1⟩, assegnandone gli autovalori alle autofasi indicate. Lo stato preparato e i coefficienti βₛ sono esplicitati negli svolgimenti. Se P(c)=0 nel modello esatto, il ramo è impossibile e non ammette un bersaglio normalizzato.',
    ],
    definition: 'aφ(c)=Q⁻¹Σ(x=0,…,Q−1) exp(2πix(φ−c/Q)); P(c)=Σₛ|βₛ|²|aφₛ(c)|²; Q=2ᵐ.',
    space: 'Il registro di lettura contiene etichette intere c, interpretate come frazioni di giro c/Q. I poligoni nel piano Re/Im sommano le ampiezze di ciascun autostato separatamente; le barre della marginale sommano i loro moduli quadrati pesati.',
    bridge: 'L’annullamento esatto richiede φ sulla griglia c/Q. Se la fase cade fra due punti della griglia, la stessa somma geometrica distribuisce la probabilità su più esiti e modifica il condizionamento del bersaglio.',
  },
  'qpe-approssimata': {
    intro: 'Manteniamo un’unitaria U con autostati ortonormali |uₛ⟩ e autofasi φₛ, ma queste frazioni di giro non sono rappresentabili esattamente con m bit. La lettura ha risoluzione 1/Q, dove Q=2ᵐ, e produce una distribuzione completa di stime c/Q.',
    theory: [
      'Per un singolo autostato poniamo δ=φ−c/Q. Se δ non è intero, la somma geometrica dà aφ(c)=[1−exp(2πiQδ)]/[Q(1−exp(2πiδ))]. Passando ai moduli si ricava Pφ(c)=sin²(πQδ)/(Q²sin²(πδ)); per δ intero la somma originaria vale uno e si usa il limite. Gli esiti più vicini alla fase hanno in genere peso maggiore, ma la distribuzione non coincide con un arrotondamento deterministico.',
      'Per il bersaglio Σₛβₛ|uₛ⟩ la marginale è P(c)=Σₛ|βₛ|²|aφₛ(c)|². Se P(c)>0, il bersaglio condizionato è Σₛβₛaφₛ(c)|uₛ⟩/√P(c). Più coefficienti possono restare non nulli: osservare c non seleziona necessariamente un singolo autostato.',
      'La scelta di un esito nel laboratorio analizza quel ramo e non estrae una misura casuale. Il denominatore P(c) va verificato prima di normalizzare; uno zero teorico può apparire come un piccolo residuo numerico. Le fasi dei coefficienti complessi contano nel bersaglio, anche quando spariscono dalla marginale.',
    ],
    definition: 'Pφ(c)=sin²(πQδ)/(Q²sin²(πδ)), δ=φ−c/Q; |ψc⟩=Σₛβₛaφₛ(c)|uₛ⟩/√P(c) se P(c)>0.',
    space: 'Le barre hanno ascissa c e ordinata P(c); c/Q è una fase modulo un giro. I piani complessi dei diversi autostati vanno letti separatamente. Il bersaglio condizionato è uno stato coerente, mentre il registro non condizionato può avere una descrizione ridotta mista.',
    bridge: 'QPE stima le autofasi di qualunque unitaria di cui sappiamo costruire le potenze controllate. L’iterazione di Grover ha autofasi legate all’angolo θ: ricavandole possiamo risalire al numero dei marcati.',
  },
  conteggio: {
    intro: 'Per N etichette e M soluzioni, Grover ha preparazione |s⟩=cosθ|b⟩+sinθ|g⟩ con sin²θ=M/N. Il conteggio quantistico applica QPE all’unitaria Q_G=DO per stimare θ e quindi M.',
    theory: [
      'Nella base (b,g), Q_G=[[cos2θ,−sin2θ],[sin2θ,cos2θ]]. Moltiplicando questa matrice per u₊=(b−ig)/√2 e u₋=(b+ig)/√2 si ottengono gli autovalori exp(+2iθ) ed exp(−2iθ). Le autofasi, espresse in giri, sono φ₊=θ/π e φ₋=1−θ/π.',
      'La preparazione si decompone come |s⟩=exp(iθ)|u₊⟩/√2+exp(−iθ)|u₋⟩/√2. I due pesi sono quindi entrambi 1/2, mentre le ampiezze hanno fasi opposte. Per N=8,M=2, θ=π/6: le autofasi sono 1/6 e 5/6. La distribuzione QPE è la media delle due distribuzioni, e conserva entrambe le famiglie di picchi.',
      'Dato un esito c su un registro di m qubit, con Q=2ᵐ qui inteso come dimensione della lettura, la stima è M̂=Nsin²(πc/Q). Le fasi coniugate producono lo stesso valore. A precisione finita M̂ può essere non intero e ogni ramo mantiene la propria probabilità.',
      'Questa lezione usa un modello spettrale: il valore noto p=M/N costruisce θ, le due autofasi e la distribuzione. Gli svolgimenti dimostrano il legame con Q_G, ma non eseguono una rete controllata derivata da un oracolo ignoto. Il valore esatto serve sia a generare l’istanza sia a confrontare le stime.',
    ],
    definition: 'Q_Gu±=e^(±2iθ)u±; β±=e^(±iθ)/√2; M̂(c)=Nsin²(πc/Q).',
    space: 'Il piano (b,g) mostra ampiezze collettive reali della ricerca; gli autostati u± sono vettori complessi dello stesso sottospazio. Le barre mostrano la marginale QPE; c/Q è una frazione di giro, M̂ un conteggio stimato senza unità fisiche.',
    bridge: 'Il calcolo dello spettro dipende dalle proiezioni della preparazione, non dalla sua uniformità. Sostituendo |s⟩ con A|0⟩ otteniamo una stima della probabilità buona p invece che del solo rapporto M/N.',
  },
  'stima-ampiezze': {
    intro: 'Sia |a⟩=A|0⟩ una preparazione e ΠG il proiettore sull’esito considerato buono. Vogliamo stimare p=⟨a|ΠG|a⟩ attraverso le autofasi dell’operatore di amplificazione Q_A=(2|a⟩⟨a|−I)(I−2ΠG).',
    theory: [
      'Per 0<p<1 definiamo |g⟩=ΠG|a⟩/√p e |b⟩=(I−ΠG)|a⟩/√(1−p). Ponendo sin²θ=p, nel piano (b,g) Q_A è la rotazione di 2θ già ricavata. Gli autostati (b∓ig)/√2 hanno autofasi ±θ/π modulo uno e la preparazione ha coefficienti e^(±iθ)/√2.',
      'QPE su m qubit produce c con la somma pesata dei due rami spettrali. Con Q=2ᵐ, trasformiamo ciascun esito in p̂(c)=sin²(πc/Q). La probabilità p è un numero fra zero e uno: non è l’ampiezza √p né l’angolo θ. Le due autofasi coniugate restituiscono la stessa stima.',
      'Anche qui il simulatore è un modello spettrale con p noto, da cui vengono costruiti θ e i rami QPE; non costruisce un circuito controllato di Q_A a partire da A e dall’oracolo. La distribuzione illustra la risoluzione della stima e il condizionamento coerente. Una procedura operativa dovrebbe ricevere A e ΠG, realizzarne le riflessioni e le potenze controllate senza ricevere p.',
    ],
    definition: 'p=sin²θ; φ±=±θ/π mod 1; p̂(c)=sin²(πc/Q), Q=2ᵐ.',
    space: 'Gli assi b,g sono proiezioni normalizzate della preparazione, comprensive delle sue fasi. La distribuzione è su etichette c; la mappa c/Q→p̂ converte una fase in probabilità e non in una posizione fisica.',
    bridge: 'Fourier e QPE forniscono una lettura di fasi; per usarle su un problema aritmetico servono trasformazioni unitarie definite sugli interi modulari. Introduciamo prima gli strumenti classici per costruirle e verificarne gli esiti.',
  },
  aritmetica: {
    intro: 'L’aritmetica modulare identifica interi che hanno lo stesso resto nella divisione per un intero N≥2. Serve sia a costruire le operazioni reversibili sia a controllare classicamente le risposte degli algoritmi quantistici.',
    theory: [
      'Scriviamo a≡b mod N quando N divide a−b, e scegliamo come residui le etichette 0,…,N−1. Il massimo comune divisore gcd(a,N) è il maggiore intero positivo che divide entrambi; a e N sono coprimi se gcd(a,N)=1. Euclide ripete divisioni rₖ₋₁=qₖrₖ+rₖ₊₁ finché il resto diventa zero: l’ultimo resto non nullo è il gcd.',
      'L’algoritmo esteso mantiene ogni resto come combinazione lineare di a e N. Alla fine fornisce interi s,t con as+Nt=gcd(a,N), l’identità di Bézout. Se il gcd è uno, ridurre questa uguaglianza modulo N dà as≡1: s mod N è l’inverso moltiplicativo a⁻¹. Se il gcd non è uno, tale inverso non esiste.',
      'Per una potenza aᵉ, scriviamo l’esponente non negativo e=Σⱼeⱼ2ʲ. Si formano a,a²,a⁴,… tramite quadrati successivi e si moltiplicano soltanto le potenze con eⱼ=1, riducendo modulo N a ogni passo. Il lavoro cresce con il numero di bit dell’esponente; non occorre formare prima l’enorme intero aᵉ.',
    ],
    definition: 'as+Nt=gcd(a,N); a⁻¹=s mod N se gcd(a,N)=1; aᵉ≡∏ⱼ(a^(2^j))^(eⱼ) mod N.',
    space: 'Le tabelle contengono interi esatti: quozienti, resti, coefficienti e bit. Le riduzioni modulari sono operazioni su etichette discrete, non riduzioni della norma di uno stato quantistico.',
    bridge: 'L’inverso modulare permette di costruire la coppia di esponenti RSA. La fattorizzazione del modulo fornisce il numero rispetto al quale calcolare quell’inverso.',
  },
  rsa: {
    intro: 'RSA usa un modulo N=pq con p e q primi distinti. La chiave pubblica contiene N e un esponente e; conoscere i fattori permette di ricavare un esponente privato d. Usiamo interi piccoli per rendere visibile ogni passaggio.',
    theory: [
      'Definiamo λ(N)=mcm(p−1,q−1), il minimo comune multiplo dei due numeri. Scegliamo e coprimo con λ(N) e calcoliamo d=e⁻¹ mod λ(N) mediante Euclide esteso. Per un messaggio intero 0≤m<N la primitiva cifra c=mᵉ mod N e decifra cᵈ mod N.',
      'La correttezza si verifica separatamente modulo i primi. Il piccolo teorema di Fermat dice che m^(p−1)≡1 mod p quando m non è divisibile per p. Poiché ed−1 è multiplo di p−1, allora m^(ed)≡m mod p. Se m è divisibile per p, entrambi i membri sono zero; lo stesso ragionamento vale per q. Il teorema cinese del resto, CRT, garantisce un unico residuo modulo pq compatibile con i due risultati.',
      'Negli esempi p=5,q=11,N=55, λ(N)=20, e=3 e d=7 perché 3·7=1+20. I messaggi 7 e 5 distinguono il caso coprimo dal caso divisibile per un primo. La ricomposizione CRT mostrata verifica la correttezza dai residui ottenuti; non è una distinta implementazione ottimizzata della decifratura.',
      'Il collegamento è fattori → λ(N) → d → decifratura. Non assumiamo l’equivalenza generale fra inversione di RSA e fattorizzazione. Si studia la primitiva su interi, senza le codifiche OAEP o PSS di schemi completi; gli esempi Shor successivi usano N=15 e 21 e illustrano separatamente il passaggio della fattorizzazione.',
    ],
    definition: 'λ(pq)=mcm(p−1,q−1); ed≡1 mod λ(N); c=mᵉ mod N; cᵈ≡m mod N.',
    space: 'Messaggi, cifrati, esponenti e residui sono interi. Le tabelle mostrano divisioni e congruenze, senza ampiezze o probabilità. Le dimensioni ridotte servono al calcolo didattico e non rappresentano parametri di sicurezza.',
    bridge: 'Per recuperare i fattori attraverso Shor cerchiamo una periodicità delle potenze modulari. Il passo classico seguente spiega quando conoscere l’ordine di a basta a ricavare divisori di N.',
  },
  'ordine-fattori': {
    intro: 'Per un intero a coprimo con N, l’ordine r è il più piccolo intero positivo con aʳ≡1 mod N. Le potenze 1,a,a²,… formano un ciclo; da un ordine pari possiamo tentare di estrarre fattori di N.',
    theory: [
      'Se r è pari, poniamo t=a^(r/2) mod N. Allora t²≡1 mod N e (t−1)(t+1) è divisibile per N. Se t non è congruo a ±1, i gcd di t−1 e t+1 con N forniscono divisori non banali, da verificare dividendo N.',
      'Per un ordine minimo pari, t=1 è escluso perché produrrebbe un ritorno anticipato; t=−1 può invece verificarsi e rende il tentativo infruttuoso. Se si dispone soltanto di un periodo R verificato ma non minimo, si controllano entrambe le possibilità ±1. Un ordine dispari non consente di formare la potenza intera r/2 richiesta.',
      'Prima di cercare l’ordine si calcola gcd(a,N): se è strettamente fra uno e N abbiamo già un fattore classico. Gli esempi qui enumerano l’orbita per spiegare l’implicazione ordine→fattori; questa enumerazione non costituisce il metodo quantistico per trovare un ordine ignoto.',
    ],
    definition: 'r=min{k≥1:aᵏ≡1 mod N}; t=a^(r/2) mod N; fattori candidati gcd(t−1,N), gcd(t+1,N).',
    space: 'I nodi dell’orbita sono residui modulari distinti fino al primo ritorno a uno. La loro disposizione circolare indica l’ordine delle transizioni; angoli e distanze nel disegno non rappresentano fasi quantistiche.',
    bridge: 'Il circuito che stimerà l’ordine deve applicare moltiplicazioni modulari in sovrapposizione. Partiamo dalla somma reversibile, conservando ingressi e riporti per poter ripulire il lavoro.',
  },
  somma: {
    intro: 'Un sommatore reversibile conserva gli addendi e scrive il risultato in un registro inizialmente nullo. I riporti intermedi sono informazione di lavoro: dopo aver copiato il risultato occorre cancellarli invertendo il calcolo.',
    theory: [
      'Nelle formule indichiamo con aᵢ e bᵢ i bit di peso 2ⁱ, quindi i=0 è il meno significativo. Il riporto in ingresso è cᵢ, con c₀=0. La somma nella colonna è sᵢ=aᵢ⊕bᵢ⊕cᵢ; il riporto successivo vale uno quando almeno due dei tre bit valgono uno.',
      'La maggioranza si scrive cᵢ₊₁=aᵢbᵢ⊕aᵢcᵢ⊕bᵢcᵢ. Tre Toffoli aggiungono con XOR i tre prodotti a un’ancilla nulla. Tre CNOT copiano la parità nel bit sᵢ. Una volta scritti tutti i bit di somma, l’inversa delle Toffoli cancella i riporti usando gli addendi conservati.',
      'La rete mostrata conserva la somma modulo 2ⁿ. Se A+B≥2ⁿ, il riporto finale segnala il trabocco durante il calcolo ma viene ripulito; per conservarlo come uscita bisogna copiarlo in un altro bit prima dell’inversione. La relazione intera rimane A+B=S+2ⁿcₙ.',
    ],
    definition: 'cᵢ₊₁=aᵢbᵢ⊕aᵢcᵢ⊕bᵢcᵢ; sᵢ=aᵢ⊕bᵢ⊕cᵢ; S=(A+B) mod 2ⁿ.',
    space: 'I bit nelle formule del riporto sono numerati dal meno significativo; le etichette dei registri esplicitano questa convenzione locale. Ogni riga della rete è una parola di base dopo una porta; la linearità estende la stessa rete alle sovrapposizioni.',
    bridge: 'La somma modulo 2ⁿ non basta per un modulo generico N. Una moltiplicazione modulare accumula contributi controllati e deve ridurre modulo N; distinguiamo questa costruzione aritmetica dalla rete di verifica usata sui piccoli registri.',
  },
  moltiplicazione: {
    intro: 'Per x=Σⱼxⱼ2ʲ, il prodotto ax modulo N si ottiene sommando i contributi xⱼ(a·2ʲ mod N). Quando gcd(a,N)=1, la moltiplicazione per a permuta i residui e può quindi essere realizzata da un’unitaria.',
    theory: [
      'Una costruzione aritmetica accumula una costante k=a·2ʲ mod N soltanto se xⱼ=1. Se accumulatore e k sono fra 0 e N−1, la somma è minore di 2N: basta confrontarla con N e sottrarre N quando necessario. Per rendere reversibile il blocco occorrono un flag del confronto, registri per somma e sottrazione e un ripristino coerente dei flag; il solo comando classico “mod N” non specifica queste porte.',
      'Nei piccoli esempi il calcolo dell’accumulatore mostra i risultati aritmetici. La rete effettivamente eseguita è una costruzione alternativa: sintetizza mediante mintermini la tabella della permutazione P(y)=ay mod N per y<N e P(y)=y sulle parole N≤y<2ⁿ, con n=⌈log₂N⌉. Il costo di questa sintesi cresce esponenzialmente e non rappresenta un moltiplicatore scalabile ottenuto dal sommatore precedente.',
      'L’inverso è P⁻¹(y)=a⁻¹y mod N nel dominio valido. Un oracolo XOR scrive P(x) in un registro nullo; dopo uno scambio, l’oracolo inverso cancella il vecchio ingresso: |x,0⟩→|x,P(x)⟩→|P(x),x⟩→|P(x),0⟩. Gli ausiliari sono verificati su tutta la base ammessa, anche con controllo esterno zero o uno.',
      'Per esponenziare aˣ, il bit xⱼ controlla invece una moltiplicazione per a^(2^j) mod N. Queste costanti si ottengono per quadrati successivi senza conoscere l’ordine. Vanno distinte da a·2ʲ mod N, che erano gli addendi del prodotto ax.',
    ],
    definition: 'ax mod N=Σⱼxⱼ(a·2ʲ mod N) mod N; aˣ mod N=∏ⱼ(a^(2^j) mod N)^(xⱼ) mod N.',
    space: 'Le etichette del registro rappresentano residui o parole fuori dominio lasciate fisse. Le tabelle dell’accumulatore sono calcoli classici; le tracce elementari verificano la permutazione reversibile e il ritorno a zero degli ausiliari.',
    bridge: 'La moltiplicazione per a è ora un’unitaria U_a definita senza ricevere l’ordine. Per capire che cosa QPE ne leggerà, analizziamo gli autostati sul ciclo che parte dal residuo uno.',
  },
  autostati: {
    intro: 'Sia U_a|y⟩=|ay mod N⟩ sui residui validi, estesa con identità fuori dominio, e sia gcd(a,N)=1. L’orbita di |1⟩ ha lunghezza r, l’ordine di a. Qui analizziamo il suo spettro; nell’esecuzione di Shor r non viene fornito al circuito.',
    theory: [
      'Per s=0,…,r−1 definiamo |uₛ⟩=(1/√r)Σ(k=0,…,r−1) exp(−2πisk/r)|aᵏ mod N⟩. Il segno negativo nei coefficienti è scelto perché U_a sposta k in k+1. Sostituendo j=k+1 modulo r, il coefficiente diventa exp(−2πis(j−1)/r)=exp(2πis/r)exp(−2πisj/r): dunque U_a|uₛ⟩=exp(2πis/r)|uₛ⟩.',
      'I residui dell’orbita sono distinti prima del ritorno, perciò ⟨uₛ|uₜ⟩=(1/r)Σₖexp(2πi(s−t)k/r). La somma geometrica vale uno per s=t e zero per s≠t: in quest’ultimo caso la ragione è una radice r-esima diversa da uno. Gli autostati costituiscono una base ortonormale del sottospazio dell’orbita.',
      'Sommando gli autostati con coefficiente 1/√r, il coefficiente di |aᵏ⟩ è (1/r)Σₛexp(−2πisk/r): vale uno per k=0 e zero altrimenti. Ne segue |1⟩=Σₛ|uₛ⟩/√r. La preparazione operativa |1⟩ contiene quindi tutte le autofasi s/r con peso 1/r, senza dover costruire separatamente gli autostati.',
    ],
    definition: '|uₛ⟩=(1/√r)Σₖexp(−2πisk/r)|aᵏ mod N⟩; U_a|uₛ⟩=e^(2πis/r)|uₛ⟩; |1⟩=Σₛ|uₛ⟩/√r.',
    space: 'L’orbita dispone residui discreti su un ciclo. Il piano complesso dei coefficienti descrive invece vere fasi di ampiezza; l’angolo geometrico di un nodo nel disegno dell’orbita non è la sua autofase. Gli autostati vivono nello spazio del registro dati.',
    bridge: 'QPE applicata a |1⟩ fornirà approssimazioni di s/r. Il denominatore letto può essere ridotto quando s e r hanno un divisore comune: le frazioni continue generano candidati che devono essere verificati con aritmetica modulare.',
  },
  'frazioni-continue': {
    intro: 'Una lettura di fase c su Q=2ᵐ etichette suggerisce il rapporto c/Q≈s/r. Le frazioni continue costruiscono approssimazioni razionali dette convergenti; ciascun loro denominatore è soltanto un candidato da controllare.',
    theory: [
      'Le divisioni euclidee di c e Q producono i quozienti parziali a₀,a₁,… della frazione continua. Poniamo p₋₂=0,p₋₁=1 e q₋₂=1,q₋₁=0. Le ricorrenze pⱼ=aⱼpⱼ₋₁+pⱼ₋₂ e qⱼ=aⱼqⱼ₋₁+qⱼ₋₂ danno il convergente pⱼ/qⱼ senza arrotondamenti.',
      'Se s/r è ridotta e |c/Q−s/r|<1/(2r²), allora s/r compare fra i convergenti. La condizione è sufficiente, non una garanzia per ogni misura. Se gcd(s,r)>1, la frazione ridotta ha denominatore r/gcd(s,r), che può non essere un periodo di a.',
      'Per ogni candidato R controlliamo aᴿ mod N. Il risultato uno verifica un periodo, quindi un multiplo dell’ordine; non dimostra da solo che R sia minimo. L’estrazione dei fattori richiede poi R pari, t=a^(R/2) diverso da ±1 e gcd non banali. Per N=21,a=2, il convergente 1/3 suggerito da 171/512 fallisce perché 2³≡8; 1/6 suggerito da 85/512 passa perché 2⁶≡1.',
      'La sezione analizza rapporti assegnati. Nelle lezioni Shor il post-processing viene collegato soltanto a esiti di probabilità non nulla del circuito. Un rapporto formalmente vicino a s/r non certifica che una misura possa produrlo.',
    ],
    definition: 'pⱼ=aⱼpⱼ₋₁+pⱼ₋₂; qⱼ=aⱼqⱼ₋₁+qⱼ₋₂; R candidato → verifica aᴿ≡1 mod N.',
    space: 'Rapporti e convergenti sono numeri razionali esatti; gli errori assoluti hanno unità di frazione di giro. La tabella separa approssimazione razionale, periodo verificato e fattori utili.',
    bridge: 'Abbiamo ora i tre passaggi di un tentativo Shor: esponenziazione modulare da N e a, lettura di fase e verifica dei convergenti. Li eseguiamo insieme iniziando da un modulo il cui ordine divide la griglia di lettura.',
  },
  'shor-15': {
    intro: 'Costruiamo un tentativo completo di Shor per N=15, con base a=2 oppure a=7. Il circuito riceve N, a e la precisione m=8; l’ordine è un risultato da ricostruire e non un ingresso della simulazione.',
    theory: [
      'Il registro di lettura ha Q=2ᵐ=256 etichette, con Q≥N²; il registro dati ha n=⌈log₂N⌉=4 qubit e parte da |1⟩. Le Hadamard preparano Σₓ|x⟩|1⟩/√Q. Le moltiplicazioni per a^(2^j) mod N, controllate dal bit di peso 2ʲ, producono Σₓ|x⟩|aˣ mod N⟩/√Q. Le costanti sono calcolate per quadrati successivi.',
      'Fourier inversa sul registro di lettura dà ampiezza A(c,y)=Q⁻¹Σₓ:aˣ mod N=y exp(−2πicx/Q). Per leggere soltanto c sommiamo |A(c,y)|² sui valori ortogonali y del bersaglio. Se P(c)>0, il bersaglio condizionato ha coefficienti A(c,y)/√P(c); per P(c)=0 il ramo è impossibile.',
      'Le frazioni continue di c/Q e i test modulari ricostruiscono un periodo candidato, poi i gcd estraggono divisori da verificare. La spiegazione in autostati mostra perché emergono rapporti s/r, ma la distribuzione operativa è costruita dalle potenze modulari effettive a partire da |1⟩.',
      '“Completo” significa un tentativo sull’istanza scelta, inclusa la sua verifica classica. La selezione manuale di c analizza un ramo senza campionarlo; il programma non ripete automaticamente basi e misure fino al successo. Le reti elementari per mintermini verificano piccoli registri con costo esponenziale e non sono l’aritmetica scalabile di Shor.',
    ],
    definition: '|Ψ⟩=(1/√Q)Σₓ|x⟩|aˣ mod N⟩; P(c)=Σᵧ|A(c,y)|²; A(c,y)=Q⁻¹Σₓ:aˣ mod N=y e^(−2πicx/Q).',
    space: 'Lo stato congiunto contiene Q·2ⁿ ampiezze. Le barre mostrano la marginale della lettura, l’indice c è un intero big-endian e c/Q una frazione di giro. I residui y sono etichette del registro dati; le loro probabilità si sommano senza interferenza reciproca.',
    bridge: 'Per N=15 gli ordini dei preset dividono Q e la somma geometrica dà picchi esatti. Con N=21 incontriamo un ordine che non divide una potenza di due: la lettura si distribuisce e il post-processing può fallire anche su un esito possibile.',
  },
  'shor-21': {
    intro: 'Ripetiamo il tentativo completo per N=21 con a=2 oppure a=5, precisione m=9 e Q=512≥21². In questi esempi l’ordine non divide Q: i picchi hanno larghezza finita e la lettura non restituisce esattamente ogni frazione s/r.',
    theory: [
      'La preparazione e l’esponenziazione sono le stesse di Shor per 15, con n=⌈log₂21⌉=5 qubit dati. Il simulatore costruisce aˣ mod 21 dai bit dell’esponente e dalle costanti a^(2^j) mod 21, senza ricevere r. Fourier inversa viene applicata alle ampiezze congiunte e la marginale si ottiene sommando sui residui bersaglio.',
      'Per a=2, l’analisi successiva verifica r=6. L’esito 85 dà 85/512≈1/6 e il denominatore 6 supera il test 2⁶≡1 mod 21. L’esito 171 suggerisce 1/3, ma 2³≡8: il denominatore parziale non è un periodo e va rifiutato. Un nuovo esito può fornire l’informazione mancante.',
      'Per a=5, anche un ordine corretto può essere inutile ai fattori: r=6 dà 5³≡20≡−1 mod 21. I gcd producono soltanto divisori banali e occorre una nuova base. Sono tre controlli distinti: esito possibile, periodo verificato, fattorizzazione riuscita.',
      'La distribuzione completa resta esposta mentre un esito selezionato determina i calcoli del ramo. La rete elementare rimane una verifica per piccoli registri a costo esponenziale; il tentativo non include una scelta automatica delle basi o una ripetizione fino al successo.',
    ],
    definition: 'P(c)=Σᵧ|Q⁻¹Σₓ:aˣ mod N=y e^(−2πicx/Q)|²; c/Q → convergenti → periodo verificato → gcd.',
    space: 'Il grafico mostra una distribuzione discreta a risoluzione 1/512 di giro. La larghezza dei picchi nasce dalla griglia finita, non da rumore aggiunto. I rami del bersaglio conservano ampiezze complesse anche dopo il condizionamento.',
    bridge: 'Shor usa una periodicità di un solo esponente. Il logaritmo discreto nasconde invece una relazione fra due esponenti: una Fourier su ciascun registro trasforma questa relazione in congruenze classiche.',
  },
  logaritmo: {
    intro: 'In un gruppo moltiplicativo ciclico, g è un generatore di ordine r e h è un elemento noto della forma h=gᵈ. Il logaritmo discreto consiste nel ricostruire l’esponente d modulo r; gli esempi usano residui non nulli modulo un primo.',
    theory: [
      'Prepariamo uniformemente a,b∈{0,…,r−1} e calcoliamo f(a,b)=gᵃh⁻ᵇ. Poiché h=gᵈ, vale f(a,b)=g^(a−db). Condizionare su un valore del registro funzione seleziona una classe a−db=t mod r, ossia le coppie (t+db,b) per tutti i b.',
      'Applicando Fourier positiva a entrambi i registri, l’ampiezza dell’uscita (u,v) contiene la somma Σᵦexp(2πi[u(t+db)+vb]/r)=exp(2πiut/r)Σᵦexp(2πib(du+v)/r). Per la somma geometrica questa è nulla salvo du+v≡0 mod r. Una misura fornisce quindi una congruenza lineare sull’incognita d.',
      'Se gcd(u,r)=1, l’inverso di u dà d≡−vu⁻¹ mod r. Se q=gcd(u,r)>1, esistono soluzioni solo quando q divide v; dividendo la congruenza per q si ottiene d modulo r/q e restano q candidati modulo r. Altre coppie ammesse o la verifica gᵈ=h permettono di selezionare il candidato corretto. Le coppie degli svolgimenti sono scelte per mostrare questi calcoli.',
      'Il primo esempio usa r=4 e una Fourier binaria; il secondo usa r=6, con preparazione uniforme su sei livelli e F₆ astratta. Non viene fornita una sintesi binaria di questa trasformata né una rete reversibile completa dell’oracolo: la distribuzione è calcolata direttamente sulle classi della funzione.',
    ],
    definition: 'du+v≡0 mod r; se gcd(u,r)=1, d≡−vu⁻¹ mod r; verificare gᵈ=h.',
    space: 'Il reticolo rappresenta coppie di residui (a,b) oppure (u,v); le distanze geometriche non hanno significato fisico. La distribuzione vive su r² etichette e Fourier somma fasi nello spazio delle ampiezze.',
    bridge: 'La costruzione conclude il percorso: una struttura classica definisce l’oracolo, l’interferenza la traduce in probabilità e la verifica aritmetica decide quali letture risolvono il problema. Le astrazioni dichiarate distinguono il principio dell’algoritmo dalla sintesi delle sue risorse.',
  },
} satisfies Record<string, AlgorithmTheory>;
