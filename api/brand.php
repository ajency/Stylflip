<?php

require_once("../classes/ConnectDB.php"); 
require_once("../classes/Brand.php"); 

$brand = new Brand();
$action = $_REQUEST['action'];


switch($action) {
	
	case 'getAllBrands':	
		$brand -> getAllBrands($_REQUEST); 
	break;
	
	case 'add':	
		$brand -> addNewBrand($_REQUEST); 
	break;
	
	case 'edit':
		$brand -> editBrand($_REQUEST);
		break;
		
	case 'delete':
		$brand -> deleteBrand($_REQUEST['Id']);
		break;
	
	default:
		echo "Invalid request";
	break;

}

?>
