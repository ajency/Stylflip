var payU = {};


payU.makePayment = function(config) {
	var _httpClient = Ti.Network.createHTTPClient();
	_httpClient.setTimeout = (60 * 2) * 1000; 		
	//	form 2 returns response in JSON
	_httpClient.open('POST', 'https://test.payu.in/merchant/postservice.php?form=2');
	_httpClient.open('POST', 'https://test.payu.in/_payment');
	// _httpClient.setRequestHeader("key", "value");
	_httpClient.send(Utils._.extend({}, config.requestArgs.serverArgs, {
		key: 'Ibibo',
		hash: 'ajh84ba8abvav',	//	sha512(key|command|var1|salt)
		var1: '8000123',
		var2: '7800456',
		var3: 'Amount'
    }));
	
  	// http onload method
	_httpClient.onload = function() {
		Utils._.isFunction(config.success) && config.success(this.responseText);
		this.httpClient = null;
	}; 
  	
  	// http onerror method
	_httpClient.onerror = function(e) {
		Utils._.isFunction(config.error) && config.error(e);
		this.httpClient = null;
	};
};

module.exports = payU;



/*
 page 36 - cod_settled
var1 Payu id (mihpayid) of transaction 8000123
var2 token ID(unique token from merchant) 7800456
var3 amount 500
*/