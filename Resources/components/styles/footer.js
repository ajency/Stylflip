exports.get = function() {
    var style = {
        footerContainerView: {
			backgroundColor: '#e0e0e0',
			// bottom: 0,
			// top: constant.FOOTER_TOP,
			width: UI.width(320),
			height: UI.height(50),
			layout: 'horizontal'
		},
		
		buttonView: {
			left: 0,
            width: (Ti.Platform.displayCaps.platformWidth / 5) - 0.1, //UI.width(64),
            height: UI.height(50)
        },
        
        footerButton: {
       		top: UI.top(7)
        },
       
        buttonTitle: {
       		bottom: UI.bottom(7),
       		width: Ti.UI.FILL,
       		height: Ti.UI.SIZE,
			font: {
				fontSize: UI.fontSize(8),
				fontFamily: constant.FONT.DEFAULT_FONT
			},
			color: '#858585',
			textAlign: 'center'
        }
    };
    
    return style;    
};