exports.get = function() {
    var style = {
    	filterView: {
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			layout: 'horizontal'
		},
		
        leftView: {
			backgroundColor: '#27292e',
			width: '42%',
			height: Ti.UI.FILL,
			showVerticalScrollIndicator: true,
			layout: 'vertical'
		},
		
		rightView: {
			backgroundColor: '#fff',
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			showVerticalScrollIndicator: true,
			layout: 'vertical'
		},
		
       	btnFilter: {
       		left: UI.left(5),
       		right: UI.right(5),
       		height: UI.height(35),
       		font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT,
                fontWeight: 'bold'
            },
            color: '#fff',
       		textAlign: 'left'
       	},
       	
       	btnClearFilter: {
       		title: 'CLEAR',
       		right: UI.right(5),
       		width: Ti.UI.SIZE,
       		height: UI.height(35),
       		font: {
                fontSize: UI.fontSize(9),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#fff',
       		textAlign: 'left'
       	},
       	
       	btnDone: {
       		width: UI.width(125),
            height: UI.height(40),
            font: {
                fontSize: UI.fontSize(20), // 26
                fontFamily: constant.FONT.ABEATBYKAI
                // fontWeight: 'bold'
            },
            color: '#ef4e6d',
            borderRadius: UI.width(22.5),
            bubbleParent: false
       	},
       	
       	hrLine: {
	    	backgroundColor: '#f4f4f4',
	    	left: UI.left(5),
	    	right: UI.right(5),
	    	height: 1
	    }
    };
    
    return style;    
};
