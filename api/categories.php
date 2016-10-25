<?php

require_once("../classes/ConnectDB.php"); 
require_once("../classes/Categories.php"); 

$categories = new Categories();

$action = $_REQUEST['action'];

switch($action) {

	case 'add':	
		$categories -> addNewCategory($_REQUEST); 
	break;
	
	case 'edit':
		$categories -> editCategory($_REQUEST);
		break;
		
	case 'delete':
		$categories -> deleteCategory($_REQUEST['Id']);
		break;
	
	case 'addSubcategory':
		$categories -> addNewSubcategory($_REQUEST);
		break;
	
	case 'editSubcategory':
		$categories -> editSubcategory($_REQUEST);
		break;
        
    case 'updateSizeChart':
        $categories -> updateSizeChart($_REQUEST);
        break;

	default:
		echo "Invalid request";
	break;

}

?>
