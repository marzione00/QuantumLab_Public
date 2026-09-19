# Quantum e post-quantum computing — continuità del progetto

Edizione Matrix 3.0 · 19 settembre 2026

Questo file accompagna tutti i pacchetti del corso. Conserva le decisioni scientifiche, didattiche e grafiche necessarie per riprendere il lavoro in un nuovo progetto Work, in una chat o in un ambiente di sviluppo. I sorgenti completi si trovano nei pacchetti **GitHub** e **sorgenti**; i pacchetti **locale** contengono il corso già generato.

## Testo da usare in un nuovo progetto

> Ti allego i sorgenti del corso «Quantum e post-quantum computing», edizione Matrix. Leggi prima ISTRUZIONI_PER_NUOVI_MODULI.md, README.md e docs/corso/GUIDA_DOCENTE.md, quindi esamina i sorgenti e i controlli automatici. Voglio aggiungere un capitolo utilizzando il materiale didattico che allego. Proponi la sequenza delle dimostrazioni, dichiarando quali conoscenze sono già state introdotte; attendi la mia approvazione prima di implementare il nuovo contenuto. Conserva il tema Matrix, le funzionalità dei capitoli esistenti e i loro indirizzi. Alla consegna rigenera il pacchetto GitHub, i sorgenti, il corso locale, le copie autonome dei capitoli, le guide e il rapporto delle verifiche. Inserisci questo file, aggiornato, in ogni ZIP.

Allegare lo ZIP **sorgenti** più recente e le nuove slide; se si desidera riprendere anche un sito già pubblicato, indicarne l'indirizzo e fornire l'accesso al progetto corrispondente. Il solo ZIP locale consente di consultare il laboratorio, ma non contiene i file TypeScript da estendere. Questo documento non sostituisce i sorgenti e non prova che un assistente abbia accesso al progetto precedente.

## Il percorso da conservare

Il problema iniziale è costruire una simulazione: quali informazioni descrivono la preparazione, come si trasformano e quali risultati permettono di prevedere. I concetti si introducono quando questo problema li rende necessari.

- **Capitolo 1 — Dal determinismo al calcolo quantistico:** dieci dimostrazioni. Moto; Loschmidt; onde; fenditure; polarizzazione; circuito; coppie; ambiente; informazione; confronto conclusivo.
- **Capitolo 2 — Geometria del calcolo quantistico:** diciotto dimostrazioni. Complessi, basi, proiezioni, matrici, aggiunto, spettro, composizione, tensore, eventi, momenti, frequenze, condizionamento, stati, unitarie, Born, incompatibilità, sistemi composti ed esperimento completo.
- I capitoli non realizzati rimangono indicati come **To be done**, senza pulsanti che promettano contenuti assenti.

Il pubblico è costituito da studenti di informatica che possono non conoscere la fisica. Il primo capitolo sviluppa la geometria prima del formalismo. La sfera di Bloch permette di introdurre lo stato senza anticipare ket, bra o prodotti tensoriali. Le operazioni X, Y, Z, R e F vengono spiegate attraverso il loro effetto; i dispositivi ottici richiedono una spiegazione preliminare quando sono pertinenti. Il secondo capitolo esplicita la teoria e tutti i passaggi dei calcoli.

## Prosa e didattica

Scrivere in italiano accademico, preciso e leggibile, con periodi articolati quando il ragionamento lo richiede. Evitare formule pubblicitarie, domande retoriche ripetitive, frasi slogan, opposizioni meccaniche «non X, ma Y» e passaggi generici quali «è qui che entra in gioco». Ogni paragrafo deve spiegare un rapporto concreto fra preparazione, operazione, figura e risultato.

Ogni dimostrazione comprende:

