# Quantum Lab 5.1 — repository autonoma

**9 novembre 2026 · 7 moduli · 87 attività · Creative Commons BY-SA 4.0**

Questa è la radice di una nuova repository: `package.json`, `src/`, `config/` e `.github/` devono restare allo stesso livello. Non caricare lo ZIP come unico file e non sovrapporre questi file alla repository di Topological Manifolds.

## 1. Pubblicare su GitHub Pages

Crea una repository vuota, per esempio `QuantumLab` (il nome è libero), e carica il contenuto estratto, inclusa la cartella nascosta `.github`. Non aggiungere automaticamente una licenza diversa: `LICENSE` è già incluso. Per un caricamento completo e riproducibile è consigliabile usare Git o GitHub Desktop; la sola interfaccia web può richiedere più gruppi di file.

Apri **Settings → Pages → Build and deployment → Source → GitHub Actions**. Esegui poi **Actions → Verify and publish Quantum Lab → Run workflow** sulla branch principale. I push successivi a `main` o `master` riavviano le verifiche; solo la branch predefinita può pubblicare. Se usi un altro nome, aggiornalo nel trigger di `.github/workflows/pages.yml`.

Il workflow esegue test numerici, controlli del catalogo e della distribuzione, build e test Chromium prima del deploy. Non richiede un token personale. L’indirizzo effettivo di Pages è ricavato da GitHub: non occorre scrivere il nome della repository nel JavaScript. Se il primo workflow è partito prima dell’attivazione di Pages, rieseguilo dopo aver scelto GitHub Actions.

**Stato della consegna:** pacchetto verificato localmente; nessuna repository remota creata, modificata o pubblicata in questa sessione. Il primo run nel tuo account è il collaudo effettivo del deployment GitHub.

## 2. Collegare il sito principale

Nel sito principale serve soltanto un link al nuovo indirizzo, ad esempio:

```html
<a class="button" href="https://marzione00.github.io/NOME-REPOSITORY/#indice">
  Apri Quantum Lab ↗
</a>
```

Usa l’URL realmente mostrato da Pages, non il segnaposto. Un modulo specifico si raggiunge con `#modulo-1` fino a `#modulo-7`. I vecchi hash `#capitolo-N/...` continuano a essere riconosciuti dal laboratorio. Il vecchio indirizzo remoto non viene modificato o reindirizzato automaticamente.

L’utility `npm run site:link -- https://INDIRIZZO-REALE/` genera il link con un URL validato. Non modifica il sito, il suo workflow, il gate del CV o i suoi contenuti. Non occorre copiare il laboratorio dentro il sito principale.

## 3. Configurazione

Controlla **`config/site.json`**. Il ritorno alla Didattica usa il riferimento documentato `https://marzione00.github.io/Personal_web_page/`: la sua disponibilità online non è stata verificata qui. `mainSiteUrl` è modificabile se l’indirizzo reale è diverso. `siteUrl` può restare vuoto: sarà riempito a build dal workflow Pages.

Le presentazioni non sono duplicate. I pulsanti «Materiali del corso» rinviano alla pagina del corso. Per rinviare direttamente ai sette PDF, imposta `slideLinks: "direct"`, controlla `slidesBaseUrl` ed esegui `npm run check:links` da un ambiente con accesso alla rete. Non vengono riutilizzati numeri di pagina non verificati.

## 4. Provare e aggiornare in locale

Node.js 22 o successivo; nessuna installazione di dipendenze per la build ordinaria:

```sh
npm test
npm run build
npm start
```

Apri l’indirizzo locale indicato da `npm start`. `dist/` è generata: non modificarla manualmente. L’anteprima HTML monofile è consegnata separatamente e può essere rigenerata con `npm run preview`.

Contenuti: `content/catalogue.json`. Nuovi modelli: `src/models.js`. Interfaccia: `src/app.js`. Tema: `src/lab.css`. Atmosfera laterale: `src/ambient.js`. Le 81 attività storiche utilizzano il runtime verificato in `vendor/`; i sorgenti corrispondenti sono conservati in `archive/src/`.

## 5. Licenza e verifiche

I materiali originali sono distribuiti con **CC BY-SA 4.0**, che consente anche usi commerciali con attribuzione e condivisione degli adattamenti alle condizioni della licenza. Le componenti terze conservano le proprie licenze: leggere `LICENSE` e `THIRD_PARTY_NOTICES.md`.

I risultati effettivi sono in **`docs/COLLAUDO.md`** e `qa/*.json`. Il browser locale è stato verificato sul monofile con CSP attiva: la navigazione HTTP era bloccata dall’ambiente. I test HTTP completi sono predisposti nel workflow, ma non vengono dichiarati già eseguiti su GitHub. Non è una certificazione WCAG né una prova sperimentale di apprendimento.
