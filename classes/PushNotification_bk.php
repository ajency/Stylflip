<?php

class PushNotification {
    
    function prepareAndSendNotification($fromUserId, $toUserId, $screenName, $messageType, $id, $comment) {
        if($fromUserId == $toUserId) {
            return;
        }
        
        $query = "select userId, isLoggedIn, deviceToken, osname from tbl_users where userId='".$toUserId."'";
        $result = mysql_query($query);
        while($row = mysql_fetch_assoc($result)) {
            $isLoggedIn = $row['isLoggedIn'];
            $deviceToken = $row['deviceToken'];
            $osname = $row['osname'];
        }
        
        
        //  Check if the deviceToken & osname are not empty and user is logged
        // if(($isLoggedIn == 1 || $isLoggedIn == TRUE) && $deviceToken != '' && $osname != '') {
            if($fromUserId > 0) {
                $query = "select username from tbl_users where userId='".$fromUserId."'";
                $result = mysql_query($query);
                while($row = mysql_fetch_assoc($result)) {
                    $username = $row['username'];
                }
            }
            
            switch($messageType) {
                case 'productTag':
                    $screenName = 'shopDetails';
                    $itemId = $id;
                    
                    $query = "select productTitle from tbl_products where productId='".$id."'";
                    $result = mysql_query($query);
                    while($row = mysql_fetch_assoc($result)) {
                        $productTitle = $row['productTitle'];
                    }
                    $message = 'Your friend ' . $username . ' tagged you to check out ' . $productTitle;
                    
                    $query = "insert into tbl_notifications (userId, taggingUserId, productId, message, type, timestamp) values ('".$toUserId."', '".$fromUserId."', '".$id."', '".$message."', '".$messageType."', '".date("Y-m-d H:i:s")."')";
                    mysql_query($query);
                    
                    break;
                    
                case 'feedTag':
                    $query = "select title from tbl_stylefeed where feedId='".$id."'";
                    $result = mysql_query($query);
                    while($row = mysql_fetch_assoc($result)) {
                        $feedTitle = $row['title'];
                    }
                    $message = 'Your friend ' . $username . ' tagged you to check out ' . $feedTitle;
                    
                    $query = "insert into tbl_notifications (userId, taggingUserId, feedId, message, type, timestamp) values ('".$toUserId."', '".$fromUserId."', '".$id."', '".$message."', '".$messageType."', '".date("Y-m-d H:i:s")."')";
                    mysql_query($query);
                    
                    break;
                    
                case 'productApproved':
                    $screenName = 'shopDetails';
                    $itemId = $id;
                    
                    $query = "select productTitle from tbl_products where productId='".$id."'";
                    $result = mysql_query($query);
                    while($row = mysql_fetch_assoc($result)) {
                        $productTitle = $row['productTitle'];
                    }
                    $message = 'Congratulations! Your item "' . $productTitle . '" has been listed in the Stylflip Shop. Check it out!';
                    
                    $query = "insert into tbl_notifications (userId, productId, message, type, timestamp) values ('".$toUserId."', '".$id."', '".$message."', '".$messageType."', '".date("Y-m-d H:i:s")."')";
                    mysql_query($query);
                    break;
                    
                case 'productRejected':
                    $screenName = 'shopDetails';
                    $itemId = $id;
                    
                    $query = "select productTitle from tbl_products where productId='".$id."'";
                    $result = mysql_query($query);
                    while($row = mysql_fetch_assoc($result)) {
                        $productTitle = $row['productTitle'];
                    }
                    $message = 'Your item "' . $productTitle . '" has been rejected';
                    
                    $query = "insert into tbl_notifications (userId, productId, message, type, timestamp) values ('".$toUserId."', '".$id."', '".$message."', '".$messageType."', '".date("Y-m-d H:i:s")."')";
                    mysql_query($query);
                    break;
                    
                case 'follow':
                    $screenName = 'stylFile';
                    $itemId = $fromUserId;
                    
                    $message = $username . ' is now following you';
                    
                    $query = "insert into tbl_notifications (userId, taggingUserId, message, type, timestamp) values ('".$toUserId."', '".$fromUserId."', '".$message."', '".$messageType."', '".date("Y-m-d H:i:s")."')";
                    mysql_query($query);
                    break;
                    
                case 'likeWardrobeItem':
                    $screenName = 'stylFile';
                    $itemId = $fromUserId;
                    
                    $message = $username . ' liked your wardrobe item';
                    
                    $query = "insert into tbl_notifications (userId, taggingUserId, feedId, message, type, timestamp) values ('".$toUserId."', '".$fromUserId."', '".$id."', '".$message."', '".$messageType."', '".date("Y-m-d H:i:s")."')";
                    mysql_query($query);
                    break;
                    
                case 'feedLike':
                    $screenName = 'stylFile';
                    $itemId = $fromUserId;
                    
                    $message = $username . ' liked your post';
                    
                    $query = "insert into tbl_notifications (userId, taggingUserId, feedId, message, type, timestamp) values ('".$toUserId."', '".$fromUserId."', '".$id."', '".$message."', '".$messageType."', '".date("Y-m-d H:i:s")."')";
                    mysql_query($query);
                    break;
                    
                case 'productLike':
                    $screenName = 'stylFile';
                    $itemId = $fromUserId;
                    
                    $message = $username . ' liked your item';
                    
                    $query = "insert into tbl_notifications (userId, taggingUserId, productId, message, type, timestamp) values ('".$toUserId."', '".$fromUserId."', '".$id."', '".$message."', '".$messageType."', '".date("Y-m-d H:i:s")."')";
                    mysql_query($query);
                    break;
                    
                case 'feedComment':
                    $screenName = 'stylFile';
                    $itemId = $fromUserId;
                    
                    $message = $username . ' commented on your post: "' . $comment . '"';
                    
                    $query = "insert into tbl_notifications (userId, taggingUserId, feedId, message, type, timestamp) values ('".$toUserId."', '".$fromUserId."', '".$id."', '".$message."', '".$messageType."', '".date("Y-m-d H:i:s")."')";
                    mysql_query($query);
                    break;
                    
                case 'productComment':
                    $screenName = 'stylFile';
                    $itemId = $fromUserId;
                    
                    $message = $username . ' commented on your item: "' . $comment . '"';
                    
                    $query = "insert into tbl_notifications (userId, taggingUserId, productId, message, type, timestamp) values ('".$toUserId."', '".$fromUserId."', '".$id."', '".$message."', '".$messageType."', '".date("Y-m-d H:i:s")."')";
                    mysql_query($query);
                    break;
                    
                case 'productPurchase':
                    $screenName = 'shopDetails';
                    $itemId = $id;
                    
                    $query = "select productTitle from tbl_products where productId='".$id."'";
                    $result = mysql_query($query);
                    while($row = mysql_fetch_assoc($result)) {
                        $productTitle = $row['productTitle'];
                    }
                    $message = 'Congratulations! Your item "' . $productTitle . '" has been sold. You will receive an email with pickup details shortly.';
                    
                    $query = "insert into tbl_notifications (userId, taggingUserId, productId, message, type, timestamp) values ('".$toUserId."', '".$fromUserId."', '".$id."', '".$message."', '".$messageType."', '".date("Y-m-d H:i:s")."')";
                    mysql_query($query);
                    break;
                    
                case 'orderStatusChanged':
                    $screenName = 'shopDetails';
                    $itemId = $id;
                    
                    $query = "select productId from tbl_orders where orderId='".$id."'";
                    $result = mysql_query($query);
                    while($row = mysql_fetch_assoc($result)) {
                        $productId = $row['productId'];
                    }
                    
                    $message = 'Status of your order number "' . $itemId . '" has changed to "' . $comment . '"';
                    
                    $query = "insert into tbl_notifications (userId, productId, message, type, timestamp) values ('".$toUserId."', '".$productId."', '".$message."', '".$messageType."', '".date("Y-m-d H:i:s")."')";
                    mysql_query($query);
                    break;
                    
                default:
                    $message = '';
                    break;
            }
        // }
        
        //echo $deviceToken . " => " . $screenName . " => " . $osname . " => " . $message . " => " . $itemId;
        
        //break;
        
        if(($isLoggedIn == 1 || $isLoggedIn == TRUE) && $deviceToken != '' && $osname != '') {
            $this -> sendNotification($deviceToken, $screenName, $osname, $message, $itemId);
        }
    }
    
	
	function sendNotification ($deviceToken, $screenName, $osName, $message, $itemId) {
        if($osName == 'android') {
            $url = 'https://android.googleapis.com/gcm/send';
            
            $msg_payload = array (
                'mtitle' => 'Test push notification title',
                'mdesc' => 'Test push notification body'
            );
            
            $message = array(
                'title' => 'StylFlip',
                'message' => $message,
                'subtitle' => '',
                'tickerText' => '',
                'msgcnt' => 1,
                'vibrate' => 1
            );
            
            $fields = array(
                'registration_ids' => array($deviceToken),
                'data' => $message,
            );
            
            
            define('GOOGLE_API_KEY', 'AIzaSyCIa3EzxPs5YTB5ujGSsv5E9XJ50ZFYq0Q');
            
            $headers = array(
                'Authorization:key=' . GOOGLE_API_KEY,
                'Content-Type: application/json'
            );

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
            
            $result = curl_exec($ch);
            
            if($result === false) {
                // die('Curl failed ' . curl_error());
            }
            
            curl_close($ch);
            // return $result;
        }
        else {
            // Put your private key's passphrase here:
            $passphrase = 'stylflip';
        
            $ctx = stream_context_create();
            stream_context_set_option($ctx, 'ssl', 'local_cert', 'apns-dev-to-be-placed-on-server.pem');
            stream_context_set_option($ctx, 'ssl', 'passphrase', $passphrase);
        
            // Open a connection to the APNS server
            $fp = stream_socket_client('ssl://gateway.sandbox.push.apple.com:2195', $err, $errstr, 60, STREAM_CLIENT_CONNECT|STREAM_CLIENT_PERSISTENT, $ctx);
        
            $send = $fp;
        
            if (!$fp) {
                // exit("Failed to connect: $err $errstr" . PHP_EOL);
            }
        
            // echo 'Connected to APNS' . PHP_EOL;
        
            if($send) {
                // Create the payload body
                $body['aps'] = array(
                                     'alert' => $message,
                                     'screen' => $screenName,
                                     'itemId' => $itemId,
                                     'sound' => 'default'
                                 );
        
                // Encode the payload as JSON
                $payload = json_encode($body);
        
                // Build the binary notification
                $msg = chr(0) . pack('n', 32) . pack('H*', $deviceToken) . pack('n', strlen($payload)) . $payload;
        
                // Send it to the server
                $result = fwrite($fp, $msg, strlen($msg));
        
                if (!$result) {
                    // echo 'Message not delivered' . PHP_EOL;
                }
                else {
                    // echo 'Message successfully delivered' . PHP_EOL;
                }
            }
        
            // Close the connection to the server
            fclose($fp);
        
            // return $send;
        }
        
	}
    
};

?>