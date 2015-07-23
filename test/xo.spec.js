'use strict';
if(typeof xo === 'undefined') {
  var xo = require('..');
}

describe('xo.VERSION', function() {

  it('returns correct version number', function() {
    expect(xo.VERSION).toBe('0.0.1');
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

describe('xo.compact', function(){

  it('returns array with falsy values removed', function() {
    var test = [1, , false, 2, , 3, false, 4, 5];
    var result = [1, 2, 3, 4, 5];
    expect(xo.compact(test)).toEqual(result);
  });

});

describe('xo.partial', function(){

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

