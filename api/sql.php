<?php
    
    require_once("../classes/ConnectDB.php");
    
    /*
    $query = "CREATE TABLE IF NOT EXISTS `tbl_notifications` (`notificationId` int(255) NOT NULL, `taggingUserId` int(255) NOT NULL, `taggingUsername` varchar(255) NOT NULL, `followerUsername` varchar(255) NOT NULL, `productId` int(255) NOT NULL, `feedId` int(255) NOT NULL, `productTitle` varchar(255) NOT NULL, `feedTitle` varchar(255) NOT NULL, `customerName` varchar(255) NOT NULL, `type` varchar(255) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=latin1;";
    $result = mysql_query($query);
    
    echo $result . "\n";
    
    
    $query = "ALTER TABLE `tbl_notifications` ADD PRIMARY KEY (`notificationId`);";
    $result = mysql_query($query);
    
    echo $result . "\n";
    
    
    $query = "ALTER TABLE `tbl_notifications`MODIFY `notificationId` int(255) NOT NULL AUTO_INCREMENT;";
    $result = mysql_query($query);
    
    echo $result . "\n";
     
    
    $query = "ALTER TABLE `tbl_users` ADD `deviceToken` MEDIUMTEXT NOT NULL, ADD `isLoggedIn` INT(1) NOT NULL;";
    $result = mysql_query($query);
     
     
     $query = "ALTER TABLE `tbl_users` ADD `osname` varchar(255) NOT NULL;";
     $result = mysql_query($query);
    
    
    $q = mysql_query('DESCRIBE tbl_users');
    while($row = mysql_fetch_array($q)) {
        echo "{$row['Field']} - {$row['Type']}\n";
    }
    
    
    $query = "select deviceToken, osname from tbl_users";
    while($row = mysql_fetch_assoc(mysql_query($query))) {
        echo "{$row['deviceToken']} - {$row['osname']}\n";
    }
    
    $query = "ALTER TABLE `tbl_notifications` ADD `message` MEDIUMTEXT NOT NULL;";
    $result = mysql_query($query);
    
    $query = "ALTER TABLE `tbl_notifications` ADD `userId` INT(255) NOT NULL;";
    $result = mysql_query($query);
    
    $query = "select * from tbl_notifications";
    
    while($row = mysql_fetch_assoc(mysql_query($query))) {
        echo "{$row['messageType']} - {$row['message']}\n";
    }
    
    $query = "update tbl_notifications set userId";
    
    $query = "ALTER TABLE `tbl_products` ADD `isPurchased` INT(1) NOT NULL;";
    $result = mysql_query($query);
     
    
    $query = "update tbl_products set isPurchased = 0";
    mysql_query($query);
     
    
    $query = "CREATE TABLE IF NOT EXISTS `tbl_orders` (`orderId` int(255) NOT NULL, `userId` int(255) NOT NULL, `productId` varchar(255) NOT NULL, `amount` float NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=latin1;";
    $result = mysql_query($query);
    
    $query = "ALTER TABLE `tbl_orders` ADD PRIMARY KEY (`orderId`);";
    $result = mysql_query($query);
    
    $query = "ALTER TABLE `tbl_orders`MODIFY `orderId` int(255) NOT NULL AUTO_INCREMENT;";
    $result = mysql_query($query);
    
    $query = "update tbl_products set isPurchased = 0";
    mysql_query($query);
    
    $query = "ALTER TABLE `tbl_notifications` ADD `userId` INT(255) NOT NULL;";
    $result = mysql_query($query);
    
    $query = "update tbl_products set isPurchased = 0";
    mysql_query($query);
    
    $query = "ALTER TABLE `tbl_categories` ADD `size` varchar(2) NOT NULL;";
    $result = mysql_query($query);
    
    $query = "ALTER TABLE `tbl_products` ADD `sizeChart` varchar(2) NOT NULL;";
    $result = mysql_query($query);
    
    $query = "ALTER TABLE `tbl_products` ADD `height` varchar(255) NOT NULL, ADD `length` varchar(255) NOT NULL;";
    $result = mysql_query($query);
    echo $result;
    
    $query = "drop table tbl_orders";
    mysql_query($query);
    
    
    $query = "CREATE TABLE IF NOT EXISTS `tbl_orders` (`orderId` int(255) NOT NULL, `buyerId` int(255) NOT NULL, `sellerId` int(255) NOT NULL, `productId` int(255) NOT NULL, `amount` float NOT NULL, `originalPrice` float NOT NULL, `discount` float NOT NULL, `addressLine1` varchar(255) NOT NULL, `addressLine2` varchar(255) NOT NULL, `city` varchar(255) NOT NULL, `landmark` varchar(255) NOT NULL, `phoneNumber` varchar(255) NOT NULL, `postCode` varchar(255) NOT NULL, `state` varchar(255) NOT NULL, `firstName` varchar(255) NOT NULL, `lastName` varchar(255) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=latin1;";
    $result = mysql_query($query);
    
    $query = "ALTER TABLE `tbl_orders` ADD PRIMARY KEY (`orderId`);";
    $result = mysql_query($query);
    
    $query = "ALTER TABLE `tbl_orders`MODIFY `orderId` int(255) NOT NULL AUTO_INCREMENT;";
    $result = mysql_query($query);
    
    
    $query = "ALTER TABLE `tbl_orders` ADD `status` varchar(255) NOT NULL;";
    $result = mysql_query($query);
    
    $query = "update `tbl_orders` set status='Processing'";
    $result = mysql_query($query);
    
    $query = "ALTER TABLE `tbl_orders` ADD `orderDate` varchar(255) NOT NULL;";
    $result = mysql_query($query);
    
    $query = "update `tbl_orders` set `orderDate` = '" . date("d/m/Y") . "'";
    $result = mysql_query($query);
    
    $query = "ALTER TABLE `tbl_orders` ADD `AWB` varchar(255) NOT NULL, ADD `courier` varchar(255) NOT NULL;";
    $result = mysql_query($query);
    
    $query = "ALTER TABLE `tbl_products` ADD `isToBeDonated` int(1) NOT NULL;";
    $result = mysql_query($query);
    
    $query = "ALTER TABLE `tbl_orders` ADD `transactionId` varchar(255) NOT NULL, ADD `payUTransactionId` varchar(255) NOT NULL, ADD `type` varchar(255) NOT NULL, ADD `payUStatus` varchar(255) NOT NULL, ADD `paymentMode` varchar(255) NOT NULL, ADD `issuingBank` varchar(255) NOT NULL, ADD `cardType` varchar(255) NOT NULL, ADD `errorCode` varchar(255) NOT NULL, ADD `errorMessage` MEDIUMTEXT NOT NULL, ADD `cardCategory` varchar(255) NOT NULL, ADD `amountDebitedByPayU` varchar(255) NOT NULL, ADD `pgType` varchar(255) NOT NULL, ADD `bankRefNumber` varchar(255) NOT NULL, ADD `bankCode` varchar(255) NOT NULL, ADD `nameOnCard` varchar(255) NOT NULL, ADD `cardNumber` varchar(255) NOT NULL;";
    $result = mysql_query($query);
    echo $result;
    
    $query = "ALTER TABLE `tbl_users` ADD `topsAndDresses` varchar(10) NOT NULL, ADD `jeansAndBottoms` varchar(10) NOT NULL, ADD `footwear` varchar(10) NOT NULL;";
    $result = mysql_query($query);
    
    
    $query = "ALTER TABLE `tbl_notifications` ADD `isRead` int(1) NOT NULL;";
    $result = mysql_query($query);
    
 	$query = "CREATE TABLE IF NOT EXISTS `tbl_coupon_codes` (`couponCodeId` int(255) NOT NULL, `couponCode` varchar(255) NOT NULL, `discount` varchar(255) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=latin1;";
    $result = mysql_query($query);
    
 	$query = "ALTER TABLE `tbl_coupon_codes` ADD PRIMARY KEY (`couponCodeId`);";
    $result = mysql_query($query);
    
    $query = "ALTER TABLE `tbl_coupon_codes `MODIFY `couponCodeId` int(255) NOT NULL AUTO_INCREMENT;";
    $result = mysql_query($query);
    
    $query = "ALTER TABLE `tbl_users` ADD `isActive` int(1) NOT NULL;";
    $result = mysql_query($query);
	
	$query = "update `tbl_users` set `isActive`=1;";
    $result = mysql_query($query);*/
    
    
    // $result = mysql_query('SHOW TABLES');
	// while ($row = mysql_fetch_assoc($result)) {
		// $query = "TRUNCATE TABLE `" . $row['Tables_in_styleflip'] . "`";
 		// $result1 = mysql_query($query);
		// echo $result1;
	// }
	
	// $query = "insert into tbl_admin (username, password) values ('admin', 'stylflip@123')";
    // $result = mysql_query($query);
    // echo $result;
    
    
    // $brands = "109°F | 3.1 Phillip Lim | 7 for all mankind | A.L.C. | Abercrombie & Fitch | Abhishek Gupta | Accessorize | Acne | Adidas | Aeropostle | Aerosoles | AIX Armani Exchange | Akris | Aldo | Alexander Mc Queen | Alexander Wang | Alfani | Alice + Olivia | All Saints | Allen Solly | Allen Solly | Altuzarra | American Apparel | American Eagle Outfitters | American Vintage | Amit Aggarwal | Amrapali | Anamika Khanna | AND | Anita Dongre | Ann Taylor | Anna Sui | Anne Klein | Anthropologie | Apostrophe | Archana Kochhar | Arpita Mehta | Arrow | ASOS | Aspen | Athleta | Aubin & Wills | Austin Reed | Badgley Mischka | Baggit | Bakers | Balenciaga | Bally | Bally | Balmain | Banana Republic | BCBG | BeBe | Bershka | Betsey Johnson | Biba | Billabong | Birkenstock | Body Glove | Bohoo | Boss | Bossini | Bottega Veneta | Brooks Brothers | Burberry | Bvlgari | Cache | Call it Spring | Calvin Klein | Caprese | Carlton London | Carolina Herrerra | Casio | Catwalk | Celine | Chanel | Charles & Keith | Charlotte Russe | Cheap Monday | Chemistry | Chloe | Chopard | Christian Audigier | Christian Dior | Christian Louboutin | Citizen | Citizens of humanity | Claire’s | Clarks | Club Monoco | Coach | Coast | Cole Haan | Colour Plus | Comme Des Garcons | Comme des Garcons | Converse | Cotton On | Cotton World | Crocs | Crocs | Current Elliot | D&G | Da Milano | Daniel Klein | Dash | David's Bridal | Debenhams | Desigual | Diane Von Furstenberg | Diesel | Dior | Disney | Dixie | DKNY | Dolce & Gabanna | Donna Karan | Dorothy Perkins | Dsquared | Dune | Ed Hardy | Eina Ahluwalia | Elie Saab | Elie Tahari | Ella Moss | Elle | Emilio Pucci | Emporio Armani | Equipment | Esbeda | Escada | Espirit | Etro | Express | Ezra | F&F | Falguni & Shane Peacock | Fastrack | Femella | Fendi | Fila | Flying Machine | Forever 21 | Forever New | Fossil | Free People | French Connection | Furla | G-Star | Gant | GAP | Gas | Gaurav Gupta | Gauri & Nainika | Giordano | Giovani | Giuseppe Zanotti | Givenchy | Glamorous | Global Desi | Gucci | Guess | H&M | Halston Heritage | Havaianas | Helios | Hemant & Nandita | Hermes | Herve Leger | Hidesign | Holii | Hollister | Hugo Boss | Hunter | Hush Puppies | Iconic | Inc. 5 | Isabel Marant | Issa | Issey Miyake | J Brand | J Crew | Jade by Monica & Karishma | James Perse | Jane Norman | Jashn | Jatin Verma | JC Penny | Jean Paul Gaultier | Jenny Packham | Jennyfer | Jigsaw | Jill Sander | Jimmy Choo | JJ Valaya | Joie | Jones New York | Juicy Couture | Just Cavalli | Kardashian Kollection | Karen Millen | Karl Lagerfeld | Kate Spade | Kazo | Keds | Kenneth Cole | Kenzie | Kenzo | Kimaya | Kipling | Koovs | Koton | Kurt Geiger | La Perla  | Label by Ritu Kumar | Lacoste | Lafayette | Lanvin | Latin Quarters | Lavie | Lee | Lee Cooper | Levi’s | Libas | Lipsy | Liz Claiborne | LK Bennett | Loewe | Loft | Longchamp | Lord & Taylor | Louis Vuitton | Lucky Brand | Lululemon Athletica | Macy’s | Madame | Madewell | Maje | Malini Ramani | Manav Gangvani | Mango | Manish Arora | Manish Malhotra | Manolo Blahnik | Marc Jacobs | Marccain | Marchesa | Marks & Spencers | Marni | Masaba | Massiomo Dutti | Mavi | Max & Co. | MCQ Alexander Mc Queen | Micheal Kors  | MIH Jeans | Mineral | Miss Bennett | Miss Selfridge | Miss Sixty | Missoni | Miu Miu | Monique L’huillier | Monisha Jaising | Monsoon | Morgan | Moschino | Movado | Mulberry | Nasty Gal | Nautica | Neeta Lulla | Neiman Marcus | New Look | NEXT | Nicole Miller | Nike | Nikhil Thampi | Nina Ricci | Nine West | Nishka Lulla | North Face | Oakley | Oasis | Old Navy | Omega | Only | Oscar de la Renta | Outhouse | Oxygene | PacSun | Paige | Pandora | Park Avenue | Paul & Shark | Paul Smith | Payal Pratap | Payal Singhal | Penny lane | Pepe jeans | Phase Eight | Pieces | Pimkie | Pipa Bella | Polo | Prada | Proenza Schouler | Promod | Provogue | Pull & Bear | Puma | Punt Roma | Quicksilver | Rachel Comey | Rachel Zoe | Rag & Bone | Rahul Mishra | Ralph Lauren | Ranna Gill | Ray Ban | Rebecca Minkoff | Reebok | Reiss | Riddhi Mehra | Ritu Kumar | River Island | Roberto Cavalli | Rocky S | Rohit Bal | Rohit Gandhi Rahul Khanna | Rolex | Roxy | S. Oliver | Sabyasachi | Saint Laurent | Saks Fifth Avenue | Salvatore Ferragamo | Sandro | Schutz | Scotch & Soda | Seiko | Sepia | Shantanu & Nikhil | Sisley | Sketchers | Sonaakshi Raaj | Splash | Splendid | Stella Mccartney | Steve Madden | Stradivarirus | Stuart Weitzman | Style & Co | Sumeet Verma | Superdry | Swarovski | Swatch | Tag Heuer | Tarun Tahiliani | Ted Baker | The Closet Label | The Kooples | The row | Theory | Timberland | Tissot | Titan | Tods | Tom Ford | Tommy Hilfiger | Toms | Topshop | Tory Burch | Tresmode | True Religion | UGG | Uniqlo | United Colors of Bennetton | Urban Outfitters | US polo | Valentino | Valliyan | Van Heusen | Vans | Vera Wang | Vero Moda | Versace | Victoria Beckham | Victoria's Secret | Vikram Phadnis | Vince | Vivienne Westwood | Wallis | Walter Steiger | Warehouse | Wendell Rodricks | Whistles | Wildfox | Wills Lifestyle | Wrangler | Xylys | Yves Saint Laurent | Zac Posen | Zara";
    // $arrBrands = explode(" | ", $brands);
    // for($i = 0; $i < count($arrBrands); $i++) {
		// mysql_query("insert into tbl_brands (name) values ('" . $arrBrands[$i] . "')");
    // }
    
 	// $query = "ALTER TABLE `tbl_products` ADD `pickupFrom` varchar(255) NOT NULL;";
    // $result = mysql_query($query);
    
    // $query = "CREATE TABLE IF NOT EXISTS `tbl_signing_in_issues` (`id` int(255) NOT NULL, `email` varchar(255) NOT NULL, `issue` varchar(255) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=latin1;";
    // echo $result = mysql_query($query);
