# Modelli e lettura dei risultati

Le simulazioni sono calcoli classici di modelli ideali. Gli eventi sono
campionati dalle probabilità del modello e non sono dati sperimentali.

## Moto e gas

Nel moto uniforme vale x(t) = x₀ + vt. La fascia della figura principale
descrive un intervallo di compatibilità. La raccolta aggiuntiva introduce
un’ipotesi statistica esplicita: posizione e velocità iniziali uniformi e
indipendenti nei rispettivi intervalli. Lo scarto tipo previsto è
√[(Δx² + t²Δv²)/3]. Tutte le preparazioni contribuiscono all’istogramma.

Nel laboratorio di Loschmidt il gas contiene particelle di massa unitaria
con repulsione a breve distanza e riflessioni elastiche alle pareti. Il
recipiente misura 720 × 340 unità. Il potenziale fra due particelle è
U(r) = A[1 − (r/σ)²]⁴ per r < σ, nullo oltre σ; A = 24.000 e
σ = 3,8 per ogni popolazione N. Il numero di particelle varia a volume e potenziale fissati. Gli incontri hanno durata finita: il modello non è un
gas di dischi rigidi impenetrabili. La dimensione dei punti nella figura
serve alla leggibilità e non coincide con il raggio d’azione della forza.

L’esperimento apre con 5.000 particelle, un tempo fisico di espansione
pari a 12 unità e una durata di osservazione di almeno 45 secondi per
ciascuna evoluzione. Il tempo di osservazione non modifica il passo di
integrazione, che resta Δt = 1/1.024. L’espansione si arresta prima
dell’inversione; il confronto finale rimane visibile. Si possono ripetere
i ritorni dalla medesima configurazione cambiando soltanto l’imprecisione.

L’inversione accurata cambia il segno di tutte le velocità. Nel confronto
con registrazione incompleta, gli angoli vengono arrotondati al passo
selezionato prima di invertirli. Nel confronto perturbato, dopo
l’inversione si aggiunge un errore angolare uniforme in [−δ, δ]. La
frazione di velocità interessate è selezionabile. In entrambi i casi si
conservano posizioni e moduli delle velocità, entro la risoluzione numerica.
La perdita d’informazione riguarda dunque le direzioni. Con errore nullo,
i due ritorni devono coincidere.

