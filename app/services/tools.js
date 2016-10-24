// =============================
// tools service
// =============================

/**
 * @author Kevin Siow k.siow@passerelle.co
 * @module services/tools
 * @version 1.0
 * @desc A group of utility functions that can be used by any module
 */

/**
 * Transform a string with hash to human readable string such as '#!/about' to 'about'
 *
 * @param {string} hash - the hash (eg: '#!/about')
 * @param {string} hashToken - the hashToken (eg: '#!/')
 * @return {string} the clean hash (eg: 'about')
 */
export function hashToText(hash, hashToken) {
	return hash.split(hashToken)[1];
}

/**
 * Transform the string corresponding to the route parameters to an object
 *
 * @param {number} routeParamsStr - The string correponding to the routeParams to be transformed
 * @param {Array} routeParams - The array containing names of the route parameters as defined in route config
 * @return {Object} routeParamsObj - An object containing the names of route parameters as keys and their values
 */
export function routeParamsToObjects(routeParamsStr, routeParams) {
	const routeParamsObj = {};
	const nbOfRouteParams = routeParams.length;
	const arrayOfRouteParams = routeParamsStr.split('/');

	for (let p = 0; p < nbOfRouteParams; p++) {
		routeParamsObj[routeParams[p]] = arrayOfRouteParams[p] || null;
	}

	return routeParamsObj;
}

/**
 * Check if an Object has at least one property
 * @param {Object} obj - The object to be evaluated
 * @return {boolean} - Will be true if Object has at least one property
 */
export function isEmptyObject(obj) {
	if (Object.keys(obj).length > 0) {
		return false;
	}

	return true;
}

/**
 * animationEnd polyfill
 */
export const animationEnd = 'webkitAnimationEnd animationend msAnimationEnd oAnimationEnd';

/**
 * transitionEnd polyfill
 */
export const transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';

/**
 * RequestAnimationFrame polyfill
 */
export const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

/**
 * cancelRequestAnimationFrame polyfill
 */
export const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
