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

});

