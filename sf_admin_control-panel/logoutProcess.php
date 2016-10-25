<?php
session_start();
unset($_SESSION['admin']);
unset($_SESSION['role']);
header("Location: ../sf_admin_control-panel/control-panel.php");
exit;
?>
