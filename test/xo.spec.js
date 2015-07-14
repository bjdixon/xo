'use strict';
if(typeof xo === 'undefined') {
  var xo = require('..');
}

describe('xo.VERSION', function(){

  it('returns correct version number', function(){
    expect(xo.VERSION).toBe('0.0.1');
  });

});

describe('xo.memoize', function(){

  it('returns same value as non memoized functions (single argument)', function(){
    var upper = function(str) {
      return str.toUpperCase();
    };
    var memoUpper = xo.memoize(upper);
    expect(memoUpper('foo')).toEqual(upper('foo'));
  });

  it('returns same value as non memoized functions (multiple arguments)', function(){
    var id = function(str1, str2, str3) {
      var args = Array.prototype.slice.call(arguments);
      return args.join(', ');
    };
    var memoId = xo.memoize(id);
    expect(memoId('foo', 'bar', 'baz')).toEqual(id('foo', 'bar', 'baz'));
  });

  it('returns same value as non memoized functions (array argument)', function(){
    var id = function(args) {
      return args.join(', ');
    };
    var memoId = xo.memoize(id);
    expect(memoId(['foo', 'bar', 'baz'])).toEqual(id(['foo', 'bar', 'baz']));
  });

  it('returns same value as non memoized functions (object argument)', function(){
    var id = function(args) {
      return args.a + args.b.c + args.b.d;
    };
    var memoId = xo.memoize(id);
    expect(memoId({ a: 'foo', b: { c:'bar', d: 'baz' }})).toEqual(id({ a: 'foo', b: { c:'bar', d: 'baz' }}));
  });

});

describe('xo.flatten', function(){

  it('returns flattened array', function(){
    var a = [0, 1, [2, 3], [4, [5, 6]], 7, [8, [9]]];
    var b = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    expect(xo.flatten(a)).toEqual(b);
  });

});

