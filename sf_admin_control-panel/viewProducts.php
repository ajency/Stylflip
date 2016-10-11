<?php
include("adminHeader.php");
include("../classes/Pagination.php");
?>

<table class="table">

<?php 

	function getCalculatedPrice($sellingPrice) {
		if($sellingPrice == 0) {
			return '₹ 0';
		}
		$isShippingToBeAdded = $sellingPrice < 2000;
		$sellingPrice = $sellingPrice + (($sellingPrice * 20 /* StylFlip commision  */) / 100);
		if($isShippingToBeAdded) {
			$sellingPrice = $sellingPrice + 120;	//	120 is the shipping fees
		}
		return '₹ ' . ceil($sellingPrice);
	}; 
	
	function getShippingAndHandlingFees($sellingPrice) {
		if($sellingPrice == 0) {
			return '₹ 0';
		}
		if($sellingPrice < 2000) {
			return '₹ 120';
		}
		return '₹ 0';
	};

if(isset($_REQUEST['search_text']) && $_REQUEST['search_text']!='' && $_REQUEST['search_text1']==0) {

	$search_text = $_REQUEST['search_text'];
	// $sql .= "select p.*, u.firstName, u.lastName from tbl_products p LEFT JOIN tbl_users u on u.userId = p.userId where productTitle like '%".$search_text."%' order by p.productId desc";
	$sql .= "select p.*, b.brandId, b.name as brand, u.firstName, u.lastName, u.username from tbl_products p, tbl_users u, tbl_brands b where b.brandId = p.brandId and u.userId = p.userId and (p.productTitle like '%".$search_text."%' or u.username like '%".$search_text."%') order by p.productId desc";
	
}
elseif(isset($_REQUEST['search_text1']) && !isset($_REQUEST['search_text'])){

$search_text1 = $_REQUEST['search_text1'];

	if($search_text1=='1'){
	
		$sql .= "select p.*, b.brandId, b.name as brand, u.firstName, u.lastName, u.username from tbl_products p, tbl_users u, tbl_brands b where b.brandId = p.brandId and u.userId = p.userId and p.isPurchased = '1' order by p.productId desc";
	}
	else{
		if($search_text1=='2'){
			$sql .= "select p.*, b.brandId, b.name as brand, u.firstName, u.lastName, u.username from tbl_products p, tbl_users u, tbl_brands b where b.brandId = p.brandId and u.userId = p.userId and p.isApproved = '0' order by p.productId desc";
		}
		
		elseif($search_text1=='4'){
		
		$sql.= "select p.*, b.brandId, b.name as brand, u.firstName, u.lastName, u.username from tbl_products p, tbl_users u, tbl_brands b where b.brandId = p.brandId and u.userId = p.userId and p.isApproved = '0' and u.isActive='0' order by p.productId desc";
		}
		elseif($search_text1=='3'){
		
		$sql.= "select p.*, b.brandId, b.name as brand, u.firstName, u.lastName, u.username from tbl_products p, tbl_users u, tbl_brands b where b.brandId = p.brandId and u.userId = p.userId and p.isApproved = '0' and u.isActive='0' and (select count(k.userId) from tbl_user_kyc_details k,tbl_products u where u.userId = k.userId)=0 order by p.productId desc";
		}
		elseif($search_text1=='5'){
		$sql .= "select p.*, b.brandId, b.name as brand, u.firstName, u.lastName, u.username from tbl_products p, tbl_users u, tbl_brands b where b.brandId = p.brandId and u.userId = p.userId and p.isApproved != '0' order by p.productId desc";
		}
		
		}
}
elseif(isset($_REQUEST['search_text']) && isset($_REQUEST['search_text1'])){
	$search_text1 = $_REQUEST['search_text1'];
	$search_text = $_REQUEST['search_text'];

	if($search_text1=='1'){
	
		$sql .= "select p.*, b.brandId, b.name as brand, u.firstName, u.lastName, u.username from tbl_products p, tbl_users u, tbl_brands b where b.brandId = p.brandId and u.userId = p.userId and p.isPurchased = '1' and (p.productTitle like '%".$search_text."%' or u.username like '%".$search_text."%') order by p.productId desc";
	}
	else{
		if($search_text1=='2'){
			$sql .= "select p.*, b.brandId, b.name as brand, u.firstName, u.lastName, u.username from tbl_products p, tbl_users u, tbl_brands b where b.brandId = p.brandId and u.userId = p.userId and p.isApproved = '0' and (p.productTitle like '%".$search_text."%' or u.username like '%".$search_text."%') order by p.productId desc";
		}
		
		elseif($search_text1=='4'){
		
		$sql.= "select p.*, b.brandId, b.name as brand, u.firstName, u.lastName, u.username from tbl_products p, tbl_users u, tbl_brands b where b.brandId = p.brandId and u.userId = p.userId and p.isApproved = '0' and u.isActive='0'and (p.productTitle like '%".$search_text."%' or u.username like '%".$search_text."%') order by p.productId desc";
		}
		elseif($search_text1=='3'){
		
		$sql.= "select p.*, b.brandId, b.name as brand, u.firstName, u.lastName, u.username from tbl_products p, tbl_users u, tbl_brands b where b.brandId = p.brandId and u.userId = p.userId and p.isApproved = '0' and u.isActive='0' and (select count(k.userId) from tbl_user_kyc_details k,tbl_products u where u.userId = k.userId)=0  and (p.productTitle like '%".$search_text."%' or u.username like '%".$search_text."%')order by p.productId desc";
		}
		elseif($search_text1=='5'){
		$sql .= "select p.*, b.brandId, b.name as brand, u.firstName, u.lastName, u.username from tbl_products p, tbl_users u, tbl_brands b where b.brandId = p.brandId and u.userId = p.userId and p.isApproved != '0' and (p.productTitle like '%".$search_text."%' or u.username like '%".$search_text."%') order by p.productId desc";
		}
		
		}
}
else {
	// $sql .= "select p.*, u.firstName, u.lastName from tbl_products p LEFT JOIN tbl_users u on u.userId = p.userId order by p.productId desc";
	if(isset($_REQUEST['productId'])) {
		$sql .= "select p.*, b.brandId, b.name as brand, u.firstName, u.lastName, u.username from tbl_products p, tbl_users u, tbl_brands b where b.brandId = p.brandId and u.userId = p.userId and p.productId = '" . $_REQUEST['productId'] . "' order by p.productId desc";
	}
	else {
		$sql .= "select p.*, b.brandId, b.name as brand, u.firstName, u.lastName, u.username from tbl_products p, tbl_users u, tbl_brands b where b.brandId = p.brandId and u.userId = p.userId order by p.productId desc";
	}

}
?>


