<?php
include("../classes/ConnectDB.php");

$username = mysql_real_escape_string($_REQUEST['username']);
$password = mysql_real_escape_string($_REQUEST['password']);

$sql = "select * from tbl_admin where username='".$username."' and password='".$password."'";
$result = mysql_query($sql);

if(mysql_num_rows($result) > 0) {
	$adminDetails = mysql_fetch_assoc($result);
	$_SESSION['admin'] = "admin";
	$_SESSION['role'] = $adminDetails['role'];
	if($adminDetails['role'] == 'Logistics') {
		header("Location: manageOrders.php");
	}
	else {
		header("Location: manageUsers.php");
	}
}
else{
	header("Location: control-panel.php?login=failed");
}

?>
