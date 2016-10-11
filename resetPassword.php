<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>StyleFlip Reset Password</title>
		<link rel="stylesheet" type="text/css" href="sf_admin_control-panel/css/css.css">
		<link rel="stylesheet" href="sf_admin_control-panel/css/style.css" />
		<script type="text/javascript" src="sf_admin_control-panel/js/validation.js"></script>
	</head>
	<body>
		
		<?php
			if(isset($_REQUEST['success'])) {
				if($_REQUEST['success'] == 1) {
		?>
					<div align="center" style="margin-top: 50px; color: green"><?php echo $_REQUEST['message']; ?></div>
				<?php
						}
						else {
				?>
					<div align="center" style="margin-top: 50px; color: red"><?php echo $_REQUEST['message']; ?></div>
				<?php
						}
			}
			else {
		?>
		
		<form name="resetPasswordForm" method="post" action="api/user.php?action=resetPassword&code=<?php echo $_REQUEST['code']; ?>">
			<table class="table">
				<tr>
					<td align="center" colspan="2">
					</td>
				</tr>
				
				<tr>
					<td align="center" colspan="2">
						<div align="center"><h3>Reset Password</h3></div>
					</td>
				</tr>
				
				<tr>
					<td align="center" colspan="2">
					</td>
				</tr>
				
				<tr>
					<td align="right">
						<div align="right">
							New password :
						</div>
					</td>
					<td>
						<input type="password" name="password">
					</td>
				</tr>
				
				<tr>
					<td align="right">
						<div align="right">
							Confirm password :
						</div>
					</td>
					<td>
						<input type="password" name="confirmPassword">
					</td>
				</tr>

				<tr>
					<td align="right">&nbsp;</td>
					<td>&nbsp;</td>
				</tr>

				<tr>
					<td align="right">
						<div align="right"></div>
					</td>
					<td>
						<input type="submit" value="Submit" name="resetPassword" id="resetPassword" onclick="return validateResetPassword();" />
					</td>
				</tr>

			</table>

		</form>
		
		<?php
			}
		?>

	</body>
</html>