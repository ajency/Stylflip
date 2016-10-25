<?php 
require_once "../classes/ConnectDB.php";
	$parent = $_REQUEST['parent'];
	$caller = $_REQUEST['caller'];
	//echo $parent;
	//echo $caller;
	if($caller == 'dropdown')
	{
		$sql = "select * from tbl_categories WHERE parentCategoryId = ".$parent;
		$result1 = mysql_query($sql);
		$sub = array();
		while($row1 = mysql_fetch_assoc($result1))
		{
			array_push($sub,$row1);
		}
		echo json_encode($sub);
	}
	else
	{
		$sql = "select * from tbl_categories WHERE categoryId = ".$parent;
		$result2 = mysql_query($sql);
		//var_dump(mysql_fetch_assoc($result2));
		echo json_encode(mysql_fetch_assoc($result2));
	}