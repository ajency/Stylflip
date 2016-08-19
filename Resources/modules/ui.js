var pheight = Ti.Platform.displayCaps.platformHeight;
var pwidth = Ti.Platform.displayCaps.platformWidth;

var Animation = require('/modules/animation');

var positiveButtons = ['yes', 'ok', 'true', 'correct', 'agree'];
var negativeButtons = ['no', 'cancel', 'false', 'wrong', 'disagree'];


var UI = {};

UI.disableUpdateOnResume = false;
UI.firstLogin = false;
UI.platformWidth = pwidth;
UI.platformHeight = pheight;

UI.top = function(top){
 	return (pwidth * top) / 320;
};

UI.left = function(left){
 	return (pwidth * left) / 320;
};

UI.bottom = function(bottom){
 	return (pwidth * bottom) / 320;
};

UI.right = function(right){
 	return (pwidth * right) / 320;
};

UI.width = function(width){
 	return (pwidth * width) / 320;
};

UI.height = function(height){
 	return (pwidth * height) / 320;
};

UI.fontSize = function(fontSize){
	return (pwidth * fontSize) / 320;
};

UI.createButton = function(style) {
	if(Ti.Platform.osname == 'android') {
		if(!style.hasOwnProperty('backgroundImage')) {
			style.backgroundImage = 'transparent';
		}
	}
	
	var button = Ti.UI.createButton(style);
	
	if(style.touchEnabled == undefined) {
		button.touchEnabled = true;		
	}
	
	if(Ti.Platform.osname == 'android') {
		UI.addClickEventListener(button);
	}
	return button;
};


// UI.createButton = function(style) {
	// if(Ti.Platform.osname == 'android') {
		// if(!style.hasOwnProperty('backgroundImage')) {
			// style.backgroundImage = 'transparent';
		// }
	// }
// 	
	// var buttonView;
// 	
	// if(style.hasOwnProperty('container')) {
		// buttonView = Ti.UI.createView({
			// borderColor: 'green'
		// });
		// for(var key in style) {
			// if(key != 'backgroundImage' || key != 'image') {}
			// else {
				// buttonView[key] = style[key];
			// }
		// }
		// if(style.container.hasOwnProperty('width') != undefined) {
			// buttonView.width = style.container.width;
		// }
		// if(style.container.hasOwnProperty('height') != undefined) {
			// buttonView.height = style.container.height;
		// }
		// var button = Ti.UI.createButton(style);
		// button.top = style.container.top;
		// button.left = style.container.left;
		// button.bottom = style.container.bottom;
		// button.right = style.container.right;
		// buttonView.add(button);
		// buttonView.setBackgroundImage = function(image) {
			// button.backgroundImage = image;
		// };
	// }
	// else {
		// buttonView = Ti.UI.createButton(style);
	// }
// 	
	// if(style.touchEnabled == undefined) {
		// buttonView.touchEnabled = true;		
	// }
// 	
	// if(Ti.Platform.osname == 'android') {
		// UI.addClickEventListener(buttonView);
	// }
	// return buttonView;
// };


UI.enableButton = function(button, style) {
	button.color = '#ef4e6d';
	button.enabled = true;
	button.touchEnabled = true;
	// button.opacity = 1;
	for(key in style) {
		button[key] = style[key];
	}
};


UI.disableButton = function(button, style) {
	button.color = '#e0e0e0';
	button.enabled = false;
	button.touchEnabled = false;
	// button.opacity = 0.5;
	for(key in style) {
		button[key] = style[key];
	}
};


UI.enableView = function(view) {
	view.enabled = true;
	view.touchEnabled = true;
	view.opacity = 1;
};


UI.disableView = function(view) {
	view.enabled = false;
	view.touchEnabled = false;
	view.opacity = 0.6;
};

UI.createCheckbox = function(style) {
    var checkbox = Ti.UI.createLabel(style);
    checkbox.textAlign = 'center';
    
    checkbox.checked = style.checked?true:false;
    
    if(checkbox.checked) {
        checkbox.text = "√";
    }
    
    checkbox.addEventListener('click', function() {
        this.checked = !checkbox.checked;
        
        if(this.checked) {
            this.text = "√";
        }
        else {
            this.text = "";
        }
    });
    
    return checkbox;
};


