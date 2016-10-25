<?php 
require_once "dompdf/dompdf_config.inc.php";
require_once "../classes/ConnectDB.php";
spl_autoload_register('DOMPDF_autoload');
function pdf_create($html,$filename,$paper,$orientation,$stream=TRUE){
$dompdf = new Dompdf();

//$dompdf->setPaper($paper,$orientation);
$dompdf->load_html($html);
$dompdf->render();
$dompdf->stream($filename.".pdf");
}
$filename='Invoice';
$dompdf = new Dompdf();
$orderId = $_REQUEST['orderId'];
	$sql = "select o.*, u.userId as sellerId, u.firstName as sellerFirstName, u.lastName as sellerLastName, u.username as sellerUsername, p.productTitle, p.isToBeDonated, p.sellingPrice, p.pickupFrom from tbl_orders o, tbl_products p, tbl_users u where o.productId = p.productId and p.userId = u.userId  and o.orderId =".$_REQUEST['orderId']." order by o.orderId desc";
	
//	$sql = "select * from tbl_orders where orderId =" . $_REQUEST['orderId'];
	$result = mysql_query($sql);
	
$html= "<table  align='center' width='100%' style='border:1px solid #A4A4A4;
border-radius:5px;'>";
function getCalculatedPrice($sellingPrice) {
	if($sellingPrice == 0) {
		return 0;
	}
	$isShippingToBeAdded = $sellingPrice < 2000;
	$sellingPrice = $sellingPrice + (($sellingPrice * 20 /* StylFlip commision  */) / 100);
	if($isShippingToBeAdded) {
		$sellingPrice = $sellingPrice + 120;	//	120 is the shipping fees
	}
	return ceil($sellingPrice);
};
function EntryDate($mysqldate, $format='d/m/Y')
		{
			if($mysqldate)
			{
				$arrdate = explode('-',$mysqldate);
				$entrydate = date($format, mktime(0, 0, 0, $arrdate[1], $arrdate[2], $arrdate[0]));
				return $entrydate;
			}
			else
			{
				return;
			}
		}
