exports.get = function(state, selectedCity, selectCallback) {
	var _style = require('/styles/sell').get();
	
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
	header.setTitle('Select City');
	var contentView = Ti.UI.createView({
    	top: 0,
    	width: Ti.UI.FILL,
    	height: Ti.UI.FILL,
    	backgroundColor: '#fff'
    });
    mainView.add(header.getView());
    mainView.add(contentView);
    
    var citiesTableView = Ti.UI.createTableView({
    	search: Ti.UI.createSearchBar(),
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		filterAttribute: 'city'
	});
	contentView.add(citiesTableView);
	
	var selectedRow;
	
	Utils.getCities(state, function(cities) {
		for(var i=0; i<cities.length; i++) {
			var cityView = Ti.UI.createTableViewRow({
				width: Ti.UI.FILL,
				height: UI.height(40),
				city: Utils.toFirstUppercase(cities[i].city),
				// hasCheck: selectedCity == Utils.toFirstUppercase(cities[i].city)
			});
			if(selectedCity && selectedCity.toLowerCase() == cities[i].city.toLowerCase()) {
				selectedRow = cityView;
				cityView.rightImage = '/images/sell/form-check-on.png';
			}
			var lblCity = Ti.UI.createLabel({
				text: Utils.toFirstUppercase(cities[i].city),
				left: UI.left(15),
				width: Ti.UI.SIZE,
				height: Ti.UI.FILL,
				font: {
	                fontSize: UI.fontSize(14),
	                fontFamily: constant.FONT.DEFAULT_FONT
	            },
	            color: '#757575'
			});
			cityView.add(lblCity);
			
			citiesTableView.appendRow(cityView);
		}
		
		citiesTableView.addEventListener('click', function(e) {
			// e.row.hasCheck = !e.row.hasCheck;
			if(selectedRow) {
				selectedRow.rightImage = '';
			}
			e.row.rightImage = '/images/sell/form-check-on.png';
			selectCallback({city: e.row.children[0].text});
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

