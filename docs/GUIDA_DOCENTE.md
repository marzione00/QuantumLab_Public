# Quantum e post-quantum computing · Indicazioni per il docente

Edizione Matrix 4.2. Il percorso comprende quattro moduli consecutivi. Ogni sezione dei moduli 2–4 introduce il problema, definisce gli oggetti e gli spazi, sviluppa almeno due esempi e motiva il passaggio successivo. Tutti i calcoli rimangono leggibili; l'esplorazione libera segue gli esempi. Non vi sono quiz o punteggi.

## Modulo 1 · Dieci esperienze

Conservare la progressione moto, Loschmidt, onde, fenditure, polarizzazione, circuiti, coppie, ambiente, informazione e diagnosi. I dettagli delle esperienze originarie sono documentati in MODELLI.md.

Nelle fenditure partire dalla configurazione stretta: a = 20 µm, λ = 550 nm, L = 1 m e schermo ±70 mm. Il primo minimo di Fraunhofer è circa 27,5 mm. Passare alla configurazione intermedia (a = 1 mm) e a quella geometrica (a = 8 mm). Quest'ultima usa una risoluzione del rivelatore di 0,16 mm: la media spaziale attenua le oscillazioni residue. F_a = a²/(λL) descrive la scala locale della singola apertura; per due fenditure F_D = (d+a)²/(λL) descrive l’intera estensione illuminata e determina la validità globale del campo lontano. La media rettangolare usa anche il campo esterno ai bordi della finestra; risoluzione richiesta e applicata, passo della griglia e frazione catturata sono riportati insieme ai dati. Una fenditura ampia conserva fenomeni ai bordi; il limite geometrico va confrontato con la risoluzione del rivelatore e la scala della figura. La distribuzione dei conteggi è condizionata all'arrivo nella finestra visualizzata.

## Modulo 2 · Trentadue sezioni, 65 esempi

La sequenza comprende sei gruppi: geometria e complessi; operatori e coordinate; autovalori e proiettori; probabilità; stati e misura; sistemi composti. I diciotto strumenti precedenti rimangono disponibili nelle sezioni di esplorazione.

Presentare dapprima il significato delle coordinate e della norma. Introdurre il coniugio attraverso il prodotto interno, quindi l'ortogonalizzazione. Nelle matrici distinguere la trasformazione del vettore dal cambio delle sue coordinate. Autodirezioni, proiettori e funzioni di una matrice preparano la misura.

La fase viene studiata nei casi 90°, 180° e 0°. La probabilità nella base computazionale può restare invariata mentre cambia l'esito di una successiva interferenza. Piani delle ampiezze e sfera di Bloch rappresentano oggetti differenti. La parametrizzazione della sfera e il fattore due fra angolo del vettore di stato e angolo di Bloch sono sviluppati nel testo e nei diagrammi degli esempi.

Nell'esperimento completo usare A = [[1, 1−i], [1+i, 0]] e ψ = (2, i)/√5. Gli autovalori sono 2 e −1; gli autovettori normalizzati sono (1−i,1)/√3 e (−1+i,2)/√6. Le probabilità sono 13/15 e 2/15, la media 8/5 e la varianza 26/25. Il secondo esempio cambia la preparazione e ripete tutti i passaggi. Nelle misure incompatibili confrontare entrambi gli ordini e distinguere sequenze sullo stesso sistema da dispersioni su copie della preparazione.

## Modulo 3 · Quattordici sezioni, 30 esempi

Preparazione e programma conducono alle porte, all'inversa, all'interferometro, ai registri e agli stati di Bell. Seguono ancille e sintesi, Deutsch, una prima ricerca di Grover, evoluzione e un programma completo. La scelta di una porta mostra lo stato intermedio senza effettuare una misura.

Svolgere tutti e quattro i casi di Deutsch. Nel programma conclusivo le probabilità di riferimento sono (0,05; 0,05; 0,45; 0,45). Richiedere che ogni probabilità sia ricondotta alle ampiezze ottenute dal prodotto matriciale. Un qubit ridotto di una coppia entangled non può essere rappresentato come un vettore puro arbitrariamente scelto.

## Modulo 4 · Venticinque sezioni, 51 esempi

| Blocco | Sezioni | Progressione |
| --- | ---: | --- |
| Oracoli e ricerca | 8 | Deutsch–Jozsa, Bernstein–Vazirani, Simon, SWAP test, Grover, M ignoto, amplificazione, minimo |
| Fourier e stima | 7 | Fourier, QFT, Hadamard test, QPE esatta e approssimata, conteggio, stima di ampiezze |
| Aritmetica e fattorizzazione | 7 | Aritmetica, RSA, ordine, sommatore, moltiplicazione, autostati, frazioni continue |
| Algoritmi completi | 3 | Shor per 15, Shor per 21, logaritmo discreto |

In Grover mostrare separatamente le due riflessioni e la rotazione nel piano degli stati buoni e cattivi. Superare il numero opportuno di iterazioni per osservare la diminuzione della probabilità. Il caso M ignoto mantiene un bilancio esplicito delle interrogazioni e ammette l'insuccesso entro il budget.

