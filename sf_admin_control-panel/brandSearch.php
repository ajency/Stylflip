<?php

require_once "../classes/ConnectDB.php";
//get the q parameter from URL
$q=$_GET["q"];

//lookup all links from the xml file if length of q>0
if (strlen($q)>0) {
    $sql = "select * from tbl_brands where name LIKE '%".$q."%'";
    $result = mysql_query($sql);
    
    $hint = "";
    while($row = mysql_fetch_assoc($result))
    {
        $name = $row['name'];
        $brandId = $row['brandId'];
        $function_call = 'onclick = "add_brand_to_list(\''.$name.'\',\''.$brandId.'\')"';
        $hint = $hint."<tr style='border: 5px solid transparent;''><td style='width:50%'>".$row['name']."&nbsp;&nbsp;</td><td style='width:50%' dir='rtl'> <a style='color:green' href='#' ".$function_call.">Add brand</a></td></tr>";
    }
}

// Set output to "no suggestion" if no hint was found
// or to the correct values
if ($hint=="") {
  $response="no suggestion";
} else {
  $response="<div id='table-wrapper'><div id='table-scroll'><table  style='border: 5px solid transparent;width:100%'><thead><tr><th style='width:50%'><span class='text'>Brand Name</span></th><th style='width:50%' dir='rtl'><span class='text'></span></th></tr></thead>".$hint."</table></div></div>";
}

//output the response
echo $response;
//<thead><tr><th style='width:50%'><span class='text'>Brand Name</span></th><th style='width:50%' dir='rtl'><span class='text'>Add Brand</span></th></tr></thead>
?>