/**
 * GNU GENERAL PUBLIC LICENSE
 * Version 2, June 1991
 *
 * Copyright (C) 1989, 1991 Free Software Foundation, Inc. 675 Mass Ave,
 * Cambridge, MA 02139, USA. Everyone is permitted to copy and distribute
 * verbatim copies of this license document, but changing it is not allowed.
 * 
 * Authors:
 * Luis Elizondo (http://about.me/luiselizondo)
 * Paulo Carvalho (http://www.linkedin.com/in/utneon)
 * 
 * #########################################################################
 * Drupanium framework - Authentication
 * Use this component for authentication and session management
 * #########################################################################
 */

/**
 * Properties
 * 
 *************************************/

//session information
exports.sessionInformation = {
	userUid:'',
	userSessionId:'',
	userSessionName:'',
};

/**
 * Setters and getters helper methods
 * 
 * @param option
 * key value for the URLS array
 * @param value
 * the value for the selected array[option]
 *************************************/

exports.setDrupaniumSessionInformation = function(option, value) {
   this.sessionInformation[option] = value;
};

exports.getDrupaniumSessionInformation = function(option) {
   return this.sessionInformation[option];
};

/**
 * Session Authentication method
 * 
 * @param username
 * drupal username
 * @param password
 * password for respective username
 * @param rest_path
 * path to the rest api on drupal site
 * @param timeout
 * value of the timeout rule for the connection attent in milliseconds
 * @param onSuccess 
 * callback function to execute when we get a response
 */
exports.drupaniumAuthenticate = function (username, password, rest_path, timeout, onSuccess) {
	
	Ti.API.info("drupanium_auth: drupaniumAuthenticate function was called...");
	
	//create an object to hold the user data entered in the form passed through parms
	var user = {
		username:username,
		password:password,
	}
	
	//define the url which contains the full url
	//in this case, we'll connecting to http://example.com/api/rest/user/login
	var url = rest_path + 'user/login';
	
	// Create a connection and set a timeout
	var xhr = Titanium.Network.createHTTPClient({timeout: timeout});
	
	/*
	xhr.onerror = function(e) {
		alert(e.message);
	}
	*/
	
	// When the connection loads:
	xhr.onload = function() {
		// Save the status of the connection in a variable.
		// this will be used to see if we have a connection (200) or not
		
		Ti.API.info("drupaniumAuthenticateUser:onload:status:" + xhr.status);
		
		// Check if we have a valid status
		if(xhr.status == 200) {
			
			// Create a variable response to hold the response
			var response = xhr.responseText;
			
			// Parse (build data structure) the JSON response into an object (data)
			var data = JSON.parse(response);
			
			// Log to the console what is it that we're getting from drupal
			Ti.API.info("drupaniumAuthenticateUser:onload: " + data);
			
			// This is the function that gets called if success passing the object (data) as param and the httpRequestCodeStatus
			onSuccess(data, xhr.status);
		}
		else {
			//response not 200
			//to be implemented
		}
	}
	
	// Open the connection using POST
	xhr.open("POST", url);
	// There's a bug with D6 that needs setRequestHeader to be between xhr.open and xhr.send
	xhr.setRequestHeader('Content-Type','application/json; charset=utf-8');
	// Send the connection and the user object as argument
	xhr.send(user);
}

/**
 * Session Terminate method (logout)
 * 
 * @param rest_path
 * path to the rest api on drupal site
 * @param timeout
 * value of the timeout rule for the connection attent in milliseconds
 * @param onSuccess 
 * callback function to execute when we get a response
 */
exports.drupaniumTerminateSession = function(rest_path, timeout, onSuccess) {
	
	Ti.API.info("drupanium_auth: drupaniumTerminateSession function was called...");
	
	// Define the url which contains the full url
	// in this case, we'll connecting to http://example.com/api/rest/user/logout
	var logoutUrl = rest_path + 'user/logout';

	// Create a connection
	var xhr = Titanium.Network.createHTTPClient({timeout: timeout});
	
	xhr.setRequestHeader('Content-Type','application/json; charset=utf-8');
	
	// Open the connection
	xhr.open("POST", logoutUrl);

	// Send the connection
	xhr.send();
	
	// When the connection loads we do:
	xhr.onload = function() {
		// Save the status of the connection in a variable.
		// this will be used to see if we have a connection (200) or not
		var statusCodeLogout = xhr.status;
		
		Titanium.API.info(statusCodeLogout);		
		
		// Check if we have a connection
		if(statusCodeLogout == 200) {
			
			Ti.API.info("drupanium_auth: Log out successful!");
			
			// Callback function for Session Terminate.
			// return true if user has logged out with sucess or return false if not
			onSuccess(status=true);
		}
		else {
			
			//if this PROBABLY means the user is not logged in (needs more testing)
			onSuccess(status=false);
		}
	}
}
