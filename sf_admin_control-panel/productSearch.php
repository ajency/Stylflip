<?php

require_once "../classes/ConnectDB.php";
//get the q parameter from URL
$q=$_GET["q"];

//lookup all links from the xml file if length of q>0
if (strlen($q)>0) {
    $sql = "select * from tbl_products where productId LIKE '%".$q."%' OR productTitle LIKE '%".$q."%'";
    $result = mysql_query($sql);
    
    $hint = "<table>";
    while($row = mysql_fetch_assoc($result))
    {
        $productTitle = $row['productTitle'];
        $productId = $row['productId'];
        $function_call = 'onclick = "add_product_to_list(\''.$productTitle.'\',\''.$productId.'\')"';
        $hint = $hint."<tr><td><span style ='color:blue; align:left'>SF00000".$productId."</span></td> <td>".$row['productTitle']."</td> <td><a href='#' ".$function_call.">add product</a></td></tr>";
    }
    $hint .= "</table>";
}

// Set output to "no suggestion" if no hint was found
// or to the correct values
if ($hint=="") {
  $response="no suggestion";
} else {
  $response=$hint;
}

//output the response
echo $response;
?>