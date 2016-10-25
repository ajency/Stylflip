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
		<td colspan="5"><a href="stylefeedUsers.php">Users</a> | <a href="stylefeedProducts.php">Products</a> | <a href="stylefeedCategories.php">Categories</a> | <a href="stylefeedBrands.php"><font color="green"><u>Brands</u></font></a></td>
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
        width: 40%;
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
      #table-wrapper {
  position:relative;
}
#table-scroll {
  height:200px;
  overflow:auto;  
  margin-top:20px;
}
/*#table-wrapper table {
  width:100%;

}*/
#table-wrapper table * {
  color:black;
}
#table-wrapper table thead th .text {
  position:absolute;   
  top:-20px;
  z-index:2;
  height:20px;
  width:35%;
  border:1px;
}
tr:nth-child(even) {background: #CCC}
tr:nth-child(odd) {background: #FFF}
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
	if(document.getElementsByClassName('brand_list').length < 5)
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
 					document.getElementById("selected_brands").innerHTML += "<div id = 'div"+brandId+"'><table class='table' style='text-align:center;width:70%''><tr><td width=60% style='text-align:center'><input type='hidden' class = 'brand_list' name='brands_list[]' value="+data.brandId+">"+data.name+"</td><td width = 20% style='text-align:center'><img width = 50px src='"+"<?php echo $baseURL; ?>"+data.brandPhoto+"'></td><td width=20% style='text-align:center'><a style='color:red' href='#' onclick = \"remove_added_brand('div"+brandId+"')\">Remove</a></td></tr></table></div>";
        			if(document.getElementsByClassName('brand_list').length == 5)
        			{
            			document.getElementById('put_button').innerHTML = "<input type='submit' value='Save' name='addbrands' id='add_brands' />";
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
    if(document.getElementsByClassName('brand_list').length == 5)
    {
        document.getElementById('put_button').innerHTML = "<input type='submit' value='Save' name='addbrands' id='add_brands' />";
    }
});

function remove_added_brand(brandId)
{
	document.getElementById("error").innerHTML = "";
    document.getElementById('put_button').innerHTML = "";
	document.getElementById(brandId).remove();
}

</script>
<center>
<strong>Configure the stylefeed brands</strong>
<div id = "error" style="color:red"></div>

<form name="brands_stylefeed_form" method="post" enctype="multipart/form-data" action="<?php echo $baseURL; ?>sf_admin_control-panel/stylefeedBrands.php">
	<div class="content">
    Search brands : <br><input type="text" id="brandName" name="brandName" placeholder="Search by brand name" class= "add_brands" onkeyup="showResult(this.value)"><div id="livesearch" style="width:40%"></div><br>
    

    	<div id="selected_brands">
    		<?php 
                $sql1 = "SELECT * FROM tbl_newstylefeed WHERE object_type = 'brand'";
                $result1 = mysql_query($sql1);
                while($row = mysql_fetch_assoc($result1))
                {
                    $sql = "SELECT * FROM tbl_brands WHERE brandId = ".$row['object_id'];
                    $result = mysql_query($sql);
                    $single_brand = mysql_fetch_assoc($result);
                    echo "<div id = 'div".$single_brand['brandId']."'><table class='table' style='text-align:center;width:70%''><tr><td width=60% style='text-align:center'><input type='hidden' class = 'brand_list' name='brands_list[]' value=".$single_brand['brandId'].">".$single_brand['name']."</td><td width = 20% style='text-align:center'><img width = 50px src='".$baseURL.$single_brand['brandPhoto']."'></td><td width=20% style='text-align:center'><a style='color:red' href='#' onclick = \"remove_added_brand('div".$single_brand['brandId']."')\">Remove</a></td></tr></table></div>";
                }
            ?>
            <p id = "put_button"></p>
    	</div>
    	
    	
    </div>
</form></center>