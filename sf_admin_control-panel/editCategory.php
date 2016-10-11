<?php
include("adminHeader.php");
?>

<?php  

if(isset($_REQUEST['Id'])) {
	$sql = "select * from tbl_categories where categoryId =" . $_REQUEST['Id'];
	
	$result = mysql_query($sql);
}

?>

<form name="companyForm" method="post" enctype="multipart/form-data" action="<?php echo $baseURL; ?>api/categories.php?action=edit&Id=<?php echo $_REQUEST['Id']; ?>">
  <table class="table">
    
    <tr>
      <td align="right"><div align="right"><strong>Edit Category</strong></div></td>
      <td>&nbsp;</td>
    </tr>
<?php while($row = mysql_fetch_assoc($result)) { ?>
    <tr>
      <td align="right">&nbsp;</td>
      <td>&nbsp;</td>
    </tr>

    <tr>
      <td align="right"><div align="right">Name :</div></td>
      <td><input type="text" name="name" value="<?php echo $row['name']; ?>"></td>
    </tr>
    
    <tr>
      <td align="right">&nbsp;</td>
      <td>&nbsp;</td>
    </tr>

    <tr>
      <td align="right"><div align="right">Photo :</div></td>
      <td><input type="file" id = 'filetoUpload' name="filetoUpload" required></td>
    </tr>
    
    <tr>
      <td align="right">&nbsp;</td>
      <td>&nbsp;</td>
    </tr>
<?php } ?>
    <tr> 
      <td align="right"><div align="right"></div></td>
      <td><input type="submit" value="Update" name="addCompany" id="addCompany" /></td>
    </tr>

  </table>

</form>

<?php
mysql_close($con);  
?>
