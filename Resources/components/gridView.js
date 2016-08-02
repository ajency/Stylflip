// exports.get = function(width, columnLength, margin, lazyLoadingCallback, pullToRefreshCallback) {
exports.get = function(config) {
	var _style = require('/components/styles/gridView').get();
	 
	var _clickCallback, _loadCallback, _scrollToBottomCallback, _pullToRefreshCallback, _scrollCallback;
	var _dataLength = 0;
	var _rowSpacing = -1;
	var _margin = config.margin?config.margin:UI.left(5);
	var _columnLength = config.columnLength?config.columnLength:1;
	var _width = config.width?config.width:UI.width(320);
	var _columnTop = -1;
	var _isLazyLoadingRowAdded = false;
	var _isLazyLoadingEnabled = true;
	var _isPullToRefreshEnabled = true;
	
	
	var mainView = Ti.UI.createView(_style.mainView);	
	mainView.width = _width;
	
	/*
	 * Pull to refresh view
	 */
	var pullToRefreshView = Ti.UI.createView(_style.pullToRefreshView);	
	var pullToRefreshCotainer = Ti.UI.createView(_style.pullToRefreshCotainer);
	var imgArrow = Ti.UI.createImageView(_style.imgArrow);
	var lblPullToRefresh = Ti.UI.createLabel(_style.lblPullToRefresh);
	pullToRefreshCotainer.add(imgArrow);
	pullToRefreshCotainer.add(lblPullToRefresh);
	pullToRefreshView.add(pullToRefreshCotainer);
	if(osname != 'android') {
		mainView.add(pullToRefreshView);
	}
	
	
	var _btnLazyLoad = UI.createButton(Utils._.extend({}, _commonStyle.smallButton, {
    	title: 'Load More',
    	width: UI.platformWidth,
    	height: UI.height(40),
    	top: UI.top(-1),
    	borderWidth: 1,
    	borderColor: '#f4f4f4'
    }));
    _btnLazyLoad.addEventListener('click', function() {
    	_hideLazyLoadingRow();
    	Utils._.isFunction(_scrollToBottomCallback) && _scrollToBottomCallback();
    });
	
	
	var _columnWidth = (mainView.width - ((_columnLength+1) * _margin)) / _columnLength;
	
	
	var gridView;
	
	
	/*
	 * Create a new instance of list view
	 */
	var _tmpWidth = UI.platformWidth / UI.height(50);
	var _createGridView = function() {
		var _fireRefresh = false, _isHeightSet = false, _currentY;
		
		var view = Ti.UI.createScrollView(_style.gridView);
		
		var _isScrolledToBottomTimeout;
		var rotate180 = Ti.UI.create2DMatrix({
			rotate: 180
		});
		var rotate0 = Ti.UI.create2DMatrix({
			rotate: 0
		});
		
		if(osname == 'android' && _isPullToRefreshEnabled && _pullToRefreshCallback) {
			var refreshControl = require('com.rkam.swiperefreshlayout').createSwipeRefresh({
		    	view: view
		    });
		    refreshControl.addEventListener('refreshing', function() {
		    	refreshControl.setRefreshing(true);
		        refreshControl.setRefreshing(false);
		        if(Utils._.isFunction(_pullToRefreshCallback)) {
		        	_pullToRefreshCallback();
		        }
		    });
	    	mainView.add(refreshControl);
		}
		
		view.addEventListener('scroll', function(e) {
			Utils._.isFunction(_scrollCallback) && _scrollCallback(e); 
			
			if(_isLazyLoadingEnabled && _scrollToBottomCallback && Utils._.isFunction(_scrollToBottomCallback)) {
				try {
					if(_isScrolledToBottomTimeout) {
						return;
					}
					var lastChild = this.children[this.children.length - 1];
					var _lastChildPoint = lastChild.convertPointToView({x: 0, y: lastChild.top != undefined ? lastChild.top : 0 }, this);
					
					// if(lastChild.type != 'noDataLabel' && this.rect.height + (lastChild.top != undefined ? lastChild.top : 0) == (_lastChildPoint.y + lastChild.rect.height + (lastChild.bottom != undefined ? lastChild.bottom : 0))) {
					
					// Ti.API.info((parseInt(this.rect.height) + (lastChild.top != undefined ? parseInt(lastChild.top) : 0)) + " => " + (parseInt((_lastChildPoint.y + lastChild.rect.height + (lastChild.bottom != undefined ? lastChild.bottom : 0)))));
					
					// if(lastChild.type != 'noDataLabel' && parseInt(this.rect.height) + (lastChild.top != undefined ? parseInt(lastChild.top) : 0) == parseInt((_lastChildPoint.y + lastChild.rect.height + (lastChild.bottom != undefined ? lastChild.bottom : 0)))) {	
					if(lastChild.type != 'noDataLabel' && parseInt(this.rect.height) + (lastChild.top != undefined ? parseInt(lastChild.top) : 0) == parseInt((_lastChildPoint.y + lastChild.rect.height + (lastChild.bottom != undefined ? lastChild.bottom : 0)))) {	
						_scrollToBottomCallback();
						_isScrolledToBottomTimeout = setTimeout(function() {
							clearTimeout(_isScrolledToBottomTimeout);
							_isScrolledToBottomTimeout = undefined;
						}, 1000);
					}
					else if(lastChild.type != 'noDataLabel' && parseInt(this.rect.height) + (lastChild.top != undefined ? parseInt(lastChild.top) : 0) - 1 == parseInt((_lastChildPoint.y + lastChild.rect.height + (lastChild.bottom != undefined ? lastChild.bottom : 0)))) {
						_scrollToBottomCallback();
						_isScrolledToBottomTimeout = setTimeout(function() {
							clearTimeout(_isScrolledToBottomTimeout);
							_isScrolledToBottomTimeout = undefined;
						}, 1000);
					}
				}
				catch(e){ }
			}
			
			if(osname != 'android' && _isPullToRefreshEnabled && Utils._.isFunction(_pullToRefreshCallback)) {
				if(e.y < 0) {
					_currentY = e.y;
					pullToRefreshView.visible = true;
					if(_tmpWidth * Math.abs(_currentY) > UI.platformWidth) {
						lblPullToRefresh.text = 'Release to refresh';
						imgArrow.animate({
							transform: rotate180,
							duration: 250
						});
					}
					else {
						if(!_fireRefresh) {
							lblPullToRefresh.text = 'Pull to refresh';
							imgArrow.animate({
								transform: rotate0,
								duration: 250
							});
						}
					}
				}
				else {
					pullToRefreshView.visible = false;
				}
			}
		});
		
		if(osname != 'android') {
			view.addEventListener('scrollend', function(e) {
				if(_isPullToRefreshEnabled && Utils._.isFunction(_pullToRefreshCallback)) {
					pullToRefreshView.visible = false;
					if(_fireRefresh) {
						_pullToRefreshCallback();
						_fireRefresh = false;
					}
				}
			});
			view.addEventListener('dragend', function(e) {
				if(_isPullToRefreshEnabled && Utils._.isFunction(_pullToRefreshCallback)) {
					if(_tmpWidth * Math.abs(_currentY) > UI.platformWidth) {
						lblPullToRefresh.text = 'Release to refresh';
						imgArrow.animate({
							transform: rotate180,
							duration: 250
						});
						_fireRefresh = true;
					}
				}
			});
		}
		
		return view;
	};
	
	
	/*
	 * Get clicked child of list view
	 */
	var _getChild = function(view, foundCallback) {
		if(view.index != null || view.index != undefined) {
			foundCallback(view);
		}
		else {
			view && view.parent && _getChild(view.parent, foundCallback);
		}
	};
	
	
	/*
	 * Grid view click listener
	 */
	var _gridViewClickListener = function(e) {
		var child = _getChild(e.source, function(child) {
			var data = {
				index: child.index,
				column: child
			};
			
			_fireEvent('click', data);			
		});
	};
	
	/*
	 * Return instance of this component
	 */
	var _getView = function() {
		return mainView;
	};
	
	/*
	 * Component's internal listeners to be listened by external screens
	 */
	var _addEventListener = function(type, listener) {
		switch(type) {
			case 'click':
				_clickCallback = listener;
			break;
			
			case 'load':
				_loadCallback = listener;
			break;
			
			case 'scrolledToBottom':
				_scrollToBottomCallback = listener;
			break;
			
			case 'pullToRefresh':
				_pullToRefreshCallback = listener;
			break;
			
			case 'scroll':
				_scrollCallback = listener;
			break;
		}
	};
	
	/*
	 * Notify screen using this component
	 */
	var _fireEvent = function(eventToFire, eventData) {
		switch(eventToFire) {
			case 'click':
				Utils._.isFunction(_clickCallback) && _clickCallback(eventData);
			break;
			
			case 'load':
				Utils._.isFunction(_loadCallback) && _loadCallback(eventData);
			break;
		}
	};
	
	/*
	 * Remove data from list view
	 */
	var _removeData = function() {
		Window.clearMemory(mainView);
	};
	
	/*
	 * Set new data to list view
	 */
	var _setData = function(data, enablePullToRefresh) {
		if(enablePullToRefresh != undefined && enablePullToRefresh == false) {
			_isPullToRefreshEnabled = false;
		}
		else {
			_isPullToRefreshEnabled = true;
		}
		
		if(gridView) {
			gridView.removeEventListener('singletap', _gridViewClickListener);
			mainView.remove(gridView);
			Window.clearMemory(gridView);
			gridView = null;
		}

		_removeData();
		
		gridView = _createGridView();
		gridView.addEventListener('singletap', _gridViewClickListener);
		mainView.add(gridView);
		
		
		_dataLength = 0;
		
		if(data) {
			for(var i=0; i<data.length; i++) {
				data[i].index = i;
				// if(i > 0 && _rowSpacing > -1) data[i].top = _rowSpacing;
				if(_columnTop > -1) {
					data[i].top = (data[i].index >= 0 && data[i].index < _columnLength) ? _columnTop : _margin / 2;
				}
				else {
					data[i].top = (data[i].index >= 0 && data[i].index < _columnLength) ? 0 : _margin / 2;
				}
				data[i].bottom = _margin/2;
				data[i].left = _margin; // (data[i].index%2==0)?_margin*2:_margin;
				gridView.add(data[i]);
			}
			
			_dataLength = data.length;
			
			_fireEvent('load');
			
			if(_dataLength > 0) {
				_setContentHeight();
			}
		}
	};
	
	/*
	 * Append data to list view
	 */
	var _appendData = function(data) {
		if(data) {
			if(!gridView) {
				gridView = _createGridView();
				gridView.addEventListener('singletap', _gridViewClickListener);
			}
			
			for(var i=0; i<data.length; i++) {
				data[i].index = _dataLength + i;
				// if(i > 0 && _rowSpacing > -1) data[i].top = _rowSpacing;
				if(_columnTop > -1) {
					data[i].top = (data[i].index >= 0 && data[i].index < _columnLength) ? _columnTop : _margin / 2;
				}
				else {
					data[i].top = (data[i].index >= 0 && data[i].index < _columnLength) ? 0 : _margin / 2;
				}
				data[i].left = _margin; // (data[i].index%2==0)?_margin*2:_margin;
				gridView.add(data[i]);
			}
			
			_dataLength = _dataLength + data.length;
			
			_fireEvent('load');
			
			if(_dataLength > 0 && data.length > 0) {
				_setContentHeight();
			}
		}
	};
	
	/*
	 * Append a single row/view to list view
	 */
	var _appendColumn = function(column) {
		if(column) {
			if(!gridView) {
				gridView = _createGridView();
				gridView.addEventListener('singletap', _gridViewClickListener);
			}
			
			column.index = _dataLength;
			// if(i > 0 && _rowSpacing > -1) data[i].top = _rowSpacing;
			if(_columnTop > -1) {
				column.top = (column.index >= 0 && column.index < _columnLength) ? _columnTop : _margin / 2;
			}
			else {
				column.top = (column.index >= 0 && column.index < _columnLength) ? 0 : _margin / 2;
			}
			column.left = _margin; // (column.index%2==0)?_margin*2:_margin;
			gridView.add(column);
			
			_dataLength = _dataLength + 1;
			
			_fireEvent('load');
			
			if(_dataLength > 0) {
				_setContentHeight();
			}
		}
	};
	
	
	/*
	 * Set row spacing
	 */
	var _setRowSpacing = function(rowSpacing) {
		_rowSpacing = rowSpacing?rowSpacing:_rowSpacing;
	};
	
	
	/*
	 * Set margin
	 */
	var _getSingleColumnWidth = function() {
		return _columnWidth;
	};
	
	
	/*
	 * Set bg color
	 */
	var _setBackgroundColor = function(bgColor) {
		mainView.backgroundColor = bgColor?bgColor:'transparent';
	};
	
	
	/*
	 * Set top
	 */
	var _setTop = function(top) {
		mainView.top = top?top:0;
	};
	
	
	/*
	 * Set column top
	 */
	var _setColumnTop = function(columnTop) {
		_columnTop = columnTop?columnTop:_columnTop;
	};


	/*
	 * Show lazy loading row
	 */
	var _showLazyLoadingRow = function() {
		_isLazyLoadingEnabled = true;
		return;
		gridView.add(_btnLazyLoad);
		_isLazyLoadingRowAdded = true;
	};
	
	
	/*
	 * Hide lazy loading row
	 */
	var _hideLazyLoadingRow = function() {
		_isLazyLoadingEnabled = false;
		return;
		try {
			gridView.remove(_btnLazyLoad);
		}
		catch(e) {}
		_isLazyLoadingRowAdded = false;
	};
	
	
	var _deleteColumn = function(column) {
		for(var i=0; i<gridView.children.length; i++) {
			if(gridView.children[i].index == column.index) {
				gridView.remove(gridView.children[i]);
				break;
			}
		}
		
		//	Column rearrange logic
		for(var i=0; i<gridView.children.length; i++) {
			gridView.children[i].index = i;
			if(_columnTop > -1) {
				gridView.children[i].top = (gridView.children[i].index >= 0 && gridView.children[i].index < _columnLength) ? _columnTop : _margin / 2;
			}
			else {
				gridView.children[i].top = (gridView.children[i].index >= 0 && gridView.children[i].index < _columnLength) ? 0 : _margin / 2;
			}
			gridView.children[i].bottom = _margin/2;
			gridView.children[i].left = _margin; // (gridView.children[i].index%2==0)?_margin*2:_margin;
		}
	};
	
	
	/*
	 * Get column count
	 */
	var _getColumnCount = function() {
		return _isLazyLoadingRowAdded ? gridView.children.length - 1 : gridView.children.length;
	};
	
	
	/*
	 * Set content height
	 */
	var _setContentHeight = function() {
		if(osname != 'android') {
			try {
				var lastChild = gridView.children[gridView.children.length - 1];
				var _lastChildPoint = lastChild.convertPointToView({x: 0, y: lastChild.top != undefined ? lastChild.top : 0 }, gridView);
				if(Math.round(_lastChildPoint.y) + Math.round(lastChild.rect.height) < Math.round(gridView.rect.height)) {
					gridView.contentHeight = gridView.rect.height + 1;
				}
				else {
					gridView.contentHeight = 'auto';
				}
			}
			catch(e) {}
		}
	};
	
	
	/*
	 * Clear all variables and functions from memory
	 */
	var _removeFromMemory = function() {
		Window.clearMemory(mainView);
		mainView = null;
		if(gridView) {
			gridView.removeEventListener('singletap', _gridViewClickListener);
		}
		_rowSpacing = null;
		_margin = null;
		_columnLength = null;
		_columnWidth = null;
		_width = null;
		gridView = null;
		_clickCallback = null;
		_loadCallback = null;
		_getChild = null;
		_gridViewClickListener = null;
		_getView = null;
		_setData = null;
		_appendData = null;
		_appendColumn = null;
		_removeData = null;
		_fireEvent = null;
		_addEventListener = null;
		_setRowSpacing = null;
		_setBackgroundColor = null;
		_setTop = null;
		_getSingleColumnWidth = null;
		_setColumnTop = null;
		_showLazyLoadingRow = null;
		_hideLazyLoadingRow = null;
		_deleteColumn = null;
		_getColumnCount = null;
		_isLazyLoadingEnabled = null;
		_setContentHeight = null;
		_removeFromMemory = null;
	};
	
	return {
		getView: _getView,
		setData: _setData,
		appendData: _appendData,
		appendColumn: _appendColumn,
		addEventListener: _addEventListener,
		setRowSpacing: _setRowSpacing,
		getSingleColumnWidth: _getSingleColumnWidth,
		setBackgroundColor: _setBackgroundColor,
		setTop: _setTop,
		setColumnTop: _setColumnTop,
		showLazyLoadingRow: _showLazyLoadingRow,
		hideLazyLoadingRow: _hideLazyLoadingRow,
		deleteColumn: _deleteColumn,
		getColumnCount: _getColumnCount,
		setContentHeight: _setContentHeight,
		removeFromMemory: _removeFromMemory
	};
};
