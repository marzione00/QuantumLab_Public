# Pulizia e provenienza — 5.1

Rimosso dalla procedura corrente l’installatore nel sito principale, il wrapper post-build e la configurazione relativa `../../...`. La configurazione esterna è unica (`config/site.json`); il laboratorio non ha bisogno dei sorgenti, del CV o dei PDF del sito per essere costruito.

Sostituiti i riferimenti visibili a 5.0 RC1 con la versione corrente letta dal catalogo. Sito autonomo, licenza e navigazione di ritorno compaiono coerentemente nella testata, nel footer e nelle informazioni. I documenti 5.0 sono separati in `docs/storico-5.0/`, esplicitamente non operativi.

La build ordinaria usa soltanto Node. Il server Python duplicato è rimosso in favore del piccolo server Node; l’anteprima monofile si genera con uno script unico. Nessuna cartella node_modules, font, PDF, file di credenziali, vecchia distribuzione o pacchetto offline duplicato è incluso nello ZIP della repository. La build `dist/` è generata e non è sorgente.

L’archivio dei sorgenti originali 4.2 e i suoi test restano disponibili per manutenzione scientifica: non vengono confusi con il catalogo pubblico o distribuiti come pagine correnti. Gli esercizi LaTeX scritti a mano sono conservati come sorgenti, non come guide generate scaricate automaticamente.

`qa/provenance.json` documenta 87 confronti binari: 82 sorgenti storici e cinque file di modelli/runtime/provenienza/avvisi. Nessuna differenza. Il catalogo è identico al riferimento tranne `version`.

Gli hash della distribuzione sono prodotti a ogni build in `dist/manifest-sha256.json`. Il manifesto alla radice dello ZIP riguarda la consegna originale, non deve essere usato per rifiutare legittimi aggiornamenti futuri: la CI verifica struttura e modelli senza vincolare il repository a quel manifesto di consegna.
