var logContext = 'STYLFLEED-WEBVIEW';
// var Tifound = Ti != undefined ? true : false
var MAXITEMS = 5, DEFAULTIMAGE = 'images/default-shop-big.jpg';
var _markupBody = null, _feedProducts = null, _feedBrands = null, _feedUsers = null, _feedPrice = null, _feedCondition = null, _feedCategories = null, _feedPriceImgs = null, 
_feedConditionImgs = null, _categoryImgs = null, _productImgs = null, _brandImgs = null, _userImgs = null, _socialRedirect = null, _shopRedirect = null;

Ti.API.info(logContext + " ###################### webview style feed init ##########################");

var randomizeIndex = function(length){
	return Math.floor( Math.random() * length );
};

var findId = function(target){
	var prnts = $(target).parentsUntil('.sec-scroll');
	for(var ix in prnts){
		if(prnts[ix].id){
			return prnts[ix].id;
		}
	}
	return null;
};

function doNothing(){

}

var enableFlags = {
	categoryClick: true,
	productClick: true,
	brandClick: true,
	userClick: true,
	// priceClick: true,
	// conditionClick: true
};

var enableFlagTimeout = function(flagType){

	var timeoutFunc = function(type){
		switch(type){
			case 'product': enableFlags.productClick = true;break;
			case 'user':  enableFlags.userClick = true;break;
			case 'category': enableFlags.categoryClick = true;break;
			case 'brand': enableFlags.brandClick = true;break;
		}
	}
	setTimeout(timeoutFunc,2000,flagType);
};

var _attachApiData = function(e){
	var section = e.stylefeedSection, arrLength, currentItem;
	switch(section){
		case 'category': {
			Ti.API.info(logContext + " ################### _attachCategoryImages called ##################");

			arrLength = e.collectionData.length;

			for(var x = 0; x < arrLength; x++){

				currentItem = e.collectionData[x];

				currentItem.parentCategoryId = currentItem.parentCategoryId ? currentItem.parentCategoryId : '';
				currentItem.categoryId = currentItem.categoryId ? currentItem.categoryId : '';

				if(currentItem.parentCategoryId || currentItem.categoryId){
					var catString = currentItem.parentCategoryId + '-' + currentItem.categoryId;
					$(_categoryImgs[x]).attr('id',catString);	
				}
	
				
				if(currentItem.categoryPhoto){
					_categoryImgs[x].style.backgroundImage = "url('" + currentItem.categoryPhoto + "')";
					// Ti.API.info(logContext +  " currentItem.categoryPhoto: " + currentItem.categoryPhoto);
				}
				
				if(currentItem.parentCategory){
					var catTitle = $(_categoryImgs[x]).find('.category-title');
					$(catTitle).html(currentItem.parentCategory);
				}
				
				if(currentItem.name){
					var catAdj = $(_categoryImgs[x]).find('.category-adj');
					$(catAdj).html(currentItem.name);
				}
			}

			Ti.App.fireEvent('app:loadBrandApiData');
		};break;
		case 'brand': {
			Ti.API.info(logContext + " ################### _attachBrandImages called ##################");
			arrLength = e.brandData.length;
			
			for(var x = 0; x < arrLength; x++){
				currentItem = e.brandData[x];

				if(currentItem.brandId){
					$(_brandImgs[x]).attr('id',currentItem.brandId);
				}		
				
				if(currentItem.brandPhoto){
					_brandImgs[x].style.backgroundImage = "url('" + currentItem.brandPhoto + "')";
				}
				

				if(currentItem.name){
					var brandTitle = $(_brandImgs[x]).find('.single-pick-brand-name span');
					$(brandTitle).html(currentItem.name);
				}
				
			}

			Ti.App.fireEvent('app:loadProductApiData');
		};break;
		case 'product':{
			Ti.API.info(logContext + " ################# _attachProductImages called #################");

			arrLength = e.productData.length;

			for(var x = 0; x < arrLength; x++){
				currentItem = e.productData[x];

				if(currentItem.productId){
					$(_productImgs[x]).attr('id',currentItem.productId);
				}
				
				if(currentItem.primaryPhoto){
					var prImg = $(_productImgs[x]).find('.img-full-100');
					prImg[0].src = currentItem.primaryPhoto;
					Ti.API.info(logContext + " product image: " + prImg[0].src);
				}

				if(currentItem.productTitle){
					var prTitle = $(_productImgs[x]).find('.shop-item-title');
					prTitle.html(currentItem.productTitle);
				}
				
				var prMeta = $(_productImgs[x]).find('.shop-item-meta');
				// var metaStr = "Other | ";
				var metaStr = "";
				if(currentItem.sizeChart){
					metaStr = metaStr + currentItem.sizeChart + " (UK)"
				}
				else if(currentItem.size){
					metaStr = metaStr + currentItem.size;
				}
				prMeta.html(metaStr);

				if(currentItem.discountPrice){
					var prPrice = $(_productImgs[x]).find('.shop-item-price');
					prPrice.html("<i class='fa fa-inr'></i> " + currentItem.discountPrice);
				}
			}

			Ti.App.fireEvent('app:loadUserApiData');
		};break;
		case 'user': {
			Ti.API.info(logContext + " ################### _attachUSerimages ####################");

			arrLength = e.userData.length;

			for(var x = 0; x < arrLength; x++){
				currentItem = e.userData[x];

				if(currentItem.userId){
					$(_userImgs[x]).attr('id',currentItem.userId);
				}
				
				if(currentItem.username){
					var userName = $(_userImgs[x]).find('.user-name');
					$(userName[0]).html(currentItem.username);
				}

				if(currentItem.state){
					var usrState = $(_userImgs[x]).find('.user-location');
					$(usrState[0]).html(currentItem.state);
				}

				if(currentItem.profilePicURL){
					var usrPic = $(_userImgs[x]).find('.user-img');
					// usrPic[0].style.backgroundImage = "url('" + currentItem.profilePicURL + "')";
					$(usrPic[0]).css('background-image',"url('" + currentItem.profilePicURL + "')");
					// Ti.API.info(logContext + " usrPic.style.backgroundImage: " + usrPic[0].style.backgroundImage);
				}
			}

			_removeEventHandlers();
		};break;
	}
}

