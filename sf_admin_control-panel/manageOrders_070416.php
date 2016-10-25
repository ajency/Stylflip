<?php
include("adminHeader.php");
include("../classes/Pagination.php");
?>

<script>
function updateOrderStatus(orderId, oldStatus, status, page) {
    // window.location = "<?php echo $baseURL; ?>" + "api/product.php?action=updateOrderStatus&orderId=" + orderId + "&status=" + status + (page != '' ? "&page=" + page : '');
	
	$('#select_'+orderId).css('display', 'none');
	$('#loader_'+orderId).html('Updating...');
	
	$.ajax({
		url: "<?php echo $baseURL; ?>" + "api/product.php",
		data: "action=updateOrderStatus&orderId=" + orderId + "&status=" + status,
		type: 'post',
		success: function(e) {
			$('#select_'+orderId).css('display', 'block');
			$('#loader_'+orderId).html('');
			alert('Order status has been successfully updated');
		},
		error: function(e) {
			$('#select_'+orderId).css('display', 'block');
			$('#loader_'+orderId).html('');
			$('#select_'+orderId).val(oldStatus);
			alert('Failed to update order status');
		}
	});
}
</script>

<table class="table">
<?php  

function getCalculatedPrice($sellingPrice) {
	if($sellingPrice == 0) {
		return 0;
	}
	$isShippingToBeAdded = $sellingPrice < 2000;
	$sellingPrice = $sellingPrice + (($sellingPrice * 20 /* StylFlip commision  */) / 100);
	if($isShippingToBeAdded) {
		$sellingPrice = $sellingPrice + 120;	//	120 is the shipping fees
	}
	return ceil($sellingPrice);
}; 

function getShippingAndHandlingFees($sellingPrice) {
	//	₹
	if($sellingPrice == 0) {
		return 'Rs. 0';
	}
	if($sellingPrice < 2000) {
		return 'Rs. 120';
	}
	return 'Rs. 0';
};

if(isset($_POST['search_text'])) {
	$search_text = $_POST['search_text'];
	$sql .= "select o.*, u.userId as sellerId, u.firstName as sellerFirstName, u.lastName as sellerLastName, u.username as sellerUsername, p.productTitle, p.isToBeDonated, p.sellingPrice, p.pickupFrom from tbl_orders o, tbl_products p, tbl_users u where o.firstName like '%".$search_text."%' or o.lastName like '%".$search_text."%' or ";
	$sql .= " o.city like '%".$search_text."%' where o.productId = p.productId and p.userId = u.userId";
}
else {
	$sql .= "select o.*, u.userId as sellerId, u.firstName as sellerFirstName, u.lastName as sellerLastName, u.username as sellerUsername, p.productTitle, p.isToBeDonated, p.sellingPrice, p.pickupFrom from tbl_orders o, tbl_products p, tbl_users u where o.productId = p.productId and p.userId = u.userId order by o.orderId desc";
}
?>


<?php
$pager = new Pagination($con, $sql, $rowsPerPage=15);
$pager->setDebug(true);
$result = $pager->paginate();
//if(!$result) die(mysql_error());

$total_rows = mysql_num_rows($result);

?>


<tr>
	  <td  colspan="20" align="right"><form method="post" action="manageOrders.php"><input type="text" placeholder="Search order" name="search_text" value="<?php if(isset($_REQUEST['search_text']))echo $_REQUEST['search_text']; ?>"><input type="submit" value="Search"> | <a href="manageOrders.php">View All</a><?php if($isSuperAdmin || $isLogistics) { ?> | <a href="downloadReport.php?exportType=ordersData">Export</a><?php } ?></form></td>
</tr>	

<?php
	if ($total_rows > 0) {
?>
<tr>
    <td  colspan="20"><div align="right"><strong>Page  - </strong> <?php echo $pager->renderNav('<span>', '</span>'); ?>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td>
</tr>	
  <tr>
    <td  colspan="20"></td>
  </tr>
<?php		
	}
?>
</table>	


<div style="overflow: scroll;">
<table class="table" style="width: 130%;">
<tr>
  	<th>Sr no</th>
	<th>Order number</th>
	<th>SKU</th>
	<th>Product title </th>
	<th>Transaction ID</th>
	<th>PayU ID</th>
  	<th>Buyer name</th>
  	<th>Buyer address</th>
  	<th>Buyer contact no.</th>
  	<th>Seller name</th>
  	<th>Seller pickup address</th>
  	<th>Seller contact no.</th>
  	<th width="12%">Price break-up</th>
  	<th>Coupon used</th>
  	<th>Coupon amount</th>
  	<th>COD charges</th>
	<th>Final amount paid</th>
	<th>Ordered on</th>
	<th>Payment mode</th>
  	<th>Status</th>
  	<th>Forward AWB</th>
  	<th>Forward courier</th>
  	<th>Reverse AWB</th>
  	<th>Reverse courier</th>
  	<th>Manage</th>
