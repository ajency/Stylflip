exports.get = function(screenType) {
	var _style = require('/styles/myOrders').get();
	
	var _pageIndex = 0;
	
	var mainView = Ti.UI.createView(_style.mainView); 
	
	var listView = require('/components/listView').get();
	listView.setBackgroundColor('#f4f4f4');
	listView.setRowSpacing(5);
	
	listView.addEventListener('scrolledToBottom', function() {
		_loadData();
	});
	
	listView.addEventListener('pullToRefresh', function() {
		_loadData(true);
	});
	
	listView.addEventListener('load', function(e) {
		Loader.hide();
	});
	
	listView.addEventListener('click', function(e) {
		if(e.row.productId != undefined) {
			var window = Window.create(exitOnClose=false);
	        var productDetails = require('/screens/productDetails').get(tabSelected='shop', e.row.productId);
	        window.add(productDetails.getView());
	        Window.open(window);
		}
	});
	
	mainView.add(listView.getView());
	
	
	var _createOrderRow = function(data) {
		var orderRow = Ti.UI.createView(_style.orderRow);
		orderRow.productId = data.productId;
		var leftView = Ti.UI.createView(_style.leftView);
		var lblStatus = Ti.UI.createLabel(Utils._.extend({}, _style.lblStatus, {
	        text: Utils.getShortOrderStatus(data.status)
	    }));
		var productImage = Ti.UI.createImageView(Utils._.extend({}, _style.productImage, {
	        image: Utils.getFullURL(data.primaryPhoto)
	    }));
		leftView.add(lblStatus);
		leftView.add(productImage);
		
		var rightView = Ti.UI.createView(_style.rightView);
		var lblStatusValue = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
	        text: 'AWB #: ' + (data.AWB ? data.AWB : '-') + ' by ' + (data.courier ? data.courier : '-'),
	        height: UI.height(25)
	    }));
		var lblProductTitle = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
	        text: data.productTitle,
	        top: UI.top(8),
	        font: {
                fontSize: UI.fontSize(14),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
	        color: '#ef4e6d'
	    }));
	    var lblBrandAndSize = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
	        text: data.brand + (data.size ? ' | ' + data.size : '')
	    }));
	    var lblPrice = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
	        text: '\u20B9 ' + data.sellingPrice,
	        font: {
                fontSize: UI.fontSize(14),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
	        color: '#000'
	    }));
	    var lblPayMethod = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
	        text: 'Payment Method: ' + (data.paymentMethod ? data.paymentMethod : 'Netbanking')
	    }));
	    var lblOrderNo = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
	        text: 'Order No: ' + data.orderId
	    }));
	    var lblOrderDate = Ti.UI.createLabel(Utils._.extend({}, _style.rightViewLabels, {
	        text: 'Order on: ' + data.orderDate,
	        bottom: UI.bottom(5)
	    }));
		rightView.add(lblStatusValue);
		rightView.add(lblProductTitle);
		rightView.add(lblBrandAndSize);
		rightView.add(lblPrice);
		rightView.add(lblPayMethod);
		rightView.add(lblOrderNo);
		rightView.add(lblOrderDate);
		
		orderRow.add(leftView);
		orderRow.add(rightView);
		
		return orderRow;
	};
	
	
	var _loadData = function(isRefresh) {
		if(isRefresh) {
			_pageIndex = 0;
			listView.setData([]);
		}

		var _requestArgs = {
		    showLoader: true,
		    url: 'stylfile.php',
		    method: 'post',
		    serverArgs: {
		    	action: screenType == 'myOrders' ? 'myOrders' : 'mySales',
		        userId: Utils.loggedInUserId(),
		        pageIndex: _pageIndex
		    }
		};
		
		HttpClient.getResponse({
			requestArgs: _requestArgs,
			success: function(response) {
				var _orderData = response.data;
		        var _listData = [];
		        
		    	if(_orderData.length == 0 && _pageIndex == 0) {
		    		listView.setData([UI.createNoDataView()], false);
		    		return;
		    	}
		    	
		    	Loader.show();
		    	
		    	for(var i=0; i<_orderData.length; i++) {
					_listData.push(_createOrderRow(_orderData[i]));
				}
				
				if(isRefresh) {
					listView.setData(_listData);
				}
				else {
					listView.appendData(_listData);
				}
				
				if(_orderData.length > 0) {
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
	               		_loadData(true);
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
	};
	
	_loadData(true);
	
    
    var _getView = function() {
        return mainView;
    };
    
    var _removeFromMemory = function() {
    	_style = null;
        Window.clearMemory(mainView);
        mainView = null;
        _getView = null;
        _removeFromMemory = null;
    };
    
    return {
        getView: _getView,
        removeFromMemory: _removeFromMemory
    };
};
