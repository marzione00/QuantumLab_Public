# Quantum e post-quantum computing · Continuità del progetto

Edizione Matrix 4.2 · 28 settembre 2026. Questo documento accompagna ogni ZIP. Leggere anche README.md, docs/corso/GUIDA_DOCENTE.md, MODELLI.md e i rapporti di verifica prima di intervenire.

## Richiesta iniziale per un futuro LLM

> Ti allego i sorgenti più recenti del laboratorio «Quantum e post-quantum computing» e i nuovi materiali. Leggi le istruzioni di continuità, la guida docente, i modelli e i test. Identifica i file effettivamente disponibili. Proponi prima prerequisiti, sequenza, esempi, geometria, limiti scientifici e verifiche del nuovo modulo; attendi l'approvazione prima di implementarlo. Conserva i moduli esistenti, gli indirizzi, il tema Matrix del laboratorio e il tema Seminario delle slide. Rigenera dalla stessa revisione codice, guide, pacchetti e rapporti, indicando i limiti del collaudo.

Lo ZIP locale serve a consultare il corso; per estenderlo allegare quello sorgenti o GitHub. Questo file non garantisce accesso a conversazioni, file precedenti o siti pubblicati. Non cercare materiali fuori da quelli autorizzati. L'implementazione di un nuovo modulo e la pubblicazione di un sito richiedono autorizzazioni distinte.

## Stato da conservare

| Modulo | Sezioni | Esempi nuovi |
| --- | ---: | ---: |
| 1 · Dal determinismo al calcolo quantistico | 10 | Esperienze originali conservate |
| 2 · Geometria, algebra e misura | 32 | 65 |
| 3 · Programmi e circuiti | 14 | 30 |
| 4 · Algoritmi, aritmetica, RSA e Shor | 25 | 51 |

Il filo conduttore è costruire una simulazione: preparazione, trasformazione, previsione e osservazione. Il pubblico è costituito da studenti di informatica, anche senza prerequisiti di fisica. Dal secondo modulo ogni passaggio algebrico deve avere una lettura geometrica e, quando pertinente, fisica. Le quattro presentazioni Seminario sono congelate; modificarle soltanto su richiesta esplicita.

È stata preparata la proposta `docs/corso/PROPOSTA_ESERCIZI_GUIDATI.md`: 15 esercizi per modulo, con richiami teorici, percorso guidato e svolgimento completo. I 60 esercizi sono implementati e conservati nei sorgenti autorevoli della guida. La proposta contiene la mappa dei temi e dei prerequisiti e va mantenuta distinta dagli esempi già presenti.

## Contratto editoriale

Scrivere in italiano accademico, preciso e leggibile; usare periodi articolati quando chiariscono dipendenze e ipotesi. Evitare slogan, domande retoriche seriali, opposizioni automatiche «non X, ma Y» e formule generiche. Spiegare concretamente che cosa rappresentano le grandezze e perché ogni operazione sia ammessa.

Ogni sezione nuova comprende, nell'ordine:

1. problema, prerequisiti e raccordo con la sezione precedente;
2. teoria e definizioni prima dell'uso dei simboli;
3. significato dello spazio rappresentato, assi, unità, convenzioni;
4. almeno due esempi svolti, con dati espliciti e tutti i passaggi;
5. figure geometriche collegate ai medesimi dati dei calcoli;
6. confronto dei risultati, significato fisico e limiti del modello;
7. eventuale esplorazione mediante comandi nominati e ripristinabili;
8. passaggio motivato all'argomento successivo.

Tutti i passaggi restano leggibili. L'avanzamento degli stati è facoltativo e non produce una misura implicita. Evitare animazioni automatiche che sottraggano il tempo necessario alla lettura. Non introdurre quiz, sfide, punteggi o gamification. I casi speciali importanti richiedono esempi aggiuntivi: Deutsch ha quattro funzioni, il test SWAP tre confronti, la fase tre valori di riferimento.

## Contratto scientifico

