
<style>
table {border:1px solid #A4A4A4;
border-radius:5px;
}
td,th {border:none}
.red
{
background-color:red;
font-color:white;
font-size:13px;
color:white;
}
.trred{
line-height: 30px;
}
.bgtr{
line-height: 39px;
background-color:#FDEBEB;
padding-top:2px;
padding-bottom:1px;
padding-left:10px;
}
.bgtr1{
line-height: 39px;

padding-top:2px;
padding-bottom:1px;
padding-left:10px;
}
.bgcolor{
line-height:20px;
background-color:#FDEBEB;
padding-top:2px;
padding-bottom:1px;
padding-left:5px;
}
.bgcolor1{
line-height:30px;
background-color:#FDEBEB;
font-weight: bold;
}
.subtd{
font-size:12px;
font-family: Verdana, Geneva, sans-serif;
}
.addpadd{
padding-left:8px;
font-size:11px;
font-family: Verdana, Geneva, sans-serif;
}
.addpadd1{
padding-left:8px;
font-size:10px;
font-family: Verdana, Geneva, sans-serif;
font-weight:900;
}
</style><?php
require_once "../classes/ConnectDB.php";
?>
<?php  

if(isset($_REQUEST['orderId'])) {
	$orderId = $_REQUEST['orderId'];
	$sql = "select o.*, u.userId as sellerId, u.firstName as sellerFirstName, u.lastName as sellerLastName, u.username as sellerUsername, p.productTitle, p.isToBeDonated, p.sellingPrice, p.pickupFrom from tbl_orders o, tbl_products p, tbl_users u where o.productId = p.productId and p.userId = u.userId  and o.orderId =".$_REQUEST['orderId']." order by o.orderId desc";
	
//	$sql = "select * from tbl_orders where orderId =" . $_REQUEST['orderId'];
	$result = mysql_query($sql);
}
?>
<table  align="center" width="40%">
<?php while($row = mysql_fetch_assoc($result)) { 
 //print_r($row); ?>
<tr>
 <td colspan="3"><img src="logo.jpg"/><?php echo str_repeat("&nbsp;", 20)?><b>PLACARD DIGITAL SOLUTIONS PRIVATE LIMITED </b><br/><?php echo str_repeat("&nbsp;", 45)?>
plot-13,Flat-2,GR,Wing-5,<br/><?php echo str_repeat("&nbsp;", 35)?>
Versova view ,Andheri (West),Mumbai-400053</td>

</tr>
<tr><td colspan="3"></td></tr>
<tr class="trred">
 <td class="red" align="center" colspan="3"><b>INVOICE CUM DELIVERY CHALLAN</b></td>
</tr>
<tr>
<tr>
	<td>
		<table align="center">
		<tr>
			<td align="left" colspan="2" class="bgcolor"><b>Goods Shipped to :</b></td>
		</tr>
		<tr>
			<td class="subtd">M/S.</td>
			<td class="subtd"><?=$row['firstName'] .  " " . $row['lastName']?></td>
		</tr>
		<tr>
			<td class="subtd">Add</td>
			<td class="subtd"><?=$row['addressLine1'] . ", " . $row['addressLine2'] . ", " . $row['landmark'] . ", " . $row['city'] . ", " . $row['state'] . " - " . $row['postCode']?></td>
		</tr>
		<tr>
			<td class="subtd"> Contact</td>
			<td class="subtd"><?=$row['phoneNumber']?></td>
		</tr>
		</table>
	</td>
	
	<td  rowspan="2" colspan="2" >
		<table align="center" >
		<tr>
			<td colspan="2"></td>
		</tr>
		<tr>
			<td><b>Invoice No </b> </td>
			<td><b>Date :</b>:<?=$row['orderDate']?></td>
		</tr>
		<tr>
			<td><b>Payment Method</b></td>
			<td><?=$row['paymentMode']?></td>
		</tr>
		<tr>
			<td colspan="2"></td>
		</tr>
		<tr>
			<td colspan="2"></td>
		</tr>
		<tr>
			<td colspan="2" class="bgtr"><b>Order No.</b><?=$row['orderId']?></td>
		
		</tr>
		
		<tr>
			<td colspan="2" class="bgtr1"><b>Seller Cost</b></td>
		
		</tr>
		</table>
	</td>
	
</tr>
<tr>
	<td>
		<table align="center">
		<tr>
			<td align="left" colspan="2" class="bgcolor"><b>Billing Address :</b></td>
		</tr>
		<tr>
			<td class="subtd">M/S.</td>
			<td class="subtd"><?=$row['firstName'] .  " " . $row['lastName']?></td>
		</tr>
		<tr>
			<td class="subtd">Add</td>
			<td class="subtd"><?=$row['addressLine1'] . ", " . $row['addressLine2'] . ", " . $row['landmark'] . ", " . $row['city'] . ", " . $row['state'] . " - " . $row['postCode']?></td>
		</tr>
		
		</table>
	</td>
	
	</tr>

<tr><td colspan="3"></td></tr>
<tr><td colspan="3"></td></tr>
<tr>
<td colspan="3" >
	<table width="100%">
	<tr class="bgcolor1">
		 <td>Sr No.</td>
		 <td>Description Of Goods</td>
		 <td>Quantity</td>
		 <td>Unit</td>
		 <td>Rate</td>
		 <td>Amount</td>
		 </tr>
		 
		<tr>
		 <td>1</td>
		 <td><?='SF00000'.$row['productId'].$row['productTitle']?></td>
		 <td>1</td>
		 <td>1</td>
		 <td><?=$row['amount']?></td>
		 <td><?=(1*$row['amount'])?></td>
		 </tr> 
		<tr>
		 <td colspan="6" style="line-height:120px;">&nbsp;&nbsp;&nbsp;</td>
		 </tr> 
		   <tr>
			<td></td>
			<td>Less:Discount:summerlove</td>
			<td></td>
			<td></td>
			<td></td>
			<td><?=$row['discount']?></td>
		   </tr>
		  <td colspan="6" style="line-height:20px;">&nbsp;&nbsp;&nbsp;</td>
		   <tr>
			<td></td>
			<td>Add:COD charges</td>
			<td></td>
			<td></td>
			<td></td>
			<td><?=$row['paymentMode'] == 'Cash on delivery' ? '85' : '0';?></td>
		   </tr>
		   <td colspan="6" style="line-height:20px;">&nbsp;&nbsp;&nbsp;</td>
		    <tr>
			<td></td>
			<td>Add: Freight</td>
			<td></td>
			<td></td>
			<td></td>
			<td><?=$row['discount']?></td>
		   </tr>
		   </tr>
		   <td colspan="6" style="line-height:10px;">&nbsp;&nbsp;&nbsp;</td>
		    <tr>
		    <tr>
			<td></td>
			<td></td>
			<td></td>
			<td><b>TOTAL</b></td>
			<td></td>
			<?php if($row['paymentMode']=='Cash on delivery')
			$cod=85;
				else
				$cod=0;			?>
			<td><b><?=$row['amount']-$row['discount']+$cod?></b></td>
		   </tr>
	 </table>
</td>
	
</tr>
	<tr>
	<td colspan="3">&nbsp;</td>
	</tr>	
	<tr>
	<td colspan="3"  class="addpadd">Certified that the particulars given above are true and <br/>correct and the amount represents <br/>the price actully charged from the buyer.  </td>
	</tr>
	<tr>
	<td colspan="3">&nbsp;</td>
	</tr>
	<tr>
	<td class="addpadd1">Terms & Conditions</td>
	<td class="addpadd1">for Placard Digital Solutions Private Limited  </td>
	<td></td>
	</tr>
<?php } ?>
</table>