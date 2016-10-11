<?php
include("adminHeader.php");
?>

<form name="companyForm" method="post" enctype="multipart/form-data" action="<?php echo $baseURL; ?>api/user.php?action=createNewAdmin">
  <table class="table">
    
    <tr>
      <td align="right"><div align="right"><strong>Create Admin</strong></div></td>
      <td>&nbsp;</td>
    </tr>

    <tr>
      <td align="right">&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td align="right"><div align="right">Username :</div></td>
      <td><input type="text" name="username" value=""></td>
    </tr>
	 <tr>
      <td align="right"><div align="right">Password :</div></td>
      <td><input id="password" type="password" name="password" value=""></td>
    </tr>
    <tr>
      <td align="right"><div align="right">Confirm Password :</div></td>
      <td><input id="confirm_password" type="password" name="confirm_password" value=""></td>
    </tr>
    <tr>
      <td align="right"><div align="right">Role :</div></td>
      <td>
			<select name="role">
				<option>Super Admin</option>
				<option>Logistics</option>
				<option>User and Product Management</option>
			</select>
	  </td>
    </tr>
    <tr>
      <td align="right">&nbsp;</td>
      <td><span id="err_msg" style="color:red; display: none;">Password and Confirm Password did not match. Please check</span></td>
    </tr>
    <tr> 
      <td align="right"><div align="right"></div></td>
      <td><input type="submit" value="Save" name="addCompany" id="addCompany" onclick="return validatePassword();" /></td>
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