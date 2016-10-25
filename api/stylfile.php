<?php

require_once("../classes/ConnectDB.php"); 
require_once("../classes/StyleFile.php");
    
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

$stylefile = new StyleFile();

$action = $_REQUEST['action'];
			
switch($action) {
	case 'updateProfile':
        $imagePath = '';
        if( true == isset( $_FILES['profilePic']['name'] ) ) {
            require_once("../classes/FileUploader.php");
            
            $imagePath = 'uploads/profilePics/thumbnails/'.$_REQUEST['userId'].'_'.'thumbnail_'.$_FILES['profilePic']['name'];
            $imagePathToUpload = '../uploads/profilePics/thumbnails/'.$_REQUEST['userId'].'_'.'thumbnail_';
            
            $fileUploader = new FileUploader();
            
            $extensionsAllowed = array("jpg", "jpeg", "png", "gif", "bmp");
            
            $uploadResponse = $fileUploader -> uploadFile($_FILES['profilePic'], $imagePathToUpload, $extensionsAllowed, 10, 450, 450);
            
            if($uploadResponse['success']) {
                if(!$stylefile -> saveUserProfilePicURL($imagePath, $userId)) {
                    //	if query fails delete profile pic from file system and set success to false
                    $fileUploader -> deleteFile('../' .$imagePath);
                }
            }
        }
        
		$stylefile -> updateProfile($_REQUEST, $imagePath);
	break;
        
    case 'updateUsernameAndBio':
        $stylefile -> updateUsernameAndBio($_REQUEST['userId'], $_REQUEST['username'], $_REQUEST['bio'], $_REQUEST['email'], $_REQUEST['newUser']);
        break;

	case 'getUserProfileForEditProfile':	
		$stylefile -> getUserProfileForEditProfile($_REQUEST['userId']);
	break;
	
	case 'myProducts' :
		$stylefile -> viewMyProducts($_REQUEST['userId'], $_REQUEST['pageIndex'], $_REQUEST['limit']);
		break;
		
	case 'myWants' :
		$stylefile -> viewMyWants($_REQUEST['userId'], $_REQUEST['pageIndex'], $_REQUEST['limit']);
		break;
		
	case 'removeFromWant' :
		$stylefile -> removeFromWant($_REQUEST['userId'], $_REQUEST['productId']);
		break;
				
	case 'addToWant' :
		$stylefile -> addToWant($_REQUEST['userId'], $_REQUEST['productId']);
		break;
		
	case 'myWardrobe' :
		$stylefile -> viewMyWadrobes($_REQUEST['userId'], $_REQUEST['loggedInUserId'], $_REQUEST['pageIndex'], $_REQUEST['limit']);
		break;
	
	case 'addToWardrobe' :
		$stylefile -> addToWardrobe($_REQUEST, $_FILES);
		break;
		
	case 'removeFromWardrobe' :
		$stylefile -> removeFromWadrobe($_REQUEST['userId'], $_REQUEST['wardrobeId']);
		break;
		
	case 'saveUserAddresses':
		$stylefile -> saveUserAddresses($_REQUEST);
		break;
        
    case 'deleteUserAddress':
        $stylefile -> deleteUserAddress($_REQUEST);
        break;
	
	case 'profileInfo':	
		$stylefile -> profileInfo($_REQUEST); 
		break;
	
	case 'show':
		$stylefile -> show($_REQUEST['userId'], $_REQUEST['type']);
		break;
		
	case 'updateKYCDetails':
		$stylefile -> updateKYCDetails($_REQUEST);
		break;
        
    case 'deleteKYCDetails':
        $stylefile -> deleteKYCDetails($_REQUEST['userId']);
        break;
			
	case 'updateProfilePic':
		$userId = $_REQUEST['userId'];
		$response = array();
	
		require_once("../classes/FileUploader.php");
	
		$imagePath = 'uploads/profilePics/thumbnails/'.$userId.'_'.'thumbnail_'.$_FILES['profilePic']['name'];
		$imagePathToUpload = '../uploads/profilePics/thumbnails/'.$userId.'_'.'thumbnail_';
	
		$fileUploader = new FileUploader();
			
		$extensionsAllowed = array("jpg", "jpeg", "png", "gif", "bmp");
	
		$uploadResponse = $fileUploader -> uploadFile($_FILES['profilePic'], $imagePathToUpload, $extensionsAllowed, 10, 700, 700);
	
		if($uploadResponse['success']) {
			if($stylefile -> saveUserProfilePicURL($imagePath, $userId)) {
				$response['success'] = TRUE;
				$response['data'] = array();
				$response['data']['profilePicURL'] = $imagePath;
			}
			else {
				//	if query fails delete profile pic from file system and set success to false
				$fileUploader -> deleteFile('../' .$imagePath);
				$response['success'] = FALSE;
				$response['data'] = array();
				$response['data']['error'] = "Failed to upload profile picture. Please try again later.";
			}
		}
		else {
			$response['success'] = FALSE;
			$response['data']['error'] = $uploadResponse['message'];
		}
	
		echo json_encode($response);
		break;
        
    case 'myOrders':
        $stylefile -> myOrders($_REQUEST['userId'], $_REQUEST['pageIndex']);
        break;
        
    case 'mySales':
        $stylefile -> mySales($_REQUEST['userId'], $_REQUEST['pageIndex']);
        break;
        
    case 'likeWardrobeItem':
     	$stylefile -> likeWardrobeItem($_REQUEST['userId'], $_REQUEST['wardrobeId']);
       	break;
        
    case 'disLikeWardrobeItem':
       	$stylefile -> disLikeWardrobeItem($_REQUEST['userId'], $_REQUEST['wardrobeId']);
       	break;
        
    case 'updateMySizes':
       	$stylefile -> updateMySizes($_REQUEST);
       	break;

	default:
		echo "Invalid request";
	break;

}

?>
