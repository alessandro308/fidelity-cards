<?php
session_start();
require("setting.php");
require("CardDb.php");
require ("menu.html");
require("PHPMailer/PHPMailerAutoload.php");

$card_number=$_SESSION['card-number'];
$phone_number = $_SESSION['phone'];

/*skip serve per mostrare tutto nel caso in cui i punti siano positivi*/
$skip=false;
if($phone_number == 0){
	$skip=true;
	?>
	<br/> <h2>ERRORE: Numero di cellulare non inserito</h2>
	<h4>Se si vuole inviare un sms, settare un numero di telefono valido. 
		<?php $_SESSION['card-number']=$card_number; ?>
	<a href="#editCard">Modifica Card</a>		
<?}
$sq = new CardDb();
$result = $sq->getPoints($card_number);
if(!$skip){ 
?>
		<h2>Situazione aggiornata Card <?php echo $card_number?></h2>
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
			$_SESSION['money']=number_format(money($data['points']), 2, ",", ".");
			$_SESSION['mail']=$data['mail'];
			
			/*Send email to foward to phone number via Skebby*/
			$mail = new PHPMailer();  // create a new object
			$mail->IsSMTP(); // enable SMTP
			$mail->SMTPDebug = 0;  // debugging: 1 = errors and messages, 2 = messages only
			$mail->SMTPAuth = true;  // authentication enabled
			$mail->SMTPSecure = 'ssl'; // secure transfer enabled REQUIRED for GMail
			$mail->Host = $host;
			$mail->Port = 465; 
			$mail->Username = $username;  
			$mail->Password = $password;           
			$mail->SetFrom($email_skebby, "");
			$mail->Subject = "Aggiornamento Punti";
			$mail->Body = 'Messaggio Automatico da Fidelity Cards Management System. || Situazione aggiornata al '.date("d/m/Y").'|| Punti disponibili: '.$data['points'].' - Sconto usabile al prossimo acquisto: '.number_format(money($data['points']), 2, ",", ".").' Euro';
			$to      = '+39'.$phone_number."@classic.skebby.com";
			$mail->AddAddress($to);
			if(!$mail->Send()) {
				echo "<h2>Mail error: ".$mail->ErrorInfo.'</h2>'; 
			} else {
				echo "<h2>SMS spedito correttamente<br/></h2>";
			}

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
						<a href="#confimUsage"><input style="background-color:#FA5858 !important; border:#FF0000 !important;" type="submit" value="Usa Buono Sconto" /></a>
					</th>
					<th>
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
<?php	
}
?>

<!--Div a comparsa -->	
<div id="confirmUsage" class="modalDialog">
	<div>
		<a href="#close" title="Close" class="close">X</a>
		<?php if($money == 0){
			echo "<h2>Non esiste sconto applicabile. Valore: 0,00€";
		}
		else{?>
		<h2>Vuoi davvero usare il buono sconto accumulato ed azzerare i punti?</h2>
		<form method="POST" action="useMoney.php">
			<?php $_SESSION['user_money']="Yes";?>
			<tr>
				<input type="submit" value="Usa buono sconto"/>
			</form>
		<?php } ?>
	</div>
</div>