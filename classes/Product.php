<?php

//save file
// $filename = 'log.txt';
// $handle = fopen($filename, 'w');
// fwrite($handle, "$query");
// fclose($handle);

class Product {
	
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
    
	
	function createProduct($arrProduct) {
		require_once("../classes/FileUploader.php");
        $fileUploader = new FileUploader();
        
		$response = array();
		
		$response['success'] = TRUE;
		$response['data'] = array();
        
        $successProductImage1 = TRUE;
        $successProductImage2 = TRUE;
        $successProductImage3 = TRUE;
        $successProductImage4 = TRUE;
        $successProductImage5 = TRUE;
        
		
		$productImage1 = '';
		
		if( true == isset($_FILES['productImage1'])) {
			$productImage1 = 'uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_1'.$_FILES['productImage1']['name'];
			$imagePathToUpload = '../uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_1';
		
			$extensionsAllowed = array("jpg", "jpeg", "png", "gif", "bmp");
				
			$uploadResponse = $fileUploader -> uploadFile($_FILES['productImage1'], $imagePathToUpload, $extensionsAllowed, 10, 1000, 1000);
            $successProductImage1 = $uploadResponse['success'];
		}
        
        
        $productImage2 = '';
        
        if( true == isset($_FILES['productImage2'])) {
            $productImage2 = 'uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_2'.$_FILES['productImage2']['name'];
            $imagePathToUpload = '../uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_2';
            
            $extensionsAllowed = array("jpg", "jpeg", "png", "gif", "bmp");
            
            $uploadResponse = $fileUploader -> uploadFile($_FILES['productImage2'], $imagePathToUpload, $extensionsAllowed, 10, 1000, 1000);
            $successProductImage2 = $uploadResponse['success'];
        }
        
        
        $productImage3 = '';
        
        if( true == isset($_FILES['productImage3'])) {
            $productImage3 = 'uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_3'.$_FILES['productImage3']['name'];
            $imagePathToUpload = '../uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_3';
            
            $extensionsAllowed = array("jpg", "jpeg", "png", "gif", "bmp");
            
            $uploadResponse = $fileUploader -> uploadFile($_FILES['productImage3'], $imagePathToUpload, $extensionsAllowed, 10, 1000, 1000);
            $successProductImage3 = $uploadResponse['success'];
        }
        
        
        $productImage4 = '';
        
        if( true == isset($_FILES['productImage4'])) {
            $productImage4 = 'uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_4'.$_FILES['productImage4']['name'];
            $imagePathToUpload = '../uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_4';
            
            $extensionsAllowed = array("jpg", "jpeg", "png", "gif", "bmp");
            
            $uploadResponse = $fileUploader -> uploadFile($_FILES['productImage4'], $imagePathToUpload, $extensionsAllowed, 10, 1000, 1000);
            $successProductImage4 = $uploadResponse['success'];
        }
        
        
        $productImage5 = '';
        
        if( true == isset($_FILES['productImage5'])) {
            $productImage5 = 'uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_5'.$_FILES['productImage5']['name'];
            $imagePathToUpload = '../uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_5';
            
            $extensionsAllowed = array("jpg", "jpeg", "png", "gif", "bmp");
            
            $uploadResponse = $fileUploader -> uploadFile($_FILES['productImage5'], $imagePathToUpload, $extensionsAllowed, 10, 1000, 1000);
            $successProductImage5 = $uploadResponse['success'];
        }
        		
		if($successProductImage1 && $successProductImage2 && $successProductImage3 && $successProductImage4 && $successProductImage5) {
			
			$strColumns = '';
			$strColumnValues = '';
			
            $strColumns = ', height, length ';
			if($arrProduct['sizeChart'] == 'E') {
				$strColumnValues = ", '".$arrProduct['height']."', '".$arrProduct['length']."'";
			}
            else {
                $strColumnValues = ", '', ''";
            }
				
			$query = "insert into tbl_products (userId, productTitle, `condition`, productDescription, brandId, categoryId, subcategoryId, primaryPhoto, originalPrice, sellingPrice, discountPrice, discountPercentage, likes, size, sizeChart, isToBeDonated, pickupFrom, createdOn $strColumns) values ('".$arrProduct['userId']."', '".$arrProduct['productTitle']."', '".$arrProduct['condition']."', '".$arrProduct['productDescription']."', '".$arrProduct['brandId']."', '".$arrProduct['categoryId']."', '".$arrProduct['subcategoryId']."', '" . $productImage1 . "', '" .$arrProduct['originalPrice'] . "', '" .$arrProduct['sellingPrice'] . "', '" .$arrProduct['discountPrice'] . "', '" .$arrProduct['discountPercentage'] . "', '0', '".$arrProduct['size']."', '".$arrProduct['sizeChart']."', '".$arrProduct['toBeDonated']."', '".$arrProduct['pickupFrom']."', '" . date("Y-m-d H:i:s") . "' $strColumnValues )";
			$result = mysql_query($query);
				
			if($result) {
				$query = "select productId from tbl_products where productTitle='".$arrProduct['productTitle']."' AND userId='" .$arrProduct['userId']."'";
				$result = mysql_query($query);
					
				while($row = mysql_fetch_assoc($result)) {
					$productId = $row['productId'];
				}
				
				$query = "select userId from tbl_user_kyc_details where userId='" .$arrProduct['userId']."'";
				$result2 = mysql_query($query);
				
				if( 0 < mysql_num_rows($result2) ) {
					$response['data']['KYC'] = TRUE;
				} else {
					$response['data']['KYC'] = FALSE;
				}
                
                if($productImage2 != '') {
                    $query = "insert into tbl_product_images (productId, photo) values ('".$productId."', '".$productImage2."')";
                    $result = mysql_query($query);
                }
                if($productImage3 != '') {
                    $query = "insert into tbl_product_images (productId, photo) values ('".$productId."', '".$productImage3."')";
                    $result = mysql_query($query);
                }
                if($productImage4 != '') {
                    $query = "insert into tbl_product_images (productId, photo) values ('".$productId."', '".$productImage4."')";
                    $result = mysql_query($query);
                }
                if($productImage5 != '') {
                    $query = "insert into tbl_product_images (productId, photo) values ('".$productId."', '".$productImage5."')";
                    $result = mysql_query($query);
                }
				
				$response['success'] = TRUE;
				$response['data']['status'] = '1';  	//	Successful
				$response['data']['productId'] = $productId;
			}
            else {
                if($productImage1 != '') {
                    $fileUploader -> deleteFile('../' .$productImage1);
                }
                if($productImage2 != '') {
                    $fileUploader -> deleteFile('../' .$productImage2);
                }
                if($productImage3 != '') {
                    $fileUploader -> deleteFile('../' .$productImage3);
                }
                if($productImage4 != '') {
                    $fileUploader -> deleteFile('../' .$productImage4);
                }
                if($productImage5 != '') {
                    $fileUploader -> deleteFile('../' .$productImage5);
                }
				
				$response['success'] = FALSE;
				$response['data']['error'] = 'Failed to insert Product';
			}
		} else {
			$response['success'] = FALSE;
			$response['data']['error'] = $uploadResponse['message'];
		}
		
		echo json_encode($response);
	}
	
	function productDetails( $arrmixData ) {
		
		$response = array();
		$response['success'] = false;
		$response['data'] = array();
		
		$intProductId = $arrmixData['productId'];
		$userId = $_REQUEST['userId'];
		
		if($userId) {
			$query = "select p.productId, p.categoryId, p.subcategoryId, p.sellingPrice, p.brandId, p.userId, p.isToBeDonated, p.pickupFrom, p.isPurchased, p.isApproved, p.condition, p.size, p.sizeChart, height, length, (select count(productCommentId) from tbl_product_comments fc where fc.productId = p.productId) as comments, productTitle, p.size, primaryPhoto, productDescription, p.createdOn, u.profilePicURL, u.username, u.firstName, u.lastName, u.city as userLocation, b.Name as brand, CASE WHEN c.categoryId IS NULL THEN '' else c.name END as 'category', CASE WHEN c1.categoryId IS NULL THEN '' else c1.name END as 'subcategory', originalPrice, discountPrice, discountPercentage, likes, CASE WHEN u.profilePicURL IS NULL THEN '' else u.profilePicURL END as 'profilePicURL', CASE WHEN pl.productLikeId IS NULL THEN 0 else 1 END as 'isLiked', CASE WHEN uw.userWantId IS NULL THEN 0 else 1 END as 'isAddedToWant',  CASE WHEN pc.productCommentId IS NULL THEN 0 else 1 END as 'isCommented', CASE WHEN pt.productTagId IS NULL THEN 0 else 1 END as 'isTagged' from tbl_products p INNER JOIN tbl_brands b ON b.brandId = p.brandId INNER JOIN tbl_users u on u.userId = p.userId LEFT JOIN tbl_categories c on p.CategoryId = c.categoryId LEFT JOIN tbl_categories c1 on p.subcategoryId = c1.categoryId LEFT JOIN tbl_product_likes pl on pl.productId = p.productId and pl.userId = $userId LEFT JOIN tbl_user_wants uw on uw.productId = p.productId and uw.userId = $userId LEFT JOIN tbl_product_comments pc on pc.productId = p.productId and pc.userId = $userId LEFT JOIN tbl_product_tags pt on pt.productId = p.productId and pt.taggedUserId = $userId where p.productId = $intProductId GROUP BY p.productId";
		} else {
			$query = "select p.productId, p.categoryId, p.subcategoryId, p.sellingPrice, p.brandId, p.userId, p.isToBeDonated, p.pickupFrom, p.isPurchased, p.isApproved, p.condition, p.size, p.sizeChart, height, length, (select count(productCommentId) from tbl_product_comments fc where fc.productId = p.productId) as comments, productTitle, p.size, primaryPhoto, productDescription, p.createdOn, u.profilePicURL, u.username, u.firstName, u.lastName, u.city as userLocation, b.Name as brand, CASE WHEN c.categoryId IS NULL THEN '' else c.name END as 'category', CASE WHEN c1.categoryId IS NULL THEN '' else c1.name END as 'subcategory', originalPrice, discountPrice, discountPercentage, likes, 0 as 'isCommented', 0 as 'isTagged', CASE WHEN u.profilePicURL IS NULL THEN '' else u.profilePicURL END as 'profilePicURL' from tbl_products p INNER JOIN tbl_brands b ON b.brandId = p.brandId INNER JOIN tbl_users u on u.userId = p.userId LEFT JOIN tbl_product_likes pl on pl.productId = p.productId and pl.userId = p.userId LEFT JOIN tbl_categories c on p.CategoryId = c.categoryId LEFT JOIN tbl_categories c1 on p.subcategoryId = c1.categoryId where p.productId = $intProductId";
		}
		
		$result = mysql_query($query);
        
		
		if($result) {
			$response['success'] = TRUE;
		
			while($row = mysql_fetch_assoc($result)){
		
				$row['timestamp'] = $this->relativeDate($row['createdOn']);
		
				$query = "select photo from tbl_product_images where productId = ". $row['productId'];
				$result1 = mysql_query($query);
		
				$count = 2;
		
				if( false == is_null( $row['primaryPhoto'] ) ) {
					$row['photos'][ 'productImage1' ] = $row['primaryPhoto'];
				} else {
					$row['photos'][ 'productImage1' ] = '';
				}
		
				if( $result1 ) {
					while($row1 = mysql_fetch_assoc($result1)){
						$row['photos'][ 'productImage' . $count ] = $row1['photo'];
						$count++;
					}
				}
		
				$row['isLiked'] = $userId?$row['isLiked']:0;
				
				if($row['isLiked'] == 1) {
					$row['likes'] = $row['likes'] - 1;
				}
				
				$row['isAddedToWant'] = $userId?$row['isAddedToWant']:0;
				
				$row['KYC'] = FALSE;
				
				$sql = "select userId from tbl_user_kyc_details WHERE userId = '" . $row['userId'] . "'";
				if(mysql_num_rows(mysql_query($sql)) > 0) {
					$row['KYC'] = TRUE;
				}
                
				array_push($response['data'], $row);
			}
		}
		else {
			$response['success'] = FALSE;
		}
		
		echo json_encode($response);
	}
	
