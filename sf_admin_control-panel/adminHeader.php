<?php
require_once "../classes/ConnectDB.php";

if (!isset($_SESSION['admin']) && !isset($_SESSION['role'])) {
	header("location:control-panel.php");
}

$role = $_SESSION['role'];

$arr = explode('/', $_SERVER['REQUEST_URI']);
$pageName = $arr[count($arr)-1];
$pageName = explode('?', $pageName);
$pageName = $pageName[0];

$isSuperAdmin = $role == 'Super Admin';
$isLogistics = $role == 'Logistics';
$isProductManagement = $role == 'User and Product Management';
$isManager = $role == 'Manager';
$isExecutive = $role == 'Executive';
$isViewer = $role == 'Viewer';

if($isProductManagement) {
	if($pageName == 'manageUsers.php' || $pageName == 'viewProducts.php' || $pageName == 'manageOrders.php' || $pageName == 'pushMessage.php') {
	}
	else {
		echo "You don't have access to view this page.";
		exit;
	}
}

if($isLogistics) {
	if($pageName != 'manageOrders.php') {
		echo "You don't have access to view this page.";
		exit;		
	}
}

if($isManager) {
	if($pageName == 'manageUsers.php' || $pageName == 'viewProducts.php' || $pageName == 'manageCategories.php' || $pageName == 'manageBrands.php' || $pageName == 'manageOrders.php' || $pageName == 'pushMessage.php' || $pageName == 'editUserDetails.php' || $pageName == 'manageReportedFeeds.php' || $pageName == 'signingInIssues.php' || $pageName == 'addBrand.php' || $pageName == 'editBrand.php' || $pageName == 'editCategory.php' || $pageName == 'editProductDetails.php' || $pageName == 'editOrder.php') {
	}
	else {
		echo "You don't have access to view this page.";
		exit;
	}
}
if($isExecutive) {
	if($pageName == 'manageUsers.php' || $pageName == 'viewProducts.php' || $pageName == 'manageBrands.php' || $pageName == 'manageOrders.php' || $pageName == 'addBrand.php' || $pageName == 'editBrand.php' || $pageName == 'editOrder.php') {
	}
	else {
		echo "You don't have access to view this page.";
		exit;
	}
}
if($isViewer) {
	if($pageName == 'manageUsers.php' || $pageName == 'viewProducts.php' || $pageName == 'manageOrders.php') {
	}
	else {
		echo "You don't have access to view this page.";
		exit;
	}
}
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>StyleFlip Admin Panel</title>
<link rel="stylesheet" type="text/css" href="css/css.css">
<script type="text/javascript" src="js/jquery-1.4.3.min.js"></script>
<script type="text/javascript" src="js/validation.js"></script>

<script type="text/javascript" src="./fancybox/jquery.fancybox-1.3.4.js"></script>
<link rel="stylesheet" type="text/css" href="./fancybox/jquery.fancybox-1.3.4.css" media="screen" />
<link rel="stylesheet" href="css/style.css" />

<script>
	$(document).ready(function() {
		$(document).scroll(function(e) {
			if($(document).scrollTop() > 83) {
				$('#admin').css({
					background: '#fff',
					position: 'fixed',
					border: '1px solid',
					padding: '5px'
				});
			}
			else {
				$('#admin').css({
					background: '',
					position: '',
					border: '',
					padding: ''
				});
			}
		});
	});
</script>

</head> 
<body>
	
	<table class="table" align="center">
		<tr>
			<td>
				<span class='style1'>Hi<b></b>! Welcome to StyleFlip Admin Panel!</span>
				<div align='right'>
					<a href='logoutProcess.php'>Log Out</a> 
				</div>
				<br><br>
			</td>
		</tr>
	</table>
	
	<table id="admin" style="top: 0; width: 100%;">
		<tr>
	  		<th>
	  			<div align="center">
	  				<?php
	  					if($isSuperAdmin) {
	  				?>
	  						<a href="manageUsers.php">Manage Users</a> | 
			  				<a href="manageBrands.php">Manage Brands</a> | 
			  				<a href="manageCategories.php">Manage Categories</a> | 
			  				<a href="viewProducts.php">View Products</a> |
							<a href="manageReportedFeeds.php">Reported Feeds</a> |
							<a href="manageOrders.php">Manage Orders</a> |
							<a href="manageCouponCodes.php">Manage Coupon Codes</a> |
							<a href="signingInIssues.php">Signing in Issues</a> |
							<a href="pushMessage.php">Push Notifications</a> |
							<a href="manageAdmins.php">Manage Admins</a> |
							<a href="stylefeedtab.php">Stylefeed</a>
	  				<?php		
	  					}
						
					if($isProductManagement) {
					?>		
							<a href="manageUsers.php">Manage Users</a> | 
			  				<a href="viewProducts.php">View Products</a> |
							<a href="manageOrders.php">Manage Orders</a> |
							<a href="pushMessage.php">Push Notifications</a>
					<?php		
						}
						
					if($isLogistics) {
					?>		
							<a href="manageOrders.php">Manage Orders</a>
					<?php
						}

					if($isManager) {
					?>		
							<a href="manageUsers.php">Manage Users</a> | 
			  				<a href="manageBrands.php">Manage Brands</a> | 
			  				<a href="manageCategories.php">Manage Categories</a> | 
			  				<a href="viewProducts.php">View Products</a> |
							<a href="manageReportedFeeds.php">Reported Feeds</a> |
							<a href="manageOrders.php">Manage Orders</a> |
							<a href="signingInIssues.php">Signing in Issues</a> |
							<a href="pushMessage.php">Push Notifications</a>
					<?php
						}		
	  				
					if($isExecutive) {
					?>		
							<a href="manageUsers.php">Manage Users</a> | 
			  				<a href="manageBrands.php">Manage Brands</a> | 
			  				<a href="viewProducts.php">View Products</a> |
							<a href="manageOrders.php">Manage Orders</a>
					<?php
						}		
					if($isViewer) {
					?>		
							<a href="manageUsers.php">Manage Users</a> |  
			  				<a href="viewProducts.php">View Products</a> |
							<a href="manageOrders.php">Manage Orders</a>
					<?php
						}		
	  				?>
	  			</div>
	    	</th>
		</tr>
		<tr>
			<td>
				<div align="center"></div>
			</td>
		</tr>
	</table>
	

	<table width="100%">
		<tr>
			<td>
	<?php 
		if(isset($_SESSION['message']) && $_SESSION['message'] != '') {
			$strLength = strlen($_SESSION['message']);
			$isSuccess = false;
			if (substr($_SESSION['message'], $strLength-12, $strLength) == 'successfully') {
				$isSuccess = true;	
			}
			
			if ($isSuccess) {
	?>			
				<div align="center" style="color: green"><?php echo $_SESSION['message']; ?></div>	
	<?php }
					else {
	?>
				<div align="center" style="color: red"><?php echo $_SESSION['message']; ?></div>
	<?php } ?>
	<?php
	$_SESSION['message'] = '';
	}
	?>	
			</td>
		</tr>
	</table>