</tr>


<?php

if ($total_rows == 0) {
?>
<tr>
    <td  colspan="20"><div align="center">No orders found.</div></td>
</tr>

<?php
}
else {
	if (isset($_REQUEST['page']) && $_REQUEST['page'] > 1) {
		$sr = (($_REQUEST['page'] - 1) * $pager->rowsPerPage()) + 1;	
	}
	else {
		$sr = 1;			
	}
	
	while($row = mysql_fetch_assoc($result)) {
		// $query = "select username from tbl_users where userId = '" . $row['buyerId'] . "'";
		// while($row1 = mysql_fetch_assoc(mysql_query($query))) {
			// $buyerUsername = $row1['username'];
		// }
		// 		
		// $query = "select username from tbl_users where userId = '" . $row['sellerId'] . "'";
		// while($row1 = mysql_fetch_assoc(mysql_query($query))) {
			// $sellerUsername = $row1['username'];
		// }
		
        $orderId = $row['orderId'];
		$buyer = $row['firstName'] .  " " . $row['lastName'];
		$seller = $row['sellerFirstName'] .  " " . $row['sellerLastName'];
		
		if(trim($seller) == '') {
			$seller = $row['sellerUsername'];
		}
		
		$address = $row['addressLine1'] . ", " . $row['addressLine2'] . ", " . $row['landmark'] . ", " . $row['city'] . ", " . $row['state'] . " - " . $row['postCode'];
		$status = $row['status'];
    $amount = $row['amount'];
        $transactionId = $row['transactionId'];
		$errorMessage = $row['errorMessage'];
		$isToBeDonated = $row['isToBeDonated'];
		
		$priceBreakUp = '<b>Asking Price</b>: Rs. ' . $row['sellingPrice'] . '<br/>';
		$priceBreakUp .= '<b>SF Comm.</b>: Rs. ' . (ceil($row['sellingPrice'] * 20) / 100) . '<br/>';
		$priceBreakUp .= '<b>S & H</b>: '.getShippingAndHandlingFees($row['sellingPrice']) . '<br/>';
		$priceBreakUp .= '<b>Display Price</b>: Rs. ' .getCalculatedPrice($row['sellingPrice']);
		
		$couponDiscount = 0;
		$couponType = 'flat';
		
		$query = "select discount, type from tbl_coupon_codes where couponCode = '".$row['couponCodeUsed']."'";
		$couponCodeResult = mysql_query($query);
		while($couponCodeRow = mysql_fetch_assoc($couponCodeResult)) {
			$couponDiscount = $couponCodeRow['discount'];
			$couponType = $couponCodeRow['type'];
		}
		
		if($couponType == 'percent') {
			$couponDiscount = getCalculatedPrice($row['sellingPrice']) * $couponDiscount / 100; 
		}

		$couponDiscount = 'Rs. ' . $couponDiscount;
?>

<tr>
	<td><?php echo $sr; ?></td>
    <td width="5%"><?php echo $orderId; ?> <br /> <?php if($isToBeDonated == 1) { echo 'Note: The Seller has opted for the Proceeds from this sale to be Donated to a Charitable Cause'; } ?> </td>
	<td><?php echo 'SF00000'.$row['productId']; ?></td>
	<td><a href="viewProducts.php?productId=<?php echo $row['productId']; ?>"><u><?php echo $row['productTitle']; ?></u></a></td>
    <td><?php echo $transactionId; ?></td>
    <td><?php echo $row['payUTransactionId']; ?></td>
	<td><a href="manageUsers.php?userId=<?php echo $row['buyerId']; ?>"><u><?php echo $buyer; ?></u></a></td>
	<td><?php echo $address; ?></td>
	<td><?php echo $row['phoneNumber']; ?></td>
	<td><a href="manageUsers.php?userId=<?php echo $row['sellerId']; ?>"><u><?php echo $seller; ?></u></a></td>
	<td>
		<?php
			$sellerContactNo = '';
			
			$query = "select * from tbl_user_addresses where userId='". $row['sellerId'] ."' and addressTitle='".$row['pickupFrom']."'";
			$addressesResult = mysql_query($query);
	        if($addressesResult) {
				while($addressesRow = mysql_fetch_assoc($addressesResult)) {
					$sellerContactNo = $addressesRow['phoneNumber'];
		?>
		<?php echo '<b>' . $addressesRow['addressTitle'] . '</b>: ' . $addressesRow['addressLine1'] . ', ' . $addressesRow['addressLine2'] . ', ' . $addressesRow['landmark'] . ', ' . $addressesRow['state'] . ', ' . $addressesRow['city'] . ', ' . $addressesRow['postCode']; ?>
		<?php			
				}
			}
		?>
	</td>
	<td><?php echo $sellerContactNo; ?></td>
	<td><?php echo $priceBreakUp; ?></td>
	<td><?php echo $row['couponCodeUsed']; ?></td>
	<td><?php echo $couponDiscount; ?></td>
	<td><?php echo $row['paymentMode'] == 'Cash on delivery' ? 'Rs. 85' : 'Rs. 0'; ?></td>
	<td><?php echo "Rs. " . $amount; ?></td>
	<td><?php echo $row['orderDate']; ?></td>
	<td><?php echo $row['paymentMode']; ?></td>
	<td><?php 
	
		if($errorMessage == 'No Error' || $errorMessage == '') {
			if($isSuperAdmin && $row['status'] == 'Complete') {
	?>
<select id="select_<?php echo $orderId; ?>" onchange="updateOrderStatus('<?php echo $row['orderId']; ?>', '<?php echo $row['status']; ?>', this.value, '<?php if(isset($_REQUEST['page'])) { echo $_REQUEST['page']; } ?>')">
<option value="">Select status</option>
<option value="Processing" <?php if($row['status'] == "Processing") { echo "selected"; } ?>>Processing</option>
<option value="Shipped by seller" <?php if($row['status'] == "Shipped by seller") { echo "selected"; } ?>>Shipped by seller</option>
<option value="Under QA" <?php if($row['status'] == "Under QA") { echo "selected"; } ?>>Under QA</option>
<option value="Shipped to buyer" <?php if($row['status'] == "Shipped to buyer") { echo "selected"; } ?>>Shipped to buyer</option>
<option value="Complete" <?php if($row['status'] == "Complete") { echo "selected"; } ?>>Complete</option>
<option value="Rejected by StylFlip" <?php if($row['status'] == "Rejected by StylFlip") { echo "selected"; } ?>>Rejected by StylFlip</option>
<option value="Returned by buyer" <?php if($row['status'] == "Returned by buyer") { echo "selected"; } ?>>Returned by buyer</option>
</select>
	<?php
			}
			else if (!$isSuperAdmin && $row['status'] == 'complete'){
				echo $row['status'];
			}
			else {
	?>
<select id="select_<?php echo $orderId; ?>" onchange="updateOrderStatus('<?php echo $row['orderId']; ?>', '<?php echo $row['status']; ?>', this.value, '<?php if(isset($_REQUEST['page'])) { echo $_REQUEST['page']; } ?>')">
<option value="">Select status</option>
<option value="Processing" <?php if($row['status'] == "Processing") { echo "selected"; } ?>>Processing</option>
<option value="Shipped by seller" <?php if($row['status'] == "Shipped by seller") { echo "selected"; } ?>>Shipped by seller</option>
<option value="Under QA" <?php if($row['status'] == "Under QA") { echo "selected"; } ?>>Under QA</option>
<option value="Shipped to buyer" <?php if($row['status'] == "Shipped to buyer") { echo "selected"; } ?>>Shipped to buyer</option>
<option value="Complete" <?php if($row['status'] == "Complete") { echo "selected"; } ?>>Complete</option>
<option value="Rejected by StylFlip" <?php if($row['status'] == "Rejected by StylFlip") { echo "selected"; } ?>>Rejected by StylFlip</option>
<option value="Returned by buyer" <?php if($row['status'] == "Returned by buyer") { echo "selected"; } ?>>Returned by buyer</option>
</select>	
	<?php	
			}
	 	} 
	 	else {
	 		 echo $errorMessage; 
		} 
 	?>
	<div id="loader_<?php echo $orderId; ?>"></div>
</td>
<td><?php echo $row['AWB']; ?></td>
<td><?php echo $row['courier']; ?></td>
<td><?php echo $row['reverseAWB']; ?></td>
<td><?php echo $row['reverseCourier']; ?></td>
<td><a href="editOrder.php?orderId=<?php echo $row['orderId']; ?><?php if(isset($_REQUEST['page'])) { echo "&page=" . $_REQUEST['page']; }  ?>">Update</a></td>
<?php
		$sr=$sr+1;
	}
?>
</tr>
<?php
}	
?>
</table>
</div>

<table class="table">
	<tr>
    <td  colspan="20"></td>
  </tr>
  <tr>
    <td  colspan="20"><div align="right"><strong>Page  - </strong> <?php echo $pager->renderNav('<span>', '</span>'); ?>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td>
  </tr>
</table>

<?php
mysql_close($con);  
?>