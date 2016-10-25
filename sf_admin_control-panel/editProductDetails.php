<?php
include("adminHeader.php");

$query = "select * from tbl_products where productId = '".$_REQUEST['productId']."'";
$result = mysql_query($query);
$productDetails = mysql_fetch_assoc($result);

$productPhotos = array();
array_push($productPhotos, array('photo'=>$productDetails['primaryPhoto'], 'id'=>0));

$query = "select * from tbl_product_images where productId = '".$_REQUEST['productId']."'";
$result = mysql_query($query);
while($row = mysql_fetch_assoc($result)) {
	array_push($productPhotos, array('photo'=>$row['photo'], 'id'=>$row['photoId']));
}
?>

<form name="productDetails" method="post" enctype="multipart/form-data" action="<?php echo $baseURL; ?>api/product.php?action=updateProductDetails&admin=true&productId=<?php echo $_REQUEST['productId'] ?><?php if(isset($_REQUEST['page'])) { echo "&page=" . $_REQUEST['page']; }  ?>">
  <table class="table">
    
    <tr>
      <td align="right"><div align="right"><strong>Edit Product Details</strong></div></td>
      <td>&nbsp;</td>
    </tr>

    <tr>
      <td align="right">&nbsp;</td>
      <td>&nbsp;</td>
    </tr>

    <tr>
      <td align="right"><div align="right">Title:</div></td>
      <td><input type="text" name="title" size="40" value="<?php echo $productDetails['productTitle'] ?>"></td>
    </tr>
    
    <tr>
      <td align="right"><div align="right">Photos:</div></td>
      <td>
      	<table>
      		<tr>
      			<td>
      				<input type="hidden" id="productImage1" name="productImage1" value="<?php echo $baseURL . $productPhotos[0]['photo']; ?>">	
      				<a class="single_image" style="display: block;" href="<?php echo $baseURL . $productPhotos[0]['photo']; ?>"> <img width="200px" src="<?php echo $baseURL . $productPhotos[0]['photo']; ?>"> </a>
					<a style="cursor: pointer;" onclick="deleteImage(1, event)">Delete</a>
      			</td>
      		</tr>	
      		<tr>
      			<td>
      				<table>
      			<?php 
      				$count = count($productPhotos);
					for($i=1; $i<count($productPhotos); $i++) {
				?>		
						<td>
							<input type="hidden" id="productImage<?php echo $i+1; ?>" name="productImage<?php echo $i+1; ?>" value="<?php echo $productPhotos[$i]['photo']; ?>">
						<?php $str = substr($productPhotos[$i]['photo'],29); ?>
						<?php if($baseURL.$str == $productPhotos[$i]['photo']) { ?>
							<a class="single_image" style="float:left;" href="<?php echo $productPhotos[$i]['photo']; ?>"><img width="50px" src="<?php echo $productPhotos[$i]['photo']; ?>"></a><br/>
							<?php } else{ ?>
							<a class="single_image" style="float:left;" href="<?php echo $baseURL. $productPhotos[$i]['photo']; ?>"><img width="50px" src="<?php echo $baseURL . $productPhotos[$i]['photo']; ?>"></a><br/>
							<?php } ?>
							<a style="cursor: pointer;" onclick="deleteImage(<?php echo $i+1; ?>, event)">Delete</a>
						</td>	
				<?php 
					}
					for($i=$count+1; $i<=5; $i++) {
				?>		
						<td>
							<input type="file" id="productImage<?php echo $i; ?>" name="productImage<?php echo $i; ?>"><br/>(jpg, bmp, png)
						</td>	
				<?php
					}
				 ?>
					</table>
				</td>	
      		</tr>
      	</table>
      </td>
    </tr>
    
    <tr>
      <td align="right"><div align="right">Description:</div></td>
      <td><textarea name="description" cols="40" rows="5"><?php echo $productDetails['productDescription'] ?></textarea></td>
    </tr>
    
    <tr>
      	<td align="right"><div align="right">Brand:</div></td>
      	<td>
			<select name="brandId">
				<?php
					$query = "select * from tbl_brands";
					$result = mysql_query($query);
					while($row = mysql_fetch_assoc($result)) {
				?>
						<option value="<?php echo $row['brandId'];  ?>" <?php if($row['brandId'] == $productDetails['brandId']) { echo "selected"; } ?>><?php echo $row['name'];  ?></option>
				<?php		
					}
				?>
			</select>
	  	</td>
    </tr>
    
    <tr>
      	<td align="right"><div align="right">Condition:</div></td>
      	<td>
      		<select name="condition">
				<option value="Brand new with tags" <?php if($productDetails['condition'] == "Brand new with tags") { echo "selected"; } ?>>Brand new with tags</option>
				<option value="New without tags" <?php if($productDetails['condition'] == "New without tags") { echo "selected"; } ?>>New without tags</option>
				<option value="Barely Worn (once or twice)" <?php if($productDetails['condition'] == "Barely Worn (once or twice)") { echo "selected"; } ?>>Barely Worn (once or twice)</option>
				<option value="Gently Used" <?php if($productDetails['condition'] == "Gently Used") { echo "selected"; } ?>>Gently Used</option>
			</select>
      	</td>
    </tr>

    <tr>
      <td align="right">&nbsp;</td>
      <td>&nbsp;</td>
    </tr>

    <tr> 
      <td align="right"><div align="right"></div></td>
      <td><input type="submit" value="Update" name="editProduct" onclick="return validateUpdateProductDetails()" /></td>
    </tr>

  </table>

</form>

<script>
	$(document).ready(function() {
		/* This is basic - uses default settings */
		$("a.single_image").fancybox();
	});
	
	
	function deleteImage(index, event) {
		var result = confirm("Do you really want to remove product image " + index + "?");
		if (result) {
		    $($(event.target).parent()).html('<input type="file" id="productImage'+index+'" name="productImage'+index+'"><br/>(jpg, bmp, png)');
		}
	}
	
	function validateUpdateProductDetails() {
		if($("#productImage1").val() == '') {
			alert('Please select primary image');
			return false
		}
		return true;
	}
</script>	
