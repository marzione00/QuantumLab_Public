# Guida al laboratorio · ArsClassica 01

Modello scelto dall'utente: **Classica**. Pagina B5, Palatino nel testo, Euler nelle formule, Iwona nei titoli; accento bordeaux `#783E4D`, secondario blu `#4A6F93`.

## Compilazione

Occorrono Python 3.10 o successivo, PyMuPDF e TeX Live completo o MiKTeX con pdfLaTeX. I pacchetti specifici Classicthesis/ArsClassica, Euler Virtual Math e Iwona sono inclusi con i file originali di licenza in `vendor/`.

```sh
python -m pip install PyMuPDF
python compila.py
```

I cinque PDF sono scritti in `pdf/`; log e file temporanei in `compilazione/`. Per compilare un solo capitolo:

```sh
python compila.py --chapters 2
```

Il programma compila prima le figure TikZ e ne estrae i singoli PDF vettoriali in `figure/`. `figure-tutte.tex` è l'ingresso LaTeX che le raccoglie tutte; il programma prepara anche gruppi incrementali quando cambiano soltanto alcune figure. Una firma dei sorgenti evita di ricompilare quelle già aggiornate. `--force-figures` forza la ricompilazione. Ogni volume viene compilato tre volte per aggiornare indici e rimandi.

La versione consegnata contiene 1160 pagine nel volume completo; i quattro capitoli autonomi hanno 85, 233, 189 e 660 pagine. Una diversa versione della distribuzione TeX o dei pacchetti potrebbe produrre piccole variazioni di impaginazione.

## Struttura

| File o cartella | Contenuto |
| --- | --- |
| `Guida_corso.tex` | Volume integrale |
| `Guida_capitolo_1.tex` … `Guida_capitolo_4.tex` | Volumi autonomi |
| `preambolo.tex`, `frontespizio.tex` | Standard tipografico e apertura |
| `capitoli/` | Sorgenti integrali dei quattro moduli |
| `tikz/`, `figure/` | Diagrammi modificabili e PDF vettoriali |
| `content-ledger.json` | Testo sorgente di formule, tabelle e blocchi editoriali |
| `figure-manifest.json` | Identificatori e dimensioni delle figure |
| `vendor/` | Dipendenze specifiche con licenze originali |

## Continuità per un LLM

Conservare il modello 01 e leggere `ISTRUZIONI_PER_NUOVI_MODULI.md` del progetto. Nel pacchetto sorgenti completo, il contenuto autorevole si trova in `src/course/`: `scripts/render-course.mjs` genera le configurazioni statiche e `scripts/export-guide-latex.py` le traduce in LaTeX. Evitare modifiche permanenti ai capitoli generati che non siano riportate alla fonte.

Preservare tutte le sezioni, gli esempi, i passaggi, le righe tabellari e i termini delle espansioni. Le appendici F, T e R hanno rimandi di andata e ritorno. Non ridurre indiscriminatamente il corpo delle formule per farle entrare nella pagina: introdurre interruzioni fra termini, rispettando esponenti e numeri. I diagrammi restano vettoriali; gli assi, le etichette e i dati devono coincidere con quelli della simulazione.

Verificare la compilazione, il testo estratto, i font, i rimandi e l'impaginazione, renderizzando pagine di tutti i capitoli e delle appendici. Indicare l'estensione effettiva dell'ispezione visiva. Lo standard della guida riguarda il libro PDF; laboratorio Matrix e slide Seminario conservano i rispettivi temi.


## Esercizi guidati implementati

Sono presenti 60 esercizi, 15 per modulo, con 336 passaggi principali di soluzione e 120 diagrammi TikZ nuovi. Ogni esercizio integra richiami alla teoria, traccia e soluzione completa. I file guide-latex/esercizi/modulo-N/GN.xx.tex sono sorgenti autorevoli mantenuti a mano; scripts/export-guide-latex.py rigenera gli indici e la collocazione, preservando questi file. La mappa e le istruzioni sono in docs/corso/ESERCIZI_GUIDATI.md (incluso anche nel pacchetto LaTeX). Per i moduli futuri conservare gli ID, dichiarare prerequisiti e convenzioni e verificare i nuovi calcoli con procedure indipendenti.
