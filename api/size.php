<?php

require_once("../classes/ConnectDB.php"); 
require_once("../classes/Size.php"); 

$size = new Size();

$action = $_REQUEST['action'];


switch($action) {
	
	case 'getSizes':	
		$size -> getSizes(); 
	break;
	
	case 'update':	
		$size -> updateSizes($_REQUEST); 
	break;
	
	default:
		echo "Invalid request";
	break;

}

?>
