<?php

class StyleFeed {
	
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
	
	function setMessage ($message) {
		$_SESSION['message'] = $message;
	}
	
	function createFeed($arrFeed) {
		require_once("../classes/FileUploader.php");
		$response = array();
		
		$response['success'] = TRUE;
		$response['data'] = array();
		$imagePath = '';
		
		if( true == isset($_FILES['photo'])) {
			$imagePath = 'uploads/feedPics/thumbnails/'.$arrFeed['userId'].'_'.'thumbnail_'.$_FILES['photo']['name'];
			$imagePathToUpload = '../uploads/feedPics/thumbnails/'.$arrFeed['userId'].'_'.'thumbnail_';
				
			$fileUploader = new FileUploader();
		
			$extensionsAllowed = array("jpg", "jpeg", "png", "gif", "bmp");
				
			$uploadResponse = $fileUploader -> uploadFile($_FILES['photo'], $imagePathToUpload, $extensionsAllowed, 10, 700, 700);
		}
		
		if( ( true == isset($_FILES['photo']) && $uploadResponse['success']) || false == isset($_FILES['photo']) ) {
				
			$query = "insert into tbl_stylefeed (title, lat, lon, city, userId, photo, likes, createdOn) values ('".$arrFeed['feedTitle']."', '".$arrFeed['location']['lat']."', '".$arrFeed['location']['lon']."', '".$arrFeed['location']['city']."', '".$arrFeed['userId']."', '" . $imagePath . "', '0', '" . date("Y-m-d H:i:s") . "' )";
			$result = mysql_query($query);
				
			if($result) {
					
				$query = "select feedId from tbl_stylefeed where title='".$arrFeed['feedTitle']."'";
				$result = mysql_query($query);
					
				while($row = mysql_fetch_assoc($result)) {
					$feedId = $row['feedId'];
				}
					
				$response['success'] = TRUE;
				$response['data']['status'] = '1';  	//	Successful
                
                $query = "select s.*, u.username, u.profilePicURL, u.city from tbl_stylefeed s INNER JOIN tbl_users u on u.userId = s.userId LEFT JOIN tbl_feed_likes fl on fl.feedId = s.feedId where s.feedId = $feedId";
                
                $result = mysql_query($query);
                
                        while($row = mysql_fetch_assoc($result)) {
                            $response['data']['feedId'] = $row['feedId'];
                            $response['data']['feedTitle'] = $row['title'];
                            $response['data']['userId'] = $row['userId'];
                            $response['data']['username'] = $row['username'];
                            $response['data']['likes'] = $row['likes'];
                            $response['data']['photo'] = $row['photo'];
                            $response['data']['userLocation'] = $row['city'];
                            $response['data']['timestamp'] = $this->relativeDate($row['createdOn']);
                            
                            if( false == is_null( $row['profilePicURL'] ) ) {
                                $response['data']['profilePicURL'] = $row['profilePicURL'];
                            } else {
                                $response['data']['profilePicURL'] = '';
                            }
                            
                            $response['data']['isLiked'] = $userId?$row['isLiked']:0;
                        }
                
			}  else {
				$fileUploader -> deleteFile('../' .$imagePath);
				$response['success'] = FALSE;
				$response['data']['error'] = 'Failed to insert Feed';
			}
		} else {
			$response['success'] = FALSE;
			$response['data']['error'] = $uploadResponse['message'];
		}
		
		echo json_encode($response);
	}
	