<?php
$pager = new Pagination($con, $sql, $rowsPerPage=15);
$pager->setDebug(true);
$result = $pager->paginate();
//if(!$result) die(mysql_error());

$total_rows = mysql_num_rows($result);

?>

<?php// print_r($_REQUEST); ?>
<tr>
	  <td colspan="16" align="right"><form method="post" action="viewProducts.php"><input type="text" placeholder="Search product or username" name="search_text" value="<?php if(isset($_REQUEST['search_text']))echo $_REQUEST['search_text']; ?>"> 
	  
	  <select name="search_text1">
	  <option value="0">Select Status</option>
	  <option value="1" <?=($_REQUEST['search_text1'] == '1')?'selected':''; ?>>Sold</option>
	  <option value="2" <?=($_REQUEST['search_text1'] == '2')?'selected':''; ?>>Approval needed</option>
	  <option value="3" <?=($_REQUEST['search_text1'] == '3')?'selected':''; ?>>Approval needed <br/> (User is banned)</option>
	  <option value="4" <?=($_REQUEST['search_text1'] == '4')?'selected':''; ?>>Pending KYC</option>
	  <option value="5" <?=($_REQUEST['search_text1'] == '5')?'selected':''; ?>>On sale</option>
	  </select>
	  
	  
	  <input type="submit" value="Search"> | <a href="viewProducts.php">View All</a><?php if($isSuperAdmin || $isExecutive || $isManager) { ?> | <a href="downloadReport.php?exportType=productsData">Export</a><?php } ?></form></td>
</tr>	

