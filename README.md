# ES6 - Single Page Application

***

## Background

After developping numerous projects on modern Front-End frameworks such as Angular and Angular2, I realised that I was bothered in not totally understanding the core principles of SPAs. The purpose of this project is to build a minimal Single Page Application from scratch in order to grasp the underlying concepts of single page application frameworks.

This single page application framework is currently used by http://passerelle.co

You can find the documentation at http://passerelle.co/es6spa-docs

Feedback and suggestions on the design are greatly appreciated!

### This framework uses
- [Webpack](https://github.com/webpack/webpack) as a module bundler
- [Babel](https://github.com/babel/babel) as a js transpiler to use ES6
- [pubsub-js](https://github.com/mroderick/PubSubJS) as a messaging pattern
- [jQuery](https://github.com/jquery/jquery) to simplify DOM manipulation
- [Eslint](https://github.com/eslint/eslint) for javascript linting
- [Handlebars](https://github.com/wycats/handlebars.js/) for templating
- [Postcss](https://github.com/postcss/postcss) as a css post-processor
- [cssnext](https://github.com/MoOx/postcss-cssnext) for modern css syntax
- [Stylelint](https://github.com/stylelint/stylelint) for css linting
- [Karma](https://github.com/karma-runner/karma) as a test runner
- [Jasmine](https://github.com/jasmine/jasmine) as a testing framework
- [jsDoc](https://github.com/jsdoc3/jsdoc) for code documentation

### Framework includes

- A routing system that can handle route parameters, query parameters, url spamming and more
- Two Controllers accompanied by their handlebars templates and stylesheets to serve as examples
- Pre-written configuration files, you can modify them to suit your needs
- A minimal custom cssnext framework
- A loader animated with Snap.svg (initially created for http://passerelle.co)
- Some cool custom services such as ajaxManager (promisifies Ajax request) or tools (utility functions)

## Quick Start

```sh
$ mkdir new_dir && cd new_dir
$ git clone this repository
$ npm install
$ npm run watch
```

Finally, open `http://yourwebsite.com/yourapplocation/build` in your browser.

## Structure overview

```
es6-spa/
  |- app/
  |  |- assets/
  |  |  |- <static files>
  |  |- config/
  |  |  |- <configuration files>
  |  |- core/
  |  |  |- <application logic>
  |  |- pages/
  |  |  |- <page controllers, templates, styles>
  |  |- services/
  |  |  |- <custom services>
  |  |- styles/
  |  |  |- <global styles>
  |  |- index.html
  |  |- main.js
  |- tests/
  |  |- <unit tests>
  |- .babelrc
  |- .editorconfig
  |- .eslintignore
  |- .eslintrc
  |- jsdoc.json
  |- karma.conf.babel.js
  |- karma.conf.js
  |- package.json
  |- stylelint.config.js
  |- tests.webpack.js
  |- webpack.config.babel.js
```

- `.babelrc` - Babel configuration file
- `.editorconfig` - Classic editor configuration file
- `.eslintignore` - Files/directories to be ignored by Eslint
- `.eslintrc` - Eslint configuration file. This framework uses [eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb).
  `jsdoc.json` - jsDocs configuration file
- `karma.conf.babel.js` - Karma configuration file written in ES6
- `karma.conf.js` - Use babel register hook to support ES6 configuration
- `package.json` - Application meta data. All our NPM dependencies are listed here
- `stylelint.config.js` - Stylelint configuration file. This framework uses [stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard)
- `tests.webpack.js` - Specify directories to be tested by Karma
- `webpack.config.babel.js` - Webpack configuration file written in ES6

## Commands

```sh
$ npm run build
```
Compiles files in development mode to `build/` folder.

```sh
$ npm run watch
```
Launches the build command and recompiles anytime a file change occurs.

```sh
$ npm run compile
```
Compiles files ready for production in `dist/`.

```sh
$ npm run docs
```
Creates documentation files in `docs/` using jsDoc

```sh
$ npm run test
```
Launches Karma to run tests and creates coverage files in `coverage/`.

```sh
$ npm run test:watch
```
Launches the test command and relaunches Karma tests anytime a file change occurs.

## Work in progress

All unit tests are currently in the process of being rewritten.