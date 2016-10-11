<?php
include("adminHeader.php");
if(isset($_POST['addusers']))
{
	//var_dump($_POST['products_list']);
    $sql1 = "SELECT * FROM tbl_newstylefeed WHERE object_type = 'user'";
    $result1 = mysql_query($sql1);
    $i = 0;
    $users = array();
    $users = $_POST['users_list'];
    while ($row = mysql_fetch_assoc($result1)) {
        //var_dump($row);
        $sql = "UPDATE `stylflip`.`tbl_newstylefeed` SET `object_id` = '".$users[$i]."' WHERE `tbl_newstylefeed`.`id` = ".$row['id'];
        $result = mysql_query($sql);
        $i++;
    }
    if($result)
    {
        ?><center><span style="color:green">Successfully Updated!</span></center><?php
    }
}
?>
<table class="table"  style="text-align:center;width:100%">
	<tr>
		<td colspan="5"></td>  
	</tr>
	<tr>
		<td colspan="5"><a href="stylefeedUsers.php">Users</a> | <a href="stylefeedProducts.php">Products</a> | <a href="stylefeedCategories.php">Categories</	a> | <a href="stylefeedBrands.php">Brands</a></td>
	</tr>
</table>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>
<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
<script src="//netsh.pp.ua/upwork-demo/1/js/typeahead.js"></script>
<style>
    h1 {
        font-size: 20px;
        color: #111;
    } 
    .content {
        width: 80%;
        margin: 0 auto;
        margin-top: 50px;
    } 
    .tt-hint,
    .add_users {
        border: 2px solid #CCCCCC;
        border-radius: 8px 8px 8px 8px;
        font-size: 24px;
        height: 45px;
        line-height: 30px;
        outline: medium none;
        padding: 8px 12px;
        width: 400px;
    } 
    .tt-dropdown-menu {
        width: 400px;
        margin-top: 5px;
        padding: 8px 12px;
        background-color: #fff;
        border: 1px solid #ccc;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 8px 8px 8px 8px;
        font-size: 18px;
        color: #111;
        background-color: #F1F1F1;
    }
</style>
<script>
    function showResult(str) {
  if (str.length==0) { 
    document.getElementById("livesearch").innerHTML="";
    document.getElementById("livesearch").style.border="0px";
    return;
  }
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  } else {  // code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function() {
    if (this.readyState==4 && this.status==200) {
      document.getElementById("livesearch").innerHTML=this.responseText;
      document.getElementById("livesearch").style.border="1px solid #A5ACB2";
    }
  }
  xmlhttp.open("GET","userSearch.php?q="+str,true);
  xmlhttp.send();
}

function add_user_to_list(username,userId)
{
	if(document.getElementsByClassName('selected_users_list').length < 5)
	{
		document.getElementById("selected_users").innerHTML += "<div id = 'div"+userId+"'><input type='hidden' name='users_list[]' value='"+userId+"'><input size = '35' name= 'user_list[]' class= 'selected_users_list' type='text' id="+userId+" readonly value='"+username+"'><a href=# onclick=\"remove_added_user('div"+userId+"')\">Remove</a><br></div>";
        if(document.getElementsByClassName('selected_users_list').length == 5)
        {
            document.getElementById('put_button').innerHTML = "<input type='submit' value='Add users' name='addusers' id='add_users' />";
        } 
	}
	else
	{
		document.getElementById("error").innerHTML = "Remove the added items to add new items!";
	}
	//document.getElementById("selected_users").remove();
}

$( document ).ready(function() {
    if(document.getElementsByClassName('selected_users_list').length == 5)
    {
        document.getElementById('put_button').innerHTML = "<input type='submit' value='Add users' name='addusers' id='add_users' />";
    }
});

function remove_added_user(userId)
{
	document.getElementById("error").innerHTML = "";
    document.getElementById('put_button').innerHTML = "";
	document.getElementById(userId).remove();
}

</script>
<hr><center>
<strong>Configure the stylefeed section</strong>
<div id = "error" style="color:red"></div>
<form name="users_stylefeed_form" method="post" enctype="multipart/form-data" action="<?php echo $baseURL; ?>sf_admin_control-panel/stylefeedUsers.php">

	<div class="content">
    
    	<div id="selected_users">
            <?php 
                $sql1 = "SELECT * FROM tbl_newstylefeed WHERE object_type = 'user'";
                $result1 = mysql_query($sql1);
                while($row = mysql_fetch_assoc($result1))
                {
                    $sql = "SELECT * FROM tbl_users WHERE userId = ".$row['object_id'];
                    $result = mysql_query($sql);
                    $single_user = mysql_fetch_assoc($result);
                    echo "<div id = 'div".$single_user['userId']."'><input type='hidden' name='users_list[]' value='".$single_user['userId']."'><input size = '35' name= 'user_list[]' class= 'selected_users_list' type='text' id=".$single_user['userId']." readonly value='".$single_user['username']."'><a href=# onclick=\"remove_added_user('div".$single_user['userId']."')\">Remove</a><br></div>";
                }
            ?>   
        </div>
    	
    	Search users : <input type="text" id="userName" name="userName" placeholder="Enter text" class= "add_users" onkeyup="showResult(this.value)"><div id="livesearch" style="width:45%"></div>
    	<p id = "put_button"></p>
   
    </div>
</form> </center>