while($row = mysql_fetch_assoc($result)) {

if($row['Generate_Invoice_flag']=='No' || $row['Generate_Invoice_flag']==''){
$sql = "UPDATE tbl_orders SET Generate_Invoice_flag = 'Yes', Generate_Invoice_Date = '".date('Y-m-d')."'
	WHERE orderId='".$row['orderId']."'";
	 mysql_query($sql);
}

if($row['paymentMode']=='Cash on delivery')
			$cod=85;
				else
				$cod=0;

if(strlen($row['orderId'])=='3')
		{ 
		 $oid='0'.$row['orderId'];
		 }else {
		 $oid=$row['orderId'];
		 }	
$seller = $row['sellerFirstName'] .  " " . $row['sellerLastName'];
		
		if(trim($seller) == '') {
			$seller = $row['sellerUsername'];
		}	

	

$query = "select discount, type from tbl_coupon_codes where couponCode = '".$row['couponCodeUsed']."'";
		$couponCodeResult = mysql_query($query);
		while($couponCodeRow = mysql_fetch_assoc($couponCodeResult)) {
			$couponDiscount = $couponCodeRow['discount'];
			$couponType = $couponCodeRow['type'];
		}
		
		if($couponType == 'percent') {
			$couponDiscount = getCalculatedPrice($row['sellingPrice']) * $couponDiscount / 100; 
		}

		$couponDiscount = $couponDiscount;		
$html.="<tr style='line-height:20px;'><td colspan='3'><span style='position: absolute;'><img <img src='../emailTemplates/images/logo.png' height='60' /></span>".str_repeat('&nbsp;',40)."<b>PLACARD DIGITAL SOLUTIONS PRIVATE LIMITED </b><br/>".str_repeat('&nbsp;',65)."
plot-13,Flat-2,GR,Wing-5,<br/>". str_repeat('&nbsp;', 55)."
Versova view ,Andheri (West),Mumbai-400053</td>

</tr>
<tr><td colspan='3'></td></tr> <tr>
 <td style='background-color:#EF4E6D;
font-color:white;
font-size:16px;
font-weight:900px;
color:white;' align='center' colspan='3'>INVOICE CUM DELIVERY CHALLAN</td>
</tr><tr>
	<td>
		<table align='center' style='border:1px solid #A4A4A4;
border-radius:5px;'>
		<tr>
			<td align='left' colspan='2' style='line-height:20px;
background-color:#FDEBEB;
padding-top:2px;
padding-bottom:1px;
padding-left:5px;'><b>Goods Shipped to :</b></td>
		</tr>
		<tr>
			<td style='font-size:13px;
font-family: Verdana, Geneva, sans-serif;'>M/S.</td>
			<td style='font-size:13px;
font-family: Verdana, Geneva, sans-serif;'>".$row['firstName'] .  " " . $row['lastName']."</td>
		</tr>
		<tr>
			<td style='font-size:13px;
font-family: Verdana, Geneva, sans-serif;'>Add</td>
			<td style='font-size:13px;
font-family: Verdana, Geneva, sans-serif;'>".$row['addressLine1'] . ', ' . $row['addressLine2'] . ', ' . $row['landmark'] . ', ' . $row['city'] .' - '.$row['postCode']. ', ' . $row['state']."</td>
		</tr>
		<tr>
			<td style='font-size:13px;
font-family: Verdana, Geneva, sans-serif;'> Contact</td>
			<td style='font-size:13px;
font-family: Verdana, Geneva, sans-serif;'>".$row['phoneNumber']."</td>
		</tr>
		</table>
	</td>
	
	<td  rowspan='2' colspan='3' >
		<table align='center' style='border:1px solid #A4A4A4;
border-radius:5px;' height='100'>
		
		
		<tr>
			<td style='font-size:13px;
font-family: Verdana, Geneva, sans-serif;'><b>Invoice No </b>PLIN/16-17/".$oid." </td>
			<td style='font-size:12px;
font-family: Verdana, Geneva, sans-serif;'><b>Date :</b>:".EntryDate($row['Generate_Invoice_Date'])."</td>

		</tr>
		<tr style='line-height:50%;'>
			<td><br/></td>
			<td><br/></td>
		</tr>
		
		<tr>
			<td style='font-size:13px;
font-family: Verdana, Geneva, sans-serif;'><b>Payment Method</b></td>
			<td style='font-size:12px;
font-family: Verdana, Geneva, sans-serif;'>".$row['paymentMode']."</td>
		</tr>
		<tr>
			<td colspan='2'><br/></td>
		</tr>
		
		<tr>
			<td colspan='2' style='line-height: 39px;background-color:#FDEBEB;padding-left:10px;'>Order No:".$row['orderId']."</td>
		</tr>
		<tr>
			<td colspan='2'><br/></td>
		</tr>
		<tr>
			<td colspan='2' style='line-height: 39px;
background-color:#FDEBEB;
padding-top:2px;
padding-bottom:1px;
padding-left:10px;''>Seller Cost:".$seller."</td>
		
		</tr>
		<tr>
			<td colspan='2'><br/></td>
		</tr>
		</table>
	</td>
	
</tr><tr>
	<td>
		<table align='center' style='border:1px solid #A4A4A4;
border-radius:5px;'>
		<tr>
			<td align='left' colspan='2' style='line-height:20px;
background-color:#FDEBEB;
padding-top:2px;
padding-bottom:1px;
padding-left:5px;'><b>Billing Address :</b></td>
		</tr>
		<tr>
			<td style='font-size:13px;
font-family: Verdana, Geneva, sans-serif;'>M/S.</td>
			<td style='font-size:13px;
font-family: Verdana, Geneva, sans-serif;'>".$row['firstName'] .  ' ' . $row['lastName']."</td>
		</tr>
		<tr>
			<td style='font-size:13px;
font-family: Verdana, Geneva, sans-serif;' >Add</td>
			<td style='font-size:13px;
font-family: Verdana, Geneva, sans-serif;'>".$row['addressLine1'] . ', ' . $row['addressLine2'] . ', ' . $row['landmark'] . ', ' . $row['city'] .' - '.$row['postCode']. ', ' . $row['state']."</td>
		</tr>
		
		</table>
	</td>
	
	</tr>
	<tr><td colspan='3'></td></tr>
<tr><td colspan='3'></td></tr>
<tr>
<td colspan='3'>
	<table width='100%' style='border:1px solid #A4A4A4;
border-radius:5px;'>
	<tr style='line-height:30px;
background-color:#FDEBEB;
font-weight: bold;font-size:15px;'>
		 <td>Sr No.</td>
		 <td>Description Of Goods</td>
		 <td>Quantity</td>
		 <td>Unit</td>
		 <td>Rate</td>
		 <td>Amount</td>
		 </tr>
		 
		<tr style='font-size:13px;
font-family: Verdana, Geneva, sans-serif;'>
		 <td>1</td>
		 <td>SF00000".$row['productId']."&nbsp;&nbsp;".$row['productTitle']."</td>
		 <td>1</td>
		 <td>1</td>
		 <td>".number_format(getCalculatedPrice($row['sellingPrice']),'2','.','')."</td>
		 <td>".number_format((1*getCalculatedPrice($row['sellingPrice'])),'2','.','')."</td>
		 </tr> 
		<tr>
		 <td colspan='6' style='line-height:120px;'>&nbsp;&nbsp;&nbsp;</td>
		 </tr> 
		   <tr style='font-size:13px;
font-family: Verdana, Geneva, sans-serif;'>
			<td></td>
			<td>Less:Discount:".$row['couponCodeUsed']."</td>
			<td></td>
			<td></td>
			<td></td>
			<td>".number_format($couponDiscount,'2','.','')."</td>
		   </tr>
		   <tr style='font-size:13px;
font-family: Verdana, Geneva, sans-serif;'>
		  <td colspan='6' style='line-height:20px;'>&nbsp;&nbsp;&nbsp;</td></tr>
		   <tr style='font-size:13px;
font-family: Verdana, Geneva, sans-serif;'>
			<td></td>
			<td>Add:COD charges</td>
			<td></td>
			<td></td>
			<td></td>
			<td>"
			.number_format($cod,'2','.','')."</td>
		   </tr>
		   <tr style='font-size:13px;
font-family: Verdana, Geneva, sans-serif;'>
		   <td colspan='6' style='line-height:20px;'>&nbsp;&nbsp;&nbsp;</td></tr>
		    <tr style='font-size:13px;
font-family: Verdana, Geneva, sans-serif;'>
			<td></td>
			<td>Add: Freight</td>
			<td></td>
			<td></td>
			<td></td>
			<td>".number_format(0,'2','.','')."</td>
		   </tr>
		   <tr>
		   <td colspan='6' style='line-height:10px;'>&nbsp;&nbsp;&nbsp;</td>
		    </tr>
		    <tr style='font-size:13px;
font-family: Verdana, Geneva, sans-serif;'>
			<td></td>
			<td></td>
			<td></td>
			<td><b>TOTAL</b></td>
			<td></td>
			<td><b>".number_format(getCalculatedPrice($row['sellingPrice'])-$couponDiscount+$cod,'2','.','')."</b></td>
			 </tr>
	 </table>
</td>
	
</tr><tr>
	<td colspan='3'>&nbsp;</td>
	</tr>	
	<tr>
	<td colspan='2' style='padding-left:8px;
font-size:11px;
font-family: Verdana, Geneva, sans-serif;'>Certified that the particulars given above are true and <br/>correct and the amount represents <br/>the price actully charged from the buyer.  </td>
<td style='padding-left:8px;
font-size:10px;
font-family: Verdana, Geneva, sans-serif;
font-weight:900;'>for Placard Digital Solutions Private Limited</td>
	</tr>
	<tr>
	<td colspan='3'>&nbsp;</td>
	</tr>
	<tr>
	<td colspan='3' style='padding-left:8px;
font-size:10px;
font-family: Verdana, Geneva, sans-serif;
font-weight:900;'>Terms & Conditions</td>
	</tr>
	<tr>
	<td style='padding-left:8px;
font-size:11px;
font-family: Verdana, Geneva, sans-serif;'>1) For refunds and returns, please check our Cancellations and Returns policy on www.stylflip.com <br/>
2) Any issues, disputes, claims must be raised within 72 hours of receipt of the items          <br/>                                                                                      3) Subject to jurisdiction of Mumbai</td>
	<td ></td>
	<td style='padding-left:8px;
font-size:10px;
font-family: Verdana, Geneva, sans-serif;
font-weight:900;'><br/><br/><br/><br/>Authorised Signatory</td>
	
	</tr>
	
	";
}
$html.="</table><p align='center' style='font-size:10px;font-family: Verdana, Geneva, sans-serif;'>This is a Computer generated invoice and Does not need a signature</p>";
//echo $html;
pdf_create($html,$filename,'A4','landscape')

?>

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
</style>