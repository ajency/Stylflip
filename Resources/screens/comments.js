exports.get = function(id, type, editCallback) {
	Analytics.trackScreen({
		screenName: 'Comments'
	});
	
	var _style = require('/styles/stylefeed').get();
	
	var _pageIndex = 0;
	
	var mainView = Ti.UI.createView({
		height: constant.POP_UP_CONTENT_MAX_HEIGHT
	});
	
	var listView = require('/components/listView').get();
	listView.setTop(0);
	listView.setBottom(UI.height(60));
	
	listView.addEventListener('scrolledToBottom', function() {
		_loadComments();
	});
	
	var writeCommentView = Ti.UI.createView({
		bottom: 0,
        width: Ti.UI.FILL,
        height: UI.height(60)
	});
	var txtComment = UI.createTextField(Utils._.extend({}, _commonStyle.txtField, {
		left: 0,
		right: UI.right(50),
        height: Ti.UI.FILL,
        hintText: 'Write a comment...',
        textAlign: 'left',
        borderColor: '#ebebeb',
        borderWidth: 1,
        maxLength: 100,
        type: 'textArea'
    }));
    var btnSendComment = UI.createButton(Utils._.extend({}, _commonStyle.smallButton, {
        title: 'SEND',
        right: UI.right(0),
        width: UI.width(50),
        height: Ti.UI.FILL
    }));
    writeCommentView.add(txtComment);
    writeCommentView.add(btnSendComment);
    
    mainView.add(listView.getView());
    mainView.add(writeCommentView);
    
    
    btnSendComment.addEventListener('click', function() {
    	if(txtComment.value.trim() == '' || txtComment.value == txtComment.hintText) {
    		txtComment.focus();
    		return;
    	}
    	txtComment.blur();
		var _requestArgs = {
            showLoader: true,
            url: type=='feed'?'stylfeed.php':'product.php',
            method: 'post',
            serverArgs: {
            	action: 'comment',
                userId: Utils.loggedInUserId(),
				comment: txtComment.value.trim()	                
            }
        };
        
        if(type == 'feed') {
        	_requestArgs.serverArgs.feedId = id;
        }
        else {
        	_requestArgs.serverArgs.productId = id;
        }
        
        /*
         * Get feed/product comments
         */
        HttpClient.getResponse({
        	requestArgs: _requestArgs,
        	success: function(response) {
        		Utils._.isFunction(editCallback) && editCallback({type: 'add'});
        		return;
        		var _data = {
        			userId: Utils.loggedInUserId(),
        			feedId: id,
        			username: '',
        			comment: txtComment.value.trim(),
        			timestamp: 'Just now'
        		};
	            listView.appendRow(_createCommentView(_data));
	            txtComment.value = '';
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
	
	
	/*
	 * List view load listener
	 */
	listView.addEventListener('load', function(e) {
		
	});
	
	
	
	var _createCommentView = function(data) {
		var commentRow = Ti.UI.createView(Utils._.extend({}, _style.feedRow, {
			top: UI.top(5),
			height: Ti.UI.SIZE,
			layout: ''
	    }));
		var imgProfilePic = Ti.UI.createImageView(Utils._.extend({}, _style.imgProfilePic, {
			image: Utils.getProfileImageURL(data.profilePicURL),
			top: UI.top(5),
			userId: data.userId?data.userId:undefined
	    }));
	    var commentView = Ti.UI.createView({
	    	top: 0,
	    	left: UI.left(50),
	    	right: UI.right(10),
	    	height: Ti.UI.SIZE,
	    	layout: 'vertical'
	    });
	    var lblUsername = Ti.UI.createLabel(Utils._.extend({}, _style.lblUsername, {
			text: data.username, // data.userId==Utils.loggedInUserId()?'Me':(data.firstName+' '+data.lastName), // data.username?data.username:'Anonymous',
			left: 0,
			right: 0,
			top: 0,
			width: Ti.UI.FILL
	    }));
	    var lblStatus = Ti.UI.createLabel(Utils._.extend({}, _style.lblLikesLabel, {
			text: data.comment,
			left: 0,
			right: 0,
			height: Ti.UI.SIZE
	    }));
		var lblTimeAndLocation = Ti.UI.createLabel(Utils._.extend({}, _style.lblTimeAndLocation, {
			text: data.timestamp,
			left: 0,
			right: 0,
			top: UI.top(5),
			bottom: UI.bottom(5),
			height: Ti.UI.SIZE,
			borderColor: '#fff',
			borderWidth: 0
	    }));
	    commentView.add(lblUsername);
	    commentView.add(lblStatus);
	    commentView.add(lblTimeAndLocation);
	    
	    commentRow.add(imgProfilePic);
	    commentRow.add(commentView);	
	    
	    return commentRow;	
	};
	
	
	/*
	 * Load feed/product comments from the server
	 */
	var _loadComments = function(isRefresh) {
		if(isRefresh) {
			_pageIndex = 0;
		}
		
		var _requestArgs = {
            showLoader: true,
            url: type=='feed'?'stylfeed.php':'product.php',
            method: 'post',
            serverArgs: {
            	action: 'viewComments',
                userId: Utils.loggedInUserId(),
				pageIndex: _pageIndex
            }
        };
        
        if(type == 'feed') {
        	_requestArgs.serverArgs.feedId = id;
        }
        else {
        	_requestArgs.serverArgs.productId = id;
        }
        
        /*
         * Get feed/product comments
         */
        HttpClient.getResponse({
        	requestArgs: _requestArgs,
        	success: function(response) {
	            var _commentsData = response.data;
	            var _listData = [];
	            
	            if(_commentsData.length == 0 && _pageIndex == 0) {
            		listView.setData([UI.createNoDataView()], false);
            		return;
            	}
	            
				for(var i=0; i<_commentsData.length; i++) {
					_listData.push(_createCommentView(_commentsData[i]));
				}
				
				if(isRefresh) {
					listView.setData(_listData);
				}
				else {
					listView.appendData(_listData);
				}
				
				if(_commentsData.length > 0) {
					_pageIndex++;
					listView.showLazyLoadingRow();
				}
				else {
					listView.hideLazyLoadingRow();
				}
        	},
        	error: function(error) {
                if(isRefresh) {
        			listView.setData([UI.createErrorView(error.errorMessage, function() {
	               		_loadComments(true);
	               	})], false);
        		}
        		else {
        			UI.showAlert(error.errorMessage);
        		}
                setTimeout(function() {
                	if(_pageIndex > 0) {
	                	listView.showLazyLoadingRow();
	                }
                }, 500);
        	}
        }); 
	};
	
	
	
    var _getView = function() {
    	setTimeout(function() {
    		_loadComments(true);
    	}, 500);
        return mainView;
    };
    
    var _removeFromMemory = function() {
    	_style = null;
    	Window.clearMemory(mainView);
    	mainView = null;
        listView = null;
        _getView = null;
        _removeFromMemory = null;
    };
    
    return {
        getView: _getView,
        removeFromMemory: _removeFromMemory
    };
};
