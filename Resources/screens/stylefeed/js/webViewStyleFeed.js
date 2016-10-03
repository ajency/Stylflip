var logContext = 'STYLFLEED-WEBVIEW';
// var Tifound = Ti != undefined ? true : false

Ti.API.info(logContext + " ###################### webview style feed init ##########################");

// var liEle = document.createElement('div');
var _markupBody = document.querySelector('body');
var _feedProducts = document.querySelector('#feed-products');
var _feedBrands = document.querySelector('#feed-brands');

var _attachProductImages = function(apiData){
	for(var x = 0; x < apiData.length; x++){
		if(apiData[x].productId && apiData[x].productId !== '0' && apiData[x].photo){
			var containerDiv = document.createElement('div');
			containerDiv.classList.add('images');
			containerDiv.setAttribute('id',apiData[x].productId);

			var image = new Image();
			image.src = apiData[x].photo;
			containerDiv.appendChild(image);
			_feedProducts.appendChild(containerDiv);
		}
	}
	_markupBody.setAttribute('style','display:block;');
};

var _attachBrandImages = function(){
	for(var x = 0; x < 5; x++){
		var parentDiv = document.createElement('div');
		parentDiv.classList.add('images');
		// parentDiv.setAttribute();

		var img = new Image();
		img.src = 'images/default-shop-big.jpg';
		parentDiv.appendChild(img);
		_feedBrands.appendChild(parentDiv);
	}
};

_attachBrandImages();

var _httpCallCb = function(e){
	var data = e.respArgs;
	_attachProductImages(data);	
};

var _feedProductClickHandler = function(e){
	Ti.API.info(logContext +  " _feedProductClickHandler clicked: target" + e.target.parentElement.id);
	var prId = e.target.parentElement.id;

	if(prId){
		Ti.App.fireEvent('webViewStyleFeed:loadProduct',{productId: prId});
	}
}

_feedProducts.addEventListener('click',_feedProductClickHandler);


Ti.App.addEventListener('app:styleFeedWebView',_httpCallCb);

