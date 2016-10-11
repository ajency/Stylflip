<?php
	include("../classes/ConnectDB.php");
?>

<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>StyleFlip Admin Panel</title>
<link rel="stylesheet" type="text/css" href="css/css.css">
<script type="text/javascript" src="js/jquery-1.4.3.min.js"></script>
<script type="text/javascript">
function validateLogin(){
	if(document.login.username.value==""){
		alert("Please enter username");
		document.login.username.focus();
		return false;
	}

	if(document.login.password.value==""){
		alert("Please enter password");
		document.login.password.focus();
		return false;
	}
	
	return true;
}
</script>
</head> 
<body>
<br />
<br />
<br />

<center>
	
<form name="login" action="loginProcess.php" method="post">
	
	<table class="table_add">

		<?php
			if(@mysqli_real_escape_string($con,$_GET['login']) == "failed"){
		?>
		<tr>
			<td align="center" colspan="2"><font color="red">Invalid username or password</font></td>
		</tr>
		<tr>
			<td align="center" colspan="2">&nbsp;</td>
		</tr>		
		<?php	
			}
			else if(@mysqli_real_escape_string($con,$_GET['logout']) == "success"){
		?>
		<tr>
			<td align="center" colspan="2"><font color="green">You are successfully logged out</font></td>
		</tr>
		<tr>
			<td align="center" colspan="2">&nbsp;</td>
		</tr>		
		<?php	
			}
		?>					
			
		<tr>
			<td align="right">Username :</td>
			<td><input type="text" name="username" id="username" /></td>
		</tr>	
		
		<tr>
			<td align="right">Password :</td>
			<td><input type="password" name="password" id="password" /></td>
		</tr>
		
		<tr>
			<td colspan="2" class="td_wall_view_button"><input type="submit" name="login" id="login" value="Login" onclick="return validateLogin();" /></td>
		</tr>		
			
	</table>

</form>	
</center>	

</body>
</html>
