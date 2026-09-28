# Revisione 4.2 · Esperimenti e leggibilità

La revisione affronta due criticità: configurazioni iniziali prevalentemente fisse nei moduli 3–4 e formule visualizzate come testo lineare. Gli esempi guidati rimangono disponibili; ciascuna delle 39 sezioni ha ora un’area di esperimento modificabile.

## Contenuto

- Modulo 3: dodici editor di circuito con coefficienti complessi, normalizzazione esplicita, aggiunta/rimozione/riordino delle porte, controlli, angoli e basi Z/X/Y. Gli esperimenti di Grover ed evoluzione hanno parametri specifici.
- Modulo 4: 25 ambienti con parametri pertinenti a funzione, preparazione, registro, precisione, insieme favorevole, lista o problema aritmetico.
- Simon: funzioni che soddisfano la promessa 2-a-1, possibilità di nascondere la preparazione, generazione di problemi, misure dalla distribuzione, eliminazione mediante XOR, rango e candidati aggiornati. Gli esiti nulli e ripetuti sono ammessi.
- Conteggio e stima di ampiezza: nuova esplorazione operativa che costruisce U^x|ψ⟩ dall’operatore di Grover, applica Fourier inversa e calcola la marginale. Gli esempi guidati spettrali restano distinti e dichiarati.
- QPE: due autofasi, preparazione coerente, precisione e stato del bersaglio condizionato sull’esito misurato.
- Shor: N=15,21,33, basi e precisione modificabili, controllo classico del massimo comune divisore, distribuzione ricavata dall’esponenziazione modulare senza ordine in ingresso, misure e verifica dei convergenti.
- RSA: primi distinti, esponente e messaggio modificabili; controllo di validità, Euclide, quadrati successivi, cifratura, decifratura e correttezza anche per messaggi non coprimi.
- Logaritmo discreto: gruppi modulo 5,7,11,13, generatore e dato modificabili, distribuzione ricavata dalla funzione e intersezione delle congruenze misurate.

## Matematica e lettura

MathML nativo per frazioni, radici, indici ed esponenti; formule originali conservate negli attributi semantici per l’esportazione LaTeX. Calcoli disposti a larghezza piena e divisi in righe; espressioni molto lunghe consultabili con scorrimento orizzontale. Tabelle dei coefficienti associate alle etichette di base. Nessuna dipendenza da CDN, font remoti o servizi di calcolo.

Il tema Matrix è conservato. La guida PDF mantiene ArsClassica 01 e i font approvati. Gli esempi di Simon sono riscritti in passaggi separati, con tabelle di tutti i contributi e diagrammi di somma/cancellazione. La guida include 39 percorsi operativi specifici e conserva i 60 esercizi guidati. I sorgenti degli esercizi e le quattro presentazioni Seminario sono congelati.

## Uso

1. Leggere teoria e percorso operativo; gli esempi guidati forniscono riferimenti completi.
2. Aprire «Esperimento: modifica i dati, calcola e misura».
3. Modificare dati e formulare una previsione sul risultato.
4. Premere «Calcola l’esperimento». Se un dato viola il dominio ammesso, correggerlo seguendo il messaggio.
5. Confrontare formule e figure; usare «Esegui una misura» o «Esegui 20 misure» quando è prevista una lettura quantistica.
6. Esportare configurazione e misure per conservare l’esperimento; il seme permette di riprodurre la sequenza.

Le misure usano copie indipendenti della preparazione. «Azzera le misure» riavvia la sequenza con lo stesso seme. Modificare il seme e ricalcolare produce una nuova sequenza. La raccolta è limitata a 2000 osservazioni. Cambiare dati disabilita il campionamento fino al ricalcolo; i risultati esistenti si riferiscono alla configurazione già calcolata.

## Limiti scientifici

I simulatori operano su registri piccoli. I circuiti generali hanno fino a 24 porte e mantengono il numero di qubit della sezione. La dimensione massima viene indicata dai controlli. Per Simon si simulano le fibre della funzione e gli Hadamard; U_f non è sintetizzata in porte. Per conteggio/QPE si simulano le azioni controllate a livello di vettori; non si fornisce un conteggio di porte elementari dell’operatore. Le reti modulari per mintermini di Shor hanno costo esponenziale. Le Fourier di dimensione non binaria del logaritmo discreto sono trasformazioni astratte.

In ricerca con numero ignoto e minimo, le estrazioni avvengono durante il tentativo e sono elencate con il loro costo. Per cambiare la sequenza usare il seme dei tentativi. Il controllo esaustivo finale del minimo è dichiarato separatamente. L’esaurimento del budget non certifica l’assenza di soluzioni.

## Verifiche

I rapporti ripetibili sono in `qa/course/experiments-results.json`, `experiment-dom-results.json` e negli altri rapporti del progetto. Le verifiche numeriche confrontano i modelli con formule o somme indipendenti. I test DOM controllano interazioni React, validazione, misure, ripristino ed esportazioni.

Il browser non è disponibile nell’ambiente di esecuzione; il tentativo di reperire Chromium è stato bloccato dall’accesso alla distribuzione. I test DOM non verificano il layout CSS, MathML nei diversi browser, touch o l’avvio reale con file://. È quindi necessario il controllo visuale locale indicato in COLLAUDO.md. La compilazione e l’ispezione visuale dei PDF costituiscono verifiche distinte. Nessuna sperimentazione con studenti è stata eseguita.

## Consegna permanente

Ogni risultato viene consegnato in tre ZIP: locale, sorgenti e GitHub. I PDF sono inclusi nel pacchetto locale; i sorgenti LaTeX completi sono inclusi nello ZIP sorgenti. GitHub contiene il progetto e dist/ pronto per il workflow Pages. La consegna non pubblica automaticamente alcun sito.
