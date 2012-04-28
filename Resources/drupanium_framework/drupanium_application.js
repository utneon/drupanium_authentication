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
 * Drupanium framework - application
 * This component provides configuration for both your drupanium application and drupal site
 * #########################################################################
 */

/**
 * Properties
 * 
 *************************************/

//set the base paths for your drupal website and drupal rest server (add trailing slash)
exports.URLS = {
	rest_path: '',
	site_path: '',
};


/**
 * Setters and getters helper methods
 * 
 * @param option
 * key value for the URLS array
 * @param value
 * the value for the selected array[option]
 *************************************/

exports.setDrupaniumURLS = function(option, value) {
	this.URLS[option] = value;
};

exports.getDrupaniumURLS = function(option) {
   return this.URLS[option];
};

/**
 * Methods and implementation
 * 
 *************************************/

//test network connectivity and check if drupal site is online*1
//*1 - missing (right now we only implemented Titanium.Network network check)
exports.drupaniumCheckConnectivity = function() {
	Titanium.API.info("drupanium_app: Checking for connectivity...");
    if (Titanium.Network.networkType == Titanium.Network.NETWORK_NONE) {
    	Titanium.API.info("drupanium_app: Network is offline...");
    	return false;
	}
	else {
		Titanium.API.info("drupanium_app: Network and drupal site is online!");
		return true;
	}
};
