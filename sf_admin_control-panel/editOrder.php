<?php
include("adminHeader.php");
?>


<?php  

if(isset($_REQUEST['orderId'])) {
	$orderId = $_REQUEST['orderId'];
	$sql = "select * from tbl_orders where orderId =" . $_REQUEST['orderId'];
	$result = mysql_query($sql);
}

?>

<form name="orderForm" method="post" enctype="multipart/form-data" action="<?php echo $baseURL; ?>api/product.php?action=updateOrder&redirect=true&orderId=<?php echo $orderId; ?><?php if(isset($_REQUEST['page'])) { echo "&page=" . $_REQUEST['page']; } ?><?php if(isset($_REQUEST['page'])) { echo "&page=" . $_REQUEST['page']; } ?><?php if(isset($_REQUEST['search_text1'])) { echo "&search_text1=" . $_REQUEST['search_text1']; } ?><?php if(isset($_REQUEST['search_text'])) { echo "&search_text=" . $_REQUEST['search_text']; } ?>">
  <table class="table">
   
    <tr>
      <td align="right"><div align="right"><strong>Edit Order</strong></div></td>
      <td>&nbsp;</td>
    </tr>

    <tr>
      <td align="right">&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
<?php while($row = mysql_fetch_assoc($result)) { ?>
    <tr>
      <td align="right"><div align="right">AWB :</div></td>
      <td><input type="text" name="AWB" value="<?php echo $row['AWB']; ?>"></td>
    </tr>
 	<tr>
      <td align="right"><div align="right">Courier :</div></td>
      <td><input type="text" name="courier" value="<?php echo $row['courier']; ?>"></td>
    </tr>
    <tr>
      <td align="right"><div align="right">Reverse AWB :</div></td>
      <td><input type="text" name="reverseAWB" value="<?php echo $row['reverseAWB']; ?>"></td>
    </tr>
 	<tr>
      <td align="right"><div align="right">Reverse Courier :</div></td>
      <td><input type="text" name="reverseCourier" value="<?php echo $row['reverseCourier']; ?>"></td>
    </tr>
	<tr>
      <td align="right"><div align="right">QC Date :</div></td>
      <td><input type="date" name="qcdate" id="qcdate" alt="date"  value="<?php echo $row['qcdate']; ?>" class="IP_calendar" title="d/m/Y"></td>
    </tr>
	<tr>
      <td align="right"><div align="right">Delivery Date :</div></td>
      <td><input type="date" name="delivery_date" id="delivery_date" alt="date" value="<?php echo $row['delivery_date']; ?>" class="IP_calendar" title="d/m/Y"></td>
    </tr>
	<tr>
      <td align="right"><div align="right">Payment Reference Nodal :</div></td>
      <td><input type="text" name="payment_reference_nodal" value="<?php echo $row['payment_reference_nodal']; ?>"></td>
    </tr>
	<tr>
      <td align="right"><div align="right">Payment Reference Current :</div></td>
      <td><input type="text" name="payment_reference_current" value="<?php echo $row['payment_reference_current']; ?>"></td>
    </tr>
	<tr>
      <td align="right"><div align="right">Payment Date :</div></td>
      <td><input type="date" name="payment_date" id="payment_date" alt="date" value="<?php echo $row['payment_date']; ?>" class="IP_calendar" title="d/m/Y"></td>
    </tr>
    <tr>
      <td align="right">&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
<?php } ?>
    <tr> 
      <td align="right"><div align="right"></div></td>
      <td><input type="submit" value="Update" name="updateOrderButton" id="updateOrderButton" onclick="return validateUpdateOrder();" /></td>
    </tr>

  </table>

</form>

<?php
mysql_close($con);  
?>