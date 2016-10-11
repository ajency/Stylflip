<?php
include("adminHeader.php");
include("../classes/Pagination.php");
?>

<table class="table">

<?php  

if(isset($_POST['search_text'])) {
	$search_text = $_POST['search_text'];
	$sql .= "select * from tbl_admins where username like '%".$search_text."%' order by Id desc ";
}
else {
	if(isset($_REQUEST['userId'])) {
		$sql .= "select * from tbl_admin where Id = " . $_REQUEST['userId'];
	}
	else {
		$sql .= "select * from tbl_admin order by Id desc";
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
	  <td colspan="4" align="right">
	  	<form method="post" action="manageAdmins.php"><input type="text" placeholder="Search admin" name="search_text" value="<?php if(isset($_REQUEST['search_text']))echo $_REQUEST['search_text']; ?>"><input type="submit" value="Search"> | <a href="manageAdmins.php">View All</a> | <a href="createNewAdmin.php">Create New Admin</a></form>
	  </td>
</tr>	

<?php
	if ($total_rows > 0) {
?>
<tr>
    <td colspan="4"><div align="right"><strong>Page  - </strong> <?php echo $pager->renderNav('<span>', '</span>'); ?>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td>  
</tr>	
  <tr>
    <td colspan="4"></td>  
  </tr>
<?php		
	}
?>	
<tr>
      <th>Sr no</th>
      <th>Username</th>
      <th>Role</th>
      <th width="6%">Manage</th>
</tr>


<?php

if ($total_rows == 0) {
?>
<tr>
    <td colspan="4"><div align="center">No admins found.</div></td>  
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
		$userId = $row['Id'];
?> 

<tr>
	<td><?php echo $sr; ?></td>
	<td><?php echo $row['username']; ?></td>
	<td><?php echo $row['role']; ?></td>
 	<td align="center">
		<ul style="list-style: none; padding-left: 0px;">
				<li><a href="editAdmin.php?userId=<?php echo $userId; ?>">Edit</a></li>
	 			<li><a style="cursor: pointer;" onclick="deleteAdmin('<?php echo $baseURL ?>api/user.php?action=deleteAdminUser&userId=<?php echo $userId; ?><?php if(isset($_REQUEST['page'])) { echo "&page=" . $_REQUEST['page']; }  ?>')">Delete</a></li>
 		</ul>
 	</td> 
<?php	
		$sr=$sr+1;
	}
?>
</tr>
  
  <tr>
    <td colspan="4"></td>  
  </tr>
  <tr>
    <td colspan="4"><div align="right"><strong>Page  - </strong> <?php echo $pager->renderNav('<span>', '</span>'); ?>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td>  
  </tr>
<?php
}	
?>


</table>

<?php
	mysql_close($con);  
?>


<script>
	function deleteAdmin( url ){
		var result = confirm("Do you really want to delete user?");
		if (result) {
		    window.location = url;
		}
	}
	
	function featureUser(bool, userId) {
		window.location = '../api/user.php?action=featureUser&feature='+bool+'&userId='+userId+'&page=<?php echo $_REQUEST['page']; ?>';
	}
</script>