<?php

require_once dirname( __FILE__ ) . '/payu.php';
require_once("../classes/ConnectDB.php");
    
/* Payments made easy. */

    pay_page( array (	'key' => 'gtKFFx', 'ismobileview' => 1, 'txnid' => $_REQUEST['transactionId'], 'amount' => $_REQUEST['amount'],
			'firstname' => $_REQUEST['firstName'] . ' ' . $_REQUEST['lastName'], 'email' => $_REQUEST['email'], 'phone' => $_REQUEST['phoneNumber'],
			'productinfo' => $_REQUEST['productTitle'], 'state' => $_REQUEST['state'], 'city' => $_REQUEST['city'], 'surl' => 'payment_success', 'furl' => 'payment_failure'), 'eCwWELxi' );

/* And we are done. */
    
    
    function getPayUStatusMessage($status) {
        if($status == 'userCancelled') {
            return 'User cancelled transaction.';
        }
        return 'An error occurred while performing transaction.';
    }
    

    function createOrder($data) {
        $response = array();
        $response['data'] = array();
        $response['success'] = false;
        
        $query = "insert into tbl_orders (buyerId, sellerId, productId, amount, originalPrice, discount, addressLine1, addressLine2, city, landmark, phoneNumber, postCode, state, firstName, lastName, status, orderDate, transactionId, payUTransactionId, type, payUStatus, paymentMode, cardCategory, amountDebitedByPayU, pgType, bankRefNumber, bankCode, nameOnCard, cardNumber, issuingBank, cardType, errorCode, errorMessage) values ('".$data['buyerId']."', '".$data['sellerId']."', '".$data['productId']."', '".$data['amount']."', '".$data['originalPrice']."', '".$data['discount']."', '".$data['addressLine1']."', '".$data['addressLine2']."', '".$data['city']."', '".$data['landmark']."', '".$data['phoneNumber']."', '".$data['postCode']."', '".$data['state']."', '".$data['firstName']."', '".$data['lastName']."', 'Processing', '".date("d/m/Y")."', '".$data['transactionId']."', '".$data['payUTransactionId']."', '".$data['type']."', '".$data['payUStatus']."', '".$data['paymentMode']."', '".$data['cardCategory']."', '".$data['amountDebitedByPayU']."', '".$data['pgType']."', '".$data['bankRefNumber']."', '".$data['bankCode']."', '".$data['nameOnCard']."', '".$data['cardNumber']."', '".$data['issuingBank']."', '".$data['cardType']."', '".$data['errorCode']."', '".$data['errorMessage']."')";
        
        $result = mysql_query($query);
        
        if($result) {
            if($data['type'] == 'success') {
                $query = "select orderId from tbl_orders order by orderId desc limit 0, 1";
                $result = mysql_query($query);
                
                while($row = mysql_fetch_assoc($result)){
                    $orderId = $row['orderId'];
                }
                
                $query = "update tbl_products set isPurchased = 0 WHERE productId = '".$data['productId']."'";
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
                
                require_once("../classes/Mailer.php");
                $mailer = new Mailer();
                
                /*
                 *  Send email to buyer
                 */
                if($data['buyerEmail'] != '') {
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
                                       'productImage' => $data['productImage'],
                                       'productTitle' => $data['productTitle'],
                                       'sellerName' => $data['sellerName'],
                                       'sellingPrice' => $data['amount']
                                       );
                    $body = $mailer -> getCompiledTemplate('../emailTemplates/orderConfirmationToBuyer.html', $variables);
                    $mailer -> send($data['buyerEmail'], false, 'Your StylFlip order confirmation', $body);
                }
                
                /*
                 *  Send email to seller
                 */
                if($data['sellerEmail'] != '') {
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
                                       'productImage' => $data['productImage'],
                                       'productTitle' => $data['productTitle'],
                                       'sellerName' => $data['sellerName'],
                                       'sellingPrice' => $data['amount']
                                       );
                    $body = $mailer -> getCompiledTemplate('../emailTemplates/orderConfirmationToSeller.html', $variables);
                    $mailer -> send($data['sellerEmail'], false, 'Congratulations! Your item has just been sold on StylFlip', $body);
                }
            }
            else {
                $response['success'] = false;
            }
        }
        return $response;
    }
    
		