var _httpCallCb = function(e){
	Ti.API.info(logContext + " ################## _httpCallCb called #############");
	var data = e.respArgs;
	_attachProductImages(data);	
	Ti.App.removeEventListener('webViewStyleFeed:stylefeedDataLoad',_httpCallCb);
};

var _feedProductClickHandler = function(e){
	if(!enableFlags.productClick) return;
	Ti.API.info(logContext +  " _feedProductClickHandler clicked: target: " + e.target);
	
	var prId = findId(e.target);
	if(prId){
		Ti.App.fireEvent('app:loadProduct',{productId: prId});
	}

	enableFlags.productClick = false;
	enableFlagTimeout('product');
};

var _feedBrandClickHandler = function(e){
	if(!enableFlags.brandClick) return;
	Ti.API.info(logContext + " _feedBrandClickHandler event [" + this.id + "]");

	brandId = this.id;	
	if(brandId){

		var _objFilter = {
	    		brands: [brandId]
	    	};

		Ti.App.fireEvent('onFooterTabSelect',{key: 'shop',objFilter: _objFilter});
	}

	enableFlags.brandClick = false;
	enableFlagTimeout('brand');
};

var _feedCategoryClickHandler = function(e){
	// Ti.API.info(logContext + " _feedCategoryClickHandler target id [" + e + "]");
	if(!enableFlags.categoryClick) return;
	var id = findId(e.target);
	Ti.API.info(logContext + " category id: " + id);

	var categoryIds = id.split('-');
	// var categoryId = e.target.id;
	
	if(categoryIds.length){

		var category = categoryIds[0] ? categoryIds[0] : '';
		var subCategory = categoryIds[1] ? categoryIds[1] : '';	

		var _objFilter = {
	    		categories: [category],
	    		// sortBy: '',
 	    		// brands: [brandId]
 	    		// categories: [categoryId]
 	    		subCategories: [subCategory]
 	    		// sizes: '',
 	    		// conditions: '',
 	    		// priceRange: [prID]
	    	};

		Ti.App.fireEvent('onFooterTabSelect',{key: 'shop',objFilter: _objFilter});
	}

	enableFlags.categoryClick = false;
	enableFlagTimeout('category');
};



var _feedUserClickHandler = function(e){
	if(!enableFlags.userClick) return;
	Ti.API.info(logContext + " _feedUserClickHandler target id [" + e.target + "]");
	
	var usrId = findId(e.target);;
	if(usrId){
		Ti.App.fireEvent('app:loadUser',{userId: usrId});
	}

	enableFlags.userClick = false;
	enableFlagTimeout('user');
};

// var _feedPriceClickHandler = function(e){
// 	var prID = e.target.id;
// 	if(prID){
// 		var _objFilter = {
// 	    		// sortBy: '',
// 	    		// brands: [brandId]
// 	    		// categories: [categoryId]
// 	    		// subCategories: '',
// 	    		// sizes: '',
// 	    		// conditions: '',
// 	    		priceRange: [prID]
// 	    	};

// 		Ti.App.fireEvent('onFooterTabSelect',{key: 'shop',objFilter: _objFilter});
// 	}
// };

