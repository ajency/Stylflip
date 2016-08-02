// exports.get = function(buttons, width, buttonClickCallback, selectedButtonStyle, unselectedButtonStyle, scrollable) {
exports.get = function(config) {
	var _style = require('/components/styles/buttonBar').get();
	
    var _arrButtons = [];
    var _buttonData = config.buttons;
    var _buttonWidth = 0;
    var _buttonBarWidth = config.width;
    
    var _selectedButtonIndex = -1;
    var _lastButtonClickedTitle;
    
    var _clickCallback;
    
    if(config.scrollable) {
    	 var buttonsView = Ti.UI.createScrollView(Utils._.extend({}, _style.buttonView, {
			width: _buttonBarWidth,
			contentWidth: 'auto',
			scrollType: 'horizontal',
			scrollingEnabled: false
	    }));
	    buttonsView.addEventListener('scroll', function(e) {
	    	if(e.x < _buttonWidth / 4) {
	    		buttonsView.scrollTo(_buttonWidth / 4, 0);
	    	}
	    });
    }
    else {
    	 var buttonsView = Ti.UI.createView(Utils._.extend({}, _style.buttonView, {
			width: _buttonBarWidth
	    }));
    }
    
    if(config.top != undefined) {
    	buttonsView.top = config.top;
    }
    if(config.backgroundColor != undefined) {
    	buttonsView.backgroundColor = config.backgroundColor;
    }
    
    
    if(config.buttons) {
    	_buttonWidth = config.scrollable ? (_buttonBarWidth / 2.5) : _buttonBarWidth / config.buttons.length;
    	
    	var scrollPosition = 0;
    	
    	if(config.scrollable) {
    		var tmpButtons = [];
    		tmpButtons.push({
    			title: '',
    			isDummy: true,
    			index: -1
    		});
    		for(var i=0; i<config.buttons.length; i++) {
    			config.buttons[i].index = i;
    			tmpButtons.push(config.buttons[i]);
    		}
    		tmpButtons.push({
    			title: '',
    			isDummy: true,
    			index: -1
    		});
    		config.buttons = tmpButtons;
    	}
    	
    	for(var i=0; i<config.buttons.length; i++) {
	    	var btn = UI.createButton(Utils._.extend({}, _style.button, {
				title: config.buttons[i].title,
				top: -1,
				left: 0,
				width: _buttonWidth,
				height: UI.height(30+2),
				key: config.buttons[i],
				borderColor: '#fff',
				borderWidth: 1,
				scrollPosition: scrollPosition
		    }));
		    
		    if(config.buttons[i].enabled != undefined && config.buttons[i].enabled == false) {
		    	btn.enabled = false;
		    	btn.touchEnabled = false;
		    	btn.opacity = 0.60;
		    }
		    
		    if(config.buttons[i].index == undefined) {
		    	btn.index = i;
		    }
		    else if(config.buttons[i].index == -1) {
		    	btn.index = -1;
		    }
		    else if(config.buttons[i].index > -1) {
		    	btn.index = config.buttons[i].index;
		    }
		    
		    // if(i > 0) {
		    	// btn.left = -1;
		    	// // btn.width = btn.width + 0.9;
		    // }
		    
		    if(config.scrollable) {
		    	if(i == 0) {
			    	scrollPosition += (_buttonWidth / 4);
			    }
			    else if(i == config.buttons.length - 2) {
			    	scrollPosition = (_buttonWidth * config.buttons.length) - _buttonBarWidth;
			    }
			    else {
			    	scrollPosition += _buttonWidth;
			    }
		    }
		    
		    buttonsView.add(btn);
		    _arrButtons.push(btn);
	    }
    }
    
    
    for(var i=0; i<_arrButtons.length; i++) {
		_arrButtons[i].addEventListener('click', function(e) {
			if(!Utils._.isFunction(_clickCallback)) {
				return;				
			}
			
			if(!config.selectable && (_lastButtonClickedTitle && _lastButtonClickedTitle == this.key.title) || this.index == -1) {
				return;
			}
			
			for(var i=0; i<_arrButtons.length; i++) {
				if(config.unselectedButtonStyle) {
					for(key in config.unselectedButtonStyle) {
						_arrButtons[i][key] = config.unselectedButtonStyle[key];
					}
				}
				else {
					_arrButtons[i].backgroundColor = 'transparent';
					_arrButtons[i].color = '#858585';
				}
			}
			
			// if(config.buttons[this.index].selectable == undefined || (config.buttons[this.index].selectable != undefined && config.buttons[this.index].selectable == true)) {
				if(config.selectedButtonStyle) {
					for(key in config.selectedButtonStyle) {
						this[key] = config.selectedButtonStyle[key];
					}
				}
				else {
					this.backgroundColor = '#ef4e6d';
					this.color = '#fff';
				}
			// }
			
			if(config.scrollable) {
				// if(this.index == 0) {
					// buttonsView.scrollTo(-(_buttonWidth / 1.4), 0);
				// }
				// else if(this.index == _arrButtons.length - 1) {
					// buttonsView.scrollTo(this.scrollPosition + (_buttonWidth / 1.3), 0);
				// }
				// else {
					buttonsView.scrollTo(this.scrollPosition, 0);
				// }
			}
			_lastButtonClickedTitle = this.key.title;
			_buttonData[this.index].triggered = e.triggered ? true : false;
			_buttonData[this.index].index = this.index;
			_clickCallback(Utils._.extend({}, _buttonData[this.index], {
				source: this
		    }));
		});
    
    	if(config.buttons[i].selected && !config.selectable) {
    		if(config.scrollable && osname == 'android') {
    			_selectedButtonIndex = i;
	    		setTimeout(function() {
	    			_arrButtons[_selectedButtonIndex].fireEvent('click');
	    		}, 500);
    		}
    		else {
    			if(osname == 'android') {
    				_selectedButtonIndex = i;
    				setTimeout(function() {
		    			_arrButtons[_selectedButtonIndex].fireEvent('click');
		    		}, 250);
    			}
    			else {
    				_arrButtons[i].fireEvent('click');
    			}
    		}
    	}
    	else if(config.buttons[i].selected && config.selectable){
    		if(config.selectedButtonStyle) {
				for(key in config.selectedButtonStyle) {
					_arrButtons[i][key] = config.selectedButtonStyle[key];
				}
			}
			else {
				_arrButtons[i].backgroundColor = '#ef4e6d';
				_arrButtons[i].color = '#fff';
			}
    	}
    }
    
    // setTimeout(function() {
    	// if(_selectedButtonIndex > -1) {
    		// _arrButtons[_selectedButtonIndex].fireEvent('click');
    	// }
	// }, 500);
	
	
	var _addEventListener = function(type, listener) {
		switch(type) {
			case 'click':
				_clickCallback = listener;
			break;
		}
	};
    
    
    var _selectButton = function(buttonIndex) {
    	for(var i=0; i<_arrButtons.length; i++) {
    		if(_arrButtons[i].index == buttonIndex) {
    			_arrButtons[i].fireEvent('click', {triggered: true});
    			// config.selectButtonCallback && Utils._.isFunction(config.selectButtonCallback) && config.selectButtonCallback()
    			break;
    		}
    	}
    };
    
    
    var _unselectButton = function(buttonIndex) {
    	for(var i=0; i<_arrButtons.length; i++) {
    		if(_arrButtons[i].index == buttonIndex) {
    			if(config.unselectedButtonStyle) {
					for(key in config.unselectedButtonStyle) {
						_arrButtons[i][key] = config.unselectedButtonStyle[key];
					}
				}
				else {
					_arrButtons[i].backgroundColor = 'transparent';
					_arrButtons[i].color = '#858585';
				}
				_lastButtonClickedTitle = undefined;
    			break;
    		}
    	}
    };
    
    
    var _setTop = function(top) {
        buttonsView.top = top?top:0;
    };
    
    
    var _setBackgroundColor = function(bgColor) {
    	if(bgColor) {
    		buttonsView.backgroundColor = bgColor;
    	}
    };
    
    
    var _getView = function() {
        return buttonsView;
    };
    
    var _removeFromMemory = function() {
    	_style = null;
    	config = null;
        Window.clearMemory(buttonsView);
        buttonsView = null;
        _addEventListener = null;
        _setTop = null;
        _setBackgroundColor = null;
        _getView = null;
        _selectButton = null;
        _unselectButton = null;
        _removeFromMemory = null;
    };
    
    return {
        getView: _getView,
        addEventListener: _addEventListener,
        selectButton: _selectButton,
        unselectButton: _unselectButton,
        setTop: _setTop,
        setBackgroundColor: _setBackgroundColor,
        removeFromMemory: _removeFromMemory,
    };
};