1. il problema e le conoscenze già disponibili;
2. la definizione delle grandezze e delle condizioni del modello;
3. comandi che dichiarano che cosa modificano, l'intervallo ammesso e l'effetto sui dati già raccolti;
4. una figura geometrica con assi, unità, legenda e interpretazione;
5. un esempio iniziale significativo, modificabile e ripristinabile;
6. passaggi di calcolo completi, aggiornati dagli stessi dati della figura;
7. una lettura del risultato che distingua preparazione, previsione e osservazioni;
8. un raccordo all'argomento seguente, motivato da ciò che è stato appena osservato.

Non introdurre quiz, sfide, punteggi o obiettivi di gioco. La lunghezza delle spiegazioni è subordinata alla comprensione. Le didascalie devono permettere di leggere gli strumenti senza conoscenze esterne alle lezioni fornite.

## Contratti scientifici e funzionali

Non cambiare una convenzione locale senza controllare tutti i punti in cui compare: diagrammi, formule, parametri, esportazioni, guide e prove automatiche.

- Conservare segni, ordine delle operazioni, convenzioni di fase e associazioni fra assi della sfera e stati. Dichiarare la differenza fra angolo della polarizzazione e angolo sulla sfera quando serve.
- Separare vettore nello spazio fisico, ampiezze e punto sulla sfera. Nel capitolo 2 la notazione va definita prima dell'uso.
- Distinguere stato puro, stato del sistema congiunto e descrizione ridotta. Un punto interno alla sfera non rappresenta uno stato puro isolato.
- La perdita di coerenza del sottosistema dipende dall'informazione presente nell'ambiente; una dinamica congiunta reversibile non giustifica una cancellazione arbitraria dello stato globale.
- Conservare correlazione e anticorrelazione, basi di misura e preparazioni che riproducono gli esempi delle slide.
- L'inversione di Loschmidt deve avere durata sufficiente e confrontare il ritorno ideale con l'errore di inversione. Gli insiemi devono mantenere le numerosità utili a vedere le distribuzioni.
- Tutti gli angoli previsti dal modello conservano anche valori negativi. I campi numerici e il trascinamento aggiornano gli stessi dati, compresi i risultati delle operazioni successive.
- Il circuito deve mostrare l'intera sequenza e gli stati intermedi. La selezione di un blocco cambia il dettaglio visualizzato, senza effettuare implicitamente una misura.
- Distinguere valori esatti, arrotondamenti, probabilità teoriche e frequenze campionarie. Gestire raccolte vuote, vettori nulli, basi dipendenti, matrici singolari e autovalori degeneri.
- Conservare gli esportatori CSV e HTML, la navigazione da tastiera, il ripristino, gli ingrandimenti, i collegamenti alle slide e gli indirizzi preesistenti.

## Tema Matrix

La fonte dei colori è `src/course/matrix-palette.json`. Contiene palette per schermo e stampa. `scripts/generate-theme.mjs` genera `matrix-palette.css`; `matrix.css` applica il tema ai componenti. Non modificare a mano il CSS generato. `src/app/globals.css` importa gli stili di base e, per ultimo, il tema.

- Sfondo verde quasi nero, pannelli distinti, accento verde fosforo. La prosa e i titoli rimangono in carattere serif; numeri, matrici e indicatori usano un carattere monospaziato.
- I colori delle grandezze sono stabili fra i capitoli e hanno significato esplicito nelle legende. Blu, verde, corallo, viola e ambra restano distinguibili anche attraverso etichette, tratteggi e forme.
- La pioggia di codice è statica, decorativa, esclusa dall'accessibilità e confinata alle copertine. Non sovrapporla a formule, grafici, dati o testi di spiegazione.
- Usare i token `var(--mq-…)` per SVG e CSS. Il Canvas deve risolverli con `src/lib/theme.ts` prima di impostare colori o calcolare canali RGB. Il PDF risolve i medesimi token usando la palette di stampa.
- In HTML i disegni sono SVG o Canvas nativi. TikZ resta appropriato per slide e documenti TeX; evitare raster quando la figura deve reagire ai comandi.
- Le guide PDF usano la variante chiara, adatta alla stampa. Le guide HTML conservano il tema Matrix e la variante chiara nella stampa del browser.
- Evitare bagliori sui paragrafi. Verificare il contrasto anche nei controlli selezionati, nelle finestre ingrandite e nei menu aperti fuori dal contenitore principale.
- Il colore non deve essere l'unico mezzo per comunicare una selezione. I controlli mantengono nomi accessibili, stato selezionato e focus visibile. Rispettare la preferenza di movimento ridotto.

