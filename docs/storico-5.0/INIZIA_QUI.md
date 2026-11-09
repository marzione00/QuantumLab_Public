# Quantum Lab 5.0 — RC1

**Laboratorio interattivo per Topological Manifolds · 9 novembre 2026**

Questa consegna riguarda il laboratorio, non una revisione delle sette presentazioni. Le slide approvate non sono modificate né replicate. È una versione candidata: i test documentati sono passati; l'efficacia didattica autonoma e la conformità di accessibilità richiedono ancora una valutazione umana.

## Che cosa è pronto

Sette moduli, 87 attività: tutte le 81 attività della 4.2 conservate e riorganizzate, più sei percorsi nuovi (fase, Grover, periodicità RSA, BB84, codifica superdensa e correzione di un errore X). Una nuova cornice comune espone obiettivo, definizioni, primo confronto e interpretazione. Tre modalità mantengono la configurazione: percorso guidato, esplorazione, calcoli e teoria.

I nuclei storici non sono riscritti integralmente. Il renderer React originale è montato soltanto nell'attività selezionata, senza la vecchia homepage e la vecchia navigazione. Le attività native e la copertina non caricano quel runtime.

## Provare il laboratorio

Aprire `dist/index.html` dopo aver estratto tutta la cartella. Quando il browser limita i file locali, usare:

```sh
python3 scripts/serve.py
```

L'anteprima monofile consegnata separatamente contiene la stessa applicazione e non dipende da file esterni. È utile alla revisione; la distribuzione web a file separati mantiene invece il caricamento differito del motore storico.

## Integrare nel sito v3.3

**Il pacchetto completo del sito principale non era disponibile nella sessione di implementazione.** Non è stata prodotta né pubblicata una nuova build completa di Topological Manifolds. È incluso un installatore reversibile, verificato su una fixture sintetica che riproduce i punti di integrazione, non sui sorgenti completi del sito.

Dalla cartella di questo pacchetto:

```sh
node integration/install.mjs "/percorso/Topological_Manifolds/02_SORGENTI_GITHUB"
```

Poi, nella cartella dei sorgenti del sito:

```sh
npm run build
```

L'installatore riconosce la scheda del corso e richiede i sette PDF canonici in `public/`. Aggiunge il laboratorio in `public/lab/quantum/`, un hook di build e schede nella Didattica e nella pagina del corso. Non sovrascrive cartelle non gestite, non elimina il blocco della release sul CV e non modifica contenuti o fotografie approvati. La versione EN riceve una scheda che dichiara esplicitamente che il laboratorio è in italiano.

Per rimuovere l'innesto, prima di altre modifiche a `package.json`:

```sh
node integration/install.mjs --remove "/percorso/Topological_Manifolds/02_SORGENTI_GITHUB"
```

Rigenerare poi il sito. Se i file installati o `package.json` sono stati modificati, il ripristino si interrompe anziché cancellare lavoro successivo. Conservare `.quantum-lab-integration/state.json`: contiene il backup necessario.

## Collegamenti e slide

Il nuovo laboratorio accetta i frammenti storici `#capitolo-N/id` e i dieci hash originari. Questo non modifica il vecchio repository remoto. Per trasferire anche l'indirizzo `QuantumLab_Public`, preparare facoltativamente una pagina di migrazione con `integration/make-redirect.mjs`, indicando l'URL HTTPS finale reale; nessuna pubblicazione è automatica.

Ogni build confronta le impronte dei PDF con i riferimenti documentati. Se un PDF è cambiato, il collegamento apre il modulo senza una pagina presunta e segnala la revisione necessaria. Non vengono usate le vecchie mappe di pagina per i nuovi PDF.

## Manutenzione

```sh
npm test
npm run build
```

La build ordinaria usa soltanto Node 22 o successivo, senza installare pacchetti. I test facoltativi `npm run test:legacy` richiedono TypeScript e `npm run test:browser` richiede Python, Playwright e Chromium. Leggere `docs/COLLAUDO.md` per il perimetro effettivo delle verifiche.

Non modificare a mano `dist/` o il runtime minificato. Contenuti e mappa: `content/catalogue.json`; nuovi modelli: `src/models.js`; interfaccia: `src/app.js`; stile: `src/lab.css`. `archive/` contiene sorgenti scientifici, test e documenti storici, non la procedura corrente di build.

La ricompilazione facoltativa del motore storico è descritta in `docs/ARCHITETTURA.md`. I dati di BB84 sono simulazioni, non chiavi utilizzabili; i piccoli esempi RSA non sono istruzioni per proteggere dati reali.
