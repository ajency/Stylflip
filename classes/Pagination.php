<?php
/**
 *
 * PHP tutorials and scripts
 *
 * @package		PHPSense
 * @author		Sushant Ahirrao
 * @copyright	Copyright (c) 2013, Sushant Ahirrao
 * @link		http://www.webappgeek.com
 */

// ------------------------------------------------------------------------


class Pagination {
	var $php_self;
	var $rows_per_page = 10; //Number of records to display per page
	var $total_rows = 0; //Total number of rows returned by the query
	var $links_per_page = 1000000; //Number of links to display per page
	var $append = ""; //Paremeters to append to pagination links
	var $sql = "";
	var $debug = false;
	var $conn = false;
	var $page = 1;
	var $max_pages = 0;
	var $offset = 0;
	
	/**
	 * Constructor
	 *
	 * @param resource $connection Mysql connection link
	 * @param string $sql SQL query to paginate. Example : SELECT * FROM users
	 * @param integer $rows_per_page Number of records to display per page. Defaults to 10
	 * @param integer $links_per_page Number of links to display per page. Defaults to 5
	 * @param string $append Parameters to be appended to pagination links 
	 */
	
	function Pagination($connection, $sql, $rows_per_page) {
		$this->conn = $connection;
		$this->sql = $sql;
		if(isset($_REQUEST['limit'])) {
			$this->rows_per_page = (int)$_REQUEST['limit'];
		} 
		else {
			$this->rows_per_page = (int)$rows_per_page;			
		}
		$this->php_self = htmlspecialchars($_SERVER['PHP_SELF'] );
		if (isset($_REQUEST['page'])) {
			$this->page = intval($_GET['page'] );
		}
		if (isset($_REQUEST['page_index'])) {
			$this->page = intval($_REQUEST['page_index'] );
		}
	}
	
	function rowsPerPage () {
		return $this->rows_per_page;
	}
	
	/**
	 * Executes the SQL query and initializes internal variables
	 *
	 * @access public
	 * @return resource
	 */
	 //	this is pagination function for web
	function paginate() {
		//Check for valid mysql connection
		if (! $this->conn || !is_resource($this->conn )) {
			if ($this->debug)
				echo "MySQL connection missing<br />";
			return false;
		}
		
		//Find total number of rows
		$all_rs = @mysql_query($this->sql );
		if (! $all_rs) {
			if ($this->debug)
				echo "SQL query failed. Check your query.<br /><br />Error Returned: " . mysql_error();
			return false;
		}
		$this->total_rows = mysql_num_rows($all_rs);
		@mysql_close($all_rs );
		
		//Return FALSE if no rows found
		if ($this->total_rows == 0) 
		{
			if ($this->debug)
			return FALSE;
		}
		
		//Max number of pages
		$this->max_pages = ceil($this->total_rows / $this->rows_per_page );
		if ($this->links_per_page > $this->max_pages) {
			$this->links_per_page = $this->max_pages;
		}
		
		//Check the page value just in case someone is trying to input an aribitrary value
		if ($this->page > $this->max_pages || $this->page <= 0) {
			$this->page = 1;
		}
		
		//Calculate Offset
		$this->offset = $this->rows_per_page * ($this->page - 1);
		
		//Fetch the required result set
		$rs = @mysql_query($this->sql . " LIMIT {$this->offset}, {$this->rows_per_page}" );
		if (! $rs) {
			if ($this->debug)
				echo "Pagination query failed. Check your query.<br /><br />Error Returned: " . mysql_error();
			return false;
		}
		return $rs;
	}


