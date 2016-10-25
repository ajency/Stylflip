<?php
include("adminHeader.php");
include("../classes/Pagination.php");
?>

<table class="table">

<?php 

if(isset($_POST['search_text'])) {
	$search_text = $_POST['search_text'];
	$sql .= "select * from tbl_signing_in_issues email like '%".$search_text."%' order by id desc";
}
else {
	$sql .= "select * from tbl_signing_in_issues email order by id desc";
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
	  <td colspan="4" align="right"><form method="post" action="signingInIssues.php"><input type="text" placeholder="Search email" name="search_text" value="<?php if(isset($_REQUEST['search_text']))echo $_REQUEST['search_text']; ?>"><input type="submit" value="Search"> | <a href="viewProducts.php">View All</a></form></td>
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
      <th>Email</th>
      <th>Issue</th>
      <th>Manage</th>
</tr>


<?php

if ($total_rows == 0) {
?>
<tr>
    <td colspan="4"><div align="center">No signing issues found.</div></td>  
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
?> 

<tr>
	<td><?php echo $sr; ?></td>	
	<td><?php echo $row['email']; ?></td>
	<td><?php echo $row['issue']; ?></td>
	<td><a href="<?php echo $baseURL; ?>api/user.php?action=deleteSigningInIssue&issueId=<?php echo $row['id'] ?><?php if(isset($_REQUEST['page'])) { echo "&page=" . $_REQUEST['page']; }  ?>">Delete</a></td>
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
