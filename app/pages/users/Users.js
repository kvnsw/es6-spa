// =============================
// Imports
// =============================

// Modules
import Controller from '../../core/Controller';
import ajaxReq from '../../services/ajaxManager';
import { isEmptyObject } from '../../services/tools';

// Template
import template from './users.handlebars';

// Styles
import './users.css';

// =============================
// Home Controller
// =============================

export default class Users extends Controller {
	prerender() {
		this.setMetaDatas({
			title: 'Users',
			description: 'An example of dynamic routing',
			keywords: 'dynamic routing',
		});

		const singleUserCase = (optionalMsg) => {
			ajaxReq('https://randomuser.me/api/').then((data) => {
				// If an evaluate function exists
				const templateVariables = {
					users: data,
					contextMsg: optionalMsg || 'If no route parameters exists, we will generate only one user',
				};

				this.setPageView(template, templateVariables);
			}).catch((err) => {
				/* eslint-disable */
				console.warn(err);
				/* eslint-enable */
			});
		};

		if (!isEmptyObject(this.routeParams)) {
			// Parse the string to int
			const parsedNbOfUsers = parseInt(this.routeParams.nbOfUsers, 10);

			if (!isNaN(parsedNbOfUsers)) {
				ajaxReq(`https://randomuser.me/api/?results=${parsedNbOfUsers}`).then((data) => {
					// If an evaluate function exists
					const templateVariables = {
						users: data,
						contextMsg: 'If router parameter exists and is valid, we will generate as many users as specified',
					};

					this.setPageView(template, templateVariables);
				}).catch((err) => {
					/* eslint-disable */
					console.warn(err);
					/* eslint-enable */
				});
			} else {
				this.replaceLocation('/generateusers');
				singleUserCase('If route parameter exists but is invalid, we will replace location (look url) and generate only one user');
			}
		} else {
			singleUserCase();
		}
	}

	postrender() {
		// For all user interactions, you can use the postrender method
		$(window).bind('resize.users', () => {
			/* eslint-disable */
			console.log('you have resized');
			/* eslint-enable */
		});
	}

	beforeLeave() {
		// Before chaing controllers, you might want to unbind some events
		// Use the beforeLeave method for that case
		$(window).unbind('resize.users');
	}
}
