// Import webpack config
import webpackConfig from './webpack.config.babel.js';

// =============================
// Config
// =============================

export default (config) => {
	config.set({
		basePath: '',

		frameworks: ['jasmine'],

		files: [
			'./node_modules/babel-polyfill/dist/polyfill.js',
			'./node_modules/phantomjs-polyfill/bind-polyfill.js',
			'tests.webpack.js'
		],

		exclude: [],

		preprocessors: {
			'tests.webpack.js': ['webpack', 'sourcemap']
		},

		reporters: ['progress', 'coverage'],

		webpack: webpackConfig,

		coverageReporter: {
			dir: 'coverage/',
			reporters: [
				{ type: 'html', subdir: 'html' },
				{ type: 'lcov', subdir: 'lcov' },
				{ type: 'json', subdir: 'json' },
				{ type: 'text-summary', subdir: 'txt' }
			]
		},

		port: 9876,

		colors: true,

		logLevel: config.LOG_INFO,

		browsers: ['PhantomJS'],

		browserNoActivityTimeout: 200000,

		plugins: [
			'karma-webpack',
			'karma-jasmine',
			'karma-coverage',
			'karma-phantomjs-launcher',
			'karma-sourcemap-loader'
		]
	});
}