UI.createOverlayView = function(view, bgTransparent) {
    var $ = this;
    var overlayContentsView = view;
    overlayContentsView.bubbleParent = false;
    var events = {};
    var currentWindow = Window.getCurrentWindow();
    
    // var overlayView = Ti.UI.createScrollView({
        // backgroundColor: "transparent",
        // width: Ti.UI.FILL,
        // height: Ti.UI.FILL,
        // bubbleParent: false,
        // opacity: 0,
        // zIndex: 50,
        // disableBounce: true
    // });
    
    var overlayView = Ti.UI.createView({
        backgroundColor: "transparent",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        bubbleParent: false,
        opacity: 0,
        zIndex: 50
    });
    
    var overlayTransparentView = Ti.UI.createView({
        backgroundColor: "#000",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        opacity: bgTransparent?0:0.60
    });
    
    overlayView.add(overlayTransparentView);
    overlayView.add(overlayContentsView);
    Window.getCurrentWindow().add(overlayView);
 
    $.show = function() {
		if(osname == 'android') {
            if(overlayView){
                overlayView.animate({
                    opacity: 1,
                    duration: 200
                }, function(e) {
                    overlayView.opacity = 1;
                    e.source = null;
                });
                // overlayView.opacity = 1;
            }
    	}
    	else {
    		Animation.popIn(overlayView);
    	}
    	
    	currentWindow.addEventListener('android:back', _backEventListener);
    }; 
    
    $.addEventListener = function(event, callback) {
        events.event = event;
        events.listener = callback;
    };
    
    var _clearMemory = function() {
        events.event = null;
        events.listener = null;
        overlayView.removeEventListener('click', function() {
            $.hide();
        });
        overlayView.remove(overlayTransparentView);
        overlayView.remove(overlayContentsView);
        Window.getCurrentWindow().remove(overlayView);
         
        overlayTransparentView = null;
        overlayView = null;
        overlayContentsView = null;
        currentWindow.removeEventListener('android:back', _backEventListener);
		_backEventListener = null;
		currentWindow = null;
        _clearMemory = null;
    };
    
    var _isShowing = false;
    
    $.hide = function() {
    	if(osname == 'android') {
            //TBD fix titanium error on image capture
            if(overlayView){
                overlayView.animate({
                    opacity: 0,
                    duration: 200
                }, function(e) {
                    overlayView.opacity = 0;
                    e.source = null;
                    Utils._.isFunction(events.listener) && events.listener();
                    _clearMemory();
                });
                // overlayView.opacity = 0;
                // Utils._.isFunction(events.listener) && events.listener();
                // _clearMemory();
            }
    	}
    	else {
    		Animation.popOut(overlayView, function() {
	            Utils._.isFunction(events.listener) && events.listener();
	            _clearMemory();
	        });
    	}
    };
    
    overlayView.addEventListener('click', function() {
        $.hide();
    });
    
    var _backEventListener = function() {
    	$.hide();
	};
};


