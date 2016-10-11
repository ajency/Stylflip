<?php
include("adminHeader.php");
?>


<?php  

if(isset($_REQUEST['userId'])) {
	$userId = $_REQUEST['userId']; 
	$sql = "select * from tbl_admin where Id =" . $userId;
	
	$result = mysql_query($sql);
}

?>

<form name="companyForm" method="post" enctype="multipart/form-data" action="<?php echo $baseURL; ?>api/user.php?action=updateAdmin&Id=<?php echo $userId; ?>">
  <table class="table">
    
    <tr>
      <td align="right"><div align="right"><strong>Edit Admin</strong></div></td>
      <td>&nbsp;</td>
    </tr>

    <tr>
      <td align="right">&nbsp;</td>
      <td>&nbsp;
      	<input type="hidden" name="userId" value="<?php echo $_REQUEST['userId']; ?>">
      </td>
    </tr>
<?php while($row = mysql_fetch_assoc($result)) { ?>
    <tr>
      <td align="right"><div align="right">username :</div></td>
      <td><input type="text" name="username" value="<?php echo $row['username']; ?>"></td>
    </tr>
	 <tr>
      <td align="right"><div align="right">Role :</div></td>
      <td>
			<select name="role">
				<option <?php if( $row['role'] == 'Super Admin' ) { ?> selected <?php }?> >Super Admin</option>
				<option <?php if( $row['role'] == 'Logistics' ) { ?> selected <?php }?> >Logistics</option>
				<option <?php if( $row['role'] == 'User and Product Management' ) { ?> selected <?php }?> >User and Product Management</option>
				<option <?php if( $row['role'] == 'Manager' ) { ?> selected <?php }?> >Manager</option>
				<option <?php if( $row['role'] == 'Executive' ) { ?> selected <?php }?> >Executive</option>
				<option <?php if( $row['role'] == 'Viewer' ) { ?> selected <?php }?> >Viewer</option>
			</select>
	</td>
    </tr>
    <tr>
      <td align="right"><div align="right">New Password :</div></td>
      <td><input id="password" type="password" name="password" value="<?php echo $row['password']; ?>"></td>
    </tr>
    <tr>
      <td align="right"><div align="right">Confirm Password:</div></td>
      <td><input id="confirm_password" type="password" name="confirm_password" value="<?php echo $row['password']; ?>"></td>
    </tr>
    <tr>
      <td align="right">&nbsp;</td>
      <td>&nbsp;<span id="err_msg" style="color:red; display: none;">Password and Confirm Password did not match. Please check</span></td>
    </tr>
<?php } ?>
    <tr> 
      <td align="right"><div align="right"></div></td>
      <td><input type="submit" value="Update" name="addCompany" id="addCompany" onclick="return validatePassword();" /></td>
    </tr>

  </table>

</form>
<script>

	function validatePassword() {
		if( $('#password').val() != $('#confirm_password').val() ) {
			$('#err_msg').show();
			return false;
		}
	}
</script>
<?php
mysql_close($con);  
?>