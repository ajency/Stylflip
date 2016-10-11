<?php
include("adminHeader.php");
?>

<form name="couponCodeForm" method="post" enctype="multipart/form-data" action="<?php echo $baseURL; ?>api/product.php?action=addCouponCode">
  <table class="table">
    
    <tr>
      <td align="right"><div align="right"><strong>Add Coupon Code</strong></div></td>
      <td>&nbsp;</td>
    </tr>

    <tr>
      <td align="right">&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td align="right"><div align="right">Coupon Code :</div></td>
      <td><input type="text" name="couponCode" maxlength="10"></td>
    </tr>
 	<tr>
      <td align="right"><div align="right">Coupon Discount :</div></td>
      <td>
      	<input type="text" name="discount"> 
      	<select name="discountType">
      		<option value="none">Select discount type</option>
      		<option value="percent">Percent (%)</option>
      		<option value="flat">Flat (Rs)</option>
      	</select>
      	</td>
    </tr>
    <tr>
      <td align="right">&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr> 
      <td align="right"><div align="right"></div></td>
      <td><input type="submit" value="Add" name="addCouponCodeButton" id="addCouponCodeButton" onclick="return validateAddCouponCode();" /></td>
    </tr>

  </table>

</form>
