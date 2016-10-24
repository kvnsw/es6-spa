// Require babel-core/register to enable es6 config
require('babel-core/register');
module.exports = require('./karma.conf.babel').default;