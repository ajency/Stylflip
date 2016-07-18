exports.get = function() {
    var style = {
    	label: {
            backgroundColor: 'transparent',
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#ef4e6d'
        },
        
        txtField: {
            backgroundColor: 'transparent',
            // borderColor: '#ebebeb',
            // borderWidth: 1,
            width: Ti.UI.FILL,
            height: UI.height(40),
            font: {
                fontSize: UI.fontSize(14),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#757575',
            paddingLeft: 5,
            // keyboardType: Ti.UI.KEYBOARD_PHONE_PAD,
            maxLength: 30,
            textAlign: 'center',
            bubbleParent: false
        },
        
        roundedButton: {
            // backgroundColor: '#428f96',
            top: UI.top(22),
            width: UI.width(125),
            height: UI.height(45),
            font: {
                fontSize: UI.fontSize(14),
                fontFamily: constant.FONT.DEFAULT_FONT,
                fontWeight: 'bold'
            },
            color: '#fff',
            // borderRadius: UI.width(22.5),
            bubbleParent: false            
        },
        
        smallButton: {
            // backgroundImage: 'transparent',
            width: UI.width(125),
            height: UI.height(30),
            font: {
                fontSize: UI.fontSize(14),
                fontFamily: constant.FONT.DEFAULT_FONT,
                // fontWeight: 'bold'
            },
            color: '#828282',
            // borderRadius: UI.width(22.5),
            bubbleParent: false            
        },
        
        smallButtonBold: {
            // backgroundImage: 'transparent',
            width: Ti.UI.SIZE,
			height: UI.height(35),
            font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT,
                fontWeight: 'bold'
            },
            color: '#828282',
            // borderRadius: UI.width(22.5),
            bubbleParent: false            
        },
        
        smallButtonBoldSelected: {
            // backgroundImage: 'transparent',
            width: Ti.UI.SIZE,
			height: UI.height(35),
            font: {
                fontSize: UI.fontSize(14),
                fontFamily: constant.FONT.DEFAULT_FONT,
                fontWeight: 'bold'
            },
            color: '#000',
            // borderRadius: UI.width(22.5),
            bubbleParent: false            
        },
        
        bigButton: {
            // backgroundImage: 'transparent',
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
        
        plainButton: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: '#ebebeb',
            width: '100%',
            height: UI.height(45),
            font: {
                fontSize: UI.fontSize(14),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#737373'
        },
        
        smallIcon: {
            width: UI.width(22),
            height: UI.height(22)
        },
        
        hrLine: {
	    	backgroundColor: '#f4f4f4', // '#bfbfbf',
	    	left: UI.left(0),
	    	right: UI.right(0),
	    	top: 10, // UI.top(10),
	    	height: 1
	    },
	    
	    buttonContainer: {
	    	width: UI.width(30),
	    	height: UI.height(30)
	    },
	    
	    likeButton: {
	    	backgroundImage: '/images/common/like.png',
	    	width: UI.width(19),
	    	height: UI.width(16.5)
	    },
	    
	    commentButton: {
	    	backgroundImage: '/images/common/comment.png',
	    	width: UI.width(19),
	    	height: UI.width(16.5)
	    },
	    
	    tagButton: {
	    	backgroundImage: '/images/common/tag.png',
	    	width: UI.width(16.5),
	    	height: UI.width(16.5)
	    },
	    
	    followButton: {
	    	title: 'Follow',
	    	width: UI.width(50),
            height: UI.height(30),
            font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            backgroundColor: 'transparent',
            color: '#828282',
            borderWidth: 1,
            borderColor: '#828282',
            borderRadius: 5,
            bubbleParent: false  
	    },
	    
	    unfollowButton: {
	    	title: 'Following',
	    	width: UI.width(70),
            height: UI.height(30),
            font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            backgroundColor: '#ef4e6d',
            color: '#fff',
            borderRadius: 5,
            bubbleParent: false  
	    },
	    
	    menuButton: {
	    	backgroundImage: '/images/common/select-option.png',
	    	width: UI.width(16),
	    	height: UI.height(16),
	    	bubbleParent: false
	    },
	    
	    deleteButton: {
	    	backgroundImage: '/images/common/delete-picture.png',
	    	top: UI.top(3),
	    	right: UI.top(2),
	    	width: UI.width(25),
	    	height: UI.height(25),
	    	bubbleParent: false
	    },
	    
	    contentView: {
	    	top: constant.HEADER_HEIGHT,
	    	width: Ti.UI.FILL,
		    height: constant.CONTENT_HEIGHT
	    },
	    
	    contentScrollView: {
	    	top: constant.HEADER_HEIGHT,
	    	width: Ti.UI.FILL,
		    height: constant.CONTENT_HEIGHT,
		    contentWidth: Ti.UI.FILL,
	        showVerticalScrollIndicator: true
	    },
	    
	    accordionView: {
	    	backgroundColor: '#f2f2f2',
	    	left: -1,
	    	top: -1,
	    	width: UI.platformWidth + 2,
	    	height: UI.height(50),
	    	borderColor: '#bfbfbf',
	    	borderWidth: 1
	    },
	    
	    accordionLabel: {
	    	left: UI.left(20),
	    	width: Ti.UI.SIZE,
	    	font: {
	            fontSize: UI.fontSize(14),
	            fontFamily: constant.FONT.DEFAULT_FONT
	        },
	        color: '#737373'
	    },
	    
	    rightArrow: {
	    	image: '/images/common/edit-screen.png',
	    	width: UI.width(10),
	    	height: UI.height(10),
	    	right: UI.right(20)
	    },
	    
	    expandButton: {
	    	title: '+',
	    	width: UI.width(20),
	    	height: UI.height(20),
	    	font: {
                fontSize: UI.fontSize(14),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
	    	color: '#828282'
	    }
    };
    
    return style;    
};
