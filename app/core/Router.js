// =============================
// Imports
// =============================

// Modules
import pubSub from 'pubsub-js';
import * as routeState from '../services/routeState';
import { isEmptyObject, hashToText, routeParamsToObjects } from '../services/tools';

// =============================
// Router class
// =============================

export default class Router {
	/**
	 * @author Kevin Siow k.siow@passerelle.co
	 * @class core/Router
	 * @version 1.0
	 *
	 * @param {Object} appConfig - The configuration of the app as defined in config file
	 * @param {Object} routeConfig - The configuration of the routes as defined in config file
	 *
	 * @property {boolean} init - Becomes false when first route is loaded
	 * @property {Object} appConfig - The configuration of the app as defined in config file
	 * @property {Object} routeConfig - The configuration of the routes as defined in config file
	 * @property {number} nbOfRoutes - The quantity of routes that exists in config file
	 * @property {boolean} routeIsChanging - To be used to prevent user spamming
	 * @property {Array} controllers - The list of all the controllers provided by App
	 * @property {Object} pageController - The current controller
	 * @property {Object} mainRouteConfig - The configuration of the main route
	 * @property {function} hashChangeJob - A function describing what to do when hashchange event occurs
	 */
	constructor(appConfig, routeConfig) {
		// Initial status
		this.init = true;

		// Store some config
		this.appConfig = appConfig;
		this.routeConfig = routeConfig;
		this.nbOfRoutes = this.routeConfig.length;

		// The route is changing status
		this.routeIsChanging = false;

		// No controllers on init
		this.controllers = [];

		// No pageController on init
		this.pageController = {};

		// Get mainRoute routing config
		this.mainRouteConfig = this.appConfig.mainRoute;

		// Empty hashChangeJob on init
		this.hashChangeJob = () => {};
	}

	/**
	 * Initialize the router by loading an initial router
	 * and listening to further hashchanges
	 * @method core/Router#initialize
 	 */
	initialize() {
		// Evaluate and load initial route
		const initLocation = hashToText(window.location.hash, this.appConfig.hashSyntax);
		this.loadRoute(this.evaluateUrl(initLocation));

		// Create and dispatch hashchange event
		const event = document.createEvent('HTMLEvents');
		event.initEvent('hashchange', true, false);
		window.dispatchEvent(event);

		// hashChangeJob
		this.hashChangeJob = () => {
			// The job will be executed as long as route is not in a transitional state
			if (this.routeIsChanging === false) {
				// Stop listening to hashchange events (if user spams url, clicks on back button...)
				window.removeEventListener('hashchange', this.hashChangeJob);

				// Change state of router
				this.routeIsChanging = true;

				// Evaluate target route
				const newLocation = hashToText(window.location.hash, this.appConfig.hashSyntax);
				const newLocationEval = this.evaluateUrl(newLocation);

				if (newLocationEval.potentialRouteExists === true) {
					// If the target route user is trying to access potentially exists,
					// we can start the process to load the route
					pubSub.publish('routeChanging');

					// We will need to wait until the loader is shown before
					// loader the route (no DOM changes before cloacking)
					pubSub.subscribe('loaderShown', () => {
						this.loadRoute(this.evaluateUrl(newLocation));
						pubSub.unsubscribe('loaderShown');
					});

					// When the view template corresponding to the route
					// has been rendered, the loader will hide itself.
					pubSub.subscribe('loaderHidden', () => {
						// If the user has spammed the url while the router
						// was in a transitional state, change the location hash
						// to correspond to the current route
						if (window.location.hash !== `${this.appConfig.hashSyntax}${routeState.getCurrentRoute().validLocationHash}`) {
							if (routeState.getCurrentRoute().ctrlHasChangedLocationHash === true) {
								window.location.replace(`${this.appConfig.hashSyntax}${routeState.getCurrentRoute().validLocationHash}`);
							} else {
								window.location.hash = `${this.appConfig.hashSyntax}${routeState.getCurrentRoute().validLocationHash}`;
							}
						}

						// Start listening to hashchange again
						setTimeout(() => {
							window.addEventListener('hashchange', this.hashChangeJob);
						}, 100);

						pubSub.unsubscribe('loaderHidden');
					});
				} else if (newLocationEval.potentialRouteExists === false) {
					// If there are no potential routes corresponding
					// to the target of user, we do not need to load anything.
					// In that case, we only need to replace the location to correspond to
					// the current route
					window.location.replace(`${this.appConfig.hashSyntax}${routeState.getCurrentRoute().validLocationHash}`);
					this.routeIsChanging = false;

					// Start listening to hashchange again
					setTimeout(() => {
						window.addEventListener('hashchange', this.hashChangeJob);
					}, 100);
				}
			}
		};

		// Start listening to hashChangeEvents when first route has rendered
		pubSub.subscribe('initialViewRendered', () => {
			setTimeout(() => {
				window.addEventListener('hashchange', this.hashChangeJob);
			}, 100);
			pubSub.unsubscribe('initialViewRendered');
		});
	}

