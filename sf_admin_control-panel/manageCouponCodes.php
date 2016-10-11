<?php
include("adminHeader.php");
include("../classes/Pagination.php");
?>

<script>
function updateOrderStatus(orderId, status) {
    window.location = "<?php echo $baseURL; ?>" + "api/product.php?action=updateOrderStatus&orderId=" + orderId + "&status=" + status;
}
</script>

<table class="table">

<?php  
	$sql .= "select * from tbl_coupon_codes order by couponCodeId desc";
?>


<?php
$pager = new Pagination($con, $sql, $rowsPerPage=15);
$pager->setDebug(true);
$result = $pager->paginate();
//if(!$result) die(mysql_error());

$total_rows = mysql_num_rows($result);

?>

<tr>
    <td colspan="5"></td>  
</tr>
<tr>
    <td colspan="5"><a href="addCouponCode.php">Add Coupon Code</a></div></td>  
</tr>

<?php
	if ($total_rows > 0) {
?>
<tr>
    <td colspan="5"><div align="right"><strong>Page  - </strong> <?php echo $pager->renderNav('<span>', '</span>'); ?>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td>
</tr>	
  <tr>
    <td colspan="5"></td>
  </tr>
<?php		
	}
?>	
<tr>
	<th>Sr no</th>
	<th>Coupon Code</th>
	<th>Discount</th>
	<th>Discount Type</th>
  	<th>Manage</th>
</tr>

<?php

if ($total_rows == 0) {
?>
<tr>
    <td colspan="5"><div align="center">No coupon codes found.</div></td>
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
        $couponCodeId = $row['couponCodeId'];
		$couponCode = $row['couponCode'];
		$discount = $row['discount'];
		$discountType = $row['type'];
?>

<tr>
	<td><?php echo $sr; ?></td>
	<td><?php echo $couponCode; ?></td>
	<td><?php echo $discount; ?></td>
	<td><?php echo $discountType; ?></td>
	<td><a href="<?php echo $baseURL ?>api/product.php?action=deleteCouponCode&couponCodeId=<?php echo $couponCodeId; ?><?php if(isset($_REQUEST['page'])) { echo "&page=" . $_REQUEST['page']; } ?>">Delete</a></td>
<?php
		$sr=$sr+1;
	}
?>
</tr>

  <tr>
    <td colspan="5"></td>
  </tr>
  <tr>
    <td colspan="5"><div align="right"><strong>Page  - </strong> <?php echo $pager->renderNav('<span>', '</span>'); ?>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td>
  </tr>
<?php
}	
?>


</table>

<?php
mysql_close($con);  
?>