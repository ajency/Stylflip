<?php

class Size {
	
		/*	Set session success/fail messages	*/
	
	function setMessage ($message) {
		$_SESSION['message'] = $message;
	}
	
	function getSizes() {
		$response = array();
		$response['success'] = false;
		
		$query = "select * from tbl_sizes";
		$result = mysql_query($query);
		
		if(mysql_num_rows($result) > 0) {
			$response['success'] = true;
			while($row = mysql_fetch_assoc($result)) {				
				$response['data'][] = $row;
			}
		}
		
		echo json_encode($response);
	}
	
	function updateSizes( $arrInfo ) { 
		unset($arrInfo['action']);
		
		foreach( $arrInfo as $key => $arrSize ) {
			$arrTemp = explode('_', $key);
			$query = "update tbl_sizes set size1 = '" . $arrSize['size1'] . "' where country = '" . $arrTemp[0] . "' AND type = '" . $arrTemp[1] . "'";
			
			$result = mysql_query($query);
			
			if(!$result) {
				$this -> setMessage("Failed to update Size");	
				break;			
			}
		}
		
		$this -> setMessage("Sizes updated successfully");
		header("Location:../sf_admin_control-panel/addSizes.php");
		exit;
	}
	
};

?>