	function updateProductDetailsBK( $arrProduct ) {
        require_once("../classes/FileUploader.php");
        $fileUploader = new FileUploader();
        
		$response = array();
		$response['success'] = false;
		$response['data'] = array();
        
        $successProductImage1 = TRUE;
        $successProductImage2 = TRUE;
        $successProductImage3 = TRUE;
        $successProductImage4 = TRUE;
        $successProductImage5 = TRUE;
        
        
        $productImage1 = '';
        
        if( true == isset($_FILES['productImage1'])) {
            $productImage1 = 'uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_1'.$_FILES['productImage1']['name'];
            $imagePathToUpload = '../uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_1';
            
            $extensionsAllowed = array("jpg", "jpeg", "png", "gif", "bmp");
            
            $uploadResponse = $fileUploader -> uploadFile($_FILES['productImage1'], $imagePathToUpload, $extensionsAllowed, 10, 1000, 1000);
            $successProductImage1 = $uploadResponse['success'];
        }
        
        
        
        $productImage2 = '';
        
        if( true == isset($_FILES['productImage2'])) {
            $productImage2 = 'uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_2'.$_FILES['productImage2']['name'];
            $imagePathToUpload = '../uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_2';
            
            $extensionsAllowed = array("jpg", "jpeg", "png", "gif", "bmp");
            
            $uploadResponse = $fileUploader -> uploadFile($_FILES['productImage2'], $imagePathToUpload, $extensionsAllowed, 10, 1000, 1000);
            $successProductImage2 = $uploadResponse['success'];
        }
        
        
        $productImage3 = '';
        
        if( true == isset($_FILES['productImage3'])) {
            $productImage3 = 'uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_3'.$_FILES['productImage3']['name'];
            $imagePathToUpload = '../uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_3';
            
            $extensionsAllowed = array("jpg", "jpeg", "png", "gif", "bmp");
            
            $uploadResponse = $fileUploader -> uploadFile($_FILES['productImage3'], $imagePathToUpload, $extensionsAllowed, 10, 1000, 1000);
            $successProductImage3 = $uploadResponse['success'];
        }
        
        
        $productImage4 = '';
        
        if( true == isset($_FILES['productImage4'])) {
            $productImage4 = 'uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_4'.$_FILES['productImage4']['name'];
            $imagePathToUpload = '../uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_4';
            
            $extensionsAllowed = array("jpg", "jpeg", "png", "gif", "bmp");
            
            $uploadResponse = $fileUploader -> uploadFile($_FILES['productImage4'], $imagePathToUpload, $extensionsAllowed, 10, 1000, 1000);
            $successProductImage4 = $uploadResponse['success'];
        }
        
        
        $productImage5 = '';
        
        if( true == isset($_FILES['productImage5'])) {
            $productImage5 = 'uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_5'.$_FILES['productImage5']['name'];
            $imagePathToUpload = '../uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_5';
            
            $extensionsAllowed = array("jpg", "jpeg", "png", "gif", "bmp");
            
            $uploadResponse = $fileUploader -> uploadFile($_FILES['productImage5'], $imagePathToUpload, $extensionsAllowed, 10, 1000, 1000);
            $successProductImage5 = $uploadResponse['success'];
        }
        
        
        if($successProductImage1 && $productImage1 != '') {
            $query = "select primaryPhoto from tbl_products where productId = " . $arrProduct['productId'];
            $result = mysql_query($query);
            if($result) {
                while($row = mysql_fetch_assoc($result)) {
                    $fileUploader -> deleteFile('../' . $row['primaryPhoto']);
                }
            }
        }
        
        if(!$successProductImage1 || !$successProductImage2 || !$successProductImage3 || !$successProductImage4 || !$successProductImage5) {
            if(!$successProductImage1) {
                $fileUploader -> deleteFile('../' .$productImage1);
            }
            if(!$successProductImage2) {
                $fileUploader -> deleteFile('../' .$productImage2);
            }
            if(!$successProductImage3) {
                $fileUploader -> deleteFile('../' .$productImage3);
            }
            if(!$successProductImage4) {
                $fileUploader -> deleteFile('../' .$productImage4);
            }
            if(!$successProductImage5) {
                $fileUploader -> deleteFile('../' .$productImage4);
            }
            $response['success'] = FALSE;
        }
        else {
            $strColumns = '';
            $strColumnValues = '';
            
            $strColumns = ', height, length ';
            if($arrProduct['sizeChart'] == 'E') {
                $strColumnValues = ", '".$arrProduct['height']."', '".$arrProduct['length']."'";
            }
            else {
                $strColumnValues = ", '', ''";
            }
            
            if( true == isset($_FILES['productImage1'])) {
                $query = "update tbl_products set productTitle = '".$arrProduct['productTitle']."', `condition` = '".$arrProduct['condition']."', primaryPhoto = '".$productImage1."', productDescription = '".$arrProduct['productDescription']."', brandId = '".$arrProduct['brandId']."', categoryId = '".$arrProduct['categoryId']."', subcategoryId = '".$arrProduct['subcategoryId']."', originalPrice = '".$arrProduct['originalPrice']."', discountPrice = '".$arrProduct['discountPrice']."', discountPercentage = '".$arrProduct['discountPercentage']."', sellingPrice = '".$arrProduct['sellingPrice']."', height='".$arrProduct['height']."', length='".$arrProduct['length']."', size='".$arrProduct['size']."', sizeChart='".$arrProduct['sizeChart']."', isToBeDonated='".$arrProduct['toBeDonated']."', pickupFrom='".$arrProduct['pickupFrom']."' where productId='".$arrProduct['productId']."'";
            } else {
                $query = "update tbl_products set productTitle = '".$arrProduct['productTitle']."', `condition` = '".$arrProduct['condition']."', productDescription = '".$arrProduct['productDescription']."', brandId = '".$arrProduct['brandId']."', categoryId = '".$arrProduct['categoryId']."', subcategoryId = '".$arrProduct['subcategoryId']."', originalPrice = '".$arrProduct['originalPrice']."', discountPrice = '".$arrProduct['discountPrice']."', discountPercentage = '".$arrProduct['discountPercentage']."', sellingPrice = '".$arrProduct['sellingPrice']."', height='".$arrProduct['height']."', length='".$arrProduct['length']."', size='".$arrProduct['size']."', sizeChart='".$arrProduct['sizeChart']."', isToBeDonated='".$arrProduct['toBeDonated']."', pickupFrom='".$arrProduct['pickupFrom']."' where productId='".$arrProduct['productId']."'";
            }
            $result = mysql_query($query);
            
            
            
            if($result) {
                $productImages = array();
                $productImages['productImage2'] = '';
                $productImages['productImage3'] = '';
                $productImages['productImage4'] = '';
                $productImages['productImage5'] = '';
                
                
                $query = "select photo from tbl_product_images where productId = " . $arrProduct['productId'] . "";
                $result = mysql_query($query);
                if($result) {
                    $i = 2;
                    while($row = mysql_fetch_assoc($result)) {
                        $productImages['productImage'+$i] = $row['photo'];
                        $i++;
                    }
                    
                    if($i > 2) {
                        if(!isset($_FILES['productImage2']) && !isset($_REQUEST['productImage2']) && $productImages['productImage2'] != '') {
                           $query = "delete from tbl_product_images where photo='".$productImages['productImage2']."' and productId='".$arrProduct['productId']."'";
                           mysql_query($query);
                           $fileUploader -> deleteFile('../' . $productImages['productImage2']);
                        }
                           
                        if(!isset($_FILES['productImage3']) && !isset($_REQUEST['productImage3']) && $productImages['productImage3'] != '') {
                           $query = "delete from tbl_product_images where photo='".$productImages['productImage3']."' and productId='".$arrProduct['productId']."'";
                           mysql_query($query);
                           $fileUploader -> deleteFile('../' . $productImages['productImage3']);
                        }
                              
                        if(!isset($_FILES['productImage4']) && !isset($_REQUEST['productImage4']) && $productImages['productImage4'] != '') {
                           $query = "delete from tbl_product_images where photo='".$productImages['productImage4']."' and productId='".$arrProduct['productId']."'";
                           mysql_query($query);
                           $fileUploader -> deleteFile('../' . $productImages['productImage4']);
                        }
                                 
                        if(!isset($_FILES['productImage5']) && !isset($_REQUEST['productImage5']) && $productImages['productImage5'] != '') {
                           $query = "delete from tbl_product_images where photo='".$productImages['productImage5']."' and productId='".$arrProduct['productId']."'";
                           mysql_query($query);
                           $fileUploader -> deleteFile('../' . $productImages['productImage5']);
                        }
                    }
                }
                
                if($successProductImage2 && $productImage2 != '') {
                    $query = "insert into tbl_product_images (photo, productId) values('".$productImage2."', '".$arrProduct['productId']."')";
                    mysql_query($query);
                }
                
                if($successProductImage3 && $productImage3 != '') {
                    $query = "insert into tbl_product_images (photo, productId) values('".$productImage3."', '".$arrProduct['productId']."')";
                    mysql_query($query);
                }
                
                if($successProductImage4 && $productImage4 != '') {
                    $query = "insert into tbl_product_images (photo, productId) values('".$productImage4."', '".$arrProduct['productId']."')";
                    mysql_query($query);
                }
                
                if($successProductImage5 && $productImage5 != '') {
                    $query = "insert into tbl_product_images (photo, productId) values('".$productImage5."', '".$arrProduct['productId']."')";
                    mysql_query($query);
                }
                
                $response['success'] = true;
                $response['data']['status'] = '1';
            } else {
                $response['data']['status'] = '2';
            }
        }
		
		echo json_encode($response);
	}
	
