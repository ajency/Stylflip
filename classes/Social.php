<?php

class Social {
	
	function createResponse($sql) {			//	for select query only
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
	
	function follow( $userId, $followedUserId ) {
		$response = array();
		$response['success'] = false;
		
		$isSuccess = false;
		
		$query = "INSERT INTO tbl_user_follow( userId, followedUserId ) values ( '$userId' , '$followedUserId' )";
		$result = mysql_query($query);
			
		if($result) {
			$query = "update tbl_users set following = following + 1 WHERE userId = $userId" ;
			$result = mysql_query($query);
			
			$query = "update tbl_users set followers = followers + 1 WHERE userId = $followedUserId" ;
			$result = mysql_query($query);
			
			$isSuccess = $result;
			
			$response['success'] = true;
			$response['data']['status'] = '1';  	//	update successful
		}
		else {
			$response['data']['status'] = '2';  	//	update failed
		}
		
		echo json_encode($response);	
		
		//  Send push notification to device
        if($isSuccess) {
            require_once("../classes/PushNotification.php");
            $pushNotification = new PushNotification();
            $pushNotification -> prepareAndSendNotification($userId, $followedUserId, 'social', 'follow', '');
        }
	}
	
	function unfollow( $userId, $followedUserId ) {
		$response = array();
		$response['success'] = false;
	
		$query = "DELETE FROM tbl_user_follow WHERE userId = $userId AND followedUserId = $followedUserId";
		$result = mysql_query($query);
		
		if($result) {
			$query = "update tbl_users set following = following - 1 WHERE userId = $userId AND following > 0" ;
			$result = mysql_query($query);
			
			$query = "update tbl_users set followers = followers - 1 WHERE userId = $followedUserId AND followers > 0" ;
			$result = mysql_query($query);
			
			$response['success'] = true;
			$response['data']['status'] = '1';  	//	update successful
		}
		else {
			$response['data']['status'] = '2';  	//	update failed
		}
	
		echo json_encode($response);
	}
    
    function showNotifications($userId, $index, $limit) {
        if(true == empty($index)) { $index = 0; }
        if(true == empty($limit)) { $limit = 20; }
        
        //  Update all notifications as read
        if($index == 0) {
            $query = "update tbl_notifications set isRead = 1 where userId = $userId";
            mysql_query($query);
        }
        
        $index = $index * $limit;
        
        $query = "select * from tbl_notifications where (userId=$userId or userId=0) order by notificationId desc LIMIT $index, $limit";
        $notifications = $this -> createResponse($query);
        
        for($i=0; $i<count($notifications['data']); $i++) {
            $notifications['data'][$i]['timestamp'] = $this -> relativeDate($notifications['data'][$i]['timestamp']);
        }
        
        echo json_encode($notifications);
    }
	
	function showPeople( $userId, $index, $limit, $searchText ) {
		
		$response = array();
		$response['data'] = array();
		$strWhere = '';
		
		if(true == empty($index)) { $index = 0; }
		if(true == empty($limit)) { $limit = 20; }
        
        $index = $index * $limit;
        
        if(false == empty($searchText)) {
        	$strWhere = " WHERE ( verificationCode = '' and username != '' and isActive = 1 and ( username LIKE '%" . $searchText . "%' OR firstName LIKE '%" . $searchText . "%' OR lastName LIKE '%" . $searchText . "%' ) )";
        }
		else {
			$strWhere = " WHERE ( verificationCode = '' and username != '' and isActive = 1 )";
		}
		
		$sql = "select userId, username, profilePicURL, city, isFeatured, followers, following, CASE WHEN 0 < (select count(uf.userId) from tbl_user_follow uf where uf.followedUserId = tbl_users.userId and uf.userId = $userId ) THEN 1 ELSE 0 END as isFollowing from tbl_users $strWhere group by userId order by isFeatured DESC, followers DESC LIMIT $index, $limit";
		$result = mysql_query($sql);
		
		if($result) {
			$response['success'] = TRUE;
		
			while($row = mysql_fetch_assoc($result)){
				
				$sql = "select productId from tbl_products where isPurchased = 1 and userId = " .  $row['userId'];
				$result1 = mysql_query($sql);
				
				$row['sold'] = mysql_num_rows($result1);
				
				$sql = "select productId, primaryPhoto as productImage from tbl_products where isApproved = 1 and userId = " .  $row['userId'];
				$result1 = mysql_query($sql);
				
				$row['listed'] = mysql_num_rows($result1);
				
				$row['products'] = array();
				
				while($row1 = mysql_fetch_assoc($result1)){
					array_push( $row['products'], $row1);
				}
				
				array_push($response['data'], $row);
			}
		} else {
			$response['success'] = FALSE;
		}
		
		echo json_encode($response);
		exit;
	}
	
	function followers( $userId, $loggedInUserId, $index, $limit, $searchText, $feedId, $productId ) {
		
		$response = array();
		$response['data'] = array();
		$strWhere = '';
		$strTaggedCondition = '';
		
		if(true == empty($index)) { $index = 0; }
		if(true == empty($limit)) { $limit = 20; }
        
		if(false == empty($searchText)) {
			$strWhere = " WHERE ( u.username LIKE '%" . $searchText . "%' OR u.firstName LIKE '%" . $searchText . "%' OR u.	lastName LIKE '%" . $searchText . "%' )";
		}
		
		if(false == empty($feedId)) {
			$strTaggedCondition = " , CASE WHEN 0 < (select count(uf.userId) from tbl_feed_tags uf where uf.taggedUserId = u.userId and uf.userId = $loggedInUserId and feedId = $feedId ) THEN 1 ELSE 0 END as isTagged";
		} else if(false == empty($productId)) {
			$strTaggedCondition = " , CASE WHEN 0 < (select count(uf.userId) from tbl_product_tags uf where uf.taggedUserId = u.userId and uf.userId = $loggedInUserId and productId = $productId ) THEN 1 ELSE 0 END as isTagged";
		}
		
        $index = $index * $limit;
		
		// $query = "select u.userId, u.username, u.profilePicURL, u.city, u.followers, u.following, CASE WHEN 0 < (select count(uf.userId) from tbl_user_follow uf where uf.followedUserId = u.userId and uf.userId = $loggedInUserId ) THEN 1 ELSE 0 END as isFollowing $strTaggedCondition from tbl_users u INNER JOIN tbl_user_follow uf ON uf.userId = u.userId and u.isActive = 1 AND uf.followedUserId = $userId $strWhere order by u.followers DESC LIMIT $index, $limit";
		$query = "select u.userId, u.username, u.profilePicURL, u.city, u.followers, u.following, CASE WHEN 0 < (select count(uf.userId) from tbl_user_follow uf where uf.followedUserId = u.userId and uf.userId = $loggedInUserId ) THEN 1 ELSE 0 END as isFollowing $strTaggedCondition from tbl_users u INNER JOIN tbl_user_follow uf ON uf.userId = u.userId and u.isActive = 1 AND uf.followedUserId = $userId $strWhere group by u.userId order by u.followers DESC LIMIT $index, $limit";
		$result = mysql_query($query);

		if($result) {
			$response['success'] = TRUE;
		
			while($row = mysql_fetch_assoc($result)){
					
				$sql = "select productId from tbl_products where isPurchased = 1 and userId = " .  $row['userId'];
				$result1 = mysql_query($sql);
				
				$row['sold'] = mysql_num_rows($result1);				
		
				$sql = "select productId, primaryPhoto as productImage from tbl_products where userId = " .  $row['userId'];
				$result1 = mysql_query($sql);
				
				$row['listed'] = mysql_num_rows($result1);
		
				$row['products'] = array();
		
				while($row1 = mysql_fetch_assoc($result1)){
					array_push( $row['products'], $row1);
				}
		
				array_push($response['data'], $row);
			}
		} else {
			$response['success'] = FALSE;
		}
		
		echo json_encode($response);
		
		exit;
	}
	
	function followings( $userId, $loggedInUserId, $index, $limit, $searchText, $feedId, $productId ) {
		
		$response = array();
		$response['data'] = array();
		$strWhere = '';
		$strTaggedCondition = '';
		
		if(true == empty($index)) { $index = 0; }
		if(true == empty($limit)) { $limit = 20; }
        
		if(false == empty($searchText)) {
			$strWhere = " WHERE ( u.username LIKE '%" . $searchText . "%' OR u.firstName LIKE '%" . $searchText . "%' OR u.	lastName LIKE '%" . $searchText . "%' )";
		}
		
		if(false == empty($feedId)) {
			$strTaggedCondition = " , CASE WHEN 0 < (select count(uf.userId) from tbl_feed_tags uf where uf.taggedUserId = u.userId and uf.userId = $loggedInUserId and feedId = $feedId ) THEN 1 ELSE 0 END as isTagged";
		} else if(false == empty($productId)) {
			$strTaggedCondition = " , CASE WHEN 0 < (select count(uf.userId) from tbl_product_tags uf where uf.taggedUserId = u.userId and uf.userId = $loggedInUserId and productId = $productId ) THEN 1 ELSE 0 END as isTagged";
		}
		
        $index = $index * $limit;
		
		// $query = "select u.userId, u.username, u.profilePicURL, u.city, u.followers, u.following, CASE WHEN 0 < (select count(uf.userId) from tbl_user_follow uf where uf.followedUserId = u.userId and uf.userId = $loggedInUserId ) THEN 1 ELSE 0 END as isFollowing $strTaggedCondition from tbl_users u INNER JOIN tbl_user_follow uf ON uf.followedUserId = u.userId and u.isActive = 1 AND uf.userId = $userId $strWhere order by u.followers DESC LIMIT $index, $limit";
		$query = "select u.userId, u.username, u.profilePicURL, u.city, u.followers, u.following, CASE WHEN 0 < (select count(uf.userId) from tbl_user_follow uf where uf.followedUserId = u.userId and uf.userId = $loggedInUserId ) THEN 1 ELSE 0 END as isFollowing $strTaggedCondition from tbl_users u INNER JOIN tbl_user_follow uf ON uf.followedUserId = u.userId and u.isActive = 1 AND uf.userId = $userId $strWhere group by u.userId order by u.followers DESC LIMIT $index, $limit";
		$result = mysql_query($query);
		
		if($result) {
			$response['success'] = TRUE;
		
			while($row = mysql_fetch_assoc($result)){
					
				$sql = "select productId from tbl_products where isPurchased = 1 and userId = " .  $row['userId'];
				$result1 = mysql_query($sql);
				
				$row['sold'] = mysql_num_rows($result1);
		
				$sql = "select productId, primaryPhoto as productImage from tbl_products where userId = " .  $row['userId'];
				$result1 = mysql_query($sql);
				
				$row['listed'] = mysql_num_rows($result1);
		
				$row['products'] = array();
		
				while($row1 = mysql_fetch_assoc($result1)){
					array_push( $row['products'], $row1);
				}
		
				array_push($response['data'], $row);
			}
		} else {
			$response['success'] = FALSE;
		}
		
		echo json_encode($response);
		
		exit;
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
    
    
    function getUnreadNotificationsCount($userId) {
        $response = array();
        $response['success'] = FALSE;
        $response['data'] = array();
        
        $query = "select notificationId from tbl_notifications where isRead = 0 and userId = $userId";
        $result = mysql_query($query);
        
        if($result) {
            $response['success'] = TRUE;
            $response['data']['unreadCount'] = mysql_num_rows($result);
        }
        
        echo json_encode($response);
    }
	
	
	function pushMessage($arr) {
		require_once("../classes/PushNotification.php");
        $pushNotification = new PushNotification();
		
		$query = "select userId, deviceToken, osname from tbl_users";
        $result = mysql_query($query);
		
        while($row = mysql_fetch_assoc($result)) {
        	if($arr['screenType'] == 'Shop' && isset($arr['productId'])) {
        		if($row['deviceToken'] != '') {
        			$pushNotification -> sendNotification($row['deviceToken'], 'shopDetails', $row['osname'], $arr['message'], $arr['productId']);	
        		}
        	}
			else if($arr['screenType'] == 'StylFile' && isset($arr['userId'])) {
				if($row['deviceToken'] != '') {
					$pushNotification -> sendNotification($row['deviceToken'], 'stylFile', $row['osname'], $arr['message'], $arr['userId']);
				}
			}
			else {
				if($row['deviceToken'] != '') {
					$pushNotification -> sendNotification($row['deviceToken'], '', $row['osname'], $arr['message'], '');
				}
			}
        }

		if($arr['screenType'] == 'Shop' && isset($arr['productId'])) {
    		mysql_query("insert into tbl_notifications (userId, productId, message, type, timestamp, image) values ('0', '".$arr['productId']."', '".$arr['message']."', 'productTag', '".date("Y-m-d H:i:s")."', '')");
    	}
		else if($arr['screenType'] == 'StylFile' && isset($arr['userId'])) {
			mysql_query("insert into tbl_notifications (userId, taggingUserId, message, type, timestamp, image) values ('0', '".$arr['userId']."', '".$arr['message']."', 'follow', '".date("Y-m-d H:i:s")."', '')");
		}
		else {
			mysql_query("insert into tbl_notifications (userId, taggingUserId, message, type, timestamp, image) values ('0', '0', '".$arr['message']."', 'byAdmin', '".date("Y-m-d H:i:s")."', '')");
		}
		
		header("Location:../sf_admin_control-panel/pushMessage.php");
	}
    
};

?>