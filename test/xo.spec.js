'use strict';
if(typeof xo === 'undefined') {
  var xo = require('..');
}

describe('xo.VERSION', function() {

  it('returns correct version number', function() {
    expect(xo.VERSION).toBe('0.1.0');
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

  it('returns same value as non memoized functions (multiple arguments)', function() {
    var id = function(str1, str2, str3) {
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

  it('takes a function and an argument when initializing and a final argument when invoking', function() {
    var greet = function(greeting, name) {
      return greeting + ' ' + name;
    };
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
    var object  = {a: '1', b: '2'};
    expect(xo.isObject(object)).toEqual(true);
  });

  it('returns false for non objects', function() {
    var notObject = true;
    expect(xo.isObject(notObject)).toEqual(false);
  });

});

