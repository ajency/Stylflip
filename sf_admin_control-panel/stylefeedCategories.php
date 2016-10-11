<?php
	include("adminHeader.php");
	if(isset($_POST['addcategories']))
	{
		//var_dump($_POST['products_list']);
    	$sql1 = "SELECT * FROM tbl_newstylefeed WHERE object_type = 'category'";
    	$result1 = mysql_query($sql1);
    	$i = 0;
    	$categories = array();
    	$categories = $_POST['selected_categories'];
    	while ($row = mysql_fetch_assoc($result1)) {
    	    //var_dump($row);
    	    $sql = "UPDATE `stylflip`.`tbl_newstylefeed` SET `object_id` = '".$categories[$i]."' WHERE `tbl_newstylefeed`.`id` = ".$row['id'];
    	    $result = mysql_query($sql);
    	    $i++;
    	}
    	if($result)
    	{
    	    ?><center><span style="color:green">Successfully Updated!</span></center><?php
    	}
	}
?>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>
<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
<script type="text/javascript">
	function get_sub_category(element,caller)
	{
		document.getElementById('error').innerHTML = "";
 		var parent = $(element).val();
 		$.ajax({
 			url : 'get_sub_categories_ajax.php',
 			data : {
 				'parent' : parent,
 				'caller' : caller
 			},
 			dataType : "json",
 			type : 'POST',
 			success : function(data){
 				var subcats = new Array();
 				for(var subcat in data)
 				{
 					var temp = {display : "",value:""};
 					temp.display = data[subcat].name;
 					temp.value = data[subcat].categoryId;
 					subcats.push(temp);
 				}
 				list(subcats);
 			}
 		});
 	}
 	function remove_added_category(categoryId)
 	{
 		document.getElementById(categoryId).remove();
 		document.getElementById('put_button').innerHTML = ""
 		document.getElementById("error").innerHTML = "";
 	}
 	function add_sub_category(element,caller)
	{
		if(document.getElementsByClassName('category_list').length < 5)
		{
			document.getElementById('error').innerHTML = "";
			var sel = document.getElementById('subcats');
 			var subcategory = sel.options[sel.selectedIndex].value;
			var parent = $(element).val();
 			$.ajax({
 				url : 'get_sub_categories_ajax.php',
 				data : {
 					'parent' : subcategory,
 					'caller' : caller
 				},
 				dataType : "json",
 				type : 'POST',
 				success : function(data){
 					var sel = document.getElementById('parentCategory');
 					var parentcategory = sel.options[sel.selectedIndex].text;
 					if(data.categoryPhoto != null)
 					{
 						document.getElementById('list_of_categories').innerHTML += "<table id='"+data.categoryId+"' class='table' style='text-align:center;width:70%''><tr><td width=60%><input type='hidden' class = 'category_list' name='selected_categories[]' value="+data.categoryId+">"+parentcategory+">"+data.name+"</td><td width = 20%><img width = 50px src='"+data.categoryPhoto+"'></td><td width=20%><a href='#' onclick = \"remove_added_category('"+data.categoryId+"')\">Remove</a></td></tr></table>";
 					}
 					else
 					{
 						document.getElementById('error').innerHTML = "No photo for this category. Please select a category which has photo";
 					}
 					if(document.getElementsByClassName('category_list').length == 5)
 					{
 						document.getElementById('put_button').innerHTML = "<input type='submit' value='Add categories' name='addcategories' id='add_categories' />"
 					}
 				},
 				error : function(jqXHR,textStatus,errorThrown)
 				{
 					console.log(errorThrown);
 				}
 			});
 		}
 		else
 		{
 			document.getElementById("error").innerHTML = "Remove the added items to add new items!";
 		}
 	}
 	function list(array_list)
 	{
 		$("#subcats").html(""); //reset child options
 		$(array_list).each(function (i) { //populate child options
 			$("#subcats").append("<option value='"+array_list[i].value+"'>"+array_list[i].display+"</option>");
 		});
 	}

 	$( document ).ready(function() {
    	if(document.getElementsByClassName('category_list').length == 5)
    	{
    	    document.getElementById('put_button').innerHTML = "<input type='submit' value='Add categories' name='addcategories' id='add_categories' />";
    	}
	});
</script>


<table class="table"  style="text-align:center;width:100%">
	<tr>
		<td colspan="5"></td>  
	</tr>
	<tr>
		<td colspan="5"><a href="stylefeedUsers.php">Users</a> | <a href="stylefeedProducts.php">Products</a> | <a href="stylefeedCategories.php">Categories</	a> | <a href="stylefeedBrands.php">Brands</a></td>
	</tr>
</table>
<hr><center>
<strong>Configure the stylefeed section</strong><br><br>
<div id = 'error' style="color:red"></div>
<table  style="text-align:center;width:70%">
	<tr>
	<td>
		Category 
	</td>
	<td>
		<select name="parent" id = "parentCategory" onchange = "get_sub_category(this,'dropdown')">
      		<?php 
				$sql = "select * from tbl_categories WHERE parentCategoryId = 0"; 
				$result = mysql_query($sql);
		
				while($row = mysql_fetch_assoc($result)){
			?>
				<option value="<?php echo $row['categoryId'] ?>"><?php echo $row['name']; ?></option>
	
			<?php } ?>
		</select>
	</td>
	<td>
		<select id="subcats" name="subCategory">
			<?php 
				$sql = "select * from tbl_categories WHERE parentCategoryId = 1"; 
				$result = mysql_query($sql);
		
				while($row = mysql_fetch_assoc($result)){
			?>
				<option value="<?php echo $row['categoryId'] ?>"><?php echo $row['name']; ?></option>
	
			<?php } ?>
		</select>
	</td>
	<td>
		<button onclick = "add_sub_category(this,'add_to_list')">Add</button>
	</td>
	</tr>
</table>
<form method="POST" action="stylefeedCategories.php">
<div id="list_of_categories">
	<?php 
        $sql1 = "SELECT * FROM tbl_newstylefeed WHERE object_type = 'category'";
        $result1 = mysql_query($sql1);
        while($row = mysql_fetch_assoc($result1))
        {
            $sql = "SELECT * FROM tbl_categories WHERE categoryId = ".$row['object_id'];
            $result = mysql_query($sql);
            $single_category = mysql_fetch_assoc($result);
            $parent_category = mysql_fetch_assoc(mysql_query("SELECT * FROM tbl_categories WHERE categoryId = ".$single_category['parentCategoryId']));
            echo "<table id='".$single_category['categoryId']."' class='table' style='text-align:center;width:70%''><tr><td width=60%><input type='hidden' class = 'category_list' name='selected_categories[]' value=".$single_category['categoryId'].">".$parent_category['name'].">".$single_category['name']."</td><td width = 20%><img width = 50px src='".$single_category['categoryPhoto']."'></td><td width=20%><a href='#' onclick = \"remove_added_category('".$single_category['categoryId']."')\">Remove</a></td></tr></table>";
        }
    ?>
</div>
<p id='put_button'></p>
</form>
</center>