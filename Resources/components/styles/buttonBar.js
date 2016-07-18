exports.get = function() {
    var style = {
	    buttonView: {
	    	backgroundColor: '#e0e0e0',
	    	top: UI.top(10),
	    	width: UI.width(280),
	    	height: Ti.UI.SIZE, // UI.height(30),
	    	// borderColor: '#858585',
	    	// borderWidth: 1,
	    	layout: 'horizontal'
	    },
	    
	    button: {
	    	width: UI.width(140.5),
	    	height: Ti.UI.FILL,
			font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#858585',
            // borderColor: '#858585',
	    	// borderWidth: 1
	    }
    };
    
    return style;    
};
