<?php
include("adminHeader.php");
include("../classes/Pagination.php");
?>

<table class="table">

<?php  

if(isset($_POST['search_text'])) {
	$search_text = $_POST['search_text'];
	$sql .= "select * from tbl_users where firstName like '%".$search_text."%' or lastName like '%".$search_text."%' or ";
	$sql .= " email like '%".$search_text."%' order by userId desc";
}
else {
	if(isset($_REQUEST['userId'])) {
		$sql .= "select * from tbl_users where userId = " . $_REQUEST['userId'];
	}
	else {
		$sql .= "select * from tbl_users order by userId desc";
	}
}
?>


<?php
$pager = new Pagination($con, $sql, $rowsPerPage=15);
$pager->setDebug(true);
$result = $pager->paginate();
//if(!$result) die(mysql_error());

$total_rows = mysql_num_rows($result);

?>


<tr>
	  <td colspan="11" align="right">
	  	<form method="post" action="manageUsers.php"><input type="text" placeholder="Search user" name="search_text" value="<?php if(isset($_REQUEST['search_text']))echo $_REQUEST['search_text']; ?>"><input type="submit" value="Search"> | <a href="manageUsers.php">View All</a><?php if($isSuperAdmin) { ?> | <a href="downloadReport.php?exportType=usersData">Export</a><?php } ?></form>
	  </td>
</tr>	

<?php
	if ($total_rows > 0) {
?>
<tr>
    <td colspan="11"><div align="right"><strong>Page  - </strong> <?php echo $pager->renderNav('<span>', '</span>'); ?>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td>  
</tr>	
  <tr>
    <td colspan="11"></td>  
  </tr>
<?php		
	}
?>	
<tr>
      <th>Sr no</th>
      <th>Featured</th>
      <th>Username</th>
      <th>First name</th>
      <th>Last name</th>
      <th>Email</th>
      <th width="20%">Addresses</th>      
      <th width="17%">KYC Details</th>
      <th>Sizes</th>
      <th>Status</th>
      <th width="6%">Manage</th>
</tr>


<?php

