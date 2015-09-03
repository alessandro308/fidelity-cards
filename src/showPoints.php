<?php
session_start();
require("CardDb.php");
require ("menu.html");

if(isset($_POST['card-number']))
	$card_number= $_POST['card-number'];
else
	$card_number = $_SESSION['card-number'];
$sq = new CardDb();

if( $result = $sq -> getPoints($card_number) ){ 
	?>

	<h2>Situazione aggiornata Card <?php echo $card_number?>:</h2>
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
				?>
			  <tr>
				<td data-th="Numero Card"><?php echo $data['id']?></td>
				<td data-th="Saldo Punti"><?php echo $data['points']?></td>
				<td data-th="Buono Utilizzabile"><?php echo number_format($money = money($data['points']), 2, ",", ".")?> Euro</td>
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
					<a href="#confirmUsage"><input style="background-color:#FA5858 !important; border:#FF0000 !important;" type="submit" value="Usa Buono Sconto" /></a>
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
<?php
} else {
		echo "<h2> Card non trovata nel sistema </h2>";
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