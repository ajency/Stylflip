<?php

class StyleFile {
	
	function createResponse ($sql) {			//	for select query only
		$response = array();
		$response['data'] = array();
	
		$result = mysql_query($sql);
	
		if($result) {
			$response['success'] = TRUE;
				
			while($row = mysql_fetch_assoc($result)){
				array_push($response['data'], $row);
			}
		}
		else {
			$response['success'] = FALSE;
		}
	
		return $response;
	}
	
	function viewMyProducts( $userId, $index, $limit ) {
		if(true == empty($index)) { $index = 0; }
		if(true == empty($limit)) { $limit = 20; }
        
        $index = $index * $limit;
        
        $response = array();
        $response['data'] = array();
        $response['success'] = FALSE;
        
        $KYC = FALSE;
        
        $query = "select userId from tbl_user_kyc_details where userId = '" . $userId . "'";
        $result = mysql_query($query);
        
        if(mysql_num_rows($result) > 0) {
            $KYC = TRUE;
        }
        
        if($result) {
            $query = "select productId, primaryPhoto, isApproved, isPurchased from tbl_products p, tbl_users u WHERE p.userId = u.userId and p.userId = $userId and u.isActive = 1 order by productId desc LIMIT $index, $limit";
            $result = mysql_query($query);
            
            if($result) {
                $response['success'] = TRUE;
                
                while($row = mysql_fetch_assoc($result)){
                    array_push($response['data'], $row);
                    $response['data'][count($response['data'])-1]['KYC'] = $KYC;
                }
            }
        }
        
		echo json_encode( $response );
	}
	
	function viewMyWants( $userId, $index, $limit ) {
		if(true == empty($index)) { $index = 0; }
		if(true == empty($limit)) { $limit = 20; }
        
        $index = $index * $limit;
	
		// $query = "select w.userWantId, p.productId, p.primaryPhoto from tbl_user_wants w INNER JOIN tbl_products p ON p.productId = w.productId WHERE w.userId = $userId order by w.userWantId desc LIMIT $index, $limit";
		
		$query = "select w.userWantId, p.productId, p.primaryPhoto from tbl_user_wants w INNER JOIN tbl_products p ON p.productId = w.productId WHERE w.userId = $userId order by w.userWantId desc LIMIT $index, $limit";
		$response = $this -> createResponse($query);
	
		echo json_encode( $response ); exit;
	}
	
	function addToWant( $userId, $productId ) {
		
		$response = array();
		
		$query = "INSERT INTO tbl_user_wants (userId, productId) VALUES ( '$userId', '$productId' )";
		$result = mysql_query($query);
			
		if($result) {
			$response['success'] = true;
			$response['data']['status'] = '1';  	//	update successful
		}
		else {
			$response['data']['status'] = '2';  	//	update failed
		}
		
		echo json_encode($response);
	}
	
	function removeFromWant($userId, $productId) {
	
		$response = array();
		$response['success'] = false;
	
		$query = "DELETE FROM tbl_user_wants WHERE userId='".$userId."' and productId='".$productId."'";
		$result = mysql_query($query);
	
		if($result) {
			$response['success'] = true;
			$response['data']['status'] = '1';  	//	update successful
		}
		else {
			$response['data']['status'] = '2';  	//	update failed
		}
	
		echo json_encode($response);
	}
	
