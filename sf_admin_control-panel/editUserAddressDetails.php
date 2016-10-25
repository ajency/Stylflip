<?php
require_once "../classes/ConnectDB.php";
if (!isset($_SESSION['admin'])) {
	header("location:index.php");
}
 

if(isset($_REQUEST['userId'])) {
	$userId = $_REQUEST['userId']; 
	$query = "select * from tbl_user_addresses where userId='". $userId ."' AND addressType='" . $_REQUEST['addressType'] . "'" ;
	
	$result = mysql_query($query);
	
	$addressTitle = '';
	$addressLine1 = '';
	$addressLine2 = '';
	$landmark = '';
	$country = '';
	$state = '';
	$city = '';
	$postCode = '';
	$phoneNumber = '';
	
	while($row = mysql_fetch_assoc($result)) {
		
		$addressTitle = $row['addressTitle'];
		$addressLine1 = $row['addressLine1'];
		$addressLine2 = $row['addressLine2'];
		$landmark = $row['landmark'];
		$country = $row['country'];
		$state = $row['state'];
		$city = $row['city'];
		$postCode = $row['postCode'];
		$phoneNumber = $row['phoneNumber'];
	}
}

?>
<form id="address_form" method="post" action="<?php echo $baseURL; ?>api/stylfile.php?action=saveUserAddresses&userId=<?php echo $_REQUEST['userId']; ?>&redirect=true&addressType=<?php echo $_REQUEST['addressType']; ?>">
<table class="table">
    <tr>
      <td colspan="2"> <strong>Edit <?php echo $_REQUEST['addressType']; ?></strong></td>
    </tr>
	<tr>
      <td align="right"><div align="right">Address Title :</div></td>
      <td><input type="text" name="addressTitle" value="<?php echo $addressTitle ?>"></td>
    </tr>
	 <tr>
      <td align="right"><div align="right">Address Line 1 :</div></td>
      <td><input type="text" name="addressLine1" value="<?php echo $addressLine1; ?>"></td>
    </tr>
     <tr>
      <td align="right"><div align="right">Address Line 2 :</div></td>
      <td><input type="text" name="addressLine2" value="<?php echo $addressLine2; ?>"></td>
    </tr>
     <tr>
      <td align="right"><div align="right">Landmark :</div></td>
      <td><input type="text" name="landmark" value="<?php echo $landmark; ?>"></td>
    </tr>
    <!-- <tr>
      <td align="right"><div align="right">Country :</div></td>
      <td><input type="text" name="country" value="<?php echo $country; ?>"></td>
    </tr>-->
    <tr>
      <td align="right"><div align="right">State :</div></td>
      <td><input type="text" name="state" value="<?php echo $state; ?>"></td>
    </tr>
     <tr>
      <td align="right"><div align="right">City :</div></td>
      <td><input type="text" name="city" value="<?php echo $city; ?>"></td>
    </tr>
    <tr>
      <td align="right"><div align="right">Post Code :</div></td>
      <td><input type="text" name="postCode" value="<?php echo $postCode; ?>"></td>
    </tr>
    <tr>
      <td align="right"><div align="right">Phone Number :</div></td>
      <td><input type="text" name="phoneNumber" value="<?php echo $phoneNumber; ?>"></td>
    </tr>
    <tr> 
      <td align="right"><div align="right"></div></td>
      <td><input type="submit" value="Update" name="addCompany" id="addCompany" /> Or <a href="<?php echo $baseURL; ?>api/stylfile.php?action=deleteUserAddress&userId=<?php echo $_REQUEST['userId']; ?>&redirect=true&addressType=<?php echo $_REQUEST['addressType']; ?>">Reset</a></td>
    </tr>
</table>
</form>

<?php
mysql_close($con);  
?>