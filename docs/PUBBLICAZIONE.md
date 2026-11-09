# Pubblicazione GitHub Pages e collegamento a Topological Manifolds

## Repository indipendente

Il contenuto dello ZIP è la radice del progetto. Creare una repository distinta da quella di Topological Manifolds. Il nome può essere scelto liberamente. Copiare anche `.github/workflows/pages.yml`; non basta caricare un file ZIP e non serve installare il precedente innesto.

Una possibile sequenza da terminale, dopo aver creato la repository vuota, è:

```sh
git init -b main
git add .
git commit -m "Quantum Lab 5.1: laboratorio autonomo"
git remote add origin https://github.com/UTENTE/NOME-REPOSITORY.git
git push -u origin main
```

Sostituire utente e nome repository. Questi comandi non sono stati eseguiti sul tuo account durante la consegna. Git può richiedere identità del commit e autenticazione nel tuo ambiente.

In GitHub: **Settings → Pages → Source → GitHub Actions**. Il workflow `Verify and publish Quantum Lab` valida e costruisce l’applicazione. Il job di deploy dipende dalla riuscita del job di verifica; le pull request non pubblicano. Non inserire token o password nei sorgenti. Gli aggiornamenti successivi del laboratorio interessano questa sola repository.

**Risoluzione CI (9 novembre 2026):** il workflow usa `ubuntu-24.04` sia nel job di verifica sia nel job di pubblicazione, con `actions/setup-python@v6` e Python 3.12. È una scelta intenzionale per Playwright `1.57.0`: `ubuntu-latest` è in migrazione a Ubuntu 26.04, su cui quella versione di Playwright non installa Chromium. Quando i sorgenti sono già su GitHub, aggiornare soltanto `.github/workflows/pages.yml` e fare un nuovo commit: un semplice rerun del vecchio commit può riprodurre l'errore. Successivamente verificare che il job `verify-build` completi anche lo step Chromium e che `deploy` parta soltanto dopo l'esito positivo. Non è stata eseguita alcuna pubblicazione remota durante questa correzione.

Il workflow usa le azioni ufficiali documentate consultate il 9 novembre 2026: checkout/setup-node v7, configure-pages v5, upload-pages-artifact v4, deploy-pages v4. Dependabot è configurato per proporre aggiornamenti delle azioni, non per applicarli automaticamente. I riferimenti per major tag sono una scelta operativa; per un ambiente soggetto a policy restrittive fissarli a commit verificati secondo la policy dell’organizzazione.

## Un semplice link nel sito principale

Dopo la prima pubblicazione, copiare l’URL realmente restituito da Pages e inserirlo nella pagina Didattica o nella scheda del corso:

```html
<a class="button" href="https://UTENTE.github.io/NOME-REPOSITORY/#indice">Apri Quantum Lab ↗</a>
```

Per i singoli moduli usare `#modulo-1` ... `#modulo-7`. La utility `scripts/site-link.mjs` genera il collegamento senza modificare file del sito. La nuova repository non tocca il gate del CV, il renderer del sito, fotografie, epigrafi, musica o altri corsi.

Se in precedenza è stato realmente installato l’innesto 5.0 nel sito, rimuoverlo con il relativo installatore e il suo backup, prima di sostituire la scheda con il link esterno. La 5.1 non cancella cartelle del sito per supposizione. Nessun rinvio sul vecchio repository QuantumLab_Public viene pubblicato automaticamente.

## Configurazione dei link di ritorno

Il riferimento iniziale è `https://marzione00.github.io/Personal_web_page/`, con `didattica.html` e `corso-quantum-post-quantum-computing-2026-2027.html`. Sono percorsi ricavati dalla documentazione precedente, non verificati sul deployment remoto in questa sessione. Modificarli in `config/site.json` se il dominio o il percorso reali differiscono.

La scelta prudente `slideLinks: "course"` evita di presentare vecchi riferimenti di pagina come attuali. `slideLinks: "direct"` costruisce invece i link ai PDF già esistenti dai percorsi canonici conservati nel catalogo, senza copiarli. La verifica remota facoltativa è `npm run check:links`; dipende da connettività e disponibilità dei servizi.

## Fonti operative ufficiali

- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://github.com/actions/checkout
- https://github.com/actions/setup-node
- https://github.com/actions/deploy-pages

La configurazione YAML è stata analizzata e i comandi di build sono stati eseguiti localmente. La pubblicazione nel tuo account e il primo run HTTP del workflow restano verifiche remote, non risultati già attestati.