	function addToWardrobe($arr) {
		require_once("../classes/FileUploader.php");
		$response = array();
		
		$response['success'] = TRUE;
		$response['data'] = array();
		
		$imagePath = '';
	
		$imagePath = 'uploads/wardrobePics/thumbnails/'.$arr['userId'].'_'.'thumbnail_'.$_FILES['image']['name'];
		$imagePathToUpload = '../uploads/wardrobePics/thumbnails/'.$arr['userId'].'_'.'thumbnail_';
	
		$fileUploader = new FileUploader();
	
		$extensionsAllowed = array("jpg", "jpeg", "png", "gif", "bmp");
	
		$uploadResponse = $fileUploader -> uploadFile($_FILES['image'], $imagePathToUpload, $extensionsAllowed, 10, 1000, 1000);
		
		if($uploadResponse['success']) {
			$query = "insert into tbl_user_wadrobes (userId, image) values ('".$arr['userId']."', '".$imagePath."' )";
			$result = mysql_query($query);
			
			if($result) {
				
				$query = "select * from tbl_user_wadrobes where userId = '".$arr['userId']."' AND image = '".$imagePath."' ORDER BY userWadrobeId DESC LIMIT 1";
				$result1 = mysql_query($query);
				
				$recentWardrobeId = '';
				
				if($result1) {
					while($row = mysql_fetch_assoc($result1)){
						$recentWardrobeId = $row['userWadrobeId'];
						array_push($response['data'], $row);
					}
				}
                
                /*
                 *  Create feed
                 */
                $query = "insert into tbl_stylefeed (title, lat, lon, city, userId, photo, likes, createdOn, wardrobeId) values ('Check out my new closet addition', '', '', '', '".$arr['userId']."', '".$imagePath."', '0', '".date("Y-m-d H:i:s")."', '".$recentWardrobeId."' )";
                mysql_query($query);
				
				$response['success'] = TRUE;
				$response['data']['status'] = '1';  	//	Successful
			}  else {
				$fileUploader -> deleteFile('../' .$imagePath);
				$response['success'] = FALSE;
				$response['data']['error'] = 'Failed to insert into wadrobe';
			}
		} else {
			$response['success'] = FALSE;
			$response['data']['error'] = $uploadResponse['message'];
		}
		
		echo json_encode($response);
		
	}
	
	function viewMyWadrobes( $userId, $loggedInUserId, $index, $limit ) {
		if(true == empty($index)) { $index = 0; }
		if(true == empty($limit)) { $limit = 20; }
        
        $index = $index * $limit;
	
		$query = "select w.userWadrobeId, w.image, CASE WHEN wl.wardrobeLikeId IS NULL THEN 0 else 1 END  as 'isLiked' from tbl_user_wadrobes w LEFT JOIN tbl_wardrobe_like wl on w.userWadrobeId = wl.wardrobeId AND wl.userId = '$loggedInUserId' WHERE w.userId = $userId ORDER BY w.userWadrobeId DESC LIMIT $index, $limit";
		$response = $this -> createResponse($query);
	
		echo json_encode( $response ); exit;
	}
	
	function removeFromWadrobe( $userId, $intId ) {
		
		require_once("../classes/FileUploader.php");
		$fileUploader = new FileUploader();
		
		$response = array();
		$response['success'] = false;
		
		$query = "select userWadrobeId, image from tbl_user_wadrobes WHERE userWadrobeId = $intId AND userId = $userId";
		$result1 = mysql_query($query);
		
		$query = "DELETE FROM tbl_user_wadrobes WHERE userWadrobeId = $intId";
		$result = mysql_query($query);
		
		$query = "DELETE FROM tbl_stylefeed WHERE wardrobeId = $intId";
		$result = mysql_query($query);
		
		if($result) {

			if($result1) {
				while($row = mysql_fetch_assoc($result1)) {
					$fileUploader -> deleteFile('../' . $row['image']);
				}
			}
			
			$response['success'] = true;
			$response['data']['status'] = '1';  	//	update successful
		}
		else {
			$response['data']['status'] = '2';  	//	update failed
		}
		
		echo json_encode($response);
	}
	
	function profileInfo( $arrmixData ) {
		$response = array();
		$response['data'] = array();
		
		$intUserId = $arrmixData['userId'];
		
		$query = "select userId, username, profilePicURL, city, bio, (select count(ProductId) from tbl_products where userId = $intUserId ) as listed, sold, followers, following from tbl_users where userId='". $intUserId ."'";
		$result = mysql_query($query);
		
		if($result) {
			$response['success'] = TRUE;
			
			while($row = mysql_fetch_assoc($result)) {
				$query = "select userId from tbl_user_kyc_details WHERE userId = $intUserId";
            	if(mysql_num_rows(mysql_query($query)) > 0) {
            		$row['KYC'] = 1;
            	}
				else {
					$row['KYC'] = 0;
				}
				
				if( true == isset( $arrmixData['loggedInUserId'] ) ) {
					$query = "select * from tbl_user_follow where userId = "	. $arrmixData['loggedInUserId'] . " AND followedUserId = $intUserId";
						
					if(mysql_num_rows(mysql_query($query)) > 0) {
						$row['isFollowing'] = 1;
					} else {
						$row['isFollowing'] = 0;
					}
				}
				
				array_push($response['data'], $row);
			}
		}
		else {
			$response['success'] = FALSE;
		}
		
		echo json_encode($response);
		exit;
	}
	