	function updateProductDetails( $arrProduct ) {
		if(isset($_FILES['productImage2'])) {
			if($_FILES['productImage2']['size'] == 0) {
				unset($_FILES['productImage2']);
			}
		}
		if(isset($_FILES['productImage3'])) {
			if($_FILES['productImage3']['size'] == 0) {
				unset($_FILES['productImage3']);
			}
		}
		if(isset($_FILES['productImage4'])) {
			if($_FILES['productImage4']['size'] == 0) {
				unset($_FILES['productImage4']);
			}
		}
		if(isset($_FILES['productImage5'])) {
			if($_FILES['productImage5']['size'] == 0) {
				unset($_FILES['productImage5']);
			}
		}
		
        require_once("../classes/FileUploader.php");
        $fileUploader = new FileUploader();
		
		$response = array();
		$response['success'] = false;
		$response['data'] = array();
        
        $successProductImage1 = TRUE;
        $successProductImage2 = TRUE;
        $successProductImage3 = TRUE;
        $successProductImage4 = TRUE;
        $successProductImage5 = TRUE;
        
        
		$serverPath = 'http://stylflip.com/stylflip/';
		$serverPath = 'http://localhost/sf/server/';
		
        $productImage1 = '';
        
		if(isset($_REQUEST['productImage1'])) {
			$productImage1 = str_replace($serverPath, '', $_REQUEST['productImage1']);
			$successProductImage1 = true;
		}
		else if( true == isset($_FILES['productImage1'])) {
            $productImage1 = 'uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_1'.$_FILES['productImage1']['name'];
            $imagePathToUpload = '../uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_1';
            
            $extensionsAllowed = array("jpg", "jpeg", "png", "gif", "bmp");
            
            $uploadResponse = $fileUploader -> uploadFile($_FILES['productImage1'], $imagePathToUpload, $extensionsAllowed, 10, 1000, 1000);
            $successProductImage1 = $uploadResponse['success'];
        }
		
        
        $productImage2 = '';
        
        if(isset($_REQUEST['productImage2'])) {
			$productImage2 = str_replace($serverPath, '', $_REQUEST['productImage2']);
			$successProductImage2 = true;
		}
		else if( true == isset($_FILES['productImage2'])) {
            $productImage2 = 'uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_2'.$_FILES['productImage2']['name'];
            $imagePathToUpload = '../uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_2';
            
            $extensionsAllowed = array("jpg", "jpeg", "png", "gif", "bmp");
            
            $uploadResponse = $fileUploader -> uploadFile($_FILES['productImage2'], $imagePathToUpload, $extensionsAllowed, 10, 1000, 1000);
            $successProductImage2 = $uploadResponse['success'];
        }
        
        
        $productImage3 = '';
        
        if(isset($_REQUEST['productImage3'])) {
			$productImage3 = str_replace($serverPath, '', $_REQUEST['productImage3']);
			$successProductImage3 = true;
		}
		else if( true == isset($_FILES['productImage3'])) {
            $productImage3 = 'uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_3'.$_FILES['productImage3']['name'];
            $imagePathToUpload = '../uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_3';
            
            $extensionsAllowed = array("jpg", "jpeg", "png", "gif", "bmp");
            
            $uploadResponse = $fileUploader -> uploadFile($_FILES['productImage3'], $imagePathToUpload, $extensionsAllowed, 10, 1000, 1000);
            $successProductImage3 = $uploadResponse['success'];
        }
        
        
        $productImage4 = '';
        
        if(isset($_REQUEST['productImage4'])) {
			$productImage4 = str_replace($serverPath, '', $_REQUEST['productImage4']);
			$successProductImage4 = true;
		}
		else if( true == isset($_FILES['productImage4'])) {
            $productImage4 = 'uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_4'.$_FILES['productImage4']['name'];
            $imagePathToUpload = '../uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_4';
            
            $extensionsAllowed = array("jpg", "jpeg", "png", "gif", "bmp");
            
            $uploadResponse = $fileUploader -> uploadFile($_FILES['productImage4'], $imagePathToUpload, $extensionsAllowed, 10, 1000, 1000);
            $successProductImage4 = $uploadResponse['success'];
        }
        
        
        $productImage5 = '';
        
        if(isset($_REQUEST['productImage5'])) {
			$productImage5 = str_replace($serverPath, '', $_REQUEST['productImage5']);
			$successProductImage5 = true;
		}
		else if( true == isset($_FILES['productImage5'])) {
            $productImage5 = 'uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_5'.$_FILES['productImage5']['name'];
            $imagePathToUpload = '../uploads/productPics/thumbnails/'.$arrProduct['userId'].'_'.'thumbnail_5';
            
            $extensionsAllowed = array("jpg", "jpeg", "png", "gif", "bmp");
            
            $uploadResponse = $fileUploader -> uploadFile($_FILES['productImage5'], $imagePathToUpload, $extensionsAllowed, 10, 1000, 1000);
            $successProductImage5 = $uploadResponse['success'];
        }
		
		
        if(!$successProductImage1 || !$successProductImage2 || !$successProductImage3 || !$successProductImage4 || !$successProductImage5) {
            if(!isset($_REQUEST['productImage1']) && !$successProductImage1) {
                $fileUploader -> deleteFile('../' .$productImage1);
            }
            if(!isset($_REQUEST['productImage2']) && !$successProductImage2) {
                $fileUploader -> deleteFile('../' .$productImage2);
            }
            if(!isset($_REQUEST['productImage3']) && !$successProductImage3) {
                $fileUploader -> deleteFile('../' .$productImage3);
            }
            if(!isset($_REQUEST['productImage4']) && !$successProductImage4) {
                $fileUploader -> deleteFile('../' .$productImage4);
            }
            if(!isset($_REQUEST['productImage5']) && !$successProductImage5) {
                $fileUploader -> deleteFile('../' .$productImage5);
            }
            $response['success'] = FALSE;
        }
        else {
            $strColumns = '';
            $strColumnValues = '';
            
            $strColumns = ', height, length ';
            if($arrProduct['sizeChart'] == 'E') {
                $strColumnValues = ", '".$arrProduct['height']."', '".$arrProduct['length']."'";
            }
            else {
                $strColumnValues = ", '', ''";
            }
			
			if(!isset($_REQUEST['productImage1']) && $successProductImage1 && $productImage1 != '') {
	            $query = "select primaryPhoto from tbl_products where productId = " . $arrProduct['productId'];
	            $result = mysql_query($query);
	            if($result) {
	                while($row = mysql_fetch_assoc($result)) {
	                    $fileUploader -> deleteFile('../' . $row['primaryPhoto']);
	                }
	            }
	        }
            
			if(isset($_REQUEST['admin'])) {
				if( true == isset($_FILES['productImage1'])) {
					$query = "update tbl_products set productTitle='".$arrProduct['title']."', productDescription='".$arrProduct['description']."', brandId='".$arrProduct['brandId']."', `condition`='".$arrProduct['condition']."', primaryPhoto = '".$productImage1."' where productId='".$arrProduct['productId']."'";
	            } else {
	                $query = "update tbl_products set productTitle='".$arrProduct['title']."', productDescription='".$arrProduct['description']."', brandId='".$arrProduct['brandId']."', `condition`='".$arrProduct['condition']."' where productId='".$arrProduct['productId']."'";
	            }
			}
			else {
				if( true == isset($_FILES['productImage1'])) {
	                $query = "update tbl_products set productTitle = '".$arrProduct['productTitle']."', `condition` = '".$arrProduct['condition']."', primaryPhoto = '".$productImage1."', productDescription = '".$arrProduct['productDescription']."', brandId = '".$arrProduct['brandId']."', categoryId = '".$arrProduct['categoryId']."', subcategoryId = '".$arrProduct['subcategoryId']."', originalPrice = '".$arrProduct['originalPrice']."', discountPrice = '".$arrProduct['discountPrice']."', discountPercentage = '".$arrProduct['discountPercentage']."', sellingPrice = '".$arrProduct['sellingPrice']."', height='".$arrProduct['height']."', length='".$arrProduct['length']."', size='".$arrProduct['size']."', sizeChart='".$arrProduct['sizeChart']."', isToBeDonated='".$arrProduct['toBeDonated']."', pickupFrom='".$arrProduct['pickupFrom']."' where productId='".$arrProduct['productId']."'";
	            } else {
	                $query = "update tbl_products set productTitle = '".$arrProduct['productTitle']."', `condition` = '".$arrProduct['condition']."', productDescription = '".$arrProduct['productDescription']."', brandId = '".$arrProduct['brandId']."', categoryId = '".$arrProduct['categoryId']."', subcategoryId = '".$arrProduct['subcategoryId']."', originalPrice = '".$arrProduct['originalPrice']."', discountPrice = '".$arrProduct['discountPrice']."', discountPercentage = '".$arrProduct['discountPercentage']."', sellingPrice = '".$arrProduct['sellingPrice']."', height='".$arrProduct['height']."', length='".$arrProduct['length']."', size='".$arrProduct['size']."', sizeChart='".$arrProduct['sizeChart']."', isToBeDonated='".$arrProduct['toBeDonated']."', pickupFrom='".$arrProduct['pickupFrom']."' where productId='".$arrProduct['productId']."'";
	            }
			}
			
            $result = mysql_query($query);
            
            if($result) {
                $productImages = array();
                
				if($productImage2 != '') {
					array_push($productImages, $productImage2);
				}
				if($productImage3 != '') {
					array_push($productImages, $productImage3);
				}
				if($productImage4 != '') {
					array_push($productImages, $productImage4);
				}
				if($productImage5 != '') {
					array_push($productImages, $productImage5);
				}
				
				$query = "select photo from tbl_product_images where productId = " . $arrProduct['productId'] . "";
                $result = mysql_query($query);
				
				/*while($row = mysql_fetch_assoc($result)) {
					if(!in_array($row['photo'], $productImages)) {
						$fileUploader -> deleteFile('../' . $row['photo']);
					}
				}*/

				$query = "delete from tbl_product_images where productId = " . $arrProduct['productId'] . "";
               	mysql_query($query);
			
				for($i=0; $i<count($productImages); $i++) {
					$query = "insert into tbl_product_images (photo, productId) values('".$productImages[$i]."', '".$arrProduct['productId']."')";
                	mysql_query($query);
				}
				
				if(isset($_REQUEST['admin'])) {
					$this -> setMessage("Product details have been updated successfully");
				}
				else {
				 	$response['success'] = true;
                	$response['data']['status'] = '1';
				}
            } else {
            	if(isset($_REQUEST['admin'])) {
            		$this -> setMessage("Failed to update product details");
        		}
				else {
					$response['data']['status'] = '2';
				}
            }
        }
		
		if(isset($_REQUEST['admin'])) {
			$page = isset($arrProduct['page']) ? '?page=' . $arrProduct['page'] : '';
			header("Location:../sf_admin_control-panel/viewProducts.php" . $page);
		}
		else {
			echo json_encode($response);
		}
	}
	
	
	function listing( $userId, $index, $limit, $searchText, $strSortBy, $brands, $categories, $subcategories, $sizes, $conditions, $priceRange ) {
		
		$response = array();
		$response['success'] = false;
		$response['data'] = array();
		$arrFilter = array();
		
		$strWhere = '';
		$strOrderBy = '';
		
		if(true == empty($index)) { $index = 0; }
		if(true == empty($limit)) { $limit = 20; }
		
		if(false == empty($searchText)) {
			$strWhere = " AND ( p.productTitle LIKE '%" . $searchText . "%' OR p.productDescription LIKE '%" . $searchText . "%' OR u.username LIKE '%" . $searchText . "%' OR firstName LIKE '%" . $searchText . "%' OR lastName LIKE '%" . $searchText . "%' )";
		}
		
		if( true == isset( $strSortBy ) && false == empty( $strSortBy ) ) {
			if( 'price - high to low' == strtolower( $strSortBy ) ) {
				$strOrderBy = ' Order By discountPrice DESC';
			} else if( 'price - low to high' == strtolower( $strSortBy ) ) {
				$strOrderBy = ' Order By discountPrice ASC';
			} else if( 'popularity' == strtolower( $strSortBy ) ) {
				$strOrderBy = ' Order By p.likes DESC';
			} else if( 'discounts' == strtolower( $strSortBy ) ) {
				$strOrderBy = ' Order By discountPercentage DESC';
			} 
		} else {
			$strOrderBy = ' order by p.approvalDate desc';
		}
		
		if( true == isset( $brands ) && false == empty( $brands ) ) {
			$strWhere .= " AND p.brandId IN ( $brands )";
		}
		
		if(false == empty($categories)) {
			$strWhere .= " AND p.categoryId IN ( $categories ) ";
		} 
		
		if(false == empty($subcategories)) {
			$strWhere .= " AND p.subcategoryId IN ( $subcategories ) ";
		}

		if(false == empty($sizes)) {
			$strSizes = array();
			$strSizes = explode(',', $sizes);
			for($i=0; $i<count($strSizes); $i++) {
				$strSizes[$i] = "'" . $strSizes[$i] . "'";
			}
			$strWhere .= " AND p.size IN ( ". implode(',', $strSizes) ." ) ";
		}
		
		if(false == empty($conditions)) {
			$arrConditions = explode( ',', $conditions );
			$strWhere .= " AND p.condition IN ('" . implode( "', '", $arrConditions ) .  "')";
		}
        
        if(false == empty($priceRange)) {
        	if($priceRange == 'Less than 500') {
        		$strWhere .= " AND p.discountPrice < 500";
        	}
			else if($priceRange == '4000 and above') {
        		$strWhere .= " AND p.discountPrice >= 4000";
        	}
			else {
				$arrPriceRange = array();
            	$arrPriceRange = explode( '-', $priceRange );
				$strWhere .= " AND p.discountPrice between $arrPriceRange[0] and $arrPriceRange[1]";
			}
        }
		
		$index = $index * $limit;
		
		// if($userId) {
			// $query = "select p.productId, p.userId, p.condition, p.sellingPrice, p.isPurchased, (select count(productCommentId) from tbl_product_comments fc where fc.productId = p.productId) as comments, productTitle, p.size, p.sizeChart, primaryPhoto, productDescription, p.createdOn, u.profilePicURL, u.username, u.city as userLocation, b.Name as brand, CASE WHEN c.categoryId IS NULL THEN '' else c.name END as 'category', CASE WHEN c1.categoryId IS NULL THEN '' else c1.name END as 'subcategory', originalPrice, discountPrice, discountPercentage, likes, CASE WHEN u.profilePicURL IS NULL THEN '' else u.profilePicURL END as 'profilePicURL', CASE WHEN pl.productLikeId IS NULL THEN 0 else 1 END as 'isLiked' from tbl_products p INNER JOIN tbl_brands b ON b.brandId = p.brandId INNER JOIN tbl_users u on u.userId = p.userId and u.isActive = 1 LEFT JOIN tbl_categories c on c.categoryId = p.categoryId  LEFT JOIN tbl_categories c1 on c1.categoryId = p.subcategoryId LEFT JOIN tbl_product_likes pl on pl.productId = p.productId and pl.userId = $userId where p.isApproved = 1 and p.isPurchased = 0 $strWhere $strOrderBy LIMIT $index, $limit";
		// } else {
			// $query = "select p.productId, p.userId, p.condition, p.sellingPrice, p.isPurchased, (select count(productCommentId) from tbl_product_comments fc where fc.productId = p.productId) as comments, productTitle, p.size, p.sizeChart, primaryPhoto, productDescription, p.createdOn, u.profilePicURL, u.username, u.city as userLocation, b.Name as brand, CASE WHEN c.categoryId IS NULL THEN '' else c.name END as 'category', CASE WHEN c1.categoryId IS NULL THEN '' else c1.name END as 'subcategory', originalPrice, discountPrice, discountPercentage, likes, CASE WHEN u.profilePicURL IS NULL THEN '' else u.profilePicURL END as 'profilePicURL' from tbl_products p INNER JOIN tbl_brands b ON b.brandId = p.brandId INNER JOIN tbl_users u on u.userId = p.userId and u.isActive = 1 LEFT JOIN tbl_product_likes pl on pl.productId = p.productId and pl.userId = p.userId LEFT JOIN tbl_categories c on c.categoryId = p.categoryId LEFT JOIN tbl_categories c1 on c1.categoryId = p.subcategoryId where p.isApproved = 1  and p.isPurchased = 0 $strWhere $strOrderBy LIMIT $index, $limit";
		// }
		
		if($userId) {
			$query = "select p.productId, p.userId, p.condition, p.sellingPrice, p.isPurchased, (select count(productCommentId) from tbl_product_comments fc where fc.productId = p.productId) as comments, productTitle, p.size, p.sizeChart, primaryPhoto, productDescription, p.createdOn, u.profilePicURL, u.username, u.city as userLocation, b.Name as brand, CASE WHEN c.categoryId IS NULL THEN '' else c.name END as 'category', CASE WHEN c1.categoryId IS NULL THEN '' else c1.name END as 'subcategory', originalPrice, discountPrice, discountPercentage, likes, CASE WHEN u.profilePicURL IS NULL THEN '' else u.profilePicURL END as 'profilePicURL', CASE WHEN pl.productLikeId IS NULL THEN 0 else 1 END as 'isLiked' from tbl_products p INNER JOIN tbl_brands b ON b.brandId = p.brandId INNER JOIN tbl_users u on u.userId = p.userId and u.isActive = 1 LEFT JOIN tbl_categories c on c.categoryId = p.categoryId  LEFT JOIN tbl_categories c1 on c1.categoryId = p.subcategoryId LEFT JOIN tbl_product_likes pl on pl.productId = p.productId and pl.userId = $userId where p.isApproved = 1 $strWhere $strOrderBy LIMIT $index, $limit";
		} else {
			$query = "select p.productId, p.userId, p.condition, p.sellingPrice, p.isPurchased, (select count(productCommentId) from tbl_product_comments fc where fc.productId = p.productId) as comments, productTitle, p.size, p.sizeChart, primaryPhoto, productDescription, p.createdOn, u.profilePicURL, u.username, u.city as userLocation, b.Name as brand, CASE WHEN c.categoryId IS NULL THEN '' else c.name END as 'category', CASE WHEN c1.categoryId IS NULL THEN '' else c1.name END as 'subcategory', originalPrice, discountPrice, discountPercentage, likes, CASE WHEN u.profilePicURL IS NULL THEN '' else u.profilePicURL END as 'profilePicURL' from tbl_products p INNER JOIN tbl_brands b ON b.brandId = p.brandId INNER JOIN tbl_users u on u.userId = p.userId and u.isActive = 1 LEFT JOIN tbl_product_likes pl on pl.productId = p.productId and pl.userId = p.userId LEFT JOIN tbl_categories c on c.categoryId = p.categoryId LEFT JOIN tbl_categories c1 on c1.categoryId = p.subcategoryId where p.isApproved = 1 $strWhere $strOrderBy LIMIT $index, $limit";
		}
		
		$result = mysql_query($query);
		
		if($result) {
			$response['success'] = TRUE;
		
			while($row = mysql_fetch_assoc($result)){	

				$row['timestamp'] = $this->relativeDate($row['createdOn']);
				
				$query = "select photo from tbl_product_images where productId = ". $row['productId'];
				$result1 = mysql_query($query);
				
				$count = 2;
				
				if( false == is_null( $row['primaryPhoto'] ) ) {
					$row['photos'][ 'productImage1' ] = $row['primaryPhoto'];
				} else {
					$row['photos'][ 'productImage1' ] = '';
				}
				
				if( $result1 ) {
					while($row1 = mysql_fetch_assoc($result1)){
						$row['photos'][ 'productImage' . $count ] = $row1['photo'];		
						$count++;
					}
				}
				
				$row['isLiked'] = $userId?$row['isLiked']:0;
				
				array_push($response['data'], $row);
			} 
		}
		else {
			$response['success'] = FALSE;
		}
		
		echo json_encode($response);
		
	}
	
