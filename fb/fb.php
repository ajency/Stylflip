<?php
	if(isset($_REQUEST['post_id'])) {
		header("Location:fb-success.php");
	}
	else {
		header("Location:fb-cancel.php");
	}
?>