
var EventEmitter = require('events');
var util = require('util');
var Promise = require('bluebird');
var log = require('./lib/log');
var _ = require('lodash');

/*
options: 
{
  alias: String or false, defaults to 'framework', to disable alias, specify false
  fullMiddlewareName: boolean, defaults to false. If set true, the middle ware name are treated as full moudle name
}
*/

function Ofa (options) {
  this.middlewares = [];
  this.promise = Promise.resolve();
  this.options = options || {};
  this.log = log;
  EventEmitter.call(this);
}

util.inherits(Ofa, EventEmitter);

Ofa.prototype.use = function (middleware) {
  if(_.isString(middleware)) {
    var middlewareName = middleware;
    middleware = require(this.fullMiddlewareName ? middleware : 'ofa-' + middleware);
    middleware.middlewareName = middlewareName;
  }
  this.middlewares.push(middleware);
  return this;
};

Ofa.prototype.lift = function () {
  this.promise = this.promise.then(this._lift.bind(this));
  return this;
};

Ofa.prototype._lift = function () {
  var self = this;
  return Promise.each(this.middlewares, function (middleware) {
    if(_.isFunction(middleware)){
      return middleware.call(self);
    }
    if (_.isFunction(middleware.lift)){
      return middleware.lift.call(self);
    }
  })
  .then(function () {
    self.emit('lifted');
  })
  .catch(function (err) {
    self.emit('error', err);
    return Promise.reject(err);
  });
};

Ofa.prototype.listen = function () {
  this.promise = this.promise.then(this._listen.bind(this));
  return this;
};

Ofa.prototype._listen = function () {
  var self = this;
  return Promise.each(this.middlewares, function (middleware) {
    if (_.isFunction(middleware.listen)){
      return middleware.listen.call(self);
    }
  })
  .then(function () {
    self.emit('listened');
  })
  .catch(function (err) {
    self.emit('error', err);
    return Promise.reject(err);
  });
};

Ofa.prototype.lower = function () {
  this.promise = this.promise.then(this._lower.bind(this));
  return this;
};

Ofa.prototype._lower = function () {
  var self = this;
  return Promise.each(this.middlewares, function (middleware) {
    if (_.isFunction(middleware.lower)){
      return middleware.lower.call(self);
    }
  })
  .then(function () {
    self.emit('lowered');
  })
  .catch(function (err) {
    self.emit('error', err);
    return Promise.reject(err);
  });
};

module.exports = function (options) {
  options = options || {};
  global.ofa = new Ofa();
  if(options.alias !== false) {
    global[options.alias || 'framework'] = global.ofa;
  }
  return global.ofa;
};

