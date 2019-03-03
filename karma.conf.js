// process.env.CHROME_BIN = require("puppeteer").executablePath();

module.exports = {
  basePath: "",
  frameworks: ["jasmine", "@angular-devkit/build-angular"],
  plugins: [
    require("karma-jasmine"),
    require("karma-mocha-reporter"),
    require("karma-jasmine-html-reporter"),
    require("karma-coverage-istanbul-reporter"),
    require("@angular-devkit/build-angular/plugins/karma")
  ],
  client: {
    clearContext: false // leave Jasmine Spec Runner output visible in browser
  },
  files: [],
  preprocessors: {},
  mime: {
    "text/x-typescript": ["ts", "tsx"]
  },
  coverageIstanbulReporter: {
    dir: require("path").join(__dirname, "coverage"),
    reports: ["html", "lcovonly"],
    fixWebpackSourcePaths: true
  },
  mochaReporter: {
    output: "full",
    ignoreSkipped: true
  },
  port: 9876,
  colors: true,
  autoWatch: true,
  customLaunchers: {},
  browsers: ["ChromeHeadless"],
  singleRun: false
};
