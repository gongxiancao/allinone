var async = require('async');

function Framework () {
  this.middlewares = [];
}

Framework.prototype.use = function (middleware) {
  this.middlewares.push(middleware);
  return this;
};

Framework.prototype.lift = function (done) {
  var self = this;
  async.eachSeries(this.middlewares, function (middleware, done) {
    middleware.call(self, done);
  }, done.bind(self));
  return this;
};

module.exports = function () {
  return global.framework = new Framework();
};
