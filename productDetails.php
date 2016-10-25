<!DOCTYPE html>
<html>	
	<head>
		<meta property="og:locale" content="en_US"/>
		<meta property="og:type" content="website"/>
		<meta property="og:title" content="Check out this amazing deal on StylFlip"/>
		<meta property="og:description" content="For fashionable women who have closets full and yet nothing to wear, StylFlip is a social platform to sell, shop and flaunt your branded pre-owned fashion. Founded in November 2015, we are a mobile app that hopes to revolutionize shopping by giving you access to thousands of trendy, high fashion and luxury brands at a fraction of the cost. Through our app you get access to an infinite and de-cluttered wardrobe filled with only the pieces you love."/>
		<meta property="og:image" content="http://www.underoneroof.in/stylflip/wp-content/uploads/2015/11/Untitled.png"/>
	</head>
	<body>
		<script>
			window.location = 'stylflip://app?screen=shop&productId=' + '<?php echo $_REQUEST['productId']; ?>';
			setTimeout(function() {
				var userAgent = navigator.userAgent || navigator.vendor || window.opera;
				if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
					// return 'iOS';
					window.location = 'https://itunes.apple.com/in/app/stylflip/id1072334629?mt=8';
				} 
				else if (userAgent.match(/Android/i)) {
					// return 'Android';
					window.location = 'https://play.google.com/store/apps/details?id=com.under1r.StylFlip';
				} 
				else {
					// return 'unknown';
					document.write('App is not supported on <b>' + userAgent + '</b>');
				}
			}, 1000);
		</script>
	</body>	
</html>