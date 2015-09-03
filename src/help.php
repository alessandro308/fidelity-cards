<?php 
 	session_start();
	require("menu.html");
	?>
	<h2> Aggiungere Nuova Card </h2>
		<h5> Per aggiungere una nuova card al sistema basta cliccare su Aggiungi Carda dal menù principale. <br/>
			Se il numero di Card è già presente nel sistema verrà mostrato un messaggio di errore. <br/><br/>
		Le informazioni associate alla card possono essere aggiunte in un secondo momento.<br/>
		</h5>
		
	<h2> Modificare Dati Card </h2>
		<h5> Per modificare i dati associati da una card (totale punti, nome, telefono e Email), è sufficiente andare alla scheda Modifica Card dal menù principale. 
			<br/>
		</h5>
			
	<h2>Aggiungi Punti</h2>
		<h5> Per aggiungere i punti basta cliccare su Aggiungi Punti, inserire il numero di card il cui totale punti va incrementato e la quantità di punti guadagnati. Il sistema accrediterà tale quantità alla card. <br/> <br/>
			Qualora si sia commesso un errore nell'aggiunta dei punti, è necessario modificare il totale punti manualmente tramite la funzione Modifica Card
		<br/> 
		</h5>
		
	<h2>Database Completo</h2>
		<h5> Per vedere il database completo delle card è sufficiente cliccare su Mostra Database Completo. Verrà caricata una tabella contenente tutte le card inserite nel sistema.
		<br/>
		</h5>
		
	<h2>Vedere dati Card</h2>
		<h5> Per vedere i dati associati ad una Card scegliere dal menù principale la voce Mostra Saldo, inserire quindi il numero della Card da voler monitorare e premere invio.
			<br/>
			La ricerca produce errore se la Card non viene trovata nel sistema. <br/>
		</h5>
	
	<h2>Notifiche al cliente</h2>
		<h5>Una volta aggiunti i punti ad una Card (o dopo la richiesta di visione del saldo di una Card) viene mostrata la tabella contentente tutte le informazioni della card. Se la Card ha un cellulare inserito vi è la possibilità di inviare un sms al numero contentente tutte le informazioni utili (saldo punti e buono sconto fruibile all'acquisto successivo). Cliccando sul pulsante Stampa verrà aperta la finestra di sistema e verrà richiesta la stampa della pagina visualizzata. </h5>
	
	<h2>Usare buono sconto</h2>
		<h5>Visto il saldo della Card (tramite la pagina Mostra Saldo) o dopo aver aggiunto dei punti, vi è la possibilità di premere il pulsante "Usa Buono Sconto" in rosso. Questo scala tutti i punti presenti sulla Card, azzerandone di fatto il conteggio. Si potrà quindi effettuare al cliente lo sconto per un valore massimo di quello mostrato nella tabella. Non è presente nel sistema la possibilità che il buono spesa sia usato solo parzialmente.</h5>
	
	<h2> Setting </h2>
	<form action="#confirmDel">
		<input type="submit" value="Cancella tutte le Card inserite"/>
	</form>
				
<!--Div a comparsa -->	
	<div id="confirmDel" class="modalDialog">
		<div>
			<a href="#close" title="Close" class="close">X</a>
			<h2>Vuoi davvero cancellare tutte le card inserite nel sistema?</h2>
			<form method="POST" action="newSetting.php">
				<?php $_SESSION['delete-all']="Yes";?>
				<tr>
					<input type="submit" value="Cancella tutte le card"/>
				</form>

		</div>
	</div>
