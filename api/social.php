<?php

require_once("../classes/ConnectDB.php");
require_once("../classes/Social.php"); 

$social = new Social();

$action = $_REQUEST['action'];	

switch($action) {
	
	case 'follow':	
		$social -> follow( $_REQUEST['userId'], $_REQUEST['followedUserId'] ); 
		break;
		
	case 'unfollow':
		$social -> unfollow( $_REQUEST['userId'], $_REQUEST['followedUserId'] );
		break;
        
    case 'showNotifications':
        $social -> showNotifications( $_REQUEST['userId'], $_REQUEST['pageIndex'], $_REQUEST['limit'] );
        break;
		
	case 'showPeople':
		$social -> showPeople( $_REQUEST['userId'], $_REQUEST['pageIndex'], $_REQUEST['limit'], $_REQUEST['searchText'] );
		break;
		
	case 'followers':
		$social -> followers( $_REQUEST['userId'],  $_REQUEST['loggedInUserId'], $_REQUEST['pageIndex'], $_REQUEST['limit'], $_REQUEST['searchText'], $_REQUEST['feedId'], $_REQUEST['productId'] );
		break;

	case 'followings':
		$social -> followings( $_REQUEST['userId'], $_REQUEST['loggedInUserId'], $_REQUEST['pageIndex'], $_REQUEST['limit'], $_REQUEST['searchText'], $_REQUEST['feedId'], $_REQUEST['productId'] );
		break;
        
        
    case 'pushNotification':
        $deviceToken = '095449ee3d0399fb671958fdfd659c0e631d0594f53be3efa133564728c7a3ee'; // ios
        $deviceToken = 'APA91bHVlYXH4BtBcZtfhGz_w5uuHCsJjTWfJ0J2MXDdH1nvOOt-fQlKgarsVsjisGdEde9lM5dO78-cqtemV6ukd-51QRYyemYDKHMzfnGUoi8KTL7I-d1SVKbaT2C5qdlX-rBmGLLO';  //  android
        $message = 'Sending push notification for social screen';
        
        require_once("../classes/PushNotification.php");
        $pushNotification = new PushNotification();
        $pushNotification -> sendNotification($deviceToken, 'Social', 'android', $message);
        break;
        
    case 'getUnreadNotificationsCount':
        $social -> getUnreadNotificationsCount( $_REQUEST['userId'] );
        break;
		
	case 'pushMessage';
		$social -> pushMessage( $_REQUEST );
		break;
        
	default:
		echo "Invalid request";
	break;

}

?>