// 	
	// $query = "ALTER TABLE `tbl_signing_in_issues` ADD PRIMARY KEY (`id`);";
	// echo $result = mysql_query($query);
// 	
	// $query = "ALTER TABLE `tbl_signing_in_issues` MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;";
	// echo $result = mysql_query($query);
	
	// require_once("../classes/Mailer.php");
    // $mailer = new Mailer();
    // $variables = array();
    // $templates = array('emailVerification.html', 'orderConfirmationToBuyer.html', 'orderConfirmationToSeller.html', 'pickupConfirmationToSeller', 'resetPassword.html', 'signUp.html');
    // for($i=0; $i<count($templates); $i++) {
    	// $body = $mailer -> getCompiledTemplate('../emailTemplates/' . $templates[$i], $variables);
    	// $mailer -> send('sushantahirrao@gmail.com', false, 'StylFlip - ' . $templates[$i], $body);
    // }
    
    // $query = "update tbl_stylefeed set likes = 0";
	// echo $result = mysql_query($query);
// 	
	// $query = "truncate tbl_feed_likes";
	// echo $result = mysql_query($query);
// 	
	// $query = "update tbl_products set likes = 0";
	// echo $result = mysql_query($query);
// 	
	// $query = "truncate tbl_product_likes";
	// echo $result = mysql_query($query);
	
	// $query = "update tbl_products set isPurchased = 0 where productId = 1";
	// $result = mysql_query($query);
	
	// $query = "ALTER TABLE `tbl_stylefeed` ADD `productId` int(255) NOT NULL;";
    // $result = mysql_query($query);
    
    
    // mysql_query('update tbl_stylefeed set productId = 0');
    
    // $query = 'select title from tbl_stylefeed';
    // $result = mysql_query($query);
	// while ($row = mysql_fetch_assoc($result)) {
		// $feedTitle = $row['title'];
		// $arr = array();
		// $arr = explode(' now for sale', $feedTitle);
		// if(count($arr) > 0) {
			// $query = 'select productId from tbl_products where productTitle = "'.$arr[0].'"';
    		// $result1 = mysql_query($query);
			// if(mysql_num_rows($result1) > 0) {
				// while ($row1 = mysql_fetch_assoc($result1)) {
					// $productId = $row1['productId'];
				// }
				// echo mysql_query('update tbl_stylefeed set productId = "'.$productId.'" where title = "'.$feedTitle.'"') . " => " . $productId . '<br/>';
			// }
		// }
	// }
	
	
	// $query = "ALTER TABLE `tbl_notifications` ADD `image` MEDIUMTEXT;";
    // $result = mysql_query($query);
	
	// $query = "ALTER TABLE `tbl_products` ADD `approvalDate` varchar(255);";
    // $result = mysql_query($query);
    
    // $query = 'select productId from tbl_products where isApproved = 1 order by productId asc';
    // $result = mysql_query($query);
