<?php

/*
 *	User class
 */

 
class User {
	
	/*	create response	*/
	
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
	
	
	/*	Is user active	*/

	function isUserActive ($arr) {
		$response = array();
		$response['success'] = FALSE;
		$response['data'] = array();
				
		$query = "select username, email, isActive from tbl_users where userId = '".$arr['userId']."'";
		$result = mysql_query($query);
		
		if($result) {
			$response['success'] = TRUE;
			
			while($row = mysql_fetch_assoc($result)) {
				$isActive = $row['isActive'];
				$username = $row['username'];
				$email = $row['email'];
			}
			
			$response['data']['username'] = $username;
			$response['data']['email'] = $email;
			
			if($isActive == 1) {
				$response['data']['status'] = 1;
			}
			else {
				$response['data']['status'] = 2;
			}
		}
			
		echo json_encode($response);
	}

	
	/*	Validate User Login	*/

	function login ($email, $password) {
		$response = array();
				
		$query = "select userId, email, verificationCode, isFirstTimeLogin, isActive from tbl_users where (email='$email' OR username ='$email') and password='$password'";
		$result = mysql_query($query);
		
		if($result) {
			$response['success'] = TRUE;
			$response['data'] = array();
			
			if(mysql_num_rows($result) > 0) {
				$verified = 1;
				
				//	Check if email address has been verified
				while($row = mysql_fetch_assoc($result)) {
					$verificationCode = $row['verificationCode'];
					if( $row['verificationCode'] != NULL ) {
						$verified = 0;
					}
					
					$userId = $row['userId'];
					$email = $row['email'];
					$isLoggedInFirstTime = $row['isFirstTimeLogin'];
					$isActive = $row['isActive'];
				}
				
				if($verified == 0) {
					$response['data']['status'] = '3';  	//	Email address not verified
                    $response['data']['userId'] = $userId;
					$response['data']['verificationCode'] = $verificationCode;
				} 
				else if($isActive == 0) {
					$response['data']['status'] = '4';  	//	Account disabled by admin
				}
				else {
                    $query = "update tbl_users set verificationCode=null, isFirstTimeLogin=0, isLoggedIn=1 where userId= $userId";
					mysql_query($query);
					
					$response['data']['status'] = '1';  	//	Login successful
					$response['data']['userId'] = $userId;
					$response['data']['loggedInFirstTime'] = $isLoggedInFirstTime;
				}
			} else {
				$response['success'] = true;
				$response['data']['status'] = '2';  	//	Invalid email or password
			}
		}
		else {
			$response['success'] = FALSE;
		}

		echo json_encode($response);
	}
    
    
    /* Send reset password link */
    
    function sendResetPasswordLink($email) {
        $response = array();
        $response['success'] = TRUE;
        
        $query = "select userId, email from tbl_users where email = '".$email."'";
        $result = mysql_query($query);
        
        if($result) {
            if(mysql_num_rows($result) > 0) {
                $response['data'] = array();
                
                require_once("../classes/Mailer.php");
                $mailer = new Mailer();
                $variables = array('email' => base64_encode($email));
                $body = $mailer -> getCompiledTemplate('../emailTemplates/resetPassword.html', $variables);
                $mailer -> send($email, false, 'StylFlip - Reset password link', $body);
                
                $response['data']['status'] = 1;
            }
            else {
                $response['data']['status'] = 2;
            }
        }
        else {
            $response['success'] = FALSE;
        }
        
        echo json_encode($response);
    }


	function resetPassword($email, $password) {
		if($email == '') {
			header("Location:../resetPassword.php?message=Pasword reset link expired&success=0");
		}
		else {
			$query = "select userId, email from tbl_users where email = '".$email."'";
	        $result = mysql_query($query);
	        
			if($result) {
				if(mysql_num_rows($result) == 0) {
		        	header("Location:../resetPassword.php?message=email address not found&success=0");
		        }
		        else {
		        	$query = "update tbl_users set password='".$password."' where email = '".$email."'";
	        		$result = mysql_query($query);
					
					if($result) {
			        	// header("Location:../resetPassword.php?message=Password has been successfully reset&success=1");
			        	header("Location:stylflip:///user?screen_name=login");
			        }
			        else {
			        	header("Location:../resetPassword.php?message=Failed to reset password&success=0");
			        }
		        }
			}
			else {
				header("Location:../resetPassword.php?message=Failed to reset password&success=0");
			}
		}
    }
    
    
    /*  Log user out    */
    