// var _feedConditionClickHandler = function(e){
// 	var cndID = e.target.id;

// 	if(cndID){
// 		var _objFilter = {
// 	    		conditions: [cndID]
// 	    	};

// 		Ti.App.fireEvent('onFooterTabSelect',{key: 'shop',objFilter: _objFilter});
// 	}
// };

// var _attachPriceImages = function(e){
// 	for(var x = 0; x < e.priceFilters.length; x++){
// 		_feedPriceImgs[x].setAttribute('id',e.priceFilters[x].id);
// 		_feedPriceImgs[x].innerHTML = e.priceFilters[x].title;
// 	}
// 	Ti.App.removeEventListener('webViewStyleFeed:priceApiDataFetched',_attachPriceImages);
// };


// var _attachConditionImages = function(e){
// 	for(var x = 0; x < e.conditionFilters.length; x++){
// 		_feedConditionImgs[x].setAttribute('id',e.conditionFilters[x].id);
// 		_feedConditionImgs[x].innerHTML = e.conditionFilters[x].title;
// 	}
// 	Ti.App.removeEventListener('webViewStyleFeed:conditionApiDataFetched',_attachConditionImages);
// 	// Ti.App.fireEvent('app:loadComplete');
// };

var _socialRedirectClick = function(){
	Ti.App.fireEvent('onFooterTabSelect',{key: 'social'});
};

var _shopRedirectClick = function(){
	Ti.App.fireEvent('onFooterTabSelect',{key: 'shop', objFilter: {}});
};

var _removeEventHandlers = function(){
	Ti.App.removeEventListener('webViewStyleFeed:apiDataFetched',_attachApiData);
	Ti.App.removeEventListener('webViewStyleFeed:removeAllevents',_removeEventHandlers);
};

onload = function(){
	Ti.API.info(logContext + " ############# webViewStyleFeed load complete ################");

	_markupBody = document.querySelector('body');
	_markupBody.style.display = 'block';

	_feedCategories = document.querySelector('.sec-collection');
	_feedProducts = document.querySelector('.sec-popular');
	_feedBrands = document.querySelector('.sec-brand');
	_feedUsers = document.querySelector('.sec-topusers');
	_socialRedirect = document.querySelector('#goto-social');
	_shopRedirect = document.querySelector('#goto-shop');

	_categoryImgs = document.querySelectorAll('.sec-collection .category-scroll .single-pick');
	_brandImgs = document.querySelectorAll('.sec-brand .brand-scroll .single-pick');
	
	for(var ux = 0; ux < _brandImgs.length; ux++){
		_brandImgs[ux].addEventListener('click',_feedBrandClickHandler);
	}

	_productImgs = document.querySelectorAll('.sec-popular .sec-scroll .shop-item');
	_userImgs = document.querySelectorAll('.sec-topusers .sec-scroll .user-item');

	_feedCategories.addEventListener('click',_feedCategoryClickHandler);
	_feedProducts.addEventListener('click',_feedProductClickHandler);
	
	// _feedBrands.addEventListener('click',_feedBrandClickHandler);
	
	_feedUsers.addEventListener('click',_feedUserClickHandler);
	
	_socialRedirect.addEventListener('click',_socialRedirectClick);
	_shopRedirect.addEventListener('click',_shopRedirectClick);

	Ti.App.addEventListener('webViewStyleFeed:apiDataFetched',_attachApiData);
	Ti.App.addEventListener('webViewStyleFeed:removeAllevents',_removeEventHandlers);
	
	Ti.App.fireEvent('app:loadCategoryApiData');
};

onunload = function(){
	_feedCategories.removeEventListener('click',_feedCategoryClickHandler);
	
	// _feedBrands.removeEventListener('click',_feedBrandClickHandler);
	for(var ux = 0; ux < _brandImgs.length; ux++){
		_brandImgs[ux].removeEventListener('click',_feedBrandClickHandler);
	}

	_feedProducts.removeEventListener('click',_feedProductClickHandler);
	_feedUsers.removeEventListener('click',_feedUserClickHandler);
	
	// _feedPrice.removeEventListener('click',_feedPriceClickHandler);
	// _feedCondition.removeEventListener('click',_feedConditionClickHandler);

	_markupBody = _feedCategories = _feedProducts = _feedBrands = _feedUsers = _feedPrice = _feedCondition
	 = _categoryImgs = _productImgs = _userImgs = _brandImgs = _feedPriceImgs = _feedConditionImgs = null;

	_removeEventHandlers();
	Ti.API.info(logContext + " webViewStyleFeed sanitation complete");
};

// window.onresize = function(){
// 	Ti.API.info(logContext + " #################### webViewStyleFeed window resize complete #####################");

// };