	function listing( $userId, $location, $index, $limit, $searchText, $type,$stylefeedSection ) {
		$response = array();
		$response['success'] = true;
		$strWhere = '';
		
		if(true == empty($stylefeedSection))
		{
			if(true == empty($index)) { $index = 0; }
			if(true == empty($limit)) { $limit = 20; }
			
			if(false == empty($searchText)) {
				
				if($userId) {
					$strWhere = " AND ";
				} else {
					$strWhere = " WHERE ";
				}		
				
				$strWhere .= " ( s.title LIKE '%" . $searchText . "%' OR u.username LIKE '%" . $searchText . "%' OR firstName LIKE '%" . $searchText . "%' OR lastName LIKE '%" . $searchText . "%' ) ";
			}
			
			if( false == empty($type) ) {
				if(true == empty($searchText) && true == empty($userId) ) {
					$strWhere = " WHERE ";
				} else {
					$strWhere .= " AND ";
				}
				
				if( 'only me' == strtolower($type) ) {
					$strWhere .= " s.userId = $userId ";
				} elseif( 'my network' == strtolower($type) ) {
					$strWhere .= " ( s.userId IN ( SELECT userId FROM tbl_user_follow WHERE followedUserId = $userId )  OR s.userId IN ( SELECT followedUserId FROM tbl_user_follow WHERE userId = $userId ) ) ";
				}
        	    else {
        	        $strWhere = ''; //  Default case (Global)
        	    }
				
			}
				
			$index = $index * $limit;
			
			if($userId) {
				$query = "select s.*, u.username, u.profilePicURL, u.city, (select count(feedCommentId) from tbl_feed_comments fc where fc.feedId = s.feedId) as comments, CASE WHEN fc.feedCommentId IS NULL THEN 0 else 1 END as 'isCommented', CASE WHEN ft.feedTagId IS NULL THEN 0 else 1 END as 'isTagged', CASE WHEN fl.feedLikeId IS NULL THEN 0 else 1 END  as 'isLiked', CASE WHEN fu.userFollowId IS NULL THEN 0 else 1 END as 'isFollowing' from tbl_stylefeed s INNER JOIN tbl_users u on u.userId = s.userId and u.isActive = 1 LEFT JOIN tbl_feed_likes fl on fl.feedId = s.feedId and fl.userId = $userId LEFT JOIN tbl_feed_comments fc on fc.feedId = s.feedId and fc.userId = $userId LEFT JOIN tbl_feed_tags ft on ft.feedId = s.feedId and ft.taggedUserId = $userId LEFT JOIN tbl_user_follow fu on fu.followedUserId = s.userId and fu.userId = $userId WHERE s.feedId NOT IN ( SELECT feedId from tbl_hidden_feeds where userId = $userId ) $strWhere Group BY s.feedId order by s.feedId desc LIMIT $index, $limit";
			}
			else {
				$query = "select s.*, u.username, u.profilePicURL, u.city, (select count(feedCommentId) from tbl_feed_comments fc where fc.feedId = s.feedId) as comments, 0 as 'isFollowing', 0 as 'isCommented', 0 as 'isTagged' from tbl_stylefeed s INNER JOIN tbl_users u on u.userId = s.userId LEFT JOIN tbl_feed_likes fl on fl.feedId = s.feedId and fl.userId = s.userId and u.isActive = 1 $strWhere Group BY s.feedId order by s.feedId desc LIMIT $index, $limit";
			}

			$result = mysql_query($query);
			
			if($result) {
        	    $response['data'] = array();
        	    
        	    if(mysql_num_rows($result) > 0) {
        	        while($row = mysql_fetch_assoc($result)) {
        	        	$rowTemp['productId'] = $row['productId'];
        	        	$rowTemp['wardrobeId'] = $row['wardrobeId'];
        	            $rowTemp['feedId'] = $row['feedId'];
        	            $rowTemp['feedTitle'] = $row['title'];
        	            $rowTemp['userId'] = $row['userId'];
        	            $rowTemp['username'] = $row['username'];
        	            $rowTemp['likes'] = $row['likes'];
        	            $rowTemp['comments'] = $row['comments'];
        	            $rowTemp['photo'] = $row['photo'];
        	            $rowTemp['userLocation'] = $row['city'];
        	            $rowTemp['timestamp'] = $this->relativeDate($row['createdOn']);
        	            
        	            if( false == is_null( $row['profilePicURL'] ) ) {
        	                $rowTemp['profilePicURL'] = $row['profilePicURL'];
        	            } else {
        	                $rowTemp['profilePicURL'] = '';
        	            }
        	            
        	            $rowTemp['recentComments'] = array();
        	            
        	            $query = "select f.*, u.username, u.firstName, u.lastName, u.profilePicURL from tbl_feed_comments f INNER JOIN tbl_users u on u.userId = f.userId WHERE f.feedId = " . $row['feedId'] . " ORDER BY f.feedCommentId DESC LIMIT 0, 2";
        	            $result2 = mysql_query($query);
	
        	            if(mysql_num_rows($result2) > 0) {
        	            	while($row1 = mysql_fetch_assoc($result2)) {
        	            		$rowTemp['recentComments'][] = $row1;
        	            	}
        	            }
        	            
        	            $rowTemp['isLiked'] = $userId?$row['isLiked']:0;
        	            $rowTemp['isFollowing'] = $userId?$row['isFollowing']:0;
        	            $rowTemp['isCommented'] = $userId?$row['isCommented']:0;
        	            $rowTemp['isTagged'] = $userId?$row['isTagged']:0;
						
						if($rowTemp['isLiked'] == 1) {
							$rowTemp['likes'] = $rowTemp['likes'] - 1;
						}
        	            
        	            $response['data'][] = $rowTemp;
        	        }
        	    }
			}
			else {
				$response['success'] = false;
			}
		}
		else
		{
			$sql = "SELECT * FROM tbl_newstylefeed WHERE object_type = '".$stylefeedSection."'";
			$result = mysql_query($sql);
			$response['data'] = array();
			if($result)
			{
				switch($stylefeedSection)
				{
					case 'product':	
						while($row = mysql_fetch_assoc($result))
						{
							$sql2 = "SELECT * FROM tbl_products WHERE productId = '".$row['object_id']."'";
							$result2 = mysql_query($sql2);
							if($result2)
							{
								while($row2 = mysql_fetch_assoc($result2))
								{
									$row2['primaryPhoto'] = $baseURL.$row2['primaryPhoto'];
									$response['data'][] = $row2;
								}
							}
							else
							{
								$response['success'] = false;
							}
						}
						break;
					case 'user':	
						while($row = mysql_fetch_assoc($result))
						{
							$sql2 = "SELECT * FROM tbl_users WHERE userId = '".$row['object_id']."'";
							$result2 = mysql_query($sql2);
							if($result2)
							{
								while($row2 = mysql_fetch_assoc($result2))
								{
									$row2['profilePicURL'] = $baseURL.$row2['profilePicURL'];
									$response['data'][] = $row2;
								}
							}
							else
							{
								$response['success'] = false;
							}
						}
						break;
					case 'brand':	
						while($row = mysql_fetch_assoc($result))
						{
							$sql2 = "SELECT * FROM tbl_brands WHERE brandId = '".$row['object_id']."'";
							$result2 = mysql_query($sql2);
							if($result2)
							{
								while($row2 = mysql_fetch_assoc($result2))
								{
									$row2['brandPhoto'] = $baseURL.$row2['brandPhoto'];
									$response['data'][] = $row2;
								}
							}
							else
							{
								$response['success'] = false;
							}
						}
						break;
					case 'category':	
						while($row = mysql_fetch_assoc($result))
						{
							$sql2 = "SELECT * FROM tbl_categories WHERE categoryId = '".$row['object_id']."'";
							$result2 = mysql_query($sql2);
							if($result2)
							{
								while($row2 = mysql_fetch_assoc($result2))
								{
									if($stylefeedSection == 'category')
									{
										$sql1 = "SELECT * FROM tbl_categories WHERE categoryId = '".$row2['parentCategoryId']."'";
										$result1 = mysql_query($sql1);
										$row1 = mysql_fetch_assoc($result1);
										$row2['parentCategory'] = $row1['name'];
									}
									$row2['categoryPhoto'] = $baseURL.$row2['categoryPhoto'];
									$response['data'][] = $row2;
								}
							}
							else
							{
								$response['success'] = false;
							}
						}
						break;
					default:
						echo "Invalid request";
						break;
				}
			}
			else
			{
				$response['success'] = false;
			}
		}
		echo json_encode($response);
	}
	
