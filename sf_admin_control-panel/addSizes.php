<?php
include("adminHeader.php");
?>

<form name="companyForm" method="post" enctype="multipart/form-data" action="<?php echo $baseURL; ?>api/size.php?action=update">
  <table class="table">
    
    <tr>
      <td align="right"><div align="right"><strong>Add Sizes</strong></div></td>
      <td>&nbsp;</td>
    </tr>

    <tr>
      <td align="right">&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
	<tr>
      <td align="right"><div align="right">Type :</div></td>
      <td>
      	<select id="type">
      		<option value="shoe">Shoe</option>
      		<option value="dress">Dress</option>
      	</select>
      </td>
    </tr>
    <tr>
      <td align="right"><div align="right">Country :</div></td>
      <td>
      	<select id="country">
      		<option value="us">US</option>
      		<option value="uk">UK</option>
      		<option value="in">IN</option>
      		<option value="au">AU</option>
      		<option value="sk">SK</option>
      	</select>
      </td>
    </tr>
    <?php  

		$sql = "select * from tbl_sizes";				
		$result = mysql_query($sql);

	?>
    <?php while($row = mysql_fetch_assoc($result)) { ?>
   		<tr class="size <?php echo strtolower($row['country']) . ' ' . $row['type']; ?> <?php if( 'shoeus' != $row['type'] . strtolower($row['country'])) { echo 'hide'; } ?>">
    		<td align="right"></td>
      		<td><input type="text" name="<?php echo $row['country'] . '_' . $row['type']; ?>[size1]" value="<?php echo $row['size1']; ?>"></td>
    	</tr>
    	<tr class="size <?php echo strtolower($row['country']) . ' ' . $row['type']; ?> <?php if( 'shoeus' != $row['type'] . strtolower($row['country'])) { echo 'hide'; } ?>">
    		<td align="right"></td>
      		<td><input type="text" name="<?php echo $row['country'] . '_' . $row['type']; ?>[size2]" value="<?php echo $row['size2']; ?>"></td>
    	</tr>
    	<tr class="size <?php echo strtolower($row['country']) . ' ' . $row['type']; ?> <?php if( 'shoeus' != $row['type'] . strtolower($row['country'])) { echo 'hide'; } ?>">
    		<td align="right"></td>
      		<td><input type="text" name="<?php echo $row['country'] . '_' . $row['type']; ?>[size3]" value="<?php echo $row['size3']; ?>"></td>
    	</tr>
    	<tr class="size <?php echo strtolower($row['country']) . ' ' . $row['type']; ?> <?php if( 'shoeus' != $row['type'] . strtolower($row['country'])) { echo 'hide'; } ?>">
    		<td align="right"></td>
      		<td><input type="text" name="<?php echo $row['country'] . '_' . $row['type']; ?>[size4]" value="<?php echo $row['size4']; ?>"></td>
    	</tr>
    	<tr class="size <?php echo strtolower($row['country']) . ' ' . $row['type']; ?> <?php if( 'shoeus' != $row['type'] . strtolower($row['country'])) { echo 'hide'; } ?>">
    		<td align="right"></td>
      		<td><input type="text" name="<?php echo $row['country'] . '_' . $row['type']; ?>[size5]"  value="<?php echo $row['size5']; ?>"></td>
    	</tr>
    	<tr class="size <?php echo strtolower($row['country']) . ' ' . $row['type']; ?> <?php if( 'shoeus' != $row['type'] . strtolower($row['country'])) { echo 'hide'; } ?>">
    		<td align="right"></td>
      		<td><input type="text" name="<?php echo $row['country'] . '_' . $row['type']; ?>[size6]" value="<?php echo $row['size6']; ?>"></td>
    	</tr>
    	<tr class="size <?php echo strtolower($row['country']) . ' ' . $row['type']; ?> <?php if( 'shoeus' != $row['type'] . strtolower($row['country'])) { echo 'hide'; } ?>">
    		<td align="right"></td>
      		<td><input type="text" name="<?php echo $row['country'] . '_' . $row['type']; ?>[size7]" value="<?php echo $row['size7']; ?>"></td>
    	</tr>
    	
	<?php } ?>
	
	
    <tr>
      <td align="right">&nbsp;</td>
      <td>&nbsp;</td>
    </tr>

    <tr> 
      <td align="right"><div align="right"></div></td>
      <td><input type="submit" value="Update" name="addCompany" id="addCompany" /></td>
    </tr>

  </table>

</form>
<script type="text/javascript">
	$(document).ready(function(){
		$('#country').change(function(){
			$('.table .size').addClass('hide');
			console.log($( '.table .' + $(this).val() + '.' + $('#type').val() ));
			$( '.table .' + $(this).val() + '.' + $('#type').val() ).removeClass('hide');
		});

		$('#type').change(function(){
			$('.table .size').addClass('hide');
			$( '.table .' + $(this).val() + '.' + $('#country').val() ).removeClass('hide');
		});
	});
</script>