- Il prodotto interno è coniugato nel primo argomento. I registri sono big-endian. La QFT usa exp(+2πixy/N), l'inversa il segno negativo.
- Distinguere coordinate fisiche, ampiezze complesse, probabilità e sfera di Bloch. La sfera non è un disegno dell'apparato. Una descrizione ridotta mista può essere interna alla sfera.
- Una fase globale comune non modifica le probabilità; una fase relativa può cambiare l'interferenza. Conservare segni, angoli negativi, fattore due fra angoli di stato e di Bloch.
- Mostrare dati di ingresso, calcoli intermedi, risultati esatti e arrotondamenti. Gestire vettori nulli, basi dipendenti, matrici singolari, autovalori degeneri, eventi impossibili e raccolte vuote.
- Lo stato congiunto mantiene l'informazione necessaria a descrivere correlazioni ed entanglement. Una dinamica reversibile globale non autorizza a cancellare arbitrariamente le ampiezze.
- Le ancille devono essere inizializzate e, ove richiesto, ripulite; verificarle su tutta la base del piccolo circuito.
- Le probabilità teoriche e le frequenze campionarie sono oggetti distinti. Se un esito viene selezionato per analizzare un ramo, dichiararlo.
- Shor riceve N, a e la precisione, prepara |1⟩ e calcola le potenze modulari. Il periodo non deve essere fornito al circuito né usato per costruirne la distribuzione. La decomposizione in autostati è una spiegazione della preparazione operativa.
- Verificare i denominatori delle frazioni continue; non chiamare periodo un denominatore parziale. Distinguere ordine corretto, radice ±1 e fattorizzazione riuscita.
- Dichiarare risorse e astrazioni. Le reti modulari correnti, sintetizzate per mintermini, crescono esponenzialmente: servono a verificare esempi piccoli e non implementano l'aritmetica scalabile di Shor. L'esempio di logaritmo discreto con F6 non include sintesi binaria.
- Nel modello delle fenditure usare Fresnel per attraversare i regimi. Il limite di Fraunhofer da solo non descrive una fenditura ampia in campo vicino. Confrontare l'ombra geometrica dopo la stessa media del rivelatore; dichiarare normalizzazione nella finestra, ipotesi paraxiale e discretizzazione.

Conservare anche i contratti delle esperienze originarie: Loschmidt con tempo sufficiente, ritorno ideale e perturbato; correlazioni e anticorrelazioni; impostazioni numeriche e trascinamenti coerenti; export CSV/HTML; ingrandimenti, tastiera e hash storici.

## Tema e figure

Matrix è il tema del laboratorio; Seminario è quello delle slide. **ArsClassica 01 · Classica è il modello definitivo della guida PDF**, scelto dall'utente: B5 176 × 250 mm; margini laterali 20 mm; testo Palatino 10,5/13,2 pt; matematica Euler; titoli Iwona; bordeaux #783E4D e blu #4A6F93. Conservare queste impostazioni per tutti i capitoli futuri. Il preambolo autorevole è `guide-latex/preambolo.tex`.

Per il laboratorio la fonte cromatica è src/course/matrix-palette.json, con varianti schermo e stampa. generate-theme.mjs genera il CSS: non correggere a mano i file generati.

Prosa serif, valori numerici e matrici monospaziati; pannelli distinti, accenti leggibili e focus visibile. La pioggia di codice rimane statica, decorativa, accessibilmente nascosta e confinata alle copertine. Rispettare il movimento ridotto. Colore, forma, etichetta e tratteggio cooperano; il colore da solo non deve comunicare uno stato.

SVG e Canvas sono appropriati alle figure interattive. Usare TikZ nei sorgenti TeX, senza imporre immagini raster al laboratorio. I Canvas risolvono i token con src/lib/theme.ts. Le guide PDF usano formule LaTeX native e figure vettoriali TikZ; i dati geometrici provengono dalle stesse configurazioni del laboratorio. Figure, formule e didascalie devono restare leggibili anche nella stampa. `scripts/export-guide-latex.py` genera i capitoli; `guide-latex/compila.py` compila il volume e le edizioni autonome. I sorgenti generati si rigenerano: apportare le correzioni di contenuto alla fonte del corso.

## Architettura