	function getUserProfileForEditProfile( $intUserId ) {
        $response = array();
		$query = "select firstName, lastName, email, username, profilePicURL, state, city, flatNoBuildingName, streetName, postcode, mobileNumber, bio, topsAndDresses, jeansAndBottoms, footwear from tbl_users where userId='". $intUserId ."'";
		$response = $this -> createResponse($query);
		
		if( true == $response['success'] ) {
            
            $response['data'][0]['userAddresses'] = array();
            $response['data'][0]['kycDetails'] = array();
			
			$query = "select * from tbl_user_addresses where userId='". $intUserId ."' Order By addressType";
			$result = mysql_query($query);
            if($result) {
				while($row = mysql_fetch_assoc($result)){
					array_push($response['data'][0]['userAddresses'], $row);
				}
			}
            
            $query = "select * from tbl_user_kyc_details WHERE userId = $intUserId";
            $result = mysql_query($query);
            if($result) {
                while($row = mysql_fetch_assoc($result)){
                    array_push($response['data'][0]['kycDetails'], $row);
                }
            }
		}
		
		echo json_encode($response);
	}
	
	function saveUserAddresses( $arrData ) {
        $response = array();
        $response['success'] = FALSE;
			
		if($arrData['addressType'] == 'Add a location') {
    		for($i=1; $i<=3; $i++) {
    			$query = "select userId from tbl_user_addresses where addressType='Address ".$i."' and userId='".$arrData['userId']."'";
				if(mysql_num_rows(mysql_query($query)) == 0) {
		            $arrData['addressType'] == 'Address ' + $i;
		            break;
		        }
    		}
			
			$query = "insert into tbl_user_addresses (userId, addressType, addressLine1, addressLine2, city, phoneNumber, postCode, state, addressTitle, landmark) values ('".$arrData['userId']."', '".$arrData['addressType']."', '".$arrData['addressLine1']."', '".$arrData['addressLine2']."', '".$arrData['city']."', '".$arrData['phoneNumber']."', '" .$arrData['postCode'] . "', '" .$arrData['state'] . "', '" .$arrData['addressTitle'] . "', '" .$arrData['landmark'] . "' )";
		}
		else {
			$query = "select userId from tbl_user_addresses where addressType='".$arrData['addressType']."' and userId='".$arrData['userId']."'";
			if(mysql_num_rows(mysql_query($query)) > 0) {
	            $query = "update tbl_user_addresses set addressLine1='".$arrData['addressLine1']."', addressLine2='".$arrData['addressLine2']."', city='".$arrData['city']."', state='".$arrData['state']."', addressTitle='".$arrData['addressTitle']."', landmark='".$arrData['landmark']."', phoneNumber='".$arrData['phoneNumber']."', postCode='".$arrData['postCode']."' where userId='".$arrData['userId']."' and addressType='".$arrData['addressType']."'";
	        }
	        else {
	            $query = "insert into tbl_user_addresses (userId, addressType, addressLine1, addressLine2, city, phoneNumber, postCode, state, addressTitle, landmark) values ('".$arrData['userId']."', '".$arrData['addressType']."', '".$arrData['addressLine1']."', '".$arrData['addressLine2']."', '".$arrData['city']."', '".$arrData['phoneNumber']."', '" .$arrData['postCode'] . "', '" .$arrData['state'] . "', '" .$arrData['addressTitle'] . "', '" .$arrData['landmark'] . "' )";
	        }
		}
		
        $result = mysql_query($query);
			
        if($result) {
            $response['success'] = TRUE;
        }
        
        echo json_encode($response);
	}
    
    function deleteUserAddress( $arrData ) {
        $response = array();
        $response['success'] = FALSE;
        
        $query = "delete from tbl_user_addresses where addressType='".$arrData['addressType']."' and userId='".$arrData['userId']."'";
        $result = mysql_query($query);
        
        if($result) {
            $response['success'] = TRUE;
        }
        
        echo json_encode($response);
    }
    
	
	function show( $intUserId, $strType ) {
		
		if( 'shop' == $strType ) {
			$query = "select userId, primaryPhoto from tbl_products where userId=". $intUserId;
			echo json_encode($this -> createResponse($query));
		}
	}
    
