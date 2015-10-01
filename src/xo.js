(function () {
  "use strict";
  var root = this,
    previous_xo = root.xo,
    xo;
  /**
   * @module xo
   * @version 0.3.1
  */
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
   * @example
   * var ox = xo.noConflict();
   *
   * @alias module:xo.noConflict
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
   * @example
   * var greet = function(greeting, name) {
   *   return [greeting, name].join(' ');
   * };
   *
   * var sayHi = xo.partial(greet, 'Hi');
   * sayHi('Bob'); // "Hi Bob"
   *
   * @alias module:xo.partial
   * @param {Function} fn
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
   * @example
   * var test = [0, 1, [2, 3], [4, [5, 6]], 7, [8, [9]]];
   * xo.flatten(test); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
   *
   * @alias module:xo.flatten
   * @param {Array} arr
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
   * @example
   * function compare(id, obj) {
   *   return id === obj.id;
   * }
   * var objArr = [
   *   { name: 'a', id: '001' },
   *   { name: 'b', id: '003' },
   *   { name: 'c', id: '003' },
   *   { name: 'd', id: '004' }
   * ];
   * xo.filter(objArr, xo.partial(compare, '003')); // [{ name: 'b', id: '003'},{name: 'c', id: '003'}] 
   *
   * @alias module:xo.filter
   * @param {Array} arr
   * @param {Function} predicate
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
   * @example
   * var test = [1, , false, 2, 3, false];
   * xo.compact(test); // [1, 2, 3]
   *
   * @alias module:xo.compact
   * @param {Array} arr
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
   * @example
   * function compare(id, obj) {
   *   return id === obj.id;
   * }
   * var objArr = [
   *   { name: 'a', id: '001' },
   *   { name: 'b', id: '002' },
   *   { name: 'c', id: '003' },
   *   { name: 'd', id: '004' }
   * ];
   * xo.findIndex(objArr, xo.partial(compare, '003')); // 2
   *
   * @alias module:xo.findIndex
   * @param {Array} arr
   * @param {Function} predicate
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
   * @example
   * var upper = function(str) {
   *   return str.toUpperCase();
   * };
   * var memoUpper = xo.memoize(upper);
   * memoUpper('foo'); // "FOO"
   * memoUpper('foo'); // "FOO" (cached version)
   *
   * @alias module:xo.memoize
   * @param {Function} fn 
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
   * @example
   * var sum = function(a, b) {
   *   return a + b;
   * }
   * var maybeSum = xo.maybe(sum);
   * maybeSum(2, 3); // 5
   * maybeSum(null, 3); // doesn't invoke sum
   *
   * @alias module:xo.maybe
   * @param {Function} fn 
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
