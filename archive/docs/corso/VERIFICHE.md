# Verifiche · Matrix 4.1

Il rilascio contiene quattro moduli, 81 sezioni e 146 esempi svolti nei moduli 2–4. Le presentazioni Seminario sono copiate senza modifiche dai quattro PDF di ingresso. Le verifiche sono ripetibili con pnpm run check e pnpm run generate:all.

## Controlli numerici

Le suite preesistenti dei moduli 1–2 sono conservate, comprese 13.607 verifiche del nucleo matematico e 1.985 verifiche delle correzioni. La nuova suite verifica Fresnel, porte, QFT contro trasformata diretta, inverse, tutti gli ingressi dei piccoli sommatori, ancille ripulite, moltiplicazioni modulari, RSA su tutti i messaggi modulo 55 e QPE.

Le distribuzioni complete di Shor per N = 15 e N = 21 sono confrontate con una somma indipendente per classi periodiche. Il periodo è usato dal test di riferimento, non dalla simulazione operativa. Sono verificati denominatori utili e parziali, Deutsch, Bernstein–Vazirani, Simon, SWAP, il programma conclusivo e il logaritmo discreto. Ogni esempio viene controllato per valori finiti e normalizzazione pertinente. Il rapporto esatto è qa/course/new-model-results.json.

La propagazione di Fresnel usa integrali verificati anche contro una valutazione indipendente SciPy. Sono controllati simmetria, posizione del primo minimo per fenditura stretta e accordo con l'ombra geometrica mediata per fenditura ampia. I parametri sono riportati nel test.

La suite aggiunta per il rivelatore comprende 110 verifiche e corregge il supporto della convoluzione ai bordi, la risoluzione positiva sotto il passo originario, i numeri di Fresnel locale e globale e i metadati esportati. Nel caso critico del bordo il valore è 0,288221949365617 contro 0,288221949365821 del riferimento SciPy. Nell’estremo con detector l’errore massimo su cinque punti critici è 9,99×10⁻¹⁰. Le probabilità negli 800 bin conservano l’integrazione ai punti medi: il confronto con una griglia infittita resta una verifica distinta dalla media del rivelatore.

La suite di regressione dell’audit comprende 677 asserzioni in 18 gruppi: dati e confronti degli esempi M2, ramo di Born con probabilità positiva inferiore a 10⁻¹⁶, cursori, ripristino, marginali, angoli, proiezioni di Grover, esiti impossibili e recupero del logaritmo discreto. Le suite esistenti e la nuova suite generale degli algoritmi sono conservate; quest’ultima esegue 25.816 verifiche.

La verifica indipendente delle nuove traiettorie di Bloch ha confrontato 91 preparazioni e 66 porte o angoli, comprese rotazioni negative e oltre un giro: errore massimo degli estremi 2,01×10⁻¹⁵, errore massimo dei punti intermedi 4,77×10⁻¹⁶. Ulteriori controlli indipendenti hanno verificato coefficienti complessi condizionati nella stima, autofasi di Grover, fattorizzazione QFT e pulizia del flag della somma modulare. Questi controlli supplementari sono stati eseguiti durante la revisione; le regressioni permanenti rimangono nei sorgenti consegnati.

La classificazione esatta dei rami di Shor è stata confrontata con somme geometriche indipendenti su tutti i 1.536 esiti dei quattro esempi, mediante 14.868 asserzioni. Per N=15 e a=2 oppure 7 sono possibili soltanto c=0,64,128,192; per N=21 e a=2 oppure 5 sono positivi tutti i 512 esiti. Avvisi e stati condizionati concordano con questa classificazione. L’errore massimo delle probabilità rispetto al riferimento è 1,59×10⁻¹⁵. Il criterio usa i rami generati dalla simulazione e la cancellazione esatta delle radici dell’unità, senza introdurre un ordine nascosto nel circuito.

## Struttura e interazioni

Il rendering comprende 81 sezioni e cinque copertine. Vengono verificati hash storici, percorsi relativi, nove ingressi HTML, guide, pagine PDF entro intervalli validi, esempi e passaggi, assenza di importazioni runtime esterne. Il test del tema copre palette schermo/stampa, token Canvas/SVG e istruzioni copiate.

