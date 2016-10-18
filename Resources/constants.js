var statusBarHeight = 0;
var windowTopPos = 0;
var topMargin = 0;
var pwidth = Ti.Platform.displayCaps.platformWidth;
var pheight = Ti.Platform.displayCaps.platformHeight;
var headerHeight = (pwidth * 45) / 320;
var footerHeight = (pwidth * 50) / 320;

if(osname == 'iphone' || osname == 'ipad') {
	if(isIOS7Plus) {
		headerHeight = (pwidth * 65) / 320;
		topMargin = (pwidth * 20) / 320;
	}
	else {
		windowTopPos = (pwidth * 20) / 320;
	}
}
else {
	windowTopPos = (Math.round((25 * Titanium.Platform.displayCaps.dpi)/160));
}

exports.get = function() {
	return {

		// DOMAIN: 'http://54.69.190.92/stylflip/',
		// BASE_URL: 'http://54.69.190.92/stylflip/api/',

		DOMAIN: 'http://139.162.29.106/styleflip.ajency.in/',
		BASE_URL: 'http://139.162.29.106/styleflip.ajency.in/api/',

		// DOMAIN: 'http://54.149.49.29/stylflip/',
		// BASE_URL: 'http://54.149.49.29/stylflip/api/',
		
		// DOMAIN: 'http://localhost/sf/server/',
		// BASE_URL: 'http://localhost/sf/server/api/',
		
		// DOMAIN: 'http://stylflip.com/stylflip/',
		// BASE_URL: 'http://stylflip.com/stylflip/api/',
		
		APP: 'STYLFLIP',
		RATEAPPLIMIT: 5,
		HEADER_HEIGHT: headerHeight,
		FOOTER_HEIGHT: footerHeight,
		FOOTER_TOP: (pheight - footerHeight) - windowTopPos,
		CONTENT_HEIGHT: (pheight - windowTopPos) - (headerHeight + footerHeight),	//	footer + header
		CONTENT_HEIGHT_WO_FOOTER: (pheight - windowTopPos) - (headerHeight),
		WINDOW_HEIGHT: (pheight - windowTopPos) - topMargin,
		POP_UP_CONTENT_MAX_HEIGHT: ((pheight - windowTopPos) - ((pwidth * 45) / 320)) - topMargin,
		TOP_MARGIN: topMargin,
		CONDITION_FILTERS: [
			{id: 'Brand new with tags', title: 'Brand new with tags'}, 
			{id: 'New without tags', title: 'New without tags'}, 
			{id: 'Barely Worn (once or twice)', title: 'Barely Worn (once or twice)'}, 
			{id: 'Gently Used', title: 'Gently Used'}
		],
		PRICE_FILTERS: [
			{id: 'Less than 500', title: 'Less than \u20B9 500'}, 
			{id: '500 - 1000', title: '\u20B9 500 - \u20B9 1000'}, 
			{id: '1000 - 2000', title: '\u20B9 1000 - \u20B9 2000'}, 
			{id: '2000 - 3000', title: '\u20B9 2000 - \u20B9 3000'}, 
			{id: '3000 - 4000', title: '\u20B9 3000 - \u20B9 4000'}, 
			{id: '4000 and above', title: '\u20B9 4000 and Above'}
		],
		FONT: {
			DEFAULT_FONT: 'Roboto',
			ABEATBYKAI: 'abeatbyKai'
		},
		DATABASE: '',
		TEXT: {
			HINT_EMAIL: 'email',
			HINT_PASSWORD: 'password',
			HINT_USERNAME: 'username',
			HINT_MOBILE_NUMBER: 'mobile no.',
			HINT_FIRST_NAME: 'first name',
			HINT_LAST_NAME: 'last name',
			HINT_CITY: 'city',
			HINT_FLAT_NO_BUILDING_NAME: 'flat no. & building name',
			HINT_STREET_NAME: 'street name',
			HINT_ADDRESS_1: 'address line 1',
			HINT_ADDRESS_2: 'address line 2',
			HINT_LANDMARK: 'landmark',
			HINT_STATE: 'state',
			HINT_POSTCODE: 'postcode',
			HINT_PHONE_NUMBER: 'phone no.',
			
			VERIFY_VIA: 'verify via',
			EMAIL: 'email',
			SMS: 'sms',
			STYL_PROFILE: 'STYL PROFILE',
			HOME_ADDRESS: 'HOME ADDRESS',
			HOME_ADDRESS_1: 'HOME ADDRESS 1',
			PICK_YOUR_SIZE: 'PICK YOUR SIZE',
			PROFILE_PRIVACY: 'Your size profile is never displayed to the public. This is used purely to enhance your newsfeed and Styl suggestions.',
			
			LOGIN: 'LOGIN',
			LOST_PASSWORD: 'lost password',
			FLIP: 'FLIP',
			GO: 'GO',
			I_AM_NEW_HERE: 'I\'M NEW HERE',
			JUST_BROWSING: 'JUST BROWSING',
			WINDOW_SHOP: 'WINDOW SHOP',
			CREATE: 'CREATE',
			FACEBOOK: 'facebook',
			GOOGLE_PLUS: 'google+',
			DATE_OF_BIRTH: 'date-of-birth',
			FAVORITE_BRANDS: 'favorite brands (select)',
			TOPS: 'tops',
			BOTTOMS: 'bottoms',
			SHOE: 'shoe',
			SAVE: 'SAVE',
			BRANDS: 'SELECT BRANDS',
			
			INVITE_TEXT: "Sell your closet, flaunt your style & get great deals on brands you crave. Join me & other flippers on StylFlip today! http://bit.ly/1nuTJw8",
			SHARE_TEXT: "Found an amazing deal on StylFlip. Join the community today to sell, flaunt & shop pre-owned fashion. Download the app http://bit.ly/1nuTJw8",
			
			INVITE_LINK: "http://bit.ly/1nuTJw8",
			SHARE_LINK: "http://bit.ly/1RTwoRF"
		},
		ALERT: {
			TITLE: {
				SIGNUP_SUCCESSFUL: 'Registration successful',
				SIGNUP_FAILED: 'Registration failed',
				SUCCESS: 'Success',
				ERROR: 'ERROR!',
				OOPS: 'OOPS!',
				WHOOPS: 'WHOOPS!',
				SORRY: 'SORRY!',
				
				FAUX_PAS: 'Faux Pas',
				FORGOT_PASSWORD: 'Forgot your Password?',
				RESET_PASSWORD: 'Reset Password',
				PASSWORD_RESET: 'Password Reset',
				HIDE_THIS_POST: 'Hide This Post',
				THANK_YOU: 'Thank You',
				CONGRATULATIONS: 'Congratulations',
				WARDROBE_MALFUNCTION: 'My Feed Malfunction',
				CONFIRM_REMOVAL: 'Confirm Removal',
				DANG_IT: 'Dang it',
				WHOOPSIE: 'Whoopsie',
				DAMN: 'Damn!',
				CONFIRM_DELETE: 'Confirm Delete',
				REMOVE_FROM_WANTS: 'Remove from WANTS?',
				ADDING_TO_WARDROBE: 'Adding to your Feed?',
				DAGNABBIT: 'Dagnabbit',
				WHOA: 'Whoa',
				DONE_SEARCHING: 'Done searching?',
				DONE_FILTERING: 'Done filtering?',
				ON_ACCESS_OF_FEATURE : 'On access of features',
				DE_CODING_FEE_POLICY: 'De-coding our Fee Policy',
				SIGN_UP: 'Sign Up'
			},
			MESSAGE: {
				INTERNET_CONNECTION: 'You appear to be offline!',
				SERVER_ERROR: 'Server error. Please try again or give us a shout.',
				SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
				GPS_OFF: 'Your device has GPS turned off. Please turn it on.',
				NO_DATA_AVAILABLE: 'No data available',
				
				INVALID_EMAIL_OR_PASSWORD: 'Invalid email or password',
				EMAIL_NOT_VERIFIED: 'Email address is not verified. Please click on the link provided in your email to verify your email address.',
				VERIFY_EMAIL_ADDRESS: 'Please click on the link provided in your email to verify your email address.',
				EMAIL_EXISTS: 'Sorry this email id has been taken. Please enter another one.',
				USER_NAME_EXISTS: 'Username already exists. Please enter another one.',
				PROFILE_PIC_SAVE_FAILED: 'Error updating profile pic',
				PROFILE_PIC_UPDATE_SUCCESS: 'Profile picture successfully updated',
				PROFILE_UPDATE_SUCCESS: 'Profile successfully updated',
				PROFILE_UPDATE_FAILED: 'Failed to update profile picture',
	
				EMAIL_REQUIRED: 'Please enter email address',
				USERNAME_REQUIRED: 'Please enter username',
				EMAIL_INVALID: 'Invalid email address',
				POSTCODE_INVALID: 'Invalid post code',
				
				MOBILE_NUMBER_REQUIRED: 'Please enter mobile number',
				MOBILE_NUMBER_INVALID: 'Please enter valid mobile number',
				PHONE_NUMBER_REQUIRED: 'Please enter phone number',
				PHONE_NUMBER_INVALID: 'Please enter valid phone number',
				PASSWORD_REQUIRED: 'Please enter password',
				SHORT_PASSWORD: 'Your password should be at least 6 characters long',
				CONFIRM_PASSWORD_REQUIRED: 'Please cofirm password',
				PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
				FIRST_NAME_REQUIRED: 'Please enter first name',
				LAST_NAME_REQUIRED: 'Please enter last name',
				CITY_REQUIRED: 'Please enter city',
				DATE_OF_BIRTH_REQUIRED: 'Please select date of birth',
				
				ACCOUNT_BLOCKED: 'Looks like your account has been temporarily deactivated. We\'ve sent you an email for further clarification.',
				
				SELL_FIELDS_REQUIRED: 'Please fill in all the required fields to finish posting.',
				SIGN_UP_REQUIRED: 'You need to sign up to access this.',
				
				GARMENTS: 'Some brands may vary in measurements but you can still use the above as a guide.\nLength of the garment will vary from style to style.',
				FOOTWEAR: 'Some brands may vary in measurements but you can still use the above as a guide.'
			}
		},
		PAGE_LIMIT: 20 - 10,
		
		SIZE_CHART: {
			// APPAREL_SIZE_CHART: {
				XS: { US: 6, UK: 2, EU: 34, BURST: 32, WAIST: 26, LOW_WAIST: 28, HIP: 34 },
				S: { US: 8, UK: 4, EU: 36, BURST: 34, WAIST: 27, LOW_WAIST: 30, HIP: 36 },
				M: { US: 10, UK: 6, EU: 38, BURST: 36, WAIST: 28, LOW_WAIST: 32, HIP: 38 },
				L: { US: 12, UK: 8, EU: 40, BURST: 38, WAIST: 29, LOW_WAIST: 34, HIP: 40 },
				XL: { US: 14, UK: 10, EU: 42, BURST: 40, WAIST: 30, LOW_WAIST: 36, HIP: 42 },
				XXL: { US: 16, UK: 12, EU: 44, BURST: 42, WAIST: 31, LOW_WAIST: 38, HIP: 44 },
				2: { US: 2, UK: 4, EU: 35, FOOT_LENGTH: 8 },
				3: { US: 3, UK: 5, EU: 36, FOOT_LENGTH: 8.5 },
				4: { US: 4, UK: 6, EU: 37, FOOT_LENGTH: 9.25 },
				5: { US: 5, UK: 7, EU: 38, FOOT_LENGTH: 9.5 },
				6: { US: 6, UK: 8, EU: 39, FOOT_LENGTH: 9.75 },
				7: { US: 7, UK: 9, EU: 40, FOOT_LENGTH: 10.25 },
				8: { US: 8, UK: 10, EU: 41, FOOT_LENGTH: 10.5 }
			/*},
			
			SHOE_SIZE_CHART:    {
				2: { US: 2, UK: 4, EU: 35, FOOT_LENGTH: 8 },
				3: { US: 3, UK: 5, EU: 36, FOOT_LENGTH: 8.5 },
				4: { US: 4, UK: 6, EU: 37, FOOT_LENGTH: 9.25 },
				5: { US: 5, UK: 7, EU: 38, FOOT_LENGTH: 9.5 },
				6: { US: 6, UK: 8, EU: 39, FOOT_LENGTH: 9.75 },
				7: { US: 7, UK: 9, EU: 40, FOOT_LENGTH: 10.25 },
				8: { US: 8, UK: 10, EU: 41, FOOT_LENGTH: 10.5 }
			}*/
		},
		SIZE_CHARTS: {
			A: {
				XS: { 
					primary: {
						UK: 6, US: 2, EU: 34
					},
					secondary: {
						BURST: 32, WAIST: 26, HIP: 34
					}
				},
				S: { 
					primary: {
						UK: 8, US: 4, EU: 36
					},
					secondary: {
						BURST: 34, WAIST: 27, HIP: 36
					}
				},	
				M: {
					primary: {
						UK: 10, US: 6, EU: 38
					},
					secondary: {
						BURST: 36, WAIST: 28, HIP: 38
					}
				},
				L: {
					primary: {
						UK: 12, US: 8, EU: 40
					},
					secondary: {
						BURST: 38, WAIST: 29, HIP: 40
					}
				},
				XL: {
					primary: {
						UK: 14, US: 10, EU: 42
					},
					secondary: {
						BURST: 40, WAIST: 30, HIP: 42
					}
				},
				XXL: {
					primary: {
						UK: 16, US: 12, EU: 44
					},
					secondary: {
						BURST: 42, WAIST: 31, HIP: 44
					}
				}
			},
			
			B: {
				XS: { 
					primary: {
						UK: 6, US: 2, EU: 34
					},
					secondary: {
						WAIST: 26, HIP: 34
					}
				},
				S: { 
					primary: {
						UK: 8, US: 4, EU: 36
					},
					secondary: {
						WAIST: 27, HIP: 36
					}
				},	
				M: {
					primary: {
						UK: 10, US: 6, EU: 38
					},
					secondary: {
						WAIST: 28, HIP: 38
					}
				},
				L: {
					primary: {
						UK: 12, US: 8, EU: 40
					},
					secondary: {
						WAIST: 29, HIP: 40
					}
				},
				XL: {
					primary: {
						UK: 14, US: 10, EU: 42
					},
					secondary: {
						WAIST: 30, HIP: 42
					}
				},
				XXL: {
					primary: {
						UK: 16, US: 12, EU: 44
					},
					secondary: {
						WAIST: 31, HIP: 44
					}
				}
			},
			
			C: { //shoes
				2: {
					primary: {
						UK: 2, US: 4, EU: 35
					},
					secondary: {
						FOOT_LENGTH: 8
					}
				},
				3: {
					primary: {
						UK: 3, US: 5, EU: 36
					},
					secondary: {
						FOOT_LENGTH: 8.5
					}
				},
				4: {
					primary: {
						UK: 4, US: 6, EU: 37
					},
					secondary: {
						FOOT_LENGTH: 9.25
					}
				},
				5: {
					primary: {
						UK: 5, US: 7, EU: 38
					},
					secondary: {
						FOOT_LENGTH: 9.5
					}
				},
				6: {
					primary: {
						UK: 6, US: 8, EU: 39
					},
					secondary: {
						FOOT_LENGTH: 9.75
					}
				},
				7: {
					primary: {
						UK: 7, US: 9, EU: 40
					},
					secondary: {
						FOOT_LENGTH: 10.25
					}
				},
				8: {
					primary: {
						UK: 8, US: 10, EU: 41
					},
					secondary: {
						FOOT_LENGTH: 10.5
					}
				},
				9: {
					primary: {
						UK: 9, US: 11, EU: 42
					},
					secondary: {
						FOOT_LENGTH: 11.25
					}
				}
			},
			
			D: { //accessories
				S: {},
				M: {},
				L: {},
				FREE: {}
			},
			
			E: { //bags
				HEIGHT: {},
				LENGTH: {}
			},
			
			F: {
				BURST: {},
				WAIST: {},
				HIP: {},
				LENGTH: {}
			}
		},
		
		SIZE_FULL_FORM: {
			XS: 'Xtra Small',
			S: 'Small',
			M: 'Medium',
			L: 'Large',
			XL: 'Xtra Large',
			XXL: 'Xtra Xtra Large',
			CUSTOM: 'Custom Size',
			BURST: 'Bust',
			WAIST: 'Waist',
			HIP: 'Hip'	,
			FOOT_LENGTH: 'Foot Length',
			HEIGHT: 'Height',
			LENGTH: 'Length'
		},
		
		SIZE_KEYS: {
			HEIGHT: 'height',
			LENGTH: 'length'
		},
		STATES: [{"ID":"36","Name":"Andaman and Nicobar Islands","Type":"Union Territory"},{"ID":"6","Name":"Andhra Pradesh","Type":"state"},{"ID":"17","Name":"Arunachal Pradesh","Type":"state"},{"ID":"1","Name":"Assam ","Type":"state"},{"ID":"18","Name":"Bihar","Type":"state"},{"ID":"28","Name":"Chandigarh","Type":"Union Territory"},{"ID":"11","Name":"Chhattisgarh","Type":"state"},{"ID":"21","Name":"Dadra and Nagar Haveli","Type":"National Capital Territory"},{"ID":"29","Name":"Daman and Diu","Type":"Union Territory"},{"ID":"27","Name":"Delhi","Type":"Union Territory"},{"ID":"15","Name":"Goa","Type":"state"},{"ID":"5","Name":"Gujarat","Type":"state"},{"ID":"25","Name":"Haryana","Type":"state"},{"ID":"24","Name":"Himachal Pradesh","Type":"state"},{"ID":"2","Name":"Jammu and Kashmir","Type":"state"},{"ID":"20","Name":"Jharkhand","Type":"state"},{"ID":"7","Name":"Karnataka","Type":"state"},{"ID":"8","Name":"Kerala","Type":"state"},{"ID":"19","Name":"Lakshadweep","Type":"Union Territory"},{"ID":"26","Name":"Madhya Pradesh","Type":"state"},{"ID":"3","Name":"Maharashtra","Type":"state"},{"ID":"32","Name":"Manipur","Type":"state"},{"ID":"33","Name":"Meghalaya","Type":"state"},{"ID":"13","Name":"Mizoram","Type":"state"},{"ID":"30","Name":"Nagaland","Type":"state"},{"ID":"22","Name":"Orissa","Type":"state"},{"ID":"34","Name":"Pondicherry","Type":"Union Territory"},{"ID":"12","Name":"Punjab","Type":"state"},{"ID":"14","Name":"Rajasthan","Type":"state"},{"ID":"31","Name":"Sikkim","Type":"state"},{"ID":"23","Name":"Tamil Nadu","Type":"state"},{"ID":"37","Name":"Telangana","Type":"state"},{"ID":"10","Name":"Tripura","Type":"state"},{"ID":"4","Name":"Uttar Pradesh","Type":"state"},{"ID":"16","Name":"Uttarakhand","Type":"state"},{"ID":"9","Name":"West Bengal","Type":"state"}]
	};
};
