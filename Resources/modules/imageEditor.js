var openImageEditor = function(image, callback) {
	var _leftLimit = 0;
	var _croppingWidth = UI.platformWidth - (_leftLimit * 2);
	var _overlayViewHeight = (UI.platformHeight - _croppingWidth) / 2;
	var _startX, _startY, _endX, _endY, _leftBeforeMove, _topBeforeMove, _leftPos, _topPos, _scale = 1;
	var _isPinching = true, _tmpLeft, _tmpTop, _tmpWidth, _tmpHeight;	
	var _imageWidth = image.width, _imageHeight = image.height / (image.width / UI.platformWidth);
	var _baseWidth, _baseHeight;
	var _minWidth = _croppingWidth;
	var _minHeight = _imageHeight;
	var _maxWidth = _croppingWidth * 2;
	var _maxHeight = _imageHeight * 2;
	
	var cameraView = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		backgroundColor: '#000',
		layout: 'absolute',
		zIndex: 1000
    });
    
	var cameraImageView = Ti.UI.createImageView({
		left: 0,
		top: (UI.platformHeight  - _imageHeight) / 2,
		image: image,
		width: UI.platformWidth,
		height: _imageHeight
	});
	var topOverlayView = Ti.UI.createView({
		backgroundColor: '#000',
		top: 0,
		width: Ti.UI.FILL,
		height: _overlayViewHeight,
		opacity: 0.50
	});
	// var leftOverlayView = Ti.UI.createView({
		// backgroundColor: '#000',
		// left: 0,
		// top: _overlayViewHeight,
		// width: UI.width(20),
		// height: _croppingWidth,
		// opacity: 0.50
	// });
	var croppingView = Ti.UI.createView({
		backgroundColor: 'transparent',
		top: _overlayViewHeight,
		width: _croppingWidth,
		height: _croppingWidth,
		borderColor: '#fff',
		borderWidth: 1
	});
	var actualCroppingView = Ti.UI.createView({
		right: -(UI.platformWidth + 20),
		width: _croppingWidth,
		height: _croppingWidth
	});
	// var rightOverlayView = Ti.UI.createView({
		// backgroundColor: '#000',
		// right: 0,
		// top: _overlayViewHeight,
		// width: UI.width(20),
		// height: _croppingWidth,
		// opacity: 0.50
	// });
	var bottomOverlayView = Ti.UI.createView({
		backgroundColor: '#000',
		width: Ti.UI.FILL,
		top: croppingView.top + croppingView.height,
		height: _overlayViewHeight,
		opacity: 0.50
	});
	cameraView.add(cameraImageView);
	cameraView.add(topOverlayView);
	// cameraView.add(leftOverlayView);
	cameraView.add(croppingView);
	cameraView.add(actualCroppingView);
	// cameraView.add(rightOverlayView);
	cameraView.add(bottomOverlayView);
	
	
	var btnCancel = UI.createButton(Utils._.extend({}, _commonStyle.smallButtonBold, {
		backgroundColor: '#828282',
		color: '#000',
		title: '  CANCEL  ',
		left: UI.left(10),
		bottom: UI.bottom(15),
		borderColor: '#000000',
		borderWidth: 1,
		borderRadius: 2,
		viewParent: 'cameraView'
    }));
    var btnChoose = UI.createButton(Utils._.extend({}, _commonStyle.smallButtonBold, {
		backgroundColor: '#828282',
		color: '#000',
		// title: '  CHOOSE  ',
		title: '  CROP  ',
		right: UI.right(10),
		bottom: UI.bottom(15),
		borderColor: '#000000',
		borderWidth: 1,
		borderRadius: 2,
		viewParent: 'cameraView'
    }));
    cameraView.add(btnCancel);
	cameraView.add(btnChoose);
	
	
	/*
	 * Adjust position and size of image view
	 */
	croppingView.addEventListener('pinch', function(e) {
		_isPinching = true;
		_scale = e.scale;
		if(_scale > 4) {
			return;
		}
		cameraImageView.width = _baseWidth * _scale;
		cameraImageView.height = _baseHeight * _scale;
		cameraImageView.left = _leftBeforeMove - ((cameraImageView.width - _baseWidth) / 2);
		cameraImageView.top = _topBeforeMove - ((cameraImageView.height - _baseHeight) / 2);
	});
	
	
	/*
	 * 	Touch start
	 */
	croppingView.addEventListener('touchstart', function(e) {
		_startX = e.x;
		_startY = e.y;
		_leftBeforeMove = cameraImageView.left;
		_topBeforeMove = cameraImageView.top;
		_baseWidth = cameraImageView.width;
		_baseHeight = cameraImageView.height;
	});
	
	
	/*
	 * Position image view
	 */
	croppingView.addEventListener('touchmove', function(e) {
		if(_isPinching) {
			return;
		}
		_leftPos = _leftBeforeMove + (e.x - _startX);
		_topPos = _topBeforeMove + (e.y - _startY);
		
		if(osname == 'android') {
			cameraImageView.left = _leftPos;
			cameraImageView.top = _topPos;
		}
		else {
			cameraImageView.animate({
				left: _leftPos,
				top: _topPos
			});
		}
	});
	
	croppingView.addEventListener('touchend', function(e) {
		if(_isPinching) {
			_isPinching = false;
			if(cameraImageView.width > _maxWidth) {
				_leftBeforeMove = cameraImageView.left;
				_topBeforeMove = cameraImageView.top;
				_leftPos = _leftBeforeMove - ((_maxWidth - cameraImageView.width) / 2);
				_topPos = _topBeforeMove - ((_maxHeight - cameraImageView.height) / 2);
				
				cameraImageView.animate({
					left: _leftPos,
					top: _topPos,
					width: _maxWidth,
					height: _maxHeight,
					duration: 150
				}, function() {
					cameraImageView.left = _leftPos;
					cameraImageView.top = _topPos;
					cameraImageView.width = _maxWidth;
					cameraImageView.height = _maxHeight;
				});
				// cameraImageView.left = _leftBeforeMove - ((_maxWidth - cameraImageView.width) / 2);
				// cameraImageView.top = _topBeforeMove - ((_maxHeight - cameraImageView.height) / 2);
				// cameraImageView.width = _maxWidth;
				// cameraImageView.height = _maxHeight;
			}
			else if(cameraImageView.width < _minWidth) {
				cameraImageView.animate({
					left: 0,
					top: (UI.platformHeight  - _minHeight) / 2,
					width: _minWidth,
					height: _minHeight,
					duration: 150
				}, function() {
					cameraImageView.left = 0;
					cameraImageView.top = (UI.platformHeight  - _minHeight) / 2;
					cameraImageView.width = _minWidth;
					cameraImageView.height = _minHeight;
				});
			}
			else if(cameraImageView.height < _croppingWidth) {
				_topPos = (UI.platformHeight  - cameraImageView.height) / 2;
				if(_leftPos < -_leftLimit - (cameraImageView.width - _croppingWidth)) {
					_leftPos = -_leftLimit - (cameraImageView.width - _croppingWidth);
				}
				else if(_leftPos > _leftLimit) {
					_leftPos = _leftLimit;
				}
				cameraImageView.animate({
					left: _leftPos,
					top: _topPos,
					duration: 150
				}, function() {
					cameraImageView.left = _leftPos;
					cameraImageView.top = _topPos;
				});
				return;
			}
			else {
				_leftPos = cameraImageView.left;
				_topPos = cameraImageView.top;
				
				if(_leftPos < -_leftLimit - (cameraImageView.width - _croppingWidth) || _leftPos > _leftLimit || _topPos < (_overlayViewHeight + _croppingWidth) - cameraImageView.height || _topPos > _overlayViewHeight) {
					if(_leftPos < -_leftLimit - (cameraImageView.width - _croppingWidth)) {
						_leftPos = -_leftLimit - (cameraImageView.width - _croppingWidth);
					}
					else if(_leftPos > _leftLimit) {
						_leftPos = _leftLimit;
					}
					if(_topPos < (_overlayViewHeight + _croppingWidth) - cameraImageView.height) {
						_topPos = (_overlayViewHeight + _croppingWidth) - cameraImageView.height;
					}
					else if(_topPos > _overlayViewHeight) {
						_topPos = _overlayViewHeight;
					}
					cameraImageView.animate({
						left: _leftPos,
						top: _topPos,
						duration: 150
					}, function() {
						cameraImageView.left = _leftPos;
						cameraImageView.top = _topPos;
					});
				}
			}
			return;
		}
		
		if(cameraImageView.height < _croppingWidth) {
			_topPos = (UI.platformHeight  - cameraImageView.height) / 2;
			if(_leftPos < -_leftLimit - (cameraImageView.width - _croppingWidth)) {
				_leftPos = -_leftLimit - (cameraImageView.width - _croppingWidth);
			}
			else if(_leftPos > _leftLimit) {
				_leftPos = _leftLimit;
			}
			cameraImageView.animate({
				left: _leftPos,
				top: _topPos,
				duration: 150
			}, function() {
				cameraImageView.left = _leftPos;
				cameraImageView.top = _topPos;
			});
			return;
		}
		
		if(_isPinching) {
			_isPinching = false;
			return;
		}
		
		cameraImageView.left = _leftPos;
		cameraImageView.top = _topPos;
		
		if(_leftPos < -_leftLimit - (cameraImageView.width - _croppingWidth) || _leftPos > _leftLimit || _topPos < (_overlayViewHeight + _croppingWidth) - cameraImageView.height || _topPos > _overlayViewHeight) {
			if(_leftPos < -_leftLimit - (cameraImageView.width - _croppingWidth)) {
				_leftPos = -_leftLimit - (cameraImageView.width - _croppingWidth);
			}
			else if(_leftPos > _leftLimit) {
				_leftPos = _leftLimit;
			}
			if(_topPos < (_overlayViewHeight + _croppingWidth) - cameraImageView.height) {
				_topPos = (_overlayViewHeight + _croppingWidth) - cameraImageView.height;
			}
			else if(_topPos > _overlayViewHeight) {
				_topPos = _overlayViewHeight;
			}
			cameraImageView.animate({
				left: _leftPos,
				top: _topPos,
				duration: 250
			}, function() {
				cameraImageView.left = _leftPos;
				cameraImageView.top = _topPos;
			});
		}
	});
	

	var _removeFromMemory = function() {
		// btnChoose.removeEventListener('click', _btnChooseCb);
		// _btnChooseCb = null;
		// btnCancel.removeEventListener('click', _btnCancelCb);
		// _btnCancelCb = null;
		// _clearDebounce = null;
		_leftLimit = null;
		_croppingWidth = null;
		_overlayViewHeight = null;
		_startX = null;
		_startY = null;
		_endX = null;
		_endY = null;
		_leftBeforeMove = null;
		_topBeforeMove = null;
		_leftPos = null;
		_topPos = null;
		_scale = null;
		_isPinching = null;
		_tmpLeft = null;
		_tmpTop = null;
		_tmpWidth = null;
		_tmpHeight = null;	
		_imageWidth = null;
		_imageHeight = null;
		_baseWidth = null;
		_baseHeight = null;
		_minWidth = null;
		_minHeight = null;
		_maxWidth = null;
		_maxHeight = null;
		Window.getCurrentWindow().remove(cameraView);
		Window.getCurrentWindow().remove(rotateView);
		Window.clearMemory(cameraView);
		Window.clearMemory(rotateView);
		cameraView = null;
		rotateView = null;
	};
	
	/*
	 * Capture button click listener
	 */
	var debounceFlag = false;
	var _clearDebounce = function(){
		debounceFlag = false;
	};

	var _btnChooseCb = function() {
		if(debounceFlag) return;

		if(this.viewParent == 'cameraView') {
			Ti.API.info(constant.APP + " ################# capturing image ################");
			var croppedImageLeftPos = -(_leftLimit - cameraImageView.left);
			var croppedImageTopPos = -(_overlayViewHeight - cameraImageView.top);
			cameraView.remove(cameraImageView);
			cameraImageView.left = croppedImageLeftPos;
			cameraImageView.top = croppedImageTopPos;
			actualCroppingView.add(cameraImageView);
			// Ti.API.info(actualCroppingView.toImage());
			// callback({success: true, image: osname=='android'?actualCroppingView.toImage().media:actualCroppingView.toImage()});
			// _removeFromMemory();
			
			cameraView.remove(actualCroppingView);
			cameraView.remove(btnCancel);
			cameraView.remove(btnChoose);
			actualCroppingView.left = 0;
			actualCroppingView.top = 0;
			rotateImageViewContainer.add(actualCroppingView);
			rotateView.add(btnCancel);
			rotateView.add(btnChoose);
			
			btnCancel.viewParent = 'rotateView';
			btnChoose.viewParent = 'rotateView';
			
			// rotateImageView.image = osname=='android'?actualCroppingView.toImage().media:actualCroppingView.toImage();
			cameraView.visible = false;
			rotateView.visible = true;
			btnChoose.title = '  CHOOSE  ';
		}
		else {
			Ti.API.info(constant.APP + " ######################## attaching image #######################");
			// Ti.API.info(rotateImageViewContainer.toImage());
			callback({success: true, image: osname=='android'?rotateImageViewContainer.toImage().media:rotateImageViewContainer.toImage()});
			_removeFromMemory();
		}

		debounceFlag = true;
		setTimeout(_clearDebounce,1500);
	};

	Ti.API.info(constant.APP + " ############################ adding btnChoose listener ########################");
	btnChoose.addEventListener('click', _btnChooseCb);
	
	
	/*
	 * Close button click listener
	 */
	var _btnCancelCb = function() {
		_removeFromMemory();
	}; 

	Ti.API.info(constant.APP + " ############################ adding btnCancel listener ########################");
	btnCancel.addEventListener('click', _btnCancelCb);	
	
	var rotateView = Ti.UI.createView({
		backgroundColor: '#000',
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		zIndex: 999,
		visible: false
	});
	var rotateImageViewContainer = Ti.UI.createView({
		width: _croppingWidth, // Ti.UI.SIZE,
		height: _croppingWidth // Ti.UI.SIZE
	});
	// var rotateImageView = Ti.UI.createImageView({
	// });
	// rotateImageViewContainer.add(rotateImageView);
	var btnRotate = UI.createButton(Utils._.extend({}, _commonStyle.smallButtonBold, {
		backgroundColor: '#828282',
		color: '#000',
		title: '  ROTATE  ',
		bottom: UI.bottom(15),
		borderColor: '#4000000',
		borderWidth: 1,
		borderRadius: 2
    }));

	rotateView.add(rotateImageViewContainer);
    rotateView.add(btnRotate);
	
	var _angle = 0;
	
	btnRotate.addEventListener('click', function() {
		_angle = _angle + 90;
		actualCroppingView.animate({
			transform: Ti.UI.create2DMatrix().rotate(_angle),
			duration: 250
		});
	});
	
	Window.getCurrentWindow().add(cameraView);
	Window.getCurrentWindow().add(rotateView);
}; //end openImageEditor

