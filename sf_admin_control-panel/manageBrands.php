<?php
include("adminHeader.php");
include("class/Pagination.php");
?>

<table class="table"  style="text-align:center;width:100%">

<?php  

//mysql_query("update tbl_subcategory set subcategory_name='Hospitality' where subcategory_name='Rental'");
//mysql_query("update tbl_subcategory set subcategory_name='Institutional' where subcategory_name='Leisure'");

	$sql = "select * from tbl_brands";
?>


<?php
$pager = new Pagination($con, $sql, $rowsPerPage=15);
$pager->setDebug(true);
$result = $pager->paginate();
//if(!$result) die(mysql_error());

$total_rows = mysql_num_rows($result);

?>


<tr>
    <td colspan="4"></td>  
</tr>
<tr>
    <td colspan="4"><a href="addBrand.php">Add Brand</a></div></td>  
</tr>
<?php
	if ($total_rows > 0) {
?>
<tr>
    <td colspan="4"><div align="right"><strong>Page  - </strong> <?php echo $pager->renderNav('<span>', '</span>'); ?>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td>  
</tr>	
<?php		
	}
?>	
<tr>
      <th>Sr no</th>
      <th>Pictures</th>
      <th>Name</th>
      <th>Manage</th>
</tr>


<?php

if ($total_rows == 0) {
?>
<tr>
    <td colspan="4"><div align="center">No Brands Found.</div></td>  
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
		$name = $row['name'];
		@$photo = $row['brandPhoto'];
?> 

<tr>
	<td><?php echo $sr; ?></td>
	<td>
		<?php if($photo){ ?>
			<a class="single_image" style="float:left;" href="<?php echo $photo; ?>"><img width="50px" src="<?php echo $photo; ?>"></a>
		<?php } 
		else {
			echo "No image";
		}?>
	</td>
	<td><?php echo $name; ?></td>
	<td align="center">
		<a href="editBrand.php?Id=<?php echo $id; ?>">Edit</a><?php if(!($isManager || $isExecutive)) { ?> | 
		<a href="#" onclick="deleteUser('<?php echo $baseURL ?>api/brand.php?action=delete&Id=<?php echo $id; ?>');">Delete</a><?php } ?>
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
	function deleteUser( url ){
		var result = confirm("You really want to delete?");
		if (result==true) {
		    window.location = url;
		}
	}
</script>
