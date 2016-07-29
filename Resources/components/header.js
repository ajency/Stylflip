exports.get = function(config) {
	var _style = require('/components/styles/header').get();
	
	var _clickCallback, _filterCallback, _currentFilterType;
	var btnMenuView, btnBackView;
	
	var headerContainerView = Ti.UI.createView(Utils._.extend({}, _style.headerContainerView, {
	    height: isIOS7Plus?UI.height(65):UI.height(45)
	}));
	
	if(isIOS7Plus) {
	    var statusBar = Ti.UI.createView(_style.statusBar);
	    headerContainerView.add(statusBar);
	}
	
	var headerView = Ti.UI.createView(_style.headerView);
	headerContainerView.add(headerView);
	
	var lblHeaderTitle = Ti.UI.createLabel(_style.lblHeaderTitle);
	headerView.add(lblHeaderTitle);
	
	
	/*
	 * Header buttons
	 */
	var imgAppIcon = Ti.UI.createLabel({
	   	// image: '/images/header/header-title.png',
	   	text: 'STYLFLIP',
	    width: Ti.UI.FILL, // Ti.UI.SIZE,
	    height: Ti.UI.FILL,
	    top: UI.top(5),
	    font: {
            fontSize: UI.fontSize(22), // 26
            fontFamily: constant.FONT.ABEATBYKAI
        },
        color: '#ef4e6d',
        textAlign: 'center'
	});
	
	var btnNotification = UI.createButton({
	   	backgroundImage: '/images/btn-notification.png',
	   	right: UI.right(20),
	    width: UI.width(17),
	    height: UI.height(21)
	});
	
	
	var btnSearchView = Ti.UI.createView({
	   	right: UI.right(5),
	    width: UI.width(35),
	    height: UI.height(40)
	});
	var btnSearch = UI.createButton({
	   	backgroundImage: '/images/header/search.png',
	    width: UI.width(16),
	    height: UI.height(16)
	});
	btnSearchView.add(btnSearch);
	
	var btnFilterView = Ti.UI.createView({
	   	right: UI.right(40),
	    width: UI.width(35),
	    height: UI.height(40)
	});
	var btnFilter = UI.createButton({
	   	backgroundImage: '/images/header/filter.png',
	    width: UI.width(16),
	    height: UI.height(18)
	});
	btnFilterView.add(btnFilter);
	
	headerView.add(imgAppIcon);
	// headerView.add(btnNotification);
	headerView.add(btnSearchView);
	headerView.add(btnFilterView);
	
	btnSearchView.addEventListener('click', function(e) {
		if(btnSearch.backgroundImage == '/images/header/search.png') {
			Ti.API.info(constant.APP + " ####################### INACTIVE SEARCH ICON CLICKED #####################");
			btnSearch.backgroundImage = '/images/header/search-active.png';
			config && config.searchIconClickCallback && config.searchIconClickCallback({show: true});
			Utils._.isFunction(_clickCallback) && _clickCallback();
		}
		// else if(btnSearch.backgroundImage == '/images/header/search-active.png') {
		else if(btnSearch.backgroundImage === '/images/header/closeicon.png' || btnSearch.backgroundImage === '/images/header/search-active.png') {	
			Ti.API.info(constant.APP + " ####################### ACTIVE SEARCH ICON CLICKED #####################");
			config && config.searchIconClickCallback && config.searchIconClickCallback({show: false});
			Utils._.isFunction(_clickCallback) && _clickCallback();
		}
		else if(btnSearch.backgroundImage == '/images/header/filter-done.png') {
			Ti.API.info(constant.APP + " ####################### FILTER-DONE ICON CLICKED #####################");
			Ti.App.fireEvent('filterDoneClick');
			_enableFilterDone(false);
		}
	});
	
	
	var filterView;
	btnFilterView.addEventListener('click', function() {
		// if(filterView) {
			// btnFilter.backgroundImage = '/images/header/filter.png';
			// if(btnMenuView) {
				// btnMenuView.visible = true;
			// }
			// filterView.hide();
			// filterView = undefined;
		// }
		// else {
			// btnFilter.backgroundImage = '/images/header/filter-active.png';
			if(btnMenuView) {
				btnMenuView.visible = false;
			}
			filterView = require('/components/filter').get(_currentFilterType);
			filterView.setTop(headerContainerView.height);
			filterView.addEventListener('filter', function(e) {
				Utils._.isFunction(_filterCallback) && _filterCallback(e);
			});
			filterView.addEventListener('hide', function(e) {
				if(btnMenuView) {
					btnMenuView.visible = true;
				}
				filterView = undefined;
				if(btnBackView) {
					headerView.remove(btnBackView);
				}
				_enableFilter(true);
				_enableSearch(true);
			});
			filterView.show();
			_enableFilter(false);
			_enableFilterDone(true);
			// _enableSearch(false);
			_enableCompose(false);
			_addBackButton();
		// }
	});
	
	
	if(config == undefined || (config && config.enableButtons == false)) {
		btnSearchView.visible = false;
		btnFilterView.visible = false;
	}
	
	
	var _addBackButton = function() {
		btnBackView = Ti.UI.createView(_style.btnBackView);
        var btnBack = UI.createButton(_style.btnBack);  
        var imgBackLogo = Ti.UI.createImageView(_style.imgBackLogo);
        btnBackView.add(btnBack);   
        // btnBackView.add(imgBackLogo);   
        
        btnBackView.addEventListener('click', function() {
        	if(filterView) {
        		var alertDialog = UI.createAlertDialog({
        			title: constant.ALERT.TITLE.DONE_FILTERING,
        			message: 'You will loose your changes to your filters. Proceed?',
        			buttonNames: ['Ok', 'Cancel']
        		});
        		alertDialog.addEventListener('click', function(e) {
        			if(e.index == 0) {
						if(btnMenuView) {
							btnMenuView.visible = true;
						}
						filterView.hide();
						filterView = undefined;
						headerView.remove(btnBackView);
						_enableFilterDone(false);
        			}
        		});
        		alertDialog.show();
        		alertDialog = null;
        	}
        	else {
    		 	Loader.hide();
        		Window.getCurrentWindow().close();
        	}
        });
        
        headerView.add(btnBackView);
	};
	
	var _getView = function() {
		if(config && config.showMenu && config.rightView) {
			btnMenuView = Ti.UI.createView(_style.btnMenuView);
			var btnMenu = UI.createButton(_style.btnMenu);	
			
			btnMenuView.add(btnMenu);	
			
			btnMenuView.addEventListener('click', function() {
				var leftMenu = require('/components/leftMenu').get(config.rightView);
				leftMenu.show(function() {
					leftMenu = null;
				});
			});
			
			headerView.add(btnMenuView);
		}
		else {
			if(config && config.enableBackButton) {
				_addBackButton();
			}
		}

		return headerContainerView;
	};
	
	var _getHeaderView = function() {
		return headerView;
	};
	
	var _getFilterButton = function() {
		return btnFilterView;
	};
	
	var _getSearchButton = function() {
		return btnSearchView;
	};
	
	var _setTitle = function(headerTitle) {
		if(headerTitle && headerTitle.trim().length > 0) {
			if(headerTitle.trim().length > 20) {
				imgAppIcon.font = {
		            fontSize: UI.fontSize(15),
		            fontFamily: constant.FONT.ABEATBYKAI
		       	};
			}
			else {
				imgAppIcon.font = {
		            fontSize: UI.fontSize(22),
		            fontFamily: constant.FONT.ABEATBYKAI
		       	};
			}
			imgAppIcon.text = headerTitle;
		}
	};
	
	var _resetTitle = function() {
		imgAppIcon.font = {
            fontSize: UI.fontSize(22),
            fontFamily: constant.FONT.ABEATBYKAI
       	};
		imgAppIcon.text = 'STYLFLIP';
	};
	
	var _getHeight = function() {
		return headerView.height;
	};
	
	var _enableHeaderIcons = function(bool) {
		imgAppIcon.visible = bool?true:false;		
		btnSearchView.visible = bool?true:false;
		btnFilterView.visible = bool?true:false;
	};
	
	var _enableFilter = function(bool) {
		btnFilterView.visible = bool?true:false;
	};
	
	var _enableSearch = function(bool) {
		btnSearchView.visible = bool?true:false;
	};
	
	var _getenableSearchVisibilty = function(){
		if(btnSearchView){
			return btnSearchView.visible;
		}
	};

	var _enableCompose = function(bool) {
	};
	
	var _enableFilterDone = function(bool) {
		if(bool) {
			btnSearch.backgroundImage = '/images/header/filter-done.png';
			btnSearch.width = UI.width(24);
			btnSearch.height = UI.height(24);	
		}
		else {
			btnSearch.backgroundImage = '/images/header/search.png';
		    btnSearch.width = UI.width(16);
		    btnSearch.height = UI.height(18);
		}
	};
	
	/*
	 * Component's internal listeners to be listened by external screens
	 */
	var _addEventListener = function(type, listener) {
		switch(type) {
			case 'click':
				_clickCallback = listener;
			break;
			
			case 'filter':
				_filterCallback = listener;
			break;
		}
	};
	
	
	var _setFilterActive = function(bool) {
		if(bool) {
			btnFilter.backgroundImage = '/images/header/filter-active.png';
		}
		else {
			btnFilter.backgroundImage = '/images/header/filter.png';
		}
	};
	
	
	var _setSearchActive = function(bool) {
		if(bool) {
			btnSearch.backgroundImage = '/images/header/closeicon.png';
			// btnSearch.backgroundImage = '/images/header/search-active.png';
		}
		else {
			btnSearch.backgroundImage = '/images/header/search.png';
		}
	};
	
	
	var _setCurrentFilterType = function(filterType) {
		_currentFilterType = filterType;
	};
	
	
	var _hideBackButton = function() {
		try {
			headerView.remove(btnBackView);
		}
		catch(e) {}
	};
	
	var _getbtnSearch = function(){
		if(btnSearch){
			return btnSearch;
		}
	};
	
	return {
		getView: _getView,
		getbtnSearch: _getbtnSearch,
		getHeaderView: _getHeaderView,
		setTitle: _setTitle,
		resetTitle: _resetTitle,
		getHeight: _getHeight,
		getFilterButton: _getFilterButton,
		getSearchButton: _getSearchButton,
		enableHeaderIcons: _enableHeaderIcons,
		enableFilter: _enableFilter,
		enableSearch: _enableSearch,
		getSearchVisibility :_getenableSearchVisibilty,
		enableCompose: _enableCompose,
		setFilterActive: _setFilterActive,
		setSearchActive: _setSearchActive,
		setCurrentFilterType: _setCurrentFilterType,
		hideBackButton: _hideBackButton,
		addEventListener: _addEventListener
	};
};