	function paginateForIPad() {
		//Check for valid mysql connection
		if (! $this->conn || ! is_resource($this->conn )) {
			if ($this->debug)
				echo "MySQL connection missing";
			return false;
		}
		
		//Find total number of rows
		$all_rs = @mysql_query($this->sql );
		if (! $all_rs) {
			if ($this->debug)
				echo "SQL query failed. Check your query.<br /><br />Error Returned: " . mysql_error();
			return false;
		}
		
		$this->total_rows = mysql_num_rows($all_rs);
		@mysql_close($all_rs );
		
		//Return FALSE if no rows found
		if ($this->total_rows == 0) {
			if ($this->debug)
			return FALSE;
		}
		
		//Max number of pages
		$this->max_pages = ceil($this->total_rows / $this->rows_per_page );
		if ($this->links_per_page > $this->max_pages) {
			$this->links_per_page = $this->max_pages;
		}
		
		//Check the page value just in case someone is trying to input an aribitrary value
		if ($this->page > $this->max_pages || $this->page <= 0) {
			$this->page = 1;
		}
		
		//Calculate Offset
		$this->offset = $this->rows_per_page * ($this->page - 1);
		
		//Fetch the required result set
		$rs = @mysql_query($this->sql . " LIMIT {$this->offset}, {$this->rows_per_page}" );
		if (! $rs) {
			if ($this->debug)
				echo "Pagination query failed. Check your query.<br /><br />Error Returned: " . mysql_error();
			return false;
		}
		return $rs;
	}

	
	/**
	 * Display the link to the first page
	 *
	 * @access public
	 * @param string $tag Text string to be displayed as the link. Defaults to 'First'
	 * @return string
	 */
	function renderFirst($tag = 'First') {
		if ($this->total_rows == 0)
			return FALSE;
		
		if ($this->page == 1) {
			return "$tag ";
		} else {
			return '<a href="' . $this->php_self . '?page=1">' . $tag . '</a> ';
		}
	}
	
	/**
	 * Display the link to the last page
	 *
	 * @access public
	 * @param string $tag Text string to be displayed as the link. Defaults to 'Last'
	 * @return string
	 */
	function renderLast($tag = 'Last') {
		if ($this->total_rows == 0)
			return FALSE;
		
		if ($this->page == $this->max_pages) {
			return $tag;
		} else {
			return ' <a href="' . $this->php_self . '?page=' . $this->max_pages . '">' . $tag . '</a>';
		}
	}
	
	/**
	 * Display the next link
	 *
	 * @access public
	 * @param string $tag Text string to be displayed as the link. Defaults to '>>'
	 * @return string
	 */
	function renderNext($tag = '&gt;&gt;') {
		if ($this->total_rows == 0)
			return FALSE;
		
		if ($this->page < $this->max_pages) {
			return '<a href="' . $this->php_self . '?page=' . ($this->page + 1) . '">' . $tag . '</a>';
		} else {
			return $tag;
		}
	}
	
	/**
	 * Display the previous link
	 *
	 * @access public
	 * @param string $tag Text string to be displayed as the link. Defaults to '<<'
	 * @return string
	 */
	function renderPrev($tag = '&lt;&lt;') {
		if ($this->total_rows == 0)
			return FALSE;
		
		if ($this->page > 1) {
			return ' <a href="' . $this->php_self . '?page=' . ($this->page - 1) . '">' . $tag . '</a>';
		} else {
			return " $tag";
		}
	}
	
	/**
	 * Display the page links
	 *
	 * @access public
	 * @return string
	 */
	function renderNav($prefix = '<span class="page_link">', $suffix = '</span>') {
		if ($this->total_rows == 0)
			return FALSE;
		
		$batch = ceil($this->page / $this->links_per_page );
		$end = $batch * $this->links_per_page;
		if ($end == $this->page) {
			//$end = $end + $this->links_per_page - 1;
		//$end = $end + ceil($this->links_per_page/2);
		}
		if ($end > $this->max_pages) {
			$end = $this->max_pages;
		}
		$start = $end - $this->links_per_page + 1;
		$links = '';
		
		for($i = $start; $i <= $end; $i ++) {
			if ($i == $this->page) {
				$links .= $prefix . " $i " . $suffix;
			} else {
				$links .= ' ' . $prefix . '<a href="' . $this->php_self . '?page=' . $i . '">' . $i . '</a>' . $suffix . ' ';
			}
		}
		
		return $links;
	}
	
