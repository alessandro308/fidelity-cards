<?php

class CardDb extends SQLite3{
	function __construct(){
			$this -> open("card_db", SQLITE3_OPEN_READWRITE | SQLITE3_OPEN_CREATE);
			$this -> exec("CREATE TABLE IF NOT EXISTS cards (id int(10), points int(9), name VARCHAR(50), phone int(14), mail VARCHAR(50))");
	}
	
	function addCard($number){
		$result = $this -> query("SELECT id FROM cards WHERE id = '$number'");
		//La query non deve tornare risultato, altrimenti esiste già il record
		if($result -> fetchArray()){
			return false;
		}
		$this -> exec("INSERT INTO cards VALUES ($number, 0, 'N/D', 0, 'not')");
		return true;
	}
	
	function getPoints($number){
		$result = $this -> query("SELECT id FROM cards WHERE id = '$number'");
		if($result->fetchArray()){
			$result = $this -> query("SELECT * FROM cards WHERE id = '$number'");
			//La query non deve tornare risultato, altrimenti esiste già il record
			return $result;
		}
		return FALSE;
	}
	
	function setPoints($card, $points){
		$this->exec("UPDATE cards SET points = $points WHERE id = $card");
	}
	
	function addPoints($number, $points){
		$result = $this -> query("SELECT * FROM cards WHERE id = '$number'");
		if($data=$result -> fetchArray()){
			$new_points=$data['points']+intval($points);
			$this->exec("UPDATE cards SET points = $new_points WHERE id = $number");
			return $new_points;
		}
		else
			return -1;
	}
	
	function getAlls(){
		$result = $this -> query("SELECT * from cards");
		return $result;
		}
	
	function updateAll($cardNumber, $points, $user, $phone, $mail){
		$this->exec("UPDATE cards SET points=$points, name= '$user', phone=$phone, mail='$mail' WHERE id = $cardNumber");
	}
	
	function cleanAll(){
		$file = 'card_db';
		$newfile = 'save/card_db'.date("dmY");
		if (!file_exists('save')) {
			mkdir('save', 0777, true);
		}
		if (!copy($file, $newfile)) {
			echo "Salvataggio di sicurezza fallito";
		}
		
		unlink($file);
	}
}

function money($x){
	if($x<0)
		return "-1";
	if($x<150)
		return $x*0.05;
	if($x<250)
		return $x*0.10;
	if($x<400)
		return $x*0.15;
	return $x*0.20;
}
?>