    function logout($userId) {
        $response = array();
        
        $query = "update tbl_users set isLoggedIn=0, deviceToken='', osname='' where userId = $userId";
        if(mysql_query($query)) {
           $response['success'] = true;
        }
        else {
           $response['success'] = false;
        }
        
        echo json_encode($response);
    }
           
           
    /*   Register user for push notification   */
       
    function registerForPushNotification($userId, $deviceToken, $osname) {
        $response = array();
        
        $query = "update tbl_users set deviceToken='" . $deviceToken . "', osname='" . $osname . "' where userId = $userId";
        if(mysql_query($query)) {
            $response['success'] = true;
        }
        else {
            $response['success'] = false;
        }
        
        echo json_encode($response);
    }

           
    
    
    /* Facebook login */
    
    function facebookLogin($arrUser) {
        $response = array();
        
        $query = "select userId, isActive, isFirstTimeLogin from tbl_users where fbId='".$arrUser['fbId']."'";
        $result = mysql_query($query);
        
        if($result) {
            //  Check if fb user has already been created, if not create a new one else return successful response
            if(mysql_num_rows($result) > 0) {
                while($row = mysql_fetch_assoc($result)) {
                    $userId = $row['userId'];
                    $isFirstTimeLogin = $row['isFirstTimeLogin'];
					$isActive = $row['isActive'];
                }
                
                $query = "update tbl_users set isFirstTimeLogin=0, isLoggedIn=1 where userId= $userId";
                mysql_query($query);
                
                $response['success'] = TRUE;
                $response['data'] = array();
                if($isActive == 0) {
					$response['data']['status'] = '4';
				}
				else {
					$response['data']['status'] = '1';
				}
                $response['data']['userId'] = $userId;
                $response['data']['loggedInFirstTime'] = $isFirstTimeLogin;
            }
            else {
                $query = "insert into tbl_users (firstName, lastName, fbId, city, profilePicURL, isFirstTimeLogin, isActive) values ('".$arrUser['firstName']."', '".$arrUser['lastName']."', '".$arrUser['fbId']."', '".$arrUser['homeTown']."', '".$arrUser['profilePicURL']."', 1, 1)";
                $result = mysql_query($query);
                
                if($result) {
                    
                    // mysql_insert_id() is purposely not used
                    $query = "select userId, isFirstTimeLogin from tbl_users where fbId='".$arrUser['fbId']."'";
                    $result = mysql_query($query);
                    
                    while($row = mysql_fetch_assoc($result)) {
                        $userId = $row['userId'];
                        $isFirstTimeLogin = $row['isFirstTimeLogin'];
                    }
                    
                    $query = "update tbl_users set verificationCode=null, isFirstTimeLogin=0, isLoggedIn=1 where userId= $userId";
                    mysql_query($query);

                    $response['success'] = TRUE;
                    $response['data'] = array();
                    $response['data']['status'] = "1";
                    $response['data']['userId'] = $userId;
                    $response['data']['loggedInFirstTime'] = $isFirstTimeLogin;
                }
                else {
                    $response['success'] = FALSE;
                }
            }
        }
        else {
            $response['success'] = FALSE;
        }
		
		echo json_encode($response);
    }

    
    /* Google plus login */
    