UI.alertDialog = function(props) {
    var $ = this;
    var overlayView;
    var events = {};
    var clickCallback, hideCallback;
    var optionsType = props.type ? props.type : 'radio';
    var dismissOnPositive = true;
    var dismissable = true;
    var titleColor = props && props.titleColor ? props.titleColor : '#fff';


    if(props.hasOwnProperty('dismissOnPositive')) {
    	dismissOnPositive = props.dismissOnPositive;
    }
    
    if(props.hasOwnProperty('dismissable')) {
    	dismissable = props.dismissable;
    }
    
    var alertView = Ti.UI.createView({
        backgroundColor: '#27292e',
        width: UI.width(300),
        height: Ti.UI.SIZE, //UI.height(120),
        layout: 'vertical',
        borderRadius: 20
    });
    
    var lblTitle = Ti.UI.createLabel({
        backgroundColor: 'transparent',
        color: titleColor,
        text: props && props.title && Utils.toEachWordUppercase(props.title),
        top: UI.top(0),
        width: UI.width(280),
        height: UI.height(45),
        font: {
            fontSize: UI.fontSize(20),
            // fontFamily: UI.fonts.DEFAULT_FONT,
            fontFamily: constant.FONT.ABEATBYKAI,
            fontWeight: 'bold'
        },
        // color: '#fff',
        textAlign: 'center'
    });
    
    var contentView = Ti.UI.createScrollView({
        showVerticalScrollIndicator: true,
        top: UI.top(10),
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    
    if(props && props.message) {
        Ti.API.info(constant.APP + " ############ constructing message ################");
    	var lblMessage = Ti.UI.createLabel({
	        text: props.message,
	        left: UI.left(20),
	        right: UI.right(20),
	        top: UI.top(20),
	        bottom: UI.bottom(20),
	        height: Ti.UI.SIZE,
	        font: {
	            fontSize: UI.fontSize(14),
	            fontFamily: UI.fonts.DEFAULT_FONT
	        },
	        color: '#fff',
	        textAlign: props.textAlign ? props.textAlign : 'center'
	    });
	    contentView.add(lblMessage);

        if(props && props.secMessages && props.secMessages.length){
            Ti.API.info(constant.APP + " ############ constructing secondary message ################");
            var x = 0, secMessages = props.secMessages;
            for(x = 0, Length = secMessages.length; x < Length; x++){
                var secLabel = Ti.UI.createLabel({
                    top: UI.top(5),
                    color: '#fff',
                    // text: secMessages[x],
                    html: secMessages[x],
                    height: Ti.UI.SIZE,
                    width: Ti.UI.FILL,
                    textAlign: props.textAlign ? props.textAlign : 'center',
                    font: {
                        fontSize: UI.fontSize(15),
                        fontFamily: UI.fonts.DEFAULT_FONT
                    }
                });

                Ti.API.info(constant.APP + " adding message: " + secMessages[x]);
                contentView.add(secLabel);
            }
        }
    }
    else if(props && props.options) {
    	contentView.layout = 'vertical';
    	var lastSelectedButton, lastSelectedButtonIndex, selectedOptions = [];
    	for(var i = 0; i < props.options.length; i++) {
    		var optionView = UI.createClickableView({
    			top: UI.top(10),
    			width: Ti.UI.FILL,
    			height: Ti.UI.SIZE,
    			layout: optionsType == 'radio' ? 'horizontal' : 'absolute',
    			index: i
    		});
    		var option = Ti.UI.createImageView({
    			image: optionsType == 'radio' ? '/images/common/btn-radio-unselected.png' : '/images/sell/form-check-off.png',
    			left: UI.left(30),
    			width: UI.width(15),
    			height: UI.height(15)
    		});
    		var optionText = Ti.UI.createLabel({
    			text: props.options[i],
    			left: optionsType == 'radio' ? UI.left(10) : UI.left(70),
    			right: UI.right(10),
    			width: Ti.UI.SIZE,
    			height: Ti.UI.SIZE,
		        font: {
		            fontSize: UI.fontSize(13),
		            fontFamily: UI.fonts.DEFAULT_FONT
		        },
		        color: '#fff'
    		});
    		optionView.add(option);
    		optionView.add(optionText);
    		contentView.add(optionView);
    		if(i < props.options.length - 1) {
    			contentView.add(Ti.UI.createView({
	    			backgroundColor: '#f4f4f4',
	    			left: UI.left(30),
	    			right: UI.right(30),
	    			top: UI.top(10),
	    			height: 1
	    		}));
    		}
    		
    		optionView.addEventListener('click', function() {
    			if(optionsType == 'radio') {
    				if(lastSelectedButton) {
	    				lastSelectedButton.image = '/images/common/btn-radio-unselected.png';
	    			}
	    			this.children[0].image = '/images/common/btn-radio-selected.png';
	    			lastSelectedButton = this.children[0];
	    			lastSelectedButtonIndex = this.index;
    			}
    			else {
    				if(this.children[0].image == '/images/sell/form-check-off.png') {
			    		this.children[0].image = '/images/sell/form-check-on.png';
			    		selectedOptions.push(this.index);
			    	}
			    	else {
			    		this.children[0].image = '/images/sell/form-check-off.png';
		    			selectedOptions.splice(selectedOptions.indexOf(this.index), 1);
			    	}
    			}
    		});
    	}
    }
    
    if(props && props.title) {
    	alertView.add(lblTitle);
    }
    alertView.add(contentView);
    
    
    if(props && props.customView) {
    	contentView.layout = 'vertical';
    	contentView.add(props.customView);
    }
    
    var buttonsView = Ti.UI.createView({
    	top: UI.top(20),
		width: Ti.UI.FILL,
		height: UI.height(50),
		layout: 'horizontal'
	});
    
    if(props.buttonNames) {
    	for(var i = 0; i < props.buttonNames.length; i++) {
    		var btnContainer = UI.createClickableView({
    			width: ((100 / props.buttonNames.length) - 1) + '%', // Ti.UI.SIZE,
    			height: Ti.UI.FILL,
		        index: i,
		        positive: positiveButtons.indexOf(props.buttonNames[i].toLowerCase()) > -1
    		});
			var btn = UI.createButton({
				width: UI.width(24),
    			height: UI.height(24),
    			bubbleParent: true
    		});
    		if(positiveButtons.indexOf(props.buttonNames[i].toLowerCase()) > -1) {
    			btn.backgroundImage = '/images/common/btn-ok.png';
    		}
    		else if(negativeButtons.indexOf(props.buttonNames[i].toLowerCase()) > -1) {
    			btn.backgroundImage = '/images/common/btn-cancel.png';
    		}
    		else {
    			btn.title = props.buttonNames[i];
    			btn.width = Ti.UI.FILL;
    			btn.height = Ti.UI.FILL;
    			btn.font = {
	                fontSize: UI.fontSize(16),
	                fontFamily: constant.FONT.ABEATBYKAI
	           	};
	            btn.color = '#ef4e6d';
    		}
    		btnContainer.add(btn);
    		btnContainer.addEventListener('click', function() {
    			if(this.positive) {
    				Utils._.isFunction(clickCallback) && clickCallback({index: this.index, selectedOption: optionsType == 'radio' ? lastSelectedButtonIndex : selectedOptions});
    				if(dismissOnPositive) {
    					$.hide();
    				}
    			}
    			else {
    				Utils._.isFunction(clickCallback) && clickCallback({index: this.index});
    				if(dismissable) {
    					$.hide();
    				}
    			}
    		});
    		buttonsView.add(btnContainer);
    	}
    }
    else {
    	var btnContainer = UI.createClickableView({
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			index: 0
		});
    	var button = UI.createButton({
			title: 'Dismiss',
			font: {
                fontSize: UI.fontSize(18),
                fontFamily: constant.FONT.ABEATBYKAI
            },
            color: '#ef4e6d'
		});
		btnContainer.add(button);
		btnContainer.addEventListener('click', function() {
			$.hide();
		});
		buttonsView.add(btnContainer);
    }
    
    alertView.add(buttonsView);
    
    $.show = function(hideCallback) {
        overlayView = new UI.createOverlayView(alertView);
        overlayView.show();
        overlayView.addEventListener('hide', _hideListener);
    };
    
    $.addEventListener = function(event, callback) {
    	switch(event) {
    		case 'click':
    			clickCallback = callback;
    		break;
    		case 'hide':
    			hideCallback = callback;
    		break;
    	}
        // events.event = event;
        // events.listener = callback;
    };
    
    var _hideListener = function() {
        Utils._.isFunction(hideCallback) && hideCallback();
        clickCallback = null;
        hideCallback = null;
        overlayView = null;
        $.show = null;
        $.hide = null;
        $ = null;
        _hideListener = null;
        Window.clearMemory(alertView, function() {
            alertView = null;
        });
    };
    
    $.hide = function() {
        overlayView.hide(function() {
            _hideListener();
        });
    };
    
    if(alertView.toImage().height > (pheight - UI.height(100))) {
        alertView.height = pheight - UI.height(100);
        contentView.height = alertView.height - lblTitle.height;
    }
}; //end alertDialog


UI.createAlertDialog = function(props) {
	var alertDialog = new UI.alertDialog(props, function() {
	    alertDialog = null;
	});
	return alertDialog;
};


UI.dialogBox = function(props) {
    var $ = this;
    var overlayView;
    var events = {};
    
    var dialogBox = Ti.UI.createView({
        backgroundColor: '#fcfcfc',
        width: UI.width(320),
        height: Ti.UI.SIZE, //UI.height(120),
        layout: 'vertical'
    });
    
    var headerView = Ti.UI.createView({
    	backgroundColor: '#e0e0e0',
        top: 0,
        width: Ti.UI.FILL,
        height: UI.height(45)
    });
    
    var btnBackView = Ti.UI.createView({
    	left: 0,
        width: UI.width(50),
        height: UI.height(50),
        zIndex: 1
    });
    var btnBack = UI.createButton({
    	backgroundImage: '/images/header/back.png',
        left: UI.left(10),
        width: UI.width(15),
        height: UI.height(24)
    });  
    btnBackView.add(btnBack);   
    
    var lblTitle = Ti.UI.createLabel({
        text: props && props.title,
        left: 0,
        top: 0,
        width: Ti.UI.FILL,
        height: UI.height(45),
        font: {
            fontSize: UI.fontSize(20),
            fontFamily: constant.FONT.ABEATBYKAI
        },
        color: '#ef4e6d',
        textAlign: 'center'
    });
    
    headerView.add(btnBackView);
    headerView.add(lblTitle);
    
    var contentView = Ti.UI.createScrollView({
        showVerticalScrollIndicator: false,
        top: 2,
        width: Ti.UI.FILL,
        height: (props && props.view && props.view.height)?props.view.height:Ti.UI.SIZE,
        contentHeight: 'auto',
        canCancelEvents: false
    });
    
    // var contentView = Ti.UI.createView({
    	// top: 2,
        // width: Ti.UI.FILL,
        // height: (props && props.view && props.view.height)?props.view.height:Ti.UI.SIZE,
    // });
    
    props && props.view && contentView.add(props.view);
    
    // contentView.add(contentHolder);
    
    dialogBox.add(headerView);
    dialogBox.add(contentView);
    
    
    $.show = function() {
        overlayView = new UI.createOverlayView(dialogBox, bgTransparent=(props && props.view && props.view.height == constant.POP_UP_CONTENT_MAX_HEIGHT)?true:false);
        overlayView.show();
        overlayView.addEventListener('hide', _hideListener);
    };
    
    $.addEventListener = function(event, callback) {
        events.event = event;
        events.listener = callback;
    };
    
    $.addButtonToHeader = function(button) {
    	headerView.add(button);
    };
    
    var _hideListener = function() {
        Utils._.isFunction(events.listener) && events.listener();
        btnBackView.removeEventListener('click', $.hide);
        events.event = null;
        events.listener = null;
        overlayView = null;
        $ = null;
        _hideListener = null;
        Window.clearMemory(dialogBox, function() {
            dialogBox = null;
        });
    };
    
    $.hide = function() {
        overlayView.hide(function() {
            _hideListener();
        });
    };
    
    if(props && props.view && props.view.height == constant.POP_UP_CONTENT_MAX_HEIGHT) {
    	dialogBox.top = constant.TOP_MARGIN;
    }
    // dialogBox.top = constant.TOP_MARGIN;
    // dialogBox.height = constant.WINDOW_HEIGHT;
    // contentView.height = constant.POP_UP_CONTENT_MAX_HEIGHT;
    
    btnBackView.addEventListener('click', $.hide);
    
    // if(dialogBox.toImage().height > constant.POP_UP_CONTENT_MAX_HEIGHT && dialogBox.toImage().height > (pheight - UI.height(100))) {
        // dialogBox.height = pheight - UI.height(100);
        // contentView.height = dialogBox.height - lblTitle.height;
    // }
};


UI.buttonBarView = function(obj) {
	var $ = this;
    var events = {};
    var arrButtons = obj.buttonNames;
    var buttonsLength = arrButtons.length;
    var BUTTON_HEIGHT = UI.height(60);
    var ANIMATE_DURATION = 350;
    // var ANIMATE_DURATION = 1;
    var currentWindow = Window.getCurrentWindow();
    
    var overlayView = Ti.UI.createView({
        backgroundColor: "#000",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        bubbleParent: false,
        opacity: 0,
        zIndex: 500
    });
    
	var buttonBarView = Ti.UI.createView({
		backgroundColor: '#fff',
		bottom: UI.bottom(-buttonsLength*BUTTON_HEIGHT),
		width: Ti.UI.FILL,
		height: (buttonsLength * BUTTON_HEIGHT) - (buttonsLength),
		layout: 'vertical',
		zIndex: 500
	});
	
	for(var i=0; i<arrButtons.length; i++) {
    	var button = UI.createButton(Utils._.extend({}, _commonStyle.smallButton, {
	        title: arrButtons[i],
	        top: -1,
	        width: UI.width(325), // Ti.UI.FILL,
	        height: BUTTON_HEIGHT,
	        font: {
                fontSize: UI.fontSize(14),
                fontFamily: constant.FONT.DEFAULT_FONT
            },
            color: '#ef4e6d',
	        index: i,
	        data: arrButtons[i],
	        borderWidth: 1,
	        borderColor: '#bfbfbf'
	    }));
	    buttonBarView.add(button);
	    
	    button.addEventListener('click', function() {
	    	Utils._.isFunction(events.listener) && events.listener({ index: this.index, title: this.title });
	    	$.hide();
	    });
    }
    
    $.show = function() {
    	Window.getCurrentWindow().add(overlayView);
    	Window.getCurrentWindow().add(buttonBarView);
    	
    	overlayView.animate({
    		opacity: 0.60,
    		duration: ANIMATE_DURATION,
    		// curve: Ti.UI.ANIMATION_CURVE_EASE_IN
    	}, function(e) {
    		overlayView.opacity = 0.60;
    		e.source = null;
    	});
    	buttonBarView.animate({
    		bottom: 0,
    		duration: ANIMATE_DURATION,
    		// curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
    	}, function(e) {
    		buttonBarView.bottom = 0;
    		e.source = null;
    	});
    	
    	currentWindow.addEventListener('android:back', _backEventListener);
    };
    
    $.addEventListener = function(event, callback) {
        events.event = event;
        events.listener = callback;
    };
    
    $.hide = function() {
    	overlayView.animate({
    		opacity: 0,
    		duration: ANIMATE_DURATION
    	}, function(e) {
    		e.source = null;
    		overlayView.removeEventListener('click', $.hide);
    		Window.getCurrentWindow().remove(overlayView);
    		overlayView = null;
    		$ = null;
    	});
    	buttonBarView.animate({
    		bottom: UI.bottom(-buttonsLength*BUTTON_HEIGHT),
    		duration: ANIMATE_DURATION
    	}, function(e) {
    		e.source = null;
    		Window.getCurrentWindow().remove(buttonBarView);
    		Window.clearMemory(buttonBarView);
    		buttonBarView = null;
    		events = null;
    		arrButtons = null;
		    buttonsLength = null;
		    BUTTON_HEIGHT = null;
		    ANIMATE_DURATION = null;
    	});
    	currentWindow.removeEventListener('android:back', _backEventListener);
    	_backEventListener = null;
    };
    
    overlayView.addEventListener('click', $.hide);
    
    var _backEventListener = function() {
    	$.hide();
    };
};


UI.createButtonBarView = function(arrButtons) {
	var buttonBarView = new UI.buttonBarView(arrButtons);
    return buttonBarView;
};


UI.createDialogBox = function(title, callback) {
	var dialogBox = new UI.dialogBox(title, callback);
	return dialogBox;
};


UI.createClickableView = function(style) {
	var clickableView = Ti.UI.createView(style);
	if(style && style.touchEnabled == undefined) {
		clickableView.touchEnabled = true;		
	}
	UI.addClickEventListener(clickableView);
	return clickableView;
};

UI.createClickableLabel = function(style) {
	var clickableLabel = Ti.UI.createLabel(style);
	if(style && style.touchEnabled == undefined) {
		clickableLabel.touchEnabled = true;		
	}
	UI.addClickEventListener(clickableLabel);
	return clickableLabel;
};


UI.createTextField = function(style) {
	var textColor = style.color ? style.color : '#828282';
	var hintColor = osname == 'android' ? '#e0e0e0' : '#c8c8cc';
	
	if(style.type == 'textArea') {
		var textField = Ti.UI.createTextArea(style);
	}
	else {
		var textField = Ti.UI.createTextField(style);
		if(osname != 'android' && (textField.keyboardType == Ti.UI.KEYBOARD_NUMBER_PAD || textField.keyboardType == Ti.UI.KEYBOARD_DECIMAL_PAD || textField.keyboardType == Ti.UI.KEYBOARD_PHONE_PAD)) {
			textField.keyboardToolbarHeight = UI.height(40);
			textField.keyboardToolbar = '#f2f2f2';
			var toolbarView = Ti.UI.createView({
				backgroundColor: '#f2f2f2',
				width: Ti.UI.FILL,
				height: UI.height(40)
			});
			var btnDone = UI.createButton(Utils._.extend({}, _commonStyle.smallButtonBold, {
		    	title: 'DONE',
		    	right: UI.right(10),
		    	width: UI.width(50)
		    }));
		    toolbarView.add(btnDone);
			textField.keyboardToolbar = toolbarView;
			btnDone.addEventListener('click', function() {
				textField.blur();
			});
		}
	}
	
	if(style.type == 'textArea') {
		if(style.hintText && textField.value != undefined && textField.value.trim().length == 0) {
			textField.value = style.hintText;
			textField.color = hintColor;
		}
		else {
			textField.color = textColor;
		}
		
		if(textField.value == style.hintText) {
			textField.color = hintColor;
		}
		else {
			textField.color = textColor;
		}
	}
	
	textField.addEventListener('focus', function() {
		if(style.type == 'textArea') {
			if(textField.value == style.hintText) {
				textField.value = '';
			}
			textField.color = textColor;
		}
		// else {
			// textField.hintText = '';	
		// }
	});
	
	textField.addEventListener('blur', function() {
		if(style.type == 'textArea') {
			if(textField.value.trim() == '') {
				textField.value = style.hintText;
				textField.color = hintColor;
			}
		}
		// else {
			// textField.hintText = style.hintText;	
		// }
	});
	
	return textField;
};


UI.createStrikeThroughLabel = function(style) {
	var lbl = Ti.UI.createLabel(style);
	lbl.text = lbl.text.trim();
	lbl.visible = false;
    Window.getCurrentWindow().add(lbl);
    var hrLine = Ti.UI.createView({
		backgroundColor: style.color ? style.color : '#000',
		height: 1,
		width: lbl.toImage().width
	});
	Window.getCurrentWindow().remove(lbl);
	var attributedView = Ti.UI.createView(Utils._.extend({}, style, {
		width: Ti.UI.SIZE,
		height: Ti.UI.SIZE
	}));
	lbl.text = style.text;
	lbl.visible = true;
	attributedView.add(lbl);
	attributedView.add(hrLine);
	return attributedView;
	
	/*
	var attrString = Ti.UI.iOS.createAttributedString({
	    text: style.text,
	    attributes: [{
            type: Ti.UI.iOS.ATTRIBUTE_STRIKETHROUGH_STYLE,
            value: Ti.UI.iOS.ATTRIBUTE_UNDERLINE_STYLE_SINGLE,
            range: [style.range.from, style.range.to]
        }]
	});
    var lbl = Ti.UI.createLabel(Utils._.extend({}, style, {
		attributedString: attrString
    }));
    return lbl;
    */
};


UI.addClickEventListener = function(uiView) {
    uiView.addEventListener('touchstart', function() {
    	if(!this.touchEnabled) {
			return;
		}
        uiView.opacity = 0.60;
    });

    uiView.addEventListener('touchend', function() {
    	if(!this.touchEnabled) {
			return;
		}
		
		if(Ti.Platform.osname == 'android') {
	    	uiView.opacity = 1;
		}
		else {
	        uiView.animate({
	            opacity: 1,
	            duration: 250
	        }, function(e) {
	            uiView.opacity = 1;
	            e.source = null;
	        });			
		}
    });
    
    uiView.addEventListener('touchcancel', function() {
    	if(!this.touchEnabled) {
			return;
		}

		if(Ti.Platform.osname == 'android') {
	    	uiView.opacity = 1;
		}
		else {
	        uiView.animate({
	            opacity: 1,
	            duration: 250
	        }, function(e) {
	            uiView.opacity = 1;
	            e.source = null;
	        });			
		}
    }); 	    
};


UI.showLoginAlert = function(positiveButtonCallback) {
	var alertDialog = UI.createAlertDialog({
        // title: 'LOGIN REQUIRED!', 
        // message: 'You need to sign up to access this.'
        title: constant.ALERT.TITLE.SIGN_UP,
        message: 'You need to sign up to access this and our other features. Sign-up now and you won\'t regret it.',
        buttonNames: ['Yes please', 'Not right now']
    });
    alertDialog.show();
    alertDialog.addEventListener('click', function(e) {
    	if(e.index == 0) {
    		Ti.App.fireEvent('removeFromMemory');
    		var window = Window.create(exitOnClose=true);
			var login = require('/screens/login').get();
	        window.add(login.getView());
	        Window.open(window); 
    	}
    	alertDialog = null;
    });
};


UI.showAlert = function(message) {
	var alertDialog = UI.createAlertDialog({
        title: constant.ALERT.TITLE.OOPS, 
        message: message
    });
    alertDialog.show();
    alertDialog = null;
};


UI.createFollowButton = function(style, userId, callback) {
	var btnFollow = UI.createButton(style);
	
	btnFollow.addEventListener('click', function() {
		if(!Utils.isUserLoggedIn()) {
    		UI.showLoginAlert();
    		return;
    	}
    	
		var _requestArgs = {
	        showLoader: true,
	        url: 'social.php',
	        method: 'post',
	        serverArgs: {
	        	action: btnFollow.title == 'Follow' ? 'follow' : 'unfollow',
	            userId: Utils.loggedInUserId(),
	            followedUserId: userId
	        }
	    };
	    
        /*
         * Hit web service
         */
        HttpClient.getResponse({
        	requestArgs: _requestArgs,
        	success: function(response) {
        		setTimeout(function() {
        			// btnFollow.isFollowing = btnFollow.isFollowing ? false : true;
		    		// btnFollow.title =  btnFollow.isFollowing ? 'Following' : 'Follow';
		    		// btnFollow.borderColor = btnFollow.isFollowing ? 'transparent' : '#828282';
		    		// btnFollow.backgroundColor = btnFollow.isFollowing ? '#ef4e6d' : 'transparent';
		    		// btnFollow.color = btnFollow.isFollowing ? '#fff' : '#828282';
		    		// btnFollow.width = btnFollow.isFollowing ? UI.width(70) : UI.width(50);
		    		btnFollow.isFollowing = btnFollow.isFollowing ? false : true;
		    		btnFollow.changeButtonStyle(btnFollow.isFollowing);
		    		Utils._.isFunction(callback) && callback({following: btnFollow.isFollowing});
        		}, 500);
        	},
        	error: function(error) {
                var alertDialog = UI.createAlertDialog({
                    title: error.errorTitle, 
                    message: error.errorMessage
                });
                alertDialog.show();
                alertDialog = null;
        	}
        });
	});
	
	btnFollow.changeButtonStyle = function(isFollowing) {
		btnFollow.isFollowing = isFollowing;
		btnFollow.title =  isFollowing ? 'Following' : 'Follow';
		btnFollow.borderColor = isFollowing ? 'transparent' : '#828282';
		btnFollow.backgroundColor = isFollowing ? '#ef4e6d' : 'transparent';
		btnFollow.color = isFollowing ? '#fff' : '#828282';
		btnFollow.width = isFollowing ? UI.width(70) : UI.width(50);
	};
	
	return btnFollow;
};

UI.createNoDataView = function(style) {
	var lblNoData = Ti.UI.createLabel({
		text: 'No Data Available.',
    	width: Ti.UI.FILL,
    	height: Ti.UI.FILL,
        font: {
            fontSize: UI.fontSize(12),
            fontFamily: constant.FONT.DEFAULT_FONT
        },
        color: '#828282',
        textAlign: 'center',
        type: 'noDataLabel'
    });
    if(style != undefined) {
    	for(var key in style) {
	    	lblNoData[key] = style[key];
	    }
    }
    return lblNoData;
};

UI.createErrorView = function(errorText, clickCallback, style) {
	var errorViewContainer = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
        type: 'noDataLabel'
	});
	if(style) {
		for(var key in style) {
			errorViewContainer[key] = style[key];
		}
	}
	var errorView = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: Ti.UI.SIZE,
		layout: 'vertical'
	});
	var lblErrorText = Ti.UI.createLabel({
		text: (errorText ? errorText : 'An error occured while fetching data.') + '\nPlease try again after some time.',
		font: {
            fontSize: UI.fontSize(12),
            fontFamily: constant.FONT.DEFAULT_FONT
        },
        color: '#828282',
        textAlign: 'center'
	});
	var btnRefresh = UI.createButton({
		title: 'Refresh',
		width: UI.width(100),
        height: UI.height(50),
        font: {
            fontSize: UI.fontSize(14),
            fontFamily: constant.FONT.ABEATBYKAI
        },
        color: '#ef4e6d'
	});
	errorView.add(lblErrorText);
	errorView.add(btnRefresh);
	errorViewContainer.add(errorView);
	if(Utils._.isFunction(clickCallback)) {
		btnRefresh.addEventListener('click', function() {
			clickCallback();
		});
	}
	return errorViewContainer;
};