// 	
	// while ($row = mysql_fetch_assoc($result)) {
		// $query = 'update tbl_products set approvalDate = "'.date("Y-m-d H:i:s").'" where productId="'.$row['productId'].'"';
    	// mysql_query($query);
	// };
	
	// $query = "update `tbl_users` set isFirstTimeLogin = 1 where userId = 1";
    // $result = mysql_query($query);
    
    // $query = "ALTER TABLE `tbl_stylefeed` ADD `wardrobeId` int(255) NOT NULL;";
    // $result = mysql_query($query);
    
    // mysql_query('update tbl_stylefeed set wardrobeId = 0');
    
    // $query = 'select photo, feedId from tbl_stylefeed where title = "Check out my new closet addition" or title = "Check out my new wardrobe addition"';
    // $result = mysql_query($query);
	// while ($row = mysql_fetch_assoc($result)) {
		// $photo = $row['photo'];
		// $feedId = $row['feedId'];
// 		
		// $query = 'select userWadrobeId from tbl_user_wadrobes where image = "'.$photo.'"';
		// $result1 = mysql_query($query);
// 		
		// if(mysql_num_rows($result1) > 0) {
			// while ($row1 = mysql_fetch_assoc($result1)) {
				// $wardrobeId = $row1['userWadrobeId'];
			// }
			// echo mysql_query('update tbl_stylefeed set wardrobeId = "'.$wardrobeId.'" where feedId = "'.$feedId.'"') . ' => ' . $wardrobeId . ' => ' . $feedId . '<br/>';
		// }
		// else {
			// //	delete feed
			// echo mysql_query('delete from tbl_stylefeed where feedId = "'.$feedId.'"');
		// }
	// }
	
	
    // $query = "ALTER TABLE `tbl_coupon_codes` ADD `type` varchar(255) NOT NULL;";
    // echo $result = mysql_query($query);
    
	// $query = "CREATE TABLE IF NOT EXISTS `tbl_coupon_codes_usage` (`usageId` int(255) NOT NULL, `couponCode` int(255) NOT NULL, `userId` int(255) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=latin1;";
    // echo $result = mysql_query($query);