	function renderNav1($prefix = '<span class="page_link">', $suffix = '</span>',$text) {
		if ($this->total_rows == 0)
			return FALSE;
		
		$batch = ceil($this->page / $this->links_per_page );
		$end = $batch * $this->links_per_page;
		if ($end == $this->page) {
			//$end = $end + $this->links_per_page - 1;
		//$end = $end + ceil($this->links_per_page/2);
		}
		if ($end > $this->max_pages) {
			$end = $this->max_pages;
		}
		$start = $end - $this->links_per_page + 1;
		$links = '';
		if($this->page !='1'){
		$links .= '<a href="' . $this->php_self . '?page=' . ($this->page-1) .'&search_text='.$text.'"><img src="../emailTemplates/images/previous.png" width="16px" style="border:none;margin-top: 2px;margin-right: 0;" /></a>';
		}
		for($i = $start; $i <= $end; $i ++) {
		
			if ($i == $this->page) {
			if($i>='6' && $i<=($end-3)){
			 $links .= '<span class="page_link" style="text-align:center;padding-left:3px;margin-right:2px;">' . " $i " .'</span>...';
			}else{
			$links .= '<span class="page_link" style="text-align:center;padding-left:3px;margin-right:2px;">' . " $i " .'</span>';
				}
			}
			
			
			elseif($i>='6' && $i<=($end-3)){
			
				if($i=='6'){
					$links .= '....';	
					}				
				}
			
			
			else {
			
				if(isset($text)){
				
				$links .= ' ' . $prefix . '<a href="' . $this->php_self . '?page=' . $i .'&search_text='.$text.'">' . $i . '</a>' . $suffix . ' ';
				 
				}
				else
				{
			
				 $links .= '' . $prefix . '<a href="' . $this->php_self . '?page=' . $i .'">' . $i . '</a>' . $suffix . ' ';
				}
				
			}
		} 
		if($this->page !=$end){
	 $links .= '<a href="' . $this->php_self . '?page=' . ($this->page+1) .'&search_text='.$text.'"><img src="../emailTemplates/images/next.png" width="19px" style="border:none;margin-top: -1px;margin-right: 0;" /></a>';
		}	
		 $links .='<input type="text" style="width:5%" name="pageno" id="pageno"/><input type="button" onclick="redirectpage();" value="go to" />';
		//echo $links;
		return $links;
	}