	/**
	 * Should be used by App once the chunk containing all controllers is loaded
	 * @method core/Router#provideControllers
	 *
	 * @param {Object} controllers - The list of all the loaded controllers
 	 */
	provideControllers(controllers) {
		this.controllers = controllers;
		pubSub.publish('controllersLoaded');
	}

	/**
	 * Load a route by instanciating its corresponding controller
	 * and calling its appropriate methods
	 * @method core/Router#loadRoute
	 * @private
	 *
	 * @param {Object} evalObj - routeState object defined in routeState service
 	 */
	loadRoute(evalObj) {
		// If ever this is not the first route that is loaded
		// check if an beforeLeave method can be called
		if (!isEmptyObject(this.pageController) && typeof this.pageController.beforeLeave === 'function') {
			this.pageController.beforeLeave();
		}

		// If ever we aren't in init case, replace the origin route
		// of routeState by the old currentRoute
		if (this.init === false) {
			routeState.updateRouteState('origin', routeState.getCurrentRoute());
		}

		// Update routeState currentRoute
		routeState.updateRouteState('current', evalObj);

		// If we need to replaceLocation
		if (evalObj.replaceLocation === true) {
			window.location.replace(`${this.appConfig.hashSyntax}${routeState.getCurrentRoute().validLocationHash}`);
		}

		if (this.init === true) {
			// On route init, we need to wait until the chunk containing the controllers
			// is loaded before instanciating the controller and calling
			// the appropriate methods
			pubSub.subscribe('controllersLoaded', () => {
				const PageController = this.controllers[evalObj.routeConfig.controller].default;
				this.pageController = new PageController();

				this.pageController.setGlobals(evalObj.routeParams, evalObj.queryParamsString);
				this.pageController.prerender();
				pubSub.unsubscribe('controllersLoaded');
			});
		} else {
			const PageController = this.controllers[evalObj.routeConfig.controller].default;
			this.pageController = new PageController();

			this.pageController.setGlobals(evalObj.routeParams, evalObj.queryParamsString);
			this.pageController.prerender();
		}

		pubSub.subscribe('viewRendered', () => {
			if (this.init === true) {
				if (window.location.hash !== `${this.appConfig.hashSyntax}${routeState.getCurrentRoute().validLocationHash}`) {
					if (routeState.getCurrentRoute().ctrlHasChangedLocationHash === true) {
						window.location.replace(`${this.appConfig.hashSyntax}${routeState.getCurrentRoute().validLocationHash}`);
					}
				}

				// Publish initial view rendered to execute App's ctrl function
				pubSub.publishSync('initialViewRendered');
				this.init = false;
			}

			// A route change only occurs whenever a view
			// is rendered in DOM
			pubSub.publishSync('routeChanged');
			this.routeIsChanging = false;

			// Call the postrender method of controller if it exists
			if (typeof this.pageController.postrender === 'function') {
				this.pageController.postrender();
			}

			pubSub.unsubscribe('viewRendered');
		});
	}