| Percorso | Responsabilità |
| --- | --- |
| src/course/registry.tsx | Registro, tipi di capitolo, elenco delle sezioni e renderer |
| src/course/app.tsx | Navigazione, copertine, scope autonomo e hash |
| src/course/book/chapter-two.ts, explanations.ts | Sezioni, teoria e calcoli del modulo 2 |
| src/course/book/views.tsx, types.ts, book.css | Libro interattivo, esempi, figure, tabelle ed export |
| src/course/book/geometry.tsx, m2-support.ts | Retta numerica, griglie, traiettorie di Bloch, piano di Grover; esempi progressivi del modulo 2 |
| src/course/algorithms/catalogue.ts | Teoria, raccordi e casi dei moduli 3–4 |
| src/course/algorithms/theories.ts | Definizioni preliminari e raccordi specifici delle 39 sezioni dei moduli 3–4 |
| src/course/algorithms/examples.ts | Svolgimenti ricavati dai modelli |
| src/course/algorithms/engine.ts, reversible.ts | Stati, porte, Fourier, aritmetica e reti elementari |
| src/course/shared.tsx, math/core.ts | Componenti geometrici e algebra condivisa |
| src/course/demos/, legacy-tools.tsx | Esplorazioni originali del modulo 2 |
| src/components/, src/lib/ | Modulo 1; Fresnel in diffraction.ts |
| src/course/slide-references.json | Pagine PDF verificate della versione Seminario |
| scripts/ | Rendering HTML, PDF, build e confezionamento |
| guide-latex/ | Standard ArsClassica 01, quattro capitoli, figure TikZ, font e compilazione |
| qa/ | Test numerici, DOM, tema, struttura e PDF |
| docs/corso/ | Istruzioni didattiche, verifiche e collaudo |

## Aggiungere un modulo

1. Leggere i materiali forniti e proporre una sequenza con prerequisiti, casi risolti, geometria e collegamenti. Attendere approvazione.
2. Separare modello numerico, esempi calcolati e presentazione. Non inserire risultati prefissati nella simulazione operativa.
3. Aggiungere identificatori stabili e registrare componenti, parti e pagine PDF. Riutilizzare BookShell, Worked, BookDiagram e CircuitFigure dopo averne letto le firme.
4. Estendere ChapterId, registro, routing, scope e copertine. Cercare con rg i limiti espliciti: [1,2,3,4], capitolo-4, initialChapter, scope e i conteggi di rilascio.
5. Conservare gli hash esistenti. Nelle copie autonome presentare soltanto moduli inclusi; non inventare indirizzi online per contenuti non pubblicati.
6. Estendere render-course.mjs, export-offline.mjs, generate-course-pdf.py, package-release.py e tutte le verifiche strutturali. Sincronizzare la mappa delle slide nei documenti.
7. Aggiungere test con risultati indipendenti, casi esatti, degeneri e d'insuccesso. Confrontare la realizzazione circuitale con una formula indipendente su sistemi piccoli.
8. Rigenerare le guide dalla stessa revisione degli esempi. Le tabelle complete possono essere estese: distinguerle nel progetto didattico dalle pagine da proiettare.
9. Verificare layout, font, formule, grafici, tastiera, mobile, esportazioni e uso offline. Registrare separatamente ciò che è stato eseguito e ciò che resta da provare.
10. Aggiornare questo documento, README, guida docente e rapporti; verificare integrità e contenuto di ogni ZIP.

Le correzioni della versione 4.1 devono rimanere coperte dai test dedicati `verify-detector.mjs` e `verify-audit-revision.mjs`. Nel renderer un cambio di variante o un ripristino riporta il cursore alla preparazione; una sequenza accorciata lo limita all’ultimo stato disponibile. La figura finale, comprese le marginali decisionali, resta visibile e distinta dallo stato selezionato. Nel piano di Grover le coordinate si calcolano mediante prodotti interni con le direzioni collettive della preparazione, conservando il segno. Le traiettorie di Bloch seguono le porte e i loro angoli dichiarati. Un evento con probabilità positiva, per quanto piccola, conserva uno stato condizionato definito; gli zeri esatti vanno giustificati dal modello.

