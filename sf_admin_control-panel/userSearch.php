<?php

require_once "../classes/ConnectDB.php";
//get the q parameter from URL
$q=$_GET["q"];

//lookup all links from the xml file if length of q>0
if (strlen($q)>0) {
    $sql = "select * from tbl_users where username LIKE '%".$q."%' OR firstName LIKE '%".$q."%' OR lastName LIKE '%".$q."%'";
    $result = mysql_query($sql);
    
    $hint = "<table>";
    while($row = mysql_fetch_assoc($result))
    {
        $username = $row['username'];
        $userId = $row['userId'];
        $function_call = 'onclick = "add_user_to_list(\''.$username.'\',\''.$userId.'\')"';
        $hint = $hint."<tr><td>".$row['username']."</td><td> <a href='#' ".$function_call.">add user</a></td></tr>";
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