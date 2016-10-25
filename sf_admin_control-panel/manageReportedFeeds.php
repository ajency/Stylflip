<?php
include("adminHeader.php");
include("class/Pagination.php");
?>

<table class="table"  style="text-align:center;width:100%">

<?php  
	$sql = "select f.*, hf.feedId, hf.userId as reportedUserId, hf.reason, u.isActive, u.username, u1.username as reportedby from tbl_hidden_feeds hf INNER JOIN tbl_stylefeed f on f.feedId = hf.feedId INNER JOIN tbl_users u on u.userId = f.userId INNER JOIN tbl_users u1 on u1.userId = hf.userId";
?>


<?php
$pager = new Pagination($con, $sql, $rowsPerPage=15);
$pager->setDebug(true);
$result = $pager->paginate();
//if(!$result) die(mysql_error());

$total_rows = mysql_num_rows($result);

?>




<?php
	if ($total_rows > 0) {
?>
<tr>
    <td colspan="6"><div align="right"><strong>Page  - </strong> <?php echo $pager->renderNav('<span>', '</span>'); ?>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td>  
</tr>	
<?php		
	}
?>	
<tr>
      <th>Sr no</th>
      <th>Feed Title</th>
      <th>Posted By</th>
      <th>Reported By</th>
      <th>Reason</th>
      <th>Manage</th>
</tr>


<?php

if ($total_rows == 0) {
?>
<tr>
    <td colspan="6"><div align="center">No Feeds Found.</div></td>  
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
		$id = $row['brandId'];
		$name = $row['title'];
		$reason = $row['reason'];
		$postedby = $row['username'];
		$reportedby = $row['reportedby'];
		$reportedUserId = $row['reportedUserId'];
		$userId = $row['userId'];
		$feedId = $row['feedId'];
?> 

<tr>
	<td><?php echo $sr; ?></td>
	<td><?php echo $name; ?></td>
	<td>
		<?php echo $postedby; ?>
	</td>
	<td>
		<?php echo $reportedby; ?>
	</td>
	<td align="center">
		<?php echo $reason; ?>
	</td>
	<td align="center">
				<?php
			if($row['isActive'] == 1) {
		?>
		<a href="<?php echo $baseURL ?>api/user.php?action=deactivateUser&redirectUrl=manageReportedFeeds.php&userId=<?php echo $userId; ?><?php if(isset($_REQUEST['page'])) { echo "&page=" . $_REQUEST['page']; }  ?>">Ban User</a>
 		<?php
			}
			else {
 		?>
 		<a href="<?php echo $baseURL ?>api/user.php?action=activateUser&redirectUrl=manageReportedFeeds.php&userId=<?php echo $userId; ?><?php if(isset($_REQUEST['page'])) { echo "&page=" . $_REQUEST['page']; }  ?>">Unban User</a>
 		<?php
			}
 		?> 
		| <a href="<?php echo $baseURL ?>api/stylfeed.php?action=deletePost&redirect=true&userId=<?php echo $userId; ?>&feedId=<?php echo $feedId; ?><?php if(isset($_REQUEST['page'])) { echo "&page=" . $_REQUEST['page']; }  ?>">Delete Post</a>
	</td>
	
<?php	
		$sr=$sr+1;
	}
?>
</tr>
  
  <tr>
    <td colspan="6"></td>  
  </tr>
  <tr>
    <td colspan="6"><div align="right"><strong>Page  - </strong> <?php echo $pager->renderNav('<span>', '</span>'); ?>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td>  
  </tr>
<?php
}	
?>


</table>

<?php
mysql_close($con);  
?>