	function feedDetails( $userId, $feedId ) {
		$response = array();
		$response['success'] = true;
		
		if($userId) {
			$query = "select s.*, u.username, u.profilePicURL, u.city, (select count(feedCommentId) from tbl_feed_comments fc where fc.feedId = s.feedId) as comments, CASE WHEN fc.feedCommentId IS NULL THEN 0 else 1 END as 'isCommented', CASE WHEN ft.feedTagId IS NULL THEN 0 else 1 END as 'isTagged', CASE WHEN fl.feedLikeId IS NULL THEN 0 else 1 END  as 'isLiked', CASE WHEN fu.userFollowId IS NULL THEN 0 else 1 END as 'isFollowing' from tbl_stylefeed s INNER JOIN tbl_users u on u.userId = s.userId and u.isActive = 1 LEFT JOIN tbl_feed_likes fl on fl.feedId = s.feedId and fl.userId = $userId LEFT JOIN tbl_feed_comments fc on fc.feedId = s.feedId and fc.userId = $userId LEFT JOIN tbl_feed_tags ft on ft.feedId = s.feedId and ft.taggedUserId = $userId LEFT JOIN tbl_user_follow fu on fu.followedUserId = s.userId and fu.userId = $userId WHERE s.feedId NOT IN ( SELECT feedId from tbl_hidden_feeds where userId = $userId ) and s.feedId = '".$feedId."' Group BY s.feedId order by s.feedId desc";
		}
		else {
			$query = "select s.*, u.username, u.profilePicURL, u.city, (select count(feedCommentId) from tbl_feed_comments fc where fc.feedId = s.feedId) as comments, 0 as 'isFollowing', 0 as 'isCommented', 0 as 'isTagged' from tbl_stylefeed s INNER JOIN tbl_users u on u.userId = s.userId LEFT JOIN tbl_feed_likes fl on fl.feedId = s.feedId and fl.userId = s.userId and u.isActive = 1 and s.feedId = '".$feedId."' Group BY s.feedId order by s.feedId desc";
		}

		$result = mysql_query($query);
		
		if($result) {
            $response['data'] = array();
            
            if(mysql_num_rows($result) > 0) {
                while($row = mysql_fetch_assoc($result)) {
                	$rowTemp['productId'] = $row['productId'];
                	$rowTemp['wardrobeId'] = $row['wardrobeId'];
                    $rowTemp['feedId'] = $row['feedId'];
                    $rowTemp['feedTitle'] = $row['title'];
                    $rowTemp['userId'] = $row['userId'];
                    $rowTemp['username'] = $row['username'];
                    $rowTemp['likes'] = $row['likes'];
                    $rowTemp['comments'] = $row['comments'];
                    $rowTemp['photo'] = $row['photo'];
                    $rowTemp['userLocation'] = $row['city'];
                    $rowTemp['timestamp'] = $this->relativeDate($row['createdOn']);
                    
                    if( false == is_null( $row['profilePicURL'] ) ) {
                        $rowTemp['profilePicURL'] = $row['profilePicURL'];
                    } else {
                        $rowTemp['profilePicURL'] = '';
                    }
                    
                    $rowTemp['recentComments'] = array();
                    
                    $query = "select f.*, u.username, u.firstName, u.lastName, u.profilePicURL from tbl_feed_comments f INNER JOIN tbl_users u on u.userId = f.userId WHERE f.feedId = " . $row['feedId'] . " ORDER BY f.feedCommentId DESC LIMIT 0, 2";
                    $result2 = mysql_query($query);

                    if(mysql_num_rows($result2) > 0) {
                    	while($row1 = mysql_fetch_assoc($result2)) {
                    		$rowTemp['recentComments'][] = $row1;
                    	}
                    }
                    
                    $rowTemp['isLiked'] = $userId?$row['isLiked']:0;
                    $rowTemp['isFollowing'] = $userId?$row['isFollowing']:0;
                    $rowTemp['isCommented'] = $userId?$row['isCommented']:0;
                    $rowTemp['isTagged'] = $userId?$row['isTagged']:0;
					
					if($rowTemp['isLiked'] == 1) {
						$rowTemp['likes'] = $rowTemp['likes'] - 1;
					}
                    
                    $response['data'][] = $rowTemp;
                }
            }
		}
		else {
			$response['success'] = false;
		}
		
		echo json_encode($response);
	}
	
