'use strict';
const xo = require('..');

describe('xo.VERSION', function() {

  it('returns correct version number', function() {
    expect(xo.VERSION).toBe('2.0.0');
  });

});

describe('xo.noConflict', function() {

  const ox = xo.noConflict();

  it('can be assigned to another namespace', function() {
    expect(ox.hasOwnProperty('memoize')).toEqual(true);
  });

  it('alternate namespace version can coexist with xo assigned a different value', function() {
    const xo = { a: 1, b: 2 };
    expect(ox.hasOwnProperty('flatten')).toEqual(true);
    expect(xo).toEqual({ a: 1, b: 2 });
  });

});

describe('xo.memoize', function() {

  it('returns same value as non memoized functions (single argument)', function() {
    const upper = function(str) {
      return str.toUpperCase();
    };
    const memoUpper = xo.memoize(upper);
    expect(memoUpper('foo')).toEqual(upper('foo'));
  });

  it('returns same value as non memoized fat arrow functions (single argument)', function() {
    const upper = (str) => str.toUpperCase();
    const memoUpper = xo.memoize(upper);
    expect(memoUpper('foo')).toEqual(upper('foo'));
  });

  it('returns same value as non memoized functions (multiple arguments)', function() {
    const id = function(str1, str2, str3) {
      const args = Array.prototype.slice.call(arguments);
      return args.join(', ');
    };
    const memoId = xo.memoize(id);
    expect(memoId('foo', 'bar', 'baz')).toEqual(id('foo', 'bar', 'baz'));
  });

  it('returns same value as non memoized fat arrow functions (multiple arguments)', function() {
    const id = (str1, str2, str3) => {
      const args = Array.prototype.slice.call(arguments);
      return args.join(', ');
    };
    const memoId = xo.memoize(id);
    expect(memoId('foo', 'bar', 'baz')).toEqual(id('foo', 'bar', 'baz'));
  });

  it('returns same value as non memoized functions (array argument)', function() {
    const testArg = ['foo', 'bar', 'baz'];
    const id = function(args) {
      return args.join(', ');
    };
    const memoId = xo.memoize(id);
    expect(memoId(testArg)).toEqual(id(testArg));
  });

  it('returns same value as non memoized functions (object argument)', function() {
    const testArg = { a: 'foo', b: { c:'bar', d: 'baz' }};
    const id = function(args) {
      return args.a + args.b.c + args.b.d;
    };
    const memoId = xo.memoize(id);
    expect(memoId(testArg)).toEqual(id(testArg));
  });

  it('returns cached value, doesn\'t run (expensive) function again', function() {
    const testArg = { a: 'foo', b: { c: 1, d: 'baz' }};
    let check = 0;
    const id = function(args) {
      check += 1;
      return args.b.c;
    };
    const memoId = xo.memoize(id);
    // Each time id() is invoked it will incremement check.
    // Using the memoized version we get the same return value as we would when invoking id()
    // but without invoking id() more than once (and incrementing check).
    let test = memoId(testArg);
    test = memoId(testArg);
    test = memoId(testArg);
    expect(test).toEqual(check);
  });

  it('returns cached value, doesn\'t run (expensive) function again unless arguments change', function() {
    let check = 0;
    const upper = function(args) {
      check += 1;
      return args.toUpperCase();
    };
    const memoUpper = xo.memoize(upper);
    let test1 = memoUpper('hello'); // check = 1
    test1 = memoUpper('hello'); // check = 1
    let test2 = memoUpper('world'); // check = 2
    test2 = memoUpper('world'); // check = 2
    test1 = memoUpper('hello'); // check = 2
    expect([test1, test2, check].join(' ')).toEqual('HELLO WORLD 2');
  });

});

describe('xo.flatten', function() {

  it('returns flattened array', function() {
    const test = [0, 1, [2, 3], [4, [5, 6]], 7, [8, [9]]];
    const result = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    expect(xo.flatten(test)).toEqual(result);
  });

});

