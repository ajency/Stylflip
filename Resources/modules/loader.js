// var Loader = {};
// 
// Loader.createView = function(message) {
	// var loaderView = Ti.UI.createView({
	    // backgroundColor: "transparent",
	    // //top: getTop(25),
	    // width: Ti.UI.FILL,
	    // height: Ti.UI.FILL,
	    // zIndex: 60
	// });
// 	
	// var loaderTransparentView = Ti.UI.createView({
		// backgroundColor: "#000",
		// width: Ti.UI.FILL,
		// height: Ti.UI.FILL,
		// opacity: 0.60
	// });
// 	
	// loaderView.add(loaderTransparentView);
// 	
	// var actIndicator = Ti.UI.createActivityIndicator({
		// message: ' '+(message?message:'Loading...'),
		// color: '#fff',
		// zIndex: 5
	// });
// 	
	// loaderView.add(actIndicator);
// 	
	// if(Ti.Platform.osname !== 'android') {
		// actIndicator.style = Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN;
	// }
// 	
	// actIndicator.show();
// 	
	// return loaderView;
// }
// 
// 
// var loaderView, loaderParent;
// 
// Loader.show = function(message) {
	// loaderParent = Window.getCurrentWindow();
	// loaderView = Loader.createView(message);
	// loaderParent.add(loaderView);
// };
// 
// Loader.hide = function() {
    // if(loaderView) {
    	// loaderParent.remove(loaderView);
    	// Window.clearMemory(loaderView);
    	// loaderView = null; 
    	// loaderParent = null;
    // }
// };
// 
// 
// module.exports = Loader;


var Loader = {}, _windowLastChild;

var loaderView = Ti.UI.createView({
    backgroundColor: "transparent",
    //top: getTop(25),
    width: Ti.UI.FILL,
    height: Ti.UI.FILL,
    zIndex: 50,
    type: 'Loader'
});

var loaderTransparentView = Ti.UI.createView({
	backgroundColor: "#000",
	width: Ti.UI.FILL,
	height: Ti.UI.FILL,
	opacity: 0.60
});

loaderView.add(loaderTransparentView);

var actIndicator = Ti.UI.createActivityIndicator({
	color: '#fff',
	zIndex: 5,
	font: {
	    fontSize: UI.fontSize(14),
	    fontFamily: constant.FONT.DEFAULT_FONT
	}
});

loaderView.add(actIndicator);

if(Ti.Platform.osname !== 'android') {
	actIndicator.style = Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN;
}

Loader.show = function(message, noScreenBlock) {
    if(noScreenBlock && osname != 'android') {
        loaderView.top = isIOS7Plus?UI.height(60):UI.height(40);
    }
    else {
        loaderView.top = 0;
    }
	Window.getCurrentWindow().add(loaderView);
	actIndicator.message = ' '+(message?message:'Loading...');
	actIndicator.show();
	Loader.visible = true;
};

Loader.hide = function() {
	actIndicator.hide();
	if(loaderView.getParent()) {
        Window.getCurrentWindow().remove(loaderView);	    
	}
	Loader.visible = false;
	try {
		_windowLastChild = Window.getCurrentWindow().children[Window.getCurrentWindow().children.length - 1];
		if(_windowLastChild.type == 'Loader') {
			Window.getCurrentWindow().remove(_windowLastChild);
		}
	}
	catch(e) {}
};


module.exports = Loader;
