var baseURL = 'http://localhost/koffeePlace/';


//	validate admin login

function validateAdmin () {
	if (document.setting.username.value=="") {
		alert("Please enter username");
		document.setting.username.focus();
		return false;
	}

	if (document.setting.new_pass.value!=document.setting.confirm_new.value) {
		alert("Passwords do not match");
		document.setting.confirm_new.focus();
		return false;
	}
	
	return true;
}


//	validate add company

function validateAddCompany() {
	if (document.companyForm.companyName.value == "") {
		alert("Please enter company name");			
		document.companyForm.companyName.focus();
		return false;
	}	
	if (document.companyForm.address.value == "") {
		alert("Please enter address");			
		document.companyForm.address.focus();
		return false;
	}
	if (document.companyForm.phoneNumber.value == "") {
		alert("Please enter phone number");			
		document.companyForm.phoneNumber.focus();
		return false;
	}
	if (isNaN(document.companyForm.phoneNumber.value)) {
		alert("Please enter valid phone number");			
		document.companyForm.phoneNumber.focus();
		return false;
	}
	if (document.companyForm.email.value == "") {
		alert("Please enter email");			
		document.companyForm.email.focus();
		return false;
	}
	if (document.companyForm.password.value == "") {
		alert("Please enter password");			
		document.companyForm.password.focus();
		return false;
	}	
	
	return true;
}



function validateUpdateOrder() {
	if (document.orderForm.AWB.value == "") {
		alert("Please enter AWB");			
		document.orderForm.AWB.focus();
		return false;
	}	
	if (document.orderForm.courier.value == "") {
		alert("Please enter courier name");			
		document.orderForm.courier.focus();
		return false;
	}
	
	return true;
}



function validateAddCouponCode() {
	if (document.couponCodeForm.couponCode.value == "") {
		alert("Please enter coupon code");			
		document.couponCodeForm.couponCode.focus();
		return false;
	}	
	if (document.couponCodeForm.discount.value == "") {
		alert("Please enter discount");			
		document.couponCodeForm.discount.focus();
		return false;
	}
	if (document.couponCodeForm.discountType.value == "none") {
		alert("Please select discount type");			
		document.couponCodeForm.discountType.focus();
		return false;
	}
	return true;
}


function validateResetPassword() {
	if (document.resetPasswordForm.password.value == "") {
		alert("Please enter password");			
		document.resetPasswordForm.password.focus();
		return false;
	}	
	if (document.resetPasswordForm.confirmPassword.value == "") {
		alert("Please confirm password");			
		document.resetPasswordForm.confirmPassword.focus();
		return false;
	}
	if (document.resetPasswordForm.password.value != document.resetPasswordForm.confirmPassword.value) {
		alert("Passwords don't match");			
		document.resetPasswordForm.confirmPassword.focus();
		return false;
	}
	return true;
}