<?php
	if ($total_rows > 0) {
?>
<tr>
    <td colspan="16"><div align="right"><strong>Page  - </strong> <?php echo $pager->renderNav3('<span>', '</span>',$_REQUEST['search_text'],$_REQUEST['search_text1']); ?>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td>  
</tr>	
  <tr>
    <td colspan="16"></td>  
  </tr>
<?php		
	}
?>	
</table>	


<div style="overflow: scroll;">
<table class="table" style="width: 130%;">
	
<tr>
      <th>Sr no</th>
      <th>SKU</th>
      <th>Title</th>
      <th>Photos</th>
      <th>Description</th>
      <th>Brand</th>
      <th>Size</th>
      <th>Condition</th>
      <th>Pickup address</th>
      <th>Contact number</th>
      <th width="12%">Price break-up</th>
      <th>To be donated</th>
      <th>Added by</th>
      <th>Approved on</th>
      <th>Status</th>
      <th>Manage</th>
</tr>


<?php

if ($total_rows == 0) {
?>
<tr>
    <td colspan="16"><div align="center">No products found.</div></td>  
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
		$productId = $row['productId'];
		$title = $row['productTitle'];
		$description = $row['productDescription'];
		$photo = $row['primaryPhoto'];
		
		$sql = "select p.photo from tbl_product_images p where p.productId = $productId";
		$photosResult = mysql_query($sql);
		
		$username = $row['firstName'].' '.$row['lastName'];
		
		if($username == ' ') {
			$username = $row['username'];
		}
		
		if($username == '') {
			$username = 'View details';
		}
		
		$pickupFrom = $row['pickupFrom'];
		
		$priceBreakUp = '<b>Asking Price</b>: ₹ ' . $row['sellingPrice'] . '<br/>';
		$priceBreakUp .= '<b>SF Comm.</b>: ₹ ' . (ceil($row['sellingPrice'] * 20) / 100) . '<br/>';
		$priceBreakUp .= '<b>S & H</b>: '.getShippingAndHandlingFees($row['sellingPrice']) . '<br/>';
		$priceBreakUp .= '<b>Display Price</b>: '.getCalculatedPrice($row['sellingPrice']);
		
		if($row['isPurchased'] == 1) {
			$status = 'Sold';
		}
		else {
			if($row['isApproved'] == 0) {
				$status = 'Approval needed';
			
				$sql = "select isActive, userId from tbl_users where userId = '" . $row['userId'] . "'";
				$result1 = mysql_query($sql);
				while($row1 = mysql_fetch_assoc($result1)) {
					if($row1['isActive'] == 0) {
						$status = $status . '<br/>(User is banned)';
					}
				}
				
				// if($status != 'User is banned') {
					$sql = "select userId from tbl_user_kyc_details WHERE userId = '" . $row['userId'] . "'";
					if(mysql_num_rows(mysql_query($sql)) == 0) {
						$status = 'Pending KYC';
					}
				//}
			}
			else {
				$status = 'On sale';
			}
		}
?> 

<tr>
	<td><?php echo $sr; ?></td>
	<td><?php echo 'SF00000'.$productId; ?></td>	
	<td><?php echo $title; ?></td>
	<td> 
		<?php if( false == empty($photo) ) { ?><a class="single_image" style="display: block;" href="<?php echo $baseURL . $photo ?>"> <img width="200px" src="<?php echo $baseURL . $photo ?>"> </a><?php } ?>
		<?php 
			while($row1 = mysql_fetch_assoc($photosResult)) {
				$str = substr($row1['photo'],29);
				 ?>
				<?php if($baseURL.$str == $row1['photo']) { ?>
				<a class="single_image" style="float:left;" href="<?php echo $row1['photo']; ?>"><img width="50px" src="<?php echo $row1['photo']; ?>"></a>
			<?php } else{ ?>
			<a class="single_image" style="float:left;" href="<?php echo $baseURL. $row1['photo']; ?>"><img width="50px" src="<?php echo $baseURL. $row1['photo']; ?>"></a>
			<?php } }?>
	</td>		
	<td><?php echo $description; ?></td>
	<td><?php echo $row['brand']; ?></td>
	<td><?php echo $row['size']; ?></td>
	<td><?php echo $row['condition']; ?></td>
	<td>
		<?php
			$query = "select * from tbl_user_addresses where userId='". $row['userId'] ."' and addressTitle='".$pickupFrom."'";
			$addressesResult = mysql_query($query);
			if(mysql_num_rows($addressesResult) > 0) {
				$addressesRow = mysql_fetch_assoc($addressesResult);
				echo '<b>' . $addressesRow['addressTitle'] . '</b>: ' . $addressesRow['addressLine1'] . ', ' . $addressesRow['addressLine2'] . ', ' . $addressesRow['landmark'] . ', ' . $addressesRow['state'] . ', ' . $addressesRow['city'] . ', ' . $addressesRow['postCode'];
			}
		?>
	</td>
	<td><?php echo $addressesRow['phoneNumber']; ?></td>
	<td><?php echo $priceBreakUp; ?></td>
	<td><?php echo $row['isToBeDonated'] == 1 ? 'Yes' : 'No' ; ?></td>
	<td><a href="manageUsers.php?userId=<?php echo $row['userId']; ?>"><?php echo $username; ?></a></td>
	<td><?php echo $row['approvalDate']; ?></td>
	<td><?php echo $status; ?></td>
	<td>
	<?php if(!$isViewer) { ?>
		<ul style="list-style: none; padding-left: 0px;">
			<?php if( '1' == $row['isApproved'] ) { ?><li><span style="color: green;">Approved</span></li> <?php } elseif( '2' == $row['isApproved'] ) { ?><li><span style="color: red;"> Rejected</span></li> <?php } ?>
			<?php if( '1' <> $row['isApproved'] || true == is_null($row['isApproved']) ) { ?>
			<li><a style="cursor: pointer;" onclick="approveProduct('<?php echo $baseURL; ?>api/product.php?action=approveProduct&productId=<?php echo $productId ?><?php if(isset($_REQUEST['page'])) { echo "&page=" . $_REQUEST['page']; }  ?>')">Approve</a></li><?php } ?>
			<?php if( '1' == $row['isApproved'] ) { ?>
			<?php if(!$isExecutive){ ?><li><a style="cursor: pointer;" onclick="rejectProduct('<?php echo $baseURL; ?>api/product.php?action=rejectProduct&productId=<?php echo $productId ?><?php if(isset($_REQUEST['page'])) { echo "&page=" . $_REQUEST['page']; }  ?>')">Reject</a></li><?php } } ?>
			<?php if(!$isExecutive){ ?><li><a href="editProductDetails.php?productId=<?php echo $productId; ?><?php if(isset($_REQUEST['page'])) { echo "&page=" . $_REQUEST['page']; }  ?>">Edit</a></li> <?php } ?>
			<?php if(!($isManager || $isExecutive)) { ?><li><a style="cursor: pointer;" onclick="deleteProduct('<?php echo $baseURL; ?>api/product.php?action=deleteProduct&isAdmin=true&productId=<?php echo $productId ?><?php if(isset($_REQUEST['page'])) { echo "&page=" . $_REQUEST['page']; }  ?>')">Delete</a></li><?php } ?>
		</ul>
	<?php } ?>
	</td>
<?php	
		$sr=$sr+1;
	}
?>
</tr>
 
 </table>
</div>

<table class="table"> 
  <tr>
    <td colspan="16"></td>  
  </tr>
  <tr>
    <td colspan="16"><div align="right"><strong>Page  - </strong> <?php echo $pager->renderNav3('<span>', '</span>',$_REQUEST['search_text'],$_REQUEST['search_text1']); ?>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td>  
  </tr>
</table>  
<?php
}	
?>


</table>

<?php
mysql_close($con);  
?>

<script>
	$(document).ready(function() {
		/* This is basic - uses default settings */
		$("a.single_image").fancybox();
	});
	
	function approveProduct( url ){
		var result = confirm("Do you really want to approve product?");
		if (result) {
		    window.location = url;
		}
	}
	
	function rejectProduct( url ){
		var result = confirm("Do you really want to reject product?");
		if (result) {
		    window.location = url;
		}
	}
	
	function deleteProduct( url ){
		var result = confirm("Do you really want to delete product details?");
		if (result) {
		    window.location = url;
		}
	}
</script>