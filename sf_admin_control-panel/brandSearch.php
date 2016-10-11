<?php

require_once "../classes/ConnectDB.php";
//get the q parameter from URL
$q=$_GET["q"];

//lookup all links from the xml file if length of q>0
if (strlen($q)>0) {
    $sql = "select * from tbl_brands where name LIKE '%".$q."%'";
    $result = mysql_query($sql);
    
    $hint = "<table>";
    while($row = mysql_fetch_assoc($result))
    {
        $name = $row['name'];
        $brandId = $row['brandId'];
        $function_call = 'onclick = "add_brand_to_list(\''.$name.'\',\''.$brandId.'\')"';
        $hint = $hint."<tr><td>".$row['name']."</td><td> <a href='#' ".$function_call.">add brand</a></td></tr>";
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