Il nuovo motore `lib/reversible-gas.ts` usa uno schema simmetrico di
impulso–spostamento–impulso su una griglia intera di passo 2⁻²⁴. Le forze
sono calcolate in un ordine deterministico e gli impulsi sono arrotondati
con una regola simmetrica rispetto al segno. Le pareti sono rappresentate
mediante coordinate ripiegate. Gli interi sono contenuti nell’intervallo
esatto del tipo numerico utilizzato. Invertendo le velocità, ogni passo
ricostruisce esattamente il passo precedente sulla griglia. Il principio
degli integratori reversibili con aritmetica intera è discusso da
[Rein e Tamayo, JANUS (2017)](https://arxiv.org/abs/1704.07715).
L’implementazione e il potenziale di questo laboratorio sono specifici.

Questa reversibilità numerica non rende esatta la soluzione delle equazioni
continue. L’energia totale, cinetica più potenziale, presenta un piccolo
errore di discretizzazione che viene misurato durante l’evoluzione.
Il test dedicato richiede uno scarto relativo inferiore allo 0,5% nei casi
esaminati. Le traiettorie del ritorno sono ricalcolate dalle forze:
si conserva la configurazione al momento dell’inversione, non una sequenza
di fotogrammi da riprodurre.

La frazione nella metà sinistra misura il recupero della distribuzione
spaziale iniziale. Lo scarto quadratico medio delle posizioni e la frazione
di particelle entro due unità dalla propria posizione originaria valutano
la ricostruzione microscopica. Nel ritorno accurato le posizioni iniziali
sono recuperate, mentre i versi delle velocità sono opposti agli originari.
I dati aggregati, da soli, non identificano uno stato microscopico.

## Onde e schermo

Due onde coerenti hanno intensità relativa 1 + b² + 2b cos φ. La somma
delle sole intensità vale 1 + b². Il disegno delle ampiezze rappresenta
questa somma nel piano complesso.

Lo schermo usa la diffrazione di Fraunhofer nell’approssimazione
paraxiale: sinc²(πay/λL), moltiplicata per 2 + 2V cos(2πdy/λL + φ)
quando si aprono due fenditure. Qui sinc(u) = sin(u)/u. La distribuzione
è normalizzata nella finestra da −22 a +22 mm; non misura il flusso
totale trasmesso. Si integrano 6.400 punti medi, aggregati in 800 intervalli di 0,055 mm. Il campionamento risolve la distanza minima delle frange consentita dai comandi, 0,50 mm. Il dettaglio centrale mantiene la normalizzazione della finestra completa.
Tutti gli arrivi, fino a un milione, aggiornano lo schermo e i conteggi.
Per molti eventi il colore dello schermo è logaritmico; l’istogramma
rimane lineare. Non si attribuisce un cammino a ogni singolo evento.

## Qubit, coppie e ambiente

La polarizzazione usa le ampiezze cos α e exp(iδ) sin α. Il vettore di
Bloch è (sin 2α cos δ, sin 2α sin δ, cos 2α). Per un analizzatore lineare
a β la probabilità è [1 + r·(sin 2β, 0, cos 2β)]/2. Il campo disegnato
mostra una traiettoria nel piano trasversale, non un percorso del pacchetto
di luce. La sfera è uno spazio di stati, non lo spazio fisico. Il comando δ è una fase aggiunta: la fase effettiva è arg(x+iy), che include anche il segno di sin(2α). A α=-45° e δ=0 la fase effettiva vale 180°. Ai poli non è definita.

Nel laboratorio 6 gli esiti sono chiamati 0 e 1, corrispondenti ai precedenti
H e V. Il percorso presenta I, X, Y, Z, R e F come operazioni sullo stato.
X scambia le due ampiezze; Z cambia il segno della seconda; Y applica
(a,b) → (−ib,ia). R calcola ((a+b)/√2,(a−b)/√2). F applica
(a,b) → (a,exp(iδ)b), con δ regolabile fra −360° e +360°.
X, Y e Z compiono mezzi giri attorno ai rispettivi assi della sfera.
Le loro probabilità vengono calcolate dallo stesso modello dei laboratori
precedenti, senza richiedere una realizzazione ottica dei blocchi.
Gli stati + e − occupano punti opposti dell’equatore, hanno fasi 0° e 180°
e danno entrambi probabilità 1/2 nella lettura 0/1. R li distingue portandoli
rispettivamente in 0 e in 1. X applicata due volte è l’identità; lo stesso
vale per Y e Z. F(δ) seguita da F(−δ) restituisce lo stato iniziale.
La sorgente permette di trascinare direttamente la proiezione del punto, conservando la scelta dell’emisfero. La profondità viene ricostruita dalla condizione di norma unitaria. Al bordo la proiezione viene limitata alla circonferenza; i pulsanti di vista permettono di esporre l’altro emisfero. La vista obliqua ha azimut 30° e proiezione
verticale 0,96 per l’asse z. Il cambio di coordinate è ortogonale, così
le rotazioni della vista mantengono lo stato fisico e le probabilità invariati.
La preparazione viene propagata attraverso
tutti i blocchi attivi; le sfere intermedie sono previsioni, non misure.
Le curve ambra sono le traiettorie delle rotazioni applicate. Le frecce
bordeaux tratteggiate individuano punti nella metà posteriore della sfera.
La fase dello stato è arg(x+iy), riportata nell’intervallo (−180°,180°];
ai poli non è definita. La distanza angolare dal polo 0 rimane fra 0° e 180°.
Le caselle della fase accettano angoli positivi e negativi, il meno tipografico,
il punto o la virgola decimale. Il comando ± cambia il segno. Un angolo fuori
intervallo conserva l’ultimo valore valido. Le probabilità restano fra 0 e 1.

Il laboratorio delle coppie offre due sovrapposizioni: (HH + exp(iφ)VV)/√2
e (HV + exp(iφ)VH)/√2, oltre alle corrispondenti miscele equiprobabili e alla
preparazione indipendente D⊗D. Le probabilità si calcolano applicando gli
analizzatori lineari alle ampiezze; per le miscele si sommano le probabilità
pesate. Le preparazioni congiunte bilanciate hanno marginali 50/50 per tutte
le orientazioni mostrate. Lo stato dispari è anticorrelato in H/V per ogni
fase; a fase π è anticorrelato in ogni base lineare comune. Una sola lettura
non identifica l’entanglement.
Con misure diagonali, la concordanza della sovrapposizione HH/VV è (1+cos φ)/2: a φ=90° coincide con quella della miscela. La conclusione della pagina segue fase e analizzatori selezionati.
La costruzione guidata rappresenta 00, R sul primo qubit e quindi D⊗H: lo scambio controllato sul secondo
qubit genera HH/VV; un successivo X sul secondo genera HV/VH.

Nel laboratorio 8 la coppia iniziale è (HH+VV)/√2. Il secondo qubit
interagisce con un ambiente inizialmente puro: H lascia la traccia e₀,
V produce cos α e₀ + sin α e₁, con e₀ ed e₁ ortogonali. Il comando s
fra 0 e 100 imposta α=0,9s gradi. Eliminando i dati dell’ambiente,
la matrice della coppia mantiene p(HH)=p(VV)=1/2; i termini
fuori diagonale HH/VV sono moltiplicati per c=cos α.
Le probabilità sono c volte quelle della coppia coerente più (1−c)
volte quelle della miscela equiprobabile HH/VV.
In H/V la concordanza rimane perfetta; nelle diagonali, p(++)=p(−−)=(1+c)/4
e p(+−)=p(−+)=(1−c)/4. Ciascuna marginale rimane 50/50.
L’indicatore di coerenza visualizzato è 100c. Riguarda questa specifica
preparazione e la base HH/VV; non è una misura universale della coerenza.
A s=100 la coppia è separabile. Il sistema completo coppia+ambiente resta
puro nel modello, che non include assorbimento o rilassamento. Ridurre s
prepara esperimenti nuovi; non inverte l’evoluzione di eventi già misurati.
I cerchi delle tracce sono schematici e la loro area non quantifica c.

## Archivi del qubit

Il laboratorio 9 sostituisce il precedente gas libero. L’archivio completo
conserva il vettore di Bloch puro; quello ridotto conserva p(H) e quindi p(V).
Le probabilità salvate sono esatte nel modello: l’esperimento isola la perdita
della fase dall’incertezza statistica di una stima. Con z=2p(H)−1, gli stati
puri compatibili hanno coordinate (sqrt(1−z²)cos φ, sqrt(1−z²)sin φ, z).
Dopo R l’intervallo di p(H) è [(1−sqrt(1−z²))/2, (1+sqrt(1−z²))/2].
La lettura diretta e lo scambio X dipendono soltanto dai pesi salvati.
Il riferimento originale è separato dalle ricostruzioni. I JSON ridotti
esportati non contengono la fase, il nome dello stato o il riferimento.
L’importazione valida schema, normalizzazione e intervalli dei dati.
Si tratta di archiviazione del modello numerico, non di acquisizione dello
stato completo di un qubit fisico sconosciuto mediante una misura singola.

## Diagnosi di due cause

Il laboratorio 10 confronta un interferometro senza marcatura, con fase
aggiuntiva uniforme e indipendente a ogni prova, e un interferometro a fase
stabile con marcatura completa. Entrambi danno marginali D₁/D₂ pari a 1/2.
La stabilizzazione elimina il ritardo casuale del primo. La compensazione
agisce sulla marcatura presente nel secondo; sul primo rimane inattiva,
poiché quel dispositivo è assente. Questi sono interventi ideali sulle cause
dichiarate. Non costituiscono un protocollo universale per distinguere
qualsiasi modello di ambiente.
Il quaderno conserva impostazioni, previsione e quattro conteggi per apparato;
le scansioni e il quaderno si esportano separatamente. Due curve con frange
possono coincidere a una singola fase: il confronto riguarda l’intera scansione.

## Statistica

Le raccolte dei qubit ammettono fino a 100.000 nuove prove per comando.
Gli intervalli al 95% sono intervalli di Wilson per ogni esito separato;
non sono un intervallo simultaneo per l’intera distribuzione. Lo scarto
complessivo è la distanza di variazione totale, ½Σ|fᵢ − pᵢ|.
Un campione più grande riduce normalmente le fluttuazioni; il dato
di un singolo esperimento non deve migliorare a ogni incremento.

Riferimento per gli intervalli:
[NIST/SEMATECH, Confidence intervals for proportions](https://www.itl.nist.gov/div898/handbook/prc/section2/prc241.htm).

## Verifiche incluse

`qa/verify-loschmidt.mjs` verifica il nuovo motore con 1.000, 5.000 e
10.000 particelle: uguaglianza esatta delle coordinate e delle velocità
invertite, energia, riflessioni sulle pareti e confronto da direzioni
arrotondate. Verifica inoltre il controllo temporale: 45 secondi nominali
per ogni evoluzione, pausa prima dell’inversione, arresto finale e riuso
della medesima configurazione. I risultati sono in `qa/loschmidt-results.json`.


`qa/verify-models.mjs` conserva i 74 casi originari come regressione. Il controllo
`qa/verify-expanded.mjs` aggiunge 282 casi su grandi gas, confronto con
un solutore indipendente, energia, esclusione dei dischi, probabilità,
archivi, intervalli e un milione di arrivi campionati. Tempi e scarti
misurati sono in `qa/expanded-results.json` nei sorgenti. Questi due
controlli conservano anche il precedente modello di dischi, che non è più
il motore usato dalla pagina di Loschmidt.

I controlli numerici e il rendering statico non sostituiscono un collaudo
interattivo su diversi browser. Il rapporto di verifica specifica i controlli effettivamente eseguiti e il collaudo manuale ancora necessario.

La revisione 1.1 aggiunge `qa/verify-revision.mjs`: fase effettiva, trascinamento sui due emisferi, R–F–R e bypass, risoluzione minima delle frange, fase della coppia, archivi generici e interventi diagnostici.
