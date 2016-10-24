// =============================
// Imports
// =============================

// Modules
import pubSub from 'pubsub-js';
import Router from './Router';

// =============================
// App class
// =============================

export default class App {
	/**
	 * @author Kevin Siow k.siow@passerelle.co
	 * @version 1.0
	 * @class core/App
	 *
	 * @param {Object} appConfig - The configuration of the app as defined in config file
 	 * @param {Object} routeConfig - The configuration of the routes as defined in config file
 	 *
 	 * @property {Object} appConfig - The configuration of the app as defined in config file
	 * @property {Object} routeConfig - The configuration of the routes as defined in config file
	 * @property {Object} controllers - The list of all the required controllers
 	 */
	constructor(appConfig, routeConfig) {
		// Store some config
		this.appConfig = appConfig;
		this.routeConfig = routeConfig;

		// We will store our Controllers here
		this.controllers = {};
	}

	/**
	 * Create chunk containing all Controller scripts and handle order of method calling
 	 * @method core/App#initialize
 	 *
 	 * @param {function} run - First function to be executed on App initialization
 	 * @param {function} ctrl - Function to be executed when first view has been rendered
 	 */
	initialize(run, ctrl) {
		// Execute run as soon as possible
		if (typeof run === 'function') {
			run();
		}

		if (typeof ctrl === 'function') {
			// Execute ctrl whenever intialView is rendered
			pubSub.subscribe('initialViewRendered', () => {
				ctrl();
				pubSub.unsubscribe('initialViewRendered');
			});
		}

		// Instanciate new Router
		const router = new Router(this.appConfig, this.routeConfig);

		// Initialize router
		router.initialize();

		// Require and load the chunk
		const nbOfRoutes = this.routeConfig.length;

		// Store loaded controllers in array to prevent duplicate requires to happen
		// It is useful when two routes use the same controllers
		const loadedControllers = [];
		require.ensure([], (require) => {
			for (let r = 0; r < nbOfRoutes; r++) {
				// If controller is not loaded yet
				if (loadedControllers.indexOf(this.routeConfig[r].controller) < 0) {
					loadedControllers.push(this.routeConfig[r].controller);
					this.controllers[this.routeConfig[r].controller] = require(`../${this.routeConfig[r].path}/${this.routeConfig[r].controller}.js`);
				}
			}

			// Provide controllers to router when chunk is loaded
			router.provideControllers(this.controllers);
		});
	}
}
