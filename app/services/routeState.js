// =============================
// Global variables
// =============================

// On initialization, there is no routeState
let originRoute = {};
let currentRoute = {};

/**
 * @author Kevin Siow k.siow@passerelle.co
 * @module services/routeState
 * @version 1.0
 * @desc Provide routeState
 */

 /**
 * @typedef {Object} routeState
 * @property {boolean} replaceLocation - Assert if location has been replaced
 * @property {Object} routeConfig - The configuration of the routes as defined in config file
 * @property {Object} routeParams - A list of route parameters if there are any
 * @property {string} queryParamsString - The string corresponding the query parameters
 * @property {string} validLocation - The valid location hash to get to current location
 * @property {boolean} potentialRouteExists - Assert if there is a route that potentially corresponds to target
 */

// =============================
// routeState service
// =============================

/**
 * Update the routeState
 *
 * @param {string} stateName - The name of the state to be modified (can be 'origin' or 'current')
 * @param {Object} newState - routeState object
 */
export function updateRouteState(stateName, newState) {
	if (stateName === 'origin') {
		originRoute = newState;
	} else if (stateName === 'current') {
		currentRoute = newState;
	}
}

/**
 * Returns originRoute
 */
export function getOriginRoute() {
	return originRoute;
}

/**
 * Returns currentRoute
 */
export function getCurrentRoute() {
	return currentRoute;
}
