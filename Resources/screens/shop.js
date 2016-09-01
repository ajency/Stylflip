exports.get = function() {
	var _style = require('/styles/shop').get();
	
	var _pageIndex = 0;
	var _currentView = 'grid';
	
	var mainView = Ti.UI.createView(_style.mainView); 
	
	var gridButtonsView = Ti.UI.createView(_style.gridButtonsView);
    var btnListView = UI.createButton(Utils._.extend({}, _style.gridButtons, {
		backgroundImage: '/images/shop/list.png',
		right: UI.right(10),
		touchEnabled: true
    }));
    var btnGridView = UI.createButton(Utils._.extend({}, _style.gridButtons, {
		backgroundImage: '/images/shop/grid-active.png',
		right: btnListView.width + UI.right(15),
		touchEnabled: false
    }));
    gridButtonsView.add(btnListView);
    gridButtonsView.add(btnGridView);
    
    mainView.add(gridButtonsView);
    
    // btnListView.addEventListener('click', function() {
     btnListView.addEventListener('singletap', function() {	
    	Ti.API.info(constant.APP + " ################ LOADING LIST VIEW ################");
    	btnListView.touchEnabled = false;
    	btnListView.backgroundImage = '/images/shop/list-active.png';
    	btnGridView.touchEnabled = true;
    	btnGridView.backgroundImage = '/images/shop/grid.png';
    	_currentView = 'list';
    	gridView.isAdded = false;
    	_showListView(true);
    });
    
    // btnGridView.addEventListener('click', function() {
    btnGridView.addEventListener('singletap', function() {
    	Ti.API.info(constant.APP + " ################ LOADING GRID VIEW ################");
    	btnListView.touchEnabled = true;
    	btnListView.backgroundImage = '/images/shop/list.png';
    	btnGridView.touchEnabled = false;
    	btnGridView.backgroundImage = '/images/shop/grid-active.png';
    	_currentView = 'grid';
    	listView.isAdded = false;
    	_showGridView(true);
    });
    
    
    /*
     * List / Grid lazy loading callback
     */
    var _lazyLoadingCallback = function() {
    	// _pageIndex++;
		if(_currentView == 'grid') {
			_showGridView();
		}
		else if(_currentView == 'list') {
			_showListView();
		}
    };
    
    
    /*
     * List / Grid Pull to refresh callback
     */
    var _pullToRefreshCallback = function() {
		if(_currentView == 'grid') {
			_showGridView(true);
		}
		else if(_currentView == 'list') {
			_showListView(true);
		}
    };    
    
	var listView = require('/components/listView').get();
	listView.setBackgroundColor('#f4f4f4');
	listView.setRowSpacing(5);
	
	listView.addEventListener('scrolledToBottom', function() {
		_lazyLoadingCallback();
	});
	
	listView.addEventListener('pullToRefresh', function() {
		_pullToRefreshCallback();
	});

	var gridView = require('/components/gridView').get({
		// width: UI.width(310),
		// columnLength: 2,
		// margin: UI.left(5)
		width: UI.width(320), 
    	columnLength: 2, 
    	margin: UI.left(8)
	});
	gridView.setBackgroundColor('#f4f4f4');
	gridView.setColumnTop(UI.top(10));
	
	
	gridView.addEventListener('scrolledToBottom', function() {
		_lazyLoadingCallback();
	});
	
	gridView.addEventListener('pullToRefresh', function() {
		_pullToRefreshCallback();
	});
	
	var _columnWidth = gridView.getSingleColumnWidth();
	
	
	/*
	 * List view click listener
	 */
	listView.addEventListener('click', function(e) {
        if(e.row.productData) {
        	Analytics.trackEvent({
		  		category: "Product Details (Shop)",
		  		action: "click",
		  		label: ""+e.row.productData.productId+"",
		  		value: 1
			});
			
	        //	Goto details view
	        var window = Window.create(exitOnClose=false);
	        var productDetails = require('/screens/productDetails').get(tabSelected='shop', e.row.productData.productId, function(e) {
	        	if(e.type == 'purchase') {
	        		Window.closeAll(function() {
	        			if(e.success) {
	        				// var alertDialog = UI.createAlertDialog({
				                // title: constant.ALERT.TITLE.SUCCESS, 
				                // message: 'Your order "' + e.orderNumber + '" has been placed. You will receive a confirmation email shortly.'
				            // });
	        			}
	        			else {
	        				var alertDialog = UI.createAlertDialog({
				                title: constant.ALERT.TITLE.WHOOPSIE, 
				                message: e.errorMessage
				            });
				            alertDialog.show();
			            	alertDialog = null;
	        			}
					});
	        	}
	        });
	        window.add(productDetails.getView());
	        Window.open(window); 
		}
	});
	
	/*
	 * List view load listener
	 */
	listView.addEventListener('load', function(e) {
		Loader.hide();
	});
	
	
	/*
	 * List view click listener
	 */
	gridView.addEventListener('click', function(e) {
		var column = e.column;
		if(e.column.productData) {
			Analytics.trackEvent({
		  		category: "Product Details (Shop)",
		  		action: "click",
		  		label: ""+e.column.productData.productId+"",
		  		value: 1
			});

			var _productData = e.column.productData;
			_productData.isLiked = e.column.btnLike.isLiked;
	        //	Goto details view
	        var window = Window.create(exitOnClose=false);
	        var productDetails = require('/screens/productDetails').get(tabSelected='shop', _productData.productId, function(e) {
	        	if(e.type == 'like') {
	        		if(e.isLiked) {
			    		column.btnLike.backgroundImage = '/images/common/like-active.png';
			    		column.btnLike.isLiked = true;
		        	}
		        	else {
		        		column.btnLike.backgroundImage = '/images/common/like.png';
		        		column.btnLike.isLiked = false;
		        	}
	        	}
	        	else if(e.type == 'purchase') {
	        		if(e.success) {
        				// var alertDialog = UI.createAlertDialog({
			                // title: constant.ALERT.TITLE.SUCCESS, 
			                // message: 'Your order "' + e.orderNumber + '" has been placed. You will receive a confirmation email shortly.'
			            // });
        			}
        			else {
        				var alertDialog = UI.createAlertDialog({
			                title: constant.ALERT.TITLE.WHOOPSIE, 
			                message: e.errorMessage
			            });
			            alertDialog.show();
		            	alertDialog = null;
        			}
	        	}
	        });
	        window.add(productDetails.getView());
	        Window.open(window); 
		}
	});
	
	/*
	 * List view load listener
	 */
	gridView.addEventListener('load', function(e) {
		Loader.hide();
	});
	
	
	var _showListView = function(isRefresh) {
		Ti.API.info(constant.APP + " ####################### SETTING LIST VIEW ##########################");
		if(isRefresh) {
			_pageIndex = 0;
			try {
				mainView.remove(gridView.getView());
				gridView.setData([]);
			}
			catch(e) {}
			if(!listView.isAdded) {
				mainView.add(listView.getView());
				listView.isAdded = true;
			}
			else {
				listView.setData([]);
			}
		}
		
		var _requestArgs = {
	        showLoader: true,
	        url: 'product.php',
	        method: 'post',
	        serverArgs: {
	        	action: 'listing',
	            pageIndex: _pageIndex
	        }
	    };
	    
	    if(_shopFilters != undefined) {
	    	for(var _key in _shopFilters) {
	    		_requestArgs.serverArgs[_key] = _shopFilters[_key];
	    	}
	    }
	    
	    if(_shopSearchText != undefined) {
    		_requestArgs.serverArgs.searchText = _shopSearchText;
	    }
	    
	    if(Utils.isUserLoggedIn()) {
	    	_requestArgs.serverArgs.userId = Utils.loggedInUserId();
	    }
		
        /*
         * Hit web service
         */
        HttpClient.getResponse({
        	requestArgs: _requestArgs,
        	success: function(response) {
	            var _listData = [];
	            var _productData = response.data;
	            
	            if(_pageIndex == 0 && _productData.length == 0) {
            		listView.setData([UI.createNoDataView()], false);
            		Ti.App.fireEvent('app:apicallSuccess',{params: _requestArgs});
            		return;
            	}
            	
            	Loader.show();	
	            
		        for(var i=0; i<_productData.length; i++) {
		        	_productData[i].isPurchased = _productData[i].isPurchased == 1;
					var feedRow = Ti.UI.createView(_style.feedRow);
					var lblTitle = Ti.UI.createLabel(Utils._.extend({}, _style.lblTitle, {
						text: _productData[i].productTitle, // 'Post title goes here'
				    }));
				    
				    var brandView = Ti.UI.createView(Utils._.extend({}, _style.pricingView, {
			     		left: UI.left(10)
			    	}));
				    var lblBrandValue = Ti.UI.createLabel(Utils._.extend({}, _style.priceLabels, {
						text: _productData[i].brand + (osname=='android'?'  ':''),
						font: {
				            fontSize: UI.fontSize(12),
				            fontFamily: constant.FONT.DEFAULT_FONT,
				            // fontWeight: 'bold'
				        },
				        color: '#828282'
				    }));
				    var lblLine = Ti.UI.createLabel(Utils._.extend({}, _style.priceLabels, {
						text: ' | ' + (osname=='android'?' ':''),
						font: {
				            fontSize: UI.fontSize(12),
				            fontFamily: constant.FONT.DEFAULT_FONT
				        }
				    }));
				    var lblSizeValue = Ti.UI.createLabel(Utils._.extend({}, _style.priceLabels, {
						text: _productData[i].size,
						font: {
				            fontSize: UI.fontSize(12),
				            fontFamily: constant.FONT.DEFAULT_FONT,
				            // fontWeight: 'bold'
				        },
				        color: '#000'
				    }));
				    brandView.add(lblBrandValue);
				    if(_productData[i].size) {
				    	brandView.add(lblLine);
				    	brandView.add(lblSizeValue);
				    }
					
					var imgProductView = Ti.UI.createView(Utils._.extend({}, _style.imgProduct, {
						top: 0,
						width: UI.width(300),
						borderColor: '#f4f4f4',
						borderWidth: 0
				    }));
				    if(_productData[i].photos.productImage1 != '') {

				    	if(_productData[i].isPurchased) {
				    		var imgProduct = UI.createImageWithTextView({
				    			defaultImage: '/images/common/default-shop-small.jpg',
						    	image: Utils.getFullURL(_productData[i].photos.productImage1),
								width: Ti.UI.FILL,
								height: Ti.UI.FILL,
								type: 'sold'
						    });
				    	}
				    	else if(_productData[i].condition === 'Brand new with tags'){
				    		var imgProduct = UI.createImageWithTextView({
				    			defaultImage: '/images/common/default-shop-small.jpg',
						    	image: Utils.getFullURL(_productData[i].photos.productImage1),
								width: Ti.UI.FILL,
								height: Ti.UI.FILL,
								type: 'new'
						    });
				    	}
				    	else {
				    		var imgProduct = Ti.UI.createImageView(Utils._.extend({}, _style.imgProduct, {
				    			defaultImage: '/images/common/default-shop-small.jpg',
								image: Utils.getFullURL(_productData[i].photos.productImage1),
								width: Ti.UI.FILL,
								height: Ti.UI.FILL
						    }));
				    	}

				    	imgProductView.add(imgProduct);
				    }
				    else {
				    	var lblNoImage = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.smallButton, {
				    		text: 'Image not available',
				    		color: '#b3b3b3',
				    		textAlign: 'center'
					    }));
					    imgProductView.add(lblNoImage);
				    }
				    
				    var pricingView = Ti.UI.createView(_style.pricingView);
				    var lblPrice = Ti.UI.createLabel(Utils._.extend({}, _style.priceLabels, {
						text: 'Price: ' + (osname=='android'?' ':''),
						font: {
				            fontSize: UI.fontSize(12),
				            fontFamily: constant.FONT.DEFAULT_FONT
				        }
				    }));
				    var lblPriceValue = Ti.UI.createLabel(Utils._.extend({}, _style.priceLabels, {
						text: '\u20B9 ' + _productData[i].discountPrice + ' ' + (osname=='android'?'   ':' '),
						font: {
				            fontSize: UI.fontSize(12),
				            fontFamily: constant.FONT.DEFAULT_FONT,
				            // fontWeight: 'bold'
				       	},
				       	// color: '#000'
				    }));
				    var _originalPrice = ' ' + '\u20B9 ' + _productData[i].originalPrice + ' ' + (osname=='android'?' ':'');
				    var lblOriginalPriceValue = UI.createStrikeThroughLabel(Utils._.extend({}, _style.priceLabels, {
						text: _originalPrice,
						font: {
				            fontSize: UI.fontSize(12),
				            fontFamily: constant.FONT.DEFAULT_FONT
				       	},
				       	range: {from: 0, to: _originalPrice.length}
				    }));
				    var lblDiscount = Ti.UI.createLabel(Utils._.extend({}, _style.priceLabels, {
						text: '  ' + _productData[i].discountPercentage  + '% off ',
						font: {
				            fontSize: UI.fontSize(12),
				            fontFamily: constant.FONT.DEFAULT_FONT
				       	},
				       	color: '#eb5783'
				    }));
				    // pricingView.add(lblPrice);
				    pricingView.add(lblPriceValue);
				    
				    if(_productData[i].originalPrice > 0) {
				    	pricingView.add(lblOriginalPriceValue);
				    	pricingView.add(lblDiscount);
				    }
				    
				    feedRow.add(lblTitle);
				    feedRow.add(brandView);
				    feedRow.add(imgProductView);
				    feedRow.add(pricingView);
				    
				    feedRow.productData = _productData[i];
				    
					_listData.push(feedRow);
					// _listData.push(Ti.UI.createView(Utils._.extend({}, _commonStyle.hrLine, {
						// height: 5
				    // })));
			   	}
				
				if(isRefresh) {
					listView.setData(_listData);
					Ti.App.fireEvent('app:apicallSuccess',{params: _requestArgs});
				}
				else {
					listView.appendData(_listData);
				}	
				
				if(_productData.length > 0) {
					_pageIndex++;
					listView.showLazyLoadingRow();
				}
				else {
					listView.hideLazyLoadingRow();
				}
        	},
        	error: function(error) {
        		if(isRefresh) {
        			listView.setData([UI.createErrorView(error.errorMessage, function() {
	               		_showListView(true);
	               	})], false);
        		}
        		else {
        			UI.showAlert(error.errorMessage);
        		}
                setTimeout(function() {
                	if(_pageIndex > 0) {
	                	listView.showLazyLoadingRow();
	                }
                }, 500);
        	}
        });
	}; //end _showListView

	
	var _showGridView = function(isRefresh) {
		Ti.API.info(constant.APP + " ####################### SETTING GRID VIEW ##########################");
		if(isRefresh) {
			_pageIndex = 0;
			try {
				mainView.remove(listView.getView());
				listView.setData([]);
			}
			catch(e) {}
			if(!gridView.isAdded) {
				mainView.add(gridView.getView());
				gridView.isAdded = true;
			}
			else {
				gridView.setData([]);
			}
		}

		var _requestArgs = {
	        showLoader: true,
	        url: 'product.php',
	        method: 'post',
	        serverArgs: {
	        	action: 'listing',
	        	pageIndex: _pageIndex
	        }
	    };
	    
	    if(_shopFilters != undefined) {
	    	for(var _key in _shopFilters) {
	    		_requestArgs.serverArgs[_key] = _shopFilters[_key];
	    	}
	    }
	    
	    if(_shopSearchText != undefined) {
    		_requestArgs.serverArgs.searchText = _shopSearchText;
	    }
	    
	    if(Utils.isUserLoggedIn()) {
	    	_requestArgs.serverArgs.userId = Utils.loggedInUserId();
	    }
		
        /*
         * Hit web service
         */
        HttpClient.getResponse({
        	requestArgs: _requestArgs,
        	success: function(response) {
        		// Ti.API.info(constant.APP + " ################# SHOP SCREEN GRID VIEW API CALLBACK #################");
	            var _gridData = [];
	            var _productData = response.data;
	            
	            if(_productData.length == 0 && _pageIndex == 0) {
            		gridView.setData([UI.createNoDataView()], false);
            		Ti.App.fireEvent('app:apicallSuccess',{params: _requestArgs});
            		return;
            	}
            	
            	Loader.show();
	            
				for(var i=0; i<_productData.length; i++) {
					// var prodRef = _productData[i];

					// for(var ix in prodRef){
					// 	if(prodRef.propertyIsEnumerable(ix)){
					// 		Ti.API.info(constant.APP + " key: [" + ix + "] value: [" + prodRef[ix] + "]");
					// 	}
					// }

					_productData[i].isPurchased = _productData[i].isPurchased == 1;
					var feedColumn = Ti.UI.createView(Utils._.extend({}, _style.feedColumn, {
						width: _columnWidth,
						// borderColor: '#f4f4f4',
						// borderWidth: 1
				    }));	
					var lblTitle = Ti.UI.createLabel(Utils._.extend({}, _style.lblTitle, {
						text: _productData[i].productTitle, // 'Post title goes here',
						top: UI.top(2),
						left: UI.left(5),
						right: UI.right(5)
				    }));
				    
			     	var brandView = Ti.UI.createView(Utils._.extend({}, _style.pricingView, {
			     		left: UI.left(5)
			    	}));
				    var lblBrandValue = Ti.UI.createLabel(Utils._.extend({}, _style.priceLabels, {
						text: Utils.ellipsis(_productData[i].brand, 15) + (osname=='android'?'  ':''),
						font: {
				            fontSize: UI.fontSize(12),
				            fontFamily: constant.FONT.DEFAULT_FONT
				            // fontWeight: 'bold'
				        },
			     		color: '#828282'	//'#ef4e6d'
				    }));
				    var lblLine = Ti.UI.createLabel(Utils._.extend({}, _style.priceLabels, {
						text: ' | ' + (osname=='android'?' ':''),
						font: {
				            fontSize: UI.fontSize(12),
				            fontFamily: constant.FONT.DEFAULT_FONT
				        }
				    }));
				    var lblSizeValue = Ti.UI.createLabel(Utils._.extend({}, _style.priceLabels, {
						text: _productData[i].size,
						font: {
				            fontSize: UI.fontSize(12),
				            fontFamily: constant.FONT.DEFAULT_FONT,
				            // fontWeight: 'bold'
				        },
				        color: '#828282'
				    }));
				    brandView.add(lblBrandValue);
				    if(_productData[i].size) {
				    	brandView.add(lblLine);
				   		brandView.add(lblSizeValue);
				    }
					
					var imgProductView = Ti.UI.createView(Utils._.extend({}, _style.imgProduct, {
						top: 0,
						left: UI.left(5),
						right: UI.right(5),
						width: _columnWidth - UI.left(10),
						height: _columnWidth - UI.left(10), // UI.height(150),
						borderColor: '#f4f4f4',
						borderWidth: 0
				    }));
				    
				    if(_productData[i].photos.productImage1 != '') {

				    	if(_productData[i].isPurchased) {
				    		var imgProduct = UI.createImageWithTextView({
				    			defaultImage: '/images/common/default-shop-small.jpg',
						    	image: Utils.getFullURL(_productData[i].photos.productImage1),
								width: Ti.UI.FILL,
								height: Ti.UI.FILL,
								type: 'sold'
						    });
				    	}
				    	else if(_productData[i].condition === 'Brand new with tags'){
				    		var imgProduct = UI.createImageWithTextView({
				    			defaultImage: '/images/common/default-shop-small.jpg',
						    	image: Utils.getFullURL(_productData[i].photos.productImage1),
								width: Ti.UI.FILL,
								height: Ti.UI.FILL,
								type: 'new'
						    });
				    	}
				    	else {
				    		var imgProduct = Ti.UI.createImageView(Utils._.extend({}, _style.imgProduct, {
				    			defaultImage: '/images/common/default-shop-small.jpg',
								image: Utils.getFullURL(_productData[i].photos.productImage1),
								width: Ti.UI.FILL,
								height: Ti.UI.FILL
						    }));
				    	}
				    }
				    else {
				    	var lblNoImage = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.smallButton, {
				    		text: 'Image not available',
				    		color: '#b3b3b3',
				    		textAlign: 'center'
					    }));
				    }
				    
				    _productData[i].isLiked = _productData[i].isLiked=='1'||_productData[i].isLiked==1||_productData[i].isLiked==true?true:false;
				    
				    var btnLike = UI.createButton(Utils._.extend({}, _commonStyle.likeButton, {
				    	backgroundImage: _productData[i].isLiked?'/images/common/like-active.png':'/images/common/like.png',
				    	right: UI.right(5),
				    	top: UI.top(5),
				    	bubbleParent: false,
				    	productId: _productData[i].productId,
				    	isLiked: _productData[i].isLiked
				    }));
				    
				    btnLike.addEventListener('click', function() {
				    	if(!Utils.isUserLoggedIn()) {
				    		var alertDialog = UI.createAlertDialog({
			                    title: 'LOGIN', 
			                    message: 'Please login to like this product'
			                });
			                alertDialog.show();
			                alertDialog = null;
			                return;
				    	}
				    	
			    		var likeButton = this;
			    		
			    		Analytics.trackEvent({
					  		category: "Love (Shop)",
					  		action: "click",
					  		label: ""+likeButton.isLiked+"",
					  		value: 1
						});
			    		
		    			var _requestArgs = {
					        showLoader: true,
					        url: 'product.php',
					        method: 'post',
					        serverArgs: {
					        	action: likeButton.isLiked?'dislike':'like',
					            userId: Utils.loggedInUserId(),
					            productId: likeButton.productId
					        }
					    };
					    
				        /*
				         * Hit web service
				         */
				        HttpClient.getResponse({
				        	requestArgs: _requestArgs,
				        	success: function(response) {
					            if(response.data.status == '1') {
					            	if(likeButton.backgroundImage == '/images/common/like-active.png') {
							    		likeButton.backgroundImage = '/images/common/like.png';
							    	}
							    	else {
							    		likeButton.backgroundImage = '/images/common/like-active.png';
							    	}
							    	
							    	likeButton.isLiked = !likeButton.isLiked;
					            }
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
				    });
				    
				    if(_productData[i].photos.productImage1 != '') {
				    	imgProductView.add(imgProduct);
				    }
				    else {
				    	imgProductView.add(lblNoImage);
				    }
				    imgProductView.add(btnLike);
				    
				    var pricingView = Ti.UI.createView(Utils._.extend({}, _style.pricingView, {
				    	top: UI.top(3),
						left: UI.left(5),
						right: UI.right(5)
				    }));
				    var lblPriceValue = Ti.UI.createLabel(Utils._.extend({}, _style.priceLabels, {
						text: '\u20B9 ' + _productData[i].discountPrice + ' ',
						font: {
			                fontSize: UI.fontSize(10),
			                fontFamily: constant.FONT.DEFAULT_FONT,
			                // fontWeight: 'bold'
			            }
				    }));
				    var lblOriginalPriceValue = UI.createStrikeThroughLabel(Utils._.extend({}, _style.priceLabels, {
						text: '\u20B9 ' + _productData[i].originalPrice + ' ',
						font: {
				            fontSize: UI.fontSize(10),
				            fontFamily: constant.FONT.DEFAULT_FONT
				       	},
				       	range: {from: 0, to: _productData[i].originalPrice.length}
				    }));
				    var lblDiscount = Ti.UI.createLabel(Utils._.extend({}, _style.priceLabels, {
						text: ' ' + _productData[i].discountPercentage + '% off ',
						font: {
			                fontSize: UI.fontSize(10),
			                fontFamily: constant.FONT.DEFAULT_FONT
			           	},
			           	color: '#eb5783'
				    }));
				    pricingView.add(lblPriceValue);
				    pricingView.add(lblOriginalPriceValue);
				    
				    if(_productData[i].originalPrice > 0) {
				    	pricingView.add(lblDiscount);
				    }
				    
				    feedColumn.add(lblTitle);
				    feedColumn.add(brandView);
				    feedColumn.add(imgProductView);
				    feedColumn.add(pricingView);
				    
				    feedColumn.productData = _productData[i];
				    feedColumn.btnLike = btnLike;
				    
					_gridData.push(feedColumn);
				}
				
				if(isRefresh) {
					gridView.setData(_gridData);
					Ti.App.fireEvent('app:apicallSuccess',{params: _requestArgs});
				}
				else {
					gridView.appendData(_gridData);
				}	
				
				if(_productData.length > 0) {
					_pageIndex++;
					gridView.showLazyLoadingRow();
				}	
				else {
					gridView.hideLazyLoadingRow();
				}
        	},
        	error: function(error) {
               	if(isRefresh) {
        			gridView.setData([UI.createErrorView(error.errorMessage, function() {
	               		_showGridView(true);
	               	})], false);
        		}
        		else {
        			UI.showAlert(error.errorMessage);
        		}
                setTimeout(function() {
                	if(_pageIndex > 0) {
	                	gridView.showLazyLoadingRow();
	                }
                }, 500);
        	}
        });
	}; //end _showGridView
	
	// _showListView();
	_showGridView(true);
	
	
    var _getView = function() {
        return mainView;
    };
    
    
    var _filterData = function(filters) {
    	_shopFilters = filters;
    	
    	Analytics.trackEvent({
	  		category: "Filter (Shop)",
	  		action: "click",
	  		label: _shopFilters != undefined || _shopFilters != null ? JSON.stringify(_shopFilters) : '',
	  		value: 1
		});
    	
    	_pullToRefreshCallback();
    };
    
    
    var _searchData = function(searchText) {
	    _shopSearchText = searchText;
	    
    	Analytics.trackEvent({
	  		category: "Search (Shop)",
	  		action: "click",
	  		label: JSON.stringify({searchText: _shopSearchText == undefined || _shopSearchText == null ? '' : _shopSearchText}),
	  		value: 1
		});
		
    	_pullToRefreshCallback();
    };
    
        
    var _removeFromMemory = function() {
    	_style = null;
        Window.clearMemory(mainView);
        mainView = null;
        _getView = null;
        _filterData = null;
        _searchData = null;
        _removeFromMemory = null;
    };
    
    return {
        getView: _getView,
        filterData: _filterData,
        searchData: _searchData,
        removeFromMemory: _removeFromMemory
    };
};

