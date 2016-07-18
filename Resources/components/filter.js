exports.get = function(filterType) {
	var _style = require('/components/styles/filter').get();
	
	var _filterCallback, _hideCallback;
	var _selectedPostedBy = _postedByFilters, _selectedSortBy = _sortByFilters, _selectedBrands = _brandsFilters, _selectedCategories = _categoriesFilters, _selectedSubCategories = _subCategoriesFilters, _selectedSizes = _sizesFilters, _selectedConditions = _conditionsFilters, _selectedPriceRanges = _priceRangeFilters;
	var _imgFilterSelected = '/images/common/filter-category-selected.png';
	var _imgFilterUnselected = '/images/common/filter-category-unselected.png';
	
	var currentWindow = Window.getCurrentWindow();
	
	var filterView = Ti.UI.createView(_style.filterView);
	var leftView = Ti.UI.createScrollView(_style.leftView);
	var rightView = Ti.UI.createScrollView(_style.rightView);
	filterView.add(leftView);
	filterView.add(rightView);
	
	/*
	 * This view will create child view for right view
	 */
	var _createView = function(childViews, arrSelectedChildren, multiSelection, filterSelectionCallback) {
		// Window.clearMemory(rightView, function() {
			Loader.show();
			var _lastSelectedChildIndex = -1;
			var _arrSelectedFilters = [];
			var view = Ti.UI.createView({
				backgroundColor: '#fff',
				width: Ti.UI.FILL,
				height: Ti.UI.FILL,
				layout: 'vertical'
			});
			var _arrChildViews = [];
			for(var i=0; i<childViews.length; i++) {
				var btnFilterView = Ti.UI.createView(Utils._.extend({}, _style.btnFilter, {
					left: UI.left(10),
					right: UI.right(10),
			        // layout: 'horizontal',
			        id: childViews[i].id,
			        index: i
			   	}));
				var imgCheck = UI.createButton(Utils._.extend({}, _style.btnFilter, {
					backgroundImage: _imgFilterUnselected,
					left: 0,
					right: 0,
					width: UI.width(15),
					height: UI.height(15),
					color: '#757575'
				}));
				var btnFilter = UI.createClickableLabel(Utils._.extend({}, _style.btnFilter, {
					text: childViews[i].title,
					left: UI.left(25),
					right: 0,
					height: Ti.UI.SIZE,
					font: {
		                fontSize: UI.fontSize(12),
		                fontFamily: constant.FONT.DEFAULT_FONT
		            },
					color: '#757575',
					textAlign: 'left'
			   	}));
			   	btnFilterView.add(imgCheck);
			   	btnFilterView.add(btnFilter);
				view.add(btnFilterView);
				view.add(Ti.UI.createView(_style.hrLine));
				_arrChildViews.push(btnFilterView);
				
				if(arrSelectedChildren.indexOf(childViews[i].id) > -1) {
					imgCheck.backgroundImage = _imgFilterSelected;
					_arrSelectedFilters.push(childViews[i].id);
					_lastSelectedChildIndex = i;
				}
			}
			for(var i=0; i<_arrChildViews.length; i++) {
				_arrChildViews[i].addEventListener('click', function() {
					if(multiSelection) {
						if(_arrChildViews[this.index].children[0].backgroundImage == _imgFilterUnselected) {
							_arrChildViews[this.index].children[0].backgroundImage = _imgFilterSelected;
							_arrSelectedFilters.push(_arrChildViews[this.index].id);
						}
						else {
							_arrChildViews[this.index].children[0].backgroundImage = _imgFilterUnselected;
							_arrSelectedFilters.splice(_arrSelectedFilters.indexOf(_arrChildViews[this.index].id), 1);
						}
					}
					else {
						if(_lastSelectedChildIndex > -1) {
							_arrChildViews[_lastSelectedChildIndex].children[0].backgroundImage = _imgFilterUnselected;
							_arrSelectedFilters.splice(_arrSelectedFilters.indexOf(_arrChildViews[_lastSelectedChildIndex].id), 1);
						}
						_arrChildViews[this.index].children[0].backgroundImage = _imgFilterSelected;
						_lastSelectedChildIndex = this.index;
						_arrSelectedFilters.push(_arrChildViews[this.index].id);
					}
					Utils._.isFunction(filterSelectionCallback) && filterSelectionCallback({selectedFilters: _arrSelectedFilters});
				});		
			}
			rightView.add(view);
			Loader.hide();
		// });
	};
	
	
	/*
	 * Check if filters are applied
	 */
	var _checkIfFiltersAreApplied = function(key, clearFilterButton) {
		if(key == 'sortBy') {
			if(_selectedSortBy.length > 0) {
				clearFilterButton.visible = true;
			}
			else {
				clearFilterButton.visible = false;
			}
		}
		
		if(key != 'sortBy') {
			if(_selectedBrands.length > 0 || _selectedCategories.length > 0 || _selectedSubCategories.length > 0 || _selectedSizes.length > 0 || _selectedConditions.length > 0 || _selectedPriceRanges.length > 0) {
				clearFilterButton.visible = true;
			}
			else {
				clearFilterButton.visible = false;
			}
		}
	};
	
	if(filterType == 'stylefeed') {
		var _filterOptions = [
			{ key: 'postedBy', title: 'VIEW POSTS BY', options: [], checked: _postedByFilters.length > 0, multiSelection: false, childViews: [{id: 'Global', title: 'Global (Default)'}, {id: 'My Network', title: 'My Network'}, {id: 'Only Me', title: 'Only Me'}] }
		];
	}
	
	if(filterType == 'shop') {
		var _filterOptions = [
			{ key: 'sortBy', title: 'VIEW POSTS BY', options: [], checked: _sortByFilters.length > 0, multiSelection: false, childViews: [{id: 'Newest to Oldest', title: 'Newest to Oldest'}, {id: 'Price - High to Low', title: 'Price - High to Low'}, {id: 'Price - Low to High', title: 'Price - Low to High'}, {id: 'Popularity', title: 'Popularity'}, {id: 'Discounts', title: 'Discounts'}] },
			{ key: 'filterBy', title: 'FILTER BY', checked: (_brandsFilters.length > 0 || _categoriesFilters.length > 0 || _subCategoriesFilters.length > 0 || _sizesFilters.length > 0 || _conditionsFilters.length > 0 || _priceRangeFilters.length > 0), options: [
				{ key: 'brand', title: 'BRAND', enabled: true, checked: _brandsFilters.length > 0, multiSelection: true, childViews: [] },
				{ key: 'category', title: 'CATEGORY', enabled: true, checked: _categoriesFilters.length > 0, multiSelection: true, childViews: [] },
				{ key: 'subCategory', title: 'SUB-CATEGORY', enabled: false, checked: _subCategoriesFilters.length > 0, multiSelection: true, childViews: [] },
				{ key: 'size', title: 'SIZES', enabled: true, checked: _sizesFilters.length > 0, multiSelection: true, childViews: [] },
				{ key: 'condition', title: 'CONDITION', enabled: true, checked: _conditionsFilters.length > 0, multiSelection: true, childViews: [{id: 'Brand new with tags', title: 'Brand new with tags'}, {id: 'New without tags', title: 'New without tags'}, {id: 'Barely Worn (once or twice)', title: 'Barely Worn (once or twice)'}, {id: 'Gently Used', title: 'Gently Used'}] },
				{ key: 'priceRange', title: 'PRICE RANGE', enabled: true, checked: _priceRangeFilters.length > 0, multiSelection: false, childViews: [{id: 'Less than 500', title: 'Less than \u20B9 500'}, {id: '500 - 1000', title: '\u20B9 500 - \u20B9 1000'}, {id: '1000 - 2000', title: '\u20B9 1000 - \u20B9 2000'}, {id: '2000 - 3000', title: '\u20B9 2000 - \u20B9 3000'}, {id: '3000 - 4000', title: '\u20B9 3000 - \u20B9 4000'}, {id: '4000 and above', title: '\u20B9 4000 and Above'}] }
			]}
		];
	}
	
	var _arrFilterButtons = [];
	
	for(var i=0; i<_filterOptions.length; i++) {
		var btnFilterView = Ti.UI.createView(_style.btnFilter);
		var btnFilter = UI.createButton(Utils._.extend({}, _style.btnFilter, {
	        title: _filterOptions[i].title,
	        right: undefined,
	        width: Ti.UI.SIZE,
			key: _filterOptions[i].key,
			childViews: _filterOptions[i].childViews,
			multiSelection: _filterOptions[i].multiSelection,
			subFilter: false
	   	}));
	   	var btnClearFilter = UI.createButton(Utils._.extend({}, _style.btnClearFilter, {
	   		right: UI.left(5),
	   		visible: _filterOptions[i].checked,
	   		key: _filterOptions[i].key
	   	}));
	   	btnFilter.clearFilterButton = btnClearFilter;
	   	btnFilterView.add(btnFilter);
	   	if(i > 0) {
	   		btnFilterView.add(btnClearFilter);
	   	}
	   	_arrFilterButtons.push(btnFilter);
		leftView.add(btnFilterView);
		leftView.add(Ti.UI.createView(Utils._.extend({}, _style.hrLine, {
			height: _filterOptions[i].options.length > 0 ? 0.5 : 1
	   	})));
		
		/*
		 * Clear all filters
		 */
		btnClearFilter.addEventListener('click', function() {
			switch(this.key) {
				case 'postedBy':
					_selectedPostedBy = [];
				break;
				
				case 'sortBy':
					_selectedSortBy = [];
				break;
				
				case 'filterBy':
					_selectedBrands = _selectedCategories = _selectedSubCategories = _selectedSizes = _selectedConditions = _selectedPriceRanges = [];
					/*
					 * Clear left side selection
					 */
					for(var i=0; i<_arrFilterButtons.length; i++) {
						if(_arrFilterButtons[i].parentKey == 'filterBy') {
							if(_arrFilterButtons[i].key == 'subCategory') {
								UI.disableView(_arrFilterButtons[i]);
							}
							_arrFilterButtons[i].children[0].backgroundImage = '/images/common/filter-field-untick.png';
						}
					}
				break;
			}
			
			/*
			 * Clear right side selection
			 */
			try {
				var currentSubFilterView = rightView.children[0];
				if(currentSubFilterView.children.length > 30) {
					Loader.show();
				}
				for(var i=0; i<currentSubFilterView.children.length; i++) {
					try {
						currentSubFilterView.children[i].children[0].backgroundImage = _imgFilterUnselected;
					}
					catch(e) {}
				}
				if(currentSubFilterView.children.length > 30) {
					Loader.hide();
				}
			}
			catch(e) {}
			this.visible = false;
		});
		
		for(var j=0; j<_filterOptions[i].options.length; j++) {
			var btnFilterView = Ti.UI.createView(Utils._.extend({}, _style.btnFilter, {
		        title: _filterOptions[i].options[j].title,
		        layout: 'horizontal',
				key: _filterOptions[i].options[j].key,
				childViews: _filterOptions[i].options[j].childViews,
				multiSelection: _filterOptions[i].options[j].multiSelection,
				subFilter: true,
				clearFilterButton: btnClearFilter,
				parentKey: _filterOptions[i].key
		   	}));
			var imgCheck = UI.createButton(Utils._.extend({}, _style.btnFilter, {
				backgroundImage: _filterOptions[i].options[j].checked ? '/images/common/filter-field-tick.png' : '/images/common/filter-field-untick.png',
				left: UI.left(5),
				right: 0,
				width: UI.width(15),
				height: UI.height(15)
			}));
			var btnFilter = UI.createButton(Utils._.extend({}, _style.btnFilter, {
				title: _filterOptions[i].options[j].title,
				left: 0,
				right: 0,
				font: {
	                fontSize: UI.fontSize(10),
	                fontFamily: constant.FONT.DEFAULT_FONT,
	                fontWeight: 'bold'
	            }
		   	}));
		   	if(_filterOptions[i].options[j].enabled != undefined && _filterOptions[i].options[j].enabled == false) {
		   		UI.disableView(btnFilterView);
		   	}
		   	btnFilterView.add(imgCheck);
		   	btnFilterView.add(btnFilter);
		   	_arrFilterButtons.push(btnFilterView);
			leftView.add(btnFilterView);
			leftView.add(Ti.UI.createView(Utils._.extend({}, _style.hrLine, {
				height: 0.5
		   	})));
		}
	}
	
	
	/*
	 * Get category/sub-category/brand data from server
	 */
	var _getFilterDataFromServer = function(key, categoryId, callback) {
		switch(key) {
			case 'category':
				Utils.getCategories(function(responseData) {
					var _childViews = [];
					for(var i=0; i<responseData.length; i++) {
						_childViews.push({
							id: responseData[i].categoryId,
							title: responseData[i].name
						});
					}
					Utils._.isFunction(callback) && callback({childViews: _childViews});
				});
			break;
			case 'subCategory':
				Utils.getSubCategories(categoryId, function(responseData) {
					var _childViews = [];
					for(var i=0; i<responseData.length; i++) {
						_childViews.push({
							id: responseData[i].categoryId,
							title: responseData[i].name
						});
					}
					Utils._.isFunction(callback) && callback({childViews: _childViews});
				});
			break;
			case 'brand':
				Utils.getBrands(function(responseData) {
					var _childViews = [];
					for(var i=0; i<responseData.length; i++) {
						_childViews.push({
							id: responseData[i].brandId,
							title: responseData[i].name
						});
					}
					Utils._.isFunction(callback) && callback({childViews: _childViews});
				});
			break;
			case 'size':
				var _childViews;
				if(categoryId == 20) {
					_childViews = [{title: 2, id: 2}, {title: 3, id: 3}, {title: 4, id: 4}, {title: 5, id: 5}, {title: 6, id: 6}, {title: 7, id: 7}, {title: 8, id: 8}];
				}
				else {
					_childViews = [{title: 'XS - Xtra Small', id: 'XS'}, {title: 'S - Small', id: 'S'}, {title: 'M - Medium', id: 'M'}, {title: 'L - Large', id: 'L'}, {title: 'XL - Xtra Large', id: 'XL'}, {title: 'XXL - Xtra Xtra Large', id: 'XXL'}];
				}
				Utils._.isFunction(callback) && callback({childViews: _childViews});
			break;
		}
	};
	
	
	
	/*
	 * Left side filter click handler
	 */
	var _lastSelectedKey, _lastSelectedFilterButton, _parentFilterButton;
	for(var i=0; i<_arrFilterButtons.length; i++) {
		_arrFilterButtons[i].index = i;
		_arrFilterButtons[i].addEventListener('click', function() {
			if((this.touchEnabled != undefined || this.touchEnabled != null) && this.touchEnabled == false) {
				return;
			}
			if(this.childViews == undefined || (_lastSelectedKey != undefined && _lastSelectedKey == this.key)) {
				return;
			}
			var currentParentFilter = this;
			var _currentSelectedFilterKey = currentParentFilter.key;
			_lastSelectedKey = currentParentFilter.key;
			
			if(_lastSelectedFilterButton != undefined) {
				_lastSelectedFilterButton.color = '#fff';
			}
			
			if(_parentFilterButton != undefined) {
				_parentFilterButton.color = '#fff';
				_parentFilterButton = undefined;
			}
			
			if(_lastSelectedKey == 'sortBy' || _lastSelectedKey == 'postedBy') {
				this.color = '#ef4e6d';
				_lastSelectedFilterButton = this;
			}
			else {
				_arrFilterButtons[1].color = '#ef4e6d';
				this.children[1].color = '#ef4e6d';
				_lastSelectedFilterButton = this.children[1];
				_parentFilterButton = _arrFilterButtons[1];
			}
					
			rightView.removeAllChildren();
			
			/*
			 * Selection array to maintain previous selection states
			 */
			var _tmpSelection;
			
			switch(_currentSelectedFilterKey) {
				case 'postedBy':
					_tmpSelection = _selectedPostedBy;
				break;
				case 'sortBy':
					_tmpSelection = _selectedSortBy;
				break;
				case 'brand':
					_tmpSelection = _selectedBrands;
				break;
				case 'category':
					_tmpSelection = _selectedCategories;
				break;
				case 'subCategory':
					_tmpSelection = _selectedSubCategories;
				break;
				case 'size':
					_tmpSelection = _selectedSizes;
				break;
				case 'condition':
					_tmpSelection = _selectedConditions;
				break;
				case 'priceRange':
					_tmpSelection = _selectedPriceRanges;
				break;
			}
			
			if(_tmpSelection.length == 0) {
				_tmpSelection = [_filterOptions[0].childViews[0].id];
			}
			
			if(_currentSelectedFilterKey == 'category' || _currentSelectedFilterKey == 'subCategory' || _currentSelectedFilterKey == 'brand' || _currentSelectedFilterKey == 'size') {
				_getFilterDataFromServer(_currentSelectedFilterKey, (_currentSelectedFilterKey == 'subCategory' || _currentSelectedFilterKey == 'size' ? _selectedCategories.toString() : undefined), function(e) {
					_createView(e.childViews, _tmpSelection, currentParentFilter.multiSelection, function(e) {
						if(e.selectedFilters.length > 0) {
							if(currentParentFilter.subFilter) {
								currentParentFilter.children[0].backgroundImage = '/images/common/filter-field-tick.png';
							}
						}
						else {
							if(currentParentFilter.subFilter) {
								currentParentFilter.children[0].backgroundImage = '/images/common/filter-field-untick.png';
							}
						}
						switch(_currentSelectedFilterKey) {
							case 'brand':
								_selectedBrands = e.selectedFilters;
							break;
							case 'category':
								_selectedCategories = e.selectedFilters;
								//	If more than 1 categories are selected the disable sub-category / size selection
								if(_selectedCategories.length == 0 || _selectedCategories.length > 1) {
									_arrFilterButtons[currentParentFilter.index + 1].children[0].backgroundImage = '/images/common/filter-field-untick.png';
									UI.disableView(_arrFilterButtons[currentParentFilter.index + 1]);
									_arrFilterButtons[currentParentFilter.index + 2].children[0].backgroundImage = '/images/common/filter-field-untick.png';
									UI.disableView(_arrFilterButtons[currentParentFilter.index + 2]);
									_selectedSubCategories = [];
									_selectedSizes = [];
								}
								else {
									UI.enableView(_arrFilterButtons[currentParentFilter.index + 1]);
									UI.enableView(_arrFilterButtons[currentParentFilter.index + 2]);
								}
							break;
							case 'subCategory':
								_selectedSubCategories = e.selectedFilters;
							break;
							case 'size':
								_selectedSizes = e.selectedFilters;
							break;
						}
						_checkIfFiltersAreApplied(_currentSelectedFilterKey, currentParentFilter.clearFilterButton);
					});		
		   		});
			}
			else {
				_createView(currentParentFilter.childViews, _tmpSelection, currentParentFilter.multiSelection, function(e) {
					if(e.selectedFilters.length  > 0) {
						if(currentParentFilter.subFilter) {
							currentParentFilter.children[0].backgroundImage = '/images/common/filter-field-tick.png';
						}
					}
					else {
						if(currentParentFilter.subFilter) {
							currentParentFilter.children[0].backgroundImage = '/images/common/filter-field-untick.png';
						}
					}
					switch(_currentSelectedFilterKey) {
						case 'postedBy':
							_selectedPostedBy = e.selectedFilters;
						break;
						case 'sortBy':
							_selectedSortBy = e.selectedFilters;
						break;
						case 'size':
							_selectedSizes = e.selectedFilters;
						break;
						case 'condition':
							_selectedConditions = e.selectedFilters;
						break;
						case 'priceRange':
							_selectedPriceRanges = e.selectedFilters;
						break;
					}
					_checkIfFiltersAreApplied(_currentSelectedFilterKey, currentParentFilter.clearFilterButton);
				});				
			}
		});
	}
	
	_arrFilterButtons[0].fireEvent('click');
	
	
	// var btnDone = UI.createButton(Utils._.extend({}, _style.btnDone, {
        // title: 'DONE',
        // top: UI.top(50),
        // bottom: UI.bottom(20),
        // height: Ti.UI.SIZE
    // }));
    // leftView.add(btnDone);
    
    
    var _filterDoneClickListener = function() {
    	if(filterType == 'stylefeed') {
    		var _objFilter = {
	    		postedBy: _selectedPostedBy
	    	};
	    	_postedByFilters = _selectedPostedBy;
    	}
    	else {
    		var _objFilter = {
	    		sortBy: _selectedSortBy,
	    		brands: _selectedBrands,
	    		categories: _selectedCategories,
	    		subCategories: _selectedSubCategories,
	    		sizes: _selectedSizes,
	    		conditions: _selectedConditions,
	    		priceRange: _selectedPriceRanges
	    	};
	    	_sortByFilters = _selectedSortBy;
	    	_brandsFilters = _selectedBrands;
	    	_categoriesFilters = _selectedCategories;
	    	_subCategoriesFilters = _selectedSubCategories;
	    	_sizesFilters = _selectedSizes;
	    	_conditionsFilters = _selectedConditions;
	    	_priceRangeFilters = _selectedPriceRanges;
    	}
    	
    	for(var _key in _objFilter) {
    		if(_objFilter[_key].length == 0) {
    			delete _objFilter[_key];
    		}
    		else {
    			_objFilter[_key] = _objFilter[_key].toString();
    		}
    	}
    	_hide();
    	// if(Object.keys(_objFilter).length > 0) {
    		Utils._.isFunction(_filterCallback) && _filterCallback(_objFilter);
    	// }
    };
    
    Ti.App.addEventListener('filterDoneClick', _filterDoneClickListener);
	
	var _getView = function() {
		return filterView;
	};
	
	var _show = function() {
		currentWindow.add(filterView);
	};
	
	var _hide = function() {
		currentWindow.remove(filterView);
		Window.clearMemory(filterView);
		_createView = null;
		_getView = null;
		_show = null;
		_hide = null;
		_setTop = null;
		_getFilterDataFromServer = null;
		_checkIfFiltersAreApplied = null;
		_selectedSortBy = null;
		_selectedBrands = null;
		_selectedCategories = null;
		_selectedConditions = null;
		_selectedPriceRanges = null;
		_selectedSizes = null;
		_selectedSubCategories = null;
		Ti.App.removeEventListener('filterDoneClick', _filterDoneClickListener);
		_filterDoneClickListener = null;
		Utils._.isFunction(_hideCallback) && _hideCallback();
	};
	
	var _setTop = function(topPos) {
		filterView.top = topPos;
	};
	
	/*
	 * Component's internal listeners to be listened by external screens
	 */
	var _addEventListener = function(type, listener) {
		switch(type) {
			case 'filter':
				_filterCallback = listener;
			break;
			case 'hide':
				_hideCallback = listener;
			break;
		}
	};
	
	return {
		show: _show,
		hide: _hide,
		getView: _getView,
		setTop: _setTop,
		addEventListener: _addEventListener
	};
};
