exports.get = function() {
    var style = {
    	mainView: {
			backgroundColor: '#fff',
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			layout: 'vertical'
		},
		
	    USView: {
	    	width: UI.width(50),
	    	height: Ti.UI.SIZE,
	    	layout: 'vertical'
	    },
	    
	    lblUS: {
	    	width: Ti.UI.SIZE,
	    	height: Ti.UI.SIZE,
	    	font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#757575',
	    	layout: 'vertical'
	    },
	    
	    lblUSValue: {
	    	width: Ti.UI.SIZE,
    		height: UI.height(30),
    		font: {
                fontSize: UI.fontSize(20),
                fontFamily: constant.FONT.DEFAULT_FONT,
                fontWeight: 'bold'
           },
           color: '#757575'
	    },
	    
	    burstView: {
	    	width: Ti.UI.FILL,
    		height: UI.height(40)
	    },
	    
	    lblBurst: {
	    	left: UI.left(10),
	    	width: Ti.UI.SIZE,
	    	height: UI.height(30),
	    	font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#757575'
	    },
	    
	    lblBurstValue: {
	    	left: UI.left(120),
	    	width: Ti.UI.SIZE,
	    	height: UI.height(30),
	    	font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#757575',
            bubbleParent: false
	    }
    };
    
    return style;    
};
