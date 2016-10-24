// =============================
// Imports
// =============================

// Modules
import pubSub from 'pubsub-js';
import imagesLoaded from 'imagesloaded';
import * as routeState from '../services/routeState';
import appConfig from '../config/appConfig';

// =============================
// Global variables
// =============================

// Application main wrapper
const appWrap = $(`#${appConfig.appWrapperId}`);

// =============================
// Controller class
// =============================

export default class Controller {
	/**
	 * @author Kevin Siow k.siow@passerelle.co
	 * @class core/Controller
	 * @version 1.0
	 *
	 * @param {Object} routeParams - The configuration of the routes as defined in config file
	 * @param {string} queryParams - The string corresponding the query parameters
 	 */
	setGlobals(routeParams, queryParams) {
		this.routeParams = routeParams;
		this.queryParams = queryParams;
	}

	/**
	 * Set meta datas to document
	 * Call this method before executing setPageView
	 * @method core/Controller#setMetaDatas
	 *
	 * @param {Object.<string, string, string>} datas
	 * @param {string} datas.title - Document title
	 * @param {string} datas.description - Meta description
	 * @param {string} datas.keywords - Meta keywords
 	 */
	setMetaDatas(datas) {
		if (datas.title) {
			document.title = `${appConfig.appName} - ${datas.title}`;
		}

		if (datas.description) {
			document.getElementsByName('description')[0].setAttribute('content', datas.description);
		}

		if (datas.keywords) {
			document.getElementsByName('keywords')[0].setAttribute('content', datas.keywords);
		}
	}

	/**
	 * Append template to DOM
	 * Call this method when all operations of prerender are done
	 * @method core/Controller#setPageView
	 *
	 * @param {Object} viewTemplate - Handlebars template
	 * @param {Object} viewVariables - Variables used in template
 	 */
	setPageView(viewTemplate, viewVariables) {
		const compiledTemplate = viewVariables ? viewTemplate(viewVariables) : viewTemplate();

		// Empty the spa wrapper
		if (appWrap.children.length > 0) {
			appWrap.empty();
		}

		// Append the compiled template
		appWrap.append(compiledTemplate);

		// Wait until all images has loaded
		imagesLoaded(appWrap, () => {
			// If there are background images to preload, append
			// an image tag in a #images-preload div which will be removed
			// after all the images have been loaded
			const preloadWrapper = appWrap.find('#images-preload');
			if (preloadWrapper.length > 0) {
				preloadWrapper.remove();
			}

			// Publish viewRendered
			pubSub.publishSync('viewRendered');
		});
	}

	/**
	 * Go to another location
	 * Use this method only in postrender (after setPageView)
	 * @method core/Controller#changeLocation
	 *
	 * @param {string} target - Target url
 	 */
	changeLocation(target) {
		window.location.hash = `${appConfig.hashSyntax}${target}`;
	}

	/**
	 * Replace location
	 * Use this method only in prerender before setPageView
	 * @method core/Controller#replaceLocation
	 *
	 * @param {string} target - Target url
 	 */
	replaceLocation(target) {
		const currentRouteState = routeState.getCurrentRoute();
		currentRouteState.validLocationHash = target;
		currentRouteState.ctrlHasChangedLocationHash = true;
		routeState.updateRouteState('current', currentRouteState);
	}
}