describe('xo.compact', function() {

  it('returns array with falsy values removed', function() {
    const test = [1, undefined, false, 2, undefined, 3, false, 4, 5];
    const result = [1, 2, 3, 4, 5];
    expect(xo.compact(test)).toEqual(result);
  });

});

describe('xo.curry', function() {

  it('takes a function when initializing and an argument when invoking', function() {
    const greet = function(name) {
      return 'hi ' + name;
    };
    const hi = xo.curry(greet);
    expect(hi('Bob')).toEqual('hi Bob');
  });

  it('takes a fat arrow function when initializing and an argument when invoking', function() {
    const greet = (name) => 'hi ' + name;
    const hi = xo.curry(greet);
    expect(hi('Bob')).toEqual('hi Bob');
  });

  it('takes a fat arrow function and an argument when initializing and a final argument when invoking', function() {
    const greet = (greeting, name) => greeting + ' ' + name;
    const hi = xo.curry(greet, 'hi');
    expect(hi('Bob')).toEqual('hi Bob');
  });

  it('takes a function when initializing and multiple arguments when invoking', function() {
    const greet = function(greeting, name) {
      return greeting + ' ' + name;
    };
    const hi = xo.curry(greet);
    expect(hi('hi', 'Bob')).toEqual('hi Bob');
  });

  it('takes a fat arrow function when initializing and multiple arguments when invoking', function() {
    const greet = (greeting, name) => greeting + ' ' + name;
    const hi = xo.curry(greet);
    expect(hi('hi', 'Bob')).toEqual('hi Bob');
  });

  it('allows arguments to be applied one at a time or all at once', function() {
    const greet = (greeting, name) => greeting + ' ' + name;
    const hi = xo.curry(greet);
    expect(hi('hi', 'Bob')).toEqual(hi('hi')('Bob'));
  });

  it('allows arguments to be applied one at a time or all at once when there are many arguments', function() {
    const add5Things = (arg1, arg2, arg3, arg4, arg5) => arg1 + arg2 + arg3 + arg4 + arg5;
    expect(xo.curry(add5Things)(1, 2, 3, 4, 5)).toEqual(xo.curry(add5Things)(1)(2)(3)(4)(5));
  });

  it('takes a function when initializing an argument and context when invoking', function() {
    function Greet(greeting, name) {
      this.greeting = greeting;
      this.name = name;
    }
    Greet.prototype.speak = function() {
      return this.greeting + ' ' + this.name;
    };
    const Hi = xo.curry(Greet, 'hi');
    const hiBob = new Hi('Bob');
    expect(Greet.prototype.speak.call(hiBob)).toEqual('hi Bob');
  });

});

describe('xo.findIndex', function() {

  it('returns correct index of object where property is found', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    const objArr = [
      { name: 'a', id: '001' },
      { name: 'b', id: '002' },
      { name: 'c', id: '003' },
      { name: 'd', id: '004' }
    ];
    expect(xo.findIndex(objArr, xo.curry(compare, '003'))).toEqual(2);
  });

  it('returns -1 when no match is made', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    const objArr = [
      { name: 'a', id: '001' },
      { name: 'b', id: '002' },
      { name: 'c', id: '003' },
      { name: 'd', id: '004' }
    ];
    expect(xo.findIndex(objArr, xo.curry(compare, '005'))).toEqual(-1);
  });

  it('returns index of first occurence when multiple matches can be made', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    const objArr = [
      { name: 'a', id: '001' },
      { name: 'b', id: '003' },
      { name: 'c', id: '003' },
      { name: 'd', id: '003' }
    ];
    expect(xo.findIndex(objArr, xo.curry(compare, '003'))).toEqual(1);
  });

});

