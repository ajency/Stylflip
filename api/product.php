<?php

require_once("../classes/ConnectDB.php"); 
require_once("../classes/Product.php");
    
    
function sanitate($array) {
    foreach($array as $key=>$value) {
        if(is_array($value)) {
            sanitate($value);
        }
        else {
            $array[$key] = mysql_real_escape_string($value);
        }
    }
    return $array;
}

$_REQUEST = sanitate($_REQUEST);

$product = new Product();

$action = $_REQUEST['action'];

switch($action) {
	
	case 'create':	
		$product -> createProduct($_REQUEST); 
		break;

	case 'listing':
		$product -> listing($_REQUEST['userId'], $_REQUEST['pageIndex'], $_REQUEST['limit'], $_REQUEST['searchText'], $_REQUEST['sortBy'], $_REQUEST['brands'], $_REQUEST['categories'], $_REQUEST['subCategories'], $_REQUEST['sizes'], $_REQUEST['conditions'], $_REQUEST['priceRange'] );
		break;
	
	case 'like':
		$product -> like($_REQUEST['userId'], $_REQUEST['productId']);
		break;
	
	case 'dislike':
		$product -> dislike($_REQUEST['userId'], $_REQUEST['productId']);
		break;

	case 'getCategories':
		$product -> getCategories();
		break;
			
	case 'getSubcategories':
		$product -> getSubcategories($_REQUEST['categoryId']);
		break;
		
	case 'approveProduct':
		$product -> approveProduct($_REQUEST);
		break;
		
	case 'rejectProduct':
		$product -> rejectProduct($_REQUEST);
		break;
		
	case 'deleteProduct':
		$product -> deleteProduct($_REQUEST);
		break;
		
	case 'viewProductDetails':
		$product -> productDetails( $_REQUEST );
		break;	
		
	case 'updateProductDetails':
		$product -> updateProductDetails( $_REQUEST );
		break;
		
	case 'updateProductDetailsCopy':
		$product -> updateProductDetailsCopy( $_REQUEST );
		break;
				
	case 'comment':
		$product -> addComment($_REQUEST['userId'], $_REQUEST['productId'], $_REQUEST['comment']);
		break;
		
	case 'viewComments':
		$product -> viewComments( $_REQUEST['productId'], $_REQUEST['pageIndex'], $_REQUEST['limit'] );
		break;
		
	case 'tagUser': 
		$product -> tagUser( $_REQUEST['userId'], $_REQUEST['productId'], $_REQUEST['taggedUserId'] );
		break;
	
	case 'untagUser':
		$product -> untagUser( $_REQUEST['userId'], $_REQUEST['productId'], $_REQUEST['taggedUserId'] );
		break;
        
    case 'purchaseProduct':
        $product -> purchaseProduct( $_REQUEST );
        break;
        
    case 'updateOrderStatus':
        $product -> updateOrderStatus( $_REQUEST );
        break;

	case 'updateOrderStatus1':
		$product -> updateOrderStatus1( $_REQUEST );
        break;
		
	case 'updateOrderStatusCopy':
        $product -> updateOrderStatusCopy( $_REQUEST );
        break;
		
	case 'updateOrder':
        $product -> updateOrder( $_REQUEST );
        break;
		
	case 'addCouponCode':
        $product -> addCouponCode( $_REQUEST );
        break;
		
	case 'deleteCouponCode':
        $product -> deleteCouponCode( $_REQUEST );
        break;
		
	case 'getCouponDiscountByCode':
		$product -> getCouponDiscountByCode( $_REQUEST );
        break;
        
	case 'getCouponDiscountByCodeNew':
		$product -> getCouponDiscountByCodeNew( $_REQUEST );
        break;	
		
	default:
		echo "Invalid request";
	break;

}

?>
