exports.get = function() {
    var style = {
    	mainView: {
			backgroundColor: '#fff',
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			layout: 'vertical'
		},
		
		orderRow: {
			backgroundColor: '#fff',
			width: Ti.UI.FILL,
			height: Ti.UI.SIZE,
			// layout: 'horizontal'
		},
		
		leftView: {
			left: UI.left(5),
			top: 0,
			width: UI.width(100),
			height: Ti.UI.SIZE,
			layout: 'vertical'
		},
		
		rightView: {
			left: UI.left(110),
			// right: UI.right(10),
			top: 0,
			width: UI.width(205),
			height: Ti.UI.SIZE,
			layout: 'vertical'
		},
		
		lblStatus: {
			backgroundColor: '#000',
			text: 'Status',
			top: UI.top(8),
			width: Ti.UI.FILL,
			height: UI.height(25),
			font: {
                fontSize: UI.fontSize(11),
                fontFamily: constant.FONT.DEFAULT_FONT,
                // fontWeight: 'bold'
            },
			color: '#fff',
			textAlign: 'center'
		},
		
		productImage: {
			top: UI.top(8),
			bottom: UI.bottom(8),
			width: UI.width(100),
			height: UI.height(100),
		},
		
		rightViewLabels: {
			left: 0,
			top: UI.top(5),
			width: Ti.UI.FILL,
			height: Ti.UI.SIZE,
			font: {
                fontSize: UI.fontSize(11),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
			color: '#828282'
		},
		
		originalPriceView: {
			left: 0,
			top: UI.top(5),
			width: Ti.UI.FILL,
			height: Ti.UI.SIZE,
			layout: 'horizontal'
		},
    };
    
    return style;    
};
