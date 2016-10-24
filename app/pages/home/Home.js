// =============================
// Imports
// =============================

// Modules
import Controller from '../../core/Controller';

// Template
import template from './home.handlebars';

// Styles
import './home.css';

// =============================
// Home Controller
// =============================

export default class Home extends Controller {
	prerender() {
		this.setMetaDatas({
			title: 'Home',
			description: 'Single page applications are awesome',
			keywords: 'Webpack, ES6 (Babel), Jquery, Handlebars, PostCss, Karma, Jasmine.',
		});

		const templateVariables = {
			appName: 'ES6 Single Page Application',
		};

		this.setPageView(template, templateVariables);
	}
}