Nella Fourier seguire i vettori complessi che si sommano. In QPE partire da un autostato, passare alla miscela delle distribuzioni associata a una sovrapposizione e infine alla fase non rappresentabile esattamente. La scelta dell'esito serve ad analizzare un ramo; la distribuzione completa rimane esposta.

RSA usa N = 55, e = 3, d = 7 e λ(N) = 20. I messaggi 7 e 5 distinguono il caso coprimo da quello non coprimo. Cifratura, decifratura, Euclide e CRT sono svolti. La fattorizzazione permette di ricavare la chiave privata; non viene affermata un'equivalenza generale fra inversione RSA e fattorizzazione.

Shor prepara davvero il registro bersaglio in |1⟩ e usa potenze modulari controllate. Gli autostati chiariscono la decomposizione di questa preparazione; non sostituiscono il circuito operativo. Per N = 21 confrontare 85/512, che conduce al candidato 6, con 171/512, che suggerisce il denominatore parziale 3. Quest'ultimo viene verificato e rifiutato come periodo. Mostrare anche a = 5, per cui un ordine corretto può dare radice −1 e nessun fattore utile.

Le reti modulari elementari sono verificatori didattici per registri piccoli. La sintesi per mintermini ha costo esponenziale. Il conteggio delle loro porte non è una stima delle risorse di un computer capace di fattorizzare chiavi RSA reali. Nel minimo l'ultimo controllo esaustivo è dichiarato e conteggiato. Nel logaritmo discreto la Fourier su sei livelli resta un'operazione astratta.

## Convenzioni e materiali

La guida PDF usa il modello definitivo **ArsClassica 01 · Classica**, in B5 con Palatino, Euler e titoli Iwona. Sono disponibili il volume integrale e quattro edizioni autonome. I sorgenti LaTeX e i diagrammi TikZ si trovano in `guide-latex/`; le appendici conservano le espansioni e le tabelle complete.

`PROPOSTA_ESERCIZI_GUIDATI.md` descrive un ampliamento di 15 esercizi per modulo, con richiami teorici e svolgimenti commentati. I 60 esercizi sono implementati; la presente revisione aggiunge le istruzioni per gli esperimenti modificabili dei moduli 3 e 4.

Il prodotto interno è coniugato nel primo argomento; i registri sono ordinati in convenzione big-endian. La QFT usa il segno positivo e l'inversa quello negativo. Le figure dichiarano se rappresentano spazio fisico, coordinate, ampiezze, probabilità o etichette discrete. Le identità simboliche sono esatte; i decimali sono arrotondati.

Le guide riportano tutte le configurazioni predefinite; il laboratorio permette di variare i controlli esposti. Esportare prima di abbandonare una sezione se si vogliono conservare dati o parametri. I rimandi alle presentazioni indicano la pagina PDF della versione Seminario.

Per il collaudo reale seguire COLLAUDO.md. Il test DOM automatico non verifica disegno Canvas, puntatore, impaginazione CSS, dispositivi mobili o avvio offline.


## Esercizi guidati implementati

Sono presenti 60 esercizi, 15 per modulo, con 336 passaggi principali di soluzione e 120 diagrammi TikZ nuovi. Ogni esercizio integra richiami alla teoria, traccia e soluzione completa. I file guide-latex/esercizi/modulo-N/GN.xx.tex sono sorgenti autorevoli mantenuti a mano; scripts/export-guide-latex.py rigenera gli indici e la collocazione, preservando questi file. La mappa e le istruzioni sono in docs/corso/ESERCIZI_GUIDATI.md (incluso anche nel pacchetto LaTeX). Per i moduli futuri conservare gli ID, dichiarare prerequisiti e convenzioni e verificare i nuovi calcoli con procedure indipendenti.


## Revisione 4.2: esperimenti modificabili e formule

Le 39 sezioni dei moduli 3 e 4 hanno un’area «Esperimento: modifica i dati, calcola e misura». I 12 circuiti generali del modulo 3 permettono di modificare ampiezze, porte, controlli, ordine e basi di misura; le restanti sezioni espongono parametri specifici. Il calcolo si avvia esplicitamente e azzera le misure. Quando i dati cambiano, i risultati precedenti restano identificati e le nuove misure sono disabilitate fino al ricalcolo.

La matematica sullo schermo usa MathML nativo incorporato nell’HTML. Le formule di partenza sono conservate per il generatore LaTeX e per le verifiche. La guida mantiene Palatino, Euler, Iwona e ArsClassica 01; le slide Seminario restano congelate. Simon presenta normalizzazione, interferenza, marginale e sistemi su F₂ in passaggi separati.

I dettagli scientifici, i limiti e le prove eseguite sono in `docs/corso/REVISIONE_4_2.md`. Per continuare il lavoro leggere anche `src/course/algorithms/experiment-notes.ts`, `experiments.ts` e `src/course/book/experiment-panel.tsx`.

Ogni consegna futura comprende tre archivi ZIP: locale, sorgenti e GitHub. Non pubblicare automaticamente un repository o un sito.
