exports.get = function() {
	var _style = require('/components/styles/listView').get();
	
	var _clickCallback, _loadCallback, _scrollToBottomCallback, _pullToRefreshCallback, _scrollCallback;
	var _dataLength = 0;
	var _rowSpacing = -1;
	var _lazyLoadingType = 'auto';
	var _isLazyLoadingEnabled = true;
	var _isPullToRefreshEnabled = true;
	
	var mainView = Ti.UI.createView(_style.mainView);
	
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
	
	var listView;
	var lazyLoad;
	
	
	/*
	 * Get image view
	 */
	var _getImageViews = function(parentView, clear) {
        for(var i = 0; i < parentView.children.length; i++) {
        	if(parentView.children[i] == '[object TiUIImageView]') {
            	if(clear) {
            		//parentView.children[i].tmpImage = parentView.children[i].image;
            		//parentView.children[i].image = null;
					parentView.children[i].borderColor = 'red';
            	}
            	else {
            		parentView.children[i].borderColor = 'green';
            		// parentView.children[i].image = parentView.children[i].tmpImage;
            	}
        	}
        	else {
        		_getImageViews(parentView.children[i], clear);
        	}
        }
	};	
	
	
	var _clearImageMemory = function(parentView) {
		_getImageViews(parentView, true);
	};
	
	
	var _restoreImageViews = function(parentView) {
		_getImageViews(parentView, false);
	};
	
	
	/*
	 * Create a new instance of list view
	 */
	var _tmpWidth = UI.platformWidth / UI.height(50);
	var _createListView = function() {
		var _fireRefresh = false, _currentY;
		
		var view = Ti.UI.createScrollView(_style.listView);	
		view.add(Ti.UI.createView({
			height: Ti.UI.SIZE
		}));
		
		var _isScrolledToBottomTimeout;
		var rotate180 = Ti.UI.create2DMatrix({
			rotate: 180
		});
		var rotate0 = Ti.UI.create2DMatrix({
			rotate: 0
		});
		
		var _direction = 'down';
		var _lastYPosition;
		var _isProcessing = false, _topOffset = 1000;
		var _lastViewIndexCleared = 0;
		var _indexesCleared = [];
		var _scrollTimeout;
		
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
					if(lastChild.type != 'noDataLabel' && parseInt(this.rect.height) + (lastChild.top != undefined ? parseInt(lastChild.top) : 0) == parseInt((_lastChildPoint.y + lastChild.rect.height + (lastChild.bottom != undefined ? lastChild.bottom : 0)))) {
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
	 * List view click listener
	 */
	var _listViewClickListener = function(e) {
		var child = _getChild(e.source, function(child) {
			var data = {
				index: child.index,
				row: child
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
		
		if(listView) {
			listView.removeEventListener('singletap', _listViewClickListener);
			mainView.remove(listView);
			Window.clearMemory(listView);
			listView = null;
		}
		
		listView = _createListView();
		
		listView.addEventListener('singletap', _listViewClickListener);
		mainView.add(listView);
		
		// _removeData();
		_dataLength = 0;
		
		if(data) {
			for(var i=0; i<data.length; i++) {
				data[i].index = i;
				if(i > 0 && _rowSpacing > -1) data[i].top = _rowSpacing;
				listView.add(data[i]);
			}
			
			_dataLength = data.length;
			
			_fireEvent('load');
			
			if(_dataLength > 0) {
				_setContentHeight();
			}
		}
		
		// lazyLoad.setRowsCount(_dataLength);
	};
	
	/*
	 * Append data to list view
	 */
	var _appendData = function(data) {
		if(data) {
			if(!listView) {
				listView = _createListView();
				listView.addEventListener('singletap', _listViewClickListener);
			}
			
			for(var i=0; i<data.length; i++) {
				data[i].index = _dataLength + i;
				if(_rowSpacing > -1) data[i].top = _rowSpacing;
				listView.add(data[i]);
			}
			
			_dataLength = _dataLength + data.length;
			
			// lazyLoad.setRowsCount(_dataLength);
			
			_fireEvent('load');
			
			if(_dataLength > 0 && data.length > 0) {
				_setContentHeight();
			}
		}
	};


	/*
	 * Prepend a single row/view to list view
	 */
	var _prependRow = function(row) {
		if(row) {
			if(listView.children.length > 0) {
				row.top = 0;
				listView.children[0].add(row);
				var _top = 0;
				for(var i=listView.children[0].children.length-1; i>=0; i--) {
					listView.children[0].children[i].top = _top;
					if(isNaN(listView.children[0].children[i].height)) {
						listView.children[0].children[i].height = listView.children[0].children[i].toImage().height;
					}
					_top += listView.children[0].children[i].height;
				}
			}
			else {
				listView.add(row);
			}
		}
	};

	
	/*
	 * Append a single row/view to list view
	 */
	var _appendRow = function(row) {
		if(row) {
			if(!listView) {
				listView = _createListView();
				listView.addEventListener('singletap', _listViewClickListener);
			}
			
			row.index = _dataLength;
			if(_rowSpacing > -1) row.top = _rowSpacing;
			listView.add(row);
			
			_dataLength = _dataLength + 1;
			
			// lazyLoad.setRowsCount(_dataLength);
			
			_fireEvent('load');
			listView.scrollToBottom();
			
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
	 * Set bg color
	 */
	var _setBackgroundColor = function(bgColor) {
		mainView.backgroundColor = bgColor?bgColor:'transparent';
	};
	
	
	/*
	 * Set height
	 */
	var _setHeight = function(height) {
		mainView.height = height;
	};
	
	
	/*
	 * Set top
	 */
	var _setTop = function(top) {
		mainView.top = top;
	};


	/*
	 * Set bottom
	 */
	var _setBottom = function(bottom) {
		mainView.bottom = bottom;
	};
	
	/*
	 * Show list view
	 */
	var _show = function() {
		mainView.visible = true;
	};
	
	/*
	 * Show list view
	 */
	var _hide = function() {
		mainView.visible = false;
	};


	/*
	 * Scroll to bottom
	 */
	var _scrollToBottom = function() {
		listView.scrollToBottom();
	};
	
	
	/*
	 * Show lazy loading row
	 */
	var _showLazyLoadingRow = function() {
		_isLazyLoadingEnabled = true;
		return;
		listView.add(_btnLazyLoad);
	};
	
	
	/*
	 * Hide lazy loading row
	 */
	var _hideLazyLoadingRow = function() {
		_isLazyLoadingEnabled = false;
		return;
		try {
			listView.remove(_btnLazyLoad);
		}
		catch(e) {}
	};
	
	
	/*
	 * Set content height
	 */
	var _setContentHeight = function() {
		if(osname != 'android') {
			try {
				var lastChild = listView.children[listView.children.length - 1];
				var _lastChildPoint = lastChild.convertPointToView({x: 0, y: lastChild.top != undefined ? lastChild.top : 0 }, listView);
				if(_lastChildPoint.y + lastChild.rect.height < listView.rect.height) {
					listView.contentHeight = listView.rect.height + 1;
				}
				else {
					listView.contentHeight = 'auto';
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
		if(listView) {
			listView.removeEventListener('singletap', _listViewClickListener);
		}
		_rowSpacing = null;
		listView = null;
		_clickCallback = null;
		_loadCallback = null;
		_scrollToBottomCallback = null;
		_pullToRefreshCallback = null;
		_getChild = null;
		_listViewClickListener = null;
		_getView = null;
		_setData = null;
		_appendData = null;
		_prependRow = null;
		_appendRow = null;
		_removeData = null;
		_fireEvent = null;
		_addEventListener = null;
		_setRowSpacing = null;
		_setBackgroundColor = null;
		_setTop = null;
		_setBottom = null;
		_setHeight = null;
		_show = null;
		_hide = null;
		_scrollToBottom = null;
		_showLazyLoadingRow = null;
		_hideLazyLoadingRow = null;
		_isLazyLoadingEnabled = null;
		_setContentHeight = null;
		_removeFromMemory = null;
	};
	
	return {
		getView: _getView,
		setData: _setData,
		appendData: _appendData,
		prependRow: _prependRow,
		appendRow: _appendRow,
		addEventListener: _addEventListener,
		setRowSpacing: _setRowSpacing,
		setBackgroundColor: _setBackgroundColor,
		setTop: _setTop,
		setBottom: _setBottom,
		setHeight: _setHeight,
		show: _show,
		hide: _hide,
		scrollToBottom: _scrollToBottom,
		showLazyLoadingRow: _showLazyLoadingRow,
		hideLazyLoadingRow: _hideLazyLoadingRow,
		removeFromMemory: _removeFromMemory
	};
};
