(function () {
  "use strict";
  var root = this,
    previous_xo = root.xo,
    xo;

  xo = {
    VERSION: '0.2.0',
    noConflict: noConflict,
    memoize: memoize,
    flatten: flatten,
    compact: compact,
    partial: partial,
    findIndex: findIndex,
    filter: filter,
    isBoolean: is('Boolean'),
    isNumber: is('Number'),
    isString: is('String'),
    isObject: is('Object'),
    isArray: is('Array'),
    isFunction: is('Function')
  };

  function noConflict() {
    root.xo = previous_xo;
    return xo;
  }

  function partial(fn) {
    var initialArgs = Array.prototype.slice.call(arguments, 1);
    return function() {
      var remainingArgs = Array.prototype.slice.call(arguments);
      return fn.apply(this, initialArgs.concat(remainingArgs));
    };
  }

  function flatten(arr) {
    var output = [];
    arr.forEach(function(val) {
      output = output.concat(Array.isArray(val) ? flatten(val) : val);
    });
    return output;
  }

  function filter(arr, predicate) {
    var result = [],
      idx,
      len;
    for (idx = 0, len = arr.length; idx < len; idx += 1) {
      if (predicate(arr[idx])) {
        result.push(arr[idx]);
      }
    }
    return result;
  }

  function compact(arr) {
    return arr.reduce(function(memo, val) {
      return val ? memo.concat(val) : memo;
    }, []);
  }

  function findIndex(arr, predicate) {
    var idx,
      len;
    for (idx = 0, len = arr.length; idx < len; idx += 1) {
      if (predicate(arr[idx])) {
        return idx;
      }
    }
    return -1;
  }

  function memoize(fn) {
    var cache = {};
    return function() {
      var key = JSON.stringify(arguments);
      return cache[key] || (cache[key] = fn.apply(this, arguments));
    };
  }

  function is(type) {
    var fastTypes = ['undefined', 'boolean', 'number', 'string', 'symbol', 'function'];
    if (fastTypes.indexOf(type.toLowerCase()) >= 0) {
      type = type.toLowerCase();
      return function(test) {
        return typeof test === type;
      };
    }
    type = '[object ' + type + ']';
    return function(test) {
      return Object.prototype.toString.call(test) === type;
    };
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = xo; // jshint ignore:line
    }
    exports.xo = xo;
  } else {
    root.xo = xo;
  }

}).call(this);
