var logContext = 'STYLFLEED-WEBVIEW';
// var Tifound = Ti != undefined ? true : false
var MAXITEMS = 5, DEFAULTIMAGE = 'images/default-shop-big.jpg';
var _markupBody = null, _feedProducts = null, _feedBrands = null, _feedUsers = null, _productImgs = null, _brandImgs = null, _userImgs = null;

Ti.API.info(logContext + " ###################### webview style feed init ##########################");

// var liEle = document.createElement('div');
var _attachProductImages = function(apiData){
	Ti.API.info(logContext + " ###################### _attachProductImages called #####################");
	var count = 0;
	for(var x = 0; count < MAXITEMS; x++){
		// Ti.API.info(logContext + " ####################### index: [" + x + "] #########################");
		// var arrEle = apiData[x];
		// for(var y in arrEle){
		// 	Ti.API.info(logContext + "           ########### key: [" + y + "] value: [" + arrEle[y] + "]");
		// }
		if(apiData[x].productId && apiData[x].productId !== '0' && apiData[x].photo){
			// var containerDiv = document.createElement('div');
			// containerDiv.classList.add('images');
			// containerDiv.setAttribute('id',apiData[x].productId);

			// var image = new Image();
			// image.src = apiData[x].photo;
			// containerDiv.appendChild(image);
			// _feedProducts.appendChild(containerDiv);

			_productImgs[count].parentElement.setAttribute('id',apiData[x].productId);
			_productImgs[count].src = apiData[x].photo;
			
			// var profileDiv = document.createElement('div');
			// profileDiv.classList.add('images');
			// profileDiv.setAttribute('id',apiData[x].userId);

			// var profileImage = new Image();
			// profileImage.src = apiData[x].profilePicURL;
			// profileDiv.appendChild(profileImage);
			// _feedUsers.appendChild(profileDiv);

			
			_userImgs[count].parentElement.setAttribute('id',apiData[x].userId);
			_userImgs[count].src = apiData[x].profilePicURL;

			count++;
		}
	}
	Ti.App.fireEvent('webViewStyleFeed:loadBrandApiData');
};

var _attachBrandImages = function(e){
	Ti.API.info(logContext + " ################### _attachBrandImages called ##################");
	var arrLength = e.brandData.length;
	
	for(var x = 0; x < MAXITEMS; x++){
		
		var index = Math.floor( Math.random() * arrLength ); //randomised brand index
		
		// var parentDiv = document.createElement('div');
		// parentDiv.classList.add('images');
		// parentDiv.setAttribute('id', e.brandData[index].id);

		// parentDiv.innerText = e.brandData[index].title;
		// _feedBrands.appendChild(parentDiv);

		_brandImgs[x].setAttribute('id',e.brandData[index].id);
		_brandImgs[x].innerText = e.brandData[index].title;
	}
	Ti.App.removeEventListener('app:brandApiDataFetched',_attachBrandImages);
};

var _httpCallCb = function(e){
	Ti.API.info(logContext + " ################## _httpCallCb called #############");
	var data = e.respArgs;
	_attachProductImages(data);	
	Ti.App.removeEventListener('app:stylefeedDataLoad',_httpCallCb);
};

// load the product page
var _feedProductClickHandler = function(e){
	Ti.API.info(logContext +  " _feedProductClickHandler clicked: target" + e.target.parentElement.id);
	var prId = e.target.parentElement.id;

	if(prId){
		Ti.App.fireEvent('webViewStyleFeed:loadProduct',{productId: prId});
	}
};

var _feedBrandClickHandler = function(e){
	Ti.API.info(logContext + " ########### target id [" + e.target.id + "]");
	var brandId = e.target.id;
	if(brandId){

		var _objFilter = {
	    		// sortBy: '',
	    		brands: brandId
	    		// categories: '',
	    		// subCategories: '',
	    		// sizes: '',
	    		// conditions: '',
	    		// priceRange: ''
	    	};

		Ti.App.fireEvent('onFooterTabSelect',{key: 'shop',objFilter: _objFilter});
	}
};

var _feedUserClickHandler = function(e){
	var usrId = e.target.parentElement.id;
	if(usrId){
		Ti.App.fireEvent('webViewStyleFeed:loadUser',{userId: usrId});
	}
};

onload = function(){
	Ti.API.info(logContext + " ############# webViewStyleFeed load complete ################");
	var _html = document.querySelector('html');
	_markupBody = document.querySelector('body');
	_feedProducts = document.querySelector('#feed-loved-products .feed-carousel-container');
	_feedBrands = document.querySelector('#feed-top-brands .feed-carousel-container');
	_feedUsers = document.querySelector('#feed-featured-users .feed-carousel-container');

	_productImgs = document.querySelectorAll('#feed-loved-products .feed-carousel-container .images img');
	_userImgs = document.querySelectorAll('#feed-featured-users .feed-carousel-container .images img');
	_brandImgs = document.querySelectorAll('#feed-top-brands .feed-carousel-container .images');
	// _html.style.height = window.innerHeight + 'px';
	// _html.style.width = window.innerWidth + 'px';

	_feedProducts.addEventListener('click',_feedProductClickHandler);
	_feedBrands.addEventListener('click',_feedBrandClickHandler);
	_feedUsers.addEventListener('click',_feedUserClickHandler);
	Ti.App.addEventListener('app:stylefeedDataLoad',_httpCallCb);
	Ti.App.addEventListener('app:brandApiDataFetched',_attachBrandImages);
	Ti.App.fireEvent('webViewStyleFeed:loadFeedData');

	for(var ix = 0; ix < MAXITEMS; ix++){
		_productImgs[ix].src = DEFAULTIMAGE;
		_userImgs[ix].src = DEFAULTIMAGE;
	}
}
