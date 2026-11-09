# Collaudo della consegna — 9 novembre 2026

Versione Quantum Lab **5.0.0-rc.1**. Esiti ottenuti in questa sessione; non sono ripresi come attestazioni da rapporti precedenti.

## Nuovi modelli

`tests/models.mjs`: **34.890 controlli**, PASS. Fase confrontata con espressioni analitiche; Grover verificato per tutti gli insiemi di soluzioni su N=4 e N=8 e per i passaggi intermedi; quattro messaggi di codifica superdensa e marginali; codice a tre qubit, angoli e fasi, errori singoli e casi contrari; tutti i 55 messaggi del piccolo esempio RSA, con distinzione del dominio coprimo; BB84 con semi, sifting, campionamento senza riuso dei bit pubblici, rumore e intercettazione-rinvio. Input non validi rifiutati.

`tests/catalogue.mjs`: **382 controlli**, PASS. Sette moduli, 87 attività, copertura esatta delle 81 storiche, sei nuove, 91 alias, validità strutturale dei riferimenti, integrità del runtime.

## Regressione sui modelli storici

Sette suite originali rieseguite con esito PASS:

| Script | Controlli/casi riportati |
|---|---:|
| verify-models.mjs | 74 |
| verify-expanded.mjs | 282 casi |
| verify-quantum.mjs | 9.575 |
| verify-revision.mjs | 140 |
| verify-mathematics.mjs | 13.607 |
| verify-new.mjs | 25.816 |
| verify-experiments.mjs | 41.012 |

Le asserzioni scientifiche restano quelle originali. Per le tre suite course è sostituito soltanto il preambolo di compilazione esbuild con import diretti dei medesimi sorgenti TS, tramite TypeScript. La componente React è quella effettiva del runtime incluso, non uno stub. I report documentano gli hash dei test originali. La prova comprende anche un milione di estrazioni dal modello dello schermo; il numero di estrazioni non viene sommato artificiosamente al numero di controlli.

Non è stata rieseguita l'intera vecchia pipeline di typecheck, jsdom, guide e PDF. Il compilatore facoltativo del runtime non è stato attivato.

## Interfaccia Chromium

`tests/browser.py`: **234 verifiche**, PASS, Chromium 144.0.7559.96. Tutte le 87 attività montate realmente; indici e ricerca; alias rappresentativi; modalità che preservano lo stato; campionamento, export/import e rifiuto di importazione invalida; ripristino; BB84 e dati privati; calcolo di Simon, 21 misure e conservazione delle misure al cambio modalità; menu/Esc e tema chiaro. Controlli del layout a 1440, 390 e 320 px sulle viste selezionate. Nessun errore JavaScript non gestito e nessuna risorsa locale mancante nelle prove.

Metodo: documento controllato con `page.set_content` e risorse locali fornite dal test. Non è una navigazione al sito online. Nel test della distribuzione multipagina la CSP è rimossa dal solo documento di prova per via dell'origine sintetica; la CSP consegnata resta intatta.

`tests/standalone.py`: **12 verifiche**, PASS. I cinque script dell'anteprima monofile corrispondono ai loro hash CSP. La CSP dell'anteprima è effettivamente attiva nel documento Chromium: apertura, pagine native, Simon e licenze interne, zero richieste di rete e zero errori. La navigazione `file://` non è stata certificata nell'ambiente corrente.

## Integrazione

`tests/integration.mjs`: **35 verifiche**, PASS. Fixture sintetica, esplicitamente non l'intero sito v3.3. Installazione ripetibile, quattro pagine IT/EN, sette schede sul corso, contenuti e CSP preesistenti conservati, PDF non modificati, avviso su PDF variati, assenza di doppioni dopo una seconda build, rollback e rifiuto di sovrascrivere modifiche successive.

**Non eseguiti:** applicazione dell'innesto ai sorgenti completi v3.3, regressione end-to-end dell'intero sito, gate CV in una release completa, verifica HTTP del deployment effettivo, deploy su GitHub.

## Limiti delle conclusioni

I risultati non costituiscono prova formale, conformità WCAG certificata, sicurezza QKD operativa o dimostrazione di apprendimento autonomo. Non attestano l'assenza di ogni problema linguistico, grafico o matematico per input arbitrari. Le 81 lezioni storiche sono conservate e incorniciate, non tutte riscritte come nuovi percorsi guidati.

## Riproduzione

Build e test ordinari: `npm run check`. Test storici: `npm run test:legacy` con TypeScript disponibile. Test browser: `npm run test:browser` con Playwright e Chromium. Il percorso dell'eseguibile Chromium nel test è `/usr/bin/chromium`: adattarlo all'installazione locale. Anteprima: `node scripts/standalone.mjs /percorso/anteprima.html`, poi `python3 tests/standalone.py /percorso/anteprima.html`.
