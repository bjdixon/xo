'use strict';
if(typeof xo === 'undefined') {
  var xo = require('..');
}

describe('xo.VERSION', function() {

  it('returns correct version number', function() {
    expect(xo.VERSION).toBe('2.0.0');
  });

});

describe('xo.noConflict', function() {

  var ox = xo.noConflict();

  it('can be assigned to another namespace', function() {
    expect(ox.hasOwnProperty('memoize')).toEqual(true);
  });

  it('alternate namespace version can coexist with xo assigned a different value', function() {
    var xo = { a: 1, b: 2 };
    expect(ox.hasOwnProperty('flatten')).toEqual(true);
    expect(xo).toEqual({ a: 1, b: 2 });
  });

});

describe('xo.memoize', function() {

  it('returns same value as non memoized functions (single argument)', function() {
    var upper = function(str) {
      return str.toUpperCase();
    };
    var memoUpper = xo.memoize(upper);
    expect(memoUpper('foo')).toEqual(upper('foo'));
  });

  it('returns same value as non memoized fat arrow functions (single argument)', function() {
    var upper = (str) => str.toUpperCase();
    var memoUpper = xo.memoize(upper);
    expect(memoUpper('foo')).toEqual(upper('foo'));
  });

  it('returns same value as non memoized functions (multiple arguments)', function() {
    var id = function(str1, str2, str3) {
      var args = Array.prototype.slice.call(arguments);
      return args.join(', ');
    };
    var memoId = xo.memoize(id);
    expect(memoId('foo', 'bar', 'baz')).toEqual(id('foo', 'bar', 'baz'));
  });

  it('returns same value as non memoized fat arrow functions (multiple arguments)', function() {
    var id = (str1, str2, str3) => {
      var args = Array.prototype.slice.call(arguments);
      return args.join(', ');
    };
    var memoId = xo.memoize(id);
    expect(memoId('foo', 'bar', 'baz')).toEqual(id('foo', 'bar', 'baz'));
  });

  it('returns same value as non memoized functions (array argument)', function() {
    var testArg = ['foo', 'bar', 'baz'];
    var id = function(args) {
      return args.join(', ');
    };
    var memoId = xo.memoize(id);
    expect(memoId(testArg)).toEqual(id(testArg));
  });

  it('returns same value as non memoized functions (object argument)', function() {
    var testArg = { a: 'foo', b: { c:'bar', d: 'baz' }};
    var id = function(args) {
      return args.a + args.b.c + args.b.d;
    };
    var memoId = xo.memoize(id);
    expect(memoId(testArg)).toEqual(id(testArg));
  });

  it('returns cached value, doesn\'t run (expensive) function again', function() {
    var testArg = { a: 'foo', b: { c: 1, d: 'baz' }};
    var check = 0;
    var id = function(args) {
      check += 1;
      return args.b.c;
    };
    var memoId = xo.memoize(id);
    // Each time id() is invoked it will incremement check.
    // Using the memoized version we get the same return value as we would when invoking id()
    // but without invoking id() more than once (and incrementing check).
    var test = memoId(testArg);
    test = memoId(testArg);
    test = memoId(testArg);
    expect(test).toEqual(check);
  });

  it('returns cached value, doesn\'t run (expensive) function again unless arguments change', function() {
    var check = 0;
    var upper = function(args) {
      check += 1;
      return args.toUpperCase();
    };
    var memoUpper = xo.memoize(upper);
    var test1 = memoUpper('hello'); // check = 1
    test1 = memoUpper('hello'); // check = 1
    var test2 = memoUpper('world'); // check = 2
    test2 = memoUpper('world'); // check = 2
    test1 = memoUpper('hello'); // check = 2
    expect([test1, test2, check].join(' ')).toEqual('HELLO WORLD 2');
  });

});

describe('xo.flatten', function() {

  it('returns flattened array', function() {
    var test = [0, 1, [2, 3], [4, [5, 6]], 7, [8, [9]]];
    var result = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    expect(xo.flatten(test)).toEqual(result);
  });

});

describe('xo.compact', function() {

  it('returns array with falsy values removed', function() {
    var test = [1, , false, 2, , 3, false, 4, 5];
    var result = [1, 2, 3, 4, 5];
    expect(xo.compact(test)).toEqual(result);
  });

});

