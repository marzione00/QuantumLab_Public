# Quantum e post-quantum computing · Laboratorio interattivo

**Edizione Matrix 3.0.** Il tema definitivo comprende tutte le 28 dimostrazioni. Le guide PDF adottano la palette chiara per la stampa. Per riprendere il progetto e aggiungere moduli leggere [ISTRUZIONI_PER_NUOVI_MODULI.md](ISTRUZIONI_PER_NUOVI_MODULI.md).

Due capitoli, 28 dimostrazioni commentate e capitoli futuri indicati come **To be done**. Il primo capitolo sviluppa il problema della simulazione; il secondo accompagna la teoria matematica con costruzioni geometriche e calcoli svolti. Non sono presenti quiz o punteggi.

## Utilizzo immediato

Nel pacchetto GitHub aprire `dist/index.html`; nel pacchetto locale aprire `index.html` dopo avere estratto l'intero archivio. Non occorre un server. JavaScript, React e CSS sono incorporati nell'HTML. I PDF e le guide restano accanto al file HTML. Il corso completo e i due capitoli sono disponibili anche come pacchetti locali separati.

La versione online è https://quantum-lab-dal-moto-al-qubit.saren605078.chatgpt.site . Gli indirizzi storici, per esempio `#calcolo`, aprono ancora la dimostrazione corrispondente del primo capitolo. I nuovi indirizzi usano `#capitolo-1/calcolo` e `#capitolo-2/complessi`.

## Pubblicazione su GitHub Pages

1. Creare un repository e caricare **il contenuto della cartella principale**, comprese `.github`, `src`, `scripts`, `public`, `assets`, `qa`, `package.json` e `pnpm-lock.yaml`.
2. Nelle impostazioni del repository, aprire **Pages** e scegliere **GitHub Actions** come origine.
3. Effettuare un commit sul ramo `main`. Il workflow installa le dipendenze fissate, esegue i controlli, genera `dist` e pubblica il corso.

Non sono richiesti segreti applicativi. La configurazione usa permessi di scrittura soltanto nel lavoro di pubblicazione Pages. I percorsi relativi funzionano anche in un repository pubblicato sotto un prefisso.

## Generare il laboratorio

Requisiti: Node.js 24, pnpm 11.25.0. Le versioni sono dichiarate nel progetto.

```sh
pnpm install --frozen-lockfile
pnpm run check
```

Il comando controlla i tipi, i modelli dei due capitoli, i collegamenti e gli HTML prodotti. `pnpm run build` rigenera il sito locale e le guide HTML; copia i PDF già inclusi nel progetto.

Per rigenerare anche le guide PDF e gli archivi occorrono Python 3.10 o successivo, ReportLab e PyMuPDF. I font necessari sono inclusi con le relative licenze.

```sh
python3 -m venv .venv
. .venv/bin/activate
python3 -m pip install -r requirements-guides.txt
pnpm run generate:all
```

Su Windows l'attivazione dell'ambiente Python si effettua con `.venv\Scripts\activate`. Il comando genera le guide, costruisce gli HTML e scrive gli ZIP in `release/`. Le due presentazioni PDF sono materiali di ingresso inclusi; il generatore del laboratorio non ricompila le slide LaTeX.

## Struttura

| Percorso | Contenuto |
| --- | --- |
| `src/course/app.tsx` | Indice, copertine, navigazione, collegamenti tra capitoli |
| `src/course/catalogue.ts` | Catalogo del capitolo 2, parti, riferimenti e capitoli futuri |
| `src/course/chapter-one.tsx` | Catalogo e integrazione dei dieci laboratori precedenti |
| `src/course/shared.tsx` | Campi, figure, calcoli, esportazione, ingrandimento |
| `src/course/course.css` | Struttura e impaginazione comuni |
| `src/course/matrix.css`, `matrix-palette.json` | Tema definitivo e palette per schermo e stampa |
| `src/course/demos/` | Diciotto dimostrazioni del secondo capitolo |
| `src/course/math/core.ts` | Algebra complessa, operatori, misura e probabilità |
| `src/components/`, `src/lib/` | Laboratori e modelli del primo capitolo |
| `public/` | Presentazioni, guide e materiali statici |
| `scripts/` | Generatori HTML, PDF e pacchetti |
| `qa/` | Verifiche numeriche e strutturali ripetibili |
| `docs/corso/` | Guida docente, verifica e collaudo |

## Aggiungere un capitolo

Il catalogo separa titoli, descrizioni, riferimenti e dimostrazioni. Per un nuovo capitolo si aggiungono catalogo e componenti, mantenendo il contratto `Lesson` per teoria, controlli, geometria, passaggi e interpretazione. Si estende quindi il registro delle rotte in `app.tsx`, il generatore delle guide e quello dei pacchetti. I tipi delle rotte sono deliberatamente espliciti: per un terzo capitolo vanno aggiornati anche `Route`, `initialChapter` e `scope`, oltre alle verifiche. La voce futura non apre una pagina incompleta.

Nel secondo capitolo ogni dimostrazione dichiara lo spazio rappresentato, distingue i dati di ingresso dalle coordinate della vista e tratta le configurazioni degeneri. I comandi descrivono la quantità che modificano. Ogni passaggio contiene formula e spiegazione; il risultato numerico deriva dagli stessi dati usati dalla figura.

## Materiali per la lezione

`public/Guida_corso.pdf` raccoglie le configurazioni iniziali e gli svolgimenti. Sono incluse le guide separate dei capitoli, la guida HTML, le presentazioni e `docs/corso/GUIDA_DOCENTE.md`. L'esportazione di una dimostrazione salva le figure statiche, la teoria, l’interpretazione, tutti i calcoli correnti e i parametri. Le raccolte e le configurazioni non vengono conservate automaticamente dopo l'uscita.

## Verifiche e limiti

Le verifiche numeriche includono casi casuali, casi degeneri e risultati esatti della lezione. Il nucleo matematico supera 13.607 controlli; la revisione aggiunge 1.985 verifiche mirate, comprese configurazioni renderizzate con parametri differenti. Il rendering statico verifica 28 dimostrazioni e tre copertine; non sostituisce il collaudo interattivo del browser, che non è stato completato nell'ambiente di realizzazione. La procedura è descritta in `docs/corso/COLLAUDO.md` e i risultati in `docs/corso/VERIFICHE.md`.

Le ipotesi del primo capitolo sono documentate anche in `docs/MODELLI.md`. I commenti e le condizioni presenti nelle dimostrazioni specificano il significato didattico dei modelli.

Autori dei materiali: Marzio De Corato e Danilo Bruschi, Università degli Studi di Milano. Le licenze dei componenti e dei font sono incluse nei rispettivi file; questa distribuzione non introduce una nuova licenza per i materiali didattici degli autori.