describe('xo.findKey', function() {

  it('returns correct key of object where property is found', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    const obj = {
      hello: { name: 'a', id: '001' },
      goodbye: { name: 'b', id: '002' },
      yes: { name: 'c', id: '003' },
      no: { name: 'd', id: '004' }
    };
    expect(xo.findKey(obj, xo.curry(compare, '003'))).toEqual('yes');
  });

  it('returns null when no match is made', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    const obj = {
      hello: { name: 'a', id: '001' },
      goodbye: { name: 'b', id: '002' },
      yes: { name: 'c', id: '003' },
      no: { name: 'd', id: '004' }
    };
    expect(xo.findKey(obj, xo.curry(compare, '005'))).toEqual(null);
  });

  it('returns key of first occurence when multiple matches can be made', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    const obj = {
      hello: { name: 'a', id: '001' },
      goodbye: { name: 'b', id: '003' },
      yes: { name: 'c', id: '003' },
      no: { name: 'd', id: '004' }
    };
    expect(xo.findKey(obj, xo.curry(compare, '003'))).toEqual('goodbye');
  });

});

describe('xo.find', function() {

  it('returns correct value of object where property is found', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    const obj = {
      hello: { name: 'a', id: '001' },
      goodbye: { name: 'b', id: '002' },
      yes: { name: 'c', id: '003' },
      no: { name: 'd', id: '004' }
    };
    expect(xo.find(obj, xo.curry(compare, '003'))).toEqual({ name: 'c', id: '003' });
  });

  it('returns null when no match is made', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    const obj = {
      hello: { name: 'a', id: '001' },
      goodbye: { name: 'b', id: '002' },
      yes: { name: 'c', id: '003' },
      no: { name: 'd', id: '004' }
    };
    expect(xo.find(obj, xo.curry(compare, '005'))).toEqual(null);
  });

  it('returns value of first occurence when multiple matches can be made', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    const obj = {
      hello: { name: 'a', id: '001' },
      goodbye: { name: 'b', id: '003' },
      yes: { name: 'c', id: '003' },
      no: { name: 'd', id: '004' }
    };
    expect(xo.find(obj, xo.curry(compare, '003'))).toEqual({ name: 'b', id: '003' });
  });

  it('returns correct value of array where value is found', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    const objArr = [
      { name: 'a', id: '001' },
      { name: 'b', id: '002' },
      { name: 'c', id: '003' },
      { name: 'd', id: '004' }
    ];
    expect(xo.find(objArr, xo.curry(compare, '003'))).toEqual({ name: 'c', id: '003' });
  });

  it('returns null when no match is made', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    const objArr = [
      { name: 'a', id: '001' },
      { name: 'b', id: '002' },
      { name: 'c', id: '003' },
      { name: 'd', id: '004' }
    ];
    expect(xo.find(objArr, xo.curry(compare, '005'))).toEqual(null);
  });

  it('returns value of first occurence when multiple matches can be made', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    const objArr = [
      { name: 'a', id: '001' },
      { name: 'b', id: '003' },
      { name: 'c', id: '003' },
      { name: 'd', id: '004' }
    ];
    expect(xo.find(objArr, xo.curry(compare, '003'))).toEqual({ name: 'b', id: '003' });
  });

});

describe('xo.filter', function() {

  it('returns array of objects where property is found', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    const objArr = [
      { name: 'a', id: '001' },
      { name: 'b', id: '003' },
      { name: 'c', id: '003' },
      { name: 'd', id: '004' }
    ];
    expect(xo.filter(objArr, xo.curry(compare, '003')).length).toEqual(2);
  });

  it('returns empty array when no match is made', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    const objArr = [
      { name: 'a', id: '001' },
      { name: 'b', id: '002' },
      { name: 'c', id: '003' },
      { name: 'd', id: '004' }
    ];
    expect(xo.filter(objArr, xo.curry(compare, '005'))).toEqual([]);
  });

});

describe('xo.isBoolean', function() {

  it('returns true for booleans', function() {
    const bool = false;
    expect(xo.isBoolean(bool)).toEqual(true);
  });

  it('returns false for non booleans', function() {
    const notBool = 'true';
    expect(xo.isBoolean(notBool)).toEqual(false);
  });

});

describe('xo.isNumber', function() {

  it('returns true for numbers', function() {
    const number = 3;
    expect(xo.isNumber(number)).toEqual(true);
  });

  it('returns false for non numbers', function() {
    const notNumber = '3';
    expect(xo.isNumber(notNumber)).toEqual(false);
  });

});

