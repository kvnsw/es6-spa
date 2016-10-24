// =============================
// Imports
// =============================

// Modules
import pubSub from 'pubsub-js';
import App from './core/App';
import appConfig from './config/appConfig';
import routeConfig from './config/routeConfig';
import loader from './ui-components/loader/loader';

// Main stylesheet
import './styles/main.css';

// =============================
// Entry point
// =============================

// Code to run as soon as possible on App instanciation
function run() {
	// Initialize the loader before anything happens
	loader.init();
}

// Code to run when first view template is rendered
function ctrl() {
	// Subscribe to routeChanging which is published by user
	// when accessing a new route (after app init)
	pubSub.subscribe('routeChanging', () => {
		// Show loader and start animation
		loader.start();
	});

	// Subscribe to routeChanged which is published whenever
	// template of target route has been rendered
	pubSub.subscribe('routeChanged', () => {
		// Stop animation and hide loader
		loader.stop();
	});
}

// Create new instance of App
const app = new App(appConfig, routeConfig);

// Initialize App
app.initialize(run, ctrl);
