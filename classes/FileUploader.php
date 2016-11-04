<?php

	/*
	 * 	Responsible for uploading files
	 */

	class FileUploader {
		
		/*	Delete file from file system	*/
		
		function deleteFile ($path) {
			unlink($path);
		}
		
		
		/*	Get extension of a file	*/
		
		function getExtension($str) {
	         $i = strrpos($str,".");
	         if (!$i) { return ""; }
	         $l = strlen($str) - $i;
	         $ext = substr($str,$i+1,$l);
	         return $ext;
		}
		
		
		/*	File upload */
		
		function uploadFile ($objFile, $filePath, $extensionsAllowed, $fileSizeAllowed, $imageWidth, $imageHeight) {
			$response = array();
			
			$errors = 0;
			define ("MAX_SIZE", $fileSizeAllowed);	//	b
			 
			$isValidFile = $objFile["name"];
			$uploadedfile = $objFile['tmp_name'];
			 
		 	if ($isValidFile) {
		 		$filename = stripslashes($objFile['name']);
		  		$extension = $this -> getExtension($filename);
		 		$extension = strtolower($extension);
				
		 		if (!in_array($extension, $extensionsAllowed)) {
		 			$response['success'] = FALSE;
					$response['message'] = "Please check file type. Only ".implode(", ", $extensionsAllowed)." supported.";	
		 		}
		 		else {
		 			if($extension == "rtf" || $extension == "doc" || $extension == "docx" || $extension == "pdf") {
		 				$filename = $filePath . $filename;
		 				if(move_uploaded_file($uploadedfile, $filename)) {
		 					$response['success'] = TRUE;
							$response['message'] = "Upload successful";
		 				}
						else {
							$response['success'] = FALSE;
							$response['message'] = "Failed to upload";
						}
		 			}
					else {
						$size = filesize($objFile['tmp_name']);
						
						if ($size > MAX_SIZE*1024*1024) {
							//return false;
						}
						
						if ($extension=="jpg" || $extension=="jpeg" || $extension=="bmp") {
							$uploadedfile = $objFile['tmp_name'];
							$src = imagecreatefromjpeg($uploadedfile);
						}
						else if ($extension=="png") {
							$uploadedfile = $objFile['tmp_name'];
							$src = imagecreatefrompng($uploadedfile);
						}
						else {
							$src = imagecreatefromgif($uploadedfile);
						}
						
						list($width, $height) = getimagesize($uploadedfile);
						
						if($width > $height){
							if($width <= $imageWidth){
								$newwidth = $width;
							}								
							else if($width > $imageWidth){
								$newwidth = $imageWidth;
							}
							
							$newheight = ($height*$newwidth)/$width;		  	    							
						}
						else{
							if($height <= $imageHeight){
								$newheight = $height;
							}
							else if($height > $imageHeight){
								$newheight = $imageHeight;
							}
							
							$newwidth = ($width*$newheight)/$height;	  	   									
						}
						
						$tmp = imagecreatetruecolor($newwidth, $newheight);
						
						imagecopyresampled($tmp, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
						
						$filename = $filePath . $filename;
						
						$result = imagejpeg($tmp, $filename, 100);
												
						imagedestroy($src);
						imagedestroy($tmp);
						
						if($result) {
							$response['success'] = TRUE;
							$response['message'] = "Successful";
						}
						else {
							$response['success'] = FALSE;
							$response['message'] = "Failed to upload";
						}					
					}
				}
			}
			else {
				$response['success'] = FALSE;
				$response['message'] = "Invalid file";
			}
			
			return $response;
		}
		
	};
?>