	/**
	 * Used to check current window location hash and determine if
	 * the route exists. If it doesn't, it will automatically
	 * propose a fallback route
	 * @method core/Router#evaluateUrl
	 * @private
	 *
	 * @param {string} location - Clean window.location.hash (without hashbang)
	 * @return {Object} evalObj - routeState object defined in routeState service
 	 */
	evaluateUrl(location) {
		if (location && location.length > 0) {
			// We need to clear query parameters from the location we are trying to evaluate
			const splitLocationAndQueryParams = location.split('?');
			let cleanLocation = splitLocationAndQueryParams[0];

			let nbOfSlashes = (cleanLocation.match(/\//g) || []).length;

			if (nbOfSlashes > 0) {
				// If target location has no sub-path, it has to match
				// directly with one of the routes path
				// Warning : A target location with no sub-paths can't expect a route parameter
				// If you need to have filters, use query parameters instead
				// And please put query parameters at the end of your url :)
				if (nbOfSlashes === 1) {
					for (let x = 0; x < this.nbOfRoutes; x++) {
						if (this.routeConfig[x].when === cleanLocation) {
							return {
								replaceLocation: false,
								routeConfig: this.routeConfig[x],
								routeParams: {},
								queryParamsString: splitLocationAndQueryParams.length > 1 ? splitLocationAndQueryParams[1] : null,
								validLocationHash: location,
								potentialRouteExists: true,
								ctrlHasChangedLocationHash: false,
							};
						}
					}
				}

				// If target location has sub-path(s), we try to evaluate the potential
				// of the location to exist
				if (nbOfSlashes > 1) {
					let lastCharIsSlash = false;

					// We have to check if there is any value behind the last slash
					// If there isn't any value, the additional slash might be a mistake
					const lastCharValue = cleanLocation.slice(-1);

					// Since there is no value, we will need to rewrite cleanLocation
					// and change the nbOfSlashes for further analysis
					if (lastCharValue === '/') {
						lastCharIsSlash = true;
						const newLocation = cleanLocation.slice(0, -1);
						cleanLocation = newLocation;
						nbOfSlashes -= 1;
					}

					// We will match the target location to the longest
					// coresponding route
					for (let o = nbOfSlashes; o > 0; o--) {
						const groupNb = o;
						const locationToEval = cleanLocation.match(`^(?:[^/]*/){${groupNb}}([^/]*)`)[0];

						for (let i = 0; i < this.nbOfRoutes; i++) {
							// If ever a location matches
							if (this.routeConfig[i].when === locationToEval) {
								const moreThanOneSubpath = nbOfSlashes > 1;
								const notFirstLoop = o < nbOfSlashes;
								const routeAcceptsParameters = this.routeConfig[i].parameters ? this.routeConfig[i].parameters.length > 0 : false;
								const hasLessOrSameNbOfParameters = this.routeConfig[i].parameters ? this.routeConfig[i].parameters.length >= (nbOfSlashes - o) : false;

								if (moreThanOneSubpath && notFirstLoop && routeAcceptsParameters && hasLessOrSameNbOfParameters) {
									return {
										replaceLocation: lastCharIsSlash,
										routeConfig: this.routeConfig[i],
										routeParams: routeParamsToObjects(cleanLocation.split(`${locationToEval}/`)[1], this.routeConfig[i].parameters),
										queryParamsString: !lastCharIsSlash && splitLocationAndQueryParams.length > 1 ? splitLocationAndQueryParams[1] : null,
										validLocationHash: !lastCharIsSlash ? location : cleanLocation,
										potentialRouteExists: true,
										ctrlHasChangedLocationHash: false,
									};
								}

								if (moreThanOneSubpath && notFirstLoop && routeAcceptsParameters && !hasLessOrSameNbOfParameters) {
									return {
										replaceLocation: true,
										routeConfig: this.mainRouteConfig,
										routeParams: {},
										queryParamsString: null,
										validLocationHash: this.mainRouteConfig.when,
										potentialRouteExists: false,
										ctrlHasChangedLocationHash: false,
									};
								}

								if (moreThanOneSubpath && notFirstLoop && !routeAcceptsParameters) {
									return {
										replaceLocation: true,
										routeConfig: this.routeConfig[i],
										routeParams: {},
										queryParamsString: null,
										validLocationHash: this.routeConfig[i].when,
										potentialRouteExists: true,
										ctrlHasChangedLocationHash: false,
									};
								}

								return {
									replaceLocation: lastCharIsSlash,
									routeConfig: this.routeConfig[i],
									routeParams: {},
									queryParamsString: !lastCharIsSlash && splitLocationAndQueryParams.length > 1 ? splitLocationAndQueryParams[1] : null,
									validLocationHash: !lastCharIsSlash ? location : cleanLocation,
									potentialRouteExists: true,
									ctrlHasChangedLocationHash: false,
								};
							}
						}
					}
				}
			}
		}

		// If target location submitted is not valid, fallback to main route
		return {
			replaceLocation: true,
			routeConfig: this.mainRouteConfig,
			routeParams: {},
			queryParamsString: null,
			validLocationHash: this.mainRouteConfig.when,
			potentialRouteExists: false,
			ctrlHasChangedLocationHash: false,
		};
	}
}
