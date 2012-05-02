//FirstView Component Constructor
function FirstView() {
	//create object instance, a parasitic subclass of Observable
	var self = Ti.UI.createView();
	
	Titanium.API.info("drupanium_authentication app started... Running FirstView.js...");
	
	/**
	 * Drupanium
	 * Use drupanium_application.js component to create an object for your drupanium implementation
	 */
	var DrupaniumApp = require('/drupanium_framework/drupanium_application');
	
	//set the url paths for the rest api on your drupal site
	//change the URLS for your own drupal site
	DrupaniumApp.setDrupaniumURLS('rest_path', 'http://api.drupanium.org/api/rest/');
	DrupaniumApp.setDrupaniumURLS('site_path', 'http://api.drupanium.org/');

	/**
	 * Drupanium
	 * Use drupanium_auth.js component to create an object for authentication and session handling
	 */
	var DrupaniumAuthentication = require('/drupanium_framework/drupanium_auth');
	
	
	/*
	if (Titanium.App.Properties.getInt("userUid")) {
		
		Titanium.API.info("The Titanium.App.Properties.getInt('userUid') seems to bet set. Maybe there is a session already authenticated. If you can't do any operations try to log out first");
		Titanium.API.info("Current session: \nDrupal uid: " + Titanium.App.Properties.getInt("userUid") + "\nDrupal sessid: " + Titanium.App.Properties.getString("userSessionId") + "\nDrupal session_name: " + Titanium.App.Properties.getString("userSessionName"));
		
		alert("Welcome back uid: " + Titanium.App.Properties.getInt("userUid"));
	}
	*/
	
	//create a label for network conectivity status
	var labelConnectionStatus = Ti.UI.createLabel({
		color:'#000000',
		text: 'Network status: ',
		height:'auto',
		width:'auto',
		bottom: 10
	});
	
	self.add(labelConnectionStatus);
	
	//test network connectiviy using drupaniumCheckConnectivity and update the status label
	if(DrupaniumApp.drupaniumCheckConnectivity()) {
		labelConnectionStatus.text = labelConnectionStatus.text + ' Online';
	} else {
		labelConnectionStatus.text = labelConnectionStatus.text + ' Offline';
	}

	// Create the username textfield
	var usernameTextfield = Titanium.UI.createTextField({
		hintText:'username',
		height:35,
		top:10,
		left:10,
		paddingLeft:5,
		width:300,
		font:{fontSize:16},
		borderWidth:2,
		borderColor:'#bbb',
		borderRadius:5,
		// This is very important. Don't auto capitalize the first letter of the password.
		autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
	});
	
	self.add(usernameTextfield);

	// Create the password textfield
	var passwordTextfield = Titanium.UI.createTextField({
		hintText:'password',
		height:35,
		top:50,
		left:10,
		paddingLeft:5,
		width:300,
		font:{fontSize:16},
		borderWidth:2,
		borderColor:'#bbb',
		borderRadius:5,
		// This is very important. Don't auto capitalize the first letter of the password.
		autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		// Mask the password so nobody sees it
		passwordMask:true,
	});
	
	self.add(passwordTextfield);

	// Create the login button
	var loginButton = Titanium.UI.createButton({
		title:'Login',
		height:40,
		width:200,
		top:100
	});

	self.add(loginButton);

	// Add the click event listener for the login button.
	// this click event will call a method from the DrupaniumAuthentication object
	// and try to authenticate the user 
	loginButton.addEventListener('click', function(e) {
		
		// Check if the fields are empty
		// you should add extra validation to increase secutiry and meet your drupal user settings usernames and passwords
		if (usernameTextfield.value.length==0 || passwordTextfield.value.length==0) {
			alert("login and password fields musn't be empty");
			//this return will stop the function
			return;
		}
		
		// Call the drupaniumAuthenticate method to authenticate the user.
		// see the documentation on drupanium_auth.js for params and more information on this method
		DrupaniumAuthentication.drupaniumAuthenticate(usernameTextfield.value, passwordTextfield.value, DrupaniumApp.getDrupaniumURLS('rest_path'),5000 , function(data, httpCodeStatus){
			
			//if the callback function returns the array object (data)
			if (data) {
				// Use the helper methods to set the properties coming
				// from the data object returned in the callback function
				DrupaniumAuthentication.setDrupaniumSessionInformation('userUid', data.user.uid);
				DrupaniumAuthentication.setDrupaniumSessionInformation('userSessionId', data.sessid);
				DrupaniumAuthentication.setDrupaniumSessionInformation('userSessionName', data.session_name);
				
				// Set the session properties for the application.
				// you do this so you can have the session variables available during the lifecyle of your application
				// this also allows you to check if the user is already logged in or not when the application is launched
				Titanium.App.Properties.setInt("userUid", data.user.uid);
	 			Titanium.App.Properties.setString("userSessionId", data.sessid);
	 			Titanium.App.Properties.setString("userSessionName", data.session_name);
	 			
	 			Titanium.API.info("Setting data.user.ui, data.sessid, data.session_name into Titanium.App.Properties...");
				
				// Hide the keyboard if the authentication succeeds.
				hideLoginKeyboard();
				
				//clear textfields
				usernameTextfield.value='';
				passwordTextfield.value='';
				
				//welcome the user
				alert("Welcome user of uid: " + DrupaniumAuthentication.getDrupaniumSessionInformation("userUid"))
				
				// Log to the console to see if we were able to set the info to the session properties
				// this will help you with debugging
				Titanium.API.info("Authenticated with success.");
				Titanium.API.info("Drupal uid: " + DrupaniumAuthentication.getDrupaniumSessionInformation("userUid"));
				Titanium.API.info("Drupal sessid: " + DrupaniumAuthentication.getDrupaniumSessionInformation("userSessionId"));
				Titanium.API.info("Drupal session_name: " + DrupaniumAuthentication.getDrupaniumSessionInformation("userSessionName"));
			}
			else {
				Titanium.API.info("Authentication Failed!");
				alert("Authentication Failed!");
			}
		});	
	});			


	// Add the logout button
	var logoutButton = Titanium.UI.createButton({
		title:'Logout',
		height:40,
		width:200,
		top:150
	});
	
	self.add(logoutButton);
	
	 // Add the click event listener for the logout button.
	 // this click event will call a method from the DrupaniumAuthentication object
	 // and try to destroy the current session (logout)
	logoutButton.addEventListener('click', function(e) {
		
		// Call the drupaniumAuthenticate method to authenticate the user
		// see the documentation on drupanium_auth.js for params and more information on this method
		DrupaniumAuthentication.drupaniumTerminateSession(DrupaniumApp.getDrupaniumURLS('rest_path'),5000 , function(status){
			if (status) {
				// We remove all the properties since the user is requesting to logout
				Titanium.App.Properties.removeProperty("userUid");
				Titanium.App.Properties.removeProperty("userSessionId");
				Titanium.App.Properties.removeProperty("userSessionName");
				
				Titanium.API.info("Removing data.user.ui, data.sessid, data.session_name into Titanium.App.Properties...");
				
				alert("Logged out!");
			}
			else {
				Titanium.API.info("Log out failed!");
				alert("Log out failed! Please try again.");
			}
		});
		
		// Hide the keyboard if the authentication succeeds.
		hideLoginKeyboard();
	});
	
	// Call this function whenever you want to hide the login keyboard that pops out from the textfields
	// this is the equivalent to the resignFirstResponder
	// if you have coded before in Objective-C iOS SDK
	function hideLoginKeyboard() {
		usernameTextfield.blur();
		passwordTextfield.blur();
	}
	
	
	/**
	 * Drupanium
	 * Use drupanium_user.js component to create an object for your user related actions
	 */
	var DrupaniumUser = require('/drupanium_framework/drupanium_user');
	
	var showUserProfile = Titanium.UI.createButton({
		title:'Show User Info',
		height:40,
		width:200,
		bottom:35,
	});
	
	self.add(showUserProfile);
	
	showUserProfile.addEventListener('click', function(e) {
		
		// Call the drupaniumUser method to get the User Info
		// see the documentation on drupanium_auth.js for params and more information on this method
		DrupaniumUser.drupaniumGetUser(DrupaniumAuthentication.getDrupaniumSessionInformation("userUid"), DrupaniumApp.getDrupaniumURLS('rest_path') ,DrupaniumApp.getDrupaniumURLS('site_path') ,5000 , function(data){
			if (data) {
				
				// Use these data fields if you're using custom fields for profile. These are the fields which are defined in the api.drupanium.org
				//alert(data.field_fullname.und[0].value);
				//alert(data.field_country.und[0].value);
				//alert(data.field_aboutme.und[0].value);
				
				DrupaniumUser.setDrupaniumUSER('userName', data.name);
				DrupaniumUser.setDrupaniumUSER('userProfilePicture', data.picture.filename);
				
				Titanium.API.info("Drupal username: " + DrupaniumUser.getDrupaniumUSER('userName'));
				Titanium.API.info("Drupal profile picture filename: " + DrupaniumUser.getDrupaniumUSER('userProfilePicture'));
				
	// We create an ImageView to hold the image from the user Profile
	var userPicture = Ti.UI.createImageView({
		// We use the property image and the SITE_PATH instead of the REST_PATH
		// also notice how data.picture.filename is build, since data.picture is also
		// an object inside data
		image : DrupaniumApp.getDrupaniumURLS('site_path') + 'sites/default/files/pictures/' + DrupaniumUser.getDrupaniumUSER('userProfilePicture'),
		bottom : 100,
		width : 100,
		height : 100,
	});
	
	self.add(userPicture);
	
	// We create a label to hold the username from the user Object.
	var userNameLabel = Ti.UI.createLabel({
		color:'#000000',
		text: 'userName: ' + DrupaniumUser.getDrupaniumUSER('userName'),
		height:'auto',
		width:'auto',
		bottom: 210
	});
	
	self.add(userNameLabel);
	
			}
			else {
				//Titanium.API.log("failure");
			}
		});
	});
	
	
	return self;
}


module.exports = FirstView;