    function updateProfile( $arrUser, $profilePicURL ) {
        $response = array();
        $response['success'] = false;
        
        if($profilePicURL != '') {
            $query = "update tbl_users set username = '".$arrUser['username']."', firstName = '".$arrUser['firstName']."', bio = '".$arrUser['bio']."', lastName = '".$arrUser['lastName']."', state = '".$arrUser['state']."', city = '".$arrUser['city']."', dateOfBirth = '".$arrUser['dob']."', flatNoBuildingName = '".$arrUser['flatNoBuildingName']."', streetName = '".$arrUser['streetName']."', landmark = '".$arrUser['landmark']."', state = '".$arrUser['state']."', postcode = '".$arrUser['postcode']."', mobileNumber = '".$arrUser['mobileNumber']."', profilePicURL='".$profilePicURL."' where userId=".$arrUser['userId'];
        }
        else {
            $query = "update tbl_users set username = '".$arrUser['username']."', firstName = '".$arrUser['firstName']."', bio = '".$arrUser['bio']."', lastName = '".$arrUser['lastName']."', state = '".$arrUser['state']."', city = '".$arrUser['city']."', dateOfBirth = '".$arrUser['dob']."', flatNoBuildingName = '".$arrUser['flatNoBuildingName']."', streetName = '".$arrUser['streetName']."', landmark = '".$arrUser['landmark']."', state = '".$arrUser['state']."', postcode = '".$arrUser['postcode']."', mobileNumber = '".$arrUser['mobileNumber']."' where userId=".$arrUser['userId'];
        }
        
        $result = mysql_query($query);
        
        if($result) {
            $response['success'] = true;
            $response['data'] = array();
            if($profilePicURL != '') {
                $response['data']['profilePicURL'] = $profilePicURL;
            }
        }
		
		echo json_encode($response);
        
        // if( false == array_key_exists( 'redirect', $arrUser ) || false == $arrUser['redirect'] ) {
            // if($result) {
                // $response['success'] = true;
                // $response['data']['status'] = '1';  	//	update successful
                // $this -> setMessage("User has been updated successfully");
            // }
            // else {
                // $response['data']['status'] = '2';  	//	update failed
                // $this -> setMessage("Failed to update user");
            // }
//             
            // echo json_encode($response);
        // } else {
//             
            // if($result) {
                // $this -> setMessage("User has been updated successfully");
            // }
            // else {
                // $this -> setMessage("Failed to update user");
            // }
            // header("Location:../sf_admin_control-panel/manageUsers.php");
            // exit;
        // }
    }
    
    function updateUsernameAndBio( $userId, $username, $bio, $email, $newUser ) {
        $response = array();
        $response['success'] = false;
		$response['data'] = array();
		
		if(isset($username)) {
			$query = "select userId from tbl_users where username = '".$username."' and userId != '".$userId."'";
            $result = mysql_query($query);
            
        	if($result) {
        		if(mysql_num_rows($result) > 0) {
        			$response['success'] = TRUE;
        			$response['data']['status'] = 2;
        		}
				else if(isset($email)) {
					$query = "select userId from tbl_users where email = '".$email."' and userId != '".$userId."'";
            		$result = mysql_query($query);
					
					if(mysql_num_rows($result) > 0) {
	        			$response['success'] = TRUE;
	        			$response['data']['status'] = 3;
	        		}
					else {
						if(isset($bio)) {
							$query = "update tbl_users set username = '".$username."', email = '".$email."', bio = '".$bio."' where userId=".$userId;
						}
						else {
							$query = "update tbl_users set username = '".$username."', email = '".$email."' where userId=".$userId;
						}
						$result = mysql_query($query);
						if($result) {
							$response['success'] = TRUE;
							$response['data']['status'] = 1;
						}
						else {
							$response['success'] = FALSE;
						}
					}
				}
				else {
					if(isset($bio)) {
						$query = "update tbl_users set username = '".$username."', bio = '".$bio."' where userId=".$userId;
					}
					else {
						if(isset($email)) {
							$query = "update tbl_users set username = '".$username."', email = '".$email."' where userId=".$userId;
						}
						else {
							$query = "update tbl_users set username = '".$username."' where userId=".$userId;
						}
					}
					$result = mysql_query($query);
					if($result) {
						$response['success'] = TRUE;
						$response['data']['status'] = 1;
					}
					else {
						$response['success'] = FALSE;
					}
				}
        	}
			else {
				$response['success'] = FALSE;
			}
		}
		else if(isset($bio)) {
			$query = "update tbl_users set bio = '".$bio."' where userId=".$userId;
			$result = mysql_query($query);
			if($result) {
				$response['success'] = TRUE;
				$response['data']['status'] = 1;
			}
			else {
				$response['success'] = FALSE;
			}
		}
		
		if($response['success'] && $response['data']['status'] == 1 && isset($newUser) && isset($email)) {
			require_once("../classes/Mailer.php");
            $mailer = new Mailer();
            $variables = array();
            $body = $mailer -> getCompiledTemplate('../emailTemplates/signUp.html', $variables);
            $mailer -> send($email, false, 'Welcome to StylFlip', $body);
		}
        
        echo json_encode($response);
    }
    