UI.createImageWithTextView = function(style) {
	var containerView = Ti.UI.createView({
    	width: style.width,
    	height: style.height
	});
	if(style.image != undefined) {
		var imageView = Ti.UI.createImageView({
			defaultImage: style.defaultImage ? style.defaultImage : '',
			image: style.image,
			width: style.width,
    		height: style.height
		});
	}
	if(style.type != 'sold') {
		var overlayView = Ti.UI.createView({
	    	backgroundColor: '#000',
	    	bottom: UI.bottom(20),
	    	width: Ti.UI.FILL,
	    	height: UI.height(30), // Ti.UI.FILL,
	        opacity: 0.50
		});
	}
	var square = Ti.UI.createView({
		right: 0,
		bottom: 0,
		width: UI.width(100),
		height: UI.height(100)
	});
	var label = Ti.UI.createLabel({
		width: Ti.UI.FILL,
    	height: UI.height(30),
		font: {
            fontSize: UI.fontSize(16),
            fontFamily: constant.FONT.DEFAULT_FONT,
            fontWeight: 'bold'
        },
        color: '#fff',
        textAlign: 'center',
    });
    switch(style.type) {
    	case 'sold':
    		label.width = UI.width(150);
	    	label.text = 'SOLD';
	    	label.backgroundColor = '#ef4e6d';
	    	// label.right = UI.right(-30);
	    	// label.bottom = UI.bottom(10);
	    	label.right = UI.right(-40);
	    	label.bottom = UI.bottom(20);
	    	label.transform = Ti.UI.create2DMatrix().rotate(-45);
	    	square.add(label);
    	break;
    	case 'pending kyc':
    		overlayView.height = UI.height(50),
    		label.height = UI.height(50);
    		label.text = 'Pending Bank Details';
	    	label.backgroundColor = 'transparent';
	    	label.bottom = UI.bottom(20);
    	break;
    	case 'de-listed':
    		label.text = 'DE-LISTED';
	    	label.backgroundColor = 'transparent';
	    	label.bottom = UI.bottom(20);
    	break;
    	case 'pending approval':
    		label.text = 'Pending Approval';
	    	label.backgroundColor = 'transparent';
	    	label.bottom = UI.bottom(20);
    	break;
    }
    if(style.image != undefined) {
    	containerView.add(imageView);
    }
    if(style.type != 'sold') {
    	containerView.add(overlayView);
    	containerView.add(label);
    }
    else {
    	containerView.add(square);
    }
    return containerView;
};