//     
 	// $query = "ALTER TABLE `tbl_coupon_codes_usage` ADD PRIMARY KEY (`usageId`);";
    // echo $result = mysql_query($query);
//     
    // $query = "ALTER TABLE `tbl_coupon_codes_usage `MODIFY `usageId` int(255) NOT NULL AUTO_INCREMENT;";
    // echo $result = mysql_query($query);
    
    // $query = "insert into tbl_coupon_codes_usage (couponCode, userId) values ('STYLF100', '97')";
	// echo $result = mysql_query($query);
	
	// $query = "delete from tbl_coupon_codes_usage";
	// echo $result = mysql_query($query);
	
	// echo mysql_query("delete from tbl_orders where buyerId = 108");
	
	// $query = "ALTER TABLE `tbl_users` ADD `blobTest` blob;";
    // echo $result = mysql_query($query);
    
    // $query = "ALTER TABLE tbl_users MODIFY COLUMN bio blob";
	// echo $result = mysql_query($query);
// 	
	// $query = "ALTER TABLE tbl_products MODIFY COLUMN productDescription blob";
	// echo $result = mysql_query($query);
// 	
	// $query = "ALTER TABLE tbl_stylefeed MODIFY COLUMN title blob";
	// echo $result = mysql_query($query);
// 	
	// $query = "ALTER TABLE tbl_product_comments MODIFY COLUMN comment blob";
	// echo $result = mysql_query($query);
