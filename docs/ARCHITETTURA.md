# Architettura autonoma — 5.1

## Fonti uniche e confini

`content/catalogue.json` è il catalogo delle sette sezioni e delle 87 attività. `content/legacy-catalogue.json` è soltanto l’inventario congelato usato per verificare la copertura. `config/site.json` governa gli indirizzi esterni, l’atmosfera e l’avviso di licenza.

La build usa solo Node e produce file statici in `dist/`. Non legge né modifica la repository del sito principale. Gli asset sono relativi: il nome della nuova repository non è scritto nei sorgenti. `SITE_URL`, fornito da GitHub configure-pages, determina canonical, robots e sitemap; una build locale senza URL resta noindex. Tutte le rotte didattiche usano il frammento `#`, quindi non richiedono riscritture server.

## Nuclei scientifici conservati

`src/models.js` contiene i modelli delle sei attività native ed è identico alla 5.0 RC1. `vendor/legacy-runtime.js` conserva il bundle storico già adattato nella 5.0: viene caricato quando si apre un’attività storica, non dalla copertina. `vendor/origin.json` contiene l’impronta di riferimento; la build rifiuta un runtime alterato senza aggiornamento esplicito della provenienza.

`archive/src/` mantiene gli 82 sorgenti storici, confrontati byte per byte con la consegna precedente. `archive/package.json` e il lockfile documentano la toolchain storica; non sono dipendenze della build ordinaria. Per un intervento sui modelli storici seguire `scripts/rebuild-legacy.mjs`, aggiornare gli hash solo dopo revisione e rieseguire le suite. La 5.1 non ricompila o riscrive indiscriminatamente quel motore.

## Margini Matrix quantistici

`src/ambient.js` usa due canvas 2D, senza immagini, font o librerie esterne. Il codice in scorrimento, la proiezione della sfera unitaria, il vettore schematico e le onde sono decorazione; non leggono le variabili dell’esperimento. Non visualizzano un registro entangled come due qubit puri.

Il pannello offre animazione, statico e disattivato. `prefers-reduced-motion` impone lo statico anche se la preferenza salvata era animata. La larghezza utile è preservata: i margini esistono soltanto a partire da 1200 px. La schedulazione è sospesa nelle schede nascoste, sotto quella soglia e quando gli effetti sono statici o spenti. Il limite è 20 ridisegni al secondo, non una promessa di frequenza costante su ogni dispositivo. Il device pixel ratio è limitato per contenere costo e memoria. Sono presenti `aria-hidden` e `pointer-events: none`.

Tema e preferenze possono essere conservati nel localStorage dello stesso browser; indisponibilità o blocco dello storage non impediscono l’uso. Nessun dato degli esperimenti viene inviato a un servizio remoto. I normali accessi all’hosting e i click sui link esterni restano richieste di rete distinte.

## Licenza e materiale esterno

`LICENSE` applica CC BY-SA 4.0 ai materiali originali nei limiti dei diritti concedibili. Il bundle e gli avvisi delle componenti terze conservano le condizioni originali. Non sono distribuite nuove copie delle sette presentazioni; il laboratorio rinvia alla pagina del corso o ai PDF canonici configurati. I numeri di pagina non vengono presunti verificati via rete.

## Build e anteprima

Il monofile è una variante di revisione generata dagli stessi file: incorpora il runtime storico e usa hash esatti per la CSP. La distribuzione web resta a file separati e mantiene il caricamento differito. Non si deve caricare il monofile nella repository come sostituto dei sorgenti. Nessun service worker viene aggiunto, per evitare copie offline obsolete difficili da aggiornare.
