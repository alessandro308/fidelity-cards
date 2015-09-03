<?php
session_start();
require("CardDb.php");
require ("menu.html");

$sq = new CardDb();

$result = $sq -> getAlls();
?>

<h1>Database FidelityCards</h1>
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

while($data = $result -> fetchArray()){?>
	  <tr>
		<td data-th="Numero Card"><?php echo $data['id']?></td>
		<td data-th="Saldo Punti"><?php echo $data['points']?></td>
		<td data-th="Buono Utilizzabile"><?php echo money($data['points'])?> Euro</td>
		<td data-th="Nome"><?php echo $data['name']?></td>
		<td data-th="Telefono"><?php echo $data['phone']?></td>
		<td data-th="Email"><?php echo $data['mail']?></td>
	  </tr>
<?php }
	echo "</table>"
?>