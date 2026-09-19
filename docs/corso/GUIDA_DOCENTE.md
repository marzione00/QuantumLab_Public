# Quantum e post-quantum computing · Indicazioni per il docente

Il laboratorio è organizzato in due capitoli, attraverso i quali il problema della simulazione conduce alla descrizione geometrica e al calcolo. Le dimostrazioni non prevedono quiz, punteggi o consegne da superare. I capitoli successivi sono indicati come «To be done».

## Capitolo 1 · Dal determinismo al calcolo quantistico

Le dieci dimostrazioni conservano il percorso già sviluppato: moto, inversione di Loschmidt, onde, fenditure, polarizzazione, operazioni su un qubit, sistemi composti, ambiente, informazione e diagnosi. Il livello resta quello della prima lezione. I comandi sono descritti attraverso ciò che modificano nella preparazione, nell'apparato e nei risultati.

Nel gas conviene presentare prima l'espansione e poi confrontare l'inversione accurata con quella ottenuta da informazioni imprecise. Entrambi i ritorni sono calcolati. La versione accurata recupera le posizioni sulla griglia numerica del modello; l'imprecisione può essere amplificata dagli incontri. I tempi indicati sono minimi: il tempo effettivo dipende dalla macchina.

Nel laboratorio 1.06 si può seguire lo stato lungo l'intero circuito e regolare la fase con valori positivi o negativi. Le operazioni X, Y, Z, R e F sono spiegate nel linguaggio della prima lezione. Nel laboratorio 1.07 sono presenti correlazione e anticorrelazione; nel successivo, l'interazione con l'ambiente riduce la coerenza della coppia. Il salvataggio del qubit e la diagnosi riguardano due problemi distinti: quali informazioni conservare e quali interventi permettono di distinguere descrizioni compatibili con una prima osservazione.

## Capitolo 2 · Geometria del calcolo quantistico

Il capitolo comprende 18 dimostrazioni, articolate in tre parti. Nella prima si introducono numeri complessi, basi, prodotto interno, matrici, aggiunto, spettro, composizione e prodotto tensoriale. Nella seconda si sviluppano eventi, momenti, frequenze e condizionamento. Nella terza questi strumenti vengono applicati a stati, operazioni unitarie, misura, incompatibilità e sistemi composti.

Ogni dimostrazione contiene una spiegazione teorica, le regolazioni, la figura, la lettura dei risultati e lo svolgimento. I passaggi sono inizialmente tutti visibili; i pulsanti permettono di concentrarsi su un passaggio oppure di scorrerli in sequenza. Le figure ingrandibili e i campi numerici accompagnano il trascinamento, così che un valore preciso possa essere impostato anche senza usare il puntatore.

### Percorso suggerito per la proiezione

