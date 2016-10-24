// =============================
// Dependencies
// =============================
// Webpack
import webpack from 'webpack';

// Path
import path from 'path';

// HTML Webpack plugin
import HtmlWebpackPlugin from 'html-webpack-plugin';

// Copy Webpack plugin
import CopyWebpackPlugin from 'copy-webpack-plugin';

// PostCss
import postcssImport from 'postcss-import';
import cssnext from 'postcss-cssnext';
import browserReporter from 'postcss-browser-reporter';
import reporter from 'postcss-reporter';

// =============================
// Dev env config
// =============================
let appOutput;
let devtool;
let plugins;
let pubAppOutput;

// In dev/production mode, we use eslint as a JS preloader
let jsPreloader = {
	test: /\.js$/,
	exclude: /node_modules/,
	loader: 'eslint',
};

if (process.env.NODE_ENV === 'production') {
	appOutput = path.join(__dirname, '/dist/scripts');
	devtool = null;
	plugins = [
		// Generate HTML File for production
		new HtmlWebpackPlugin({
			filename: path.join(__dirname, '/dist/index.html'),
			template: path.join(__dirname, '/app/index.html'),
			showErrors: false,
			hash: true,
			cache: true,
			minify: {
				collapseWhitespace: true,
				removeComments: true,
			},
		}),

		// Copy all favicon files to production folder
		new CopyWebpackPlugin([
			{
				from: path.join(__dirname, '/app/assets/favicon'),
				to: path.join(__dirname, '/dist/favicon'),
			},
		]),

		// Prevent the inclusion of duplicate code into bundle 
		new webpack.optimize.DedupePlugin(),
		// Uglify JS in production mode
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				screw_ie8: true,
			},
			mangle: false,
			sourcemap: false,
		}),

		// Make jquery available globally
		new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            Promise: 'imports?this=>global!exports?global.Promise!es6-promise',
        }),

		// Global variables
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('development'),
			},
		}),
	];
} else if (process.env.NODE_ENV === 'development') {
	appOutput = path.join(__dirname, '/build/scripts');
	devtool = 'inline-sourcemap';
	plugins = [
		// Generate HTML File for build
		new HtmlWebpackPlugin({
			filename: path.join(__dirname, '/build/index.html'),
			template: path.join(__dirname, '/app/index.html'),
			showErrors: true,
		}),

		// Copy all favicon files to build folder
		new CopyWebpackPlugin([
			{
				from: path.join(__dirname, '/app/assets/favicon'),
				to: path.join(__dirname, '/build/favicon'),
			},
		]),

		// Make jquery available globally
		new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            Promise: 'imports?this=>global!exports?global.Promise!es6-promise',
        }),

		// Global variables
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('development'),
			},
		}),
	];
} else if (process.env.NODE_ENV === 'test') {
	// In test mode, we use babel-istanbul as a JS preloader to get coverage
	jsPreloader = {
		test: /\.js$/,
		exclude: /(node_modules|app\/tests|tests.webpack.js)/,
		loader: 'babel-istanbul',
		query: {
			cacheDirectory: true,
		},
	};
}

// =============================
// Config
// =============================
export default {
	entry: {
		app: [path.join(__dirname, '/app/main.js')],
	},

	output: {
		path: appOutput,
		publicPath: './scripts/',
		filename: 'main.js',
	},

	devtool,

	module: {
		preLoaders: [
			// Javascript preloader (depends on dev env)
			jsPreloader,

			// Stylesheets linting
			{
				test: /\.css$/,
				loader: 'stylelint',
			},
		],
		loaders: [
			// Template loader (Handlebars)
			{
				test: /\.handlebars$/,
				loader: 'handlebars-loader',
			},

			// ES6 Javascript loader (Babel)
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel',
			},

			// Snap SVG (needs hack)
			{
				test: require.resolve('snapsvg'),
				loader: 'imports-loader?this=>window,fix=>module.exports=0',
			},

			// Stylesheets loader
				{
				test: /\.css$/,
				loader: 'style-loader!css-loader!postcss-loader',
			},

			// Url loader
			{
				test: /\.(png|jpg|jpeg|gif)$/,
				loader: 'url-loader?limit=10000&name=assets/[hash].[ext]',
			},

			{
				test: /\.svg$/,
				loader: 'url-loader?limit=10000&name=assets/[hash].[ext]',
				exclude: path.join(__dirname, '/app/assets/ui'),
			},

			// Load fonts with url loader (do not convert to base64)
			{
				test: /\.(svg|woff|woff2|eot|ttf)$/,
				loader: 'url-loader?limit=1&name=assets/[hash].[ext]',
				include: path.join(__dirname, '/app/assets/fonts'),
			},

			// Load SVG inline (except fonts)
			{
				test: /\.svg$/,
				loader: 'svg-inline',
				exclude: [path.join(__dirname, '/app/assets/fonts'), path.join(__dirname, '/app/assets/other')],
			},
		],
	},

	// Javascript linting config path (we currently use airbnb's eslint config base)
	eslint: {
		configFile: path.join(__dirname, '/.eslintrc'),
	},

	// Style linting config path (we currently use stylelint's standard config)
	stylelint: {
		configFile: path.join(__dirname, '/stylelint.config.js'),
	},

	// PostCss Config
	postcss: () => [
		postcssImport({ addDependencyTo: webpack }),
		cssnext({ autoprefixer: { browsers: 'last 2 versions' } }),
		browserReporter,
		reporter,
	],

	plugins,
};
