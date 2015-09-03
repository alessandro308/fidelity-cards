<?php
session_start();
require("CardDb.php");
require ("menu.html");

$sq = new CardDb();


$cleanAll = "No";
$cleanAll = $_SESSION['delete-all'];

if($cleanAll=="Yes"){ $sq->cleanAll();?>
<h2> Tutto le card sono state rimosse </h2>
<?php } ?>