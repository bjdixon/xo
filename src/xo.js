(function () {
  "use strict";

  var root = this,
    previous_xo = root.xo,
    xo;

  /**
   * @namespace xo
   * @version 0.3.2
  */
  xo = {};
  xo.VERSION = '0.3.2';

  function identity(x) {
    return x;
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
   * Type check for Boolean
   *
   * @example
   * xo.isBoolean(true); // true
   * xo.isBoolean('true'); // false
   *
   * @function
   * @name xo.isBoolean
   * @param {*} test - The argument to be checked
   * @return {Boolean}
  */
  xo.isBoolean = is('Boolean');
 
  /**
   * Type check for Number
   *
   * @example
   * xo.isNumber(42); // true
   * xo.isNumber('true'); // false
   *
   * @function
   * @name xo.isNumber
   * @param {*} test - The argument to be checked
   * @return {Boolean}
  */ 
  xo.isNumber = is('Number');
 
  /**
   * Type check for String 
   *
   * @example
   * xo.isString('true'); // true
   * xo.isString(true); // false
   *
   * @function
   * @name xo.isString
   * @param {*} test - The argument to be checked
   * @return {Boolean}
  */ 
  xo.isString = is('String');
 
  /**
   * Type check for Object
   *
   * @example
   * xo.isObject({ a: true }); // true
   * xo.isObject(true); // false
   *
   * @function
   * @name xo.isObject
   * @param {*} test - The argument to be checked
   * @return {Boolean}
  */ 
  xo.isObject = is('Object');
 
  /**
   * Type check for Array
   *
   * @example
   * xo.isArray([1, 2, 3]); // true
   * xo.isArray(true); // false
   *
   * @function
   * @name xo.isArray
   * @param {*} test - The argument to be checked
   * @return {Boolean}
  */ 
  xo.isArray = is('Array');
 
  /**
   * Type check for Function
   *
   * @example
   * xo.isFunction(function(){ return true; }); // true
   * xo.isFunction(true); // false
   *
   * @function
   * @name xo.isFunction
   * @param {*} test - The argument to be checked
   * @return {Boolean}
  */ 
  xo.isFunction = is('Function');

  /**
   * Allows users to avoid conflicts over the xo name
   *
   * @example
   * var ox = xo.noConflict();
   *
   * @function
   * @name xo.noConflict
   * @return {Object}
  */
  xo.noConflict = function() {
    root.xo = previous_xo;
    return xo;
  };

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
   * @function
   * @name xo.partial
   * @param {Function} fn - Partially apply this function prefilling some arguments
   * @param {*} [args] - Initial arguments that the partially applied function will be applied to.
   * @return {Function}
  */
  xo.partial = function(fn) {
    var initialArgs = Array.prototype.slice.call(arguments, 1);
    return function() {
      var remainingArgs = Array.prototype.slice.call(arguments);
      return fn.apply(this, initialArgs.concat(remainingArgs));
    };
  };

  /**
   * Takes an n-dimensional nested array.
   * Returns a flattened 1-dimensional array. 
   *
   * @example
   * var test = [0, 1, [2, 3], [4, [5, 6]], 7, [8, [9]]];
   * xo.flatten(test); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
   *
   * @function
   * @name xo.flatten
   * @param {Array} arr - The array that will be recursively flattened
   * @return {Array}
  */
  xo.flatten = function(arr) {
    var output = [];
    arr.forEach(function(val) {
      output = output.concat(Array.isArray(val) ? xo.flatten(val) : val);
    });
    return output;
  };

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
   * @function
   * @name xo.filter
   * @param {Array} arr - The array containing the elements to test
   * @param {Function} predicate - The function against which each element of the array will be tested
   * @return {Array}
  */
  xo.filter = function(arr, predicate) {
    var result = [],
      idx,
      len;
    for (idx = 0, len = arr.length; idx < len; idx += 1) {
      if (predicate(arr[idx])) {
        result.push(arr[idx]);
      }
    }
    return result;
  };

  /**
   * Takes an array.
   * Returns an array with all falsy values removed
   *
   * @example
   * var test = [1, , false, 2, 3, false];
   * xo.compact(test); // [1, 2, 3]
   *
   * @function
   * @name xo.compact
   * @param {Array} arr - The array containing the elements to test
   * @return {Array}
  */
  xo.compact = function(arr) {
    return xo.filter(arr, identity);
  };

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
   * @function
   * @name xo.findIndex
   * @param {Array} arr - The array containing the elements to test
   * @param {Function} predicate - The function against which each element of the array will be tested
   * @return {Number}
  */
  xo.findIndex = function(arr, predicate) {
    var idx,
      len;
    for (idx = 0, len = arr.length; idx < len; idx += 1) {
      if (predicate(arr[idx])) {
        return idx;
      }
    }
    return -1;
  };

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
   * @function
   * @name xo.memoize
   * @param {Function} fn - The (expensive) function that will have it's return values cached
   * @return {Function}
  */
  xo.memoize = function(fn) {
    var cache = {};
    return function() {
      var key = JSON.stringify(arguments);
      return cache[key] || (cache[key] = fn.apply(this, arguments));
    };
  };

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
   * @function
   * @name xo.maybe
   * @param {Function} fn - The function to be invoked
   * @return {Function}
  */
  xo.maybe = function(fn) {
    return function() {
      var args = Array.prototype.slice.call(arguments);
      if (!args.length || args.some(function(val) { return val == null; })) {
        return;
      }
      return fn.apply(this, args);
    };
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = xo; // jshint ignore:line
    }
    exports.xo = xo;
  } else {
    root.xo = xo;
  }

}).call(this);
