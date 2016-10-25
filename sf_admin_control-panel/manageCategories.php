<?php
include("adminHeader.php");
include("class/Pagination.php");
?>


<script>
    function updateSizeChart(catId, size) {
        window.location = "<?php echo $baseURL; ?>" + "api/categories.php?action=updateSizeChart&categoryId=" + catId + "&size=" + size;
    }
</script>


<table class="table"  style="text-align:center;width:100%">

<?php  

//mysql_query("update tbl_subcategory set subcategory_name='Hospitality' where subcategory_name='Rental'");
//mysql_query("update tbl_subcategory set subcategory_name='Institutional' where subcategory_name='Leisure'");

	$sql = "select * from tbl_categories WHERE parentCategoryId = 0";
?>


<?php
$pager = new Pagination($con, $sql, $rowsPerPage=15);
$pager->setDebug(true);
$result = $pager->paginate();
//if(!$result) die(mysql_error());

$total_rows = mysql_num_rows($result);

?>



<tr>
    <td colspan="5"></td>  
</tr>
<tr>
   <?php if(!$isManager) { ?> <td colspan="5"><a href="addCategory.php">Add Category</a> | <a href="addSubcategory.php">Add Sub-category</a></td>  <?php } ?>
</tr>

<?php
	if ($total_rows > 0) {
?>
<tr>
    <td colspan="5"><div align="right"><strong>Page  - </strong> <?php echo $pager->renderNav('<span>', '</span>'); ?>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td>  
</tr>	
<?php		
	}
?>	
<tr>
      <th>Sr no</th>
      <th>Photo</th>
      <th>Category</th>
      <th>Sub Categories</th>
      <th>Manage</th>
</tr>


<?php

if ($total_rows == 0) {
?>
<tr>
    <td colspan="5"><div align="center">No Categories Found.</div></td>  
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
		$id = $row['categoryId'];
		$name = $row['name'];
		$photo = $row['categoryPhoto'];
?> 

<tr>
	<td><?php echo $sr; ?></td>
	<td>
		<?php if($photo){ ?>
			<a class="single_image" style="float:left;" href="<?php echo $baseURL.$photo; ?>"><img width="50px" src="<?php echo $baseURL.$photo; ?>"></a>
		<?php } 
		else {
			echo "No image";
		}?>
	</td>
	<td><?php echo $name; ?></td>
	<td>
		<?php  
		$sql = "select * from tbl_categories WHERE parentCategoryId = $id";
		$result1 = mysql_query($sql);
		
		while($row1 = mysql_fetch_assoc($result1)) { ?>
		<a href="editCategory.php?Id=<?php echo $row1['categoryId']; ?>">Edit</a>&nbsp;&nbsp;|&nbsp;&nbsp;
		<a href="#" onclick="deleteUser('<?php echo $baseURL ?>api/categories.php?action=delete&Id=<?php echo $row1['categoryId']; ?>');">Delete</a>  &nbsp;&nbsp;
        <select onchange="updateSizeChart('<?php echo $row1['categoryId']; ?>', this.value)">
            <option value="">Select size</option>
<option value="A" <?php if($row1['size'] == "A") { echo "selected"; } ?>>Size chart - A</option>
            <option value="B" <?php if($row1['size'] == "B") { echo "selected"; } ?>>Size chart - B</option>
            <option value="C" <?php if($row1['size'] == "C") { echo "selected"; } ?>>Size chart - C</option>
            <option value="D" <?php if($row1['size'] == "D") { echo "selected"; } ?>>Size chart - D</option>
            <option value="E" <?php if($row1['size'] == "E") { echo "selected"; } ?>>Size chart - E</option>
            <option value="F" <?php if($row1['size'] == "F") { echo "selected"; } ?>>Size chart - F</option>
        </select>&nbsp;&nbsp;&nbsp;
        <?php echo $row1['name']; ?>
		<br/>
	<?php	}
	?>
	</td>
	<td align="center">
		<a href="editCategory.php?Id=<?php echo $id; ?>">Edit</a><?php if(!$isManager) { ?> | 
		<a href="#" onclick="deleteUser('<?php echo $baseURL ?>api/categories.php?action=delete&Id=<?php echo $id; ?>');">Delete</a><?php } ?>
	</td>
</tr>

<?php	
		$sr=$sr+1;
	}
?>
  
  <tr>
    <td colspan="5"></td>  
  </tr>
  <tr>
    <td colspan="5"><div align="right"><strong>Page  - </strong> <?php echo $pager->renderNav('<span>', '</span>'); ?>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td>  
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