	function like( $userId, $feedId ) {
		$response = array();
		$response['success'] = false;
		
		$query = "INSERT INTO tbl_feed_likes(userId, feedId ) values ( '$userId' , '$feedId' )";
		$result = mysql_query($query);
		
		if($result) {
			$query = "update tbl_stylefeed set likes = likes + 1 WHERE feedId = $feedId" ;
			$result1 = mysql_query($query);
			
			$response['success'] = true;
			$response['data']['status'] = '1';  	//	update successful
		}
		else {
			$response['data']['status'] = '2';  	//	update failed
		}
		
		echo json_encode($response);
        
        if($result) {
            $query = "select userId from tbl_stylefeed where feedId='".$feedId."'";
            $result = mysql_query($query);
            while($row = mysql_fetch_assoc($result)) {
                $toUserId = $row['userId'];
            }
            require_once("../classes/PushNotification.php");
            $pushNotification = new PushNotification();
            $pushNotification -> prepareAndSendNotification($userId, $toUserId, 'social', 'feedLike', $feedId);
        }
	}
	
	function dislike( $userId, $feedId ) {
		$response = array();
		$response['success'] = false;
	
		$query = "DELETE FROM tbl_feed_likes WHERE feedId = $feedId and userId = $userId";
		$result = mysql_query($query);
			
		if($result) {
			$query = "update tbl_stylefeed set likes = likes - 1 WHERE feedId = $feedId AND likes > 0" ;
			$result = mysql_query($query);
			
			$response['success'] = true;
			$response['data']['status'] = '1';  	//	update successful
		}
		else {
			$response['data']['status'] = '2';  	//	update failed
		}
	
		echo json_encode($response);
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
	
	function addComment( $userId, $feedId, $comment ) {
		$response = array();
		$response['success'] = false;
	
		$query = "INSERT INTO tbl_feed_comments(userId, feedId, comment,createdOn ) values ( '$userId' , '$feedId', '$comment', '" . date("Y-m-d H:i:s") . "' )";
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
            $query = "select userId from tbl_stylefeed where feedId='".$feedId."'";
            $result = mysql_query($query);
            while($row = mysql_fetch_assoc($result)) {
                $toUserId = $row['userId'];
            }
            require_once("../classes/PushNotification.php");
            $pushNotification = new PushNotification();
            $pushNotification -> prepareAndSendNotification($userId, $toUserId, 'social', 'feedComment', $feedId, $comment);
        }
	}
	
