<?php
include("adminHeader.php");
?>

<form name="companyForm" method="post" enctype="multipart/form-data" action="<?php echo $baseURL; ?>api/categories.php?action=add">
  <table class="table">
    
    <tr>
      <td align="right"><div align="right"><strong>Add New Category</strong></div></td>
      <td>&nbsp;</td>
    </tr>

    <tr>
      <td align="right">&nbsp;</td>
      <td>&nbsp;</td>
    </tr>

    <tr>
      <td align="right"><div align="right">Name :</div></td>
      <td><input type="text" name="categoryName"><input type="hidden" name="userId" value="<?php echo $_SESSION['admin_id'] ?>"></td>
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

    <tr> 
      <td align="right"><div align="right"></div></td>
      <td><input type="submit" value="Add" name="addCompany" id="addCompany" /></td>
    </tr>

  </table>

</form>