    function googlePlusLogin($arrUser) {
        $response = array();
        
        $query = "select userId, isFirstTimeLogin, isActive from tbl_users where gPlusId='".$arrUser['gPlusId']."'";
        $result = mysql_query($query);
        
        if($result) {
            //  Check if google plus user has already been created, if not create a new one else return successful response
            if(mysql_num_rows($result) > 0) {
                while($row = mysql_fetch_assoc($result)) {
                    $userId = $row['userId'];
                    $isFirstTimeLogin = $row['isFirstTimeLogin'];
					$isActive = $row['isActive'];
                }
                
                $query = "update tbl_users set verificationCode=null, isFirstTimeLogin=0, isLoggedIn=1 where userId= $userId";
                mysql_query($query);
                
                $response['success'] = TRUE;
                $response['data'] = array();
				if($isActive == 0) {
					$response['data']['status'] = '4';
				}
				else {
					$response['data']['status'] = '1';
				}
                $response['data']['userId'] = $userId;
                $response['data']['loggedInFirstTime'] = $isFirstTimeLogin;
            }
            else {
                $query = "insert into tbl_users (firstName, lastName, gPlusId, city, profilePicURL, isFirstTimeLogin, isActive) values ('".$arrUser['firstName']."', '".$arrUser['lastName']."', '".$arrUser['gPlusId']."', '".$arrUser['homeTown']."', '".$arrUser['profilePicURL']."', 1, 1)";
                $result = mysql_query($query);
                
                if($result) {
                    
                    // mysql_insert_id() is purposely not used
                    $query = "select userId, isFirstTimeLogin from tbl_users where gPlusId='".$arrUser['gPlusId']."'";
                    $result = mysql_query($query);
                    
                    while($row = mysql_fetch_assoc($result)) {
                        $userId = $row['userId'];
                        $isFirstTimeLogin = $row['isFirstTimeLogin'];
                    }
                    
                    $query = "update tbl_users set verificationCode=null, isFirstTimeLogin=0, isLoggedIn=1 where userId= $userId";
                    mysql_query($query);

                    $response['success'] = TRUE;
                    $response['data'] = array();
                    $response['data']['status'] = "1";
                    $response['data']['userId'] = $userId;
                    $response['data']['loggedInFirstTime'] = $isFirstTimeLogin;
                }
                else {
                    $response['success'] = FALSE;
                }
            }
        }
        else {
            $response['success'] = FALSE;
        }
        
		echo json_encode($response);
    }
	

	/*	User registration	*/

	function register($arrUser) {
		$response = array();
		
		// Check if user already exists
		$query = "select userId from tbl_users where email='".$arrUser['email']."'";
		$result = mysql_query($query);
		 
		if($result) {
			$response['success'] = TRUE;
			$response['data'] = array();
			
			if(mysql_num_rows($result) > 0) {
				$response['data']['status'] = '2';  		//	User already exists	
			} else {
			
				$digits = 4;
				$strVerificationCode = rand(pow(10, $digits-1), pow(10, $digits)-1);
	
				$query = "insert into tbl_users (username, password, email, mobileNumber, verificationCode, isFirstTimeLogin, isActive) values ('".$arrUser['username']."', '".$arrUser['password']."', '".$arrUser['email']."', '".$arrUser['mobileNumber']."', '" . $strVerificationCode . "', 1, 1 )";
				$result = mysql_query($query);
					
				if($result) {
					
					$query = "select userId from tbl_users where email='".$arrUser['email']."'";
					$result = mysql_query($query);
					
					while($row = mysql_fetch_assoc($result)) {
                        $userId = $row['userId'];
                    }
                    
					$response['success'] = TRUE;
					$response['data']['status'] = '1';  	//	Successful
					$response['data']['verificationCode'] = $strVerificationCode;
					$response['data']['userId'] = $userId;
    
                    require_once("../classes/Mailer.php");
                    $mailer = new Mailer();
                    $variables = array('verificationCode' => $strVerificationCode);
                    $body = $mailer -> getCompiledTemplate('../emailTemplates/emailVerification.html', $variables);
                    $mailer -> send($arrUser['email'], false, 'Ready to start Flippin\'? Verify your email id', $body);
				}
				else {
					$response['success'] = FALSE;
				}
			}			
		}
		else {
			$response['success'] = FALSE;
		}
		
		echo json_encode($response);
	}
	

	/*	User verification	*/

