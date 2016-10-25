<?php
require_once("../classes/ConnectDB.php"); 
require_once("../classes/User.php"); 

$user = new User();

$action = $_REQUEST['action'];

switch($action) {
	
	/*	Validate if user is active	*/

	case 'isUserActive':	
		$user -> isUserActive($_REQUEST);
	break;


	/*	Validate User Login	*/

	case 'login':	
		$user -> login($_REQUEST['email'], $_REQUEST['password']);
	break;
        
    
    /*	Log user out	*/
        
    case 'logout':
        $user -> logout($_REQUEST['userId']);
    break;
        
        
    /*	Register for push notification	*/
        
    case 'registerForPushNotification':
        $user -> registerForPushNotification($_REQUEST['userId'], $_REQUEST['deviceToken'], $_REQUEST['osname']);
    break;
        
        
    /*	Validate Facebook Login	*/
        
    case 'facebookLogin':
        $user -> facebookLogin($_REQUEST);
    break;
	
	
    /*	Validate google plus Login	*/
        
    case 'googlePlusLogin':
        $user -> googlePlusLogin($_REQUEST);
    break;

	
	/*	logout user and destroy session	*/

	case 'logout':	
		$user -> logout();
	break;	
	
	
	/*	Register a new user	*/

	case 'register':	
		$user -> register($_REQUEST);
	break;	
	
	case 'forgotPassword':
		$user -> forgotPassword($_REQUEST);
		break;
        
        
    case 'sendResetPasswordLink':
        $user -> sendResetPasswordLink($_REQUEST['email']);
        break;
		
		
	case 'resetPassword':
        $user -> resetPassword(base64_decode($_REQUEST['code']), $_REQUEST['password']);
        break;	
        
		
		
	/*	Verify user	*/

	case 'verify':	
		$userId = $_REQUEST['userId'];
		$user -> verify($userId, $_REQUEST['verificationCode']);
	break;
        
    case 'resendCode':
        $user -> resendCode($_REQUEST['userId']);
        break;
	
	case 'updateProfile':	
		$user -> updateProfile($_REQUEST);
	break;

	case 'getUserProfile':	
		$user -> getUserProfile($_REQUEST['userId']);
	break;
	
	case 'deleteUser':
		$user -> deleteUser($_REQUEST);
	break;
	
	case 'deleteselectedUser':
		$user -> deleteselectedUser($_REQUEST);
	break;
	
	case 'updateUserSizes':
		$user -> updateUserSizes($_REQUEST);
	break;
	
	case 'updateSelectedUserBrands':
		$user -> updateSelectedUserBrands($_REQUEST);
		break;
		
	case 'deactivateUser':
		$user -> deactivateUser($_REQUEST);
		break;
		
	case 'activateUser':
		$user -> activateUser($_REQUEST);
		break;
		
	case 'troubleSigningIn':
		$user -> troubleSigningIn($_REQUEST);
		break;	
		
	case 'deleteSigningInIssue':
		$user -> deleteSigningInIssue($_REQUEST);
		break;	
		
	case 'featureUser':
		$user -> featureUser($_REQUEST);
		break;	
		
	case 'deleteAdminUser':
		$user -> deleteAdminUser($_REQUEST['userId']);
		break;		
	
	case 'createNewAdmin':
		$user -> createNewAdmin($_REQUEST);
		break;
		
	case 'updateAdmin':
		$user -> updateAdmin($_REQUEST);
		break;
	default:
		echo "Invalid request";
	break;

}

?>
