<?php

class Categories {
	
		/*	Set session success/fail messages	*/
	
	function setMessage ($message) {
		$_SESSION['message'] = $message;
	}
	
	function addNewCategory($arrInfo) {
		$response = array();
		// Check if brand already exists
		$query = "select categoryId from tbl_categories where name='".$arrInfo['categoryName']."'  AND parentCategoryId = 0";
		$result = mysql_query($query);
		
		if(mysql_num_rows($result) > 0) {
			$this -> setMessage("Category already exists");
		}
		else {
			require_once("../classes/FileUploader.php");
        	$fileUploader = new FileUploader();
        	//var_dump($_FILES);
        	$successfileToUpload = TRUE;
        	$uploadOk = 1;
        	if(isset($_FILES['filetoUpload'])) {
				$fileToUpload = 'uploads/categoryPics/'.$_FILES['filetoUpload']['name'];
				//echo $fileToUpload;
				if (file_exists($fileToUpload)) {
    				$uploadOk = 0;
				}
				else
				{
					$imagePathToUpload = '../uploads/categoryPics/';
			
					$extensionsAllowed = array("jpg", "jpeg", "png", "gif", "bmp");
					
					$uploadResponse = $fileUploader -> uploadFile($_FILES['filetoUpload'], $imagePathToUpload, $extensionsAllowed, 10, 1000, 1000);
        	    	$successfileToUpload = $uploadResponse['success'];
        	    }
			/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				if($successfileToUpload && $uploadOk == 1)
				{
					$query = "insert into tbl_categories (name,categoryPhoto) values ('".$arrInfo['categoryName']."','".$fileToUpload."')";
					$result = mysql_query($query);
				}
	
	
				if($result) {
					if($uploadOk == 0)
					{
						$this -> setMessage("Change the name of the photo and try again!");
					}
					else
					{
						$this -> setMessage("Category has been added successfully");
					}
				} else {
					if($uploadOk == 0)
					{
						$this -> setMessage("Change the name of the photo and try again!");
					}
					else
					{
						$this -> setMessage("Failed to add Category");
					}
				}
			}
		}
		
		header("Location:../sf_admin_control-panel/addCategory.php");
		exit;
	}
	
	function editCategory( $arrInfo ) { 
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		require_once("../classes/FileUploader.php");
        $fileUploader = new FileUploader();
        //var_dump($_FILES);
        $successfileToUpload = TRUE;
        $uploadOk = 1;
        if(!empty($_FILES['filetoUpload']['name'])) {
			$fileToUpload = 'uploads/categoryPics/'.$_FILES['filetoUpload']['name'];
			//echo $fileToUpload;
			if (file_exists($fileToUpload)) {
    			$uploadOk = 0;
			}
			else
			{
				$imagePathToUpload = '../uploads/categoryPics/';
		
				$extensionsAllowed = array("jpg", "jpeg", "png", "gif", "bmp");
				
				$uploadResponse = $fileUploader -> uploadFile($_FILES['filetoUpload'], $imagePathToUpload, $extensionsAllowed, 10, 1000, 1000);
            	$successfileToUpload = $uploadResponse['success'];
            }
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			if($successfileToUpload && $uploadOk == 1)
			{
				$query = "update tbl_categories set name = '" . $arrInfo['name'] . "', categoryPhoto = '".$fileToUpload."' where categoryId=".$arrInfo['Id'];
				$result = mysql_query($query);
			}


			if($result) {
				if($uploadOk == 0)
				{
					$this -> setMessage("Change the name of the photo and try again!");
				}
				else
				{
					$this -> setMessage("Category has been updated successfully");
				}
			} else {
				if($uploadOk == 0)
				{
					$this -> setMessage("Change the name of the photo and try again!");
				}
				else
				{
					$this -> setMessage("Failed to update Category");
				}
			}
		}
		else
		{
			$query = "update tbl_categories set name = '" . $arrInfo['name'] . "' where categoryId=".$arrInfo['Id'];
			$result = mysql_query($query);
			if($result) {
				$this -> setMessage("Category has been updated successfully");
			}
			else
			{
				$this -> setMessage("Failed to update Category");
			}
		}
		
		header("Location:../sf_admin_control-panel/manageCategories.php");
		exit;
	}
	
	function deleteCategory( $intCategoryId ) {
		$sql = "select * from tbl_categories where categoryId =" . $intCategoryId;
		$result = mysql_query($sql);
		$row = mysql_fetch_assoc($result);
		$query = "delete from tbl_categories where categoryId = " . $intCategoryId;
	
		$result = mysql_query($query);
		if( result ) {
			$this -> setMessage("Category has been deleted successfully");
			unlink($baseURL.$row['categoryPhoto']);
		} else {
			$this -> setMessage("Failed to delete Category");
		}
	
		header("Location:../sf_admin_control-panel/manageCategories.php");
		exit;
	
	}
    
	function addNewSubcategory($arrInfo) {
		
		$response = array();
		// Check if brand already exists
		$query = "select categoryId from tbl_categories where name='".$arrInfo['subcategoryName']."' AND parentCategoryId = " . $arrInfo['parentCategory'];
		$result = mysql_query($query);
	
		if(mysql_num_rows($result) > 0) {
			$this -> setMessage("Subategory already exists");
		}
		else {
			require_once("../classes/FileUploader.php");
        	$fileUploader = new FileUploader();
        	//var_dump($_FILES);
        	$successfileToUpload = TRUE;
        	$uploadOk = 1;
        	if(isset($_FILES['filetoUpload'])) {
				$fileToUpload = '../uploads/categoryPics/'.$_FILES['filetoUpload']['name'];
				//echo $fileToUpload;
				if (file_exists($fileToUpload)) {
    				$uploadOk = 0;
				}
				else
				{
					$imagePathToUpload = '../uploads/categoryPics/';
			
					$extensionsAllowed = array("jpg", "jpeg", "png", "gif", "bmp");
					
					$uploadResponse = $fileUploader -> uploadFile($_FILES['filetoUpload'], $imagePathToUpload, $extensionsAllowed, 10, 1000, 1000);
        	    	$successfileToUpload = $uploadResponse['success'];
        	    }
			/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				if($successfileToUpload && $uploadOk == 1)
				{
					$query = "insert into tbl_categories (name,categoryPhoto, parentCategoryId) values ('".$arrInfo['subcategoryName']."','".$fileToUpload."', '".$arrInfo['parentCategory']."')";
					$result = mysql_query($query);
				}
	
	
				if($result) {
					if($uploadOk == 0)
					{
						$this -> setMessage("Change the name of the photo and try again!");
					}
					else
					{
						$this -> setMessage("Subcategory has been added successfully");
					}
				} else {
					if($uploadOk == 0)
					{
						$this -> setMessage("Change the name of the photo and try again!");
					}
					else
					{
						$this -> setMessage("Failed to add Subcategory");
					}
				}
			}
		}
	
		header("Location:../sf_admin_control-panel/addSubcategory.php");
		exit;
	}
    
    function updateSizeChart($arrInfo) {
        $query = "update tbl_categories set size='".$arrInfo['size']."' where categoryId='".$arrInfo['categoryId']."'";
        $result = mysql_query($query);
        
        if($result) {
            $this -> setMessage("Size chart has been set successfully");
        }
        else {
            $this -> setMessage("Failed to set size chart");
        }
        
        header("Location:../sf_admin_control-panel/manageCategories.php");
        exit;
    }
	
};

?>