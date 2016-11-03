var util = require('util');
module.exports = {
  log: function () {
    console.log(util.format.apply(util, Array.prototype.slice.call(arguments, 0)));
  },
  info: function () {
    arguments[0] = 'INFO: ' + arguments[0];
    console.log(util.format.apply(util, Array.prototype.slice.call(arguments, 0)));
  },
  error: function () {
    arguments[0] = 'ERROR: ' + arguments[0];
    console.log(util.format.apply(util, Array.prototype.slice.call(arguments, 0)));
  },
  warn: function () {
    arguments[0] = 'WARN: ' + arguments[0];
    console.log(util.format.apply(util, Array.prototype.slice.call(arguments, 0)));
  },
};