exports.get = function() {
    var style = {
        mainView: {
        	backgroundColor: '#e0e0e0',
        	right: UI.right(48),
        	left: UI.left(35), // UI.width(250),
            height: UI.height(32),
            layout: 'vertical'
            // borderColor: '#7d7d7d',
            // borderWidth: 1,
            // borderRadius: 5
        },
        
        imgSearch: {
        	image: '/images/header/search-mini.png',
        	left: UI.left(5),
        	width: UI.width(15),
        	height: UI.height(15)
        },
        
        txtSearch: {
        	backgroundColor: 'transparent',
        	left: -1, // UI.left(5),
        	right: -1, // UI.right(5),
        	top: -1,
        	height: Ti.UI.FILL, // UI.height(30),
        	color: '#000',
        	font: {
                fontSize: UI.fontSize(13),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            paddingLeft: 5,
            paddingRight: 5,
            hintTextColor:'#000',
        	hintText: 'Search',
        	verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
        	bubbleParent: false,
        	returnKeyType: Ti.UI.RETURNKEY_SEARCH,
        	borderColor: '#ef4e6d',
        	borderWidth: 1
        }
    };
    
    return style;    
};
