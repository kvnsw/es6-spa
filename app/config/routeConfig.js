// =============================
// Route config
// =============================

/**
 * @author Kevin Siow k.siow@passerelle.co
 * @module config/routeConfig
 * @version 1.0
 * @desc An array of all our routes and their configuration
 */

/**
 * @typedef {Object.<string, string>} singleRouteConfig
 * @property {string} singleRouteConfig.controller - Controller name
 * @property {string} singleRouteConfig.when - URL condition
 * @property {string} singleRouteConfig.path - Absolute path to directory of controller from core/App
 * @property {Array} [singleRouteConfig.parameters] - Route parameters names (check core/Router for explanation)
 */
export default [
	{
		controller: 'Home',
		when: '/',
		path: 'pages/home',
	},
	{
		controller: 'Users',
		when: '/generateusers',
		path: 'pages/users',
		parameters: ['nbOfUsers'],
	},
];
