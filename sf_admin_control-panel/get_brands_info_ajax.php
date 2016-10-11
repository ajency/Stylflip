<?php 
require_once "../classes/ConnectDB.php";
	$brandId = $_REQUEST['brandId'];
	$sql = "select * from tbl_brands WHERE brandId = ".$brandId;
	$result1 = mysql_query($sql);
	echo json_encode(mysql_fetch_assoc($result1));
	