	function like( $userId, $productId ) {
		$response = array();
		$response['success'] = false;
		
		$query = "INSERT INTO tbl_product_likes(userId, productId ) values ( '$userId' , '$productId' )";
		$result = mysql_query($query);
			
		if($result) {
			$query = "update tbl_products set likes = likes + 1 WHERE productId = $productId" ;
			$result = mysql_query($query);
			
			$response['success'] = true;
			$response['data']['status'] = '1';  	//	update successful
		}
		else {
			$response['data']['status'] = '2';  	//	update failed
		}
		
		echo json_encode($response);
        
        if($result) {
            $query = "select userId from tbl_products where productId='".$productId."'";
            $result = mysql_query($query);
            while($row = mysql_fetch_assoc($result)) {
                $toUserId = $row['userId'];
            }
            require_once("../classes/PushNotification.php");
            $pushNotification = new PushNotification();
            $pushNotification -> prepareAndSendNotification($userId, $toUserId, 'social', 'productLike', $productId);
        }
	}
	
	function dislike( $userId, $productId ) {
		$response = array();
		$response['success'] = false;
	
		$query = "DELETE FROM tbl_product_likes WHERE productId = $productId and userId = $userId";
		$result = mysql_query($query);
		
		if($result) {
			
			$query = "update tbl_products set likes = likes - 1 WHERE productId = $productId AND likes > 0" ;
			$result = mysql_query($query);
			
			$response['success'] = true;
			$response['data']['status'] = '1';  	//	update successful
		}
		else {
			$response['data']['status'] = '2';  	//	update failed
		}
	
		echo json_encode($response);
	}
	
	function productInfo( $userId, $productId ) {
		$query = "select p.*, b.Name as brand from tbl_products p INNER JOIN tbl_brands b on b.brandId = p.brandId where productId = $productId";
		echo json_encode($this -> createResponse($query));
	}
	
	function getCategories() {
		$sql = "select * from tbl_categories WHERE parentCategoryId = 0 order by name asc";
		echo json_encode($this -> createResponse($sql));
	}
	
	function getSubcategories( $intCategoryId ) {
		$sql = "select * from tbl_categories WHERE parentCategoryId = $intCategoryId  order by name asc";
		echo json_encode($this -> createResponse($sql));
	}
	
	function approveProduct( $arr ) {
		$productId = $arr['productId'];
		
		$query = "update tbl_products set isApproved = 1, approvalDate = '".date("Y-m-d H:i:s")."' WHERE productId = $productId";
		$result = mysql_query($query);
		
		if($result) {
            $query = "select productTitle, primaryPhoto, userId from tbl_products where productId = $productId";
            $result = mysql_query($query);
            
            while($row = mysql_fetch_assoc($result)) {
                $feedTitle = $row['productTitle'] . ' now for sale';
                $feedImage = $row['primaryPhoto'];
                $userId = $row['userId'];
            }
            
            $this -> setMessage("Product has been updated successfully");
            
            $query = "select feedId from tbl_stylefeed where title = '".$feedTitle."' and productId = $productId";
            $result = mysql_query($query);
			
			if(mysql_num_rows($result) == 0) {
				$query = "insert into tbl_stylefeed (productId, title, lat, lon, city, userId, photo, likes, createdOn) values ('".$productId."', '".$feedTitle."', '0', '0', '', '".$userId."', '" . $feedImage . "', '0', '" . date("Y-m-d H:i:s") . "' )";
	            $result = mysql_query($query);
	            
	            //  Send push notification to device
	            require_once("../classes/PushNotification.php");
	            $pushNotification = new PushNotification();
	            $pushNotification -> prepareAndSendNotification(0, $userId, 'social', 'productApproved', $productId);
			}
		}
		else {
			$this -> setMessage("Failed to update product");
		}
		
		$page = isset($arr['page']) ? '?page=' . $arr['page'] : '';
		header("Location:../sf_admin_control-panel/viewProducts.php" . $page);
		exit;
	}
	
