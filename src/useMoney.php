<?php
session_start();
require("CardDb.php");
require ("menu.html");

$card_number= $_SESSION['card-number'];
$sq = new CardDb();
	?>
	
	<h2>Lo sconto di <?php echo $_SESSION['money']; 		
		$sq -> setPoints($card_number, 0); 
		$result = $sq -> getPoints($card_number); ?> € è stato usato:</h2>
		<table class="rwd-table">
		  <tr>
			<th>Numero Card</th>
			<th>Saldo Punti</th>
			<th>Buono Utilizzabile</th>
			<th>Nome</th>
			<th>Telefono</th>
			<th>Email</th>
		  </tr>
		<?php
		while($data = $result -> fetchArray()){
				$_SESSION['card-number']=$data['id'];
				$_SESSION['phone']=$data['phone'];
				$_SESSION['mail']=$data['mail'];
				?>
			  <tr>
				<td data-th="Numero Card"><?php echo $data['id']?></td>
				<td data-th="Saldo Punti"><?php echo $data['points']?></td>
				<td data-th="Buono Utilizzabile"><?php echo number_format($money=money($data['points']), 2, ",", ".")?> Euro</td>
				<td data-th="Nome"><?php echo $data['name']?></td>
				<td data-th="Telefono"><?php echo $data['phone']?></td>
				<td data-th="Email"><?php echo $data['mail']?></td>
			  </tr>

<?php }
			echo "</table>";
			?> 
			<table>
			<tr>
				<th>
				</th>
				<th>
					<form action="sendSms.php" method="POST">
						<input type="submit" value="Invia SMS"/>
					</form>
				</th>
				<th>
					<form>
					<input type="submit" value ="Stampa" onclick="window.print()" />
					</form>
				</th>
				<th>
					<form action="sendEmail.php" method="POST">
												<input type="submit" value="Invia eMail"/>
					</form>					
				</th>

			</tr>
			</table>