<?php
include("adminHeader.php");
?>
<script>
function getuserproduct(){
//	alert('1');
	 var sellerId=document.getElementById('sellerId').value;
	// alert(sellerId);
	 $.ajax({
					url: "ajaxrequest.php",
						type: "POST",
						data: {sellerid:sellerId},
						async: false,
						success: function(data){
						//alert(data);
						
						$('#product').html(data);
						},
					});
}
function getbuyerdetail(){
	 var buyerId=document.getElementById('buyerId').value;
	// alert(buyerId);
	 $.ajax({
					url: "ajaxrequest1.php",
						type: "POST",
						data: {buyerid:buyerId},
						async: false,
						success: function(data){
						//alert(data);
						var json = $.parseJSON(data);
						$('input[name="addressLine1"]').val(json.addressLine1);
						$('input[name="addressLine2"]').val(json.addressLine2);
						$('input[name="city"]').val(json.city);
						$('input[name="phoneNumber"]').val(json.phoneNumber);
						$('input[name="postCode"]').val(json.postCode);
						$('input[name="state"]').val(json.state);
						$('input[name="landmark"]').val(json.landmark);
					///	$('#product').html(data);
						},
					});
	
}
function showbankinput(){
	
	$('#showdiv').show();
}
</script>

<?php

if($_REQUEST['action']=='add'){
	$cnt=count($_POST['productId']);
	for($i=0;$i<$cnt;$i++){
		
		$query = "select * from tbl_products where productId=".$_POST['productId'][$i];
	//	echo $query;
		$result = mysql_query($query);
		$row = mysql_fetch_assoc($result);
		$originalPrice=$row['originalPrice'];
	//	print'<pre>';print_r($row); die;
		$discount	=$row['discountPercentage'];
	
	
		$query = "select * from tbl_users where userId= ".$_POST['sellerId'];
		$seller = mysql_query($query);
	   $sellerInfo = mysql_fetch_assoc($seller);
	   $firstName=$sellerInfo['firstName'];
	   $lastName=$sellerInfo['lastName'];
//print_R($_POST);
	  $query = "insert into tbl_orders (buyerId, sellerId, productId, amount, originalPrice, discount, addressLine1, addressLine2, city, landmark, phoneNumber, postCode, state, firstName, lastName, status, orderDate, transactionId, payUTransactionId, type, payUStatus, paymentMode, cardCategory, amountDebitedByPayU, pgType, bankRefNumber, bankCode, nameOnCard, cardNumber, issuingBank, cardType, errorCode, errorMessage,created_by) values ('".$_POST['buyerId']."', '".$_POST['sellerId']."', '".$_POST['productId'][$i]."', '".$originalPrice."', '".$originalPrice."', '".$discount."', '".$_POST['addressLine1']."', '".$_POST['addressLine2']."', '".$_POST['city']."', '".$_POST['landmark']."', '".$_POST['phoneNumber']."', '".$_POST['postCode']."', '".$_POST['state']."', '".$firstName."', '".$lastName."', 'Processing', '".date("Y-m-d H:i:s")."', '', '', 'success', 'captured', '".$_POST['paymentMode']."', 'domestic', '', '".$_POST['pgType']."', '".$_POST['bankRefNumber']."', '".$_POST['bankCode']."', '".$_POST['nameOnCard']."', '".$_POST['cardNumber']."', '-', '".$data['cardType']."', 'E000', 'No Error','admin')";
	// echo $query;  echo '<br/>';
	 mysql_query($query);
	 
	  $query = "update tbl_products set isPurchased = 1 WHERE productId = '".$_POST['productId'][$i]."'";
          //  $result = mysql_query($query);
			
	}
	  setMessage("Order has been added successfully");
			 header("Location:Addorder.php");
			
			 //exit;
}
function GetOrderId()
{
	 $query = "select orderId from tbl_orders order by orderId desc limit 0, 1";
       $result = mysql_query($query);
                
                while($row = mysql_fetch_assoc($result)){
                    $order = $row['orderId'];
                }
				$orderId =$order+1;
				return $orderId;
}
function GetUsers()
{
	 $query = "select * from tbl_orders order by orderId desc ";
       $result = mysql_query($query);
                
                while($row = mysql_fetch_assoc($result)){
                    $order = $row['orderId'];
                }
				$orderId =$order+1;
				return $orderId;
}
function setMessage ($message) {
		$_SESSION['message'] = $message;
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
    } ?>