function payment_success() {
    $arr = $_POST;
    $str = '';
    
    foreach($arr as $key => $value) {
        $str .= $key . '=' . $value . '&';
    }
    
    $data = array (
        'buyerId' =>  $_REQUEST['buyerId'],
        'sellerId' =>  $_REQUEST['sellerId'],
        'sellerName' =>  $_REQUEST['sellerName'],
        'sellerEmail' =>  $_REQUEST['sellerEmail'],
        'productTitle' =>  $_REQUEST['productTitle'],
        'productImage' =>  $_REQUEST['productImage'],
        'productId' =>  $_REQUEST['productId'],
        'amount' =>  $_REQUEST['amount'],
        'sellingPrice' =>  $_REQUEST['sellingPrice'],
        'originalPrice' =>  $_REQUEST['originalPrice'],
        'discount' =>  $_REQUEST['discount'],
        'transactionId' =>  $_REQUEST['transactionId'],
        'addressLine1' =>  $_REQUEST['addressLine1'],
        'addressLine2' =>  $_REQUEST['addressLine2'],
        'state' =>  $_REQUEST['state'],
        'city' =>  $_REQUEST['city'],
        'landmark' =>  $_REQUEST['landmark'],
        'postCode' =>  $_REQUEST['postCode'],
        'phoneNumber' =>  $_REQUEST['phoneNumber'],
        'firstName' =>  $_REQUEST['firstName'],
        'lastName' =>  $_REQUEST['lastName'],
        'buyerEmail' =>  $_REQUEST['email'],
        'payUTransactionId' =>  $_REQUEST['mihpayid'],
        'type' =>  'success',
        'payUStatus' =>  $_REQUEST['unmappedstatus'],
        'paymentMode' =>  $_REQUEST['mode'],
        'cardCategory' =>  $_REQUEST['cardCategory'],
        'amountDebitedByPayU' =>  $_REQUEST['net_amount_debit'],
        'pgType' =>  $_REQUEST['PG_TYPE'],
        'bankRefNumber' =>  $_REQUEST['bank_ref_num'],
        'bankCode' =>  $_REQUEST['bankcode'],
        'nameOnCard' =>  $_REQUEST['name_on_card'],
        'cardNumber' =>  $_REQUEST['cardnum'],
        'issuingBank' =>  $_REQUEST['issuing_bank'],
        'cardType' =>  $_REQUEST['card_type'],
        'errorCode' =>  $_REQUEST['error'],
        'errorMessage' =>  $_REQUEST['error_Message']
    );
    
    $response = array();
    $response = createOrder($data);
    
    header('Location: success.php?orderId=' . $response['data']['orderId']);
}

function payment_failure() {
    $arr = $_POST;
    $str = '';

    foreach($arr as $key => $value) {
        $str .= $key . '=' . $value . '&';
    }
    
    $data = array (
                   'buyerId' =>  $_REQUEST['buyerId'],
                   'sellerId' =>  $_REQUEST['sellerId'],
                   'sellerName' =>  $_REQUEST['sellerName'],
                   'sellerEmail' =>  $_REQUEST['sellerEmail'],
                   'productTitle' =>  $_REQUEST['productTitle'],
                   'productImage' =>  $_REQUEST['productImage'],
                   'productId' =>  $_REQUEST['productId'],
                   'amount' =>  $_REQUEST['amount'],
                   'sellingPrice' =>  $_REQUEST['sellingPrice'],
                   'originalPrice' =>  $_REQUEST['originalPrice'],
                   'discount' =>  $_REQUEST['discount'],
                   'transactionId' =>  $_REQUEST['transactionId'],
                   'addressLine1' =>  $_REQUEST['addressLine1'],
                   'addressLine2' =>  $_REQUEST['addressLine2'],
                   'state' =>  $_REQUEST['state'],
                   'city' =>  $_REQUEST['city'],
                   'landmark' =>  $_REQUEST['landmark'],
                   'postCode' =>  $_REQUEST['postCode'],
                   'phoneNumber' =>  $_REQUEST['phoneNumber'],
                   'firstName' =>  $_REQUEST['firstName'],
                   'lastName' =>  $_REQUEST['lastName'],
                   'buyerEmail' =>  $_REQUEST['email'],
                   'payUTransactionId' =>  $_REQUEST['mihpayid'],
                   'type' =>  'error',
                   'payUStatus' =>  $_REQUEST['unmappedstatus'],
                   'paymentMode' =>  $_REQUEST['mode'] == '' ? '-' : $_REQUEST['mode'],
                   'cardCategory' =>  $_REQUEST['cardCategory'] == '' ? '-' : $_REQUEST['cardCategory'],
                   'amountDebitedByPayU' =>  $_REQUEST['net_amount_debit'] == '' ? '0' : $_REQUEST['net_amount_debit'],
                   'pgType' =>  $_REQUEST['PG_TYPE'] == '' ? '-' : $_REQUEST['PG_TYPE'],
                   'bankRefNumber' =>  $_REQUEST['bank_ref_num'] == '' ? '-' : $_REQUEST['bank_ref_num'],
                   'bankCode' =>  $_REQUEST['bankcode'] == '' ? '-' : $_REQUEST['bankcode'],
                   'nameOnCard' =>  $_REQUEST['name_on_card'] == '' ? '-' : $_REQUEST['name_on_card'],
                   'cardNumber' =>  $_REQUEST['cardnum'] == '' ? '-' : $_REQUEST['cardnum'],
                   'issuingBank' =>  $_REQUEST['issuing_bank'] == '' ? '-' : $_REQUEST['issuing_bank'],
                   'cardType' =>  $_REQUEST['card_type'] == '' ? '-' : $_REQUEST['card_type'],
                   'errorCode' =>  $_REQUEST['error'] == '' ? '-' : $_REQUEST['error'],
                   'errorMessage' =>  getPayUStatusMessage($_REQUEST['unmappedstatus'])
                   );
    
    createOrder($data);
    
    header('Location: failure.php?errorMessage=' . getPayUStatusMessage($_REQUEST['unmappedstatus']));
}
    
    
    
