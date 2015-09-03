<?php
session_start();
require("CardDb.php");
require ("menu.html");

$card_number=$_POST['card-number'];
$_SESSION['card-number']=$card_number;
$sq = new CardDb();

if(is_numeric($card_number)){

	if( $sq -> addCard($card_number)){ ?>
		<br/> <h2>Card Inserita con successo. Aggiungi altri dettagli:</h2>
		<?php 
		/*getPoints returns all fields with id=card_number */
		$values = $sq -> getPoints($card_number);
		
		if($values == FALSE){
			echo "<h2>Card non trovata nel sistema</h2>";
		}
		else{ ?>
			<table class="rwd-table">
			  <tr>
				<th>Numero Card</th>
				<th>Saldo Punti</th>
				<th>Buono Utilizzabile</th>
				<th>Nome</th>
				<th>Telefono</th>
				<th>eMail</th>
				<th></th>
			  </tr>
			<?php
		
			while($data = $values -> fetchArray()){ ?>
				  <tr><form method="POST" action="saveEdit.php">
					<td data-th="Numero Card"><?php echo $data['id']?></td>
					<td data-th="Saldo Punti"><input type="text" name="points" value="<?php echo $data['points']?>"</td>
					<td data-th="Buono Utilizzabile"><?php echo money($data['points'])?> Euro</td>
					<td data-th="Nome"><input type="text" name="name" value="<?php echo $data['name']?>"</td>
					<td data-th="Telefono"><input type="text" name="phone" value="<?php echo $data['phone']?>"</td>
					<td data-th="Email"><input type="text" name="mail" value="<?php echo $data['mail']?>"</td>
					<td data-th="Nome"><input type="submit" value="Salva"</td>
				  </tr>
			<?php }
				echo "</table>";
		}
		?>
	<?php
	}else{?>
		<br/><h2>Il numero di quella card è già presente nel sistema</h2>	
	<?php }
}
else
	echo "<h2> Inserisci un numero di card valido</h2>";
?>