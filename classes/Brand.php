<?php

class Brand {
	
	function createResponse ($sql) {			//	for select query only
		mysql_query('SET CHARACTER SET utf8');
		$response = array();
		$response['data'] = array();
	
		$result = mysql_query($sql);
	
		if($result) {
			$response['success'] = TRUE;
	
			while($row = mysql_fetch_assoc($result)){
				array_push($response['data'], $row);
			}
		}
		else {
			$response['success'] = FALSE;
		}
	
		return $response;
	}
	
		/*	Set session success/fail messages	*/
	
	function setMessage ($message) {
		$_SESSION['message'] = $message;
	}
	
	function getAllBrands( $arr ) {
		if(true == empty($arr['pageIndex'])) {
			$index = 0; 
		}
		else {
			$index = $arr['pageIndex'];
		}
		
		if(true == empty($arr['pageLimit'])) {
	 		$limit = 20; 
		}
		else {
			$limit = $arr['pageLimit'];
		}
		
		$index = $index * $limit;
		mysql_query('SET CHARACTER SET utf8');		
		
		$query = "select brandId, name from tbl_brands order by name asc";
		echo json_encode($this -> createResponse($query));
	}


	function utf8_encode_all($dat)
	{ 
		if (is_string($dat)) return utf8_encode($dat); 
		if (!is_array($dat)) return $dat; 
		$ret = array(); 
		foreach($dat as $i=>$d) $ret[$i] = utf8_encode_all($d); 
		return $ret; 
	} 
	
	function addNewBrand($arrInfo) {
		$response = array();
		// Check if brand already exists
		$query = "select brandId from tbl_brands where name='".$arrInfo['brandName']."'";
		$result = mysql_query($query);
		
		if(mysql_num_rows($result) > 0) {
			$this -> setMessage("Brand already exists");
		}
		else {
			require_once("../classes/FileUploader.php");
        	$fileUploader = new FileUploader();
        	//var_dump($_FILES);
        	$successfileToUpload = TRUE;
        	$uploadOk = 1;
        	if(isset($_FILES['filetoUpload'])) {
				$fileToUpload = 'uploads/brandPics/'.$_FILES['filetoUpload']['name'];
				//echo $fileToUpload;
				if (file_exists($fileToUpload)) {
    				$uploadOk = 0;
				}
				else
				{
					$imagePathToUpload = '../uploads/brandPics/';
			
					$extensionsAllowed = array("jpg", "jpeg", "png", "gif", "bmp");
					
					$uploadResponse = $fileUploader -> uploadFile($_FILES['filetoUpload'], $imagePathToUpload, $extensionsAllowed, 10, 1000, 1000);
        	    	$successfileToUpload = $uploadResponse['success'];
        	    }
			/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				if($successfileToUpload && $uploadOk == 1)
				{
					$query = "insert into tbl_brands (name,brandPhoto) values ('".$arrInfo['brandName']."','".$fileToUpload."')";
					$result = mysql_query($query);
				}
	
	
				if($result) {
					if($uploadOk == 0)
					{
						$this -> setMessage("Change the name of the photo and try again!");
					}
					else
					{
						$this -> setMessage("Brand has been added successfully");
					}
				} else {
					if($uploadOk == 0)
					{
						$this -> setMessage("Change the name of the photo and try again!");
					}
					else
					{
						$this -> setMessage("Failed to add Brand");
					}
				}
			}
		}
		
		header("Location:../sf_admin_control-panel/addBrand.php");
		exit;
	}
	
	function editBrand( $arrInfo ) { 
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		require_once("../classes/FileUploader.php");
        $fileUploader = new FileUploader();
        //var_dump($_FILES);
        $successfileToUpload = TRUE;
        $uploadOk = 1;
        if(!empty($_FILES['filetoUpload']['name'])) {
			$fileToUpload = 'uploads/brandPics/'.$_FILES['filetoUpload']['name'];
			//echo $fileToUpload;
			if (file_exists($fileToUpload)) {
    			$uploadOk = 0;
			}
			else
			{
				$imagePathToUpload = '../uploads/brandPics/';
		
				$extensionsAllowed = array("jpg", "jpeg", "png", "gif", "bmp");
				
				$uploadResponse = $fileUploader -> uploadFile($_FILES['filetoUpload'], $imagePathToUpload, $extensionsAllowed, 10, 1000, 1000);
            	$successfileToUpload = $uploadResponse['success'];
            }
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			if($successfileToUpload && $uploadOk == 1)
			{
				$query = "update tbl_brands set name = '" . $arrInfo['name'] . "', brandPhoto = '".$fileToUpload."' where brandId=".$arrInfo['Id'];
				$result = mysql_query($query);
			}


			if($result) {
				if($uploadOk == 0)
				{
					$this -> setMessage("Change the name of the photo and try again!");
				}
				else
				{
					$this -> setMessage("Brand has been updated successfully");
				}
			} else {
				if($uploadOk == 0)
				{
					$this -> setMessage("Change the name of the photo and try again!");
				}
				else
				{
					$this -> setMessage("Failed to update Brand");
				}
			}
		}
		else
		{
			$query = "update tbl_brands set name = '" . $arrInfo['name'] . "' where brandId=".$arrInfo['Id'];
			$result = mysql_query($query);
			if($result) {
				$this -> setMessage("Brand has been updated successfully");
			}
			else
			{
				$this -> setMessage("Failed to update Brand");
			}
		}
		header("Location:../sf_admin_control-panel/manageBrands.php");
		exit;
	}
	
	function deleteBrand( $intBrandId ) {
		$sql = "select * from tbl_brands where brandId =" . $intBrandId;
		$result = mysql_query($sql);
		$row = mysql_fetch_assoc($result);
		$query = "delete from tbl_brands where brandId = " . $intBrandId;
	
		$result = mysql_query($query);
	
		if( $result ) {
			$this -> setMessage("Brand has been deleted successfully");
			unlink($baseURL.$row['brandPhoto']);
		} else {
			$this -> setMessage("Failed to delete brand");
		}
	
		header("Location:../sf_admin_control-panel/manageBrands.php");
		exit;
	}
	
};
?>