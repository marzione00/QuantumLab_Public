# Continuità — Quantum Lab 5.0 RC1

## Riferimenti e decisioni conservate

Topological Manifolds rimane il marchio del sito e la v3.3 la base del sito principale; Quantum Lab è il laboratorio del corso. Autorialità del corso: Marzio De Corato e Danilo Bruschi. Le sette slide attuali sono fonti, non oggetto di rifacimento. Non duplicare PDF, guide o font nel laboratorio. Non modificare fotografie, biografia, epigrafi, musica, altri corsi o gate di pubblicazione del CV per installare il laboratorio.

Impostazione didattica senza quiz obbligatori, punteggi o gamification. Definizioni prima dei simboli, figure esplicitamente classificate, distinzione fra ampiezze/probabilità/frequenze, convenzioni dei registri dichiarate. Non presentare un registro entangled attraverso sfere di qubit puri. Non presentare i dati intermedi di BB84 come chiave sicura.

## Stato effettivo

Sette moduli e 87 attività. Le 81 storiche mantengono modelli e svolgimenti; sono ricatalogate e hanno una cornice nuova. Sei percorsi sono nuovi: fase/interferenza, Grover guidato, recupero del messaggio da un periodo RSA noto/verificato (ponte classico, non simulazione di Shor), BB84, codifica superdensa, codice a ripetizione per un errore X.

I testi sono italiani. Le schede EN del sito dichiarano il contenuto IT; non è stata prodotta una falsa traduzione tramite cambio del solo titolo. La riscrittura editoriale integrale delle 81 lezioni e la traduzione EN rimangono lavori distinti.

La distribuzione non richiede servizi cloud o nuove librerie per la build ordinaria. Il motore React storico viene caricato solo quando serve; non è stato scomposto in 81 bundle. Il runtime contiene ancora codice di compatibilità storico non mostrato: eliminarlo attraverso una ricompilazione controllata è possibile ma non è stato fatto a rischio di alterare i modelli verificati.

## Integrazione e pubblicazione

È consegnato un innesto automatico, reversibile e testato su fixture. Il pacchetto completo del sito non era disponibile qui: NON dichiarare che il nuovo laboratorio sia già installato sul repository dell'autore o verificato all'interno dell'intera v3.3. Nessun deploy è stato effettuato.

Gli hash delle slide sono riferimenti provenienti dalla ricognizione precedente. L'installatore controlla i file reali sul sito destinatario, rifiuta PDF mancanti e disattiva pagine presunte in presenza di modifiche. Il vecchio URL `QuantumLab_Public` richiede una migrazione esplicita distinta dai semplici alias interni.

## Passi successivi già individuati

Applicare l'innesto alla copia completa del sito e rieseguire la sua pipeline; verificare navigazione/canonical/CSP sulla build effettiva; revisione linguistica e didattica con utenti, tecnologie assistive e casi avanzati; eventuale ricompilazione del registry-only runtime con toolchain completa. I test automatici attuali non sostituiscono queste verifiche.
