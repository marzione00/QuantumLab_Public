# Quantum e post-quantum computing · Laboratorio interattivo

Edizione Matrix 4.2 · 28 settembre 2026.

La guida PDF adotta il modello **ArsClassica 01 · Classica**, scelto come standard: pagina B5, testo Palatino, matematica Euler, titoli Iwona e accento bordeaux. I sorgenti del volume e dei quattro capitoli sono in `guide-latex/`.

Quattro moduli consecutivi, 81 sezioni. I moduli 2–4 comprendono 146 esempi svolti, con teoria, calcoli, diagrammi e interpretazione. Il primo modulo conserva le dieci esperienze originali e aggiorna il modello delle fenditure. Le presentazioni Seminario sono incluse senza modifiche didattiche o grafiche. Non sono presenti quiz, punteggi o percorsi valutativi.

| Modulo | Sezioni | Contenuto |
| --- | ---: | --- |
| 1 | 10 | Dal determinismo al calcolo quantistico; Fresnel e limite geometrico |
| 2 | 32 | Algebra, geometria, probabilità, misura e sistemi composti; 65 esempi |
| 3 | 14 | Programmi, circuiti, reversibilità, interferenza e primi algoritmi; 30 esempi |
| 4 | 25 | Oracoli, ricerca, Fourier, stima di fase, aritmetica, RSA e Shor; 51 esempi |

## Aprire il corso

Estrarre interamente il pacchetto locale e aprire `index.html`. Nel pacchetto GitHub il file è `dist/index.html`. JavaScript, React e CSS sono incorporati; guide e presentazioni sono risorse relative incluse. Il progetto è predisposto per l'uso locale senza server. Il comportamento reale con `file://` resta da collaudare secondo `docs/corso/COLLAUDO.md`.

Il progetto genera anche ingressi HTML autonomi per ciascun modulo; la consegna viene raccolta nei tre ZIP locale, sorgenti e GitHub. Gli hash storici, per esempio `#calcolo`, sono conservati; gli indirizzi espliciti usano `#capitolo-2/complessi`. Questa consegna non aggiorna automaticamente un sito precedentemente pubblicato.

## Compilazione e verifica

Requisiti: Node 24 e pnpm 11.25.0. Il lockfile fissa le dipendenze.

```sh
pnpm install --frozen-lockfile
pnpm run check
```

`check` esegue TypeScript, prove numeriche, build, controlli strutturali, tema e interazioni React in DOM simulato. `build` rigenera gli HTML e copia i PDF presenti in `public/`.

Per rigenerare anche guide PDF e ZIP:

Installare anche TeX Live completo o MiKTeX con pdfLaTeX e Poppler (`pdftotext`). I componenti ArsClassica e i font specifici sono inclusi in `guide-latex/vendor/`, con le licenze originali.

```sh
python3 -m venv .venv
# Attivare l'ambiente secondo il sistema operativo.
python -m pip install -r requirements-guides.txt
pnpm run generate:all
```

I font sono inclusi con le licenze. Le quattro presentazioni sono ingressi congelati; il laboratorio non ricompila le slide LaTeX. Gli ZIP verificati sono scritti in `release/`.

## Sorgenti

| Percorso | Funzione |
| --- | --- |
| `src/course/registry.tsx` | Registro dei quattro moduli, riferimenti, componenti |
| `src/course/app.tsx` | Navigazione, copertine e indirizzi |
| `src/course/book/` | Teoria e 32 sezioni del modulo 2; viste comuni degli esempi |
| `src/course/algorithms/` | Moduli 3–4, simulatore di stati, circuiti e reti reversibili |
| `src/course/demos/`, `legacy-tools.tsx` | Diciotto strumenti esplorativi del modulo 2, conservati |
| `src/lib/diffraction.ts` | Propagazione di Fresnel e risposta del rivelatore |
| `src/components/`, `src/lib/` | Esperienze del modulo 1 |
| `src/course/matrix-palette.json` | Colori comuni per schermo e stampa |
| `public/` | Slide e guide generate |
| `guide-latex/` | Modello Classica, capitoli LaTeX, figure TikZ e compilazione autonoma |
| `scripts/`, `qa/` | Generazione, confezionamento e verifiche ripetibili |
| `docs/corso/` | Indicazioni didattiche, limiti e collaudo |

