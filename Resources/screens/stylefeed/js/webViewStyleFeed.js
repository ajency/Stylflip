var logContext = 'STYLFLEED-WEBVIEW';
// var Tifound = Ti != undefined ? true : false
var MAXITEMS = 5, DEFAULTIMAGE = 'images/default-shop-big.jpg';
var _markupBody = null, _feedProducts = null, _feedBrands = null, _feedUsers = null, _feedPrice = null, _feedCondition = null, _feedCategories = null, _feedPriceImgs = null, 
_feedConditionImgs = null, _categoryImgs = null, _productImgs = null, _brandImgs = null, _userImgs = null, _socialRedirect = null, _shopRedirect = null;

Ti.API.info(logContext + " ###################### webview style feed init ##########################");

var randomizeIndex = function(length){
	return Math.floor( Math.random() * length );
};

var enableFlags = {
	// categoryClick: true,
	productClick: true,
	// brandClick: true,
	userClick: true,
	// priceClick: true,
	// conditionClick: true
};

var enableFlagTimeout = function(flagType){

	var timeoutFunc = function(type){
		switch(type){
			case 'product': enableFlags.productClick = true;break;
			case 'user':  enableFlags.userClick = true;break;
		}
	}
	setTimeout(timeoutFunc,2000,flagType);
};

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

			_productImgs[count].parentElement.setAttribute('id',apiData[x].productId);
			_productImgs[count].src = apiData[x].photo;
						
			_userImgs[count].parentElement.setAttribute('id',apiData[x].userId);
			_userImgs[count].src = apiData[x].profilePicURL;

			count++;
		}
	}
	Ti.App.fireEvent('app:loadBrandApiData');
};

var _attachBrandImages = function(e){
	Ti.API.info(logContext + " ################### _attachBrandImages called ##################");
	var arrLength = e.brandData.length;
	
	for(var x = 0; x < MAXITEMS; x++){
		
		var index = randomizeIndex(arrLength); //randomised brand index
		_brandImgs[x].setAttribute('id',e.brandData[index].id);
		_brandImgs[x].innerText = e.brandData[index].title;
	}
	Ti.App.removeEventListener('webViewStyleFeed:brandApiDataFetched',_attachBrandImages);
};

var _attachCategoryImages = function(e){
	Ti.API.info(logContext + " ################### _attachCategoryImages called ##################");

	var arrLength = e.categoryData.length;

	for(var x = 0; x < MAXITEMS; x++){
		var index = randomizeIndex(arrLength); //randomised brand index

		_categoryImgs[x].setAttribute('id',e.categoryData[index].id);
		_categoryImgs[x].innerText = e.categoryData[index].title;
	}
	Ti.App.removeEventListener('webViewStyleFeed:categoryApiDataFetched',_attachCategoryImages);
	Ti.App.fireEvent('app:loadFeedData');
};

var _httpCallCb = function(e){
	Ti.API.info(logContext + " ################## _httpCallCb called #############");
	var data = e.respArgs;
	_attachProductImages(data);	
	Ti.App.removeEventListener('webViewStyleFeed:stylefeedDataLoad',_httpCallCb);
};

var _feedProductClickHandler = function(e){
	Ti.API.info(logContext +  " _feedProductClickHandler clicked: target: " + e.target);
	// if(!enableFlags.productClick) return;

	// var prId = e.target.parentElement.id;

	// if(prId){
	// 	Ti.App.fireEvent('app:loadProduct',{productId: prId});
	// }
	// enableFlags.productClick = false;
	// enableFlagTimeout('product');
};

var _feedBrandClickHandler = function(e){
	Ti.API.info(logContext + " _feedBrandClickHandler target id [" + e.target + "]");
	// var brandId = e.target.id;
	// if(brandId){

	// 	var _objFilter = {
	//     		brands: [brandId]
	//     	};

	// 	Ti.App.fireEvent('onFooterTabSelect',{key: 'shop',objFilter: _objFilter});
	// }
};

