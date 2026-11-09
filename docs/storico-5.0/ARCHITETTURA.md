# Architettura e fonti uniche

`content/catalogue.json` è l'unico catalogo pubblico dei sette moduli. Definisce attività, orientamento, alias e riferimenti ai PDF. `content/legacy-catalogue.json` è un inventario congelato usato dai controlli, non un secondo indice visibile.

`src/models.js` contiene funzioni numeriche pure e riproducibili. `src/app.js` costruisce figure, tabelle e spiegazioni dagli stessi risultati. Le sei attività native offrono esportazione JSON, importazione validata, semi riproducibili e collegamenti alla configurazione. L'applicazione non invia questi dati a server. Il generatore pseudocasuale non è crittografico.

`vendor/legacy-runtime.js` conserva il bundle originale: è stata cambiata soltanto l'istruzione finale che montava tutta l'applicazione. Ora espone React, createRoot, RenderLesson, AssetsContext e registri. Il motore viene caricato una sola volta, al primo accesso a una delle attività storiche. Non è un caricamento separato per ciascuna delle 81 attività.

La nuova interfaccia monta il renderer originale e non reimplementa i suoi algoritmi. Il passaggio fra modalità di studio non rimonta il componente; rimangono conservati parametri e misure. Sono nascosti soltanto i pannelli non pertinenti alla modalità selezionata, non cancellati i contenuti.

## Manutenzione del motore storico

I sorgenti corrispondenti sono in `archive/src/`; gli SHA di provenienza sono in `vendor/origin.json`. La build ordinaria verifica l'integrità del runtime. Le dipendenze del compilatore storico e di React sono documentate in `archive/package.json` e nel lockfile.

Per una successiva modifica scientifica: installare quelle dipendenze nella cartella `archive` con la toolchain lì specificata, modificare i sorgenti, quindi dalla radice eseguire `npm run rebuild:legacy -- --accept`. Lo script usa un entrypoint che importa direttamente il registro delle lezioni, senza il vecchio shell. La ricompilazione facoltativa non è stata eseguita in questa consegna; il runtime distribuito conserva quello originale con adattamento verificato. Dopo ogni ricompilazione occorre rieseguire i test e aggiornare le prove. La CSS storica compilata è conservata, mentre gli adattamenti visivi correnti sono in `src/lab.css`.

## Separazione fra applicazione e materiali

La distribuzione web contiene soltanto applicazione, catalogo pubblico, licenze e metadati. Non contiene slide, guide generate, PDF editoriali, font, ambienti Python/Node o cache. Gli esercizi LaTeX scritti a mano sono conservati nell'archivio dei sorgenti; non vengono esposti come attività già migrate. Le vecchie procedure di generazione delle guide sono documentazione storica e non funzionano come build corrente senza i materiali esclusi.

## Integrazione nel sito

L'installatore non ricostruisce `src/render.mjs` da supposizioni. Aggiunge un passo deterministico alla build esistente: copia gli asset, genera la configurazione dei PDF e inserisce blocchi marcati nelle pagine prodotte dalla build. Le modifiche HTML sono così riproducibili e non interventi manuali su `dist/`. Il wrapper non altera il comando originale, le sue verifiche o il gate del CV. Le schede sono aggiunte alle pagine IT ed EN esistenti; l'app rimane in italiano.

## Compatibilità e limiti

Gli alias sono preservati all'interno dell'applicazione. La migrazione del vecchio URL richiede separatamente la pubblicazione esplicita della pagina di rinvio nel vecchio repository. Nessun token, deploy, account o installazione esterna viene attivato dagli script.

L'accessibilità include controlli tastiera, focus visibile, testi e tabelle alternative, temi chiaro/scuro e assenza di animazioni automatiche nelle nuove attività. Non è stata certificata la conformità WCAG dell'intero corpus storico. L'uso autonomo da parte di studenti non è stato sperimentato in questa consegna.