<form name="companyForm" method="post" enctype="multipart/form-data" action="Addorder.php?action=add">
  <table class="table">
    
    <tr>
      <td align="right"><div align="right"><strong>Add New Order</strong></div></td>
      <td>&nbsp;</td>
    </tr>

    <tr>
      <td align="right">&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
	
	 <tr>
      <td align="right"><div align="right">Order ID :</div></td>
      <td><input type="text" name="orderId" id="orderId" readonly value="<?=GetOrderId()?>" ></td>
    </tr>
	<tr>
      <td align="right"><div align="right">Select Seller :</div></td>
      <td><select name="sellerId"id="sellerId" onchange="getuserproduct()">
	<?php $query = "select * from tbl_users where  isActive='1' order by firstName desc ";
       $result = mysql_query($query);
                
                while($row = mysql_fetch_assoc($result)){
                   // $order = $row['orderId'];
                //}
	 ?>
    
	  
	  <option value="<?=$row['userId']?>" > <?=$row['firstName'] .  " " . $row['lastName'] ."-".$row['email'];?></option>
 <?php } ?>	 
	 </select></td>
	 
    </tr>
	
	<tr><td colspan="2">
	<div id="product"></div></td></tr>
	<tr>  
		  <td align="right"><div align="right">Select Buyer :</div></td>
		  <td><select name="buyerId" id="buyerId" onchange="getbuyerdetail()">
		<?php $query = "select * from tbl_users where  isActive='1' order by firstName desc ";
		   $result = mysql_query($query);
					
					while($row = mysql_fetch_assoc($result)){
					   // $order = $row['orderId'];
					//}
		 ?>
		
		  
		  <option value="<?=$row['userId']?>"> <?=$row['firstName'] .  " " . $row['lastName'] ."-".$row['email'];?></option>
	 <?php } ?>	 
		 </select></td>
		 
		</tr>
		 
	<tr>
      <td align="right"><div align="right"> Buyer address:</div></td>
      <td><input type="text" name="addressLine1" id="addressLine1"  >
      <input type="text" name="addressLine2" id="addressLine2"  ></td>
    </tr>
	<tr>
      <td align="right"><div align="right">Contact No.:</div></td>
      <td><input type="text" name="phoneNumber" id="phoneNumber"  ></td>
    </tr>
	<tr>
      <td align="right"><div align="right">City:</div></td>
      <td><input type="text" name="city" id="city"  ></td>
    </tr>
	<tr>
      <td align="right"><div align="right">Postcode:</div></td>
      <td><input type="text" name="postCode" id="postCode"  ></td>
    </tr>
	<tr>
      <td align="right"><div align="right">State:</div></td>
      <td><input type="text" name="state" id="state"  ></td>
    </tr>
	<tr>
      <td align="right"><div align="right">Landmark:</div></td>
      <td><input type="text" name="landmark" id="landmark"  ></td>
    </tr>
	<tr>
      <td align="right"><div align="right">Payment Mode:</div></td>
      <td><input type="radio" name="paymentMode" id="paymentMode" value="Cash on delivery">Cash on delivery
      <input type="radio" name="paymentMode" id="paymentMode1" onclick="showbankinput()"  value="CC">CC
      <input type="radio" name="paymentMode" id="paymentMode1" onclick="showbankinput()"  value="DC">DC
      <input type="radio" name="paymentMode" id="paymentMode1" onclick="showbankinput()"  value="NB">NB
      <input type="radio" name="paymentMode" id="paymentMode1" onclick="showbankinput()"  value="WALLET">WALLET</td>
    </tr>
	<span id="showdiv" style="display:none;">
	<tr><td align="right"><div align="right">Bank Ref. Number :</div></td>
	<td><input type="text"  name="bankRefNumber" id="bankRefNumber"/></td></tr>
	<tr><td align="right"><div align="right">Bank Code :</div></td>
	<td><input type="text"  name="bankCode" id="bankCode"/></td></tr>
	<tr><td align="right"><div align="right">Name On Card:</div></td>
	<td><input type="text"  name="nameOnCard" id="nameOnCard"/></td></tr>
	<tr><td align="right"><div align="right">Card Number :</div></td>
	<td><input type="text"  name="cardNumber" id="cardNumber"/></td></tr>
	<tr><td align="right"><div align="right">Pg Type :</div></td>
	<td><input type="text"  name="pgType" id="pgType"/></td></tr>
	</div>
		
		<tr>
		  <td align="right">&nbsp;</td>
		  <td>&nbsp;</td>
		</tr>

    <tr> 
      <td align="right"><div align="right"></div></td>
      <td><input type="submit" value="Add" name="addCompany" id="addCompany" /></td>
    </tr>

  </table>

</form>