Le guide PDF organizzano espansioni e tabelle estese in appendici F, T e R con identificatore e collegamento bidirezionale. Il generatore verifica nel testo estratto tutte le righe e tutte le espansioni trasferite. Conservare questa verifica quando si modifica l’impaginazione; non troncare numeri, esponenti o tabelle per accorciare il volume.

## Comandi di rilascio

Requisiti: Node 24, pnpm 11.25.0, Python 3.10+, requirements-guides.txt, TeX Live completo o MiKTeX con pdfLaTeX, Poppler (`pdftotext`). Le dipendenze frontend sono bloccate dal lockfile.

```sh
pnpm install --frozen-lockfile
pnpm run check
python -m pip install -r requirements-guides.txt
pnpm run generate:all
```

check verifica tipi, modelli, build, struttura, tema e DOM. generate:all rigenera HTML/PDF, controlla i PDF, ricostruisce il corso e confeziona ZIP; non sostituisce i test numerici di check. Consegna standard richiesta dall’utente: esattamente tre ZIP, locale, sorgenti e GitHub. Il locale include le guide PDF; i sorgenti includono LaTeX, esercizi, diagrammi e verifiche; GitHub include anche dist/ e il workflow Pages. Tutti gli ZIP devono contenere queste istruzioni e AGENTS.md. Escludere dipendenze installate, credenziali, cache, anteprime e archivi di rilascio annidati.

Il workflow GitHub Pages pubblica dist/. Un progetto Sites, se autorizzato, richiede invece il proprio processo ufficiale; non trasferire credenziali. Non pubblicare senza richiesta.

## Limiti del collaudo corrente

Le suite numeriche, il rendering statico, i test React con jsdom e i controlli PDF sono ripetibili nei sorgenti. Nel test DOM il Canvas è simulato e il CSS non viene elaborato. Il browser disponibile non ha consentito l'apertura del pacchetto locale: puntatore, touch, layout mobile, stampa browser e file:// restano da provare. Non chiamare questi controlli «collaudo completo nel browser». Non è stata eseguita una sperimentazione didattica con studenti.


## Esercizi guidati implementati

Sono presenti 60 esercizi, 15 per modulo, con 336 passaggi principali di soluzione e 120 diagrammi TikZ nuovi. Ogni esercizio integra richiami alla teoria, traccia e soluzione completa. I file guide-latex/esercizi/modulo-N/GN.xx.tex sono sorgenti autorevoli mantenuti a mano; scripts/export-guide-latex.py rigenera gli indici e la collocazione, preservando questi file. La mappa e le istruzioni sono in docs/corso/ESERCIZI_GUIDATI.md (incluso anche nel pacchetto LaTeX). Per i moduli futuri conservare gli ID, dichiarare prerequisiti e convenzioni e verificare i nuovi calcoli con procedure indipendenti.


## Revisione 4.2: esperimenti modificabili e formule

Le 39 sezioni dei moduli 3 e 4 hanno un’area «Esperimento: modifica i dati, calcola e misura». I 12 circuiti generali del modulo 3 permettono di modificare ampiezze, porte, controlli, ordine e basi di misura; le restanti sezioni espongono parametri specifici. Il calcolo si avvia esplicitamente e azzera le misure. Quando i dati cambiano, i risultati precedenti restano identificati e le nuove misure sono disabilitate fino al ricalcolo.

La matematica sullo schermo usa MathML nativo incorporato nell’HTML. Le formule di partenza sono conservate per il generatore LaTeX e per le verifiche. La guida mantiene Palatino, Euler, Iwona e ArsClassica 01; le slide Seminario restano congelate. Simon presenta normalizzazione, interferenza, marginale e sistemi su F₂ in passaggi separati.

I dettagli scientifici, i limiti e le prove eseguite sono in `docs/corso/REVISIONE_4_2.md`. Per continuare il lavoro leggere anche `src/course/algorithms/experiment-notes.ts`, `experiments.ts` e `src/course/book/experiment-panel.tsx`.

Ogni consegna futura comprende tre archivi ZIP: locale, sorgenti e GitHub. Non pubblicare automaticamente un repository o un sito.
