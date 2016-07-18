exports.get = function() {
    var style = {
		mainView: {
		    width: Ti.UI.FILL,
		    height: UI.height(360)
		},
		
		brandsView: {
			top: 0,
		    width: Ti.UI.FILL,
	        height: UI.height(305),
	        showVerticalScrollIndicator: true,
	        contentHeight: 'auto',
	        contentWidth: Ti.UI.FILL,
	        layout: 'vertical'
		},
		
		brandViewRow: {
			backgroundColor: '#fff',
		    borderWidth: 1,
            borderColor: '#ebebeb',
		    width: Ti.UI.FILL,
		    height: UI.height(45)
		},
		
		lblBrandName: {
			left: UI.left(10),
			right: UI.right(50),
			font: {
                fontSize: UI.fontSize(14),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#737373',
			textAlign: 'left'
	    },
		
		brandCheck: {
			right: UI.right(10),
			width: UI.width(30),
			height: Ti.UI.FILL,
			font: {
                fontSize: UI.fontSize(15),
                fontFamily: constant.FONT.DEFAULT_FONT,
                fontWeight: 'bold'
            },
            color: '#737373',
            textAlign: 'right'
		}
    };
    
    return style;    
};
