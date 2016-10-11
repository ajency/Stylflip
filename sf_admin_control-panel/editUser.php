<?php
include("adminHeader.php");
?>


<?php  

if(isset($_REQUEST['userId'])) {
	$userId = $_REQUEST['userId']; 
	$sql = "select * from tbl_users where userId =" . $userId;
	
	$result = mysql_query($sql);
}

?>

<form name="companyForm" method="post" enctype="multipart/form-data" action="<?php echo $baseURL; ?>api/user.php?action=updateProfile&redirect=true&userId=<?php echo $userId; ?>">
  <table class="table">
    
    <tr>
      <td align="right"><div align="right"><strong>Edit User</strong></div></td>
      <td>&nbsp;</td>
    </tr>

    <tr>
      <td align="right">&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
<?php while($row = mysql_fetch_assoc($result)) { ?>
    <tr>
      <td align="right"><div align="right">First Name :</div></td>
      <td><input type="text" name="firstName" value="<?php echo $row['firstName']; ?>"></td>
    </tr>
	 <tr>
      <td align="right"><div align="right">Last Name :</div></td>
      <td><input type="text" name="lastName" value="<?php echo $row['lastName']; ?>"></td>
    </tr>
    <tr>
      <td align="right"><div align="right">Date of Birth :</div></td>
      <td><input type="text" name="dateOfBirth" value="<?php echo $row['dob']; ?>"></td>
    </tr>
    <tr>
      <td align="right"><div align="right">Address :</div></td>
      <td><input type="text" name="address" value="<?php echo $row['address']; ?>"></td>
    </tr>
    <tr>
      <td align="right"><div align="right">Mobile number :</div></td>
      <td><input type="text" name="mobileNumber" value="<?php echo $row['mobileNumber']; ?>"></td>
    </tr>
     <tr>
      <td align="right"><div align="right">Email :</div></td>
      <td><input type="text" name="email" value="<?php echo $row['email']; ?>"></td>
    </tr>
     <tr>
      <td align="right"><div align="right">Flat no/Building Name :</div></td>
      <td><input type="text" name="flatNoBuildingName" value="<?php echo $row['flatNoBuildingName']; ?>"></td>
    </tr>
    <tr>
      <td align="right"><div align="right">StreetName :</div></td>
      <td><input type="text" name="streetName" value="<?php echo $row['streetName']; ?>"></td>
    </tr>
    <tr>
      <td align="right"><div align="right">Landmark :</div></td>
      <td><input type="text" name="landmark" value="<?php echo $row['landmark']; ?>"></td>
    </tr>
     <tr>
      <td align="right"><div align="right">State :</div></td>
      <td><input type="text" name="state" value="<?php echo $row['state']; ?>"></td>
    </tr>
     <tr>
      <td align="right"><div align="right">Post code :</div></td>
      <td><input type="text" name="postcode" value="<?php echo $row['postcode']; ?>"></td>
    </tr>
    <tr>
      <td align="right">&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
<?php } ?>
    <tr> 
      <td align="right"><div align="right"></div></td>
      <td><input type="submit" value="Update" name="addCompany" id="addCompany" onclick="return validateAddCompany();" /></td>
    </tr>

  </table>

</form>

<?php
mysql_close($con);  
?>