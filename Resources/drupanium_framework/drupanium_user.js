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
 * Drupanium framework - User
 * Use this component to manage user information and user operations related
 * #########################################################################
 */

/**
 * Properties
 * 
 *************************************/

//user info
exports.USER = {
	userUid:'',
	userName:'',
	userProfilePicture:'',
};

/**
 * Setters and getters helper methods
 * 
 * @param option
 * key value for the URLS array
 * @param value
 * the value for the selected array[option]
 *************************************/

exports.setDrupaniumUSER = function(option, value) {
   this.USER[option] = value;
};

exports.getDrupaniumUSER = function(option) {
   return this.USER[option];
};


/**
 * drupaniumGetUser: Method for retrieving user information.
 * 
 * @param uid
 * the uid of the user to get information
 * @param rest_path
 * path to the rest api on drupal site
 * @param site_path
 * full base path for the drupal installation. don't forget 'http://'
 * @param timeout
 * value of the timeout rule for the connection attent in milliseconds
 * @param onSuccess 
 * callback function to execute when we get a response
 */
exports.drupaniumGetUser = function (uid, rest_path, site_path, timeout, onSuccess) {
	
	Ti.API.info("drupanium_user: drupaniumGetUser function was called...");
	
	// Define the URL, the full path would be http://example.com/api/rest/user/USERID.json
	var url = rest_path + 'user/' + uid + '.json';
	
	// Create a new connection in the variable xhr
	var xhr = Titanium.Network.createHTTPClient({timeout: timeout});

	// When the connection loads do:
	xhr.onload = function() {
		// Use the status Code in the variable statusCode
		var statusCode = xhr.status;
		
		
		Ti.API.log("drupaniumGetUser httprequest status is: " + statusCode);
		
		if(statusCode == 200) {
			// Create a new variable to contain the response
			var response = xhr.responseText;
					
			// Create a new variable to process the JSON output and create an object inside data
			var data = JSON.parse(response);
			
			// Log to the console what is it that we're getting from drupal
			Ti.API.info("drupaniumAuthenticateUser:onload: " + data);
			//Ti.API.info(data.picture.filename);
			
			// This is the function that gets called if success passing the object (data) as param and the httpRequestCodeStatus as statusCode
			onSuccess(data, statusCode);
		}
	}

	//Open the connection using GET
	xhr.open("GET", url);

	// Send the connection, since we're using GET we don't pass anything as argument
	xhr.send(); 
}
