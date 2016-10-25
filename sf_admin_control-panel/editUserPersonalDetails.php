<?php
require_once "../classes/ConnectDB.php";
if (!isset($_SESSION['admin'])) {
	header("location:index.php");
}
 

if(isset($_REQUEST['userId'])) {
	$userId = $_REQUEST['userId']; 
	$sql = "select * from tbl_users where userId =" . $userId;
	
	$result = mysql_query($sql);
}

?>

<?php while($row = mysql_fetch_assoc($result)) { ?>
<form id="personal_info_form" method="post" action="<?php echo $baseURL; ?>api/stylfile.php?action=updateProfile&userId=<?php echo $_REQUEST['userId']; ?>&redirect=true">
<table class="table">
    <tr>
      <td colspan="2"> <strong>Edit Personal Information</strong></td>
    </tr>
	<tr>
      <td align="right"><div align="right">First Name :</div></td>
      <td><input type="text" name="firstName" value="<?php echo $row['firstName']; ?>"></td>
    </tr>
	 <tr>
      <td align="right"><div align="right">Last Name :</div></td>
      <td><input type="text" name="lastName" value="<?php echo $row['lastName']; ?>"></td>
    </tr>
     <tr>
      <td align="right"><div align="right">State :</div></td>
      <td><input type="text" name="state" value="<?php echo $row['state']; ?>"></td>
    </tr>
     <tr>
      <td align="right"><div align="right">City :</div></td>
      <td><input type="text" name="city" value="<?php echo $row['city']; ?>"></td>
    </tr>
    <tr>
      <td align="right"><div align="right">Phone Number :</div></td>
      <td><input type="text" name="mobileNumber" value="<?php echo $row['mobileNumber']; ?>"></td>
    </tr>
    <tr> 
      <td align="right"><div align="right"></div></td>
      <td><input type="submit" value="Update" name="addCompany" id="addCompany" /></td>
    </tr>
</table>
</form>
<?php } ?>

<?php
mysql_close($con);  
?>