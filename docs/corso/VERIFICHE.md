# Verifica della versione Matrix 3.0

Sono stati controllati il nucleo matematico, le configurazioni iniziali delle 28 dimostrazioni, i riferimenti alle slide, le guide, i percorsi relativi e l'assenza di risorse esterne necessarie all'esecuzione locale.

Il nucleo matematico supera 13.607 verifiche numeriche, che comprendono matrici hermitiane complesse, autovettori, proiettori, ricostruzione spettrale, regola di Born, aggiornamento dello stato, trasformazioni unitarie, prodotti tensoriali, nucleo delle matrici e distribuzioni binomiali fino a 10.000 prove per raccolta. L'esempio conclusivo è verificato sui risultati esatti della lezione. La suite del primo capitolo viene eseguita insieme a quella del secondo. Sono state aggiunte 1.985 verifiche mirate per matrici hermitiane di scala molto piccola, posizione dei conteggi sull’asse delle frequenze, eventi vuoti, riduzione per righe, figure trasformate, assi di rotazione e assenza di quiz. Dieci configurazioni alternative sono state renderizzate sul server: questi controlli verificano la risposta dei componenti ai dati, senza simulare l’uso di un browser.

Il controllo strutturale rende 28 dimostrazioni e tre copertine. Verifica i dieci indirizzi preesistenti, i nuovi indirizzi, i collegamenti locali alle guide e alle presentazioni, i cinque punti d'ingresso HTML e la sintassi del codice generato. La compilazione TypeScript controlla anche i collegamenti tra i componenti.

Le guide PDF sono state renderizzate e le pagine campione ispezionate, con particolare attenzione a matrici, figure, formule e collegamenti. Le figure statiche mostrano la configurazione iniziale; gli esperimenti casuali iniziano senza raccolte.

Il collaudo interattivo nel browser non è stato completato nell'ambiente di realizzazione. I controlli numerici e strutturali non attestano da soli il comportamento del puntatore, delle finestre di dialogo o dell'impaginazione su ogni dispositivo. La procedura ripetibile per tali verifiche è in COLLAUDO.md; questa limitazione è mantenuta esplicita nei rapporti automatici.

I risultati macchina sono in qa/course/mathematics-results.json, qa/course/structure-results.json, qa/course/corrections-results.json, qa/course/pdf-results.json, qa/course/pdf-content-results.json e qa/course/pdf-layout-results.json. Non sono presenti quiz o procedure di valutazione degli studenti.

Il generatore PDF verifica l’assenza di glifi mancanti e la presenza delle figure. Indici ed esponenti usano marcatura tipografica; le matrici mantengono righe e colonne. Il rendering SVG avviene in processi separati, con gestione degli istogrammi numerosi. Le spiegazioni delle schede 1.06–1.10 sono incluse nella guida.

Le versioni delle azioni utilizzate nel workflow sono state confrontate con le pagine ufficiali: [setup-node](https://github.com/actions/setup-node/releases), [checkout](https://github.com/actions/checkout/releases), [pnpm/action-setup](https://github.com/pnpm/action-setup/releases). La pubblicazione su un repository GitHub dell’utente richiede l’esecuzione del workflow in quel repository; qui è stato verificato il sito statico generato.

## Tema Matrix

La palette per lo schermo e quella per la stampa provengono dallo stesso file. Sono verificati i token CSS/SVG, il contrasto del testo sui pannelli e la conversione dei colori per il Canvas. Il tema è presente nei cinque ingressi HTML e nelle guide. La decorazione delle copertine non compare nelle dimostrazioni. Le figure SVG sono state renderizzate separatamente e ispezionate; questo controllo non equivale a una prova dell’impaginazione nel browser. Il rapporto è in `qa/course/theme-results.json`.

Ogni ZIP contiene `ISTRUZIONI_PER_NUOVI_MODULI.md` e `AGENTS.md`, con la struttura del progetto, le convenzioni da conservare e i comandi per rigenerare i materiali.
