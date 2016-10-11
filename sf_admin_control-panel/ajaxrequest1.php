<?php
		require_once "../classes/ConnectDB.php";
		
			
			
			$query = "select * from tbl_user_addresses where userId='".$_POST['buyerid']."'";
			$addressesResult = mysql_query($query);
			$row1 = mysql_fetch_assoc($addressesResult);
			//PRINT_R($addressesResult);
			echo json_encode($row1);
	        
		?>