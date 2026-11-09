# Continuità — Quantum Lab 5.1

## Decisione architetturale corrente

Quantum Lab è una repository indipendente, collegata dalla sezione Didattica di Topological Manifolds. La decisione sostituisce il precedente innesto in `public/lab/quantum/`. Non reintrodurre installatori o wrapper di build del sito principale.

La base è `QuantumLab_5_0_RC1_Sorgenti.zip`, conservata come archivio esterno originale. Sette moduli, 87 attività: tutte le 81 storiche e sei native. Il contenuto didattico e i modelli non sono stati rielaborati dalla modifica di infrastruttura. Gli 82 sorgenti storici, `src/models.js`, runtime e avvisi terzi sono identici al riferimento; il catalogo cambia soltanto numero di versione.

## Scelte editoriali conservate

Autorialità del corso: Marzio De Corato e Danilo Bruschi. Le slide nuove sono già nel sito e non sono oggetto di rifacimento. Nessun PDF, font o guida generata viene duplicato nella distribuzione web.

Definizioni prima dei simboli; separazione fra ampiezze, probabilità e frequenze; modelli e limiti espliciti; niente quiz obbligatori o gamification. Non rappresentare un registro entangled con sfere pure indipendenti. Non presentare BB84 come generatore di chiavi operative sicure. Il percorso RSA nativo è un ponte classico, non un sostituto nascosto della simulazione di Shor.

## Tema e accessibilità

Tema scuro verde minerale e modalità chiara. Margini Matrix con simboli quantistici, sfera di Bloch e onda schematiche. Tutta l’atmosfera è decorativa, separata dal calcolo e disattivabile. Rispetto del movimento ridotto; nessun movimento sui margini mobili, perché su telefono i margini sono nascosti. La preferenza di sistema prevale sull’animazione.

Non dichiarare una conformità WCAG certificata o un apprendimento autonomo dimostrato: servono verifiche dedicate con tecnologie assistive e studenti. La versione è italiana; non sostituire la traduzione EN con sole etichette tradotte.

## Licenza

Su richiesta dell’autore è applicata CC BY-SA 4.0 ai materiali originali distribuiti, nei limiti dei diritti concedibili. La variante è dichiarata esplicitamente e consente usi commerciali. Le componenti terze mantengono gli avvisi originari. I documenti della 5.0 sul precedente stato delle licenze sono storici e non prevalgono su `LICENSE`.

## Stato reale della verifica

Test numerici e strutturali, sette suite storiche, browser sul monofile con hash CSP e revisione visiva eseguiti. La navigazione HTTP nel browser della sessione è bloccata da policy: non rimuovere o aggirare la policy; i test HTTP vengono eseguiti dal workflow nel runner GitHub. Nessuna repository remota creata, nessun deploy, nessun controllo live del dominio principale attestato.

Prima della pubblicazione controllare `config/site.json`. Dopo la pubblicazione aprire URL Pages, una vecchia rotta, un’attività nativa, Simon, modalità mobile, pannello effetti e ritorno alla Didattica. Aggiornare la documentazione corrente, non documenti congelati nello storico.
