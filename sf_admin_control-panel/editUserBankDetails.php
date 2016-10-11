<?php
require_once "../classes/ConnectDB.php";
if (!isset($_SESSION['admin'])) {
	header("location:index.php");
}
 

if(isset($_REQUEST['userId'])) {
	$userId = $_REQUEST['userId']; 
	$query = "select * from tbl_user_kyc_details where userId='". $userId ."'";
	
	$result = mysql_query($query);
	
	$bankName = '';
	$accountNumber = '';
	$ifscCode = '';
	$accountName = '';
	$accountType = '';
	$panNumber = '';
	
	while($row = mysql_fetch_assoc($result)) {
		$bankName = $row['bankName'];
		$accountNumber = $row['accountNumber'];
		$ifscCode = $row['ifscCode'];
		$accountName = $row['accountName'];
		$accountType = $row['accountType'];
		$panNumber = $row['panNumber'];
	}
}

?>

<form id="personal_info_form" method="post" action="<?php echo $baseURL; ?>api/stylfile.php?action=updateKYCDetails&userId=<?php echo $_REQUEST['userId']; ?>&redirect=true">
<table class="table">
    <tr>
      <td colspan="2"> <strong>Edit Bank Details</strong></td>
    </tr>
	<tr>
      <td align="right"><div align="right">Bank Name :</div></td>
      <td><input type="text" name="bankName" value="<?php echo $bankName; ?>"></td>
    </tr>
	 <tr>
      <td align="right"><div align="right">Account Number :</div></td>
      <td><input type="text" name="accountNumber" value="<?php echo $accountNumber; ?>"></td>
    </tr>
     <tr>
      <td align="right"><div align="right">IFSC Code :</div></td>
      <td><input type="text" name="ifscCode" value="<?php echo $ifscCode; ?>"></td>
    </tr>
     <tr>
      <td align="right"><div align="right">Account Name :</div></td>
      <td><input type="text" name="accountName" value="<?php echo $accountName; ?>"></td>
    </tr>
    <tr>
      <td align="right"><div align="right">Account Type :</div></td>
      <td><input type="text" name="accountType" value="<?php echo $accountName; ?>"></td>
    </tr>
    <tr>
      <td align="right"><div align="right">PAN Number :</div></td>
      <td><input type="text" name="panNumber" value="<?php echo $panNumber; ?>"></td>
    </tr>
    <tr> 
      <td align="right"><div align="right"></div></td>
      <td><input type="submit" value="Update" name="addCompany" id="addCompany" /></td>
    </tr>
</table>
</form>

<?php
mysql_close($con);  
?>