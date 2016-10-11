<?php

/* backup the db OR just a table */
	function backup_tables($host,$user,$pass,$name,$tables = '*')
	{
		$link = mysql_connect($host,$user,$pass);
		mysql_select_db($name,$link);
		
		//get all of the tables
		if($tables == '*')
		{
			$tables = array();
			$result = mysql_query('SHOW TABLES');
			while($row = mysql_fetch_row($result))
			{
				$tables[] = $row[0];
			}
		}
		else
		{
			$tables = is_array($tables) ? $tables : explode(',',$tables);
		}
		
		$return = '';
		
		//cycle through
		foreach($tables as $table)
		{
			$result = mysql_query('SELECT * FROM '.$table);
			$num_fields = mysql_num_fields($result);
			
			// $return.= 'DROP TABLE '.$table.';';
			$row2 = mysql_fetch_row(mysql_query('SHOW CREATE TABLE '.$table));
			$return.= "\n\n".$row2[1].";\n\n";
			
			for ($i = 0; $i < $num_fields; $i++) 
			{
				while($row = mysql_fetch_row($result))
				{
					$return.= 'INSERT INTO '.$table.' VALUES(';
					for($j=0; $j < $num_fields; $j++) 
					{
						$row[$j] = addslashes($row[$j]);
						$row[$j] = ereg_replace("\n","\\n",$row[$j]);
						if (isset($row[$j])) { $return.= '"'.$row[$j].'"' ; } else { $return.= '""'; }
						if ($j < ($num_fields-1)) { $return.= ','; }
					}
					$return.= ");\n";
				}
			}
			$return.="\n\n\n";
		}
		
		$filename = 'sf-backup.sql';

		//save file
		$handle = fopen($filename, 'w+');
		fwrite($handle, $return);
		fclose($handle);
		
		header('Content-type: text/appdb');
        header('Content-Disposition: attachment; filename="' . $filename);
        readfile($filename);
		@unlink($filename);
	}

	backup_tables('localhost','root','rTa0Q5zUEbew','styleflip');

/*
include('dbimexport.php');

$db_config = Array
            ( 
                'dbtype' => "MYSQL",
                'host' => "localhost",
                'database' => "styleflip",
                'user' => "root",
                'password' => "rTa0Q5zUEbew",
            );
$dbimexport = new dbimexport($db_config);

$_GET['select'] = isset($_GET['select']) ? $_GET['select'] : "";

switch( $_GET['select'] )
{
    case "download_inline":
                                    $dbimexport->download_path = "";
                                    $dbimexport->download = true;
                                    $dbimexport->file_name = date("Y-m-d_H-i-s");
                                    $dbimexport->export();
                                    break;

    case "save_to_disc":
                                    $dbimexport->download = false;
                                    $dbimexport->download_path = $_SERVER['DOCUMENT_ROOT'];
                                    $dbimexport->file_name = "auto_save";
                                    $dbimexport->export();
                                    break;

    case "import":
                                    $dbimexport->import_path = $_SERVER['DOCUMENT_ROOT'] . "/auto_save.xml";
                                    $dbimexport->import();
                                    break;
}
*/
?>