## Materiali e limiti

Le guide HTML/PDF contengono gli esempi predefiniti completi, compresi quelli di confronto. Nel PDF le espansioni più lunghe e le tabelle estese dei registri e delle reti elementari sono raccolte in appendici identificate, con collegamenti di andata e ritorno al passaggio pertinente. Tutti i termini e tutte le righe rimangono disponibili; il modulo 4 è un volume di consultazione ampio. Nel laboratorio le tabelle si aprono su richiesta. L'esportazione HTML conserva la lezione e i valori correnti; i dati tabellari principali sono esportabili in CSV.

I circuiti operano su vettori di stato classici di piccola dimensione. Shor riceve N, a e la precisione; il periodo non è un ingresso del circuito. Le piccole reti modulari sono sintetizzate tramite mintermini e verificate su tutta la base: questa sintesi cresce esponenzialmente e non rappresenta l'implementazione efficiente di Shor. L'esempio di logaritmo discreto su sei livelli usa una Fourier astratta, senza sintesi binaria. Questi limiti sono espliciti anche nelle lezioni.

I controlli numerici e DOM sono automatici; il Canvas nel test DOM è simulato e il CSS è escluso. Le guide vengono controllate per contenuto, glifi e limiti della pagina, con ispezione visiva campionaria. Mouse, touch, stampa da browser, impaginazione mobile e avvio reale offline richiedono il collaudo indicato in `COLLAUDO.md`.

## Continuità e pubblicazione

Per aggiungere moduli leggere `ISTRUZIONI_PER_NUOVI_MODULI.md`. Conservare Matrix per il laboratorio, Seminario per le slide e ArsClassica 01 per le guide PDF. Il workflow GitHub Pages incluso pubblica `dist/`: caricare il contenuto della cartella di progetto e selezionare GitHub Actions nelle impostazioni Pages. Una pubblicazione sul repository dell'utente richiede un'azione autorizzata separata.

Autori dei materiali di partenza: Marzio De Corato e Danilo Bruschi, Università degli Studi di Milano. Le licenze dei componenti e dei font sono incluse; questa revisione non introduce una nuova licenza per i materiali didattici.


## Esercizi guidati implementati

Sono presenti 60 esercizi, 15 per modulo, con 336 passaggi principali di soluzione e 120 diagrammi TikZ nuovi. Ogni esercizio integra richiami alla teoria, traccia e soluzione completa. I file guide-latex/esercizi/modulo-N/GN.xx.tex sono sorgenti autorevoli mantenuti a mano; scripts/export-guide-latex.py rigenera gli indici e la collocazione, preservando questi file. La mappa e le istruzioni sono in docs/corso/ESERCIZI_GUIDATI.md (incluso anche nel pacchetto LaTeX). Per i moduli futuri conservare gli ID, dichiarare prerequisiti e convenzioni e verificare i nuovi calcoli con procedure indipendenti.


## Revisione 4.2: esperimenti modificabili e formule

Le 39 sezioni dei moduli 3 e 4 hanno un’area «Esperimento: modifica i dati, calcola e misura». I 12 circuiti generali del modulo 3 permettono di modificare ampiezze, porte, controlli, ordine e basi di misura; le restanti sezioni espongono parametri specifici. Il calcolo si avvia esplicitamente e azzera le misure. Quando i dati cambiano, i risultati precedenti restano identificati e le nuove misure sono disabilitate fino al ricalcolo.

La matematica sullo schermo usa MathML nativo incorporato nell’HTML. Le formule di partenza sono conservate per il generatore LaTeX e per le verifiche. La guida mantiene Palatino, Euler, Iwona e ArsClassica 01; le slide Seminario restano congelate. Simon presenta normalizzazione, interferenza, marginale e sistemi su F₂ in passaggi separati.

I dettagli scientifici, i limiti e le prove eseguite sono in `docs/corso/REVISIONE_4_2.md`. Per continuare il lavoro leggere anche `src/course/algorithms/experiment-notes.ts`, `experiments.ts` e `src/course/book/experiment-panel.tsx`.

Ogni consegna futura comprende tre archivi ZIP: locale, sorgenti e GitHub. Non pubblicare automaticamente un repository o un sito.
