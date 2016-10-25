<?php

require_once "../classes/ConnectDB.php";
//get the q parameter from URL
$q=$_GET["q"];

//lookup all links from the xml file if length of q>0
if (strlen($q)>0) {
    $sql = "select * from tbl_users where username LIKE '%".$q."%' OR firstName LIKE '%".$q."%' OR lastName LIKE '%".$q."%'";
    $result = mysql_query($sql);
    
    $hint = "";
    while($row = mysql_fetch_assoc($result))
    {
        $username = $row['username'];
        $userId = $row['userId'];
        $function_call = 'onclick = "add_user_to_list(\''.$username.'\',\''.$userId.'\')"';
        $hint = $hint."<tr><td style='width:30%'>".$row['username']."&nbsp;&nbsp;</td><td style='width:55%'>".$row['firstName']." ".$row['lastName']."&nbsp;&nbsp;</td><td style='width:15%' dir='rtl'> <a style='color:green' href='#' ".$function_call.">Add user</a></td></tr>";
    }
}

// Set output to "no suggestion" if no hint was found
// or to the correct values
if ($hint=="") {
  $response="no suggestion";
} else {
  $response= "<div id='table-wrapper'><div id='table-scroll'><table style='width:100%'><thead><tr><th style='width:30%'><span class='text'>Username</span></th><th style='width:55%'><span class='text'>Full name</span></th><th style='width:15%'><span class='text'></span></th></tr></thead>".$hint."</table></div></div>";
}

//output the response
echo $response;
//<thead><tr><th style='width:30%'><span class='text'>Username</span></th><th style='width:55%'><span class='text'>Full name</span></th><th style='width:15%'><span class='text'>Add User</span></th></tr></thead>
?>