	function rejectProduct( $arr ) {
		$productId = $arr['productId'];
		
		$query = "update tbl_products set isApproved = 2 WHERE productId = $productId";
		$result = mysql_query($query);
	
		if($result) {
            $query = "select productTitle, primaryPhoto, userId from tbl_products where productId = $productId";
            $result = mysql_query($query);
            
            while($row = mysql_fetch_assoc($result)) {
                $feedTitle = $row['productTitle'] . ' now for sale';
                $feedImage = $row['primaryPhoto'];
                $userId = $row['userId'];
            }
            
            $query = "delete from tbl_stylefeed where userId = '".$userId."' and photo = '".$feedImage."' and title = '".$feedTitle."'";
            mysql_query($query);
            
			$this -> setMessage("Product has been updated successfully");
            
            //  Send push notification to device
            require_once("../classes/PushNotification.php");
            $pushNotification = new PushNotification();
            $pushNotification -> prepareAndSendNotification(0, $userId, 'social', 'productRejected', $productId);
		}
		else {
			$this -> setMessage("Failed to update product");
		}
	
		$page = isset($arr['page']) ? '?page=' . $arr['page'] : '';
		header("Location:../sf_admin_control-panel/viewProducts.php" . $page);
		exit;
	}
	
	function setMessage ($message) {
		$_SESSION['message'] = $message;
	}
	
	function relativeDate($timestamp) {
	
		if (!$timestamp){
			return 'N/A';
		}
	
		$timestamp = (int)strtotime($timestamp);
		$difference = time() - $timestamp;
		$periods = array("sec", "min", "hour", "day", "week","month", "year", "decade");
		$lengths = array("60","60","24","7","4.35","12","10");
		$total_lengths = count($lengths);
	
		if ($difference > 0) { // this was in the past
			$ending = "ago";
		} else { // this was in the future
			$difference = -$difference;
			$ending = " from now";
		}
	
		for($j = 0; $difference > $lengths[$j] && $total_lengths > $j; $j++) {
			$difference /= $lengths[$j];
		}
	
		$difference = round($difference);
		if ($difference != 1) {
			$periods[$j].= "s";
		}
	
		$text = "$difference $periods[$j] $ending";
	
		return $text;
	
	}
	
	function addComment( $userId, $productId, $comment ) {
		$response = array();
		$response['success'] = false;
	
		$query = "INSERT INTO tbl_product_comments(userId, productId, comment, createdOn ) values ( '$userId' , '$productId', '$comment', '" . date("Y-m-d H:i:s") . "' )";
		$result = mysql_query($query);
			
		if($result) {
			$response['success'] = true;
			$response['data']['status'] = '1';  	//	update successful
		}
		else {
			$response['data']['status'] = '2';  	//	update failed
		}
	
		echo json_encode($response);
        
        if($result) {
            $query = "select userId from tbl_products where productId='".$productId."'";
            $result = mysql_query($query);
            while($row = mysql_fetch_assoc($result)) {
                $toUserId = $row['userId'];
            }
            require_once("../classes/PushNotification.php");
            $pushNotification = new PushNotification();
            $pushNotification -> prepareAndSendNotification($userId, $toUserId, 'social', 'productComment', $productId, $comment);
        }
	}
	
	function viewComments( $productId, $index, $limit ) {
	
		$response = array();
		$response['success'] = false;
		$response['data'] = array();
	
		if(true == empty($index)) { $index = 0; }
		if(true == empty($limit)) { $limit = 20; }
		
		$index = $index * $limit;
		
		$query = "select p.*, u.username, u.firstName, u.lastName, u.profilePicURL from tbl_product_comments p INNER JOIN tbl_users u on u.userId = p.userId WHERE p.productId = $productId ORDER BY productCommentId DESC LIMIT $index, $limit";
	
		$result = mysql_query($query);
		
		if($result) {
			$response['success'] = TRUE;
		
			while($row = mysql_fetch_assoc($result)){
				$row['timestamp'] = $this->relativeDate($row['createdOn']);
				array_push($response['data'], $row);
			}
		}
		
		echo json_encode( $response );
	
	}
	
	function deleteProduct( $arr ) {
		$intProductId = $arr['productId'];
		
		mysql_query("delete from tbl_product_likes where productId = " . $intProductId);
		mysql_query("delete from tbl_product_comments where productId = " . $intProductId);
		mysql_query("delete from tbl_user_wants where productId = " . $intProductId);
		
		$result = mysql_query("select primaryPhoto from tbl_products where productId = " . $intProductId);
		while($row = mysql_fetch_assoc($result)) {
			unlink('../' . $row['primaryPhoto']);
		}
		
		$result = mysql_query("select photo from tbl_product_images where productId = " . $intProductId);
		while($row = mysql_fetch_assoc($result)) {
			unlink('../' . $row['photo']);
		}
		
		mysql_query("delete from tbl_product_images where productId = " . $intProductId);
		mysql_query("delete from tbl_products where productId = " . $intProductId);
		
		$result = mysql_query("select feedId, photo from tbl_stylefeed where productId = '".$intProductId."'");
		while($row = mysql_fetch_assoc($result)) {
			unlink("../" . $row['photo']);
			
			mysql_query("delete from tbl_feed_comments where feedId = '".$row['feedId']."'");
			mysql_query("delete from tbl_feed_likes where feedId = '".$row['feedId']."'");
			mysql_query("delete from tbl_feed_tags where feedId = '".$row['feedId']."'");
			mysql_query("delete from tbl_hidden_feeds where feedId = '".$row['feedId']."'");
		}
		mysql_query("delete from tbl_stylefeed where productId = '".$intProductId."'");
		
		if(isset($arr['isAdmin'])) {
			$this -> setMessage("Product details have been deleted successfully");
			$page = isset($arr['page']) ? '?page=' . $arr['page'] : '';
		
			if(isset($arr['redirectUrl'])) {
				header("Location:../sf_admin_control-panel/" . $arr['redirectUrl'] . $page);
			}
			else {
				header("Location:../sf_admin_control-panel/viewProducts.php" . $page);
			}
		}
		else {
			$response = array();
			$response['success'] = false;
			$response['data'] = array();
			
			$response['success'] = true;
			$response['data']['status'] = '1';  	//	update successful
			
			echo json_encode($response);
		}
	}
	
	function tagUser( $userId, $productId, $taggedUserId ) {
		$response = array();
		$response['success'] = false;
	
		$query = "INSERT INTO tbl_product_tags(userId, productId, taggedUserId ) values ( '$userId' , '$productId', '$taggedUserId' )";
		$result = mysql_query($query);
	
		if($result) {
            $response['success'] = true;
			$response['data']['status'] = '1';  	//	update successful
		}
		else {
			$response['data']['status'] = '2';  	//	update failed
		}
	
		echo json_encode($response);
        
        //  Send push notification to device
        if($result) {
            require_once("../classes/PushNotification.php");
            $pushNotification = new PushNotification();
            $pushNotification -> prepareAndSendNotification($userId, $taggedUserId, 'social', 'productTag', $productId);
        }
	}
	
