<?php
include("adminHeader.php");
?>

<form name="pushMessage" method="post" enctype="multipart/form-data" action="<?php echo $baseURL; ?>api/social.php?action=pushMessage">
  <input type="hidden" name="screenType" id="screenType">
  <table class="table">
    
    <tr>
      <td align="right"><div align="right"><strong>Send Push Notfication</strong></div></td>
      <td>&nbsp;</td>
    </tr>

    <tr>
      <td align="right"><div align="right">Message:</div></td>
      <td><textarea id="message" name="message" cols="40" rows="5"></textarea></td>
    </tr>
    
    <tr>
    	<td align="right"><div align="right">Screen:</div></td>
      	<td><label><input type="radio" name="type" onclick="toggleSelect('Shop')">Shop</label> &nbsp;&nbsp;&nbsp; <label><input type="radio" name="type" onclick="toggleSelect('StylFile')">StylFile</label></td>
    </tr>
    
    <tr>
    	<td>&nbsp;</td>
    	<td>
			<select id="productId" name="productId" style="display: none;">
				<option value="">Select product id</option>
				<?php
					$query = "select productId from tbl_products";
					$result = mysql_query($query);
					while($row = mysql_fetch_assoc($result)) {
				?>
						<option value="<?php echo $row['productId'];  ?>">SF00000<?php echo $row['productId'];  ?></option>
				<?php		
					}
				?>
			</select>
			<select id="userId" name="userId" style="display: none;">
				<option value="">Select user id</option>
				<?php
					$query = "select userId, username from tbl_users where username != ''";
					$result = mysql_query($query);
					while($row = mysql_fetch_assoc($result)) {
				?>
						<option value="<?php echo $row['userId'];  ?>"><?php echo $row['username'];  ?></option>
				<?php		
					}
				?>
			</select>
    	</td>
    </tr>
    
    <tr>
      <td align="right">&nbsp;</td>
      <td>&nbsp;</td>
    </tr>

    <tr> 
      <td align="right"><div align="right"></div></td>
      <td><input type="submit" value="Send" name="pushNotificationButton" onclick="return onSendButton()" /></td>
    </tr>

  </table>

</form>

<script>
	var selectedType = '';
	function toggleSelect(type) {
		selectedType = type;
		$('#screenType').val(selectedType);
		
		$('#productId').css('display', 'none');
		$('#userId').css('display', 'none');
		if(type == 'Shop') {
			$('#productId').css('display', 'block');
		}
		else {
			$('#userId').css('display', 'block');
		}
	}
	
	function onSendButton() {
		if($('#message').val() == '') {
			alert('Please enter message');
			return false;
		}
		// if(selectedType == '') {
			// alert('Please select screen type');
			// return false;
		// }
		// if(selectedType == 'Shop' && $('#productId').val() == '') {
			// alert('Please select product id');
			// return false;
		// }
		// if(selectedType == 'StylFile' && $('#userId').val() == '') {
			// alert('Please select user id');
			// return false;
		// }
		return true;
	}
</script>	