    function saveUserProfilePicURL ($URL, $userId) {
        $query = "select profilePicURL from tbl_users where userId='".$userId."'";
        $result = mysql_query($query);
        
        if($result) {
            while($row = mysql_fetch_assoc($result)) {
                $profilePicURL = $row['profilePicURL'];
            }
            
            //	Check and delete old profile pic from file system
            
            if($profilePicURL != "") {
                unlink("../".$profilePicURL);
            }
            
            $query = "update tbl_users set profilePicURL='".$URL."' where userId='".$userId."'";
            return mysql_query($query);	
        }
        else {
            return FALSE;		
        }
    }
    
    function updateSelectedUserBrands( $arrInfo ) {
        $response = array();
        
        $query = "update tbl_users set brands = '" . $arrInfo['brands'] . "' where userId=".$arrInfo['userId'];
        $result = mysql_query($query);
        
        if($result) {
            $response['success'] = true;
        } else {
            $response['success'] = false;
        }
        
        echo json_encode($response);
    }
    
    function updateUserSizes( $arrInfo ) {
        $response = array();
        
        if( 'shoe' == $arrInfo['type'] ) {
            $query = "update tbl_users set shoeSize = '" . $arrInfo['shoeSize'] . "' where userId=".$arrInfo['userId'];
        } else if( 'dress' == $arrInfo['type'] ) {
            $query = "update tbl_users set dressSize = '" . $arrInfo['dressSize'] . "' where userId=".$arrInfo['userId'];
        }
        
        $result = mysql_query($query);
        
        if($result) {
            $response['success'] = true;
        } else {
            $response['success'] = false;
        }
        
        echo json_encode($response);
    }
    
    
    function updateKYCDetails( $arrRequestData ) {
    	$response = array();
        $response['success'] = FALSE;
        
        $query = "select userId from tbl_user_kyc_details where userId='".$arrRequestData['userId']."'";
        
        if(mysql_num_rows(mysql_query($query)) > 0) {
            $query = "UPDATE tbl_user_kyc_details SET bankName = '" . $arrRequestData['bankName'] . "', accountNumber = '" . $arrRequestData['accountNumber'] . "', ifscCode = '" . $arrRequestData['ifscCode'] . "', accountName = '" . $arrRequestData['accountName'] . "', accountType = '" . $arrRequestData['accountType'] . "', panNumber = '" . $arrRequestData['panNumber'] . "' WHERE userId = '". $arrRequestData['userId'] . "'";
            $result = mysql_query($query);
        }
        else {
            $query = "INSERT INTO tbl_user_kyc_details (userId, bankName, accountNumber, ifscCode, accountName, accountType, panNumber ) VALUES ( '" . $arrRequestData['userId'] . "', '" . $arrRequestData['bankName'] . "','" . $arrRequestData['accountNumber'] . "','" . $arrRequestData['ifscCode'] . "','" . $arrRequestData['accountName'] . "','" . $arrRequestData['accountType'] . "','" . $arrRequestData['panNumber'] . "' )";
            $result = mysql_query($query);
        }
    	
    	if($result) {
    		$response['success'] = true;
    	}
    	 
    	echo json_encode($response);
    }
    
    
    function deleteKYCDetails( $userId ) {
        $response = array();
        $response['success'] = FALSE;
        
        $query = "delete from tbl_user_kyc_details where userId='".$userId."'";
        $result = mysql_query($query);
        
        if($result) {
            $response['success'] = true;
        }
        
        echo json_encode($response);
    }
    
    
    function myOrders($userId, $index) {
        if(true == empty($index)) { $index = 0; }
        if(true == empty($limit)) { $limit = 20; }
        
        $index = $index * $limit;
        
        $query = "select o.*, p.brandId, p.size, p.productTitle, p.primaryPhoto, p.discountPrice as sellingPrice, b.brandId, b.Name as brand from tbl_orders o, tbl_products p, tbl_brands b where o.buyerId = $userId and o.productId = p.productId and b.brandId = p.brandId order by o.orderId desc LIMIT $index, $limit";
        echo json_encode($this -> createResponse($query));
    }
    
