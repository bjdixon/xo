(function () {
  'use strict';

  const root = this,
    previous_xo = root.xo,
    xo = {};

  /**
   * @namespace xo
   * @version 2.3.0
  */
  xo.VERSION = '2.3.0';

  function identity(x) {
    return x;
  }

  function is(type) {
    const fastTypes = ['undefined', 'boolean', 'number', 'string', 'symbol', 'function'];
    if (fastTypes.indexOf(type.toLowerCase()) >= 0) {
      type = type.toLowerCase();
      return (test) => typeof test === type;
    }
    type = '[object ' + type + ']';
    return (test) =>  Object.prototype.toString.call(test) === type;
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
   * const ox = xo.noConflict();
   *
   * @function
   * @name xo.noConflict
   * @return {Object}
  */
  xo.noConflict = () => {
    root.xo = previous_xo;
    return xo;
  };

  /**
   * Takes a function with zero or more arguments.
   * Returns a function that can be invoked with the remaining arguments at a later time
   *
   * @example
   * const greet = (greeting, name) => [greeting, name].join(' ');
   *
   * const sayHi = xo.partial(greet, 'Hi');
   * sayHi('Bob'); // "Hi Bob"
   *
   * @function
   * @name xo.partial
   * @param {Function} fn - Partially apply this function prefilling some arguments
   * @param {*} [args] - Initial arguments that the partially applied function will be applied to.
   * @return {Function}
  */
  xo.partial = function (fn) {
    const initialArgs = Array.prototype.slice.call(arguments, 1);
    return function () {
      return fn.apply(this, initialArgs.concat(Array.prototype.slice.call(arguments)));
    };
  };

  /**
   * Takes a function with zero or more arguments.
   * Returns a function that can be invoked with remaining arguments at a later time
   *
   * @example
   * const greet = (greeting, name) => [greeting, name].join(' ');
   *
   * const sayHi = xo.curry(greet, 'Hi');
   * sayHi('Bob'); // "Hi Bob"
   *
   * @function
   * @name xo.curry
   * @param {Function} fn - Partially apply this function prefilling some arguments
   * @param {*} [args] - Initial arguments that the partially applied function will be applied to.
   * @return {Function}
  */
  xo.curry = function (fn) {
    const initialArgs = Array.prototype.slice.call(arguments, 1);
    return function () {
      const args = initialArgs.concat(Array.prototype.slice.call(arguments));
      return (args.length < fn.length) ? xo.curry.apply(this, [fn].concat(args)) : fn.apply(this, args);
    };
  };

  /**
   * Takes an n-dimensional nested array.
   * Returns a flattened 1-dimensional array. 
   *
   * @example
   * const test = [0, 1, [2, 3], [4, [5, 6]], 7, [8, [9]]];
   * xo.flatten(test); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
   *
   * @function
   * @name xo.flatten
   * @param {Array} arr - The array that will be recursively flattened
   * @return {Array}
  */
  xo.flatten = (arr) => {
    let output = [];
    arr.forEach((val) => output = output.concat(Array.isArray(val) ? xo.flatten(val) : val));
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
   * const objArr = [
   *   { name: 'a', id: '001' },
   *   { name: 'b', id: '003' },
   *   { name: 'c', id: '003' },
   *   { name: 'd', id: '004' }
   * ];
   * xo.filter(xo.curry(compare, '003'), objArr); // [{ name: 'b', id: '003'},{name: 'c', id: '003'}] 
   *
   * @function
   * @name xo.filter
   * @param {Function} predicate - The function against which each element of the array will be tested
   * @param {Array} arr - The array containing the elements to test
   * @return {Array}
  */
  xo.filter = (predicate, arr) => {
    let result = [],
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
   * const test = [1, , false, 2, 3, false];
   * xo.compact(test); // [1, 2, 3]
   *
   * @function
   * @name xo.compact
   * @param {Array} arr - The array containing the elements to test
   * @return {Array}
  */
  xo.compact = (arr) => {
    return xo.filter(identity, arr);
  };

  /**
   * Takes an array and a predicate function.
   * Returns the index of the first term that passes the predicate 
   *
   * @example
   * function compare(id, obj) {
   *   return id === obj.id;
   * }
   * const objArr = [
   *   { name: 'a', id: '001' },
   *   { name: 'b', id: '002' },
   *   { name: 'c', id: '003' },
   *   { name: 'd', id: '004' }
   * ];
   * xo.findIndex(xo.curry(compare, '003'), objArr); // 2
   *
   * @function
   * @name xo.findIndex
   * @param {Function} predicate - The function against which each element of the array will be tested
   * @param {Array} arr - The array containing the elements to test
   * @return {Number}
  */
  xo.findIndex = (predicate, arr) => {
    let idx,
      len;
    for (idx = 0, len = arr.length; idx < len; idx += 1) {
      if (predicate(arr[idx])) {
        return idx;
      }
    }
    return -1;
  };

  /**
   * Takes an object and a predicate function.
   * Returns the key of the first term that passes the predicate 
   *
   * @example
   * function compare(id, obj) {
   *   return id === obj.id;
   * }
   * const obj = {
   *   hello: { name: 'a', id: '001' },
   *   goodbye: { name: 'b', id: '002' },
   *   yes: { name: 'c', id: '003' },
   *   no: { name: 'd', id: '004' }
   * };
   * xo.findKey(obj, xo.curry(compare, '003')); // yes 
   *
   * @function
   * @name xo.findKey
   * @param {Object} obj - The object containing the elements to test
   * @param {Function} predicate - The function against which each property of the object will be tested
   * @return {String}
  */
  xo.findKey = (obj, predicate) => {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop) && predicate(obj[prop])) {
        return prop;
      }
    }
    return null;
  };

  /**
   * Takes an object or an array  and a predicate function.
   * Returns the value of the first term that passes the predicate 
   *
   * @example
   * function compare(id, obj) {
   *   return id === obj.id;
   * }
   * const obj = {
   *   hello: { name: 'a', id: '001' },
   *   goodbye: { name: 'b', id: '002' },
   *   yes: { name: 'c', id: '003' },
   *   no: { name: 'd', id: '004' }
   * };
   * xo.find(obj, xo.curry(compare, '003')); // {yes: { name: 'a', id: '003' }} 
   *
   * @function
   * @name xo.find
   * @param {Object} {Array} collection - The object or array containing the elements to test
   * @param {Function} predicate - The function against which each property of the collection will be tested
   * @return {String} {Number}
  */
  xo.find = (collection, predicate) => {
    if (xo.isArray(collection)) {
      return collection[xo.findIndex(predicate, collection)];
    }
    if (xo.isObject(collection)) {
      return collection[xo.findKey(collection, predicate)];
    }
  };

  /**
   * Takes a function and returns a function.
   * Invoking the returned function will return cached results if the same
   * arguments have been provided during previous invocations.
   *
   * @example
   * const upper = (str) => str.toUpperCase();
   *
   * const memoUpper = xo.memoize(upper);
   * memoUpper('foo'); // "FOO"
   * memoUpper('foo'); // "FOO" (cached version)
   *
   * @function
   * @name xo.memoize
   * @param {Function} fn - The (expensive) function that will have it's return values cached
   * @return {Function}
  */
  xo.memoize = (fn) => {
    let cache = {};
    return function () {
      const key = JSON.stringify(arguments);
      return cache[key] || (cache[key] = fn.apply(this, arguments));
    };
  };

  /**
   * Takes a function and returns a function.
   * The returned function will not be called if supplied with null
   * or undefined arguments
   * 
   * @example
   * const sum = (a, b) => a + b;
   *
   * const maybeSum = xo.maybe(sum);
   * maybeSum(2, 3); // 5
   * maybeSum(null, 3); // doesn't invoke sum
   *
   * @function
   * @name xo.maybe
   * @param {Function} fn - The function to be invoked
   * @return {Function}
  */
  xo.maybe = (fn) => {
    return function () {
      const args = Array.prototype.slice.call(arguments);
      if (!args.length || args.some((val) => val == null)) {
        return;
      }
      return fn.apply(this, args);
    };
  };

  /**
   * Takes functions and returns a function.
   * The returned function when invoked will invoke each function
   * that was supplied as an argument to compose passing the result of
   * each invocation as the argument to the next function. The functions
   * supplied as arguments are invoked in reverse order, with the last
   * argument being called first
   *
   * @example
   * const increment = (a) => a + 1;
   * const square = (a) => a * a;
   *
   * const squarePlusOne = xo.compose(increment, square);
   * squarePlusOne(3); // 10
   *
   * @function
   * @name xo.compose
   * @param {Function} [fns] - The functions to be composed
   * @return {Function}
  */
  xo.compose = function () {
    let funcs = Array.prototype.slice.call(arguments);
    return function () {
      let args = arguments;
      while (funcs.length) {
        args = [funcs.pop().apply(this, args)];
      }
      return args[0];
    };
  };

  /**
   * Takes functions and returns a function.
   * The returned function when invoked will invoke each function
   * that was supplied as an argument to compose passing the result of
   * each invocation as the argument to the next function
   *
   * @example
   * const increment = (a) => a + 1;
   * const square = (a) => a * a;
   *
   * const plusOneSquare = xo.pipe(increment, square);
   * plusOneSquare(3); // 16
   *
   * @function
   * @name xo.pipe
   * @param {Function} [fns] - The functions to be composed
   * @return {Function}
  */
  xo.pipe = function () {
    let funcs = Array.prototype.slice.call(arguments);
    return function () {
      let args = arguments;
      while (funcs.length) {
        args = [funcs.shift().apply(this, args)];
      }
      return args[0];
    };
  };

  /**
   * Takes an array and a function.
   * Returns an array that is the result of having the function applied
   * to each term of the supplied array.
   *
   * @example
   * const arr = [1, 2, 3, 4];
   * const square = (a) => a * a;
   *
   * const out = xo.map(square, arr); // => [1, 4, 9, 16];
   *
   * @function
   * @name xo.map
   * @param {Function} callback - The function to be applied to each term of the supplied array
   * @param {Array} collection - The array that we're operating on
   * @return {Array}
   */
  xo.map = (callback, collection) => {
    let output = [],
      idx,
      len;
    for (idx = 0, len = collection.length; idx < len; idx += 1) {
      output.push(callback(collection[idx]));
    }
    return output;
  };

  /**
   * Takes an array, an initial value and a function.
   * Returns a single value that is the result of having the function applied
   * to each term of the supplied array.
   *
   * @example
   * const arr = [1, 2, 3, 4];
   * const sum = (a, b) => a + b;
   *
   * const out = xo.reduce(sum, 0, arr); // => 10;
   *
   * @function
   * @name xo.reduce
   * @param {Function} callback - The function to be applied to each term of the supplied array
   * @param {*} initialValue - The value to use as the first argument to the first call of the callback 
   * @param {Array} collection - The array that we're operating on
   * @return {*}
   */
  xo.reduce = (callback, initialValue, collection) => {
    let output = initialValue,
      idx,
      len;
    for (idx = 0, len = collection.length; idx < len; idx += 1) {
      output = callback(output, collection[idx]);
    }
    return output;
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
