// =============================
// Imports
// =============================

// Modules
import Snap from 'snapsvg';
import pubSub from 'pubsub-js';
import { transitionEnd } from '../../services/tools';

// Template
import template from './loader.handlebars';

// Styles
import './loader.css';

// UI
import logoLoaderUi from '../../assets/ui/loader-logo.svg';

// =============================
// Loader Component
// =============================

/**
 * @author Kevin Siow k.siow@passerelle.co
 * @module ui/loader
 * @version 1.0
 */
export default {
	/**
	 * Compile then append loader template, and get all necessary data for animation
	 *
	 * @property {Object} loaderOuterWrap - #global-loader-wrap selector
	 * @property {number} nbOfLines - The number of lines to be animated
	 * @property {Array.<Object,number>} allLines - An array containing all the lines
	 * @property {Object} allLines.obj - The Snap Object a single line
	 * @property {Object} allLines.size - The size of the line
	 * @property {Array} lKeys - Each of the keys of allLines
	 * @property {string} animationState - The animation state can be 'on', 'goOff' or 'off'
	 */
	init() {
		// Append template to wrapper
		this.loaderOuterWrap = $('#global-loader-wrap');
		this.loaderOuterWrap.append(template({ logoLoaderSvg: logoLoaderUi }));

		// The initial state of the animation is off
		this.animationState = 'off';

		// Snapify logo
		const loadedSnap = new Snap($('#loader-logo')[0]);

		// For each line that has to be animated, we will need to get it's Snap Object and it's size
		const evalLines = {};

		// Get the parent of all the lines that we will animate
		const pathsParent = loadedSnap.select('#animation-wrap');

		// Get the number of lines contained in pathsParent
		this.nbOfLines = pathsParent.node.childNodes.length;

		for (let x = 0; x < this.nbOfLines; x++) {
			// Snapify
			const newLine = new Snap(pathsParent.node.childNodes[x]);

			// Calculate line size
			const lBB = newLine.getBBox();
			/* eslint-disable */
			const lineSize = Math.sqrt((lBB.x2 -= lBB.x) * lBB.x2 + (lBB.y2 -= lBB.y) * lBB.y2);
			/* eslint-enable */

			// Store new Snapified line and it's size
			evalLines[x + 1] = {
				obj: newLine,
				size: lineSize,
			};
		}

		// allLines contains all logo lines that will be animated
		this.allLines = evalLines;

		// lKeys contains an array with each key of allLines properties
		this.lKeys = Object.keys(this.allLines);

		// Loader always starts animation on init
		this.startAnimation();
	},

	/**
	 * Animate each line
	 * @private
	 *
	 * @param {string} type - Set to 'in' for inwards lines animation or to 'out' to outwards lines animation
	 * @param {Object} currentLine - The Snap Object of line to animate
	 * @param {number} size - The size of the line as calculated in init()
	 */
	animateLines(type, currentLine, size) {
		// Delay before animating another line
		// Lines id are in ascending order
		// old value * 120
		const delay = parseInt(currentLine.attr('id'), 10) * 10;

		currentLine.attr({
			strokeDasharray: size,
		});

		// If we are animating inwards, the line has an offset of its own size
		if (type === 'in') {
			currentLine.attr({
				strokeDashoffset: size,
			});
		}

		const fillLine = (direction) => {
			// Stop all previous animations before starting a new one
			currentLine.stop().animate(
				// Animate the line's offset
				{ strokeDashoffset: direction === 'in' ? 0 : `-${size}` },

				// Each line animation last 200ms
				// old value
				20,

				// The animation easing changes depending on the direction
				direction === 'in' ? window.mina.easein : window.mina.easeout,

				// Callback
				() => {
					//  Wait for loader logo to get back to it's initial state
					if (parseInt(currentLine.attr('id'), 10) === this.nbOfLines) {
						if (direction === 'in' && this.animationState === 'goOff') {
							// Animation is now off
							this.hideLoader();
							this.animationState = 'off';
							return;
						}

						// When the animation is done, wait 1000ms to start a new one
						// old value
						setTimeout(() => {
							for (let i = 0; i < this.nbOfLines; i++) {
								this.animateLines(
									direction === 'in' ? 'out' : 'in',
									this.allLines[this.lKeys[i]].obj,
									this.allLines[this.lKeys[i]].size
								);
							}
						}, 100);
					}
				}
			);
		};

		// Fill the line
		setTimeout(() => {
			fillLine(type);
		}, delay);
	},

	/**
	 * Start the animation
	 * @private
	 */
	startAnimation() {
		if (this.animationState === 'off') {
			pubSub.publish('loaderShown');
			this.animationState = 'on';
			for (let i = 0; i < this.nbOfLines; i++) {
				this.animateLines(
					'out',
					this.allLines[this.lKeys[i]].obj,
					this.allLines[this.lKeys[i]].size
				);
			}
		}
	},

	/**
	 * Hide the loader when animation has stopped
	 * @private
	 */
	hideLoader() {
		this.loaderOuterWrap.on(transitionEnd, () => {
			this.loaderOuterWrap.addClass('hide');

			// Publish loader hidden
			pubSub.publish('loaderHidden');

			// Remove no-overflow class
			$('body').removeClass('no-overflow');

			this.loaderOuterWrap.off(transitionEnd);
		});

		pubSub.publish('loaderHiding');
		this.loaderOuterWrap.addClass('fade-out');
	},

	/**
	 * Stop the animation and hide the loader
	 */
	stop() {
		if (!this.loaderOuterWrap.hasClass('fade-out')) {
			if (this.animationState === 'on') {
				// Animation is not off yet
				this.animationState = 'goOff';
			}
		}
	},

	/**
	 * Show the loader and start the animation
	 */
	start() {
		this.loaderOuterWrap.on(transitionEnd, () => {
			// Always scroll to top
			window.scrollTo(0, 0);

			// Start animation
			this.startAnimation();
			this.loaderOuterWrap.off(transitionEnd);
		});

		if (this.loaderOuterWrap.hasClass('fade-out')) {
			// Add no-overflow class
			$('body').addClass('no-overflow');

			this.loaderOuterWrap.removeClass('hide');
			setTimeout(() => {
				this.loaderOuterWrap.removeClass('fade-out');
			}, 100);
		}
	},
};
