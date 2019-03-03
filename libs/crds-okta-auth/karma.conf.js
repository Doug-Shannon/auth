// this is used for local development

const baseConfig = require("../../karma.conf");

module.exports = function(config) {
  baseConfig.plugins.push(require("karma-chrome-launcher"));
  baseConfig.plugins.push(require("karma-phantomjs-launcher"));
  baseConfig.reporters = ["mocha"];
  baseConfig.browsers = ["ChromeHeadless"];
  config.set(baseConfig);
};