	function untagUser( $userId, $productId, $taggedUserId ) {
		$response = array();
		$response['success'] = false;
	
		$query = "DELETE FROM tbl_product_tags WHERE userId = '$userId' AND productId = '$productId' AND taggedUserId = '$taggedUserId'";
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
    
    
    function purchaseProduct( $data ) {
        $response = array();
        $response['data'] = array();
        $response['success'] = false;
        
        // $query = "insert into tbl_orders (buyerId, sellerId, productId, amount, originalPrice, discount, addressLine1, addressLine2, city, landmark, phoneNumber, postCode, state, firstName, lastName, status, orderDate) values ('".$data['buyerId']."', '".$data['sellerId']."', '".$data['productId']."', '".$data['amount']."', '".$data['originalPrice']."', '".$data['discount']."', '".$data['addressLine1']."', '".$data['addressLine2']."', '".$data['city']."', '".$data['landmark']."', '".$data['phoneNumber']."', '".$data['postCode']."', '".$data['state']."', '".$data['firstName']."', '".$data['lastName']."', 'Processing', '".date("d/m/Y")."')";
        
        $query = "insert into tbl_orders (buyerId, sellerId, productId, amount, originalPrice, discount, addressLine1, addressLine2, city, landmark, phoneNumber, postCode, state, firstName, lastName, status, orderDate, transactionId, payUTransactionId, type, payUStatus, paymentMode, cardCategory, amountDebitedByPayU, pgType, bankRefNumber, bankCode, nameOnCard, cardNumber, issuingBank, cardType, errorCode, errorMessage) values ('".$data['buyerId']."', '".$data['sellerId']."', '".$data['productId']."', '".$data['amount']."', '".$data['originalPrice']."', '".$data['discount']."', '".$data['addressLine1']."', '".$data['addressLine2']."', '".$data['city']."', '".$data['landmark']."', '".$data['phoneNumber']."', '".$data['postCode']."', '".$data['state']."', '".$data['firstName']."', '".$data['lastName']."', 'Processing', '".date("d/m/Y")."', '".$data['transactionId']."', '".$data['payUTransactionId']."', '".$data['type']."', '".$data['payUStatus']."', '".$data['paymentMode']."', '".$data['cardCategory']."', '".$data['amountDebitedByPayU']."', '".$data['pgType']."', '".$data['bankRefNumber']."', '".$data['bankCode']."', '".$data['nameOnCard']."', '".$data['cardNumber']."', '".$data['issuingBank']."', '".$data['cardType']."', '".$data['errorCode']."', '".$data['errorMessage']."')";
        
        $result = mysql_query($query);
        
        if($result) {
            if($data['type'] == 'success') {
                $query = "select orderId from tbl_orders order by orderId desc limit 0, 1";
                $result = mysql_query($query);
                
                while($row = mysql_fetch_assoc($result)){
                    $orderId = $row['orderId'];
                }
                
                $query = "update tbl_products set isPurchased = 1 WHERE productId = '".$data['productId']."'";
                $result = mysql_query($query);
                
                if($result) {
                    $response['success'] = true;
                    $response['data']['status'] = 1;
                    $response['data']['orderId'] = $orderId;
                    
                    //  Send push notification to device
                    if($result) {
                        require_once("../classes/PushNotification.php");
                        $pushNotification = new PushNotification();
                        $pushNotification -> prepareAndSendNotification($userId, $data['sellerId'], 'social', 'productPurchase', $data['productId']);
                    }
                }
                
                
                $query = "select p.userId, p.productId, p.productTitle, p.primaryPhoto, u.userId, u.firstName, u.lastName from tbl_products p, tbl_users u where p.productId = '" . $data['productId'] . "' and u.userId = p.userId";
                $result = mysql_query($query);
                
                
                $query = "select userId, productId, productTitle,sellingPrice, primaryPhoto from tbl_products where productId = '" . $data['productId'] . "'";
                $result = mysql_query($query);
                
                while($row = mysql_fetch_assoc($result)) {
                    $sellerId = $row['userId'];
                    $productImage = $row['primaryPhoto'];
                    $productTitle = $row['productTitle'];
                    $sellingPrice = $row['sellingPrice'];
                }
                
                $query = "select userId, firstName, lastName,mobileNumber, email from tbl_users where userId = $sellerId";
                $result = mysql_query($query);
                
                $sellerEmail = '';
                while($row = mysql_fetch_assoc($result)){
                    $sellerName = $row['firstName'] . ' ' . $row['lastName'];
                    $sellerEmail = $row['email'];
                    $sellerPhoneNumber = $row['mobileNumber'];
                }
                
                $query = "select userId, email from tbl_users u where userId = '" . $data['buyerId'] . "'";
                $result = mysql_query($query);
                
                $buyerEmail = '';
                while($row = mysql_fetch_assoc($result)){
                    $buyerEmail = $row['email'];
                }
                
				$query = "select * from tbl_user_addresses where userId='".$sellerId."' ";
				  while($addressesRow = mysql_fetch_assoc($result)){
				  
				  $sellerPickupAddress=  $addressesRow['addressLine1'] . ', ' . $addressesRow['addressLine2'] . ', ' . $addressesRow['landmark'] . ', ' . $addressesRow['state'] . ', ' . $addressesRow['city'] . ', ' . $addressesRow['postCode']; 
                   
                }
				
                require_once("../classes/Mailer.php");
                $mailer = new Mailer();
                
                /*
                 *  Send email to buyer
                 */
                if($buyerEmail != '') {
                    $variables = array(
	                   'orderId' => $orderId,
	                   'buyerName' => $data['firstName'],
	                   'firstName' => $data['firstName'],
	                   'lastName' => $data['lastName'],
	                   'addressLine1' => $data['addressLine1'],
	                   'addressLine2' => $data['addressLine2'],
	                   'landmark' => $data['landmark'],
	                   'city' => $data['city'],
	                   'state' => $data['state'],
	                   'postCode' => $data['postCode'],
	                   'phoneNumber' => $data['phoneNumber'],
	                   'productImage' => $productImage,
	                   'productTitle' => $productTitle,
	                   'sellerName' => $sellerName,
	                   'sellingPrice' => $data['amount']
                   	);
                    $body = $mailer -> getCompiledTemplate('../emailTemplates/orderConfirmationToBuyer.html', $variables);
                    $mailer -> send($buyerEmail, false, 'Your StylFlip order confirmation', $body);
                }
                
                /*
                 *  Send email to seller
                 */
                if($sellerEmail != '') {
                    $variables = array(
	                   'orderId' => $orderId,
	                   'buyerName' => $data['firstName'],
	                   'firstName' => $data['firstName'],
	                   'lastName' => $data['lastName'],
	                   'addressLine1' => $data['addressLine1'],
	                   'addressLine2' => $data['addressLine2'],
	                   'landmark' => $data['landmark'],
	                   'city' => $data['city'],
	                   'state' => $data['state'],
	                   'postCode' => $data['postCode'],
	                   'phoneNumber' => $data['phoneNumber'],
	                   'productImage' => $productImage,
	                   'productTitle' => $productTitle,
	                   'sellerName' => $sellerName,
	                   'sellerPhoneNumber' => $sellerPhoneNumber,
	                   'sellerPickupAddress' => $sellerPickupAddress,
	                   'sellingPrice' => $sellingPrice
                   	);
                    $body = $mailer -> getCompiledTemplate('../emailTemplates/orderConfirmationToSeller.html', $variables);
                    $mailer -> send($sellerEmail, false, 'Congratulations! Your item has just been sold on StylFlip', $body);
                }
            }
            else {
                $response['success'] = false;
            }
        }
        
        echo json_encode($response);
    }
    function updateOrderStatus1( $data ){
	
		$query = "update tbl_orders set status = 'Cancelled' , relist_item ='".$data['relist_item']."' WHERE orderId = '".$data['order_id1']."'";
	//echo $query; die;
		  $result = mysql_query($query);
		  if($data['relist_item']=='Yes'){
		  $query = "update tbl_products set isPurchased = '0' , isApproved = '1'  WHERE productId = '".$data['Product_id']."'";
		 
		  mysql_query($query);
		  } 
		  if($data['relist_item']=='No'){
		  $query = "update tbl_products set isApproved = '0'  WHERE productId = '".$data['Product_id']."'";
		   mysql_query($query);
		  }
		   if($result) {
		   
		    $query = "select p.productId, p.productTitle, p.primaryPhoto, o.productId, o.buyerId, o.sellerId, o.orderId, o.amount from tbl_orders o, tbl_products p where p.productId = o.productId and o.orderId = '".$data['order_id1']."'";
            $result = mysql_query($query);
            
            while($row = mysql_fetch_assoc($result)){
                $buyerId = $row['buyerId'];
				$sellerId = $row['sellerId'];
				$productTitle = $row['productTitle'];
				$productId = $row['productId'];
				$productImage = $row['primaryPhoto'];
				$amount = $row['amount'];
            }
			require_once("../classes/PushNotification.php");
            $pushNotification = new PushNotification();
			
			$sellerMessage = '';
			$buyerMessage = '';
		    switch($data['relist_item']) {
			case 'Yes':
					$buyerMessage = 'Your order ("'.$data['order_id1'].'") has been cancelled and the item has been re-listed into our shop for sale !';
					$sellerMessage = 'Oh no! The buyer has chosen to cancel the order ("'.$data['order_id1'].'"). We are extremely sorry for this and will have your item re-listed in a jiffy!';
				break;
				
			case 'No':
					$buyerMessage = 'Your order ("'.$data['order_id1'].'") has been cancelled. Feel free to get in touch with us for any queries regarding the same';
					$sellerMessage = 'Oh no! The buyer has chosen to cancel the order ("'.$data['order_id1'].'"). Feel free to get in touch with us for any queries regarding the same';
				break;
			
			}
			$query = "select username, email from tbl_users where userId = '".$buyerId."'";
			$result = mysql_query($query);
			while($row = mysql_fetch_assoc($result)) {
				$buyerName = $row['username'];
				$buyerEmail = $row['email'];
			}
			
			$query = "select username, email from tbl_users where userId = '".$sellerId."'";
			$result = mysql_query($query);
			while($row = mysql_fetch_assoc($result)) {
				$sellerName = $row['username'];
				$sellerEmail = $row['email'];
			}

 			require_once("../classes/Mailer.php");
         	$mailer = new Mailer();
			
			switch($data['relist_item']) {
				case 'Yes':
				if($sellerEmail != '') {
						$variables = array(
	                       'orderId' => $data['order_id1'],
	                       'sellerName' => $sellerName,
						   'productTitle' => $productTitle,
	                       'productImage' => $productImage,
	                       'sellingPrice' => $amount
	                   	);
						$body = $mailer -> getCompiledTemplate('../emailTemplates/CancelledOrderToSeller1.html', $variables);
	    	 			$mailer -> send($sellerEmail, false, 'Oh no! Your order has been cancelled by the buyer ', $body);
					}
					
					if($buyerEmail != '') {
						$variables = array(
	                       'orderId' => $data['order_id1'],
	                       'buyerName' => $buyerName,
	                       'sellerName' => $sellerName,
	                       'productTitle' => $productTitle,
	                       'productImage' => $productImage,
	                       'sellingPrice' => $amount
	                   	);
						$body = $mailer -> getCompiledTemplate('../emailTemplates/CancelledOrderToBuyer.html', $variables);
	    	 			$mailer -> send($buyerEmail, false, 'Your Order has been Cancelled!', $body);
					}
				break;
				
				case 'No':
				if($sellerEmail != '') {
						$variables = array(
	                       'orderId' => $data['order_id1'],
	                       'sellerName' => $sellerName,
						   'productTitle' => $productTitle,
	                       'productImage' => $productImage,
	                       'sellingPrice' => $amount
	                   	);
						$body = $mailer -> getCompiledTemplate('../emailTemplates/CancelledOrderToSeller2.html', $variables);
	    	 			$mailer -> send($sellerEmail, false, 'Oh no! Your order has been cancelled by the buyer', $body);
					}
					
					if($buyerEmail != '') {
						$variables = array(
	                        'orderId' => $data['order_id1'],
	                       'buyerName' => $buyerName,
	                       'sellerName' => $sellerName,
	                       'productTitle' => $productTitle,
	                       'productImage' => $productImage,
	                       'sellingPrice' => $amount
	                   	);
						$body = $mailer -> getCompiledTemplate('../emailTemplates/CancelledOrderToBuyer.html', $variables);
	    	 			$mailer -> send($buyerEmail, false, 'Your Order has been Cancelled!', $body);
					}
				break;
				}
			$response['success'] = TRUE;
            $this -> setMessage("Order status has been updated successfully");
        }
        else {
        	$response['success'] = FALSE;
            $this -> setMessage("Failed to update order status");
        }
		
		// $page = isset($data['page']) ? '?page=' . $data['page'] : '';
        // header("Location:../sf_admin_control-panel/manageOrders.php" . $page);
        
        echo json_encode($response);
		header("Location:../sf_admin_control-panel/manageOrders.php?page=" . $data['page'] ."&search_text=". $data['search_text']."&search_text1=". $data['search_text1']);
	}
    function updateOrderStatus( $data ) {
	
    	$response = array();
		
        $query = "update tbl_orders set status = '".$data['status']."' WHERE orderId = '".$data['orderId']."'";
		//echo $query;die;
        $result = mysql_query($query);
        
        if($result) {
            $query = "select p.productId, p.productTitle, p.primaryPhoto, o.productId, o.buyerId, o.sellerId, o.orderId, o.amount from tbl_orders o, tbl_products p where p.productId = o.productId and o.orderId = '".$data['orderId']."'";
            $result = mysql_query($query);
            
            while($row = mysql_fetch_assoc($result)){
                $buyerId = $row['buyerId'];
				$sellerId = $row['sellerId'];
				$productTitle = $row['productTitle'];
				$productId = $row['productId'];
				$productImage = $row['primaryPhoto'];
				$amount = $row['amount'];
            }
			
			/*
			 * 	Send push notifications
			 */ 
			require_once("../classes/PushNotification.php");
            $pushNotification = new PushNotification();
			
			$sellerMessage = '';
			$buyerMessage = '';
			
            switch($data['status']) {
				case 'Processing':
					$buyerMessage = 'Congratulations, your order "'.$data['orderId'].'" has been placed successfully. Track it via the Order Status page. Check your e-mail for more..';
					$sellerMessage = 'Congratulations! Your Item "'.$productTitle.'" has been sold. You will receive an email with pickup details shortly.';
				break;
				case 'Shipped by seller':
					$buyerMessage = 'Your item from order number "'.$data['orderId'].'" has been picked up from the seller and is on its way to us for verificaton.';
					// $sellerMessage = 'Your item "'.$productTitle.'" is on its way to us. Stay tuned and check your email to track its journey to its new wardrobe.';
				break;
				case 'Under QA':
					$buyerMessage = 'Your order "'.$data['orderId'].'" is now with us and we are checking it thoroughly.';
					$sellerMessage = 'Your item "'.$productTitle.'" is now with us and we are checking it thoroughly.';
				break;
				case 'Shipped to buyer':
					$buyerMessage = 'Yay! Your order "'.$data['orderId'].'" has cleared the StylFlip Promise and is on its way to you. Track it by checking the order status page.';
					$sellerMessage = 'Yay! Your item "'.$productTitle.'" has cleared the StylFlip Promise and is on its way to its buyer. You can track it from the "My Sales" section.';
				break;
				case 'Complete':
					$buyerMessage = 'Congratulations! We hope you are happy with your order "'.$data['orderId'].'". Keep flippin\'';
					$sellerMessage = 'Awesome! The buyer has received "'.$productTitle.'" and you should have the money in your account shortly. Keep flippin\'';
				break;
				case 'Rejected by StylFlip':
					$buyerMessage = 'We regret to inform you that your order "'.$data['orderId'].'" has not passed our verification tests. We will refund your money shortly. Feel free to reach out to us in case of any queries.';
					$sellerMessage = 'We regret to inform you that your item "'.$productTitle.'" has not passed our verification tests. Please contact us to arrange for its return :-(';
				break;
				case 'Returned by buyer':
					$buyerMessage = 'Your refund for the order "'.$data['orderId'].'" has been initiated. We apologise for the inconvenience caused and hope to see you flippin\' again soon.';
					// $sellerMessage = 'Sorry. The buyer of "'.$productTitle.'" has decided to return it. We will re-list it as soon as possible.';
				break;
				
			/*	case 'Delievered':
					$buyerMessage = 'Your  order "'.$data['orderId'].'" has been Delievered.';
					$sellerMessage = 'Your  item "'.$productTitle.'" has been Delievered.';
				break;
				
				case 'Cancelled':
					$buyerMessage = 'Your  order "'.$data['orderId'].'" has been Cancelled';
					$sellerMessage = 'Your  item "'.$productTitle.'" has been Cancelled';
				break;*/
            }
			
			if($buyerMessage != '') {
				$pushNotification -> prepareAndSendNotification(0, $buyerId, 'social', 'orderStatusChanged', $productId, $buyerMessage);
			}
			if($sellerMessage != '') {
				$pushNotification -> prepareAndSendNotification(0, $sellerId, 'social', 'orderStatusChanged', $productId, $sellerMessage);
			}
			
			/*
			 * 	Fire email to Buyer and Seller
			 */
			 
			$buyerEmail = '';
			$sellerEmail = ''; 
			 
		 	$query = "select username, email from tbl_users where userId = '".$buyerId."'";
			$result = mysql_query($query);
			
			while($row = mysql_fetch_assoc($result)) {
				$buyerName = $row['username'];
				$buyerEmail = $row['email'];
			}
			
			$query = "select username, email from tbl_users where userId = '".$sellerId."'";
			$result = mysql_query($query);
			while($row = mysql_fetch_assoc($result)) {
				$sellerName = $row['username'];
				$sellerEmail = $row['email'];
			}

 			require_once("../classes/Mailer.php");
         	$mailer = new Mailer();
                
		 	switch($data['status']) {
				case 'Processing':
				break;
					
				case 'Shipped to buyer':
					/*
					 * 	Mailer to buyer
					 */ 
					if($buyerEmail != '') {
						$variables = array(
	                       'orderId' => $data['orderId'],
	                       'buyerName' => $buyerName,
	                       'sellerName' => $sellerName,
	                       'productTitle' => $productTitle,
	                       'productImage' => $productImage,
	                       'sellingPrice' => $amount
	                   	);
						$body = $mailer -> getCompiledTemplate('../emailTemplates/shippedToBuyer.html', $variables);
	    	 			$mailer -> send($buyerEmail, false, 'Not much longer to go. Your item is on its way!', $body);
					} 
				break;
				
				case 'Complete':
					/*
					 * 	Mailer to Buyer
					 */ 
				 	if($buyerEmail != '') {
						$variables = array(
	                       'orderId' => $data['orderId'],
	                       'buyerName' => $buyerName,
	                       'sellerName' => $sellerName,
	                       'productTitle' => $productTitle,
	                       'productImage' => $productImage,
	                       'sellingPrice' => $amount
	                   	);
						$body = $mailer -> getCompiledTemplate('../emailTemplates/orderCompleteToBuyer.html', $variables);
	    	 			$mailer -> send($buyerEmail, false, 'Thanks for shopping on StylFlip! Keep Flippin\'', $body);
					}
					
					/*
					 * 	Mailer to Seller
					 */ 
					if($sellerEmail != '') {
						$variables = array(
	                       'orderId' => $data['orderId'],
	                       'sellerName' => $sellerName
	                   	);
						echo $body = $mailer -> getCompiledTemplate('../emailTemplates/orderCompleteToSeller.html', $variables);
	    	 			$mailer -> send($sellerEmail, false, 'ChaChing.. Congratulations! You are a little bit richer and your item happier in a new home!', $body);
					}
				break;
					
				case 'Rejected by StylFlip':
					/*
					 * 	Mailer to Seller
					 */ 
					if($sellerEmail != '') {
						$variables = array(
	                       'orderId' => $data['orderId'],
	                       'sellerName' => $sellerName
	                   	);
						$body = $mailer -> getCompiledTemplate('../emailTemplates/authenticityFailed.html', $variables);
	    	 			$mailer -> send($sellerEmail, false, 'Important! Your Item failed our Authenticity check', $body);
					}
					
					
					/*
					 * 	Mailer to buyer
					 */ 
					if($buyerEmail != '') {
						$variables = array(
	                       'orderId' => $data['orderId'],
	                       'buyerName' => $buyerName,
	                       'sellerName' => $sellerName,
	                       'productTitle' => $productTitle,
	                       'productImage' => $productImage,
	                       'sellingPrice' => $amount
	                   	);
						$body = $mailer -> getCompiledTemplate('../emailTemplates/refundToBuyer.html', $variables);
	    	 			$mailer -> send($buyerEmail, false, 'Refund for your StylFlip order number ('.$data['orderId'].')', $body);
					}
				break;
				
			/*	case 'Delievered':
					
					if($sellerEmail != '') {
						$variables = array(
	                       'orderId' => $data['orderId'],
	                       'sellerName' => $sellerName
	                   	);
						$body = $mailer -> getCompiledTemplate('../emailTemplates/delieveredConfirmationToSeller.html', $variables);
	    	 			$mailer -> send($sellerEmail, false, 'Your Item Delievered', $body);
					}
					
					
					 
					if($buyerEmail != '') {
						$variables = array(
	                       'orderId' => $orderId,
						   'buyerName' => $data['firstName'],
						   'firstName' => $data['firstName'],
						   'lastName' => $data['lastName'],
						   'addressLine1' => $data['addressLine1'],
						   'addressLine2' => $data['addressLine2'],
						   'landmark' => $data['landmark'],
						   'city' => $data['city'],
						   'state' => $data['state'],
						   'postCode' => $data['postCode'],
						   'phoneNumber' => $data['phoneNumber'],
						   'productImage' => $productImage,
						   'productTitle' => $productTitle,
						   'sellerName' => $sellerName,
						   'sellingPrice' => $data['amount']
	                   	);
						$body = $mailer -> getCompiledTemplate('../emailTemplates/delieveredConfirmationToBuyer.html', $variables);
	    	 			$mailer -> send($buyerEmail, false, 'Your Order Cancelled ('.$data['orderId'].')', $body);
					}
				break; */
			/*	case 'Cancelled':
					
					if($sellerEmail != '') {
						$variables = array(
	                       'orderId' => $data['orderId'],
	                       'sellerName' => $sellerName
	                   	);
						$body = $mailer -> getCompiledTemplate('../emailTemplates/CancelledOrderToSeller.html', $variables);
	    	 			$mailer -> send($sellerEmail, false, 'Your Item Cancelled', $body);
					}
					
					
					
					if($buyerEmail != '') {
						$variables = array(
	                       'orderId' => $orderId,
						   'buyerName' => $data['firstName'],
						   'firstName' => $data['firstName'],
						   'lastName' => $data['lastName'],
						   'addressLine1' => $data['addressLine1'],
						   'addressLine2' => $data['addressLine2'],
						   'landmark' => $data['landmark'],
						   'city' => $data['city'],
						   'state' => $data['state'],
						   'postCode' => $data['postCode'],
						   'phoneNumber' => $data['phoneNumber'],
						   'productImage' => $productImage,
						   'productTitle' => $productTitle,
						   'sellerName' => $sellerName,
						   'sellingPrice' => $data['amount']
	                   	);
						$body = $mailer -> getCompiledTemplate('../emailTemplates/CancelledOrderToBuyer.html', $variables);
	    	 			$mailer -> send($buyerEmail, false, 'Your Order Delievered ('.$data['orderId'].')', $body);
					}
				break; */
				
            }
			
			$response['success'] = TRUE;
            $this -> setMessage("Order status has been updated successfully");
        }
        else {
        	$response['success'] = FALSE;
            $this -> setMessage("Failed to update order status");
        }
		
		// $page = isset($data['page']) ? '?page=' . $data['page'] : '';
        // header("Location:../sf_admin_control-panel/manageOrders.php" . $page);
        
        echo json_encode($response);
    }

	
	function updateOrderStatusCopy( $data ) {
    	$response = array();
		
        $query = "update tbl_orders set status = '".$data['status']."' WHERE orderId = '".$data['orderId']."'";
        $result = mysql_query($query);
        
        if($result) {
            $query = "select p.productId, p.productTitle, p.primaryPhoto, o.productId, o.buyerId, o.sellerId, o.orderId, o.amount from tbl_orders o, tbl_products p where p.productId = o.productId and o.orderId = '".$data['orderId']."'";
            $result = mysql_query($query);
            
            while($row = mysql_fetch_assoc($result)){
                $buyerId = $row['buyerId'];
				$sellerId = $row['sellerId'];
				$productTitle = $row['productTitle'];
				$productId = $row['productId'];
				$productImage = $row['primaryPhoto'];
				$amount = $row['amount'];
            }
			
			/*
			 * 	Send push notifications
			 */ 
			require_once("../classes/PushNotification.php");
            $pushNotification = new PushNotification();
			
			$sellerMessage = '';
			$buyerMessage = '';
			
            switch($data['status']) {
				case 'Processing':
					$buyerMessage = 'Congratulations, your order "'.$data['orderId'].'" has been placed successfully. Track it via the Order Status page. Check your e-mail for more..';
					$sellerMessage = 'Congratulations! Your Item "'.$productTitle.'" has been sold. You will receive an email with pickup details shortly.';
				break;
				case 'Shipped by seller':
					$buyerMessage = 'Your item from order number "'.$data['orderId'].'" has been picked up from the seller and is on its way to us for verificaton.';
					// $sellerMessage = 'Your item "'.$productTitle.'" is on its way to us. Stay tuned and check your email to track its journey to its new wardrobe.';
				break;
				case 'Under QA':
					$buyerMessage = 'Your order "'.$data['orderId'].'" is now with us and we are checking it thoroughly.';
					$sellerMessage = 'Your item "'.$productTitle.'" is now with us and we are checking it thoroughly.';
				break;
				case 'Shipped to buyer':
					$buyerMessage = 'Yay! Your order "'.$data['orderId'].'" has cleared the StylFlip Promise and is on its way to you. Track it by checking the order status page.';
					$sellerMessage = 'Yay! Your item "'.$productTitle.'" has cleared the StylFlip Promise and is on its way to its buyer. You can track it from the "My Sales" section.';
				break;
				case 'Complete':
					$buyerMessage = 'Congratulations! We hope you are happy with your order "'.$data['orderId'].'". Keep flippin\'';
					$sellerMessage = 'Awesome! The buyer has received "'.$productTitle.'" and you should have the money in your account shortly. Keep flippin\'';
				break;
				case 'Rejected by StylFlip':
					$buyerMessage = 'We regret to inform you that your order "'.$data['orderId'].'" has not passed our verification tests. We will refund your money shortly. Feel free to reach out to us in case of any queries.';
					$sellerMessage = 'We regret to inform you that your item "'.$productTitle.'" has not passed our verification tests. Please contact us to arrange for its return :-(';
				break;
				case 'Returned by buyer':
					$buyerMessage = 'Your refund for the order "'.$data['orderId'].'" has been initiated. We apologise for the inconvenience caused and hope to see you flippin\' again soon.';
					// $sellerMessage = 'Sorry. The buyer of "'.$productTitle.'" has decided to return it. We will re-list it as soon as possible.';
				break;
            }
			
			if($buyerMessage != '') {
				$pushNotification -> prepareAndSendNotification(0, $buyerId, 'social', 'orderStatusChanged', $productId, $buyerMessage);
			}
			if($sellerMessage != '') {
				$pushNotification -> prepareAndSendNotification(0, $sellerId, 'social', 'orderStatusChanged', $productId, $sellerMessage);
			}
			
			/*
			 * 	Fire email to Buyer and Seller
			 */
			 
			$buyerEmail = '';
			$sellerEmail = ''; 
			 
		 	$query = "select username, email from tbl_users where userId = '".$buyerId."'";
			$result = mysql_query($query);
			
			while($row = mysql_fetch_assoc($result)) {
				$buyerName = $row['username'];
				$buyerEmail = $row['email'];
			}
			
			$query = "select username, email from tbl_users where userId = '".$sellerId."'";
			$result = mysql_query($query);
			while($row = mysql_fetch_assoc($result)) {
				$sellerName = $row['username'];
				$sellerEmail = $row['email'];
			}

			$buyerEmail = 'sushantahirrao@gmail.com';
			$sellerEmail = 'sushantahirrao@gmail.com'; 
			
 			require_once("../classes/Mailer.php");
         	$mailer = new Mailer();
                
		 	switch($data['status']) {
				case 'Processing':
				break;
					
				case 'Shipped to buyer':
					/*
					 * 	Mailer to buyer
					 */ 
					if($buyerEmail != '') {
						$variables = array(
	                       'orderId' => $data['orderId'],
	                       'buyerName' => $buyerName,
	                       'sellerName' => $sellerName,
	                       'productTitle' => $productTitle,
	                       'productImage' => $productImage,
	                       'sellingPrice' => $amount
	                   	);
						$body = $mailer -> getCompiledTemplate('../emailTemplates/shippedToBuyer.html', $variables);
	    	 			$mailer -> send($buyerEmail, false, 'Not much longer to go. Your item is on its way!', $body);
					} 
				break;
				
				case 'Complete':
					/*
					 * 	Mailer to Buyer
					 */ 
				 	if($buyerEmail != '') {
						$variables = array(
	                       'orderId' => $data['orderId'],
	                       'buyerName' => $buyerName,
	                       'sellerName' => $sellerName,
	                       'productTitle' => $productTitle,
	                       'productImage' => $productImage,
	                       'sellingPrice' => $amount
	                   	);
						$body = $mailer -> getCompiledTemplate('../emailTemplates/orderCompleteToBuyer.html', $variables);
	    	 			$mailer -> send($buyerEmail, false, 'Thanks for shopping on StylFlip! Keep Flippin\'', $body);
					}
					
					/*
					 * 	Mailer to Seller
					 */ 
					if($sellerEmail != '') {
						$variables = array(
	                       'orderId' => $data['orderId'],
	                       'sellerName' => $sellerName
	                   	);
						echo $body = $mailer -> getCompiledTemplate('../emailTemplates/orderCompleteToSeller.html', $variables);
	    	 			$mailer -> send($sellerEmail, false, 'ChaChing.. Congratulations! You are a little bit richer and your item happier in a new home!', $body);
					}
				break;
					
				case 'Rejected by StylFlip':
					/*
					 * 	Mailer to Seller
					 */ 
					if($sellerEmail != '') {
						$variables = array(
	                       'orderId' => $data['orderId'],
	                       'sellerName' => $sellerName
	                   	);
						$body = $mailer -> getCompiledTemplate('../emailTemplates/authenticityFailed.html', $variables);
	    	 			$mailer -> send($sellerEmail, false, 'Important! Your Item failed our Authenticity check', $body);
					}
					
					
					/*
					 * 	Mailer to buyer
					 */ 
					if($buyerEmail != '') {
						$variables = array(
	                       'orderId' => $data['orderId'],
	                       'buyerName' => $buyerName,
	                       'sellerName' => $sellerName,
	                       'productTitle' => $productTitle,
	                       'productImage' => $productImage,
	                       'sellingPrice' => $amount
	                   	);
						$body = $mailer -> getCompiledTemplate('../emailTemplates/refundToBuyer.html', $variables);
	    	 			$mailer -> send($buyerEmail, false, 'Refund for your StylFlip order number ('.$data['orderId'].')', $body);
					}
				break;
            }
			
			$response['success'] = TRUE;
            $this -> setMessage("Order status has been updated successfully");
        }
        else {
        	$response['success'] = FALSE;
            $this -> setMessage("Failed to update order status");
        }
		
		// $page = isset($data['page']) ? '?page=' . $data['page'] : '';
        // header("Location:../sf_admin_control-panel/manageOrders.php" . $page);
        
        echo json_encode($response);
    }


	
	function updateOrder( $data ) {
	//print_r($data); die;
        $query = "update tbl_orders set AWB = '".$data['AWB']."', courier = '".$data['courier']."', reverseAWB = '".$data['reverseAWB']."', reverseCourier = '".$data['reverseCourier']."',payment_reference_nodal = '".$data['payment_reference_nodal']."',payment_reference_current = '".$data['payment_reference_current']."',payment_date = '".$data['payment_date']."',qcdate = '".$data['qcdate']."',delivery_date = '".$data['delivery_date']."' WHERE orderId = '".$data['orderId']."'";
        $result = mysql_query($query);
        
        if($result) {
            $this -> setMessage("Order details have been updated successfully");
        }
        else {
            $this -> setMessage("Failed to update order details");
        }
		
		
				
		//$page = isset($data['page']) ? 'page=' . $data['page'] : '';
        header("Location:../sf_admin_control-panel/manageOrders.php?page=" . $data['page'] ."&search_text=". $data['search_text']."&search_text1=". $data['search_text1']);
    }
    
    function addCouponCode($data) {
    	$query = "select couponCode from tbl_coupon_codes where couponCode='".$data['couponCode']."'";
		
        if(mysql_num_rows(mysql_query($query)) == 0) {
        	$query = "insert into tbl_coupon_codes (couponCode, discount, type) values ('".$data['couponCode']."', '".$data['discount']."', '".$data['discountType']."')";
	        $result = mysql_query($query);
			
			if($result) {
	            $this -> setMessage("Coupon code added successfully");
	        }
	        else {
	            $this -> setMessage("Failed to add coupon code");
	        }
        }
		else {
			$this -> setMessage("Failed to add coupon code. Coupon code has already been added.");
		}
		
        header("Location:../sf_admin_control-panel/manageCouponCodes.php");
    }
	
	function deleteCouponCode($arr) {
		$couponCodeId = $arr['couponCodeId'];
		
    	$query = "delete from tbl_coupon_codes where couponCodeId='".$couponCodeId."'";
    	$result = mysql_query($query);
		
        if($result) {
            $this -> setMessage("Coupon code deleted successfully");
        }
        else {
            $this -> setMessage("Failed to delete coupon code");
        }
		
		$page = isset($arr['page']) ? '?page=' . $arr['page'] : '';
        header("Location:../sf_admin_control-panel/manageCouponCodes.php" . $page);
    }
	
	
	function getCouponDiscountByCode($arr) {
		/*	
		$response = array();
        $response['data'] = array();
        $response['success'] = false;
        
		$query = "select couponCode, discount from tbl_coupon_codes where couponCode='".$arr['couponCode']."'";
		$result = mysql_query($query);
		
		if($result) {
			$response['success'] = TRUE;
			
			while($row = mysql_fetch_assoc($result)){
                $discount = $row['discount'];
            }
            
            $response['data']['discount'] = $discount;
		}
		
	 	echo json_encode($response);
	 	*/
	 	
	 	$response = array();
		$response['success'] = FALSE;
        $response['data'] = array();
        
		$query = "select discount, type from tbl_coupon_codes where couponCode='".$arr['couponCode']."'";
		$result = mysql_query($query);
		
		if($result) {
			if(mysql_num_rows($result) == 0) {
				$response['success'] = TRUE;
			}
			else {
				while($row = mysql_fetch_assoc($result)){
					$discountType = $row['type'];
					$discount = $row['discount'];
		        }
				
		        if($discountType == 'percent') {
		        	$response['success'] = TRUE;
					$response['data']['discount'] = $discount;
					$response['data']['discountType'] = 'percent';
		        }
				else {
					if(!isset($arr['userId'])) {
						$response['success'] = FALSE;
						$response['data']['error'] = 'Please download latest version of the app from app store to avail flat discount.';
					}
					else {
						$query = "select userId from tbl_coupon_codes_usage where couponCode='".$arr['couponCode']."' and userId='".$arr['userId']."'";
						$result = mysql_query($query);
						
						if($result) {
							if(mysql_num_rows($result) == 0) {
								$response['success'] = TRUE;
					            $response['data']['discount'] = $discount;
								$response['data']['discountType'] = 'flat';
							}
							else {
								$response['success'] = TRUE;
							}
						}
					}
				}
			}
		}
		
	 	echo json_encode($response);
	}
	
	
	function getCouponDiscountByCodeNew($arr) {
		$response = array();
		$response['success'] = FALSE;
        $response['data'] = array();
        
		$query = "select discount, type from tbl_coupon_codes where couponCode='".$arr['couponCode']."'";
		$result = mysql_query($query);
		
		if($result) {
			if(mysql_num_rows($result) == 0) {
				$response['success'] = TRUE;
			}
			else {
				while($row = mysql_fetch_assoc($result)){
					$discountType = $row['type'];
					$discount = $row['discount'];
		        }
				
		        if($discountType == 'percent') {
		        	$response['success'] = TRUE;
					$response['data']['discount'] = $discount;
					$response['data']['discountType'] = 'percent';
		        }
				else {
					if(!isset($arr['userId'])) {
						$response['success'] = FALSE;
						$response['data']['error'] = 'Please download latest version of the app from app store to avail flat discount.';
					}
					else {
						$query = "select userId from tbl_coupon_codes_usage where couponCode='".$arr['couponCode']."' and userId='".$arr['userId']."'";
						$result = mysql_query($query);
						
						if($result) {
							if(mysql_num_rows($result) == 0) {
								$response['success'] = TRUE;
					            $response['data']['discount'] = $discount;
								$response['data']['discountType'] = 'flat';
							}
							else {
								$response['success'] = TRUE;
							}
						}
					}
				}
			}
		}
		
	 	echo json_encode($response);
	}
    
};

?>