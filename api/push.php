<?php
    
    $message = 'push test';
    $deviceToken = 'APA91bHVlYXH4BtBcZtfhGz_w5uuHCsJjTWfJ0J2MXDdH1nvOOt-fQlKgarsVsjisGdEde9lM5dO78-cqtemV6ukd-51QRYyemYDKHMzfnGUoi8KTL7I-d1SVKbaT2C5qdlX-rBmGLLO';
    
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
                     'vibrate' => 1,
                     'itemId' => 20,
                     'screen' =>  'social'
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

    /*
// Put your device token here (without spaces):
$deviceToken = '095449ee3d0399fb671958fdfd659c0e631d0594f53be3efa133564728c7a3ee';

// Put your private key's passphrase here:
$passphrase = 'stylflip';

// Put your alert message here:
$message = 'My first push notification!';

////////////////////////////////////////////////////////////////////////////////

$ctx = stream_context_create();
stream_context_set_option($ctx, 'ssl', 'local_cert', 'apns-dev-to-be-placed-on-server.pem');
stream_context_set_option($ctx, 'ssl', 'passphrase', $passphrase);

// Open a connection to the APNS server
$fp = stream_socket_client('ssl://gateway.sandbox.push.apple.com:2195', $err, $errstr, 60, STREAM_CLIENT_CONNECT|STREAM_CLIENT_PERSISTENT, $ctx);

if (!$fp)
	exit("Failed to connect: $err $errstr" . PHP_EOL);

echo 'Connected to APNS' . PHP_EOL;

// Create the payload body
$body['aps'] = array(
	'alert' => $message,
    'screen' => 'social',
	'sound' => 'default'
	);

// Encode the payload as JSON
$payload = json_encode($body);

// Build the binary notification
$msg = chr(0) . pack('n', 32) . pack('H*', $deviceToken) . pack('n', strlen($payload)) . $payload;

// Send it to the server
$result = fwrite($fp, $msg, strlen($msg));

if (!$result)
	echo 'Message not delivered' . PHP_EOL;
else
	echo 'Message successfully delivered' . PHP_EOL;

// Close the connection to the server
fclose($fp);
    */
?>