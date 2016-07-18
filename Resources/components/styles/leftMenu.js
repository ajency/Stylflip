exports.get = function() {
    var style = {
        leftView: {
			backgroundColor: '#3f3e40',
			height: Ti.UI.FILL,
			layout: 'vertical'		
		},
		
       	leftMenuOptionsView: {
       		backgroundColor: 'transparent',
			top: 0,
			width: Ti.UI.FILL,
			contentWidth: Ti.UI.FILL,
			height: Ti.UI.FILL,
			contentHeight: 'auto',
			showVerticalScrollIndicator: false,
			layout: 'vertical'
       	},
       	
       	optionView: {
       		backgroundColor: '#3f3e40',
       		top: UI.top(10),
       		width: Ti.UI.FILL,
			height: UI.height(35)
       	},
       	
       	imgOption: {
       		left: UI.left(20),
			width: UI.width(15),
			height: UI.height(15)
       	},
       	
       	lblOption: {
			left: UI.left(75),
			right: UI.right(5),
			width: Ti.UI.FILL,
			height: Ti.UI.SIZE,
			color: '#fff',
			font: {
				fontSize: UI.fontSize(13),
				fontFamily: constant.FONT.DEFAULT_FONT
			}
       	},
       	
       	dividerLine: {
       		backgroundColor: 'transparent',
       		top: 0,
       		left: UI.left(15),
       		height: 1
       	},
       	
       	overlayView: {
       		backgroundColor: '#000',
       		left: 0,
			width: UI.width(320),
			height: Ti.UI.FILL,
			opacity: 0
       	}
       	
    };
    
    return style;    
};
