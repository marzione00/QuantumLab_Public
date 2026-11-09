# Pulizia delle stratificazioni

Lo ZIP sorgenti originale contiene 2.522 file e 110.626.740 byte estratti. Sono state rilevate 385 copie aggiuntive identiche, pari a 4.984.734 byte. Le duplicazioni esatte non spiegano tutto il peso: guide equivalenti in HTML/PDF/LaTeX, copie delle presentazioni e distribuzioni tipografiche occupano la maggior parte del pacchetto.

La nuova distribuzione web contiene 12 file per circa 1,54 MB prima della compressione. Non include PDF o font. Il pacchetto sorgenti conserva circa 3,5 MB di codice, documenti, test e sorgenti storici prima della compressione; il valore finale dipende dai rapporti aggiunti. Confrontare ZIP con ZIP e distribuzione web con distribuzione web: queste misure non sono una prova delle prestazioni percepite.

## Eliminato dalla distribuzione attiva

Vecchia homepage e navigazione a quattro moduli; copie di slide; guide complete e per capitolo generate; PDF duplicati; font e file metrici; cache e artefatti tipografici; risultati storici presentati come collaudo attuale; workflow di pubblicazione automatico non richiesto.

## Conservato e separato

Tutte le 81 attività e i motori numerici, sei nuove attività, licenze delle componenti software, sorgenti scientifici TS/TSX, test originali, esercizi LaTeX scritti a mano e documentazione di provenienza. I documenti storici restano in `archive`, quelli correnti in `docs`. Le istruzioni correnti sono solo quelle della radice e di `docs`.

## Non cancellato indiscriminatamente

Gli esempi matematici ripetuti ma didatticamente significativi non sono deduplicati alla cieca. Il bundle storico mantiene codice inutilizzato dalla nuova shell; viene caricato su richiesta e non governa più gli indici pubblici. La ricompilazione opzionale può ulteriormente eliminare codice morto, ma la consegna conserva il bundle scientifico verificato. Non è dichiarata una riscrittura completa né l'assenza assoluta di ridondanza editoriale.

Vedere `qa/cleanup.json` per i dati misurati e i manifest SHA-256 di ciascun pacchetto per l'integrità.
