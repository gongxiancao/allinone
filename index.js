var async = require('async');
var EventEmitter = require('events');
var util = require('util');
var _ = require('lodash');

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
    if(_.isFunction(middleware)){
      return middleware.call(self, done);
    }
    if (_.isFunction(middleware.lift)){
      return middleware.lift.call(self, done);
    }
    done();
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

Framework.prototype.lower = function (done) {
  var self = this;
  async.eachSeries(this.middlewares.reverse(), function (middleware, done) {
    if(_.isFunction(middleware.lower)) {
      middleware.lower.call(self, function (err) {
        if(err) {
          self.emit('error', err);
        }
        done();
      });
    } else {
      done();
    }
  }, function () {
    self.emit('lowered');
    done();
  });
  return this;
};


module.exports = function () {
  return global.framework = new Framework();
};
