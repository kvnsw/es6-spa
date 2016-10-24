// =============================
// Imports
// =============================

// Modules
import routeConfig from './routeConfig';

// =============================
// App config
// =============================

/**
 * @author Kevin Siow k.siow@passerelle.co
 * @module config/appConfig
 * @version 1.0
 * @desc The application's configuration (all properties are mandatory).
 */

/**
 * @typedef {Object} appConfig
 * @property {string} appName - App name (used in document title prop)
 * @property {string} appWrapperId - The main wrapper of our app
 * @property {string} appLocation - Lcoation of app
 * @property {string} devEnv - Get NODE_ENV from process.env
 * @property {string} mainRoute - Name of the main route / initial fallback route
 * @property {string} hashSyntax - The hash syntax
 */
export default {
	// appName will be use in document title prop
	appName: 'ES6 Single Page Application',

	appWrapperId: 'spa-wrap',

	// Set appLocation to wherever the App lives
	appLocation: `${window.location.origin}${window.location.pathname}`,

	// devEnv
	devEnv: process.env.NODE_ENV,

	// Set the main route / fallback route of App
	mainRoute: routeConfig[0],

	// hashSyntax can be '#' or '#!'
	hashSyntax: '#!',
};
