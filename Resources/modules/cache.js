exports.get = function() {
   	var _db;
	var _dbName = 'StylFlip';
	var _cacheTableName = 'StylFlipCache';
	
  	function _getEscapedRequestArgs(requestArgs) {
   		return escape(JSON.stringify(_sortObject(requestArgs)));
   	}
	
	
	function _log(message) {
		Ti.API.info(message);
	};
	
	
	function _connectToDatabase() {
		try {
			_db = Ti.Database.open(_dbName);
		} 
		catch(e) {
			_log('Error during accessing database: ' + JSON.stringify(e));
		}
	};
	
	
	/*
	 * Check if the table exists or not
	 */
	function _isTable(tableName) {
		_connectToDatabase();
		try {
	   		var resultSet = _db.execute('select * from ' + tableName);
		   	if(resultSet.isValidRow()) {
		   		_db.close();
		   		return true;		
		   	}
		   	_db.close();
		   	return false;
		}
		catch(e) {
		   return false;
		}
	};
	
	
    /*
     * 	Sort JSON object's keys  
     */ 
    function _sortObject(jsonObj) {
        var keys = Object.keys(jsonObj);
	  	
	  	keys.sort();
	  	
	  	var sortedObject = Object();
	  	
	  	for(i in keys) {
	    	key = keys[i];
		    sortedObject[key] = jsonObj[key];
	   	}
	   	
	  	return sortedObject;
    };
    
    
    var _saveData = function(url, requestArgs, response) {
    	// try {
			// _connectToDatabase();
			// var _columns = Object.keys(data[0]);
			// _db.execute('create table if not exists ' + tableName + ' (' + _columns.join(' text,') + ' text)');	
			// _db.execute('begin');
			// for(var i=0; i<data.length; i++) {
				// var _rowData = [];
				// for(key in data[i]) {
					// _rowData.push(Ti.Utils.base64encode(data[i][key]));
				// }
				// _db.execute('insert into ' + tableName + ' ("' + _columns.toString() + '") values ("' + _rowData.toString() +'")');
			// }
			// _db.execute('commit');
			// _db.close();
		// }
		// catch(e) {
			// _log('Error during caching data');
		// }
		try {
			_connectToDatabase();
			_db.execute('create table if not exists ' + _cacheTableName + ' (url text, requestArgs text, response text)');
        	_db.execute('insert into ' + _cacheTableName + ' values ("' + url + '", "' + escape(JSON.stringify(_sortObject(requestArgs))) + '", "' + escape(response) + '")');
			_db.close();
		}
		catch(e) {
			_log('Error during caching data: ' + JSON.stringify(e));
		}
    };
    
    
    var _getData = function(e) {
    	if(_isTable(_cacheTableName)) {
			_connectToDatabase();
			
			var _query = 'select response from ' + _cacheTableName + ' where url="' + e.url + '" and requestArgs="' + escape(JSON.stringify(_sortObject(e.requestArgs))) + '"';
	    	var _resultSet = _db.execute(_query);
	    	var _response;
	    	while (_resultSet.isValidRow()) {
				_response = _resultSet.fieldByName('response');
			  	_resultSet.next();
			}
			_resultSet.close();
        	_db.close();
        	if(_response) {
				Utils._.isFunction(e.success) && e.success(unescape(_response));
        	}
        	else {
        		Utils._.isFunction(e.error) && e.error();
        	}
		}
		else {
			Utils._.isFunction(e.error) && e.error();
		}
    };
    
    
    var _execute = function(query) {
		_connectToDatabase();
		
		var _data = [];
		
		try {
			var _resultSet = _db.execute(query);
    	
	    	var _rowIndex = 0;
			while (_resultSet.isValidRow()) {
				var _columnIndex = 0;
				_data[_rowIndex] = {};
				while (_columnIndex < _resultSet.getFieldCount()) {
					_data[_rowIndex][_resultSet.fieldName(_columnIndex)] = _resultSet.field(_columnIndex);
					_columnIndex++;
				}
				_rowIndex++;
				_resultSet.next();
			};
			
			_resultSet.close();
	    	_db.close();
	    	
	    	return _data;
		}
		catch(e) {
			_db.close();
			return _data;
		}
    };
    
    
    var _batchInsert = function(queries, callback) {
    	_connectToDatabase();
    	_db.execute('BEGIN;');
		for (var i = 0; i < queries.length; i++) {
			_db.execute(queries[i]);
		}
		_db.execute('COMMIT;');
		_db.close();
		Utils._.isFunction(callback) && callback();
    };
   
   
   	var _deleteData = function() {
   		_connectToDatabase();
   		// if(osname == 'android') {
   			// try {
	   			// var _query = 'delete from ' + _cacheTableName;
		    	// _db.execute(_query);
		    	// _db.close();
	   		// }
	   		// catch(e) {}
   		// }
   		// else {
   			// _db.getFile().deleteFile();
   		// }
   		try {
   			var _query = 'delete from ' + _cacheTableName;
	    	_db.execute(_query);
	    	_db.close();
   		}
   		catch(e) {}
   	};
   	
    // _deleteData();
   	
   	return {
   		saveData: _saveData,
   		getData: _getData,
   		deleteData: _deleteData,
   		isTable: _isTable,
   		batchInsert: _batchInsert,
   		execute: _execute
   	};
};