var _feedCategoryClickHandler = function(e){
	Ti.API.info(logContext + " _feedCategoryClickHandler target id [" + e + "]");

	// var categoryId = e.target.id;
	// if(categoryId){
	// 	var _objFilter = {
	//     		categories: [categoryId]
	//     	};

	// 	Ti.App.fireEvent('onFooterTabSelect',{key: 'shop',objFilter: _objFilter});
	// }
};

var _feedUserClickHandler = function(e){
	Ti.API.info(logContext + " _feedUserClickHandler target id [" + e.target + "]");
	if(!enableFlags.userClick) return;
	var usrId = e.target.parentElement.id;
	if(usrId){
		Ti.App.fireEvent('app:loadUser',{userId: usrId});
	}

	enableFlags.userClick = false;
	enableFlagTimeout('user');
};

var _feedPriceClickHandler = function(e){
	var prID = e.target.id;
	if(prID){
		var _objFilter = {
	    		// sortBy: '',
	    		// brands: [brandId]
	    		// categories: [categoryId]
	    		// subCategories: '',
	    		// sizes: '',
	    		// conditions: '',
	    		priceRange: [prID]
	    	};

		Ti.App.fireEvent('onFooterTabSelect',{key: 'shop',objFilter: _objFilter});
	}
};

var _feedConditionClickHandler = function(e){
	var cndID = e.target.id;

	if(cndID){
		var _objFilter = {
	    		conditions: [cndID]
	    	};

		Ti.App.fireEvent('onFooterTabSelect',{key: 'shop',objFilter: _objFilter});
	}
};

var _attachPriceImages = function(e){
	for(var x = 0; x < e.priceFilters.length; x++){
		_feedPriceImgs[x].setAttribute('id',e.priceFilters[x].id);
		_feedPriceImgs[x].innerHTML = e.priceFilters[x].title;
	}
	Ti.App.removeEventListener('webViewStyleFeed:priceApiDataFetched',_attachPriceImages);
};


var _attachConditionImages = function(e){
	for(var x = 0; x < e.conditionFilters.length; x++){
		_feedConditionImgs[x].setAttribute('id',e.conditionFilters[x].id);
		_feedConditionImgs[x].innerHTML = e.conditionFilters[x].title;
	}
	Ti.App.removeEventListener('webViewStyleFeed:conditionApiDataFetched',_attachConditionImages);
	// Ti.App.fireEvent('app:loadComplete');
};

var _socialRedirectClick = function(){
	Ti.App.fireEvent('onFooterTabSelect',{key: 'social'});
};

var _shopRedirectClick = function(){
	Ti.App.fireEvent('onFooterTabSelect',{key: 'shop'});
};