// 	
	// $query = "ALTER TABLE tbl_feed_comments MODIFY COLUMN comment blob";
	// echo $result = mysql_query($query);
	
	// $query = "ALTER TABLE tbl_notifications MODIFY COLUMN message blob";
	// echo $result = mysql_query($query);
	
	// echo mysql_query("delete from tbl_orders where buyerId = 108");
	// echo mysql_query("delete from tbl_users where userId = 108");
	
	// $query = "ALTER TABLE `tbl_users` ADD `isFeatured` int(255) NOT NULL;";
    // echo $result = mysql_query($query);
    
    // echo mysql_query("delete from tbl_users where userId = 26");
    
    // mysql_query("ALTER TABLE `tbl_orders` ADD `couponCodeUsed` VARCHAR(255) NOT NULL AFTER `cardNumber`;");
    
    // echo mysql_query("delete from tbl_orders where orderId = 5 or orderId = 6");
	
	// echo mysql_query("ALTER TABLE `tbl_coupon_codes_usage` CHANGE `couponCode` `couponCode` VARCHAR(255) NOT NULL;");
// 	
	// echo mysql_query("ALTER TABLE `tbl_coupon_codes_usage` CHANGE `usageId` `usageId` INT(255) NOT NULL AUTO_INCREMENT;");
	
	echo mysql_query("ALTER TABLE `tbl_orders` ADD `reverseAWB` VARCHAR(255) NOT NULL AFTER `AWB`;");
	echo mysql_query("ALTER TABLE `tbl_orders` ADD `reverseCourier` VARCHAR(255) NOT NULL AFTER `courier`;");
?>