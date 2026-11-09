# Configurazione unica del collegamento al sito

`site.json` contiene gli indirizzi del sito principale; non richiede modifiche ai sorgenti. `siteUrl` resta vuoto: GitHub Actions legge l’URL effettivo da configure-pages. Tutti gli asset sono relativi e funzionano sotto qualsiasi nome di repository.

Il riferimento `mainSiteUrl` è quello del repository indicato nella continuità v3.3, non una dichiarazione di disponibilità online verificata. Per impostazione prudente i pulsanti «Materiali del corso» rimandano alla pagina del corso (`slideLinks: "course"`). Per abilitare i singoli PDF esistenti impostare `slideLinks: "direct"` e l’eventuale `slidesBaseUrl`, poi eseguire `npm run check:links`. I riferimenti di pagina non sono aggiunti automaticamente: gli hash dei PDF del catalogo sono storici e non sono stati verificati via rete in questa consegna.

`SITE_URL` può sovrascrivere `siteUrl` durante la build. `MAIN_SITE_URL` può sovrascrivere `mainSiteUrl`. Non inserire password o token in questo file.
