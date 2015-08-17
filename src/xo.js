(function () {
  "use strict";
  var root = this,
    previous_xo = root.xo,
    xo;

  xo = {
    VERSION: '0.3.1',
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
    isFunction: is('Function'),
    maybe: maybe
  };

  /**
   * Allows users to avoid conflicts over the xo name
   *
   * @return {Object}
  */
  function noConflict() {
    root.xo = previous_xo;
    return xo;
  }

  /**
   * Takes a function with zero or more arguments.
   * Returns a function that can be invoked with remaining arguments at a later time
   *
   * @Param {Function} fn
   * @return {Function}
  */
  function partial(fn) {
    var initialArgs = Array.prototype.slice.call(arguments, 1);
    return function() {
      var remainingArgs = Array.prototype.slice.call(arguments);
      return fn.apply(this, initialArgs.concat(remainingArgs));
    };
  }

  /**
   * Takes an n-dimensional nested array.
   * Returns a flattened 1-dimensional array. 
   *
   * @Param {Array} arr
   * @return {Array}
  */
  function flatten(arr) {
    var output = [];
    arr.forEach(function(val) {
      output = output.concat(Array.isArray(val) ? flatten(val) : val);
    });
    return output;
  }

  /**
   * Takes an array and a predicate function.
   * Returns an array with only those terms that pass the predicate
   *
   * @Param {Array} arr
   * @Param {Function} predicate
   * @return {Array}
  */
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

  /**
   * Takes an array.
   * Returns an array with all falsy values removed
   *
   * @Param {Array} arr
   * @return {Array}
  */
  function compact(arr) {
    return arr.reduce(function(memo, val) {
      return val ? memo.concat(val) : memo;
    }, []);
  }

  /**
   * Takes an array and a predicate function.
   * Returns the index of the first term that passes the predicate 
   *
   * @Param {Array} arr
   * @Param {Function} predicate
   * @return {Number}
  */
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

  /**
   * Takes a function and returns a function.
   * Invoking the returned function will return cached results if the same
   * arguments have been provided during previous invocations.
   *
   * @Param {Function} fn 
   * @return {Function}
  */
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

  /**
   * Takes a function and returns a function.
   * The returned function will not be called if supplied with null
   * or undefined arguments
   *
   * @Param {Function} fn 
   * @return {Function}
  */
  function maybe(fn) {
    return function() {
      var args = Array.prototype.slice.call(arguments);
      if (!args.length || args.some(function(val) { return val == null; })) {
        return;
      }
      return fn.apply(this, args);
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
