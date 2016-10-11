<?php
require_once "../classes/ConnectDB.php";

	$query = "select * from tbl_products where userId = '".$_POST['sellerid']."' and isPurchased!='1'";
    $result = mysql_query($query);
	$result2="<table  align='center' style='margin-left:5%;margin-right:5%;margin-top:2%;margin-bottom:2%;width:85%'><tr><td>&nbsp;</td><td>Product Image:</td><td>SKU</td><td>Title</td></tr>";
    while($row = mysql_fetch_assoc($result)) {
		//print_r($row);
		$sql = "select p.*, b.brandId, b.name as brand, u.firstName, u.lastName, u.username from tbl_products p, tbl_users u, tbl_brands b where b.brandId = p.brandId and u.userId = p.userId and p.productId = '" . $row['productId'] . "'  order by p.productId desc";
		 $result1 = mysql_query($sql);
		     while($row1 = mysql_fetch_assoc($result1)) {
				 
				// print_r($row1);
				//print '<pre>';	
					$productId = $row1['productId'];
					$title = $row1['productTitle'];
					$photo = $row1['primaryPhoto'];
					$sql = "select p.photo from tbl_product_images p where p.productId =". $row['productId'];
					$photosResult = mysql_query($sql);
					$result2.='<tr><td><input type="checkbox" value="'.$row['productId'].'" name="productId[]" /></td><td>';
					if( false == empty($photo) ) {
					$result2.="<a class='single_image' style='display: block;' href='".$baseURL . $photo."'<img width='200px' src=".$baseURL . $photo."></a>";
					}while($row11 = mysql_fetch_assoc($photosResult)) {
				    $str = substr($row11['photo'],29);
					 if($baseURL.$str == $row11['photo']) {
						 
					$result2.="<a class='single_image' style='float:left;' href=".$row11['photo']."><img width='50px' src=".$row11['photo']."></a>";
					} else{ 
					$result2.="<a class='single_image' style='float:left;' href=".$baseURL. $row1['photo']."><img width='50px' src=".$baseURL. $row11['photo']."></a>";
					}
					
					}
				$result2.='</td>';
				$result2.="<td>SF00000".$productId."</td>";
					$result2.="<td>".$title."</td></tr>";	
				}
		
				}
				$result2.='</table>';
	echo $result2;
	
	


?>