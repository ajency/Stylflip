exports.get = function(selectedState, selectCallback) {
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
	header.setTitle('Select State');
	var contentView = Ti.UI.createView({
    	top: 0,
    	width: Ti.UI.FILL,
    	height: Ti.UI.FILL,
    	backgroundColor: '#fff'
    });
    mainView.add(header.getView());
    mainView.add(contentView);
    
    var statesTableView = Ti.UI.createTableView({
    	search: Ti.UI.createSearchBar(),
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		filterAttribute: 'state'
	});
	contentView.add(statesTableView);
	
	var selectedRow;
	
	
	Utils.getStates(function(states) {
		for(var i=0; i<states.length; i++) {
			var stateView = Ti.UI.createTableViewRow({
				width: Ti.UI.FILL,
				height: UI.height(40),
				state: states[i].state,
				// hasCheck: selectedState == states[i].state
			});
			if(selectedState == states[i].state) {
				selectedRow = stateView;
				stateView.rightImage = '/images/sell/form-check-on.png';
			}
			var lblState = Ti.UI.createLabel({
				text: states[i].state,
				left: UI.left(15),
				width: UI.width(255),
				height: Ti.UI.FILL,
				font: {
	                fontSize: UI.fontSize(14),
	                fontFamily: constant.FONT.DEFAULT_FONT
	            },
	            color: '#757575'
			});
			stateView.add(lblState);
			
			statesTableView.appendRow(stateView);
		}
		
		statesTableView.addEventListener('click', function(e) {
			// e.row.hasCheck = !e.row.hasCheck;
			if(e.row.children[0].text != selectedState) {
				selectCallback({state: e.row.children[0].text});
			}
			if(selectedRow) {
				selectedRow.rightImage = '';
			}
			e.row.rightImage = '/images/sell/form-check-on.png';
			Window.getCurrentWindow().close();
		});
	});
	
	

    
    var _getView = function() {
        return mainView;
    };
    
    
    Window.getCurrentWindow().addEventListener('close', function() {
    	_removeFromMemory();
    });
    
    var _removeFromMemory = function() {
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

