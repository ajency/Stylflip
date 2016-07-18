exports.get = function() {
    var style = {
        headerContainerView: {
			backgroundColor: 'transparent',
			top: UI.top(0),
			layout: 'vertical'
		},
		
		statusBar: {
			backgroundColor: '#e0e0e0',
            top: UI.top(0),
            height: UI.height(20)
		},
		
		headerView: {
	        backgroundColor: '#e0e0e0',
	        top: UI.top(0),
	        height: UI.height(45)
	    },
	    
	    btnMenuView: {
	        left: UI.left(0),
			width: UI.width(50),
			height: UI.height(50)	
	    },
	    
	    btnMenu: {
	        backgroundImage: '/images/header/menu.png',
	        left: UI.left(0),
			width: UI.width(17),
			height: UI.height(22)
	    },
	    
	    btnBackView: {
            left: UI.left(5),
            width: Ti.UI.SIZE, // UI.width(50),
            height: UI.height(50)
        },
        
	    btnBack: {
	        backgroundImage: '/images/header/back.png',
	        left: UI.left(5),
	        width: UI.width(15),
	        height: UI.height(24)
	    },
	    
	    imgBackLogo: {
        	image: '/images/header/header-logo.png',
        	left: UI.left(25),
        	width: UI.width(25),
        	height: UI.height(25)
        },
	    
	    lblHeaderTitle: {
			font: {
				fontSize: UI.fontSize(16),
				fontFamily: constant.FONT.DEFAULT_FONT
			},
			color: '#3f3e40'
	    }
    };
    
    return style;    
};