	function renderNav2($prefix = '<span class="page_link">', $suffix = '</span>',$text,$text1) {
		if ($this->total_rows == 0)
			return FALSE;
		
		$batch = ceil($this->page / $this->links_per_page );
		$end = $batch * $this->links_per_page;
		if ($end == $this->page) {
			//$end = $end + $this->links_per_page - 1;
		//$end = $end + ceil($this->links_per_page/2);
		}
		if ($end > $this->max_pages) {
			$end = $this->max_pages;
		}
		$start = $end - $this->links_per_page + 1;
		$links = '';
		if($this->page !='1'){
		$links .= '<a href="' . $this->php_self . '?page=' . ($this->page-1) .'&search_text='.$text.'"><img src="../emailTemplates/images/previous.png" width="16px" style="border:none;margin-top: 2px;margin-right: 0;" /></a>';
		}
		for($i = $start; $i <= $end; $i ++) {
			if ($i == $this->page) {
			
			if($i>='4' && $i<=($end-3)){
			 $links .= $prefix . " $i " . $suffix.'...';
			}else{
				$links .= $prefix . " $i " . $suffix;
				}
			}
			elseif($i>='4' && $i<=($end-3)){
			
				if($i=='4'){
					$links .= '....';	
					}				
				}
			
			
			else {
			
				if(isset($text) && !isset($text1)){
				
				
				$links .= ' ' . $prefix . '<a href="' . $this->php_self . '?page=' . $i .'&search_text='.$text.'">' . $i . '</a>' . $suffix . ' ';
				}
				elseif(isset($text1) && isset($text)){
				
				$links .= ' ' . $prefix . '<a href="' . $this->php_self . '?page=' . $i .'&search_text='.$text.'&search_text1='.$text1.'">' . $i . '</a>' . $suffix . ' ';
				}
				elseif(isset($text1)){
				
				$links .= ' ' . $prefix . '<a href="' . $this->php_self . '?page=' . $i .'&search_text1='.$text1.'">' . $i . '</a>' . $suffix . ' ';
				}
				else
				{
			
				 $links .= ' ' . $prefix . '<a href="' . $this->php_self . '?page=' . $i .'">' . $i . '</a>' . $suffix . ' ';
				}
				
			}
		} 
		if($this->page !=$end){
	 $links .= '<a href="' . $this->php_self . '?page=' . ($this->page+1) .'&search_text='.$text.'"><img src="../emailTemplates/images/next.png" width="19px" style="border:none;margin-top: -1px;margin-right: 0;" /></a>';
		}	
		 $links .='<input type="text" style="width:5%" name="pageno" id="pageno"/><input type="button" onclick="redirectpage2();" value="go to" />';
		//echo $links;
		return $links;
	}
	function renderNav3($prefix = '<span class="page_link">', $suffix = '</span>',$text,$text1) {
		if ($this->total_rows == 0)
			return FALSE;
		
		$batch = ceil($this->page / $this->links_per_page );
		$end = $batch * $this->links_per_page;
		if ($end == $this->page) {
			//$end = $end + $this->links_per_page - 1;
		//$end = $end + ceil($this->links_per_page/2);
		}
		if ($end > $this->max_pages) {
			$end = $this->max_pages;
		}
		$start = $end - $this->links_per_page + 1;
		$links = '';
		if($this->page !='1'){
		$links .= '<a href="' . $this->php_self . '?page=' . ($this->page-1) .'&search_text='.$text.'"><img src="../emailTemplates/images/previous.png" width="16px" style="border:none;margin-top: 2px;margin-right: 0;" /></a>';
		}
		for($i = $start; $i <= $end; $i ++) {
			if ($i == $this->page) {
			
			if($i>='4' && $i<=($end-3)){
			 $links .= $prefix . " $i " . $suffix.'...';
			}else{
				$links .= $prefix . " $i " . $suffix;
				}
			}
			elseif($i>='4' && $i<=($end-3)){
			
				if($i=='4'){
					$links .= '....';	
					}				
				}
			
			
			else {
			
				if(isset($text) && !isset($text1)){
				
				
				$links .= ' ' . $prefix . '<a href="' . $this->php_self . '?page=' . $i .'&search_text='.$text.'">' . $i . '</a>' . $suffix . ' ';
				}
				elseif(isset($text1) && isset($text)){
				
				$links .= ' ' . $prefix . '<a href="' . $this->php_self . '?page=' . $i .'&search_text='.$text.'&search_text1='.$text1.'">' . $i . '</a>' . $suffix . ' ';
				}
				elseif(isset($text1)){
				
				$links .= ' ' . $prefix . '<a href="' . $this->php_self . '?page=' . $i .'&search_text1='.$text1.'">' . $i . '</a>' . $suffix . ' ';
				}
				else
				{
			
				 $links .= ' ' . $prefix . '<a href="' . $this->php_self . '?page=' . $i .'">' . $i . '</a>' . $suffix . ' ';
				}
				
			}
		} 
		if($this->page !=$end){
	 $links .= '<a href="' . $this->php_self . '?page=' . ($this->page+1) .'&search_text='.$text.'"><img src="../emailTemplates/images/next.png" width="19px" style="border:none;margin-top: -1px;margin-right: 0;" /></a>';
		}	
		 $links .='<input type="text" style="width:5%" name="pageno" id="pageno"/><input type="button" onclick="redirectpage3();" value="go to" />';
		//echo $links;
		return $links;
	}
	
	/**
	 * Display full pagination navigation
	 *
	 * @access public
	 * @return string
	 */
	function renderFullNav() {
		return $this->renderFirst() . '&nbsp;' . $this->renderPrev() . '&nbsp;' . $this->renderNav() . '&nbsp;' . $this->renderNext() . '&nbsp;' . $this->renderLast();
	}
	
	/**
	 * Set debug mode
	 *
	 * @access public
	 * @param bool $debug Set to TRUE to enable debug messages
	 * @return void
	 */
	function setDebug($debug) {
		$this->debug = $debug;
	}
}

?>
<script>
function redirectpage()
{
	var page=document.getElementById("pageno").value
    window.location="http://stylflip.com/stylflip/sf_admin_control-panel/manageUsers.php?page="+page;
}
function redirectpage2()
{
	var page=document.getElementById("pageno").value
    window.location="http://stylflip.com/stylflip/sf_admin_control-panel/manageOrders.php?page="+page;
}
function redirectpage3()
{
	var page=document.getElementById("pageno").value
    window.location="http://stylflip.com/stylflip/sf_admin_control-panel/viewProducts.php?page="+page;
}
</script>