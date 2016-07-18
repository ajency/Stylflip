exports.get = function() {
    var style = {
        mainView: {
            height: Ti.UI.FILL,
            layout: 'vertical',
            top: isIOS7Plus?20:0
        },
        
        imgAppLogo: {
            image: '/images/login/logo.png',
            top: UI.top(10),
            width: UI.width(75),
            height: UI.height(75)
        }, 
        
        loginView: {
            backgroundColor: '#fff',
            top: UI.top(10),
            width: UI.width(280),
            height: Ti.UI.SIZE,
            layout: 'vertical'
        },
        
        txtUsernameView: {
        	width: UI.width(280), // Ti.UI.FILL,
        	height: UI.height(40),
        	layout: 'horizontal'
        },
        
        
        imgUsernameView: {
        	width: UI.width(40),
        	height: UI.height(40)
        },
        
        imgUsername: {
        	width: UI.width(12),
        	height: UI.height(13)
        },
        
        btnLogin: {
            backgroundColor: '#ed4e6b',
            title: constant.TEXT.LOGIN,
            top: UI.top(0),
            width: UI.width(320),
            height: UI.height(43.5),
            font: {
                fontSize: UI.fontSize(14),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#fff'
        },
        
        socialButtonView: {
            top: UI.top(5),
            width: UI.width(90),
            height: UI.height(35),
            // layout: 'horizontal'
        },
        
        btnFacebook: {
        	backgroundImage: '/images/login/fb.png',
        	left: 0,
            width: UI.width(35),
            height: UI.width(35)
        },
        
        btnGoogle: {
            backgroundImage: '/images/login/google-plus.png',
            right: 0,
            width: UI.width(35),
            height: UI.width(35)
        },
        
        signUpView: {
            backgroundColor: '#fff',
            top: UI.top(22),
            width: UI.width(320),
            height: Ti.UI.SIZE,
            layout: 'vertical'
        },
        
        btnSignUp: {
            backgroundColor: '#428f96',
            title: constant.TEXT.I_AM_NEW_HERE,
            top: UI.top(0),
            width: UI.width(320),
            height: UI.height(44),
            font: {
                fontSize: UI.fontSize(14),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#fff'
        },
        
        txtFieldsView: {
            top: UI.top(0),
            width: UI.width(320),
            height: Ti.UI.SIZE,
            color: '#737373',
            layout: 'vertical'
        },
        
        verifyView: {
            top: UI.top(0),
            width: UI.width(320),
            height: UI.height(46)
        },
        
        verifyContentsView: {
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            layout: 'horizontal'
        },

        verifyLabels:  {
            width: Ti.UI.SIZE,
            font: {
                fontSize: UI.fontSize(14),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#737373'
        },
       
        checkbox: {
            borderColor: '#438a94',
            borderWidth: 1,
            left: UI.left(13),
            width: UI.width(18),
            height: UI.height(18),
            font: {
                fontSize: UI.fontSize(10),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#438a94'
        },
        
        btnJustBrowsing: {
            backgroundColor: '#5c5c5c',
            title: constant.TEXT.JUST_BROWSING,
            top: UI.top(0),
            width: UI.width(320),
            height: UI.height(44.5),
            font: {
                fontSize: UI.fontSize(14),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#fff'
        },
        
        verificationView: {
        	backgroundColor: '#3f3e40',
        	width: UI.width(280),
        	height: UI.height(300),
        	layout: 'vertical',
        	borderRadius: 20
        },
        
        btnClose: {
        	top: UI.top(5),
        	right: UI.right(5),
        	height: UI.height(30),
        	width: UI.width(30),
        	title: 'x',
        	font: {
        		fontSize: UI.fontSize(25),
        		fontWeight: 'bold'
        	},
        	color: '#fff'
        },
        
        lblAlmostThere: {
        	top: 0,
        	width: Ti.UI.FILL,
    	 	height: UI.height(45),
        	text: 'ALMOST THERE...',
        	font: {
	            fontSize: UI.fontSize(20),
	            fontFamily: constant.FONT.ABEATBYKAI,
	            fontWeight: 'bold'
	        },
        	color: '#fff',
        	textAlign: 'center'
        },
        
        lblInstruction: {
        	top: UI.top(20),
        	left: UI.left(20),
        	right: UI.right(20),
        	height: Ti.UI.SIZE,
        	text: 'Please enter the code you have received on your email id.',
        	font: {
        		fontSize: UI.fontSize(14),
        		fontFamily: constant.FONT.DEFAULT_FONT
        	},
        	color: '#fff',
        	textAlign: 'center'
        },
        
        txtCode: {
        	backgroundColor: '#fff',
        	top: UI.top(25),
        	width: UI.width(100),
        	height: Ti.UI.SIZE, // UI.height(30),
        	font: {
        		fontSize: UI.fontSize(14),
        		fontFamily: constant.FONT.DEFAULT_FONT
        	},
        	hintText: '4 digit code',
        	color: '#3f3e40',
        	maxLength: 4,
        	keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD,
        	textAlign: 'center',
        	bubbleParent: false
        }
    };
    
    return style;    
};