/*
 * Success callback
 */

// the desired image widths
var successCallback = function(event, imageChangeCallBack, toBeEdited) {
	if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
        var eventImage = event.media;
        try {
        	var _eventWidth = event.media.width;
	        var _eventHeight = event.media.height;
	        
	        var _expWidth = 800;
	        var _expHeight = 800;
	        
	        var _resizeWidth, _resizeHeight;
	        
	        if(_eventWidth > _eventHeight) {
	            if(_eventWidth <= _expWidth) {
	                _resizeWidth = _eventWidth;
	            }                               
	            else if(_eventWidth > _expWidth) {
	                _resizeWidth = _expWidth;
	            }
	            else {
	                _resizeWidth = _eventWidth;
	            }
	            _resizeHeight = (_eventHeight*_resizeWidth)/_eventWidth;                                          
	        }
	        else {
	            if(_eventHeight <= _expHeight) {
	                _resizeHeight = _eventHeight;
	            }
	            else if(_eventHeight > _expHeight) {
	                _resizeHeight = _expHeight;
	            }
	            else {
	                _resizeHeight = _eventHeight;
	            }
	            _resizeWidth = (_eventWidth*_resizeHeight)/_eventHeight;                                          
	        }
	    	var photo = eventImage.imageAsResized(_resizeWidth, _resizeHeight);

	    	Ti.API.info(constant.APP + " ########################## openImageEditor photo ###########################");
	    	openImageEditor(photo, imageChangeCallBack);
	    	
        }
        catch(e) {
        	Ti.API.info(constant.APP + " ########################## openImageEditor eventImage ###########################");
        	openImageEditor(eventImage, imageChangeCallBack);
        }
	} 
	else {
		imageChangeCallBack({success: false, errorMessage: event.mediaType + ' is not supported'});
	}	
};


