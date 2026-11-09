# Revisione 1.1 — interventi e verifiche

La revisione riguarda tutti i dieci laboratori. Il pubblico di riferimento è quello della lezione: studenti di informatica senza una preparazione fisica precedente. Le operazioni I, X, Y, Z, R e F sono descritte mediante effetti e geometria; le realizzazioni ottiche mantengono il proprio significato nei laboratori sulla polarizzazione.

| Laboratorio | Intervento |
| --- | --- |
| 01 | Scala delle posizioni fissa durante il moto, ingrandimento esplicito, campione iniziale stabile nel tempo e nuova estrazione separata. |
| 02 | Distanza d’interazione fissata a 3,8 unità per tutte le popolazioni, spiegazione della densità, distinzione dei due criteri di ritorno e riduzione delle ripetizioni. |
| 03 | Definizione anticipata dell’intensità, fase con segno, indicatore della curva normalizzato a un ciclo, spiegazione geometrica senza duplicare l’esempio del quadrato. |
| 04 | Avvio con una fenditura; 6.400 campioni integrati in 800 intervalli da 0,055 mm; dettaglio centrale, confronti e CSV con tutti i parametri e N. |
| 05 | Fase aggiunta distinta dalla fase relativa effettiva, poli privi di fase relativa, selezione dei preset basata sull’intero stato, animazione del campo e distinzione degli angoli. |
| 06 | Trascinamento diretto corretto sui due emisferi, vista ruotabile indipendente dallo stato, casi guidati R–F–R, ±90°, 180° e bypass; circuito adattabile, commenti coerenti con i blocchi attivi, descrizione dell’operazione in un solo punto. |
| 07 | Conclusione calcolata in funzione di fase e misure, caso a 90° esplicitamente inconcludente nel confronto diagonale, anticorrelazione conservata, circuito della costruzione e terminologia R. |
| 08 | Comando di accoppiamento distinto dall’indicatore di coerenza, confronto simultaneo delle due misure, spiegazione della descrizione parziale, confronti conservati al cambio di misura. |
| 09 | Tre azioni effettive separate dai preset, sorgente generica trascinabile, parallelo degli stati compatibili, tutte le operazioni elementari, fase firmata e JSON effettivo; previsione descritta come distribuzione di probabilità. |
| 10 | Schema completo, apparati presentati attraverso i risultati, descrizione delle cause a richiesta, comandi riferiti alle trasformazioni effettive, scansioni da 26.000 prove per apparato, letture dei registri senza perdere i confronti. |

## Interventi comuni

- Raccordi che motivano la descrizione richiesta dalla simulazione successiva.
- Corrispondenza visibile fra 0/1, H/V e diagonali; camera di Bloch e convenzione della profondità uniformate.
- Contrasto della dicitura Lab 01 corretto; maggiore leggibilità dei valori del circuito.
- Regolazioni prima dell’apparato in ordine di lettura; sequenza verticale del circuito alle larghezze insufficienti.
- Figure ampliabili in una finestra dedicata; disposizione verticale dei confronti sui piccoli schermi.
- Confronti che conservano le proprie etichette, i parametri e il numero di eventi.
- Quaderno degli studenti, guida HTML, indicazioni per il docente e generatori inclusi.

## Verifica

I controlli numerici comprendono 74 casi originari, 282 casi estesi, 9 controlli del gas reversibile, 9.575 verifiche del qubit e 140 verifiche mirate alla revisione. Il campionamento dello schermo è stato verificato con un milione di eventi. Nel caso delle frange a distanza 0,50 mm, il contrasto del profilo centrale aggregato risulta circa 0,980.

Il controllo statico compila le dieci viste e verifica i percorsi relativi dei PDF e delle guide. Il quaderno PDF è stato controllato mediante rendering delle dodici pagine, lettura del testo e verifica di indice e collegamenti.

Il collaudo interattivo in un browser reale non è stato completato nell’ambiente disponibile. Il rapporto non certifica quindi il trascinamento con dispositivi diversi, l’impaginazione effettiva a ogni larghezza, i download o le finestre modali in tutti i browser. La checklist descrive le prove da eseguire sul dispositivo usato per la lezione.

La configurazione GitHub Pages è pronta; l’esecuzione sul repository dell’utente avverrà dopo il caricamento e l’attivazione di Pages.
