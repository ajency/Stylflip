exports.get = function(arrButtons, buttonViewStyle, selectedButtonStyle, unselectedButtonStyle, clickCallback) {
	var buttonView = Ti.UI.createView(buttonViewStyle);
    var _arrButtons = [];
    var _lastButtonSelectedIndex = -1;
    
    for(var i=0; i<arrButtons.length; i++) {
    	var button = UI.createButton(Utils._.extend({}, unselectedButtonStyle, {
	        title: arrButtons[i].title,
	        index: i,
	        data: arrButtons[i]
	    }));
	    _arrButtons.push(button);
	    buttonView.add(button);
	    
	    
	    button.addEventListener('click', function() {
	    	if(_lastButtonSelectedIndex > -1) {
	    		if(unselectedButtonStyle) {
					for(key in unselectedButtonStyle) {
						_arrButtons[_lastButtonSelectedIndex][key] = unselectedButtonStyle[key];
					}
				}
				else {
					_arrButtons[_lastButtonSelectedIndex].font = _commonStyle.smallButton.font;
    				_arrButtons[_lastButtonSelectedIndex].color = '#999';
				}
    		}
    		
    		if(selectedButtonStyle) {
				for(key in selectedButtonStyle) {
					this[key] = selectedButtonStyle[key];
				}
			}
			else {
				this.color = '#000';
	    		this.font = {
	                fontSize: UI.fontSize(14),
	                fontFamily: constant.FONT.DEFAULT_FONT,
	                fontWeight: 'bold'
	            };
			}
    		
    		_lastButtonSelectedIndex = this.index;
    		
    		Utils._.isFunction(clickCallback) && clickCallback({buttonData: this.data});
	    });
    }
    
    
    var _getView = function() {
        return buttonView;
    };
    
    var _removeFromMemory = function() {
    	_style = null;
        Window.clearMemory(buttonView);
        buttonView = null;
        _getView = null;
        _removeFromMemory = null;
    };
    
    return {
        getView: _getView,
        removeFromMemory: _removeFromMemory
    };
};

