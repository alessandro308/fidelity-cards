<?php
session_start();
require("CardDb.php");
require ("menu.html");

$card_number = $_SESSION['card-number'];
$new_points = $_POST['points'];
$new_user = $_POST['name'];
$new_phone = $_POST['phone'];
$new_mail= $_POST['mail'];

$sq = new CardDb();
$sq -> updateAll($card_number, $new_points, $new_user, $new_phone, $new_mail);
$values = $sq -> getPoints($card_number);
?>
<h2>Valori aggiornati correttamente.</h2>
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
?>