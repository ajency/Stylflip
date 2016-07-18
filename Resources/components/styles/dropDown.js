exports.get = function() {
    var style = {
        mainView: {
        	width: Ti.UI.FILL,
			height: Ti.UI.FILL
        },
        
        listView: {
        	top: 0,
        	width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			contentWidth: Ti.UI.FILL,
			contentHeight: 'auto',
			showVerticalScrollIndicator: true,
			layout: 'vertical'
        },
        
        pullToRefreshView: {
        	left: 0,
        	top: 0,
        	width: Ti.UI.FILL,
			height: UI.height(50),
			backgroundColor: '#f9f9f9',
			visible: false
        },
        
        pullToRefreshCotainer: {
        	// left: UI.left(90),
        	// right: UI.right(90),
        	width: Ti.UI.SIZE,
			height: Ti.UI.FILL,
			layout: 'horizontal'
        },
        
        imgArrow: {
        	image: '/images/pull-to-refresh-arrow.png',
        	width: UI.width(20),
        	height: UI.height(20)
        },
        
        lblPullToRefresh: {
        	text: 'Pull to refresh',
        	left: UI.left(10),
        	width: Ti.UI.SIZE,
        	height: Ti.UI.FILL,
            font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#828282',
            textAlign: 'center'
        }
    };
    
    return style;    
};