describe('xo.partial', function() {

  it('takes a function when initializing and an argument when invoking', function() {
    var greet = function(name) {
      return 'hi ' + name;
    };
    var hi = xo.partial(greet);
    expect(hi('Bob')).toEqual('hi Bob');
  });

  it('takes a fat arrow function when initializing and an argument when invoking', function() {
    var greet = (name) => 'hi ' + name;
    var hi = xo.partial(greet);
    expect(hi('Bob')).toEqual('hi Bob');
  });

  it('takes a fat arrow function and an argument when initializing and a final argument when invoking', function() {
    var greet = (greeting, name) => greeting + ' ' + name;
    var hi = xo.partial(greet, 'hi');
    expect(hi('Bob')).toEqual('hi Bob');
  });

  it('takes a function when initializing and multiple arguments when invoking', function() {
    var greet = function(greeting, name) {
      return greeting + ' ' + name;
    };
    var hi = xo.partial(greet);
    expect(hi('hi', 'Bob')).toEqual('hi Bob');
  });

  it('takes a fat arrow function when initializing and multiple arguments when invoking', function() {
    var greet = (greeting, name) => greeting + ' ' + name;
    var hi = xo.partial(greet);
    expect(hi('hi', 'Bob')).toEqual('hi Bob');
  });

  it('takes a function when initializing an argument and context when invoking', function() {
    function Greet(greeting, name) {
      this.greeting = greeting;
      this.name = name;
    }
    Greet.prototype.speak = function() {
      return this.greeting + ' ' + this.name;
    };
    var Hi = xo.partial(Greet, 'hi');
    var hiBob = new Hi('Bob');
    expect(Greet.prototype.speak.call(hiBob)).toEqual('hi Bob');
  });

});

describe('xo.findIndex', function() {

  it('returns correct index of object where property is found', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    var objArr = [
      { name: 'a', id: '001' },
      { name: 'b', id: '002' },
      { name: 'c', id: '003' },
      { name: 'd', id: '004' }
    ];
    expect(xo.findIndex(objArr, xo.partial(compare, '003'))).toEqual(2);
  });

  it('returns -1 when no match is made', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    var objArr = [
      { name: 'a', id: '001' },
      { name: 'b', id: '002' },
      { name: 'c', id: '003' },
      { name: 'd', id: '004' }
    ];
    expect(xo.findIndex(objArr, xo.partial(compare, '005'))).toEqual(-1);
  });

  it('returns index of first occurence when multiple matches can be made', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    var objArr = [
      { name: 'a', id: '001' },
      { name: 'b', id: '003' },
      { name: 'c', id: '003' },
      { name: 'd', id: '003' }
    ];
    expect(xo.findIndex(objArr, xo.partial(compare, '003'))).toEqual(1);
  });

});

describe('xo.findKey', function() {

  it('returns correct key of object where property is found', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    var obj = {
      hello: { name: 'a', id: '001' },
      goodbye: { name: 'b', id: '002' },
      yes: { name: 'c', id: '003' },
      no: { name: 'd', id: '004' }
    };
    expect(xo.findKey(obj, xo.partial(compare, '003'))).toEqual('yes');
  });

  it('returns null when no match is made', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    var obj = {
      hello: { name: 'a', id: '001' },
      goodbye: { name: 'b', id: '002' },
      yes: { name: 'c', id: '003' },
      no: { name: 'd', id: '004' }
    };
    expect(xo.findKey(obj, xo.partial(compare, '005'))).toEqual(null);
  });

  it('returns key of first occurence when multiple matches can be made', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    var obj = {
      hello: { name: 'a', id: '001' },
      goodbye: { name: 'b', id: '003' },
      yes: { name: 'c', id: '003' },
      no: { name: 'd', id: '004' }
    };
    expect(xo.findKey(obj, xo.partial(compare, '003'))).toEqual('goodbye');
  });

});

describe('xo.find', function() {

  it('returns correct value of object where property is found', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    var obj = {
      hello: { name: 'a', id: '001' },
      goodbye: { name: 'b', id: '002' },
      yes: { name: 'c', id: '003' },
      no: { name: 'd', id: '004' }
    };
    expect(xo.find(obj, xo.partial(compare, '003'))).toEqual({ name: 'c', id: '003' });
  });

  it('returns null when no match is made', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    var obj = {
      hello: { name: 'a', id: '001' },
      goodbye: { name: 'b', id: '002' },
      yes: { name: 'c', id: '003' },
      no: { name: 'd', id: '004' }
    };
    expect(xo.find(obj, xo.partial(compare, '005'))).toEqual(null);
  });

  it('returns value of first occurence when multiple matches can be made', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    var obj = {
      hello: { name: 'a', id: '001' },
      goodbye: { name: 'b', id: '003' },
      yes: { name: 'c', id: '003' },
      no: { name: 'd', id: '004' }
    };
    expect(xo.find(obj, xo.partial(compare, '003'))).toEqual({ name: 'b', id: '003' });
  });

  it('returns correct value of array where value is found', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    var objArr = [
      { name: 'a', id: '001' },
      { name: 'b', id: '002' },
      { name: 'c', id: '003' },
      { name: 'd', id: '004' }
    ];
    expect(xo.find(objArr, xo.partial(compare, '003'))).toEqual({ name: 'c', id: '003' });
  });

  it('returns null when no match is made', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    var objArr = [
      { name: 'a', id: '001' },
      { name: 'b', id: '002' },
      { name: 'c', id: '003' },
      { name: 'd', id: '004' }
    ];
    expect(xo.find(objArr, xo.partial(compare, '005'))).toEqual(null);
  });

  it('returns value of first occurence when multiple matches can be made', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    var objArr = [
      { name: 'a', id: '001' },
      { name: 'b', id: '003' },
      { name: 'c', id: '003' },
      { name: 'd', id: '004' }
    ];
    expect(xo.find(objArr, xo.partial(compare, '003'))).toEqual({ name: 'b', id: '003' });
  });

});

