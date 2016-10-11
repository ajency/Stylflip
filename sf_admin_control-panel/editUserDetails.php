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
      <td align="right"><div align="right"><strong>Edit User Details</strong></div></td>
      <td>&nbsp;</td>
    </tr>

    <tr>
      <td align="right">&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
<?php while($row = mysql_fetch_assoc($result)) { ?>
	<?php if( false == empty( $row['profilePicURL'] ) ) { ?>
    <tr>
      <td align="right"><div align="right"></div></td>
      <td><img src="<?php echo $baseURL . $row['profilePicURL']; ?>" width="120px"></td>
    </tr>
    <?php } ?>
    <tr>
      <td align="right"><div align="right">Email :</div></td>
      <td><?php echo $row['email']; ?></td>
    </tr>
    <tr>
      <td align="right"><div align="right">Username :</div></td>
      <td><?php echo $row['username']; ?></td>
    </tr>
    
    <!-- <tr> 
      <td align="right"><div align="right"></div></td>
      <td><input type="submit" value="Update" name="addCompany" id="addCompany" /></td>
    </tr> -->
</form>   
<?php } ?> 
    <tr>
      <td align="right">&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td align="right">&nbsp;</td>
      <td> <a href="editUserPersonalDetails.php?userId=<?php echo $userId; ?>" class="edit_personal_info" style="font-weight: normal; text-decoration: underline;"> Personal Information</a></td>
    </tr>
    <tr>
      <td align="right">&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td align="right"></td>
      <td><div><strong>Edit Addresses</strong></div></td>
    </tr>
    <tr>
      <td align="right">&nbsp;</td>
      <td><a href="editUserAddressDetails.php?userId=<?php echo $userId; ?>&addressType=Address 1" class="address1" style="font-weight: normal; text-decoration: underline;"> Address 1</a></td>
    </tr>
    <tr>
      <td align="right">&nbsp;</td>
      <td><a href="editUserAddressDetails.php?userId=<?php echo $userId; ?>&addressType=Address 2" class="address2" style="font-weight: normal; text-decoration: underline;"> Address 2</a></td>
    </tr>
    <tr>
      <td align="right">&nbsp;</td>
      <td><a href="editUserAddressDetails.php?userId=<?php echo $userId; ?>&addressType=Address 3" class="address3" style="font-weight: normal; text-decoration: underline;"> Address 3</a></td>
    </tr> 
    <tr>
      <td align="right">&nbsp;</td>
      <td>&nbsp;</td>
    </tr>  
    <tr>
      <td align="right">&nbsp;</td>
      <td><a href="editUserBankDetails.php?userId=<?php echo $userId; ?>" class="bank_details" style="font-weight: normal; text-decoration: underline;"> Bank Details</a></td>
    </tr> 
    <tr>
      <td align="right">&nbsp;</td>
      <td>&nbsp;</td>
    </tr>

  </table>
<script type="text/javascript">

$(document).ready(function(){

	$(".edit_personal_info, .address1, .address2, .address3, .bank_details").fancybox({
		'scrolling'		: 'no',
		'titleShow'		: true
	});
});
</script> 
<?php
mysql_close($con);  
?>