1. Nel piano complesso, confrontare somma e prodotto; impostare poi il numero nullo, il cui argomento non è definito.
2. Nel cambio di base, trascinare un vettore della base conservando il vettore da descrivere; avvicinare infine i due assi fino alla dipendenza lineare.
3. Nelle proiezioni, seguire il vettore, la componente parallela e il residuo; passare al caso complesso, nel quale compare il coniugio.
4. Nelle matrici, osservare prima le immagini degli assi, poi il destino della griglia e infine nucleo e immagine. La riduzione per righe esplicita il sistema omogeneo.
5. Nell'aggiunto, confrontare una trasformazione che conserva la norma con una che non la conserva; una matrice può essere sia hermitiana sia unitaria.
6. Nello spettro, allineare il vettore con un'autodirezione; ricostruire quindi un vettore generico attraverso i proiettori.
7. Nella composizione, distinguere il cambio di coordinate dall'ordine fisico delle operazioni. Le matrici AB e BA agiscono a partire da destra.
8. Nel tensore, selezionare le quattro caselle per seguire ciascun prodotto di componenti e l'azione di un operatore locale.
9. Negli eventi, modificare i pesi degli esiti e la loro appartenenza ad A e B; le tessere selezionabili hanno uguale dimensione, mentre la striscia delle probabilità rappresenta i pesi.
10. Nei momenti, confrontare distribuzioni con la stessa media e diversa dispersione. La media può non coincidere con alcun valore possibile.
11. Nelle frequenze, distinguere il numero N di prove per raccolta dal numero di raccolte simulate. L'istogramma dei conteggi viene confrontato con la distribuzione binomiale.
12. Nel condizionamento, selezionare una riga o una colonna e seguire la rinormalizzazione. Un evento di probabilità nulla non definisce una probabilità condizionata.
13. Negli stati, modificare le componenti, normalizzare e confrontare fase globale e relativa. I piani complessi e la sfera rappresentano spazi differenti.
14. Nelle unitarie, seguire il circuito completo e il percorso sulla sfera, mantenendo visibili i prodotti matriciali. Gli angoli sono orientati e possono essere negativi.
15. Nella misura, ruotare sia lo stato sia l'asse della base; selezionare un esito e leggere il nuovo stato soltanto quando quell'esito ha probabilità positiva.
16. Nell'incompatibilità, distinguere le dispersioni su copie della preparazione dalle sequenze di misura sullo stesso sistema.
17. Nei sistemi composti, confrontare stati prodotto, coppie concordi e discordi. Le quattro ampiezze e la tabella congiunta conservano l'informazione che manca nelle sole marginali.
18. Nell'esempio conclusivo, ricostruire tutti i passaggi per A = [[1, 1−i], [1+i, 0]] e ψ = (2, i)/√5: autovalori 2 e −1, probabilità 13/15 e 2/15, media 8/5, varianza 26/25.

## Convenzioni e limiti

Il prodotto interno è coniugato nel primo argomento. La base composta è ordinata come 00, 01, 10, 11. Nella sfera di Bloch il polo nord rappresenta 0/H e quello sud 1/V; la sfera non coincide con lo spazio fisico dell'apparato. Le coordinate della sfera sono riferite a stati normalizzati, mentre i piani complessi mostrano le componenti effettive. Le figure dei vettori possono adattare la scala, che è indicata dagli assi. I confronti prima/dopo usano la stessa scala; nei quattro piani del tensore compaiono insieme il valore iniziale blu e il risultato viola.

L'angolo fra due vettori di Bloch è il doppio del parametro usato nelle ampiezze di una base reale. Le operazioni che differiscono per un fattore comune di fase producono lo stesso punto sulla sfera per ogni stato iniziale. L'esempio conclusivo tratta anche la degenerazione: quando A è proporzionale all'identità, il proiettore è l'identità e lo stato non viene selezionato lungo una direzione arbitraria.

## Materiali

La guida HTML conserva le configurazioni iniziali con i relativi svolgimenti; il PDF offre una lettura stampabile. Le guide separate accompagnano i due pacchetti autonomi. «Esporta la dimostrazione» produce una pagina con le figure, la teoria, l’interpretazione, tutti i passaggi correnti e i parametri. Le raccolte casuali e le modifiche restano nella sessione: occorre esportare i risultati da conservare prima di cambiare dimostrazione.

I rimandi alle slide usano il numero di pagina PDF. Nei lettori che non rispettano il frammento #page, la pagina è comunque riportata nel laboratorio. I collegamenti nelle slide possono aprire il sito; per l'uso senza connessione si utilizza l'indice dell'HTML.

Nella vista ampia, una copia della figura resta accanto allo svolgimento e usa gli stessi parametri. Il riferimento si può chiudere per dedicare più spazio ai passaggi. L’esperimento 1.10 espone dall’inizio i due modelli e permette di seguirne le risposte ai comandi, senza domande valutative.

## Edizione Matrix e continuità

Il corso usa una palette scura sullo schermo e una variante chiara nella stampa. I colori distinguono le grandezze indicate nelle legende; i pulsanti selezionati e il focus rimangono riconoscibili. Il testo e le dimostrazioni conservano il percorso delle due lezioni. Per aggiungere un modulo a partire dai sorgenti leggere `ISTRUZIONI_PER_NUOVI_MODULI.md`, incluso in tutti i pacchetti.
