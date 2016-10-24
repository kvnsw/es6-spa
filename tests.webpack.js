// Get context of all tests files
var testsContext = require.context('./tests', true, /^.*\.spec\.js$/);
testsContext.keys().forEach(testsContext);

// Get context of all files we need to test
// Webpack's main entry cannot be required
var coreContext = require.context('./app/core', true, /^.*\.js$/);
coreContext.keys().forEach(coreContext);

var modulesContext = require.context('./app/services', true, /^.*\.js$/);
modulesContext.keys().forEach(modulesContext);