onload = function(){
	Ti.API.info(logContext + " ############# webViewStyleFeed load complete ################");

	// var _html = document.querySelector('html');
	_markupBody = document.querySelector('body');
	_markupBody.style.display = 'block';
	// _feedCategories = document.querySelector('#feed-category .feed-carousel-container');
	// _feedProducts = document.querySelector('#feed-loved-products .feed-carousel-container');
	// _feedBrands = document.querySelector('#feed-top-brands .feed-carousel-container');
	// _feedUsers = document.querySelector('#feed-featured-users .feed-carousel-container');
	// _feedPrice = document.querySelector('#feed-price .feed-carousel-container');
	// _feedCondition = document.querySelector('#feed-condition .feed-carousel-container');

	_feedCategories = document.querySelector('.sec-collection');
	_feedProducts = document.querySelector('.sec-popular');
	_feedBrands = document.querySelector('.sec-brand');
	_feedUsers = document.querySelector('.sec-topusers');
	// Ti.API.info(logContext + " _feedCategories: " + _feedCategories + " _feedProducts: " + _feedProducts + " _feedBrands: " + _feedBrands + " _feedUsers: " + _feedUsers);	
	_socialRedirect = document.querySelector('#goto-social');
	_shopRedirect = document.querySelector('#goto-shop');

	// _feedPrice = document.querySelector('#feed-price .feed-carousel-container');
	// _feedCondition = document.querySelector('#feed-condition .feed-carousel-container');

	// // _categoryImgs = document.querySelectorAll('#feed-category .feed-carousel-container .images img');
	_categoryImgs = document.querySelectorAll('.sec-collection .category-scroll .single-pick');
	Ti.API.info(logContext + " _categoryImgs length: " + _categoryImgs);
	// _productImgs = document.querySelectorAll('.sec-popular');
	// _userImgs = document.querySelectorAll('#feed-featured-users .feed-carousel-container .images img');
	// _brandImgs = document.querySelectorAll('#feed-top-brands .feed-carousel-container .images');
	// // _feedPriceImgs = document.querySelectorAll('#feed-price .feed-carousel-container .images img');
	// _feedPriceImgs = document.querySelectorAll('#feed-price .feed-carousel-container .images');
	// // _feedConditionImgs = document.querySelectorAll('#feed-condition .feed-carousel-container .images img');
	// _feedConditionImgs = document.querySelectorAll('#feed-condition .feed-carousel-container .images');

	// // _markupBody.style.overflow = 'hidden';

	_feedCategories.addEventListener('click',_feedCategoryClickHandler);
	_feedProducts.addEventListener('click',_feedProductClickHandler);
	_feedBrands.addEventListener('click',_feedBrandClickHandler);
	_feedUsers.addEventListener('click',_feedUserClickHandler);
	_socialRedirect.addEventListener('click',_socialRedirectClick);
	_shopRedirect.addEventListener('click',_shopRedirectClick);

	// _feedPrice.addEventListener('click',_feedPriceClickHandler);
	// _feedCondition.addEventListener('click',_feedConditionClickHandler);
	// Ti.App.addEventListener('webViewStyleFeed:stylefeedDataLoad',_httpCallCb);
	// Ti.App.addEventListener('webViewStyleFeed:brandApiDataFetched',_attachBrandImages);
	// Ti.App.addEventListener('webViewStyleFeed:categoryApiDataFetched',_attachCategoryImages);
	// Ti.App.addEventListener('webViewStyleFeed:priceApiDataFetched',_attachPriceImages);
	// Ti.App.addEventListener('webViewStyleFeed:conditionApiDataFetched',_attachConditionImages);
	
	// Ti.App.fireEvent('app:loadCategoryApiData');

	for(var ix = 0; ix < MAXITEMS; ix++){
		if(_categoryImgs[ix]){
			_categoryImgs[ix].style.backgroundImage = "url('" + DEFAULTIMAGE + "')";
		}
		
		// _productImgs[ix].src = DEFAULTIMAGE;
		// _userImgs[ix].src = DEFAULTIMAGE;
		// _feedPriceImgs[ix].src = DEFAULTIMAGE;
		// _feedConditionImgs[ix].src = DEFAULTIMAGE;
	}
};

onunload = function(){
	_feedCategories.removeEventListener('click',_feedCategoryClickHandler);
	_feedProducts.removeEventListener('click',_feedProductClickHandler);
	_feedBrands.removeEventListener('click',_feedBrandClickHandler);
	_feedUsers.removeEventListener('click',_feedUserClickHandler);
	_feedPrice.removeEventListener('click',_feedPriceClickHandler);
	_feedCondition.removeEventListener('click',_feedConditionClickHandler);

	_markupBody = _feedCategories = _feedProducts = _feedBrands = _feedUsers = _feedPrice = _feedCondition
	 = _categoryImgs = _productImgs = _userImgs = _brandImgs = _feedPriceImgs = _feedConditionImgs = null;
};

// window.onresize = function(){
// 	Ti.API.info(logContext + " #################### webViewStyleFeed window resize complete #####################");

// };
