var async = require('async');
var EventEmitter = require('events');
var util = require('util');

function Framework () {
  this.middlewares = [];
  EventEmitter.call(this);
}

util.inherits(Framework, EventEmitter);

Framework.prototype.use = function (middleware) {
  this.middlewares.push(middleware);
  return this;
};

Framework.prototype.lift = function (done) {
  var self = this;
  async.eachSeries(this.middlewares, function (middleware, done) {
    middleware.call(self, done);
  }, function (err) {
    if(err) {
      self.emit('error', err);
      return done(err);
    }
    self.emit('lifted');
    done();
  });
  return this;
};

module.exports = function () {
  return global.framework = new Framework();
};
