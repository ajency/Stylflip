exports.get = function(tabSelected, selectedMySizes, saveCallback) {
	Analytics.trackScreen({
		screenName: 'My Sizes'
	});
	
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
	header.setTitle('My Sizes');
    var contentView = Ti.UI.createScrollView(Utils._.extend({}, _commonStyle.contentScrollView, {
    	top: 0,
    	bottom: 0,
        layout: 'vertical'
    }));
    var footer = require('/components/footer').get(defaultSelectedTab=tabSelected, subTab=true);
	
	mainView.add(header.getView());
    mainView.add(contentView);
	mainView.add(footer.getView());
	
	
	var lastOpenedContentsView, lastOpenedContentViewIndex = -1, currentFocusedTextField, lastRightButton;;
	var _selectedMySizes = selectedMySizes ? selectedMySizes : {}, _buttonsToBeAutoClicked = [];
	
	var _lastSelectedSizeIndex = -1;
	
	/*
	 * Create size chart in detail
	 */
	var _createSizeChartView = function(sizeChart, size) {
   		var sizeChartView = Ti.UI.createView({
   			width: Ti.UI.FILL,
   			height: Ti.UI.SIZE,
   			layout: 'vertical'
   		});
   		
   		try {
   			var _style = require('/styles/sell').get();
   			
   			var mainChart = Ti.UI.createView(_style.mainChart);
		    sizeChartView.add(mainChart);
		    
	    	var _sizeParent = constant.SIZE_CHARTS[sizeChart][size];
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
		    
		    for(var key in _sizeParent.secondary) {
		    	var burstView = Ti.UI.createView(Utils._.extend({}, _style.burstView, {
			    	top: -1,
			    	borderColor: '#bfbfbf',
			    	borderWidth: 1
			    }));
			    var lblBurst = Ti.UI.createLabel(Utils._.extend({}, _style.lblBurst, {
			    	text: constant.SIZE_FULL_FORM[key]
			    }));
			    var lblBurstValue = Ti.UI.createTextField(Utils._.extend({}, _style.lblBurstValue, {
			    	value: _sizeParent.secondary[key],
			    	width: UI.width(45),
			    	height: UI.height(30),
			    	maxLength: 5,
			    	paddingRight: 2,
			    	textAlign: 'right',
			    	touchEnabled: false
			    }));
			    var lblBurstIn = Ti.UI.createLabel(Utils._.extend({}, _style.lblBurstValue, {
			    	text: 'in.',
			    	left: UI.left(170)
			    }));
			    burstView.add(lblBurst);
			    burstView.add(lblBurstValue);
			    burstView.add(lblBurstIn);
			    sizeChartView.add(burstView);
		    }
   		}
   		catch(e) {}
	    
	    return sizeChartView;
   	};
   	
   	
   	var _selectSize = function(sizeChartView, obj, source, sizeDetail) {
   		sizeChartView.removeAllChildren();
    	if(_lastSelectedSizeIndex == source.index) {
    		delete _selectedMySizes[sizeDetail.key];
    		obj.children[_lastSelectedSizeIndex].color = '#828282';
    		_lastSelectedSizeIndex = -1;
    		return;
    	}
    	if(_lastSelectedSizeIndex > -1) {
    		obj.children[_lastSelectedSizeIndex].color = '#828282';
    	}
		obj.children[source.index].color = '#ef4e6d';
		_lastSelectedSizeIndex = source.index;
		
		_selectedMySizes[sizeDetail.key] = obj.children[source.index].title;
		
		sizeChartView.add(_createSizeChartView(sizeDetail.sizeChart, obj.children[source.index].title));
   	};
   	
	
	var _createSizeView = function(sizeDetail, i) {
		var mainSizeView = UI.createClickableView(Utils._.extend({}, _commonStyle.accordionView, {
	    	top: i == 0 ? UI.top(20) : -1,
	    	index: i
	    }));
	    var lblSizeType = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.accordionLabel, {
	    	text: sizeDetail.title
	    }));
	    var btnExpandCollapse = UI.createButton(Utils._.extend({}, _commonStyle.expandButton, {
	    	title: '+',
	    	right: UI.right(20)
	    }));
	    mainSizeView.add(lblSizeType);
	    mainSizeView.add(btnExpandCollapse);
	    
	    contentView.add(mainSizeView);  
	    
	    var sizeDetailsView = Ti.UI.createView({
	    	width: Ti.UI.FILL,
	    	height: 0,
	    	layout: 'vertical'
	    });
	    contentView.add(sizeDetailsView);
	    mainSizeView.contentsView = sizeDetailsView;
	    
	    mainSizeView.addEventListener('click', function() {
	    	if(currentFocusedTextField) {
	    		currentFocusedTextField.blur();
	    		currentFocusedTextField = undefined;
	    	}
	    	
	    	if(lastOpenedContentsView) {
	    		lastOpenedContentsView.height = 0;
	    		lastRightButton.title = '+';
	    	}
	    	
	    	if(lastOpenedContentViewIndex > -1 && lastOpenedContentViewIndex == this.index) {
	    		lastOpenedContentsView = undefined;
	    		lastOpenedContentViewIndex = -1;
	    	}
	    	else {
	    		this.contentsView.height = Ti.UI.SIZE;
	    		lastOpenedContentsView = this.contentsView;
	    		lastOpenedContentViewIndex = this.index;
	    		lastRightButton = this.children[1];
	    		lastRightButton.title = '-';
	    	}
	    });
	    
	    
	    /*
	     * Size details view's contents
	     */
	    
	    var _sizeTypes = Object.keys(constant.SIZE_CHARTS[sizeDetail.sizeChart]);
	    var _buttonWidth = (UI.platformWidth - UI.width(20)) / _sizeTypes.length;
	    // var _lastSelectedSizeIndex = -1;
	    
	    var sizeButtonsView = Ti.UI.createView({
	    	width: UI.platformWidth - UI.width(20),
	    	height: UI.height(50),
	    	layout: 'horizontal'
	    });
	    for(var i = 0; i < _sizeTypes.length; i++) {
	    	var btnSize = UI.createButton({
	    		title: _sizeTypes[i],
	    		width: _buttonWidth,
	    		height: Ti.UI.FILL,
	    		font: {
	                fontSize: UI.fontSize(11),
	                fontFamily: constant.FONT.DEFAULT_FONT,
	                fontWeight: 'bold'
	            },
	            color: '#828282',
	            index: i
	    	});
	    	if(sizeDetail.selectedSize == _sizeTypes[i]) {
	    		_buttonsToBeAutoClicked.push(btnSize);
	    	}
	    	sizeButtonsView.add(btnSize);
	    }
	    sizeButtonsView.addEventListener('click', function(e) {
	    	// sizeChartView.removeAllChildren();
	    	// if(_lastSelectedSizeIndex == e.source.index) {
	    		// delete _selectedMySizes[sizeDetail.key];
	    		// this.children[_lastSelectedSizeIndex].color = '#828282';
	    		// _lastSelectedSizeIndex = -1;
	    		// return;
	    	// }
	    	// if(_lastSelectedSizeIndex > -1) {
	    		// this.children[_lastSelectedSizeIndex].color = '#828282';
	    	// }
    		// this.children[e.source.index].color = '#ef4e6d';
    		// _lastSelectedSizeIndex = e.source.index;
//     		
    		// _selectedMySizes[sizeDetail.key] = this.children[e.source.index].title;
//     		
    		// sizeChartView.add(_createSizeChartView(sizeDetail.sizeChart, this.children[e.source.index].title));
    		_selectSize(sizeChartView, this, e.source, sizeDetail);
	    });
	    var sizeChartView = Ti.UI.createView({
	    	width: Ti.UI.FILL,
	    	height: Ti.UI.SIZE
	    });
	    sizeDetailsView.add(sizeButtonsView);  
	    sizeDetailsView.add(sizeChartView);  
	    
	    var _sizeChartComment = '';
   		switch(sizeDetail.sizeChart) {
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
   		
   		var lblSizeComment = Ti.UI.createLabel(Utils._.extend({}, _commonStyle.label, {
			text: _sizeChartComment,
			left: UI.left(10),
			right: UI.right(10),
			top: UI.top(10),
			bottom: UI.bottom(10),
			font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT
           	},
			color: '#757575',
			textAlign: 'left'
	    }));
   		sizeDetailsView.add(lblSizeComment);
	    
	    // setTimeout(function() {
	    	for(var i = 0; i < _buttonsToBeAutoClicked.length; i++) {
		    	// _buttonsToBeAutoClicked[i].fireEvent('click');
		    	_selectSize(sizeChartView, sizeButtonsView, _buttonsToBeAutoClicked[i], sizeDetail);
		    }
	    // }, 250);
	};
	
	
	var _sizeDetails = [{
		key: 'topsAndDresses',
		title: 'Tops & Dresses',
		sizeChart: 'A',
		selectedSize: _selectedMySizes && _selectedMySizes.hasOwnProperty('topsAndDresses') && _selectedMySizes['topsAndDresses']
	}, {
		key: 'jeansAndBottoms',
		title: 'Jeans & Bottoms',
		sizeChart: 'B',
		selectedSize: _selectedMySizes && _selectedMySizes.hasOwnProperty('jeansAndBottoms') && _selectedMySizes['jeansAndBottoms']
	}, {
		key: 'footwear',
		title: 'Footwear',
		sizeChart: 'C',
		selectedSize: _selectedMySizes && _selectedMySizes.hasOwnProperty('footwear') && _selectedMySizes['footwear']
	}/*, {
		title: 'Rings',
		sizeChart: 'D'
	}*/];
	
	
	for(var i=0; i<_sizeDetails.length; i++) {
	    _createSizeView(_sizeDetails[i], i);
	}
	
	var btnSave = UI.createButton(Utils._.extend({}, _commonStyle.bigButton, {
        title: constant.TEXT.SAVE,
        top: UI.top(20)
    }));
    contentView.add(btnSave);
    
    btnSave.addEventListener('click', function() {
    	var _requestArgs = {
	        showLoader: true,
	        url: 'stylfile.php',
	        method: 'post',
	        serverArgs: {
	        	action: 'updateMySizes',
	            userId: Utils.loggedInUserId()
	        }
	    };
	    
	    for(var _key in _selectedMySizes) {
	    	_requestArgs.serverArgs[_key] = _selectedMySizes[_key];
	    }
	    
        HttpClient.getResponse({
        	requestArgs: _requestArgs,
        	success: function(response) {
        		Utils._.isFunction(saveCallback) && saveCallback(_requestArgs.serverArgs);
        		Window.getCurrentWindow().close();
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
    
	
    var _getView = function() {
    	return mainView;
    };
    
    
    var _removeFromMemory = function() {
    	
    };
    
	return {
		getView: _getView,
		removeFromMemory: _removeFromMemory
	};
};

