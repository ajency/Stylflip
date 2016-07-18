exports.get = function() {
    var style = {
        mainView: {
            width: Ti.UI.FILL,
            height: Ti.UI.FILL,
            layout: 'vertical'
        },
        
        profileView: {
            width: Ti.UI.FILL,
            height: Ti.UI.FILL,
            showVerticalScrollIndicator: false,
            contentHeight: 'auto',
            contentWidth: Ti.UI.FILL,
            layout: 'horizontal'
        },
        
        profilePicView: {
            backgroundColor: '#FFDF18',
            width: UI.width(160),
            height: UI.height(160)
        },
        
        imgProfilePic: {
            width: UI.width(130),
            height: UI.height(130)
        },
        
        imgProfilePicOverlay: {
        	backgroundImage: '/images/profile/yellow-bg.png',
            width: UI.width(130),
            height: UI.height(130)
        },
        
        profileStatusView: {
            width: UI.width(160),
            height: UI.height(160)
        },
        
        stylLabels: {
        	right: UI.right(40),
            width: Ti.UI.SIZE,
            height: UI.height(20),
            font: {
                fontSize: UI.fontSize(14),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#000'
        },
        
        stylIcons: {
        	right: UI.right(5),
            width: UI.width(18),
            height: UI.height(15)
        },
        
        stylProfileView: {
            backgroundColor: '#ed4e6b',
            width: Ti.UI.FILL,
            height: UI.height(45)
        },
        
        btnRatingView: {
            backgroundColor: 'transparent',
            top: UI.top(-1),
            borderWidth: 1,
            borderColor: '#ebebeb',
            width: '20%',
            height: UI.height(45)
        },
        
        btnRating: {
        	backgroundImage: '/images/profile/btn-home.png',
            width: UI.width(24),
            height: UI.height(21)
        },
        
        lblStylProfile: {
            text: constant.TEXT.STYL_PROFILE,
            width: Ti.UI.SIZE,
            font: {
                fontSize: UI.fontSize(14),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#fff'
        },
        
        btnEditStylProfileView: {
            right: 0,
            width: UI.width(30),
            height: UI.height(30)
        },
        
        btnEditStylProfile: {
        	backgroundImage: '/images/profile/btn-edit.png',
            width: UI.width(18),
            height: UI.height(18)
        }
    };
    
    return style;    
};
