<?php

require_once("../classes/ConnectDB.php"); 
require_once("../classes/StyleFeed.php");
    
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

$stylefeed = new StyleFeed();

$action = $_REQUEST['action'];


/*
 * Php Mail function
 */
// $headers  = 'MIME-Version: 1.0' . "\r\n";
// $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
// // Additional headers
// // $headers .= 'To: Name <Email>' . "\r\n";
// $headers .= "From: " . 'Sushant Ahirrao' . " <" . 'sushant@oabstudios.com' . ">\r\n";
// $subject = "hello";
// $msg = "Mail testing";
// 
// mail('sushantahirrao@gmail.com', $subject, $msg, $headers);

switch($action) {
	
	case 'create':	
		$stylefeed -> createFeed($_REQUEST); 
	break;
	
	case 'listing':
		$stylefeed -> listing($_REQUEST['userId'], $_REQUEST['location'], $_REQUEST['pageIndex'], $_REQUEST['limit'], $_REQUEST['searchText'], $_REQUEST['postedBy'],$_REQUEST['stylefeedSection']);
		break;
		
	case 'feedDetails':
		$stylefeed -> feedDetails($_REQUEST['userId'], $_REQUEST['feedId']);
		break;	
		
	case 'like':
		$stylefeed -> like($_REQUEST['userId'], $_REQUEST['feedId']);
		break;
		
	case 'dislike':
		$stylefeed -> dislike($_REQUEST['userId'], $_REQUEST['feedId']);
		break;
		
	case 'comment':
		$stylefeed -> addComment($_REQUEST['userId'], $_REQUEST['feedId'], $_REQUEST['comment']);
		break;
	
	case 'viewComments':
		$stylefeed -> viewComments( $_REQUEST['feedId'], $_REQUEST['pageIndex'], $_REQUEST['limit'] );
		break;
		
	case 'hidePost':
		$stylefeed -> hidePost( $_REQUEST['userId'], $_REQUEST['feedId'], $_REQUEST['reason']);
		break;
        
    case 'deletePost':
        $stylefeed -> deletePost( $_REQUEST);
        break;

	case 'tagUser':
		$stylefeed -> tagUser( $_REQUEST['userId'], $_REQUEST['feedId'], $_REQUEST['taggedUserId'] );
		break;
		
	case 'untagUser':
		$stylefeed -> untagUser( $_REQUEST['userId'], $_REQUEST['feedId'], $_REQUEST['taggedUserId'] );
		break;
		
	default:
		echo "Invalid request";
	break;

}

?>
