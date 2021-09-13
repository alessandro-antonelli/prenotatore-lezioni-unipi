# 🤖Prenotatore lezioni UniPi
Uno script per Tampermonkey/Greasemonkey che consente di automatizzare la ricerca di posti liberi per le lezioni in presenza dell'Università di Pisa e la loro prenotazione sulla piattaforma Agenda Didattica ([agendadidattica.unipi.it](https://agendadidattica.unipi.it) / [teachingagenda.unipi.it](https://teachingagenda.unipi.it)), evitando di dover perdere tempo a controllare periodicamente la pagina.

Lo script funziona solamente dopo la pubblicazione del calendario: cioè consente unicamente di individuare e prenotare posti liberati da altri studenti che rimuovono la loro prenotazione. Non può in nessun modo ottenere un posto prima della pubblicazione del calendario, né rende più probabile ottenere posti in presenza nel calendario generato dal sito.

⚠️ __Disclaimer__: questo è uno strumento __non ufficiale__: non è realizzato né approvato dall'Università di Pisa; è realizzato da uno studente per gli studenti. Non si fornisce nessuna garanzia sul suo funzionamento e non si assume responsabilità sull'uso che altri potrebbero farne!

🙏Usa il prenotatore __responsabilmente__: non attivarlo inutilmente, e cancella la prenotazione se non ti serve più. Ricorda che altri studenti stanno cercando posto come te!

## Come si installa
1. Installa Tampermonkey per il tuo browser:
   * [Chrome](https://tampermonkey.net/?ext=dhdg&browser=chrome)
   * [Firefox](https://tampermonkey.net/?ext=dhdg&browser=firefox)
   * [Opera](https://tampermonkey.net/?ext=dhdg&browser=opera)
   * [Safari](https://tampermonkey.net/?ext=dhdg&browser=safari)
   * [Dolphin](https://tampermonkey.net/?ext=dhdg&browser=dolphin)
   * [UC Browser](https://tampermonkey.net/?ext=dhdg&browser=ucweb)
2. [Scarica lo script cliccando qui](https://github.com/alessandro-antonelli/prenotatore-lezioni-unipi/raw/main/Prenotatore%20lezioni%20UniPi.user.js). Nel tuo browser dovrebbe aprirsi una tab di Tampermonkey.
3. Clicca su "Installa"
4. Fatto!

## Come si usa
1. Apri nel tuo browser il sito Agenda didattica, e vai alla [pagina "Calendario"](https://agendadidattica.unipi.it/Prod/Home/Calendar)
2. Nella finestra "Lezioni disponibili", metti la spunta su tutte le lezioni di cui vuoi prenotare un posto in presenza
   * _Limitati all'essenziale: evita di togliere posto agli altri inutilmente!_
4. Fatto! Lo script inizierà ad aggiornare periodicamente la pagina finché non troverà posto negli slot selezionati. In quel caso effettuerà automaticamente la prenotazione, e sarai avvertito da un avviso acustico.

NB:
* Perché il prenotatore possa funzionare, il computer deve essere mantenuto acceso e connesso a internet, e la pagina del sito Agenda didattica deve essere mantenuta aperta nel browser. Se il computer viene spento o la pagina chiusa, il prenotatore smetterà di controllare! Si consiglia di disattivare lo standby nelle impostazioni del sistema operativo.
* Puoi regolare la frequenza di aggiornamento nelle impostazioni.

## Limitazioni note
* Se per qualunque ragione il refresh della pagina fallisce (ad es. perché in quel momento la connessione è assente, il server del sito Agenda didattica non risponde, o risponde con un codice di errore), il prenotatore smette di funzionare e, quando la connessione/il server ritorna a funzionare, non è in grado di riattivarsi da solo; per riattivarlo è necessario un intervento manuale (bisogna ricaricare manualmente la pagina). Questo è dovuto al fatto che i browser non consentono alle estensioni di iniettare script nelle pagine di errore del browser.