## Mappa dei sorgenti

| File o cartella | Funzione |
| --- | --- |
| `src/course/app.tsx` | Indice, routing, copertine, collegamenti fra capitoli, selezione delle dimostrazioni |
| `src/course/catalogue.ts` | Metadati del corso e del capitolo 2; capitoli futuri |
| `src/course/chapter-one.tsx` | Integrazione delle dieci dimostrazioni del primo capitolo |
| `src/components/lab-*.tsx`, `bloch-point.tsx`, `circuit-overview.tsx` | Strumenti e dimostrazioni del primo capitolo |
| `src/course/demos/` | Le diciotto dimostrazioni del secondo capitolo |
| `src/course/shared.tsx` | Teoria, controlli, piani, sfere, matrici, passaggi ed esportazione delle dimostrazioni |
| `src/lib/`, `src/course/math/core.ts` | Modelli fisici, statistica e calcolo numerico |
| `src/course/matrix-cover.tsx` | Disegno della copertina e decorazione delle copertine |
| `src/course/course.css`, `src/app/base.css` | Struttura e impaginazione dei componenti esistenti |
| `public/` | Presentazioni e guide generate distribuite con il corso |
| `scripts/render-course.mjs` | Rendering statico delle dimostrazioni e guide HTML |
| `scripts/generate-course-pdf.py` | Guida PDF, matematica e figure nella palette di stampa |
| `scripts/export-offline.mjs` | HTML autonomi con JavaScript e CSS incorporati |
| `scripts/package-release.py` | ZIP del corso, dei capitoli, dei sorgenti e di GitHub |
| `qa/`, `qa/course/` | Controlli numerici, strutturali, editoriali e PDF |
| `docs/corso/` | Guida docente, verifiche, collaudo e revisione |

I pacchetti autonomi hanno il prefisso `src/`. Un eventuale progetto Sites può collocare `course/`, `components/`, `lib/` e `app/` direttamente alla radice: leggere il progetto effettivo prima di copiare file. Conservare manifest e strumenti del servizio di hosting, senza trasferire credenziali negli ZIP.

## Aggiungere un capitolo

Il progetto attuale contiene **due capitoli espliciti**: inserire una voce nel catalogo non basta. Prima di intervenire, cercare con `rg` riferimenti a `chapterTwoComponents`, `courseChapters`, `parseRoute`, `scope`, `initialChapter`, `capitolo-2`, `[1,2]` e `0|1|2`.

