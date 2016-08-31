Ti.API.info(new Date + " ###################### webview style feed init ##########################");

// Ti.App.fireEvent('webViewStyleFeed:click',{viewClicked: 'clicked'});

var liEle = document.createElement('div');

var image1Handle = document.getElementById('image1');

image1Handle.addEventListener('click',function(){
	Ti.App.fireEvent('webViewStyleFeed:click',{productId: 2688});
});

var image2Handle = document.getElementById('image2');

image2Handle.addEventListener('click',function(){
	Ti.App.fireEvent('webViewStyleFeed:click',{productId: 2688});
});

var _httpCallCb = function(e){
	Ti.API.info(" ###################### app:styleFeedWebView listener called #####################");
	var data = e.respArgs;
	for(var x in data){
		var item = data[x];
		Ti.API.info(" key: " + x + " value: " + item);

		var pr = item && item.productId ? item.productId : undefined;
		if(pr){
			Ti.API.info("image id: " + pr);
		}
	}	
};

Ti.App.addEventListener('app:styleFeedWebView',_httpCallCb);