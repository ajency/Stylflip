exports.get = function() {
    var style = {
	    scrollingView: {
	    	top: UI.top(10),
	    	width: UI.width(280),
	    	contentWidth: 'auto',
			horizontalWrap: false,
	    	layout: 'horizontal'
	    }
    };
    
    return style;    
};