Il test React con jsdom percorre tutte le sezioni e aziona comandi selezionati: preset e raccolta delle fenditure, ripristino, esplorazione del modulo 2, esportazione, avanzamento degli stati, casi Deutsch/SWAP e rami Shor. Canvas e geometria del puntatore sono simulati; il CSS di produzione è escluso dal test.

## Guide e archivi

Il rilascio HTML contiene 1.609 passaggi di calcolo nei 146 esempi dei moduli 2–4, secondo il conteggio strutturale delle viste. Il test DOM della revisione 4.1 ha superato 197 controlli percorrendo tutte le 81 sezioni e verificando due esportazioni. La conversione editoriale successiva adotta **ArsClassica 01 · Classica**: B5, Palatino, Euler, Iwona e bordeaux. La guida completa contiene 969 pagine e 733 figure vettoriali, ottenute da 574 sorgenti TikZ distinti; i volumi autonomi contengono rispettivamente 38, 185, 144 e 609 pagine. I conteggi comprendono copertine, indici e appendici; le paginazioni dei volumi autonomi sono indipendenti.

I cinque PDF sono controllati per glifi mancanti, contenuto, numero di sezioni, figure, indice, collegamenti, font incorporati e testo oltre i bordi. Il confronto con il testo effettivamente estratto dal volume ritrova tutti i 1.467 blocchi di formule e le 5.738 righe tabellari censite, di cui 5.734 nel quarto capitolo e quattro nel primo. Sono conservate le venti espansioni estese delle appendici. Nessuna casella LaTeX risulta sovrappiena e nessun blocco di testo oltrepassa il bordo della pagina. Le formule hanno testo alternativo Unicode per la copia e il confronto con la fonte; il contenuto visibile è matematica LaTeX nativa.

L'ispezione visiva della nuova edizione comprende 45 pagine del volume distribuite fra tutti i capitoli e le appendici, con dettagli di formule, matrici, RSA, Shor e tabelle. È un'ispezione campionaria. Ventitré controlli mirati del convertitore verificano, fra l'altro, esponenti con funzioni, indici, radici nelle coppie di coordinate e matrici con virgole decimali. I modelli numerici e il codice dell'interfaccia sono quelli della revisione 4.1; la conversione della guida non aggiunge una nuova esecuzione delle suite numeriche o del test DOM.

Ogni ZIP è sottoposto a test di integrità; MANIFEST.json registra file, dimensioni, conteggi e SHA-256. La copia autonoma contiene soltanto le risorse del proprio capitolo.

## Limiti dichiarati

Il collaudo in un browser reale non è stato completato: l'ambiente disponibile non ha consentito l'apertura del pacchetto locale. Restano da verificare mouse, touch, finestre, layout mobile, stampa browser, download reali e avvio offline. La procedura è COLLAUDO.md. Non è stata eseguita una prova didattica con studenti.

Le reti modulari per mintermini hanno costo esponenziale e servono a verificare piccoli esempi; non sono un'implementazione scalabile di Shor. La Fourier su sei livelli nel logaritmo discreto non include sintesi binaria. Non sono stati pubblicati aggiornamenti di siti esterni.

Rapporti macchina: mathematics-results.json, corrections-results.json, new-model-results.json, detector-results.json, audit-revision-results.json, frozen-slides-results.json, structure-results.json, theme-results.json, dom-results.json, pdf-results.json, pdf-content-results.json e pdf-layout-results.json nella cartella qa/course.


## Revisione 4.2

Sono stati aggiunti 39 ambienti modificabili e il compositore MathML. `verify-experiments.mjs` esegue 41012 controlli numerici e strutturali; `verify-experiment-dom.mjs` verifica le 39 sezioni, i ricalcoli di Simon, le misure, gli errori di ingresso, il ripristino e le esportazioni. La regressione sul ricalcolo controlla anche che esista una sola rappresentazione di Simon, evitando la permanenza di un disegno precedente.

Le suite precedenti sono conservate. `revision-4-2-preservation.json` confronta con la consegna precedente le quattro slide, i 60 sorgenti degli esercizi e il preambolo ArsClassica. I PDF sono compilati e controllati separatamente per formule, righe, font incorporati, collegamenti e limiti della pagina. Il browser reale non è stato disponibile: consultare la procedura visuale aggiunta in COLLAUDO.md.
