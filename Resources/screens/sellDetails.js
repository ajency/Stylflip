exports.get = function(tabSelected, productDetails, successCallback) {
	Analytics.trackScreen({
		screenName: 'Sell Details'
	});
	
	var _win = Window.getCurrentWindow();
	var _sellDetailsSlugs = _win.customProperty;

	var _style = require('/styles/sell').get();
	
	var _currentButtonIndex = 0;
	var _categorySelected = productDetails && productDetails.categoryId ? productDetails.categoryId : undefined, 
	_subcategorySelected = productDetails && productDetails.subcategoryId ? productDetails.subcategoryId : undefined, 
	_brandSelected = productDetails && productDetails.brandId ? productDetails.brandId : undefined, 
	_sizeSelected = productDetails && productDetails.size ? productDetails.size : undefined, 
	_customSize = productDetails && productDetails.customSize ? productDetails.customSize : {},
	_conditionSelected = productDetails && productDetails.condition ? productDetails.condition : undefined,
	_brandName = productDetails && productDetails.brandName ? productDetails.brandName : undefined,
	_categoryName = productDetails && productDetails.categoryName ? productDetails.categoryName : undefined,
	_sizeChartSelected = productDetails && productDetails.sizeChart ? productDetails.sizeChart : undefined, 
	_pickupFrom = productDetails && productDetails.pickupFrom ? productDetails.pickupFrom : undefined,
	_toBeDonated = productDetails && productDetails.toBeDonated ? productDetails.toBeDonated : false,
	_userAddresses = productDetails && productDetails.userAddresses ? productDetails.userAddresses : undefined,
	_productDetailsLaunch = productDetails && productDetails.productDetailsLaunch ? productDetails.productDetailsLaunch : false;
	_productDetailsDiscount = productDetails && productDetails.discountPrice ? productDetails.discountPrice : 0;
	
	/*
	 * Calculating product's final price
	 */
	var _getCalculatedPrice = function(sellingPrice, originalPrice) {
		Ti.API.info(constant.APP + " ############## _getCalculatedPrice CALLED #############");
		sellingPrice = isNaN(parseFloat(sellingPrice)) ? 0 : parseFloat(sellingPrice);
		if(sellingPrice == 0) {
			return '\u20B9 0';
		}
		originalPrice = isNaN(parseFloat(originalPrice)) ? 0 : parseFloat(originalPrice);
		var _isShippingToBeAdded = sellingPrice < 2000;
		sellingPrice = sellingPrice + ((sellingPrice * Utils.getCommisionPercentage()) / 100);
		if(_isShippingToBeAdded) {
			sellingPrice = sellingPrice + 120;	//	120 is the shipping fees
		}

		if(isNaN(sellingPrice)){
			sellingPrice = 0;
		}

		return '\u20B9 ' + Math.ceil(sellingPrice);
	};
	
	
	var _getShippingAndHandlingFees = function(sellingPrice) {
		//Ti.API.info(constant.APP + " ############## _getShippingAndHandlingFees CALLED #############");
		sellingPrice = isNaN(parseFloat(sellingPrice)) ? 0 : parseFloat(sellingPrice);
		if(sellingPrice == 0) {
			return '\u20B9 0';
		}
		if(sellingPrice < 2000) {
			return '\u20B9 120';
		}
		return '\u20B9 0';
	};
	
	
	var mainView = Ti.UI.createView({
	    width: Ti.UI.FILL,
	    height: Ti.UI.FILL,
	    layout: 'vertical'
	});	
	
	var header = require('/components/header').get({
		showMenu: false,
    	enableButtons: false,
    	enableBackButton: true
	});
	var contentView = Ti.UI.createView(Utils._.extend({}, _commonStyle.contentView, {
    	top: 0,
    	bottom: 0,
    	backgroundColor: '#fff'
    }));
    var footer = require('/components/footer').get(defaultSelectedTab=tabSelected, subTab=true);
    
    mainView.add(header.getView());
    mainView.add(contentView);
    mainView.add(footer.getView());
    
    
    var fieldsView = Ti.UI.createView({
    	top: 0,
    	bottom: UI.bottom(60),
    	width: Ti.UI.FILL,
    	height: Ti.UI.FILL,
        layout: 'vertical'
    });
    
    var navButtonsView = Ti.UI.createView({
    	bottom: 0,
    	width: Ti.UI.FILL,
    	height: UI.height(60)
    });
    
    contentView.add(fieldsView);
    contentView.add(navButtonsView);
    
    
    var btnPrev = UI.createButton(Utils._.extend({}, _commonStyle.bigButton, {
        title: 'PREV',
        left: 0,
        width: '50%',
        height: Ti.UI.FILL,
        color: '#828282'
    }));
    
    var btnNext = UI.createButton(Utils._.extend({}, _commonStyle.bigButton, {
        title: 'NEXT',
        right: 0,
        width: '50%',
        height: Ti.UI.FILL,
        bottom: 0
    }));
    
    navButtonsView.add(btnPrev);
    navButtonsView.add(btnNext);
    
    
    btnPrev.addEventListener('click', function() {
    	//Ti.API.info(constant.APP + " ############## btnPrev CLICK CALLED #############");
    	if(_currentButtonIndex > 0) {
    		_currentButtonIndex--;
    		buttonBar.selectButton(_currentButtonIndex);
    	}
    });
    
    btnNext.addEventListener('click', function() {
    	//Ti.API.info(constant.APP + " ############## btnNext CLICK CALLED #############");
    	if(this.title == 'NEXT' && _currentButtonIndex < _objButtons.length - 1) {
    		_currentButtonIndex++;
    		buttonBar.selectButton(_currentButtonIndex);
    		return;
    	}
    	

    	var _showIncompleteAlert = function(){
			var alertDialog = UI.createAlertDialog({
    			title: constant.ALERT.TITLE.FAUX_PAS,
	            message: "You seem to have left out important information regarding your listing. Give it a second look."
	        });
	        alertDialog.show();
	        alertDialog = null;
    	};

		/*
    	 * 	If button's title is DONE
    	 */
    	try{
	    	var _areFieldsInComplete = false, _inCompleteFields = [];
	    	
		   	if(txtTitle.value.trim() == '' || txtTitle.value.trim() == txtTitle.hintText) {
	    		// alert('Please enter title');
	    		// return;
	    		_areFieldsInComplete = true;
	    		_inCompleteFields.push('Title');
	    	}
	    	if(txtDescription.value.trim() == '' || txtDescription.value.trim() == txtDescription.hintText) {
	    		// alert('Please enter title');
	    		// return;
	    		_areFieldsInComplete = true;
	    		_inCompleteFields.push('Description');
	    	}
	    	if(_categorySelected == undefined) {
	    		// alert('Please select at least one category');
	    		// return;
	    		_areFieldsInComplete = true;
	    		_inCompleteFields.push('Category');
	    	}
	    	// if(_subcategorySelected == undefined) {
	    		// alert('Please select at least one subcategory');
	    		// return;
	    	// }
	    	if(_brandSelected == undefined) {
	    		// alert('Please select brand');
	    		// return;
	    		_areFieldsInComplete = true;
	    		_inCompleteFields.push('Brand');
	    	}
	    	if(_sizeSelected == undefined && _sizeChartSelected == undefined) {
	    		_areFieldsInComplete = true;
	    		_inCompleteFields.push('Size');
	    	}

	    	if(_sizeSelected == 'custom' && (lblBurstValue.value.trim() == '' || lblWaistValue.value.trim() == '' || lblLowWaistValue.value.trim() == '' || lblHipValue.value.trim() == '')) {
	    		_areFieldsInComplete = true;
	    	}
	    	// if(txtDescription.value.trim() == '' || txtDescription.value.trim() == txtDescription.hintText) {
	    		// // alert('Please enter description');
	    		// // return;
	    		// _areFieldsInComplete = true;
	    	// }
	    	if(txtSellingPrice.value.trim() == '') {
	    		// alert('Please enter selling price');
	    		// return;
	    		_areFieldsInComplete = true;
	    		_inCompleteFields.push('Selling Price');
	    	}
	    	if(txtSellingPrice.value.trim() != '' && isNaN(txtSellingPrice.value.trim())) {
	    		// alert('Please enter valid selling price');
	    		// return;
	    		_areFieldsInComplete = true;
	    	}
	    	// if(txtOriginalPrice.value.trim() == '') {
	    		// // alert('Please enter original price');
	    		// // return;
	    		// _areFieldsInComplete = true;
	    		// _inCompleteFields.push('Original Price');
	    	// }
	    	if(txtOriginalPrice.value.trim() != '' && isNaN(txtOriginalPrice.value.trim())) {
	    		// alert('Please enter valid original price');
	    		// return;
	    		_areFieldsInComplete = true;
	    	}
	    	if(_conditionSelected == undefined) {
	    		// alert('Please select condition');
	    		// return;
	    		_areFieldsInComplete = true;
	    		_inCompleteFields.push('Condition');
	    	}
	    	if(_pickupFrom == undefined) {
	    		// alert('Please select condition');
	    		// return;
	    		_areFieldsInComplete = true;
	    		_inCompleteFields.push('Pick-up address');
	    	}
	    	
	    	if(_areFieldsInComplete) {
	    		_showIncompleteAlert();
		        return;
	    	}
	    	
	    	txtTitle.blur();
	    	txtDescription.blur();
	    	txtSellingPrice.blur();
	    	txtOriginalPrice.blur();
	    	
	    	// Window.closeAll(function() {
	    		var discountPrice = (txtListingPrice.text).split(' ');
	    		discountPrice = discountPrice[1];
	        	Utils._.isFunction(successCallback) && successCallback({
	        		productTitle: txtTitle.value.trim(),
		        	productDescription: txtDescription.value.trim() == txtDescription.hintText ? '' : txtDescription.value.trim(),
		        	categoryId: _categorySelected,
		        	subcategoryId: _subcategorySelected,
		        	sellingPrice: txtSellingPrice.value.trim(),
		        	originalPrice: txtOriginalPrice.value.trim(),
		        	discountPrice: discountPrice,
		        	discountPercentage: (100 - ((parseFloat(discountPrice)/parseFloat(txtOriginalPrice.value.trim()))*100)) < 0 ? 0 : (100 - ((parseFloat(discountPrice)/parseFloat(txtOriginalPrice.value.trim()))*100)),
		        	condition: _conditionSelected,
		        	brandId: _brandSelected,
		        	brandName: _brandName,
		        	size: _sizeSelected,
		        	sizeChart: _sizeChartSelected,
		        	customSize: _customSize,
		        	pickupFrom: _pickupFrom,
		        	userAddresses: _userAddresses,
		        	toBeDonated: _toBeDonated
	        	});
	        	_win.close();
	        // });
    	}
    	catch(e){
    		_showIncompleteAlert();
    	}
    }); //end btnNext click event
    
   	var _lastButtonSelectedIndex = -1;
	var _selectedButtonIndex = -1;
	var _createButtonView = function(arrButtons, buttonViewStyle, selectedButtonStyle, unselectedButtonStyle, clickCallback, enableSearch) {
		Ti.API.info(constant.APP + " ############## _createButtonView CALLED #############");
		var buttonView = Ti.UI.createTableView(Utils._.extend({}, buttonViewStyle, {
	        height: Ti.UI.FILL
	    }));
	    if(enableSearch) {
	    	buttonView.search = Ti.UI.createSearchBar({
				backgroundColor: '#fff',
				barColor: '#fff',
				hintText: 'Search Brand',
				font: {
	                fontSize: UI.fontSize(12),
	                fontFamily: constant.FONT.DEFAULT_FONT
	            }
			});
			buttonView.filterAttribute = 'filterText';
	    }
	    _lastButtonSelectedIndex = -1;
	    _selectedButtonIndex = -1;
	    
	    var _pageIndex = 0, _pageLimit = 15, _totalRecords = arrButtons.length, _fetchedCount = 0;
	    
	    var _tableData = [];
	    
	    var $ = this;
	    
	    $.loadData = function() {
	    	if(_fetchedCount >= _totalRecords) {
	    		return;
	    	}
	    	
	    	var _tmpData = arrButtons; // .splice(_fetchedCount, _pageLimit);
	    	
	    	var _tmpTableData = [];
	    	for(var i=0; i<_tmpData.length; i++) {
		    	var tableRow = Ti.UI.createTableViewRow({
		    		index: i,
		    		data: _tmpData[i],
		    		filterText: _tmpData[i].title
		    	});
		    	var button = UI.createButton(Utils._.extend({}, unselectedButtonStyle, {
			        title: _tmpData[i].title + (osname=='android'?'  ':'')
			    }));
			    tableRow.add(button);
			    
			    _tmpTableData.push(tableRow);
			    
			    if(_tmpData[i].selected) {
			    	_selectedButtonIndex = i;
			    }
		    }
		    buttonView.appendRow(_tmpTableData);
		    _tableData = _tableData.concat(_tmpTableData);
		    _fetchedCount = _fetchedCount + _tmpData.length;
	    };
	    
	    $.loadData();
	    
	    // buttonView.addEventListener('scroll', function(e) {
	    	// if(e.contentOffset.y == e.contentSize.height - e.size.height) {
	    		// $.loadData();
	    	// }
	    // });

	    buttonView.addEventListener('click', function(e) {
	    	Ti.API.info(constant.APP + " ############## buttonView CLICKED #############");
	  //   	if(_lastButtonSelectedIndex == e.row.index) {
   //  			return;
   //  		}
    		
   //  		if(_lastButtonSelectedIndex > -1) {
	  //   		if(unselectedButtonStyle) {
	  //   			Ti.API.info(constant.APP + " COPYING UNSELECT-BUTON STYLE _lastButtonSelectedIndex: " + _lastButtonSelectedIndex);
			// 		for(key in unselectedButtonStyle) {
			// 			_tableData[_lastButtonSelectedIndex].children[0][key] = unselectedButtonStyle[key];
			// 		}
			// 	}
			// 	else {
			// 		_tableData[_lastButtonSelectedIndex].children[0].font = _commonStyle.smallButton.font;
			// 		_tableData[_lastButtonSelectedIndex].children[0].color = '#999';
			// 	}
   //  		}
    		
   //  		if(selectedButtonStyle) {
   //  			Ti.API.info(constant.APP + " COPYING SELECT-BUTON STYLE");
   //  			Ti.API.info(e.row);
			// 	for(key in selectedButtonStyle) {
			// 		e.row.children[0][key] = selectedButtonStyle[key];
			// 	}
			// }
			// else {
			// 	e.row.children[0].color = '#000';
	  //   		e.row.children[0].font = {
	  //               fontSize: UI.fontSize(14),
	  //               fontFamily: constant.FONT.DEFAULT_FONT,
	  //               fontWeight: 'bold'
	  //           };
			// }
    		
   //  		Utils._.isFunction(clickCallback) && clickCallback({buttonData: e.row.data});
    		
   //  		_lastButtonSelectedIndex = e.row.index;

    		if(unselectedButtonStyle) {
    			Ti.API.info(constant.APP + " COPYING UNSELECT-BUTON STYLE");
    			// for(item in _tableData){
    			for(item = 0, tLength = _tableData.length; item < tLength; item++){	
    				for(key in unselectedButtonStyle) {
						_tableData[item].children[0][key] = unselectedButtonStyle[key];
					}
    			}
			}
    		
    		if(selectedButtonStyle) {
    			Ti.API.info(constant.APP + " COPYING SELECT-BUTON STYLE");
    			eRowStr = JSON.stringify(e.row.children[0]);
    			
    			console.log(eRowStr);
				for(key in selectedButtonStyle) {
					e.row.children[0][key] = selectedButtonStyle[key];
				}
			}
   		
    		Utils._.isFunction(clickCallback) && clickCallback({buttonData: e.row.data});
    		
	    }); //end buttonView
	    
	    
	    if(_selectedButtonIndex > -1) {
	    	_tableData[_selectedButtonIndex].fireEvent('click', {row: _tableData[_selectedButtonIndex]});
	    }
	    return buttonView;
    }; //end _createButtonView
    

	var _loadCategories = function() {
		//Ti.API.info(constant.APP + " ############## _loadCategories CALLED #############");
		_lastButtonSelectedIndex = -1;
	    _selectedButtonIndex = -1;

		if(categoryButtonViewContainer.children.length > 0) {
   			return;
   		}
   		
   		Utils.getCategories(function(responseData) {
   			var _buttonsData = [];
   			for(var i=0; i<responseData.length; i++) {
				_buttonsData.push({
					id: responseData[i].categoryId,
					title: responseData[i].name,
					selected: productDetails && productDetails.categoryId == responseData[i].categoryId
				});
			}
		    var buttonsView = _createButtonView(_buttonsData, Utils._.extend({}, _style.buttonView, {
		    	backgroundColor: '#fff',
		    }), Utils._.extend({}, _style.button, {backgroundColor: '#454545', color: '#fff'}), Utils._.extend({}, _style.button, {
		        backgroundColor: 'transparent',
		        color: '#454545'
		    }), function(e) {
		    	_categorySelected = e.buttonData.id;
		    	_categoryName = (e.buttonData.title).toLowerCase();
		    	if(e.buttonData.selected) {
		    		_loadSubCategories(e.buttonData.id);
		    		return;
		    	}
		    	_subcategorySelected = undefined;
		    	buttonBar.selectButton(_currentButtonIndex+1);
		    	/*
		    	 * Reset size selection
		    	 */
	    		_sizeSelected = undefined;
	    		_customSize = {};
	    		lblSelectSize.text = 'Select Size';
		    	for(var i = 0; i < sizesView.children.length; i++) {
					if(sizesView.children[i].type != 'selectSize') {
						sizesView.remove(sizesView.children[i]);
					}
				}
		    	_loadSubCategories(e.buttonData.id);
		    });
		    categoryButtonViewContainer.add(buttonsView);
   		});
	};
	
	var _loadSubCategories = function(categoryId) {
		//Ti.API.info(constant.APP + " ############## _loadSubCategories CALLED #############");
		_lastButtonSelectedIndex = -1;
	    _selectedButtonIndex = -1;

		if(_categorySelected == undefined) {
			return;
		}
		subcategoryButtonViewContainer.removeAllChildren();
   		Utils.getSubCategories(_categorySelected, function(responseData) {
   			var _buttonsData = [];
   			// _buttonsData.push({
				// id: 0,
				// title: 'ALL',
				// selected: productDetails && productDetails.subcategoryId == 0
			// });
   			for(var i=0; i<responseData.length; i++) {
				_buttonsData.push({
					id: responseData[i].categoryId,
					title: responseData[i].name,
					selected: productDetails && productDetails.subcategoryId == responseData[i].categoryId,
					sizeChart: responseData[i].size
				});
			}
		    var buttonsView = _createButtonView(_buttonsData, Utils._.extend({}, _style.buttonView, {
		    	backgroundColor: '#fff',
		    }), Utils._.extend({}, _style.button, {backgroundColor: '#454545', color: '#fff'}), Utils._.extend({}, _style.button, {
		        backgroundColor: 'transparent',
		        color: '#454545'
		    }), function(e) {
		    	_subcategorySelected = e.buttonData.id;
		    	if(e.buttonData.selected) {
		    		return;
		    	}
		    	_sizeSelected = undefined;
		    	_customSize = {};
		    	_sizeChartSelected = e.buttonData.sizeChart;
		    	/*
		    	 * Reset size selection
		    	 */
		    	for(var i = 0; i < sizesView.children.length; i++) {
					if(sizesView.children[i].type != 'selectSize') {
						sizesView.remove(sizesView.children[i]);
					}
				}
		    	if(_sizeChartSelected == 'E') {	//	E is custom size chart
		    		lblSelectSize.text = 'Enter Sizes';
		    		sizesView.add(_createSizeChartView(_sizeChartSelected));
		    	}
		    	else if(_sizeChartSelected == '') {
		    		lblSelectSize.text = 'Size selection not applicable';
		    	}
		    	else {
		    		lblSelectSize.text = 'Select Size';
		    	}
		    	buttonBar.selectButton(_currentButtonIndex+1);
		    });
		    subcategoryButtonViewContainer.add(buttonsView);
   		});
	};
    
   	var _loadBrands = function() {
   		//Ti.API.info(constant.APP + " ############## _loadBrands CALLED #############");

   		_lastButtonSelectedIndex = -1;
	    _selectedButtonIndex = -1;

   		if(brandsView.children.length > 0) {
   			return;
   		}
   		
   		Utils.getBrands(function(responseData) {
   			Loader.show();
   			var _buttonsData = [];
   			for(var i=0; i<responseData.length; i++) {
				_buttonsData.push({
					id: responseData[i].brandId,
					title: responseData[i].name,
					selected: productDetails && productDetails.brandId == responseData[i].brandId
				});
			}
		    var buttonsView = _createButtonView(_buttonsData, Utils._.extend({}, _style.buttonView, {
		    	backgroundColor: '#fff',
		    }), Utils._.extend({}, _style.button, {backgroundColor: '#454545', color: '#fff'}), Utils._.extend({}, _style.button, {
		        backgroundColor: 'transparent',
		        color: '#454545'
		    }), function(e) {
		    	_brandSelected = e.buttonData.id;
		    	_brandName = e.buttonData.title;
		    	if(e.buttonData.selected) {
		    		return;
		    	}
		    	buttonBar.selectButton(_currentButtonIndex+1);
		    }, true);
		    brandsView.add(buttonsView);
		    Loader.hide();
   		});
   	};
   	
   	/*
   	 * Get size options list
   	 */
   	var _getSizeOptions = function(type) {
   		//Ti.API.info(constant.APP + " ############## _getSizeOptions CALLED #############");
   		var _list = [];
   		for(var size in constant.SIZE_CHARTS[type]) {
   			_list.push({
   				title: size + (constant.SIZE_FULL_FORM[size] != undefined ? ' - ' + constant.SIZE_FULL_FORM[size] : ''),
   				key: size
   			});
   		}
   		return _list;
   	};
   	
   	/*
   	 * Create size chart view
   	 */
   	var _createSizeChartView = function(size) {
   		//Ti.API.info(constant.APP + " ############## _createSizeChartView CALLED #############");

   		var sizeChartView = Ti.UI.createView({
   			width: Ti.UI.FILL,
   			height: Ti.UI.SIZE,
   			layout: 'vertical'
   		});
   		
   		try {
   			//Ti.API.info(constant.APP + " constructing  mainChart view");

   			var mainChart = undefined;

   			if(_productDetailsLaunch){
	   			var createProps = Utils._.extend({},_style.mainChart,{
					borderColor: '#ffffff'
				});
			 	mainChart = Ti.UI.createView(createProps);
   			}
   			else{ // set a white border in the modal
 				mainChart = Ti.UI.createView(_style.mainChart); 	  				
   			}

		    sizeChartView.add(mainChart);
		    
		    if(_sizeChartSelected == 'E') { // size chart for bags
		    	var _sizeParent = constant.SIZE_CHARTS[_sizeChartSelected];
		    	for(var key in _sizeParent) {
			    	var burstView = Ti.UI.createView(Utils._.extend({}, _style.burstView, {
				    	top: -1,
				    	borderColor: '#bfbfbf',
				    	borderWidth: 1
				    }));

				    // console.log("lblBurst: " + constant.SIZE.SIZE_FULL_FORM[key]);
				    var lblBurst = Ti.UI.createLabel(Utils._.extend({}, _style.lblBurst, {
				    	text: constant.SIZE_FULL_FORM[key],
				    	left: '35%'
				    }));

				    var _textIsEditable;
				    if(_customSize.readOnly){
				    	_textIsEditable = false;
				    }
				    else{
				    	_textIsEditable = true;
				    }

				    // console.log(_customSize != undefined && _customSize[constant.SIZE_KEYS[key]] != undefined ? _customSize[constant.SIZE_KEYS[key]] : '');
				    
				    // var lblBurstValue = Ti.UI.createTextField(Utils._.extend({}, _style.lblBurstValue, {
				    // 	value: _customSize != undefined && _customSize[constant.SIZE_KEYS[key]] != undefined ? _customSize[constant.SIZE_KEYS[key]] : '',
				    // 	width: UI.width(45),
				    // 	height: UI.height(30),
				    // 	maxLength: 5,
				    // 	paddingRight: 2,
				    // 	textAlign: 'right',
				    // 	borderColor: '#bfbfbf',
				    // 	borderWidth: 1,
				    // 	editable: _textIsEditable,
				    // 	key: constant.SIZE_KEYS[key]
				    // }));
				    var lblBurstValStyle = null;
				    var burstVal = _customSize != undefined && _customSize[constant.SIZE_KEYS[key]] != undefined ? _customSize[constant.SIZE_KEYS[key]] : ''
				    if(_productDetailsLaunch){
				    	lblBurstValStyle = {
					    	value: burstVal,
					    	width: Ti.UI.SIZE,
					    	height: UI.height(30),
					    	maxLength: 5,
					    	paddingRight: 2,
					    	borderColor: '#bfbfbf',
					    	borderWidth: 1,
					    	touchEnabled: false
					    }
				    }
				    else{
				    	lblBurstValStyle = {
					    	value: burstVal,
					    	width: UI.width(45),
					    	height: Ti.UI.SIZE,
					    	maxLength: 5,
					    	paddingRight: 2,
					    	textAlign: 'right',
					    	borderColor: '#bfbfbf',
					    	borderWidth: 1,
					    	editable: _textIsEditable,
					    	key: constant.SIZE_KEYS[key]
					    }
				    }
				    var lblBurstValue = Ti.UI.createTextField(Utils._.extend({}, _style.lblBurstValue,lblBurstValStyle));

				    var lblBurstIn = Ti.UI.createLabel(Utils._.extend({}, _style.lblBurstValue, {
				    	text: 'in.'
				    	// left: UI.left(170)
				    }));

				    burstView.add(lblBurst);
				    burstView.add(lblBurstValue);
				    burstView.add(lblBurstIn);
				    sizeChartView.add(burstView);
				    lblBurstValue.addEventListener('change', function() {
				    	_customSize[this.key] = this.value;
				    });
			    }

		    }
		    else {
		    	var _sizeParent = constant.SIZE_CHARTS[_sizeChartSelected][size];
			    var _keyLength = Object.keys(_sizeParent.primary).length;
			    
			    for(var key in _sizeParent.primary) {
			    	var USView = Ti.UI.createView(Utils._.extend({}, _style.USView, {
				    	left: 0,
				    	top: UI.top(10),
				    	bottom: UI.bottom(10),
				    	width: (96 / _keyLength) + '%'
				    }));
				    var lblUS = Ti.UI.createLabel(Utils._.extend({}, _style.lblUS, {
				    	text: key
				    }));
				    var lblUSValue = Ti.UI.createLabel(Utils._.extend({}, _style.lblUSValue, {
				    	text: _sizeParent.primary[key]
				    }));
				    USView.add(lblUS);
				    USView.add(lblUSValue);
				    mainChart.add(USView);
			    }
			    
			    var _sKeyLength = Object.keys(_sizeParent.secondary).length;
			    var viewWidth = (110 / 3) + '%';
			    // if(_productDetailsLaunch){
			    	if(_sKeyLength > 1){ // clothing apparel
				    	viewWidth = (110 / 3) + '%';
				    }
				    else{ // for sizeChart  type E  (shoes)
				    	viewWidth = '28%';
				    }
			    // }
			    // else{
			    // 	viewWidth = '30%';
			    // }
			    

			    for(var key in _sizeParent.secondary) {
			    	var burstView = Ti.UI.createView(Utils._.extend({}, _style.burstView, {
				    	top: -1,
				    	borderColor: '#bfbfbf',
				    	borderWidth: 1
				    }));

				    // var lblBurstView = Ti.UI.createView({
				    // 	width: viewWidth
				    // });
					
					//Ti.API.info(constant.APP + " ########## FIRST KEY: " + constant.SIZE_FULL_FORM[key]);
				    var lblBurst = Ti.UI.createLabel(Utils._.extend({}, _style.lblBurst, {
				    	text: constant.SIZE_FULL_FORM[key],
				    	left: viewWidth
				    }));

				    // lblBurstView.add(lblBurst);

				    // var lblBurstValueView = Ti.UI.createView({
				    // 	width: Ti.UI.SIZE
				    // });

				    var lblBurstValue = Ti.UI.createTextField(Utils._.extend({}, _style.lblBurstValue, {
				    	// left: 0,
				    	value: _sizeParent.secondary[key],
				    	// width: UI.width(45),
				    	width: Ti.UI.SIZE,
				    	// height: UI.height(30),
				    	height: Ti.UI.SIZE,
				    	maxLength: 5,
				    	paddingRight: 2,
				    	// textAlign: 'right',
				    	touchEnabled: false
				    }));

				    // lblBurstValueView.add(lblBurstValue);
				    
				    // var lblBurstInView = Ti.UI.createView({
				    // 	width: Ti.UI.SIZE
				    // });

				    var lblBurstIn = Ti.UI.createLabel(Utils._.extend({}, _style.lblBurstValue, {
				    	text: 'in.'
				    	// left: UI.left(170)
				    }));

				    // lblBurstInView.add(lblBurstIn);
				    
				    burstView.add(lblBurst);
				    burstView.add(lblBurstValue);
				    burstView.add(lblBurstIn);

				    // burstView.add(lblBurstView);
				    // burstView.add(lblBurstValueView);
				    // burstView.add(lblBurstInView);

				    sizeChartView.add(burstView);
			    }
		    }
		    //Ti.API.info(constant.APP + " try block complete");
   		}
   		catch(e) {}
   		
   		var _sizeChartComment = '';
   		switch(_sizeChartSelected) {
   			case 'A':
   			case 'B':
   				_sizeChartComment = constant.ALERT.MESSAGE.GARMENTS;
   			break;
   			case 'C':
   				_sizeChartComment = constant.ALERT.MESSAGE.FOOTWEAR;
   			break;
   			case 'D':
   			case 'E':
   			case 'F':
   				_sizeChartComment = '';
   			break;
   		}
   		
   		//Ti.API.info(constant.APP + " constructing labelSizeComment label");
   		var lblSizeComment = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
			text: _sizeChartComment,
			left: UI.left(10),
			right: UI.right(10),
			top: UI.top(10),
			font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT
           	},
			color: '#757575',
			textAlign: 'left'
	    }));
   		sizeChartView.add(lblSizeComment);
	    
	    //Ti.API.info(constant.APP + " returning sizeChartView");
	    return sizeChartView;
   	}; //end _createSizeChartView
	
	/*
	 * Inputs view
	 */
    var titleView = Ti.UI.createView({
    	top: 0,
    	width: Ti.UI.FILL,
    	height: Ti.UI.SIZE,
    	layout: 'vertical'
    });

    var txtTitle = UI.createTextField(Utils._.extend({}, _style.textArea, {
    	top: 0,
    	left: UI.left(30),
    	width: UI.width(260),
        hintText: 'Enter title here... Max 150 Characters',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        value: productDetails && productDetails.productTitle ? productDetails.productTitle : '',
        type: 'textArea',
        maxLength: 150,
        bubbleParent: false
    }));

    _sellDetailsSlugs.txtTitle = "";

    var lblTitle = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.txtField, {
    	text: 'What are you selling?\n\nAn interesting title can get your item noticed.',
    	top: UI.top(20),
        width: UI.width(240),
    	height: Ti.UI.SIZE,
    	font: {
            fontSize: UI.fontSize(12),
            fontFamily: constant.FONT.DEFAULT_FONT
        },
        color: '#828282',
        bubbleParent: true
    }));
    titleView.add(txtTitle);
	titleView.add(lblTitle);
    
    /*
     * Category view
     */
    
    var categoryView = Ti.UI.createScrollView(Utils._.extend({}, _style.buttonView, {
    	backgroundColor: '#fff',
    	top: 0,
    	height: UI.height(260),
        canCancelEvents: false
    }));
    var categoryButtonViewContainer = Ti.UI.createScrollView(Utils._.extend({}, _style.buttonView, {
    	left: 0,
    	right: 0,
    	height: UI.height(250),
    	showVerticalScrollIndicator: true
    }));
	categoryView.add(categoryButtonViewContainer);
	
	
    /*
     * Sub-category view
     */
    var subcategoryView = Ti.UI.createScrollView(Utils._.extend({}, _style.buttonView, {
    	backgroundColor: '#fff',
    	top: 0,
    	height: UI.height(250),
        canCancelEvents: false
    }));
    var subcategoryButtonViewContainer = Ti.UI.createScrollView(Utils._.extend({}, _style.buttonView, {
    	left: 0,
    	right: 0,
    	height: UI.height(250),
    	showVerticalScrollIndicator: true
    }));
	subcategoryView.add(subcategoryButtonViewContainer);
	

    /*
     * Brands view
     */
    var brandsView = Ti.UI.createView(Utils._.extend({}, _style.buttonView, {
    	backgroundColor: '#fff',
    	top: 0,
    	height: UI.height(250),
    	showVerticalScrollIndicator: true
    }));
    
    
    /*
     * Size view
     */
    var sizesView = Ti.UI.createView({
    	top: 0,
    	width: Ti.UI.FILL,
    	height: Ti.UI.SIZE, // UI.height(260),
    	layout: 'vertical'
    });
    var selectSizeView = Ti.UI.createView({
    	backgroundColor: '#f4f4f4',
    	width: Ti.UI.FILL,
    	height: UI.height(40),
    	type: 'selectSize'
    });	
    var lblSelectSize = Ti.UI.createLabel(Utils._.extend({}, _style.lblBurst, {
    	text: 'Select Size',
    	width: Ti.UI.SIZE,
    	height: Ti.UI.FILL
    }));
    var imgDropDown = Ti.UI.createImageView({
    	image: '/images/stylFeed/down-arrow.png',
    	right: UI.left(20),
    	width: UI.width(13),
    	height: UI.height(8)
    });
    selectSizeView.add(lblSelectSize);
    selectSizeView.add(imgDropDown);
    
    sizesView.add(selectSizeView);
    
    var sizeChartViewRef = null;

    if(_sizeChartSelected) {
    	sizeChartViewRef = _createSizeChartView(_sizeSelected);
    	sizesView.add(sizeChartViewRef);
    	if(_sizeChartSelected == 'E') {
    		lblSelectSize.text = 'Enter Sizes';
    	}
    	// else {
    		// lblSelectSize.text = _sizeSelected + (constant.SIZE_FULL_FORM[_sizeSelected] != undefined ? ' - ' + constant.SIZE_FULL_FORM[_sizeSelected] : '');
    	// }
    }

    selectSizeView.addEventListener('click', function() {
    	//Ti.API.info(constant.APP + " ############## selectSizeView CLICKED #############");

    	if(_sizeChartSelected == '' || _sizeChartSelected == undefined || _sizeChartSelected == null) {
    		return;
    	}
		if(_sizeChartSelected == 'NA' || lblSelectSize.text == 'Enter Sizes') {
    		return;
    	}
    	var _sizeOptions = _getSizeOptions(_sizeChartSelected);
    	var optiosView = require('/components/popOver').get({
    		optionStyle: {
    			backgroundColor: '#f4f4f4',
    			font: {
	                fontSize: UI.fontSize(12),
	                fontFamily: constant.FONT.DEFAULT_FONT
	            },
    			borderColor: '#bfbfbf',
    			borderWidth: 1
    		},
			width: Ti.UI.FILL,
			height: UI.height(_sizeOptions.length*40),
			sourceView: this,
			options: _sizeOptions,
			selectedOption: _sizeSelected ? _sizeSelected + (constant.SIZE_FULL_FORM[_sizeSelected] != undefined ? ' - ' + constant.SIZE_FULL_FORM[_sizeSelected] : '') : undefined
		});
		optiosView.show();
		optiosView.addEventListener('click', function(e) {
			//Ti.API.info(constant.APP + " ############## selectSizeView optiosView CLICKED #############");
			_sizeSelected = e.option.key;
			for(var i = 0; i < sizesView.children.length; i++) {
				if(sizesView.children[i].type != 'selectSize') {
					sizesView.remove(sizesView.children[i]);
				}
			}
			sizesView.add(_createSizeChartView(_sizeSelected));
			// lblSelectSize.text = _sizeSelected + (constant.SIZE_FULL_FORM[_sizeSelected] != undefined ? ' - ' + constant.SIZE_FULL_FORM[_sizeSelected] : '');
			optiosView.hide();
			// buttonBar.selectButton(_currentButtonIndex+1);
		});
    }); //end selectSizeView
	
    
    /*
     * Description view
     */
    var descriptionView = Ti.UI.createView({
    	top: 0,
    	width: Ti.UI.FILL,
    	height: Ti.UI.SIZE,
    	layout: 'vertical'
    });
    var txtDescription = UI.createTextField(Utils._.extend({}, _style.textArea, {
    	top: 0,
    	left: UI.left(30),
    	width: UI.width(260),
        hintText: 'Describe your item here... Max 300 Characters',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        value: productDetails && productDetails.productDescription ? productDetails.productDescription : '',
        type: 'textArea',
        bubbleParent: false,
        maxLength: 300
    }));
    var lblDescription = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.txtField, {
    	text: 'Tell us about your item & why are you are selling it?\n\nMention fabric composition, detailing, hardware, signs of wear-and-tear or anything a buyer should know.\n\nHonesty builds your rep and increases chances of sale!',
    	top: UI.top(20),
        width: UI.width(240),
    	height: Ti.UI.SIZE,
    	font: {
            fontSize: UI.fontSize(12),
            fontFamily: constant.FONT.DEFAULT_FONT
        },
        color: '#828282',
        bubbleParent: true
    }));
    descriptionView.add(txtDescription);
	descriptionView.add(lblDescription);
        
    /*
     * Price view
     */
    var priceView = Ti.UI.createView(_style.priceView);
    priceView.top = 0;
    var txtSellingPrice = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
    	top: -1,
    	value: '',
    	width: UI.width(262),
    	height: UI.height(40),
        hintText: 'asking price',
        keyboardType: Ti.UI.KEYBOARD_DECIMAL_PAD,
        borderWidth: 1,
        borderColor: '#bfbfbf',
        bubbleParent: false
    }));
    var lblOriginalPrice = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.txtField, {
        text: '+ Shipping & Handling',
        top: -1,
        width: UI.width(262),
    	height: UI.height(40),
    	color: '#e0e0e0',
    	borderWidth: 1,
        borderColor: '#bfbfbf'
    }));
    var txtOriginalPrice = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
    	top: -1,
        width: UI.width(262),
        value: '',
    	height: UI.height(40),
        hintText: 'original price (optional)',
        keyboardType: Ti.UI.KEYBOARD_DECIMAL_PAD,
        borderWidth: 1,
        borderColor: '#bfbfbf',
        bubbleParent: false
    }));
    var txtListingPrice = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.txtField, {
    	text: '\u20B9 0',
    	top: -1,
        width: UI.width(262),
    	height: UI.height(40),
        // hintText: 'display price',
        keyboardType: Ti.UI.KEYBOARD_DECIMAL_PAD,
        borderWidth: 1,
        borderColor: '#bfbfbf',
        font: {
            fontSize: UI.fontSize(18),
            fontFamily: constant.FONT.DEFAULT_FONT,
            fontWeight: 'bold'
        },
        color: '#828282'
    }));
    var btnViewDetails = UI.createButton({
    	title: 'View Details',
    	top: 0,
        width: UI.width(100),
    	height: UI.height(30),
        font: {
            fontSize: UI.fontSize(12),
            fontFamily: constant.FONT.DEFAULT_FONT
        },
        color: '#000',
        bubbleParent: true
    });
    var lblShippingInfo = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.txtField, {
    	text: 'Listed Price includes Shipping & Handling, SF Commision and All Applicable Taxes.',
    	top: UI.top(20),
        width: UI.width(262),
    	height: Ti.UI.SIZE,
    	font: {
            fontSize: UI.fontSize(12),
            fontFamily: constant.FONT.DEFAULT_FONT
        },
        color: '#828282',
        bubbleParent: true
    }));
    
    var donateView = Ti.UI.createView({
    	top: UI.top(30),
        width: UI.width(262),
    	height: Ti.UI.SIZE,
        bubbleParent: true
    });
    var btnDonateView = UI.createClickableView({
    	left: UI.left(5),
    	width: UI.width(30),
    	height: UI.height(30)
    });
    var btnDonate = UI.createButton({
    	backgroundImage: _toBeDonated ? '/images/sell/form-check-on.png' : '/images/sell/form-check-off.png',
    	width: UI.width(15),
    	height: UI.height(15)
    });
    btnDonateView.add(btnDonate);
    var lblDonateText = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.txtField, {
    	text: 'I would like to Donate my earnings from this Sale to a Charitable Cause.',
    	left: UI.left(45),
        width: UI.width(215),
    	height: Ti.UI.SIZE,
    	font: {
            fontSize: UI.fontSize(12),
            fontFamily: constant.FONT.DEFAULT_FONT
        },
        color: '#828282'
    }));
    donateView.add(btnDonateView);
    donateView.add(lblDonateText);
    
    btnDonateView.addEventListener('click', function() {
    	//Ti.API.info(constant.APP + " ############## btnDonateView CLICKED #############");
    	if(this.children[0].backgroundImage == '/images/sell/form-check-off.png') {
    		this.children[0].backgroundImage = '/images/sell/form-check-on.png';
    		_toBeDonated = true;
    		Analytics.trackEvent({
		  		category: "Donate (Sell)",
		  		action: "click",
		  		label: "",
		  		value: 1
			});
    	}
    	else {
    		this.children[0].backgroundImage = '/images/sell/form-check-off.png';
    		_toBeDonated = false;
    	}
    }); //end btnDonateView
    
    priceView.add(txtSellingPrice);
    // priceView.add(lblOriginalPrice);
    priceView.add(txtOriginalPrice);
    priceView.add(txtListingPrice);
    priceView.add(lblShippingInfo);
    priceView.add(btnViewDetails);
    priceView.add(donateView);
    
    btnViewDetails.addEventListener('click', function() {
    	//Ti.API.info(constant.APP + " ############## btnViewDetails CLICKED #############");
    	Analytics.trackEvent({
	  		category: "View Details (Sell)",
	  		action: "click",
	  		label: "",
	  		value: 1
		});
		
    	var alertDialog = UI.createAlertDialog({
    		title: 'Price Break-up',
    		message: 'Listing is always free on StylFlip. We mark-up your asking price by 20% and charge and additional \u20B9 120 for shipping if the display price is less than \u20B9 2000.\n\nAsking Price: \u20B9 '+(txtSellingPrice.value == '' || txtSellingPrice.value == '0' ? 0 : txtSellingPrice.value)+'\nSF Comm.: \u20B9 '+Math.ceil((txtSellingPrice.value * Utils.getCommisionPercentage()) / 100)+'\nS & H: '+_getShippingAndHandlingFees(txtSellingPrice.value)+'\nDisplay Price: '+txtListingPrice.text,
    		buttonNames: ['GOT IT']
    	});
    	alertDialog.show();
    	alertDialog = null;
    }); //end btnViewDetails click callback
    
    
    txtSellingPrice.addEventListener('change', function() {
    	Ti.API.info(constant.APP + " ############## txtSellingPrice CLICKED #############");
    	txtListingPrice.text = _getCalculatedPrice(txtSellingPrice.value.trim(), txtOriginalPrice.value.trim());
    });
    txtOriginalPrice.addEventListener('change', function() {
    	Ti.API.info(constant.APP + " ############## txtOriginalPrice CLICKED #############");
    	txtListingPrice.text = _getCalculatedPrice(txtSellingPrice.value.trim(), txtOriginalPrice.value.trim());
    });
    
    /*
     * Condition view
     */
    
    var _conditionViewButtonData = [
    	{title: 'Brand new with tags', selected: productDetails && productDetails.condition=='Brand new with tags'},
    	{title: 'New without tags', selected: productDetails && productDetails.condition=='New without tags'},
    	{title: 'Barely Worn (once or twice)', selected: productDetails && productDetails.condition=='Barely Worn (once or twice)'},
    	{title: 'Gently Used', selected: productDetails && productDetails.condition=='Gently Used'}
    ];
    
    var conditionView = _createButtonView(_conditionViewButtonData, Utils._.extend({}, _style.buttonView, {
    	backgroundColor: '#fff',
    }), Utils._.extend({}, _style.button, {backgroundColor: '#454545', color: '#fff'}), Utils._.extend({}, _style.button, {
        backgroundColor: 'transparent',
        color: '#454545'
    }), function(e) {
    	_conditionSelected = e.buttonData.title;
    	if(e.buttonData.selected) {
    		return;
    	}
    	buttonBar.selectButton(_currentButtonIndex+1);
    });
    
    
    /*
     * Pick-up from view 
     */
    var pickupFromView = Ti.UI.createView({
    	top: 0,
    	width: Ti.UI.FILL,
    	height: Ti.UI.SIZE, // UI.height(260),
    	layout: 'vertical'
    });
    var selectAddressView = Ti.UI.createView({
    	backgroundColor: '#f4f4f4',
    	width: Ti.UI.FILL,
    	height: UI.height(40),
    	type: 'selectAddress'
    });	
    var lblSelectAddress = Ti.UI.createLabel(Utils._.extend({}, _style.lblBurst, {
    	text: 'Select Address',
    	width: Ti.UI.SIZE,
    	height: Ti.UI.FILL
    }));
    var imgDropDown = Ti.UI.createImageView({
    	image: '/images/stylFeed/down-arrow.png',
    	right: UI.left(20),
    	width: UI.width(13),
    	height: UI.height(8)
    });
    selectAddressView.add(lblSelectAddress);
    selectAddressView.add(imgDropDown);
    
    pickupFromView.add(selectAddressView);
    

    selectAddressView.addEventListener('click', function() {
    	//Ti.API.info(constant.APP + " ############## selectAddressView CLICKED #############");
    	var sourceView = this;
    	if(!_userAddresses) {
    		var _requestArgs = {
		        showLoader: true,
		        url: 'stylfile.php',
		        method: 'post',
		        serverArgs: {
		        	action: 'getUserProfileForEditProfile',
		            userId: Utils.loggedInUserId()
		       	}
		    };
		    
		    HttpClient.getResponse({
		    	requestArgs: _requestArgs,
		    	success: function(response) {
			        var _addresses = response.data[0].userAddresses;
			        _userAddresses = [];
			        for(var i = 0; i < _addresses.length; i++) {
			        	_userAddresses.push(_addresses[i].addressTitle);
			        }
			        if(_userAddresses.length < 3) {
			        	_userAddresses.push('Add a location');
			        }
			        Utils._.isFunction(successCallback) && successCallback({
			        	saveAddresses: true,
			        	userAddresses: _userAddresses
			        }); 
			        var optiosView = require('/components/popOver').get({
			    		optionStyle: {
			    			backgroundColor: '#f4f4f4',
			    			font: {
				                fontSize: UI.fontSize(12),
				                fontFamily: constant.FONT.DEFAULT_FONT
				            },
			    			borderColor: '#bfbfbf',
			    			borderWidth: 1
			    		},
						width: Ti.UI.FILL,
						height: UI.height(_userAddresses.length*40),
						sourceView: sourceView,
						options: _userAddresses,
						selectedOption: _pickupFrom
					});
					optiosView.show();
					optiosView.addEventListener('click', function(e) {
						//Ti.API.info(constant.APP + " ############## getResponse success optiosView CLICKED #############");
						optiosView.hide();
						if(e.option == 'Add a location') {
				    		var window = Window.create(exitOnClose=false);
					        var addAddress = require('/screens/addressesAccordion').get(tabSelected='sell', false, _userAddresses, function(data) {
					        	_userAddresses.splice(_userAddresses.indexOf('Add a location'), 1);
					        	_userAddresses.push(data.addressTitle);
					        	if(_userAddresses.length < 3) {
						        	_userAddresses.push('Add a location');
						        }
						        Utils._.isFunction(successCallback) && successCallback({
						        	saveAddresses: true,
						        	userAddresses: _userAddresses
						        }); 
					        });
					        window.add(addAddress.getView());
					        Window.open(window);
				    	}
				    	else {
				    		_pickupFrom = e.option;
				    	}
					});
		        },
		    	error: function(error) {
		    		var alertDialog = UI.createAlertDialog({
		    			title: error.errorTitle,
		    			message: error.errorMessage
		    		});
		    		alertDialog.show();
		    		alertDialog = null;
		    	}
		    }); 
		    return;	
    	}
    	var optiosView = require('/components/popOver').get({
    		optionStyle: {
    			backgroundColor: '#f4f4f4',
    			font: {
	                fontSize: UI.fontSize(12),
	                fontFamily: constant.FONT.DEFAULT_FONT
	            },
    			borderColor: '#bfbfbf',
    			borderWidth: 1
    		},
			width: Ti.UI.FILL,
			height: UI.height(_userAddresses.length*40),
			sourceView: sourceView,
			options: _userAddresses,
			selectedOption: _pickupFrom
		});
		optiosView.show();
		optiosView.addEventListener('click', function(e) {
			//Ti.API.info(constant.APP + " ############## popOver optiosView CLICKED #############");
			optiosView.hide();
			if(e.option == 'Add a location') {
	    		var window = Window.create(exitOnClose=false);
		        var addAddress = require('/screens/addressesAccordion').get(tabSelected='sell', false, _userAddresses, function(data) {
		        	_userAddresses.splice(_userAddresses.indexOf('Add a location'), 1);
		        	_userAddresses.push(data.addressTitle);
		        	if(_userAddresses.length < 3) {
			        	_userAddresses.push('Add a location');
			        }
			        Utils._.isFunction(successCallback) && successCallback({
			        	saveAddresses: true,
			        	userAddresses: _userAddresses
			        }); 
		        });
		        window.add(addAddress.getView());
		        Window.open(window);
	    	}
	    	else {
	    		_pickupFrom = e.option;
	    	}
		});
    }); //end selectAddressView
    
    
    var _brandsTimeout;
    
   	var _buttonBarClickCallback = function(e) {
   		if(_brandsTimeout) {
   			clearTimeout(_brandsTimeout);
   			_brandsTimeout = undefined;
   		}
   		
   		_currentButtonIndex = e.index;
   		if(_currentButtonIndex == _objButtons.length - 1) {
   			btnNext.title = 'DONE';
   		}
   		else {
   			btnNext.title = 'NEXT';
   		}
   		
   		if(_currentButtonIndex == 0) {
   			// UI.disableButton(btnPrev);
   			btnPrev.visible = false;
   		}
   		else {
   			// UI.enableButton(btnPrev);
   			btnPrev.visible = true;
   		}
   		
    	txtTitle.blur();
    	txtDescription.blur();
    	txtSellingPrice.blur();
    	txtOriginalPrice.blur();
    	
		titleView.visible = false;
		categoryView.visible = false;
		subcategoryView.visible = false;
		brandsView.visible = false;
		sizesView.visible = false;
		descriptionView.visible = false;
		priceView.visible = false;
		conditionView.visible = false;
		pickupFromView.visible = false;
		
    	switch(e.title) {
    		case 'BRAND':
    			_loadBrands();
    		break;
    		
    		case 'CATEGORY':
    			_loadCategories();
    		break;
    		
    		case 'SUB-CATEGORY':
    		case 'SIZE':
    			if(!e.triggered && _categorySelected == undefined) {
    				var alertDialog = UI.createAlertDialog({
    					title: constant.ALERT.TITLE.FAUX_PAS,
	                    message: 'Please select a category'
	                });
	                alertDialog.show();
	                alertDialog = null;
	                return;
    			}
				// _loadSubCategories();
    		break;
    		
    		case 'PICK-UP FROM':
    			selectAddressView.fireEvent('click');
    		break;
    	}
    	
    	if(e.title == 'SIZE') {
    		selectSizeView.fireEvent('click');
    	}
    	
    	if(e.title == 'BRAND') {
    		_brandsTimeout = setTimeout(function() {
	    		if(e.viewToShow) {
		    		e.viewToShow.visible = true;
		    	}
	    	}, 500);
    	}
    	else {
    		if(e.viewToShow) {
	    		e.viewToShow.visible = true;
	    	}
    	}
    }; //end _buttonBarClickCallback
    

	/*
	 * Main buttons view
	 */
    var _objButtons = [
    	{title: 'TITLE', viewToShow: titleView, selected: true},
    	{title: 'DESCRIPTION', viewToShow: descriptionView},
    	{title: 'CATEGORY', viewToShow: categoryView},
    	{title: 'SUB-CATEGORY', viewToShow: subcategoryView},
    	{title: 'BRAND', viewToShow: brandsView},
    	{title: 'SIZE', viewToShow: sizesView},
    	{title: 'CONDITION', viewToShow: conditionView},
    	{title: 'PICK-UP FROM', viewToShow: pickupFromView},
    	{title: 'PRICE', viewToShow: priceView}
    ];
    
    var _lastInputViewShown = titleView;
    
	var buttonBar = require('/components/buttonBar').get({
		backgroundColor: '#f4f4f4',
		top: 0,
		width: UI.width(320),
		buttons: _objButtons,
		selectedButtonStyle: _style.selectedButton,
		unselectedButtonStyle: _style.unselectedButton,
		scrollable: true
	});
	
	buttonBar.addEventListener('click', function(e) {
		//Ti.API.info(constant.APP + " ############## buttonBar CLICKED #############");
		Analytics.trackEvent({
	  		category: Utils.toFirstUppercase(e.title) + " (Sell)",
	  		action: "click",
	  		label: "",
	  		value: 1
		});
		_buttonBarClickCallback(e);
	});
	
	
    var inputView = Ti.UI.createView(_style.inputView);
    inputView.add(titleView);
    inputView.add(categoryView);
    inputView.add(subcategoryView);
    inputView.add(brandsView);
    inputView.add(sizesView);
    inputView.add(descriptionView);
    inputView.add(priceView);
    inputView.add(conditionView);
    inputView.add(pickupFromView);
    
    titleView.visible = false;
	categoryView.visible = false;
	subcategoryView.visible = false;
	brandsView.visible = false;
	sizesView.visible = false;
	descriptionView.visible = false;
	priceView.visible = false;
	conditionView.visible = false;
	pickupFromView.visible = false;
	
	var _titleAutoSelect = productDetails && productDetails.productTitle ? false : true;
	
	txtTitle.addEventListener('return', function() {
		//Ti.API.info(constant.APP + " ############## txtTitle RETURN #############");
		buttonBar.selectButton(_currentButtonIndex+1);
	});
	
	txtDescription.addEventListener('return', function() {
		//Ti.API.info(constant.APP + " ############## txtDescription RETURN #############");
		buttonBar.selectButton(_currentButtonIndex+1);
	});
	
    if(productDetails) {
    	txtOriginalPrice.value = productDetails.originalPrice;
    	txtSellingPrice.value = productDetails.sellingPrice;
    	// txtListingPrice.text = '\u20B9 ' + productDetails.discountPrice;
    	txtListingPrice.text = '\u20B9 ' + _productDetailsDiscount;
    }
    
    fieldsView.add(buttonBar.getView());
    fieldsView.add(inputView);
    
    fieldsView.addEventListener('swipe', function(e) {
    	//Ti.API.info(constant.APP + " ############## fieldsView SWIPE #############");
    	if(e.direction == 'right') {
    		btnPrev.fireEvent('click');
    	}
    	else if(e.direction == 'left') {
    		btnNext.fireEvent('click');
    	}
    });
    
    mainView.addEventListener('click', function() {
    	//Ti.API.info(constant.APP + " ############## mainView SWIPE #############");
    	txtTitle.blur();
    	txtDescription.blur();
    	txtSellingPrice.blur();
    	txtOriginalPrice.blur();
    });

    
    var _getView = function() {
        return mainView;
    };
    
    
    _win.addEventListener('close', function() {
    	_removeFromMemory();
    });
    
    var _removeFromMemory = function() {
    	_style = null;
        Window.clearMemory(mainView);
        mainView = null;
        _getView = null;
        _removeFromMemory = null;
    };
    
    return {
        getView: _getView,
        sizeChartView: sizeChartViewRef,
        removeFromMemory: _removeFromMemory
    };
};

