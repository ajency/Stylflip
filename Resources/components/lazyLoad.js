exports.get = function(listView, callBack, scrollDirection) {
    var _viewRef = this;    
    var _isLoading = false;
    var _loadingRow, _viewMoreRow;
    var _isTableView = (listView == '[object TiUITableView]')?true:false;
    var _dataLength = 0;
    
    if(_isTableView) {
        _loadingRow = Ti.UI.createTableViewRow({isAppended:false, title:'Loading...'});
        _viewMoreRow = Ti.UI.createTableViewRow({isAppended:false, title:'View More'});
    }
    else {
        _loadingRow = Ti.UI.createLabel({isAppended:false, text:'Loading...'});
        _viewMoreRow = Ti.UI.createLabel({isAppended:false, text:'View More'});
    }
    
    var _topOffset = 0;
    var _bottomOffset = 50;
    var _rowHeight = undefined;
    var _rowsCount = undefined;
    var _scrollDirection = (scrollDirection)?scrollDirection:'down';
    var _tmpScrollDirection = undefined;
    var _loadingType = undefined;
    
    var _firstVisibleIndex = undefined;
    var _lastVisibleIndex = undefined;
    var _lastContentOffset = undefined;
    
    var _viewMoreRowClickListener = undefined;
    var _listViewScrollListener = undefined;
    
    
    //  If list view is scrolled or 'View More' row is clicked
    var _lazyLoadHandler = function() {
        if(_isLoading) {
            return;
        }
        _isLoading = true;
        _appendLoadingRow();
        
        _notify(response, _requestArgs);
    };
    
    
    //  Append lazy loading row
    var _appendLoadingRow = function() {
        if(listView == '[object TiUITableView]') {
            listView.appendRow(_loadingRow); 
        }
        else {
            listView.add(_loadingRow); 
        }
        _loadingRow.isAppended = true;
    };
    
    
    //  Remove lazy loading row
    var _removeLoadingRow = function() {
        if(listView == '[object TiUITableView]') {
            listView.deleteRow(_loadingRow);
        }
        else {
            listView.remove(_loadingRow);
        }    
        _loadingRow.isAppended = false;
    };
    
    
    var _recentFirstVisibleIndexSent, _recentLastVisibleIndexSent;
    
    //  Set loading type
    var _setLoadingType = function(loadingType /* either auto or manual - if auto no need to be set */) {
        _loadingType = loadingType;
        
        // Add listeners according to loading type
        
        if(_loadingType == 'manual') {
            if(!_viewMoreRowClickListener) {
                
                 //  Load more data row click handler
                _viewMoreRowClickListener = function() {
                    _lazyLoadHandler();
                };
                
                //  Load more data row click listener
                _viewMoreRow.addEventListener('click', _viewMoreRowClickListener);                       
            }
            
            //  Remove list view scroll listener as it will not be needed
            if(_listViewScrollListener) {
                listView.removeEventListener('scroll', _listViewScrollListener);
                _listViewScrollListener = undefined;
            }
        }
        else {
            if(!_listViewScrollListener) {
                
                // listView scroll event handler
                _listViewScrollListener = function(e) {
                    if(!_isLoading) {                   //  If not loading then proceed
                        if(_isTableView) {
                        	if(listView.data[0].rows.length == 0) {
                        		return;
                        	}
                            _rowHeight = listView.data[0].rows[0].height;                       //  Calculate single row height
                            if(typeof(_rowHeight) != 'number') {                                //  Check if height is not set to 'auto'
                                _rowHeight = listView.data[0].rows[0].toImage().height;         //  Calculate single row height
                            }
                        }
                        else {
                        	if(listView.children.length == 0) {
                        		return;
                        	}
                            _rowHeight = listView.children[0].height;
                            if(typeof(_rowHeight) != 'number') {                                //  Check if height is not set to 'auto'
                                _rowHeight = listView.children[0].toImage().height;             //  Calculate single row height
                            }
                        }
                        
                        // var scrollTimeout = setTimeout(function() {
                            // _isLoading = false;
                            // scrollTimeout = null;
                        // }, 250);
                        
                        var offsetY = e.contentOffset?e.contentOffset.y:e.y;
                        var contentHeight = e.contentSize?e.contentSize.height:_rowsCount*_rowHeight;
                        var listViewHeight = e.contentSize?e.size.height:listView.toImage().height;
                        
                        //  Check whether listView is being scrolled up or down
                        if(_lastContentOffset == undefined && offsetY < 0) {
                            _tmpScrollDirection = 'up';
                        }
                        else if(_lastContentOffset != undefined && offsetY < _lastContentOffset) {
                            _tmpScrollDirection = 'up';
                        }
                        else if(_lastContentOffset != undefined && offsetY > _lastContentOffset) {
                            _tmpScrollDirection = 'down';
                        }
                        
                        if(_tmpScrollDirection == undefined) {
                            if(offsetY < 0) {
                                _tmpScrollDirection = 'up';
                            }
                            else {
                                _tmpScrollDirection = 'down';
                            }
                        }
                        
                        
                        //_dataLength = listView.data[0].rows.length;                   //  For table view
                        _dataLength = _rowsCount; // Math.floor(e.contentSize.height/_rowHeight);      //  For table and scroll view
                        
                        //  Calculate first & last visible row index of listView
                        _firstVisibleIndex = Math.floor(offsetY/_rowHeight);
                        
                        if(_firstVisibleIndex < 0) {
                            _firstVisibleIndex = 0;
                        }
                        
                        if(_dataLength <= 1) {                          //  If only one row
                            _lastVisibleIndex = _firstVisibleIndex;
                        }
                        else if(contentHeight < listViewHeight) { //  If rows are less than listView height
                            _lastVisibleIndex = _dataLength - 1;
                        }
                        else {
                            _lastVisibleIndex = Math.floor((offsetY+listViewHeight)/_rowHeight);
                            if(_lastVisibleIndex >= _dataLength) {
                                _lastVisibleIndex = _dataLength - 1;
                            }
                        }
                        
                        //  If listView is being scrolled up or down
                        if((contentHeight < listViewHeight || (offsetY + listViewHeight) > contentHeight + _bottomOffset)) {
                            _lazyLoadHandler();
                        }
                        else {
                            //_isLoading = true;
                            if(callBack && _recentFirstVisibleIndexSent != _firstVisibleIndex) {
                            	_recentFirstVisibleIndexSent = _firstVisibleIndex;
                            	_recentLastVisibleIndexSent = _lastVisibleIndex;
                                callBack({firstVisibleIndex: _firstVisibleIndex, lastVisibleIndex: _lastVisibleIndex, scrollDirection: _tmpScrollDirection});
                            }
                        }
                        
                        //  Store last content offset Y for further reference
                        _lastContentOffset = offsetY;  
                    }
                };
                
                // listView scroll event listener
                listView.addEventListener('scroll', _listViewScrollListener);
            }
            
            //  Remove 'View More' row click listener as it will not be needed
            if(_viewMoreRowClickListener) {
                _viewMoreRow.removeEventListener('click', _viewMoreRowClickListener);
                _viewMoreRowClickListener = undefined;
            }
        }
    };
    
    
    var _setRowsCount = function(rowsCount) {
    	_rowsCount = rowsCount;
    };
    

    //  Set default loading type as auto
    _setLoadingType('auto');
    
    
    //  Clear references from memory
    var _removeFromMemory = function() {
        if(_viewMoreRowClickListener) {
            _viewMoreRow.removeEventListener('click', _viewMoreRowClickListener);
            _viewMoreRowClickListener = null;
            
        }
        
        if(_listViewScrollListener) {
            listView.removeEventListener('scroll', _listViewScrollListener);
            _listViewScrollListener = null;
        }
        
        _isLoading = null;
        _loadingRow = null;
        _rowHeight = null;
        _rowsCount = null;
        _isTableView = null;
        _dataLength = null;
        _viewMoreRow = null;
        _topOffset = null;
        _bottomOffset = null;
        _scrollDirection = null;
        _tmpScrollDirection = null;
        _loadingType = null;
        
        _firstVisibleIndex = null;
        _lastVisibleIndex = null;
        _lastContentOffset = null;

        _LazyLoadingHandler = null;
        _appendLoadingRow = null;
        _removeLoadingRow = null;
        _setLoadingType = null;
        _notify = null;
        _setRowsCount = null;
        _removeFromMemory = null;
    };
    
    return {
        setLoadingType: _setLoadingType,
        setRowsCount: _setRowsCount,
        removeFromMemory: _removeFromMemory
    };
};