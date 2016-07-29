exports.get = function() {
    var style = {
    	mainView: {
			backgroundColor: '#fff',
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			layout: 'vertical'
		},
		
		productImagesView: {
			top: UI.top(10),
			width: UI.width(265),
			height: UI.height(135)
		},
		
		primaryImageView: {
			backgroundColor: '#80a5ab',
			left: 0,
			top: UI.top(5),
			width: UI.width(125),
			height: UI.height(125)
		},
		
		productImage: {
			width: Ti.UI.FILL,
			height: Ti.UI.FILL
		},
		
		// btnAddImage: {
			// title: ' + ',
			// width: Ti.UI.FILL,
			// height: Ti.UI.FILL,
			// font: {
                // fontSize: UI.fontSize(24),
                // fontFamily: constant.FONT.DEFAULT_FONT
            // },
            // color: '#fff'
		// },
		
		btnAddImage: {
			height: Ti.UI.SIZE,
			font: {
                fontSize: UI.fontSize(11),
                fontFamily: constant.FONT.DEFAULT_FONT,
                fontWeight: 'bold'
            },
            color: '#fff',
            textAlign: 'center'
		},
		
		secondaryImageView: {
			backgroundColor: '#80a5ab',
			width: UI.width(55),
			height: UI.height(55),
		},
		
		lblCoverShotText: {
			text: 'This is your covershot',
			width: UI.width(265),
			height: Ti.UI.SIZE,
			font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#dedede'
		},
		
		buttonView: {
			top: UI.top(0),
	        width: UI.width(260),
	        height: Ti.UI.SIZE,
		    layout: 'vertical'
		},
		
		button: {
			top: -1,
	        left: UI.left(-5),
	        width: UI.width(270),
            font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
	        height: UI.height(40),
	        borderWidth: 1,
	        borderColor: '#bfbfbf'
		},
		
		inputView: {
			top: UI.top(10),
	        width: Ti.UI.FILL,
	        height: Ti.UI.SIZE
		},
		
		textArea: {
			backgroundColor: '#fff',
            left: UI.left(10),
            right: UI.right(10),
            height: UI.height(100),
            font: {
                fontSize: UI.fontSize(14),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#737373',
            paddingLeft: 5,
            maxLength: 100,
            textAlign: 'left',
            maxLength: 100,
            textAlign: 'left',
            hintText: 'Add title here..'
		},
		
		priceView: {
			backgroundColor: '#fff',
            // left: UI.left(10),
            // right: UI.right(10),
            width: UI.width(260),
            height: Ti.UI.SIZE,
            layout: 'vertical'
		},
		
		primaryImage: {
			
		},
		
		secondaryImage: {
			
		},
		
		selectedButton: {
	    	backgroundColor: '#ef4e6d',
            color: '#fff'
	    },
	    
	    unselectedButton: {
	    	backgroundColor: 'transparent',
            color: '#858585'
	    },
	    
	    btnOpenGallery: {
	    	backgroundImage: '/images/sell/camera-gallery.png',
	    	left: UI.left(15),
	    	bottom: UI.bottom(10),
	    	width: UI.width(27.5),
	    	height: UI.height(25)
	    },
	    
	    btnCapture: {
	    	backgroundImage: '/images/sell/camera-click.png',
	    	bottom: UI.bottom(10),
	    	width: UI.width(59.5),
	    	height: UI.height(25)
	    },
	    
	    btnSwitchCamera: {
	    	backgroundImage: '/images/sell/camera-switch.png',
	    	right: UI.right(15),
	    	bottom: UI.bottom(10),
	    	width: UI.width(27.5),
	    	height: UI.height(25)
	    },
	    
	    btnClose: {
	    	title: 'X',
	    	right: UI.right(0),
	    	top: UI.bottom(0),
	    	width: UI.width(40),
	    	height: UI.height(40),
	    	font: {
                fontSize: UI.fontSize(14),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#fff'
	    },
	    
	    
	    mainChart: {
	    	left: -1,
	    	height: Ti.UI.SIZE,
	    	// width: UI.platformWidth + 2,
	    	width: Ti.UI.FILL,
	    	borderColor: '#bfbfbf',
	    	borderWidth: 1,
	    	layout: 'horizontal'
	    },
	    
	    USView: {
	    	width: UI.width(50),
	    	height: Ti.UI.SIZE,
	    	layout: 'vertical'
	    },
	    
	    lblUS: {
	    	width: Ti.UI.SIZE,
	    	height: Ti.UI.SIZE,
	    	font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#757575',
	    	layout: 'vertical'
	    },
	    
	    lblUSValue: {
	    	width: Ti.UI.SIZE,
    		height: UI.height(30),
    		font: {
                fontSize: UI.fontSize(20),
                fontFamily: constant.FONT.DEFAULT_FONT,
                fontWeight: 'bold'
           },
           color: '#757575'
	    },
	    
	    burstView: {
	    	left: -1,
	    	// width: UI.platformWidth + 2,
	    	width: Ti.UI.FILL,
    		height: UI.height(40),
    		layout: 'horizontal'
	    },
	    
	    lblBurst: {
	    	left: UI.left(10),
	    	width: Ti.UI.SIZE,
	    	height: UI.height(30),
	    	font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#757575'
	    },
	    
	    lblBurstValue: {
	    	// left: UI.left(120),
	    	left: UI.left(5),
	    	width: Ti.UI.SIZE,
	    	height: UI.height(30),
	    	font: {
                fontSize: UI.fontSize(12),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#757575',
            bubbleParent: false
	    }
    };
    
    return style;    
};