describe('xo.isString', function() {

  it('returns true for strings', function() {
    const string  = '42';
    expect(xo.isString(string)).toEqual(true);
  });

  it('returns false for non strings', function() {
    const notString = true;
    expect(xo.isString(notString)).toEqual(false);
  });

});

describe('xo.isObject', function() {

  it('returns true for objects', function() {
    const object = {a: '1', b: '2'};
    expect(xo.isObject(object)).toEqual(true);
  });

  it('returns false for non objects', function() {
    const notObject = true;
    expect(xo.isObject(notObject)).toEqual(false);
  });

});

describe('xo.isArray', function() {

  it('returns true for arrays', function() {
    const array = [1, 2, 3];
    expect(xo.isArray(array)).toEqual(true);
  });

  it('returns false for non arrays', function() {
    const notArray= true;
    expect(xo.isArray(notArray)).toEqual(false);
  });

});

describe('xo.isFunction', function() {

  it('returns true for functions', function() {
    const func = function() { return true; };
    expect(xo.isFunction(func)).toEqual(true);
  });

  it('returns true for 1 statement fat arrow functions', function() {
    const func = () => true;
    expect(xo.isFunction(func)).toEqual(true);
  });

  it('returns true for multi-statement fat arrow functions', function() {
    const func = () => { let x = 1; return x; };
    expect(xo.isFunction(func)).toEqual(true);
  });

  it('returns false for non functions', function() {
    const notFunction = true;
    expect(xo.isFunction(notFunction)).toEqual(false);
  });

});

describe('xo.maybe', function() {

  it('invokes a function if it has truthy arguments', function() {
    function sum(a, b) {
      return a + b;
    }
    const maybeSum = xo.maybe(sum);
    expect(xo.isNumber(maybeSum(2, 3))).toEqual(true);
  });

  it('invokes a fat arrow function if it has truthy arguments', function() {
    const sum = (a, b) => a + b;
    const maybeSum = xo.maybe(sum);
    expect(xo.isNumber(maybeSum(2, 3))).toEqual(true);
  });

  it('doesn\'t invoke a function if it has zero arguments', function() {
    function sum(a, b) {
      return a + b;
    }
    const maybeSum = xo.maybe(sum);
    expect(maybeSum()).toEqual(undefined);
  });

  it('doesn\'t invoke a fat arrow function if it has zero arguments', function() {
    const sum = (a, b) => a + b;
    const maybeSum = xo.maybe(sum);
    expect(maybeSum()).toEqual(undefined);
  });

  it('doesn\'t invoke a function if it has null arguments', function() {
    function sum(a, b) {
      return a + b;
    }
    const maybeSum = xo.maybe(sum);
    expect(maybeSum(null, 4)).toEqual(undefined);
  });

  it('doesn\'t invoke a fat arrow function if it has null arguments', function() {
    const sum = (a, b) => a + b;
    const maybeSum = xo.maybe(sum);
    expect(maybeSum(null, 4)).toEqual(undefined);
  });

  it('doesn\'t invoke a function if it has undefined arguments', function() {
    function sum(a, b) {
      return a + b;
    }
    const maybeSum = xo.maybe(sum);
    expect(maybeSum(4, undefined)).toEqual(undefined);
  });

  it('doesn\'t invoke a fat arrow function if it has undefined arguments', function() {
    const sum = (a, b) => a + b;
    const maybeSum = xo.maybe(sum);
    expect(maybeSum(4, undefined)).toEqual(undefined);
  });

});

describe('xo.compose', function() {

  it('invokes the composed functions in reverse order', function() {
    const increment = (a) => a + 1;
    const square = (a) => a * a;
    const squarePlusOne = xo.compose(increment, square);
    expect(squarePlusOne(3)).toEqual(10);
  });

  it('is associative', function() {
    const increment = (a) => a + 1;
    const square = (a) => a * a;
    const cube = (a) => a * a * a;
    expect(xo.compose(increment, square, cube)(3)).toEqual(xo.compose(xo.compose(increment, square), cube)(3));
  });

});