    function mySales($userId, $index) {
        if(true == empty($index)) { $index = 0; }
        if(true == empty($limit)) { $limit = 20; }
        
        $index = $index * $limit;
        
        $query = "select o.*, p.brandId, p.size, p.productTitle, p.primaryPhoto, p.discountPrice as sellingPrice, b.brandId, b.Name as brand from tbl_orders o, tbl_products p, tbl_brands b where o.sellerId= $userId and o.productId = p.productId and b.brandId = p.brandId order by o.orderId desc LIMIT $index, $limit";
        echo json_encode($this -> createResponse($query));
    }
    
    function likeWardrobeItem( $userId, $wardrobeId ) {
    	$response = array();
    	$response['success'] = false;
    
    	$query = "INSERT INTO tbl_wardrobe_like(userId, wardrobeId ) values ( '$userId' , '$wardrobeId' )";
    	$result = mysql_query($query);
    		
    	if($result) {
    		$query = "update tbl_user_wadrobes set likes = likes + 1 WHERE userWadrobeId = $wardrobeId" ;
    		$result = mysql_query($query);
    			
    		$response['success'] = true;
    		$response['data']['status'] = '1';  	//	update successful
            
            //  Send push notification to device
            
            $query = "select userId, userWadrobeId from tbl_user_wadrobes where userWadrobeId='".$wardrobeId."'";
            $result = mysql_query($query);
            while($row = mysql_fetch_assoc($result)) {
                $toUserId = $row['userId'];
            }
            
            require_once("../classes/PushNotification.php");
            $pushNotification = new PushNotification();
            $pushNotification -> prepareAndSendNotification($userId, $toUserId, 'social', 'likeWardrobeItem', '');
    	}
    	else {
    		$response['data']['status'] = '2';  	//	update failed
    	}
    
    	echo json_encode($response);
    }
    
    function disLikeWardrobeItem( $userId, $wardrobeId ) {
    	$response = array();
    	$response['success'] = false;
    
    	$query = "DELETE FROM tbl_wardrobe_like WHERE wardrobeId = $wardrobeId AND userId = $userId";
    	$result = mysql_query($query);
    
    	if($result) {
    			
    		$query = "update tbl_user_wadrobes set likes = likes - 1 WHERE userWadrobeId = $wardrobeId AND likes > 0" ;
    		$result = mysql_query($query);
    			
    		$response['success'] = true;
    		$response['data']['status'] = '1';  	//	update successful
    	}
    	else {
    		$response['data']['status'] = '2';  	//	update failed
    	}
    
    	echo json_encode($response);
    }
    
    function updateMySizes($arr) {
        $response = array();
        $response['success'] = false;
        
        $query = "update tbl_users set topsAndDresses = '" . $arr['topsAndDresses'] . "', jeansAndBottoms = '" . $arr['jeansAndBottoms'] . "', footwear = '" . $arr['footwear'] . "' WHERE userId = '" . $arr['userId'] . "'" ;
        $result = mysql_query($query);
        
        if($result) {
            $response['success'] = TRUE;
        }
        
        echo json_encode($response);
    }
	
};

?>