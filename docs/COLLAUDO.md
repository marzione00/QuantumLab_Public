# Collaudo effettivo — Quantum Lab 5.1

**Data: 9 novembre 2026.** Sono separati test realmente eseguiti, controlli statici e verifiche remote non ancora effettuate.

## Modelli, catalogo e distribuzione

| Verifica eseguita | Risultato |
|---|---|
| Modelli delle sei attività native | 34.890 controlli, PASS |
| Catalogo, copertura e alias | 382 controlli, PASS |
| URL, configurazione, input non ammessi | 28 controlli, PASS |
| Distribuzione, asset, hash, licenze, base alternativa e build riproducibile | 63 controlli, PASS |
| Sorgenti scientifici e avvisi preservati | 87 file identici al riferimento, inclusi 82 sorgenti storici |
| Catalogo rispetto alla 5.0 RC1 | Cambia soltanto la versione |

La build è stata rigenerata anche con URL `https://example.org/a-different-repository/`: canonical e metadati seguono il prefisso, gli asset rimangono relativi. È un test di build, non una visita a quel dominio. Una seconda build con gli stessi input produce lo stesso manifesto degli asset.

## Regressione scientifica storica rieseguita

Sette suite del progetto originario sono state eseguite nuovamente con esito PASS: `verify-models`, `verify-expanded`, `verify-quantum`, `verify-revision`, `verify-mathematics`, `verify-new`, `verify-experiments`. Le asserzioni scientifiche originali sono conservate; per tre suite è adattato soltanto il preambolo di importazione/compilazione. Il report contiene gli hash dei test originari.

Le suite riportano rispettivamente 74 controlli, 282 casi espansi, 9.575 controlli quantistici, 140 controlli di revisione, 13.607 controlli matematici, 25.816 confronti sugli algoritmi e 41.012 sugli esperimenti. Il campionamento aggiuntivo di un milione di eventi non è contato come un milione di test indipendenti. Non è stata rieseguita l’intera vecchia pipeline di PDF, typecheck e DOM storico.

## Browser: esecuzione reale, perimetro esplicito

Chromium **144.0.7559.96**: **311 verifiche superate** sul monofile generato dalla medesima build, con CSP attiva e hash esatti degli script. Tutte le **87 attività** sono state aperte. Larghezze esaminate: 1920, 1600, 1440, 1200, 1199, 1024, 720, 390 e 320 px. I controlli di overflow su attività rappresentative sono passati.

Sono stati verificati ricerca, moduli, alias storici, calcolo e campionamento di Simon, conservazione dello stato al cambio di modalità, misure di fase, esportazione/importazione, rifiuto di parametri non validi, reset, tema chiaro, menu mobile e licenza. Per la cornice: movimento desktop, arresto in modalità statica, disattivazione, rispetto di reduced-motion, assenza di animazione sotto 1200 px, apertura/chiusura del dialogo con Esc e restituzione del focus. Le schermate desktop e mobile sono state ispezionate visivamente.

**Limite ambientale:** la navigazione Chromium a un server HTTP locale è bloccata con `ERR_BLOCKED_BY_ADMINISTRATOR`. Nessuna policy del browser è stata modificata. Per le verifiche effettive è stato usato `page.set_content` sul monofile, che conserva la CSP a hash della variante consegnata. Non sono stati rimossi vincoli CSP per far passare i test. In questa modalità il runtime storico è incorporato; il caricamento differito HTTP, la persistenza dopo un vero reload e la pubblicazione GitHub non sono dichiarati collaudati.

Nel campione eseguito: **nessun errore JavaScript non gestito, nessun errore console/CSP e nessuna richiesta automatica di rete**. I sei hash degli script incorporati sono stati ricalcolati e confrontati con la CSP.

`tests/browser.py` usa HTTP reale per impostazione predefinita, sia alla radice sia sotto un prefisso di repository: è la modalità predisposta nel workflow GitHub. La modalità `QL_BROWSER_MODE=inline` serve soltanto per ambienti che non consentono la navigazione locale. I due report non devono essere confusi.

## Workflow

Il file YAML è stato analizzato e controllato: separazione verifica/deploy, permessi limitati, solo `dist/` pubblicata, niente deploy di pull request, dipendenza del deploy dal job di verifica. **Correzione CI 9 novembre 2026:** il primo run su `ubuntu-latest` è fallito nello step di installazione Chromium con Playwright 1.57.0 su Ubuntu 26.04 (segnalazione tramite screenshot dell'utente). Il workflow è stato aggiornato fissando `ubuntu-24.04` in entrambi i job e Python 3.12 mediante `setup-python@v6`. La compatibilità di questa scelta è supportata dalla documentazione GitHub e Playwright. Il nuovo workflow è stato verificato staticamente e la build/test in ambiente locale, ma non è stato rieseguito su GitHub.

La **versione corretta** del workflow nel tuo account **non è stata ancora eseguita** e non è stato effettuato alcun deploy.

## Riproduzione

```sh
npm test
npm run test:legacy
python3 -m pip install playwright==1.57.0
python3 -m playwright install chromium
npm run test:browser
```

La regressione storica richiede TypeScript, disponibile nella sessione di test; non è richiesto per la build ordinaria. In un ambiente pulito è possibile installarlo come strumento di verifica, ad esempio `npm install --no-save --ignore-scripts --package-lock=false typescript@5.9.3`. Su Linux, Playwright può richiedere le dipendenze di sistema del browser; il workflow usa `playwright install --with-deps chromium`.

Per la variante offline, generare il monofile con `npm run preview` e verificare la corrispondenza CSP con `python3 tests/standalone.py QuantumLab_anteprima.html`. Il pacchetto finale viene anche estratto in una cartella pulita e sottoposto nuovamente a `npm test`.

## Non attestato

Nessuna certificazione WCAG, nessuna prova sperimentale di apprendimento, nessun penetration test, nessuna verifica live degli URL del sito principale e nessuna pubblicazione nel repository dell’autore. Il settimo modulo rimane esplicitamente didattico: i dati BB84 non sono chiavi operative sicure.
