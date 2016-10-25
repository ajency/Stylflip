<?php

require_once "../classes/ConnectDB.php";
//get the q parameter from URL
$q=$_GET["q"];

//lookup all links from the xml file if length of q>0
if (strlen($q)>0) {
    $sql = "select * from tbl_products where productId LIKE '%".$q."%' OR productTitle LIKE '%".$q."%'";
    $result = mysql_query($sql);
    
    $hint = "";
    while($row = mysql_fetch_assoc($result))
    {
        $productTitle = $row['productTitle'];
        $productId = $row['productId'];
        $function_call = 'onclick = "add_product_to_list(\''.$productTitle.'\',\''.$productId.'\')"';
        $hint = $hint."<tr ><td style='width:25%'><span style ='color:blue; align:left'>SF00000".$productId."</span>&nbsp;&nbsp;</td> <td style='width:55%'>".$row['productTitle']."&nbsp;&nbsp;</td> <td style='width:20%' dir='rtl'><a style='color:green' href='#' ".$function_call.">Add product</a></td></tr>";
    }
}

// Set output to "no suggestion" if no hint was found
// or to the correct values
if ($hint=="") {
  $response="no suggestion";
} else {
  $response="<div id='table-wrapper'><div id='table-scroll'><table style='width:100%'><thead><tr><th style='width:25%'><span class='text'>SKU code</span></th><th style='width:55%'><span class='text'>Title</span></th><th  style='width:20%'><span class='text'></span></th></tr></thead>".$hint."</table></div></div>";
}

//output the response
echo $response;
//<thead><tr><th style='width:30%'><span class='text'>SKU code</span></th><th style='width:50%'><span class='text'>Title</span></th><th  style='width:20%'><span class='text'>Add Product</span></th></tr></thead>
?>