1. Leggere le nuove slide e proporre un catalogo di dimostrazioni con prerequisiti, scopo, esempio iniziale, geometria e calcoli. Concordare tale catalogo con il docente.
2. Implementare separatamente il modello numerico e i componenti. Riutilizzare `Lesson`, `Field`, `Plane`, `Sphere`, `Matrix` e gli esportatori quando appropriato; leggere prima le loro firme reali.
3. Assegnare identificatori stabili, titoli, pagine delle slide e raccordi. Aggiornare il catalogo, il routing e il registro dei componenti in `app.tsx`. Quando si passa a tre o più capitoli conviene introdurre un registro indicizzato per ID, eliminando le selezioni binarie, dopo aver protetto con verifiche gli indirizzi esistenti.
4. Estendere il tipo `Route`, `parseRoute`, `scope`, `initialChapter`, il titolo del documento, la navigazione precedente/successiva e i collegamenti fra capitoli. Conservare gli hash storici del primo capitolo e quelli del secondo.
5. Aggiungere una copertina con un diagramma emblematico e una transizione motivata. Aggiornare solo il segnaposto corrispondente; i capitoli non disponibili restano «To be done».
6. Inserire le slide in `public/` e dichiarare i collegamenti. Non inventare numeri di pagina se manca la presentazione definitiva.
7. Estendere il rendering statico in `render-course.mjs`, le guide, l'esportazione autonoma in `export-offline.mjs` e l'elenco dei capitoli in `package-release.py`. Controllare anche gli alias delle guide del singolo capitolo. Nelle copie autonome gli altri capitoli si aprono online.
8. Aggiornare i conteggi nel testo del corso, nella descrizione dell'HTML, nei README e nelle verifiche strutturali. I conteggi devono derivare dal catalogo ovunque sia possibile.
9. Aggiungere prove numeriche sui casi scientificamente significativi e controllare a mano interazione, tastiera, finestre, scorrimento e aspetto sui dispositivi effettivi. Non considerare il rendering statico una verifica del trascinamento nel browser.
10. Rigenerare tutti i materiali dalla stessa revisione. Aggiornare questo documento e il rapporto delle verifiche; consegnare i pacchetti soltanto dopo averne verificato integrità e contenuto.

## Comandi e consegna

Prerequisiti: Node 24, pnpm 11.25.0; per PDF e ZIP anche Python 3.10 o successivo con le dipendenze in `requirements-guides.txt`. I font della guida sono inclusi con le rispettive licenze. Non servono CDN o servizi esterni per le dimostrazioni locali.

```sh
pnpm install --frozen-lockfile
pnpm run check
python3 -m venv .venv
# Attivare .venv secondo il sistema operativo.
python -m pip install -r requirements-guides.txt
pnpm run generate:all
```

`pnpm run check` verifica tipi, modelli, HTML generato e collegamenti. `pnpm run generate:all` rigenera guide HTML/PDF, ne verifica la struttura e produce gli ZIP in `release/`. Per una consegna completa eseguire entrambi: il secondo comando non sostituisce tutti i controlli del primo.

Per GitHub Pages usare il workflow incluso in `.github/workflows/deploy-pages.yml`, caricando **il contenuto** della cartella di progetto alla radice del repository e selezionando **GitHub Actions** nelle impostazioni Pages. La cartella pubblicata è `dist/`. Le guide PDF sono incluse: il workflow del sito non deve installare Python. Se cambia il contenuto didattico, rigenerare e includere le guide prima di pubblicare.

Se si aggiorna un sito già esistente, usare il suo progetto e il suo servizio di hosting, conservando indirizzo e visibilità. Per un progetto Sites seguire il flusso ufficiale di build, commit, push, salvataggio versione e pubblicazione; non includere negli ZIP identità riservate, token o credenziali.

Consegnare: ZIP GitHub; ZIP sorgenti; ZIP locale dell'intero corso; ZIP locali dei singoli capitoli; guida PDF; istruzioni aggiornate; rapporto con verifiche eseguite e limiti effettivi. Inserire `ISTRUZIONI_PER_NUOVI_MODULI.md` in ogni ZIP. Controllare che il corso locale si avvii da `index.html` dopo l'estrazione completa, conservando le risorse relative.

## Stato del collaudo da non perdere

La revisione Matrix conserva il modello numerico dei due capitoli. Le verifiche automatiche e la revisione delle figure/PDF sono riportate nel rapporto di rilascio. Il controllo interattivo completo in un browser richiede l'ambiente di anteprima e va dichiarato separatamente; se non è disponibile, documentare il limite e usare `docs/corso/COLLAUDO.md` per il controllo successivo. Non presentare controlli statici come prove di funzionamento di ogni gesto dell'utente.