	function viewComments( $feedId, $index, $limit ) {
	
		$response = array();
		$response['success'] = false;
		$response['data'] = array();
	
		if(true == empty($index)) { $index = 0; }
		if(true == empty($limit)) { $limit = 20; }
	
		$index = $index * $limit;
	
		$query = "select f.*, u.username, u.firstName, u.lastName, u.profilePicURL from tbl_feed_comments f INNER JOIN tbl_users u on u.userId = f.userId WHERE f.feedId = $feedId ORDER BY f.feedCommentId DESC LIMIT $index, $limit";
		
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
	
	function hidePost( $userId, $feedId, $reason ) {
		$response = array();
		$response['success'] = false;
		
		$query = "INSERT INTO tbl_hidden_feeds ( userId, feedId, reason ) values ( '$userId' , '$feedId', '$reason' )";
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
    
    function deletePost( $arr ) {
    	$userId = $arr['userId'];
    	$feedId = $arr['feedId'];
    	
        $response = array();
        $response['success'] = false;
        
        $query = "delete from tbl_stylefeed WHERE feedId = $feedId AND userId = $userId";
        $result = mysql_query($query);
        
        if($result) {
            $response['success'] = true;
            $response['data']['status'] = '1';  	//	delete successful
        }
		
		if( result ) {
			$this -> setMessage("Feed has been deleted successfully");
		} 
		else {
			$this -> setMessage("Failed to delete feed");
		}
        
		if(isset($arr['redirect'])) {
			$page = isset($arr['page']) ? '?page=' . $arr['page'] : '';
			header("Location:../sf_admin_control-panel/manageReportedFeeds.php" . $page);
		}
		else {
			echo json_encode($response);
		}
    }
	
	function tagUser( $userId, $feedId, $taggedUserId ) {
		$response = array();
		$response['success'] = false;
		
		$query = "INSERT INTO tbl_feed_tags(userId, feedId, taggedUserId ) values ( '$userId' , '$feedId', '$taggedUserId' )";
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
            $pushNotification -> prepareAndSendNotification($userId, $taggedUserId, 'social', 'feedTag', $feedId);
        }
	}
	
	function untagUser( $userId, $feedId, $taggedUserId ) {
		$response = array();
		$response['success'] = false;
	
		$query = "DELETE FROM tbl_feed_tags WHERE userId = '$userId' AND feedId = '$feedId' AND taggedUserId = '$taggedUserId'";
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
	
};

?>