/*
 * Error callback
 */
var errorCallback = function(error, imageChangeCallBack) {
	if (error.code == Ti.Media.NO_CAMERA) {
    	imageChangeCallBack({success: false, errorMessage: 'Please run this application on device'});
	} 
	else if(error.code == 0) {
		imageChangeCallBack({success: false, errorMessage: 'Please insert sd card'});
	}
	else {
		imageChangeCallBack({success: false, errorMessage: 'Unexpected error: ' + error.code});        		
	}
};


exports.takePhoto = function(imageChangeCallBack) {
	Ti.Media.showCamera({
	// Ti.Media.openPhotoGallery({
        success: function(event) {
			successCallback(event, imageChangeCallBack, toBeEdited=true); 
        },
        cancel: function() {
            // imageChangeCallBack({success: false});
    	},
        error: function(error) {
        	errorCallback(error, imageChangeCallBack);
    	},
		saveToPhotoGallery: false,
	    allowEditing: false,
	    mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO]
	});	
}; 	


exports.browsePhotoGallery = function(imageChangeCallBack) {
	Ti.Media.openPhotoGallery({
        success: function(event) {
			successCallback(event, imageChangeCallBack); 
        },
        cancel: function() {
            // imageChangeCallBack({success: false});
    	},
        error: function(error) {
        	errorCallback(error, imageChangeCallBack);
    	},
		saveToPhotoGallery: false,
		allowEditing: false,
	    mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO]
	});	
}; 	