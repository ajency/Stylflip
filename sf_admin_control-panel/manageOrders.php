<?php
include("adminHeader.php");
include("../classes/Pagination.php");
?>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>
<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>

 
  
<script>


function updateOrderStatus(orderId, oldStatus, status, page,ProductId,DD,Reuse,search_text1,search_text) {

	if(status=='Delievered'){
		$('#order_id').val(orderId);
		$('#delivery_date').val(DD);
		
		$('#delievered').modal('show');
		
/*	$.ajax({
		url: "<?php echo $baseURL; ?>" + "api/product.php",
		data: "action=updateOrderStatus&orderId=" + orderId + "&status=" + status,
		type: 'post',
		success: function(e) {
			$('#select_'+orderId).css('display', 'block');
			$('#loader_'+orderId).html('');
			
		},
		error: function(e) {
			$('#select_'+orderId).css('display', 'block');
			$('#loader_'+orderId).html('');
			$('#select_'+orderId).val(oldStatus);
			
		}
	});
	*/
	}
	else if(status=='Cancelled'){
	$('#order_id1').val(orderId);
	//$('#relist_item').val(Reuse);
	if(Reuse=='Yes'){
	$("input[name=relist_item][value='Yes']").prop("checked",true);
	}
	else {
	$("input[name=relist_item][value='No']").prop("checked",true);
	}
	$('#cancelled').modal('show');
	$('#Product_id').val(ProductId);
	$.ajax({
		url: "<?php echo $baseURL; ?>" + "api/product.php",
		data: "action=updateOrderStatus&orderId=" + orderId + "&status=" + status+ "&page=" + page+ "&search_text1=" + search_text1+ "&search_text=" + search_text,
		type: 'post',
		success: function(e) {
			$('#select_'+orderId).css('display', 'block');
			$('#loader_'+orderId).html('');
			
		},
		error: function(e) {
			$('#select_'+orderId).css('display', 'block');
			$('#loader_'+orderId).html('');
			$('#select_'+orderId).val(oldStatus);
			
		}
	});
	}
	else{
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
}

</script>
<?php
function setMessage ($message) {
		$_SESSION['message'] = $message;
	}
?>	
<?php 

	
 if($_REQUEST['action']=='updateOrderStatus'){
$query = "update tbl_orders set status = 'Delievered' , delivery_date ='".$_POST['delivery_date']."' WHERE orderId = '".$_POST['order_id']."'";

      $result = mysql_query($query);
	  //setMessage("Order status has been updated successfully");
}
if($_REQUEST['action']=='updateOrderStatus1'){
$query = "update tbl_orders set status = 'Cancelled' , relist_item ='".$_POST['relist_item']."' WHERE orderId = '".$_POST['order_id1']."'";
//echo $query; die;
      $result = mysql_query($query);
	  if($_POST['relist_item']=='Yes'){
	  $query = "update tbl_products set isPurchased = '0' , isApproved = '1'  WHERE productId = '".$_POST['Product_id']."'";
	 
	  mysql_query($query);
	  } 
	  if($_POST['relist_item']=='No'){
	  $query = "update tbl_products set isApproved = '0'  WHERE productId = '".$_POST['Product_id']."'";
	   mysql_query($query);
	  }
	  //setMessage("Order status has been updated successfully");
}
?>
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
function EntryDate($mysqldate, $format='d/m/Y')
		{
			if($mysqldate)
			{
				$arrdate = explode('-',$mysqldate);
				$entrydate = date($format, mktime(0, 0, 0, $arrdate[1], $arrdate[2], $arrdate[0]));
				return $entrydate;
			}
			else
			{
				return;
			}
		}
if($_REQUEST['search_text']!='' && $_REQUEST['search_text1']==''){

	$search_text = $_REQUEST['search_text'];
	$sql .= "select o.*, u.userId as sellerId, u.firstName as sellerFirstName, u.lastName as sellerLastName, u.username as sellerUsername, p.productTitle, p.isToBeDonated, p.sellingPrice, p.pickupFrom from tbl_orders o, tbl_products p, tbl_users u where o.firstName like '%".$search_text."%' or o.lastName like '%".$search_text."%' or ";
	$sql .= " o.orderId like '%".$search_text."%' and o.productId = p.productId and p.userId = u.userId order by o.orderId desc";
}
elseif($_REQUEST['search_text1']!='' && $_REQUEST['search_text']==''){

	$search_text1 = $_REQUEST['search_text1'];
	
	
	$sql .= "select o.*, u.userId as sellerId, u.firstName as sellerFirstName, u.lastName as sellerLastName, u.username as sellerUsername, p.productTitle, p.isToBeDonated, p.sellingPrice, p.pickupFrom from tbl_orders o, tbl_products p, tbl_users u where ";
	$sql .= "o.status='".$search_text1."' and  ( o.errorMessage =' ' or  o.errorMessage = 'No Error') and o.productId = p.productId and p.userId = u.userId order by o.orderId desc";
}
	

elseif($_REQUEST['search_text'] !='' && $_REQUEST['search_text1']!=''){


	$search_text = $_REQUEST['search_text'];
	$search_text1 = $_REQUEST['search_text1'];
	
	$sql .= "select o.*, u.userId as sellerId, u.firstName as sellerFirstName, u.lastName as sellerLastName, u.username as sellerUsername, p.productTitle, p.isToBeDonated, p.sellingPrice, p.pickupFrom from tbl_orders o, tbl_products p, tbl_users u where o.firstName like '%".$search_text."%' or o.lastName like '%".$search_text."%' or ";
	$sql .= " o.orderId like '%".$search_text."%' and o.status='".$search_text1."'  and  ( o.errorMessage =' ' or  o.errorMessage = 'No Error') and o.productId = p.productId and p.userId = u.userId order by o.orderId desc" ;

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

<?php // print_r($_REQUEST); ?>
<tr>
	  <td  colspan="20" align="right"><form method="post" action="manageOrders.php"><input type="text" placeholder="Search order" name="search_text" value="<?php if(isset($_REQUEST['search_text']))echo $_REQUEST['search_text']; ?>">
	  
	  <select name="search_text1">
		<option value="">Select status</option>
		<option value="Processing" <?=($_REQUEST['search_text1'] == 'Processing')?'selected':''; ?>>Processing</option>
		<option value="Shipped by seller" <?=($_REQUEST['search_text1'] == 'Shipped by seller')?'selected':''; ?>>Shipped by seller</option>
		<option value="Under QA" <?=($_REQUEST['search_text1'] == 'Under QA')?'selected':''; ?>>Under QA</option>
		<option value="Shipped to buyer" <?=($_REQUEST['search_text1'] == 'Shipped to buyer')?'selected':''; ?>>Shipped to buyer</option>
		<option value="Complete" <?=($_REQUEST['search_text1'] == 'Complete')?'selected':''; ?>>Complete</option>
		<option value="Rejected by StylFlip" <?=($_REQUEST['search_text1'] == 'Rejected by StylFlip')?'selected':''; ?>>Rejected by StylFlip</option>
		<option value="Returned by buyer" <?=($_REQUEST['search_text1'] == 'Returned by buyer')?'selected':''; ?>>Returned by buyer</option>
		<option value="Delievered" <?=($_REQUEST['search_text1'] == 'Delievered')?'selected':''; ?>>Delievered</option>
		<option value="Cancelled" <?=($_REQUEST['search_text1'] == 'Cancelled')?'selected':''; ?>>Cancelled</option>
		</select>
	  
	  <input type="submit" value="Search"> | <a href="manageOrders.php">View All</a><?php if($isSuperAdmin || $isLogistics || $isExecutive || $isManager) { ?> | <a href="downloadReport.php?exportType=ordersData">Export</a><?php } ?></form></td>
</tr>	

<?php
	if ($total_rows > 0) {
?>
<tr>
    <td  colspan="20"><div align="right"><strong>Page  - </strong> <?php echo $pager->renderNav2('<span>', '</span>',$_REQUEST['search_text'],$_REQUEST['search_text1']); ?>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td>
</tr>
<tr>
    <td  colspan="20"><div align="right"><a href="Addorder.php" target="blank">Add Order </a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td>
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
	<th>Status</th>
	<th>Manage</th>
	<th>Ordered on</th>
	<th>Delivery on</th>
	<th>To be Donated ?</th>
	<th>Seller name</th>
	<th>Buyer name</th>
	<th>SKU</th>
	<th>Product title </th>
	<th>Payment mode</th>
  	
	<th>Transaction ID</th>
	<th>PayU ID</th>
	<th>Final amount paid</th>
	<th width="12%">Price break-up</th>
	<th>Coupon used</th>
  	<th>Coupon amount</th>
  	<th>COD charges</th>
  	<th>Buyer address</th>
  	<th>Buyer contact no.</th>
  
  	<th>Seller pickup address</th>
  	<th>Seller contact no.</th>
  	
  
	<th>Reverse AWB</th>
  	<th>Reverse courier</th>
	
  	<th>Forward AWB</th>
  	<th>Forward courier</th>
  	<th>QC Date</th>
  	
  	<th>Payment Reference Nodal</th>
  	<th>Payment Reference Current</th>
  	<th>Payment Date</th>
  	<th>Order From</th>
  	
  	
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
    <td width="5%"><?php echo $orderId; ?>   </td>
		<td><?php if(!$isViewer) { 
	
		if($errorMessage == 'No Error' || $errorMessage == '') {
			if($isSuperAdmin && $row['status'] == 'Complete') {
	?>
<select id="select_<?php echo $orderId; ?>" onchange="updateOrderStatus('<?php echo $row['orderId']; ?>', '<?php echo $row['status']; ?>', this.value, '<?php if(isset($_REQUEST['page'])) { echo $_REQUEST['page']; } ?>','<?php echo $row['productId']; ?>','<?php echo $row['delivery_date']; ?>','<?php echo $row['relist_item']; ?>', '<?php if(isset($_REQUEST['search_text1'])) { echo $_REQUEST['search_text1']; } ?>', '<?php if(isset($_REQUEST['search_text'])) { echo $_REQUEST['search_text']; } ?>')"  >
<option value="">Select status</option>
<option value="Processing" <?php if($row['status'] == "Processing") { echo "selected"; } ?>>Processing</option>
<option value="Shipped by seller" <?php if($row['status'] == "Shipped by seller") { echo "selected"; } ?>>Shipped by seller</option>
<option value="Under QA" <?php if($row['status'] == "Under QA") { echo "selected"; } ?>>Under QA</option>
<option value="Shipped to buyer" <?php if($row['status'] == "Shipped to buyer") { echo "selected"; } ?>>Shipped to buyer</option>
<option value="Complete" <?php if($row['status'] == "Complete") { echo "selected"; } ?>>Complete</option>
<option value="Rejected by StylFlip" <?php if($row['status'] == "Rejected by StylFlip") { echo "selected"; } ?>>Rejected by StylFlip</option>
<option value="Returned by buyer" <?php if($row['status'] == "Returned by buyer") { echo "selected"; } ?>>Returned by buyer</option>
<option value="Delievered"    data-toggle="modal" data-target="#delievered"  <?php if($row['status'] == "Delievered") { echo "selected"; } ?>>Delievered</option>
<option value="Cancelled"    data-toggle="modal" data-target="#cancelled"  <?php if($row['status'] == "Cancelled") { echo "selected"; } ?>>Cancelled</option>
</select>
	<?php
			}
			else if (!$isSuperAdmin && $row['status'] == 'complete'){
				echo $row['status'];
			}
			else {
	?>
<select id="select_<?php echo $orderId; ?>" onchange="updateOrderStatus('<?php echo $row['orderId']; ?>', '<?php echo $row['status']; ?>', this.value, '<?php if(isset($_REQUEST['page'])) { echo $_REQUEST['page']; } ?>','<?php echo $row['productId']; ?>','<?php echo $row['delivery_date']; ?>','<?php echo $row['relist_item']; ?>')" >
<option value="">Select status</option>
<option value="Processing" <?php if($row['status'] == "Processing") { echo "selected"; } ?>>Processing</option>
<option value="Shipped by seller" <?php if($row['status'] == "Shipped by seller") { echo "selected"; } ?>>Shipped by seller</option>
<option value="Under QA" <?php if($row['status'] == "Under QA") { echo "selected"; } ?>>Under QA</option>
<option value="Shipped to buyer" <?php if($row['status'] == "Shipped to buyer") { echo "selected"; } ?>>Shipped to buyer</option>
<option value="Complete" <?php if($row['status'] == "Complete") { echo "selected"; } ?>>Complete</option>
<option value="Rejected by StylFlip" <?php if($row['status'] == "Rejected by StylFlip") { echo "selected"; } ?>>Rejected by StylFlip</option>
<option value="Returned by buyer" <?php if($row['status'] == "Returned by buyer") { echo "selected"; } ?>>Returned by buyer</option>
<option value="Delievered"    data-toggle="modal" data-target="#delievered"  <?php if($row['status'] == "Delievered") { echo "selected"; } ?>>Delievered</option>
<option value="Cancelled"    data-toggle="modal" data-target="#cancelled"  <?php if($row['status'] == "Cancelled") { echo "selected"; } ?>>Cancelled</option>
</select>	
	<?php	
			}
	 	} 
	 	else {
	 		 echo $errorMessage; 
		} 
	}
 	?>
	<div id="loader_<?php echo $orderId; ?>"></div>
</td>
<td><?php if(!$isViewer) { ?><a href="editOrder.php?orderId=<?php echo $row['orderId']; ?><?php if(isset($_REQUEST['page'])) { echo "&page=" . $_REQUEST['page']; }  ?><?php if(isset($_REQUEST['search_text1'])) { echo "&search_text1=" . $_REQUEST['search_text1']; } ?><?php if(isset($_REQUEST['search_text'])) { echo "&search_text=" . $_REQUEST['search_text']; } ?>">Update</a><?php } ?><br/><br/>
<a href="generateinvoice.php?orderId=<?php echo $row['orderId']; ?>" target="_balnk">Generate Invoice</a>
<a href="downloadinvoice.php?orderId=<?php echo $row['orderId']; ?>">Download Invoice</a></td>
<td><?php echo $row['orderDate']; ?></td>
<?php if($row['delivery_date']=='0000-00-00'){ $dldt=''; }else { $dldt=EntryDate($row['delivery_date']);} ?>
<td><?php echo $dldt;?></td>
<td><?php if($isToBeDonated == 1) { echo 'Yes'; } else{ echo 'No'; } ?></td>
<td><a href="manageUsers.php?userId=<?php echo $row['sellerId']; ?>"><u><?php echo $seller; ?></u></a></td>

<td><a href="manageUsers.php?userId=<?php echo $row['buyerId']; ?>"><u><?php echo $buyer; ?></u></a></td>
	
	<td><?php echo 'SF00000'.$row['productId']; ?></td>
	<td><a href="viewProducts.php?productId=<?php echo $row['productId']; ?>"><u><?php echo $row['productTitle']; ?></u></a></td>
	
	<td><?php echo $row['paymentMode']; ?></td>
	
    <td><?php echo $transactionId; ?></td>
    <td><?php echo $row['payUTransactionId']; ?></td>
	<td><?php echo "Rs. " . $amount; ?></td>
	<td><?php echo $priceBreakUp; ?></td>
	<td><?php echo $row['couponCodeUsed']; ?></td>
	<td><?php echo $couponDiscount; ?></td>
	<td><?php echo $row['paymentMode'] == 'Cash on delivery' ? 'Rs. 85' : 'Rs. 0'; ?></td>
	<td><?php echo $address; ?></td>
	<td><?php echo $row['phoneNumber']; ?></td>
	
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
	<td><?php echo $row['reverseAWB']; ?></td>
<td><?php echo $row['reverseCourier']; ?></td>
<?php if($row['qcdate']=='0000-00-00'){ $qcdt=''; }else { $qcdt=EntryDate($row['qcdate']);} ?>

<?php if($row['payment_date']=='0000-00-00'){ $paydt=''; }else { $paydt=EntryDate($row['payment_date']);} ?>
<td><?php echo $row['AWB']; ?></td>
<td><?php echo $row['courier']; ?></td>
<td><?php echo $qcdt; ?></td>

<td><?php echo $row['payment_reference_nodal'];?></td>
<td><?php echo $row['payment_reference_current'];?></td>
<td><?php echo $paydt;?></td>
<td><?php echo $row['created_by'];?></td>



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
    <td  colspan="20"><div align="right"><strong>Page  - </strong> <?php echo $pager->renderNav2('<span>', '</span>',$_REQUEST['search_text'],$_REQUEST['search_text1']); ?>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td>
  </tr>
</table>
<div id="delievered" class="modal fade" role="dialog" >
  <div class="modal-dialog">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Delievery</h4>
      </div>
	  <form name="frm"  enctype="multipart/form-data" action="manageOrders.php?action=updateOrderStatus&search_text=<?=$_REQUEST['search_text']?>&search_text1=<?=$_REQUEST['search_text1']?>" method="post">
      <div class="modal-body">
        <p>Delievery Date.<?=EntryDate($row['delivery_date'])?> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		<input type="date" value="<?=EntryDate($row['delivery_date'])?>" name="delivery_date" id="delivery_date" /></p>
		<input type="hidden" name="order_id" id="order_id" /></p>
      </div>
	  
      <div class="modal-footer">
        <button type="submit" name="submit"  class="btn btn-primary" >Submit</button>
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
	  </form>
    </div>

  </div>
</div>
<div id="cancelled" class="modal fade" role="dialog" >
  <div class="modal-dialog">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Cancelled</h4>
      </div>
	  <form name="frm"  enctype="multipart/form-data" action="<?php echo $baseURL; ?>api/product.php?action=updateOrderStatus1<?php if(isset($_REQUEST['page'])) { echo "&page=" . $_REQUEST['page']; } ?><?php if(isset($_REQUEST['page'])) { echo "&page=" . $_REQUEST['page']; } ?><?php if(isset($_REQUEST['search_text1'])) { echo "&search_text1=" . $_REQUEST['search_text1']; } ?><?php if(isset($_REQUEST['search_text'])) { echo "&search_text=" . $_REQUEST['search_text']; } ?>" method="post">
      <div class="modal-body">
        <p>Re List This Product: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		<input type="radio" name="relist_item" value="Yes" id="relist_item" /> Yes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		<input type="radio" name="relist_item"  value="No" id="relist_item" />No</p>
		<input type="hidden" name="status" id="status" value="Cancelled" /></p>
		<input type="hidden" name="order_id1" id="order_id1" /></p>
		<input type="hidden" name="Product_id" id="Product_id" /></p>
      </div>
	  
      <div class="modal-footer">
        <button type="submit" name="submit"   class="btn btn-primary" >Submit</button>
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
	  </form>
    </div>

  </div>
</div>
<?php
mysql_close($con);  
?>