if ($total_rows == 0) {
?>
<tr>
    <td colspan="11"><div align="center">No users found.</div></td>  
</tr>

<?php
}
else {
	if (isset($_REQUEST['page']) && $_REQUEST['page'] > 1) {
		$sr = (($_REQUEST['page'] - 1) * $pager->rowsPerPage()) + 1;	
	}
	else {
		$sr = 1;			
	}
	
	while($row = mysql_fetch_assoc($result)) {
		$userId = $row['userId'];
		$DOB = $row['dateOfBirth'];
		$address = $row['address'];	
		$mobileNumber = $row['mobileNumber'];	
		$email = $row['email'];	
		$status = $row['isActive'] == 1 ? 'Active' : 'Banned';	
?> 

<tr>
	<td><?php echo $sr; ?></td>
	<td align="center"><input type="checkbox" <?php echo $row['isFeatured'] ? "checked" : ""; ?> onclick="featureUser(this.checked, '<?php echo $userId; ?>')" /></td>
	<td><?php echo $row['username']; ?></td>
	<td><?php echo $row['firstName']; ?></td>
	<td><?php echo $row['lastName']; ?></td>
	<td><?php echo $email; ?></td>
	<td>
		<?php
			$query = "select * from tbl_user_addresses where userId='". $userId ."' Order By addressType";
			$addressesResult = mysql_query($query);
	        if($addressesResult) {
				while($addressesRow = mysql_fetch_assoc($addressesResult)) {
		?>
			<?php echo '<b>' . $addressesRow['addressTitle'] . '</b>: ' . $addressesRow['addressLine1'] . ', ' . $addressesRow['addressLine2'] . ', ' . $addressesRow['landmark'] . ', ' . $addressesRow['state'] . ', ' . $addressesRow['city'] . ', ' . $addressesRow['postCode'] . '<br/>Contact no.: ' . $addressesRow['phoneNumber'] . '<br/>'; ?>
		<?php			
				}
			}
		?>
	</td>
	<td>
		<?php
			$query = "select * from tbl_user_kyc_details where userId='". $userId ."'";
			$kycResult = mysql_query($query);
	        if($kycResult) {
				while($kycRow = mysql_fetch_assoc($kycResult)) {
					$KYCDetails = '<b>Bank name</b>: ' . $kycRow['bankName'] . '<br/>';
					$KYCDetails .= '<b>Account no.</b>: ' . $kycRow['accountNumber'] . '<br/>';
					$KYCDetails .= '<b>IFSC code</b>: ' . $kycRow['ifscCode'] . '<br/>';
					$KYCDetails .= '<b>Account name</b>: ' . $kycRow['accountName'] . '<br/>';
					$KYCDetails .= '<b>Account type</b>: ' . $kycRow['accountType'] . '<br/>';
					$KYCDetails .= '<b>PAN no.</b>: ' . $kycRow['panNumber'] . '<br/>';
					echo $KYCDetails;
				}
			}
		?>
	</td>
	<td>
		<?php
			if($row['topsAndDresses'] != '' || $row['jeansAndBottoms'] != '' || $row['footwear'] != '') {
		?>
		<b>Tops & Dresses</b>: <?php echo $row['topsAndDresses'] == '' ? '-' : $row['topsAndDresses']; ?><br/>
		<b>Jeans & Bottoms</b>: <?php echo $row['jeansAndBottoms'] == '' ? '-' : $row['jeansAndBottoms']; ?><br/>
		<b>Footwear</b>: <?php echo $row['footwear'] == '' ? '-' : $row['footwear']; ?><br/>
		<?php
			}
		?>
	</td>		
	<td align="center"><?php echo $status; ?></td>
 	<td align="center">
		<!-- <a href="#" onclick="deleteUser( '<?php echo $baseURL ?>api/user.php?action=deleteUser&userId=<?php echo $userId; ?>');">Delete</a> | -->
		<ul style="list-style: none; padding-left: 0px;">
			<?php
				if($row['isActive'] == 1) {
			?>
					<li><a style="cursor: pointer;" onclick="banUser('<?php echo $baseURL ?>api/user.php?action=deactivateUser&userId=<?php echo $userId; ?><?php if(isset($_REQUEST['page'])) { echo "&page=" . $_REQUEST['page']; }  ?>')">Ban</a></li> 
	 		<?php
				}
				else {
	 		?>
	 				<li><a style="cursor: pointer;" onclick="unbanUser('<?php echo $baseURL ?>api/user.php?action=activateUser&userId=<?php echo $userId; ?><?php if(isset($_REQUEST['page'])) { echo "&page=" . $_REQUEST['page']; }  ?>')">Unban</a></li> 
	 		<?php
				}
	 		?>
				<?php if($isSuperAdmin) { ?><li><a href="editUserDetails.php?userId=<?php echo $userId; ?>">Edit</a></li><?php } ?>
	 			<li><a style="cursor: pointer;" onclick="deleteUser('<?php echo $baseURL ?>api/user.php?action=deleteUser&userId=<?php echo $userId; ?><?php if(isset($_REQUEST['page'])) { echo "&page=" . $_REQUEST['page']; }  ?>')">Delete</a></li>
 		</ul>
 	</td> 
<?php	
		$sr=$sr+1;
	}
?>
</tr>
  
  <tr>
    <td colspan="11"></td>  
  </tr>
  <tr>
    <td colspan="11"><div align="right"><strong>Page  - </strong> <?php echo $pager->renderNav('<span>', '</span>'); ?>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td>  
  </tr>
<?php
}	
?>


</table>

<?php
	mysql_close($con);  
?>


<script>
	function banUser( url ){
		var result = confirm("Do you really want to ban user?");
		if (result) {
		    window.location = url;
		}
	}
	
	function unbanUser( url ){
		var result = confirm("Do you really want to unban user?");
		if (result) {
		    window.location = url;
		}
	}
	
	function deleteUser( url ){
		var result = confirm("Do you really want to delete user details?");
		if (result) {
		    window.location = url;
		}
	}
	
	function featureUser(bool, userId) {
		window.location = '../api/user.php?action=featureUser&feature='+bool+'&userId='+userId+'&page=<?php echo $_REQUEST['page']; ?>';
	}
</script>