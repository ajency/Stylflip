<?php
include("adminHeader.php");
if(isset($_POST['addbrands']))
{
	//var_dump($_POST['products_list']);
    $sql1 = "SELECT * FROM tbl_newstylefeed WHERE object_type = 'brand'";
    $result1 = mysql_query($sql1);
    $i = 0;
    $brands = array();
    $brands = $_POST['brands_list'];
    while ($row = mysql_fetch_assoc($result1)) {
        //var_dump($row);
        $sql = "UPDATE `stylflip`.`tbl_newstylefeed` SET `object_id` = '".$brands[$i]."' WHERE `tbl_newstylefeed`.`id` = ".$row['id'];
        $result = mysql_query($sql);
        $i++;
    }
    if($result)
    {
        ?><center><span style="color:green">Successfully Updated!</span></center><?php
    }
}
?>
<table class="table"  style="text-align:center;width:100%">
	<tr>
		<td colspan="5"></td>  
	</tr>
	<tr>
		<td colspan="5"><a href="stylefeedUsers.php">Users</a> | <a href="stylefeedProducts.php">Products</a> | <a href="stylefeedCategories.php">Categories</	a> | <a href="stylefeedBrands.php">Brands</a></td>
	</tr>
</table>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>
<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
<script src="//netsh.pp.ua/upwork-demo/1/js/typeahead.js"></script>
<style>
    h1 {
        font-size: 20px;
        color: #111;
    } 
    .content {
        width: 80%;
        margin: 0 auto;
        margin-top: 50px;
    } 
    .tt-hint,
    .add_brands {
        border: 2px solid #CCCCCC;
        border-radius: 8px 8px 8px 8px;
        font-size: 24px;
        height: 45px;
        line-height: 30px;
        outline: medium none;
        padding: 8px 12px;
        width: 400px;
    } 
    .tt-dropdown-menu {
        width: 400px;
        margin-top: 5px;
        padding: 8px 12px;
        background-color: #fff;
        border: 1px solid #ccc;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 8px 8px 8px 8px;
        font-size: 18px;
        color: #111;
        background-color: #F1F1F1;
    }
</style>
<script>
    function showResult(str) {
  if (str.length==0) { 
    document.getElementById("livesearch").innerHTML="";
    document.getElementById("livesearch").style.border="0px";
    return;
  }
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  } else {  // code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function() {
    if (this.readyState==4 && this.status==200) {
      document.getElementById("livesearch").innerHTML=this.responseText;
      document.getElementById("livesearch").style.border="1px solid #A5ACB2";
    }
  }
  xmlhttp.open("GET","brandSearch.php?q="+str,true);
  xmlhttp.send();
}

function add_brand_to_list(name,brandId)
{
	if(document.getElementsByClassName('selected_brands_list').length < 5)
	{
		$.ajax({
 			url : 'get_brands_info_ajax.php',
 			data : {
 				'brandId' : brandId,
 			},
 			dataType : "json",
 			type : 'POST',
 			success : function(data){
 				if(data.brandPhoto)
 				{
 					//document.getElementById("selected_brands").innerHTML += "<div id = 'div"+brandId+"'><input type='hidden' name='brands_list[]' value='"+brandId+"'><input size = '35' name= 'brand_list[]' class= 'selected_brands_list' type='text' id="+brandId+" readonly value='"+name+"'><a href=# onclick=\"remove_added_brand('div"+brandId+"')\">Remove</a><br></div>";
 					document.getElementById("selected_brands").innerHTML += "<div id = 'div"+brandId+"'><table class='table' style='text-align:center;width:70%''><tr><td width=60%><input type='hidden' class = 'brand_list' name='brands_list[]' value="+data.brandId+">"+data.name+"</td><td width = 20%><img width = 50px src='"+data.brandPhoto+"'></td><td width=20%><a href='#' onclick = \"remove_added_brand('div"+brandId+"')\">Remove</a></td></tr></table></div>";
        			if(document.getElementsByClassName('selected_brands_list').length == 5)
        			{
            			document.getElementById('put_button').innerHTML = "<input type='submit' value='Add brands' name='addbrands' id='add_brands' />";
        			} 
 				}
 				else
 				{
 					document.getElementById("error").innerHTML = "Brand cannot be added, no image found!";
 				}
 			}
 		});
	}
	else
	{
		document.getElementById("error").innerHTML = "Remove the added items to add new items!";
	}
	//document.getElementById("selected_users").remove();
}

$( document ).ready(function() {
    if(document.getElementsByClassName('selected_brands_list').length == 5)
    {
        document.getElementById('put_button').innerHTML = "<input type='submit' value='Add brands' name='addbrands' id='add_brands' />";
    }
});

function remove_added_brand(brandId)
{
	document.getElementById("error").innerHTML = "";
    document.getElementById('put_button').innerHTML = "";
	document.getElementById(brandId).remove();
}

</script>
<hr><center>
<strong>Configure the stylefeed section</strong>
<div id = "error" style="color:red"></div>
<form name="brands_stylefeed_form" method="post" enctype="multipart/form-data" action="<?php echo $baseURL; ?>sf_admin_control-panel/stylefeedBrands.php">

	<div class="content">
    
    	<div id="selected_brands"></div>
    	
    	Search brands : <input type="text" id="brandName" name="brandName" placeholder="Enter brand name" class= "add_brands" onkeyup="showResult(this.value)"><div id="livesearch" style="width:45%"></div>
    	<p id = "put_button"></p>
   
    </div>
</form> </center>
