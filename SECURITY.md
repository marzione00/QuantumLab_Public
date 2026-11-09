# Sicurezza e limiti operativi

Il laboratorio esegue simulazioni nel browser. Non accetta account o segreti, non invia risultati a un backend e non include analytics. Non usare output di BB84 o dei piccoli esempi RSA per proteggere informazioni reali. Il generatore pseudocasuale non è crittografico.

La build usa una CSP meta con script dello stesso sito, oggetti disabilitati e `connect-src 'none'`. Gli stili inline rimangono ammessi perché i componenti scientifici li utilizzano. La CSP meta non equivale a una configurazione completa degli header dell’hosting. La variante monofile usa hash esatti degli script.

Il workflow separa verifica e deploy, usa permessi di lettura nella build e concede `pages: write` e `id-token: write` soltanto al job di pubblicazione. Nessun token personale è richiesto. Non inserire credenziali nelle configurazioni.

Il codice incluso è verificato nei casi documentati, non sottoposto a un penetration test o a una prova formale. Aggiornare le dipendenze e le azioni con revisione e test; non sostituire il bundle scientifico senza controllare provenienza e regressioni.