UI.createRoundedImageView = function(style) {
	if(osname == 'android') {
		var view = Ti.UI.createView(style);
		var imageView = Ti.UI.createImageView({
			width: Ti.UI.FILL,
			height: Ti.UI.FILL
		});
		if(style.image) {
			imageView.image = style.image;
		}
		if(style.defaultImage) {
			imageView.defaultImage = style.defaultImage;
		}
		var whiteLayer = Ti.UI.createImageView({
			image: '/images/common/transparent-circle.png',
			width: Ti.UI.FILL,
			height: Ti.UI.FILL
		});
		view.add(imageView);
		view.add(whiteLayer);
	}
	else {
		var view = Ti.UI.createImageView(style);
	}
	view.setImage = function(image) {
		if(osname == 'android') {
			imageView.image = image;
		}
		else {
			view.image = image;
		}
	};
	view.getImage = function() {
		if(osname == 'android') {
			return imageView.image;
		}
		else {
			return view.image;
		}
	};
	return view;
};


UI.createScrollView = function(config) {
	var view = Ti.UI.createScrollView(config.style);
	var _scrollToBottomCallback = config.onScrolledToBottom;
	var _isLazyLoadingEnabled = true;
	var _isScrolledToBottomTimeout;
	
	var _fireRefresh = false, _currentY;
	
	var _lastYPosition;
	var _lastViewIndexCleared = 0;
	var _indexesCleared = [];
	var _scrollTimeout;
	
	view.addEventListener('scroll', function(e) {
		if(_isLazyLoadingEnabled && _scrollToBottomCallback && Utils._.isFunction(_scrollToBottomCallback)) {
			try {
				if(_isScrolledToBottomTimeout) {
					return;
				}
				var lastChild = this.children[this.children.length - 1];
				var _lastChildPoint = lastChild.convertPointToView({x: 0, y: lastChild.top != undefined ? lastChild.top : 0 }, this);
				if(lastChild.type != 'noDataLabel' && parseInt(this.rect.height) + (lastChild.top != undefined ? parseInt(lastChild.top) : 0) == parseInt((_lastChildPoint.y + lastChild.rect.height + (lastChild.bottom != undefined ? lastChild.bottom : 0)))) {
					_scrollToBottomCallback();
					_isScrolledToBottomTimeout = setTimeout(function() {
						clearTimeout(_isScrolledToBottomTimeout);
						_isScrolledToBottomTimeout = undefined;
					}, 1000);
				}
			}
			catch(e){ }
		}
	});
	
	return view;
};

