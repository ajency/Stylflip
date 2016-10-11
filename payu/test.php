<html>
<head>
<title>PayU Test</title>
<script>
function testAlert() {
    Ti.App.fireEvent('onPaymentProcess');
}
</script>
</head>
<body>

<?php
    function showAlert() {
        echo '<script>testAlert()</script>';
    }
    
    showAlert();
?>

</body>
</html>

    
    
