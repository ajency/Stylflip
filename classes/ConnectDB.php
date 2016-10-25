<?php
// error_reporting("E_ALL");
// ini_set("display errors", 1);

ob_start();
session_start();

//local server details

// $host = "localhost";
// $db = "styleflip";
// $user = "root";
// $password = "";


//Remote server details

$host = "localhost";
$db = "stylflip";
$user = "root";
$password = "root";

$con = mysql_connect($host, $user, $password) or die(mysql_error()); 
mysql_select_db($db) or die(mysql_error()); 
//var_dump($con);
$_SESSION['connection'] = $con;

 //$baseURL = "http://styleflip.ah.local/";
// $baseURL = "http://54.149.49.29/stylflip/";
$baseURL = "http://localhost/styleflip/";

function filterRequestObject($requestObj) {
	/*
	if(is_array($requestObj)) {
		$arrEscaped = array();
		for($i=0; $i<count($arrEscaped); $i++) {
			array_push($arrEscaped[$i]);
			$arrEscaped
		}
	}
 	*/
	return $requestObj;
}

?>