UI.openingModal = false;

UI.showModal = function(windowTitle,view){
    if(UI.openingModal) return;
    UI.openingModal = true;

    if(!windowTitle){
        windowTitle = "Modal Message";
    }
    var backGroundColor = '#27292e', textColor = '#ef4e6d'; 

    var rootContainer = Ti.UI.createView({
        width: pwidth,
        height: pheight,
        opacity: 0
    });

    var backDrop = Ti.UI.createView({
        top: UI.top(0),
        width: pwidth,
        height: pheight,
        backgroundColor: '#000',
        opacity: 0.5
        // layout: 'vertical'
    });

    var modalWindow = Ti.UI.createView({
        top: UI.top(60),
        width: pwidth * 0.9,
        height: pheight * 0.8,
        // titleImage: '',
        // title: windowTitle,
        backgroundColor : '#ffffff',
        borderRadius: 20,
        layout: 'composite'
    });

    var headerView = Ti.UI.createView({
        top: UI.top(0),
        width: Ti.UI.FILL,
        height: UI.height(40),
        textAlign: 'center',
        backgroundColor: backGroundColor,
    });

    var header = Ti.UI.createLabel({
        text: windowTitle,
        width: Ti.UI.SIZE,
        font: {
            fontSize: UI.fontSize(20),
            fontFamily: constant.FONT.ABEATBYKAI,
            fontWeight: 'bold'
        },
        color: textColor
    });

    headerView.add(header);

    var containerView  = Ti.UI.createView({  // Set height appropriately
        top: UI.top(60),
        height: Ti.UI.SIZE,
        backgroundColor: '#FFF',
        layout: 'vertical'
    });

    var closeButton = Ti.UI.createLabel({
        text: 'GOT IT',
        // backgroundColor: backGroundColor,
        color: textColor,
        bottom: 0,
        font: {
            fontSize: UI.fontSize(16),
            fontFamily: constant.FONT.ABEATBYKAI
        }
        // borderRadius: 20
    });

    var closeButonView = Ti.UI.createView({
        height: Ti.UI.SIZE,
        bottom: UI.bottom(10)
    });

    var hideWindow = function(){

        rootContainer.remove(backDrop);
        rootContainer.remove(modalWindow);

        rootContainer.hide();
        Window.getCurrentWindow().remove(rootContainer);
        
        headerView = null;
        rootContainer = null;
        backDrop = null;
        modalWindow = null;
        containerView = null;
        closeButton = null;
        closeButonView = null;

        UI.openingModal = false;
    };

    closeButton.addEventListener('click', hideWindow);

    // if(osname == 'android') {
    //     rootContainer.addEventListener('android:back', hideWindow);
    // }

    closeButonView.add(closeButton);
    
    // containerView.add(headerView);
    containerView.add(view);
    // containerView.add(closeButonView);

    modalWindow.add(headerView);
    modalWindow.add(containerView);
    modalWindow.add(closeButonView);

    rootContainer.add(backDrop);
    rootContainer.add(modalWindow);

    Window.getCurrentWindow().add(rootContainer);

    // if(osname === 'iphone' || osname === 'ipad'){
    //     modalWindow.top = UI.top(40);
    //     // modalWindow.open();
    //     rootContainer.show();
    // }
    // else{
        // rootContainer.show();
        
        rootContainer.animate({
            opacity: 1,
            duration: 250
            // curve: Ti.UI.ANIMATION_CURVE_EASE_IN
        }, function(e) {
            rootContainer.opacity = 1;
        });

        Ti.API.info(constant.APP + " opening the sizeChart view");

    // }
    
    UI.modalWindowOpen = true;
};

UI.fonts = {};

UI.fonts.DEFAULT_FONT = 'Verdana';


module.exports = UI;