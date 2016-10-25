<?php
include("adminHeader.php");
if(isset($_POST['addproducts']))
{
  //var_dump($_POST['products_list']);
    $sql1 = "SELECT * FROM tbl_newstylefeed WHERE object_type = 'product'";
    $result1 = mysql_query($sql1);
    $i = 0;
    $products = array();
    $products = $_POST['products_list'];
    while ($row = mysql_fetch_assoc($result1)) {
        //var_dump($row);
        $sql = "UPDATE `stylflip`.`tbl_newstylefeed` SET `object_id` = '".$products[$i]."' WHERE `tbl_newstylefeed`.`id` = ".$row['id'];
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
    <td colspan="5"><a href="stylefeedUsers.php">Users</a> | <a href="stylefeedProducts.php"><font color="green"><u>Products</u></font></a> | <a href="stylefeedCategories.php">Categories</a> | <a href="stylefeedBrands.php">Brands</a></td>
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
    .add_products {
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
  xmlhttp.open("GET","productSearch.php?q="+str,true);
  xmlhttp.send();
}

function add_product_to_list(productName,productId)
{
  if(document.getElementsByClassName('selected_products_list').length < 5)
  {
    document.getElementById("selected_products").innerHTML += "<div id = 'div"+productId+"'><table class= 'selected_products_list table'><tr><input type='hidden' name='products_list[]' value='"+productId+"'><td style='text-align:center;width:30%'>SF00000"+productId+"</td><td style='text-align:center;width:50%'>"+productName+"</td><td style='text-align:center;width:20%'><a style='color:red' href=# onclick=\"remove_added_product('div"+productId+"')\">Remove</a></td></tr></table></div>";
        if(document.getElementsByClassName('selected_products_list').length == 5)
        {
            document.getElementById('put_button').innerHTML = "<input type='submit' value='Save' title='Save products list!' name='addproducts' id='add_products' />";
        } 
  }
  else
  {
    document.getElementById("error").innerHTML = "Remove the added items to add new items!";
  }
  //document.getElementById("selected_products").remove();
}

$( document ).ready(function() {
    if(document.getElementsByClassName('selected_products_list').length == 5)
    {
        document.getElementById('put_button').innerHTML = "<input type='submit' value='Save' title='Save products list!' name='addproducts' id='add_products' />";
    }
});

function remove_added_product(productId)
{
  document.getElementById("error").innerHTML = "";
    document.getElementById('put_button').innerHTML = "<input type='submit' disabled title='Add 5 items to enable this button!' value='Save' name='addproducts' id='add_products' />";
  document.getElementById(productId).remove();
}

</script>
<center>
<strong>Configure the stylefeed products</strong>
<div id = "error" style="color:red"></div>
<form name="products_stylefeed_form" method="post" enctype="multipart/form-data" action="<?php echo $baseURL; ?>sf_admin_control-panel/stylefeedProducts.php">

  <div class="content">
    Search products : <br><input type="text" id="productName" name="productName" placeholder="Search by SKU or name" class= "add_products" onkeyup="showResult(this.value)"><div id="livesearch" style="width:40%"></div><br>
    <?php
        $sql = "SELECT * FROM tbl_newstylefeed WHERE object_type = 'product'";

    ?>
      <div id="selected_products">
            <?php 
                $sql1 = "SELECT * FROM tbl_newstylefeed WHERE object_type = 'product'";
                $result1 = mysql_query($sql1);
                while($row = mysql_fetch_assoc($result1))
                {
                    $sql = "SELECT * FROM tbl_products WHERE productId = ".$row['object_id'];
                    $result = mysql_query($sql);
                    $single_product = mysql_fetch_assoc($result);
                    echo "<div id = 'div".$single_product['productId']."'><table class= 'selected_products_list table'><tr><input type='hidden' name='products_list[]' value='".$single_product['productId']."'><td style='text-align:center;width:30%'>SF00000".$single_product['productId']."</td><td style='text-align:center;width:50%'>".$single_product['productTitle']."</td><td style='text-align:center;width:20%'><a style='color:red' href=# onclick=\"remove_added_product('div".$single_product['productId']."')\">Remove</a></td></tr></table></div>";
                }
            ?>
        </div>
      
      <p id = "put_button"><input type='submit' disabled title='Add 5 items to enable this button!' value='Save' name='addproducts' id='add_products' /></p>
      
   
    </div>
</form> </center>
