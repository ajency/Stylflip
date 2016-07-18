exports.get = function() {
	var _style = require('/components/styles/listView').get();
	
	var _clickCallback, _loadCallback, _scrollToBottomCallback, _pullToRefreshCallback;
	var _dataLength = 0;
	var _rowSpacing = -1;
	var _lazyLoadingType = 'auto';
	var _contentHeight = 0;
	
	var mainView = Ti.UI.createView(_style.mainView);
	// var pullToRefreshView = Ti.UI.createView(_style.pullToRefreshView);	
	// var lblPullToRefresh = Ti.UI.createLabel(_style.lblPullToRefresh);
	// pullToRefreshView.add(lblPullToRefresh);
	// mainView.add(pullToRefreshView);
	
	
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
	
	
	var _calculateContentHeight = function() {
		var lastChild = listView.children[listView.children.length - 1];
		var _point = lastChild.convertPointToView({x: 0, y: lastChild.top != undefined ? lastChild.top : 0 }, listView);
		_contentHeight = _point.y - listView.toImage().height;
	};
	

	/*
	 * Get image view
	 */
	var _getImageView = function(parentView, foundCallback) {
		for (i in parentView.children) {
            var child = parentView.children[0];
            if(child == '[object TiUIImageView]') {
            	foundCallback(parentView, child);
            	return;
            }
            else {
            	_getImageView(child, foundCallback);
            	return;
            }
        }    
        foundCallback(parentView, undefined);
	};	
	
	
	var _clearImageMemory = function(parentView) {
		_getImageView(parentView, function(parentView, imageView) {
			if(parentView && imageView) {
				parentView.remove(imageView);
			}
		});
	};
	
	
	var _enableLazyLoading = function(listViewInstance) {
		return;
		if(lazyLoad) {
			lazyLoad.removeFromMemory();
		}
		lazyLoad = require('/components/lazyLoad').get(listView, function(e) {
			// for(var i=e.firstVisibleIndex; i<=e.lastVisibleIndex; i++) {
				// _clearImageMemory(listView.children[i]);
			// }
		});
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
		var _listViewContentHeight = undefined;
		view.addEventListener('scroll', function(e) {
			try {
				if(_scrollToBottomCallback && Utils._.isFunction(_scrollToBottomCallback)) {
					var lastChild = this.children[this.children.length - 1];
					if(osname == 'android') {
						if(_listViewContentHeight == undefined) {
							_listViewContentHeight = 0;
							for(var i=0; i<this.children.length; i++) {
								_listViewContentHeight += (this.children[i].top != undefined ? this.children[i].top : 0) + this.children[i].rect.height;
							}
						}
						var firstChild = view.children[0];
						var _point = firstChild.convertPointToView({x: 0, y: firstChild.top != undefined ? firstChild.top : 0 }, this);
						var _lastChildPoint = lastChild.convertPointToView({x: 0, y: lastChild.top != undefined ? lastChild.top : 0 }, this);
						Ti.API.info(Math.ceil(_listViewContentHeight) + " => " + e.y + " => " + _lastChildPoint.y + " => " + this.rect.height + " => " + Math.abs(_point.y) + " => " + lastChild.rect.height);
						if(_listViewContentHeight%1 > 0) {
							_listViewContentHeight = Math.ceil(_listViewContentHeight) + 1;
						}
						Ti.API.info(_listViewContentHeight + " => " + ((e.y +_lastChildPoint.y) - (_lastChildPoint.y - this.rect.height)));
						if(_listViewContentHeight == ((e.y +_lastChildPoint.y) - (_lastChildPoint.y - this.rect.height))) {
							Ti.API.info('AWESOME MAN');
							// _scrollToBottomCallback();
						}
						
						if(e.y == Math.abs(_point.y) + lastChild.rect.height && e.y > this.rect.height) {
							console.log('COOL');
						}
					}
					else {
						var point = lastChild.convertPointToView({x: 0, y: lastChild.top != undefined ? lastChild.top : 0 }, this);
						if((point.y + lastChild.rect.height) == this.rect.height) {
							_scrollToBottomCallback();
						}
					}
				}
			}
			catch(e) {}
			
			// if(_contentHeight != undefined && e.y >= _contentHeight) {
				// if(_isScrolledToBottomTimeout) {
					// return;
				// }
				// Ti.API.info('cool');
				// _isScrolledToBottomTimeout = setTimeout(function() {
					// clearTimeout(_isScrolledToBottomTimeout);
					// _isScrolledToBottomTimeout = undefined;
				// }, 1000);
			// }
		});
		/*view.addEventListener('scroll', function(e) {
			try {
				if(_scrollToBottomCallback && Utils._.isFunction(_scrollToBottomCallback)) {
					var lastChild = this.children[this.children.length - 1];
					var point = lastChild.convertPointToView({x: 0, y: lastChild.top != undefined ? lastChild.top : 0 }, this);
					// Ti.API.info(((point.y + lastChild.rect.height) - 1) + " => " + this.rect.height);
					if((point.y + lastChild.rect.height) == this.rect.height) {
						_scrollToBottomCallback();
					}
				}
			}
			catch(e) {}
		});*/
		// view.addEventListener('scroll', function(e) {
			// if(e.y < 0) {
				// _currentY = e.y;
				// pullToRefreshView.visible = true;
				// // pullToRefreshView.height = Math.abs(_currentY);
				// // if(pullToRefreshView.height == 0) {
					// // pullToRefreshView.height = 1;
				// // }
				// // pullToRefreshView.animate({
					// // height: Math.abs(_currentY),
					// // duration: 1
				// // });
				// if(_tmpWidth * Math.abs(_currentY) > UI.platformWidth) {
					// lblPullToRefresh.text = 'Release to refresh';
				// }
				// else {
					// if(!_fireRefresh) {
						// lblPullToRefresh.text = 'Pull to refresh';
					// }
				// }
			// }
			// // else {
				// // pullToRefreshView.height = 0;
			// // }
		// });
		// view.addEventListener('scrollend', function(e) {
			// pullToRefreshView.visible = false;
			// if(_fireRefresh) {
				// _fireRefresh && Utils._.isFunction(pullToRefreshCallback) && pullToRefreshCallback();
				// _fireRefresh = false;
			// }
		// });
		// view.addEventListener('dragend', function(e) {
			// if(_tmpWidth * Math.abs(_currentY) > UI.platformWidth) {
				// lblPullToRefresh.text = 'Release to refresh';
				// _fireRefresh = true;
			// }
		// });
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
	var _setData = function(data) {
		if(listView) {
			listView.removeEventListener('click', _listViewClickListener);
			mainView.remove(listView);
			Window.clearMemory(listView);
			listView = null;
		}
		
		listView = _createListView();
		_enableLazyLoading(listView);
		
		listView.addEventListener('click', _listViewClickListener);
		mainView.add(listView);
		
		// _removeData();
		_dataLength = 0;
		
		if(data) {
			for(var i=0; i<data.length; i++) {
				data[i].index = i;
				if(i > 0 && _rowSpacing > -1) data[i].top = _rowSpacing;
				listView.add(data[i]);
				
				if(i == data.length - 1) {
					_calculateContentHeight();
				}
			}
			
			_dataLength = data.length;
			
			_fireEvent('load');
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
				_enableLazyLoading(listView);
				listView.addEventListener('click', _listViewClickListener);
			}
			
			for(var i=0; i<data.length; i++) {
				data[i].index = _dataLength + i;
				if(_rowSpacing > -1) data[i].top = _rowSpacing;
				listView.add(data[i]);
			}
			
			_dataLength = _dataLength + data.length;
			
			// lazyLoad.setRowsCount(_dataLength);
			
			_fireEvent('load');
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
				_enableLazyLoading(listView);
				listView.addEventListener('click', _listViewClickListener);
			}
			
			row.index = _dataLength;
			if(_rowSpacing > -1) row.top = _rowSpacing;
			listView.add(row);
			
			_dataLength = _dataLength + 1;
			
			// lazyLoad.setRowsCount(_dataLength);
			
			_fireEvent('load');
			listView.scrollToBottom();
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
		return;
		listView.add(_btnLazyLoad);
	};
	
	
	/*
	 * Hide lazy loading row
	 */
	var _hideLazyLoadingRow = function() {
		return;
		try {
			listView.remove(_btnLazyLoad);
		}
		catch(e) {}
	};
	
	
	
	/*
	 * Clear all variables and functions from memory
	 */
	var _removeFromMemory = function() {
		Window.clearMemory(mainView);
		mainView = null;
		if(listView) {
			listView.removeEventListener('click', _listViewClickListener);
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
