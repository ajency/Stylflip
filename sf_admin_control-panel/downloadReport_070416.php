<?php
	require_once "../classes/ConnectDB.php";
	
	/*
	 * Export users data
	 */
	if($_REQUEST['exportType'] == 'usersData') {
		$query = "select * from tbl_users order by userId desc";
		$result = mysql_query($query);
		
		$data = array();
		array_push($data, array('Sr no', 'Featured', 'Username', 'First name', 'Last name', 'Email', 'Address 1', 'City 1', 'State 1', 'Post code 1', 'Contact 1', 'Address 2', 'City 2', 'State 2', 'Post code 2', 'Contact 2', 'Address 3', 'City 2', 'State 2', 'Post code 3', 'Contact 3', 'Bank name', 'Account no.', 'IFSC', 'Account name', 'Account type', 'PAN', 'Tops & dresses', 'Jeans & bottoms', 'Footwear', 'Status'));
		array_push($data, array('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''));
		
		while($row = mysql_fetch_assoc($result)) {
			$userId = $row['userId'];
			$name = $row['firstName'] .  " " . $row['lastName'];
			$DOB = $row['dateOfBirth'];
			$address = $row['address'];	
			$mobileNumber = $row['mobileNumber'];	
			$email = $row['email'];	
			$status = $row['isActive'] == 1 ? 'Active' : 'Banned';	
	
			$addresses = array();
			$addresses['address1'] = '';
			$addresses['city1'] = '';
			$addresses['state1'] = '';
			$addresses['postCode1'] = '';
			$addresses['contact1'] = '';
			$addresses['address2'] = '';
			$addresses['city2'] = '';
			$addresses['state2'] = '';
			$addresses['postCode2'] = '';
			$addresses['contact2'] = '';
			$addresses['address3'] = '';
			$addresses['city3'] = '';
			$addresses['state3'] = '';
			$addresses['postCode3'] = '';
			$addresses['contact3'] = '';
			
			$query = "select * from tbl_user_addresses where userId='". $userId ."' Order By addressType";
			$addressesResult = mysql_query($query);
			
	        if($addressesResult) {
	        	$i = 1;
				while($addressesRow = mysql_fetch_assoc($addressesResult)) {
			 		$addresses['address'.$i] = '' . $addressesRow['addressTitle'] . ': ' . $addressesRow['addressLine1'] . ', ' . $addressesRow['addressLine2'] . ', ' . $addressesRow['landmark'];
					$addresses['city'.$i] = $addressesRow['city'];
					$addresses['state'.$i] = $addressesRow['state'];
					$addresses['postCode'.$i] = $addressesRow['postCode'];
					$addresses['contact'.$i] = $addressesRow['phoneNumber'];
					$i++;
				}
			}
					
			$query = "select * from tbl_user_kyc_details where userId='". $userId ."'";
			$kycResult = mysql_query($query);
			
			$KYCDetails = array();
		
	        if($kycResult) {
	        	$KYCDetails = mysql_fetch_assoc($kycResult);
			}
			
			$sr=$sr+1;
			
			// $data = $sr.'|'.$name.'|'.$addresses.'|'.$KYCDetails.'|'.$sizes.'|'.$status.'\n';
			array_push($data, array(
				$sr, 
				$row['isFeatured'] == 1 ? 'Yes' : 'No',
				$row['username'], 
				$row['firstName'], 
				$row['lastName'], 
				$row['email'], 
				$addresses['address1'], 
				$addresses['city1'], 
				$addresses['state1'], 
				$addresses['postCode1'], 
				$addresses['contact1'], 
				$addresses['address2'], 
				$addresses['city2'], 
				$addresses['state2'],
				$addresses['postCode2'], 
				$addresses['contact2'], 
				$addresses['address3'], 
				$addresses['city3'], 
				$addresses['state3'],
				$addresses['postCode3'], 
				$addresses['contact3'], 
				$KYCDetails['bankName'],
				$KYCDetails['accountNumber'],
				$KYCDetails['ifscCode'],
				$KYCDetails['accountName'],
				$KYCDetails['accountType'],
				$KYCDetails['panNumber'],
				$row['topsAndDresses'],
				$row['jeansAndBottoms'],
				$row['footwear'],
				$status
			));
			array_push($data, array('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''));
		}
		
		$fp = fopen('users_data.csv', 'w');
		foreach ($data as $fields) {
		    fputcsv($fp, $fields);
		}
		fclose($fp);
		header('Location: users_data.csv');
	}

	
	/*
	 * 	Common functions
	 */ 
	function getCalculatedPrice($sellingPrice) {
		if($sellingPrice == 0) {
			return '₹ 0';
		}
		$isShippingToBeAdded = $sellingPrice < 2000;
		$sellingPrice = $sellingPrice + (($sellingPrice * 20 /* StylFlip commision  */) / 100);
		if($isShippingToBeAdded) {
			$sellingPrice = $sellingPrice + 120;	//	120 is the shipping fees
		}
		return ceil($sellingPrice);
	}; 
	
	function getShippingAndHandlingFees($sellingPrice) {
		if($sellingPrice == 0) {
			return 0;
		}
		if($sellingPrice < 2000) {
			return 120;
		}
		return 0;
	};
	
	

	/*
	 * Export products data
	 */
	if($_REQUEST['exportType'] == 'productsData') {
		$query = "select p.*, b.brandId, b.name as brand, u.firstName, u.lastName, u.username from tbl_products p, tbl_users u, tbl_brands b where b.brandId = p.brandId and u.userId = p.userId order by p.productId desc";
		$result = mysql_query($query);
		
		$data = array();
		array_push($data, array('Sr no', 'SKU', 'Title', 'Photos', 'Description', 'Brand', 'Size', 'Condition', 'Pickup address', 'City', 'State', 'Post code', 'Contact number', 'Asking price', 'SF comission', 'S & H', 'Display price', 'To be donated', 'Added by', 'Approved on', 'Status'));
		array_push($data, array('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''));
		
		$sr = 1;
		
		while($row = mysql_fetch_assoc($result)) {
			$photo = $row['primaryPhoto'];
			$username = $row['firstName'].' '.$row['lastName'];
			
			if($username == ' ') {
				$username = $row['username'];
			}
			
			if($username == '') {
				$username = 'View details';
			}
			
			if($row['isPurchased'] == 1) {
				$status = 'Sold';
			}
			else {
				$sql = "select p.photo from tbl_product_images p where p.productId = $productId";
				$result1 = mysql_query($sql);
				
				if($row['isApproved'] == 0) {
					$status = 'Approval needed';
				
					$sql = "select isActive, userId from tbl_users where userId = '" . $row['userId'] . "'";
					$result1 = mysql_query($sql);
					while($row1 = mysql_fetch_assoc($result1)) {
						if($row1['isActive'] == 0) {
							$status = $status . '<br/>(User is banned)';
						}
					}
					
					// if($status != 'User is banned') {
						$sql = "select userId from tbl_user_kyc_details WHERE userId = '" . $row['userId'] . "'";
						if(mysql_num_rows(mysql_query($sql)) == 0) {
							$status = 'Pending KYC';
						}
					//}
				}
				else {
					$status = 'On sale';
				}
				
				$pickupAddress = array();
				
				$query = "select * from tbl_user_addresses where userId='". $row['userId'] ."' and addressTitle='".$row['pickupFrom']."'";
				$addressesResult = mysql_query($query);
				$pickupAddress = mysql_fetch_assoc($addressesResult);
				
				array_push($data, array(
					$sr, 
					'SF00000'.$row['productId'], 
					$row['productTitle'], 
					'', 
					$row['productDescription'], 
					$row['brand'],
					$row['size'], 
					$row['condition'], 
					$pickupAddress['addressTitle'] . ': ' . $pickupAddress['addressLine1'] . ', ' . $pickupAddress['addressLine2'] . ', ' . $pickupAddress['landmark'], 
					$pickupAddress['city'],
					$pickupAddress['state'],
					$pickupAddress['postCode'],
					$pickupAddress['phoneNumber'],
					$row['sellingPrice'],
					ceil($row['sellingPrice'] * 20) / 100,
					getShippingAndHandlingFees($row['sellingPrice']),
					getCalculatedPrice($row['sellingPrice']),
					$row['isToBeDonated'] == 1 ? 'Yes' : 'No',
					$username,
					$row['approvalDate'],
					$status
				));
				array_push($data, array('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''));
			}
			
			$sr = $sr + 1;
		}
		
		
		$fp = fopen('products_data.csv', 'w');
		foreach ($data as $fields) {
		    fputcsv($fp, $fields);
		}
		fclose($fp);
		header('Location: products_data.csv');
	}


	/*
	 * Export orders data
	 */
	if($_REQUEST['exportType'] == 'ordersData') {
		$query = "select o.*, u.userId as sellerId, u.firstName as sellerFirstName, u.lastName as sellerLastName, p.productTitle, p.isToBeDonated, p.pickupFrom, p.sellingPrice from tbl_orders o, tbl_products p, tbl_users u where o.productId = p.productId and p.userId = u.userId order by o.orderId desc";
		$result = mysql_query($query);
		
		$data = array();
		array_push($data, array('Sr no', 'Order no', 'SKU', 'Product title', 'Transaction ID', 'PayU ID', 'Buyer name', 'Buyer address', 'Buyer city', 'Buyer state', 'Buyer post code', 'Buyer contact no', 'Seller name', 'Seller pickup address', 'Seller pickup city', 'Seller pickup state', 'Seller pickup post code', 'Seller contact no', 'Asking price', 'SF comission', 'S & H', 'Display price', 'Coupon used', 'Final amount paid', 'Status', 'Reverse AWB (Pick up from seller)', 'Reverse Courier Name', 'Forward AWB (to buyer)', 'Forward Courier Name'));
		array_push($data, array('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''));
		
		$sr = 1;
		
		while($row = mysql_fetch_assoc($result)) {
			$pickupAddress = '';
			$sellerContactNo = '';
			
			$query = "select * from tbl_user_addresses where userId='". $row['sellerId'] ."' and addressTitle='".$row['pickupFrom']."'";
			$addressesResult = mysql_query($query);
			$pickupAddress = mysql_fetch_assoc($addressesResult);
			
			array_push($data, array(
				$sr, 
				$row['orderId'],
				'SF00000'.$row['productId'],
				$row['productTitle'],
				''.$row['transactionId'],
				$row['payUTransactionId'],
				$row['firstName'] .  " " . $row['lastName'],
				$row['addressLine1'] . ", " . $row['addressLine2'] . ", " . $row['landmark'],
				$row['city'],
				$row['state'],
				$row['postCode'],
				$row['phoneNumber'],
				$row['sellerFirstName'] .  " " . $row['sellerLastName'],
				$pickupAddress['addressTitle']. ': ' . $pickupAddress['addressLine1'] . ', ' . $pickupAddress['addressLine2'] . ', ' . $pickupAddress['landmark'],
				$pickupAddress['city'],
				$pickupAddress['state'],
				$pickupAddress['postCode'],
				$pickupAddress['phoneNumber'],
				$row['sellingPrice'],
				ceil($row['sellingPrice'] * 20) / 100,
				getShippingAndHandlingFees($row['sellingPrice']),
				getCalculatedPrice($row['sellingPrice']),
				$row['couponCodeUsed'],
				$row['amount'],
				$row['status'],
				$row['AWB'],
				$row['courier'],
				$row['AWB'],
				$row['courier']
			));
			array_push($data, array('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''));
			$sr=$sr+1;
		}
		
		$fp = fopen('orders_data.csv', 'w');
		foreach ($data as $fields) {
		    fputcsv($fp, $fields);
		}
		fclose($fp);
		header('Location: orders_data.csv');
	}

	
	mysql_close($con);  
?>