describe('xo.filter', function() {

  it('returns array of objects where property is found', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    var objArr = [
      { name: 'a', id: '001' },
      { name: 'b', id: '003' },
      { name: 'c', id: '003' },
      { name: 'd', id: '004' }
    ];
    expect(xo.filter(objArr, xo.partial(compare, '003')).length).toEqual(2);
  });

  it('returns empty array when no match is made', function() {
    function compare(id, obj) {
      return id === obj.id;
    }
    var objArr = [
      { name: 'a', id: '001' },
      { name: 'b', id: '002' },
      { name: 'c', id: '003' },
      { name: 'd', id: '004' }
    ];
    expect(xo.filter(objArr, xo.partial(compare, '005'))).toEqual([]);
  });

});

describe('xo.isBoolean', function() {

  it('returns true for booleans', function() {
    var bool = false;
    expect(xo.isBoolean(bool)).toEqual(true);
  });

  it('returns false for non booleans', function() {
    var notBool = 'true';
    expect(xo.isBoolean(notBool)).toEqual(false);
  });

});

describe('xo.isNumber', function() {

  it('returns true for numbers', function() {
    var number = 3;
    expect(xo.isNumber(number)).toEqual(true);
  });

  it('returns false for non numbers', function() {
    var notNumber = '3';
    expect(xo.isNumber(notNumber)).toEqual(false);
  });

});

describe('xo.isString', function() {

  it('returns true for strings', function() {
    var string  = '42';
    expect(xo.isString(string)).toEqual(true);
  });

  it('returns false for non strings', function() {
    var notString = true;
    expect(xo.isString(notString)).toEqual(false);
  });

});

describe('xo.isObject', function() {

  it('returns true for objects', function() {
    var object = {a: '1', b: '2'};
    expect(xo.isObject(object)).toEqual(true);
  });

  it('returns false for non objects', function() {
    var notObject = true;
    expect(xo.isObject(notObject)).toEqual(false);
  });

});

describe('xo.isArray', function() {

  it('returns true for arrays', function() {
    var array = [1, 2, 3];
    expect(xo.isArray(array)).toEqual(true);
  });

  it('returns false for non arrays', function() {
    var notArray= true;
    expect(xo.isArray(notArray)).toEqual(false);
  });

});

describe('xo.isFunction', function() {

  it('returns true for functions', function() {
    var func = function() { return true; };
    expect(xo.isFunction(func)).toEqual(true);
  });

  it('returns true for 1 statement fat arrow functions', function() {
    var func = () => true;
    expect(xo.isFunction(func)).toEqual(true);
  });

  it('returns true for multi-statement fat arrow functions', function() {
    var func = () => { let x = 1; return true; };
    expect(xo.isFunction(func)).toEqual(true);
  });

  it('returns false for non functions', function() {
    var notFunction = true;
    expect(xo.isFunction(notFunction)).toEqual(false);
  });

});

describe('xo.maybe', function() {

  it('invokes a function if it has truthy arguments', function() {
    function sum(a, b) {
      return a + b;
    }
    var maybeSum = xo.maybe(sum);
    expect(xo.isNumber(maybeSum(2, 3))).toEqual(true);
  });

  it('doesn\'t invoke a function if it has zero arguments', function() {
    function sum(a, b) {
      return a + b;
    }
    var maybeSum = xo.maybe(sum);
    expect(maybeSum()).toEqual(undefined);
  });

  it('doesn\'t invoke a function if it has null arguments', function() {
    function sum(a, b) {
      return a + b;
    }
    var maybeSum = xo.maybe(sum);
    expect(maybeSum(null, 4)).toEqual(undefined);
  });

  it('doesn\'t invoke a function if it has undefined arguments', function() {
    function sum(a, b) {
      return a + b;
    }
    var maybeSum = xo.maybe(sum);
    expect(maybeSum(4, undefined)).toEqual(undefined);
  });

});