	function verify($userId, $code) {
		$response = array();
		$response['data'] = array();
		
		$query = "select userId, email from tbl_users where verificationCode = '".$code."'";
		$result = mysql_query($query);
		
		if(mysql_num_rows($result) > 0) {
            while($row = mysql_fetch_assoc($result)) {
                $email = $row['email'];
            }
            
			$query = "update tbl_users set verificationCode=null, isFirstTimeLogin=0, isLoggedIn=1 where userId='".$userId."' and verificationCode = '".$code."'";
			$result = mysql_query($query);
			
			if($result) {
                require_once("../classes/Mailer.php");
                $mailer = new Mailer();
                $variables = array();
                $body = $mailer -> getCompiledTemplate('../emailTemplates/signUp.html', $variables);
                $mailer -> send($email, false, 'Welcome to StylFlip', $body);
                
				$response['success'] = true;
				$response['data']['status'] = '1';  	//	Verification successful
                $response['data']['userId'] = $userId;
                $response['data']['loggedInFirstTime'] = 1;
			}
			else {
				$response['data']['status'] = '2';  	//	Verification failed
			}			
		}
		else {
			$response['data']['status'] = '3';  		//	Verification failed. Code not found in database 		
		}
		
		echo json_encode($response);
	}
    
    
    function resendCode($userId) {
        $response = array();
        $response['success'] = FALSE;
        
        // Check if user already exists
        $query = "select verificationCode, email from tbl_users where userId = $userId";
        $result = mysql_query($query);
        
        if($result) {
            while($row = mysql_fetch_assoc($result)) {
                $userEmail = $row['email'];
                $verificationCode = $row['verificationCode'];
            }
            
            require_once("../classes/Mailer.php");
            $mailer = new Mailer();
            $variables = array('verificationCode' => $verificationCode);
            $body = $mailer -> getCompiledTemplate('../emailTemplates/emailVerification.html', $variables);
            $mailer -> send($userEmail, false, 'Ready to start Flippin\'? Verify your email id', $body);
            
            $response['success'] = TRUE;
        }
        
        echo json_encode($response);
    }
    
	
	function updateProfile( $arrUser ) {
		$response = array();
		$response['success'] = false;
		
		$query = "update tbl_users set firstName = '".$arrUser['firstName']."', lastName = '".$arrUser['lastName']."', bio = '".$arrUser['bio']."', city = '".$arrUser['city']."', dateOfBirth = '".$arrUser['dob']."', flatNoBuildingName = '".$arrUser['flatNoBuildingName']."', streetName = '".$arrUser['streetName']."', landmark = '".$arrUser['landmark']."', state = '".$arrUser['state']."', postcode = '".$arrUser['postcode']."', mobileNumber = '".$arrUser['mobileNumber']."' where userId=".$arrUser['userId'];
		$result = mysql_query($query);
		
		if( false == array_key_exists( 'redirect', $arrUser ) || false == $arrUser['redirect'] ) {
			if($result) {
				$response['success'] = true;
				$response['data']['status'] = '1';  	//	update successful
				$this -> setMessage("User has been updated successfully");
			}
			else {
				$response['data']['status'] = '2';  	//	update failed
				$this -> setMessage("Failed to update user");
			}
			
			echo json_encode($response);
		} else {
			
			if($result) {
				$this -> setMessage("User has been updated successfully");
			}
			else {
				$this -> setMessage("Failed to update user");
			}
			header("Location:../sf_admin_control-panel/manageUsers.php");
			exit;
		}
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
	
	function setMessage ($message) {
		$_SESSION['message'] = $message;
	}
	function deleteselectedUser(){
	
	for($i=0;$i<=count($_POST['userId']);$i++){
	
		$query = "delete from tbl_feed_likes where userId = " . $_POST['userId'][$i];
		$result = mysql_query($query);
		
		$query = "delete from tbl_feed_comments where userId = " . $_POST['userId'][$i];
		$result = mysql_query($query);

		$query = "delete from tbl_stylefeed where userId = " . $_POST['userId'][$i];		
		$result = mysql_query($query);
		
		$query = "delete from tbl_product_images WHERE productId IN ( SELECT p.productId from tbl_products p where p.userId = " . $_POST['userId'][$i] . " )";
		$result = mysql_query($query);
		
		$query = "delete from tbl_product_likes where userId = " . $_POST['userId'][$i];
		$result = mysql_query($query);
		
		$query = "delete from tbl_product_comments where userId = " . $_POST['userId'][$i];
		$result = mysql_query($query);
		
		$query = "delete from tbl_products where userId = " . $_POST['userId'][$i];	
		$result = mysql_query($query);
		
		$query = "delete from tbl_users where userId = " . $_POST['userId'][$i];	
		$result = mysql_query($query);
	}
	$this -> setMessage("Selected User has been deleted successfully");
	header("Location:../sf_admin_control-panel/manageUsers.php");
		exit;
	}
	function deleteUser( $intUserId ) {
		$query = "delete from tbl_feed_likes where userId = " . $intUserId['userId'];
		$result = mysql_query($query);
		
		$query = "delete from tbl_feed_comments where userId = " . $intUserId['userId'];
		$result = mysql_query($query);

		$query = "delete from tbl_stylefeed where userId = " . $intUserId['userId'];		
		$result = mysql_query($query);
		
		$query = "delete from tbl_product_images WHERE productId IN ( SELECT p.productId from tbl_products p where p.userId = " . $intUserId['userId'] . " )";
		$result = mysql_query($query);
		
		$query = "delete from tbl_product_likes where userId = " . $intUserId['userId'];
		$result = mysql_query($query);
		
		$query = "delete from tbl_product_comments where userId = " . $intUserId['userId'];
		$result = mysql_query($query);
		
		$query = "delete from tbl_products where userId = " . $intUserId['userId'];	
		$result = mysql_query($query);
		
		$query = "delete from tbl_users where userId = " . $intUserId['userId'];	
		$result = mysql_query($query);
		
		if( result ) {
			$this -> setMessage("User has been deleted successfully");
		} else {
			$this -> setMessage("Failed to delete user");
		}
		
		header("Location:../sf_admin_control-panel/manageUsers.php");
		exit;
		
	}
	
	function deleteAdminUser( $intUserId ) {		
		
		$query = "delete from tbl_admin where Id = " . $intUserId;	
		$result = mysql_query($query);
		
		if( result ) {
			$this -> setMessage("User has been deleted successfully");
		} else {
			$this -> setMessage("Failed to delete user");
		}
		
		header("Location:../sf_admin_control-panel/manageAdmins.php");
		exit;
		
	}
	
	function createNewAdmin( $arrRequestData ) {
		
		$query = "INSERT INTO tbl_admin (username, password,  role) values ( '" . $arrRequestData['username'] . "', '" . $arrRequestData['password'] . "', '" . $arrRequestData['role'] . "' )";
		$result = mysql_query($query);
		
		if( result ) {
			$this -> setMessage("User has been added successfully");
		} else {
			$this -> setMessage("Failed to add user");
		}
		
		header("Location:../sf_admin_control-panel/manageAdmins.php");
		exit;
	}
	
	function updateAdmin( $arrRequestData ) {
	
		$query = "UPDATE tbl_admin SET username = '" . $arrRequestData['username'] . "', password = '" . $arrRequestData['password'] . "',  role = '" . $arrRequestData['role'] . "' WHERE Id = '" . $arrRequestData['userId'] . "'";
		$result = mysql_query($query);
	
		if( result ) {
			$this -> setMessage("User has been updated successfully");
		} else {
			$this -> setMessage("Failed to update user");
		}
	
		header("Location:../sf_admin_control-panel/editAdmin.php?userId=" . $arrRequestData['userId']);
		exit;
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
	
	function deactivateUser( $arr ) {
		$query = "update tbl_users set isActive=0 where userId=".$arr['userId'];
		$result = mysql_query($query);
		
		if( result ) {
			$this -> setMessage("User has been deactivated successfully");
		} else {
			$this -> setMessage("Failed to deactivate user");
		}
		
		$page = isset($arr['page']) ? '?page=' . $arr['page'] : '';
		
		if(isset($arr['redirectUrl'])) {
			header("Location:../sf_admin_control-panel/" . $arr['redirectUrl'] . $page);
		}
		else {
			header("Location:../sf_admin_control-panel/manageUsers.php" . $page);
		}
	}
	
	function activateUser( $arr ) {
		$query = "update tbl_users set isActive=1 where userId=".$arr['userId'];
		$result = mysql_query($query);
		
		if( result ) {
			$this -> setMessage("User has been activated successfully");
		} else {
			$this -> setMessage("Failed to activate user");
		}
		
		$page = isset($arr['page']) ? '?page=' . $arr['page'] : '';
		
		if(isset($arr['redirectUrl'])) {
			header("Location:../sf_admin_control-panel/" . $arr['redirectUrl'] . $page);
		}
		else {
			header("Location:../sf_admin_control-panel/manageUsers.php" . $page);
		}
	}


	function troubleSigningIn( $arr ) {
		$response = array();
		$response['success'] = false;
		
		if(isset($arr['issue'])) {
			$issue = $arr['issue'];
		}
		else {
			$issue = $arr['password'];
		}
		
		$query = "insert into tbl_signing_in_issues (email, issue) values ('".$arr['email']."', '".$issue."')";
		$result = mysql_query($query);
		
		if($result) {
			require_once("../classes/Mailer.php");
            $mailer = new Mailer();
            $body = $issue;
            $mailer -> send('support@stylflip.com', $arr['email'], 'Login issue for user ' . $arr['email'], $body);
			
			$response['success'] = true; 	
		}
		
		echo json_encode($response);
	}
	
	
	function deleteSigningInIssue( $arr ) {
		$query = "delete from tbl_signing_in_issues where id=".$arr['issueId'];
		$result = mysql_query($query);
		
		if( result ) {
			$this -> setMessage("Issue has been deleted successfully");
		} else {
			$this -> setMessage("Failed to delete issue");
		}
		
		$page = isset($arr['page']) ? '?page=' . $arr['page'] : '';
		
		if(isset($arr['redirectUrl'])) {
			header("Location:../sf_admin_control-panel/" . $arr['redirectUrl'] . $page);
		}
		else {
			header("Location:../sf_admin_control-panel/signingInIssues.php" . $page);
		}
	}
	
	
	function featureUser($arr) {
		$canUserBeFeatured = TRUE;
		
		if($arr['feature'] == 'true') {
			$query = "select userId from tbl_users where isFeatured = 1";
			$result = mysql_query($query);
			if(mysql_num_rows($result) >= 10) {
				$canUserBeFeatured = FALSE;
			}
		}	
		
		if($canUserBeFeatured) {
			if($arr['feature'] == 'true') {
				$query = "update tbl_users set isFeatured=1 where userId='".$arr['userId']."'";
			}
			else {
				$query = "update tbl_users set isFeatured=0 where userId='".$arr['userId']."'";
			}
			$result = mysql_query($query);

			if(result) {
				if($arr['feature'] == 'true') {
					$this -> setMessage("User has been featured successfully");
					
					//  Send push notification to device
		            require_once("../classes/PushNotification.php");
		            $pushNotification = new PushNotification();
		            $pushNotification -> prepareAndSendNotification(0, $arr['userId'], 'social', 'userFeatured', '');
				}
				else {
					$this -> setMessage("User has been un-featured successfully");
				}
			} else {
				$this -> setMessage("Failed to feature user");
			}
		}
		else {
			$this -> setMessage("Failed to feature user. Only 10 users can be featured.");
		}
		
		$page = isset($arr['page']) ? '?page=' . $arr['page'] : '';
		
		header("Location:../sf_admin_control-panel/manageUsers.php" . $page);
	}
	
	
	function forgotPassword( $arrInfo ) {
		
	}
	
	
	function generateRandomString($length = 10) {
		$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$charactersLength = strlen($characters);
		$randomString = '';
		for ($i = 0; $i < $length; $i++) {
			$randomString .= $characters[rand(0, $charactersLength - 1)];
		}
		return $randomString;
	}
	
};

?>